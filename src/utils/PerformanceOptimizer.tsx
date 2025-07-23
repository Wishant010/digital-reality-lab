import { useEffect, useRef, useCallback } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

// ULTRA-HIGH-PERFORMANCE Management System
class PerformanceManager {
  private static instance: PerformanceManager;
  private animationFrames: Set<number> = new Set(); // Use Set for O(1) operations
  private timeouts: Set<number> = new Set();
  private intervals: Set<number> = new Set();
  private eventListeners: Map<string, { target: EventTarget; type: string; listener: EventListener; options?: AddEventListenerOptions }> = new Map();
  private memoryThreshold = 0.65; // More aggressive memory management
  private isMonitoring = false;
  private lastCleanup = 0;
  private frameCount = 0;
  private cleanupThreshold = 30; // Cleanup more frequently

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  // Ultra-optimized requestAnimationFrame with automatic cleanup
  addAnimationFrame(callback: FrameRequestCallback): number {
    const id = requestAnimationFrame((time) => {
      this.animationFrames.delete(id);
      try {
        callback(time);
      } catch (error) {
        console.warn('Animation frame callback error:', error);
      }
    });
    this.animationFrames.add(id);
    this.scheduleCleanup();
    return id;
  }

  // High-performance setTimeout with memory management
  addTimeout(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      this.timeouts.delete(id);
      try {
        callback();
      } catch (error) {
        console.warn('Timeout callback error:', error);
      }
    }, delay);
    this.timeouts.add(id);
    this.scheduleCleanup();
    return id;
  }

  // Optimized setInterval with tracking
  addInterval(callback: () => void, delay: number): number {
    const id = window.setInterval(() => {
      try {
        callback();
      } catch (error) {
        console.warn('Interval callback error:', error);
        this.clearInterval(id);
      }
    }, delay);
    this.intervals.add(id);
    return id;
  }

  // Smart event listener with deduplication
  addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ): void {
    const key = `${target.constructor.name}-${type}`;
    
    // Remove existing listener if any
    if (this.eventListeners.has(key)) {
      const existing = this.eventListeners.get(key)!;
      existing.target.removeEventListener(existing.type, existing.listener, existing.options);
    }

    const optimizedOptions = {
      passive: true,
      capture: false,
      ...options
    };
    
    target.addEventListener(type, listener, optimizedOptions);
    this.eventListeners.set(key, { target, type, listener, options: optimizedOptions });
  }

  // Clear specific interval
  clearInterval(id: number): void {
    if (this.intervals.has(id)) {
      window.clearInterval(id);
      this.intervals.delete(id);
    }
  }

  // Ultra-fast throttle with minimal memory footprint
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    let timeoutId: number | null = null;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        
        if (timeoutId) this.timeouts.delete(timeoutId);
        timeoutId = this.addTimeout(() => {
          inThrottle = false;
          timeoutId = null;
        }, limit);
      }
    };
  }

  // Lightning-fast debounce
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: number | null = null;
    
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        this.timeouts.delete(timeoutId);
        window.clearTimeout(timeoutId);
      }
      
      timeoutId = this.addTimeout(() => {
        func.apply(this, args);
        timeoutId = null;
      }, delay);
    };
  }

  // Aggressive cleanup with memory optimization
  cleanup(): void {
    const now = performance.now();
    
    // Prevent excessive cleanup calls
    if (now - this.lastCleanup < 100) return;
    this.lastCleanup = now;

    // Batch cleanup for better performance
    this.animationFrames.forEach(id => cancelAnimationFrame(id));
    this.animationFrames.clear();

    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts.clear();

    this.intervals.forEach(id => clearInterval(id));
    this.intervals.clear();

    this.eventListeners.forEach(({ target, type, listener, options }) => {
      try {
        target.removeEventListener(type, listener, options);
      } catch (error) {
        console.warn('Error removing event listener:', error);
      }
    });
    this.eventListeners.clear();

    // Force garbage collection if available
    this.forceGC();
  }

  // Schedule smart cleanup based on usage
  private scheduleCleanup(): void {
    const totalResources = this.animationFrames.size + this.timeouts.size + this.intervals.size;
    
    if (totalResources > this.cleanupThreshold) { // Use dynamic threshold for aggressive cleanup
      this.addTimeout(() => this.partialCleanup(), 0);
    }
  }

  // Partial cleanup for ongoing optimization
  private partialCleanup(): void {
    const memory = this.getMemoryUsage();
    if (memory && memory.used > memory.limit * this.memoryThreshold) {
      this.cleanup();
    }
  }

  // Enhanced garbage collection
  forceGC(): void {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      try {
        (window as any).gc();
      } catch (error) {
        // Silently fail if GC not available
      }
    }
  }

  // Fast memory usage monitoring
  getMemoryUsage(): { used: number; total: number; limit: number } | null {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }

  // Start intelligent monitoring
  startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    const monitor = () => {
      this.frameCount++;
      
      // Calculate FPS every second
      if (this.frameCount % 60 === 0) {
        const memory = this.getMemoryUsage();
        if (memory && memory.used > memory.limit * this.memoryThreshold) {
          this.partialCleanup();
        }
      }
      
      if (this.isMonitoring) {
        this.addAnimationFrame(monitor);
      }
    };
    
    this.addAnimationFrame(monitor);
  }

  // Stop monitoring
  stopMonitoring(): void {
    this.isMonitoring = false;
  }
}

// ULTRA-OPTIMIZED Performance Component
const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const performanceManager = useRef(PerformanceManager.getInstance());
  const isCleanedUp = useRef(false);
  const monitoringInterval = useRef<number | null>(null);

  // Ultra-aggressive memory monitoring
  useEffect(() => {
    const aggressiveMonitor = () => {
      const memory = performanceManager.current.getMemoryUsage();
      if (memory && memory.used > memory.limit * 0.7) {
        console.warn('High memory usage detected, cleaning up:', memory);
        performanceManager.current.cleanup();
        performanceManager.current.forceGC();
      }
    };

    // Monitor every 5 seconds for ultra-responsive cleanup
    monitoringInterval.current = performanceManager.current.addInterval(aggressiveMonitor, 5000);
    
    // Start intelligent monitoring
    performanceManager.current.startMonitoring();

    return () => {
      if (monitoringInterval.current) {
        performanceManager.current.clearInterval(monitoringInterval.current);
      }
      performanceManager.current.stopMonitoring();
    };
  }, []);

  // Multi-layer cleanup system
  useEffect(() => {
    const ultraCleanup = () => {
      if (!isCleanedUp.current) {
        performanceManager.current.cleanup();
        performanceManager.current.forceGC();
        isCleanedUp.current = true;
      }
    };

    // Multiple cleanup triggers for maximum reliability
    const handleUnload = () => ultraCleanup();
    const handleBeforeUnload = () => ultraCleanup();
    const handleVisibilityChange = () => {
      if (document.hidden) ultraCleanup();
    };
    const handlePageHide = () => ultraCleanup();
    const handleFreeze = () => ultraCleanup();

    // Register all cleanup events
    performanceManager.current.addEventListener(window, 'beforeunload', handleBeforeUnload);
    performanceManager.current.addEventListener(window, 'unload', handleUnload);
    performanceManager.current.addEventListener(window, 'pagehide', handlePageHide);
    performanceManager.current.addEventListener(document, 'visibilitychange', handleVisibilityChange);
    performanceManager.current.addEventListener(document, 'freeze', handleFreeze);

    // Cleanup on low memory
    if ('memory' in performance) {
      performanceManager.current.addEventListener(window, 'lowmemory', ultraCleanup);
    }

    return ultraCleanup;
  }, []);

  return <>{children}</>;
};

// ULTRA-HIGH-PERFORMANCE Hook for optimized operations
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

  const forceGC = useCallback(() => {
    performanceManager.current.forceGC();
  }, []);

  return {
    setTimeout: optimizedSetTimeout,
    setInterval: optimizedSetInterval,
    requestAnimationFrame: optimizedRequestAnimationFrame,
    addEventListener: optimizedAddEventListener,
    throttle,
    debounce,
    cleanup,
    getMemoryUsage,
    forceGC
  };
};

export default PerformanceOptimizer;