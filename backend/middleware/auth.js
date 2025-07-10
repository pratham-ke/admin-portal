// auth.js
// Middleware for authentication and authorization in the backend of the admin portal.
// Provides functions to protect routes, check admin access, and allow optional authentication.

const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to require authentication for protected routes
const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // No token provided
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    // Find user by decoded ID
    const user = await User.findByPk(decoded.id);

    if (!user) {
      // User not found
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user and token to request object
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    // Invalid or expired token
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Middleware to require admin role for certain routes
const adminAuth = async (req, res, next) => {
  try {
    // First, require authentication
    await auth(req, res, () => {
      // Check if user has admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Middleware for optional authentication (guest access allowed)
const authOptional = async (req, res, next) => {
  try {
    // Extract token if present
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return next(); // No token, proceed as guest
    }
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    // Find user by decoded ID
    const user = await User.findByPk(decoded.id);
    if (user) {
      req.user = user;
      req.token = token;
    }
    // If user not found, proceed as guest
    next();
  } catch (error) {
    // Invalid token, proceed as guest
    next();
  }
};

module.exports = { auth, adminAuth, authOptional }; 