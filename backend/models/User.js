// User.js
// Sequelize model for the User entity in the admin portal backend.
// Defines user fields, validation, and password hashing/validation logic.
// Used throughout the backend for authentication and user management.

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// User model definition
module.exports = (sequelize) => {
  // Define the User schema with fields for username, email, password, role, etc.
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Each username must be unique
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Each email must be unique
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // Password is hashed before saving (see hooks below)
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user', // Default role is 'user'
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // Optional profile image
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // User is active by default
    },
    // Add other fields as needed
  }, {
    // Model options
    tableName: 'users',
    timestamps: true, // Adds createdAt and updatedAt fields
    // Add hooks for password hashing
    hooks: {
      beforeCreate: async (user) => {
        // Hash the password before saving a new user
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        // Hash the password if it is changed during update
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  });

  // Instance method to validate a password
  // Usage: await user.validatePassword('plaintext')
  User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
}; 