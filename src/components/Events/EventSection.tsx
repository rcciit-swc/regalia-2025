'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '@/lib/stores';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Calendar, Music, Camera, Award, Ticket } from 'lucide-react';

const EventSection = () => {
  const [isScattered, setIsScattered] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [sectionHeight, setSectionHeight] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { eventsData } = useEvents();
  const router = useRouter();

  const randomRotations = useMemo(
    () => eventsData.map(() => Math.random() * 30 - 15),
    [eventsData]
  );

  // Generate random glow colors for each card
  const glowColors = useMemo(
    () =>
      eventsData.map(() => [
        `rgba(255, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 100)}, 0.8)`,
        `rgba(${Math.floor(Math.random() * 100) + 150}, 255, ${Math.floor(Math.random() * 100)}, 0.8)`,
      ]),
    [eventsData]
  );

  // Generate floating particles data
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }, []);

  // Generate decorative icons
  const decorativeIcons = useMemo(() => {
    const icons = [Calendar, Music, Camera, Award, Ticket, Star];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      Icon: icons[i % icons.length],
      size: Math.floor(Math.random() * 20) + 20,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 4,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.25 + 0.05,
    }));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setIsScattered(true), 500);
        } else {
          setIsScattered(false);
          setTimeout(() => setIsVisible(false), 500);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isScattered) return;

    setTimeout(() => {
      let maxBottom = 0;
      cardRefs.current.forEach((card) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          maxBottom = Math.max(maxBottom, rect.bottom);
        }
      });

      const sectionTop = sectionRef.current?.getBoundingClientRect().top || 0;
      const actualHeight = maxBottom - sectionTop + 180; // extra buffer to ensure full visibility
      setSectionHeight(actualHeight);
    }, 700); // Wait for animation to finish
  }, [isScattered, windowSize]);

  const getCardSize = () => {
    const baseSize = Math.min(windowSize.width * 0.22, 280);
    const minSize = windowSize.width < 768 ? 140 : 180;
    return Math.max(baseSize, minSize);
  };

  const getCardPosition = (index: number, total: number) => {
    const half = Math.floor(total / 2);
    const maxX = windowSize.width * 0.32;
    const maxY = windowSize.height * 0.48;

    let x, y;

    if (index <= half) {
      const progress = index / half;
      x = -maxX + progress * maxX * 2;
      y = -maxY + progress * maxY;
    } else {
      const progress = (index - half) / half;
      x = maxX - progress * maxX * 2;

      const extraYSpacing = 1 + progress * 0.7;
      y = progress * maxY * extraYSpacing;
    }

    x -= windowSize.width * 0.1;

    // Reduce verticalOffset to move first card closer to heading
    const verticalOffset = windowSize.width < 640 ? 1 : 15;
    y += verticalOffset;

    const rotation = randomRotations[index];
    return { x, y, rotation };
  };

  const getButtonPosition = () => {
    const cardContainerHorizontalPosition = windowSize.width * 0.2;
    const verticalOffset =
      windowSize.width < 640 ? 52 : windowSize.height * 0.22;

    return {
      left: `${cardContainerHorizontalPosition}px`,
      top: `${windowSize.height / 2 + verticalOffset}px`,
      transform: 'translate(-50%, -50%)',
    };
  };

  const getCardContainerStyle = () => {
    // Move card container slightly to the right
    const horizontalPosition = windowSize.width * 0.45;

    // Adjust vertical position to prevent overlap with heading
    const baseTop = windowSize.height / 2;
    const adjustedTop = windowSize.width < 640 ? baseTop + 20 : baseTop;

    return {
      left: `${horizontalPosition}px`,
      top: `${adjustedTop}px`,
      transform: 'translate(-50%, -50%)',
    };
  };

  const cardSize = getCardSize();
  const buttonPosition = getButtonPosition();
  const cardContainerStyle = getCardContainerStyle();

  // Text shimmer animation
  const textShimmer = {
    hidden: { backgroundPosition: '200% 0' },
    visible: { backgroundPosition: '0% 0' },
  };

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: sectionHeight > 0 ? sectionHeight : windowSize.height * 0.8,
        paddingTop: windowSize.width < 640 ? '30px' : '80px',
        paddingBottom: '50px',
        overflow: 'hidden',
      }}
      className="relative w-full px-4 sm:px-8 text-white lg:pb-52 bg-gradient-to-b from-[#100000] to-[#300000]"
    >
      {/* Animated background with mesh gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-full h-full opacity-20"
          style={{
            background:
              'radial-gradient(circle at 30% 50%, rgba(255,180,0,0.15), transparent 40%), radial-gradient(circle at 70% 20%, rgba(255,100,50,0.12), transparent 50%)',
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute rounded-full bg-yellow-100"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              y: ['-20%', '120%'],
              x: [
                `${particle.x}%`,
                `${particle.x + (Math.random() * 10 - 5)}%`,
              ],
              opacity: [particle.opacity, 0],
            }}
            transition={{
              y: {
                duration: particle.duration,
                repeat: Infinity,
                ease: 'linear',
              },
              x: {
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              opacity: {
                duration: particle.duration / 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Decorative floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {decorativeIcons.map((icon) => {
          const IconComponent = icon.Icon;
          return (
            <motion.div
              key={`icon-${icon.id}`}
              className="absolute text-yellow-100"
              style={{
                left: `${icon.x}%`,
                top: `${icon.y}%`,
                opacity: icon.opacity,
              }}
              animate={{
                y: [`${icon.y}%`, `${icon.y + 15}%`, `${icon.y}%`],
                rotate: [
                  icon.rotation,
                  icon.rotation + 20,
                  icon.rotation - 20,
                  icon.rotation,
                ],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{
                y: {
                  duration: icon.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotate: {
                  duration: icon.duration * 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                scale: {
                  duration: icon.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                delay: icon.delay,
              }}
            >
              <IconComponent size={icon.size} strokeWidth={1} />
            </motion.div>
          );
        })}
      </div>

      {/* Animated light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={`light-beam-${i}`}
            className="absolute origin-bottom"
            style={{
              background: `linear-gradient(to top, rgba(255,246,214,0.08) 0%, rgba(255,246,214,0) 100%)`,
              width: `${50 + i * 30}px`,
              height: `${windowSize.height}px`,
              left: `${20 + i * 25}%`,
              borderRadius: '50%',
              transformOrigin: 'center bottom',
            }}
            animate={{
              scaleY: [0.7, 1.3, 0.7],
              opacity: [0.03, 0.12, 0.03],
              x: [`${-i * 50}px`, `${i * 50}px`, `${-i * 50}px`],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Magic dust particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255,246,214,0.6) 0%, rgba(255,246,214,0) 70%)`,
              width: `${3 + Math.random() * 5}px`,
              height: `${3 + Math.random() * 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${50 + Math.random() * 50}%`,
            }}
            animate={{
              y: ['0%', `-${50 + Math.random() * 50}%`],
              x: [
                `${Math.random() * 10 - 5}%`,
                `${Math.random() * 20 - 10}%`,
                `${Math.random() * 10 - 5}%`,
              ],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={`decoration-${i}`}
            className="absolute rounded-full opacity-10"
            initial={{ scale: 0 }}
            animate={
              isVisible
                ? {
                    scale: [0, 1.2, 1],
                    opacity: [0, 0.2, 0.1],
                  }
                : { scale: 0, opacity: 0 }
            }
            transition={{
              duration: 3,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
            style={{
              background: `radial-gradient(circle, rgba(255,246,214,1) 0%, rgba(255,246,214,0) 70%)`,
              width: `${400 + i * 200}px`,
              height: `${400 + i * 200}px`,
              left: `${i * 30}%`,
              top: `${i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Animated rings */}
      <div className="absolute left-3/4 top-1/4 w-32 h-32 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full border border-yellow-200"
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.1,
              borderWidth: `${i}px`,
            }}
            animate={{
              scale: [1, 2, 3],
              opacity: [0.2, 0.1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Title with animation */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={isVisible ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 mb-12"
      >
        <motion.h1
          ref={titleRef}
          className="text-3xl text-[#FFF9E5] font-antolia sm:text-5xl lg:text-6xl lg:mb-8 text-left font-bold drop-shadow-lg relative inline-block"
          style={{
            background: 'linear-gradient(90deg, #FFF9E5, #FFD700, #FFF9E5)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          variants={textShimmer}
          initial="hidden"
          animate={
            isVisible
              ? {
                  backgroundPosition: ['200% 0', '0% 0', '200% 0'],
                }
              : 'hidden'
          }
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        >
          Events
        </motion.h1>
        <motion.div
          className="h-1 bg-gradient-to-r from-[#FFF9E5] to-transparent w-0"
          animate={isVisible ? { width: '50%' } : { width: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </motion.div>

      <div className="relative h-[100vh] md:h-[150vh] w-full">
        {/* Button with animation */}
        <motion.div
          className="absolute z-30"
          style={{
            ...buttonPosition,
            marginLeft: windowSize.width === 375 ? '20px' : '0px',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isScattered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.8, delay: eventsData.length * 0.06 }}
        >
          <motion.button
            className="text-[#FFF6D6] font-antolia px-10 py-4 text-2xl rounded-xl border-2 border-[#FFF6D5] shadow-lg hover:text-yellow-500 bg-[#210000] backdrop-blur-md bg-opacity-40
            sm:px-8 sm:py-4 sm:text-3xl sm:ml-2
            md:px-8 md:py-4 md:text-4xl
            lg:px-18 lg:py-7 lg:text-5xl relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <motion.span className="absolute inset-0 bg-yellow-300 opacity-20 transition-all duration-300 transform origin-left scale-x-0 group-hover:scale-x-100" />
            Register Now
            <motion.div
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-70"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Sparkles around button on hover */}
            <motion.div className="absolute -inset-4 pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                    x: [0, (Math.random() - 0.5) * 30],
                    y: [0, (Math.random() - 0.5) * 30],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Cards */}
        <div className="absolute" style={cardContainerStyle}>
          <AnimatePresence>
            {eventsData.map((event, index) => {
              const { x, y, rotation } = getCardPosition(
                index,
                eventsData.length
              );
              const isHovered = hoveredCard === index;

              return (
                <motion.div
                  key={index}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.7 }}
                  animate={
                    isScattered
                      ? {
                          x,
                          y,
                          rotate: isHovered ? 0 : rotation,
                          scale: isHovered ? 1.15 : 1,
                          opacity: 1,
                          zIndex: isHovered ? 50 : 10,
                          boxShadow: isHovered
                            ? `0 0 25px 3px ${glowColors[index][0]}, 0 0 10px ${glowColors[index][1]}`
                            : '0 5px 15px rgba(0,0,0,0.3)',
                        }
                      : { x: 0, y: 0, rotate: 0, scale: 0.7, opacity: 0 }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: isHovered ? 200 : 70,
                    damping: isHovered ? 20 : 10,
                    delay: isScattered ? index * 0.06 : 0,
                  }}
                  style={{
                    width: `${cardSize}px`,
                    height: `${cardSize}px`,
                    cursor: 'pointer',
                    position: 'absolute',
                    transformOrigin: 'center center',
                  }}
                  className="shadow-xl rounded-lg overflow-hidden"
                  onClick={() => router.push(`/events/${event.id}`)}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card content */}
                  <div className="relative w-full h-full">
                    <Image
                      src={event.image_url}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform duration-300"
                      style={{
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      }}
                      sizes={`${cardSize}px`}
                    />

                    {/* Overlay with event name */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end justify-center p-4"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: isHovered ? 0.8 : 0.5 }}
                    >
                      <motion.h3
                        className="text-white text-center font-medium text-lg sm:text-xl truncate w-full"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: isHovered ? 0 : 10,
                          opacity: isHovered ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {event.name}
                      </motion.h3>
                    </motion.div>

                    {/* Corner decorations */}
                    {isHovered && (
                      <>
                        <motion.div
                          className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                        <motion.div
                          className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </>
                    )}

                    {/* Sparkle effect on hover */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {Array.from({ length: 4 }).map((_, i) => (
                          <motion.div
                            key={`card-sparkle-${index}-${i}`}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              scale: [0, 1.5, 0],
                              opacity: [0, 0.7, 0],
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.3,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Animated decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 via-transparent to-yellow-200"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          isVisible ? { scaleX: 1, opacity: 0.5 } : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 1.5, delay: 1 }}
      />
    </section>
  );
};

export default EventSection;
