import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useViewport, type BreakpointKey } from './responsive';

// ========================================
// ADVANCED RESPONSIVE HOOKS
// ========================================

/**
 * Hook for element-based responsive behavior using ResizeObserver
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const elementRef = useRef<T>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    resizeObserver.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.current.observe(element);

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  return { ref: elementRef, size };
}

/**
 * Hook for container-based responsive queries
 */
export function useContainerQuery(containerRef: React.RefObject<HTMLElement>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerWidth(width);
        setContainerHeight(height);
      }
    });

    resizeObserver.observe(element);
    
    // Initial measurement
    const rect = element.getBoundingClientRect();
    setContainerWidth(rect.width);
    setContainerHeight(rect.height);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  const containerBreakpoint = useMemo(() => {
    if (containerWidth >= 1280) return 'xl';
    if (containerWidth >= 1024) return 'lg';
    if (containerWidth >= 768) return 'md';
    if (containerWidth >= 640) return 'sm';
    return 'xs';
  }, [containerWidth]);

  return {
    containerWidth,
    containerHeight,
    containerBreakpoint,
    isContainerSmall: containerWidth < 640,
    isContainerMedium: containerWidth >= 640 && containerWidth < 1024,
    isContainerLarge: containerWidth >= 1024,
  };
}

/**
 * Hook for responsive image loading
 */
export function useResponsiveImage(
  sources: Record<BreakpointKey, string>,
  options?: {
    lazy?: boolean;
    quality?: number;
    placeholder?: string;
  }
) {
  const { breakpoint } = useViewport();
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { lazy = true, quality = 80, placeholder } = options || {};

  // Determine best source for current breakpoint
  const targetSrc = useMemo(() => {
    const breakpoints: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    const currentIndex = breakpoints.indexOf(breakpoint);
    
    // Find best available source (mobile-first)
    for (let i = currentIndex; i >= 0; i--) {
      const bp = breakpoints[i];
      if (sources[bp]) {
        const url = sources[bp];
        return quality < 100 ? `${url}?q=${quality}` : url;
      }
    }
    
    // Fallback to first available source
    for (const bp of breakpoints) {
      if (sources[bp]) {
        const url = sources[bp];
        return quality < 100 ? `${url}?q=${quality}` : url;
      }
    }
    
    return placeholder || '';
  }, [breakpoint, sources, quality, placeholder]);

  // Load image when target source changes
  useEffect(() => {
    if (!targetSrc || targetSrc === currentSrc) return;

    setIsLoading(true);
    setError(null);

    const img = new Image();
    let observer: IntersectionObserver | null = null;
    let tempElement: HTMLDivElement | null = null;

    img.onload = () => {
      setCurrentSrc(targetSrc);
      setIsLoaded(true);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };

    if (lazy) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            img.src = targetSrc;
            observer!.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      tempElement = document.createElement('div');
      observer.observe(tempElement);
    } else {
      img.src = targetSrc;
    }

    return () => {
      if (observer) observer.disconnect();
      tempElement = null;
    };
  }, [targetSrc, currentSrc, lazy]);

  return {
    src: currentSrc || placeholder || '',
    isLoaded,
    isLoading,
    error,
    targetSrc,
  };
}

/**
 * Hook for responsive font loading
 */
export function useResponsiveFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { breakpoint } = useViewport();

  useEffect(() => {
    if (!('fonts' in document)) {
      setFontsLoaded(true);
      return;
    }

    const loadFonts = async () => {
      try {
        // Load different font weights based on screen size
        const fontsToLoad = [
          'Inter 400',
          'Inter 500',
          'Inter 600',
        ];

        // Add more weights for larger screens
        if (breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl') {
          fontsToLoad.push('Inter 700', 'Inter 800');
        }

        await Promise.all(
          fontsToLoad.map(font => document.fonts.load(font))
        );

        setFontsLoaded(true);
      } catch (error) {
        console.warn('Font loading failed:', error);
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, [breakpoint]);

  return fontsLoaded;
}

/**
 * Hook for responsive performance monitoring
 */
export function useResponsivePerformance() {
  const { isMobile, prefersReducedMotion } = useViewport();
  const [performance, setPerformance] = useState({
    fps: 60,
    memoryUsage: 0,
    networkSpeed: 'unknown' as 'slow' | 'fast' | 'unknown',
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = 0;
    let animationId: number;

    const measureFPS = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setPerformance(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    // Start FPS monitoring only if animations are enabled
    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(measureFPS);
    }

    // Monitor memory usage
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setPerformance(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
        }));
      }
    };

    // Monitor network speed
    const checkNetworkSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const speed = connection.effectiveType === '4g' || connection.effectiveType === '3g' 
          ? 'fast' 
          : 'slow';
        setPerformance(prev => ({ ...prev, networkSpeed: speed }));
      }
    };

    checkMemory();
    checkNetworkSpeed();

    const memoryInterval = setInterval(checkMemory, 5000);
    const networkInterval = setInterval(checkNetworkSpeed, 10000);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearInterval(memoryInterval);
      clearInterval(networkInterval);
    };
  }, [prefersReducedMotion]);

  // Performance recommendations
  const recommendations = useMemo(() => {
    const suggestions: string[] = [];
    
    if (performance.fps < 30) {
      suggestions.push('Consider reducing animation complexity');
    }
    
    if (performance.memoryUsage > 0.8) {
      suggestions.push('High memory usage detected - consider optimizing components');
    }
    
    if (performance.networkSpeed === 'slow') {
      suggestions.push('Slow network detected - consider reducing asset sizes');
    }
    
    if (isMobile && performance.fps < 45) {
      suggestions.push('Consider mobile-specific optimizations');
    }
    
    return suggestions;
  }, [performance, isMobile]);

  return {
    performance,
    recommendations,
    shouldOptimize: performance.fps < 45 || performance.memoryUsage > 0.7 || performance.networkSpeed === 'slow',
  };
}

/**
 * Hook for responsive scroll behavior
 */
export function useResponsiveScroll() {
  const [scrollInfo, setScrollInfo] = useState({
    x: 0,
    y: 0,
    direction: 'down' as 'up' | 'down' | 'left' | 'right',
    isScrolling: false,
    progress: 0,
  });
  
  const { isMobile } = useViewport();
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    const x = window.scrollX;
    const y = window.scrollY;
    const progress = y / (document.documentElement.scrollHeight - window.innerHeight);
    
    const direction = y > lastScrollY.current ? 'down' : 'up';
    lastScrollY.current = y;

    setScrollInfo({
      x,
      y,
      direction,
      isScrolling: true,
      progress: Math.max(0, Math.min(1, progress)),
    });

    // Clear existing timer
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    // Set scroll end timer
    scrollTimer.current = setTimeout(() => {
      setScrollInfo(prev => ({ ...prev, isScrolling: false }));
    }, isMobile ? 150 : 100);
  }, [isMobile]);

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, isMobile ? 16 : 8);
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [handleScroll, isMobile]);

  return scrollInfo;
}

/**
 * Hook for responsive intersection observer
 */
export function useResponsiveIntersection(
  options?: IntersectionObserverInit & {
    triggerOnce?: boolean;
    rootMargin?: string;
  }
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const { isMobile } = useViewport();

  const { triggerOnce = false, rootMargin, ...observerOptions } = options || {};

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
        
        if (triggerOnce && isVisible) {
          observer.disconnect();
        }
      },
      {
        // Adjust threshold for mobile devices
        threshold: isMobile ? 0.1 : 0.3,
        rootMargin: rootMargin || (isMobile ? '50px' : '100px'),
        ...observerOptions,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isMobile, triggerOnce, hasIntersected, rootMargin, observerOptions]);

  return {
    ref: elementRef,
    isIntersecting,
    hasIntersected,
  };
}

/**
 * Hook for responsive keyboard navigation
 */
export function useResponsiveKeyboard() {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const { isTouch } = useViewport();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleKeyNavigation = useCallback((
    e: React.KeyboardEvent,
    itemCount: number,
    onSelect?: (index: number) => void
  ) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + itemCount) % itemCount);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && onSelect) {
          onSelect(focusedIndex);
        }
        break;
      case 'Escape':
        setFocusedIndex(-1);
        break;
    }
  }, [focusedIndex]);

  return {
    focusedIndex,
    isKeyboardUser: isKeyboardUser && !isTouch,
    handleKeyNavigation,
    setFocusedIndex,
  };
}

// Utility function for throttling
function throttle<T extends (...args: any[]) => void>(fn: T, wait: number): T {
  let last = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: any[]) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        last = Date.now();
        timeout = null;
        fn.apply(this, args);
      }, wait - (now - last));
    }
  } as T;
}

// Export all hooks
export default {
  useElementSize,
  useContainerQuery,
  useResponsiveImage,
  useResponsiveFonts,
  useResponsivePerformance,
  useResponsiveScroll,
  useResponsiveIntersection,
  useResponsiveKeyboard,
};