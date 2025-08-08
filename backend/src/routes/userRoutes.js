const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validate, userUpdateSchema } = require('../middleware/validation');

const router = express.Router();

// Protected routes - require authentication
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, validate(userUpdateSchema), userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;