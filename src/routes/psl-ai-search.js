const express = require('express');
const { body } = require('express-validator');
const { handlePslAiSearchRequest, getPslAiSearchStats } = require('../controllers/pslAiSearchController');

const router = express.Router();

// Validation middleware for PSL AI Search requests
const validatePslAiSearchRequest = [
  body('uid')
    .isString()
    .isLength({ min: 1, max: 255 })
    .trim()
    .withMessage('UID must be a non-empty string with maximum 255 characters'),
  body('timestamp')
    .optional()
    .isISO8601()
    .withMessage('Timestamp must be a valid ISO8601 date'),
  body('url')
    .optional()
    .isString()
    .isLength({ max: 2048 })
    .withMessage('URL must be a string with maximum 2048 characters'),
  body('userAgent')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('User agent must be a string with maximum 500 characters')
];

/**
 * @route   POST /api/v1/psl-ai-search
 * @desc    Handle PSL AI Search plugin requests
 * @access  Public
 */
router.post('/', validatePslAiSearchRequest, handlePslAiSearchRequest);

/**
 * @route   GET /api/v1/psl-ai-search/stats
 * @desc    Get PSL AI Search statistics
 * @access  Public (could be restricted in production)
 */
router.get('/stats', getPslAiSearchStats);

module.exports = router;