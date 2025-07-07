const express = require('express');
const router = express.Router();
const { 
  login, 
  getCurrentUser, 
  forgotPassword, 
  resetPassword, 
  logout 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', resetPassword);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', auth, logout);

// Serve public key for frontend encryption
router.get('/public-key', (req, res) => {
  const pubKeyPath = path.join(__dirname, '../config/public.pem');
  const pubKey = fs.readFileSync(pubKeyPath, 'utf8');
  res.type('text/plain').send(pubKey);
});

module.exports = router; 