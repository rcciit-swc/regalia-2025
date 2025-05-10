'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Phone, Mail, ExternalLink, Star, Award, Sparkles } from 'lucide-react';

interface Member {
  name: string;
  role: string;
  image: string;
  phone?: string;
  email?: string;
  link?: string;
}

const TeamCard = ({ member, index }: { member: Member; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showContactInfo, setShowContactInfo] = useState(false);
  const contactInfoDelay = useRef<NodeJS.Timeout | null>(null);

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

  // Mouse move effect for shine
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  // Contact info timing
  useEffect(() => {
    if (isHovered) {
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

  // Calculate shine gradient position
  const gradientPosition = `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 235, 122, 0.15) 0%, rgba(0, 0, 0, 0) 70%)`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, rotateY: -15 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        ...(isClicked ? controls : {})
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
      className="relative group perspective-1000"
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
          rotateY: isHovered ? 2 : 0,
          rotateX: isHovered ? -2 : 0,
          boxShadow: isHovered 
            ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 180, 0, 0.15), 0 0 2px rgba(255, 225, 0, 0.3)" 
            : "0 10px 30px rgba(0, 0, 0, 0.3)"
        }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden h-[420px] rounded-2xl bg-gradient-to-br from-[#1a0000] via-[#220000] to-[#300505] border-2 border-yellow-100/10 shadow-xl shadow-black/40"
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
            animate={{ width: isHovered ? 60 : 30 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div 
            className="absolute top-0 left-0 w-1 h-16 bg-gradient-to-b from-yellow-200/80 to-transparent"
            animate={{ height: isHovered ? 60 : 30 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Bottom right corner */}
          <motion.div 
            className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-l from-yellow-200/80 to-transparent"
            animate={{ width: isHovered ? 60 : 30 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-1 h-16 bg-gradient-to-t from-yellow-200/80 to-transparent"
            animate={{ height: isHovered ? 60 : 30 }}
            transition={{ duration: 0.4 }}
          />
        </div>
        
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 left-0 h-40 bg-gradient-to-b from-yellow-500/5 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 h-60 bg-gradient-to-t from-purple-900/10 to-transparent" />
        </div>
        
        {/* Image container */}
        <div className="relative h-64 overflow-hidden">
          {/* Image overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#220000] via-transparent to-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/30 z-10" />
          
          {/* Image with zoom effect */}
          <motion.div
            className="w-full h-full"
            animate={{ 
              scale: isHovered ? 1.12 : 1,
              filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)'
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
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles size={18} className="drop-shadow-md" />
          </motion.div>
          
          {/* Subtle pulsing glow effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-yellow-200/10 rounded-full z-10"
            animate={{ 
              width: isHovered ? 200 : 0,
              height: isHovered ? 200 : 0,
              opacity: isHovered ? 0.6 : 0
            }}
            transition={{ duration: 0.5 }}
          />
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
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="text-yellow-200/70"
              >
                <Award size={16} />
              </motion.div>
              <h3 className="text-xl font-kagitingan bg-gradient-to-r from-yellow-100 to-amber-200 bg-clip-text text-transparent">
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
              transition={{ duration: 0.4 }}
            />
          </div>
          
          {/* Role with slight animation */}
          <motion.p 
            className="text-sm text-amber-50/70 font-light italic mb-4"
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
      className="flex items-center gap-2 text-xs text-yellow-100/70"
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
  const particleCount = 20;
  const colors = ["#ffeb7a", "#ffeaab", "#ffcf40", "#ffd152"];
  
  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => {
        const randomAngle = Math.random() * 360;
        const randomDistance = 100 + Math.random() * 100;
        const randomSize = 3 + Math.random() * 12;
        const randomOpacity = 0.5 + Math.random() * 0.5;
        const randomDuration = 0.6 + Math.random() * 1.0;
        const randomDelay = Math.random() * 0.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
            style={{ 
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}`,
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
              scale: 0
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

export default TeamCard;