# AI Search Engine - GitHub Copilot Instructions

This is a Node.js + Express.js full-stack application with MySQL database connectivity that provides a foundation for an AI-powered search engine. Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- **Prerequisites**: Node.js v14+ and MySQL server are required
- **Environment Setup**:
  ```bash
  cp .env.example .env
  ```
- **MySQL Database Setup** (CRITICAL - Required for application to work):
  ```bash
  # Start MySQL service (if not running)
  sudo systemctl start mysql
  
  # Create database using debian-sys-maint user (Ubuntu/Debian systems)
  sudo mysql --defaults-file=/etc/mysql/debian.cnf -e "CREATE DATABASE IF NOT EXISTS ai_search_engine;"
  
  # Update .env file with correct MySQL credentials:
  # For Ubuntu/Debian systems, use debian-sys-maint user from /etc/mysql/debian.cnf
  # For other systems, use your MySQL root credentials
  ```

### Install Dependencies and Build
- **Install**: `npm install` -- takes 8-10 seconds. NEVER CANCEL.
- **IMPORTANT**: No separate build step required - this is a runtime application

### Run the Application
- **Development mode**: `npm run dev` -- starts with nodemon for auto-restart
- **Production mode**: `npm start` -- standard Node.js startup
- **Startup time**: Both modes start in under 10 seconds. NEVER CANCEL.
- **Application URLs**:
  - Frontend: http://localhost:3000
  - Health Check: http://localhost:3000/health
  - API Documentation: http://localhost:3000/api

### Testing and Validation
- **API Test Script**: `./test-api.sh` -- validates all endpoints
- **No formal test suite**: Application uses `echo "Error: no test specified"` for npm test
- **No linting configured**: No ESLint or other linting tools are set up

## Validation Scenarios

### CRITICAL: Always test these scenarios after making changes:
1. **Health Check**: Verify `curl http://localhost:3000/health` returns success
2. **Database Connectivity**: Check application logs show "Database connected successfully"
3. **Frontend Interface**: Navigate to http://localhost:3000 and verify the interface loads
4. **User Management**: Test user creation via POST to /api/users
5. **Search Functionality**: Test search query creation via POST to /api/search
6. **API Documentation**: Verify /api endpoint returns complete endpoint list

### Manual Testing Workflow:
```bash
# 1. Start application
npm run dev

# 2. Test health endpoint
curl http://localhost:3000/health

# 3. Create a test user
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}' \
  http://localhost:3000/api/users

# 4. Create a search query  
curl -X POST -H "Content-Type: application/json" \
  -d '{"user_id":1,"query_text":"test search","results_count":50}' \
  http://localhost:3000/api/search

# 5. Test frontend in browser at http://localhost:3000
```

## Project Structure and Key Locations

### Core Application Files
- `server.js` - Main application entry point and Express.js setup
- `package.json` - Dependencies and npm scripts (start, dev)
- `.env` - Environment configuration (copy from .env.example)

### Source Code Organization (`src/` directory)
- `src/config/database.js` - MySQL database configuration and connection pooling
- `src/controllers/` - Business logic controllers:
  - `userController.js` - User CRUD operations
  - `searchController.js` - Search query operations
- `src/models/` - Database models:
  - `User.js` - User data model
  - `SearchQuery.js` - Search query data model
- `src/routes/` - Express.js route definitions:
  - `users.js` - User API routes (/api/users/*)
  - `search.js` - Search API routes (/api/search/*)
- `src/middleware/` - Express.js middleware:
  - `errorHandler.js` - Centralized error handling
  - `rateLimiter.js` - API rate limiting configuration
  - `validation.js` - Input validation rules

### Frontend Files
- `views/index.html` - Main HTML interface
- `public/css/style.css` - Custom styles
- `public/js/app.js` - Frontend JavaScript functionality

### Configuration Files
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules for Node.js projects
- `test-api.sh` - API testing script

## Common Development Tasks

### Environment Configuration
The application requires these environment variables in `.env`:
```env
# Server Configuration  
PORT=3000
NODE_ENV=development

# Database Configuration (UPDATE THESE)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ai_search_engine
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password

# Security
JWT_SECRET=your-super-secret-jwt-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Schema
Tables are auto-created on application startup:
- `users` table: id, name, email, created_at, updated_at
- `search_queries` table: id, user_id, query_text, results_count, created_at

### API Endpoints Reference
```
Users:
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID  
- POST /api/users - Create user (requires: name, email)
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user
- GET /api/users/stats - Get user statistics

Search:
- GET /api/search - Get all search queries
- GET /api/search/:id - Get search query by ID
- POST /api/search - Create search query (requires: query_text, optional: user_id, results_count)
- DELETE /api/search/:id - Delete search query
- GET /api/search/user/:userId - Get searches by user
- PUT /api/search/:id/results - Update results count
- GET /api/search/stats - Get search statistics
- GET /api/search/popular - Get popular search terms

Utility:
- GET /health - Health check
- GET /api - API documentation
```

## Troubleshooting Common Issues

### Database Connection Issues
- **Problem**: "Access denied for user 'root'@'localhost'"
- **Solution**: Update `.env` with correct MySQL credentials or use debian-sys-maint user on Ubuntu/Debian systems

### Application Won't Start
- **Problem**: Port 3000 already in use
- **Solution**: Change PORT in `.env` or stop conflicting process

### Frontend Not Loading
- **Problem**: CSS/JS files blocked or not loading
- **Solution**: This is normal in sandboxed environments; core functionality still works

### MySQL Service Not Running
- **Problem**: Database connection failed
- **Solution**: Start MySQL service with `sudo systemctl start mysql`

## Security and Performance Notes

- **Security**: Application includes Helmet, CORS, rate limiting, and input validation
- **Performance**: Uses MySQL connection pooling for better database performance
- **Environment**: Configured for development by default; production settings available in code
- **Error Handling**: Comprehensive error handling with stack traces in development mode

## Development Best Practices

### Before Making Changes:
1. Always run `npm run dev` to start in development mode
2. Test the health endpoint: `curl http://localhost:3000/health`
3. Verify database connectivity in application logs

### After Making Changes:
1. Test affected API endpoints manually
2. Run `./test-api.sh` to validate all endpoints
3. Test frontend functionality at http://localhost:3000
4. Verify no console errors in application logs

### Code Organization:
- Follow the existing MVC pattern (models, views, controllers)
- Add new routes in `src/routes/`
- Add business logic in `src/controllers/`
- Add database operations in `src/models/`
- Add middleware in `src/middleware/`

## Important Notes

- **No formal testing framework**: Manual testing required
- **No linting configured**: Follow existing code style
- **Database auto-initialization**: Tables are created automatically on startup
- **AI functionality is simulated**: Replace with actual AI/ML services for production use
- **Frontend uses CDNs**: Some external resources may not load in restricted environments