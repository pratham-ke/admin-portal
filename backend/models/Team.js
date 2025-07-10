// Team.js
// Sequelize model for team members in the admin portal backend.
// Represents staff or team members with fields for name, position, image, bio, etc.
// Used for displaying team information in the frontend and managing team data in the backend.

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Define the Team schema with fields for member details
  const Team = sequelize.define(
    'Team',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Unique identifier for each team member
        autoIncrement: true, // Auto-incrementing ID
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Team member's name is required
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false, // Team member's position or title is required
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true, // Optional profile image filename or path
        // Stores the filename or relative path of the uploaded image
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true, // Optional biography or description
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true, // Optional email address
        validate: {
          isEmail: true, // Validates email format if provided
        },
      },
      social_links: {
        type: DataTypes.JSON,
        allowNull: true, // Optional social media links (as JSON object)
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false, // Used for ordering team members in the UI
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active', // Indicates if the member is active or inactive
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true, // Soft delete timestamp
      },
      deleted_by: {
        type: DataTypes.INTEGER,
        allowNull: true, // ID of the user who deleted the record
      },
      linkedin: {
        type: DataTypes.STRING,
        allowNull: true, // Optional LinkedIn profile URL
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  );

  return Team;
}; 