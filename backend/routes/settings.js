const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

// Get notification emails
router.get('/emails', auth, settingsController.getNotificationEmails);
// Update notification emails
router.post('/emails', auth, adminAuth, settingsController.saveNotificationEmails);

module.exports = router; 