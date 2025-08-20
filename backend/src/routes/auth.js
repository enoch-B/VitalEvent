import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { createLogger } from 'winston';
import { db } from '../database/connection.js';
import { 
  generateToken, 
  generateRefreshToken, 
  hashPassword, 
  comparePassword, 
  validatePassword,
  authRateLimit 
} from '../middleware/auth.js';

const router = express.Router();
const logger = createLogger({
  level: 'info',
  format: require('winston').format.simple()
});

// Apply rate limiting to all auth routes
router.use(rateLimit(authRateLimit));

// User registration
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('role').isIn(['registrar', 'office_manager', 'health_institution', 'court', 'religious_institution', 'admin']).withMessage('Invalid role'),
  body('institutionName').optional().trim().isLength({ min: 2, max: 255 }),
  body('phoneNumber').optional().isMobilePhone().withMessage('Must be a valid phone number')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      name, 
      email, 
      password, 
      role, 
      institutionName, 
      phoneNumber,
      indexNumber,
      department,
      position
    } = req.body;

    // Check if user already exists
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password does not meet security requirements',
        details: passwordValidation.errors
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [userId] = await db('users').insert({
      name,
      email,
      password_hash: passwordHash,
      role,
      institution_name: institutionName,
      phone_number: phoneNumber,
      index_number: indexNumber,
      department,
      position,
      is_active: true,
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Get created user (without password)
    const newUser = await db('users')
      .where('id', userId)
      .select('id', 'name', 'email', 'role', 'institution_name', 'index_number', 'created_at')
      .first();

    // Generate tokens
    const token = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);

    logger.info(`New user registered: ${email}`, {
      userId,
      role,
      institutionName
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token,
      refreshToken
    });

  } catch (error) {
    logger.error('User registration failed:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error'
    });
  }
});

// User login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await db('users')
      .where('email', email)
      .where('is_active', true)
      .first();

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await db('users')
      .where('id', user.id)
      .update({ 
        last_login: new Date(),
        updated_at: new Date()
      });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Remove password from user object
    const { password_hash, ...userWithoutPassword } = user;

    logger.info(`User logged in: ${email}`, {
      userId: user.id,
      role: user.role,
      ip: req.ip
    });

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      refreshToken
    });

  } catch (error) {
    logger.error('User login failed:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
});

// Refresh token
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required')
], async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Invalid refresh token'
      });
    }

    // Check if user still exists and is active
    const user = await db('users')
      .where('id', decoded.userId)
      .where('is_active', true)
      .first();

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'User no longer exists or is inactive'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    logger.error('Token refresh failed:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Invalid refresh token'
      });
    }

    res.status(500).json({
      error: 'Token refresh failed',
      message: 'Internal server error'
    });
  }
});

// Change password
router.post('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
], async (req, res) => {
  try {
    // This route should be protected by authMiddleware
    // For now, we'll require email to identify the user
    const { email, currentPassword, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Email is required'
      });
    }

    // Find user
    const user = await db('users')
      .where('email', email)
      .where('is_active', true)
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'New password does not meet security requirements',
        details: passwordValidation.errors
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db('users')
      .where('id', user.id)
      .update({
        password_hash: newPasswordHash,
        password_changed_at: new Date(),
        updated_at: new Date()
      });

    logger.info(`Password changed for user: ${email}`, {
      userId: user.id
    });

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Password change failed:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: 'Internal server error'
    });
  }
});

// Forgot password (send reset email)
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address')
], async (req, res) => {
  try {
    const { email } = req.body;

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if user exists
    const user = await db('users')
      .where('email', email)
      .where('is_active', true)
      .first();

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (in a real app, this would be sent via email)
    const resetToken = generateToken(user.id, '1h');

    logger.info(`Password reset requested for user: ${email}`, {
      userId: user.id
    });

    // In a real application, send email here
    // For now, just return success message
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    logger.error('Forgot password failed:', error);
    res.status(500).json({
      error: 'Password reset failed',
      message: 'Internal server error'
    });
  }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
], async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await db('users')
      .where('id', decoded.userId)
      .where('is_active', true)
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'New password does not meet security requirements',
        details: passwordValidation.errors
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db('users')
      .where('id', user.id)
      .update({
        password_hash: newPasswordHash,
        password_changed_at: new Date(),
        updated_at: new Date()
      });

    logger.info(`Password reset for user: ${user.email}`, {
      userId: user.id
    });

    res.json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    logger.error('Password reset failed:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Reset token has expired. Please request a new one.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Invalid reset token'
      });
    }

    res.status(500).json({
      error: 'Password reset failed',
      message: 'Internal server error'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, just return success message
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error('Logout failed:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // This route should be protected by authMiddleware
    // For now, we'll require email to identify the user
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Email is required'
      });
    }




    // Find user
    const user = await db('users')
      .where('email', email)
      .where('is_active', true)
      .select('id', 'name', 'email', 'role', 'institution_name', 'index_number', 'department', 'position', 'created_at', 'last_login')
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    res.json({
      user
    });

  } catch (error) {
    logger.error('Get profile failed:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Internal server error'
    });
  }
});

export default router;
