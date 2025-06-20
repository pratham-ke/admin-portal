const express = require('express');
const router = express.Router();
const { Blog } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/blog'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all blogs
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']],
      where: { deleted_at: null },
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
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const blogData = req.body;
    if (req.file) {
      blogData.image = req.file.filename;
    }
    const blog = await Blog.create(blogData);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating blog',
      error: error.message,
    });
  }
});

// Update blog (admin only)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.filename;
    }
    await blog.update(updateData);
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
    blog.deleted_at = new Date();
    blog.deleted_by = req.user.id;
    await blog.save();
    res.json({ message: 'Blog deleted successfully (soft delete)' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting blog',
      error: error.message,
    });
  }
});

// Image upload endpoint
router.post('/upload', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename, path: `/uploads/blog/${req.file.filename}` });
});

module.exports = router; 