const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');
const { strictLimiter } = require('../middleware/rateLimiter');

// User statistics route
router.get('/stats', getUserStats);

// User CRUD routes
router.route('/')
  .get(getUsers)
  .post(strictLimiter, validateUser, createUser);

router.route('/:id')
  .get(getUser)
  .put(validateUser, updateUser)
  .delete(deleteUser);

module.exports = router;