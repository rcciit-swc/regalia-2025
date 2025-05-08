'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, ExternalLink } from 'lucide-react';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      whileHover={{ y: -10 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden lg:h-[350px] rounded-xl bg-[#220000] border-2 border-yellow-200/20 shadow-xl shadow-black/30">
        {/* Glow effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-yellow-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
        
        {/* Image container */}
        <div className="relative h-[350px] lg:h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#220000] via-transparent to-transparent z-10" />
          
          {/* Image with zoom effect on hover */}
          <motion.div
            className="w-full h-full"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-full object-cover object-top"
            />
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="p-4 relative z-10">
          {/* Name with animated underline */}
          <div className="relative mb-2">
            <h3 className="text-lg font-kagitingan text-yellow-200">{member.name}</h3>
            <motion.div
              className="h-[2px] bg-gradient-to-r from-transparent via-yellow-200/70 to-transparent w-0"
              animate={{ width: isHovered ? '100%' : '40%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Role */}
          <p className="text-sm text-yellow-50/80 italic mb-3">{member.role}</p>
          
        </div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-2 right-2 text-yellow-200/40"
          animate={{ 
            rotate: isHovered ? 90 : 0,
            scale: isHovered ? 1.2 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TeamCard;