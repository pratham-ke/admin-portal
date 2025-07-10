// settingsService.js
// Service module for application settings in the backend of the admin portal.
// Handles fetching, updating, encrypting, and decrypting settings (e.g., notification emails).
// Usage: Used by controllers to manage application settings securely.

const { Setting } = require('../models');
const { validateNotificationEmails } = require('../validators/settingsValidator');
const { encrypt, decrypt } = require('../utils/crypto');

// Fetches notification emails from the settings table, decrypts and parses them.
// Used in settingsController.js to provide notification emails to the frontend.
async function getNotificationEmails() {
  // Find the notification_emails setting in the database
  const setting = await Setting.findOne({ where: { key: 'notification_emails' } });
  let emails = [];
  if (setting && setting.value) {
    try {
      // Decrypt the stored value and parse as JSON array
      const decrypted = decrypt(setting.value);
      emails = JSON.parse(decrypted);
    } catch (err) {
      // Handle decryption or parsing errors
      console.error('Failed to decrypt or parse notification emails:', err);
      emails = [];
    }
  }
  return emails;
}

// Saves notification emails to the settings table after validation and encryption.
// Used in settingsController.js to update notification emails from the frontend.
async function saveNotificationEmails(emails) {
  // Validate the emails array using Joi schema
  const { error } = validateNotificationEmails({ emails });
  if (error) {
    // Throw validation error with details
    const err = new Error('Validation error');
    err.status = 400;
    err.details = error.details.map(d => d.message);
    throw err;
  }
  // Encrypt the emails array as a JSON string
  const encrypted = encrypt(JSON.stringify(emails));
  // Upsert the setting in the database (insert or update)
  await Setting.upsert({ key: 'notification_emails', value: encrypted });
  return true;
}

module.exports = { getNotificationEmails, saveNotificationEmails }; 