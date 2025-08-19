import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createLogger } from 'winston';
import { db } from '../database/connection.js';

const logger = createLogger({
  level: 'info',
  format: require('winston').format.simple()
});

// Authentication middleware
export const authMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await db('users')
      .where('id', decoded.userId)
      .where('is_active', true)
      .first();

    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid or expired token'
      });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      indexNumber: user.index_number,
      institutionName: user.institution_name,
      institutionId: user.institution_id
    };

    // Log authentication
    logger.info(`User ${user.email} authenticated successfully`, {
      userId: user.id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please provide a valid token'
      });
    }

    return res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error'
    });
  }
};

// Role-based access control middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    
    if (Array.isArray(roles)) {
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          error: 'Access denied',
          message: `Insufficient permissions. Required roles: ${roles.join(', ')}`
        });
      }
    } else {
      if (userRole !== roles) {
        return res.status(403).json({
          error: 'Access denied',
          message: `Insufficient permissions. Required role: ${roles}`
        });
      }
    }

    next();
  };
};

// Admin-only middleware
export const requireAdmin = (req, res, next) => {
  return requireRole('admin')(req, res, next);
};

// Registrar-only middleware
export const requireRegistrar = (req, res, next) => {
  return requireRole(['registrar', 'admin'])(req, res, next);
};

// Office manager middleware
export const requireOfficeManager = (req, res, next) => {
  return requireRole(['office_manager', 'admin'])(req, res, next);
};

// Institution-specific middleware
export const requireInstitutionAccess = (institutionIdField = 'institutionId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Access denied',
          message: 'Authentication required'
        });
      }

      // Admins have access to all institutions
      if (req.user.role === 'admin') {
        return next();
      }

      const requestedInstitutionId = req.params[institutionIdField] || req.body[institutionIdField];
      
      if (!requestedInstitutionId) {
        return res.status(400).json({
          error: 'Bad request',
          message: 'Institution ID required'
        });
      }

      // Check if user has access to the requested institution
      if (req.user.institutionId !== requestedInstitutionId) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You can only access records from your own institution'
        });
      }

      next();
    } catch (error) {
      logger.error('Institution access check failed:', error);
      return res.status(500).json({
        error: 'Access check failed',
        message: 'Internal server error'
      });
    }
  };
};

// Record ownership middleware
export const requireRecordAccess = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Access denied',
          message: 'Authentication required'
        });
      }

      const recordId = req.params.id || req.params.recordId;
      
      if (!recordId) {
        return res.status(400).json({
          error: 'Bad request',
          message: 'Record ID required'
        });
      }

      // Get record details
      const record = await db('records')
        .where('id', recordId)
        .first();

      if (!record) {
        return res.status(404).json({
          error: 'Record not found',
          message: 'The requested record does not exist'
        });
      }

      // Admins have access to all records
      if (req.user.role === 'admin') {
        req.record = record;
        return next();
      }

      // Check if user is the registrar who created the record
      if (req.user.id === record.registrar_id) {
        req.record = record;
        return next();
      }

      // Check if user has access to the institution
      if (req.user.institutionId === record.institution_id) {
        req.record = record;
        return next();
      }

      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have access to this record'
      });

    } catch (error) {
      logger.error('Record access check failed:', error);
      return res.status(500).json({
        error: 'Access check failed',
        message: 'Internal server error'
      });
    }
  };
};

// Extract token from request
function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.substring(7);
  }
  
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  if (req.query.token) {
    return req.query.token;
  }
  
  return null;
}

// Generate JWT token
export const generateToken = (userId, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting for authentication attempts
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later'
  },
  skipSuccessfulRequests: true
};

export default {
  authMiddleware,
  requireRole,
  requireAdmin,
  requireRegistrar,
  requireOfficeManager,
  requireInstitutionAccess,
  requireRecordAccess,
  generateToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  validatePassword,
  authRateLimit
};
