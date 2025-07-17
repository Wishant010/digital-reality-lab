"use client"

import { useState, useEffect, useCallback, useRef, useMemo, memo, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SplashCursor from "../components/SplashCursor"
import LetterGlitch from "../components/LetterGlitch"
import { useViewport, useResponsiveValue } from "../utils/responsive"
import type { ResponsiveValue } from "../utils/responsive"

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
  
  static getDebugInfo(): object {
    const debugInfo = {
      shouldShowHackScreen: this.shouldShowHackScreen(),
      shouldSkipHack: this.shouldSkipHack(),
      hasValidSession: this.hasValidSession(),
      hasSeenHackAfterCompletion: this.hasSeenHackAfterCompletion(),
      isSecondHackCompletion: this.isSecondHackCompletion(),
      visitCount: this.getVisitCount(),
      sessionData: this.getSessionData(),
      lastHack: sessionStorage.getItem(this.LAST_HACK_KEY),
      hackSeenFlag: sessionStorage.getItem(this.HACK_SEEN_AFTER_COMPLETION_KEY),
      visitCountRaw: sessionStorage.getItem(this.VISIT_COUNT_KEY),
      sessionAge: this.getSessionAge(),
      isBrowserSessionFresh: this.isBrowserSessionFresh()
    }
    
    console.log('🐛 SessionManager Debug Info:')
    console.table(debugInfo)
    return debugInfo
  }
  
  static isBrowserSessionFresh(): boolean {
    return !sessionStorage.getItem(this.FIRST_VISIT_KEY)
  }
  
  static getFlowSummary(): string {
    const hasSession = this.hasValidSession()
    const hasSeen = this.hasSeenHackAfterCompletion()
    const isFresh = this.isBrowserSessionFresh()
    
    if (isFresh) {
      return "🆕 Fresh browser session - will show hack screen"
    }
    
    if (!hasSession) {
      return "🔄 No session in this browser tab - will show hack screen"
    }
    
    if (hasSession && !hasSeen) {
      return "🔄 First refresh after completion - will show hack screen again"
    }
    
    if (hasSession && hasSeen) {
      return "⏭️ Multiple refreshes in this session - will skip to Page2"
    }
    
    return "❓ Unknown state"
  }
  
  private static getSessionAge(): number | null {
    try {
      const data = sessionStorage.getItem(this.SESSION_KEY)
      if (!data) return null
      
      const session = JSON.parse(data)
      const now = Date.now()
      return now - session.timestamp
    } catch {
      return null
    }
  }
  
  private static getSessionData(): object | null {
    try {
      const data = sessionStorage.getItem(this.SESSION_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }
}

// Lazy load Page2 for better performance

// Page2Preloader removed (unused and dynamic import removed)

// Page2Preloader removed

// Type definitions
interface AccessGrantedProps {
  onComplete?: () => void
}

interface TypingTextProps {
  text: string
  speed?: number
  className?: string
  style?: React.CSSProperties
}

interface AnimatedNameProps {
  text: string
  className?: string
}

interface ParticleFieldProps {
  isActive?: boolean
}

type ButtonState = "normal" | "expanded" | "glitch" | "access"

// Responsive configuration - OPTIMIZED
const RESPONSIVE_CONFIG = {
  particleCounts: {
    xs: 8, sm: 12, md: 16, lg: 20, xl: 25, '2xl': 30, '3xl': 35, '4xl': 40
  },
  animationSpeeds: {
    xs: 100, sm: 80, md: 60, lg: 50, xl: 40, '2xl': 35, '3xl': 30, '4xl': 25 // VEEL sneller
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

// SUPER FAST Animated Name Component
const AnimatedName = memo<AnimatedNameProps>(({ text, className = "" }) => {
  const [visibleLetters, setVisibleLetters] = useState<number>(0)
  const { prefersReducedMotion } = useViewport()
  const animationSpeed = useResponsiveValue(RESPONSIVE_CONFIG.animationSpeeds)
  const titleSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.title)

  const characters = useMemo(() => text.split(""), [text])

  useEffect(() => {
    // IMMEDIATE START - geen delay meer voor eerste load
    const speed = prefersReducedMotion ? 10 : animationSpeed / 4 // 4x sneller!
    
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setVisibleLetters(currentIndex + 1)
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, speed)
    
    return () => clearInterval(interval)
  }, [text, animationSpeed, prefersReducedMotion])

  return (
    <motion.h1
      className={`${titleSize} font-bold tracking-tight ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.2, delay: 0 }} // Geen delay meer
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
            duration: prefersReducedMotion ? 0.1 : 0.3, // Snellere transitions
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

// SUPER FAST Access Granted Component
const AccessGranted = memo<AccessGrantedProps>(({ onComplete }) => {
  const [displayText, setDisplayText] = useState<string>("")
  const accessText = "ACCESS GRANTED"
  const buttonTextSize = useResponsiveValue(RESPONSIVE_CONFIG.textSizes.button)

  useEffect(() => {
    let index = 0
    const speed = 20 // Super fast typing

    const interval = setInterval(() => {
      if (index <= accessText.length) {
        setDisplayText(accessText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onComplete?.()
        }, 300) // Snellere completion
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
})

AccessGranted.displayName = 'AccessGranted'

// SUPER FAST Typing Text Component
const TypingText = memo<TypingTextProps>(({ 
  text, speed = 30, className = "", style = {} 
}) => {
  const [displayText, setDisplayText] = useState<string>("")
  const [showCursor, setShowCursor] = useState<boolean>(true)
  const { prefersReducedMotion } = useViewport()

  useEffect(() => {
    const actualSpeed = prefersReducedMotion ? speed / 5 : speed / 3 // Veel sneller
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
  }, [text, speed, prefersReducedMotion])

  return (
    <span className={className} style={style}>
      {displayText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  )
})

TypingText.displayName = 'TypingText'

// OPTIMIZED Matrix Rain met ultra snelle start fase
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
    let phaseStart = performance.now()

    // SNELLERE speed settings
    const phaseSpeeds = [1, 3, 8, 20] // Ultra, super, fast, normal
    const phaseDurations = [200, 300, 2000, Infinity] // Kortere fases

    const draw = (currentTime: number) => {
      const elapsed = currentTime - phaseStart
      if (speedPhase === 0 && elapsed > phaseDurations[0]) {
        speedPhase = 1
        phaseStart = currentTime
      } else if (speedPhase === 1 && elapsed > phaseDurations[1]) {
        speedPhase = 2
        phaseStart = currentTime
      } else if (speedPhase === 2 && elapsed > phaseDurations[2]) {
        speedPhase = 3
        phaseStart = currentTime
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

// OPTIMIZED Particle Field
const ParticleField = memo<ParticleFieldProps>(({ isActive = true }) => {
  const particleCount = useResponsiveValue(RESPONSIVE_CONFIG.particleCounts)
  
  const particles = useMemo(() => 
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animateX: Math.random() * 150 - 75,
      animateY: Math.random() * 150 - 75,
      duration: Math.random() * 2 + 1, // Snellere beweging
      delay: Math.random() * 0.5 // Kortere delay
    }))
  , [particleCount])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-emerald-400/25 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            x: [0, particle.animateX],
            y: [0, particle.animateY],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
})

ParticleField.displayName = 'ParticleField'

// MAIN HOMEPAGE COMPONENT - ULTRA OPTIMIZED
const HomePage: React.FC = () => {
  // Removed unused showAllContent
  const [buttonState, setButtonState] = useState<ButtonState>("normal")
  const [buttonClicked, setButtonClicked] = useState<boolean>(false)
  const [showPage2, setShowPage2] = useState<boolean>(false)
  // const [isPreloading, setIsPreloading] = useState<boolean>(false)
  // Removed unused isInitialLoad

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
    
    // Increment visit count bij elke page load
    const currentVisitCount = SessionManager.incrementVisitCount()
    
    // Check if we should skip
    const shouldSkip = SessionManager.shouldSkipHack()
    
    // Debug logging
    console.log('HomePage init:', {
      currentVisitCount,
      shouldSkip,
      hasValidSession: SessionManager.hasValidSession(),
      debugInfo: SessionManager.getDebugInfo()
    })
    
    if (shouldSkip) {
      // Skip directly to Page2
      console.log('Skipping hack, going to Page2')
      setShowPage2(true)
      document.body.style.overflow = "unset"
      document.body.style.height = "auto"
      document.documentElement.style.scrollBehavior = 'smooth'
      return
    }

    // IMMEDIATE setup voor hack screen
    console.log('Setting up hack screen')
    document.body.style.backgroundColor = "#0f172a"
    document.body.style.overflow = "hidden"
    document.body.style.height = "100vh"

  // IMMEDIATE content show - geen delay meer!
  // (showAllContent and isInitialLoad removed)

    return () => {
      isUnmountedRef.current = true
      timersRef.current.forEach(timer => clearTimeout(timer))
      if (!showPage2) {
        document.body.style.overflow = "unset"
        document.body.style.height = "auto"
      }
    }
  }, [showPage2])

  // IMMEDIATE Page2 preloading
  useEffect(() => {
    // Removed dynamic import to Page2 here to avoid module not found error
    // If preloading is needed, ensure the path is correct and Page2 exists
    // (No-op for now)
  }, [])

  // Button Click Handler - SUPER FAST
  const handleHackButtonClick = useCallback(() => {
    if (buttonClicked || isUnmountedRef.current) return
    setButtonClicked(true)
    setButtonState("expanded")

    const glitchDelay = 200 // Super snel
    const maxWait = 600 // Kortere fallback

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

  // Glitch Complete Handler
  const handleGlitchComplete = useCallback(() => {
    if (!isUnmountedRef.current) {
      setButtonState("access")
    }
  }, [])

  // Access Complete Handler - BELANGRIJKE LOGICA HIER
  const handleAccessComplete = useCallback(() => {
    if (isUnmountedRef.current) return
    
    // Check of dit de tweede keer is dat de hack wordt gecompleted
    const isSecondTime = SessionManager.isSecondHackCompletion()
    
    if (isSecondTime) {
      console.log('🎉 Second hack completion - marking as seen')
      SessionManager.markHackSeenAfterCompletion()
    }
    
    // Update session 
    SessionManager.setSession()
    
    console.log('Access complete, navigating to Page2')
    
    // IMMEDIATE navigation
    setShowPage2(true)
    document.body.style.overflow = "unset"
    document.body.style.height = "auto"
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])
  
  // Check for Page2 refresh behavior - VERWIJDERD want dit zorgde voor conflict

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
    
    // Fallback lazy loading
    const LazyComponent = memo(() => {
      const [Component] = useState<React.ComponentType<any> | null>(null)
      
      useEffect(() => {
        // Removed dynamic import to Page2 here to avoid module not found error
        // (No-op for now)
      }, [])
      
      return Component ? <Component isVisible={true} /> : (
        <div className="flex items-center justify-center min-h-screen text-emerald-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-200"></div>
        </div>
      )
    })
    
    return <LazyComponent />
  }, [showPage2])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true
      timersRef.current.forEach(timer => clearTimeout(timer))
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-slate-900 hide-scrollbar">
      {/* Splash Cursor - only when not on Page2 */}
      {!showPage2 && <SplashCursor />}

      {/* Dark background */}
      <div className="fixed inset-0 bg-slate-900 z-0" />

      {/* IMMEDIATE preloader */}
      {/* Page2Preloader removed */}

      <AnimatePresence mode="wait">
        {showPage2 ? (
          <motion.div
            key="page2"
            className="relative z-10 hide-scrollbar"
            initial={{ opacity: 1 }} // GEEN flicker - start direct visible
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }} // Geen transition voor immediate loading
          >
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen text-emerald-200">
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
            initial={{ opacity: 1 }} // GEEN flicker - start direct visible
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Background Elements - IMMEDIATE */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900" />
            <MatrixRain />
            {!isMobile && !isTablet && <ParticleField isActive={!showPage2} />}

            {/* Main Content - IMMEDIATE */}
            <div
              className="relative z-20 flex flex-col items-center justify-center min-h-screen"
              style={{ padding: spacing.container }}
            >
              {/* IMMEDIATE content - geen conditionele render meer */}
              <>
                {/* Name - IMMEDIATE */}
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 1, y: 0 }} // IMMEDIATE
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AnimatedName text="WISHANT BHAJAN" />
                </motion.div>

                {/* Subtitle - IMMEDIATE */}
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 1, y: 0 }} // IMMEDIATE
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`${subtitleSize} font-normal tracking-wide`}>
                    <TypingText
                      text="Full Stack Developer"
                      speed={30} // Super snel
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
                  initial={{ opacity: 1, y: 0 }} // IMMEDIATE
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
                            duration={1500} // Super snel: 1.5 seconden
                            glitchColors={["#10b981", "#06d6a0", "#118ab2", "#3b82f6", "#8b5cf6", "#f59e0b"]}
                            glitchSpeed={20} // Snellere glitch
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

                    {/* Button Effects - OPTIMIZED voor snelheid */}
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
                            duration: 1.5, // Sneller
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />

                        <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-25">
                          {Array.from({ length: 6 }).map((_, i) => ( // Minder particles
                            <motion.div
                              key={i}
                              className="absolute text-emerald-300 font-mono text-xs"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: "-10px",
                              }}
                              animate={{
                                y: [0, 60],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: Math.random() * 1 + 0.8, // SUPER snel: 0.8-1.8 sec
                                repeat: Number.POSITIVE_INFINITY,
                                delay: Math.random() * 1,
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator tijdens preloading */}
      {/* isPreloading removed */}
    </div>
  )
}

export default HomePage