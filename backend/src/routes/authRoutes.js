const express = require('express');
const userController = require('../controllers/userController');
const { validate, userRegistrationSchema, userLoginSchema } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validate(userRegistrationSchema), userController.register);
router.post('/login', validate(userLoginSchema), userController.login);

module.exports = router;