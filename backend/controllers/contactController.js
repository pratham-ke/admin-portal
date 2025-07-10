// contactController.js
// Controller for contact form-related routes in the backend of the admin portal.
// Handles receiving, validating, and processing contact form submissions.
// Used by routes/contact.js to process contact requests.

const { ContactUsSubmission, Setting } = require('../models');
const { validateContactSubmission } = require('../validators/contactValidator');
const { sendContactNotification } = require('../services/emailService');
const { Op } = require('sequelize');
const axios = require('axios');
const crypto = require('crypto');
const contactService = require('../services/contactService');

// Helper to decrypt settings value (used for encrypted settings)
function decrypt(text) {
  const key = Buffer.from(process.env.SETTINGS_ENCRYPT_KEY, 'hex');
  const iv = Buffer.from(text.slice(0, 32), 'hex');
  const encrypted = Buffer.from(text.slice(32), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Controller to handle contact form submission
exports.submitContact = async (req, res) => {
  try {
    // Pass req.ip as a custom header for fallback (used for logging or anti-spam)
    const result = await contactService.submitContact(req.body, { ...req.headers, 'req-ip': req.ip });
    res.status(201).json(result); // Respond with the result object
  } catch (error) {
    if (error.status) {
      // Handle known validation or business logic errors
      res.status(error.status).json({ success: false, message: error.message, errors: error.details });
    } else {
      // Log and handle unexpected errors
      console.error('Contact submission error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

// Controller to fetch paginated contact form submissions
exports.getSubmissions = async (req, res) => {
  try {
    // Extract query parameters for filtering and pagination
    const { page = 1, limit = 10, email, from, to, exportCsv } = req.query;
    const where = {};
    // Filter by email if provided
    if (email) where.email = { [Op.like]: `%${email}%` };
    // Filter by date range if provided
    if (from || to) {
      where.submittedAt = {};
      if (from) where.submittedAt[Op.gte] = new Date(from);
      if (to) where.submittedAt[Op.lte] = new Date(to);
    }
    // Fetch submissions with pagination and filters
    const submissions = await ContactUsSubmission.findAndCountAll({
      where,
      order: [['submittedAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: +limit,
    });
    if (exportCsv === 'true') {
      // Export as CSV if requested
      const csvRows = [
        'First Name,Last Name,Email,Phone,Message,Submitted At,IP Address',
        ...submissions.rows.map(s =>
          [s.firstName, s.lastName, s.email, s.phone, '"' + s.message.replace(/"/g, '""') + '"', s.submittedAt.toISOString(), s.ipAddress].join(',')
        ),
      ];
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="contact_submissions.csv"');
      return res.send(csvRows.join('\n'));
    }
    // Respond with paginated submissions
    res.json({
      total: submissions.count,
      submissions: submissions.rows,
    });
  } catch (error) {
    // Log and handle errors
    console.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Controller to fetch details of a single contact form submission by ID
exports.getSubmissionDetail = async (req, res) => {
  try {
    const { id } = req.params; // Extract submission ID from route params
    const submission = await ContactUsSubmission.findByPk(id);
    if (!submission) {
      // Handle not found
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    res.json(submission); // Respond with the submission object
  } catch (error) {
    // Log and handle errors
    console.error('Get submission detail error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 