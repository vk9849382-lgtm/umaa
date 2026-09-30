import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, HeartHandshake, PhoneCall, Award, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStoredFightConfig } from '../services/storage';
import { sound } from '../services/sound';

export const FightAndPatchUp: React.FC = () => {
  const [config] = useState(() => getStoredFightConfig());
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [patchUpTriggered, setPatchUpTriggered] = useState(false);

  const getCardIcon = (id: string) => {
    switch (id) {
      case 'fight':
        return ShieldAlert;
      case 'sorry':
        return HeartHandshake;
      case 'call':
        return PhoneCall;
      case 'promise':
        return Award;
      default:
        return HeartHandshake;
    }
  };

  const handlePatchUpProtocol = () => {
    sound.playUnlockCelebration();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#FB7185', '#FDA4AF', '#38BDF8', '#FFFFFF']
    });
    setPatchUpTriggered(true);
    setTimeout(() => setPatchUpTriggered(false), 5000);
  };

  return (
    <section id="patchup" className="py-16 md:py-24 bg-gradient-to-b from-blue-50/30 via-white to-blue-50/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Main Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 block mb-2">
            {config.tag}
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mb-4 leading-tight">
            {config.heading}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-serif-luxury italic leading-relaxed bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xs">
            {config.quote}
          </p>

          {/* Interactive Patch-Up Protocol Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handlePatchUpProtocol}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Emergency Patch-Up Love Button 🫶🏻</span>
            </button>
          </div>

          <AnimatePresence>
            {patchUpTriggered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs text-center max-w-md mx-auto shadow-sm"
              >
                <div className="font-bold text-sm mb-1">
                  Apology & Love Coupon Activated! 🎟️
                </div>
                <p className="font-serif-luxury italic text-sm">
                  “Gussa cancel! Saare shikwe maaf. Aaj Uma ko unlimited treats aur double hugs milenge!”
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.cards.map((c) => {
            const Icon = getCardIcon(c.id);
            const isSelected = activeCard === c.id;

            return (
              <div
                key={c.id}
                onClick={() => {
                  sound.playHeartSound();
                  setActiveCard(isSelected ? null : c.id);
                }}
                className={`glass-card rounded-3xl p-6 border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-blue-300 ring-2 ring-blue-400/20 shadow-lg bg-gradient-to-br from-white to-blue-50/50'
                    : 'border-white/90 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-medium text-blue-700">{c.tag}</span>
                    </div>

                    <h3 className="text-lg font-serif-luxury font-bold text-slate-900 mb-1">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-serif-luxury mb-2">
                      {c.summary}
                    </p>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pt-3 border-t border-slate-100 text-xs text-slate-700 font-serif-luxury leading-relaxed space-y-2"
                        >
                          <p className="italic bg-white/60 p-3 rounded-xl border border-slate-100">
                            {c.details}
                          </p>
                          <div className="font-bold text-rose-600 text-[11px]">
                            {c.lesson}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-3 flex items-center text-xs text-blue-600 font-medium pt-1">
                      <span>{isSelected ? 'Tap to collapse' : 'Read our full story →'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
