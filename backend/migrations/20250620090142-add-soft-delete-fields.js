'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
    // Users
    await addColumnIfNotExists('Users', 'deleted_at', { type: Sequelize.DATE, allowNull: true });
    await addColumnIfNotExists('Users', 'deleted_by', { type: Sequelize.INTEGER, allowNull: true });
    // Teams
    await addColumnIfNotExists('Teams', 'deleted_at', { type: Sequelize.DATE, allowNull: true });
    await addColumnIfNotExists('Teams', 'deleted_by', { type: Sequelize.INTEGER, allowNull: true });
    // Blogs
    await addColumnIfNotExists('Blogs', 'deleted_at', { type: Sequelize.DATE, allowNull: true });
    await addColumnIfNotExists('Blogs', 'deleted_by', { type: Sequelize.INTEGER, allowNull: true });
    // Portfolios
    await addColumnIfNotExists('Portfolios', 'deleted_at', { type: Sequelize.DATE, allowNull: true });
    await addColumnIfNotExists('Portfolios', 'deleted_by', { type: Sequelize.INTEGER, allowNull: true });
  },

  async down (queryInterface, Sequelize) {
    // Helper to remove column if exists
    async function removeColumnIfExists(table, column) {
      const [results] = await queryInterface.sequelize.query(`
        SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${table}' AND COLUMN_NAME = '${column}'
      `);
      if (results[0].count > 0) {
        await queryInterface.removeColumn(table, column);
      }
    }
    // Users
    await removeColumnIfExists('Users', 'deleted_at');
    await removeColumnIfExists('Users', 'deleted_by');
    // Teams
    await removeColumnIfExists('Teams', 'deleted_at');
    await removeColumnIfExists('Teams', 'deleted_by');
    // Blogs
    await removeColumnIfExists('Blogs', 'deleted_at');
    await removeColumnIfExists('Blogs', 'deleted_by');
    // Portfolios
    await removeColumnIfExists('Portfolios', 'deleted_at');
    await removeColumnIfExists('Portfolios', 'deleted_by');
  }
};
