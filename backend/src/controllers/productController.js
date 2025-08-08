const mysqlDb = require('../config/mysql');

class ProductController {
  // Get all products (MySQL)
  async getAllProducts(req, res, next) {
    try {
      const { rows } = await mysqlDb.query(
        'SELECT p.*, u.username as owner FROM products p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC'
      );
      
      res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: {
          products: rows,
          count: rows.length
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Get product by ID
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      
      const { rows } = await mysqlDb.query(
        'SELECT p.*, u.username as owner FROM products p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString()
        });
      }
      
      res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: {
          product: rows[0]
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Create product
  async createProduct(req, res, next) {
    try {
      const { name, description, price } = req.body;
      const userId = req.user.userId;
      
      const { rows } = await mysqlDb.query(
        'INSERT INTO products (name, description, price, user_id) VALUES (?, ?, ?, ?)',
        [name, description, price, userId]
      );
      
      // Get the created product
      const { rows: newProduct } = await mysqlDb.query(
        'SELECT p.*, u.username as owner FROM products p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?',
        [rows.insertId]
      );
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: {
          product: newProduct[0]
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Update product
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      const userId = req.user.userId;
      
      // Check if product exists and belongs to user
      const { rows: existingProduct } = await mysqlDb.query(
        'SELECT id, user_id FROM products WHERE id = ?',
        [id]
      );
      
      if (existingProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString()
        });
      }
      
      if (existingProduct[0].user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product',
          timestamp: new Date().toISOString()
        });
      }
      
      // Build update query dynamically
      const updates = [];
      const values = [];
      
      if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
      }
      
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
      }
      
      if (price !== undefined) {
        updates.push('price = ?');
        values.push(price);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update',
          timestamp: new Date().toISOString()
        });
      }
      
      values.push(id);
      
      await mysqlDb.query(
        `UPDATE products SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );
      
      // Get updated product
      const { rows: updatedProduct } = await mysqlDb.query(
        'SELECT p.*, u.username as owner FROM products p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?',
        [id]
      );
      
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: {
          product: updatedProduct[0]
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete product
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      // Check if product exists and belongs to user
      const { rows: existingProduct } = await mysqlDb.query(
        'SELECT id, user_id FROM products WHERE id = ?',
        [id]
      );
      
      if (existingProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString()
        });
      }
      
      if (existingProduct[0].user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this product',
          timestamp: new Date().toISOString()
        });
      }
      
      await mysqlDb.query('DELETE FROM products WHERE id = ?', [id]);
      
      res.json({
        success: true,
        message: 'Product deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();