import { useEffect, useRef, useCallback, useMemo, useState } from 'react';

interface LazyComponentProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  placeholder?: React.ReactNode;
  className?: string;
  fallbackHeight?: string;
  onVisible?: () => void;
}

/**
 * Ultra-performance lazy loading component
 * Prevents layout shift and ensures smooth loading
 */
export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  placeholder,
  className = '',
  fallbackHeight = 'auto',
  onVisible
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isVisibleRef.current) {
      isVisibleRef.current = true;
      setIsVisible(true);
      onVisible?.();
      
      // Clean up observer if triggerOnce is true
      if (triggerOnce && observerRef.current) {
        observerRef.current.disconnect();
      }
    }
  }, [onVisible, triggerOnce]);

  const observerOptions = useMemo(() => ({
    threshold,
    rootMargin,
  }), [threshold, rootMargin]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observerRef.current = observer;
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection, observerOptions]);

  if (!isVisible) {
    return (
      <div
        ref={ref}
        className={`${className}`}
        style={{
          height: fallbackHeight,
          minHeight: fallbackHeight === 'auto' ? '200px' : fallbackHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
          willChange: 'background-position'
        }}
      >
        {placeholder || (
          <div className="text-gray-500 text-sm">Loading...</div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Add shimmer animation to global styles
const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// Inject shimmer styles if not already present
if (typeof document !== 'undefined' && !document.querySelector('#shimmer-styles')) {
  const style = document.createElement('style');
  style.id = 'shimmer-styles';
  style.textContent = shimmerStyle;
  document.head.appendChild(style);
}

export default LazyComponent;
