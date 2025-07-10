// index.js
// Centralizes Sequelize initialization and model imports for the backend.
// Exports all models and the Sequelize instance for use throughout the backend.

const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql', // Set the database dialect (MySQL)
    logging: false, // Disable SQL query logging
  }
);

const db = {};

// Import models and attach them to the db object
// Each model is initialized with the Sequelize instance
db.User = require('./User')(sequelize);
db.Blog = require('./Blog')(sequelize);
db.Team = require('./Team')(sequelize);
db.Portfolio = require('./Portfolio')(sequelize);
db.ContactUsSubmission = require('./ContactUsSubmission')(sequelize);
db.Setting = require('./Setting')(sequelize);

// Define relationships between models here if needed in the future
// Example: db.User.hasMany(db.Blog);

// Attach Sequelize instance and class to db for external use
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 