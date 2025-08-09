import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Header() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        updateAuthState();
    }, []);

    const updateAuthState = () => {
        const authenticated = api.isAuthenticated();
        const currentUser = api.getCurrentUser();
        setIsAuthenticated(authenticated);
        setUser(currentUser);
    };

    const handleLogout = () => {
        api.logout();
        updateAuthState();
        navigate('/');
    };

    return (
        <header className="main-header">
            <div className="container-fluid px-4">
                <div className="d-flex justify-content-between align-items-center py-3">
                    <div className="logo">
                        <Link to="/" className="text-decoration-none text-light">
                            <h3 className="mb-0 fw-bold">AI Search Engine</h3>
                        </Link>
                    </div>
                    <nav className="header-nav">
                        <div className="d-flex align-items-center gap-3">
                            <a href="#" className="nav-link text-light">Documentation</a>
                            <Link to="/search-plugin" className="nav-link text-light">Search Plugins</Link>
                            
                            {/* User info when logged in */}
                            {isAuthenticated && user && (
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-light">Welcome, {user.username}!</span>
                                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                            
                            {/* Auth buttons when not logged in */}
                            {!isAuthenticated && (
                                <div className="d-flex align-items-center gap-2">
                                    <Link to="/login" className="btn btn-outline-light">Login</Link>
                                    <Link to="/register" className="btn btn-gradient">Register</Link>
                                </div>
                            )}
                            
                            <div className="dropdown">
                                <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    ⋯
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><a className="dropdown-item" href="#">Settings</a></li>
                                    <li><a className="dropdown-item" href="#">Help</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">About</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;