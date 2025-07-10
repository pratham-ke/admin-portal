// cleanupPortfolioImages.js
// Script to clean up invalid image references in the Portfolios table.
// Sets image field to NULL for records with non-image file extensions.
// Usage: Run manually to maintain data integrity after migrations or uploads.

const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

// Initialize Sequelize instance for direct SQL queries
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false,
});

// Main function to update portfolio image references
async function cleanupPortfolioImages() {
  try {
    // Update image field to NULL for non-image file extensions
    const [results] = await sequelize.query(
      `UPDATE Portfolios SET image = NULL WHERE image IS NOT NULL AND image NOT REGEXP '\\.(png|jpg|jpeg|gif)$' AND id IS NOT NULL;`
    );
    console.log('✅ Portfolio images cleaned up:', results);
  } catch (error) {
    // Log any errors during cleanup
    console.error('❌ Error cleaning up portfolio images:', error);
  } finally {
    // Always close the database connection
    await sequelize.close();
  }
}

// Run the cleanup function
cleanupPortfolioImages(); 