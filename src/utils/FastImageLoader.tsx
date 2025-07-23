import { useState, useCallback, useRef, useEffect } from 'react';

interface FastImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

/**
 * Ultra-fast image loader with performance optimizations
 * Prevents layout shift and ensures smooth loading
 */
export const FastImageLoader: React.FC<FastImageLoaderProps> = ({
  src,
  alt,
  className = '',
  placeholderColor = '#1a1a1a',
  onLoad,
  onError,
  priority = false,
  loading = 'lazy'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageError(true);
    onError?.();
  }, [onError]);

  // Preload critical images
  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        try {
          document.head.removeChild(link);
        } catch {
          // Link already removed
        }
      };
    }
    return () => {
      // No cleanup needed when priority is false
    };
  }, [src, priority]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        willChange: imageLoaded ? 'auto' : 'opacity'
      }}
    >
      {/* Placeholder */}
      {!imageLoaded && !imageError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${placeholderColor} 0%, rgba(255,255,255,0.1) 100%)`
          }}
        />
      )}

      {/* Image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          ${imageError ? 'hidden' : ''}
        `}
        style={{
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }}
      />

      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default FastImageLoader;
