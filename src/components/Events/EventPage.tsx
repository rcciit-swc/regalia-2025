'use client';

import React, { useEffect, useState, useRef } from 'react';
import EventCard from './EventsCard';
import { useEvents } from '@/lib/stores';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Calendar,
  Users,
  Search,
  ArrowRight,
  Star,
  Filter,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const EventPage = () => {
  const { eventsData, eventsLoading } = useEvents();
  const [showIntro, setShowIntro] = useState(true);
  const [animateItems, setAnimateItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    if (!showIntro && !animateItems) {
      setTimeout(() => {
        setAnimateItems(true);
      }, 300);
    }

    return () => clearTimeout(timer);
  }, [showIntro, animateItems]);

  const renderBackgroundParticles = () => {
    return Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className="absolute rounded-full bg-yellow-300/10"
        style={{
          width: Math.random() * 6 + 2,
          height: Math.random() * 6 + 2,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: Math.random() * 5 + 10,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      />
    ));
  };

  const filteredEvents = eventsData
    ? eventsData.filter((event) => {
        return event.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : [];

  if (eventsLoading || showIntro) {
    return (
      <div className="fixed inset-0 bg-[#210000] text-[#E8D0C9] overflow-hidden z-50">
        <div className="absolute inset-0 overflow-hidden">
          {renderBackgroundParticles()}

          <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full bg-gradient-to-br from-[#5A0000]/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-tr-full bg-gradient-to-tl from-[#3A0000]/40 to-transparent"></div>
        </div>

        <AnimatePresence>
          {showIntro && (
            <motion.div
              className="relative z-10 h-full w-full flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative flex flex-col items-center">
                <motion.div
                  className="w-28 h-28 rounded-full border-2 border-yellow-300/50 flex items-center justify-center mb-8"
                  animate={{
                    scale: [1, 1.1, 1],
                    borderColor: [
                      'rgba(252,211,77,0.5)',
                      'rgba(252,211,77,0.8)',
                      'rgba(252,211,77,0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="text-yellow-300"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Music size={40} />
                  </motion.div>
                </motion.div>

                <motion.h1
                  className="text-4xl md:text-6xl font-serif text-[#E8D0C9] mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Festival Events
                </motion.h1>

                <motion.div
                  className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />

                <motion.div
                  className="mt-8 w-64 h-2 bg-[#3A0000] rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#5A0000] to-yellow-300/70"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 3, ease: 'easeInOut' }}
                    onAnimationComplete={() => setShowIntro(false)}
                  />
                </motion.div>

                <motion.button
                  className="mt-6 px-6 py-2 text-sm bg-[#3A0000] border border-yellow-300/30 text-[#E8D0C9] rounded-full hover:border-yellow-300/70 transition-all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => setShowIntro(false)}
                >
                  Skip Intro
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-10 from-[#210000] to-[#1A0000] text-[#E8D0C9] relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderBackgroundParticles()}

        <div className="absolute top-0 right-0 w-96 h-96 rounded-bl-full bg-gradient-to-br from-[#5A0000]/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-tr-full bg-gradient-to-tl from-[#5A0000]/20 to-transparent"></div>

        <div className="absolute left-1/4 top-1/4 w-64 h-64 rounded-full bg-yellow-300/5 backdrop-blur-3xl"></div>
        <div className="absolute right-1/3 bottom-1/4 w-48 h-48 rounded-full bg-yellow-300/5 backdrop-blur-3xl"></div>
      </div>

      {/* Hero section */}
      <motion.div
        ref={heroRef}
        className="relative pt-16  border-b border-[#E8D0C9]/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative z-10 py-8">
            <motion.div
              className="flex flex-col items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <motion.div
                  className="h-px w-12 bg-yellow-300/50"
                  animate={{ width: [12, 48, 12] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <Music className="h-8 w-8 text-yellow-300/80" />
                <motion.div
                  className="h-px w-12 bg-yellow-300/50"
                  animate={{ width: [12, 48, 12] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                />
              </div>

              <motion.h1
                className="text-5xl md:text-6xl font-serif text-center mb-4 tracking-wide text-[#E8D0C9]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Festival Events
              </motion.h1>

              <motion.div
                className="h-1 w-48 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent mb-8"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              />

              <motion.div
                className="w-full max-w-3xl mx-auto mb-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#3A0000]/70 border border-[#E8D0C9]/20 rounded-full px-5 py-3 text-[#E8D0C9] placeholder-[#E8D0C9]/50 focus:outline-none focus:border-yellow-300/50 transition-all"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#E8D0C9]/50 h-5 w-5" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Events grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-medium mb-2 text-[#E8D0C9]">
            All Events
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-yellow-300/50 to-transparent"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  animateItems ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/events/${event.id}`}
                  className="block hover:scale-[1.02] transition-transform duration-300"
                >
                  <EventCard
                    name={event.name}
                    image_url={event.image_url}
                    registration_fees={event.registration_fees}
                    registered={event.registered}
                    schedule={event.schedule}
                    eventID={event.id!}
                  />
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full py-16 flex flex-col items-center justify-center border border-[#E8D0C9]/10 rounded-xl bg-[#3A0000]/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Search className="h-12 w-12 text-[#E8D0C9]/40 mb-4" />
              <h3 className="text-xl font-medium text-[#E8D0C9]/70 mb-2">
                No events found
              </h3>
              <p className="text-[#E8D0C9]/50 text-center max-w-md px-4">
                We couldn't find any events matching your search.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-2 bg-[#5A0000] border border-[#E8D0C9]/20 rounded-full text-[#E8D0C9] hover:border-yellow-300/50 transition-all"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer accent */}
      <div className="py-12 border-t border-[#E8D0C9]/10 bg-gradient-to-t from-[#1A0000] to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center">
          <motion.div
            className="flex items-center gap-3 mb-4"
            animate={{
              y: [0, -5, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="h-px w-12 bg-yellow-300/30"></div>
            <Music className="h-6 w-6 text-yellow-300/60" />
            <div className="h-px w-12 bg-yellow-300/30"></div>
          </motion.div>
          <p className="text-[#E8D0C9]/60 text-center text-sm mb-2">
            Join us for unforgettable experiences
          </p>
          <p className="text-[#E8D0C9]/40 text-center text-xs">
            © {new Date().getFullYear()} Festival Events
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
