import { motion } from 'framer-motion';

interface ContentSectionProps {
  isVisible: boolean;
}

const ContentSection = ({ isVisible }: ContentSectionProps) => (
  <motion.section
    className="min-h-screen relative bg-black flex items-center justify-center"
    initial={{ opacity: 0, y: 100, filter: "blur(15px)" }}
    animate={{ 
      opacity: isVisible ? 1 : 0,
      y: isVisible ? 0 : 100,
      filter: isVisible ? "blur(0px)" : "blur(15px)"
    }}
    transition={{ 
      duration: 1.5, 
      delay: isVisible ? 0.8 : 0,
      ease: [0.23, 1, 0.32, 1]
    }}
  >
    <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
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
        Welkom in mijn digitale wereld
      </motion.h2>
      
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

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
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
    </div>
  </motion.section>
);

export default ContentSection;