import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NavbarMenuProps {
  isVisible: boolean;
}

interface NavbarMenuProps {
  isVisible: boolean;
}

interface NavbarMenuProps {
  isVisible: boolean;
}

const NavbarMenu = ({ isVisible }: NavbarMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  const items = [
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Over Mij', href: '#about' },
    { label: 'Contact', href: '#contact' },
    { label: 'Blog', href: '#blog' },
  ];
  
  const animationTime = 600;
  const particleCount = 15;
  const particleDistances: [number, number] = [90, 10];
  const particleR = 100;
  const timeVariance = 300;
  const colors = [1, 2, 3, 1, 2, 3, 1, 4];
  
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
          .navbar-effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
          }
          .navbar-effect.text {
            color: white;
            transition: color 0.3s ease;
          }
          .navbar-effect.text.active {
            color: black;
          }
          .navbar-effect.filter {
            filter: blur(7px) contrast(100) blur(0);
            mix-blend-mode: lighten;
          }
          .navbar-effect.filter::before {
            content: "";
            position: absolute;
            inset: -75px;
            z-index: -2;
            background: black;
          }
          .navbar-effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: white;
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .navbar-effect.active::after {
            animation: navbar-pill 0.3s ease both;
          }
          @keyframes navbar-pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .navbar-particle,
          .navbar-point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .navbar-particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 8px);
            left: calc(50% - 8px);
            animation: navbar-particle calc(var(--time)) ease 1 -350ms;
          }
          .navbar-point {
            background: var(--color);
            opacity: 1;
            animation: navbar-point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes navbar-particle {
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
          @keyframes navbar-point {
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
          .navbar-li.active {
            color: black;
            text-shadow: none;
          }
          .navbar-li.active::after {
            opacity: 1;
            transform: scale(1);
          }
          .navbar-li::after {
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
      
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-emerald-500/20"
        initial={{ y: -120, opacity: 0, filter: "blur(5px)" }}
        animate={{ 
          y: isVisible ? 0 : -120,
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? "blur(0px)" : "blur(5px)" // Keep positive values
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.23, 1, 0.32, 1], 
          delay: isVisible ? 0.5 : 0 
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
              delay: isVisible ? 0.8 : 0, 
              duration: 0.8,
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
              delay: isVisible ? 1.0 : 0, 
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            {isVisible && (
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
                        className={`navbar-li py-[0.6em] px-[1em] rounded-full relative cursor-pointer transition-[background-color_color_box-shadow] duration-300 ease shadow-[0_0_0.5px_1.5px_transparent] text-white ${
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
                <span className="navbar-effect filter" ref={filterRef} />
                <span className="navbar-effect text" ref={textRef} />
              </div>
            )}
          </motion.div>
        </div>
      </motion.header>
    </>
  );
};

export default NavbarMenu;