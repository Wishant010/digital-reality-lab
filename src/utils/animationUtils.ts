import { useTransform, useSpring } from 'framer-motion';

// Animation utility functions to fix blur and performance issues

/**
 * Fixed blur animation that prevents negative values
 * Converts negative blur values to positive and adds creative effects
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
    intensity = 1,
    maxBlur = 20,
    minBlur = 0,
    springConfig = { stiffness: 400, damping: 40, mass: 1 }
  } = options;

  // Protect against undefined source
  if (!source) {
    console.warn('useFixedBlurAnimation: source is undefined');
    return {
      blur: 0,
      filter: 'blur(0px)',
      style: { filter: 'blur(0px)' }
    };
  }

  // First clamp the source value, then transform to prevent negative blur
  const clampedSource = useTransform(source, (value: number) => {
    // Handle non-numeric or NaN values
    if (typeof value !== 'number' || isNaN(value)) return 0;
    return Math.max(0, Math.abs(value)); // Use absolute value to handle negative inputs
  });
  
  const blurValue = useTransform(clampedSource, (value: number) => {
    const scaledValue = value * intensity;
    // Apply easing for smoother transitions
    const easedValue = Math.pow(scaledValue, 0.8); // Subtle easing
    // Ensure blur value is always non-negative and within bounds
    return Math.min(Math.max(Math.abs(easedValue), minBlur), maxBlur);
  });

  // Get performance level to adjust animation quality
  const { performanceLevel } = useAdaptiveAnimations();
  
  // Adjust spring config based on performance
  const adaptiveSpringConfig = {
    ...springConfig,
    // Reduce animation complexity on low-end devices
    stiffness: performanceLevel === 'low' ? 
      (springConfig.stiffness ?? 400) * 0.8 : 
      (springConfig.stiffness ?? 400),
    damping: performanceLevel === 'low' ? 
      (springConfig.damping ?? 40) * 1.2 : 
      (springConfig.damping ?? 40)
  };

  // Apply spring animation for smoother motion
  const springBlur = useSpring(blurValue, adaptiveSpringConfig);

  // Return filter string with guaranteed positive values and performance optimization
  const blurFilter = useTransform(springBlur, (blur: number) => {
    // Round blur values for better performance
    const roundedBlur = Math.round(blur * 10) / 10;
    return `blur(${roundedBlur}px)${performanceLevel === 'low' ? ' translateZ(0)' : ''}`;
  });
  
  return {
    blur: springBlur,
    filter: blurFilter,
    style: { 
      filter: blurFilter,
      willChange: 'filter',
      backfaceVisibility: 'hidden'
    }
  };
}

/**
 * Performance-optimized motion variants to replace problematic animations
 */
export const optimizedMotionVariants = {
  // Fade animations (no blur issues)
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Scale animations (smooth and performant)
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Slide animations
  slideInUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  // Stagger container for multiple elements
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Safe blur effect using opacity instead of actual blur
  glowEffect: {
    initial: { 
      opacity: 0, 
      scale: 0.9,
      filter: "brightness(1)"
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      filter: "brightness(1.1)"
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      filter: "brightness(1)"
    },
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};

/**
 * Performance-optimized spring configurations
 */
export const springConfigs = {
  // Gentle spring for UI elements
  gentle: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1
  },

  // Bouncy spring for attention-grabbing elements
  bouncy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 25,
    mass: 0.8
  },

  // Quick spring for responsive interactions
  quick: {
    type: "spring" as const,
    stiffness: 600,
    damping: 40,
    mass: 0.5
  },

  // Smooth spring for background elements
  smooth: {
    type: "spring" as const,
    stiffness: 200,
    damping: 50,
    mass: 1.2
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

  static getInstance() {
    if (!AnimationPerformanceMonitor.instance) {
      AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
    }
    return AnimationPerformanceMonitor.instance;
  }

  startMonitoring() {
    const monitor = () => {
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
      
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
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
  const monitor = AnimationPerformanceMonitor.getInstance();
  const performanceLevel = monitor.getPerformanceLevel();

  const getAnimationConfig = () => {
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
    }
  };

  return {
    ...getAnimationConfig(),
    performanceLevel,
    fps: monitor.getFPS()
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
          // Fallback to setTimeout, but ensure callback is called with timestamp
          return window.setTimeout(() => callback(performance.now()), 16) as any;
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