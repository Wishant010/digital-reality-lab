import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  useViewport,
  useResponsiveValue,
  type ResponsiveValue
} from '../utils/responsive';

// ========================================
// RESPONSIVE LAYOUT SYSTEM
// ========================================

// Container component with responsive behavior
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  padding?: ResponsiveValue<number>;
  center?: boolean;
  id?: string;
}

export function ResponsiveContainer({ 
  children, 
  className = '',
  maxWidth = 'xl',
  padding = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, '2xl': 48 },
  center = true,
  id
}: ResponsiveContainerProps) {
  const currentPadding = useResponsiveValue(padding);
  
  const containerClass = useMemo(() => {
    const baseClasses = [
      'w-full',
      center ? 'mx-auto' : '',
      className
    ];

    // Add max-width classes
    if (maxWidth !== 'full') {
      switch (maxWidth) {
        case 'xs': baseClasses.push('max-w-xs'); break;
        case 'sm': baseClasses.push('max-w-sm'); break;
        case 'md': baseClasses.push('max-w-md'); break;
        case 'lg': baseClasses.push('max-w-4xl'); break;
        case 'xl': baseClasses.push('max-w-6xl'); break;
        case '2xl': baseClasses.push('max-w-7xl'); break;
        case '3xl': baseClasses.push('max-w-[1800px]'); break;
        case '4xl': baseClasses.push('max-w-[2400px]'); break;
      }
    }

    return baseClasses.filter(Boolean).join(' ');
  }, [maxWidth, center, className]);

  return (
    <div 
      id={id}
      className={containerClass}
      style={{
        paddingLeft: `${currentPadding}px`,
        paddingRight: `${currentPadding}px`,
      }}
    >
      {children}
    </div>
  );
}

// Responsive section with spacing and layout controls
interface ResponsiveSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: ResponsiveValue<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>;
  background?: 'transparent' | 'slate' | 'dark' | 'gradient';
  fullHeight?: boolean;
  id?: string;
}

export function ResponsiveSection({
  children,
  className = '',
  spacing = 'lg',
  background = 'transparent',
  fullHeight = false,
  id
}: ResponsiveSectionProps) {
  const { breakpoint } = useViewport();
  const currentSpacing = useResponsiveValue(spacing);
  
  const spacingValue = useMemo(() => {
    const spacingMap = {
      'xs': { xs: 32, sm: 40, md: 48, lg: 56, xl: 64, '2xl': 72, '3xl': 80, '4xl': 96 },
      'sm': { xs: 48, sm: 56, md: 64, lg: 72, xl: 80, '2xl': 96, '3xl': 112, '4xl': 128 },
      'md': { xs: 64, sm: 72, md: 80, lg: 96, xl: 112, '2xl': 128, '3xl': 144, '4xl': 160 },
      'lg': { xs: 80, sm: 96, md: 112, lg: 128, xl: 144, '2xl': 160, '3xl': 176, '4xl': 192 },
      'xl': { xs: 96, sm: 112, md: 128, lg: 160, xl: 192, '2xl': 224, '3xl': 256, '4xl': 288 },
      '2xl': { xs: 128, sm: 160, md: 192, lg: 224, xl: 256, '2xl': 288, '3xl': 320, '4xl': 352 },
      '3xl': { xs: 144, sm: 176, md: 208, lg: 240, xl: 272, '2xl': 304, '3xl': 336, '4xl': 368 },
      '4xl': { xs: 160, sm: 192, md: 224, lg: 256, xl: 288, '2xl': 320, '3xl': 352, '4xl': 384 },
    };
    return spacingMap[currentSpacing][breakpoint] || spacingMap[currentSpacing]['lg'];
  }, [currentSpacing, breakpoint]);

  const backgroundClass = useMemo(() => {
    switch (background) {
      case 'slate': return 'bg-slate-900';
      case 'dark': return 'bg-black';
      case 'gradient': return 'bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900';
      default: return 'bg-transparent';
    }
  }, [background]);

  const sectionClass = useMemo(() => {
    return [
      'relative w-full',
      fullHeight ? 'min-h-screen' : '',
      backgroundClass,
      className
    ].filter(Boolean).join(' ');
  }, [fullHeight, backgroundClass, className]);

  return (
    <section 
      id={id}
      className={sectionClass}
      style={{
        paddingTop: `${spacingValue}px`,
        paddingBottom: `${spacingValue}px`,
      }}
    >
      {children}
    </section>
  );
}

// Responsive hero section
interface ResponsiveHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  background?: React.ReactNode;
  className?: string;
  titleSize?: ResponsiveValue<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>;
  alignment?: 'left' | 'center' | 'right';
  overlay?: boolean;
}

export function ResponsiveHero({
  title,
  subtitle,
  description,
  actions,
  background,
  className = '',
  titleSize = { xs: 'lg', sm: 'xl', md: '2xl', lg: '3xl', xl: '4xl' },
  alignment = 'center',
  overlay = false
}: ResponsiveHeroProps) {
  const { prefersReducedMotion } = useViewport();
  const currentTitleSize = useResponsiveValue(titleSize);
  
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[alignment];

  const titleSizeClass = {
    'sm': 'text-2xl sm:text-3xl',
    'md': 'text-3xl sm:text-4xl md:text-5xl',
    'lg': 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    'xl': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl',
    '2xl': 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[8rem] 2xl:text-[10rem]',
    '3xl': 'text-7xl sm:text-8xl md:text-9xl lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem]',
    '4xl': 'text-8xl sm:text-9xl md:text-[8rem] lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem]'
  }[currentTitleSize];

  return (
    <ResponsiveSection fullHeight className={`relative overflow-hidden ${className}`}>
      {/* Background */}
      {background && (
        <div className="absolute inset-0 z-0">
          {background}
        </div>
      )}
      
      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/40 z-10" />
      )}

      <ResponsiveContainer className="relative z-20 h-full">
        <div className="flex flex-col justify-center items-center h-full min-h-screen">
          <motion.div
            className={`space-y-6 md:space-y-8 lg:space-y-12 ${alignmentClass}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {/* Title */}
            <motion.h1
              className={`font-bold tracking-tight leading-tight ${titleSizeClass} bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: prefersReducedMotion ? 0.3 : 1.0,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.h2
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-emerald-300/90 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  duration: prefersReducedMotion ? 0.3 : 1.0,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {subtitle}
              </motion.h2>
            )}

            {/* Description */}
            {description && (
              <motion.p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6,
                  duration: prefersReducedMotion ? 0.3 : 1.0,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {description}
              </motion.p>
            )}

            {/* Actions */}
            {actions && (
              <motion.div
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.8,
                  duration: prefersReducedMotion ? 0.3 : 1.0,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {actions}
              </motion.div>
            )}
          </motion.div>
        </div>
      </ResponsiveContainer>
    </ResponsiveSection>
  );
}

// Responsive card grid
interface ResponsiveCardGridProps {
  children: React.ReactNode;
  cols?: ResponsiveValue<number>;
  gap?: ResponsiveValue<number>;
  className?: string;
  itemClassName?: string;
}

export function ResponsiveCardGrid({
  children,
  cols = { xs: 1, sm: 2, lg: 3, xl: 4 },
  gap = { xs: 16, sm: 20, md: 24, lg: 32 },
  className = '',
  itemClassName = ''
}: ResponsiveCardGridProps) {
  const currentCols = useResponsiveValue(cols);
  const currentGap = useResponsiveValue(gap);

  return (
    <div 
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${currentCols}, minmax(0, 1fr))`,
        gap: `${currentGap}px`
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// Responsive navigation
interface ResponsiveNavProps {
  logo: React.ReactNode;
  items: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  actions?: React.ReactNode;
  className?: string;
  fixed?: boolean;
  transparent?: boolean;
}

export function ResponsiveNav({
  logo,
  items,
  actions,
  className = '',
  fixed = false,
  transparent = false
}: ResponsiveNavProps) {
  const { isMobile } = useViewport();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navClass = useMemo(() => {
    const baseClasses = [
      'w-full z-50 transition-all duration-300',
      fixed ? 'fixed top-0 left-0' : 'relative',
      transparent ? 'bg-transparent' : 'bg-slate-900/95 backdrop-blur-xl border-b border-emerald-500/20',
      className
    ];
    return baseClasses.filter(Boolean).join(' ');
  }, [fixed, transparent, className]);

  return (
    <nav className={navClass}>
      <ResponsiveContainer maxWidth="full" className="py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo}
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden lg:flex items-center space-x-8">
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`
                    transition-colors duration-200 hover:text-emerald-400
                    ${item.active ? 'text-emerald-400' : 'text-gray-300'}
                  `}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="flex items-center space-x-4">
              {actions}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-300 hover:text-emerald-400 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isMenuOpen ? 1 : 0, 
              height: isMenuOpen ? 'auto' : 0 
            }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden overflow-hidden"
          >
            <div className="py-4 space-y-4">
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`
                    block py-2 transition-colors duration-200 hover:text-emerald-400
                    ${item.active ? 'text-emerald-400' : 'text-gray-300'}
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </ResponsiveContainer>
    </nav>
  );
}

// Responsive footer
interface ResponsiveFooterProps {
  logo?: React.ReactNode;
  sections?: Array<{
    title: string;
    items: Array<{
      label: string;
      href: string;
    }>;
  }>;
  social?: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  copyright?: string;
  className?: string;
}

export function ResponsiveFooter({
  logo,
  sections = [],
  social = [],
  copyright,
  className = ''
}: ResponsiveFooterProps) {
  return (
    <footer className={`bg-slate-900 border-t border-emerald-500/20 ${className}`}>
      <ResponsiveSection spacing="lg">
        <ResponsiveContainer>
          <ResponsiveCardGrid
            cols={{ xs: 1, sm: 2, lg: sections.length + 1 }}
            gap={{ xs: 32, sm: 40, lg: 48 }}
          >
            {/* Logo and description */}
            {logo && (
              <div className="space-y-4">
                {logo}
                <p className="text-gray-400 text-sm leading-relaxed">
                  Building the future of digital experiences with cutting-edge technology and innovative design.
                </p>
              </div>
            )}

            {/* Footer sections */}
            {sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-white font-semibold text-lg">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ResponsiveCardGrid>

          {/* Social links and copyright */}
          <div className="mt-12 pt-8 border-t border-emerald-500/20">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              {/* Social links */}
              {social.length > 0 && (
                <div className="flex items-center space-x-4">
                  {social.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      aria-label={item.label}
                      className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              )}

              {/* Copyright */}
              {copyright && (
                <p className="text-gray-400 text-sm">
                  {copyright}
                </p>
              )}
            </div>
          </div>
        </ResponsiveContainer>
      </ResponsiveSection>
    </footer>
  );
}

// Export all components
export default {
  ResponsiveContainer,
  ResponsiveSection,
  ResponsiveHero,
  ResponsiveCardGrid,
  ResponsiveNav,
  ResponsiveFooter,
};