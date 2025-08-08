const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ai_search_engine',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool for better performance
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ Database connection failed:', error.message);
    console.warn('📝 The application will run without database connectivity.');
    console.warn('🔧 To enable database features, please configure MySQL connection in .env file');
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create users table as an example
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    // Create search_queries table as an example for AI search engine
    const createSearchQueriesTable = `
      CREATE TABLE IF NOT EXISTS search_queries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        query_text TEXT NOT NULL,
        results_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `;

    await pool.execute(createUsersTable);
    await pool.execute(createSearchQueriesTable);
    
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.warn('⚠️ Failed to initialize database tables:', error.message);
    console.warn('📝 Database functionality will be limited without proper MySQL setup');
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};