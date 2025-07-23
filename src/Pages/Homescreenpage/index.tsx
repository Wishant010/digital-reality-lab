"use client"

import type React from "react"
import HeroSection from "./herosection"
import AboutMe from "./aboutme"
import Portfolio from "./portfolio"
import Contact from "./contact"
import ParticleField from "./ParticleField"

interface HomescreenProps {
  isVisible?: boolean
}

const Homescreen: React.FC<HomescreenProps> = ({ isVisible = true }) => {
  return (
    <div className="relative">
      <HeroSection isVisible={isVisible} />
      <AboutMe isVisible={isVisible} />
      <Portfolio isVisible={isVisible} />
      <Contact isVisible={isVisible} />
      <ParticleField isActive={isVisible} />
    </div>
  )
}

export default Homescreen
