/**
 * Migration script to add authentication fields to User table
 * Run this script to update existing database schema
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add password reset fields
      await queryInterface.addColumn('Users', 'resetToken', {
        type: DataTypes.STRING,
        allowNull: true,
      });

      await queryInterface.addColumn('Users', 'resetTokenExpiry', {
        type: DataTypes.DATE,
        allowNull: true,
      });

      // Add email verification fields
      await queryInterface.addColumn('Users', 'emailVerified', {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      });

      await queryInterface.addColumn('Users', 'emailVerificationToken', {
        type: DataTypes.STRING,
        allowNull: true,
      });

      await queryInterface.addColumn('Users', 'emailVerificationExpiry', {
        type: DataTypes.DATE,
        allowNull: true,
      });

      // Add account status fields
      await queryInterface.addColumn('Users', 'isActive', {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      });

      await queryInterface.addColumn('Users', 'lastLoginAt', {
        type: DataTypes.DATE,
        allowNull: true,
      });

      console.log('✅ Migration completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove all added columns
      const columnsToRemove = [
        'resetToken',
        'resetTokenExpiry',
        'emailVerified',
        'emailVerificationToken',
        'emailVerificationExpiry',
        'isActive',
        'lastLoginAt'
      ];

      for (const column of columnsToRemove) {
        await queryInterface.removeColumn('Users', column);
      }

      console.log('✅ Rollback completed successfully');
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }
}; 