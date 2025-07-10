// ContactUsSubmission.js
// Sequelize model for storing contact form submissions from the website.
// Captures user-submitted data for follow-up and record-keeping.

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Define the ContactUsSubmission schema with fields for contact details and message
  const ContactUsSubmission = sequelize.define('ContactUsSubmission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Unique identifier for each submission
      autoIncrement: true, // Auto-incrementing ID
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false, // First name is required
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false, // Last name is required
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Email is required
      validate: { isEmail: true }, // Validates email format
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true, // Optional phone number
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false, // Message content is required
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false, // Submission timestamp
      defaultValue: DataTypes.NOW, // Defaults to current time
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false, // IP address of the submitter
    },
  }, {
    timestamps: false, // No createdAt/updatedAt fields (using submittedAt instead)
    tableName: 'contact_us_submissions', // Custom table name
  });
  return ContactUsSubmission;
}; 