import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SmoothTextProps {
  text: string;
  delay?: number;
  className?: string;
  moveToTopLeft?: boolean;
}

const SmoothText = ({ 
  text, 
  delay = 0, 
  className = "", 
  moveToTopLeft = false
}: SmoothTextProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const letters = text.split("");

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const textSizeClass = moveToTopLeft
    ? "text-2xl md:text-3xl font-semibold tracking-normal" 
    : "text-5xl md:text-7xl lg:text-8xl font-light tracking-tight";

  return (
    <motion.div 
      ref={ref} 
      className={`${className} flex flex-wrap ${moveToTopLeft ? 'justify-start' : 'justify-center'}`}
      animate={moveToTopLeft ? {
        x: -420,
        y: -280,
        scale: 0.6,
        opacity: 1
      } : {}}
      transition={moveToTopLeft ? {
        duration: 1.0,
        ease: [0.23, 1, 0.32, 1],
        delay: 0.2
      } : {}}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ 
            opacity: 0, 
            y: 80, 
            filter: "blur(5px)",
            scale: 0.6,
            rotateX: 45
          }}
          animate={inView ? { 
            opacity: 1, 
            y: 0, 
            filter: "blur(0px)",
            scale: 1,
            rotateX: 0
          } : {}}
          transition={{
            duration: 1.8, 
            delay: delay + (index * 0.08),
            ease: [0.23, 1, 0.32, 1],
          }}
          className={`${textSizeClass} bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-500 bg-clip-text text-transparent inline-block`}
          style={{ 
            willChange: "transform, filter, opacity",
            transformStyle: "preserve-3d"
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default SmoothText;