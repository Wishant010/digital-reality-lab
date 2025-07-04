"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SplashCursor from "../../components/SplashCursor"
import LetterGlitch from "../../components/LetterGlitch"
import Page2 from "../LandinPage/Page2"
import { useViewport, useResponsiveValue } from "../../utils/responsive"
import type { ResponsiveValue } from "../../utils/responsive"

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

type ButtonState = "normal" | "expanded" | "glitch" | "access"

// Responsive configuration
const RESPONSIVE_CONFIG = {
  particleCounts: {
    xs: 15, sm: 20, md: 25, lg: 30, xl: 35, '2xl': 40, '3xl': 45, '4xl': 50
  },
  animationSpeeds: {
    xs: 120, sm: 100, md: 90, lg: 80, xl: 70, '2xl': 60, '3xl': 50, '4xl': 40
  },
  buttonSizes: {
    normal: {
      xs: { width: '280px', height: '50px' }, sm: { width: '320px', height: '55px' },
      md: { width: '360px', height: '60px' }, lg: { width: '400px', height: '60px' },
      xl: { width: '420px', height: '65px' }, '2xl': { width: '450px', height: '70px' },
      '3xl': { width: '480px', height: '75px' }, '4xl': { width: '520px', height: '80px' }
    },
    expanded: {
      xs: { width: '300px', height: '120px' }, sm: { width: '380px', height: '140px' },
      md: { width: '450px', height: '160px' }, lg: { width: '550px', height: '220px' },
      xl: { width: '600px', height: '240px' }, '2xl': { width: '650px', height: '260px' },
      '3xl': { width: '700px', height: '280px' }, '4xl': { width: '750px', height: '300px' }
    }
  },
  textSizes: {
    title: {
      xs: 'text-3xl', sm: 'text-4xl', md: 'text-5xl', lg: 'text-6xl',
      xl: 'text-7xl', '2xl': 'text-8xl', '3xl': 'text-9xl', '4xl': 'text-[8rem]'
    } as ResponsiveValue<string>,
    subtitle: {
      xs: 'text-sm', sm: 'text-base', md: 'text-lg', lg: 'text-xl',
      xl: 'text-2xl', '2xl': 'text-3xl', '3xl': 'text-4xl', '4xl': 'text-5xl'
    } as ResponsiveValue<string>,
    button: {
      xs: 'text-sm', sm: 'text-base', md: 'text-lg', lg: 'text-xl',
      xl: 'text-xl', '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl'
    } as ResponsiveValue<string>
  },
  spacing: {
    xs: { container: 16, elements: 24 }, sm: { container: 20, elements: 32 },
    md: { container: 24, elements: 40 }, lg: { container: 32, elements: 48 },
    xl: { container: 40, elements: 56 }, '2xl': { container: 48, elements: 64 },
    '3xl': { container: 56, elements: 72 }, '4xl': { container: 64, elements: 80 }
  }
}

// Animated Name Component
const AnimatedName: React.FC<AnimatedNameProps> = ({ text, delay = 0, className = "" }) => {
  const [visibleLetters, setVisibleLetters] = useState<number>(0)
  // Fix: get prefersReducedMotion directly in the function body
  const prefersReducedMotion = useViewport()?.prefersReducedMotion;
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
      transition={{ duration: prefersReducedMotion ? 0.3 : 0.5, delay: prefersReducedMotion ? 0 : delay }}
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

// Simple Access Granted Component
const AccessGranted: React.FC<AccessGrantedProps> = ({ onComplete }) => {
  const [displayText, setDisplayText] = useState<string>("")
  const accessText = "ACCESS GRANTED"
  // Removed unused prefersReducedMotion
  const buttonTextSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.button)

  useEffect(() => {
    let index = 0
    const speed = 60

    const interval = setInterval(() => {
      if (index <= accessText.length) {
        setDisplayText(accessText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onComplete?.()
        }, 1000)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="flex items-center justify-center w-full h-full bg-black/70 backdrop-blur-sm rounded-3xl border border-blue-500/30">
      <div className={`font-mono ${buttonTextSize} font-bold text-center`}>
        <span
          className="text-blue-400"
          style={{
            textShadow: "0 0 10px #3b82f6, 0 0 20px #3b82f6",
          }}
        >
          {displayText}
          <span className="inline-block w-0.5 h-6 bg-blue-400 ml-1 animate-pulse" />
        </span>
      </div>
    </div>
  )
}

// Typing Text Component
const TypingText: React.FC<TypingTextProps> = ({ 
  text, delay = 0, speed = 50, className = "", style = {} 
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
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  )
}

// Simple Matrix Rain
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

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />
}

// Simple Particle Field
const ParticleField: React.FC<ParticleFieldProps> = ({ isActive = true }) => {
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
            isActive
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
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// MAIN HOMEPAGE COMPONENT
const HomePage: React.FC = () => {
  const [showAllContent, setShowAllContent] = useState<boolean>(false)
  const [buttonState, setButtonState] = useState<ButtonState>("normal")
  const [buttonClicked, setButtonClicked] = useState<boolean>(false)
  const [showPage2, setShowPage2] = useState<boolean>(false)

  const timersRef = useRef<NodeJS.Timeout[]>([])

  // Responsive hooks
  const { isTablet } = useViewport()
  const subtitleSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.subtitle)
  const buttonTextSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.button)
  const spacing = useResponsiveValue(RESPONSIVE_CONFIG.spacing)

  // Initialize
  useEffect(() => {
    document.body.style.backgroundColor = "#0f172a"
    document.body.style.overflow = "hidden"
    document.body.style.height = "100vh"

    const contentTimer = setTimeout(() => {
      setShowAllContent(true)
    }, 500)
    timersRef.current.push(contentTimer)

    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer))
      document.body.style.overflow = "unset"
      document.body.style.height = "auto"
    }
  }, [])

  // Button Click Handler
  const handleHackButtonClick = useCallback(() => {
    if (buttonClicked) return
    setButtonClicked(true)
    setButtonState("expanded")

    const timer1 = setTimeout(() => setButtonState("glitch"), 800)
    timersRef.current.push(timer1)
  }, [buttonClicked])

  // Glitch Complete Handler
  const handleGlitchComplete = useCallback(() => {
    setButtonState("access")
  }, [])

  // Access Complete Handler
  const handleAccessComplete = useCallback(() => {
    // Direct naar Page2 na ACCESS GRANTED
    const timer = setTimeout(() => {
      setShowPage2(true)
      document.body.style.overflow = "unset"
      document.body.style.height = "auto"
    }, 500)
    timersRef.current.push(timer)
  }, [])

  // Button Dimensions
  const getButtonDimensions = () => {
    const currentBreakpoint = isTablet ? 'md' : 'lg'
    const buttonConfig = RESPONSIVE_CONFIG.buttonSizes
    
    switch (buttonState) {
      case "expanded":
      case "glitch":
      case "access":
        return buttonConfig.expanded[currentBreakpoint] || buttonConfig.expanded.lg
      default:
        return buttonConfig.normal[currentBreakpoint] || buttonConfig.normal.lg
    }
  }

  const getButtonScale = () => {
    switch (buttonState) {
      case "expanded":
      case "glitch":
      case "access":
        return 1
      default:
        return 1
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-900">
      {/* Splash Cursor */}
      {!showPage2 && <SplashCursor />}

      {/* Dark background */}
      <div className="fixed inset-0 bg-slate-900 z-0" />

      <AnimatePresence mode="wait">
        {showPage2 ? (
          <motion.div
            key="page2"
            className="relative z-10"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <Page2 isVisible={true} />
          </motion.div>
        ) : (
          <motion.div
            key="homepage"
            className="min-h-screen relative overflow-hidden z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900" />
            <MatrixRain />
            {!isTablet && <ParticleField isActive={true} />}

            {/* Main Content */}
            <div
              className="relative z-20 flex flex-col items-center justify-center min-h-screen"
              style={{ padding: spacing.container }}
            >
              {showAllContent && (
                <>
                  {/* Name */}
                  <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <AnimatedName text="WISHANT BHAJAN" delay={0} />
                  </motion.div>

                  {/* Subtitle */}
                  <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className={`${subtitleSize} font-normal tracking-wide`}>
                      <TypingText
                        text="Full Stack Developer"
                        delay={1200}
                        speed={100}
                        className="text-emerald-200/90 font-sans"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400,
                          letterSpacing: "0.08em",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Button */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                  >
                    <motion.button
                      onClick={handleHackButtonClick}
                      className={`relative overflow-hidden group bg-gradient-to-r from-emerald-500/30 via-teal-500/25 to-cyan-500/30 backdrop-blur-xl border-2 border-emerald-400/50 rounded-3xl font-bold transition-all duration-500 shadow-2xl ${buttonTextSize} px-8 py-4`}
                      animate={{
                        ...getButtonDimensions(),
                        scale: getButtonScale(),
                      }}
                      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                      whileHover={!buttonClicked ? {
                        scale: 1.1, y: -10,
                        boxShadow: "0 25px 50px rgba(16,185,129,0.4)",
                        borderColor: "rgba(16,185,129,0.8)",
                      } : {}}
                      whileTap={!buttonClicked ? { scale: 0.95 } : {}}
                      disabled={buttonClicked}
                    >
                      <AnimatePresence mode="wait">
                        {buttonState === "normal" && (
                          <motion.div
                            key="normal"
                            className="relative z-10 flex items-center justify-center w-full h-full"
                            exit={{ opacity: 0 }}
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
                          >
                            <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent font-bold tracking-wide">
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
                          >
                            <AccessGranted onComplete={handleAccessComplete} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Button Effects */}
                      {buttonState === "normal" && (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage