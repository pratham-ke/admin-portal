// fixBlogPortfolioSchema.js
// Script to update the schema of Blogs and Portfolios tables in the database.
// Modifies columns to allow null values for certain fields.
// Usage: Run manually to apply schema fixes after deployment or migration.

const mysql = require('mysql2/promise');
const config = require('../config/database');

// Main function to connect to the database and apply schema changes
async function fixSchema() {
  // Create a connection to the MySQL database using config
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
  });
  try {
    console.log('Connected to database. Applying schema fixes...');
    // Alter Blogs table: make description, category, and author nullable
    await connection.query(`ALTER TABLE Blogs
      MODIFY COLUMN description TEXT NULL,
      MODIFY COLUMN category VARCHAR(255) NULL,
      MODIFY COLUMN author VARCHAR(255) NULL;
    `);
    // Alter Portfolios table: make description and category nullable
    await connection.query(`ALTER TABLE Portfolios
      MODIFY COLUMN description TEXT NULL,
      MODIFY COLUMN category VARCHAR(255) NULL;
    `);
    console.log('✅ Schema updated successfully!');
  } catch (err) {
    // Log any errors during schema update
    console.error('❌ Error updating schema:', err);
  } finally {
    // Always close the database connection
    await connection.end();
  }
}

// Run the schema fix function
fixSchema(); 