// settingsValidator.js
// Joi validation for application settings (e.g., notification emails).
// Used by settingsService.js to validate settings data before saving.

const Joi = require('joi');

// Validates an array of notification emails
exports.validateNotificationEmails = (data) => {
  const schema = Joi.object({
    emails: Joi.array().items(Joi.string().email()).min(1).required(), // At least one valid email required
  });
  return schema.validate(data, { abortEarly: false }); // Return all validation errors
}; 