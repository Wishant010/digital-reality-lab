import React, { useLayoutEffect, useMemo } from 'react';

// Desktop-specific performance optimization
export class DesktopOptimizer {
  private static instance: DesktopOptimizer;
  private frameId: number = 0;
  private updateCounter = 0;
  private isLargeScreen = false;
  private isOptimized = false;

  static getInstance(): DesktopOptimizer {
    if (!DesktopOptimizer.instance) {
      DesktopOptimizer.instance = new DesktopOptimizer();
    }
    return DesktopOptimizer.instance;
  }

  initialize() {
    if (this.isOptimized) return;
    
    this.checkScreenSize();
    this.optimizeForDesktop();
    this.isOptimized = true;
  }

  private checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1024;
  }

  private optimizeForDesktop() {
    if (!this.isLargeScreen) return;

    // Aggressive GPU acceleration for large screens
    const style = document.createElement('style');
    style.textContent = `
      * {
        will-change: auto !important;
        transform: translateZ(0) !important;
        backface-visibility: hidden !important;
      }
      
      .animation-element, [data-animate] {
        will-change: transform, opacity !important;
        transform: translate3d(0,0,0) !important;
      }
      
      /* Desktop-specific ultra-fast animations */
      @media (min-width: 1024px) {
        * {
          transition-duration: 0.05s !important;
          animation-duration: 0.05s !important;
        }
        
        .fast-load {
          animation: fadeIn 0.02s ease-out !important;
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translate3d(0,0,0); }
        to { opacity: 1; transform: translate3d(0,0,0); }
      }
    `;
    document.head.appendChild(style);

    // Optimize React rendering for desktop
    this.optimizeReactForDesktop();
  }

  private optimizeReactForDesktop() {
    // Batch DOM updates for better performance
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => {
      this.updateCounter++;
      
      // Skip every other frame on large screens for smoother performance
      if (this.isLargeScreen && this.updateCounter % 2 === 0) {
        return originalRAF(() => {
          callback(performance.now());
        });
      }
      
      return originalRAF(callback);
    };
  }

  // Memory management for large screens
  cleanup() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.updateCounter = 0;
  }
}

// React hook for desktop optimization
export const useDesktopOptimization = () => {
  const optimizer = useMemo(() => DesktopOptimizer.getInstance(), []);

  useLayoutEffect(() => {
    optimizer.initialize();
    
    const handleResize = () => {
      optimizer.cleanup();
      optimizer.initialize();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      optimizer.cleanup();
    };
  }, [optimizer]);

  const isLargeScreen = useMemo(() => {
    return window.innerWidth >= 1024;
  }, []);

  return { isLargeScreen, optimizer };
};

// Component wrapper for instant loading on desktop
export const DesktopFastLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useDesktopOptimization();
  
  return (
    <div className="fast-load" style={{ 
      transform: 'translate3d(0,0,0)',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden'
    }}>
      {children}
    </div>
  );
};
