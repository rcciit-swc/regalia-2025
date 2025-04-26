'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

interface ContactCardProps {
  image: string;
  name: string;
  role: string;
  phone: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  image,
  name,
  role,
  phone,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      id="glowYellow"
      className="profile-card md:w-[350px] w-[250px] rounded-md shadow-xl overflow-hidden relative cursor-pointer snap-start shrink-0 bg-[#210000] flex flex-col items-center justify-center gap-3 transition-all duration-500 group border-4 border-yellow-200/80"
    >
      {/* Animated background particle effects */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-yellow-200 rounded-full"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="avatar w-full pt-5 flex items-center justify-center flex-col gap-1 relative z-10">
        <div
          className="img_container w-full flex items-center justify-center relative z-40 
                       after:absolute after:h-[6px] after:w-full after:bg-yellow-200 after:top-4 
                       after:group-hover:size-[1%] after:delay-300 after:group-hover:delay-0 
                       after:group-hover:transition-all after:group-hover:duration-500 after:transition-all after:duration-500 
                       before:absolute before:h-[6px] before:w-full before:bg-yellow-200 before:bottom-4 
                       before:group-hover:size-[1%] before:delay-300 before:group-hover:delay-0 
                       before:group-hover:transition-all before:group-hover:duration-500 before:transition-all before:duration-500"
        >
          <motion.div
            animate={
              isHovered ? { rotate: [0, -10, 10, -5, 5, 0], scale: 1.05 } : {}
            }
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Image
              src={image}
              alt="profile"
              width={120}
              height={120}
              quality={100}
              className="size-40 z-40 object-cover border-4 border-yellow-200 rounded-full group-hover:border-8 group-hover:transition-all group-hover:duration-500 transition-all duration-500 shadow-lg shadow-yellow-200/20"
            />
            <motion.div
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-200/20 to-yellow-400/20 blur-md z-0"
              animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
            />
          </motion.div>
          <motion.div
            className="absolute bg-yellow-200 z-10 size-[60%] w-full group-hover:size-[1%] group-hover:transition-all group-hover:duration-500 transition-all duration-500 delay-600 group-hover:delay-0"
            animate={isHovered ? { opacity: [0.6, 0.4, 0.6] } : {}}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          />
        </div>
      </div>

      <motion.div
        className="headings *:text-center *:leading-4 z-20 relative"
        animate={isHovered ? { y: -5 } : {}}
        transition={{ duration: 0.3 }}
      >
        <p className="text-xl font-kagitingan font-semibold text-yellow-200 mb-2">
          {name}
        </p>
        <p className="text-sm font-kagitingan font-semibold text-yellow-100/90 mb-2">
          {role}
        </p>
        <Link href={`tel:${phone}`} className="group">
          <div className="flex items-center justify-center gap-2 font-kagitingan mb-1 text-yellow-200/80 hover:text-yellow-200 transition-colors duration-300">
            <FaPhone className="size-3" />
            <p>{phone}</p>
          </div>
        </Link>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent mt-2 mb-3"
        animate={isHovered ? { scaleX: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Cultural pattern at bottom */}
      <div className="w-full h-6 bg-[#210000] relative overflow-hidden">
        <motion.div
          className="absolute inset-0 flex justify-between items-center px-4"
          animate={{ x: [-20, 0, -20] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-yellow-200/30" />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactCard;
