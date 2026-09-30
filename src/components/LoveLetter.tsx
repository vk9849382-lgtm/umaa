import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Sparkles,
  Lock,
  Copy,
  Feather,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStoredLoveLetter } from '../services/storage';
import { sound } from '../services/sound';

export const LoveLetter: React.FC = () => {
  const [letterText] = useState<string>(() => getStoredLoveLetter());
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Typewriter effect when playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRevealed && isPlaying && displayedLength < letterText.length) {
      timer = setTimeout(() => {
        setDisplayedLength((prev) => Math.min(prev + 3, letterText.length));
      }, 25);
    } else if (displayedLength >= letterText.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isRevealed, isPlaying, displayedLength, letterText.length]);

  const handleReveal = () => {
    sound.playUnlockCelebration();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38BDF8', '#60A5FA', '#F472B6', '#FBBF24']
    });
    setIsRevealed(true);
    setDisplayedLength(letterText.length);
    setIsPlaying(false);
  };

  const handleStartTypewriter = () => {
    sound.playHeartSound();
    setDisplayedLength(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    sound.playHeartSound();
    if (displayedLength >= letterText.length) {
      setDisplayedLength(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkipToEnd = () => {
    sound.playHeartSound();
    setDisplayedLength(letterText.length);
    setIsPlaying(false);
  };

  const handleCopyLetter = () => {
    sound.playHeartSound();
    navigator.clipboard.writeText(letterText);
    setSaveToast('Letter text copied to clipboard! 📋');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const triggerHeartBurst = () => {
    sound.playUnlockCelebration();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      shapes: ['circle'],
      colors: ['#38BDF8', '#60A5FA', '#93C5FD', '#F472B6']
    });
  };

  const wordCount = letterText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section id="letter" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Feather className="w-3.5 h-3.5" />
            <span>Handwritten Hinglish Letter 💌</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mb-2">
            A Letter From My Soul 💌
          </h2>

          <p className="text-xs sm:text-sm text-slate-600">
            Dedicated with all my heart to my dearest Uma.
          </p>

          {/* Quick word count & status pill */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-600 shadow-2xs">
              {wordCount} words · Written from the heart
            </span>
          </div>
        </div>

        {/* State Toast Notification */}
        <AnimatePresence>
          {saveToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium max-w-sm mx-auto shadow-sm"
            >
              {saveToast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unrevealed State: Intimate Luxury Envelope Card */}
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="sealed-envelope"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Decorative ambient backlight */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-200/50 via-sky-100/60 to-indigo-200/50 rounded-3xl blur-xl opacity-70" />

              <div className="relative rounded-3xl bg-white/85 backdrop-blur-xl border border-white p-8 sm:p-14 text-center shadow-xl overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />

                {/* Wax Seal Orb */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReveal}
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 text-white flex flex-col items-center justify-center shadow-xl shadow-blue-500/25 cursor-pointer relative group"
                >
                  <Heart className="w-10 h-10 fill-white drop-shadow-md group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold tracking-widest uppercase mt-0.5 opacity-90">
                    SEALED
                  </span>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-1.5 rounded-full border border-blue-300/40 border-dashed pointer-events-none"
                  />
                </motion.div>

                <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 mb-2">
                  A Private Letter for Uma ❤️
                </h3>

                <p className="text-sm text-slate-600 font-serif-luxury italic max-w-md mx-auto mb-8">
                  «“Meri Pyaari Uma, Meri Rasmalai... Har ek lafz sirf tumhare liye mehfooz hai.”»
                </p>

                {/* Reveal Letter Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleReveal}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-700 hover:to-sky-700 text-white font-medium text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2.5 group cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform" />
                    <span className="tracking-wide">Reveal Letter (Kholo Meri Jaan 💙)</span>
                  </motion.button>
                </div>

                <p className="text-[11px] text-slate-400 mt-6 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-blue-400" />
                  <span>Private & Protected · Beautiful Calligraphy & Heartfelt Words</span>
                </p>
              </div>
            </motion.div>
          ) : (
            /* Revealed State: Smooth Fade-In Letter with Typewriter */
            <motion.div
              key="letter-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Typewriter controls bar */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause Typewriter' : 'Play Typewriter'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStartTypewriter}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {displayedLength < letterText.length && (
                    <button
                      type="button"
                      onClick={handleSkipToEnd}
                      className="text-xs text-slate-500 hover:text-blue-600 underline cursor-pointer"
                    >
                      Show All
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLetter}
                    className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 text-xs cursor-pointer"
                    title="Copy full letter"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRevealed(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs cursor-pointer"
                    title="Re-seal Envelope"
                  >
                    <span>Seal Envelope</span>
                  </button>
                </div>
              </div>

              {/* Decorative ambient backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-100 via-sky-50 to-indigo-100 rounded-3xl blur-xl opacity-80" />

              <div className="relative rounded-3xl bg-white/92 backdrop-blur-xl border border-white p-6 sm:p-10 lg:p-12 shadow-2xl transition-all">
                {/* Wax Seal Stamp in Top Right */}
                <div
                  onClick={triggerHeartBurst}
                  title="Click for celebratory heart burst!"
                  className="absolute top-6 right-6 sm:top-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition-transform group z-10"
                >
                  <Heart className="w-6 h-6 fill-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">U & V</span>
                </div>

                {/* Letter Content Display */}
                <div>
                  <div className="text-slate-800 text-base sm:text-lg leading-[1.85] font-serif-luxury whitespace-pre-line tracking-wide pr-14 sm:pr-20">
                    {letterText.slice(0, displayedLength)}
                    {isPlaying && displayedLength < letterText.length && (
                      <span className="inline-block w-2.5 h-5 bg-blue-600 ml-1 rounded-xs animate-pulse align-middle" />
                    )}
                  </div>

                  {/* Bottom Footer Note */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span>Written with unconditional devotion for Uma ❤️</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={triggerHeartBurst}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
                        <span>Send Birthday Love Burst 💙</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
