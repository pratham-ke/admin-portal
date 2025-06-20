const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/user'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all users (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      where: { deleted_at: null },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// Create new user (admin only)
router.post('/', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists',
      });
    }

    // Create new user
    const userData = {
      username,
      email,
      password,
      role: role || 'user',
    };
    if (req.file) {
      userData.image = req.file.filename;
    }
    const user = await User.create(userData);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error: error.message,
    });
  }
});

// Update user (admin only)
router.put('/:id', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email or username is already taken by another user
    if (email !== user.email || username !== user.username) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
          id: { [Op.ne]: id },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'User with this email or username already exists',
        });
      }
    }

    // Update user
    const updateData = { username, email, role };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    await user.update(updateData);

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error: error.message,
    });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.deleted_at = new Date();
    user.deleted_by = req.user.id;
    await user.save();
    res.json({ message: 'User deleted successfully (soft delete)' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message,
    });
  }
});

// Toggle user active/inactive status (admin only)
router.patch('/:id/toggle-active', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ id: user.id, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({
      message: 'Error toggling user status',
      error: error.message,
    });
  }
});

module.exports = router; 