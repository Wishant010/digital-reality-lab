import React, { memo, useMemo } from 'react';
import { createFastComponent } from './utils/FastLoader';

// Import the original FirstScreen
const OriginalFirstScreen = React.lazy(() => import('./Pages/LandinPage/FirstScreen'));

// Create ultra-fast version for large screens
const OptimizedFirstScreen = memo(() => {
  const isLargeScreen = useMemo(() => window.innerWidth >= 1024, []);
  
  const containerStyle = useMemo(() => ({
    willChange: 'transform, opacity',
    transform: 'translate3d(0,0,0)',
    backfaceVisibility: 'hidden' as const,
    ...(isLargeScreen && {
      contain: 'layout style paint' as any,
      isolation: 'isolate' as any,
    })
  }), [isLargeScreen]);

  return (
    <div style={containerStyle} className={isLargeScreen ? 'animation-fast' : ''}>
      <React.Suspense fallback={
        <div 
          className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <div 
            className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            style={{ animationDuration: isLargeScreen ? '0.1s' : '0.4s' }}
          />
        </div>
      }>
        <OriginalFirstScreen />
      </React.Suspense>
    </div>
  );
});

OptimizedFirstScreen.displayName = 'OptimizedFirstScreen';

// Export the fast component version
export default createFastComponent(OptimizedFirstScreen, 'FastFirstScreen');
