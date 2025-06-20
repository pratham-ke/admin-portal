const express = require('express');
const router = express.Router();
const { Team } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/team'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all team members
router.get('/', auth, async (req, res) => {
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
router.get('/:id', auth, async (req, res) => {
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
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const memberData = req.body;
    if (req.file) {
      memberData.image = req.file.filename;
    }
    const member = await Team.create(memberData);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating team member',
      error: error.message,
    });
  }
});

// Update team member (admin only)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const member = await Team.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.filename;
    }
    await member.update(updateData);
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

// Image upload endpoint
router.post('/upload', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename, path: `/uploads/team/${req.file.filename}` });
});

module.exports = router; 