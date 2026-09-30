import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { sound } from '../services/sound';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            sound.playHeartSound();
            onComplete();
          }, 350);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#EBF5FB] via-[#F4F9FD] to-[#FFFFFF] p-6 select-none overflow-hidden"
    >
      {/* Soft atmospheric background lights */}
      <div className="absolute w-96 h-96 rounded-full bg-blue-200/40 blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse" />

      {/* Main glass orb container */}
      <div className="relative flex flex-col items-center max-w-sm text-center">
        {/* Animated Heart Orb */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/80 backdrop-blur-xl border border-white p-5 shadow-[0_20px_50px_rgba(59,130,246,0.15)] flex items-center justify-center relative group">
            <Heart className="w-12 h-12 text-blue-500 fill-blue-500/20 drop-shadow-sm transition-transform duration-500 group-hover:scale-110" />
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-1 rounded-3xl border border-blue-400/30 border-dashed pointer-events-none"
            />
          </div>
          
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Brand Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl font-serif-luxury font-semibold tracking-tight text-slate-900 mb-2"
        >
          Dear Uma <span className="text-blue-500">💙</span>
        </motion.h1>

        {/* Loading Quote / Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-base text-slate-600 font-medium italic mb-8 max-w-xs"
        >
          «“Made with love, only for Uma.”»
        </motion.p>

        {/* Apple-style Progress Bar */}
        <div className="w-48 h-1.5 bg-blue-100 rounded-full overflow-hidden mb-4 p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>Private universe loading · {progress}%</span>
        </div>

        {/* Skip button for impatience */}
        <button
          onClick={() => {
            sound.playHeartSound();
            onComplete();
          }}
          className="mt-6 text-xs text-blue-600/70 hover:text-blue-600 font-medium transition-colors underline decoration-blue-300 underline-offset-4"
        >
          Enter Universe
        </button>
      </div>
    </motion.div>
  );
};
