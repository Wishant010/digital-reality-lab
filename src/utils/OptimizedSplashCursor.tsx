import { useRef, useEffect, useCallback } from 'react';

interface OptimizedSplashCursorProps {
  isActive?: boolean;
}

const OptimizedSplashCursor = ({ isActive = true }: OptimizedSplashCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRunning = useRef(false);
  
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

  // Simple throttle function
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  // Optimized particle system
  const addParticle = useCallback((x: number, y: number) => {
    if (particles.current.length > 50) return;
    
    particles.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 60,
      maxLife: 60,
      size: Math.random() * 3 + 1,
      color: {
        r: 16 + Math.random() * 100,
        g: 185 + Math.random() * 70,
        b: 129 + Math.random() * 50
      }
    });
  }, []);

  // Optimized render loop
  const render = useCallback(() => {
    if (!isActive || !canvasRef.current || !isRunning.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas if needed
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Clear with fade effect for trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      
      // Update particle
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Remove dead particles
      if (p.life <= 0) {
        particles.current.splice(i, 1);
        continue;
      }

      // Draw particle
      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
      ctx.fill();
    }

    // Continue animation
    requestAnimationFrame(render);
  }, [isActive]);

  // Throttled mouse move handler
  const handleMouseMove = useCallback(
    throttle((e: any) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      const distance = Math.sqrt(
        Math.pow(e.movementX || 0, 2) + Math.pow(e.movementY || 0, 2)
      );
      
      if (distance > 2) {
        addParticle(e.clientX, e.clientY);
      }
    }, 16),
    [throttle, addParticle]
  );

  // Throttled click handler
  const handleClick = useCallback(
    throttle((e: any) => {
      for (let i = 0; i < 10; i++) {
        addParticle(
          e.clientX + (Math.random() - 0.5) * 20,
          e.clientY + (Math.random() - 0.5) * 20
        );
      }
    }, 100),
    [throttle, addParticle]
  );

  useEffect(() => {
    if (!isActive) {
      isRunning.current = false;
      return;
    }

    isRunning.current = true;

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    // Start render loop
    requestAnimationFrame(render);

    return () => {
      isRunning.current = false;
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
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default OptimizedSplashCursor;