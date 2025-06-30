import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import performance utilities
import { safeguardAnimations } from './utils/animationUtils';

// Performance and security optimizations
const initializeApp = () => {
  // Apply animation safeguards immediately
  safeguardAnimations();
  
  // Disable console in production for security
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
  }

  // Performance monitoring
  if ('performance' in window && 'measure' in performance) {
    performance.mark('app-start');
  }

  // Prevent wallet extension conflicts
  const preventExtensionConflicts = () => {
    // Block common extension globals that cause conflicts
    const blockedGlobals = [
      'ethereum', 'web3', 'phantom', 'solana', 'keplr',
      'MetaMask', 'Trust', 'Coinbase', 'BinanceChain'
    ];
    
    blockedGlobals.forEach(global => {
      if (!(global in window)) {
        Object.defineProperty(window, global, {
          get: () => {
            console.debug(`Blocked access to ${global}`);
            return undefined;
          },
          set: () => {
            console.debug(`Blocked injection of ${global}`);
            return false;
          },
          configurable: false,
          enumerable: false
        });
      }
    });
  };

  // Apply security measures
  preventExtensionConflicts();

  // Error handling for extension-related errors
  window.addEventListener('error', (event) => {
    const error = event.error as Error | undefined;
    if (error && error.stack) {
      const errorMessage = error.message || '';
      const errorStack = error.stack || '';
      
      // Check if error is from browser extension
      if (
        errorStack.includes('extension') ||
        errorStack.includes('chrome-extension') ||
        errorStack.includes('moz-extension') ||
        errorMessage.includes('MetaMask') ||
        errorMessage.includes('phantom') ||
        errorMessage.includes('keplr') ||
        errorMessage.includes('ethereum')
      ) {
        console.debug('Caught and handled extension error:', errorMessage);
        event.preventDefault();
        return false;
      }
    }
    // Always return true or undefined to ensure all code paths return a value
    return true;
  });

  // Handle CSP violations gracefully
  window.addEventListener('securitypolicyviolation', (event) => {
    console.debug('CSP Violation:', {
      directive: event.violatedDirective,
      blockedURI: event.blockedURI,
      lineNumber: event.lineNumber,
      sourceFile: event.sourceFile
    });
    
    // Don't prevent default - let CSP handle it
    // but log for debugging
  });

  // Optimize React rendering
  if (import.meta.env.DEV) {
    // Development optimizations
    console.log('🚀 App starting in development mode');
  }
};

// Initialize optimizations
initializeApp();

// Create root and render with error boundary
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

// Performance measurement
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