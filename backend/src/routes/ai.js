import express from 'express';
import multer from 'multer';
import { createLogger } from 'winston';
import { db } from '../database/connection.js';
import { 
  getOpenAIService, 
  getOCRService, 
  getDocumentAnalysisService,
  getFraudDetectionService,
  getClassificationService,
  getVerificationService,
  isAIFeatureEnabled
} from '../services/ai/index.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();
const logger = createLogger({
  level: 'info',
  format: require('winston').format.simple()
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '').split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Get AI service status
router.get('/status', async (req, res) => {
  try {
    const status = {
      openai: isAIFeatureEnabled('openai'),
      ocr: isAIFeatureEnabled('ocr'),
      documentAnalysis: isAIFeatureEnabled('documentAnalysis'),
      fraudDetection: isAIFeatureEnabled('fraudDetection'),
      classification: isAIFeatureEnabled('classification'),
      verification: isAIFeatureEnabled('verification'),
      overall: process.env.ENABLE_AI_FEATURES === 'true'
    };

    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get AI status:', error);
    res.status(500).json({
      error: 'Failed to get AI status',
      message: error.message
    });
  }
});

// Document OCR processing
router.post('/ocr', upload.single('document'), async (req, res) => {
  try {
    if (!isAIFeatureEnabled('ocr')) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'OCR service is not enabled'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'No document file provided'
      });
    }

    const { language, regions } = req.body;
    const ocrService = getOCRService();

    let result;
    if (regions && JSON.parse(regions)) {
      // Extract text from specific regions
      result = await ocrService.extractTextFromRegions(
        req.file.path,
        JSON.parse(regions),
        { language }
      );
    } else {
      // Extract text from entire document
      result = await ocrService.extractTextFromImage(
        req.file.path,
        { language }
      );
    }

    if (!result.success) {
      return res.status(500).json({
        error: 'OCR processing failed',
        message: result.error
      });
    }

    // Store OCR result in database if record ID is provided
    if (req.body.recordId) {
      await db('ai_analyses').insert({
        record_id: req.body.recordId,
        analysis_type: 'ocr',
        model_used: 'tesseract',
        input_data: { filePath: req.file.path, options: { language, regions } },
        output_data: result,
        confidence: result.confidence || 0,
        status: 'completed',
        processing_time_ms: result.processingTime || 0,
        created_at: new Date()
      });
    }

    res.json({
      success: true,
      result,
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    logger.error('OCR processing failed:', error);
    res.status(500).json({
      error: 'OCR processing failed',
      message: error.message
    });
  }
});

// Document analysis using AI
router.post('/analyze', upload.single('document'), async (req, res) => {
  try {
    if (!isAIFeatureEnabled('documentAnalysis')) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Document analysis service is not enabled'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'No document file provided'
      });
    }

    const { documentType, context, recordId } = req.body;
    const openaiService = getOpenAIService();

    // First, extract text using OCR if it's an image
    let documentText = '';
    if (req.file.mimetype.startsWith('image/')) {
      const ocrService = getOCRService();
      const ocrResult = await ocrService.extractTextFromImage(req.file.path);
      if (ocrResult.success) {
        documentText = ocrResult.text;
      } else {
        return res.status(500).json({
          error: 'OCR failed',
          message: 'Could not extract text from image'
        });
      }
    } else {
      // For text-based documents, read the file content
      const fs = await import('fs/promises');
      documentText = await fs.readFile(req.file.path, 'utf-8');
    }

    // Analyze document using AI
    const analysis = await openaiService.analyzeDocument(
      documentText,
      documentType || 'general',
      context ? JSON.parse(context) : {}
    );

    if (!analysis.success) {
      return res.status(500).json({
        error: 'Document analysis failed',
        message: analysis.error
      });
    }

    // Store analysis result in database if record ID is provided
    if (recordId) {
      await db('ai_analyses').insert({
        record_id: recordId,
        analysis_type: 'document_analysis',
        model_used: 'openai',
        input_data: { 
          filePath: req.file.path, 
          documentType, 
          context: context ? JSON.parse(context) : {} 
        },
        output_data: analysis,
        confidence: analysis.data?.confidence || 0,
        status: 'completed',
        created_at: new Date()
      });
    }

    res.json({
      success: true,
      analysis,
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    logger.error('Document analysis failed:', error);
    res.status(500).json({
      error: 'Document analysis failed',
      message: error.message
    });
  }
});

// Fraud detection
router.post('/fraud-detection', async (req, res) => {
  try {
    if (!isAIFeatureEnabled('fraudDetection')) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Fraud detection service is not enabled'
      });
    }

    const { documentData, recordData, context, recordId } = req.body;

    if (!documentData || !recordData) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Document data and record data are required'
      });
    }

    const openaiService = getOpenAIService();
    const fraudAnalysis = await openaiService.detectFraud(
      documentData,
      recordData,
      context || {}
    );

    if (!fraudAnalysis.success) {
      return res.status(500).json({
        error: 'Fraud detection failed',
        message: fraudAnalysis.error
      });
    }

    // Store fraud detection result in database if record ID is provided
    if (recordId) {
      await db('ai_analyses').insert({
        record_id: recordId,
        analysis_type: 'fraud_detection',
        model_used: 'openai',
        input_data: { documentData, recordData, context },
        output_data: fraudAnalysis,
        confidence: fraudAnalysis.data?.confidence || 0,
        status: 'completed',
        created_at: new Date()
      });
    }

    res.json({
      success: true,
      fraudAnalysis
    });

  } catch (error) {
    logger.error('Fraud detection failed:', error);
    res.status(500).json({
      error: 'Fraud detection failed',
      message: error.message
    });
  }
});

// Automatic record classification
router.post('/classify', async (req, res) => {
  try {
    if (!isAIFeatureEnabled('classification')) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Classification service is not enabled'
      });
    }

    const { documentData, context, recordId } = req.body;

    if (!documentData) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Document data is required'
      });
    }

    const openaiService = getOpenAIService();
    const classification = await openaiService.classifyRecord(
      documentData,
      context || {}
    );

    if (!classification.success) {
      return res.status(500).json({
        error: 'Classification failed',
        message: classification.error
      });
    }

    // Store classification result in database if record ID is provided
    if (recordId) {
      await db('ai_analyses').insert({
        record_id: recordId,
        analysis_type: 'classification',
        model_used: 'openai',
        input_data: { documentData, context },
        output_data: classification,
        confidence: classification.data?.confidence || 0,
        status: 'completed',
        created_at: new Date()
      });
    }

    res.json({
      success: true,
      classification
    });

  } catch (error) {
    logger.error('Classification failed:', error);
    res.status(500).json({
      error: 'Classification failed',
      message: error.message
    });
  }
});

// Data validation
router.post('/validate', async (req, res) => {
  try {
    if (!isAIFeatureEnabled('openai')) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'AI validation service is not enabled'
      });
    }

    const { data, dataType, context, recordId } = req.body;

    if (!data || !dataType) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Data and data type are required'
      });
    }

    const openaiService = getOpenAIService();
    const validation = await openaiService.validateData(
      data,
      dataType,
      context || {}
    );

    if (!validation.success) {
      return res.status(500).json({
        error: 'Validation failed',
        message: validation.error
      });
    }

    // Store validation result in database if record ID is provided
    if (recordId) {
      await db('ai_analyses').insert({
        record_id: recordId,
        analysis_type: 'validation',
        model_used: 'openai',
        input_data: { data, dataType, context },
        output_data: validation,
        confidence: validation.data?.accuracy_score || 0,
        status: 'completed',
        created_at: new Date()
      });
    }

    res.json({
      success: true,
      validation
    });

  } catch (error) {
    logger.error('Data validation failed:', error);
    res.status(500).json({
      error: 'Data validation failed',
      message: error.message
    });
  }
});

// Batch processing for multiple documents
router.post('/batch-process', upload.array('documents', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'No documents provided'
      });
    }

    const { processType, options } = req.body;
    const results = [];

    for (const file of req.files) {
      try {
        let result;
        
        switch (processType) {
          case 'ocr':
            if (isAIFeatureEnabled('ocr')) {
              const ocrService = getOCRService();
              result = await ocrService.extractTextFromImage(file.path, options ? JSON.parse(options) : {});
            }
            break;
          
          case 'analysis':
            if (isAIFeatureEnabled('documentAnalysis')) {
              // Process analysis for each file
              const openaiService = getOpenAIService();
              const fs = await import('fs/promises');
              const documentText = await fs.readFile(file.path, 'utf-8');
              result = await openaiService.analyzeDocument(documentText, 'general', {});
            }
            break;
          
          default:
            result = { success: false, error: 'Unknown process type' };
        }

        results.push({
          filename: file.originalname,
          success: result?.success || false,
          result: result || { error: 'Processing failed' }
        });

      } catch (error) {
        results.push({
          filename: file.originalname,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      results,
      totalFiles: req.files.length,
      processType
    });

  } catch (error) {
    logger.error('Batch processing failed:', error);
    res.status(500).json({
      error: 'Batch processing failed',
      message: error.message
    });
  }
});

// Get AI analysis history for a record
router.get('/history/:recordId', async (req, res) => {
  try {
    const { recordId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const analyses = await db('ai_analyses')
      .where('record_id', recordId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('ai_analyses')
      .where('record_id', recordId)
      .count('* as count')
      .first();

    res.json({
      success: true,
      analyses,
      pagination: {
        total: total.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    logger.error('Failed to get AI history:', error);
    res.status(500).json({
      error: 'Failed to get AI history',
      message: error.message
    });
  }
});

// Health check for AI services
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      services: {},
      timestamp: new Date().toISOString()
    };

    // Check OpenAI service
    if (isAIFeatureEnabled('openai')) {
      try {
        const openaiService = getOpenAIService();
        const isHealthy = await openaiService.healthCheck();
        health.services.openai = { status: isHealthy ? 'healthy' : 'unhealthy' };
        if (!isHealthy) health.status = 'degraded';
      } catch (error) {
        health.services.openai = { status: 'unhealthy', error: error.message };
        health.status = 'degraded';
      }
    }

    // Check OCR service
    if (isAIFeatureEnabled('ocr')) {
      try {
        const ocrService = getOCRService();
        const isHealthy = await ocrService.healthCheck();
        health.services.ocr = { status: isHealthy ? 'healthy' : 'unhealthy' };
        if (!isHealthy) health.status = 'degraded';
      } catch (error) {
        health.services.ocr = { status: 'unhealthy', error: error.message };
        health.status = 'degraded';
      }
    }

    res.json(health);

  } catch (error) {
    logger.error('AI health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
