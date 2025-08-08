const { pool } = require('../config/database');

class User {
  // Create a new user
  static async create(userData) {
    const { name, email } = userData;
    
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    const [result] = await pool.execute(query, [name, email]);
    
    return {
      id: result.insertId,
      name,
      email
    };
  }

  // Get all users
  static async findAll() {
    const query = 'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC';
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Get user by ID
  static async findById(id) {
    const query = 'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  // Get user by email
  static async findByEmail(email) {
    const query = 'SELECT id, name, email, created_at, updated_at FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  // Update user
  static async update(id, userData) {
    const { name, email } = userData;
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    const [result] = await pool.execute(query, [name, email, id]);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  // Delete user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Get user count
  static async count() {
    const query = 'SELECT COUNT(*) as count FROM users';
    const [rows] = await pool.execute(query);
    return rows[0].count;
  }
}

module.exports = User;