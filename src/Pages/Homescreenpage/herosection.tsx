"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface HeroSectionProps {
  isVisible?: boolean
}

interface AnimatedNameProps {
  text: string
  delay?: number
  className?: string
}

// Letter-by-letter animated name component
const AnimatedName: React.FC<AnimatedNameProps> = ({ text, delay = 0, className = "" }) => {
  const [visibleLetters, setVisibleLetters] = useState<number>(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleLetters((prev) => {
          if (prev < text.length) {
            return prev + 1
          } else {
            clearInterval(interval)
            return prev
          }
        })
      }, 80) // Speed between letters

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, delay])

  return (
    <motion.h1
      className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent inline-block"
          initial={{
            opacity: 0,
            y: 50,
            scale: 0.3,
            filter: "blur(5px)",
            rotateX: -90,
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
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
            type: "spring",
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

const HeroSection: React.FC<HeroSectionProps> = ({ isVisible = true }) => {
  const [showName, setShowName] = useState<boolean>(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowName(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setShowName(false)
      return undefined;
    }
  }, [isVisible])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-emerald-500/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              x: isVisible ? 0 : -50 
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {showName && <AnimatedName text="WISHANT BHAJAN" delay={0} className="!text-2xl md:!text-3xl !mb-0" />}
          </motion.div>

          <motion.div
            className="flex space-x-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              x: isVisible ? 0 : 50 
            }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {["Portfolio", "About", "Skills", "Contact"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-emerald-200/80 hover:text-emerald-200 font-medium tracking-wide transition-colors duration-300 relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0, 
                  y: isVisible ? 0 : -20 
                }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                {item}
                <motion.div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        className="pt-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 50
            }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-emerald-100 mb-6 md:mb-8"
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{
                y: isVisible ? 0 : 100,
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.9
              }}
              transition={{
                delay: isVisible ? 1.2 : 0,
                duration: 1.2,
                ease: [0.23, 1, 0.32, 1]
              }}
            >
              Welkom in mijn
            </motion.h2>
            
            <motion.h1
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-8"
              animate={
                isVisible ? {
                  textShadow: [
                    "0 0 20px rgba(16,185,129,0.5)",
                    "0 0 40px rgba(16,185,129,0.8)",
                    "0 0 20px rgba(16,185,129,0.5)",
                  ],
                } : {}
              }
              transition={{
                duration: 3,
                repeat: isVisible ? Number.POSITIVE_INFINITY : 0,
                ease: "easeInOut",
              }}
            >
              Digitale Wereld
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl text-emerald-200/80 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 80, opacity: 0, scale: 0.95 }}
              animate={{
                y: isVisible ? 0 : 80,
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.95
              }}
              transition={{
                delay: isVisible ? 1.6 : 0,
                duration: 1.0,
                ease: [0.23, 1, 0.32, 1]
              }}
            >
              Hier deel ik mijn passie voor technologie, innovatie en het creëren van digitale ervaringen die het verschil maken.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default HeroSection
