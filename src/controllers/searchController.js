const SearchQuery = require('../models/SearchQuery');
const { validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all search queries
// @route   GET /api/search
// @access  Public
const getSearchQueries = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;
  
  const queries = await SearchQuery.findAll(limit, offset);
  
  res.status(200).json({
    success: true,
    count: queries.length,
    data: queries
  });
});

// @desc    Get single search query
// @route   GET /api/search/:id
// @access  Public
const getSearchQuery = asyncHandler(async (req, res) => {
  const query = await SearchQuery.findById(req.params.id);
  
  if (!query) {
    return res.status(404).json({
      success: false,
      error: 'Search query not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: query
  });
});

// @desc    Create new search query
// @route   POST /api/search
// @access  Public
const createSearchQuery = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { user_id, query_text, results_count } = req.body;
  
  // Simulate AI search processing here
  // In a real application, this would integrate with AI/ML services
  const simulatedResults = Math.floor(Math.random() * 100) + 1;
  
  const searchQuery = await SearchQuery.create({
    user_id,
    query_text,
    results_count: results_count || simulatedResults
  });
  
  res.status(201).json({
    success: true,
    message: 'Search query processed successfully',
    data: {
      ...searchQuery,
      processing_info: 'AI search simulation - replace with actual AI integration'
    }
  });
});

// @desc    Get search queries by user
// @route   GET /api/search/user/:userId
// @access  Public
const getSearchQueriesByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  
  const queries = await SearchQuery.findByUserId(userId, limit, offset);
  
  res.status(200).json({
    success: true,
    count: queries.length,
    data: queries
  });
});

// @desc    Update search query results count
// @route   PUT /api/search/:id/results
// @access  Public
const updateSearchResults = asyncHandler(async (req, res) => {
  const { results_count } = req.body;
  const queryId = req.params.id;
  
  if (typeof results_count !== 'number' || results_count < 0) {
    return res.status(400).json({
      success: false,
      error: 'Results count must be a non-negative number'
    });
  }
  
  const updated = await SearchQuery.updateResultsCount(queryId, results_count);
  
  if (!updated) {
    return res.status(404).json({
      success: false,
      error: 'Search query not found'
    });
  }
  
  const updatedQuery = await SearchQuery.findById(queryId);
  
  res.status(200).json({
    success: true,
    message: 'Search results updated successfully',
    data: updatedQuery
  });
});

// @desc    Delete search query
// @route   DELETE /api/search/:id
// @access  Public
const deleteSearchQuery = asyncHandler(async (req, res) => {
  const deleted = await SearchQuery.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Search query not found'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Search query deleted successfully'
  });
});

// @desc    Get search statistics
// @route   GET /api/search/stats
// @access  Public
const getSearchStats = asyncHandler(async (req, res) => {
  const stats = await SearchQuery.getStats();
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get popular search terms
// @route   GET /api/search/popular
// @access  Public
const getPopularSearchTerms = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const popularTerms = await SearchQuery.getPopularTerms(limit);
  
  res.status(200).json({
    success: true,
    count: popularTerms.length,
    data: popularTerms
  });
});

module.exports = {
  getSearchQueries,
  getSearchQuery,
  createSearchQuery,
  getSearchQueriesByUser,
  updateSearchResults,
  deleteSearchQuery,
  getSearchStats,
  getPopularSearchTerms
};