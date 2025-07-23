import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Development environment check
const isDevelopment = import.meta.env.DEV;

// Only set COOP policies for production or HTTPS
if (!isDevelopment) {
  // Remove any existing CSP that might cause issues
  const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existingCSP) {
    existingCSP.remove();
  }
  
  // Set production-ready security headers
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https:;
  `;
  document.head.appendChild(meta);
}

// Create root and render
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);