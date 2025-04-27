'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaPhone, FaEnvelope, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import { GiMicrophone, GiLightBulb, GiPalette, GiCrownCoin } from 'react-icons/gi';
import { MdOutlineEmojiEvents, MdGroups } from 'react-icons/md';
import { BsFillGearFill } from 'react-icons/bs';
import { teams } from '@/utils/constraints/constants/team';

// Festival theme colors with improved palette
const festivalColors = {
  primary: "#facc15", // yellow-300
  secondary: "#220000",
  accent: "#ff4500",
  darkBg: "#100000",
  cardBg: "rgba(34, 0, 0, 0.8)",
  gold: "#FFD700",
  amber: "#FFBF00",
};

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState(teams[0].id);
  const [animateCards, setAnimateCards] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Reset card animations when tab changes
    setAnimateCards(false);
    setTimeout(() => {
      setAnimateCards(true);
    }, 100);
  }, [activeTab]);

  // Handle horizontal scrolling for tab navigation
  const handleScroll = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'right' ? 300 : -300;
      tabsContainerRef.current.scrollLeft += scrollAmount;
      setScrollPosition(tabsContainerRef.current.scrollLeft);
    }
  };

  // Mapping icons to team categories with larger size
  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'faculty':
        return <MdGroups size={24} />;
      case 'swc':
        return <RiTeamFill size={24} />;
      case 'convenors':
        return <GiMicrophone size={24} />;
      case 'tech team':
        return <BsFillGearFill size={24} />;
      case 'management':
        return <MdOutlineEmojiEvents size={24} />;
      default:
        return <GiPalette size={24} />;
    }
  };

  // Find active team based on selected tab
  const activeTeam = teams.find(team => team.id === activeTab) || teams[0];
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);
  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -12,
      scale: 1.05,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(250, 204, 21, 0.6)",
      transition: { duration: 0.3 }
    }
  };

  const tabVariants = {
    inactive: { 
      scale: 0.95, 
      opacity: 0.7,
      background: 'rgba(250, 204, 21, 0.03)'
    },
    active: {
      scale: 1,
      opacity: 1,
      background: 'rgba(250, 204, 21, 0.15)',
      color: festivalColors.gold,
      textShadow: "0 0 10px rgba(250, 204, 21, 0.7)"
    },
    hover: {
      scale: 1.05,
      opacity: 1,
      background: 'rgba(250, 204, 21, 0.1)',
      textShadow: "0 0 15px rgba(250, 204, 21, 0.8)"
    }
  };

  // Background particle effect
  const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 70 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 1 + Math.random() * 3,
            height: 1 + Math.random() * 3,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: i % 3 === 0 ? '#FFBF00' : i % 3 === 1 ? '#FFD700' : '#facc15',
            filter: "blur(1px)"
          }}
          animate={{
            y: [0, -Math.random() * 200, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen py-16 px-2 md:px-6 bg-gradient-to-b from-[#220000] to-[#100000] overflow-hidden">
      {/* Add custom font imports */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Italiana&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
      `}</style>
      
      {/* Dynamic particle background effect */}
      <Particles />
      
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-radial from-yellow-500/10 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-radial from-yellow-500/10 to-transparent opacity-70"></div>
        
        {/* Added decorative elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-gradient-radial from-amber-500/5 to-transparent blur-xl"></div>
        <div className="absolute bottom-1/3 right-10 w-40 h-40 rounded-full bg-gradient-radial from-amber-500/5 to-transparent blur-xl"></div>
      </div>
      
      {/* Elegant page header with improved festival styling */}
      <motion.div 
        className="relative z-10 text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="inline-block relative"
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
        >
          {/* Decorative crown icon */}
          <motion.div 
            className="mb-2 flex justify-center"
            animate={{ 
              y: [0, -5, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
            <GiCrownCoin className="text-4xl text-yellow-300 opacity-80" />
          </motion.div>
          
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
          {/* Animated dual underlines */}
          <div className="relative h-4 mt-2 mb-2">
            <motion.div 
              className="h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent mx-auto"
              animate={{ 
                width: ["0%", "70%", "60%", "70%"],
                opacity: [0.5, 1, 0.8, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror"
              }}
              style={{ boxShadow: "0 0 8px #facc15" }}
            />
            <motion.div 
              className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-1"
              animate={{ 
                width: ["0%", "50%", "40%", "50%"],
                opacity: [0.3, 0.7, 0.5, 0.7]
              }}
              transition={{ 
                duration: 4,
                delay: 0.5,
                repeat: Infinity,
                repeatType: "mirror"
              }}
              style={{ boxShadow: "0 0 5px #facc15" }}
            />
          </div>
        </motion.div>
        
        <motion.p 
          className="text-lg md:text-xl mt-4 text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            letterSpacing: "0.03em"
          }}
        >
          The brilliant minds orchestrating <span className="text-yellow-200">REGALIA 2025</span>
        </motion.p>
      </motion.div>

      {/* Tabs navigation with horizontal scroll */}
      <div className="max-w-7xl mx-auto mb-16 relative">
        {/* Scroll indicator arrows */}
        <div className="absolute top-1/2 -left-2 md:left-0 transform -translate-y-1/2 z-20">
          <motion.button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-full bg-yellow-800/20 text-yellow-300 hover:bg-yellow-700/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        </div>
        
        <div className="absolute top-1/2 -right-2 md:right-0 transform -translate-y-1/2 z-20">
          <motion.button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-full bg-yellow-800/20 text-yellow-300 hover:bg-yellow-700/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
        
        {/* Scrollable tabs container */}
        <div 
          ref={tabsContainerRef}
          className="overflow-x-auto pb-2 hide-scrollbar mask-fade-edges relative"
          style={{
            scrollBehavior: 'smooth',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
{/* <style jsx>{`
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .mask-fade-edges {
    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  }
`}</style> */}
          
          <motion.div 
            className="flex space-x-2 px-4 py-2 min-w-max"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {teams.map((team) => (
              <motion.button
                key={team.id}
                onClick={() => setActiveTab(team.id)}
                className={`px-5 py-3 rounded-lg flex items-center gap-2 text-base font-medium transition-all`}
                variants={tabVariants}
                initial="inactive"
                animate={activeTab === team.id ? "active" : "inactive"}
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
                style={{ 
                  color: activeTab === team.id ? festivalColors.gold : '#ffffff',
                  fontFamily: "'Montserrat', sans-serif",
                  border: `1px solid ${activeTab === team.id ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.15)'}`,
                  minWidth: '140px',
                  justifyContent: 'center'
                }}
              >
                {getCategoryIcon(team.category)}
                <span>{team.category}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
        
        {/* Decorative line below tabs */}
        <motion.div 
          className="h-px bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent mx-4 mt-1"
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Team Category Title */}
      <motion.div 
        className="text-center mb-12"
        key={`title-${activeTab}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        <h2 
          className="text-3xl md:text-4xl font-semibold text-yellow-200"
          style={{ 
            fontFamily: "'Cormorant', serif",
            textShadow: "0 0 15px rgba(250, 204, 21, 0.3)"
          }}
        >
          {activeTeam.category}
        </h2>
        
        <motion.div 
          className="h-0.5 w-24 mx-auto mt-3 bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent"
          animate={{ width: [0, 96] }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>

      {/* Team members grid with enhanced animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="max-w-7xl mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={animateCards ? "visible" : "hidden"}
          >
            {activeTeam.members.map((member, index) => (
              <motion.div
                key={`${member.name}-${index}`}
                className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#2c0101] to-[#100000] border border-yellow-500/20"
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredMember(index)}
                onHoverEnd={() => setHoveredMember(null)}
                style={{ 
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(250, 204, 21, 0.15)"
                }}
              >
                {/* Card inner glow effect on hover */}
                <motion.div 
                  className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
                  animate={{ opacity: hoveredMember === index ? 0.18 : 0 }}
                  style={{ 
                    boxShadow: "inset 0 0 30px #facc15",
                    background: "radial-gradient(circle at center, rgba(250, 204, 21, 0.15) 0%, transparent 70%)"
                  }}
                />

                {/* Image container with enhanced overlay effects */}
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  
                  {/* Image overlay gradient for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#220000] via-[rgba(34,0,0,0.7)] to-transparent opacity-90"></div>
                  
                  {/* Animated spotlight effect on hover */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: hoveredMember === index ? 0.6 : 0,
                      background: 'radial-gradient(circle at center, rgba(250, 204, 21, 0.2) 0%, transparent 70%)'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/30"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/30"></div>
                </div>

                {/* Member information with enhanced animations */}
                <motion.div 
                  className="p-5 text-center relative z-10"
                  animate={{ 
                    y: hoveredMember === index ? -5 : 0,
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.h3 
                    className="text-2xl font-bold text-yellow-300 mb-1"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
                    }}
                  >
                    {member.name}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-white/80 text-sm mb-4"
                    style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.03em" }}
                  >
                    {member.role}
                  </motion.p>
                  
                  {/* Social links */}
                  <motion.div 
                    className="flex justify-center space-x-3 mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Phone with icon */}
                    {member.phone && (
                      <motion.a
                        href={`tel:${member.phone}`}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
                        whileHover={{ scale: 1.15, background: 'rgba(250, 204, 21, 0.3)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPhone className="text-yellow-200 text-xs" />
                      </motion.a>
                    )}
                    
                    {/* Example social links that could be added to member data */}
                    <motion.a
                      href="#"
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
                      whileHover={{ scale: 1.15, background: 'rgba(250, 204, 21, 0.3)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaInstagram className="text-yellow-200 text-sm" />
                    </motion.a>
                    
                    <motion.a
                      href="#"
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
                      whileHover={{ scale: 1.15, background: 'rgba(250, 204, 21, 0.3)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaLinkedinIn className="text-yellow-200 text-sm" />
                    </motion.a>
                  </motion.div>
                </motion.div>
                
                {/* Decorative border accent */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
                  animate={{ 
                    opacity: hoveredMember === index ? 1 : 0.3,
                    width: hoveredMember === index ? "100%" : "80%"
                  }}
                  style={{ margin: "0 auto" }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      {/* Festival-themed decorative footer */}
      <div className="max-w-7xl mx-auto mt-20 relative">
        <motion.div 
          className="h-px bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent"
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        
        <motion.div
          className="flex justify-center mt-8 opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="mx-3"
            animate={{ 
              y: [0, -5, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.2
            }}
          >
            <GiLightBulb className="text-yellow-300 text-2xl" />
          </motion.div>
          
          <motion.div
            className="mx-3"
            animate={{ 
              y: [0, -5, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.5
            }}
          >
            <RiTeamFill className="text-yellow-300 text-2xl" />
          </motion.div>
          
          <motion.div
            className="mx-3"
            animate={{ 
              y: [0, -5, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.8
            }}
          >
            <GiMicrophone className="text-yellow-300 text-2xl" />
          </motion.div>
        </motion.div>
        
        <motion.p
          className="text-center text-white/50 text-sm mt-6"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          REGALIA 2025 • The Grand Festival
        </motion.p>
      </div>
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