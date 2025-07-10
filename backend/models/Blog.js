// Blog.js
// Sequelize model for blog posts in the admin portal backend.
// Represents articles or news items with fields for title, content, image, author, etc.
// Used for managing and displaying blog content in the frontend and backend.

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Blog = sequelize.define(
    'Blog',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Unique identifier for each blog post
        autoIncrement: true, // Auto-incrementing ID
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false, // Blog post title is required
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true, // Optional short description
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true, // Optional image filename or path
        // Stores the filename or relative path of the uploaded image
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true, // Optional category for the post
      },
      author: {
        type: DataTypes.STRING,
        allowNull: true, // Optional author name
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false, // Date of publication or creation
        defaultValue: DataTypes.NOW, // Defaults to current time
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true, // Optional tags (as JSON array)
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false, // Main content of the blog post is required
      },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft', // Post status: draft or published
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true, // Soft delete timestamp
      },
      deleted_by: {
        type: DataTypes.INTEGER,
        allowNull: true, // ID of the user who deleted the record
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  );

  return Blog;
}; 