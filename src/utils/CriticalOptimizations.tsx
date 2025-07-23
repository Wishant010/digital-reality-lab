import { useEffect, useCallback } from 'react';

// Critical performance optimizations for large screens
export const useLargeScreenOptimizations = () => {
  const isLargeScreen = window.innerWidth >= 1024;

  const optimizeForLargeScreen = useCallback(() => {
    if (!isLargeScreen) return;

    // 1. Disable heavy animations and effects
    const disableHeavyEffects = () => {
      const style = document.createElement('style');
      style.textContent = `
        @media (min-width: 1024px) {
          /* Remove heavy backdrop filters */
          .backdrop-blur, .backdrop-blur-sm, .backdrop-blur-md {
            backdrop-filter: none !important;
            background: rgba(0,0,0,0.5) !important;
          }
          
          /* Simplify shadows */
          .shadow-lg, .shadow-xl, .shadow-2xl {
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important;
          }
          
          /* Ultra-fast transitions */
          * {
            transition-duration: 0.02s !important;
            animation-duration: 0.02s !important;
          }
          
          /* Optimize gradients */
          .bg-gradient-to-r, .bg-gradient-to-br, .bg-gradient-to-bl {
            background: linear-gradient(45deg, var(--tw-gradient-from), var(--tw-gradient-to)) !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // 2. Force immediate GPU acceleration
    const forceGPUAcceleration = () => {
      document.querySelectorAll('*').forEach((el) => {
        const element = el as HTMLElement;
        element.style.willChange = 'auto';
        element.style.transform = 'translate3d(0,0,0)';
        element.style.backfaceVisibility = 'hidden';
      });
    };

    // 3. Optimize images and media
    const optimizeMedia = () => {
      document.querySelectorAll('img, video').forEach((el) => {
        const element = el as HTMLElement;
        element.style.imageRendering = 'optimizeSpeed';
        element.style.transform = 'translate3d(0,0,0)';
      });
    };

    // 4. Batch DOM updates
    const batchUpdates = () => {
      requestAnimationFrame(() => {
        disableHeavyEffects();
        requestAnimationFrame(() => {
          forceGPUAcceleration();
          requestAnimationFrame(() => {
            optimizeMedia();
          });
        });
      });
    };

    batchUpdates();
  }, [isLargeScreen]);

  useEffect(() => {
    optimizeForLargeScreen();
    
    const observer = new MutationObserver((mutations) => {
      if (mutations.length > 0 && isLargeScreen) {
        // Re-optimize new elements
        requestAnimationFrame(optimizeForLargeScreen);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    return () => observer.disconnect();
  }, [optimizeForLargeScreen]);

  return { isLargeScreen };
};

// Preload component for instant loading
export const PreloadCriticalResources = () => {
  useEffect(() => {
    if (window.innerWidth < 1024) return;

    // Preload critical fonts
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap'
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = font;
      document.head.appendChild(link);
    });

    // Preload GPU context
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // Cleanup
    return () => {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return null;
};
