const mysql = require('mysql2/promise');

class MySQLDatabase {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'password',
      database: process.env.MYSQL_DATABASE || 'demo_app',
      port: process.env.MYSQL_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
    });

    console.log('✅ MySQL connection pool created');
  }

  async query(sql, params) {
    try {
      const start = Date.now();
      const [rows, fields] = await this.pool.execute(sql, params);
      const duration = Date.now() - start;
      console.log('📊 MySQL query executed', { sql, duration, rows: rows.length });
      return { rows, fields };
    } catch (error) {
      console.error('❌ MySQL query error:', error);
      throw error;
    }
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async close() {
    await this.pool.end();
    console.log('🔒 MySQL pool closed');
  }

  // Initialize database tables
  async initializeTables() {
    try {
      await this.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          user_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Create plugins table for psl-ai-search and other plugins
      await this.query(`
        CREATE TABLE IF NOT EXISTS plugins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type VARCHAR(100) NOT NULL,
          uid VARCHAR(32) NOT NULL,
          settings JSON,
          context LONGTEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_type_uid (type, uid)
        )
      `);

      // Insert demo data for plugins table
      await this.insertDemoPluginData();

      console.log('✅ MySQL tables initialized');
    } catch (error) {
      console.error('❌ Error initializing MySQL tables:', error);
      throw error;
    }
  }

  // Insert demo data for plugins table
  async insertDemoPluginData() {
    try {
      // Check if demo data already exists
      const { rows: existingPlugins } = await this.query(`
        SELECT COUNT(*) as count FROM plugins WHERE type = 'psl-ai-search'
      `);

      if (existingPlugins[0].count > 0) {
        console.log('📊 Demo plugin data already exists, skipping insertion');
        return;
      }

      // Insert demo plugin configurations
      const demoPlugins = [
        {
          type: 'psl-ai-search',
          uid: 'test-uid-001',
          settings: JSON.stringify({
            theme: 'default',
            placeholder: 'Search in CME program',
            title: 'AI Search',
            submitText: 'Search'
          }),
          context: 'You are an AI assistant helping users search through medical education content. Focus on providing accurate, relevant CME (Continuing Medical Education) information.'
        },
        {
          type: 'psl-ai-search',
          uid: 'test-uid-002',
          settings: JSON.stringify({
            theme: 'dark',
            placeholder: 'Find medical content...',
            title: 'Medical Search',
            submitText: 'Find Results'
          }),
          context: 'You are a medical search assistant. Help users find relevant medical content, research papers, and clinical guidelines. Prioritize evidence-based information.'
        },
        {
          type: 'psl-ai-search',
          uid: 'test-uid-003',
          settings: JSON.stringify({
            theme: 'compact',
            placeholder: 'Quick search',
            title: 'Quick Search',
            submitText: 'Go'
          }),
          context: 'You are a quick search assistant. Provide concise, relevant answers to user queries about medical and educational content.'
        },
        {
          type: 'psl-ai-search',
          uid: 'user-123',
          settings: JSON.stringify({
            theme: 'professional',
            placeholder: 'Search CME activities and resources',
            title: 'Professional Search',
            submitText: 'Search CME'
          }),
          context: 'You are a professional medical education assistant. Help healthcare professionals find CME activities, accredited courses, and professional development resources.'
        },
        {
          type: 'psl-ai-search',
          uid: 'search-456',
          settings: JSON.stringify({
            theme: 'simple',
            placeholder: 'Enter your search query',
            title: 'Search',
            submitText: 'Submit'
          }),
          context: 'You are a general search assistant. Help users find information across various topics with clear, accurate responses.'
        }
      ];

      for (const plugin of demoPlugins) {
        await this.query(`
          INSERT INTO plugins (type, uid, settings, context) 
          VALUES (?, ?, ?, ?)
        `, [plugin.type, plugin.uid, plugin.settings, plugin.context]);
      }

      console.log('✅ Demo plugin data inserted successfully');
    } catch (error) {
      console.error('❌ Error inserting demo plugin data:', error);
      // Don't throw error for demo data insertion
    }
  }
}

module.exports = new MySQLDatabase();