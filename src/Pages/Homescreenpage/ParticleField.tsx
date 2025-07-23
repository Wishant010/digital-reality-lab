"use client"

import type React from "react"
import { motion } from "framer-motion"

interface ParticleFieldProps {
  isActive?: boolean
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

export default ParticleField
