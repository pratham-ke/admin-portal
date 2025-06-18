const axios = require('axios');
const db = require('../models');

const seedDatabase = async () => {
  try {
    // Sync database
    await db.sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Create admin user
    await db.User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',          
    });
    console.log('Admin user created successfully');

    // Create additional users
    await db.User.create({
      username: 'pratham',
      email: 'pratham.more@kernelequity.com',
      password: 'pratham123',
      role: 'admin',
    });
    console.log('Pratham user created successfully');

    await db.User.create({
      username: 'Demo',
      email: 'prathammore.ke@gmail.com',
      password: 'demo123',
      role: 'admin',
    });
    console.log('Demo user created successfully');

    // Fetch and seed blog data
    const blogResponse = await axios.get('https://dhaval-patel-ke.github.io/kernel-images/kernel/blog.json');
    const formattedBlogData = blogResponse.data.map((post) => {
      let formattedDate;
      try {
        const date = new Date(post.date);
        if (isNaN(date.getTime())) {
          formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');  
        } else {
          formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        }
      } catch (error) {
        formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      
      return {
        title: post.title,
        description: post.description || '', // Ensure description exists
        image: post.image || null,
        category: post.category,
        author: post.author || 'Unknown Author', // Provide default author
        date: formattedDate,
        tags: post.tags || [],
        content: post.content,
        status: post.status || 'draft',
      };
    });
    await db.Blog.bulkCreate(formattedBlogData);
    console.log('Blog data seeded successfully');

    // Fetch and seed team data
    const teamResponse = await axios.get('https://dhaval-patel-ke.github.io/kernel-images/kernel/teams.json');
    const formattedTeamData = teamResponse.data.team.map((member, idx) => ({
      name: member.name,
      position: member.position,
      image: member.image || null,
      bio: member.bio || '',
      email: member.email || null,
      order: member.order != null ? member.order : idx + 1, // Default to index+1 if missing/null
      status: member.status || 'active',
    }));
    await db.Team.bulkCreate(formattedTeamData);
    console.log('Team data seeded successfully');

    // Fetch and seed portfolio data
    const portfolioResponse = await axios.get('https://dhaval-patel-ke.github.io/kernel-images/kernel/portfolio.json');
    const formattedPortfolioData = portfolioResponse.data.map((item) => ({
      portfolio_id: item.id,
      name: item.name,
      description: item.description || '',
      overview: item.overview || '',
      image: item.image || null,
      category: item.category,
      year: item.year || null,
      website: item.website || null,
      status: item.status || 'Active',
    }));
    await db.Portfolio.bulkCreate(formattedPortfolioData);
    console.log('Portfolio data seeded successfully');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 