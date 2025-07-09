'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Portfolios', 'status', {
      type: Sequelize.ENUM('Active', 'Exit'),
      allowNull: false,
      defaultValue: 'Active',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Portfolios', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Portfolios_status";');
  },
}; 