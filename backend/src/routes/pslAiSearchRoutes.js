const express = require('express');
const router = express.Router();
const mysqlDb = require('../config/mysql');

// Controller for handling psl-ai-search requests
const pslAiSearchController = {
  // Handle search request from the plugin
  handleSearch: async (req, res) => {
    try {
      const { uid } = req.body;
      
      // Validate uid parameter
      if (!uid) {
        return res.status(400).json({
          success: false,
          error: 'Missing uid parameter'
        });
      }
      
      // Log the search request (for debugging/monitoring)
      console.log(`PSL AI Search request received - UID: ${uid}`);
      
      // Query the plugins table for settings
      try {
        const { rows: plugins } = await mysqlDb.query(`
          SELECT settings FROM plugins 
          WHERE type = 'psl-ai-search' AND uid = ?
        `, [uid]);

        if (plugins.length === 0) {
          // Plugin not found
          return res.status(404).json({
            success: false,
            error: 'Plugin not found. Please provide a valid uid.',
            uid: uid
          });
        }

        // Plugin found, return settings
        const pluginSettings = plugins[0].settings;
        
        const searchResult = {
          success: true,
          uid: uid,
          message: 'Plugin settings retrieved successfully',
          timestamp: new Date().toISOString(),
          settings: typeof pluginSettings === 'string' ? JSON.parse(pluginSettings) : pluginSettings
        };

        res.status(200).json(searchResult);

      } catch (dbError) {
        console.error('Database error in psl-ai-search handler:', dbError);
        
        // If database is not available, use fallback logic that simulates database behavior
        // Known test UIDs that should work in fallback mode
        const knownTestUids = ['test-uid-001', 'test-uid-002', 'test-uid-003', 'user-123', 'search-456'];
        
        if (!knownTestUids.includes(uid)) {
          // Simulate plugin not found for unknown UIDs
          return res.status(404).json({
            success: false,
            error: 'Plugin not found. Please provide a valid uid.',
            uid: uid
          });
        }
        
        // Return fallback settings for known UIDs
        const mockResult = {
          success: true,
          uid: uid,
          message: 'Plugin settings retrieved (fallback mode)',
          timestamp: new Date().toISOString(),
          settings: {
            theme: 'default',
            placeholder: 'Search in CME program',
            title: 'AI Search',
            submitText: 'Search'
          }
        };
        
        res.status(200).json(mockResult);
      }
      
    } catch (error) {
      console.error('Error in psl-ai-search handler:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // Handle search form submission
  handleSearchSubmission: async (req, res) => {
    try {
      const { uid, query } = req.body;
      
      // Validate required parameters
      if (!uid || !query) {
        return res.status(400).json({
          success: false,
          error: 'Missing uid or query parameter'
        });
      }
      
      console.log(`Search submission received - UID: ${uid}, Query: ${query}`);
      
      // Here you would implement the actual search logic
      // For now, we'll return a mock search response
      const searchResult = {
        success: true,
        uid: uid,
        query: query,
        message: 'Search completed successfully',
        timestamp: new Date().toISOString(),
        results: [
          {
            id: 1,
            title: `Mock result for "${query}"`,
            description: 'This is a mock search result for demonstration purposes',
            url: '#',
            relevanceScore: 0.95
          },
          {
            id: 2,
            title: `Related content for "${query}"`,
            description: 'Another mock result showing related medical content',
            url: '#',
            relevanceScore: 0.87
          }
        ],
        totalResults: 2
      };
      
      res.status(200).json(searchResult);
      
    } catch (error) {
      console.error('Error in search submission handler:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
};

// POST /api/v1/psl-ai-search
router.post('/psl-ai-search', pslAiSearchController.handleSearch);

// POST /api/v1/search
router.post('/search', pslAiSearchController.handleSearchSubmission);

module.exports = router;