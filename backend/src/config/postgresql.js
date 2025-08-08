const { Pool } = require('pg');

class PostgreSQLDatabase {
  constructor() {
    this.pool = new Pool({
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: process.env.PG_DATABASE || 'demo_app',
      password: process.env.PG_PASSWORD || 'password',
      port: process.env.PG_PORT || 5432,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });

    this.pool.on('connect', () => {
      console.log('✅ PostgreSQL client connected');
    });

    this.pool.on('error', (err) => {
      console.error('❌ PostgreSQL connection error:', err);
    });
  }

  async query(text, params) {
    try {
      const start = Date.now();
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('📊 PostgreSQL query executed', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('❌ PostgreSQL query error:', error);
      throw error;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async close() {
    await this.pool.end();
    console.log('🔒 PostgreSQL pool closed');
  }

  // Initialize database tables
  async initializeTables() {
    try {
      await this.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          content TEXT,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ PostgreSQL tables initialized');
    } catch (error) {
      console.error('❌ Error initializing PostgreSQL tables:', error);
      throw error;
    }
  }
}

module.exports = new PostgreSQLDatabase();