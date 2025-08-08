const express = require('express');
const router = express.Router();
const {
  getSearchQueries,
  getSearchQuery,
  createSearchQuery,
  getSearchQueriesByUser,
  updateSearchResults,
  deleteSearchQuery,
  getSearchStats,
  getPopularSearchTerms
} = require('../controllers/searchController');
const { validateSearchQuery, validateSearchResults } = require('../middleware/validation');
const { apiLimiter, strictLimiter } = require('../middleware/rateLimiter');

// Search statistics and analytics routes
router.get('/stats', getSearchStats);
router.get('/popular', getPopularSearchTerms);

// Search query routes
router.route('/')
  .get(getSearchQueries)
  .post(apiLimiter, validateSearchQuery, createSearchQuery);

// User-specific search queries
router.get('/user/:userId', getSearchQueriesByUser);

// Individual search query operations
router.route('/:id')
  .get(getSearchQuery)
  .delete(deleteSearchQuery);

// Update search results
router.put('/:id/results', validateSearchResults, updateSearchResults);

module.exports = router;