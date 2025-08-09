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
          context: JSON.stringify([
            {
              "title": "Advanced Cancer Treatment Options",
              "description": "Comprehensive guide to modern cancer treatment approaches including immunotherapy, targeted therapy, and precision medicine",
              "url": "https://medical-education.com/cancer-treatment-guide",
              "tags": ["cancer", "treatment", "immunotherapy", "oncology", "precision-medicine"]
            },
            {
              "title": "CME: Cardiovascular Disease Prevention",
              "description": "Continuing Medical Education course covering prevention strategies for cardiovascular disease in primary care",
              "url": "https://cme-provider.com/cardio-prevention",
              "tags": ["cardiovascular", "prevention", "cme", "primary-care", "heart-disease"]
            },
            {
              "title": "Diabetes Management in Clinical Practice",
              "description": "Evidence-based approaches to diabetes management including medication selection and lifestyle interventions",
              "url": "https://medical-education.com/diabetes-management",
              "tags": ["diabetes", "management", "clinical-practice", "medication", "lifestyle"]
            }
          ])
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
          context: JSON.stringify([
            {
              "title": "Latest Medical Research Publications",
              "description": "Access to the latest peer-reviewed medical research and clinical studies",
              "url": "https://medical-research.com/latest-publications",
              "tags": ["research", "publications", "clinical-studies", "peer-reviewed", "medical"]
            },
            {
              "title": "Clinical Guidelines for Emergency Medicine",
              "description": "Evidence-based clinical guidelines for emergency medicine practitioners",
              "url": "https://emergency-medicine.com/guidelines",
              "tags": ["emergency-medicine", "clinical-guidelines", "evidence-based", "practitioners"]
            },
            {
              "title": "Pharmacology Updates for Healthcare Providers",
              "description": "Latest updates in pharmacology and drug interactions for healthcare providers",
              "url": "https://pharma-education.com/updates",
              "tags": ["pharmacology", "drug-interactions", "healthcare-providers", "medications"]
            }
          ])
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
          context: JSON.stringify([
            {
              "title": "Quick Medical Reference Guide",
              "description": "Fast access to essential medical information and quick reference materials",
              "url": "https://quick-medical-ref.com/guide",
              "tags": ["quick-reference", "medical-information", "essential", "fast-access"]
            },
            {
              "title": "Diagnostic Procedures Overview",
              "description": "Comprehensive overview of common diagnostic procedures and their applications",
              "url": "https://diagnostic-procedures.com/overview",
              "tags": ["diagnostic", "procedures", "medical-tests", "clinical-diagnosis"]
            }
          ])
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
          context: JSON.stringify([
            {
              "title": "Accredited CME Programs for Physicians",
              "description": "High-quality accredited continuing medical education programs for practicing physicians",
              "url": "https://cme-accredited.com/physicians",
              "tags": ["cme", "accredited", "physicians", "continuing-education", "professional-development"]
            },
            {
              "title": "Board Certification Review Courses",
              "description": "Comprehensive review courses for medical board certification and recertification",
              "url": "https://board-cert-review.com/courses",
              "tags": ["board-certification", "review-courses", "recertification", "medical-boards"]
            },
            {
              "title": "Professional Development for Healthcare Workers",
              "description": "Career advancement and professional development resources for healthcare professionals",
              "url": "https://healthcare-professional-dev.com/resources",
              "tags": ["professional-development", "healthcare-workers", "career-advancement", "resources"]
            }
          ])
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
          context: JSON.stringify([
            {
              "title": "General Health Information Hub",
              "description": "Reliable health information and medical knowledge for general audiences",
              "url": "https://health-info-hub.com/general",
              "tags": ["health-information", "medical-knowledge", "general-health", "reliable"]
            },
            {
              "title": "Medical Encyclopedia and Dictionary",
              "description": "Comprehensive medical encyclopedia with definitions and explanations",
              "url": "https://medical-encyclopedia.com/dictionary",
              "tags": ["medical-encyclopedia", "dictionary", "definitions", "medical-terms"]
            },
            {
              "title": "Health and Wellness Resources",
              "description": "Resources for maintaining health and wellness across different life stages",
              "url": "https://wellness-resources.com/health",
              "tags": ["health", "wellness", "resources", "life-stages", "preventive-care"]
            }
          ])
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