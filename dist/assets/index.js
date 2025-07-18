// Basic JavaScript for the site
(function() {
  'use strict';

  // Remove loading spinner
  function removeLoadingSpinner() {
    const loadingFallback = document.querySelector('.loading-fallback');
    if (loadingFallback) {
      loadingFallback.style.opacity = '0';
      setTimeout(() => {
        loadingFallback.remove();
      }, 300);
    }
  }

  // Initialize the app
  function initApp() {
    // Create main content
    const root = document.getElementById('root');
    if (!root) return;

    // Clear loading content
    removeLoadingSpinner();

    // Add main content
    root.innerHTML = `
      <div class="hero">
        <div class="container">
          <h1>Wishant Bhajan</h1>
          <p>Portfolio & Digital Solutions</p>
          <p>Website is being updated... Check back soon!</p>
        </div>
      </div>
    `;

    console.log('Wishant Bhajan website loaded successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Performance monitoring
  window.addEventListener('load', function() {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData && perfData.loadEventEnd > 0) {
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        console.log('Page load time:', Math.round(loadTime) + 'ms');
      }
    }
  });
})();