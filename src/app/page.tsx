'use client';

import { useState, useEffect } from 'react';
import EventSection from '@/components/Events/EventSection';
import Sponsors from '@/components/Sponsors/Sponsors';
import Music from '@/components/Music/Music';
import Hero from '@/components/Hero/Hero';
import RegaliaLoader from '@/components/common/Loader';

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
        <RegaliaLoader />
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
