/**
 * Script to run the authentication fields migration
 * This will add the new fields to the User table
 */

const db = require('./models');
const migration = require('./migrations/add-auth-fields');

async function runMigration() {
  try {
    console.log('🔄 Starting migration...');
    
    // Run the migration
    await migration.up(db.sequelize.getQueryInterface(), db.Sequelize);
    
    console.log('✅ Migration completed successfully!');
    console.log('📋 Added fields to User table:');
    console.log('   - resetToken');
    console.log('   - resetTokenExpiry');
    console.log('   - emailVerified');
    console.log('   - emailVerificationToken');
    console.log('   - emailVerificationExpiry');
    console.log('   - isActive');
    console.log('   - lastLoginAt');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 