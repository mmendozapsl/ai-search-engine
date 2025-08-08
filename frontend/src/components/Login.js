import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already authenticated, redirect to dashboard
        if (api.isAuthenticated()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear errors when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await api.login(formData.email, formData.password);
            setSuccess('🎉 Login successful!');
            
            // Redirect to dashboard after successful login
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            setError('❌ Login failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="welcome-page">
            <div className="container-fluid h-100">
                <div className="row h-100 align-items-center justify-content-center">
                    <div className="col-lg-4 col-md-6 col-sm-8">
                        <div className="card dashboard-card">
                            <div className="card-header text-center">
                                <h5 className="mb-0">🔐 Login</h5>
                            </div>
                            <div className="card-body">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="alert alert-success" role="alert">
                                        {success}
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button 
                                            type="submit" 
                                            className="btn btn-gradient"
                                            disabled={loading}
                                        >
                                            {loading ? 'Logging in...' : 'Login'}
                                        </button>
                                    </div>
                                </form>
                                
                                <div className="text-center mt-3">
                                    <p className="text-muted">
                                        Don't have an account? <Link to="/register" className="text-decoration-none">Register here</Link>
                                    </p>
                                    <Link to="/" className="text-decoration-none text-muted">
                                        ← Back to Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;