import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Cake,
  Flame,
  Gift,
  Music,
  PartyPopper,
  Heart,
  Crown,
  Smile,
  Volume2,
  Check,
  Send,
  RefreshCw,
  Star,
  Gamepad2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../services/sound';
import { UmaBirthdayGame } from './UmaBirthdayGame';

interface BalloonItem {
  id: number;
  color: string;
  bgClass: string;
  text: string;
  popped: boolean;
}

interface BirthdayWish {
  id: string;
  author: string;
  text: string;
  date: string;
  emoji: string;
}

const INITIAL_BALLOONS: BalloonItem[] = [
  { id: 1, color: '#f43f5e', bgClass: 'from-rose-400 to-rose-600', text: '“Duniya ki sabse pyari smile tumhari hai!” 🌸', popped: false },
  { id: 2, color: '#38bdf8', bgClass: 'from-sky-400 to-sky-600', text: '“BGMI ka wo random match spectate meri kismat tha!” 🎮', popped: false },
  { id: 3, color: '#ec4899', bgClass: 'from-pink-400 to-pink-600', text: '“Tum meri zindagi ki sabse meethi Rasmalai ho!” 🫶🏻', popped: false },
  { id: 4, color: '#eab308', bgClass: 'from-amber-400 to-amber-600', text: '“Tumhari hansi meri har thakan door kar deti hai!” ✨', popped: false },
  { id: 5, color: '#a855f7', bgClass: 'from-purple-400 to-purple-600', text: '“Dono sheher door sahi, dil hamesha ek hain!” 🌙', popped: false },
  { id: 6, color: '#10b981', bgClass: 'from-emerald-400 to-emerald-600', text: '“Har janam me sirf tumhara saath chahiye!” 💍', popped: false },
];

const INITIAL_WISHES: BirthdayWish[] = [
  {
    id: 'wish-1',
    author: 'Her Special Someone 💙',
    text: 'Happy 1 October Birthday, Meri Pyaari Uma! Tumhari aawaz, tumhari muskaan aur tumhara bholapan meri poori duniya hai. Hamesha aise hi khush rehna meri Rasmalai ❤️',
    date: '1 Oct 2026',
    emoji: '👑'
  },
  {
    id: 'wish-2',
    author: 'From BGMI Spectate To Forever 🎮',
    text: 'BGMI ke random match spectate se shuru hua ye safar aaj meri zindagi ka sabse khoobsurat hissa ban chuka hai. Wishing you the happiest birthday my queen!',
    date: '1 Oct 2026',
    emoji: '🎂'
  }
];

export const BirthdayCelebration: React.FC = () => {
  // Cake state
  const [candlesLit, setCandlesLit] = useState(true);
  const [cakeCut, setCakeCut] = useState(false);
  const [showCakeSliceModal, setShowCakeSliceModal] = useState(false);

  // Balloons state
  const [balloons, setBalloons] = useState<BalloonItem[]>(INITIAL_BALLOONS);
  const [lastPoppedMessage, setLastPoppedMessage] = useState<string | null>(null);

  // Gift box state
  const [isGiftOpen, setIsGiftOpen] = useState(false);

  // Music state
  const [isPlayingBirthdaySong, setIsPlayingBirthdaySong] = useState(false);

  // Wishes state
  const [wishes, setWishes] = useState<BirthdayWish[]>(INITIAL_WishesState);
  const [newWishText, setNewWishText] = useState('');
  const [newWishAuthor, setNewWishAuthor] = useState<'him' | 'her'>('him');

  function INITIAL_WishesState(): BirthdayWish[] {
    try {
      const stored = localStorage.getItem('dear_uma_bday_wishes_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_WISHES;
  }

  const triggerGrandFireworks = () => {
    sound.playUnlockCelebration();
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: 0.15 + Math.random() * 0.7, y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleBlowCandles = () => {
    sound.playBlowCandlesSound();
    setCandlesLit(false);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#cbd5e1', '#f1f5f9', '#fde047'],
    });
  };

  const handleCutCake = () => {
    sound.playUnlockCelebration();
    setCakeCut(true);
    setShowCakeSliceModal(true);
    triggerGrandFireworks();
  };

  const handlePopBalloon = (id: number) => {
    sound.playBalloonPopSound();
    setBalloons((prev) =>
      prev.map((b) => {
        if (b.id === id && !b.popped) {
          setLastPoppedMessage(b.text);
          return { ...b, popped: true };
        }
        return b;
      })
    );

    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#38bdf8', '#fbbf24', '#34d399'],
    });
  };

  const handleResetBalloons = () => {
    sound.playHeartSound();
    setBalloons(INITIAL_BALLOONS.map((b) => ({ ...b, popped: false })));
    setLastPoppedMessage(null);
  };

  const handlePlaySong = () => {
    setIsPlayingBirthdaySong(true);
    sound.playHappyBirthdayMelody();
    triggerGrandFireworks();
    setTimeout(() => {
      setIsPlayingBirthdaySong(false);
    }, 15000);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishText.trim()) return;

    sound.playHeartSound();
    const newWish: BirthdayWish = {
      id: `wish-${Date.now()}`,
      author: newWishAuthor === 'him' ? 'Her Special Someone 💙' : 'Uma (Birthday Queen) 🌸',
      text: newWishText.trim(),
      date: '1 Oct 2026',
      emoji: newWishAuthor === 'him' ? '👑' : '🎂'
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('dear_uma_bday_wishes_v1', JSON.stringify(updated));
    } catch {}
    setNewWishText('');

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#3b82f6', '#f43f5e'],
    });
  };

  const poppedCount = balloons.filter((b) => b.popped).length;

  return (
    <section id="birthday" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-rose-50/40 via-amber-50/30 to-blue-50/30">
      {/* Background Birthday Sparkle Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-r from-pink-200/30 via-rose-100/40 to-amber-100/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-300 text-rose-800 text-xs font-semibold shadow-xs mb-3"
          >
            <PartyPopper className="w-4 h-4 text-rose-600 animate-bounce" />
            <span>1 October Birthday Special · Grand Celebration 🎉</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-slate-900 mt-2 mb-4 tracking-tight">
            Happy Birthday, Meri Pyaari Uma 🎂❤️
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif-luxury max-w-2xl mx-auto">
            Aaj ka din meri poori zindagi ka sabse khaas din hai. BGMI game ke us random match spectate aur pehle mic on hone se lekar aaj tak, tumne meri duniya ko khushiyon se bhar diya hai. Chalo milkar celebrate karte hain!
          </p>

          {/* Quick Celebration Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="#birthday-game"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-semibold shadow-md shadow-purple-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95 animate-pulse"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Play Birthday Game 🎮</span>
            </a>

            <button
              type="button"
              onClick={handlePlaySong}
              className={`px-5 py-2.5 rounded-2xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                isPlayingBirthdaySong
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white active:scale-95'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>{isPlayingBirthdaySong ? 'Playing Birthday Melody 🎶' : 'Play Birthday Song 🎵'}</span>
            </button>

            <button
              type="button"
              onClick={triggerGrandFireworks}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Grand Fireworks 🎆</span>
            </button>
          </div>
        </div>

        {/* 2-Column Celebration Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* Left Column: Interactive 3-Tier Birthday Cake */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Uma's Birthday Cake 🎂
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {candlesLit ? '🔥 Candles are burning' : cakeCut ? '🍰 Cake is sliced!' : '💨 Candles blown out'}
              </span>
            </div>

            {/* Visual Cake Graphic */}
            <div className="relative py-8 my-auto w-full max-w-xs flex flex-col items-center justify-center">
              {/* Candles atop the cake */}
              <div className="flex justify-center gap-6 mb-1 relative z-20">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Flame */}
                    <AnimatePresence>
                      {candlesLit && (
                        <motion.div
                          animate={{
                            scale: [1, 1.25, 0.9, 1.15, 1],
                            opacity: [0.9, 1, 0.85, 1],
                            y: [0, -1, 1, 0],
                          }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-3.5 h-5 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_12px_#f59e0b] -mb-1"
                        />
                      )}
                    </AnimatePresence>

                    {/* Extinguished Smoke */}
                    {!candlesLit && (
                      <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -15 }}
                        transition={{ duration: 1.5 }}
                        className="w-1.5 h-3 bg-slate-300 rounded-full blur-[1px] -mb-1"
                      />
                    )}

                    {/* Candle Stick */}
                    <div className="w-2 h-7 rounded-sm bg-gradient-to-b from-pink-300 to-rose-400 border border-rose-300 shadow-xs" />
                  </div>
                ))}
              </div>

              {/* Tier 1 (Top Tier) */}
              <div className="w-28 h-10 rounded-t-2xl bg-gradient-to-b from-rose-200 to-rose-300 border-2 border-white shadow-md relative z-10 flex items-center justify-center">
                <span className="text-[11px] font-bold text-rose-800 font-serif-luxury">Uma ❤️</span>
              </div>

              {/* Tier 2 (Middle Tier) */}
              <div className="w-40 h-12 rounded-t-xl bg-gradient-to-b from-amber-100 to-pink-200 border-2 border-white shadow-md relative z-10 flex items-center justify-center -mt-1">
                <span className="text-[10px] tracking-wider text-pink-900 font-semibold uppercase">
                  1 October 🌸
                </span>
              </div>

              {/* Tier 3 (Base Tier) */}
              <div className="w-56 h-14 rounded-xl bg-gradient-to-b from-rose-300 via-pink-300 to-rose-400 border-2 border-white shadow-lg relative z-10 flex items-center justify-center -mt-1">
                <span className="text-xs font-bold text-white font-serif-luxury drop-shadow-sm">
                  Meri Sweet Rasmalai 🫶🏻
                </span>

                {/* Sliced Cake Mark if Cut */}
                {cakeCut && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute inset-y-0 left-1/2 w-0.5 bg-rose-800 opacity-60"
                  />
                )}
              </div>

              {/* Cake Stand / Plate */}
              <div className="w-64 h-3 bg-gradient-to-r from-slate-200 via-white to-slate-300 rounded-full shadow-md mt-0.5 border border-slate-200" />
            </div>

            {/* Cake Controls */}
            <div className="w-full flex flex-wrap gap-2.5 justify-center mt-6">
              {candlesLit ? (
                <button
                  type="button"
                  onClick={handleBlowCandles}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Flame className="w-4 h-4" />
                  <span>Blow Candles 🕯️💨 (Foonk Maaro)</span>
                </button>
              ) : !cakeCut ? (
                <button
                  type="button"
                  onClick={handleCutCake}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all animate-bounce"
                >
                  <Cake className="w-4 h-4" />
                  <span>Cut The Cake 🎂🔪 (Cake Kaato)</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCakeSliceModal(true)}
                    className="px-4 py-2 rounded-xl bg-pink-100 text-pink-700 text-xs font-semibold cursor-pointer hover:bg-pink-200"
                  >
                    View First Bite 🍰
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCandlesLit(true);
                      setCakeCut(false);
                      sound.playHeartSound();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Cake</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Balloon Popping Game */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-lg font-bold font-serif-luxury text-slate-900">
                    Pop The Birthday Balloons 🎈
                  </h3>
                  <p className="text-xs text-slate-500">
                    Har gubbare ke andar Uma ke liye ek pyara birthday note chupa hai!
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {poppedCount}/{balloons.length} Popped
                </span>
              </div>

              {/* Balloons Grid */}
              <div className="grid grid-cols-3 gap-3 my-4">
                {balloons.map((b) => (
                  <motion.div
                    key={b.id}
                    whileHover={!b.popped ? { scale: 1.08, y: -4 } : {}}
                    whileTap={!b.popped ? { scale: 0.9 } : {}}
                    onClick={() => !b.popped && handlePopBalloon(b.id)}
                    className={`relative aspect-[3/4] rounded-full flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                      b.popped
                        ? 'bg-slate-100 border border-dashed border-slate-300 opacity-60'
                        : `bg-gradient-to-b ${b.bgClass} shadow-md text-white`
                    }`}
                  >
                    {!b.popped ? (
                      <>
                        <span className="text-2xl drop-shadow-sm select-none">🎈</span>
                        <span className="text-[10px] font-bold mt-1">Tap Me!</span>
                        {/* Balloon string */}
                        <div className="w-0.5 h-4 bg-slate-400 absolute -bottom-3 rounded-full" />
                      </>
                    ) : (
                      <span className="text-xl select-none">💥</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Popped Message Showcase */}
              <div className="min-h-[70px] p-3.5 rounded-2xl bg-white/80 border border-slate-100 flex items-center justify-center text-center shadow-2xs">
                {lastPoppedMessage ? (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs sm:text-sm font-serif-luxury font-semibold text-rose-600 italic"
                  >
                    {lastPoppedMessage}
                  </motion.p>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Kisi bhi gubbare par click karein aur surprise note padhein...
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleResetBalloons}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Naye Gubbare Lagao 🎈</span>
              </button>
            </div>
          </div>
        </div>

        {/* Uma's Midnight Birthday Game Arcade */}
        <div id="birthday-game" className="mb-16 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold border border-purple-200 shadow-xs mb-2">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Interactive Midnight Arcade</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900">
              Uma's Birthday Mini-Game 🎮🎂
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Swaying balloons pop, midnight cake ceremony, aur falling rasmalais ka interactive arcade game!
            </p>
          </div>

          <UmaBirthdayGame />
        </div>

        {/* Surprise Gift Box Unwrapping Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/90 shadow-xl text-center max-w-3xl mx-auto mb-14 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3 border border-purple-200">
            <Gift className="w-3.5 h-3.5" />
            <span>Birthday Surprise Box For Uma</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 mb-2">
            A Magical Gift For The Birthday Queen 🎁👑
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-lg mx-auto font-serif-luxury">
            Is box ko kholkar dekhein, isme aapke liye dil se likha ek special birthday pledge aur crown chupa hai.
          </p>

          <AnimatePresence mode="wait">
            {!isGiftOpen ? (
              <motion.div
                key="closed"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={() => {
                  sound.playUnlockCelebration();
                  triggerGrandFireworks();
                  setIsGiftOpen(true);
                }}
                className="group cursor-pointer inline-flex flex-col items-center my-4"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-500 shadow-2xl flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
                  <Gift className="w-14 h-14 text-white drop-shadow-md group-hover:rotate-12 transition-transform" />
                  <span className="absolute -top-2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold tracking-wider shadow-sm animate-pulse">
                    TAP TO UNWRAP
                  </span>
                </div>
                <span className="text-xs font-semibold text-purple-700 mt-3 group-hover:underline">
                  Click to open birthday surprise 🎀
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="opened"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-purple-50 border border-purple-200 shadow-lg text-left relative"
              >
                <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-amber-500" />
                    <span className="text-base font-bold font-serif-luxury text-slate-900">
                      Happy 1 October Birthday, My Queen Uma!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGiftOpen(false)}
                    className="text-xs text-purple-600 hover:text-purple-800 font-semibold cursor-pointer"
                  >
                    Pack Again 🎀
                  </button>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-serif-luxury leading-relaxed italic">
                  <p>
                    “Meri Pyaari Uma, jab tum hasti ho na toh poori duniya roshan lagti hai. BGMI game ke us random match spectate ne meri taqdeer badal di thi.”
                  </p>
                  <p>
                    “Birthday par mera sabse bada promise ye hai: chahe kitne bhi saal beet jayein, kitne bhi sheher door hon, main hamesha tumhare har jhagde ko mithaas me badal dunga, aur har birthday tumhara sabse khaas din banakar rahunga.”
                  </p>
                  <p className="font-bold text-rose-600 not-italic pt-1">
                    Forever Yours, Only & Always ❤️ — Meri Rasmalai 🫶🏻
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Birthday Wish Wall & Guestbook */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-xl font-bold font-serif-luxury text-slate-900">
                Uma's Birthday Wish Wall 💌
              </h3>
              <p className="text-xs text-slate-500">
                1 October birthday ke liye pyare messages aur wishes.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {wishes.length} Wishes
            </span>
          </div>

          {/* Add a Wish Form */}
          <form onSubmit={handleAddWish} className="mb-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Wishing as:</span>
              <button
                type="button"
                onClick={() => setNewWishAuthor('him')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  newWishAuthor === 'him'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Him 💙
              </button>
              <button
                type="button"
                onClick={() => setNewWishAuthor('her')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  newWishAuthor === 'her'
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Uma (Birthday Girl) 🌸
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newWishText}
                onChange={(e) => setNewWishText(e.target.value)}
                placeholder="Ek pyari si birthday wish likhein..."
                required
                className="flex-1 px-4 py-2 rounded-2xl glass-input text-xs font-serif-luxury"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Wish</span>
              </button>
            </div>
          </form>

          {/* Wish Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{w.emoji}</span>
                    <span>{w.author}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{w.date}</span>
                </div>
                <p className="text-xs text-slate-700 font-serif-luxury italic leading-relaxed">
                  “{w.text}”
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: First Cake Bite Celebration */}
        <AnimatePresence>
          {showCakeSliceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-2xl text-center relative"
              >
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-3xl mx-auto mb-3">
                  🍰
                </div>
                <h3 className="text-xl font-bold font-serif-luxury text-slate-900 mb-1">
                  Cake Cutting Complete! 🎉
                </h3>
                <p className="text-xs text-rose-600 font-semibold mb-3">
                  Pehla piece Meri Pyaari Rasmalai Uma ke liye! 🫶🏻
                </p>
                <p className="text-xs text-slate-600 font-serif-luxury leading-relaxed mb-6 italic">
                  “Bhagwan kare tumhari zindagi me har din aisi hi mithaas, muskaan aur BGMI ke chickens dinner jaisi khushiyan bhari rahein!”
                </p>
                <button
                  type="button"
                  onClick={() => setShowCakeSliceModal(false)}
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md cursor-pointer"
                >
                  Yummy! Thank You ❤️
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
