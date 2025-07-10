// contactValidator.js
// Joi validation for contact form submissions.
// Used by contactService.js to validate contact form data before saving.

const Joi = require('joi');

// Validates a contact form submission
exports.validateContactSubmission = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().max(100).required(), // First name required, max 100 chars
    lastName: Joi.string().max(100).required(), // Last name required, max 100 chars
    email: Joi.string().email().required(), // Valid email required
    phone: Joi.string().max(30).allow('', null), // Optional phone, max 30 chars
    message: Joi.string().max(2000).required(), // Message required, max 2000 chars
    captchaToken: Joi.string().required(), // reCAPTCHA token required
  });
  return schema.validate(data, { abortEarly: false }); // Return all validation errors
}; 