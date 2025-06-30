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

module.exports = { encrypt, decrypt }; 