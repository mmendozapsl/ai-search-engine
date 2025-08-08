# Hackathon-2025: AI Semantic Search Engine

An AI-powered Semantic Search Engine for CME platforms to search using natural language like:

“Short videos on insulin titration for elderly patients”

“CME on managing chronic kidney disease in diabetics”

“Upcoming events on sepsis diagnosis”

Instead of relying on rigid keyword matching, the engine will understand intent and medical context to return precise, relevant results.

## Usage Example
To embed the plugin on any website.

1. Add elements with uid attributes:
```
<!-- Add elements with uid attributes -->
<psl-ai-search uid="user-123"></psl-ai-search>
<psl-ai-search uid="search-456"></psl-ai-search>
```

2. Include the plugin script
* With the execution of an script (recomended):
```
<script>(function() {const u = 'http://{backendServer}/v1/embed/psl-ai-search.js';const d = document;const e = d.createElement('script');e.src = u;e.id = 'psl-ai-srshsc';d.body.appendChild(e);})();</script>
```
* Loading the script directly
```
<script src="https://{backendServer}/v1/embed/psl-ai-search.js"></script>
```

The plugin will automatically:

1. Scan for psl-ai-search elements on page load
2. Extract the uid from each element
3. Send POST requests to /api/v1/psl-ai-search with the UID
4. Emit custom events for successful processing

## Stack

This project is a complete full-stack application built with Node.js, Express.js, PostgreSQL, and MySQL with features to embed the Search Plugin on CME pages.

## 🚀 Features

### Backend
- **Express.js** REST API server
- **Dual Database Support**: PostgreSQL and MySQL
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Security**: Helmet, CORS, input validation
- **Error Handling**: Centralized error handling with detailed logging
- **Database Connections**: Connection pooling for both databases
- **Environment Configuration**: Flexible environment-based configuration
- **API Documentation**: Built-in API documentation endpoint

### Frontend
- **Responsive Design**: Bootstrap-based responsive UI
- **API Integration**: Complete API client with authentication
- **Real-time Testing**: Interactive API testing dashboard
- **Authentication UI**: Login and registration forms
- **Status Monitoring**: Real-time backend status monitoring

## 🏗️ Architecture

```
ai-search-engine/
├── backend/                 # Node.js + Express.js API server
│   ├── src/
│   │   ├── controllers/     # Business logic controllers
│   │   ├── middleware/      # Custom middleware (auth, validation, errors)
│   │   ├── routes/          # API route definitions
│   │   ├── config/          # Database configurations
│   │   └── app.js          # Main application entry point
│   ├── .env.example        # Environment variables template
│   └── package.json        # Backend dependencies
├── frontend/               # HTML/CSS/JS frontend
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── index.html         # Main HTML file
│   └── package.json       # Frontend dependencies
└── package.json           # Root package.json with workspaces
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js v20+
- **Framework**: Express.js v4.18+
- **Databases**: PostgreSQL v12+ & MySQL v8+
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS
- **Validation**: Joi
- **Logging**: Morgan
- **Environment**: dotenv

### Frontend
- **HTML5** with semantic markup
- **CSS3** with Bootstrap 5
- **Vanilla JavaScript** (ES6+)
- **HTTP Server** for development

## 📦 Quick Start

### Prerequisites
- Node.js v20+ and npm
- PostgreSQL database server
- MySQL database server

### 1. Clone and Install
```bash
git clone <repository-url>
cd ai-search-engine
npm run install:all
```

### 2. Database Setup

#### PostgreSQL
```sql
CREATE DATABASE demo_app;
CREATE USER demo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE demo_app TO demo_user;
```

#### MySQL
```sql
CREATE DATABASE demo_app;
CREATE USER 'demo_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON demo_app.* TO 'demo_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Configuration
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Start the Application
```bash
# Development mode (runs both frontend and backend)
npm run dev

# OR start individually
npm run dev:backend  # Backend on http://localhost:3000
npm run dev:frontend # Frontend on http://localhost:3001
```

## 🔑 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# PostgreSQL Configuration
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=demo_app
PG_USER=demo_user
PG_PASSWORD=your_password

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=demo_app
MYSQL_USER=demo_user
MYSQL_PASSWORD=your_password
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Management (Protected)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### System Endpoints
- `GET /health` - Health check
- `GET /api` - API documentation

### Request/Response Examples

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

#### Get Users (Protected)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database Schema

### PostgreSQL (Users & Posts)
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MySQL (Users & Products)
```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🛡️ Security Best Practices

### Implemented Security Measures
1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based authentication
3. **Input Validation**: Joi schema validation
4. **SQL Injection Prevention**: Parameterized queries
5. **CORS Configuration**: Restricted cross-origin requests
6. **Security Headers**: Helmet middleware
7. **Environment Variables**: Sensitive data in environment files
8. **Error Handling**: Secure error messages (no sensitive data exposure)

### Additional Recommendations
1. **HTTPS**: Use HTTPS in production
2. **Rate Limiting**: Implement rate limiting middleware
3. **Database Encryption**: Enable database encryption at rest
4. **Monitoring**: Add application monitoring and logging
5. **Backup Strategy**: Implement regular database backups

## 🎯 Scalability Best Practices

### Current Implementation
1. **Connection Pooling**: Database connection pools for both PostgreSQL and MySQL
2. **Stateless Authentication**: JWT tokens for horizontal scaling
3. **Modular Architecture**: Separated concerns (controllers, middleware, routes)
4. **Environment Configuration**: Easy deployment across environments
5. **Error Handling**: Centralized error handling
6. **Logging**: Structured logging with Morgan

### Scaling Recommendations
1. **Load Balancing**: Use nginx or cloud load balancers
2. **Caching**: Implement Redis for session and data caching
3. **Database Optimization**: Add database indexing and query optimization
4. **CDN**: Use CDN for static assets
5. **Microservices**: Split into microservices as the application grows
6. **Container Deployment**: Use Docker for consistent deployments
7. **Monitoring**: Add APM tools like New Relic or DataDog

## 🧪 Testing

The application includes:
- Interactive frontend testing dashboard
- API endpoint testing
- Authentication flow testing
- Database connection testing

To test manually:
1. Start the application: `npm run dev`
2. Open http://localhost:3001
3. Use the testing dashboard to interact with the API

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production database connections
4. Enable HTTPS
5. Set up proper logging
6. Configure monitoring
7. Set up automated backups

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile example
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
