const bcrypt = require('bcryptjs');
const postgresDb = require('../config/postgresql');
const mysqlDb = require('../config/mysql');
const { generateToken } = require('../middleware/auth');

class UserController {
  // Register user (PostgreSQL)
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Check if user exists
      const existingUser = await postgresDb.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists',
          timestamp: new Date().toISOString()
        });
      }
      
      // Create user
      const result = await postgresDb.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, passwordHash]
      );
      
      const user = result.rows[0];
      const token = generateToken({ userId: user.id, email: user.email });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.created_at
          },
          token
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const result = await postgresDb.query(
        'SELECT id, username, email, password_hash FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          timestamp: new Date().toISOString()
        });
      }
      
      const user = result.rows[0];
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          timestamp: new Date().toISOString()
        });
      }
      
      const token = generateToken({ userId: user.id, email: user.email });
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          },
          token
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all users (PostgreSQL)
  async getAllUsers(req, res, next) {
    try {
      const result = await postgresDb.query(
        'SELECT id, username, email, created_at, updated_at FROM users ORDER BY created_at DESC'
      );
      
      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users: result.rows,
          count: result.rows.length
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      const result = await postgresDb.query(
        'SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          timestamp: new Date().toISOString()
        });
      }
      
      res.json({
        success: true,
        message: 'User retrieved successfully',
        data: {
          user: result.rows[0]
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email } = req.body;
      
      // Check if user exists
      const existingUser = await postgresDb.query(
        'SELECT id FROM users WHERE id = $1',
        [id]
      );
      
      if (existingUser.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          timestamp: new Date().toISOString()
        });
      }
      
      // Build update query dynamically
      const updates = [];
      const values = [];
      let paramIndex = 1;
      
      if (username) {
        updates.push(`username = $${paramIndex++}`);
        values.push(username);
      }
      
      if (email) {
        updates.push(`email = $${paramIndex++}`);
        values.push(email);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update',
          timestamp: new Date().toISOString()
        });
      }
      
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);
      
      const result = await postgresDb.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, username, email, updated_at`,
        values
      );
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: {
          user: result.rows[0]
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      
      const result = await postgresDb.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          timestamp: new Date().toISOString()
        });
      }
      
      res.json({
        success: true,
        message: 'User deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();