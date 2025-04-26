'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from './use-media-query';

const AboutUsAnimation: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const [sectionHeight, setSectionHeight] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animation variants
  const bounceVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        bounce: 0.5,
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0.7 },
    animate: {
      opacity: [0.7, 0.9, 0.7],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
      },
    },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const sectionTop =
            sectionRef.current?.getBoundingClientRect().top || 0;
          const sectionBottom =
            sectionRef.current?.getBoundingClientRect().bottom || 0;
          const height = sectionBottom - sectionTop;
          setSectionHeight(height + 100); // Add buffer for padding
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: sectionHeight,
        paddingTop: isMobile ? '70px' : '110px', // Adjust padding dynamically
        height: '100vh',
        maxHeight: '100vh', // Limit the height to 100vh
      }}
      className="relative w-full overflow-hidden"
    >
      {/* Border frame */}
      <div className="absolute inset-2 md:inset-4 rounded-2xl pointer-events-none" />

      {/* Main content container */}
      <div className="relative h-full w-full mx-auto flex flex-col">
        {/* Header */}
        <motion.h1
          className="font-antolia text-3xl text-[#FFF9E5] sm:text-5xl mb-4 sm:mb-10 text-left font-bold md:text-4xl lg:text-5xl uppercase tracking-wider md:mb-12"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          About us
        </motion.h1>

        {/* Recolored and Soft-Bordered Text Box */}
        <motion.div
          className="absolute top-[15%] left-[8%] z-10 max-w-[50%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        >
          <div
            className="relative px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 rounded-xl"
            style={{
              background: '#FFF6D5',
              backdropFilter: 'blur(16.5px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            <p className="text-base md:text-lg lg:text-xl font-extrabold font-cogley text-[#200] leading-relaxed">
              Regalia is the annual cultural fest of RCCIIT, which is a highly
              anticipated event among the college students and faculties. The
              fest is scheduled to be held in the month of May. Regalia 2025
              fest promises to be a The organizing committee of Regalia 2025 has
              put in months of effort and planning to ensure that the fest is a
              grand success and provides a memorable experience for all
              participants. Regalia 2025 promises to be a celebration of art,
              culture, creativity, and talent.
            </p>
          </div>
        </motion.div>

        {/* Camera man container - Absolutely flush to bottom right */}
        <div className="relative flex-1 w-full">
          <motion.div
            className="absolute bottom-0 right-0 z-3"
            variants={bounceVariants}
            initial="initial"
            animate="animate"
            style={{
              width: isMobile ? '40%' : isTablet ? '50%' : '60%',
              maxWidth: '700px',
              minWidth: '300px',
              height: 'auto',
              margin: 0,
              padding: 0,
            }}
          >
            <motion.img
              src="About/man.png"
              alt="Vintage Camera Man"
              className="w-full h-auto object-contain"
              style={{
                margin: 0,
                padding: 0,
                display: 'block',
              }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
            />

            {/* Extended Light Projection */}
            <motion.div
              className="absolute z-0 pointer-events-none"
              variants={glowVariants}
              initial="initial"
              animate="animate"
              style={{
                bottom: '22%',
                left: '-15%',
                width: '120%',
                height: '120%',
                transformOrigin: 'left bottom',
                transform: 'rotate(-39deg)',
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  clipPath: 'polygon(10% -50%, 70% 0%, 50% 100%, 40% 100%)', // Preserve original polygon shape
                  background: '#FFF6D5', // Recolor light projection
                  filter: 'blur(16.5px)', // Apply consistent blur effect
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsAnimation;
