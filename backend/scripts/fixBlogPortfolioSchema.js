const mysql = require('mysql2/promise');
const config = require('../config/database');

async function fixSchema() {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
  });
  try {
    console.log('Connected to database. Applying schema fixes...');
    await connection.query(`ALTER TABLE Blogs
      MODIFY COLUMN description TEXT NULL,
      MODIFY COLUMN category VARCHAR(255) NULL,
      MODIFY COLUMN author VARCHAR(255) NULL;
    `);
    await connection.query(`ALTER TABLE Portfolios
      MODIFY COLUMN description TEXT NULL,
      MODIFY COLUMN category VARCHAR(255) NULL;
    `);
    console.log('✅ Schema updated successfully!');
  } catch (err) {
    console.error('❌ Error updating schema:', err);
  } finally {
    await connection.end();
  }
}

fixSchema(); 