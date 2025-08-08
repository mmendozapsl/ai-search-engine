// AI Search Engine Frontend Application
class AISearchEngine {
    constructor() {
        this.baseURL = window.location.origin;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
    }

    bindEvents() {
        // Search form submission
        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        // User form submission
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateUser();
        });

        // Navigation smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    async loadInitialData() {
        await Promise.all([
            this.loadUsers(),
            this.loadSearchStats(),
            this.loadPopularTerms(),
            this.loadRecentSearches()
        ]);
    }

    async handleSearch() {
        const queryText = document.getElementById('searchQuery').value.trim();
        const userId = document.getElementById('userId').value.trim();

        if (!queryText) {
            this.showAlert('Please enter a search query', 'warning');
            return;
        }

        try {
            const payload = {
                query_text: queryText,
                ...(userId && { user_id: parseInt(userId) })
            };

            const response = await this.apiCall('/api/search', 'POST', payload);
            
            if (response.success) {
                this.showAlert('Search completed successfully!', 'success');
                document.getElementById('searchForm').reset();
                await this.loadRecentSearches();
                await this.loadSearchStats();
                await this.loadPopularTerms();
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    async handleCreateUser() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();

        if (!name || !email) {
            this.showAlert('Please fill in all fields', 'warning');
            return;
        }

        try {
            const response = await this.apiCall('/api/users', 'POST', { name, email });
            
            if (response.success) {
                this.showAlert('User created successfully!', 'success');
                document.getElementById('userForm').reset();
                await this.loadUsers();
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    async loadUsers() {
        try {
            const response = await this.apiCall('/api/users');
            const usersList = document.getElementById('usersList');
            
            if (response.success && response.data.length > 0) {
                usersList.innerHTML = response.data.map(user => `
                    <div class="user-item fade-in">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">${this.escapeHtml(user.name)}</h6>
                                <small class="text-muted">${this.escapeHtml(user.email)}</small>
                            </div>
                            <div>
                                <span class="badge bg-primary">ID: ${user.id}</span>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="app.deleteUser(${user.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <small class="text-muted">Created: ${new Date(user.created_at).toLocaleDateString()}</small>
                    </div>
                `).join('');
            } else {
                usersList.innerHTML = '<p class="text-muted">No users found. Create the first user!</p>';
            }
        } catch (error) {
            document.getElementById('usersList').innerHTML = `<p class="text-danger">Error loading users: ${error.message}</p>`;
        }
    }

    async loadRecentSearches() {
        try {
            const response = await this.apiCall('/api/search?limit=10');
            const searchResults = document.getElementById('searchResults');
            const searchResultsList = document.getElementById('searchResultsList');
            
            if (response.success && response.data.length > 0) {
                searchResultsList.innerHTML = response.data.map(search => `
                    <div class="search-result-item fade-in">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h6 class="mb-2">"${this.escapeHtml(search.query_text)}"</h6>
                                <div class="d-flex align-items-center gap-3">
                                    <small class="text-muted">
                                        <i class="fas fa-chart-bar me-1"></i>
                                        ${search.results_count} results
                                    </small>
                                    ${search.user_name ? `
                                        <small class="text-muted">
                                            <i class="fas fa-user me-1"></i>
                                            ${this.escapeHtml(search.user_name)}
                                        </small>
                                    ` : ''}
                                    <small class="text-muted">
                                        <i class="fas fa-clock me-1"></i>
                                        ${new Date(search.created_at).toLocaleString()}
                                    </small>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-outline-danger" onclick="app.deleteSearch(${search.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading recent searches:', error);
        }
    }

    async loadSearchStats() {
        try {
            const response = await this.apiCall('/api/search/stats');
            const searchStats = document.getElementById('searchStats');
            
            if (response.success) {
                const stats = response.data;
                searchStats.innerHTML = `
                    <div class="row text-center">
                        <div class="col-4">
                            <div class="stat-number">${stats.total_queries}</div>
                            <div class="stat-label">Total Searches</div>
                        </div>
                        <div class="col-4">
                            <div class="stat-number">${stats.unique_users}</div>
                            <div class="stat-label">Unique Users</div>
                        </div>
                        <div class="col-4">
                            <div class="stat-number">${stats.avg_results}</div>
                            <div class="stat-label">Avg Results</div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            document.getElementById('searchStats').innerHTML = `<p class="text-danger">Error loading stats: ${error.message}</p>`;
        }
    }

    async loadPopularTerms() {
        try {
            const response = await this.apiCall('/api/search/popular?limit=15');
            const popularTerms = document.getElementById('popularTerms');
            
            if (response.success && response.data.length > 0) {
                popularTerms.innerHTML = response.data.map(term => `
                    <span class="popular-term" onclick="app.searchTerm('${this.escapeHtml(term.query_text)}')">
                        ${this.escapeHtml(term.query_text)} 
                        <span class="badge bg-primary">${term.frequency}</span>
                    </span>
                `).join('');
            } else {
                popularTerms.innerHTML = '<p class="text-muted">No popular terms yet. Start searching!</p>';
            }
        } catch (error) {
            document.getElementById('popularTerms').innerHTML = `<p class="text-danger">Error loading popular terms: ${error.message}</p>`;
        }
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await this.apiCall(`/api/users/${userId}`, 'DELETE');
            if (response.success) {
                this.showAlert('User deleted successfully!', 'success');
                await this.loadUsers();
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    async deleteSearch(searchId) {
        if (!confirm('Are you sure you want to delete this search?')) return;

        try {
            const response = await this.apiCall(`/api/search/${searchId}`, 'DELETE');
            if (response.success) {
                this.showAlert('Search deleted successfully!', 'success');
                await this.loadRecentSearches();
                await this.loadSearchStats();
                await this.loadPopularTerms();
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    searchTerm(term) {
        document.getElementById('searchQuery').value = term;
        document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
    }

    async apiCall(url, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(this.baseURL + url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        return result;
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();
        
        const alertHTML = `
            <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${this.getAlertIcon(type)} me-2"></i>
                ${this.escapeHtml(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        alertContainer.innerHTML = alertHTML;
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }

    getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            danger: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AISearchEngine();
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment the next line if you create a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}