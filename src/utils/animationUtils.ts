import { MotionValue, useTransform, useSpring } from 'framer-motion';

// Animation utility functions to fix blur and performance issues

/**
 * Fixed blur animation that prevents negative values
 * Converts negative blur values to positive and adds creative effects
 */
export function useFixedBlurAnimation(
  source: MotionValue<number>,
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

  // Transform negative values to positive with intensity scaling
  const blurValue = useTransform(source, (value) => {
    const absoluteValue = Math.abs(value);
    const scaledValue = absoluteValue * intensity;
    return Math.min(Math.max(scaledValue, minBlur), maxBlur);
  });

  // Apply spring animation for smoother motion
  const springBlur = useSpring(blurValue, springConfig);

  // Return filter string with guaranteed positive values
  const blurFilter = useTransform(springBlur, (blur) => `blur(${blur}px)`);
  
  return {
    blur: springBlur,
    filter: blurFilter,
    style: { filter: blurFilter }
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
    const originalRAF = window.requestAnimationFrame;
    
    window.requestAnimationFrame = function(callback) {
      try {
        return originalRAF.call(window, callback);
      } catch (error) {
        console.warn('Animation frame request failed:', error as Error);
        return setTimeout(callback, 16) as any;
      }
    };
  }
}

// Initialize safeguards
if (typeof window !== 'undefined') {
  safeguardAnimations();
}