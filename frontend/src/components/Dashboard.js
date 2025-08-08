import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
    const [loading, setLoading] = useState({});
    const [response, setResponse] = useState('No response yet. Click a button above to test the API.');
    const [alerts, setAlerts] = useState([]);
    const [backendStatus, setBackendStatus] = useState({ text: 'Backend: Unknown', class: 'badge bg-secondary' });
    const [authStatus, setAuthStatus] = useState({ text: 'Auth: Not logged in', class: 'badge bg-secondary' });
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated, redirect to login if not
        if (!api.isAuthenticated()) {
            navigate('/login');
            return;
        }

        updateAuthStatus();
        testServerConnection();
    }, [navigate]);

    const updateAuthStatus = () => {
        const user = api.getCurrentUser();
        if (api.isAuthenticated() && user) {
            setAuthStatus({ text: 'Auth: Logged in', class: 'badge bg-success' });
        } else {
            setAuthStatus({ text: 'Auth: Not logged in', class: 'badge bg-secondary' });
        }
    };

    const testServerConnection = async () => {
        try {
            await api.getHealth();
            setBackendStatus({ text: 'Backend: Online', class: 'badge bg-success' });
        } catch (error) {
            setBackendStatus({ text: 'Backend: Offline', class: 'badge bg-danger' });
        }
    };

    const displayResponse = (data, isError = false) => {
        setResponse(JSON.stringify(data, null, 2));
    };

    const showAlert = (message, type = 'info') => {
        const newAlert = {
            id: Date.now(),
            message,
            type
        };
        setAlerts(prev => [...prev, newAlert]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, 5000);
    };

    const setButtonLoading = (buttonId, loading = true) => {
        setLoading(prev => ({
            ...prev,
            [buttonId]: loading
        }));
    };

    const testHealth = async () => {
        setButtonLoading('health', true);
        
        try {
            const response = await api.getHealth();
            displayResponse(response);
            showAlert('✅ Server health check successful!', 'success');
            setBackendStatus({ text: 'Backend: Online', class: 'badge bg-success' });
        } catch (error) {
            displayResponse({ error: error.message }, true);
            showAlert('❌ Server health check failed!', 'danger');
            setBackendStatus({ text: 'Backend: Offline', class: 'badge bg-danger' });
        } finally {
            setButtonLoading('health', false);
        }
    };

    const getApiInfo = async () => {
        setButtonLoading('api', true);
        
        try {
            const response = await api.getApiInfo();
            displayResponse(response);
            showAlert('📖 API documentation retrieved!', 'info');
        } catch (error) {
            displayResponse({ error: error.message }, true);
            showAlert('❌ Failed to get API documentation!', 'danger');
        } finally {
            setButtonLoading('api', false);
        }
    };

    const getUsers = async () => {
        setButtonLoading('users', true);
        
        try {
            const response = await api.getUsers();
            displayResponse(response);
            showAlert(`👥 Retrieved ${response.data.count} users!`, 'success');
        } catch (error) {
            displayResponse({ error: error.message }, true);
            showAlert('❌ Failed to get users! Make sure you are logged in.', 'danger');
        } finally {
            setButtonLoading('users', false);
        }
    };

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    return (
        <main className="dashboard-page">
            <div className="container mt-4">
                {/* Status Alert */}
                <div id="alert-container">
                    {alerts.map(alert => (
                        <div key={alert.id} className={`alert alert-${alert.type} alert-dismissible fade show`}>
                            {alert.message}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => removeAlert(alert.id)}
                            ></button>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="row">
                    <div className="col-md-4">
                        <div className="card dashboard-card">
                            <div className="card-header">
                                <h6 className="mb-0">🔧 System Status</h6>
                            </div>
                            <div className="card-body">
                                <div className="status-item">
                                    <span className={backendStatus.class}>{backendStatus.text}</span>
                                </div>
                                <div className="status-item mt-2">
                                    <span className={authStatus.class}>{authStatus.text}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card dashboard-card">
                            <div className="card-header">
                                <h6 className="mb-0"> Developer quickstart </h6>
                            </div>
                            <div className="card-body">
                                <p className="card-text text-muted mb-3">Create your AI Plugin request in minutes.</p>
                                <p className="card-text text-muted mb-3">1. Create the plugin.</p>
                                <p className="card-text text-muted mb-3">2. Copy the code snippet and paste it into your HTML.</p>
                                <div className="code-snippet-body">
                                    <pre style={{backgroundColor: '#0000003d', color: '#fff', padding: '7px', fontSize: '12px', border: '1px solid #9cc9d2'}}>
{`<psl-ai-search uid="search-456"></psl-ai-search>
<script>(function() {
const u = 'http://{backendServer}/v1/embed/psl-ai-search.js';
const d = document;const e = d.createElement('script');e.src = u;
e.id = 'psl-ai-srshsc';d.body.appendChild(e);
})();</script>`}
                                    </pre>
                                </div>
                            </div>
                        </div><br />

                        <div className="card dashboard-card">
                            <div className="card-header">
                                <h5 className="mb-0">🚀 API Testing Dashboard</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <button 
                                            className="btn btn-info w-100" 
                                            onClick={testHealth}
                                            disabled={loading.health}
                                        >
                                            {loading.health ? 'Testing...' : '🔍 Test Server Health'}
                                        </button>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <button 
                                            className="btn btn-secondary w-100" 
                                            onClick={getApiInfo}
                                            disabled={loading.api}
                                        >
                                            {loading.api ? 'Loading...' : '📖 Get API Documentation'}
                                        </button>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <button 
                                            className="btn btn-success w-100" 
                                            onClick={getUsers}
                                            disabled={loading.users}
                                        >
                                            {loading.users ? 'Loading...' : '👥 Get All Users'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* Response Display */}
                <div className="card dashboard-card mt-4">
                    <div className="card-header">
                        <h6 className="mb-0">📄 API Response</h6>
                    </div>
                    <div className="card-body">
                        <pre 
                            className="bg-light p-3 rounded"
                            style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                fontFamily: 'Courier New, monospace',
                                fontSize: '0.9rem',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                background: 'rgba(0, 0, 0, 0.3)',
                                color: '#e0e0e0',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '10px'
                            }}
                        >
                            {response}
                        </pre>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;