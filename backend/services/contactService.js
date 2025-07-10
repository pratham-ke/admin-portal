// contactService.js
// Service module for contact form submissions and related logic in the backend.
// Handles validation, reCAPTCHA verification, and saving contact submissions.
// Usage: Used by controllers to process and store contact form data securely.

const { ContactUsSubmission, Setting } = require('../models');
const { validateContactSubmission } = require('../validators/contactValidator');
const { sendContactNotification } = require('./emailService');
const { decrypt } = require('../utils/crypto');
const axios = require('axios');

// Submits a contact form, validates input, verifies reCAPTCHA, and saves the submission.
// Used in contactController.js to handle POST /contact requests from the frontend.
async function submitContact(body, headers) {
  try {
    // Validate input using Joi schema
    const { error } = validateContactSubmission(body);
    if (error) {
      // Throw validation error with details
      const err = new Error('Validation error');
      err.status = 400;
      err.details = error.details.map(d => d.message);
      throw err;
    }
    // Verify reCAPTCHA token with Google API
    const { captchaToken } = body;
    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    let recaptchaRes;
    try {
      // Call Google reCAPTCHA API to verify token
      recaptchaRes = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`);
    } catch (e) {
      // Handle API error
      console.error('reCAPTCHA API error:', e);
      const err = new Error('reCAPTCHA verification failed (API error)');
      err.status = 422;
      throw err;
    }
    if (!recaptchaRes.data.success) {
      // Handle failed reCAPTCHA verification
      const err = new Error('reCAPTCHA verification failed');
      err.status = 422;
      throw err;
    }
    // Extract IP address from headers for logging
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
    // Save the contact submission to the database
    const { firstName, lastName, email, phone, message } = body;
    const submission = await ContactUsSubmission.create({
      firstName, lastName, email, phone, message, ipAddress,
      submittedAt: new Date(),
    });
    // Send notification email to admins (if configured)
    await sendContactNotification(submission);
    return submission;
  } catch (err) {
    // Propagate error to controller
    throw err;
  }
}

module.exports = { submitContact }; 