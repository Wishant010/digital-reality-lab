import { useRef, useEffect, useCallback, useMemo } from 'react';

interface OptimizedSplashCursorProps {
  isActive?: boolean;
  maxParticles?: number;
  particleLifespan?: number;
  throttleDelay?: number;
}

const OptimizedSplashCursor = ({ 
  isActive = true,
  maxParticles = 30, // Reduced from 50
  particleLifespan = 45, // Reduced from 60
  throttleDelay = 20 // Increased from 16
}: OptimizedSplashCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRunning = useRef(false);
  const animationId = useRef<number | undefined>(undefined);
  
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

  // Memoized color palette for performance
  const colorPalette = useMemo(() => [
    { r: 16, g: 185, b: 129 },
    { r: 56, g: 225, b: 159 },
    { r: 96, g: 265, b: 189 },
    { r: 126, g: 205, b: 149 }
  ], []);

  // Optimized throttle with cleanup
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle = false;
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  // Performance-optimized particle creation
  const addParticle = useCallback((x: number, y: number) => {
    if (particles.current.length >= maxParticles) {
      // Remove oldest particle instead of skipping
      particles.current.shift();
    }
    
    const colorIndex = Math.floor(Math.random() * colorPalette.length);
    const baseColor = colorPalette[colorIndex];
    
    particles.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 3, // Reduced velocity
      vy: (Math.random() - 0.5) * 3,
      life: particleLifespan,
      maxLife: particleLifespan,
      size: Math.random() * 2.5 + 0.5, // Smaller particles
      color: {
        r: Math.min(255, baseColor.r + Math.random() * 50),
        g: Math.min(255, baseColor.g + Math.random() * 50),
        b: Math.min(255, baseColor.b + Math.random() * 30)
      }
    });
  }, [maxParticles, particleLifespan, colorPalette]);

  // Highly optimized render loop with RAF management
  const render = useCallback(() => {
    if (!isActive || !canvasRef.current || !isRunning.current) {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = undefined;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    // Optimized canvas sizing with debouncing
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    
    if (canvas.width !== currentWidth || canvas.height !== currentHeight) {
      canvas.width = currentWidth;
      canvas.height = currentHeight;
    }

    // Enhanced trail effect for smoother visuals
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Batch particle updates and drawing
    ctx.save();
    
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      
      // Update particle physics
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.vx *= 0.985; // Slightly more damping
      p.vy *= 0.985;

      // Remove dead particles
      if (p.life <= 0) {
        particles.current.splice(i, 1);
        continue;
      }

      // Optimized alpha calculation
      const alpha = (p.life / p.maxLife) * 0.8;
      const size = p.size * Math.sqrt(alpha); // Smooth size transition
      
      // Single draw call per particle
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();

    // Continue animation with proper cleanup
    animationId.current = requestAnimationFrame(render);
  }, [isActive]);

  // Optimized mouse handlers with better movement detection
  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      const prevX = mousePos.current.x;
      const prevY = mousePos.current.y;
      
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - prevX, 2) + Math.pow(e.clientY - prevY, 2)
      );
      
      // Only create particles for meaningful movement
      if (distance > 3 && distance < 100) {
        addParticle(e.clientX, e.clientY);
      }
    }, throttleDelay),
    [throttle, addParticle, throttleDelay]
  );

  // Enhanced click effect with burst pattern
  const handleClick = useCallback(
    throttle((e: MouseEvent) => {
      const burstCount = 8; // Reduced from 10
      const burstRadius = 15;
      
      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2;
        const distance = Math.random() * burstRadius;
        addParticle(
          e.clientX + Math.cos(angle) * distance,
          e.clientY + Math.sin(angle) * distance
        );
      }
    }, 150), // Increased cooldown
    [throttle, addParticle]
  );

  // Enhanced lifecycle management
  useEffect(() => {
    if (!isActive) {
      isRunning.current = false;
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = undefined;
      }
      particles.current = [];
      return;
    }

    isRunning.current = true;

    // Passive event listeners for better performance
    const passiveOptions = { passive: true };
    document.addEventListener('mousemove', handleMouseMove, passiveOptions);
    document.addEventListener('click', handleClick, passiveOptions);

    // Start optimized render loop
    animationId.current = requestAnimationFrame(render);

    return () => {
      isRunning.current = false;
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = undefined;
      }
      particles.current = [];
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
        mixBlendMode: 'screen',
        willChange: 'transform', // GPU acceleration hint
        imageRendering: 'auto'
      }}
    />
  );
};

export default OptimizedSplashCursor;