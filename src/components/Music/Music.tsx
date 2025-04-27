'use client';
import Image from 'next/image';
import MusicSheet from './MusicSheet';
import { motion } from 'framer-motion';
import VinylPlayer from './vinyl-player';
import { useEffect, useState, useRef } from 'react';

export default function Music() {
  // Add responsive size state based on window width
  const [playerSize, setPlayerSize] = useState(200);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Effect to handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // mobile
        setPlayerSize(200);
      } else {
        setPlayerSize(250);
      }
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Setup intersection observer for animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Floating animation for decorative elements
  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div ref={sectionRef} className="mx-auto py-12 relative overflow-hidden">
      {/* Background musical notes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            className="absolute text-gray-200 opacity-10"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={
              isVisible
                ? {
                    x: [
                      `${Math.random() * (i % 2 === 0 ? 100 : 0)}%`,
                      `${Math.random() * 100}%`,
                    ],
                    y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    opacity: 0.1,
                    rotate: [0, 360],
                  }
                : {}
            }
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.5,
            }}
            style={{ fontSize: `${30 + i * 10}px` }}
          >
            {['♪', '♫', '♩', '♬', '𝄞'][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-10">
        {/* Top section with title and visuals at the same level */}
        <div className="flex flex-row items-center justify-between relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            className="relative ml-[-1rem] border-r-[3px] border-y-[3px] border-[#f5f0e1] rounded-r-[50px] pr-6 py-6 md:pr-8 md:py-8 shadow-lg"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cogley pl-6 pr-4 sm:pr-6 md:pr-8 bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent">
              Celebrating 25 <br />
              years of RCCIIT
            </h1>
          </motion.div>

          {/* Centered flower */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, repeatType: 'reverse' },
            }}
            className="absolute left-1/2 transform -translate-x-1/2 drop-shadow-lg"
          >
            <Image
              src="/music/flower.png"
              alt="White flower"
              width={250}
              height={250}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-[180px] lg:h-[180px]"
            />
          </motion.div>

          {/* Guitar on right */}
          <motion.div
            variants={floatAnimation}
            initial="initial"
            animate="animate"
            className="relative pr-0 sm:pr-4"
          >
            <Image
              src="/music/guitar.svg"
              alt="Decorative guitar"
              width={200}
              height={200}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-[250px] lg:h-[250px] drop-shadow-xl"
            />
          </motion.div>
        </div>

        {/* About Section */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="relative mx-4 md:mx-12 my-8 p-6 md:p-10 rounded-2xl bg-gradient-to-br from-[#2a0000] to-[#000000] border border-amber-900/30 shadow-2xl"
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 md:w-32 md:h-32 opacity-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <Image
                src="/music/flower.png"
                alt="Decorative flower"
                width={150}
                height={150}
                className="w-full h-full"
              />
            </motion.div>
          </div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-cogley mb-6 text-amber-200"
          >
            About Regalia
          </motion.h2>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="space-y-4 text-gray-100"
          >
            <motion.p variants={fadeInUp} className="leading-relaxed">
              Regalia is the annual cultural fest of RCCIIT, which is a highly
              anticipated event among the college students and faculties. The
              fest is scheduled to be held in the month of May.
            </motion.p>

            <motion.p variants={fadeInUp} className="leading-relaxed">
              Regalia 2025 fest promises to be an exciting and colorful
              extravaganza of
              <span className="text-amber-200 font-semibold">
                {' '}
                music, dance, drama, fashion show{' '}
              </span>
              and more. There will be a wide range of events and activities,
              including a fashion show, a group dance competition, a battle of
              bands, a singing competition and more.
            </motion.p>

            <motion.p variants={fadeInUp} className="leading-relaxed">
              The fest will also feature performances by renowned artists and
              celebrities. The organizing committee of Regalia 2025 has put in
              months of effort and planning to ensure that the fest is a grand
              success and provides a memorable experience for all participants.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="leading-relaxed font-semibold text-amber-100"
            >
              Regalia 2025 promises to be a celebration of art, culture,
              creativity, and talent.
            </motion.p>
          </motion.div>

          <motion.div
            className="absolute -bottom-3 -left-3 md:-bottom-5 md:-left-5"
            variants={floatAnimation}
            initial="initial"
            animate="animate"
          >
            {/* <Image
              src="/music/music-note.svg"
              alt="Music note"
              width={60}
              height={60}
              className="w-16 h-16 md:w-20 md:h-20 opacity-30"
            /> */}
          </motion.div>
        </motion.div>

        {/* Music staff section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <MusicSheet />
        </motion.div>

        {/* Date section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-row items-center justify-between relative gap-4 p-8 sm:p-16 bg-[#130000]/30 rounded-xl backdrop-blur-sm mx-4 shadow-lg"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <VinylPlayer
              size={playerSize}
              volume={50}
              youtubeVideoLink="https://youtu.be/xLJixpEej8A"
              className="transform scale-110 sm:scale-115 lg:scale-125 drop-shadow-2xl"
            />
          </motion.div>

          <div className="flex flex-col items-center justify-center text-center">
            <motion.h2
              className="font-['Cogley'] font-normal text-xl sm:text-2xl md:text-4xl lg:text-[60px] leading-none text-center flex-1 bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent"
              animate={{
                textShadow: [
                  '0 0 5px rgba(255,255,255,0.3)',
                  '0 0 15px rgba(255,255,255,0.5)',
                  '0 0 5px rgba(255,255,255,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              15, 16 & 17 May, 2025
            </motion.h2>
            <motion.div
              className="flex items-center mt-1 w-3/5 justify-center"
              whileHover={{ width: '70%' }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-2 bg-gradient-to-r from-amber-200 to-white w-full"></div>
              <div className="w-8 h-8 rotate-45 bg-white min-w-[2rem] shadow-lg"></div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#3a0000' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="mt-8 px-8 py-3 bg-[#210000] border border-amber-200/50 rounded-full text-white font-medium shadow-lg"
            >
              Mark Your Calendar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
