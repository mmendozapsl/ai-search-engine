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

![AI Search Engine Interface](https://github.com/user-attachments/assets/fe2474bc-3f76-430a-beba-84a6ca487c85)

## 🚀 Features

- **RESTful API**: Complete REST API with CRUD operations
- **MySQL Database**: Relational database with connection pooling
- **Security**: Helmet, CORS, rate limiting, input validation
- **Frontend Interface**: Modern responsive web interface
- **Scalable Architecture**: Modular design following best practices
- **Error Handling**: Comprehensive error handling and logging
- **Environment Configuration**: Environment-based configuration

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL2** - MySQL database driver with Promise support
- **Helmet** - Security middleware
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger
- **Express Rate Limit** - Rate limiting middleware
- **Express Validator** - Input validation and sanitization

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript (ES6+)** - Modern JavaScript features
- **Bootstrap 5** - Responsive UI framework
- **Font Awesome** - Icon library

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-search-engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=ai_search_engine
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password

   # Security
   JWT_SECRET=your-super-secret-jwt-key

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE ai_search_engine;
   ```

5. **Start the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

### Search Queries
- `GET /api/search` - Get all search queries
- `GET /api/search/:id` - Get search query by ID
- `POST /api/search` - Create new search query
- `DELETE /api/search/:id` - Delete search query
- `GET /api/search/user/:userId` - Get search queries by user
- `PUT /api/search/:id/results` - Update search results count
- `GET /api/search/stats` - Get search statistics
- `GET /api/search/popular` - Get popular search terms

### Utility
- `GET /health` - Health check endpoint
- `GET /api` - API documentation

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Search Queries Table
```sql
CREATE TABLE search_queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  query_text TEXT NOT NULL,
  results_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## 🏗️ Project Structure

```
ai-search-engine/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── userController.js    # User-related operations
│   │   └── searchController.js  # Search-related operations
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling middleware
│   │   ├── rateLimiter.js       # Rate limiting configuration
│   │   └── validation.js        # Input validation rules
│   ├── models/
│   │   ├── User.js             # User model
│   │   └── SearchQuery.js      # Search query model
│   └── routes/
│       ├── users.js            # User routes
│       └── search.js           # Search routes
├── public/
│   ├── css/
│   │   └── style.css           # Custom styles
│   └── js/
│       └── app.js              # Frontend JavaScript
├── views/
│   └── index.html              # Main HTML page
├── server.js                   # Main server file
├── package.json               # Dependencies and scripts
├── .env.example              # Environment variables template
└── README.md                 # Project documentation
```

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Validates and sanitizes user input
- **SQL Injection Prevention**: Uses parameterized queries
- **XSS Protection**: Escapes HTML in frontend display

## 🚀 Performance & Scalability

- **Connection Pooling**: MySQL connection pool for better performance
- **Environment-based Configuration**: Different settings for development/production
- **Modular Architecture**: Easy to extend and maintain
- **Error Handling**: Comprehensive error handling and logging
- **Async/Await**: Modern asynchronous JavaScript patterns

## 🔄 Development Workflow

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Test API endpoints**
   - Use the frontend interface at `http://localhost:3000`
   - Use tools like Postman or curl for direct API testing
   - Check health status at `http://localhost:3000/health`

3. **View API documentation**
   - Visit `http://localhost:3000/api` for endpoint information

## 🌟 Best Practices Implemented

- **Separation of Concerns**: Clear separation between routes, controllers, models
- **Error Handling**: Centralized error handling with custom error classes
- **Input Validation**: Comprehensive validation using express-validator
- **Security**: Multiple layers of security middleware
- **Logging**: Request logging with Morgan
- **Environment Configuration**: Flexible configuration management
- **Database Patterns**: Repository pattern with models
- **RESTful Design**: Following REST API conventions

## 🔮 Future Enhancements

- [ ] JWT Authentication & Authorization
- [ ] AI/ML Integration for actual search functionality
- [ ] Elasticsearch integration for advanced search
- [ ] Redis caching for improved performance
- [ ] WebSocket support for real-time features
- [ ] Docker containerization
- [ ] Unit and integration tests
- [ ] API versioning
- [ ] Swagger/OpenAPI documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Miguel Mendoza

---

**Note**: This is a foundation application that demonstrates best practices for building scalable Node.js applications. The AI search functionality is simulated and would need to be replaced with actual AI/ML services in a production environment.