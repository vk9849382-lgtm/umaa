import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { sound } from '../services/sound';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    sound.playHeartSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-slate-200/60 bg-white/40 backdrop-blur-md relative z-10 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Romantic identity */}
        <div className="flex items-center gap-2">
          <span className="font-serif-luxury font-bold text-slate-900 text-sm">Dear Uma 💙</span>
          <span>·</span>
          <span>A private digital universe made only for Rasmalai</span>
        </div>

        {/* Center / Right */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-600">
            <span>17 April 2026</span>
            <span>—</span>
            <span>Forever</span>
          </span>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 shadow-2xs"
            title="Scroll back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
