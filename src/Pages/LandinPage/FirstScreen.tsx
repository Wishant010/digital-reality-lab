import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashCursor from '../../components/SplashCursor';
import LetterGlitch from '../../components/LetterGlitch';

// Type definitions
interface AccessGrantedProps {
  onComplete?: () => void;
}

interface TypingTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface AnimatedNameProps {
  text: string;
  delay?: number;
  className?: string;
}

interface ParticleFieldProps {
  isActive?: boolean;
}

type ButtonState = 'normal' | 'expanded' | 'glitch' | 'access' | 'complete';

// Page2 Component (embedded for now, move to separate file later)
const Page2 = () => {
  const [showName, setShowName] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowName(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-emerald-500/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {showName && (
              <AnimatedName 
                text="WISHANT BHAJAN" 
                delay={0}
                className="!text-2xl md:!text-3xl !mb-0"
              />
            )}
          </motion.div>

          <motion.div 
            className="flex space-x-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {['Portfolio', 'About', 'Skills', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-emerald-200/80 hover:text-emerald-200 font-medium tracking-wide transition-colors duration-300 relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                {item}
                <motion.div
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.nav>

      <motion.div 
        className="pt-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-emerald-200 mb-6">
              Welcome to my
            </h2>
            <motion.h1 
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-8"
              animate={{
                textShadow: [
                  '0 0 20px rgba(16,185,129,0.5)',
                  '0 0 40px rgba(16,185,129,0.8)',
                  '0 0 20px rgba(16,185,129,0.5)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Digital World
            </motion.h1>
            <p className="text-xl text-emerald-200/70 max-w-2xl mx-auto">
              Explore my projects, skills, and journey as a Full Stack Developer
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {['Projects', 'Skills', 'Experience'].map((section, index) => (
              <motion.div
                key={section}
                className="bg-black/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-500/60 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <h3 className="text-2xl font-bold text-emerald-200 mb-4">{section}</h3>
                <p className="text-emerald-200/60">
                  Discover my {section.toLowerCase()} and achievements in web development.
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <ParticleField isActive={true} />
    </div>
  );
};

// Letter-by-letter animated name component (NO DELAY)
const AnimatedName: React.FC<AnimatedNameProps> = ({ text, delay = 0, className = "" }) => {
  const [visibleLetters, setVisibleLetters] = useState<number>(0);
  
  useEffect(() => {
    // Start immediately when component mounts
    const interval = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev < text.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 80); // Speed between letters
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.h1
      className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent inline-block"
          initial={{ 
            opacity: 0, 
            y: 50, 
            scale: 0.3, 
            filter: "blur(10px)",
            rotateX: -90 
          }}
          animate={index < visibleLetters ? { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            filter: "blur(0px)",
            rotateX: 0 
          } : {}}
          transition={{ 
            duration: 0.8, 
            ease: [0.23, 1, 0.32, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          style={{
            textShadow: index < visibleLetters ? '0 0 20px rgba(16,185,129,0.5)' : 'none'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// AccessGranted Component
const AccessGranted: React.FC<AccessGrantedProps> = ({ onComplete }) => {
  const [displayText, setDisplayText] = useState<string>("");
  const accessText = "ACCESS GRANTED";
  const isUnmountedRef = useRef<boolean>(false);
  
  useEffect(() => {
    let index = 0;
    isUnmountedRef.current = false;
    
    const interval = setInterval(() => {
      if (isUnmountedRef.current) {
        clearInterval(interval);
        return;
      }
      
      if (index <= accessText.length) {
        setDisplayText(accessText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (!isUnmountedRef.current) {
            onComplete?.();
          }
        }, 1000);
      }
    }, 60);
    
    return () => {
      isUnmountedRef.current = true;
      clearInterval(interval);
    };
  }, [onComplete]);
  
  return (
    <div className="flex items-center justify-center w-full h-full bg-black/50 backdrop-blur-sm rounded-3xl border border-blue-500/30">
      <motion.div
        className="font-mono text-lg md:text-2xl font-bold text-center"
        animate={{
          textShadow: [
            '0 0 15px #3b82f6',
            '0 0 25px #3b82f6',
            '0 0 35px #3b82f6',
            '0 0 25px #3b82f6',
            '0 0 15px #3b82f6'
          ]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="text-blue-400 drop-shadow-lg" style={{
          textShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 2px 4px rgba(0,0,0,0.5)'
        }}>
          {displayText}
          <motion.span
            className="inline-block w-0.5 h-6 bg-blue-400 ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{
              boxShadow: '0 0 10px #3b82f6'
            }}
          />
        </span>
      </motion.div>
    </div>
  );
};

// TypingText Component
const TypingText: React.FC<TypingTextProps> = ({ 
  text, 
  delay = 0, 
  speed = 50, 
  className = "", 
  style = {} 
}) => {
  const [displayText, setDisplayText] = useState<string>("");
  const [showCursor, setShowCursor] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setShowCursor(false);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span className={className} style={style}>
      {displayText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  );
};

// Matrix Code Rain Component
const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // Create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F4';
      ctx.font = fontSize + 'px monospace';

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillStyle = `rgba(0, 255, 70, ${Math.random() * 0.5 + 0.5})`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// ParticleField Component
const ParticleField: React.FC<ParticleFieldProps> = ({ isActive = true }) => {
  const particleCount = 50;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={isActive ? {
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          } : {}}
          transition={{
            duration: Math.random() * 4 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Main HomePage Component
const HomePage: React.FC = () => {
  const [showAllContent, setShowAllContent] = useState<boolean>(false);
  const [animationsActive, setAnimationsActive] = useState<boolean>(true);
  const [scrollLocked, setScrollLocked] = useState<boolean>(true);
  const [buttonState, setButtonState] = useState<ButtonState>('normal');
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [showPage2, setShowPage2] = useState<boolean>(false);
  
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isUnmounted = useRef<boolean>(false);

  const cleanup = useCallback((): void => {
    isUnmounted.current = true;
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const preventScrollDuringLock = useCallback((e: Event): boolean => {
    if (scrollLocked && !isUnmounted.current) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return true;
  }, [scrollLocked]);

  const resetAnimations = useCallback((): void => {
    if (isUnmounted.current) return;
    setAnimationsActive(false);
    const timer = setTimeout(() => {
      if (!isUnmounted.current) {
        setAnimationsActive(true);
      }
    }, 100);
    timersRef.current.push(timer);
  }, []);

  useEffect(() => {
    isUnmounted.current = false;
    
    const contentTimer = setTimeout(() => {
      if (!isUnmounted.current) {
        setShowAllContent(true);
      }
    }, 500);
    timersRef.current.push(contentTimer);
    
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    
    const preventDefault = preventScrollDuringLock;
    
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (scrollLocked && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      cleanup();
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [preventScrollDuringLock, cleanup]);

  const handleHackButtonClick = useCallback((): void => {
    if (buttonClicked || isUnmounted.current) return;
    
    setButtonClicked(true);
    setButtonState('expanded');
    
    // Reduced delay before going to glitch state
    const expandTimer = setTimeout(() => {
      if (!isUnmounted.current) {
        setButtonState('glitch');
      }
    }, 800); // Slightly longer to see "Initiating Hack..." text
    
    timersRef.current.push(expandTimer);
  }, [buttonClicked]);

  const handleGlitchComplete = useCallback((): void => {
    if (isUnmounted.current) return;
    console.log('Glitch complete, setting access state');
    setButtonState('access');
  }, []);

  const handleAccessComplete = useCallback((): void => {
    setButtonState('complete');
    
    const transitionTimer = setTimeout(() => {
      if (!isUnmounted.current) {
        setTransitioning(true);
        
        const pageTimer = setTimeout(() => {
          if (!isUnmounted.current) {
            setShowPage2(true);
            resetAnimations();
            setScrollLocked(false);
            document.body.style.overflow = 'unset';
            document.body.style.height = 'auto';
          }
        }, 1000);
        timersRef.current.push(pageTimer);
      }
    }, 800);
    timersRef.current.push(transitionTimer);
  }, [resetAnimations]);

  const getButtonDimensions = (): { width: string; height: string } => {
    switch (buttonState) {
      case 'expanded':
      case 'glitch':
      case 'access':
        return { width: '550px', height: '220px' };
      case 'complete':
        return { width: '400px', height: '60px' };
      default:
        return { width: '400px', height: '60px' };
    }
  };

  const getButtonScale = (): number => {
    switch (buttonState) {
      case 'expanded':
      case 'glitch':
      case 'access':
        return 1;
      case 'complete':
        return 0.8;
      default:
        return 1;
    }
  };

  return (
    <div className="relative">
      {/* SplashCursor - alleen op eerste screen */}
      {!showPage2 && <SplashCursor />}

      {showPage2 ? (
        <Page2 />
      ) : (
        <>
          <motion.div 
            className="min-h-screen relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900" />
            
            {/* Matrix Rain Background */}
            <MatrixRain />
            
            <div className="hidden md:block">
              <ParticleField isActive={animationsActive} />
            </div>

            <motion.div 
              className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                ...(transitioning && {
                  scale: 0.8,
                  filter: "blur(5px)"
                })
              }}
              transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
            >
              {showAllContent && (
                <>
                  <motion.div 
                    className="text-center mb-6 md:mb-8"
                    animate={transitioning ? {
                      x: typeof window !== 'undefined' ? -window.innerWidth * 0.4 : -400,
                      y: typeof window !== 'undefined' ? -window.innerHeight * 0.35 : -300,
                      scale: 0.6
                    } : {}}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <AnimatedName 
                      text="WISHANT BHAJAN" 
                      delay={0}
                      className="mb-4"
                    />
                  </motion.div>

                  <motion.div 
                    className="text-center mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="text-base md:text-lg font-normal tracking-wide">
                      <TypingText
                        text="Full Stack Developer"
                        delay={1200}
                        speed={100}
                        className="text-emerald-200/90 font-sans"
                        style={{ 
                          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                          fontWeight: 400,
                          letterSpacing: '0.08em'
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="text-center relative"
                    initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, delay: 1.0, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="w-[420px] h-20 rounded-3xl border-2 border-emerald-400/40 blur-sm" />
                    </motion.div>

                    <div className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                          style={{
                            left: `${20 + i * 10}%`,
                            top: `${30 + (i % 2) * 40}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>

                    <motion.button
                      onClick={handleHackButtonClick}
                      className="relative overflow-hidden group bg-gradient-to-r from-emerald-500/30 via-teal-500/25 to-cyan-500/30 backdrop-blur-xl border-2 border-emerald-400/50 rounded-3xl font-bold transition-all duration-500 shadow-2xl text-lg md:text-xl px-8 py-4"
                      animate={{
                        ...getButtonDimensions(),
                        scale: getButtonScale()
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      whileHover={!buttonClicked ? { 
                        scale: 1.1, 
                        y: -10,
                        boxShadow: "0 25px 50px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.3)",
                        borderColor: "rgba(16,185,129,0.8)",
                        transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
                      } : {}}
                      whileTap={!buttonClicked ? { 
                        scale: 0.95,
                        transition: { duration: 0.1 }
                      } : {}}
                      disabled={buttonClicked}
                    >
                      <AnimatePresence mode="wait">
                        {buttonState === 'normal' && (
                          <motion.div
                            key="normal"
                            className="relative z-10 flex items-center justify-center w-full h-full"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent font-bold tracking-wide">
                              Hack Website
                            </span>
                          </motion.div>
                        )}
                        
                        {buttonState === 'expanded' && (
                          <motion.div
                            key="expanded"
                            className="relative z-10 flex items-center justify-center w-full h-full"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent font-bold tracking-wide text-2xl">
                              Initiating Hack...
                            </span>
                          </motion.div>
                        )}
                        
                        {buttonState === 'glitch' && (
                          <motion.div
                            key="glitch"
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <LetterGlitch 
                              onComplete={handleGlitchComplete} 
                              duration={3000} // Increased duration to see the effect better
                              glitchColors={["#10b981", "#06d6a0", "#118ab2", "#3b82f6", "#8b5cf6", "#f59e0b"]}
                              glitchSpeed={50} // Slightly slower for better visibility
                              smooth={false}
                              className="rounded-3xl"
                            />
                          </motion.div>
                        )}
                        
                        {buttonState === 'access' && (
                          <motion.div
                            key="access"
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <AccessGranted onComplete={handleAccessComplete} />
                          </motion.div>
                        )}
                        
                        {buttonState === 'complete' && (
                          <motion.div
                            key="complete"
                            className="relative z-10 flex items-center justify-center w-full h-full"
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <span className="bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 bg-clip-text text-transparent font-bold tracking-wide">
                              ✓ Hacked Successfully
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {buttonState === 'normal' && (
                        <>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-3xl"
                            animate={{
                              scale: [1, 1.15, 1],
                              opacity: [0.4, 0.7, 0.4],
                              rotate: [0, 1, -1, 0]
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />

                          <motion.div
                            className="absolute inset-0 rounded-3xl"
                            style={{
                              background: "linear-gradient(45deg, transparent, rgba(16,185,129,0.5), transparent)",
                            }}
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                          
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
                            transition={{ duration: 0.6 }}
                          />

                          <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-20">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute text-emerald-300 font-mono text-xs"
                                style={{
                                  left: `${Math.random() * 100}%`,
                                  top: "-10px",
                                }}
                                animate={{
                                  y: [0, 80],
                                  opacity: [0, 1, 0]
                                }}
                                transition={{
                                  duration: Math.random() * 2 + 1,
                                  repeat: Infinity,
                                  delay: Math.random() * 3,
                                  ease: "linear"
                                }}
                              >
                                {Math.random() > 0.5 ? '1' : '0'}
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default HomePage;