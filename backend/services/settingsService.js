const { Setting } = require('../models');
const { validateNotificationEmails } = require('../validators/settingsValidator');
const { encrypt, decrypt } = require('../utils/crypto');

async function getNotificationEmails() {
  const setting = await Setting.findOne({ where: { key: 'notification_emails' } });
  let emails = [];
  if (setting && setting.value) {
    try {
      const decrypted = decrypt(setting.value);
      emails = JSON.parse(decrypted);
    } catch (err) {
      console.error('Failed to decrypt or parse notification emails:', err);
      emails = [];
    }
  }
  return emails;
}

async function saveNotificationEmails(emails) {
  const { error } = validateNotificationEmails({ emails });
  if (error) {
    const errObj = new Error('Validation error');
    errObj.status = 400;
    errObj.details = error.details.map(d => d.message);
    throw errObj;
  }
  const encrypted = encrypt(JSON.stringify(emails));
  let setting = await Setting.findOne({ where: { key: 'notification_emails' } });
  if (setting) {
    await setting.update({ value: encrypted });
  } else {
    await Setting.create({ key: 'notification_emails', value: encrypted });
  }
  return { success: true, message: 'Notification emails updated' };
}

module.exports = { getNotificationEmails, saveNotificationEmails }; 