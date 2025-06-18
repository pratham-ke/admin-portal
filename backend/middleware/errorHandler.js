/**
 * Centralized Error Handler Middleware
 * Provides consistent error responses across the application
 */

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Sequelize validation errors
 * @param {Error} err - Sequelize error
 * @returns {Object} Formatted error response
 */
const handleSequelizeValidationError = (err) => {
  const errors = Object.values(err.errors).map(val => val.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle Sequelize unique constraint errors
 * @param {Error} err - Sequelize error
 * @returns {Object} Formatted error response
 */
const handleSequelizeUniqueConstraintError = (err) => {
  const value = err.errors[0].value;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handle JWT errors
 * @param {Error} err - JWT error
 * @returns {Object} Formatted error response
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

/**
 * Handle JWT expiration errors
 * @param {Error} err - JWT expiration error
 * @returns {Object} Formatted error response
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

/**
 * Handle cast errors (invalid MongoDB ObjectId)
 * @param {Error} err - Cast error
 * @returns {Object} Formatted error response
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Main error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    error = handleSequelizeValidationError(err);
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    error = handleSequelizeUniqueConstraintError(err);
  }
  
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError(err);
  }
  
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError(err);
  }
  
  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  // Development error response (with stack trace)
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      status,
      error: error.message,
      stack: err.stack,
      ...(error.isOperational && { details: error })
    });
  } else {
    // Production error response (no stack trace)
    if (error.isOperational) {
      res.status(statusCode).json({
        success: false,
        status,
        message: error.message
      });
    } else {
      // Programming or unknown errors: don't leak error details
      console.error('ERROR 💥', error);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};

/**
 * Handle 404 errors for undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Async error wrapper to catch async errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  asyncHandler
}; 