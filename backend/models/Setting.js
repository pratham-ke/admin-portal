// Setting.js
// Sequelize model for application settings in the admin portal backend.
// Stores key-value pairs for configurable settings (e.g., notification emails).
// Used by settingsService.js and other backend modules.

const { DataTypes } = require('sequelize');

// Setting model definition
module.exports = (sequelize) => {
  // Define the Setting schema with fields for key and value
  const Setting = sequelize.define('Setting', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Each setting key must be unique
      validate: {
        notEmpty: true,
      },
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false, // Value is stored as text (can be encrypted JSON)
    },
  }, {
    tableName: 'settings',
    timestamps: true, // Adds createdAt and updatedAt fields
  });

  return Setting;
}; 