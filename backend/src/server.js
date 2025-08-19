import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createLogger, format, transports } from 'winston';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import institutionRoutes from './routes/institutions.js';
import recordRoutes from './routes/records.js';
import reportRoutes from './routes/reports.js';
import analyticsRoutes from './routes/analytics.js';
import aiRoutes from './routes/ai.js';
import notificationRoutes from './routes/notifications.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { validateRequest } from './middleware/validation.js';

// Import database connection
import { initializeDatabase } from './database/connection.js';

// Import AI services
import { initializeAIServices } from './services/ai/index.js';

// Import cron jobs
import { initializeCronJobs } from './services/cron/index.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configure Winston logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'veims-backend' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport for development
if (NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slow down responses
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: parseInt(process.env.SLOW_DOWN_DELAY_MS) || 500 // begin adding 500ms of delay per request above 50
});

// Apply rate limiting and speed limiting
app.use('/api/', limiter);
app.use('/api/', speedLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Static files
app.use('/uploads', express.static(join(__dirname, '../uploads')));
app.use('/public', express.static(join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
const apiPrefix = process.env.API_PREFIX || '/api';
const apiVersion = process.env.API_VERSION || 'v1';
const basePath = `${apiPrefix}/${apiVersion}`;

// Public routes (no authentication required)
app.use(`${basePath}/auth`, authRoutes);

// Protected routes (authentication required)
app.use(`${basePath}/users`, authMiddleware, userRoutes);
app.use(`${basePath}/institutions`, authMiddleware, institutionRoutes);
app.use(`${basePath}/records`, authMiddleware, recordRoutes);
app.use(`${basePath}/reports`, authMiddleware, reportRoutes);
app.use(`${basePath}/analytics`, authMiddleware, analyticsRoutes);
app.use(`${basePath}/ai`, authMiddleware, aiRoutes);
app.use(`${basePath}/notifications`, authMiddleware, notificationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Initialize AI services
    if (process.env.ENABLE_AI_FEATURES === 'true') {
      await initializeAIServices();
      logger.info('AI services initialized successfully');
    }

    // Initialize cron jobs
    if (process.env.ENABLE_AUDIT_LOGGING === 'true') {
      await initializeCronJobs();
      logger.info('Cron jobs initialized successfully');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 VEIMS Backend Server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${NODE_ENV}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}${basePath}`);
      
      if (process.env.ENABLE_AI_FEATURES === 'true') {
        logger.info('🤖 AI features enabled');
      }
      if (process.env.ENABLE_OCR_PROCESSING === 'true') {
        logger.info('📄 OCR processing enabled');
      }
      if (process.env.ENABLE_FRAUD_DETECTION === 'true') {
        logger.info('🕵️ Fraud detection enabled');
      }
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

export default app;
