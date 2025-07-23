import { useEffect, useCallback, useRef } from 'react';

interface CleanupManager {
  cleanup: () => void;
  isActive: boolean;
}

/**
 * Global cleanup and performance manager
 * Prevents memory leaks and ensures smooth operation
 */
class GlobalCleanupManager {
  private static instance: GlobalCleanupManager;
  private cleanupTasks: Set<() => void> = new Set();
  private memoryMonitorInterval: number | null = null;
  private isMonitoring = false;

  static getInstance(): GlobalCleanupManager {
    if (!GlobalCleanupManager.instance) {
      GlobalCleanupManager.instance = new GlobalCleanupManager();
    }
    return GlobalCleanupManager.instance;
  }

  addCleanupTask(task: () => void): () => void {
    this.cleanupTasks.add(task);
    return () => this.cleanupTasks.delete(task);
  }

  startMemoryMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    this.memoryMonitorInterval = window.setInterval(() => {
      this.checkMemoryUsage();
    }, 3000); // Check every 3 seconds
  }

  stopMemoryMonitoring(): void {
    this.isMonitoring = false;
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
      this.memoryMonitorInterval = null;
    }
  }

  private checkMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      if (usageRatio > 0.7) {
        console.warn('High memory usage detected, running cleanup');
        this.runCleanup();
        this.forceGarbageCollection();
      }
    }
  }

  private runCleanup(): void {
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Cleanup task failed:', error);
      }
    });
  }

  private forceGarbageCollection(): void {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      try {
        (window as any).gc();
      } catch (error) {
        // Silently fail if GC not available
      }
    }
  }

  cleanup(): void {
    this.runCleanup();
    this.stopMemoryMonitoring();
    this.cleanupTasks.clear();
  }
}

/**
 * Hook for automatic cleanup management
 */
export const useCleanup = (cleanupFn?: () => void): CleanupManager => {
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const isActiveRef = useRef(true);
  const managerRef = useRef(GlobalCleanupManager.getInstance());

  const performCleanup = useCallback(() => {
    if (isActiveRef.current) {
      cleanupRef.current?.();
      cleanupFn?.();
      isActiveRef.current = false;
    }
  }, [cleanupFn]);

  useEffect(() => {
    cleanupRef.current = cleanupFn;
    const removeCleanupTask = managerRef.current.addCleanupTask(performCleanup);
    
    // Start memory monitoring
    managerRef.current.startMemoryMonitoring();

    return () => {
      performCleanup();
      removeCleanupTask();
    };
  }, [performCleanup]);

  // Global cleanup on critical events
  useEffect(() => {
    const handleBeforeUnload = () => performCleanup();
    const handleVisibilityChange = () => {
      if (document.hidden) performCleanup();
    };
    const handlePageHide = () => performCleanup();

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [performCleanup]);

  return {
    cleanup: performCleanup,
    isActive: isActiveRef.current
  };
};

/**
 * Global cleanup component
 */
export const GlobalCleanupProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  useCleanup(() => {
    // Global cleanup logic
    console.log('Running global cleanup');
  });

  return <>{children}</>;
};

export default GlobalCleanupManager;
