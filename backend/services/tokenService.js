// tokenService.js
// Service module for generating and verifying tokens (password reset, email verification, refresh, etc.)
// Handles secure token creation and validation using JWT and crypto.
// Used by controllers and other services for authentication flows.

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Generate a secure random token for password reset
 * @param {number} userId - User ID
 * @returns {string} Reset token (JWT)
 */
const generateResetToken = (userId) => {
  // Generate a random token for extra entropy
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Create a JWT with the reset token and user ID
  const token = jwt.sign(
    { 
      userId, 
      resetToken,
      type: 'password_reset' // Mark token type for validation
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '1h' } // 1 hour expiration
  );
  
  return token;
};

/**
 * Verify a reset token and extract user ID
 * @param {string} token - Reset token (JWT)
 * @returns {number|null} User ID if valid, null otherwise
 */
const verifyResetToken = (token) => {
  try {
    // Decode and verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Check if it's a password reset token
    if (decoded.type !== 'password_reset') {
      return null;
    }
    
    return decoded.userId;
  } catch (error) {
    // Log and return null on error
    console.error('Token verification error:', error);
    return null;
  }
};

/**
 * Generate an email verification token
 * @param {number} userId - User ID
 * @returns {string} Verification token (JWT)
 */
const generateEmailVerificationToken = (userId) => {
  // Generate a random token for extra entropy
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Create a JWT with the verification token and user ID
  const token = jwt.sign(
    { 
      userId, 
      verificationToken,
      type: 'email_verification' // Mark token type for validation
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '24h' } // 24 hour expiration
  );
  
  return token;
};

/**
 * Verify an email verification token
 * @param {string} token - Verification token (JWT)
 * @returns {number|null} User ID if valid, null otherwise
 */
const verifyEmailVerificationToken = (token) => {
  try {
    // Decode and verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Check if it's an email verification token
    if (decoded.type !== 'email_verification') {
      return null;
    }
    
    return decoded.userId;
  } catch (error) {
    // Log and return null on error
    console.error('Email verification token error:', error);
    return null;
  }
};

/**
 * Generate a refresh token for extending session
 * @param {number} userId - User ID
 * @returns {string} Refresh token (JWT)
 */
const generateRefreshToken = (userId) => {
  // Generate a random token for extra entropy
  const refreshToken = crypto.randomBytes(32).toString('hex');
  
  // Create a JWT with the refresh token and user ID
  const token = jwt.sign(
    { 
      userId, 
      refreshToken,
      type: 'refresh' // Mark token type for validation
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '7d' } // 7 days expiration
  );
  
  return token;
};

/**
 * Verify a refresh token
 * @param {string} token - Refresh token (JWT)
 * @returns {number|null} User ID if valid, null otherwise
 */
const verifyRefreshToken = (token) => {
  try {
    // Decode and verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Check if it's a refresh token
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    return decoded.userId;
  } catch (error) {
    // Log and return null on error
    console.error('Refresh token verification error:', error);
    return null;
  }
};

/**
 * Generate a new access token from refresh token
 * @param {string} refreshToken - Refresh token (JWT)
 * @returns {string|null} New access token or null if invalid
 */
const generateAccessTokenFromRefresh = (refreshToken) => {
  try {
    // Verify refresh token and extract user ID
    const userId = verifyRefreshToken(refreshToken);
    if (!userId) {
      return null;
    }
    
    // Generate new access token (JWT)
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );
    
    return accessToken;
  } catch (error) {
    // Log and return null on error
    console.error('Error generating access token from refresh:', error);
    return null;
  }
};

/**
 * Generate a simple random token (for other purposes)
 * @param {number} length - Token length (default: 32)
 * @returns {string} Random token (hex)
 */
const generateRandomToken = (length = 32) => {
  // Generate a random hex string of the specified length
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash a token for storage (if needed)
 * @param {string} token - Token to hash
 * @returns {string} Hashed token (SHA-256)
 */
const hashToken = (token) => {
  // Hash the token using SHA-256
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateResetToken,
  verifyResetToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateAccessTokenFromRefresh,
  generateRandomToken,
  hashToken
}; 