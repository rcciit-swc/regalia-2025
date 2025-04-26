'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as Tone from 'tone';

const INITIAL_NOTES = [
  'G4',
  'B4',
  'G4',
  'A4',
  'G4',
  'B4',
  'A4',
  'G4',
  'B4',
  'G4',
  'A4',
  'G4',
  'B4',
  'B4',
  'C5',
  'D5',
  'G5',
  'F#5',
  'E5',
  'D5',
  'B4',
  'C5',
  'D5',
  'G5',
  'F#5',
  'E5',
  'D5',
  'A4',
  'B4',
  'C5',
  'C5',
  'C5',
  'E5',
  'D5',
  'D5',
];

const NOTE_POSITIONS: Record<string, number> = {
  C4: 80,
  'C#4': 76,
  D4: 72,
  'D#4': 68,
  E4: 64,
  F4: 60,
  'F#4': 56,
  G4: 52,
  'G#4': 48,
  A4: 44,
  'A#4': 40,
  B4: 36,
  C5: 32,
  'C#5': 28,
  D5: 24,
  'D#5': 20,
  E5: 16,
  F5: 12,
  'F#5': 8,
  G5: 4,
  'G#5': 0,
  A5: -4,
  'A#5': -8,
  B5: -12,
  C6: -16,
};

// Musical note HTML entities for different note types
const NOTE_SYMBOLS = {
  QUARTER_NOTE: '♩', // Unicode: U+2669
  HALF_NOTE: '𝅗𝅥', // Unicode: U+1D15D
  WHOLE_NOTE: '𝅝', // Unicode: U+1D15D
};

export default function MusicSheet() {
  const synthRef = useRef<Tone.Synth | null>(null);
  const [allNotes, setAllNotes] = useState(INITIAL_NOTES);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const visibleNotes = useMemo(() => {
    const visibleCount = 16;
    return Array.from({ length: visibleCount }, (_, i) => {
      const index = (visibleStartIndex + i) % allNotes.length;
      return allNotes[index];
    });
  }, [allNotes, visibleStartIndex]);

  const initSynth = async () => {
    if (!isInitialized) {
      try {
        await Tone.start();
        synthRef.current = new Tone.Synth({
          oscillator: {
            type: 'sine',
          },
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.5,
            release: 0.08,
          },
        }).toDestination();
        synthRef.current.volume.value = -12;
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  const handleNoteClick = async (index: number) => {
    if (!isInitialized) {
      await initSynth();
    }

    if (synthRef.current && index >= 0 && index < visibleNotes.length) {
      const playedNote = visibleNotes[index];
      try {
        synthRef.current.triggerAttackRelease(playedNote, '8n');
        setVisibleStartIndex((prev) => (prev + 1) % allNotes.length);
      } catch (error) {
        console.error('Failed to play note:', error);
      }
    }
  };

  return (
    <div className="music-container w-full">
      <div className="bg-[#f5f0e1] flex items-center relative h-[130px] sm:h-[180px] w-full shadow-xl overflow-hidden">
        <div
          className="text-[100px] sm:text-[120px] text-black mr-8"
          style={{ marginTop: '-10px' }}
        >
          &#119070;
        </div>

        <div className="flex-1 flex flex-col justify-between h-[80px] sm:text-[100px] relative">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="h-[1.5px] bg-black w-full" />
          ))}

          <div className="absolute w-full flex justify-around items-end h-full">
            {visibleNotes.map((note, idx) => (
              <div
                key={`${note}-${idx}-${visibleStartIndex}`}
                className="group relative cursor-pointer"
                onClick={() => handleNoteClick(idx)}
              >
                <div
                  className="text-[100px] text-black hover:text-gray-700 transition-colors"
                  style={{
                    position: 'relative',
                    top: `${NOTE_POSITIONS[note]}px`,
                    transform: 'translateY(+5%)',
                    fontFamily: 'serif',
                  }}
                >
                  {NOTE_SYMBOLS.QUARTER_NOTE}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
