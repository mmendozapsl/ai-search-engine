# AI Search Engine

An AI-powered Semantic Search Engine restructured with separate frontend and backend services. This project provides AI search capabilities for CME platforms using natural language queries like:

"Short videos on insulin titration for elderly patients"

"CME on managing chronic kidney disease in diabetics"

"Upcoming events on sepsis diagnosis"

Instead of relying on rigid keyword matching, the engine will understand intent and medical context to return precise, relevant results.

![AI Search Engine Interface](https://github.com/user-attachments/assets/7ed340bd-d356-4778-9a4c-1c87e710537b)

## 🏗️ Architecture

This project follows an **architecture** with separate services:

```
/
├── backend/                  # Node.js + Express.js API server
│   ├── src/
│   │   ├── controllers/      # Business logic controllers
│   │   ├── middleware/       # Custom middleware (auth, validation, errors)
│   │   ├── routes/           # API route definitions
│   │   ├── config/           # Database configurations
│   │   └── models/           # Data models
│   ├── app.js                # Main application entry point
│   ├── .env.example          # Environment variables template
│   └── package.json          # Backend dependencies
├── frontend/                 # HTML/CSS/JS frontend
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   ├── index.html            # Main HTML file
│   └── package.json          # Frontend dependencies
└── package.json              # Root package.json with workspaces
```

## 🚀 Key Features

### Backend Services
- **RESTful API**: Complete REST API with CRUD operations
- **MySQL Database**: Relational database with connection pooling
- **Security**: Helmet, CORS, rate limiting, input validation
- **Error Handling**: Comprehensive error handling and logging
- **Environment Configuration**: Environment-based configuration

### Frontend Services
- **Public Welcome Page**: Landing page for all users
- **Registered User Dashboard**: Interactive dashboard for authenticated users
- **AI Search Interface**: Natural language search capabilities
- **Responsive Design**: Modern, responsive web interface

### AI Search Plugin
- **Embeddable Plugin**: Can be embedded on external websites
- **Natural Language Processing**: Semantic search capabilities
- **Real-time Results**: Fast search response times

## 🛠️ Quick Start

### Prerequisites
- Node.js v14+ 
- MySQL server (optional for basic functionality)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ai-search-engine
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (optional):
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MySQL credentials
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:3000/api
   - Health Check: http://localhost:3000/health

## 📦 Workspace Commands

The project uses npm workspaces for efficient dependency management:

```bash
# Start backend development server
npm run dev

# Start backend production server  
npm run start

# Install dependencies for all workspaces
npm run install-all

# Run tests in all workspaces
npm test
```

## 🔌 Plugin Usage

To embed the AI search plugin on any website:

1. **Add elements with uid attributes**:
   ```html
   <psl-ai-search uid="user-123"></psl-ai-search>
   <psl-ai-search uid="search-456"></psl-ai-search>
   ```

2. **Include the plugin script**:
   ```html
   <script>
   (function() {
     const u = 'http://localhost:3000/tools/v1/embed/psl-ai-search.js';
     const d = document;
     const e = d.createElement('script');
     e.src = u;
     e.id = 'psl-ai-srshsc';
     d.body.appendChild(e);
   })();
   </script>
   ```

## 🏛️ Service Architecture

### Backend API (`/backend`)
- **Purpose**: Handles all business logic, data persistence, and API routing
- **Technology**: Node.js + Express.js + MySQL
- **Responsibilities**: 
  - User management
  - Search query processing
  - AI search functionality
  - Data persistence
  - API security

### Frontend Client (`/frontend`)  
- **Purpose**: Provides user interface for both public and registered users
- **Technology**: HTML5 + CSS3 + Vanilla JavaScript
- **Responsibilities**:
  - Public welcome page
  - User dashboard
  - Search interface
  - API integration

## 🧪 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID  
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Search
- `GET /api/search` - Get all search queries
- `POST /api/search` - Create search query
- `GET /api/search/stats` - Get search statistics
- `GET /api/search/popular` - Get popular search terms

### AI Search Plugin
- `POST /api/v1/psl-ai-search` - Handle plugin requests
- `GET /api/v1/psl-ai-search/stats` - Get plugin statistics

### Utility
- `GET /health` - Health check
- `GET /api` - API documentation

## 🔧 Development

### Project Structure
- **Root**: Contains workspace configuration and shared dependencies
- **Backend Service**: Self-contained API server with all business logic
- **Frontend Service**: Static web assets served by the backend

### Database Setup
The application works without a database for basic functionality. To enable full features:

1. Install and start MySQL
2. Create database: `ai_search_engine`
3. Configure connection in `backend/.env`
4. Tables are auto-created on startup

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
