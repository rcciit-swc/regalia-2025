"use client"
import Image from "next/image"
import MusicSheet from "./MusicSheet"
import { motion } from "framer-motion"
import VinylPlayer from "./vinyl-player"
import { useEffect, useState } from "react"

export default function Music() {
  // Add responsive size state based on window width
  const [playerSize, setPlayerSize] = useState(200);

  // Effect to handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // mobile
        setPlayerSize(150);
      } else if (width < 768) { // small tablet
        setPlayerSize(250);
      } else if (width < 1024) { // tablet
        setPlayerSize(250);
      } else { // desktop
        setPlayerSize(250);
      }
    };

    // Set initial size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="mx-auto py-6 relative overflow-hidden">
      <div className="flex flex-col gap-8">
        {/* Top section with title and visuals at the same level */}
        <div className="flex flex-row items-center justify-between relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative ml-[-1rem] border-r-[3px] border-y-[3px] border-[#f5f0e1] rounded-r-[50px] pr-6 py-6 md:pr-8 md:py-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cogley pl-6 pr-4 sm:pr-6 md:pr-8">
              Celebrating 25 <br />years of RCCIIT
            </h1>
          </motion.div>

          {/* Centered flower */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 transform -translate-x-1/2"
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
            className="relative pr-4"
          >
            <Image
              src="/music/guitar.svg"
              alt="Decorative guitar"
              width={200}
              height={200}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-[250px] lg:h-[250px]"
            />
          </motion.div>
        </div>

        {/* Music staff section */}
        <MusicSheet/>

        {/* Date section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-row items-center justify-between relative gap-4 p-8"
        >
          <VinylPlayer
            size={playerSize}
            youtubeVideoLink="https://youtu.be/xRbIU4ZD1Tk?si=yG3DqQNup_tzOEyR"
            volume={80}
            className="md:transform md:scale-110 lg:scale-125"
          />
          <div className="flex flex-col items-center justify-center text-center">
          <h2 className="font-['Cogley'] font-normal text-xl sm:text-2xl md:text-4xl lg:text-[60px] leading-none text-center flex-1">
            2, 3 & 4 May, 2025
          </h2>
          <div className="flex items-center mt-1 w-3/5 justify-center">
            <div className="h-2 bg-white w-full"></div>
            <div className="w-8 h-8 rotate-45 bg-white min-w-[2rem]"></div>
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
