const { ContactUsSubmission, Setting } = require('../models');
const { validateContactSubmission } = require('../validators/contactValidator');
const { sendContactNotification } = require('./emailService');
const { decrypt } = require('../utils/crypto');
const axios = require('axios');

async function submitContact(body, headers) {
  try {
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
    let recaptchaRes;
    try {
      recaptchaRes = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`);
    } catch (e) {
      console.error('reCAPTCHA API error:', e);
      const err = new Error('reCAPTCHA verification failed (API error)');
      err.status = 422;
      throw err;
    }
    if (!recaptchaRes.data.success) {
      const err = new Error('reCAPTCHA verification failed');
      err.status = 422;
      throw err;
    }
    // Save submission
    const ipAddress =
      headers['x-forwarded-for'] ||
      headers['x-real-ip'] ||
      headers['x-client-ip'] ||
      headers['x-forwarded'] ||
      headers['forwarded-for'] ||
      headers['forwarded'] ||
      headers['remote_addr'] ||
      headers['remote-address'] ||
      headers['remoteAddress'] ||
      headers['req-ip'] ||
      (headers.connection && headers.connection.remoteAddress) ||
      '127.0.0.1';
    const { firstName, lastName, email, phone, message } = body;
    const submission = await ContactUsSubmission.create({
      firstName, lastName, email, phone, message, ipAddress,
      submittedAt: new Date(),
    });
    // Notify admins (async, do not block response)
    (async () => {
      let emails = [];
      try {
        const setting = await Setting.findOne({ where: { key: 'notification_emails' } });
        if (setting && setting.value) {
          try {
            const decrypted = decrypt(setting.value);
            emails = JSON.parse(decrypted);
          } catch (e) {
            console.error('Failed to decrypt notification_emails:', e);
            emails = [];
          }
        }
      } catch (e) {
        console.error('Failed to fetch notification_emails setting:', e);
        emails = [];
      }
      try {
        await sendContactNotification(emails, submission);
      } catch (e) {
        console.error('Failed to send contact notification:', e);
      }
    })();
    // Respond immediately
    return { success: true, message: 'Submission received' };
  } catch (error) {
    // Log everything for debugging
    console.error('Contact form submission error:', {
      error,
      body,
      headers,
      stack: error.stack,
    });
    if (error.status) throw error;
    const err = new Error('Internal server error (see logs for details)');
    err.status = 500;
    throw err;
  }
}

module.exports = { submitContact }; 