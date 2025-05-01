'use client';

import React, { useEffect, useState } from 'react';
import { FaInstagram, FaFacebook, FaWhatsapp, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footer = document.getElementById('footer');
    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const socialHover = {
    scale: 1.2,
    rotate: 5,
    transition: { type: 'spring', stiffness: 400 },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer
      id="footer"
      className="relative bg-gradient-to-b from-[#310000] to-[#210000] text-[#F5E1DA] pt-12 pb-4 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <img
          src="/Footer/line.png"
          alt="Decorative Line"
          className="w-full object-cover transform scale-110"
        />
      </div>

      {/* Music notes floating animation */}
      <div className="absolute w-full h-full pointer-events-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute text-yellow-200 opacity-20"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 70}%`,
              fontSize: `${Math.random() * 20 + 20}px`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ♪
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-5 relative z-10">
        {/* First Column: Social Media Icons */}
        <motion.div
          className="flex flex-col items-center md:items-start space-y-6"
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={staggerChildren}
        >
          <motion.h3
            className="text-2xl font-cogley mb-4 text-yellow-200"
            variants={fadeIn}
          >
            Connect With Us
          </motion.h3>

          <motion.div
            className="flex items-center space-x-6"
            variants={staggerChildren}
          >
            <motion.a
              href="https://www.instagram.com/regalia_rcciit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5E1DA] text-4xl md:text-5xl hover:text-pink-400 transition-colors duration-300"
              variants={fadeIn}
              whileHover={socialHover}
            >
              <FaInstagram />
            </motion.a>
            <motion.a
              href="https://www.facebook.com/regalia.rccfests"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5E1DA] text-4xl md:text-5xl hover:text-blue-400 transition-colors duration-300"
              variants={fadeIn}
              whileHover={socialHover}
            >
              <FaFacebook />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Second Column: Menu */}
        <motion.div
          className="text-center"
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={staggerChildren}
        >
          <motion.ul className="flex flex-wrap gap-4 justify-center items-center lg:space-y-2 lg:inline-block  font-antolia font-normal text-xl md:text-2xl lg:text-4xl">
            <motion.li variants={menuItemVariants}>
              <a
                href="/"
                className="hover:text-yellow-200 transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <a
                href="/events"
                className="hover:text-yellow-200 transition-colors duration-300 relative group"
              >
                Events
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <a
                href="/team"
                className="hover:text-yellow-200 transition-colors duration-300 relative group"
              >
                Team
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <a
                href="/gallery"
                className="hover:text-yellow-200 transition-colors duration-300 relative group"
              >
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <a
                href="/contacts"
                className="hover:text-yellow-200 transition-colors duration-300 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </motion.li>
          </motion.ul>
        </motion.div>

        {/* Third Column: Picture and Logo */}
        <motion.div
          className="flex flex-col items-center"
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <motion.img
            src="/Footer/guitar.png"
            alt="Guitar"
            className="w-full max-md:w-[100px] lg:max-w-xs transform hover:scale-105 transition-transform duration-500"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-xl font-cogley text-yellow-200 mb-2">
              Event Dates
            </h3>
            <p className="text-2xl font-antolia font-bold">May 15-17, 2025</p>
            <p className="text-sm font-antolia mt-2">Mark your calendars!</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom "Made with Love" Bar */}
      <motion.div
        className="mt-16 py-4 border-t border-[#F5E1DA] border-opacity-20"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-[#F5E1DA] opacity-80">
            © 2025 Regalia. All rights reserved.
          </p>
          <div className="flex items-center mt-3 md:mt-0">
            <span className="text-sm mr-2">Made with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                color: ['#F5E1DA', '#ff6b6b', '#F5E1DA'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <FaHeart className="text-red-500 inline mx-1" />
            </motion.div>
            <span className="text-sm ml-1">by Tech Team</span>
          </div>
        </div>
      </motion.div>

      {/* CSS for floating animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
