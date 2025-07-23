/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // Enhanced breakpoint system from file 2
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
      // Custom responsive ranges
      'mobile': { 'max': '767px' },
      'tablet': { 'min': '768px', 'max': '1023px' },
      'desktop': { 'min': '1024px' },
      'ultrawide': { 'min': '1920px' },
      // Portrait and landscape
      'portrait': { 'raw': '(orientation: portrait)' },
      'landscape': { 'raw': '(orientation: landscape)' },
      // High DPI screens
      'retina': { 'raw': '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)' },
      // Hover capability
      'hover': { 'raw': '(hover: hover)' },
      'no-hover': { 'raw': '(hover: none)' },
      // Reduced motion
      'motion': { 'raw': '(prefers-reduced-motion: no-preference)' },
      'no-motion': { 'raw': '(prefers-reduced-motion: reduce)' },
      // High contrast
      'high-contrast': { 'raw': '(prefers-contrast: high)' },
    },

    extend: {
      // Original font families from file 1
      fontFamily: {
        'space': ['Space Grotesk', 'Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        // Additional from file 2
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia', 'Cambria', 'serif'],
        'display': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // Enhanced color system combining both files
      colors: {
        // Primary colors from file 1 (enhanced)
        emerald: {
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
          950: '#022c22', // Enhanced from file 2
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        slate: {
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
          950: '#020617', // Enhanced from file 2
        },
        // Additional colors from file 2
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Semantic colors from file 2
        success: {
          light: '#10b981',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        warning: {
          light: '#f59e0b',
          DEFAULT: '#d97706',
          dark: '#b45309',
        },
        error: {
          light: '#ef4444',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
        },
        info: {
          light: '#3b82f6',
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
      },

      // Enhanced typography system from file 2
      fontSize: {
        // Mobile-first typography
        'xs-mobile': ['0.75rem', { lineHeight: '1rem' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.25rem' }],
        'base-mobile': ['1rem', { lineHeight: '1.5rem' }],
        'lg-mobile': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl-mobile': ['1.25rem', { lineHeight: '1.75rem' }],
        
        // Tablet typography
        'xs-tablet': ['0.875rem', { lineHeight: '1.25rem' }],
        'sm-tablet': ['1rem', { lineHeight: '1.5rem' }],
        'base-tablet': ['1.125rem', { lineHeight: '1.75rem' }],
        'lg-tablet': ['1.25rem', { lineHeight: '1.75rem' }],
        'xl-tablet': ['1.5rem', { lineHeight: '2rem' }],
        
        // Desktop typography
        'xs-desktop': ['1rem', { lineHeight: '1.5rem' }],
        'sm-desktop': ['1.125rem', { lineHeight: '1.75rem' }],
        'base-desktop': ['1.25rem', { lineHeight: '1.75rem' }],
        'lg-desktop': ['1.5rem', { lineHeight: '2rem' }],
        'xl-desktop': ['1.875rem', { lineHeight: '2.25rem' }],
        
        // Ultra-large displays
        '10xl': ['10rem', { lineHeight: '1' }],
        '11xl': ['12rem', { lineHeight: '1' }],
        '12xl': ['14rem', { lineHeight: '1' }],
      },

      // ULTRA-HIGH-PERFORMANCE animations - all optimized for 60fps+
      animation: {
        // Lightning-fast core animations
        'fade-in': 'fadeIn 0.12s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'fade-in-up': 'fadeInUp 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fadeInDown 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slideInLeft 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce-subtle': 'bounceSubtle 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        
        // Ultra-smooth continuous animations
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'float': 'float 2s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Speed variants
        'fade-in-fast': 'fadeIn 0.15s ease-out',
        'fade-in-slow': 'fadeIn 0.4s ease-out',
        'fade-out': 'fadeOut 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        
        // Ultra-responsive slides
        'slide-up': 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        
        // Optimized interactions
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
        'pulse-soft': 'pulseSoft 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulseFast 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // ULTRA-OPTIMIZED keyframes for maximum performance
      keyframes: {
        // Core ultra-fast animations
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateZ(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateX(0) translateZ(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateX(0) translateZ(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateZ(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateZ(0)' },
        },
        bounceSubtle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0) translateZ(0)' },
          '40%': { transform: 'translateY(-8px) translateZ(0)' },
          '60%': { transform: 'translateY(-4px) translateZ(0)' },
        },
        
        // Continuous animations optimized for performance
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateZ(0)' },
          '50%': { transform: 'translateY(-15px) translateZ(0)' },
        },
        
        // Exit animations
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0) translateZ(0)' },
          '100%': { opacity: '0', transform: 'translateY(-15px) translateZ(0)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1) translateZ(0)' },
          '100%': { opacity: '0', transform: 'scale(0.95) translateZ(0)' },
        },
        
        // Directional slides with reduced movement
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(40px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateX(0) translateZ(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-40px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateX(0) translateZ(0)' },
        },
        
        // Subtle interactions
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-3%) translateZ(0)' },
          '50%': { transform: 'translateY(0) translateZ(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg) translateZ(0)' },
          '50%': { transform: 'rotate(2deg) translateZ(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.9' },
        },
        pulseFast: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },

      // Enhanced spacing system from file 2
      spacing: {
        // From file 1
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        
        // Micro spacing from file 2
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        
        // Extended spacing from file 2
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        '66': '16.5rem',
        '70': '17.5rem',
        
        // Viewport-based spacing
        '1/2-screen': '50vh',
        '1/3-screen': '33.333333vh',
        '2/3-screen': '66.666667vh',
        '1/4-screen': '25vh',
        '3/4-screen': '75vh',
        '1/5-screen': '20vh',
        '2/5-screen': '40vh',
        '3/5-screen': '60vh',
        '4/5-screen': '80vh',
      },

      // Enhanced border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },

      // Enhanced backdrop blur
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
        '5xl': '96px',
      },

      // Enhanced transition timing
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',
        'ease-in-circ': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
        'ease-out-circ': 'cubic-bezier(0.075, 0.82, 0.165, 1)',
        'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
      },

      // Enhanced box shadows
      boxShadow: {
        // From file 1
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(16, 185, 129, 0.2)',
        
        // Additional from file 2
        'glow-sm': '0 0 10px rgba(16, 185, 129, 0.3)',
        'glow-xl': '0 0 60px rgba(16, 185, 129, 0.6)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
      },

      // Enhanced container system from file 2
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          xs: '1rem',
          sm: '1.25rem',
          md: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
          '3xl': '3.5rem',
          '4xl': '4rem',
        },
        screens: {
          xs: '320px',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
          '3xl': '1800px',
          '4xl': '2400px',
        },
      },

      // Enhanced grid system from file 2
      gridTemplateColumns: {
        'auto-fit-xs': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-sm': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(350px, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(400px, 1fr))',
        
        'auto-fill-xs': 'repeat(auto-fill, minmax(250px, 1fr))',
        'auto-fill-sm': 'repeat(auto-fill, minmax(300px, 1fr))',
        'auto-fill-md': 'repeat(auto-fill, minmax(350px, 1fr))',
        'auto-fill-lg': 'repeat(auto-fill, minmax(400px, 1fr))',
      },

      // Enhanced z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Enhanced utilities combining both files
    function({ addUtilities, addComponents, addBase, theme }) {
      // Original utilities from file 1
      const originalUtilities = {
        '.text-shadow': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
        '.text-shadow-xl': {
          textShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.gpu-acceleration': {
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
        },
      };

      // Responsive text utilities from file 2
      const responsiveTextUtilities = {
        '.text-responsive-xs': {
          fontSize: '0.75rem',
          lineHeight: '1rem',
          '@screen sm': {
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
          },
          '@screen md': {
            fontSize: '1rem',
            lineHeight: '1.5rem',
          },
        },
        '.text-responsive-sm': {
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          '@screen sm': {
            fontSize: '1rem',
            lineHeight: '1.5rem',
          },
          '@screen md': {
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
          },
        },
        '.text-responsive-base': {
          fontSize: '1rem',
          lineHeight: '1.5rem',
          '@screen sm': {
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
          },
          '@screen md': {
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
          },
        },
        '.text-responsive-lg': {
          fontSize: '1.125rem',
          lineHeight: '1.75rem',
          '@screen sm': {
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
          },
          '@screen md': {
            fontSize: '1.5rem',
            lineHeight: '2rem',
          },
        },
        '.text-responsive-xl': {
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
          '@screen sm': {
            fontSize: '1.5rem',
            lineHeight: '2rem',
          },
          '@screen md': {
            fontSize: '1.875rem',
            lineHeight: '2.25rem',
          },
          '@screen lg': {
            fontSize: '2.25rem',
            lineHeight: '2.5rem',
          },
        },
        '.text-responsive-2xl': {
          fontSize: '1.5rem',
          lineHeight: '2rem',
          '@screen sm': {
            fontSize: '1.875rem',
            lineHeight: '2.25rem',
          },
          '@screen md': {
            fontSize: '2.25rem',
            lineHeight: '2.5rem',
          },
          '@screen lg': {
            fontSize: '3rem',
            lineHeight: '1',
          },
        },
        '.text-responsive-3xl': {
          fontSize: '1.875rem',
          lineHeight: '2.25rem',
          '@screen sm': {
            fontSize: '2.25rem',
            lineHeight: '2.5rem',
          },
          '@screen md': {
            fontSize: '3rem',
            lineHeight: '1',
          },
          '@screen lg': {
            fontSize: '3.75rem',
            lineHeight: '1',
          },
        },
        '.text-responsive-4xl': {
          fontSize: '2.25rem',
          lineHeight: '2.5rem',
          '@screen sm': {
            fontSize: '3rem',
            lineHeight: '1',
          },
          '@screen md': {
            fontSize: '3.75rem',
            lineHeight: '1',
          },
          '@screen lg': {
            fontSize: '4.5rem',
            lineHeight: '1',
          },
          '@screen xl': {
            fontSize: '6rem',
            lineHeight: '1',
          },
        },
      };

      // Responsive spacing utilities
      const responsiveSpacingUtilities = {
        '.space-responsive-x > * + *': {
          marginLeft: '1rem',
          '@screen sm': {
            marginLeft: '1.5rem',
          },
          '@screen md': {
            marginLeft: '2rem',
          },
          '@screen lg': {
            marginLeft: '2.5rem',
          },
        },
        '.space-responsive-y > * + *': {
          marginTop: '1rem',
          '@screen sm': {
            marginTop: '1.5rem',
          },
          '@screen md': {
            marginTop: '2rem',
          },
          '@screen lg': {
            marginTop: '2.5rem',
          },
        },
      };

      // Add all utilities
      addUtilities({
        ...originalUtilities,
        ...responsiveTextUtilities,
        ...responsiveSpacingUtilities,
      });

      // Add custom container components
      addComponents({
        '.container-responsive': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@screen sm': {
            maxWidth: '640px',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
          },
          '@screen md': {
            maxWidth: '768px',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@screen lg': {
            maxWidth: '1024px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen xl': {
            maxWidth: '1280px',
            paddingLeft: '2.5rem',
            paddingRight: '2.5rem',
          },
          '@screen 2xl': {
            maxWidth: '1536px',
            paddingLeft: '3rem',
            paddingRight: '3rem',
          },
        },
        '.container-full': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@screen sm': {
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
          },
          '@screen md': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@screen lg': {
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen xl': {
            paddingLeft: '2.5rem',
            paddingRight: '2.5rem',
          },
        },
      });

      // Add responsive base styles
      addBase({
        'html': {
          fontSize: '16px',
          '@screen lg': {
            fontSize: '18px',
          },
          '@screen 2xl': {
            fontSize: '20px',
          },
        },
      });
    }
  ],
};