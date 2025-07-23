import { useTransform, useSpring } from 'framer-motion';
import { useCallback, useMemo } from 'react';

// ULTRA-PERFORMANCE Animation utility functions for smooth, fast loading

/**
 * Super-optimized blur animation with memory management
 * Prevents negative values and includes GPU acceleration
 */
export function useFixedBlurAnimation(
  source: any,
  options: {
    intensity?: number;
    maxBlur?: number;
    minBlur?: number;
    springConfig?: {
      stiffness?: number;
      damping?: number;
      mass?: number;
    };
  } = {}
) {
  const {
    intensity = 0.6, // Further reduced for ultra-smooth performance
    maxBlur = 8, // Much lower for smoother rendering
    minBlur = 0,
    springConfig = { stiffness: 650, damping: 55, mass: 0.6 } // Even faster and more responsive
  } = options;

  // Ultra-fast source validation with memoization
  const memoizedSource = useMemo(() => {
    if (!source || typeof source === 'undefined') {
      return {
        get: () => 0,
        blur: 0,
        filter: 'blur(0px) translateZ(0)', // GPU acceleration
        style: { 
          filter: 'blur(0px) translateZ(0)',
          willChange: 'filter',
          transform: 'translateZ(0)' // Force GPU layer
        }
      };
    }
    return source;
  }, [source]);

  // Super-fast clamped source with optimized transform
  const clampedSource = useTransform(memoizedSource, useCallback((value: number) => {
    // Ultra-fast numeric validation
    if (typeof value !== 'number' || !isFinite(value)) return 0;
    // Single operation for better performance
    return Math.min(maxBlur, Math.max(minBlur, Math.abs(value)));
  }, [maxBlur, minBlur]));
  
  const blurValue = useTransform(clampedSource, useCallback((value: number) => {
    // Optimized scaling with single calculation
    const scaledValue = value * intensity;
    // Fast easing approximation (avoids expensive Math.pow)
    const easedValue = scaledValue * (2 - scaledValue / maxBlur);
    return Math.min(Math.max(easedValue, minBlur), maxBlur);
  }, [intensity, maxBlur, minBlur]));

  // Performance-aware spring config - simplified to avoid circular dependency
  const adaptiveSpringConfig = useMemo(() => ({
    ...springConfig
  }), [springConfig]);

  // High-performance spring with GPU acceleration
  const springBlur = useSpring(blurValue, adaptiveSpringConfig);

  // Ultra-optimized filter with GPU hints and SAFETY CHECK
  const blurFilter = useTransform(springBlur, useCallback((blur: number) => {
    // CRITICAL: Ensure blur is never negative
    const safeBlur = Math.max(0, blur);
    const roundedBlur = Math.round(safeBlur * 10) / 10; // Optimize for performance
    return `blur(${roundedBlur}px) translateZ(0) brightness(1.02)`;
  }, []));
  
  return {
    blur: springBlur,
    filter: blurFilter,
    style: { 
      filter: blurFilter,
      willChange: 'filter',
      backfaceVisibility: 'hidden',
      transform: 'translateZ(0)', // Force GPU layer
      contain: 'layout style paint' // Optimize rendering
    }
  };
}

/**
 * ULTRA-OPTIMIZED motion variants for lightning-fast animations
 * All animations designed for 60fps+ performance with GPU acceleration
 */
export const optimizedMotionVariants = {
  // Ultra-fast fade with GPU acceleration
  fadeIn: {
    initial: { opacity: 0, y: 15, transform: 'translateZ(0)' }, // Smaller movement for speed
    animate: { opacity: 1, y: 0, transform: 'translateZ(0)' },
    exit: { opacity: 0, y: -15, transform: 'translateZ(0)' },
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } // Faster, smoother easing
  },

  // Lightning-fast scale with contain optimization  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9, transform: 'translateZ(0) scale(0.9)' },
    animate: { opacity: 1, scale: 1, transform: 'translateZ(0) scale(1)' },
    exit: { opacity: 0, scale: 0.9, transform: 'translateZ(0) scale(0.9)' },
    transition: { duration: 0.18, ease: [0.34, 1.56, 0.64, 1] } // Bouncy but fast
  },

  // Super-smooth slide with reduced distance
  slideInUp: {
    initial: { opacity: 0, y: 60, transform: 'translateZ(0) translateY(60px)' }, // Reduced from 100px
    animate: { opacity: 1, y: 0, transform: 'translateZ(0) translateY(0)' },
    exit: { opacity: 0, y: -60, transform: 'translateZ(0) translateY(-60px)' },
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } // Smooth ease-out
  },

  slideInLeft: {
    initial: { opacity: 0, x: -60, transform: 'translateZ(0) translateX(-60px)' },
    animate: { opacity: 1, x: 0, transform: 'translateZ(0) translateX(0)' },
    exit: { opacity: 0, x: 60, transform: 'translateZ(0) translateX(60px)' },
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  },

  // Ultra-fast stagger with optimized timing
  staggerContainer: {
    initial: { transform: 'translateZ(0)' },
    animate: {
      transform: 'translateZ(0)',
      transition: {
        staggerChildren: 0.05, // Faster stagger
        delayChildren: 0.1 // Reduced delay
      }
    }
  },

  // High-performance glow with brightness (faster than blur)
  glowEffect: {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      filter: "brightness(1) contrast(1)",
      transform: 'translateZ(0) scale(0.95)'
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      filter: "brightness(1.08) contrast(1.02)", // Subtle but fast
      transform: 'translateZ(0) scale(1)'
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      filter: "brightness(1) contrast(1)",
      transform: 'translateZ(0) scale(0.95)'
    },
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
  },

  // Performance-first variants for low-end devices
  minimal: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 }
  }
};

/**
 * ULTRA-HIGH-PERFORMANCE spring configurations
 * Optimized for speed and smoothness with minimal computation
 */
export const springConfigs = {
  // Lightning-fast spring for instant feedback
  instant: {
    type: "spring" as const,
    stiffness: 800,
    damping: 50,
    mass: 0.5
  },

  // Gentle spring optimized for UI elements
  gentle: {
    type: "spring" as const,
    stiffness: 400,
    damping: 35,
    mass: 0.8
  },

  // Bouncy spring with fast settling
  bouncy: {
    type: "spring" as const,
    stiffness: 600,
    damping: 30,
    mass: 0.6
  },

  // Quick spring for responsive interactions
  quick: {
    type: "spring" as const,
    stiffness: 700,
    damping: 45,
    mass: 0.4
  },

  // Smooth spring optimized for background elements
  smooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 40,
    mass: 1.0
  },

  // Minimal spring for low-performance devices
  minimal: {
    type: "tween" as const,
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

/**
 * Safe alternative to blur filter using multiple layered effects
 */
export function createSafeBlurEffect(intensity: number = 1) {
  const safeIntensity = Math.max(0, intensity);
  
  return {
    filter: `opacity(${Math.max(0.3, 1 - safeIntensity * 0.3)})`,
    backdropFilter: 'none', // Avoid backdrop-filter blur issues
    transform: `scale(${1 + safeIntensity * 0.05})`,
    transition: 'all 0.3s ease-out'
  };
}

/**
 * Performance monitor for animations
 */
export class AnimationPerformanceMonitor {
  private static instance: AnimationPerformanceMonitor;
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;

  // Cleanup when instance is destroyed
  destroy() {
    this.stopMonitoring();
    if (AnimationPerformanceMonitor.instance === this) {
      AnimationPerformanceMonitor.instance = null as any;
    }
  }

  static getInstance() {
    if (!AnimationPerformanceMonitor.instance) {
      AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
    }
    return AnimationPerformanceMonitor.instance;
  }

  private monitorFrame: number | null = null;

  stopMonitoring() {
    if (this.monitorFrame !== null) {
      window.cancelAnimationFrame(this.monitorFrame);
      this.monitorFrame = null;
    }
  }

  startMonitoring() {
    // Stop any existing monitoring
    this.stopMonitoring();
    
    const monitorFPS = () => {
      const now = performance.now();
      this.frameCount++;
      
      if (now - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
        this.frameCount = 0;
        this.lastTime = now;
        
        // Warn if performance is poor
        if (this.fps < 30) {
          console.warn(`Animation performance warning: ${this.fps} FPS`);
        }
      }
      
      this.monitorFrame = window.requestAnimationFrame(monitorFPS);
    };
    
    this.monitorFrame = window.requestAnimationFrame(monitorFPS);
  }

  getFPS() {
    return this.fps;
  }

  getPerformanceLevel(): 'high' | 'medium' | 'low' {
    if (this.fps >= 50) return 'high';
    if (this.fps >= 30) return 'medium';
    return 'low';
  }
}

/**
 * Hook to automatically adjust animation quality based on performance
 */
export function useAdaptiveAnimations() {
  // Simplified performance level detection
  const performanceLevel = useMemo(() => {
    if (typeof window === 'undefined') return 'high';
    
    // Simple heuristics for performance level
    const memory = 'memory' in performance ? (performance as any).memory : null;
    const isLowEnd = memory && memory.jsHeapSizeLimit < 100 * 1024 * 1024; // Less than 100MB
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isLowEnd) return 'low';
    if (isMobile) return 'medium';
    return 'high';
  }, []);

  const getAnimationConfig = useCallback(() => {
    switch (performanceLevel) {
      case 'high':
        return {
          enableComplexAnimations: true,
          springConfig: springConfigs.bouncy,
          staggerDelay: 0.1
        };
      case 'medium':
        return {
          enableComplexAnimations: true,
          springConfig: springConfigs.gentle,
          staggerDelay: 0.15
        };
      case 'low':
        return {
          enableComplexAnimations: false,
          springConfig: springConfigs.quick,
          staggerDelay: 0.2
        };
      default:
        return {
          enableComplexAnimations: true,
          springConfig: springConfigs.gentle,
          staggerDelay: 0.15
        };
    }
  }, [performanceLevel]);

  return {
    ...getAnimationConfig(),
    performanceLevel,
    fps: 60 // Default to 60fps
  };
}

/**
 * Utility to prevent animation conflicts with browser extensions
 */
export function safeguardAnimations() {
  // Prevent wallet extensions from interfering with animations
  if (typeof window !== 'undefined') {
    // Avoid double-patching
    if (!(window.requestAnimationFrame as any)._safeguarded) {
      const originalRAF = window.requestAnimationFrame;
      const patchedRAF = function(callback: FrameRequestCallback): number {
        try {
          return originalRAF.call(window, callback);
        } catch (error) {
          console.warn('Animation frame request failed:', error);
          // Use requestAnimationFrame for the fallback instead of setTimeout
          return originalRAF.call(window, () => {
            callback(performance.now());
          });
        }
      };
      (patchedRAF as any)._safeguarded = true;
      window.requestAnimationFrame = patchedRAF;
    }
  }
}

// Initialize safeguards
if (typeof window !== 'undefined') {
  safeguardAnimations();
}

/**
 * Ensures a blur value is safe to use in CSS filters
 * @param value The blur value to sanitize
 * @param defaultValue Optional default value if the input is invalid
 * @returns A safe, non-negative blur value
 */
export function getSafeBlurValue(value: number, defaultValue: number = 0): number {
  if (typeof value !== 'number' || isNaN(value)) {
    return Math.max(0, defaultValue);
  }
  return Math.max(0, Math.abs(value));
}