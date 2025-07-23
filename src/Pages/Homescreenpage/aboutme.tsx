"use client"

import type React from "react"
import { motion } from "framer-motion"

interface AboutMeProps {
  isVisible?: boolean
}

const AboutMe: React.FC<AboutMeProps> = ({ isVisible = true }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Skills Grid */}
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
      </div>
    </div>
  )
}

export default AboutMe
