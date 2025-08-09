import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SearchPlugin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    
    const [plugin, setPlugin] = useState({
        type: 'psl-ai-search',
        uid: '',
        context: '',
        settings: {
            theme: 'default',
            title: 'AI Search',
            placeholder: 'Enter your search query',
            submitText: 'Search'
        }
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [plugins, setPlugins] = useState([]);

    useEffect(() => {
        loadPlugins();
        if (isEditMode) {
            loadPlugin();
        }
    }, [id]);

    const loadPlugins = async () => {
        try {
            const response = await api.getPlugins();
            if (response.success) {
                setPlugins(response.data);
            }
        } catch (error) {
            console.error('Error loading plugins:', error);
        }
    };

    const loadPlugin = async () => {
        try {
            setLoading(true);
            const response = await api.getPluginById(id);
            if (response.success) {
                setPlugin(response.data);
            } else {
                setError('Plugin not found');
            }
        } catch (error) {
            setError('Failed to load plugin');
            console.error('Error loading plugin:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'uid' || name === 'type' || name === 'context') {
            setPlugin(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setPlugin(prev => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    [name]: value
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let response;
            if (isEditMode) {
                response = await api.updatePlugin(id, plugin);
                setSuccess('Plugin updated successfully!');
            } else {
                response = await api.createPlugin(plugin);
                setSuccess('Plugin created successfully!');
                // Reset form for new plugin
                setPlugin({
                    type: 'psl-ai-search',
                    uid: '',
                    context: '',
                    settings: {
                        theme: 'default',
                        title: 'AI Search',
                        placeholder: 'Enter your search query',
                        submitText: 'Search'
                    }
                });
            }
            
            if (response.success) {
                loadPlugins(); // Refresh the plugin list
            }
        } catch (error) {
            setError(isEditMode ? 'Failed to update plugin' : 'Failed to create plugin');
            console.error('Error saving plugin:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (pluginId) => {
        if (!window.confirm('Are you sure you want to delete this plugin?')) {
            return;
        }

        try {
            const response = await api.deletePlugin(pluginId);
            if (response.success) {
                setSuccess('Plugin deleted successfully!');
                loadPlugins();
                if (isEditMode && pluginId === parseInt(id)) {
                    navigate('/search-plugin');
                }
            }
        } catch (error) {
            setError('Failed to delete plugin');
            console.error('Error deleting plugin:', error);
        }
    };

    const themeOptions = [
        { value: 'default', label: 'Default' },
        { value: 'dark', label: 'Dark' },
        { value: 'compact', label: 'Compact' },
        { value: 'professional', label: 'Professional' },
        { value: 'simple', label: 'Simple' },
        { value: 'custom', label: 'Custom' }
    ];

    if (loading && isEditMode) {
        return <div className="container mt-4 search-plugin-page"><div className="text-center">Loading...</div></div>;
    }

    return (
        <div className="container mt-4 search-plugin-page">
            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h3>{isEditMode ? 'Edit Search Plugin' : 'Create New Search Plugin'}</h3>
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
                                    <label htmlFor="type" className="form-label">Plugin Type</label>
                                    <select
                                        className="form-control"
                                        id="type"
                                        name="type"
                                        value={plugin.type}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="psl-ai-search">PSL AI Search</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="uid" className="form-label">Unique ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="uid"
                                        name="uid"
                                        value={plugin.uid}
                                        onChange={handleInputChange}
                                        placeholder="e.g., my-search-widget-001"
                                        required
                                    />
                                    <div className="form-text">
                                        A unique identifier for this plugin instance
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="context" className="form-label">Context</label>
                                    <textarea
                                        className="form-control"
                                        id="context"
                                        name="context"
                                        rows="4"
                                        value={plugin.context}
                                        onChange={handleInputChange}
                                        placeholder="Enter the AI context or instructions for this plugin (e.g., 'You are an AI assistant helping users search through medical education content.')"
                                    />
                                    <div className="form-text">
                                        Provide context or instructions that guide the AI's behavior for this plugin
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="theme" className="form-label">Theme</label>
                                    <select
                                        className="form-control"
                                        id="theme"
                                        name="theme"
                                        value={plugin.settings.theme}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {themeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={plugin.settings.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., AI Search"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="placeholder" className="form-label">Placeholder Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="placeholder"
                                        name="placeholder"
                                        value={plugin.settings.placeholder}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Enter your search query"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="submitText" className="form-label">Submit Button Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="submitText"
                                        name="submitText"
                                        value={plugin.settings.submitText}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Search"
                                        required
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : (isEditMode ? 'Update Plugin' : 'Create Plugin')}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/search-plugin')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h5>Existing Plugins</h5>
                        </div>
                        <div className="card-body">
                            {plugins.length === 0 ? (
                                <p className="text-muted">No plugins found</p>
                            ) : (
                                <div className="list-group">
                                    {plugins.map(p => (
                                        <div key={p.id} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{p.settings.title}</h6>
                                                <p className="mb-1 small text-muted">
                                                    UID: {p.uid} | Theme: {p.settings.theme}
                                                </p>
                                                {p.context && (
                                                    <p className="mb-1 small text-muted">
                                                        Context: {p.context.length > 50 ? p.context.substring(0, 50) + '...' : p.context}
                                                    </p>
                                                )}
                                                <small className="text-muted">
                                                    Created: {new Date(p.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate(`/search-plugin/${p.id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(p.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPlugin;