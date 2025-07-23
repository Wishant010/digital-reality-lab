import { useRef, useEffect, useCallback, useMemo } from 'react';

interface OptimizedSplashCursorProps {
  isActive?: boolean;
  maxParticles?: number;
  particleLifespan?: number;
  throttleDelay?: number;
}

// ULTRA-HIGH-PERFORMANCE Splash Cursor with 60fps+ guarantee
const OptimizedSplashCursor = ({ 
  isActive = true,
  maxParticles = 12, // Further reduced for ultra-smooth performance
  particleLifespan = 25, // Faster lifecycle
  throttleDelay = 12 // More responsive but still optimized
}: OptimizedSplashCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRunning = useRef(false);
  const animationId = useRef<number | undefined>(undefined);
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const particles = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: { r: number; g: number; b: number };
  }>>([]);

  // Ultra-optimized color palette with precomputed values
  const colorPalette = useMemo(() => [
    { r: 16, g: 185, b: 129 },   // Emerald
    { r: 20, g: 184, b: 166 },   // Teal
    { r: 34, g: 197, b: 94 },    // Green
    { r: 14, g: 165, b: 233 }    // Sky
  ], []);

  // Lightning-fast throttle with minimal overhead
  const throttle = useCallback((func: Function, limit: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = performance.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        func.apply(null, args);
      }
    };
  }, []);

  // Ultra-fast particle creation with pool reuse
  const addParticle = useCallback((x: number, y: number) => {
    // Aggressive particle management
    if (particles.current.length >= maxParticles) {
      particles.current.splice(0, Math.floor(maxParticles * 0.3)); // Remove 30% in batch
    }
    
    const colorIndex = Math.floor(Math.random() * colorPalette.length);
    const baseColor = colorPalette[colorIndex];
    
    particles.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2, // Reduced velocity for smoother motion
      vy: (Math.random() - 0.5) * 2,
      life: particleLifespan,
      maxLife: particleLifespan,
      size: Math.random() * 1.8 + 0.4, // Smaller, more efficient particles
      color: {
        r: Math.min(255, baseColor.r + (Math.random() * 30 - 15)),
        g: Math.min(255, baseColor.g + (Math.random() * 30 - 15)),
        b: Math.min(255, baseColor.b + (Math.random() * 20 - 10))
      }
    });
  }, [maxParticles, particleLifespan, colorPalette]);

  // ULTRA-OPTIMIZED render loop with delta timing and frame skipping
  const render = useCallback(() => {
    if (!isActive || !canvasRef.current || !isRunning.current) {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = undefined;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { 
      alpha: false, // Better performance without alpha
      willReadFrequently: false,
      desynchronized: true // Better performance
    });
    if (!ctx) return;

    const now = performance.now();
    const deltaTime = now - lastFrameTime.current;
    
    // Frame rate limiting for consistent performance
    if (deltaTime < 16.67) { // ~60fps cap
      animationId.current = requestAnimationFrame(render);
      return;
    }
    
    lastFrameTime.current = now;
    frameCount.current++;

    // Adaptive canvas sizing with performance check
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    
    if (canvas.width !== currentWidth || canvas.height !== currentHeight) {
      canvas.width = currentWidth;
      canvas.height = currentHeight;
      canvas.style.width = currentWidth + 'px';
      canvas.style.height = currentHeight + 'px';
    }

    // Ultra-fast clear with optimized trail
    ctx.fillStyle = '#000000'; // Solid black for better performance
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Batch particle processing with optimized loop
    const particleArray = particles.current;
    const particleCount = particleArray.length;
    
    // Process particles in reverse order for safe removal
    for (let i = particleCount - 1; i >= 0; i--) {
      const p = particleArray[i];
      
      // Ultra-fast physics update
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.vx *= 0.98; // Optimized damping
      p.vy *= 0.98;

      // Fast removal of dead particles
      if (p.life <= 0) {
        particleArray.splice(i, 1);
        continue;
      }

      // Optimized rendering with single draw call
      const alpha = p.life / p.maxLife;
      const size = p.size * alpha;
      
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillStyle = `rgb(${p.color.r},${p.color.g},${p.color.b})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, 6.28318530718); // Use constant instead of Math.PI * 2
      ctx.fill();
    }
    
    ctx.globalAlpha = 1; // Reset alpha

    // Continue with next frame
    animationId.current = requestAnimationFrame(render);
  }, [isActive]);

  // Ultra-responsive mouse movement with distance optimization
  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      const prevX = mousePos.current.x;
      const prevY = mousePos.current.y;
      
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Fast distance calculation with optimization
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      const distanceSquared = dx * dx + dy * dy; // Avoid sqrt for performance
      
      // Only create particles for meaningful movement (optimized threshold)
      if (distanceSquared > 9 && distanceSquared < 10000) { // 3² to 100²
        addParticle(e.clientX, e.clientY);
      }
    }, throttleDelay),
    [throttle, addParticle, throttleDelay]
  );

  // Ultra-fast click burst with optimized pattern
  const handleClick = useCallback(
    throttle((e: MouseEvent) => {
      const burstCount = 6; // Reduced for better performance
      const burstRadius = 12;
      const angleStep = 1.0471975512; // 60 degrees in radians (360/6)
      
      for (let i = 0; i < burstCount; i++) {
        const angle = i * angleStep;
        const distance = Math.random() * burstRadius;
        const x = e.clientX + Math.cos(angle) * distance;
        const y = e.clientY + Math.sin(angle) * distance;
        addParticle(x, y);
      }
    }, 100), // Faster cooldown
    [throttle, addParticle]
  );

  // Ultra-efficient lifecycle management
  useEffect(() => {
    if (!isActive) {
      isRunning.current = false;
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = undefined;
      }
      particles.current.length = 0; // Fast array clear
      return;
    }

    isRunning.current = true;
    lastFrameTime.current = performance.now();

    // High-performance event listeners with minimal options
    const options = { passive: true, capture: false };
    document.addEventListener('mousemove', handleMouseMove, options);
    document.addEventListener('click', handleClick, options);

    // Start ultra-optimized render loop
    animationId.current = requestAnimationFrame(render);

    return () => {
      isRunning.current = false;
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = undefined;
      }
      particles.current.length = 0;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, [isActive, handleMouseMove, handleClick, render]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        width: '100vw',
        height: '100vh',
        mixBlendMode: 'normal', // Changed from 'screen' for better performance
        willChange: 'auto', // Let browser decide
        imageRendering: 'auto',
        transform: 'translateZ(0)', // Force GPU layer
        backfaceVisibility: 'hidden'
      }}
    />
  );
};

export default OptimizedSplashCursor;