require('dotenv').config();
const { User } = require('./models');

async function testUsersAPI() {
  try {
    // First, let's see what users exist in the database
    console.log('=== Users in Database ===');
    const allUsers = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    console.log(`Total users found: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    });

    // Now let's test the actual query that the API uses
    console.log('\n=== Testing API Query ===');
    const apiUsers = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    console.log(`API query returned: ${apiUsers.length} users`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testUsersAPI(); 