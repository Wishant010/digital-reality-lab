"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Page2Props {
  isVisible?: boolean
}

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

// Page2 Component - Fully integrated with ContentSection content
const Page2: React.FC<Page2Props> = ({ isVisible = true }) => {
  const [showName, setShowName] = useState<boolean>(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowName(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      // If not visible, reset showName or do nothing
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

      {/* Main content */}
      <motion.div
        className="pt-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Enhanced with ContentSection content */}
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

          {/* Skills Grid - Enhanced with ContentSection content */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-16"
            initial={{ y: 120, opacity: 0, scale: 0.9 }}
            animate={{
              y: isVisible ? 0 : 120,
              opacity: isVisible ? 1 : 0,
              scale: isVisible ? 1 : 0.9
            }}
            transition={{
              delay: isVisible ? 2.0 : 0,
              duration: 1.2,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            {[
              { title: 'Frontend Development', desc: 'React, TypeScript, Next.js' },
              { title: 'Backend Development', desc: 'Node.js, Python, Databases' },
              { title: 'UI/UX Design', desc: 'Figma, Prototyping, User Research' }
            ].map((skill, index) => (
              <motion.div
                key={skill.title}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-emerald-500/20"
                initial={{ y: 80, opacity: 0, scale: 0.9 }}
                animate={{
                  y: isVisible ? 0 : 80,
                  opacity: isVisible ? 1 : 0,
                  scale: isVisible ? 1 : 0.9
                }}
                transition={{
                  delay: isVisible ? 2.4 + index * 0.2 : 0,
                  duration: 1.0,
                  ease: [0.23, 1, 0.32, 1]
                }}
                whileHover={{
                  scale: 1.08,
                  y: -12,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transition: {
                    duration: 0.6,
                    ease: [0.23, 1, 0.32, 1]
                  }
                }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-emerald-300 mb-2 md:mb-3">{skill.title}</h3>
                <p className="text-sm md:text-base text-emerald-100/70">{skill.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Content Sections */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16"
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 100
            }}
            transition={{ duration: 1, delay: isVisible ? 3.0 : 0 }}
          >
            {["Projects", "Experience", "About Me"].map((section, index) => (
              <motion.div
                key={section}
                className="bg-black/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-500/60 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? 0 : 50
                }}
                transition={{ duration: 0.8, delay: isVisible ? 3.2 + index * 0.2 : 0 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <h3 className="text-2xl font-bold text-emerald-200 mb-4">{section}</h3>
                <p className="text-emerald-200/60">
                  Ontdek mijn {section.toLowerCase()} en prestaties in webontwikkeling.
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Portfolio Preview Section */}
          <motion.div
            className="py-20"
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 100
            }}
            transition={{ duration: 1, delay: isVisible ? 4.0 : 0 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-emerald-200 mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-emerald-200/70 max-w-2xl mx-auto">
                Een selectie van mijn meest recente en innovatieve projecten
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "E-commerce Platform",
                  description: "Full-stack webshop met React, Node.js en Stripe integratie",
                  tech: ["React", "Node.js", "MongoDB", "Stripe"]
                },
                {
                  title: "Portfolio Dashboard",
                  description: "Interactive dashboard voor portfolio management",
                  tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"]
                }
              ].map((project, index) => (
                <motion.div
                  key={project.title}
                  className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300"
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : (index === 0 ? -50 : 50)
                  }}
                  transition={{ duration: 0.8, delay: isVisible ? 4.2 + index * 0.2 : 0 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <h3 className="text-2xl font-bold text-emerald-200 mb-4">{project.title}</h3>
                  <p className="text-emerald-200/70 mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            className="py-20 text-center"
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 100
            }}
            transition={{ duration: 1, delay: isVisible ? 5.0 : 0 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-emerald-200 mb-8">
              Laten we samenwerken
            </h2>
            <p className="text-lg text-emerald-200/70 mb-12 max-w-2xl mx-auto">
              Heb je een interessant project of wil je gewoon een gesprek? 
              Ik hoor graag van je!
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-2xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Opnemen
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <ParticleField isActive={isVisible} />
    </div>
  )
}

export default Page2