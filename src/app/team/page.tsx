'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Star,
  Sparkles,
  Award,
  Zap,
  Shield,
  Camera,
  Briefcase,
  HeartHandshake,
  Palette,
  Code,
} from 'lucide-react';
import TeamCard from './TeamCard';
import { teams } from '@/utils/constraints/constants/team';

export default function TeamPage() {
  const [animateIn, setAnimateIn] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isChangingTab, setIsChangingTab] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const floatingElements = [
    {
      icon: <Sparkles size={20} className="text-yellow-200/40" />,
      delay: 0.2,
      className: 'top-1/4 left-1/5',
      animation: 'animate-float-slow',
    },
    {
      icon: <Star size={14} className="text-yellow-200/40" />,
      delay: 0.3,
      className: 'bottom-1/4 right-1/4',
      animation: 'animate-float-med',
    },
    {
      icon: <Users size={22} className="text-yellow-200/40" />,
      delay: 0.5,
      className: 'bottom-1/3 left-1/3',
      animation: 'animate-pulse-slow',
    },
  ];

  const handleTabChange = (index: number) => {
    if (index === activeTab) return;
    
    setIsChangingTab(true);
    setTimeout(() => {
      setActiveTab(index);
      setIsChangingTab(false);
    }, 300);
  };

  return (
    <div className="relative min-h-screen mt-14 w-full font-cogley bg-[#220000] py-20 px-4 overflow-hidden">
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
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
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

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-yellow-50/80 text-lg max-w-3xl mx-auto"
          >
            The incredible talents behind Regalia 2025. Our dedicated team members work tirelessly to create an unforgettable cultural extravaganza.
          </motion.p>
        </motion.div>

        {/* Tab-based system */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          {/* Tabs Navigation */}
          <div className="relative mb-12 overflow-hidden">
            <div className="flex flex-nowrap overflow-x-auto pb-4 scrollbar-hide gap-3 md:gap-4 px-2">
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  onClick={() => handleTabChange(index)}
                  className={`relative flex-shrink-0 cursor-pointer group`}
                >
                  <div 
                    className={`relative z-10 flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-300 
                    ${activeTab === index 
                      ? 'bg-gradient-to-b from-yellow-200/20 to-yellow-200/5 text-yellow-200 scale-105 shadow-lg shadow-yellow-900/20' 
                      : 'bg-[#330000]/40 text-yellow-200/60 hover:bg-[#330000]/60'}`}
                  >
                    <div className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${activeTab === index ? 'bg-[#220000]/80 border border-yellow-200/30' : 'bg-[#220000]/40'}`}>
                      {team.icon}
                    </div>
                    <span className="font-antolia text-sm whitespace-nowrap transition-all duration-300">
                      {team.category}
                    </span>
                    
                    {/* Active indicator */}
                    {activeTab === index && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-200"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                  
                  {/* Hover glow effect */}
                  <motion.div 
                    className="absolute inset-0 -z-10 bg-yellow-200/5 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={activeTab === index ? { opacity: 0.5 } : { opacity: 0 }}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Shadow indicators for scrolling */}
            <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-[#220000] to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-[#220000] to-transparent pointer-events-none"></div>
          </div>

          {/* Team members content panels */}
          <div className="relative bg-[#330000]/40 rounded-2xl border border-yellow-200/10 p-6 min-h-[300px] shadow-xl overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute -right-24 -top-24 w-64 h-64 bg-yellow-200/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-yellow-200/5 rounded-full blur-3xl"></div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-px bg-gradient-to-r from-transparent via-yellow-200/40 to-transparent mb-8"
                />
                
                {/* Category title */}
                <h3 className="text-2xl font-antolia text-yellow-200 mb-6">{teams[activeTab].category}</h3>
                
                {/* Team members grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {teams[activeTab].members.map((member, index) => (
                    <TeamCard key={`${teams[activeTab].id}-${index}`} member={member} index={index} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Decorative footer element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animateIn ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative flex justify-center"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: animateIn ? '200px' : 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="h-px bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent mx-auto"
          ></motion.div>
        </motion.div>
      </div>

      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        @keyframes float-med {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
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

        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}