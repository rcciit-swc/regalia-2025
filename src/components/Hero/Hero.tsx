'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/utils/functions/supabase-client';

export default function Hero() {
  const [currentState, setCurrentState] = useState('grid');
  const [highlightedPair, setHighlightedPair] = useState<number[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [randomImageIndex, setRandomImageIndex] = useState(0);
  const [textPhase, setTextPhase] = useState(0);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Enhanced color palette - memoized to prevent recalculation
  const colors = useMemo(() => ({
    primaryColor: "#facc15", // yellow-300
    secondaryColor: "#220000",
    accentColor: "#ff4d00", // vibrant orange accent
    glowColor: "rgba(250, 204, 21, 0.7)", // yellow glow
  }), []);
  
  // Define the sequence of image pairs to highlight - memoized
  const highlightSequence = useMemo(() => [
    [0, 5],
    [3, 5],
    [1, 3],
    [2, 4],
    [0, 2],
    [1, 4],
  ], []);

  // Image sources - memoized
  const images = useMemo(() => [
    '/hero/0.jpg',
    '/hero/1.jpg',
    '/hero/2.jpg',
    '/hero/3.jpg',
    '/hero/4.jpg',
    '/hero/5.jpg',
  ], []);

  // Taglines that will appear in sequence - memoized
  const taglines = useMemo(() => [
    "RESURRECTION",
    "REUNITED",
    "REBELLION"
  ], []);

  // Handle sequential tagline display - optimized to reduce re-renders
  useEffect(() => {
    let taglineInterval: NodeJS.Timeout | undefined;
    
    if (textPhase === 1) {
      taglineInterval = setInterval(() => {
        setTaglineIndex(prev => {
          if (prev >= taglines.length - 1) {
            clearInterval(taglineInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    
    return () => {
      if (taglineInterval) clearInterval(taglineInterval);
    };
  }, [textPhase, taglines.length]);

  // Main animation sequence - debounced and optimized
  useEffect(() => {
    // Choose a random image index for the final state
    setRandomImageIndex(Math.floor(Math.random() * images.length));

    // Animation timing optimization
    const timings = {
      highlightDuration: 160,
      dimDelay: 120,
      nextPairDelay: 180
    };

    let currentPairIndex = 0;
    let isAnimating = true;

    // Clear any existing timeouts
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    // Start the animation sequence after initial render
    const animateNextPair = () => {
      if (!isAnimating) return;
      
      if (currentPairIndex < highlightSequence.length) {
        // Highlight the current pair
        setHighlightedPair(highlightSequence[currentPairIndex]);

        // After timing, dim the pair
        animationRef.current = setTimeout(() => {
          if (!isAnimating) return;
          setHighlightedPair([]);

          // Move to the next pair
          animationRef.current = setTimeout(() => {
            if (!isAnimating) return;
            currentPairIndex++;

            // Start showing taglines after specific animations
            if (currentPairIndex === 2) {
              setTextPhase(1);
            }

            if (currentPairIndex < highlightSequence.length) {
              animateNextPair();
            } else {
              // All pairs have been highlighted, transition to final state
              animationRef.current = setTimeout(() => {
                if (!isAnimating) return;
                setTextPhase(3);
                setCurrentState('final');
                
                // Set animation complete at the end
                animationRef.current = setTimeout(() => {
                  if (!isAnimating) return;
                  setAnimationComplete(true);
                }, 500);
              }, 1500);
            }
          }, timings.dimDelay);
        }, timings.highlightDuration);
      }
    };

    // Delay the start of the animation to allow for initial render
    animationRef.current = setTimeout(() => {
      animateNextPair();
    }, 100);

    return () => {
      isAnimating = false;
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [highlightSequence, images.length]);

  const handleRegisterClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      window.location.href = '/events';
    } else {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: location.origin + '/auth/callback?next=/events',
        },
      });
      if (error) {  
        console.error("Authentication error:", error);
      }
    }
  };

  // Memoized animation variants to prevent recalculation
  const animations = useMemo(() => ({
    // Enhanced letter animation variants
    letterVariants: {
      hidden: { opacity: 0, y: 50, rotateX: -60 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
          delay: i * 0.08,
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1]
        }
      })
    },

    // Sequential tagline animation variants
    taglineVariants: {
      hidden: { opacity: 0, y: 30, scale: 0.9 },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
          duration: 0.7,
          ease: [0.25, 1, 0.5, 1]
        }
      },
      exit: { 
        opacity: 0,
        y: -30,
        transition: { 
          duration: 0.5,
          ease: [0.25, 1, 0.5, 1]
        }
      }
    },

    // Enhanced glitter effect animation
    glitterVariants: {
      animate: {
        opacity: [0.2, 1, 0.2],
        scale: [0.8, 1.2, 0.8],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse' as const
        }
      }
    },

    // Image hover animation
    imageHoverVariants: {
      hover: {
        scale: 1.05,
        filter: "brightness(1.1)",
        transition: { duration: 0.3 }
      }
    }
  }), []);

  // Optimize particle animation by pre-calculating positions
  const particles = useMemo(() => 
    Array.from({ length: 20 }).map((_, index) => ({
      id: `particle-${index}`,
      width: 2 + Math.random() * 4,
      height: 2 + Math.random() * 4,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 10
    })), 
  []);

  // Optimize title particles by pre-calculating positions
  const titleParticles = useMemo(() => 
    Array.from({ length: 25 }).map((_, i) => ({
      id: `title-particle-${i}`,
      initialX: Math.random() * 800 - 400,
      initialY: Math.random() * 300 - 150,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 2,
      width: 3 + Math.random() * 8,
      height: 3 + Math.random() * 8,
      color: i % 3 === 0 ? colors.accentColor : colors.primaryColor
    })),
  [colors.accentColor, colors.primaryColor]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Enhanced background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-secondary/10 to-secondary/60 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-transparent to-secondary/50 z-0"></div>
      
      {/* Animated particle background - reduced count for better performance */}
      <div className="absolute inset-0 z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-yellow-300/30"
            style={{
              width: particle.width,
              height: particle.height,
              top: particle.top,
              left: particle.left,
              filter: "blur(1px)"
            }}
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Grid state */}
      {currentState === 'grid' && (
        <div className="grid h-screen w-screen grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2 gap-2 md:gap-6 lg:gap-8 p-2 md:p-12 lg:p-16">
          {images.map((src, index) => (
            <motion.div
              key={index}
              className="relative h-full w-full overflow-hidden rounded-xl md:rounded-2xl shadow-lg"
              initial={{ opacity: 0.2, scale: 0.97, y: 20 }}
              animate={{
                opacity: highlightedPair.includes(index) ? 1 : 0.3,
                scale: highlightedPair.includes(index) ? 1.03 : 1,
                y: 0,
                filter: highlightedPair.includes(index) 
                  ? `brightness(1.3) drop-shadow(0 0 12px ${colors.primaryColor})` 
                  : 'brightness(0.85)'
              }}
              transition={{ 
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1]
              }}
              variants={animations.imageHoverVariants}
              whileHover="hover"
            >
              <Image
                src={src || '/placeholder.svg'}
                alt={`Event Image ${index}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={index < 4} // Only prioritize loading for visible images
                loading={index < 4 ? "eager" : "lazy"} // Lazy load non-visible images
              />
              
              {/* Image border glow effect when highlighted */}
              {highlightedPair.includes(index) && (
                <motion.div
                  className="absolute inset-0 rounded-xl md:rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ 
                    boxShadow: `inset 0 0 15px ${colors.primaryColor}`,
                    border: `1px solid ${colors.primaryColor}`
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Sequential taglines with enhanced visibility */}
      <AnimatePresence mode="wait">
        {textPhase === 1 && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="backdrop-blur-md bg-secondary/30 p-6 rounded-2xl border border-yellow-300/20 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`tagline-${taglineIndex}`}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider font-extrabold"
                  style={{ 
                    color: colors.primaryColor,
                    textShadow: `0 0 15px ${colors.secondaryColor}, 0 0 10px rgba(0,0,0,0.9), 0 0 30px ${colors.glowColor}`,
                    fontFamily: "'Orbitron', sans-serif",
                    WebkitTextStroke: "1px rgba(0,0,0,0.5)"
                  }}
                  variants={animations.taglineVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {taglines[taglineIndex].split('').map((letter, index) => (
                    <motion.span
                      key={index}
                      custom={index}
                      variants={animations.letterVariants}
                      initial="hidden"
                      animate="visible"
                      className="inline-block relative"
                    >
                      {letter}
                      {/* Reduced number of glittering elements for better performance */}
                      {index % 3 === 0 && (
                        <motion.span 
                          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-300"
                          variants={animations.glitterVariants}
                          animate="animate"
                          style={{
                            filter: "blur(1px) drop-shadow(0 0 5px #facc15)"
                          }}
                        />
                      )}
                    </motion.span>
                  ))}
                </motion.h2>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final state with enhanced background image and Regalia text */}
      <AnimatePresence>
        {currentState === 'final' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Background image with enhanced parallax effect */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{
                scale: 2.5,
                opacity: 0.3,
              }}
              animate={{
                scale: 1.05,
                opacity: 1,
              }}
              transition={{
                duration: 2.2,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <Image
                src={images[randomImageIndex]}
                alt="Featured Image"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              {/* Enhanced overlays for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-secondary/30 to-black/70"></div>
              <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#220000]/60"></div>
              
              {/* Animated light beam effect - simplified for performance */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.3, 0]
                }}
                style={{
                  background: 'linear-gradient(140deg, transparent 0%, rgba(250,204,21,0.1) 50%, transparent 100%)'
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>

            {/* Date badge with enhanced design */}
            <motion.div
              className="absolute bottom-12 md:bottom-16 z-20 bg-[#220000]/80 backdrop-blur-lg px-6 py-3 rounded-xl border-2 border-yellow-300/60"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: animationComplete ? 1 : 0, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              style={{ boxShadow: "0 0 25px rgba(0,0,0,0.7), 0 0 15px rgba(250,204,21,0.3)" }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 30px rgba(0,0,0,0.8), 0 0 20px rgba(250,204,21,0.5)" 
              }}
            >
              <motion.p 
                className="text-lg md:text-xl font-bold font-antolia tracking-widest"
                style={{ 
                  color: colors.primaryColor,
                  textShadow: "0 2px 4px rgba(0,0,0,0.7), 0 0 10px rgba(250,204,21,0.5)"
                }}
              >
                MAY 15-17, 2025
              </motion.p>
            </motion.div>

            <motion.div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
              {/* REGALIA 2025 title with enhanced effects */}
              <div className="relative">
                <motion.h1
                  className="font-bold leading-none text-[3.5rem] xs:text-[4.5rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-9xl"
                  style={{ 
                    fontFamily: "'Cinzel Decorative', serif",
                    color: colors.primaryColor,
                    textShadow: `0 0 20px ${colors.secondaryColor}, 0 4px 8px rgba(0,0,0,0.8), 0 0 40px rgba(250,204,21,0.4)`,
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: animationComplete ? 1 : 0,
                    y: animationComplete ? 0 : 50,
                  }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        `0 0 20px ${colors.secondaryColor}, 0 4px 8px rgba(0,0,0,0.8), 0 0 40px rgba(250,204,21,0.2)`,
                        `0 0 20px ${colors.secondaryColor}, 0 4px 8px rgba(0,0,0,0.8), 0 0 60px rgba(250,204,21,0.6)`,
                        `0 0 20px ${colors.secondaryColor}, 0 4px 8px rgba(0,0,0,0.8), 0 0 40px rgba(250,204,21,0.2)`,
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className='font-antolia tracking-widest'
                  >
                    REGALIA 2025
                  </motion.span>
                </motion.h1>
                
                {/* Enhanced animated particles around the title - reduced quantity for performance */}
                {animationComplete && titleParticles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    initial={{
                      x: particle.initialX,
                      y: particle.initialY,
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.2, 0.6, 0.2],
                      x: particle.initialX,
                      y: particle.initialY,
                    }}
                    transition={{
                      duration: particle.duration,
                      repeat: Infinity,
                      delay: particle.delay
                    }}
                    style={{
                      width: particle.width,
                      height: particle.height,
                      background: particle.color,
                      filter: "blur(2px) drop-shadow(0 0 4px #facc15)"
                    }}
                  />
                ))}
              </div>
              
              {/* Subtitle with enhanced design for better visibility */}
              <motion.div
                className="mt-6 overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: animationComplete ? "auto" : 0,
                  opacity: animationComplete ? 1 : 0 
                }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {/* Improved tagline display with backdrop for visibility */}
                <motion.div
                  className="px-8 py-3 rounded-full backdrop-blur-md bg-[#220000]/50 border border-yellow-300/40 inline-block"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  style={{ boxShadow: "0 0 30px rgba(0,0,0,0.5), 0 0 15px rgba(250,204,21,0.2)" }}
                >
                  <motion.h2 
                    className="text-xs sm:text-xl md:text-2xl lg:text-3xl font-antolia tracking-widest font-medium mb-1"
                    style={{ 
                      color: "#ffffff",
                      textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 0 12px #facc15"
                    }}
                  >
                    <motion.span
                      className="inline-block"
                      animate={{ 
                        color: [colors.primaryColor, "#ffffff", colors.primaryColor],
                        textShadow: [
                          "0 2px 4px rgba(0,0,0,0.8), 0 0 8px #facc15",
                          "0 2px 4px rgba(0,0,0,0.8), 0 0 16px #facc15",
                          "0 2px 4px rgba(0,0,0,0.8), 0 0 8px #facc15"
                        ]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    >
                      RESURRECTION · REUNITED · REBELLION
                    </motion.span>
                  </motion.h2>
                </motion.div>
                
                {/* Animated golden line separator */}
                <motion.div 
                  className="h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent mx-auto mt-4"
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1.2, delay: 1.2 }}
                  style={{ boxShadow: "0 0 10px #facc15" }}
                />
                
                {/* Subtitle for college name with better styling */}
                <motion.h3
                  className="mt-4 font-bold leading-none text-xl xs:text-2xl sm:text-3xl md:text-4xl"
                  style={{ 
                    fontFamily: "'Marcellus SC', serif",
                    color: "#ffffff",
                    textShadow: `0 0 10px ${colors.secondaryColor}, 0 2px 4px rgba(0,0,0,0.8)`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: animationComplete ? 1 : 0,
                    y: animationComplete ? 0 : 20,
                  }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                 The Annual Cultural Fest of RCCIIT
                </motion.h3>
              </motion.div>
              
              {/* Register button with enhanced hover effects and animations */}
              <motion.button
                className="mt-8 font-bold font-cogley rounded-xl border-2 md:border-3 border-yellow-300 backdrop-blur-sm bg-[#220000]/80 hover:bg-[#220000] transition-all duration-300
                px-6 py-3 text-xl 
                sm:px-8 sm:py-3 sm:text-2xl
                md:px-10 md:py-4 md:text-3xl
                lg:px-12 lg:py-4 lg:text-4xl"
                style={{ 
                  color: colors.primaryColor,
                  boxShadow: "0 0 15px rgba(250,204,21,0.5)",
                  textShadow: "0 2px 4px rgba(0,0,0,0.8)"
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: animationComplete ? 1 : 0,
                  y: animationComplete ? 0 : 50,
                }}
                transition={{ duration: 0.8, delay: 1.0 }}
                onClick={handleRegisterClick}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 25px rgba(250,204,21,0.8)",
                  textShadow: "0 0 12px rgba(250,204,21,0.8)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 5px rgba(250,204,21,0.5)",
                      "0 0 15px rgba(250,204,21,0.8)",
                      "0 0 5px rgba(250,204,21,0.5)",
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  EXPLORE
                </motion.span>
                
                {/* Enhanced animated arrow */}
                <motion.span 
                  className="inline-block ml-2"
                  animate={{ 
                    x: [0, 8, 0],
                    opacity: [1, 0.7, 1]  
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  →
                </motion.span>
              </motion.button>
              
              {/* Pulsing circle animation behind the button - simplified for performance */}
              <motion.div
                className="absolute z-[-1] rounded-full"
                style={{ 
                  width: "100%",
                  height: "100%",
                  background: `radial-gradient(circle, ${colors.primaryColor}00 50%, ${colors.primaryColor}20 100%)`,
                }}
                animate={{ 
                  scale: [0.8, 1.3, 0.8],
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}