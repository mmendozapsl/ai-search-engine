(function() {
    'use strict';
    
    // Plugin configuration
    const PLUGIN_NAME = 'psl-ai-search';
    const API_ENDPOINT = '/api/v1/psl-ai-search';
    
    // Get the current script's source to determine backend server
    function getBackendServer() {
        const currentScript = document.currentScript || 
            (function() {
                const scripts = document.getElementsByTagName('script');
                return scripts[scripts.length - 1];
            })();
            
        if (currentScript && currentScript.src) {
            const url = new URL(currentScript.src);
            return url.origin;
        }
        
        // Fallback to current domain if script source can't be determined
        return window.location.origin;
    }
    
    // Find all psl-ai-search elements in the DOM
    function findSearchElements() {
        return document.querySelectorAll(PLUGIN_NAME);
    }
    
    // Extract uid from element
    function extractUid(element) {
        return element.getAttribute('uid');
    }
    
    // Send uid to backend API
    async function sendSearchRequest(uid, backendServer) {
        try {
            const response = await fetch(`${backendServer}${API_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: uid })
            });
            
            if (!response.ok) {
                console.warn(`${PLUGIN_NAME}: API request failed with status ${response.status}`);
                
                // Try to parse error response
                try {
                    const errorData = await response.json();
                    return errorData; // Return error data so it can be handled appropriately
                } catch (parseError) {
                    return { 
                        success: false, 
                        error: `API request failed with status ${response.status}` 
                    };
                }
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.warn(`${PLUGIN_NAME}: Error sending request:`, error);
            return { 
                success: false, 
                error: 'Unable to connect to search service.' 
            };
        }
    }
    
    // Process a single search element
    async function processSearchElement(element, backendServer) {
        const uid = extractUid(element);
        
        if (!uid) {
            console.warn(`${PLUGIN_NAME}: Element missing uid attribute`, element);
            return;
        }
        
        console.log(`${PLUGIN_NAME}: Processing element with uid: ${uid}`);
        
        // Send request to backend
        const result = await sendSearchRequest(uid, backendServer);
        
        if (result) {
            if (result.success) {
                // Render search form with the settings
                renderSearchForm(element, uid, result.settings, backendServer);
            } else {
                // Handle error case (plugin not found or other errors)
                renderErrorMessage(element, result.error || 'Plugin not found. Please provide a valid uid.');
            }
            
            // Trigger custom event for successful processing
            const event = new CustomEvent('psl-ai-search-processed', {
                detail: { uid: uid, result: result, element: element }
            });
            document.dispatchEvent(event);
        } else {
            // No response from backend (this shouldn't happen with updated sendSearchRequest)
            renderErrorMessage(element, 'Unable to connect to search service.');
        }
    }
    
    // Render search form inside the element
    function renderSearchForm(element, uid, settings, backendServer) {
        const {
            theme = 'default',
            placeholder = 'Search...',
            title = 'Search',
            submitText = 'Search'
        } = settings || {};
        
        // Create search form HTML
        const formId = `psl-search-form-${uid}`;
        const inputId = `psl-search-input-${uid}`;
        
        const formHTML = `
            <div class="psl-ai-search-container" data-theme="${theme}">
                <h3 class="psl-search-title">${escapeHtml(title)}</h3>
                <form id="${formId}" class="psl-search-form" data-uid="${uid}">
                    <div class="psl-search-input-group">
                        <input 
                            type="text" 
                            id="${inputId}"
                            name="query" 
                            placeholder="${escapeHtml(placeholder)}" 
                            class="psl-search-input"
                            required 
                        />
                        <button type="submit" class="psl-search-submit">${escapeHtml(submitText)}</button>
                    </div>
                </form>
                <div id="psl-search-results-${uid}" class="psl-search-results" style="display: none;"></div>
            </div>
        `;
        
        // Add CSS styles if not already added
        addSearchFormStyles();
        
        // Set the HTML content
        element.innerHTML = formHTML;
        
        // Add form submission handler
        const form = element.querySelector(`#${formId}`);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const query = form.querySelector('input[name="query"]').value.trim();
                if (query) {
                    handleSearchSubmission(uid, query, backendServer, element);
                }
            });
        }
    }
    
    // Render error message
    function renderErrorMessage(element, message) {
        element.innerHTML = `
            <div class="psl-ai-search-error">
                <p>${escapeHtml(message)}</p>
            </div>
        `;
        
        // Add basic error styles
        addSearchFormStyles();
    }
    
    // Handle search form submission
    async function handleSearchSubmission(uid, query, backendServer, element) {
        const resultsContainer = element.querySelector(`#psl-search-results-${uid}`);
        const submitButton = element.querySelector('.psl-search-submit');
        
        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Searching...';
        }
        
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = '<p class="psl-loading">Searching...</p>';
        }
        
        try {
            const response = await fetch(`${backendServer}/api/v1/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: uid, query: query })
            });
            
            if (response.ok) {
                const searchData = await response.json();
                displaySearchResults(resultsContainer, searchData);
            } else {
                displaySearchError(resultsContainer, 'Search request failed');
            }
        } catch (error) {
            console.error('Search submission error:', error);
            displaySearchError(resultsContainer, 'Unable to perform search');
        } finally {
            // Reset button state
            if (submitButton) {
                submitButton.disabled = false;
                // Restore original button text
                const form = submitButton.closest('form');
                const container = form?.closest('.psl-ai-search-container');
                if (container) {
                    const theme = container.dataset.theme;
                    // You might want to store original text, for now use default
                    submitButton.textContent = 'Search';
                }
            }
        }
    }
    
    // Display search results
    function displaySearchResults(resultsContainer, searchData) {
        if (!resultsContainer) return;
        
        if (searchData.success && searchData.results && searchData.results.length > 0) {
            let resultsHTML = `<h4>Search Results (${searchData.totalResults || searchData.results.length})</h4>`;
            resultsHTML += '<div class="psl-results-list">';
            
            searchData.results.forEach(result => {
                resultsHTML += `
                    <div class="psl-result-item">
                        <h5><a href="${escapeHtml(result.url || '#')}" target="_blank">${escapeHtml(result.title || 'Untitled')}</a></h5>
                        <p class="psl-result-description">${escapeHtml(result.description || '')}</p>
                        ${result.relevanceScore ? `<span class="psl-relevance">Relevance: ${(result.relevanceScore * 100).toFixed(0)}%</span>` : ''}
                    </div>
                `;
            });
            
            resultsHTML += '</div>';
            resultsContainer.innerHTML = resultsHTML;
        } else {
            resultsContainer.innerHTML = '<p class="psl-no-results">No results found for your search.</p>';
        }
    }
    
    // Display search error
    function displaySearchError(resultsContainer, message) {
        if (!resultsContainer) return;
        resultsContainer.innerHTML = `<p class="psl-search-error">${escapeHtml(message)}</p>`;
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Add CSS styles for the search form
    function addSearchFormStyles() {
        // Only add styles once
        if (document.getElementById('psl-ai-search-styles')) {
            return;
        }
        
        const styles = `
            <style id="psl-ai-search-styles">
                .psl-ai-search-container {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    max-width: 900px;
                    margin: 20px 0;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background: #fff;
                }
                
                .psl-ai-search-container[data-theme="dark"] {
                    background: #2d3748;
                    border-color: #4a5568;
                    color: #e2e8f0;
                }
                
                .psl-ai-search-container[data-theme="compact"] {
                    padding: 10px;
                    margin: 10px 0;
                }
                
                .psl-search-title {
                    margin: 0 0 15px 0;
                    font-size: 1.2em;
                    font-weight: 600;
                    color: #2d3748;
                }
                
                .psl-ai-search-container[data-theme="dark"] .psl-search-title {
                    color: #e2e8f0;
                }
                
                .psl-search-form {
                    margin-bottom: 15px;
                }
                
                .psl-search-input-group {
                    display: flex;
                    gap: 8px;
                    align-items: stretch;
                }
                
                .psl-search-input {
                    flex: 1;
                    padding: 10px 12px;
                    border: 1px solid #cbd5e0;
                    border-radius: 6px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                
                .psl-search-input:focus {
                    border-color: #3182ce;
                    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
                }
                
                .psl-ai-search-container[data-theme="dark"] .psl-search-input {
                    background: #4a5568;
                    border-color: #718096;
                    color: #e2e8f0;
                }
                
                .psl-search-submit {
                    padding: 10px 20px;
                    background: #3182ce;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    white-space: nowrap;
                }
                
                .psl-search-submit:hover:not(:disabled) {
                    background: #2c5aa0;
                }
                
                .psl-search-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .psl-ai-search-container[data-theme="compact"] .psl-search-submit {
                    padding: 8px 16px;
                    font-size: 12px;
                }
                
                .psl-search-results {
                    margin-top: 15px;
                }
                
                .psl-search-results h4 {
                    margin: 0 0 10px 0;
                    font-size: 1em;
                    color: #4a5568;
                }
                
                .psl-ai-search-container[data-theme="dark"] .psl-search-results h4 {
                    color: #a0aec0;
                }
                
                .psl-results-list {
                    space-y: 12px;
                }
                
                .psl-result-item {
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    background: #f7fafc;
                }
                
                .psl-ai-search-container[data-theme="dark"] .psl-result-item {
                    background: #1a202c;
                    border-color: #4a5568;
                }
                
                .psl-result-item h5 {
                    margin: 0 0 5px 0;
                    font-size: 14px;
                }
                
                .psl-result-item h5 a {
                    color: #3182ce;
                    text-decoration: none;
                }
                
                .psl-result-item h5 a:hover {
                    text-decoration: underline;
                }
                
                .psl-ai-search-container[data-theme="dark"] .psl-result-item h5 a {
                    color: #63b3ed;
                }
                
                .psl-result-description {
                    margin: 5px 0;
                    font-size: 13px;
                    color: #718096;
                    line-height: 1.4;
                }
                
                .psl-relevance {
                    font-size: 11px;
                    color: #38a169;
                    font-weight: 500;
                }
                
                .psl-loading, .psl-no-results, .psl-search-error {
                    text-align: center;
                    padding: 15px;
                    color: #718096;
                    font-style: italic;
                }
                
                .psl-search-error, .psl-ai-search-error {
                    color: #e53e3e;
                    background: #fed7d7;
                    border: 1px solid #feb2b2;
                    border-radius: 6px;
                    padding: 12px;
                    margin: 10px 0;
                }
                
                .psl-ai-search-container[data-theme="dark"] .psl-search-error,
                .psl-ai-search-container[data-theme="dark"] .psl-ai-search-error {
                    background: #742a2a;
                    border-color: #c53030;
                    color: #feb2b2;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Initialize the plugin
    function initializePlugin() {
        console.log(`${PLUGIN_NAME}: Initializing plugin`);
        
        const backendServer = getBackendServer();
        console.log(`${PLUGIN_NAME}: Backend server: ${backendServer}`);
        
        const searchElements = findSearchElements();
        
        if (searchElements.length === 0) {
            console.log(`${PLUGIN_NAME}: No ${PLUGIN_NAME} elements found in DOM`);
            return;
        }
        
        console.log(`${PLUGIN_NAME}: Found ${searchElements.length} element(s) to process`);
        
        // Process each element
        searchElements.forEach(element => {
            processSearchElement(element, backendServer);
        });
    }
    
    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    // Initialize when DOM is ready
    ready(initializePlugin);
    
    // Also watch for dynamically added elements
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            const backendServer = getBackendServer();
            
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName && node.tagName.toLowerCase() === PLUGIN_NAME) {
                            processSearchElement(node, backendServer);
                        }
                        
                        // Check for nested elements
                        const nestedElements = node.querySelectorAll ? node.querySelectorAll(PLUGIN_NAME) : [];
                        nestedElements.forEach(element => {
                            processSearchElement(element, backendServer);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
})();