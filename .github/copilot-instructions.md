# AI Search Engine - GitHub Copilot Instructions

This is a Node.js + Express.js full-stack monorepo application with PostgreSQL and MySQL database connectivity that provides AI Search Engine tools to embed AI capabilities into web applications. It includes a RESTful API server, a separate frontend interface, and robust security features.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- **Prerequisites**: Node.js v14+ and optionally PostgreSQL/MySQL servers
- **Monorepo Structure**: Separate `backend/` and `frontend/` applications
- **Environment Setup**:
  ```bash
  cp backend/.env.example backend/.env
  ```
- **Database Setup** (OPTIONAL - Application works without databases):
  ```bash
  # PostgreSQL (for user management and posts)
  sudo systemctl start postgresql
  sudo -u postgres createdb ai_search_engine
  
  # MySQL (for product management)  
  sudo systemctl start mysql
  sudo mysql -e "CREATE DATABASE IF NOT EXISTS ai_search_engine;"
  
  # Update backend/.env with correct database credentials
  ```

### Install Dependencies and Build
- **Install All**: `npm run install:all` -- installs root, backend, and frontend dependencies (takes 30-60 seconds)
- **Alternative**: `npm install && cd backend && npm install && cd ../frontend && npm install`
- **IMPORTANT**: No separate build step required - this is a runtime application

### Run the Application
- **Development mode**: `npm run dev` -- runs both backend and frontend concurrently
- **Production mode**: `npm start` -- runs backend only
- **Backend only**: `npm run dev:backend` -- backend development mode
- **Frontend only**: `npm run dev:frontend` -- frontend development mode
- **Startup time**: Applications start in under 15 seconds. NEVER CANCEL.
- **Application URLs**:
  - Frontend: http://localhost:3001 (separate http-server)
  - Backend API: http://localhost:3000
  - Health Check: http://localhost:3000/health
  - API Documentation: http://localhost:3000/api

### Testing and Validation
- **No API Test Script**: No automated test script found in current structure
- **Manual Testing**: Use curl commands to test API endpoints
- **No formal test suite**: Backend uses Jest but no tests implemented yet
- **No linting configured**: No ESLint or other linting tools are set up

## Validation Scenarios

### CRITICAL: Always test these scenarios after making changes:
1. **Health Check**: Verify `curl http://localhost:3000/health` returns success
2. **Database Connectivity**: Check application logs (databases are optional)
3. **Frontend Interface**: Navigate to http://localhost:3001 and verify the interface loads
4. **User Management**: Test user registration via POST to /api/auth/register
5. **API Documentation**: Verify /api endpoint returns complete endpoint list

### Manual Testing Workflow:
```bash
# 1. Start both applications
npm run dev

# 2. Test health endpoint
curl http://localhost:3000/health

# 3. Test API documentation
curl http://localhost:3000/api

# 4. Register a test user
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}' \
  http://localhost:3000/api/auth/register

# 5. Test frontend in browser at http://localhost:3001
```

## Project Structure and Key Locations

### Root Level (Monorepo)
- `package.json` - Root package.json with workspace configuration and dev scripts
- `backend/` - Express.js API server application
- `frontend/` - Static HTML/CSS/JS frontend application
- `.gitignore` - Git ignore rules for Node.js monorepo

### Backend Application (`backend/` directory)
- `backend/src/app.js` - Main application entry point and Express.js setup
- `backend/package.json` - Backend dependencies and scripts (start, dev)
- `backend/.env` - Environment configuration (copy from .env.example)

### Backend Source Code Organization (`backend/src/` directory)
- `backend/src/config/` - Database configurations:
  - `postgresql.js` - PostgreSQL database configuration and connection pooling
  - `mysql.js` - MySQL database configuration and connection pooling
- `backend/src/controllers/` - Business logic controllers (files may vary)
- `backend/src/routes/` - Express.js route definitions:
  - `authRoutes.js` - Authentication routes (/api/auth/*)
  - `userRoutes.js` - User management routes (/api/users/*)
  - `productRoutes.js` - Product management routes (/api/products/*)
  - `pluginRoutes.js` - Plugin embedding routes (/v1/embed/*)
  - `pslAiSearchRoutes.js` - PSL AI Search routes (/api/v1/psl-ai-search)
- `backend/src/middleware/` - Express.js middleware:
  - `errorMiddleware.js` - Centralized error handling
- `backend/src/plugins/` - Plugin-related functionality

### Frontend Application (`frontend/` directory)
- `frontend/index.html` - Main HTML interface
- `frontend/package.json` - Frontend dependencies (http-server)
- `frontend/css/style.css` - Custom styles
- `frontend/js/app.js` - Frontend JavaScript functionality
- `frontend/test-*.html` - Test pages for plugin functionality

## Common Development Tasks

### Environment Configuration
The backend application requires these environment variables in `backend/.env`:
```env
# Server Configuration  
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# PostgreSQL Configuration (Optional - for user management)
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=ai_search_engine
PG_USER=postgres
PG_PASSWORD=password

# MySQL Configuration (Optional - for product management)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=ai_search_engine
MYSQL_USER=root
MYSQL_PASSWORD=root
```

### Database Schema
Tables are auto-created on application startup (if databases are available):
- PostgreSQL: `users`, `posts` tables 
- MySQL: `users`, `products` tables

### API Endpoints Reference
```
Health:
- GET /health - Application health check

Authentication:
- POST /api/auth/register - User registration
- POST /api/auth/login - User authentication

Users:
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID  
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

Products:
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

PSL AI Search:
- POST /api/v1/psl-ai-search - Handle AI search requests

Plugins:
- GET /v1/embed/psl-ai-search.js - Get plugin embed script

Utility:
- GET /api - API documentation
```

## Troubleshooting Common Issues

### Database Connection Issues
- **Problem**: PostgreSQL or MySQL connection errors
- **Solution**: Databases are optional - application will run without them. Update `backend/.env` with correct credentials if you want database functionality

### Application Won't Start
- **Problem**: Port 3000 or 3001 already in use
- **Solution**: Change PORT in `backend/.env` or kill conflicting processes

### Frontend Not Loading
- **Problem**: Frontend not accessible at http://localhost:3001
- **Solution**: Make sure both backend and frontend are running with `npm run dev`

### Dependencies Installation Issues
- **Problem**: npm install failures
- **Solution**: Try `npm run install:all` or install each workspace separately

### Concurrently Issues
- **Problem**: Development mode not starting both applications
- **Solution**: Install concurrently globally: `npm install -g concurrently`

## Security and Performance Notes

- **Security**: Application includes Helmet, CORS, JWT authentication, and input validation
- **Performance**: Uses database connection pooling when databases are available
- **Environment**: Configured for development by default; production settings available in code
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Databases**: Optional - application works without PostgreSQL/MySQL connections

## Development Best Practices

### Before Making Changes:
1. Always run `npm run install:all` to ensure all dependencies are installed
2. Start development mode with `npm run dev`
3. Test the health endpoint: `curl http://localhost:3000/health`
4. Verify both frontend (3001) and backend (3000) are accessible

### After Making Changes:
1. Test affected API endpoints manually with curl
2. Test frontend functionality at http://localhost:3001
3. Test backend functionality at http://localhost:3000
4. Verify no console errors in application logs

### Code Organization:
- **Backend**: Follow the existing structure in `backend/src/`
- Add new routes in `backend/src/routes/`
- Add business logic in `backend/src/controllers/`
- Add database operations in `backend/src/config/`
- Add middleware in `backend/src/middleware/`
- **Frontend**: Add features in `frontend/` directory

## Important Notes

- **Monorepo Structure**: Use workspace-aware commands or navigate to specific directories
- **Database Independence**: Application runs without databases - they provide additional functionality
- **Frontend Separation**: Frontend is a separate application on port 3001
- **Plugin System**: Includes embeddable plugin functionality for external websites
- **JWT Authentication**: Implements token-based authentication system
- **No formal testing framework**: Manual testing required using curl and browser
- **No linting configured**: Follow existing code style patterns