const { ContactUsSubmission, Setting } = require('../models');
const { validateContactSubmission } = require('../validators/contactValidator');
const { sendContactNotification } = require('../services/emailService');
const { Op } = require('sequelize');
const axios = require('axios');
const crypto = require('crypto');

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
    // Validate input
    const { error } = validateContactSubmission(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.details.map(d => d.message) });
    }
    // Verify reCAPTCHA
    const { captchaToken } = req.body;
    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    const recaptchaRes = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`);
    if (!recaptchaRes.data.success) {
      return res.status(422).json({ success: false, message: 'reCAPTCHA verification failed' });
    }
    // Save submission
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { firstName, lastName, email, phone, message } = req.body;
    const submission = await ContactUsSubmission.create({
      firstName, lastName, email, phone, message, ipAddress,
      submittedAt: new Date(),
    });
    // Notify admins
    const setting = await Setting.findOne({ where: { key: 'notification_emails' } });
    let emails = [];
    if (setting) {
      const decrypted = decrypt(setting.value);
      emails = JSON.parse(decrypted);
    }
    await sendContactNotification(emails, submission);
    res.status(201).json({ success: true, message: 'Submission received' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
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