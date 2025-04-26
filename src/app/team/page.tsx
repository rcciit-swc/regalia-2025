'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Music,
  Sparkles,
  Star,
  Clock,
  Construction,
} from 'lucide-react';

export default function TeamComingSoon() {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Decorative floating elements with icons
  const floatingElements = [
    {
      icon: <Music size={20} className="text-yellow-200" />,
      delay: 0.2,
      className: 'top-1/4 left-1/5',
      animation: 'animate-float-slow',
    },
    {
      icon: <Star size={14} className="text-yellow-200" />,
      delay: 0.3,
      className: 'bottom-1/4 right-1/4',
      animation: 'animate-float-med',
    },
    {
      icon: <Sparkles size={18} className="text-yellow-200" />,
      delay: 0.4,
      className: 'top-1/3 right-1/3',
      animation: 'animate-float-reverse',
    },
    {
      icon: <Users size={22} className="text-yellow-200" />,
      delay: 0.5,
      className: 'bottom-1/3 left-1/3',
      animation: 'animate-pulse-slow',
    },
    {
      icon: <Calendar size={16} className="text-yellow-200" />,
      delay: 0.6,
      className: 'top-2/3 right-1/5',
      animation: 'animate-spin-slow',
    },
  ];

  return (
    <div className="relative min-h-screen w-full font-cogley overflow-hidden bg-[#220000] flex items-center justify-center px-4">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-yellow-200/5 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-3/4 h-2/3 bg-gradient-to-tl from-yellow-200/5 to-transparent rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* Decorative dot pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(253, 224, 71, 0.3) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        ></div>

        {/* Floating design elements */}
        {floatingElements.map((el, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: animateIn ? 0.7 : 0 }}
            transition={{ duration: 1, delay: el.delay + 1 }}
            className={`absolute ${el.className} ${el.animation}`}
          >
            {el.icon}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Title with animated border */}
          <div className="relative inline-block mb-8">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: animateIn ? '100%' : '0%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-transparent via-yellow-200 to-transparent"
            ></motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: animateIn ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-kagitingan text-yellow-200 tracking-wider"
            >
              MEET THE TEAM
            </motion.h1>
          </div>

          {/* Coming soon icon and text */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: animateIn ? 1 : 0.8, opacity: animateIn ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-yellow-200/10 rounded-full blur-lg animate-pulse-slow"></div>
              <div className="relative flex items-center justify-center w-full h-full border-4 border-dashed border-yellow-200/40 rounded-full animate-spin-slow">
                <Construction size={48} className="text-yellow-200" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-antolia text-white mb-4">
              <span className="text-yellow-200">COMING</span> SOON
            </h2>
          </motion.div>

          {/* Description text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-12 px-4"
          >
            <p className="text-yellow-50/80 text-lg mb-6">
              We're putting together an incredible team of talented individuals
              who will make Regalia 2025 unforgettable. Check back soon to meet
              the creative minds behind the cultural extravaganza!
            </p>

            <div className="flex items-center justify-center space-x-2 text-yellow-200/70">
              <Clock size={18} />
              <span className="text-sm">Stay tuned for updates</span>
            </div>
          </motion.div>

          {/* Animated decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: animateIn ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative"
          >
            <div className="flex justify-center space-x-4 mb-8">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{
                    height: animateIn ? `${Math.random() * 30 + 10}px` : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.9 + index * 0.1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: Math.random() * 0.5,
                  }}
                  className="w-2 bg-yellow-200/60 rounded-full"
                ></motion.div>
              ))}
            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: animateIn ? '200px' : 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="h-px bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent mx-auto"
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        @keyframes float-med {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-reverse {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-med {
          animation: float-med 4s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
