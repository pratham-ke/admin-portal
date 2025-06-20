/**
 * Migration script to add authentication fields to User table
 * Run this script to update existing database schema
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Helper to add column if not exists
      async function addColumnIfNotExists(table, column, options) {
        const [results] = await queryInterface.sequelize.query(`
          SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${table}' AND COLUMN_NAME = '${column}'
        `);
        if (results[0].count === 0) {
          await queryInterface.addColumn(table, column, options);
        }
      }

      // Add password reset fields
      await addColumnIfNotExists('Users', 'resetToken', { type: DataTypes.STRING, allowNull: true });
      await addColumnIfNotExists('Users', 'resetTokenExpiry', { type: DataTypes.DATE, allowNull: true });

      // Add email verification fields
      await addColumnIfNotExists('Users', 'emailVerified', { type: DataTypes.BOOLEAN, defaultValue: false });
      await addColumnIfNotExists('Users', 'emailVerificationToken', { type: DataTypes.STRING, allowNull: true });
      await addColumnIfNotExists('Users', 'emailVerificationExpiry', { type: DataTypes.DATE, allowNull: true });

      // Add account status fields
      await addColumnIfNotExists('Users', 'isActive', { type: DataTypes.BOOLEAN, defaultValue: true });
      await addColumnIfNotExists('Users', 'lastLoginAt', { type: DataTypes.DATE, allowNull: true });

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