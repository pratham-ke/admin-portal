const { ContactUsSubmission, Setting } = require('../models');
const { validateContactSubmission } = require('../validators/contactValidator');
const { sendContactNotification } = require('./emailService');
const { decrypt } = require('../utils/crypto');
const axios = require('axios');

async function submitContact(body, headers) {
  // Validate input
  const { error } = validateContactSubmission(body);
  if (error) {
    const err = new Error('Validation error');
    err.status = 400;
    err.details = error.details.map(d => d.message);
    throw err;
  }
  // Verify reCAPTCHA
  const { captchaToken } = body;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET;
  const recaptchaRes = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`);
  if (!recaptchaRes.data.success) {
    const err = new Error('reCAPTCHA verification failed');
    err.status = 422;
    throw err;
  }
  // Save submission
  const ipAddress = headers['x-forwarded-for'] || headers['x-real-ip'] || headers['x-client-ip'] || headers['x-forwarded'] || headers['forwarded-for'] || headers['forwarded'] || headers['remote_addr'] || headers['remote-address'] || headers['remoteAddress'] || null;
  const { firstName, lastName, email, phone, message } = body;
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
  return { success: true, message: 'Submission received' };
}

module.exports = { submitContact }; 