"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, Transition } from "framer-motion"
import { useViewport } from "../utils/responsive"

// BlurText Component
type BlurTextProps = {
  text?: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: Record<string, any>
  animationTo?: Array<Record<string, any>>
  easing?: (t: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
}

const buildKeyframes = (
  from: Record<string, any>,
  steps: Array<Record<string, any>>
): Record<string, any[]> => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ])
  const keyframes: Record<string, any[]> = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current as Element)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  )

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5,
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction]
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo
  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  )

  return (
    <div ref={ref} className={className}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)
        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
        }
        ;(spanTransition as any).ease = easing

        return (
          <motion.span
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            className="inline-block"
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        )
      })}
    </div>
  )
}

// Navbar Component
interface NavbarProps {
  activeSection?: string
  onSectionClick?: (sectionId: string) => void
}

interface NavItem {
  id: string
  label: string
  href: string
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "Over Mij", href: "#about" },
  { id: "portfolio", label: "Portfolio", href: "#portfolio" },
  { id: "services", label: "Services", href: "#services" },
  { id: "contact", label: "Contact", href: "#contact" },
]

const Navbar: React.FC<NavbarProps> = ({ activeSection = "home", onSectionClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Remove unused destructured values from useViewport
  useViewport()

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle navigation click
  const handleNavClick = (item: NavItem) => {
    setIsMobileMenuOpen(false)
    
    if (onSectionClick) {
      onSectionClick(item.id)
    }
    
    // Smooth scroll to section
    const element = document.getElementById(item.id)
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      })
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-slate-900/95 backdrop-blur-md border-b border-emerald-500/20 shadow-lg" 
          : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo/Brand with BlurText */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <BlurText
              text="Wishant Bhajan"
              delay={200}
              animateBy="letters"
              direction="top"
              className="text-2xl md:text-3xl font-bold text-blue-400 cursor-pointer"
              stepDuration={0.45}
              threshold={0}
              animationFrom={{ filter: 'blur(15px)', opacity: 0, y: -30, textShadow: '0 0 0px #3b82f6' }}
              animationTo={[
                { filter: 'blur(8px)', opacity: 0.3, y: -10, textShadow: '0 0 5px #3b82f6' },
                { filter: 'blur(3px)', opacity: 0.7, y: -3, textShadow: '0 0 8px #3b82f6' },
                { filter: 'blur(0px)', opacity: 1, y: 0, textShadow: '0 0 10px #3b82f6, 0 0 15px #3b82f6' }
              ]}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`relative px-4 py-2 font-medium tracking-wide transition-all duration-300 group ${
                  activeSection === item.id 
                    ? "text-emerald-200" 
                    : "text-emerald-200/80 hover:text-emerald-200"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                
                {/* Active indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: activeSection === item.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Hover effect */}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400/50 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: activeSection === item.id ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-emerald-400/10 rounded-lg -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.span
              className="w-6 h-0.5 bg-emerald-200 block transition-all duration-300"
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 1 : -3,
              }}
            />
            <motion.span
              className="w-6 h-0.5 bg-emerald-200 block transition-all duration-300"
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <motion.span
              className="w-6 h-0.5 bg-emerald-200 block transition-all duration-300"
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -1 : 3,
              }}
            />
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className="md:hidden overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-2 border-t border-emerald-500/20 mt-4">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium tracking-wide transition-all duration-300 ${
                  activeSection === item.id 
                    ? "text-emerald-200 bg-emerald-500/20" 
                    : "text-emerald-200/80 hover:text-emerald-200 hover:bg-emerald-500/10"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isMobileMenuOpen ? 1 : 0,
                  x: isMobileMenuOpen ? 0 : -20
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: isMobileMenuOpen ? index * 0.1 : 0 
                }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background blur overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm -z-10 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </motion.nav>
  )
}

export default Navbar