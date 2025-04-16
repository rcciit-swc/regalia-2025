'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEvents } from '@/lib/stores/events';

export default function AnimatedEventDetails({ eventname }: { eventname: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { eventsData, eventsLoading } = useEvents();

  const event = eventsData?.find(e => e.name.toLowerCase() === eventname.toLowerCase());

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsVisible(true), 300);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen py-12 overflow-hidden bg-black bg-opacity-90"
      style={{
        background: 'linear-gradient(to bottom, #1a0505, #000000)',
      }}
    >
      <div className="container relative px-4 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-left text-[#FFF9E5] font-antolia sm:text-5xl">
          {event?.title ?? 'Loading...'}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto overflow-hidden rounded-lg shadow-2xl max-w-7xl"
          style={{
            background: '#1a0505',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {!event ? (
            <div className="flex items-center justify-center w-full h-[400px] text-white text-xl">
              Event not found or still loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left - Image */}
              <div className="relative flex items-center justify-center bg-gray-200 aspect-square md:min-h-[600px]">
                {event.image ? (
                  <img src={event.image} alt="Event" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400">Event Image</span>
                )}
              </div>

              {/* Right - Details */}
              <div className="p-8 text-white bg-[#1a0a0a] md:p-12">
                <h2 className="mb-6 text-4xl font-bold tracking-wide font-antolia">
                  {event.title}
                </h2>

                <p className="mb-8 text-xl leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-4 text-xl font-semibold">
                  <p>Prelims: {event.prelimsDate}</p>
                  <p>Finals: {event.finalsDate}</p>
                  <p>Registration Fees: Rs {event.fees}</p>
                  <p>Team Size: {event.teamSize}</p>

                  <div className="pt-4">
                    <p>Coordinators:</p>
                    {event.coordinators.map((name, idx) => (
                      <p key={idx}>{name}</p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-10">
                  <button
                    onClick={() => setIsSoloOpen(true)}
                    className="px-8 py-3 text-lg font-medium text-white transition-all duration-300 border-2 border-white rounded-md hover:bg-white hover:text-black"
                  >
                    Register Now
                  </button>
                  <button className="px-8 py-3 text-lg font-medium text-white transition-all duration-300 border-2 border-white rounded-md hover:bg-white hover:text-black">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
