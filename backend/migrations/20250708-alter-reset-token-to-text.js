module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Use TEXT for resetToken to support long JWTs and future-proofing
    await queryInterface.changeColumn('Users', 'resetToken', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Stores password reset JWT token securely',
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Revert to STRING if needed (not recommended for JWTs)
    await queryInterface.changeColumn('Users', 'resetToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};