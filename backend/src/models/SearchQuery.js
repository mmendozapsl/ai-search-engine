const { pool } = require('../config/database');

class SearchQuery {
  // Create a new search query
  static async create(queryData) {
    const { user_id, query_text, results_count = 0 } = queryData;
    
    const query = 'INSERT INTO search_queries (user_id, query_text, results_count) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [user_id, query_text, results_count]);
    
    return {
      id: result.insertId,
      user_id,
      query_text,
      results_count
    };
  }

  // Get all search queries
  static async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT sq.id, sq.user_id, sq.query_text, sq.results_count, sq.created_at,
             u.name as user_name, u.email as user_email
      FROM search_queries sq
      LEFT JOIN users u ON sq.user_id = u.id
      ORDER BY sq.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(query, [limit, offset]);
    return rows;
  }

  // Get search queries by user ID
  static async findByUserId(userId, limit = 20, offset = 0) {
    const query = `
      SELECT id, query_text, results_count, created_at
      FROM search_queries
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(query, [userId, limit, offset]);
    return rows;
  }

  // Get search query by ID
  static async findById(id) {
    const query = `
      SELECT sq.id, sq.user_id, sq.query_text, sq.results_count, sq.created_at,
             u.name as user_name, u.email as user_email
      FROM search_queries sq
      LEFT JOIN users u ON sq.user_id = u.id
      WHERE sq.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  // Update search query results count
  static async updateResultsCount(id, resultsCount) {
    const query = 'UPDATE search_queries SET results_count = ? WHERE id = ?';
    const [result] = await pool.execute(query, [resultsCount, id]);
    return result.affectedRows > 0;
  }

  // Delete search query
  static async delete(id) {
    const query = 'DELETE FROM search_queries WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Get search statistics
  static async getStats() {
    const queries = [
      'SELECT COUNT(*) as total_queries FROM search_queries',
      'SELECT COUNT(DISTINCT user_id) as unique_users FROM search_queries WHERE user_id IS NOT NULL',
      'SELECT AVG(results_count) as avg_results FROM search_queries WHERE results_count > 0'
    ];
    
    const results = await Promise.all(
      queries.map(query => pool.execute(query))
    );
    
    return {
      total_queries: results[0][0][0].total_queries,
      unique_users: results[1][0][0].unique_users,
      avg_results: parseFloat(results[2][0][0].avg_results || 0).toFixed(2)
    };
  }

  // Get popular search terms
  static async getPopularTerms(limit = 10) {
    const query = `
      SELECT query_text, COUNT(*) as frequency, AVG(results_count) as avg_results
      FROM search_queries
      GROUP BY query_text
      ORDER BY frequency DESC, avg_results DESC
      LIMIT ?
    `;
    const [rows] = await pool.execute(query, [limit]);
    return rows;
  }
}

module.exports = SearchQuery;