import { createLogger } from 'winston';
import { OpenAIService } from './openai.js';
import { OCRService } from './ocr.js';
import { DocumentAnalysisService } from './documentAnalysis.js';
import { FraudDetectionService } from './fraudDetection.js';
import { ClassificationService } from './classification.js';
import { VerificationService } from './verification.js';

const logger = createLogger({
  level: 'info',
  format: require('winston').format.simple()
});

// AI Services instances
let openaiService = null;
let ocrService = null;
let documentAnalysisService = null;
let fraudDetectionService = null;
let classificationService = null;
let verificationService = null;

// Initialize all AI services
export async function initializeAIServices() {
  try {
    logger.info('Initializing AI services...');

    // Check if AI features are enabled
    if (process.env.ENABLE_AI_FEATURES !== 'true') {
      logger.info('AI features are disabled');
      return;
    }

    // Initialize OpenAI service
    if (process.env.OPENAI_API_KEY) {
      openaiService = new OpenAIService();
      await openaiService.initialize();
      logger.info('OpenAI service initialized');
    }

    // Initialize OCR service
    if (process.env.ENABLE_OCR_PROCESSING === 'true') {
      ocrService = new OCRService();
      await ocrService.initialize();
      logger.info('OCR service initialized');
    }

    // Initialize document analysis service
    if (process.env.ENABLE_DOCUMENT_ANALYSIS === 'true') {
      documentAnalysisService = new DocumentAnalysisService(openaiService);
      logger.info('Document analysis service initialized');
    }

    // Initialize fraud detection service
    if (process.env.ENABLE_FRAUD_DETECTION === 'true') {
      fraudDetectionService = new FraudDetectionService(openaiService);
      logger.info('Fraud detection service initialized');
    }

    // Initialize classification service
    if (process.env.ENABLE_AUTOMATIC_CLASSIFICATION === 'true') {
      classificationService = new ClassificationService(openaiService);
      logger.info('Classification service initialized');
    }

    // Initialize verification service
    verificationService = new VerificationService();
    logger.info('Verification service initialized');

    logger.info('All AI services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize AI services:', error);
    throw error;
  }
}

// Get service instances
export function getOpenAIService() {
  if (!openaiService) {
    throw new Error('OpenAI service not initialized');
  }
  return openaiService;
}

export function getOCRService() {
  if (!ocrService) {
    throw new Error('OCR service not initialized');
  }
  return ocrService;
}

export function getDocumentAnalysisService() {
  if (!documentAnalysisService) {
    throw new Error('Document analysis service not initialized');
  }
  return documentAnalysisService;
}

export function getFraudDetectionService() {
  if (!fraudDetectionService) {
    throw new Error('Fraud detection service not initialized');
  }
  return fraudDetectionService;
}

export function getClassificationService() {
  if (!classificationService) {
    throw new Error('Classification service not initialized');
  }
  return classificationService;
}

export function getVerificationService() {
  if (!verificationService) {
    throw new Error('Verification service not initialized');
  }
  return verificationService;
}

// Check if specific AI features are available
export function isAIFeatureEnabled(feature) {
  const featureFlags = {
    openai: !!openaiService,
    ocr: !!ocrService,
    documentAnalysis: !!documentAnalysisService,
    fraudDetection: !!fraudDetectionService,
    classification: !!classificationService,
    verification: !!verificationService
  };

  return featureFlags[feature] || false;
}

// Get AI service status
export function getAIServiceStatus() {
  return {
    openai: !!openaiService,
    ocr: !!ocrService,
    documentAnalysis: !!documentAnalysisService,
    fraudDetection: !!fraudDetectionService,
    classification: !!classificationService,
    verification: !!verificationService,
    overall: process.env.ENABLE_AI_FEATURES === 'true'
  };
}

// Health check for AI services
export async function checkAIServicesHealth() {
  const health = {
    status: 'healthy',
    services: {},
    timestamp: new Date().toISOString()
  };

  try {
    // Check OpenAI service
    if (openaiService) {
      try {
        await openaiService.healthCheck();
        health.services.openai = { status: 'healthy' };
      } catch (error) {
        health.services.openai = { status: 'unhealthy', error: error.message };
        health.status = 'degraded';
      }
    }

    // Check OCR service
    if (ocrService) {
      try {
        await ocrService.healthCheck();
        health.services.ocr = { status: 'healthy' };
      } catch (error) {
        health.services.ocr = { status: 'unhealthy', error: error.message };
        health.status = 'degraded';
      }
    }

    // Check other services
    health.services.documentAnalysis = { status: documentAnalysisService ? 'healthy' : 'disabled' };
    health.services.fraudDetection = { status: fraudDetectionService ? 'healthy' : 'disabled' };
    health.services.classification = { status: classificationService ? 'healthy' : 'disabled' };
    health.services.verification = { status: verificationService ? 'healthy' : 'disabled' };

  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
  }

  return health;
}

export default {
  initializeAIServices,
  getOpenAIService,
  getOCRService,
  getDocumentAnalysisService,
  getFraudDetectionService,
  getClassificationService,
  getVerificationService,
  isAIFeatureEnabled,
  getAIServiceStatus,
  checkAIServicesHealth
};
