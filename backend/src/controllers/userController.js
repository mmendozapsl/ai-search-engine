const User = require('../models/User');
const { validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create new user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { name, email } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User with this email already exists'
    });
  }
  
  const user = await User.create({ name, email });
  
  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { name, email } = req.body;
  const userId = req.params.id;
  
  // Check if user exists
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  // Check if email is already taken by another user
  if (email !== existingUser.email) {
    const emailTaken = await User.findByEmail(email);
    if (emailTaken) {
      return res.status(400).json({
        success: false,
        error: 'Email is already taken by another user'
      });
    }
  }
  
  const user = await User.update(userId, { name, email });
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  const deleted = await User.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Public
const getUserStats = asyncHandler(async (req, res) => {
  const count = await User.count();
  
  res.status(200).json({
    success: true,
    data: {
      total_users: count
    }
  });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
};