const express = require('express');
const router = express.Router();
const { Team } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');

// Get all team members
router.get('/', async (req, res) => {
  try {
    const team = await Team.findAll({
      order: [['order', 'ASC']],
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching team members',
      error: error.message,
    });
  }
});

// Get single team member
router.get('/:id', async (req, res) => {
  try {
    const member = await Team.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching team member',
      error: error.message,
    });
  }
});

// Create team member (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating team member',
      error: error.message,
    });
  }
});

// Update team member (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const member = await Team.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    await member.update(req.body);
    res.json(member);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating team member',
      error: error.message,
    });
  }
});

// Delete team member (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const member = await Team.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    await member.destroy();
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting team member',
      error: error.message,
    });
  }
});

module.exports = router; 