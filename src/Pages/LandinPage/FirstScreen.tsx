"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SplashCursor from "../../components/SplashCursor"
import LetterGlitch from "../../components/LetterGlitch"
import Page2 from "../LandinPage/Page2"
import { useViewport, useResponsiveValue } from "../../utils/responsive"
import type { ResponsiveValue } from "../../utils/responsive"

// Import animation utilities
// (verwijderd omdat ze niet gebruikt worden)

// Type definitions
interface AccessGrantedProps {
  onComplete?: () => void
}

interface TypingTextProps {
  text: string
  delay?: number
  speed?: number
  className?: string
  style?: React.CSSProperties
}

interface AnimatedNameProps {
  text: string
  delay?: number
  className?: string
}

interface ParticleFieldProps {
  isActive?: boolean
}

type ButtonState = "normal" | "expanded" | "glitch" | "access" | "complete"

// Responsive configuration
const RESPONSIVE_CONFIG = {
  // Particle counts per device
  particleCounts: {
    xs: 15,
    sm: 20,
    md: 25,
    lg: 30,
    xl: 35,
    '2xl': 40,
    '3xl': 45,
    '4xl': 50
  },

  // Animation speeds per device
  animationSpeeds: {
    xs: 120,    // Slower on mobile for battery
    sm: 100,
    md: 90,
    lg: 80,
    xl: 70,
    '2xl': 60,
    '3xl': 50,
    '4xl': 40
  },

  // Button sizes per breakpoint
  buttonSizes: {
    normal: {
      xs: { width: '280px', height: '50px' },
      sm: { width: '320px', height: '55px' },
      md: { width: '360px', height: '60px' },
      lg: { width: '400px', height: '60px' },
      xl: { width: '420px', height: '65px' },
      '2xl': { width: '450px', height: '70px' },
      '3xl': { width: '480px', height: '75px' },
      '4xl': { width: '520px', height: '80px' }
    },
    expanded: {
      xs: { width: '300px', height: '120px' },
      sm: { width: '380px', height: '140px' },
      md: { width: '450px', height: '160px' },
      lg: { width: '550px', height: '220px' },
      xl: { width: '600px', height: '240px' },
      '2xl': { width: '650px', height: '260px' },
      '3xl': { width: '700px', height: '280px' },
      '4xl': { width: '750px', height: '300px' }
    }
  },

  // Text sizes per breakpoint
  textSizes: {
    title: {
      xs: 'text-3xl',
      sm: 'text-4xl', 
      md: 'text-5xl',
      lg: 'text-6xl',
      xl: 'text-7xl',
      '2xl': 'text-8xl',
      '3xl': 'text-9xl',
      '4xl': 'text-[8rem]'
    } as ResponsiveValue<string>,
    
    subtitle: {
      xs: 'text-sm',
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl',
      '2xl': 'text-3xl',
      '3xl': 'text-4xl',
      '4xl': 'text-5xl'
    } as ResponsiveValue<string>,

    button: {
      xs: 'text-sm',
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl'
    } as ResponsiveValue<string>
  },

  // Spacing per breakpoint
  spacing: {
    xs: { container: 16, elements: 24 },
    sm: { container: 20, elements: 32 },
    md: { container: 24, elements: 40 },
    lg: { container: 32, elements: 48 },
    xl: { container: 40, elements: 56 },
    '2xl': { container: 48, elements: 64 },
    '3xl': { container: 56, elements: 72 },
    '4xl': { container: 64, elements: 80 }
  }
}

// Responsive AnimatedName component
const AnimatedName: React.FC<AnimatedNameProps> = ({ 
  text, 
  delay = 0, 
  className = "" 
}) => {
  const [visibleLetters, setVisibleLetters] = useState<number>(0)
  const { prefersReducedMotion } = useViewport()
  const animationSpeed = useResponsiveValue(RESPONSIVE_CONFIG.animationSpeeds)
  const titleSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.title)

  useEffect(() => {
    const speed = prefersReducedMotion ? animationSpeed * 2 : animationSpeed
    
    const interval = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev < text.length) {
          return prev + 1
        } else {
          clearInterval(interval)
          return prev
        }
      })
    }, speed)

    return () => clearInterval(interval)
  }, [text, animationSpeed, prefersReducedMotion])

  return (
    <motion.h1
      className={`${titleSize} font-bold tracking-tight ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: prefersReducedMotion ? 0.3 : 0.5, 
        delay: prefersReducedMotion ? 0 : delay 
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent inline-block"
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 50,
            scale: prefersReducedMotion ? 1 : 0.3,
            filter: prefersReducedMotion ? "blur(0px)" : "blur(10px)",
            rotateX: prefersReducedMotion ? 0 : -90,
          }}
          animate={
            index < visibleLetters
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  rotateX: 0,
                }
              : {}
          }
          transition={{
            duration: prefersReducedMotion ? 0.3 : 0.8,
            ease: prefersReducedMotion ? "easeOut" : [0.23, 1, 0.32, 1],
            type: prefersReducedMotion ? "tween" : "spring",
            stiffness: 100,
            damping: 15,
          }}
          style={{
            textShadow: index < visibleLetters ? "0 0 20px rgba(16,185,129,0.5)" : "none",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  )
}

// Responsive AccessGranted component
const AccessGranted: React.FC<AccessGrantedProps> = ({ onComplete }) => {
  const [displayText, setDisplayText] = useState<string>("")
  const accessText = "ACCESS GRANTED"
  const isUnmountedRef = useRef<boolean>(false)
  const { prefersReducedMotion } = useViewport()
  const buttonTextSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.button)

  useEffect(() => {
    let index = 0
    isUnmountedRef.current = false
    const speed = prefersReducedMotion ? 30 : 60

    const interval = setInterval(() => {
      if (isUnmountedRef.current) {
        clearInterval(interval)
        return
      }

      if (index <= accessText.length) {
        setDisplayText(accessText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          if (!isUnmountedRef.current) {
            onComplete?.()
          }
        }, 1000)
      }
    }, speed)

    return () => {
      isUnmountedRef.current = true
      clearInterval(interval)
    }
  }, [onComplete, prefersReducedMotion])

  return (
    <div className="flex items-center justify-center w-full h-full bg-black/50 backdrop-blur-sm rounded-3xl border border-blue-500/30">
      <motion.div
        className={`font-mono ${buttonTextSize} font-bold text-center`}
        animate={prefersReducedMotion ? {} : {
          textShadow: [
            "0 0 15px #3b82f6",
            "0 0 25px #3b82f6",
            "0 0 35px #3b82f6",
            "0 0 25px #3b82f6",
            "0 0 15px #3b82f6",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <span
          className="text-blue-400 drop-shadow-lg"
          style={{
            textShadow: "0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {displayText}
          <motion.span
            className="inline-block w-0.5 h-6 bg-blue-400 ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ 
              duration: 0.5, 
              repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY 
            }}
            style={{
              boxShadow: "0 0 10px #3b82f6",
            }}
          />
        </span>
      </motion.div>
    </div>
  )
}

// Responsive TypingText Component
const TypingText: React.FC<TypingTextProps> = ({ 
  text, 
  delay = 0, 
  speed = 50, 
  className = "", 
  style = {} 
}) => {
  const [displayText, setDisplayText] = useState<string>("")
  const [showCursor, setShowCursor] = useState<boolean>(true)
  const { prefersReducedMotion } = useViewport()

  useEffect(() => {
    const actualSpeed = prefersReducedMotion ? speed / 2 : speed
    
    const timeout = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index))
          index++
        } else {
          clearInterval(interval)
          setShowCursor(false)
        }
      }, actualSpeed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, delay, speed, prefersReducedMotion])

  return (
    <span className={className} style={style}>
      {displayText}
      {showCursor && (
        <span className={prefersReducedMotion ? "" : "animate-pulse"}>|</span>
      )}
    </span>
  )
}

// Matrix Code Rain Component (unchanged for performance)
const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}"
    const matrixArray = matrix.split("")
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let x = 0; x < columns; x++) {
      drops[x] = 1
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#0F4"
      ctx.font = fontSize + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
        ctx.fillStyle = `rgba(0, 255, 70, ${Math.random() * 0.5 + 0.5})`
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 35)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" style={{ zIndex: 1 }} />
}

// Responsive ParticleField Component
const ParticleField: React.FC<ParticleFieldProps> = ({ isActive = true }) => {
  const { prefersReducedMotion } = useViewport()
  const particleCount = useResponsiveValue(RESPONSIVE_CONFIG.particleCounts)

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
          animate={
            isActive && !prefersReducedMotion
              ? {
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }
              : {}
          }
          transition={{
            duration: Math.random() * 4 + 2,
            repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// Main HomePage Component
const HomePage: React.FC = () => {
  const [showAllContent, setShowAllContent] = useState<boolean>(false)
  const [animationsActive, setAnimationsActive] = useState<boolean>(true)
  const [scrollLocked, setScrollLocked] = useState<boolean>(true)
  const [buttonState, setButtonState] = useState<ButtonState>("normal")
  const [buttonClicked, setButtonClicked] = useState<boolean>(false)
  const [showPage2, setShowPage2] = useState<boolean>(false)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  const timersRef = useRef<NodeJS.Timeout[]>([])
  const isUnmounted = useRef<boolean>(false)

  // Responsive hooks
  const { prefersReducedMotion, isTablet } = useViewport()
  const subtitleSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.subtitle)
  const buttonTextSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.button)
  const spacing = useResponsiveValue(RESPONSIVE_CONFIG.spacing)

  const cleanup = useCallback((): void => {
    isUnmounted.current = true
    timersRef.current.forEach((timer) => clearTimeout(timer))
    timersRef.current = []
  }, [])

  const preventScrollDuringLock = useCallback(
    (e: Event): boolean => {
      if (scrollLocked && !isUnmounted.current) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      return true
    },
    [scrollLocked],
  )

  const resetAnimations = useCallback((): void => {
    if (isUnmounted.current) return
    setAnimationsActive(false)
    const timer = setTimeout(() => {
      if (!isUnmounted.current) {
        setAnimationsActive(true)
      }
    }, 100)
    timersRef.current.push(timer)
  }, [])

  useEffect(() => {
    isUnmounted.current = false

    // Keep body dark
    document.body.style.backgroundColor = "#0f172a"
    document.documentElement.style.backgroundColor = "#0f172a"

    const contentTimer = setTimeout(() => {
      if (!isUnmounted.current) {
        setShowAllContent(true)
      }
    }, 500)
    timersRef.current.push(contentTimer)

    document.body.style.overflow = "hidden"
    document.body.style.height = "100vh"

    const preventDefault = preventScrollDuringLock

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (scrollLocked && ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) {
        e.preventDefault()
      }
    }

    window.addEventListener("wheel", preventDefault, { passive: false })
    window.addEventListener("touchmove", preventDefault, { passive: false })
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      cleanup()
      document.body.style.overflow = "unset"
      document.body.style.height = "auto"
      document.body.style.backgroundColor = "#0f172a"
      document.documentElement.style.backgroundColor = "#0f172a"
      window.removeEventListener("wheel", preventDefault)
      window.removeEventListener("touchmove", preventDefault)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [preventScrollDuringLock, cleanup])

  const handleHackButtonClick = useCallback((): void => {
    if (buttonClicked || isUnmounted.current) return

    setButtonClicked(true)
    setButtonState("expanded")

    const expandTimer = setTimeout(() => {
      if (!isUnmounted.current) {
        setButtonState("glitch")
      }
    }, 800)

    timersRef.current.push(expandTimer)
  }, [buttonClicked])

  const handleGlitchComplete = useCallback((): void => {
    if (isUnmounted.current) return
    setButtonState("access")
  }, [])

  const handleAccessComplete = useCallback((): void => {
    setButtonState("complete")
    
    const transitionTimer = setTimeout(() => {
      if (!isUnmounted.current) {
        setIsTransitioning(true)
        
        const pageTimer = setTimeout(() => {
          if (!isUnmounted.current) {
            setShowPage2(true)
            resetAnimations()
            setScrollLocked(false)
            document.body.style.overflow = "unset"
            document.body.style.height = "auto"
          }
        }, 1000)
        timersRef.current.push(pageTimer)
      }
    }, 800)
    timersRef.current.push(transitionTimer)
  }, [resetAnimations])

  const getButtonDimensions = (): { width: string; height: string } => {
    const currentBreakpoint = isTablet ? 'md' : 'lg'
    const buttonConfig = RESPONSIVE_CONFIG.buttonSizes
    
    switch (buttonState) {
      case "expanded":
      case "glitch":
      case "access":
        return buttonConfig.expanded[currentBreakpoint] || buttonConfig.expanded.lg
      case "complete":
      case "normal":
      default:
        return buttonConfig.normal[currentBreakpoint] || buttonConfig.normal.lg
    }
  }

  const getButtonScale = (): number => {
    switch (buttonState) {
      case "expanded":
      case "glitch":
      case "access":
        return 1
      case "complete":
        return 0.8
      default:
        return 1
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-900">
      {/* SplashCursor - only on first screen */}
      {!showPage2 && <SplashCursor />}

      {/* Dark background overlay */}
      <div className="fixed inset-0 bg-slate-900 z-0" />

      <AnimatePresence mode="wait">
        {showPage2 ? (
          <motion.div
            key="page2"
            className="relative z-10"
            initial={{
              opacity: 0,
              scale: 1.05,
              backgroundColor: "rgba(15,23,42,1)", // Fix: use rgba for animatable color
            }}
            animate={{
              opacity: 1,
              scale: 1,
              backgroundColor: "rgba(15,23,42,0)", // Fix: use rgba for animatable color
            }}
            transition={{ 
              duration: prefersReducedMotion ? 0.3 : 0.6, 
              ease: [0.23, 1, 0.32, 1] 
            }}
          >
            <Page2 />
          </motion.div>
        ) : (
          <motion.div
            key="homepage"
            className="min-h-screen relative overflow-hidden z-10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: isTransitioning ? 0.95 : 1,
              filter: isTransitioning ? "blur(8px)" : "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              filter: "blur(10px)",
              y: -50,
            }}
            transition={{
              duration: isTransitioning ? 0.8 : (prefersReducedMotion ? 0.5 : 1.5),
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {/* Background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900"
              animate={{
                opacity: isTransitioning ? 0.3 : 1,
              }}
              transition={{ 
                duration: prefersReducedMotion ? 0.5 : 1.5, 
                ease: "easeOut" 
              }}
            />

            {/* Matrix rain background */}
            <motion.div
              animate={{
                opacity: isTransitioning ? 0.1 : 1,
              }}
              transition={{ 
                duration: prefersReducedMotion ? 0.5 : 1.5, 
                ease: "easeOut" 
              }}
            >
              <MatrixRain />
            </motion.div>

            {/* Particle field - hidden on mobile for performance */}
            {!isTablet && (
              <motion.div
                animate={{
                  opacity: isTransitioning ? 0.2 : 1,
                }}
                transition={{ 
                  duration: prefersReducedMotion ? 0.5 : 1.5, 
                  ease: "easeOut" 
                }}
              >
                <ParticleField isActive={animationsActive && !isTransitioning} />
              </motion.div>
            )}

            {/* Main content */}
            <motion.div
              className="relative z-20 flex flex-col items-center justify-center min-h-screen"
              style={{ padding: spacing.container }}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: isTransitioning ? 0.4 : 1,
                y: isTransitioning ? -30 : 0,
                scale: isTransitioning ? 0.9 : 1,
              }}
              transition={{ 
                duration: isTransitioning ? 1.5 : (prefersReducedMotion ? 0.5 : 1.5), 
                ease: [0.23, 1, 0.32, 1], 
                delay: prefersReducedMotion ? 0 : 0.5 
              }}
            >
              {showAllContent && (
                <>
                  <motion.div 
                    className="text-center"
                    style={{ marginBottom: spacing.elements }}
                  >
                    <AnimatedName text="WISHANT BHAJAN" delay={0} className="mb-4" />
                  </motion.div>

                  <motion.div
                    className="text-center"
                    style={{ marginBottom: spacing.elements }}
                    initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{ 
                      duration: prefersReducedMotion ? 0.3 : 1.5, 
                      delay: prefersReducedMotion ? 0 : 0.6, 
                      ease: [0.23, 1, 0.32, 1] 
                    }}
                  >
                    <div className={`${subtitleSize} font-normal tracking-wide`}>
                      <TypingText
                        text="Full Stack Developer"
                        delay={1200}
                        speed={100}
                        className="text-emerald-200/90 font-sans"
                        style={{
                          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                          fontWeight: 400,
                          letterSpacing: "0.08em",
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="text-center relative"
                    initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{ 
                      duration: prefersReducedMotion ? 0.3 : 1.5, 
                      delay: prefersReducedMotion ? 0 : 1.0, 
                      ease: [0.23, 1, 0.32, 1] 
                    }}
                  >
                    <motion.button
                      onClick={handleHackButtonClick}
                      className={`relative overflow-hidden group bg-gradient-to-r from-emerald-500/30 via-teal-500/25 to-cyan-500/30 backdrop-blur-xl border-2 border-emerald-400/50 rounded-3xl font-bold transition-all duration-500 shadow-2xl ${buttonTextSize} px-8 py-4`}
                      animate={{
                        ...getButtonDimensions(),
                        scale: getButtonScale(),
                      }}
                      transition={{
                        duration: prefersReducedMotion ? 0.3 : 0.8,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                      whileHover={
                        !buttonClicked && !prefersReducedMotion
                          ? {
                              scale: 1.1,
                              y: -10,
                              boxShadow: "0 25px 50px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.3)",
                              borderColor: "rgba(16,185,129,0.8)",
                              transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
                            }
                          : {}
                      }
                      whileTap={
                        !buttonClicked
                          ? {
                              scale: 0.95,
                              transition: { duration: 0.1 },
                            }
                          : {}
                      }
                      disabled={buttonClicked}
                    >
                      <AnimatePresence mode="wait">
                        {buttonState === "normal" && (
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

                        {buttonState === "expanded" && (
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

                        {buttonState === "glitch" && (
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
                              duration={3000}
                              glitchColors={["#10b981", "#06d6a0", "#118ab2", "#3b82f6", "#8b5cf6", "#f59e0b"]}
                              glitchSpeed={50}
                              smooth={false}
                              className="rounded-3xl"
                            />
                          </motion.div>
                        )}

                        {buttonState === "access" && (
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

                        {buttonState === "complete" && (
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

                      {buttonState === "normal" && !prefersReducedMotion && (
                        <>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-3xl"
                            animate={{
                              scale: [1, 1.15, 1],
                              opacity: [0.4, 0.7, 0.4],
                              rotate: [0, 1, -1, 0],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          />

                          <motion.div
                            className="absolute inset-0 rounded-3xl"
                            style={{
                              background: "linear-gradient(45deg, transparent, rgba(16,185,129,0.5), transparent)",
                            }}
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />

                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
                            transition={{ duration: 0.6 }}
                          />

                          <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-20">
                            {Array.from({ length: 15 }).map((_, i: number) => (
                              <motion.div
                                key={i}
                                className="absolute text-emerald-300 font-mono text-xs"
                                style={{
                                  left: `${Math.random() * 100}%`,
                                  top: "-10px",
                                }}
                                animate={{
                                  y: [0, 80],
                                  opacity: [0, 1, 0],
                                }}
                                transition={{
                                  duration: Math.random() * 2 + 1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  delay: Math.random() * 3,
                                  ease: "linear",
                                }}
                              >
                                {Math.random() > 0.5 ? "1" : "0"}
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

            {/* Transition overlay */}
            {isTransitioning && (
              <motion.div
                className="absolute inset-0 z-30"
                style={{
                  background: `
                    radial-gradient(circle at 30% 20%, rgba(6, 78, 59, 0.8) 0%, transparent 50%),
                    radial-gradient(circle at 70% 80%, rgba(15, 118, 110, 0.6) 0%, transparent 50%),
                    linear-gradient(135deg, 
                      rgba(15, 23, 42, 0.95) 0%, 
                      rgba(6, 78, 59, 0.8) 25%, 
                      rgba(15, 118, 110, 0.7) 50%, 
                      rgba(6, 78, 59, 0.8) 75%, 
                      rgba(15, 23, 42, 0.95) 100%
                    )
                  `,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: prefersReducedMotion ? 0.3 : 0.8, 
                  ease: "easeOut" 
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage