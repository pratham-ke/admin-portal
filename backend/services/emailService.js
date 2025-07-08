/**
 * Email Service for sending password reset emails
 * In production, you would use services like SendGrid, AWS SES, or Nodemailer
 */

const nodemailer = require('nodemailer');

// Modular transporter setup
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<void>}
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const html = getPasswordResetTemplate(resetUrl);
    const subject = 'Password Reset Request';
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject,
        html,
      });
      console.log(`Password reset email sent to ${email}`);
    } else {
      // Fallback to simulation if SMTP not configured
      await simulateEmailSending(email, resetUrl);
      console.log('SMTP not configured, simulated password reset email.');
    }
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send welcome email for new user registration
 * @param {string} email - User's email address
 * @param {string} username - User's username
 * @returns {Promise<void>}
 */
const sendWelcomeEmail = async (email, username) => {
  try {
    console.log('=== WELCOME EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Welcome to Admin Portal`);
    console.log(`Message: Welcome ${username}! Your account has been created successfully.`);
    console.log('=====================');

    await simulateEmailSending(email, null, 'welcome');

    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

/**
 * Send email verification
 * @param {string} email - User's email address
 * @param {string} verificationToken - Email verification token
 * @returns {Promise<void>}
 */
const sendEmailVerification = async (email, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    console.log('=== EMAIL VERIFICATION ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Email Address`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log('==========================');

    await simulateEmailSending(email, verificationUrl, 'verification');

    return true;
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw new Error('Failed to send email verification');
  }
};

/**
 * Simulate email sending (for development)
 * @param {string} email - Recipient email
 * @param {string} url - Action URL (for password reset, verification, etc.)
 * @param {string} type - Email type (reset, welcome, verification)
 * @returns {Promise<void>}
 */
const simulateEmailSending = async (email, url, type = 'reset') => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      console.log(`Email sent successfully to ${email}`);
      resolve();
    }, 1000);
  });
};

/**
 * Email template for password reset
 * @param {string} resetUrl - Password reset URL
 * @returns {string} HTML email template
 */
const getPasswordResetTemplate = (resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset</title>
    </head>
    <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated email from Admin Portal.</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Email template for welcome email
 * @param {string} username - User's username
 * @returns {string} HTML email template
 */
const getWelcomeTemplate = (username) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Admin Portal</title>
    </head>
    <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Welcome to Admin Portal!</h2>
        <p>Hello ${username},</p>
        <p>Your account has been created successfully. You can now log in to access the admin portal.</p>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated email from Admin Portal.</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Email template for email verification
 * @param {string} verificationUrl - Email verification URL
 * @returns {string} HTML email template
 */
const getEmailVerificationTemplate = (verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
    </head>
    <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Verify Your Email Address</h2>
        <p>Please click the link below to verify your email address:</p>
        <p><a href="${verificationUrl}" style="background-color: #17a2b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated email from Admin Portal.</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send contact form notification to admin emails
 * @param {string[]} emails - Array of recipient emails
 * @param {object} submission - ContactUsSubmission instance
 * @returns {Promise<void>}
 */
const sendContactNotification = async (emails, submission) => {
  if (!emails || emails.length === 0) return;
  const subject = 'New Contact Us Submission';
  const message = `
    New contact form submission:\n
    Name: ${submission.firstName} ${submission.lastName}\n
    Email: ${submission.email}\n
    Phone: ${submission.phone || '-'}\n
    Message: ${submission.message}\n
    Submitted At: ${submission.submittedAt}\n
    IP Address: ${submission.ipAddress}\n
  `;
  const html = `
    <h2>New Contact Us Submission</h2>
    <p><strong>Name:</strong> ${submission.firstName} ${submission.lastName}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>Phone:</strong> ${submission.phone || '-'}</p>
    <p><strong>Message:</strong><br/>${submission.message}</p>
    <p><strong>Submitted At:</strong> ${submission.submittedAt}</p>
    <p><strong>IP Address:</strong> ${submission.ipAddress}</p>
  `;
  for (const email of emails) {
    try {
      if (transporter) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject,
          text: message,
          html,
        });
        console.log(`Contact notification sent to ${email}`);
      } else {
        // Fallback to simulation if SMTP not configured
        await simulateEmailSending(email, null, 'contact');
      }
    } catch (err) {
      console.error(`Failed to send contact notification to ${email}:`, err);
    }
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendEmailVerification,
  getPasswordResetTemplate,
  getWelcomeTemplate,
  getEmailVerificationTemplate,
  sendContactNotification,
}; 