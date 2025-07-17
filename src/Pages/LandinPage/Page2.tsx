"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { motion } from "framer-motion"
import Navbar from "../../components/NavbarMenu"

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

interface SectionProps {
  children: React.ReactNode
  id: string
  className?: string
}

// Memoized ScrollFloat Component - Optimized for performance
interface ScrollFloatProps {
  children: React.ReactNode
  containerClassName?: string
  textClassName?: string
  delay?: number
}

const ScrollFloat = memo<ScrollFloatProps>(({
  children,
  containerClassName = "",
  textClassName = "",
  delay = 0
}) => {
  const text = typeof children === "string" ? children : ""
  
  // Memoize the character split to prevent unnecessary re-renders
  const characters = useMemo(() => text.split(""), [text])
  
  return (
    <motion.h2 
      className={`overflow-hidden ${containerClassName}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <span className={`inline-block font-black text-center leading-relaxed ${textClassName}`}>
        {characters.map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: delay + (index * 0.05),
              ease: "easeOut"
            }}
            viewport={{ once: true }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </motion.h2>
  )
})

ScrollFloat.displayName = 'ScrollFloat'

// Optimized Section wrapper component
const Section = memo<SectionProps>(({ children, id, className = "" }) => (
  <section 
    id={id} 
    className={`min-h-screen flex items-center justify-center py-8 px-4 ${className}`}
    style={{ 
      scrollMarginTop: '80px' // Offset for fixed navbar
    }}
  >
    <div className="max-w-7xl mx-auto w-full">
      {children}
    </div>
  </section>
))

Section.displayName = 'Section'

// Highly optimized AnimatedName component
const AnimatedName = memo<AnimatedNameProps>(({ text, delay = 0, className = "" }) => {
  const characters = useMemo(() => text.split(""), [text])
  
  return (
    <motion.h1
      className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent inline-block"
          initial={{
            opacity: 0,
            y: 50,
            scale: 0.3,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            delay: delay + (index * 0.08),
            ease: "easeOut",
          }}
          style={{
            textShadow: "0 0 20px rgba(16,185,129,0.5)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  )
})

AnimatedName.displayName = 'AnimatedName'

// Lightweight ParticleField Component with reduced particle count
const ParticleField = memo<ParticleFieldProps>(({ isActive = true }) => {
  const particleCount = 20 // Reduced from 30 for better performance
  
  const particles = useMemo(() => 
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      animateX: Math.random() * 100 - 50,
      animateY: Math.random() * 100 - 50,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }))
  , [particleCount])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
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
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
})

ParticleField.displayName = 'ParticleField'

// Memoized project data to prevent re-creation
const projectsData = [
  {
    title: "E-commerce Platform",
    description: "Full-stack webshop met moderne features",
    tech: ["React", "Node.js", "MongoDB"],
    image: "🛒"
  },
  {
    title: "Dashboard App",
    description: "Analytics dashboard met real-time data",
    tech: ["Next.js", "TypeScript", "D3.js"],
    image: "📊"
  },
  {
    title: "Mobile App",
    description: "Cross-platform mobile applicatie",
    tech: ["React Native", "Firebase"],
    image: "📱"
  }
]

const servicesData = [
  {
    title: "Frontend Development",
    description: "Moderne, responsive webapplicaties met React, Next.js en TypeScript",
    icon: "💻"
  },
  {
    title: "Backend Development", 
    description: "Robuuste server-side oplossingen met Node.js, APIs en databases",
    icon: "⚙️"
  },
  {
    title: "UI/UX Design",
    description: "Intuïtieve gebruikerservaringen en aantrekkelijke interfaces",
    icon: "🎨"
  },
  {
    title: "E-commerce Solutions",
    description: "Complete webshops en verkoop platforms op maat",
    icon: "🛍️"
  },
  {
    title: "Performance Optimization",
    description: "Snellere websites en betere gebruikerservaringen",
    icon: "🚀"
  },
  {
    title: "Consulting",
    description: "Technisch advies en strategische begeleiding voor je project",
    icon: "💡"
  }
]

const skillsData = [
  "React & Next.js",
  "Node.js & Express",
  "TypeScript & JavaScript", 
  "MongoDB & PostgreSQL",
  "AWS & Docker",
  "UI/UX Design"
]

const contactData = [
  { icon: "📧", label: "Email", value: "wishant@example.com" },
  { icon: "📱", label: "Telefoon", value: "+31 6 12345678" },
  { icon: "📍", label: "Locatie", value: "Nederland" }
]

// Memoized Project Card Component
const ProjectCard = memo<{project: typeof projectsData[0], index: number}>(({ project, index }) => (
  <motion.div
    className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: index * 0.2 }}
    viewport={{ once: true, amount: 0.3 }}
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <div className="text-4xl mb-4">{project.image}</div>
    <h3 className="text-xl font-bold text-emerald-200 mb-3">{project.title}</h3>
    <p className="text-emerald-200/70 mb-4 leading-relaxed">{project.description}</p>
    
    <div className="flex flex-wrap gap-2 mb-4">
      {project.tech.map((tech) => (
        <span
          key={tech}
          className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium"
        >
          {tech}
        </span>
      ))}
    </div>

    <motion.button
      className="w-full py-2 bg-emerald-500/20 text-emerald-200 rounded-lg hover:bg-emerald-500/30 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Bekijk Project →
    </motion.button>
  </motion.div>
))

ProjectCard.displayName = 'ProjectCard'

// Memoized Service Card Component  
const ServiceCard = memo<{service: typeof servicesData[0], index: number}>(({ service, index }) => (
  <motion.div
    className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: index * 0.1 }}
    viewport={{ once: true, amount: 0.3 }}
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <div className="text-4xl mb-4">{service.icon}</div>
    <h3 className="text-xl font-bold text-emerald-200 mb-3">{service.title}</h3>
    <p className="text-emerald-200/70 mb-6 leading-relaxed">{service.description}</p>
    
    <motion.button
      className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors duration-300"
      whileHover={{ x: 5 }}
    >
      Meer Info →
    </motion.button>
  </motion.div>
))

ServiceCard.displayName = 'ServiceCard'

// Main Page2 Component - Heavily optimized
const Page2 = memo<Page2Props>(({ isVisible = true }) => {
  const [activeSection, setActiveSection] = useState<string>("home")

  // Memoized scroll function
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navbarHeight = 80
      const elementPosition = element.offsetTop - navbarHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      setActiveSection(sectionId)
    }
  }, [])

  // Optimized Intersection Observer with cleanup
  useEffect(() => {
    if (!isVisible) return

    const observers: IntersectionObserver[] = []
    const sections = ["home", "about", "portfolio", "services", "contact"]
    
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(sectionId)
            }
          },
          { 
            threshold: 0.5,
            rootMargin: "-80px 0px -20% 0px"
          }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [isVisible])

  // Set document styles once when component mounts
  useEffect(() => {
    if (!isVisible) return

    // Apply smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth'
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
    
    // Prevent scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [isVisible])

  // Don't render if not visible to save performance
  if (!isVisible) return null

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 page-container page2-container scrollable-hidden" style={{ minHeight: '100vh' }}>
      {/* Navbar with scroll function */}
      <Navbar 
        activeSection={activeSection} 
        onSectionClick={scrollToSection}
      />

      {/* HOME SECTION */}
      <Section id="home" className="relative">
        <ParticleField isActive={isVisible} />
        
        <motion.div
          className="text-center z-10 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 50
          }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <AnimatedName text="WISHANT BHAJAN" delay={0} className="mb-6" />
          
          <motion.h2 
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-emerald-200 mb-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: isVisible ? 0 : 100,
              opacity: isVisible ? 1 : 0
            }}
            transition={{ delay: 1.2, duration: 1.2 }}
          >
            Full Stack Developer
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-emerald-200/80 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 80, opacity: 0 }}
            animate={{
              y: isVisible ? 0 : 80,
              opacity: isVisible ? 1 : 0
            }}
            transition={{ delay: 1.6, duration: 1.0 }}
          >
            Welkom in mijn digitale wereld. Hier creëer ik innovatieve weboplossingen die het verschil maken.
          </motion.p>

          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: isVisible ? 0 : 100,
              opacity: isVisible ? 1 : 0
            }}
            transition={{ delay: 2.0, duration: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('portfolio')}
          >
            Ontdek Mijn Werk →
          </motion.button>
        </motion.div>
      </Section>

      {/* ABOUT SECTION */}
      <Section id="about" className="bg-slate-800/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <ScrollFloat
              containerClassName="text-4xl md:text-6xl font-bold text-emerald-200 mb-6"
              textClassName="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent"
              delay={0.2}
            >
              Over Mij
            </ScrollFloat>
            
            <motion.p 
              className="text-lg text-emerald-200/80 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Ik ben een gepassioneerde Full Stack Developer met een liefde voor het creëren van 
              moderne, gebruiksvriendelijke webapplicaties. Met expertise in React, Node.js, en 
              moderne web technologieën breng ik ideeën tot leven.
            </motion.p>
            
            <motion.p 
              className="text-lg text-emerald-200/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Mijn focus ligt op het leveren van hoogwaardige code, intuïtieve gebruikerservaringen 
              en innovatieve oplossingen voor complexe problemen.
            </motion.p>
            
            <motion.button
              className="px-6 py-3 border-2 border-emerald-400 text-emerald-200 font-semibold rounded-xl hover:bg-emerald-400 hover:text-slate-900 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Meer Over Mij →
            </motion.button>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl p-8 backdrop-blur-sm border border-emerald-500/30">
              <motion.h3 
                className="text-2xl font-bold text-emerald-200 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Skills & Expertise
              </motion.h3>
              {skillsData.map((skill, index) => (
                <motion.div
                  key={skill}
                  className="flex items-center mb-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3" />
                  <span className="text-emerald-200/80">{skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* PORTFOLIO SECTION */}
      <Section id="portfolio" className="bg-slate-900/50">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <ScrollFloat
            containerClassName="text-4xl md:text-6xl font-bold text-emerald-200 mb-4"
            textClassName="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent"
            delay={0.2}
          >
            Portfolio
          </ScrollFloat>
          
          <motion.p 
            className="text-lg text-emerald-200/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Een selectie van mijn meest recente en innovatieve projecten
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-2xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Alle Projecten Bekijken →
          </motion.button>
        </motion.div>
      </Section>

      {/* SERVICES SECTION */}
      <Section id="services" className="bg-slate-800/30">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <ScrollFloat
            containerClassName="text-4xl md:text-6xl font-bold text-emerald-200 mb-4"
            textClassName="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent"
            delay={0.2}
          >
            Services
          </ScrollFloat>
          
          <motion.p 
            className="text-lg text-emerald-200/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Wat ik voor jou kan betekenen in de digitale wereld
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </Section>

      {/* CONTACT SECTION */}
      <Section id="contact" className="bg-slate-900/70">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <ScrollFloat
              containerClassName="text-4xl md:text-6xl font-bold text-emerald-200 mb-6"
              textClassName="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent"
              delay={0.2}
            >
              Plan een Gesprek
            </ScrollFloat>
            
            <motion.p 
              className="text-lg text-emerald-200/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Heb je een interessant project of wil je gewoon kennismaken? 
              Ik hoor graag van je! Laten we samen bespreken hoe ik jouw digitale doelen kan realiseren.
            </motion.p>

            <div className="space-y-4 mb-8">
              {contactData.map((contact, index) => (
                <motion.div
                  key={contact.label}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  <span className="text-2xl mr-4">{contact.icon}</span>
                  <div>
                    <div className="text-emerald-400 font-semibold">{contact.label}</div>
                    <div className="text-emerald-200/70">{contact.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Plan Gesprek →
            </motion.button>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl p-8 backdrop-blur-sm border border-emerald-500/30">
              <motion.h3 
                className="text-2xl font-bold text-emerald-200 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Snelle Reactie
              </motion.h3>
              <form className="space-y-4">
                <motion.input
                  type="text"
                  placeholder="Jouw naam"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-emerald-200 placeholder-emerald-200/50 focus:border-emerald-400 focus:outline-none transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                />
                <motion.input
                  type="email"
                  placeholder="Email adres"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-emerald-200 placeholder-emerald-200/50 focus:border-emerald-400 focus:outline-none transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}
                />
                <motion.textarea
                  placeholder="Vertel over je project..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-emerald-200 placeholder-emerald-200/50 focus:border-emerald-400 focus:outline-none transition-colors duration-300 resize-none"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  viewport={{ once: true }}
                />
                <motion.button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verstuur Bericht
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  )
})

Page2.displayName = 'Page2'

export default Page2