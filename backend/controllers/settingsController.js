const { Setting } = require('../models');
const { validateNotificationEmails } = require('../validators/settingsValidator');
const crypto = require('crypto');

function encrypt(text) {
  const key = Buffer.from(process.env.SETTINGS_ENCRYPT_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + encrypted.toString('hex');
}

function decrypt(text) {
  const key = Buffer.from(process.env.SETTINGS_ENCRYPT_KEY, 'hex');
  const iv = Buffer.from(text.slice(0, 32), 'hex');
  const encrypted = Buffer.from(text.slice(32), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

exports.getNotificationEmails = async (req, res) => {
  try {
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
    res.json({ emails });
  } catch (error) {
    console.error('Get notification emails error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.saveNotificationEmails = async (req, res) => {
  try {
    const { emails } = req.body;
    const { error } = validateNotificationEmails({ emails });
    if (error) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.details.map(d => d.message) });
    }
    const encrypted = encrypt(JSON.stringify(emails));
    let setting = await Setting.findOne({ where: { key: 'notification_emails' } });
    if (setting) {
      await setting.update({ value: encrypted });
    } else {
      await Setting.create({ key: 'notification_emails', value: encrypted });
    }
    res.json({ success: true, message: 'Notification emails updated' });
  } catch (error) {
    console.error('Save notification emails error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 