'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Phone, Mail, ExternalLink, Star, Award, Sparkles, ChevronRight, Heart, MessageCircle } from 'lucide-react';
import { teams } from '@/utils/constraints/constants/team';

interface Member {
  name: string;
  role: string;
  image: string;
}

const TeamCard = ({ member, index }: { member: Member; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showContactInfo, setShowContactInfo] = useState(false);
  const contactInfoDelay = useRef<NodeJS.Timeout | null>(null);
  const [activeAchievement, setActiveAchievement] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Update card position for tracking effects
  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });
    }
  }, [isHovered]);

  // Mouse move effect for shine and 3D tilt
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  // Contact info timing
  useEffect(() => {
    if (isHovered && !isFlipped) {
      contactInfoDelay.current = setTimeout(() => {
        setShowContactInfo(true);
      }, 400);
    } else {
      if (contactInfoDelay.current) {
        clearTimeout(contactInfoDelay.current);
      }
      setShowContactInfo(false);
    }
    
    return () => {
      if (contactInfoDelay.current) {
        clearTimeout(contactInfoDelay.current);
      }
    };
  }, [isHovered, isFlipped]);

  // Rotate through achievements
  useEffect(() => {
    if (!isHovered) return;
    
    const interval = setInterval(() => {
      setActiveAchievement(prev => 
        (prev + 1) % (1)
      );
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  // Handle click animation
  const handleClick = () => {
    setIsClicked(true);
    controls.start({
      scale: [1, 0.95, 1.05, 1],
      rotate: [0, -1, 1, 0],
      transition: { duration: 0.4 }
    });
    
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
  };

  // Handle card flip
  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  // Handle card expand
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Handle like action
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Calculate shine gradient position
  const gradientPosition = `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 235, 122, 0.2) 0%, rgba(0, 0, 0, 0) 70%)`;

  // Calculate 3D rotation based on mouse position
  const calculateRotation = () => {
    if (!isHovered || isFlipped) return { rotateX: 0, rotateY: 0 };
    
    const centerX = cardPosition.width / 2;
    const centerY = cardPosition.height / 2;
    
    // Calculate rotation (limited to +/- 8 degrees)
    const rotateY = ((mousePosition.x - centerX) / centerX) * 8;
    const rotateX = -((mousePosition.y - centerY) / centerY) * 8;
    
    return { rotateX, rotateY };
  };

  const { rotateX, rotateY } = calculateRotation();

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, rotateY: -15 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        ...(isClicked ? controls : {}),
        scale: isExpanded ? 1.08 : 1,
      }}
      transition={{ 
        duration: 0.8, 
        delay: 0.08 * index, 
        type: "spring", 
        stiffness: 80 
      }}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`relative group perspective-1000 ${isExpanded ? 'z-50' : 'z-10'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Golden particle burst on click */}
      <AnimatePresence>
        {isClicked && (
          <ParticleBurst />
        )}
      </AnimatePresence>

      {/* Card container with 3D effect */}
      <motion.div
        animate={{
          rotateY: isFlipped ? 180 : rotateY,
          rotateX: isFlipped ? 0 : rotateX,
          boxShadow: isHovered 
            ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 180, 0, 0.15), 0 0 2px rgba(255, 225, 0, 0.3)" 
            : "0 10px 30px rgba(0, 0, 0, 0.3)",
          height: isExpanded ? 500 : 420
        }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden w-full rounded-2xl bg-gradient-to-br from-[#1a0000] via-[#220000] to-[#300505] border-2 border-yellow-100/10 shadow-xl shadow-black/40 transform-style-3d"
      >
        {/* FRONT OF CARD */}
        <motion.div 
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Interactive shine overlay */}
          <motion.div 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ 
              background: isHovered ? gradientPosition : 'none',
            }}
          />
          
          {/* Accent corner borders that animate on hover */}
          <div className="absolute z-10 w-full h-full pointer-events-none">
            {/* Top left corner */}
            <motion.div 
              className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-yellow-200/80 to-transparent"
              animate={{ width: isHovered ? 80 : 30, opacity: isHovered ? 0.9 : 0.7 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div 
              className="absolute top-0 left-0 w-1 h-16 bg-gradient-to-b from-yellow-200/80 to-transparent"
              animate={{ height: isHovered ? 80 : 30, opacity: isHovered ? 0.9 : 0.7 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Bottom right corner */}
            <motion.div 
              className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-l from-yellow-200/80 to-transparent"
              animate={{ width: isHovered ? 80 : 30, opacity: isHovered ? 0.9 : 0.7 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-1 h-16 bg-gradient-to-t from-yellow-200/80 to-transparent"
              animate={{ height: isHovered ? 80 : 30, opacity: isHovered ? 0.9 : 0.7 }}
              transition={{ duration: 0.4 }}
            />
          </div>
          
          {/* Background patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 left-0 h-40 bg-gradient-to-b from-yellow-500/5 to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 h-60 bg-gradient-to-t from-purple-900/10 to-transparent" />
            
            {/* Animated background patterns */}
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{
                backgroundPosition: isHovered ? '100% 100%' : '0% 0%',
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '60px 60px',
              }}
            />
          </div>
          
          {/* Image container */}
          <div className="relative h-72 overflow-hidden">
            {/* Image overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#220000] via-transparent to-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/30 z-10" />
            
            {/* Image with zoom effect */}
            <motion.div
              className="w-full h-full"
              animate={{ 
                scale: isHovered ? 1.15 : 1,
                filter: isHovered ? 'brightness(1.2) contrast(1.1)' : 'brightness(1) contrast(1)'
              }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
            
            {/* Decorative elements over image */}
            <motion.div 
              className="absolute top-3 right-3 text-yellow-200/60 z-20"
              animate={{ 
                rotate: isHovered ? 90 : 0,
                scale: isHovered ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles size={20} className="drop-shadow-lg filter blur-[0.3px]" />
            </motion.div>
            
            {/* Subtle pulsing glow effect */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10"
              animate={{ 
                width: isHovered ? [0, 300, 0] : 0,
                height: isHovered ? [0, 300, 0] : 0,
                opacity: isHovered ? [0, 0.3, 0] : 0,
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
              style={{
                background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)"
              }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 z-10 opacity-0 pointer-events-none"
              animate={{
                opacity: isHovered ? [0, 0.2, 0] : 0,
                backgroundPosition: ['200% 0%', '-200% 0%'],
              }}
              transition={{ 
                opacity: { duration: 1.5, repeat: Infinity },
                backgroundPosition: { duration: 1.5, repeat: Infinity }
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                backgroundSize: '200% 100%',
              }}
            />

            {/* Interactive buttons */}
            <div className="absolute bottom-3 right-3 flex space-x-2 z-20">
              {/* Flip card button */}
              <motion.button
                onClick={handleFlip}
                className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-yellow-100/80 backdrop-blur-sm border border-yellow-200/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10
                }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <motion.div
                  animate={{ rotateY: isHovered ? [0, 180, 360] : 0 }}
                  transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
                >
                  <MessageCircle size={16} />
                </motion.div>
              </motion.button>
              
              {/* Like button */}
              <motion.button
                onClick={handleLike}
                className={`w-8 h-8 ${isLiked ? 'bg-red-900/70' : 'bg-black/50 hover:bg-black/70'} rounded-full flex items-center justify-center text-yellow-100/80 backdrop-blur-sm border border-yellow-200/20`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10
                }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Heart 
                  size={16} 
                  className={isLiked ? 'text-red-400 fill-red-400' : ''} 
                />
              </motion.button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5 relative z-10 pt-6">
            {/* Name with animated decoration */}
            <div className="relative mb-3">
              <motion.div 
                className="flex items-center gap-2"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ 
                    rotate: isHovered ? 360 : 0,
                    scale: isHovered ? [1, 1.2, 1] : 1
                  }}
                  transition={{ 
                    rotate: { duration: 1, ease: "easeInOut" },
                    scale: { duration: 1, repeat: isHovered ? Infinity : 0, repeatDelay: 2 }
                  }}
                  className="text-yellow-200/70"
                >
                  <Award size={18} className="filter drop-shadow-glow" />
                </motion.div>
                <h3 className="text-lg font-kagitingan bg-gradient-to-r from-yellow-100 to-amber-200 bg-clip-text text-transparent">
                  {member.name}
                </h3>
              </motion.div>
              
              {/* Dynamic underline */}
              <motion.div
                className="h-[2px] mt-1 bg-gradient-to-r from-transparent via-yellow-200/70 to-transparent"
                animate={{ 
                  width: isHovered ? '100%' : '50%',
                  background: isHovered 
                    ? 'linear-gradient(to right, transparent, rgba(255,223,0,0.7), transparent)'
                    : 'linear-gradient(to right, transparent, rgba(255,223,0,0.4), transparent)'
                }}
                transition={{ 
                  duration: 0.4,
                  width: { type: "spring", stiffness: 100 }
                }}
              />
            </div>
            
            {/* Role with slight animation */}
            <motion.p 
              className="text-sm text-amber-50/70 font-light italic mb-3"
              animate={{ 
                y: isHovered ? 2 : 0,
                opacity: isHovered ? 0.9 : 0.7 
              }}
              transition={{ duration: 0.3 }}
            >
              {member.role}
            </motion.p>
            
            
          </div>
        </motion.div>
        
        {/* BACK OF CARD */}
        <motion.div 
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1a0000] via-[#220000] to-[#300505] p-6"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/10 via-transparent to-transparent" />
            
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                backgroundSize: '120px 120px',
              }}
            />
          </div>
          
          {/* Back card content */}
          <div className="h-full flex flex-col">
            <div className="mb-4 pb-3 border-b border-yellow-100/10">
              <h3 className="text-lg font-kagitingan bg-gradient-to-r from-yellow-100 to-amber-200 bg-clip-text text-transparent mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-amber-50/70 font-light italic">
                {member.role}
              </p>
            </div>
            
            
            
            {/* Flip back button */}
            <motion.button
              onClick={handleFlip}
              className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-yellow-100/80 backdrop-blur-sm border border-yellow-200/20"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Floating pulse indicators when expanded */}
      {isExpanded && (
        <>
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400/60 z-0"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-yellow-300/60 z-0"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 0.2,
              delay: 0.5
            }}
          />
        </>
      )}
    </motion.div>
  );
};

// Animated contact information item component
const ContactInfoItem = ({ 
  icon, 
  text, 
  delay,
  show
}: { 
  icon: React.ReactNode; 
  text: string; 
  delay: number;
  show: boolean;
}) => {
  return (
    <motion.div 
      className="flex items-center gap-2 text-xs text-yellow-100/70 mb-1"
      initial={{ opacity: 0, x: -10 }}
      animate={{ 
        opacity: show ? 1 : 0, 
        x: show ? 0 : -10 
      }}
      transition={{ 
        duration: 0.3, 
        delay: delay 
      }}
    >
      <span className="text-yellow-200/60">
        {icon}
      </span>
      <span className="truncate">{text}</span>
    </motion.div>
  );
};

// Particle burst effect on click
const ParticleBurst = () => {
  const particleCount = 30;
  const colors = ["#ffeb7a", "#ffeaab", "#ffcf40", "#ffd152", "#ff9d00"];
  
  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => {
        const randomAngle = Math.random() * 360;
        const randomDistance = 100 + Math.random() * 150;
        const randomSize = 3 + Math.random() * 15;
        const randomOpacity = 0.5 + Math.random() * 0.5;
        const randomDuration = 0.6 + Math.random() * 1.2;
        const randomDelay = Math.random() * 0.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{ 
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
              width: randomSize,
              height: randomSize,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: randomOpacity,
              scale: 0.5
            }}
            animate={{ 
              x: `calc(${Math.cos(randomAngle * Math.PI / 180) * randomDistance}px)`,
              y: `calc(${Math.sin(randomAngle * Math.PI / 180) * randomDistance}px)`,
              opacity: 0,
              scale: Math.random() > 0.5 ? 0.1 : 0
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: randomDuration,
              delay: randomDelay,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};

// Add global styles for the component
const globalStyles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .transform-style-3d {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  .styled-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .styled-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  .styled-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.2);
    border-radius: 4px;
  }
  
  .styled-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.3);
  }
  
  .filter-drop-shadow-glow {
    filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5));
  }
`;


export default TeamCard;