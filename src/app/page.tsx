"use client"

import { useState, useEffect } from 'react';
import EventSection from '@/components/Events/EventSection';
import Sponsors from '@/components/Sponsors/Sponsors';
import Music from '@/components/Music/Music';
import Hero from '@/components/Hero/Hero';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Set timeout to hide intro after 4 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    // Clean up timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showIntro ? (
        <div className="min-h-screen w-full flex justify-center items-center bg-black text-[#E8D0C9]">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => setShowIntro(false)}
          >
            <source src="/loader.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <>
          <Hero />
          <Music />
          <EventSection />
          <Sponsors />
        </>
      )}
    </>
  );
}