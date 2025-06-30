import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ========================================
// EXPERT LEVEL RESPONSIVE SYSTEM
// ========================================

// Enhanced breakpoint system with logical naming
export const BREAKPOINTS = {
  // Mobile-first approach
  xs: 320,   // Small mobile
  sm: 640,   // Large mobile / small tablet
  md: 768,   // Tablet
  lg: 1024,  // Small desktop
  xl: 1280,  // Desktop
  '2xl': 1536, // Large desktop
  '3xl': 1920, // Wide desktop
  '4xl': 2560, // Ultra-wide
} as const;

// Container max-widths for each breakpoint
export const CONTAINER_SIZES = {
  xs: '100%',
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1800px',
  '4xl': '2400px',
} as const;

// Responsive spacing scale
export const SPACING_SCALE = {
  xs: { base: 4, factor: 1 },
  sm: { base: 4, factor: 1.125 },
  md: { base: 6, factor: 1.25 },
  lg: { base: 8, factor: 1.375 },
  xl: { base: 10, factor: 1.5 },
  '2xl': { base: 12, factor: 1.625 },
  '3xl': { base: 14, factor: 1.75 },
  '4xl': { base: 16, factor: 2 },
} as const;

// Typography scale per breakpoint
export const TYPOGRAPHY_SCALE = {
  xs: {
    h1: { size: '1.875rem', lineHeight: '2.25rem', weight: '700' },
    h2: { size: '1.5rem', lineHeight: '2rem', weight: '600' },
    h3: { size: '1.25rem', lineHeight: '1.75rem', weight: '600' },
    body: { size: '0.875rem', lineHeight: '1.25rem', weight: '400' },
    small: { size: '0.75rem', lineHeight: '1rem', weight: '400' },
  },
  sm: {
    h1: { size: '2.25rem', lineHeight: '2.5rem', weight: '700' },
    h2: { size: '1.875rem', lineHeight: '2.25rem', weight: '600' },
    h3: { size: '1.5rem', lineHeight: '2rem', weight: '600' },
    body: { size: '1rem', lineHeight: '1.5rem', weight: '400' },
    small: { size: '0.875rem', lineHeight: '1.25rem', weight: '400' },
  },
  md: {
    h1: { size: '3rem', lineHeight: '1', weight: '700' },
    h2: { size: '2.25rem', lineHeight: '2.5rem', weight: '600' },
    h3: { size: '1.875rem', lineHeight: '2.25rem', weight: '600' },
    body: { size: '1rem', lineHeight: '1.5rem', weight: '400' },
    small: { size: '0.875rem', lineHeight: '1.25rem', weight: '400' },
  },
  lg: {
    h1: { size: '3.75rem', lineHeight: '1', weight: '700' },
    h2: { size: '3rem', lineHeight: '1', weight: '600' },
    h3: { size: '2.25rem', lineHeight: '2.5rem', weight: '600' },
    body: { size: '1.125rem', lineHeight: '1.75rem', weight: '400' },
    small: { size: '1rem', lineHeight: '1.5rem', weight: '400' },
  },
  xl: {
    h1: { size: '4.5rem', lineHeight: '1', weight: '700' },
    h2: { size: '3.75rem', lineHeight: '1', weight: '600' },
    h3: { size: '3rem', lineHeight: '1', weight: '600' },
    body: { size: '1.125rem', lineHeight: '1.75rem', weight: '400' },
    small: { size: '1rem', lineHeight: '1.5rem', weight: '400' },
  },
  '2xl': {
    h1: { size: '5rem', lineHeight: '1', weight: '700' },
    h2: { size: '4.5rem', lineHeight: '1', weight: '600' },
    h3: { size: '3.75rem', lineHeight: '1', weight: '600' },
    body: { size: '1.25rem', lineHeight: '1.75rem', weight: '400' },
    small: { size: '1.125rem', lineHeight: '1.75rem', weight: '400' },
  },
  '3xl': {
    h1: { size: '6rem', lineHeight: '1', weight: '700' },
    h2: { size: '5rem', lineHeight: '1', weight: '600' },
    h3: { size: '4.5rem', lineHeight: '1', weight: '600' },
    body: { size: '1.25rem', lineHeight: '1.75rem', weight: '400' },
    small: { size: '1.125rem', lineHeight: '1.75rem', weight: '400' },
  },
  '4xl': {
    h1: { size: '7rem', lineHeight: '1', weight: '700' },
    h2: { size: '6rem', lineHeight: '1', weight: '600' },
    h3: { size: '5rem', lineHeight: '1', weight: '600' },
    body: { size: '1.5rem', lineHeight: '2rem', weight: '400' },
    small: { size: '1.25rem', lineHeight: '1.75rem', weight: '400' },
  },
} as const;

// Device categories
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop' | 'ultrawide';
export type BreakpointKey = keyof typeof BREAKPOINTS;
export type OrientationType = 'portrait' | 'landscape';

// Advanced device detection interface
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

// Responsive value type for flexible configurations
export type ResponsiveValue<T> = T | Partial<Record<BreakpointKey, T>>;

// ========================================
// CORE RESPONSIVE HOOKS
// ========================================

/**
 * Advanced useMediaQuery hook with cleanup and performance optimization
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    mediaQueryRef.current = mediaQuery;
    
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use modern addEventListener if available, fallback to deprecated method
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Enhanced useViewport hook with comprehensive device information
 */
export function useViewport(): DeviceInfo {
  const [viewport, setViewport] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
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

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return createDeviceInfo(width, height);
  });

  const updateViewport = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setViewport(createDeviceInfo(width, height));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Throttled resize handler for performance
    let timeoutId: NodeJS.Timeout;
    const throttledUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewport, 16); // ~60fps
    };

    window.addEventListener('resize', throttledUpdate, { passive: true });
    window.addEventListener('orientationchange', throttledUpdate, { passive: true });

    // Listen for color scheme changes
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', throttledUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('orientationchange', throttledUpdate);
      colorSchemeQuery.removeEventListener('change', throttledUpdate);
    };
  }, [updateViewport]);

  return viewport;
}

/**
 * Smart responsive value resolver
 */
export function useResponsiveValue<T>(value: ResponsiveValue<T>): T {
  const { breakpoint } = useViewport();
  
  return useMemo(() => {
    if (typeof value !== 'object' || value === null) {
      return value as T;
    }

    const responsiveValue = value as Partial<Record<BreakpointKey, T>>;
    const breakpoints = Object.keys(BREAKPOINTS) as BreakpointKey[];
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

/**
 * Breakpoint detection hooks
 */
export function useBreakpoint(bp: BreakpointKey): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[bp]}px)`);
}

export function useBreakpointRange(min: BreakpointKey, max?: BreakpointKey): boolean {
  const minQuery = `(min-width: ${BREAKPOINTS[min]}px)`;
  const maxQuery = max ? `(max-width: ${BREAKPOINTS[max] - 1}px)` : '';
  const query = max ? `${minQuery} and ${maxQuery}` : minQuery;
  
  return useMediaQuery(query);
}

/**
 * Orientation detection
 */
export function useOrientation(): OrientationType {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  return isLandscape ? 'landscape' : 'portrait';
}

/**
 * Touch device detection
 */
export function useTouch(): boolean {
  return useMediaQuery('(pointer: coarse)');
}

/**
 * Hover capability detection
 */
export function useHover(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

/**
 * Reduced motion preference
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Dark mode preference
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * High contrast preference
 */
export function usePrefersHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: high)');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Create comprehensive device information
 */
function createDeviceInfo(width: number, height: number): DeviceInfo {
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const orientation: OrientationType = width > height ? 'landscape' : 'portrait';
  
  // Determine breakpoint
  const breakpoint = getBreakpointFromWidth(width);
  
  // Determine device category
  const category = getDeviceCategory(width);
  
  // Feature detection
  const isTouch = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  const isRetina = pixelRatio >= 2;
  
  const hasHover = typeof window !== 'undefined' && 
    window.matchMedia('(hover: hover)').matches;
    
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
  const colorScheme = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
  const canHover = typeof window !== 'undefined' && 
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
  const pointerAccuracy = typeof window !== 'undefined' && 
    window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine';

  return {
    category,
    breakpoint,
    width,
    height,
    orientation,
    pixelRatio,
    isTouch,
    isRetina,
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

/**
 * Get breakpoint from width
 */
function getBreakpointFromWidth(width: number): BreakpointKey {
  const breakpoints = Object.entries(BREAKPOINTS).reverse() as [BreakpointKey, number][];
  
  for (const [key, value] of breakpoints) {
    if (width >= value) {
      return key;
    }
  }
  
  return 'xs';
}

/**
 * Get device category from dimensions
 */
function getDeviceCategory(width: number): DeviceCategory {
  if (width >= BREAKPOINTS['3xl']) return 'ultrawide';
  if (width >= BREAKPOINTS.lg) return 'desktop';
  if (width >= BREAKPOINTS.sm) return 'tablet';
  return 'mobile';
}

/**
 * Generate responsive CSS classes
 */
export function generateResponsiveClasses<T extends string>(
  base: T,
  values: ResponsiveValue<string>
): string {
  if (typeof values === 'string') {
    return `${base}-${values}`;
  }

  const classes: string[] = [];
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    if (value) {
      const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
      classes.push(`${prefix}${base}-${value}`);
    }
  });

  return classes.join(' ');
}

/**
 * Get responsive spacing value
 */
export function getResponsiveSpacing(
  breakpoint: BreakpointKey,
  multiplier: number = 1
): number {
  const scale = SPACING_SCALE[breakpoint];
  return scale.base * scale.factor * multiplier;
}

/**
 * Get responsive typography styles
 */
export function getResponsiveTypography(
  breakpoint: BreakpointKey,
  variant: keyof typeof TYPOGRAPHY_SCALE[BreakpointKey]
) {
  return TYPOGRAPHY_SCALE[breakpoint][variant];
}

/**
 * Create responsive container class
 */
export function getResponsiveContainer(breakpoint?: BreakpointKey): string {
  if (!breakpoint) return 'container mx-auto px-4';
  
  const maxWidth = CONTAINER_SIZES[breakpoint];
  return `container mx-auto px-4 max-w-[${maxWidth}]`;
}

/**
 * Performance-optimized responsive image source generator
 */
export function generateResponsiveSources(
  baseUrl: string,
  sizes: Partial<Record<BreakpointKey, { width: number; quality?: number }>>
): { srcSet: string; sizes: string } {
  const srcSetEntries: string[] = [];
  const sizesEntries: string[] = [];

  Object.entries(sizes).forEach(([breakpoint, config]) => {
    const bp = breakpoint as BreakpointKey;
    const { width, quality = 80 } = config;
    
    srcSetEntries.push(`${baseUrl}?w=${width}&q=${quality} ${width}w`);
    
    if (bp !== 'xs') {
      sizesEntries.push(`(min-width: ${BREAKPOINTS[bp]}px) ${width}px`);
    }
  });

  // Add default size for smallest breakpoint
  const defaultSize = sizes.xs?.width || 320;
  sizesEntries.push(`${defaultSize}px`);

  return {
    srcSet: srcSetEntries.join(', '),
    sizes: sizesEntries.join(', ')
  };
}

// ========================================
// EXPORT ALL
// ========================================

export default {
  BREAKPOINTS,
  CONTAINER_SIZES,
  SPACING_SCALE,
  TYPOGRAPHY_SCALE,
  useMediaQuery,
  useViewport,
  useResponsiveValue,
  useBreakpoint,
  useBreakpointRange,
  useOrientation,
  useTouch,
  useHover,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  usePrefersHighContrast,
  generateResponsiveClasses,
  getResponsiveSpacing,
  getResponsiveTypography,
  getResponsiveContainer,
  generateResponsiveSources,
};