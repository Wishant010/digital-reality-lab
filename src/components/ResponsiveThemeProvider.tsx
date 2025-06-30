import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useViewport, type DeviceInfo, type BreakpointKey } from '../utils/responsive';
import { useResponsivePerformance } from '../utils/responsiveHooks';

// ========================================
// RESPONSIVE THEME SYSTEM
// ========================================

// Theme configuration interface
export interface ResponsiveTheme {
  // Color system
  colors: {
    primary: Record<number, string>;
    secondary: Record<number, string>;
    accent: Record<number, string>;
    neutral: Record<number, string>;
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  
  // Typography system
  typography: {
    fontFamilies: {
      sans: string[];
      serif: string[];
      mono: string[];
    };
    fontSizes: Record<BreakpointKey, {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    }>;
    lineHeights: Record<string, string>;
    fontWeights: Record<string, string>;
  };
  
  // Spacing system
  spacing: Record<BreakpointKey, {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  }>;
  
  // Border radius system
  borderRadius: Record<string, string>;
  
  // Shadow system
  shadows: Record<string, string>;
  
  // Animation system
  animations: {
    durations: Record<BreakpointKey, {
      fast: string;
      normal: string;
      slow: string;
    }>;
    easings: Record<string, string>;
  };
  
  // Component variants
  components: {
    button: Record<string, any>;
    card: Record<string, any>;
    input: Record<string, any>;
  };
}

// Default theme configuration
const defaultTheme: ResponsiveTheme = {
  colors: {
    primary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    accent: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  
  typography: {
    fontFamilies: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['ui-serif', 'Georgia', 'Cambria', 'serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
    },
    fontSizes: {
      xs: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      sm: {
        xs: '0.875rem',
        sm: '1rem',
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '1.875rem',
        '3xl': '2.25rem',
        '4xl': '3rem',
      },
      md: {
        xs: '1rem',
        sm: '1.125rem',
        base: '1.25rem',
        lg: '1.5rem',
        xl: '1.875rem',
        '2xl': '2.25rem',
        '3xl': '3rem',
        '4xl': '3.75rem',
      },
      lg: {
        xs: '1.125rem',
        sm: '1.25rem',
        base: '1.5rem',
        lg: '1.875rem',
        xl: '2.25rem',
        '2xl': '3rem',
        '3xl': '3.75rem',
        '4xl': '4.5rem',
      },
      xl: {
        xs: '1.25rem',
        sm: '1.5rem',
        base: '1.875rem',
        lg: '2.25rem',
        xl: '3rem',
        '2xl': '3.75rem',
        '3xl': '4.5rem',
        '4xl': '6rem',
      },
      '2xl': {
        xs: '1.5rem',
        sm: '1.875rem',
        base: '2.25rem',
        lg: '3rem',
        xl: '3.75rem',
        '2xl': '4.5rem',
        '3xl': '6rem',
        '4xl': '8rem',
      },
      '3xl': {
        xs: '1.875rem',
        sm: '2.25rem',
        base: '3rem',
        lg: '3.75rem',
        xl: '4.5rem',
        '2xl': '6rem',
        '3xl': '8rem',
        '4xl': '10rem',
      },
      '4xl': {
        xs: '2.25rem',
        sm: '3rem',
        base: '3.75rem',
        lg: '4.5rem',
        xl: '6rem',
        '2xl': '8rem',
        '3xl': '10rem',
        '4xl': '12rem',
      },
    },
    lineHeights: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    fontWeights: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
  
  spacing: {
    xs: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '2.5rem',
      '3xl': '3rem',
      '4xl': '4rem',
    },
    sm: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1.25rem',
      lg: '1.75rem',
      xl: '2.25rem',
      '2xl': '3rem',
      '3xl': '3.5rem',
      '4xl': '4.5rem',
    },
    md: {
      xs: '0.75rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
      '2xl': '3.5rem',
      '3xl': '4rem',
      '4xl': '5rem',
    },
    lg: {
      xs: '1rem',
      sm: '1.25rem',
      md: '2rem',
      lg: '2.5rem',
      xl: '3rem',
      '2xl': '4rem',
      '3xl': '5rem',
      '4xl': '6rem',
    },
    xl: {
      xs: '1.25rem',
      sm: '1.5rem',
      md: '2.5rem',
      lg: '3rem',
      xl: '3.5rem',
      '2xl': '4.5rem',
      '3xl': '5.5rem',
      '4xl': '7rem',
    },
    '2xl': {
      xs: '1.5rem',
      sm: '2rem',
      md: '3rem',
      lg: '3.5rem',
      xl: '4rem',
      '2xl': '5rem',
      '3xl': '6rem',
      '4xl': '8rem',
    },
    '3xl': {
      xs: '2rem',
      sm: '2.5rem',
      md: '3.5rem',
      lg: '4rem',
      xl: '4.5rem',
      '2xl': '5.5rem',
      '3xl': '6.5rem',
      '4xl': '9rem',
    },
    '4xl': {
      xs: '2.5rem',
      sm: '3rem',
      md: '4rem',
      lg: '4.5rem',
      xl: '5rem',
      '2xl': '6rem',
      '3xl': '7rem',
      '4xl': '10rem',
    },
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    '4xl': '2rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(16, 185, 129, 0.4)',
    'glow-lg': '0 0 40px rgba(16, 185, 129, 0.6)',
  },
  
  animations: {
    durations: {
      xs: { fast: '0.1s', normal: '0.2s', slow: '0.3s' },
      sm: { fast: '0.15s', normal: '0.3s', slow: '0.5s' },
      md: { fast: '0.2s', normal: '0.4s', slow: '0.6s' },
      lg: { fast: '0.25s', normal: '0.5s', slow: '0.8s' },
      xl: { fast: '0.3s', normal: '0.6s', slow: '1s' },
      '2xl': { fast: '0.3s', normal: '0.6s', slow: '1s' },
      '3xl': { fast: '0.3s', normal: '0.6s', slow: '1s' },
      '4xl': { fast: '0.3s', normal: '0.6s', slow: '1s' },
    },
    easings: {
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },
  
  components: {
    button: {
      primary: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#059669',
          transform: 'translateY(-1px)',
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#10b981',
        border: '2px solid #10b981',
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#10b981',
          color: '#ffffff',
        },
      },
    },
    card: {
      default: {
        backgroundColor: '#1e293b',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
          transform: 'translateY(-2px)',
        },
      },
    },
    input: {
      default: {
        backgroundColor: '#334155',
        color: '#ffffff',
        border: '2px solid #475569',
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        transition: 'all 0.2s ease-in-out',
        '&:focus': {
          borderColor: '#10b981',
          boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
          outline: 'none',
        },
      },
    },
  },
};

// Theme context
interface ResponsiveThemeContextType {
  theme: ResponsiveTheme;
  deviceInfo: DeviceInfo;
  performance: {
    fps: number;
    memoryUsage: number;
    networkSpeed: 'slow' | 'fast' | 'unknown';
  };
  utils: {
    getColor: (color: string, shade?: number) => string;
    getFontSize: (size: string) => string;
    getSpacing: (size: string) => string;
    getAnimationDuration: (speed: 'fast' | 'normal' | 'slow') => string;
    shouldOptimizeAnimations: boolean;
  };
}

const ResponsiveThemeContext = createContext<ResponsiveThemeContextType | null>(null);

// Theme provider component
interface ResponsiveThemeProviderProps {
  children: React.ReactNode;
  theme?: Partial<ResponsiveTheme>;
  className?: string;
}

export function ResponsiveThemeProvider({ 
  children, 
  theme: customTheme,
  className = ''
}: ResponsiveThemeProviderProps) {
  const deviceInfo = useViewport();
  const { performance } = useResponsivePerformance();
  
  // Merge custom theme with defaults
  const theme = useMemo(() => {
    if (!customTheme) return defaultTheme;
    
    return {
      ...defaultTheme,
      ...customTheme,
      colors: { ...defaultTheme.colors, ...customTheme.colors },
      typography: { ...defaultTheme.typography, ...customTheme.typography },
      spacing: { ...defaultTheme.spacing, ...customTheme.spacing },
      borderRadius: { ...defaultTheme.borderRadius, ...customTheme.borderRadius },
      shadows: { ...defaultTheme.shadows, ...customTheme.shadows },
      animations: { ...defaultTheme.animations, ...customTheme.animations },
      components: { ...defaultTheme.components, ...customTheme.components },
    };
  }, [customTheme]);

  // Utility functions
  const utils = useMemo(() => ({
    getColor: (color: string, shade: number = 500) => {
      const colorGroup = (theme.colors as any)[color];
      return colorGroup?.[shade] || color;
    },
    
    getFontSize: (size: string) => {
      return theme.typography.fontSizes[deviceInfo.breakpoint]?.[size as keyof typeof theme.typography.fontSizes[typeof deviceInfo.breakpoint]] || size;
    },
    
    getSpacing: (size: string) => {
      return theme.spacing[deviceInfo.breakpoint]?.[size as keyof typeof theme.spacing[typeof deviceInfo.breakpoint]] || size;
    },
    
    getAnimationDuration: (speed: 'fast' | 'normal' | 'slow') => {
      if (deviceInfo.prefersReducedMotion) return '0.01ms';
      return theme.animations.durations[deviceInfo.breakpoint]?.[speed] || '0.3s';
    },
    
    shouldOptimizeAnimations: deviceInfo.isMobile || deviceInfo.prefersReducedMotion || performance.fps < 45,
  }), [theme, deviceInfo, performance.fps]);

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    // Set color variables
    Object.entries(theme.colors.primary).forEach(([shade, value]) => {
      root.style.setProperty(`--color-primary-${shade}`, value);
    });
    
    Object.entries(theme.colors.secondary).forEach(([shade, value]) => {
      root.style.setProperty(`--color-secondary-${shade}`, value);
    });
    
    // Set spacing variables
    const currentSpacing = theme.spacing[deviceInfo.breakpoint];
    Object.entries(currentSpacing).forEach(([size, value]) => {
      root.style.setProperty(`--spacing-${size}`, value);
    });
    
    // Set font size variables
    const currentFontSizes = theme.typography.fontSizes[deviceInfo.breakpoint];
    Object.entries(currentFontSizes).forEach(([size, value]) => {
      root.style.setProperty(`--font-size-${size}`, value);
    });
    
    // Set animation duration variables
    const currentAnimations = theme.animations.durations[deviceInfo.breakpoint];
    Object.entries(currentAnimations).forEach(([speed, value]) => {
      root.style.setProperty(`--animation-${speed}`, deviceInfo.prefersReducedMotion ? '0.01ms' : value);
    });
    
    // Set device-specific classes
    root.classList.toggle('is-mobile', deviceInfo.isMobile);
    root.classList.toggle('is-tablet', deviceInfo.isTablet);
    root.classList.toggle('is-desktop', deviceInfo.isDesktop);
    root.classList.toggle('is-touch', deviceInfo.isTouch);
    root.classList.toggle('has-hover', deviceInfo.hasHover);
    root.classList.toggle('prefers-reduced-motion', deviceInfo.prefersReducedMotion);
    
  }, [theme, deviceInfo]);

  const contextValue: ResponsiveThemeContextType = {
    theme,
    deviceInfo,
    performance,
    utils,
  };

  return (
    <ResponsiveThemeContext.Provider value={contextValue}>
      <div className={`responsive-theme-provider ${className}`}>
        {children}
      </div>
    </ResponsiveThemeContext.Provider>
  );
}

// Hook to use the theme
export function useResponsiveTheme() {
  const context = useContext(ResponsiveThemeContext);
  if (!context) {
    throw new Error('useResponsiveTheme must be used within a ResponsiveThemeProvider');
  }
  return context;
}

// Themed component helpers
export interface ThemedComponentProps {
  variant?: string;
  size?: string;
  className?: string;
}

// Themed Button component
export function ThemedButton({ 
  variant = 'primary', 
  size = 'md',
  className = '',
  children,
  ...props 
}: ThemedComponentProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme, utils, deviceInfo } = useResponsiveTheme();
  
  const buttonStyles = theme.components.button[variant] || theme.components.button.primary;
  const fontSize = utils.getFontSize(size);
  const padding = utils.getSpacing(size === 'xs' ? 'sm' : size === 'sm' ? 'md' : 'lg');
  
  return (
    <button
      className={`themed-button themed-button-${variant} ${className}`}
      style={{
        ...buttonStyles,
        fontSize,
        padding: `${utils.getSpacing('sm')} ${padding}`,
        minHeight: deviceInfo.isTouch ? '44px' : 'auto',
        transition: `all ${utils.getAnimationDuration('fast')} ${theme.animations.easings.smooth}`,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Themed Card component
export function ThemedCard({ 
  variant = 'default',
  className = '',
  children,
  ...props
}: ThemedComponentProps & React.HTMLAttributes<HTMLDivElement>) {
  const { theme, utils } = useResponsiveTheme();
  
  const cardStyles = theme.components.card[variant] || theme.components.card.default;
  
  return (
    <div
      className={`themed-card themed-card-${variant} ${className}`}
      style={{
        ...cardStyles,
        padding: utils.getSpacing('lg'),
        transition: `all ${utils.getAnimationDuration('normal')} ${theme.animations.easings.smooth}`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// Themed Input component
export function ThemedInput({ 
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: any) { // Temporarily use 'any' to resolve type error for size
  const { theme, utils, deviceInfo } = useResponsiveTheme();

  const inputStyles = theme.components.input[variant] || theme.components.input.default;
  const fontSize = utils.getFontSize(String(size));
  
  return (
    <input
      className={`themed-input themed-input-${variant} ${className}`}
      style={{
        ...inputStyles,
        fontSize,
        minHeight: deviceInfo.isTouch ? '44px' : 'auto',
        transition: `all ${utils.getAnimationDuration('fast')} ${theme.animations.easings.smooth}`,
      }}
      {...props}
    />
  );
}

// Export all components and utilities
export default {
  ResponsiveThemeProvider,
  useResponsiveTheme,
  ThemedButton,
  ThemedCard,
  ThemedInput,
  defaultTheme,
};