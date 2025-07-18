import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import performance utilities
import { safeguardAnimations } from './utils/animationUtils';

// Simplified and safe app initialization
const initializeApp = () => {
  // Apply animation safeguards immediately
  safeguardAnimations();
  
  // Disable console in production for security
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.error = () => {}; // Also disable error in production
  }

  // Performance monitoring (only in development)
  if (import.meta.env.DEV && 'performance' in window && 'measure' in performance) {
    performance.mark('app-start');
  }

  // Simplified extension conflict prevention
  const preventExtensionConflicts = () => {
    // Only block if not already defined
    const blockedGlobals = [
      'ethereum', 'web3', 'phantom', 'solana', 'keplr'
    ];
    
    blockedGlobals.forEach(global => {
      if (!(global in window)) {
        try {
          Object.defineProperty(window, global, {
            get: () => undefined,
            set: () => false,
            configurable: false,
            enumerable: false
          });
        } catch (e) {
          // Silently fail if can't define property
        }
      }
    });
  };

  // Apply security measures
  preventExtensionConflicts();

  // Simplified error handling
  window.addEventListener('error', (event) => {
    const error = event.error as Error | undefined;
    if (error && error.stack) {
      const errorStack = error.stack || '';
      
      // Only handle extension-related errors
      if (
        errorStack.includes('extension') ||
        errorStack.includes('chrome-extension') ||
        errorStack.includes('moz-extension')
      ) {
        // Silently handle extension errors
        event.preventDefault();
        return false;
      }
    }
    return true;
  });

  // Handle CSP violations gracefully (only in development)
  if (import.meta.env.DEV) {
    window.addEventListener('securitypolicyviolation', (event) => {
      console.debug('CSP Violation:', {
        directive: event.violatedDirective,
        blockedURI: event.blockedURI
      });
    });
  }
};

// Initialize optimizations
initializeApp();

// Create root and render
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure you have a div with id="root" in your HTML.');
}

const root = ReactDOM.createRoot(rootElement);

// Render with strict mode for better development experience
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measurement (only in development)
if (import.meta.env.DEV && 'performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if ('performance' in window && 'measure' in performance) {
        try {
          performance.mark('app-loaded');
          performance.measure('app-load-time', 'app-start', 'app-loaded');
          
          const measure = performance.getEntriesByName('app-load-time')[0];
          if (measure) {
            console.log(`⚡ App loaded in ${Math.round(measure.duration)}ms`);
          }

          // Log other performance metrics
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            console.log('📊 Performance Metrics:', {
              'DOM Content Loaded': Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart) + 'ms',
              'Load Complete': Math.round(navigation.loadEventEnd - navigation.fetchStart) + 'ms',
              'First Paint': performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime?.toFixed(0) + 'ms',
              'First Contentful Paint': performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime?.toFixed(0) + 'ms'
            });
          }
        } catch (error) {
          console.debug('Performance measurement failed:', error);
        }
      }
    }, 100);
  });
}

// Hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    console.log('🔄 Hot reloading App component');
  });
}