'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // Blogs table: make description, category, author nullable
    await queryInterface.changeColumn("Blogs", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("Blogs", "category", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("Blogs", "author", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // Portfolios table: make description, category nullable
    await queryInterface.changeColumn("Portfolios", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("Portfolios", "category", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Blogs table: revert to NOT NULL
    await queryInterface.changeColumn("Blogs", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn("Blogs", "category", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("Blogs", "author", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    // Portfolios table: revert to NOT NULL
    await queryInterface.changeColumn("Portfolios", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn("Portfolios", "category", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
