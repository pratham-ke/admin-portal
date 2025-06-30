const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const contactController = require('../controllers/contactController');

// Public contact form submission
router.post('/', contactController.submitContact);

// Admin: list, filter, export submissions
router.get('/submissions', auth, adminAuth, contactController.getSubmissions);

// Admin: detail view
router.get('/submissions/:id', auth, adminAuth, contactController.getSubmissionDetail);

module.exports = router; 