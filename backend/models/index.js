const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    logging: false,
  }
);

const db = {};

// Import models
db.User = require('./User')(sequelize);
db.Blog = require('./Blog')(sequelize);
db.Team = require('./Team')(sequelize);
db.Portfolio = require('./Portfolio')(sequelize);

// Define relationships
// Add relationships here if needed in the future

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 