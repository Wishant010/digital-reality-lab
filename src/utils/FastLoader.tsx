import { memo, useMemo, ComponentType } from 'react';

// Instant component loading for large screens
export const createFastComponent = <T extends object>(
  Component: ComponentType<T>,
  displayName?: string
) => {
  const FastComponent = memo((props: T) => {
    const optimizedProps = useMemo(() => ({
      ...props,
      style: {
        ...(props as any)?.style,
        willChange: 'transform, opacity',
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden' as const,
      }
    }), [props]);

    return <Component {...optimizedProps} />;
  });

  FastComponent.displayName = displayName || `Fast(${Component.displayName || Component.name})`;
  return FastComponent;
};

// Preload critical resources for desktop
export const preloadDesktopResources = () => {
  // Only preload on large screens
  if (window.innerWidth < 1024) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = 'data:text/css;base64,Knt7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDAsMCwwKX0='; // Empty CSS
  document.head.appendChild(link);

  // Preload GPU for animations
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  canvas.style.position = 'absolute';
  canvas.style.top = '-9999px';
  canvas.style.left = '-9999px';
  
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (gl) {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  
  document.body.appendChild(canvas);
  setTimeout(() => document.body.removeChild(canvas), 100);
};

// Memory efficient component loader
export const LazyDesktopComponent = memo(({ 
  loader, 
  fallback = null 
}: { 
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
}) => {
  const Component = useMemo(() => {
    let LoadedComponent: ComponentType<any> | null = null;
    
    // Immediate loading for large screens
    if (window.innerWidth >= 1024) {
      loader().then(module => {
        LoadedComponent = module.default;
      });
    }
    
    return LoadedComponent || (() => <>{fallback}</>);
  }, [loader, fallback]);

  return <Component />;
});
