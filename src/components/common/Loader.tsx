'use client';
import { useState, useEffect } from 'react';
import { Music, Star, Sparkles } from 'lucide-react';

export default function RegaliaLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#2d0000] to-[#100000] z-50">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-yellow-500 opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-red-600 opacity-10 blur-3xl animate-pulse"></div>

        {/* Floating musical notes and stars */}
        <div className="absolute top-1/4 left-1/5 animate-bounce duration-3000 opacity-30">
          <Music size={24} className="text-yellow-300" />
        </div>
        <div className="absolute top-2/3 right-1/4 animate-ping duration-2000 opacity-20">
          <Star size={16} className="text-yellow-300" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-pulse duration-4000 opacity-20">
          <Sparkles size={20} className="text-yellow-300" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-bounce duration-5000 opacity-30">
          <Music size={18} className="text-yellow-300" />
        </div>
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with glow effect */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
          <div className="w-64 h-64 relative">
            <img
              src="https://i.postimg.cc/dQZZWTRd/regalia-2025-2.png"
              alt="Regalia 2025"
              className={`w-full h-full object-contain drop-shadow-2xl rounded-full ${loading ? 'animate-pulse' : ''}`}
            />

            {/* Rotating outer ring */}
            <div className="absolute inset-0 w-full h-full border-4 border-dashed border-yellow-300/30 rounded-full animate-spin-slow"></div>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading text with animated dots */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2 font-cogley tracking-wider">
            REGALIA 2025
          </h2>
          <h2 className="text-sm font-bold text-white mb-2 font-antolia tracking-wider">
            RESURRECTION REUNITED REBELLION
            <span className="inline-block animate-pulse">.</span>
            <span className="inline-block animate-pulse delay-150">.</span>
            <span className="inline-block animate-pulse delay-300">.</span>
          </h2>
          <p className="text-yellow-300 text-sm">
            Annual Cultural Fest of RCCIIT
          </p>
        </div>

        {/* Animated decorative elements */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-8">
          <div className="w-3 h-12 bg-yellow-300/30 rounded-full animate-equalizer-1"></div>
          <div className="w-3 h-12 bg-yellow-300/30 rounded-full animate-equalizer-2"></div>
          <div className="w-3 h-12 bg-yellow-300/30 rounded-full animate-equalizer-3"></div>
          <div className="w-3 h-12 bg-yellow-300/30 rounded-full animate-equalizer-4"></div>
          <div className="w-3 h-12 bg-yellow-300/30 rounded-full animate-equalizer-5"></div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes equalizer-1 {
          0%,
          100% {
            height: 12px;
          }
          50% {
            height: 36px;
          }
        }

        @keyframes equalizer-2 {
          0%,
          100% {
            height: 24px;
          }
          50% {
            height: 48px;
          }
        }

        @keyframes equalizer-3 {
          0%,
          100% {
            height: 36px;
          }
          50% {
            height: 12px;
          }
        }

        @keyframes equalizer-4 {
          0%,
          100% {
            height: 18px;
          }
          50% {
            height: 42px;
          }
        }

        @keyframes equalizer-5 {
          0%,
          100% {
            height: 30px;
          }
          50% {
            height: 18px;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-equalizer-1 {
          animation: equalizer-1 1.2s ease-in-out infinite;
        }

        .animate-equalizer-2 {
          animation: equalizer-2 0.9s ease-in-out infinite;
        }

        .animate-equalizer-3 {
          animation: equalizer-3 1.5s ease-in-out infinite;
        }

        .animate-equalizer-4 {
          animation: equalizer-4 1s ease-in-out infinite;
        }

        .animate-equalizer-5 {
          animation: equalizer-5 1.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
