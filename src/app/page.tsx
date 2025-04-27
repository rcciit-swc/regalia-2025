'use client';

import { useState, useEffect } from 'react';
import EventSection from '@/components/Events/EventSection';
import Sponsors from '@/components/Sponsors/Sponsors';
import Music from '@/components/Music/Music';
import Hero from '@/components/Hero/Hero';
import RegaliaLoader from '@/components/common/Loader';
import { useUser } from '@/lib/stores';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const { isLoaded, setLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      setShowIntro(false); 
      return;
    }

    const timer = setTimeout(() => {
      setShowIntro(false);
      setLoaded(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isLoaded, setLoaded]);

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
