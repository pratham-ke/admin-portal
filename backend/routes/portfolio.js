const express = require('express');
const router = express.Router();
const { Portfolio } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');

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

// Create portfolio item (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const item = await Portfolio.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating portfolio item',
      error: error.message,
    });
  }
});

// Update portfolio item (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    await item.update(req.body);
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