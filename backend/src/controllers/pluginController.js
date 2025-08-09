const mysqlDb = require('../config/mysql');

class PluginController {
  // Get all plugins
  static async getAllPlugins(req, res) {
    try {
      const { rows } = await mysqlDb.query(`
        SELECT id, type, uid, settings, created_at, updated_at 
        FROM plugins 
        ORDER BY created_at DESC
      `);

      res.status(200).json({
        success: true,
        data: rows,
        message: 'Plugins retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching plugins:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch plugins',
        error: error.message
      });
    }
  }

  // Get plugin by ID
  static async getPluginById(req, res) {
    try {
      const { id } = req.params;
      const { rows } = await mysqlDb.query(`
        SELECT id, type, uid, settings, created_at, updated_at 
        FROM plugins 
        WHERE id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Plugin not found'
        });
      }

      res.status(200).json({
        success: true,
        data: rows[0],
        message: 'Plugin retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching plugin:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch plugin',
        error: error.message
      });
    }
  }

  // Create new plugin
  static async createPlugin(req, res) {
    try {
      const { type, uid, settings } = req.body;

      // Validate required fields
      if (!type || !uid) {
        return res.status(400).json({
          success: false,
          message: 'Type and UID are required'
        });
      }

      // Check if plugin with same type and uid already exists
      const { rows: existing } = await mysqlDb.query(`
        SELECT id FROM plugins WHERE type = ? AND uid = ?
      `, [type, uid]);

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Plugin with this type and UID already exists'
        });
      }

      // Insert new plugin
      const { rows } = await mysqlDb.query(`
        INSERT INTO plugins (type, uid, settings) 
        VALUES (?, ?, ?)
      `, [type, uid, JSON.stringify(settings || {})]);

      // Get the created plugin
      const { rows: newPlugin } = await mysqlDb.query(`
        SELECT id, type, uid, settings, created_at, updated_at 
        FROM plugins 
        WHERE id = ?
      `, [rows.insertId]);

      res.status(201).json({
        success: true,
        data: newPlugin[0],
        message: 'Plugin created successfully'
      });
    } catch (error) {
      console.error('Error creating plugin:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create plugin',
        error: error.message
      });
    }
  }

  // Update plugin
  static async updatePlugin(req, res) {
    try {
      const { id } = req.params;
      const { type, uid, settings } = req.body;

      // Check if plugin exists
      const { rows: existing } = await mysqlDb.query(`
        SELECT id FROM plugins WHERE id = ?
      `, [id]);

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Plugin not found'
        });
      }

      // Update plugin
      await mysqlDb.query(`
        UPDATE plugins 
        SET type = ?, uid = ?, settings = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [type, uid, JSON.stringify(settings || {}), id]);

      // Get the updated plugin
      const { rows: updatedPlugin } = await mysqlDb.query(`
        SELECT id, type, uid, settings, created_at, updated_at 
        FROM plugins 
        WHERE id = ?
      `, [id]);

      res.status(200).json({
        success: true,
        data: updatedPlugin[0],
        message: 'Plugin updated successfully'
      });
    } catch (error) {
      console.error('Error updating plugin:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update plugin',
        error: error.message
      });
    }
  }

  // Delete plugin
  static async deletePlugin(req, res) {
    try {
      const { id } = req.params;

      // Check if plugin exists
      const { rows: existing } = await mysqlDb.query(`
        SELECT id FROM plugins WHERE id = ?
      `, [id]);

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Plugin not found'
        });
      }

      // Delete plugin
      await mysqlDb.query(`
        DELETE FROM plugins WHERE id = ?
      `, [id]);

      res.status(200).json({
        success: true,
        message: 'Plugin deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting plugin:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete plugin',
        error: error.message
      });
    }
  }
}

module.exports = PluginController;