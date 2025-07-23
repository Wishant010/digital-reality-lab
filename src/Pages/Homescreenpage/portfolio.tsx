"use client"

import type React from "react"
import { motion } from "framer-motion"

interface PortfolioProps {
  isVisible?: boolean
}

const Portfolio: React.FC<PortfolioProps> = ({ isVisible = true }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-6">
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
      </div>
    </div>
  )
}

export default Portfolio
