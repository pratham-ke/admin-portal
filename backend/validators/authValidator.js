// authValidator.js
// Joi validation schemas and functions for authentication-related data (signup, login, password reset, etc.).
// Used by authController.js and other backend modules to validate user input.

const Joi = require('joi');

/**
 * Validation schema for user signup
 * Enforces username, email, password, and confirmPassword rules
 */
const signupSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
});

/**
 * Validation schema for user login
 * Enforces email and password rules
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

/**
 * Validation schema for forgot password
 * Enforces email rule
 */
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
});

/**
 * Validation schema for reset password
 * Enforces token, password, and confirmPassword rules
 */
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset token is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
});

/**
 * Validation schema for change password
 * Enforces currentPassword, newPassword, and confirmPassword rules
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your new password'
    })
});

/**
 * Validation schema for update profile
 * Enforces username and email rules (optional)
 */
const updateProfileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .optional()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    })
});

/**
 * Validate signup data
 * @param {Object} data - Signup data
 * @returns {Object} Validation result
 */
const validateSignup = (data) => {
  return signupSchema.validate(data, { abortEarly: false });
};

/**
 * Validate login data
 * @param {Object} data - Login data
 * @returns {Object} Validation result
 */
const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false });
};

/**
 * Validate forgot password data
 * @param {Object} data - Forgot password data
 * @returns {Object} Validation result
 */
const validateForgotPassword = (data) => {
  return forgotPasswordSchema.validate(data, { abortEarly: false });
};

/**
 * Validate reset password data
 * @param {Object} data - Reset password data
 * @returns {Object} Validation result
 */
const validateResetPassword = (data) => {
  return resetPasswordSchema.validate(data, { abortEarly: false });
};

/**
 * Validate change password data
 * @param {Object} data - Change password data
 * @returns {Object} Validation result
 */
const validateChangePassword = (data) => {
  return changePasswordSchema.validate(data, { abortEarly: false });
};

/**
 * Validate update profile data
 * @param {Object} data - Update profile data
 * @returns {Object} Validation result
 */
const validateUpdateProfile = (data) => {
  return updateProfileSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateUpdateProfile
}; 