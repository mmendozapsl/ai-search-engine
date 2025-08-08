const { body } = require('express-validator');

// User validation rules
const validateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must not exceed 100 characters')
];

// Search query validation rules
const validateSearchQuery = [
  body('query_text')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Search query must be between 1 and 1000 characters')
    .escape(), // Sanitize HTML
  
  body('user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  body('results_count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Results count must be a non-negative integer')
];

// Search results update validation
const validateSearchResults = [
  body('results_count')
    .isInt({ min: 0 })
    .withMessage('Results count must be a non-negative integer')
];

module.exports = {
  validateUser,
  validateSearchQuery,
  validateSearchResults
};