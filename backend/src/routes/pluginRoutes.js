const express = require('express');
const path = require('path');
const PluginController = require('../controllers/pluginController');
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

// Plugin CRUD routes
router.get('/plugins', PluginController.getAllPlugins);
router.get('/plugins/:id', PluginController.getPluginById);
router.post('/plugins', PluginController.createPlugin);
router.put('/plugins/:id', PluginController.updatePlugin);
router.delete('/plugins/:id', PluginController.deletePlugin);

module.exports = router;