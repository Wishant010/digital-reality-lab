import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavbarMenu from '../components/NavbarMenu';
import ContentSection from '../components/ContentSection';
import SmoothText from '../Type-manieren/SmoothText';
import { FloatingOrbs } from '../Vormen/CombinedVisualComponents';

interface HackedPageProps {
  isVisible: boolean;
}

const HackedPage = ({ isVisible }: HackedPageProps): JSX.Element | null => {
  const [showContent, setShowContent] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [showOrbs, setShowOrbs] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 400);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible]);

  useEffect(() => {
    if (!showContent) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight / 2 && !isScrolledUp) {
        setIsScrolledUp(true);
        setShowOrbs(true);
      } else if (scrollY >= window.innerHeight / 2 && isScrolledUp) {
        setIsScrolledUp(false);
        setShowOrbs(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showContent, isScrolledUp]);

  if (!isVisible) return null;

  return (
    <div className="relative">
      <NavbarMenu isVisible={showContent && !isScrolledUp} />

      <motion.div 
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 2, delay: 1 }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-emerald-400 font-mono text-sm opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                }}
                animate={{
                  y: [0, typeof window !== 'undefined' ? window.innerHeight + 100 : 800],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
              >
                {Math.random().toString(36).substring(7)}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
        >
          <motion.div className="text-center mb-6 md:mb-8">
            <SmoothText 
              text="WISHANT BHAJAN" 
              delay={0.2}
              className="mb-4"
            />
          </motion.div>

          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.h2
              className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-4"
              animate={{
                textShadow: [
                  '0 0 10px rgba(16,185,129,0.5)',
                  '0 0 20px rgba(16,185,129,0.8)',
                  '0 0 10px rgba(16,185,129,0.5)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✅ HACK SUCCESSFUL
            </motion.h2>
            
            <motion.p
              className="text-emerald-200/80 text-lg md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1.2 }}
            >
              Matrix toegang verkregen. Welkom in mijn universum.
            </motion.p>
          </motion.div>

          <motion.div
            className="bg-black/50 backdrop-blur-lg border border-emerald-500/30 rounded-lg p-6 md:p-8 font-mono text-sm md:text-base max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 1.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div className="text-emerald-400">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.3 }}
              >
                {'>'} Authenticating user...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9, duration: 0.3 }}
              >
                {'>'} Access level: ADMIN
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.3 }}
              >
                {'>'} Loading portfolio modules...
              </motion.div>
              <motion.div
                className="text-cyan-300 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.3 }}
              >
                {'>'} SYSTEM READY. Scroll to explore.
              </motion.div>
            </motion.div>
          </motion.div>

          {isScrolledUp && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <motion.p
                className="text-emerald-200/80 mb-6 md:mb-8 text-base md:text-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              >
                Verken mijn creatieve universum
              </motion.p>
              <FloatingOrbs isVisible={showOrbs} />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <ContentSection isVisible={showContent} />
    </div>
  );
};

export default HackedPage;