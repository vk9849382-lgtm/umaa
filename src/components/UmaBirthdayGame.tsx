import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Trophy,
  Heart,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Minimize2,
  Crown,
  Play,
  Flame,
  Cake as CakeIcon,
  X,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../services/sound';

interface Balloon {
  id: number;
  color: string;
  gradient: string;
  note: string;
  popped: boolean;
  swayDelay: string;
}

interface FallingItem {
  id: number;
  type: 'rasmalai' | 'heart' | 'star';
  x: number; // percentage 8% to 92%
  y: number; // percentage 0% to 100%
  speed: number;
  points: number;
  rotation: number;
  rotSpeed: number;
}

interface FloatingScoreText {
  id: number;
  text: string;
  x: number;
  y: number;
}

const INITIAL_BALLOONS: Balloon[] = [
  {
    id: 1,
    color: '#f43f5e',
    gradient: 'from-rose-500 to-rose-700',
    note: '“Uma ki pyari smile = Meri poori duniya ki sabse meethi cheez! 🌸”',
    popped: false,
    swayDelay: '0s',
  },
  {
    id: 2,
    color: '#38bdf8',
    gradient: 'from-sky-500 to-blue-700',
    note: '“BGMI ke random match spectate se kismat badal gayi thi! 🎮”',
    popped: false,
    swayDelay: '0.8s',
  },
  {
    id: 3,
    color: '#ec4899',
    gradient: 'from-pink-500 to-fuchsia-700',
    note: '“Happy 1st October Birthday, meri sabse meethi Rasmalai! 🫶🏻”',
    popped: false,
    swayDelay: '1.6s',
  },
  {
    id: 4,
    color: '#eab308',
    gradient: 'from-amber-400 to-yellow-600',
    note: '“Dono sheher door sahi, par dil hamesha ek doosre ke kareeb hai! 🌙”',
    popped: false,
    swayDelay: '0.4s',
  },
  {
    id: 5,
    color: '#a855f7',
    gradient: 'from-purple-500 to-indigo-700',
    note: '“Har janam me sirf tumhara saath aur tumhari hansi chahiye! 💍”',
    popped: false,
    swayDelay: '1.2s',
  },
];

interface UmaBirthdayGameProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const UmaBirthdayGame: React.FC<UmaBirthdayGameProps> = ({ onClose, isModal = false }) => {
  // Boot screen state
  const [booting, setBooting] = useState(true);

  // Game stages: 1 = Balloons, 2 = Cake, 3 = Falling Rasmalai Catcher, 4 = Coronation Victory
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Level 1: Balloons
  const [balloons, setBalloons] = useState<Balloon[]>(INITIAL_BALLOONS);
  const [activePopupNote, setActivePopupNote] = useState<string | null>(null);

  // Level 2: Cake
  const [candlesLit, setCandlesLit] = useState(true);
  const [cakeSliced, setCakeSliced] = useState(false);
  const [firstBiteFed, setFirstBiteFed] = useState(false);

  // Level 3: Falling Rasmalai Catcher with buttery-smooth Lerp physics
  const targetXRef = useRef(50);
  const currentXRef = useRef(50);
  const [plateDisplayX, setPlateDisplayX] = useState(50);
  const [plateTilt, setPlateTilt] = useState(0);
  const [plateBouncing, setPlateBouncing] = useState(false);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScoreText[]>([]);
  const [gameTimer, setGameTimer] = useState(22);
  const [catcherActive, setCatcherActive] = useState(false);
  const [caughtCount, setCaughtCount] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const holdingKeyRef = useRef<'left' | 'right' | null>(null);

  // Simulate boot loading screen for authentic arcade feel
  useEffect(() => {
    const t = setTimeout(() => {
      setBooting(false);
    }, 1100);
    return () => clearTimeout(t);
  }, []);

  // Keyboard navigation for Level 3 (Arrow keys & A/D)
  useEffect(() => {
    if (stage !== 3 || !catcherActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        holdingKeyRef.current = 'left';
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        holdingKeyRef.current = 'right';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') &&
        holdingKeyRef.current === 'left'
      ) {
        holdingKeyRef.current = null;
      } else if (
        (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') &&
        holdingKeyRef.current === 'right'
      ) {
        holdingKeyRef.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [stage, catcherActive]);

  // Level 3 Ultra-Smooth 60FPS Game Loop with Lerp & Physics
  useEffect(() => {
    if (stage !== 3 || !catcherActive) return;

    // Spawn falling items at balanced intervals
    const spawnInterval = setInterval(() => {
      const types: ('rasmalai' | 'heart' | 'star')[] = [
        'rasmalai',
        'rasmalai',
        'heart',
        'heart',
        'star',
      ];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const newItem: FallingItem = {
        id: Date.now() + Math.random(),
        type: chosenType,
        x: Math.floor(Math.random() * 76) + 12,
        y: -5,
        speed: 1.2 + Math.random() * 0.9,
        points: chosenType === 'star' ? 30 : chosenType === 'rasmalai' ? 20 : 15,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
      };
      setFallingItems((prev) => [...prev, newItem]);
    }, 700);

    // 1-second countdown clock
    const timerInterval = setInterval(() => {
      setGameTimer((prev) => {
        if (prev <= 1) {
          clearInterval(spawnInterval);
          clearInterval(timerInterval);
          setCatcherActive(false);
          setTimeout(() => {
            sound.playUnlockCelebration();
            setStage(4);
          }, 1200);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // High refresh rate 60-120fps physics loop via requestAnimationFrame
    lastTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(32, currentTime - lastTimeRef.current);
      lastTimeRef.current = currentTime;

      // Handle keyboard hold movement smoothly
      if (holdingKeyRef.current === 'left') {
        targetXRef.current = Math.max(10, targetXRef.current - 1.4 * (dt / 16.67));
      } else if (holdingKeyRef.current === 'right') {
        targetXRef.current = Math.min(90, targetXRef.current + 1.4 * (dt / 16.67));
      }

      // Smooth Spring Lerp interpolation for plate position
      const diff = targetXRef.current - currentXRef.current;
      currentXRef.current += diff * 0.18; // smooth glide factor

      // Dynamic banking tilt angle based on velocity
      const dynamicTilt = Math.max(-14, Math.min(14, diff * 1.1));

      setPlateDisplayX(currentXRef.current);
      setPlateTilt(dynamicTilt);

      // Smooth physics for falling items and collisions
      setFallingItems((prev) =>
        prev
          .map((item) => ({
            ...item,
            y: item.y + item.speed * (dt / 16.67),
            rotation: item.rotation + item.rotSpeed,
          }))
          .filter((item) => {
            // Collision detection with Uma's plate: y between 74% and 88%, x within 16%
            if (
              item.y >= 74 &&
              item.y <= 88 &&
              Math.abs(item.x - currentXRef.current) < 16
            ) {
              setScore((s) => s + item.points);
              setCaughtCount((c) => c + 1);
              setPlateBouncing(true);
              setTimeout(() => setPlateBouncing(false), 220);

              // Floating score popup text
              const textId = Date.now() + Math.random();
              const scoreLabel =
                item.type === 'rasmalai'
                  ? '+20 Rasmalai! 🥣'
                  : item.type === 'heart'
                  ? '+15 Sweet Heart! 💖'
                  : '+30 Golden Star! ⭐';

              setFloatingScores((scores) => [
                ...scores.slice(-4), // keep max 5
                { id: textId, text: scoreLabel, x: item.x, y: 72 },
              ]);

              setTimeout(() => {
                setFloatingScores((scores) => scores.filter((s) => s.id !== textId));
              }, 900);

              if (soundEnabled) sound.playHeartSound();
              confetti({
                particleCount: 14,
                spread: 45,
                origin: { x: item.x / 100, y: 0.8 },
                colors: ['#f43f5e', '#ec4899', '#fde047'],
              });
              return false; // remove caught item
            }
            return item.y < 105; // remove once off-screen
          })
      );

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [stage, catcherActive, soundEnabled]);

  const triggerGrandCelebration = () => {
    if (soundEnabled) sound.playUnlockCelebration();
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 45 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.2 + Math.random() * 0.6, y: Math.random() - 0.2 },
      });
    }, 200);
  };

  // Handlers for Level 1 (Balloons)
  const handlePopBalloon = (balloon: Balloon) => {
    if (balloon.popped) return;

    if (soundEnabled) sound.playBalloonPopSound();
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.5 },
      colors: [balloon.color, '#fff', '#fde047'],
    });

    setActivePopupNote(balloon.note);
    setScore((prev) => prev + 50);

    const updated = balloons.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b));
    setBalloons(updated);

    if (updated.every((b) => b.popped)) {
      setTimeout(() => {
        triggerGrandCelebration();
        setStage(2);
      }, 1600);
    }
  };

  // Handlers for Level 2 (Cake)
  const handleBlowCandles = () => {
    if (soundEnabled) sound.playBlowCandlesSound();
    setCandlesLit(false);
    setScore((prev) => prev + 100);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#cbd5e1', '#f1f5f9', '#fde047'],
    });
  };

  const handleCutCake = () => {
    if (soundEnabled) sound.playUnlockCelebration();
    setCakeSliced(true);
    setScore((prev) => prev + 150);
    triggerGrandCelebration();
  };

  const handleFeedFirstBite = () => {
    if (soundEnabled) sound.playHeartSound();
    setFirstBiteFed(true);
    setScore((prev) => prev + 200);
    setTimeout(() => {
      setStage(3);
      setCatcherActive(true);
      setGameTimer(22);
      targetXRef.current = 50;
      currentXRef.current = 50;
    }, 1500);
  };

  // Reset entire game
  const handleRestart = () => {
    setStage(1);
    setScore(0);
    setBalloons(INITIAL_BALLOONS.map((b) => ({ ...b, popped: false })));
    setActivePopupNote(null);
    setCandlesLit(true);
    setCakeSliced(false);
    setFirstBiteFed(false);
    setCatcherActive(false);
    setFallingItems([]);
    setFloatingScores([]);
    setGameTimer(22);
    setCaughtCount(0);
    targetXRef.current = 50;
    currentXRef.current = 50;
    if (soundEnabled) sound.playHeartSound();
  };

  // Pointer movement tracking for super-responsive mouse & touch
  const updateTargetFromPointer = (clientX: number) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    targetXRef.current = Math.max(10, Math.min(90, relativeX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateTargetFromPointer(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches[0]) {
      updateTargetFromPointer(e.touches[0].clientX);
    }
  };

  // Mobile virtual arrow buttons
  const stepLeft = () => {
    targetXRef.current = Math.max(10, targetXRef.current - 14);
  };

  const stepRight = () => {
    targetXRef.current = Math.min(90, targetXRef.current + 14);
  };

  return (
    <div
      className={`relative w-full text-white font-sans overflow-hidden select-none transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#1a0b2e] flex flex-col justify-between'
          : 'rounded-3xl bg-[#1a0b2e] border-2 border-purple-500/30 shadow-2xl min-h-[640px]'
      }`}
      style={{ backgroundColor: '#1a0b2e' }}
    >
      {/* Boot Screen Animation Overlay */}
      <AnimatePresence>
        {booting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1a0b2e] text-white p-6"
          >
            <div className="text-6xl animate-bounce">🎂</div>
            <p className="mt-4 font-mono text-base tracking-wider text-purple-200">
              Loading Uma's game…
            </p>
            <div className="mt-6 w-44 h-1.5 bg-purple-950/80 rounded-full overflow-hidden border border-purple-800">
              <div className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 rounded-full animate-pulse w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Cosmic Lights and Star Twinkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Arcade Navigation Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-purple-800/40 bg-[#1a0b2e]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl animate-spin" style={{ animationDuration: '6s' }}>
            🎂
          </span>
          <div>
            <h1 className="text-base sm:text-lg font-serif-luxury font-bold tracking-wide text-pink-200 flex items-center gap-1.5">
              <span>Happy Birthday Uma 🎂</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                1 Oct Special
              </span>
            </h1>
            <p className="text-[11px] text-purple-300/80">
              Stage {stage} of 4:{' '}
              {stage === 1
                ? 'Balloon Pop'
                : stage === 2
                ? 'Midnight Cake'
                : stage === 3
                ? 'Catch Rasmalais'
                : 'Royal Coronation'}
            </p>
          </div>
        </div>

        {/* Right Arcade Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Score Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-700/60 text-amber-300 font-mono font-bold shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{score} PTS</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Game' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-pink-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={handleRestart}
            className="p-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 transition-colors cursor-pointer"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hidden sm:flex p-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Arcade'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close (if in modal) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 transition-colors cursor-pointer"
              title="Close Game"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Game Stage Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 min-h-[480px]">
        {/* ======================================================== */}
        {/* STAGE 1: SWAYING BALLOON POP ARCADE                      */}
        {/* ======================================================== */}
        {stage === 1 && (
          <div className="w-full max-w-2xl flex flex-col items-center text-center">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-widest text-pink-400 font-semibold">
                Level 1: Swaying Balloons 🎈
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
                Pop All 5 Balloons To Reveal Birthday Secrets!
              </h2>
              <p className="text-xs text-purple-300 mt-1">
                Gubbare hawa me lehra rahe hain (swaying). Kisi par bhi tap karein aur secret note
                kholein!
              </p>
            </div>

            {/* Balloon Strings & Swaying Elements */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 my-6 min-h-[220px]">
              {balloons.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => handlePopBalloon(b)}
                >
                  {!b.popped ? (
                    <div
                      className="animate-sway flex flex-col items-center transition-transform active:scale-95 group-hover:scale-105"
                      style={{ animationDelay: b.swayDelay }}
                    >
                      {/* Balloon Oval */}
                      <div
                        className={`w-16 sm:w-20 h-22 sm:h-26 rounded-full bg-gradient-to-t ${b.gradient} shadow-lg shadow-pink-500/20 flex flex-col items-center justify-center relative border border-white/20`}
                      >
                        {/* Light reflection gloss */}
                        <div className="absolute top-2 left-3 w-4 h-6 bg-white/40 rounded-full blur-[1px] -rotate-12" />
                        <span className="text-xs font-bold text-white drop-shadow-md">Pop Me</span>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-200 mt-1 animate-pulse" />
                      </div>

                      {/* Balloon Knot */}
                      <div className="w-2.5 h-2 bg-rose-700 rounded-b-sm -mt-0.5" />

                      {/* Balloon String (Swaying line) */}
                      <div className="w-0.5 h-14 bg-gradient-to-b from-purple-300/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-16 sm:w-20 h-22 sm:h-26 flex flex-col items-center justify-center opacity-30 border border-dashed border-purple-500/40 rounded-full">
                      <span className="text-xl">💥</span>
                      <span className="text-[10px] text-purple-400 mt-1">Popped!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Floating Message Pop Toast using .animate-pop from user's CSS */}
            {activePopupNote && (
              <div
                key={activePopupNote}
                className="animate-pop fixed top-1/2 left-1/2 z-40 max-w-md w-11/12 p-5 rounded-3xl bg-gradient-to-r from-purple-900/95 via-pink-900/95 to-purple-900/95 border-2 border-pink-400 shadow-2xl text-center backdrop-blur-xl pointer-events-none"
              >
                <div className="text-3xl mb-1">💌</div>
                <p className="text-sm sm:text-base font-serif-luxury font-bold text-pink-100 leading-relaxed italic">
                  {activePopupNote}
                </p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mt-4 flex items-center gap-3 text-xs text-purple-300">
              <span>{balloons.filter((b) => b.popped).length} of 5 Popped</span>
              <div className="w-36 h-2 bg-purple-950 rounded-full overflow-hidden border border-purple-700">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${(balloons.filter((b) => b.popped).length / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 2: MIDNIGHT ROYAL CAKE CEREMONY                    */}
        {/* ======================================================== */}
        {stage === 2 && (
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
              Level 2: Midnight Candle & Cake 🎂
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mb-2">
              Make A Wish, Blow Candles & Cut The Cake!
            </h2>
            <p className="text-xs text-purple-300 mb-6">
              1 October ki subah, Uma ke liye ek royal 3-tier cake sajaya gaya hai.
            </p>

            {/* Royal 3-Tier Cake with .animate-bounce-subtle from user's CSS */}
            <div className="animate-bounce-subtle relative flex flex-col items-center my-4 py-4">
              {/* Candles atop cake */}
              <div className="flex items-center gap-6 mb-1 z-20">
                {[1, 2, 3].map((c) => (
                  <div key={c} className="flex flex-col items-center">
                    {/* Flame */}
                    <AnimatePresence>
                      {candlesLit && (
                        <motion.div
                          animate={{
                            scale: [1, 1.25, 0.95, 1.2, 1],
                            y: [0, -1, 1, 0],
                            opacity: [0.9, 1, 0.85, 1],
                          }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                          className="w-3 h-5 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_15px_#f59e0b] -mb-1"
                        />
                      )}
                    </AnimatePresence>
                    {!candlesLit && (
                      <div className="w-1.5 h-3 bg-slate-400 rounded-full blur-[1px] -mb-1 opacity-70" />
                    )}
                    {/* Candle stick */}
                    <div className="w-2 h-7 rounded-sm bg-gradient-to-b from-pink-300 to-rose-400 border border-pink-200" />
                  </div>
                ))}
              </div>

              {/* Tier 1 (Top Tier) */}
              <div className="w-32 h-10 rounded-t-2xl bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 border-2 border-white/60 shadow-lg flex items-center justify-center z-10">
                <span className="text-xs font-bold text-rose-950 font-serif-luxury">Uma ❤️</span>
              </div>

              {/* Tier 2 (Middle Tier) */}
              <div className="w-44 h-12 rounded-t-xl bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 border-2 border-white/60 shadow-lg flex items-center justify-center -mt-1 z-10">
                <span className="text-[11px] tracking-wider font-semibold text-purple-950 uppercase">
                  1 October 🌸
                </span>
              </div>

              {/* Tier 3 (Base Tier) */}
              <div className="w-60 h-14 rounded-xl bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 border-2 border-white/60 shadow-xl flex items-center justify-center -mt-1 relative overflow-hidden z-10">
                <span className="text-xs sm:text-sm font-bold text-white font-serif-luxury drop-shadow-sm">
                  Meri Sweet Rasmalai 🫶🏻
                </span>

                {/* Knife Cut Line Animation */}
                {cakeSliced && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute inset-y-0 left-1/2 w-1 bg-amber-200 shadow-[0_0_8px_#fde047]"
                  />
                )}
              </div>

              {/* Glowing Silver Plate */}
              <div className="w-72 h-3.5 bg-gradient-to-r from-purple-300 via-white to-purple-300 rounded-full shadow-lg shadow-pink-500/20 mt-1 border border-white/40" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {candlesLit ? (
                <button
                  type="button"
                  onClick={handleBlowCandles}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold text-xs shadow-lg shadow-amber-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>Foonk Maaro (Blow Candles 🕯️💨)</span>
                </button>
              ) : !cakeSliced ? (
                <button
                  type="button"
                  onClick={handleCutCake}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold text-xs shadow-lg shadow-pink-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
                >
                  <CakeIcon className="w-4 h-4" />
                  <span>Cake Kaato (Cut The Cake 🎂🔪)</span>
                </button>
              ) : !firstBiteFed ? (
                <button
                  type="button"
                  onClick={handleFeedFirstBite}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer animate-bounce"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Uma Ko Pehla Bite Khilao 🍰 (Feed First Bite)</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-pink-900/60 border border-pink-400 text-pink-200 text-xs font-serif-luxury italic animate-in fade-in">
                  “Sabse meetha bite meri Rasmalai ke naam! Now get ready for the Rasmalai Catcher!”
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 3: CATCH THE SWEET RASMALAIS & HEARTS (SMOOTH)     */}
        {/* ======================================================== */}
        {stage === 3 && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            {/* Top Game HUD */}
            <div className="w-full flex items-center justify-between mb-3 bg-purple-950/70 p-3 rounded-2xl border border-purple-800/60 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="font-bold text-pink-300">Catch The Rasmalais! 🥣</span>
                <span className="text-[11px] text-purple-300/80 hidden sm:inline">
                  Slide plate smoothly with finger, mouse, or arrow keys
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300 bg-purple-900/80 px-2.5 py-1 rounded-xl border border-amber-400/30">
                  <span>Caught: {caughtCount}</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-mono font-bold border border-pink-400/40 shadow-sm animate-pulse">
                  ⏱️ {gameTimer}s
                </div>
              </div>
            </div>

            {/* Interactive Game Canvas Area */}
            <div
              ref={gameAreaRef}
              onPointerMove={handlePointerMove}
              onTouchMove={handleTouchMove}
              className="w-full h-[400px] sm:h-[440px] rounded-3xl bg-gradient-to-b from-[#120624] via-[#170a2d] to-[#1e0d38] border-2 border-purple-500/40 relative overflow-hidden flex flex-col justify-between p-4 cursor-ew-resize shadow-2xl touch-none"
            >
              {/* Subtle Starlight Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

              {/* Falling Objects Rendering */}
              <div className="absolute inset-0 pointer-events-none">
                {fallingItems.map((item) => (
                  <div
                    key={item.id}
                    className="absolute transform -translate-x-1/2 flex flex-col items-center will-change-transform"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                    }}
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow-[0_4px_12px_rgba(236,72,153,0.5)] select-none transition-transform hover:scale-110">
                      {item.type === 'rasmalai' ? '🥣' : item.type === 'heart' ? '💖' : '⭐'}
                    </span>
                  </div>
                ))}

                {/* Floating Score Popups */}
                {floatingScores.map((scoreItem) => (
                  <div
                    key={scoreItem.id}
                    className="absolute transform -translate-x-1/2 -translate-y-full font-serif-luxury font-bold text-xs sm:text-sm text-yellow-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{
                      left: `${scoreItem.x}%`,
                      top: `${scoreItem.y}%`,
                    }}
                  >
                    {scoreItem.text}
                  </div>
                ))}
              </div>

              {/* Smooth Gliding Catcher Plate */}
              <div
                className="absolute bottom-6 transform -translate-x-1/2 will-change-transform pointer-events-none flex flex-col items-center"
                style={{
                  left: `${plateDisplayX}%`,
                  transform: `translateX(-50%) rotate(${plateTilt}deg) scale(${plateBouncing ? 1.15 : 1})`,
                  transition: 'transform 0.08s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {/* Luminous Glow Aura Trail Under Plate */}
                <div
                  className="w-28 h-5 rounded-full blur-md -mb-2 transition-opacity"
                  style={{
                    backgroundColor: 'rgba(236, 72, 153, 0.45)',
                    boxShadow: '0 0 25px rgba(244, 63, 94, 0.7)',
                  }}
                />

                {/* Royal Golden & Rose Gold Plate */}
                <div className="relative w-28 sm:w-32 h-9 rounded-full bg-gradient-to-r from-amber-300 via-pink-400 to-rose-400 p-[2px] shadow-[0_8px_24px_rgba(244,63,94,0.4)]">
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2b1042] via-[#1a082b] to-[#250d3a] flex items-center justify-center gap-1.5 border border-pink-300/40">
                    <span className="text-xs">🥣</span>
                    <span className="text-[11px] font-bold tracking-wider text-pink-200 drop-shadow-sm font-serif-luxury">
                      Uma's Plate
                    </span>
                    <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                  </div>
                </div>

                {/* Subtle Plate Base Stand */}
                <div className="w-14 h-2 bg-gradient-to-r from-purple-800 via-pink-600 to-purple-800 rounded-b-lg border-t border-pink-400/40 opacity-80" />
              </div>
            </div>

            {/* Mobile / Screen Slide Controls for Extra Convenience */}
            <div className="w-full flex items-center justify-between mt-3 px-2">
              <button
                type="button"
                onClick={stepLeft}
                className="px-4 py-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700/60 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-pink-400" />
                <span>Slide Left</span>
              </button>

              <span className="text-[11px] text-purple-400 font-serif-luxury italic">
                Finger or mouse se slide karein ↔️
              </span>

              <button
                type="button"
                onClick={stepRight}
                className="px-4 py-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700/60 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span>Slide Right</span>
                <ArrowRight className="w-4 h-4 text-pink-400" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 4: ROYAL BIRTHDAY QUEEN CORONATION                 */}
        {/* ======================================================== */}
        {stage === 4 && (
          <div className="w-full max-w-xl flex flex-col items-center text-center py-4">
            {/* Animated Royal Crown */}
            <motion.div
              initial={{ y: -60, scale: 0.5, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-950 flex items-center justify-center shadow-[0_0_35px_#f59e0b] mb-4 border-2 border-white"
            >
              <Crown className="w-10 h-10 fill-amber-900 text-amber-950 animate-bounce" />
            </motion.div>

            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
              🎉 Congratulations! Level 4 Victory 🎉
            </span>

            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mb-3">
              Uma is Officially The Queen of 1st October! 👑❤️
            </h2>

            <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-900/60 to-pink-950/60 border border-pink-500/40 text-xs sm:text-sm font-serif-luxury leading-relaxed text-pink-100 shadow-xl max-w-md mx-auto mb-6">
              <p className="italic mb-2">
                «“Puri game jeet li, par sach kahu toh tumne pehli nazar me hi mera dil jeet liya
                tha.”»
              </p>
              <div className="font-sans font-bold text-amber-300 text-xs">
                Final Game Score: {score} Points ⭐ ({caughtCount} Rasmalais Caught)
              </div>
              <div className="text-[11px] text-purple-300 mt-1">
                BGMI spectate match se shuru hua ye safar ab hamesha ke liye amar hai!
              </div>
            </div>

            {/* Victory Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={triggerGrandCelebration}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold text-xs shadow-lg shadow-pink-500/30 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Celebrate With Fireworks 🎆</span>
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Game Again 🎮</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Status Ribbon */}
      <footer className="relative z-20 px-6 py-3 border-t border-purple-800/40 bg-[#1a0b2e]/90 text-[11px] text-purple-300/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          <span>Made with love exclusively for Uma</span>
        </div>
        <span className="font-mono text-pink-300 font-medium">1 Oct 2026 · Happy Birthday</span>
      </footer>
    </div>
  );
};
