import { motion } from 'framer-motion';

// ========================================
// PARTICLE FIELD COMPONENT
// ========================================
interface SmoothParticleProps {
  delay: number;
  isActive: boolean;
}

const SmoothParticle = ({ delay, isActive }: SmoothParticleProps) => (
  <motion.div
    className="absolute w-1 h-1 bg-white/25 rounded-full"
    animate={isActive ? {
      y: [0, -150], // Faster movement
      opacity: [0, 1, 0],
      scale: [0, 1, 0]
    } : {
      opacity: 0
    }}
    transition={{
      duration: 3, // Much faster - was 5
      delay,
      repeat: isActive ? Infinity : 0,
      repeatDelay: Math.random() * 2, // Faster repeat - was 4
      ease: "linear" // Smooth constant speed
    }}
    initial={{
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
      y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50
    }}
  />
);

interface ParticleFieldProps {
  isActive: boolean;
}

export const ParticleField = ({ isActive }: ParticleFieldProps) => {
  const particles = Array.from({ length: 8 }, (_, i) => ({ // Reduced from 15 to 8
    id: i, 
    delay: Math.random() * 2 // Faster initial delay
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <SmoothParticle 
          key={particle.id} 
          delay={particle.delay} 
          isActive={isActive} 
        />
      ))}
    </div>
  );
};

// ========================================
// FLOATING ORBS COMPONENT
// ========================================
interface FloatingOrbsProps {
  isVisible: boolean;
}

export const FloatingOrbs = ({ isVisible }: FloatingOrbsProps) => (
  <motion.div
    className="flex space-x-4 justify-center"
    initial={{ opacity: 0, y: 50, scale: 0.8 }}
    animate={{ 
      opacity: isVisible ? 1 : 0,
      y: isVisible ? 0 : 50,
      scale: isVisible ? 1 : 0.8
    }}
    transition={{ 
      duration: 1.8,
      ease: [0.23, 1, 0.32, 1],
      delay: 0.3
    }}
  >
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 cursor-pointer"
        whileHover={{ 
          scale: 1.3,
          rotate: 180,
          boxShadow: "0 0 40px rgba(16,185,129,0.8)",
          transition: { 
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1]
          }
        }}
        whileTap={{ 
          scale: 0.85,
          transition: { duration: 0.2 }
        }}
        animate={isVisible ? {
          y: [0, -25, 0],
          rotate: [0, 15, -15, 0]
        } : {}}
        transition={{
          duration: 4 + i * 0.8,
          repeat: isVisible ? Infinity : 0,
          delay: i * 0.4,
          ease: "easeInOut"
        }}
      />
    ))}
  </motion.div>
);

// ========================================
// DEFAULT EXPORTS (voor backwards compatibility)
// ========================================
export default ParticleField;