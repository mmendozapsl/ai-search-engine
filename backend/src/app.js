const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const pluginRoutes = require('./routes/pluginRoutes');
const pslAiSearchRoutes = require('./routes/pslAiSearchRoutes');

// Database connections
const postgresDb = require('./config/postgresql');
const mysqlDb = require('./config/mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: true, // Allow all origins for plugin embedding
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize databases
async function initializeDatabases() {
  console.log('🔄 Initializing databases...');
  
  // Initialize PostgreSQL (optional)
  try {
    await postgresDb.initializeTables();
    console.log('✅ PostgreSQL initialized successfully');
  } catch (error) {
    console.log('⚠️ PostgreSQL not available, skipping...');
  }

  // Initialize MySQL (optional)
  try {
    await mysqlDb.initializeTables();
    console.log('✅ MySQL initialized successfully');
  } catch (error) {
    console.log('⚠️ MySQL not available, skipping...');
  }
  
  console.log('✅ Database initialization completed');
}

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    message: 'Server is running',
    messageDetail: process.env.FRONTEND_URL,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    databases: {
      postgresql: 'unknown',
      mysql: 'unknown'
    }
  };

  // Test PostgreSQL connection
  try {
    await postgresDb.query('SELECT 1');
    health.databases.postgresql = 'connected';
  } catch (error) {
    health.databases.postgresql = 'disconnected';
  }

  // Test MySQL connection
  try {
    await mysqlDb.query('SELECT 1');
    health.databases.mysql = 'connected';
  } catch (error) {
    health.databases.mysql = 'disconnected';
  }

  res.status(200).json(health);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/v1', pslAiSearchRoutes);

// Plugin routes
app.use('/v1', pluginRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'AI Semantic Search Engine - API Server',
    version: '1.0.0',
    databases: {
      postgresql: {
        purpose: 'User management and posts',
        tables: ['users', 'posts']
      },
      mysql: {
        purpose: 'Product management',
        tables: ['users', 'products']
      }
    },
    endpoints: {
      health: 'GET /health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      },
      products: {
        getAll: 'GET /api/products',
        getById: 'GET /api/products/:id',
        create: 'POST /api/products',
        update: 'PUT /api/products/:id',
        delete: 'DELETE /api/products/:id'
      },
      pslAiSearch: {
        search: 'POST /api/v1/psl-ai-search'
      },
      plugins: {
        pslAiSearchScript: 'GET /v1/embed/psl-ai-search.js',
        getAll: 'GET /v1/plugins',
        getById: 'GET /v1/plugins/:id',
        create: 'POST /v1/plugins',
        update: 'PUT /v1/plugins/:id',
        delete: 'DELETE /v1/plugins/:id'
      }
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
  console.log(`💓 Health Check: http://localhost:${PORT}/health`);
  
  // Initialize databases after server starts
  await initializeDatabases();
});

module.exports = app;