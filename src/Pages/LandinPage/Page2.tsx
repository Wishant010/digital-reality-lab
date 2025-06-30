"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface AnimatedNameProps {
  text: string
  delay?: number
  className?: string
}

interface ParticleFieldProps {
  isActive?: boolean
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
            filter: "blur(10px)",
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

// ParticleField Component
const ParticleField: React.FC<ParticleFieldProps> = ({ isActive = true }) => {
  const particleCount = 50

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

// Page2 Component
const Page2: React.FC = () => {
  const [showName, setShowName] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowName(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navbar */}
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
            {showName && <AnimatedName text="WISHANT BHAJAN" delay={0} className="!text-2xl md:!text-3xl !mb-0" />}
          </motion.div>

          <motion.div
            className="flex space-x-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {["Portfolio", "About", "Skills", "Contact"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-emerald-200/80 hover:text-emerald-200 font-medium tracking-wide transition-colors duration-300 relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                {item}
                <motion.div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.nav>

      {/* Main content */}
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
            <h2 className="text-4xl md:text-6xl font-bold text-emerald-200 mb-6">Welcome to my</h2>
            <motion.h1
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-8"
              animate={{
                textShadow: [
                  "0 0 20px rgba(16,185,129,0.5)",
                  "0 0 40px rgba(16,185,129,0.8)",
                  "0 0 20px rgba(16,185,129,0.5)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
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
            {["Projects", "Skills", "Experience"].map((section, index) => (
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
  )
}

export default Page2
