import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import React from 'react';

// GooeyNav Component
interface GooeyNavItem {
  label: string;
  href: string;
}

interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);
  
  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (
    distance: number,
    pointIndex: number,
    totalPoints: number
  ): [number, number] => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  
  const createParticle = (
    i: number,
    t: number,
    d: [number, number],
    r: number
  ) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };
  
  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add("active");
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Particle already removed
          }
        }, t);
      }, 30);
    }
  };
  
  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };
  
  const handleClick = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
    const liEl = e.currentTarget;
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(liEl);
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".particle");
      particles.forEach((p) => filterRef.current!.removeChild(p));
    }
    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }
    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };
  
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll("li")[
      activeIndex
    ] as HTMLElement;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add("active");
    }
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll("li")[
        activeIndex
      ] as HTMLElement;
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>
        {`
          :root {
            --color-1: #10b981;
            --color-2: #047857;
            --color-3: #0d9488;
            --color-4: #14b8a6;
          }
          .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
          }
          .effect.text {
            color: white;
            transition: color 0.3s ease;
          }
          .effect.text.active {
            color: black;
          }
          .effect.filter {
            filter: blur(7px) contrast(100) blur(0);
            mix-blend-mode: lighten;
          }
          .effect.filter::before {
            content: "";
            position: absolute;
            inset: -75px;
            z-index: -2;
            background: black;
          }
          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: white;
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .effect.active::after {
            animation: pill 0.3s ease both;
          }
          @keyframes pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .particle,
          .point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 8px);
            left: calc(50% - 8px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          @keyframes point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          li.active {
            color: black;
            text-shadow: none;
          }
          li.active::after {
            opacity: 1;
            transform: scale(1);
          }
          li::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 8px;
            background: white;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
            z-index: -1;
          }
        `}
      </style>
      <div className="relative" ref={containerRef}>
        <nav
          className="flex relative"
          style={{ transform: "translate3d(0,0,0.01px)" }}
        >
          <ul
            ref={navRef}
            className="flex gap-8 list-none p-0 px-4 m-0 relative z-[3]"
            style={{
              color: "white",
              textShadow: "0 1px 1px hsl(205deg 30% 10% / 0.2)",
            }}
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={`py-[0.6em] px-[1em] rounded-full relative cursor-pointer transition-[background-color_color_box-shadow] duration-300 ease shadow-[0_0_0.5px_1.5px_transparent] text-white ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={(e) => handleClick(e, index)}
              >
                <a
                  href={item.href}
                  className="outline-none"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  );
};

// Floating shapes background
const FloatingShape = ({ delay, duration, size, initialX, initialY }: { 
  delay: number; 
  duration: number; 
  size: number;
  initialX: number;
  initialY: number;
}) => (
  <motion.div
    className="absolute rounded-full opacity-10"
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      filter: 'blur(1px)',
      left: initialX,
      top: initialY
    }}
    animate={{
      x: [0, 200, -150, 100, 0],
      y: [0, -180, 120, -80, 0],
      scale: [1, 1.3, 0.7, 1.1, 1],
      rotate: [0, 180, 360, 180, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Cursor following gradient
const CursorGlow = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springX = useSpring(cursorX, { stiffness: 200, damping: 25 });
  const springY = useSpring(cursorY, { stiffness: 200, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 200);
      cursorY.set(e.clientY - 200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-10"
      style={{
        left: springX,
        top: springY,
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(4,120,87,0.08) 50%, transparent 100%)',
        borderRadius: '50%',
        filter: 'blur(1px)'
      }}
    />
  );
};

// Smooth text animation
const SmoothText = ({ 
  text, 
  delay = 0, 
  className = "", 
  moveToTopLeft = false
}: { 
  text: string; 
  delay?: number; 
  className?: string; 
  moveToTopLeft?: boolean;
}) => {
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
        duration: 2.5,
        ease: [0.23, 1, 0.32, 1],
        delay: 0.8
      } : {}}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ 
            opacity: 0, 
            y: 80, 
            filter: "blur(12px)",
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

// Smooth glassmorphism card
const SmoothCard = ({ 
  children, 
  delay = 0,
  isVisible = true
}: { 
  children: React.ReactNode; 
  delay?: number;
  isVisible?: boolean;
}) => (
  <motion.div
    className="backdrop-blur-xl bg-white/10 rounded-2xl px-6 md:px-8 py-6 md:py-7 border border-white/20 shadow-xl max-w-xl md:max-w-2xl mx-auto"
    initial={{ 
      opacity: 0, 
      y: 60, 
      scale: 0.9,
      filter: "blur(10px)"
    }}
    animate={{ 
      opacity: isVisible ? 1 : 0, 
      y: isVisible ? 0 : 60, 
      scale: isVisible ? 1 : 0.9,
      filter: isVisible ? "blur(0px)" : "blur(10px)"
    }}
    transition={{ 
      duration: 1.8, 
      delay: delay,
      ease: [0.23, 1, 0.32, 1]
    }}
    whileHover={{ 
      scale: 1.02,
      backgroundColor: 'rgba(255,255,255,0.15)',
      y: -5,
      transition: { 
        duration: 0.8, 
        ease: [0.23, 1, 0.32, 1] 
      }
    }}
  >
    {children}
  </motion.div>
);

// Interactive floating orbs
const FloatingOrbs = ({ isVisible }: { isVisible: boolean }) => (
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
        animate={{
          y: [0, -25, 0],
          rotate: [0, 15, -15, 0]
        }}
        transition={{
          duration: 4 + i * 0.8,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeInOut"
        }}
      />
    ))}
  </motion.div>
);

// Smooth particles
const SmoothParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white/30 rounded-full"
    animate={{
      y: [0, -120],
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0]
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 4,
      ease: [0.23, 1, 0.32, 1]
    }}
    initial={{
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
      y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50
    }}
  />
);

const SmoothParticleField = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({ id: i, delay: Math.random() * 4 }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <SmoothParticle key={particle.id} delay={particle.delay} />
      ))}
    </div>
  );
};

// Smooth navigation header
const SmoothNavigation = ({ isVisible }: { isVisible: boolean }) => (
  <motion.header
    className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-emerald-500/20"
    initial={{ y: -120, opacity: 0, filter: "blur(10px)" }}
    animate={{ 
      y: isVisible ? 0 : -120,
      opacity: isVisible ? 1 : 0,
      filter: isVisible ? "blur(0px)" : "blur(10px)"
    }}
    transition={{ 
      duration: 1.8, 
      ease: [0.23, 1, 0.32, 1], 
      delay: isVisible ? 1.2 : 0 
    }}
  >
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
      <motion.div
        className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"
        initial={{ x: -60, opacity: 0, scale: 0.8 }}
        animate={{ 
          x: isVisible ? 0 : -60, 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8
        }}
        transition={{ 
          delay: isVisible ? 1.8 : 0, 
          duration: 1.2,
          ease: [0.23, 1, 0.32, 1]
        }}
      >
        Wishant Bhajan
      </motion.div>
      
      <motion.div
        initial={{ x: 60, opacity: 0, scale: 0.8 }}
        animate={{ 
          x: isVisible ? 0 : 60, 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8
        }}
        transition={{ 
          delay: isVisible ? 2.0 : 0, 
          duration: 1.2,
          ease: [0.23, 1, 0.32, 1]
        }}
      >
        {isVisible && (
          <GooeyNav
            items={[
              { label: 'Portfolio', href: '#portfolio' },
              { label: 'Over Mij', href: '#about' },
              { label: 'Contact', href: '#contact' },
              { label: 'Blog', href: '#blog' },
            ]}
          />
        )}
      </motion.div>
    </div>
  </motion.header>
);

// Smooth content section
const SmoothContentSection = ({ isVisible }: { isVisible: boolean }) => (
  <motion.section
    className="min-h-screen relative bg-black flex items-center justify-center"
    initial={{ opacity: 0, y: 100, filter: "blur(15px)" }}
    animate={{ 
      opacity: isVisible ? 1 : 0,
      y: isVisible ? 0 : 100,
      filter: isVisible ? "blur(0px)" : "blur(15px)"
    }}
    transition={{ 
      duration: 2.2, 
      delay: isVisible ? 1.8 : 0,
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
          delay: isVisible ? 2.2 : 0, 
          duration: 1.8,
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
          delay: isVisible ? 2.6 : 0, 
          duration: 1.6,
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
          delay: isVisible ? 3.0 : 0, 
          duration: 1.8,
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
              delay: isVisible ? 3.4 + index * 0.3 : 0,
              duration: 1.4,
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

// Main homepage component
const HomePage = () => {
  const [showAllContent, setShowAllContent] = useState(false);
  const [showSecondSection, setShowSecondSection] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [showOrbs, setShowOrbs] = useState(false);

  useEffect(() => {
    // Show all content at once
    const timer = setTimeout(() => {
      setShowAllContent(true);
    }, 800);
    
    document.body.style.overflow = 'hidden';
    
    // Smooth scroll listener
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight / 2 && showSecondSection) {
        setIsScrolledUp(true);
        setShowOrbs(true);
      } else {
        setIsScrolledUp(false);
        setShowOrbs(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showSecondSection]);

  const scrollToNextSection = () => {
    document.body.style.overflow = 'unset';
    setShowSecondSection(true);
    
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }, 1200);
  };

  return (
    <div className="relative">
      <SmoothNavigation isVisible={showSecondSection && !isScrolledUp} />

      {/* Hero Section */}
      <motion.div 
        className="min-h-screen relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 2,
          ease: [0.23, 1, 0.32, 1]
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900" />
        
        <div className="absolute inset-0">
          {/* Floating shapes */}
          <FloatingShape delay={0} duration={15} size={80} initialX={50} initialY={100} />
          <FloatingShape delay={0.5} duration={18} size={60} initialX={150} initialY={50} />
          <FloatingShape delay={1} duration={12} size={100} initialX={400} initialY={80} />
          <FloatingShape delay={1.5} duration={20} size={70} initialX={600} initialY={40} />
          <FloatingShape delay={2} duration={16} size={90} initialX={900} initialY={120} />
          <FloatingShape delay={2.5} duration={14} size={55} initialX={1100} initialY={70} />
          <FloatingShape delay={3} duration={19} size={75} initialX={80} initialY={300} />
          <FloatingShape delay={3.5} duration={13} size={65} initialX={200} initialY={250} />
          <FloatingShape delay={4} duration={17} size={85} initialX={1000} initialY={280} />
          <FloatingShape delay={4.5} duration={21} size={95} initialX={1200} initialY={320} />
          <FloatingShape delay={5} duration={11} size={70} initialX={120} initialY={500} />
          <FloatingShape delay={5.5} duration={15} size={80} initialX={250} initialY={450} />
        </div>

        <CursorGlow />
        <SmoothParticleField />

        <motion.div 
          className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 2, 
            ease: [0.23, 1, 0.32, 1],
            delay: 1
          }}
        >
          {showAllContent && (
            <>
              {/* Name - appears first */}
              <motion.div className="text-center mb-6 md:mb-8">
                <SmoothText 
                  text="WISHANT BHAJAN" 
                  delay={0.2}
                  className="mb-4"
                  moveToTopLeft={showSecondSection && !isScrolledUp}
                />
              </motion.div>

              {/* Subtitle - appears with slight delay */}
              {!showSecondSection && (
                <motion.div 
                  className="text-center mb-8 md:mb-12"
                  initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ 
                    duration: 1.8, 
                    delay: 0.8,
                    ease: [0.23, 1, 0.32, 1] 
                  }}
                >
                  <div className="text-lg md:text-xl font-light text-emerald-200/85 tracking-wider">
                    <motion.span
                      className="bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-500 bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 1.5,
                        delay: 1.2,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      style={{ 
                        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                        fontWeight: 300,
                        letterSpacing: '0.1em'
                      }}
                    >
                      Full Stack Developer
                    </motion.span>
                  </div>
                </motion.div>
              )}

              {/* Card - appears last */}
              {!showSecondSection && (
                <SmoothCard delay={1.4} isVisible={true}>
                  <div className="text-center space-y-4 md:space-y-6">
                    <motion.h3 
                      className="text-lg md:text-xl font-medium text-white/90"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: 1.8, 
                        duration: 1.2, 
                        ease: [0.23, 1, 0.32, 1] 
                      }}
                    >
                      Beleef de toekomst vandaag
                    </motion.h3>
                    <motion.p 
                      className="text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: 2.2, 
                        duration: 1.2, 
                        ease: [0.23, 1, 0.32, 1] 
                      }}
                    >
                      Ontdek mijn passie voor het bouwen van innovatieve digitale oplossingen die de gebruikerservaring transformeren. Van elegant frontend design tot robuuste backend architectuur - ik creëer technologie die écht verschil maakt.
                    </motion.p>
                    <motion.div 
                      className="pt-2 md:pt-4"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: 2.6, 
                        duration: 1.2, 
                        ease: [0.23, 1, 0.32, 1] 
                      }}
                    >
                      <motion.button
                        onClick={scrollToNextSection}
                        className="px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-medium transition-all duration-700 min-w-[200px] md:min-w-[240px] shadow-lg text-sm md:text-base"
                        whileHover={{ 
                          scale: 1.08, 
                          y: -5,
                          boxShadow: "0 10px 25px rgba(16,185,129,0.4)",
                          transition: { 
                            duration: 0.6, 
                            ease: [0.23, 1, 0.32, 1] 
                          }
                        }}
                        whileTap={{ 
                          scale: 0.96,
                          transition: { duration: 0.2 }
                        }}
                      >
                        Start je avontuur →
                      </motion.button>
                    </motion.div>
                  </div>
                </SmoothCard>
              )}
            </>
          )}

          {/* Floating Orbs when scrolled back up */}
          {isScrolledUp && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.8, 
                ease: [0.23, 1, 0.32, 1] 
              }}
            >
              <motion.p
                className="text-emerald-200/80 mb-6 md:mb-8 text-base md:text-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.4, 
                  duration: 1.2,
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                Verken mijn creatieve universum
              </motion.p>
              <FloatingOrbs isVisible={showOrbs} />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <SmoothContentSection isVisible={showSecondSection} />
    </div>
  );
};

export default HomePage;