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

// Helper function to clean empty strings
const cleanEmptyStrings = (data) => {
  const cleaned = { ...data };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '') {
      cleaned[key] = null;
    }
  });
  return cleaned;
};

// Get all portfolio items
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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

// Create portfolio item (all authenticated users)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    let itemData = cleanEmptyStrings(req.body);
    if (req.file) {
      itemData.image = req.file.filename;
    }
    // Backend validation for required fields
    if (!itemData.name) {
      return res.status(400).json({ message: 'Name is required.' });
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

// Update portfolio item (all authenticated users)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    let updateData = cleanEmptyStrings(req.body);
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

// Delete portfolio item (all authenticated users)
router.delete('/:id', auth, async (req, res) => {
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

// Toggle portfolio item Active/Exit status (all authenticated users)
router.patch('/:id/toggle-status', auth, async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    item.status = item.status === 'Active' ? 'Exit' : 'Active';
    await item.save();
    res.json({ id: item.id, status: item.status });
  } catch (error) {
    res.status(500).json({
      message: 'Error toggling portfolio item status',
      error: error.message,
    });
  }
});

module.exports = router; 