import { useRef, useEffect } from "react";

interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  onComplete?: () => void;
  duration?: number;
  className?: string;
}

interface Letter {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
}

interface GridData {
  columns: number;
  rows: number;
}

const LetterGlitch: React.FC<LetterGlitchProps> = ({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  onComplete,
  duration = 0, // 0 means infinite
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<Letter[]>([]);
  const grid = useRef<GridData>({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef<number>(Date.now());
  const startTime = useRef<number>(Date.now());
  const isDestroyed = useRef<boolean>(false);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const lettersAndSymbols = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "!", "@", "#", "$", "&", "*", "(", ")", "-", "_", "+", "=", "/", "[", "]", "{", "}", ";", ":", "<", ">", ",",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  ];

  const getRandomChar = (): string => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  };

  const getRandomColor = (): string => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number
  ): string => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor),
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };

  const calculateGrid = (width: number, height: number): GridData => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  };

  const initializeLetters = (columns: number, rows: number): void => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, (): Letter => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const resizeCanvas = (): void => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isDestroyed.current) return;

    // Force container to take full parent size
    const parent = container.parentElement;
    if (parent) {
      container.style.width = '100%';
      container.style.height = '100%';
    }

    // Get the actual container dimensions
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width === 0 || height === 0) {
      // If container has no size, try again later
      setTimeout(() => {
        if (!isDestroyed.current) {
          resizeCanvas();
        }
      }, 50);
      return;
    }

    const dpr = window.devicePixelRatio || 1;

    // Set canvas size in device pixels
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Set display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale context for high DPI displays
    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(width, height);
    initializeLetters(columns, rows);
    drawLetters();
  };

  const drawLetters = (): void => {
    if (!context.current || letters.current.length === 0 || isDestroyed.current) return;
    const ctx = context.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    ctx.clearRect(0, 0, containerRect.width, containerRect.height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    letters.current.forEach((letter: Letter, index: number) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const updateLetters = (): void => {
    if (!letters.current || letters.current.length === 0 || isDestroyed.current) return;

    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      if (!letters.current[index]) continue;

      letters.current[index].char = getRandomChar();
      letters.current[index].targetColor = getRandomColor();

      if (!smooth) {
        letters.current[index].color = letters.current[index].targetColor;
        letters.current[index].colorProgress = 1;
      } else {
        letters.current[index].colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = (): void => {
    let needsRedraw = false;
    letters.current.forEach((letter) => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;

        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(
            startRgb,
            endRgb,
            letter.colorProgress
          );
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) {
      drawLetters();
    }
  };

  const animate = (): void => {
    if (isDestroyed.current) return;
    
    const now = Date.now();
    
    // Check if duration is set and has passed
    if (duration > 0 && now - startTime.current >= duration) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      onComplete?.();
      return;
    }

    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }

    if (smooth) {
      handleSmoothTransitions();
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDestroyed.current = false;
    context.current = canvas.getContext("2d");
    startTime.current = Date.now();
    
    // Initial resize with slight delay to ensure container is properly sized
    setTimeout(() => {
      if (!isDestroyed.current) {
        resizeCanvas();
        animate();
      }
    }, 10);

    let resizeTimeout: NodeJS.Timeout;

    const handleResize = (): void => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!isDestroyed.current) {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          resizeCanvas();
          animate();
        }
      }, 100);
    };

    // Use ResizeObserver for more accurate container size detection
    let resizeObserver: ResizeObserver | null = null;
    
    if ('ResizeObserver' in window && containerRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === containerRef.current) {
            handleResize();
            break;
          }
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      isDestroyed.current = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      clearTimeout(resizeTimeout);
    };
  }, [glitchSpeed, smooth, duration, onComplete]);

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    overflow: "hidden",
  };

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "block",
  };

  const outerVignetteStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
  };

  const centerVignetteStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
  };

  return (
    <div ref={containerRef} style={containerStyle} className={className}>
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette && <div style={outerVignetteStyle}></div>}
      {centerVignette && <div style={centerVignetteStyle}></div>}
    </div>
  );
};

export default LetterGlitch;