import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import React from 'react';

interface TypingTextProps {
  text: string;
  delay?: number;
  className?: string;
  speed?: number;
  style?: React.CSSProperties;
}

const TypingText = ({ 
  text, 
  delay = 0, 
  className = "",
  speed = 100,
  style = {}
}: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, speed);
        return () => clearTimeout(timer);
      } else {
        const hideCursorTimer = setTimeout(() => {
          setShowCursor(false);
        }, 1000);
        return () => clearTimeout(hideCursorTimer);
      }
    }, delay);

    return () => clearTimeout(startTimer);
  }, [currentIndex, text, speed, delay]);

  useEffect(() => {
    if (currentIndex >= text.length) return;
    
    const blinkTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(blinkTimer);
  }, [currentIndex, text.length]);

  return (
    <motion.span
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      {displayedText}
      {showCursor && (
        <motion.span
          className="inline-block w-0.5 h-4 md:h-5 bg-current ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </motion.span>
  );
};

export default TypingText;