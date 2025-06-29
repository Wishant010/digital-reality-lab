import { useEffect, useRef, useCallback } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

class PerformanceManager {
  private static instance: PerformanceManager;
  private animationFrames: number[] = [];
  private timeouts: any[] = [];
  private intervals: any[] = [];
  private eventListeners: Array<{
    target: EventTarget;
    type: string;
    listener: EventListener;
    options?: AddEventListenerOptions;
  }> = [];

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  // Optimized requestAnimationFrame
  addAnimationFrame(callback: FrameRequestCallback): number {
    const id = requestAnimationFrame((time) => {
      this.animationFrames = this.animationFrames.filter(frameId => frameId !== id);
      callback(time);
    });
    this.animationFrames.push(id);
    return id;
  }

  // Optimized setTimeout
  addTimeout(callback: () => void, delay: number): any {
    const id = setTimeout(() => {
      this.timeouts = this.timeouts.filter(timeoutId => timeoutId !== id);
      callback();
    }, delay);
    this.timeouts.push(id);
    return id;
  }

  // Optimized setInterval
  addInterval(callback: () => void, delay: number): any {
    const id = setInterval(callback, delay);
    this.intervals.push(id);
    return id;
  }

  // Optimized event listener
  addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ): void {
    const optimizedOptions = {
      passive: true,
      ...options
    };
    
    target.addEventListener(type, listener, optimizedOptions);
    this.eventListeners.push({ target, type, listener, options: optimizedOptions });
  }

  // Throttled function creator
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        this.addTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Debounced function creator
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: any;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = this.addTimeout(() => func.apply(this, args), delay);
    };
  }

  // Clean up all tracked resources
  cleanup(): void {
    this.animationFrames.forEach(id => cancelAnimationFrame(id));
    this.animationFrames = [];

    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts = [];

    this.intervals.forEach(id => clearInterval(id));
    this.intervals = [];

    this.eventListeners.forEach(({ target, type, listener, options }) => {
      target.removeEventListener(type, listener, options);
    });
    this.eventListeners = [];
  }

  // Force garbage collection (if available)
  forceGC(): void {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }

  // Memory usage monitoring
  getMemoryUsage(): any {
    if ('memory' in performance && (performance as any).memory) {
      return {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1048576),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1048576),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const performanceManager = useRef(PerformanceManager.getInstance());
  const isCleanedUp = useRef(false);

  useEffect(() => {
    const monitor = () => {
      const memory = performanceManager.current.getMemoryUsage();
      if (memory && memory.used > memory.limit * 0.8) {
        console.warn('Memory usage high:', memory);
        performanceManager.current.cleanup();
        performanceManager.current.forceGC();
      }
    };

    const monitorInterval = performanceManager.current.addInterval(monitor, 10000);

    return () => {
      clearInterval(monitorInterval);
    };
  }, []);

  useEffect(() => {
    const cleanup = () => {
      if (!isCleanedUp.current) {
        performanceManager.current.cleanup();
        isCleanedUp.current = true;
      }
    };

    const handleUnload = () => cleanup();
    const handleBeforeUnload = () => cleanup();
    const handleVisibilityChange = () => {
      if (document.hidden) cleanup();
    };

    performanceManager.current.addEventListener(window, 'beforeunload', handleBeforeUnload);
    performanceManager.current.addEventListener(window, 'unload', handleUnload);
    performanceManager.current.addEventListener(document, 'visibilitychange', handleVisibilityChange);

    return cleanup;
  }, []);

  return <>{children}</>;
};

// Hook for using performance manager
export const usePerformance = () => {
  const performanceManager = useRef(PerformanceManager.getInstance());

  const optimizedSetTimeout = useCallback((callback: () => void, delay: number) => {
    return performanceManager.current.addTimeout(callback, delay);
  }, []);

  const optimizedSetInterval = useCallback((callback: () => void, delay: number) => {
    return performanceManager.current.addInterval(callback, delay);
  }, []);

  const optimizedRequestAnimationFrame = useCallback((callback: FrameRequestCallback) => {
    return performanceManager.current.addAnimationFrame(callback);
  }, []);

  const optimizedAddEventListener = useCallback((
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ) => {
    return performanceManager.current.addEventListener(target, type, listener, options);
  }, []);

  const throttle = useCallback(<T extends (...args: any[]) => any>(func: T, limit: number) => {
    return performanceManager.current.throttle(func, limit);
  }, []);

  const debounce = useCallback(<T extends (...args: any[]) => any>(func: T, delay: number) => {
    return performanceManager.current.debounce(func, delay);
  }, []);

  const cleanup = useCallback(() => {
    performanceManager.current.cleanup();
  }, []);

  const getMemoryUsage = useCallback(() => {
    return performanceManager.current.getMemoryUsage();
  }, []);

  return {
    setTimeout: optimizedSetTimeout,
    setInterval: optimizedSetInterval,
    requestAnimationFrame: optimizedRequestAnimationFrame,
    addEventListener: optimizedAddEventListener,
    throttle,
    debounce,
    cleanup,
    getMemoryUsage
  };
};

export default PerformanceOptimizer;