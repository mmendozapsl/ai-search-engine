// API configuration
const API_BASE_URL = 'http://localhost:3000';

// API client class
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('token');
    }

    // Get authentication headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Authentication methods
    async login(email, password) {
        const response = await this.post('/api/auth/login', { email, password });
        if (response.success && response.data.token) {
            this.token = response.data.token;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    }

    async register(username, email, password) {
        const response = await this.post('/api/auth/register', { username, email, password });
        if (response.success && response.data.token) {
            this.token = response.data.token;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // API endpoints
    async getHealth() {
        return this.get('/health');
    }

    async getApiInfo() {
        return this.get('/api');
    }

    async getUsers() {
        return this.get('/api/users');
    }

    async getUserById(id) {
        return this.get(`/api/users/${id}`);
    }

    async updateUser(id, data) {
        return this.put(`/api/users/${id}`, data);
    }

    async deleteUser(id) {
        return this.delete(`/api/users/${id}`);
    }
}

// Create global API client instance
const api = new ApiClient(API_BASE_URL);