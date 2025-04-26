'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
} from 'lucide-react';

interface EventCardProps {
  name: string;
  image_url: string;
  registration_fees: number;
  registered?: boolean;
  schedule: string;
}

const EventCard = ({
  name,
  image_url,
  registration_fees,
  schedule,
  registered = false,
}: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number; size: number }[]
  >([]);

  // Generate sparkle effect when registered
  useEffect(() => {
    if (registered) {
      const newSparkles = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
      }));
      setSparkles(newSparkles);
    }
  }, [registered]);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl border border-yellow-300/30 bg-gradient-to-b from-[#5A0000] to-[#3A0000] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -8,
        boxShadow: '0 0 25px rgba(255,215,0,0.3)',
        borderColor: 'rgba(255,215,0,0.5)',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Premium banner if price is above 1000 */}
      {registration_fees > 1000 && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-xs font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg flex items-center gap-1 shadow-lg">
            <Star size={12} className="text-black" />
            PREMIUM
          </div>
        </div>
      )}

      {/* Image container with animated overlay */}
      <div className="relative w-full h-52 sm:h-64 overflow-hidden">
        <Image
          src={image_url || '/placeholder.svg'}
          alt={name || 'Event image'}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          priority={true}
        />

        {/* Gradient overlay with enhanced effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#3A0000] via-[#3A0000]/60 to-transparent opacity-90"
          animate={{
            opacity: isHovered ? 0.7 : 0.9,
            background: isHovered
              ? 'linear-gradient(to top, rgba(58,0,0,1), rgba(58,0,0,0.4), transparent)'
              : 'linear-gradient(to top, rgba(58,0,0,1), rgba(58,0,0,0.6), transparent)',
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Decorative corner elements */}
        <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-yellow-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-yellow-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Magic dust particles */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`dust-${i}`}
                className="absolute rounded-full bg-yellow-200"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  y: [0, -40],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0.5],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content with improved styling */}
      <div className="p-6 border-t border-[#E8D0C9]/10 bg-gradient-to-b from-[#4A0000] to-[#3A0000] relative">
        {/* Decorative accents */}
        <motion.div
          className="absolute -top-3 left-1/2 w-32 h-1 -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent"
          animate={{
            width: isHovered ? '80%' : '40%',
            opacity: isHovered ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Name with animated underline */}
        <div className="mb-4">
          <h3 className="text-xl font-serif font-bold text-[#E8D0C9] line-clamp-2 min-h-[56px] relative">
            {name}
            <motion.div
              className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-yellow-300/60 to-transparent"
              initial={{ width: '0%' }}
              animate={{ width: isHovered ? '100%' : '0%' }}
              transition={{ duration: 0.4 }}
            />
          </h3>
        </div>

        {/* Event details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-[#E8D0C9]/80">
            <Calendar size={16} className="mr-2 text-yellow-300/80" />
            <span className="text-sm">{parse(schedule)}</span>
          </div>

          {/* <div className="flex items-center text-[#E8D0C9]/80">
            <Users size={16} className="mr-2 text-yellow-300/80" />
            <span className="text-sm">{participants} participants</span>
          </div> */}

          <div className="flex items-center mt-2">
            <Award size={16} className="mr-2 text-yellow-300" />
            <span className="text-lg font-bold text-yellow-300">
              ₹{registration_fees}
            </span>
          </div>
        </div>

        {/* Register button with animations */}
        <motion.button
          disabled={registered}
          className={`w-full py-3 rounded-md font-serif text-lg transition-all relative overflow-hidden ${
            registered
              ? 'bg-[#5A3000]/30 text-[#E8D0C9]/70 cursor-not-allowed border border-[#E8D0C9]/10 flex items-center justify-center'
              : 'bg-gradient-to-r from-[#5A0000] to-[#3A0000] text-[#E8D0C9] border border-yellow-300/50 hover:border-yellow-300 active:scale-[0.98]'
          }`}
          whileHover={
            !registered
              ? {
                  backgroundColor: '#E8D0C9',
                  color: '#3A0000',
                  borderColor: '#E8D0C9',
                }
              : {}
          }
          whileTap={!registered ? { scale: 0.98 } : {}}
        >
          {registered ? (
            <>
              <CheckCircle size={18} className="mr-2 text-green-300" />
              Registered
              {/* Sparkle effect for registered button */}
              {sparkles.map((spark) => (
                <motion.div
                  key={`sparkle-${spark.id}`}
                  className="absolute rounded-full bg-yellow-200"
                  style={{
                    width: spark.size,
                    height: spark.size,
                    top: `${spark.y}%`,
                    left: `${spark.x}%`,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: spark.id * 0.2,
                    repeatDelay: 3,
                  }}
                />
              ))}
            </>
          ) : (
            <motion.div
              className="flex items-center justify-center w-full relative"
              initial={false}
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              Register Now
              <ArrowRight
                size={18}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/20 to-yellow-300/0"
                initial={{ x: '-100%' }}
                animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
              />
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Animated corner embellishment */}
      <motion.div
        className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300/40 to-yellow-600/0 opacity-0 group-hover:opacity-100"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={
          isHovered ? { scale: 1, opacity: 0.6 } : { scale: 0.5, opacity: 0 }
        }
        transition={{ duration: 0.4 }}
      />

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.2) inset',
        }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Registered badge */}
      {registered && (
        <motion.div
          className="absolute top-0 left-0 bg-green-700/80 text-white text-xs py-1 px-3 rounded-br-lg backdrop-blur-sm flex items-center gap-1"
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Sparkles size={12} className="text-yellow-300" />
          <span>REGISTERED</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EventCard;
