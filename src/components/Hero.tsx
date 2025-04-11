'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const [currentState, setCurrentState] = useState('grid');
  const [highlightedPair, setHighlightedPair] = useState<number[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [randomImageIndex, setRandomImageIndex] = useState(0);

  // Define the sequence of image pairs to highlight
  const highlightSequence = [
    [0, 5],
    [3, 5],
    [1, 3],
    [2, 4],
    [0, 2],
    [1, 4],
  ];

  // Image sources
  const images = [
    '/hero/0.jpeg',
    '/hero/1.jpeg',
    '/hero/2.jpeg',
    '/hero/3.jpeg',
    '/hero/4.jpeg',
    '/hero/5.jpeg',
  ];

  useEffect(() => {
    // Choose a random image index for the final state
    setRandomImageIndex(Math.floor(Math.random() * images.length));

    let currentPairIndex = 0;
    let timeout: NodeJS.Timeout;

    // Start the animation sequence after initial render
    const startSequence = () => {
      timeout = setTimeout(() => {
        if (currentPairIndex < highlightSequence.length) {
          // Highlight the current pair
          setHighlightedPair(highlightSequence[currentPairIndex]);

          // After 375ms, dim the pair
          setTimeout(() => {
            setHighlightedPair([]);

            // Move to the next pair after another 375ms
            setTimeout(() => {
              currentPairIndex++;

              // Show welcome text after the first 2 animations
              if (currentPairIndex === 2) {
                setShowWelcomeText(true);
              }

              if (currentPairIndex < highlightSequence.length) {
                startSequence();
              } else {
                // All pairs have been highlighted, transition to final state
                setCurrentState('final');

                // Set animation complete at the end
                setTimeout(() => {
                  setAnimationComplete(true);
                }, 1500);
              }
            }, 375);
          }, 375);
        }
      }, 375);
    };

    startSequence();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Grid state */}
      {currentState === 'grid' && (
        <div className="grid h-screen w-screen grid-cols-2 grid-rows-3 gap-4 p-4 md:grid-cols-3 md:grid-rows-2 md:gap-12 md:p-20">
          {images.map((src, index) => (
            <motion.div
              key={index}
              className="relative h-full w-full overflow-hidden rounded-2xl"
              initial={{ opacity: 0.28 }}
              animate={{
                opacity: highlightedPair.includes(index) ? 1 : 0.28,
              }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={src || '/placeholder.svg'}
                alt={`Image ${index}`}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Welcome text appears based on showWelcomeText state, independent of currentState */}
      <AnimatePresence>
        {showWelcomeText && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center translate-y-[-10%] md:translate-y-[-15%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center text-center text-[#FFF9E5]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="welcome-text mb-2 font-medium font-calligra leading-none md:mb-4 text-[2.5rem] xs:text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] xl:text-8xl"
                // style={{ fontFamily: "'bits indian calligra', serif" }}
              >
                WELCOME TO
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final state with background image and Regalia text */}
      <AnimatePresence>
        {currentState === 'final' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="absolute inset-0 z-0"
              initial={{
                scale: 3,
                x: '-100%',
                y: '-100%',
                opacity: 0.28,
              }}
              animate={{
                scale: 1,
                x: 0,
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
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
            </motion.div>

            <motion.div className="relative z-10 flex flex-col items-center justify-center text-center text-[#FFF9E5]">
              {/* Welcome text is already shown by the component above */}
              <motion.h1
                className="regalia-text font-antolia font-semibold leading-none text-[3.5rem] xs:text-[4.5rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-9xl"
                // style={{ fontFamily: "'Antolia Buchery', serif" }}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: animationComplete ? 1 : 0,
                  y: animationComplete ? 0 : 50,
                }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                REGALIA 2025
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
