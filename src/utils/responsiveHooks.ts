import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ========================================
// OPTIMIZED RESPONSIVE SYSTEM WITH MULTI-MONITOR SUPPORT
// ========================================

// Enhanced breakpoint system
export const BREAKPOINTS = {
  xs: 320,   // Small mobile
  sm: 640,   // Large mobile / small tablet
  md: 768,   // Tablet
  lg: 1024,  // Small desktop
  xl: 1280,  // Desktop
  '2xl': 1536, // Large desktop
  '3xl': 1920, // Wide desktop
  '4xl': 2560, // Ultra-wide
} as const;

export type DeviceCategory = 'mobile' | 'tablet' | 'desktop' | 'ultrawide';
export type BreakpointKey = keyof typeof BREAKPOINTS;
export type OrientationType = 'portrait' | 'landscape';

export interface DeviceInfo {
  category: DeviceCategory;
  breakpoint: BreakpointKey;
  width: number;
  height: number;
  orientation: OrientationType;
  pixelRatio: number;
  isTouch: boolean;
  isRetina: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasHover: boolean;
  prefersReducedMotion: boolean;
  colorScheme: 'light' | 'dark';
  canHover: boolean;
  pointerAccuracy: 'coarse' | 'fine';
}

export type ResponsiveValue<T> = T | Partial<Record<BreakpointKey, T>>;

// ========================================
// DEBOUNCED RESIZE MANAGER
// ========================================

class ResizeManager {
  private static instance: ResizeManager | null = null;
  private listeners: Set<() => void> = new Set();
  private debounceTimer: NodeJS.Timeout | null = null;
  private rafId: number | null = null;
  private isResizing: boolean = false;
  private lastWidth: number = 0;
  private lastHeight: number = 0;

  static getInstance(): ResizeManager {
    if (!ResizeManager.instance) {
      ResizeManager.instance = new ResizeManager();
    }
    return ResizeManager.instance;
  }

  private constructor() {
    if (typeof window !== 'undefined') {
      this.lastWidth = window.innerWidth;
      this.lastHeight = window.innerHeight;
      this.setupEventListeners();
    }
  }

  private setupEventListeners() {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Only process if dimensions actually changed
      if (currentWidth === this.lastWidth && currentHeight === this.lastHeight) {
        return;
      }

      this.lastWidth = currentWidth;
      this.lastHeight = currentHeight;
      this.isResizing = true;

      // Cancel existing timers
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }

      // Immediate update for responsive feedback
      this.rafId = requestAnimationFrame(() => {
        this.notifyListeners();
      });

      // Debounced update for final state
      this.debounceTimer = setTimeout(() => {
        this.isResizing = false;
        this.notifyListeners();
      }, 150); // 150ms debounce for multi-monitor stability
    };

    // Use passive listeners for better performance
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Handle visibility changes (important for multi-monitor setups)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Re-check dimensions when tab becomes visible
        setTimeout(handleResize, 50);
      }
    });
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.warn('Error in resize listener:', error);
      }
    });
  }

  addListener(listener: () => void): () => void {
    this.listeners.add(listener);
    
    // Return cleanup function
    return () => {
      this.listeners.delete(listener);
    };
  }

  getResizeState() {
    return {
      isResizing: this.isResizing,
      width: this.lastWidth,
      height: this.lastHeight,
    };
  }

  cleanup() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.listeners.clear();
  }
}

// ========================================
// OPTIMIZED MEDIA QUERY HOOK
// ========================================

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const mediaQuery = window.matchMedia(query);
      mediaQueryRef.current = mediaQuery;
      
      setMatches(mediaQuery.matches);

      const handler = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Use modern API with fallback
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
        cleanupRef.current = () => mediaQuery.removeEventListener('change', handler);
      } else {
        // Legacy support
        mediaQuery.addListener(handler);
        cleanupRef.current = () => mediaQuery.removeListener(handler);
      }
    } catch (error) {
      console.warn(`Invalid media query: ${query}`, error);
    }

    return () => {
      cleanupRef.current?.();
    };
  }, [query]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return matches;
}

// ========================================
// OPTIMIZED VIEWPORT HOOK
// ========================================

export function useViewport(): DeviceInfo {
  const [viewport, setViewport] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return createSSRDeviceInfo();
    }
    return createDeviceInfo(window.innerWidth, window.innerHeight);
  });

  const isMountedRef = useRef(true);
  const resizeManager = useRef<ResizeManager | null>(null);

  const updateViewport = useCallback(() => {
    if (!isMountedRef.current || typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const newViewport = createDeviceInfo(width, height);
    
    setViewport(prev => {
      // Only update if something actually changed
      if (
        prev.width === newViewport.width &&
        prev.height === newViewport.height &&
        prev.breakpoint === newViewport.breakpoint &&
        prev.orientation === newViewport.orientation
      ) {
        return prev;
      }
      return newViewport;
    });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (typeof window === 'undefined') return;

    // Get resize manager instance
    resizeManager.current = ResizeManager.getInstance();
    
    // Subscribe to resize events
    const cleanup = resizeManager.current.addListener(updateViewport);

    // Initial update
    updateViewport();

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [updateViewport]);

  return viewport;
}

// ========================================
// OPTIMIZED RESPONSIVE VALUE HOOK
// ========================================

export function useResponsiveValue<T>(value: ResponsiveValue<T>): T {
  const { breakpoint } = useViewport();
  
  return useMemo(() => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return value as T;
    }

    const responsiveValue = value as Partial<Record<BreakpointKey, T>>;
    const breakpoints: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    const currentIndex = breakpoints.indexOf(breakpoint);

    // Find the closest defined value (mobile-first approach)
    for (let i = currentIndex; i >= 0; i--) {
      const bp = breakpoints[i];
      if (responsiveValue[bp] !== undefined) {
        return responsiveValue[bp] as T;
      }
    }

    // Fallback to first available value
    for (const bp of breakpoints) {
      if (responsiveValue[bp] !== undefined) {
        return responsiveValue[bp] as T;
      }
    }

    return undefined as T;
  }, [value, breakpoint]);
}

// ========================================
// OPTIMIZED FEATURE DETECTION HOOKS
// ========================================

export function useBreakpoint(bp: BreakpointKey): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[bp]}px)`);
}

export function useOrientation(): OrientationType {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  return isLandscape ? 'landscape' : 'portrait';
}

export function useTouch(): boolean {
  return useMediaQuery('(pointer: coarse)');
}

export function useHover(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function createSSRDeviceInfo(): DeviceInfo {
  return {
    category: 'desktop',
    breakpoint: 'lg',
    width: 1024,
    height: 768,
    orientation: 'landscape',
    pixelRatio: 1,
    isTouch: false,
    isRetina: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasHover: true,
    prefersReducedMotion: false,
    colorScheme: 'dark',
    canHover: true,
    pointerAccuracy: 'fine',
  };
}

function createDeviceInfo(width: number, height: number): DeviceInfo {
  // Safe feature detection with fallbacks
  const pixelRatio = typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1;
  const orientation: OrientationType = width > height ? 'landscape' : 'portrait';
  
  const breakpoint = getBreakpointFromWidth(width);
  const category = getDeviceCategory(width);
  
  // Safe feature detection
  let isTouch = false;
  let hasHover = true;
  let prefersReducedMotion = false;
  let colorScheme: 'light' | 'dark' = 'dark';
  let canHover = true;
  let pointerAccuracy: 'coarse' | 'fine' = 'fine';

  if (typeof window !== 'undefined') {
    try {
      isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      hasHover = window.matchMedia('(hover: hover)').matches;
      prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      pointerAccuracy = window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine';
    } catch (error) {
      console.warn('Feature detection failed:', error);
    }
  }

  return {
    category,
    breakpoint,
    width,
    height,
    orientation,
    pixelRatio,
    isTouch,
    isRetina: pixelRatio >= 2,
    isMobile: category === 'mobile',
    isTablet: category === 'tablet',
    isDesktop: category === 'desktop' || category === 'ultrawide',
    hasHover,
    prefersReducedMotion,
    colorScheme,
    canHover,
    pointerAccuracy,
  };
}

function getBreakpointFromWidth(width: number): BreakpointKey {
  const breakpoints = Object.entries(BREAKPOINTS).reverse() as [BreakpointKey, number][];
  
  for (const [key, value] of breakpoints) {
    if (width >= value) {
      return key;
    }
  }
  
  return 'xs';
}

function getDeviceCategory(width: number): DeviceCategory {
  if (width >= BREAKPOINTS['3xl']) return 'ultrawide';
  if (width >= BREAKPOINTS.lg) return 'desktop';
  if (width >= BREAKPOINTS.sm) return 'tablet';
  return 'mobile';
}

// ========================================
// CLEANUP UTILITY
// ========================================

export function cleanupResponsiveSystem() {
  const manager = ResizeManager.getInstance();
  manager.cleanup();
}

// ========================================
// EXPORT ALL
// ========================================

export default {
  BREAKPOINTS,
  useMediaQuery,
  useViewport,
  useResponsiveValue,
  useBreakpoint,
  useOrientation,
  useTouch,
  useHover,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  cleanupResponsiveSystem,
};