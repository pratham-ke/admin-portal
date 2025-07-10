// Portfolio.js
// Sequelize model for portfolio items in the admin portal backend.
// Defines fields for portfolio projects, including name, description, image, status, etc.
// Used by portfolio routes and services for CRUD operations.

const { DataTypes } = require('sequelize');

// Portfolio model definition
module.exports = (sequelize) => {
  // Define the Portfolio schema with fields for name, description, image, etc.
  const Portfolio = sequelize.define('Portfolio', {
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Project name is required
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Optional project description
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // Optional image filename
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Active', // Default status is 'Active'
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Controls visibility in the frontend
    },
    // Add other fields as needed (e.g., links, tags, etc.)
  }, {
    tableName: 'portfolios',
    timestamps: true, // Adds createdAt and updatedAt fields
  });

  return Portfolio;
}; 