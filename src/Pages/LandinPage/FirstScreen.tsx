"use client"

import { useState, useEffect, useCallback, useRef, useMemo, memo, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SplashCursor from "../../components/SplashCursor"
import LetterGlitch from "../../components/LetterGlitch"

// Mock responsive hooks - FIXED met alle benodigde properties
const useViewport = () => ({ 
  isTablet: false, 
  isMobile: false, 
  prefersReducedMotion: false 
})

const useResponsiveValue = (config: any) => {
  if (config && typeof config === 'object' && Object.values(config).every(v => typeof v === 'number')) {
    return Math.min(...Object.values(config).map(Number))
  }
  return config.lg || config.md || config.xs
}

// SessionManager inline gedefinieerd
class SessionManager {
  private static readonly SESSION_KEY = 'hack_session'
  private static readonly VISIT_COUNT_KEY = 'visit_count'
  private static readonly FIRST_VISIT_KEY = 'first_visit_time'
  private static readonly LAST_HACK_KEY = 'last_hack_completion'
  private static readonly HACK_SEEN_AFTER_COMPLETION_KEY = 'hack_seen_after_completion'
  private static readonly SESSION_DURATION = 30 * 60 * 1000 // 30 minuten
  
  static setSession(): void {
    const now = Date.now()
    const sessionData = {
      timestamp: now,
      hasCompletedHack: true,
      completionTime: now
    }
    
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
    sessionStorage.setItem(this.LAST_HACK_KEY, String(now))
    
    const visitCount = this.getVisitCount()
    sessionStorage.setItem(this.VISIT_COUNT_KEY, String(visitCount + 1))
    
    if (!sessionStorage.getItem(this.FIRST_VISIT_KEY)) {
      sessionStorage.setItem(this.FIRST_VISIT_KEY, String(now))
    }
    
    console.log('Session set:', { visitCount: visitCount + 1, timestamp: now })
  }
  
  static hasValidSession(): boolean {
    try {
      const data = sessionStorage.getItem(this.SESSION_KEY)
      if (!data) return false
      
      const session = JSON.parse(data)
      const now = Date.now()
      const sessionAge = now - session.timestamp
      
      const isValid = sessionAge < this.SESSION_DURATION && session.hasCompletedHack
      
      if (!isValid) {
        this.clearExpiredSession()
      }
      
      console.log('Session check:', { isValid, age: sessionAge, hasCompleted: session.hasCompletedHack })
      return isValid
    } catch (error) {
      console.warn('Session check error:', error)
      return false
    }
  }
  
  static shouldShowHackScreen(): boolean {
    const hasValidSession = this.hasValidSession()
    const hasSeenAfterCompletion = this.hasSeenHackAfterCompletion()
    
    console.log('Should show hack screen check:', {
      hasValidSession,
      hasSeenAfterCompletion,
      decision: !hasValidSession || !hasSeenAfterCompletion
    })
    
    return !hasValidSession || !hasSeenAfterCompletion
  }
  
  static shouldSkipHack(): boolean {
    return !this.shouldShowHackScreen()
  }
  
  static hasSeenHackAfterCompletion(): boolean {
    try {
      const seenFlag = sessionStorage.getItem(this.HACK_SEEN_AFTER_COMPLETION_KEY)
      const result = seenFlag === 'true'
      console.log('Has seen hack after completion:', result)
      return result
    } catch {
      return false
    }
  }
  
  static markHackSeenAfterCompletion(): void {
    sessionStorage.setItem(this.HACK_SEEN_AFTER_COMPLETION_KEY, 'true')
    console.log('✅ Marked hack as seen after completion - future refreshes will skip to Page2')
  }
  
  static isSecondHackCompletion(): boolean {
    const hasValidSession = this.hasValidSession()
    const hasSeenAfterCompletion = this.hasSeenHackAfterCompletion()
    
    return hasValidSession && !hasSeenAfterCompletion
  }
  
  static getVisitCount(): number {
    const count = sessionStorage.getItem(this.VISIT_COUNT_KEY)
    return count ? parseInt(count, 10) : 0
  }
  
  static incrementVisitCount(): number {
    const current = this.getVisitCount()
    const newCount = current + 1
    sessionStorage.setItem(this.VISIT_COUNT_KEY, String(newCount))
    console.log('Visit count incremented to:', newCount)
    return newCount
  }
  
  static clearExpiredSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY)
    console.log('Expired session cleared')
  }
  
  static clearAllSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY)
    sessionStorage.removeItem(this.VISIT_COUNT_KEY)
    sessionStorage.removeItem(this.FIRST_VISIT_KEY)
    sessionStorage.removeItem(this.LAST_HACK_KEY)
    sessionStorage.removeItem(this.HACK_SEEN_AFTER_COMPLETION_KEY)
    console.log('🧹 All session data cleared')
  }
  
  static resetForTesting(): void {
    this.clearAllSession()
    console.log('🔄 Resetting for testing...')
    setTimeout(() => window.location.reload(), 100)
  }
}

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


type ButtonState = "normal" | "expanded" | "glitch" | "access"

// Responsive configuration - OPTIMIZED
const RESPONSIVE_CONFIG = {
  particleCounts: {
    xs: 8, sm: 12, md: 16, lg: 20, xl: 25, '2xl': 30, '3xl': 35, '4xl': 40
  },
  animationSpeeds: {
    xs: 50, sm: 40, md: 30, lg: 25, xl: 20, '2xl': 18, '3xl': 15, '4xl': 12 // VEEL sneller
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
    },
    subtitle: {
      xs: 'text-sm', sm: 'text-base', md: 'text-lg', lg: 'text-xl',
      xl: 'text-2xl', '2xl': 'text-3xl', '3xl': 'text-4xl', '4xl': 'text-5xl'
    },
    button: {
      xs: 'text-sm', sm: 'text-base', md: 'text-lg', lg: 'text-xl',
      xl: 'text-xl', '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl'
    }
  },
  spacing: {
    xs: { container: 16, elements: 24 }, sm: { container: 20, elements: 32 },
    md: { container: 24, elements: 40 }, lg: { container: 32, elements: 48 },
    xl: { container: 40, elements: 56 }, '2xl': { container: 48, elements: 64 },
    '3xl': { container: 56, elements: 72 }, '4xl': { container: 64, elements: 80 }
  }
}

// SUPER FAST Animated Name Component - CURSOR INDEPENDENT
const AnimatedName = memo<AnimatedNameProps>(({ text, className = "" }) => {
  const [visibleLetters, setVisibleLetters] = useState<number>(0)
  const { prefersReducedMotion } = useViewport()
  const animationSpeed = useResponsiveValue(RESPONSIVE_CONFIG.animationSpeeds)
  const titleSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.title)
  
  // CURSOR INDEPENDENT TIMING - gebruik performance.now() voor constante snelheid
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const characters = useMemo(() => text.split(""), [text])

  useEffect(() => {
    const speed = prefersReducedMotion ? 10 : animationSpeed / 4 // 4x sneller!
    startTimeRef.current = performance.now()
    
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return
      
      const elapsed = currentTime - startTimeRef.current
      const expectedIndex = Math.floor(elapsed / speed)
      const newVisibleLetters = Math.min(expectedIndex, text.length)
      
      setVisibleLetters(newVisibleLetters)
      
      if (newVisibleLetters < text.length) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [text, animationSpeed, prefersReducedMotion])

  return (
    <motion.h1
      className={`${titleSize} font-bold tracking-tight ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.2, delay: 0 }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent inline-block"
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 20,
            scale: prefersReducedMotion ? 1 : 0.8,
          }}
          animate={
            index < visibleLetters
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
              : {}
          }
          transition={{
            duration: prefersReducedMotion ? 0.1 : 0.3,
            ease: "easeOut",
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
})

AnimatedName.displayName = 'AnimatedName'

// SUPER FAST Access Granted Component - CURSOR INDEPENDENT
const AccessGranted = memo<AccessGrantedProps>(({ onComplete }) => {
  const [displayText, setDisplayText] = useState<string>("")
  const accessText = "ACCESS GRANTED"
  const buttonTextSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.button)
  
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const speed = 20 // Super fast typing
    startTimeRef.current = performance.now()
    
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return
      
      const elapsed = currentTime - startTimeRef.current
      const expectedIndex = Math.floor(elapsed / speed)
      const newLength = Math.min(expectedIndex, accessText.length)
      
      setDisplayText(accessText.slice(0, newLength))
      
      if (newLength < accessText.length) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          onComplete?.()
        }, 300)
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
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
})

AccessGranted.displayName = 'AccessGranted'

// SUPER FAST Typing Text Component - CURSOR INDEPENDENT
const TypingText = memo<TypingTextProps>(({ 
  text, delay = 0, speed = 30, className = "", style = {} 
}) => {
  const [displayText, setDisplayText] = useState<string>("")
  const [showCursor, setShowCursor] = useState<boolean>(true)
  const { prefersReducedMotion } = useViewport()
  
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const actualSpeed = prefersReducedMotion ? speed / 5 : speed / 3 // Veel sneller
    
    const timeout = setTimeout(() => {
      startTimeRef.current = performance.now()
      
      const animate = (currentTime: number) => {
        if (!startTimeRef.current) return
        
        const elapsed = currentTime - startTimeRef.current
        const expectedIndex = Math.floor(elapsed / actualSpeed)
        const newLength = Math.min(expectedIndex, text.length)
        
        setDisplayText(text.slice(0, newLength))
        
        if (newLength < text.length) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          setShowCursor(false)
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [text, delay, speed, prefersReducedMotion])

  return (
    <span className={className} style={style}>
      {displayText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  )
})

TypingText.displayName = 'TypingText'

// OPTIMIZED Matrix Rain - CURSOR INDEPENDENT met automatische slowdown
const MatrixRain = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const isRunningRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isRunningRef.current) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    isRunningRef.current = true

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resizeCanvas, 100)
    }
    
    window.addEventListener("resize", handleResize, { passive: true })

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}",
      matrixArray = matrix.split("")
    const fontSize = 12
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    let lastTime = 0
    let speedPhase = 0 // Start met ultra fast
    const startTime = performance.now() // CURSOR INDEPENDENT start time

    // SNELLERE speed settings met AUTOMATISCHE SLOWDOWN
    const phaseSpeeds = [1, 3, 8, 20] // Ultra, super, fast, normal
// const phaseDurations = [200, 300, 2000, Infinity] // Niet gebruikt
    const phaseStartTimes = [0, 200, 500, 2500] // Absolute tijden vanaf start

    const draw = (currentTime: number) => {
      const elapsed = currentTime - startTime // CURSOR INDEPENDENT elapsed time
      
      // Automatische fase-switching gebaseerd op absolute tijd
      if (speedPhase === 0 && elapsed > phaseStartTimes[1]) {
        speedPhase = 1
      } else if (speedPhase === 1 && elapsed > phaseStartTimes[2]) {
        speedPhase = 2
      } else if (speedPhase === 2 && elapsed > phaseStartTimes[3]) {
        speedPhase = 3
      }

      if (currentTime - lastTime < phaseSpeeds[speedPhase]) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }
      lastTime = currentTime

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
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

      animationRef.current = requestAnimationFrame(draw)
    }

    // Start IMMEDIATELY
    animationRef.current = requestAnimationFrame(draw)

    return () => {
      isRunningRef.current = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-15 pointer-events-none" />
})

MatrixRain.displayName = 'MatrixRain'

// MAIN HOMEPAGE COMPONENT - ULTRA OPTIMIZED met CURSOR INDEPENDENT animaties
const HomePage: React.FC = () => {
  const [buttonState, setButtonState] = useState<ButtonState>("normal")
  const [buttonClicked, setButtonClicked] = useState<boolean>(false)
  const [showPage2, setShowPage2] = useState<boolean>(false)
  const [isPreloading, setIsPreloading] = useState<boolean>(false)

  const timersRef = useRef<NodeJS.Timeout[]>([])
  const Page2ComponentRef = useRef<React.ComponentType<any> | null>(null)
  const isUnmountedRef = useRef(false)

  // Responsive hooks
  const { isTablet, isMobile } = useViewport()
  const subtitleSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.subtitle)
  const buttonTextSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.button)
  const spacing = useResponsiveValue(RESPONSIVE_CONFIG.spacing)

  // IMMEDIATE INITIALIZATION met proper visit tracking
  useEffect(() => {
    isUnmountedRef.current = false
    
    const currentVisitCount = SessionManager.incrementVisitCount()
    const shouldSkip = SessionManager.shouldSkipHack()
    
    console.log('HomePage init:', {
      currentVisitCount,
      shouldSkip,
      hasValidSession: SessionManager.hasValidSession()
    })
    
    if (shouldSkip) {
      console.log('Skipping hack, going to Page2')
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        setShowPage2(true)
        document.body.style.overflow = "auto"
        document.body.style.height = "auto"
        document.documentElement.style.scrollBehavior = 'smooth'
        // Reset scroll position to prevent flash
        window.scrollTo(0, 0)
      })
      return
    }

    console.log('Setting up hack screen')
    document.body.style.backgroundColor = "#0f172a"
    document.body.style.overflow = "hidden"
    document.body.style.height = "100vh"

    return () => {
      isUnmountedRef.current = true
      timersRef.current.forEach(timer => clearTimeout(timer))
      if (!showPage2) {
        document.body.style.overflow = "auto"
        document.body.style.height = "auto"
      }
    }
  }, [showPage2])

  // IMMEDIATE Page2 preloading
  useEffect(() => {
    if (!Page2ComponentRef.current && !isUnmountedRef.current) {
      setIsPreloading(true)
      
      Promise.resolve()
        .then(() => import("../LandinPage/Page2"))
        .then(module => {
          if (!isUnmountedRef.current && module) {
            Page2ComponentRef.current = module.default
            setIsPreloading(false)
          }
        })
        .catch(error => {
          console.warn('Page2 preload error:', error)
          if (!isUnmountedRef.current) {
            Page2ComponentRef.current = () => (
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center text-emerald-200">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">Welcome to Page 2</h1>
                  <p>Your portfolio content would go here</p>
                </div>
              </div>
            )
            setIsPreloading(false)
          }
        })
    }
  }, [])

  // Button Click Handler - SUPER FAST
  const handleHackButtonClick = useCallback(() => {
    if (buttonClicked || isUnmountedRef.current) return
    setButtonClicked(true)
    setButtonState("expanded")

    const glitchDelay = 200
    const maxWait = 600

    const timer1 = setTimeout(() => {
      if (!isUnmountedRef.current) {
        setButtonState("glitch")
      }
    }, glitchDelay)
    timersRef.current.push(timer1)

    const timer2 = setTimeout(() => {
      if (!isUnmountedRef.current && buttonState === "expanded") {
        setButtonState("glitch")
      }
    }, maxWait)
    timersRef.current.push(timer2)
  }, [buttonClicked, buttonState])

  const handleGlitchComplete = useCallback(() => {
    if (!isUnmountedRef.current) {
      setButtonState("access")
    }
  }, [])

  const handleAccessComplete = useCallback(() => {
    if (isUnmountedRef.current) return
    
    const isSecondTime = SessionManager.isSecondHackCompletion()
    
    if (isSecondTime) {
      console.log('🎉 Second hack completion - marking as seen')
      SessionManager.markHackSeenAfterCompletion()
    }
    
    SessionManager.setSession()
    console.log('Access complete, navigating to Page2')
    
    // Use requestAnimationFrame to ensure smooth transition
    requestAnimationFrame(() => {
      setShowPage2(true)
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
      document.documentElement.style.scrollBehavior = 'smooth'
      // Reset scroll position for clean start
      window.scrollTo(0, 0)
    })
  }, [])

  // Button Dimensions
  const getButtonDimensions = useCallback(() => {
    const currentBreakpoint = isMobile ? 'xs' : isTablet ? 'md' : 'lg'
    const buttonConfig = RESPONSIVE_CONFIG.buttonSizes
    
    switch (buttonState) {
      case "expanded":
      case "glitch":
      case "access":
        return buttonConfig.expanded[currentBreakpoint] || buttonConfig.expanded.lg
      default:
        return buttonConfig.normal[currentBreakpoint] || buttonConfig.normal.lg
    }
  }, [buttonState, isTablet, isMobile])

  // Dynamic import for Page2
  const LazyPage2 = useMemo(() => {
    if (!showPage2) return null
    
    if (Page2ComponentRef.current) {
      const Component = Page2ComponentRef.current
      return <Component isVisible={true} />
    }
    
    const LazyComponent = memo(() => {
      const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
      
      useEffect(() => {
        Promise.resolve()
          .then(() => import("../LandinPage/Page2"))
          .then(module => {
            if (module) {
              setComponent(() => module.default)
            }
          })
          .catch(error => {
            console.error('Failed to load Page2:', error)
            setComponent(() => () => (
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center text-emerald-200">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">Welcome</h1>
                  <p>Portfolio content will be here</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            ))
          })
      }, [])
      
      return Component ? <Component isVisible={true} /> : (
        <div className="flex items-center justify-center min-h-screen text-emerald-200 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-200"></div>
        </div>
      )
    })
    
    return <LazyComponent />
  }, [showPage2])

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true
      timersRef.current.forEach(timer => clearTimeout(timer))
    }
  }, [])

  return (
    <div className={`relative min-h-screen bg-slate-900 ${!showPage2 ? 'hide-scrollbar' : ''}`}>
      {/* ISOLATED Splash Cursor - only when not on Page2 */}
      {!showPage2 && <IsolatedSplashCursor />}

      {/* Dark background */}
      <div className="fixed inset-0 bg-slate-900 z-0" />

      <AnimatePresence mode="wait">
        {showPage2 ? (
          <motion.div
            key="page2"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen text-emerald-200 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-200"></div>
              </div>
            }>
              {LazyPage2}
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="homepage"
            className="min-h-screen relative overflow-hidden z-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Background Elements - IMMEDIATE */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900" />
            <MatrixRain />

            {/* Main Content - IMMEDIATE */}
            <div
              className="relative z-20 flex flex-col items-center justify-center min-h-screen"
              style={{ padding: spacing.container }}
            >
              {/* Name - IMMEDIATE */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AnimatedName text="WISHANT BHAJAN" delay={0} />
              </motion.div>

              {/* Subtitle - IMMEDIATE */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`${subtitleSize} font-normal tracking-wide`}>
                  <TypingText
                    text="Full Stack Developer"
                    delay={300}
                    speed={30}
                    className="text-emerald-200/90 font-sans"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.08em",
                    }}
                  />
                </div>
              </motion.div>

              {/* Button - IMMEDIATE */}
              <motion.div
                className="text-center"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={handleHackButtonClick}
                  className={`relative overflow-hidden group bg-gradient-to-r from-emerald-500/30 via-teal-500/25 to-cyan-500/30 backdrop-blur-xl border-2 border-emerald-400/50 rounded-3xl font-bold transition-all duration-300 shadow-2xl ${buttonTextSize} px-8 py-4`}
                  animate={{
                    ...getButtonDimensions(),
                    scale: 1,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={!buttonClicked ? {
                    scale: 1.08, y: -8,
                    boxShadow: "0 20px 40px rgba(16,185,129,0.4)",
                    borderColor: "rgba(16,185,129,0.8)",
                  } : {}}
                  whileTap={!buttonClicked ? { scale: 0.96 } : {}}
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
                        initial={{ opacity: 0, scale: 0.9 }}
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
                          duration={1500}
                          glitchColors={["#10b981", "#06d6a0", "#118ab2", "#3b82f6", "#8b5cf6", "#f59e0b"]}
                          glitchSpeed={20}
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

                  {/* Button Effects - CURSOR INDEPENDENT met automatische vertraging */}
                  {buttonState === "normal" && (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-3xl"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.3, 0.6, 0.3],
                          rotate: [0, 0.3, -0.3, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />

                      <CursorIndependentDigitalRain />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator tijdens preloading */}
      {isPreloading && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-500/20 text-emerald-200 px-4 py-2 rounded-lg backdrop-blur-sm border border-emerald-500/30">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-200"></div>
            <span>Preparing experience...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// CURSOR INDEPENDENT Digital Rain voor button - VOLLEDIG GEÏSOLEERD
const CursorIndependentDigitalRain = memo(() => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    char: string;
    opacity: number;
    speed: number;
  }>>([])
  
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  // const startTimeRef = useRef<number>(performance.now()) // Niet meer nodig
  const lastFrameTimeRef = useRef<number>(0)
  const particlesRef = useRef<Array<any>>([])

  useEffect(() => {
    const chars = "10"
    
    // Initialiseer particles
    const initialParticles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      char: chars[Math.floor(Math.random() * chars.length)],
      opacity: 0,
      speed: Math.random() * 0.5 + 0.3,
    }))
    
    particlesRef.current = initialParticles
    setParticles([...initialParticles])

    const animate = (currentTime: number) => {
      // FRAME RATE LIMITING - 30fps voor button particles
      if (currentTime - lastFrameTimeRef.current < 33.33) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = currentTime

      // const elapsed = currentTime - startTimeRef.current // Niet meer nodig
      
      // ALTIJD SNELLE ANIMATIE VOOR BUTTON-CIJFERS
      let currentSpeed: number = 2.0 // Altijd snel, geen vertraging
      
      // Update particles met STABIELE timing
      particlesRef.current = particlesRef.current.map(particle => {
        let newY = particle.y + (particle.speed * currentSpeed * 2) // Normalized movement
        let newOpacity = particle.opacity
        
        if (newY < 20) {
          newOpacity = Math.min(1, particle.opacity + 0.03)
        } else if (newY > 80) {
          newOpacity = Math.max(0, particle.opacity - 0.03)
        } else {
          newOpacity = 1
        }
        
        // Reset particle als het beneden verdwijnt
        if (newY > 110) {
          return {
            ...particle,
            x: Math.random() * 100,
            y: -10,
            char: chars[Math.floor(Math.random() * chars.length)],
            opacity: 0,
            speed: Math.random() * 0.5 + 0.3,
          }
        }
        
        return {
          ...particle,
          y: newY,
          opacity: newOpacity,
        }
      })
      
      setParticles([...particlesRef.current])
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    // Start IMMEDIATE met een kleine delay voor betere performance
    const startTimer = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate)
    }, 100)
    
    return () => {
      clearTimeout(startTimer)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden rounded-3xl opacity-25 pointer-events-none"
      style={{
        contain: 'layout style', // PERFORMANCE: Contain rendering
        willChange: 'auto', // Don't force unnecessary GPU layers
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-emerald-300 font-mono text-xs"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            transform: 'translateX(-50%) translateZ(0)', // GPU acceleration only when needed
            transition: 'none', // CRITICAL: No CSS transitions
          }}
        >
          {particle.char}
        </div>
      ))}
    </div>
  )
})

CursorIndependentDigitalRain.displayName = 'CursorIndependentDigitalRain'

// ISOLATE SplashCursor component rendering with React.memo and shouldComponentUpdate logic
const IsolatedSplashCursor = memo(() => {
  return <SplashCursor />
}, () => true) // IMPORTANT: Always prevent re-renders

IsolatedSplashCursor.displayName = 'IsolatedSplashCursor'

export default HomePage