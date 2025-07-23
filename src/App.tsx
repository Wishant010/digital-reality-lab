import React, { Suspense, useEffect } from 'react';
import './index.css';

// Simple lazy loading
const HomePage = React.lazy(() => import('./Pages/LandinPage/FirstScreen'));

// Simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  // Quick performance boost for large screens
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      // Add performance CSS for desktop
      const style = document.createElement('style');
      style.textContent = `
        * { 
          transition-duration: 0.1s !important; 
          animation-duration: 0.1s !important;
          transform: translate3d(0,0,0);
        }
        @media (min-width: 1024px) {
          * { 
            transition-duration: 0.05s !important; 
            animation-duration: 0.05s !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // CRITICAL: Fix for negative blur values
    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
      if (property === 'filter' && typeof value === 'string' && value.includes('blur(')) {
        // Extract blur value and ensure it's positive
        value = value.replace(/blur\(([^)]+)\)/g, (_, blurValue) => {
          const numericValue = parseFloat(blurValue);
          if (isNaN(numericValue) || numericValue < 0) {
            return 'blur(0px)';
          }
          return `blur(${Math.max(0, numericValue)}px)`;
        });
      }
      return originalSetProperty.call(this, property, value, priority);
    };
  }, []);

  return (
    <div style={{ 
      transform: 'translate3d(0,0,0)',
      willChange: 'transform',
      minHeight: '100vh'
    }}>
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    </div>
  );
}

export default App;