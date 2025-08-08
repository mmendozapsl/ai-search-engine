const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the psl-ai-search.js plugin
router.get('/embed/psl-ai-search.js', (req, res) => {
  const pluginPath = path.join(__dirname, '../plugins/psl-ai-search.js');
  
  // Set appropriate headers for JavaScript file
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow embedding from any domain
  
  res.sendFile(pluginPath);
});

module.exports = router;