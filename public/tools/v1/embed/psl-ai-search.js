/**
 * PSL AI Search Plugin
 * Embeddable JavaScript plugin for AI search functionality
 * 
 * Usage:
 * <script src="https://{website}/tools/v1/embed/psl-ai-search.js"></script>
 * <psl-ai-search uid="unique_code_id"></psl-ai-search>
 */

(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.PSLAISearchPlugin) {
        return;
    }
    
    // Plugin configuration
    const config = {
        apiEndpoint: '/api/v1/psl-ai-search',
        tagName: 'psl-ai-search',
        debug: false
    };
    
    // Utility functions
    const log = (...args) => {
        if (config.debug) {
            console.log('[PSL AI Search]', ...args);
        }
    };
    
    const error = (...args) => {
        console.error('[PSL AI Search]', ...args);
    };
    
    // Get the current script's source to determine the base URL
    const getCurrentScript = () => {
        const scripts = document.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].src && scripts[i].src.includes('psl-ai-search.js')) {
                return scripts[i];
            }
        }
        return null;
    };
    
    // Extract base URL from script source
    const getBaseUrl = () => {
        const script = getCurrentScript();
        if (script && script.src) {
            const url = new URL(script.src);
            return `${url.protocol}//${url.host}`;
        }
        // Fallback to current domain
        return `${window.location.protocol}//${window.location.host}`;
    };
    
    // Send data to API endpoint
    const sendToAPI = async (uid, element) => {
        const baseUrl = getBaseUrl();
        const apiUrl = `${baseUrl}${config.apiEndpoint}`;
        
        try {
            log(`Sending UID "${uid}" to API: ${apiUrl}`);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    userAgent: navigator.userAgent
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            log('API response:', result);
            
            // Trigger custom event for integration
            const event = new CustomEvent('psl-ai-search-response', {
                detail: {
                    uid: uid,
                    response: result,
                    element: element
                }
            });
            element.dispatchEvent(event);
            
            return result;
            
        } catch (err) {
            error('Failed to send data to API:', err);
            
            // Trigger error event
            const event = new CustomEvent('psl-ai-search-error', {
                detail: {
                    uid: uid,
                    error: err,
                    element: element
                }
            });
            element.dispatchEvent(event);
            
            throw err;
        }
    };
    
    // Process a single psl-ai-search element
    const processElement = async (element) => {
        const uid = element.getAttribute('uid');
        
        if (!uid) {
            error('PSL AI Search element found without uid attribute:', element);
            return;
        }
        
        if (!uid.trim()) {
            error('PSL AI Search element found with empty uid attribute:', element);
            return;
        }
        
        log(`Processing PSL AI Search element with UID: "${uid}"`);
        
        // Mark as processed to avoid duplicate processing
        if (element.hasAttribute('data-psl-processed')) {
            log(`Element with UID "${uid}" already processed`);
            return;
        }
        element.setAttribute('data-psl-processed', 'true');
        
        try {
            await sendToAPI(uid, element);
        } catch (err) {
            error(`Failed to process element with UID "${uid}":`, err);
        }
    };
    
    // Find and process all psl-ai-search elements
    const processAllElements = () => {
        const elements = document.getElementsByTagName(config.tagName);
        log(`Found ${elements.length} PSL AI Search element(s)`);
        
        if (elements.length === 0) {
            log('No PSL AI Search elements found on this page');
            return;
        }
        
        // Process each element
        for (let i = 0; i < elements.length; i++) {
            processElement(elements[i]);
        }
    };
    
    // Initialize the plugin
    const init = () => {
        log('Initializing PSL AI Search Plugin');
        
        // Check if DOM is already loaded
        if (document.readyState === 'loading') {
            // DOM is still loading, wait for it
            document.addEventListener('DOMContentLoaded', processAllElements);
        } else {
            // DOM is already loaded
            processAllElements();
        }
        
        // Also listen for dynamically added elements
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName && node.tagName.toLowerCase() === config.tagName) {
                                processElement(node);
                            }
                            // Check for nested elements
                            const nestedElements = node.getElementsByTagName && node.getElementsByTagName(config.tagName);
                            if (nestedElements) {
                                for (let i = 0; i < nestedElements.length; i++) {
                                    processElement(nestedElements[i]);
                                }
                            }
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };
    
    // Expose plugin API
    window.PSLAISearchPlugin = {
        version: '1.0.0',
        config: config,
        processElement: processElement,
        processAllElements: processAllElements,
        init: init
    };
    
    // Auto-initialize
    init();
    
})();