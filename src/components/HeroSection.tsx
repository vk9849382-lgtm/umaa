import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Clock, Calendar, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DAILY_QUOTES, getStoredHeroConfig } from '../services/storage';
import { HeroConfig } from '../types';
import { sound } from '../services/sound';

interface HeroSectionProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  editMode?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isMusicPlaying, onToggleMusic }) => {
  const [config] = useState<HeroConfig>(() => getStoredHeroConfig());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  const bgmiDate = new Date(config.bgmiStartDate || '2026-04-17T00:00:00');
  const coupleDate = new Date(config.coupleStartDate || '2026-06-15T00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeDiff = (startDate: Date) => {
    const now = currentTime.getTime();
    const start = startDate.getTime();
    const diff = Math.max(0, now - start);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const bgmiDiff = calculateTimeDiff(bgmiDate);
  const coupleDiff = calculateTimeDiff(coupleDate);

  const triggerConfetti = () => {
    sound.playUnlockCelebration();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#38BDF8', '#60A5FA', '#93C5FD', '#F472B6', '#FFFFFF']
    });
  };

  const nextQuote = () => {
    sound.playHeartSound();
    setQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES.length);
  };

  const currentQuote = DAILY_QUOTES[quoteIndex];

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Announcement Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-blue-700 text-xs font-medium shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>{config.badgeText}</span>
          </div>
        </div>

        {/* Hero Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Romantic Birthday Hero */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold tracking-tight text-slate-900 leading-[1.18] mb-4 whitespace-pre-line">
              {config.mainTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-serif-luxury leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0">
              {config.subtitle}
            </p>

            {/* Live Clock & Date */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-xs mb-8">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-mono tabular-nums">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>
                  {currentTime.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href="#birthday"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🎂 Cut Cake & Celebrate</span>
              </a>

              <button
                type="button"
                onClick={triggerConfetti}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-medium text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Celebrate Uma's Day!</span>
              </button>

              <button
                type="button"
                onClick={onToggleMusic}
                className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 font-medium text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                {isMusicPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span>Background Song On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-400" />
                    <span>Turn Music On</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Uma's Portrait Photo Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm">
              {/* Soft decorative background glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-200 to-sky-100 rounded-3xl blur-xl opacity-70" />

              <div className="relative glass-card rounded-3xl p-3 border border-white/80 shadow-xl overflow-hidden group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={config.herPhoto || '/src/assets/images/uma_hero_portrait_1790514519283.jpg'}
                    alt="Uma Portrait"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Caption on Photo */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                      The Queen of My Heart
                    </span>
                    <h3 className="text-lg font-serif-luxury font-bold">{config.nickname}</h3>
                  </div>
                </div>

                <div className="p-3 text-center">
                  <p className="text-xs text-slate-600 italic font-serif-luxury text-sm">
                    {config.photoQuote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Days Counters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-4xl mx-auto">
          {/* BGMI Counter */}
          <motion.div
            whileHover={{ y: -3 }}
            className="glass-card rounded-3xl p-6 border border-white/80 shadow-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {config.bgmiLabel || 'Since BGMI First Met'}
              </span>
              <span className="text-xs text-slate-500">17 April 2026</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center my-4">
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                  {bgmiDiff.days}
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Days</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                  {bgmiDiff.hours}
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Hours</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                  {bgmiDiff.minutes}
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Mins</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-blue-600 tabular-nums">
                  {bgmiDiff.seconds}
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Secs</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center font-serif-luxury italic mt-2">
              {config.bgmiSub || '«“BGMI ke us random match spectate ne hamari kismat badal di.”»'}
            </p>
          </motion.div>

          {/* Couple Days Counter */}
          <motion.div
            whileHover={{ y: -3 }}
            className="glass-card rounded-3xl p-6 border border-white/80 shadow-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {config.coupleLabel || 'Officially In Love'}
              </span>
              <span className="text-xs text-slate-500">15 June 2026</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center my-4">
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                  {coupleDiff.days}
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Days</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                  {coupleDiff.hours}
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Hours</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                  {coupleDiff.minutes}
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Mins</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-rose-600 tabular-nums">
                  {coupleDiff.seconds}
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Secs</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center font-serif-luxury italic mt-2">
              {config.coupleSub || '«“Do dilon ki doori zero ban gayi thi us din.”»'}
            </p>
          </motion.div>
        </div>

        {/* Daily Love Note / Flip Quote */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
                  Today's Whisper For Uma
                </span>
                <p className="text-xs sm:text-sm font-serif-luxury text-slate-800 italic">
                  “{currentQuote?.hinglish || currentQuote?.quote}”
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={nextQuote}
              className="shrink-0 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Note</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
