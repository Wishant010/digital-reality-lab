import { useCallback, useRef, useEffect, useState } from 'react';

interface SmartPreloaderProps {
  urls: string[];
  priority?: boolean;
  onComplete?: () => void;
  onProgress?: (loaded: number, total: number) => void;
}

/**
 * Intelligent preloader for critical resources
 * Optimizes loading order and prevents blocking
 */
export const useSmartPreloader = ({ 
  urls, 
  priority = false, 
  onComplete, 
  onProgress 
}: SmartPreloaderProps) => {
  const loadedCount = useRef(0);
  const totalCount = useRef(urls.length);
  const abortController = useRef<AbortController | null>(null);

  const preloadResource = useCallback(async (url: string) => {
    try {
      // Determine resource type
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
      const isFont = /\.(woff|woff2|ttf|otf)$/i.test(url);
      
      if (isImage) {
        // Preload images
        const img = new Image();
        img.decoding = 'async';
        if (priority) {
          img.loading = 'eager';
        }
        
        return new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
          img.src = url;
        });
      } else if (isFont) {
        // Preload fonts
        const font = new FontFace('preload-font', `url(${url})`);
        await font.load();
        document.fonts.add(font);
      } else {
        // Preload other resources using fetch
        const response = await fetch(url, {
          signal: abortController.current?.signal,
          cache: 'force-cache'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${url}`);
        }
        
        // Cache the response
        await response.blob();
      }
      
      loadedCount.current++;
      onProgress?.(loadedCount.current, totalCount.current);
      
      if (loadedCount.current === totalCount.current) {
        onComplete?.();
      }
    } catch (error) {
      console.warn(`Preload failed for: ${url}`, error);
      loadedCount.current++;
      onProgress?.(loadedCount.current, totalCount.current);
    }
  }, [onComplete, onProgress, priority]);

  const startPreloading = useCallback(() => {
    if (urls.length === 0) {
      onComplete?.();
      return;
    }

    abortController.current = new AbortController();
    loadedCount.current = 0;
    totalCount.current = urls.length;

    // Load resources in parallel for faster loading
    urls.forEach((url) => {
      preloadResource(url);
    });
  }, [urls, preloadResource, onComplete]);

  const stopPreloading = useCallback(() => {
    abortController.current?.abort();
    abortController.current = null;
  }, []);

  useEffect(() => {
    startPreloading();
    
    return () => {
      stopPreloading();
    };
  }, [startPreloading, stopPreloading]);

  return {
    progress: loadedCount.current / totalCount.current,
    loaded: loadedCount.current,
    total: totalCount.current,
    stop: stopPreloading,
    restart: startPreloading
  };
};

/**
 * Smart preloader component
 */
export const SmartPreloader: React.FC<SmartPreloaderProps & {
  children?: React.ReactNode;
  showProgress?: boolean;
  loadingComponent?: React.ReactNode;
}> = ({ 
  urls, 
  priority, 
  onComplete, 
  onProgress, 
  children, 
  showProgress = true,
  loadingComponent
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleProgress = useCallback((loaded: number, total: number) => {
    const progressValue = total > 0 ? loaded / total : 0;
    setProgress(progressValue);
    onProgress?.(loaded, total);
  }, [onProgress]);

  const handleComplete = useCallback(() => {
    setIsLoading(false);
    onComplete?.();
  }, [onComplete]);

  useSmartPreloader({ 
    urls, 
    priority, 
    onComplete: handleComplete, 
    onProgress: handleProgress 
  });

  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          {showProgress && (
            <div className="space-y-2">
              <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-400">
                Loading... {Math.round(progress * 100)}%
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SmartPreloader;
