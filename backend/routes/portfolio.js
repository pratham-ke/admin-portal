const express = require('express');
const router = express.Router();
const { Portfolio } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/portfolio'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all portfolio items
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching portfolio items',
      error: error.message,
    });
  }
});

// Get single portfolio item
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching portfolio item',
      error: error.message,
    });
  }
});

// Create portfolio item (admin only)
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const itemData = req.body;
    if (req.file) {
      itemData.image = req.file.filename;
    }
    const item = await Portfolio.create(itemData);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating portfolio item',
      error: error.message,
    });
  }
});

// Update portfolio item (admin only)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.filename;
    }
    await item.update(updateData);
    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating portfolio item',
      error: error.message,
    });
  }
});

// Delete portfolio item (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    await item.destroy();
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting portfolio item',
      error: error.message,
    });
  }
});

module.exports = router; 