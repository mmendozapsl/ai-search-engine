const { validationResult } = require('express-validator');

/**
 * PSL AI Search Controller
 * Handles requests from the psl-ai-search.js plugin
 */

/**
 * Handle PSL AI Search plugin requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handlePslAiSearchRequest = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: errors.array()
      });
    }

    const { uid, timestamp, url, userAgent } = req.body;

    // Log the request for debugging
    console.log('PSL AI Search request received:', {
      uid,
      timestamp,
      url,
      userAgent: userAgent ? userAgent.substring(0, 100) + '...' : 'Not provided',
      ip: req.ip || req.connection.remoteAddress
    });

    // Here you would typically:
    // 1. Validate the UID against your database
    // 2. Track the usage/analytics
    // 3. Return relevant configuration or data
    // 4. Log the interaction for reporting

    // For now, we'll return a success response with some mock data
    const response = {
      success: true,
      message: 'PSL AI Search request processed successfully',
      data: {
        uid: uid,
        status: 'active',
        timestamp: new Date().toISOString(),
        // Add any configuration or data that the plugin might need
        config: {
          enabled: true,
          features: ['search', 'analytics']
        }
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error processing PSL AI Search request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

/**
 * Get PSL AI Search plugin statistics (optional endpoint for admin/analytics)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPslAiSearchStats = async (req, res) => {
  try {
    // This would typically query your database for analytics
    const stats = {
      success: true,
      message: 'PSL AI Search statistics',
      data: {
        totalRequests: 0, // Would come from database
        activeUIDs: 0,    // Would come from database
        lastUpdated: new Date().toISOString()
      }
    };

    res.status(200).json(stats);

  } catch (error) {
    console.error('Error fetching PSL AI Search stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

module.exports = {
  handlePslAiSearchRequest,
  getPslAiSearchStats
};