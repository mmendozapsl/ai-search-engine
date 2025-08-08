import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        // If user is authenticated, redirect to dashboard
        if (api.isAuthenticated()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <main className="welcome-page">
            <div className="container-fluid h-100">
                <div className="row h-100 align-items-center justify-content-center">
                    <div className="col-lg-8 col-xl-6 text-center">
                        <h1 className="welcome-title mb-4">AI Search Engine On Your Web App</h1>
                        <p className="welcome-subtitle mb-5">Frontend AI tool powering the next generation of web applications.</p>
                        
                        <div className="welcome-buttons">
                            <Link to="/register" className="btn btn-gradient btn-lg me-3 mb-3">
                                Register
                            </Link>
                            <Link to="/login" className="btn btn-outline-light btn-lg mb-3">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;