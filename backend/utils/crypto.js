// crypto.js
// Utility functions for cryptographic operations in the backend of the admin portal.
// Provides AES-256-CBC encryption and decryption for sensitive data (e.g., settings, notification emails).
// Usage: Used by backend services to securely store and retrieve encrypted values.

const crypto = require('crypto');

// Encrypts a string using AES-256-CBC with a key from environment variables.
// Returns a hex string with IV prepended to the encrypted data.
function encrypt(text) {
  // Get encryption key from environment variable (hex format)
  const key = Buffer.from(process.env.SETTINGS_ENCRYPT_KEY, 'hex');
  // Generate a random 16-byte IV
  const iv = crypto.randomBytes(16);
  // Create cipher instance
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  // Encrypt the text
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // Return IV + encrypted data as hex string
  return iv.toString('hex') + encrypted.toString('hex');
}

// Decrypts a string previously encrypted with the encrypt() function above.
// Expects a hex string with IV prepended to the encrypted data.
function decrypt(text) {
  // Get encryption key from environment variable (hex format)
  const key = Buffer.from(process.env.SETTINGS_ENCRYPT_KEY, 'hex');
  // Extract IV from the first 32 hex characters (16 bytes)
  const iv = Buffer.from(text.slice(0, 32), 'hex');
  // Extract encrypted data from the rest
  const encrypted = Buffer.from(text.slice(32), 'hex');
  // Create decipher instance
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  // Decrypt the data
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  // Return decrypted string
  return decrypted.toString();
}

module.exports = { encrypt, decrypt }; 