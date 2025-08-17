import OpenAI from 'openai';
import { createLogger } from 'winston';

const logger = createLogger({
  level: 'info',
  format: require('winston').format.simple()
});

export class OpenAIService {
  constructor() {
    this.client = null;
    this.model = process.env.AI_MODEL_NAME || 'gpt-4';
    this.maxTokens = parseInt(process.env.AI_MAX_TOKENS) || 4000;
    this.temperature = parseFloat(process.env.AI_TEMPERATURE) || 0.7;
  }

  async initialize() {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not provided');
      }

      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      logger.info('OpenAI service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize OpenAI service:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      // Simple test call
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
        temperature: 0
      });

      return response.choices[0]?.message?.content ? true : false;
    } catch (error) {
      logger.error('OpenAI health check failed:', error);
      return false;
    }
  }

  // Document analysis and classification
  async analyzeDocument(documentText, documentType, context = {}) {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const prompt = this.buildDocumentAnalysisPrompt(documentText, documentType, context);
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert document analyzer for vital events registration. Analyze the provided document and extract relevant information accurately.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature
      });

      const analysis = response.choices[0]?.message?.content;
      return this.parseDocumentAnalysis(analysis, documentType);
    } catch (error) {
      logger.error('Document analysis failed:', error);
      throw error;
    }
  }

  // Fraud detection
  async detectFraud(documentData, recordData, context = {}) {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const prompt = this.buildFraudDetectionPrompt(documentData, recordData, context);
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a fraud detection expert for vital events registration. Analyze the provided data for potential fraud indicators and inconsistencies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.3 // Lower temperature for more consistent fraud detection
      });

      const fraudAnalysis = response.choices[0]?.message?.content;
      return this.parseFraudDetection(fraudAnalysis);
    } catch (error) {
      logger.error('Fraud detection failed:', error);
      throw error;
    }
  }

  // Automatic record classification
  async classifyRecord(documentData, context = {}) {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const prompt = this.buildClassificationPrompt(documentData, context);
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert classifier for vital events. Determine the type of event and relevant categories based on the document content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.2 // Lower temperature for more consistent classification
      });

      const classification = response.choices[0]?.message?.content;
      return this.parseClassification(classification);
    } catch (error) {
      logger.error('Record classification failed:', error);
      throw error;
    }
  }

  // Data validation and verification
  async validateData(data, dataType, context = {}) {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const prompt = this.buildValidationPrompt(data, dataType, context);
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a data validation expert for vital events registration. Validate the provided data for accuracy, completeness, and consistency.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.1 // Very low temperature for validation
      });

      const validation = response.choices[0]?.message?.content;
      return this.parseValidation(validation);
    } catch (error) {
      logger.error('Data validation failed:', error);
      throw error;
    }
  }

  // Build prompts for different AI tasks
  buildDocumentAnalysisPrompt(documentText, documentType, context) {
    return `
      Document Type: ${documentType}
      Context: ${JSON.stringify(context)}
      
      Please analyze the following document and extract relevant information:
      
      ${documentText}
      
      Provide your analysis in the following JSON format:
      {
        "extracted_data": {
          "names": [],
          "dates": [],
          "locations": [],
          "numbers": [],
          "other_relevant_info": {}
        },
        "confidence": 0.95,
        "quality_score": 0.9,
        "notes": "",
        "recommendations": []
      }
    `;
  }

  buildFraudDetectionPrompt(documentData, recordData, context) {
    return `
      Context: ${JSON.stringify(context)}
      
      Document Data: ${JSON.stringify(documentData)}
      Record Data: ${JSON.stringify(recordData)}
      
      Analyze this data for potential fraud indicators:
      - Inconsistencies between document and record data
      - Suspicious patterns or anomalies
      - Missing or incomplete information
      - Unusual timing or location data
      
      Provide your analysis in the following JSON format:
      {
        "fraud_risk_level": "low|medium|high",
        "fraud_indicators": [],
        "inconsistencies": [],
        "confidence": 0.95,
        "recommendations": [],
        "requires_review": false
      }
    `;
  }

  buildClassificationPrompt(documentData, context) {
    return `
      Context: ${JSON.stringify(context)}
      
      Document Data: ${JSON.stringify(documentData)}
      
      Classify this document and determine:
      - Event type (birth, death, marriage, divorce, adoption)
      - Relevant categories and subcategories
      - Priority level
      - Required processing steps
      
      Provide your classification in the following JSON format:
      {
        "event_type": "birth|death|marriage|divorce|adoption",
        "categories": [],
        "priority": "low|medium|high|urgent",
        "processing_steps": [],
        "confidence": 0.95
      }
    `;
  }

  buildValidationPrompt(data, dataType, context) {
    return `
      Data Type: ${dataType}
      Context: ${JSON.stringify(context)}
      
      Data to Validate: ${JSON.stringify(data)}
      
      Validate this data for:
      - Completeness
      - Accuracy
      - Consistency
      - Format compliance
      - Business logic validation
      
      Provide your validation in the following JSON format:
      {
        "is_valid": true,
        "validation_errors": [],
        "warnings": [],
        "completeness_score": 0.95,
        "accuracy_score": 0.9,
        "recommendations": []
      }
    `;
  }

  // Parse AI responses
  parseDocumentAnalysis(analysis, documentType) {
    try {
      const parsed = JSON.parse(analysis);
      return {
        success: true,
        data: parsed,
        documentType,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to parse document analysis:', error);
      return {
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: analysis,
        timestamp: new Date().toISOString()
      };
    }
  }

  parseFraudDetection(fraudAnalysis) {
    try {
      const parsed = JSON.parse(fraudAnalysis);
      return {
        success: true,
        data: parsed,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to parse fraud detection:', error);
      return {
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: fraudAnalysis,
        timestamp: new Date().toISOString()
      };
    }
  }

  parseClassification(classification) {
    try {
      const parsed = JSON.parse(classification);
      return {
        success: true,
        data: parsed,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to parse classification:', error);
      return {
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: classification,
        timestamp: new Date().toISOString()
      };
    }
  }

  parseValidation(validation) {
    try {
      const parsed = JSON.parse(validation);
      return {
        success: true,
        data: parsed,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to parse validation:', error);
      return {
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: validation,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get service information
  getServiceInfo() {
    return {
      name: 'OpenAI',
      model: this.model,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
      status: this.client ? 'active' : 'inactive'
    };
  }
}
