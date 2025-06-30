const { ContactUsSubmission, Setting } = require('../models');
const { validateContactSubmission } = require('../validators/contactValidator');
const { sendContactNotification } = require('../services/emailService');
const { Op } = require('sequelize');
const axios = require('axios');
const crypto = require('crypto');
const contactService = require('../services/contactService');

// Helper to decrypt settings value
function decrypt(text) {
  const key = Buffer.from(process.env.SETTINGS_ENCRYPT_KEY, 'hex');
  const iv = Buffer.from(text.slice(0, 32), 'hex');
  const encrypted = Buffer.from(text.slice(32), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

exports.submitContact = async (req, res) => {
  try {
    const result = await contactService.submitContact(req.body, req.headers);
    res.status(201).json(result);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ success: false, message: error.message, errors: error.details });
    } else {
      console.error('Contact submission error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, email, from, to, exportCsv } = req.query;
    const where = {};
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (from || to) {
      where.submittedAt = {};
      if (from) where.submittedAt[Op.gte] = new Date(from);
      if (to) where.submittedAt[Op.lte] = new Date(to);
    }
    const submissions = await ContactUsSubmission.findAndCountAll({
      where,
      order: [['submittedAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: +limit,
    });
    if (exportCsv === 'true') {
      // Export as CSV
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
    res.json({
      total: submissions.count,
      submissions: submissions.rows,
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getSubmissionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await ContactUsSubmission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    console.error('Get submission detail error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 