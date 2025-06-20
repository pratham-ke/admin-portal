const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false,
});

async function cleanupPortfolioImages() {
  try {
    const [results] = await sequelize.query(
      `UPDATE Portfolios SET image = NULL WHERE image IS NOT NULL AND image NOT REGEXP '\\.(png|jpg|jpeg|gif)$' AND id IS NOT NULL;`
    );
    console.log('✅ Portfolio images cleaned up:', results);
  } catch (error) {
    console.error('❌ Error cleaning up portfolio images:', error);
  } finally {
    await sequelize.close();
  }
}

cleanupPortfolioImages(); 