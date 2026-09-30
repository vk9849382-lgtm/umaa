import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, KeyRound, HelpCircle, Heart, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../services/sound';

interface PasswordGateProps {
  onUnlockSuccess: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlockSuccess }) => {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const CORRECT_PASS = '170426';

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      sound.playTone(400 + nextPin.length * 50, 0.1, 'sine', 0.2);

      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      sound.playTone(320, 0.08, 'sine', 0.2);
    }
  };

  const verifyPin = (candidate: string) => {
    if (candidate === CORRECT_PASS) {
      setIsUnlocking(true);
      sound.playUnlockCelebration();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#60A5FA', '#93C5FD', '#BFDBFE', '#FFFFFF', '#38BDF8']
      });

      setTimeout(() => {
        onUnlockSuccess();
      }, 900);
    } else {
      setIsError(true);
      sound.playTone(180, 0.35, 'triangle', 0.4);
      setTimeout(() => {
        setIsError(false);
        setPin('');
      }, 700);
    }
  };

  const handleQuickBypass = () => {
    setPin('170426');
    verifyPin('170426');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gradient-to-b from-[#EBF5FB] via-[#F4F9FD] to-[#FFFFFF] overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm glass-card rounded-3xl p-6 md:p-8 relative shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] border border-white"
      >
        {/* Top Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={isUnlocking ? { scale: [1, 1.2, 0.9] } : {}}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/25"
          >
            {isUnlocking ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </motion.div>

          <h2 className="text-2xl font-serif-luxury font-semibold text-slate-900">
            Private Access 💙
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Made only for Uma (Rasmalai)
          </p>
        </div>

        {/* Pin Dots Display */}
        <motion.div
          animate={isError ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex justify-center items-center gap-3 mb-6 py-2"
        >
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isError
                    ? 'bg-rose-500 scale-110'
                    : isFilled
                    ? 'bg-blue-600 scale-110 shadow-sm shadow-blue-500/50'
                    : 'bg-blue-100 border border-blue-200'
                }`}
              />
            );
          })}
        </motion.div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              disabled={isUnlocking}
              className="h-13 rounded-2xl bg-white/70 hover:bg-white text-slate-800 text-xl font-medium shadow-sm hover:shadow border border-white/80 active:scale-95 transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {digit}
            </button>
          ))}

          {/* Hint button */}
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="h-13 rounded-2xl bg-blue-50/60 hover:bg-blue-100/70 text-blue-600 text-xs font-medium border border-blue-100 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
            title="Show passcode hint"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Hint</span>
          </button>

          {/* '0' Digit */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            disabled={isUnlocking}
            className="h-13 rounded-2xl bg-white/70 hover:bg-white text-slate-800 text-xl font-medium shadow-sm hover:shadow border border-white/80 active:scale-95 transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            0
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isUnlocking || pin.length === 0}
            className="h-13 rounded-2xl bg-slate-50/80 hover:bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/50 active:scale-95 transition-all flex items-center justify-center"
          >
            Clear
          </button>
        </div>

        {/* Hint Box (Always available or expandable) */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50/80 border border-blue-200/70 rounded-2xl p-3.5 mb-4 text-center overflow-hidden"
            >
              <div className="flex items-center justify-center gap-1.5 text-blue-700 font-medium text-xs mb-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password Hint</span>
              </div>
              <p className="text-xs text-blue-900 font-serif-luxury italic text-sm">
                «“The day our story began.”»
              </p>
              <p className="text-[11px] text-blue-600/80 mt-1">
                (Format: DDMMYY — BGMI First Met 17 April 2026 = 170426)
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick shortcut for birthday girl */}
        <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleQuickBypass}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Are you Uma? One-tap unlock</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <span>Passcode: 170426</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
