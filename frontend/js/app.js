// DOM elements
const responseDisplay = document.getElementById('response-display');
const alertContainer = document.getElementById('alert-container');
const backendStatus = document.getElementById('backend-status');
const authStatus = document.getElementById('auth-status');
const userInfo = document.getElementById('user-info');
const authButtons = document.getElementById('auth-buttons');
const username = document.getElementById('username');
const getUsersBtn = document.getElementById('get-users-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    testServerConnection();
    
    // Set up form handlers
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

// Update authentication UI
function updateAuthUI() {
    const user = api.getCurrentUser();
    
    if (api.isAuthenticated() && user) {
        userInfo.classList.remove('d-none');
        authButtons.classList.add('d-none');
        username.textContent = user.username;
        authStatus.textContent = 'Auth: Logged in';
        authStatus.className = 'badge bg-success';
        getUsersBtn.disabled = false;
    } else {
        userInfo.classList.add('d-none');
        authButtons.classList.remove('d-none');
        authStatus.textContent = 'Auth: Not logged in';
        authStatus.className = 'badge bg-secondary';
        getUsersBtn.disabled = true;
    }
}

// Test server connection
async function testServerConnection() {
    try {
        await api.getHealth();
        backendStatus.textContent = 'Backend: Online';
        backendStatus.className = 'badge bg-success';
    } catch (error) {
        backendStatus.textContent = 'Backend: Offline';
        backendStatus.className = 'badge bg-danger';
    }
}

// Display response in the response area
function displayResponse(data, isError = false) {
    responseDisplay.textContent = JSON.stringify(data, null, 2);
    responseDisplay.className = `bg-light p-3 rounded ${isError ? 'border border-danger' : ''}`;
}

// Show alert
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Button loading state
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        button.classList.add('btn-loading');
        button.dataset.originalText = button.textContent;
        button.textContent = 'Loading...';
    } else {
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

// API test functions
async function testHealth() {
    const button = event.target;
    setButtonLoading(button);
    
    try {
        const response = await api.getHealth();
        displayResponse(response);
        showAlert('✅ Server health check successful!', 'success');
        backendStatus.textContent = 'Backend: Online';
        backendStatus.className = 'badge bg-success';
    } catch (error) {
        displayResponse({ error: error.message }, true);
        showAlert('❌ Server health check failed!', 'danger');
        backendStatus.textContent = 'Backend: Offline';
        backendStatus.className = 'badge bg-danger';
    } finally {
        setButtonLoading(button, false);
    }
}

async function getApiInfo() {
    const button = event.target;
    setButtonLoading(button);
    
    try {
        const response = await api.getApiInfo();
        displayResponse(response);
        showAlert('📖 API documentation retrieved!', 'info');
    } catch (error) {
        displayResponse({ error: error.message }, true);
        showAlert('❌ Failed to get API documentation!', 'danger');
    } finally {
        setButtonLoading(button, false);
    }
}

async function getUsers() {
    const button = event.target;
    setButtonLoading(button);
    
    try {
        const response = await api.getUsers();
        displayResponse(response);
        showAlert(`👥 Retrieved ${response.data.count} users!`, 'success');
    } catch (error) {
        displayResponse({ error: error.message }, true);
        showAlert('❌ Failed to get users! Make sure you are logged in.', 'danger');
    } finally {
        setButtonLoading(button, false);
    }
}

function showDatabaseTest() {
    const dbInfo = {
        message: 'Database Connection Information',
        databases: [
            {
                type: 'PostgreSQL',
                purpose: 'User management and posts',
                tables: ['users', 'posts'],
                features: ['User authentication', 'User CRUD operations']
            },
            {
                type: 'MySQL',
                purpose: 'Product management',
                tables: ['users', 'products'],
                features: ['Product catalog', 'User products relationship']
            }
        ],
        note: 'Both databases are configured but require actual database servers to be running for full functionality.'
    };
    
    displayResponse(dbInfo);
    showAlert('🗄️ Database configuration displayed!', 'info');
}

// Authentication handlers
async function handleLogin(event) {
    event.preventDefault();
    const button = event.target.querySelector('button[type="submit"]');
    setButtonLoading(button);
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await api.login(email, password);
        displayResponse(response);
        showAlert('🎉 Login successful!', 'success');
        updateAuthUI();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('loginForm').reset();
    } catch (error) {
        displayResponse({ error: error.message }, true);
        showAlert('❌ Login failed: ' + error.message, 'danger');
    } finally {
        setButtonLoading(button, false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const button = event.target.querySelector('button[type="submit"]');
    setButtonLoading(button);
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await api.register(username, email, password);
        displayResponse(response);
        showAlert('🎉 Registration successful!', 'success');
        updateAuthUI();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('registerForm').reset();
    } catch (error) {
        displayResponse({ error: error.message }, true);
        showAlert('❌ Registration failed: ' + error.message, 'danger');
    } finally {
        setButtonLoading(button, false);
    }
}

function logout() {
    api.logout();
    updateAuthUI();
    showAlert('👋 Logged out successfully!', 'info');
    displayResponse({ message: 'User logged out successfully' });
}