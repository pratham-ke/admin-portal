const express = require('express');
const router = express.Router();
const { Blog } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');

// Get all blogs
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blogs',
      error: error.message,
    });
  }
});

// Get single blog
router.get('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blog',
      error: error.message,
    });
  }
});

// Create blog (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating blog',
      error: error.message,
    });
  }
});

// Update blog (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    await blog.update(req.body);
    res.json(blog);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating blog',
      error: error.message,
    });
  }
});

// Delete blog (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    await blog.destroy();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting blog',
      error: error.message,
    });
  }
});

module.exports = router; 