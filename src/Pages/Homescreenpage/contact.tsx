"use client"

import type React from "react"
import { motion } from "framer-motion"

interface ContactProps {
  isVisible?: boolean
}

const Contact: React.FC<ContactProps> = ({ isVisible = true }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-6">
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
    </div>
  )
}

export default Contact
