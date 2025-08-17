import Tesseract from 'tesseract.js';
import { createLogger } from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = createLogger({
  level: 'info',
  format: require('winston').format.simple()
});

export class OCRService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
    this.supportedLanguages = ['eng', 'amh']; // English and Amharic
    this.defaultLanguage = 'eng';
  }

  async initialize() {
    try {
      logger.info('Initializing OCR service...');
      
      // Initialize Tesseract worker
      this.worker = await Tesseract.createWorker({
        logger: m => logger.debug(`OCR: ${m.status}`)
      });

      // Load languages
      await this.worker.loadLanguage(this.defaultLanguage);
      await this.worker.initialize(this.defaultLanguage);

      // Set worker parameters for better accuracy
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:!?()[]{}\'"-–—/\\|@#$%^&*+=<>~`',
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY
      });

      this.isInitialized = true;
      logger.info('OCR service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize OCR service:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      if (!this.isInitialized || !this.worker) {
        return false;
      }

      // Simple test with a basic image or text
      const testResult = await this.worker.recognize('test');
      return !!testResult;
    } catch (error) {
      logger.error('OCR health check failed:', error);
      return false;
    }
  }

  // Extract text from image file
  async extractTextFromImage(imagePath, options = {}) {
    try {
      if (!this.isInitialized) {
        throw new Error('OCR service not initialized');
      }

      const startTime = Date.now();
      
      // Validate file exists
      await fs.access(imagePath);
      
      // Set language if specified
      const language = options.language || this.defaultLanguage;
      if (language !== this.defaultLanguage) {
        await this.worker.loadLanguage(language);
        await this.worker.initialize(language);
      }

      // Perform OCR
      const result = await this.worker.recognize(imagePath, {
        rectangle: options.region || null, // Specific region to scan
        ...options
      });

      const processingTime = Date.now() - startTime;

      // Process and clean the extracted text
      const cleanedText = this.cleanExtractedText(result.data.text);

      // Analyze confidence scores
      const confidenceAnalysis = this.analyzeConfidence(result.data);

      return {
        success: true,
        text: cleanedText,
        confidence: result.data.confidence,
        confidenceAnalysis,
        processingTime,
        language,
        timestamp: new Date().toISOString(),
        metadata: {
          originalPath: imagePath,
          options,
          workerInfo: result.worker
        }
      };

    } catch (error) {
      logger.error('OCR text extraction failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Extract text from multiple images
  async extractTextFromMultipleImages(imagePaths, options = {}) {
    try {
      const results = [];
      
      for (const imagePath of imagePaths) {
        const result = await this.extractTextFromImage(imagePath, options);
        results.push({
          imagePath,
          ...result
        });
      }

      return {
        success: true,
        results,
        totalImages: imagePaths.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Multiple image OCR failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Extract text from specific regions of an image
  async extractTextFromRegions(imagePath, regions, options = {}) {
    try {
      if (!this.isInitialized) {
        throw new Error('OCR service not initialized');
      }

      const results = [];
      
      for (const region of regions) {
        const result = await this.worker.recognize(imagePath, {
          rectangle: region,
          ...options
        });

        const cleanedText = this.cleanExtractedText(result.data.text);
        
        results.push({
          region,
          text: cleanedText,
          confidence: result.data.confidence,
          confidenceAnalysis: this.analyzeConfidence(result.data)
        });
      }

      return {
        success: true,
        results,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Region-based OCR failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Extract structured data from forms
  async extractFormData(imagePath, formTemplate, options = {}) {
    try {
      if (!this.isInitialized) {
        throw new Error('OCR service not initialized');
      }

      const startTime = Date.now();
      
      // Extract text from the entire image first
      const fullTextResult = await this.extractTextFromImage(imagePath, options);
      
      if (!fullTextResult.success) {
        return fullTextResult;
      }

      // Extract data based on form template
      const extractedData = this.extractDataFromTemplate(
        fullTextResult.text, 
        formTemplate
      );

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        formData: extractedData,
        fullText: fullTextResult.text,
        confidence: fullTextResult.confidence,
        processingTime,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Form data extraction failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Clean and process extracted text
  cleanExtractedText(text) {
    if (!text) return '';

    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
  }

  // Analyze confidence scores from OCR results
  analyzeConfidence(ocrData) {
    const words = ocrData.words || [];
    const confidenceScores = words.map(word => word.confidence);
    
    if (confidenceScores.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        lowConfidenceWords: [],
        quality: 'unknown'
      };
    }

    const average = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
    const min = Math.min(...confidenceScores);
    const max = Math.max(...confidenceScores);
    
    // Find low confidence words
    const lowConfidenceWords = words
      .filter(word => word.confidence < 60)
      .map(word => ({
        text: word.text,
        confidence: word.confidence
      }));

    // Determine overall quality
    let quality = 'excellent';
    if (average < 80) quality = 'good';
    if (average < 60) quality = 'fair';
    if (average < 40) quality = 'poor';

    return {
      average: Math.round(average * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      lowConfidenceWords,
      quality,
      totalWords: words.length
    };
  }

  // Extract data based on form template
  extractDataFromTemplate(text, template) {
    const extractedData = {};
    
    for (const [fieldName, fieldConfig] of Object.entries(template)) {
      const { pattern, region, type } = fieldConfig;
      
      if (pattern) {
        // Use regex pattern to extract data
        const match = text.match(new RegExp(pattern, 'i'));
        if (match) {
          extractedData[fieldName] = match[1] || match[0];
        }
      } else if (region) {
        // Extract text from specific region (if available)
        // This would require additional processing
        extractedData[fieldName] = null;
      }
      
      // Apply type conversion
      if (extractedData[fieldName] && type) {
        extractedData[fieldName] = this.convertValueType(extractedData[fieldName], type);
      }
    }

    return extractedData;
  }

  // Convert extracted values to appropriate types
  convertValueType(value, type) {
    switch (type) {
      case 'number':
        return parseFloat(value) || 0;
      case 'integer':
        return parseInt(value) || 0;
      case 'date':
        return new Date(value);
      case 'boolean':
        return value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
      default:
        return value;
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Change language
  async changeLanguage(language) {
    try {
      if (!this.supportedLanguages.includes(language)) {
        throw new Error(`Language ${language} not supported`);
      }

      await this.worker.loadLanguage(language);
      await this.worker.initialize(language);
      this.defaultLanguage = language;
      
      logger.info(`OCR language changed to ${language}`);
      return true;
    } catch (error) {
      logger.error('Failed to change OCR language:', error);
      throw error;
    }
  }

  // Get service information
  getServiceInfo() {
    return {
      name: 'OCR Service',
      engine: 'Tesseract.js',
      languages: this.supportedLanguages,
      currentLanguage: this.defaultLanguage,
      status: this.isInitialized ? 'active' : 'inactive',
      version: Tesseract.version
    };
  }

  // Cleanup resources
  async cleanup() {
    try {
      if (this.worker) {
        await this.worker.terminate();
        this.worker = null;
        this.isInitialized = false;
        logger.info('OCR service cleaned up');
      }
    } catch (error) {
      logger.error('Error during OCR cleanup:', error);
    }
  }
}
