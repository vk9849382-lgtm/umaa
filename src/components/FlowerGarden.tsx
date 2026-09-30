import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Droplets,
  Heart,
  Plus,
  Calendar,
  Eye,
  Trash2,
  Edit3,
  Check,
  X,
  Smile,
  Info,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlantedFlower, FlowerType } from '../types';
import { getStoredFlowers, saveFlowers } from '../services/storage';
import { sound } from '../services/sound';

interface FlowerGardenProps {
  editMode?: boolean;
}

interface FlowerMeta {
  type: FlowerType;
  name: string;
  hindiName: string;
  symbolism: string;
  defaultColor: string;
  accentBg: string;
  icon: string;
  textColor: string;
}

const FLOWER_CATALOG: Record<FlowerType, FlowerMeta> = {
  rose: {
    type: 'rose',
    name: 'Red Velvet Rose',
    hindiName: 'Gulab',
    symbolism: 'Passionate Love & Devotion',
    defaultColor: '#f43f5e',
    accentBg: 'bg-rose-50 border-rose-200',
    icon: '🌹',
    textColor: 'text-rose-600',
  },
  tulip: {
    type: 'tulip',
    name: 'Pink Blush Tulip',
    hindiName: 'Tulip',
    symbolism: 'Sweet Affection & Gentle Care',
    defaultColor: '#ec4899',
    accentBg: 'bg-pink-50 border-pink-200',
    icon: '🌷',
    textColor: 'text-pink-600',
  },
  lotus: {
    type: 'lotus',
    name: 'Serene Blue Lotus',
    hindiName: 'Kamal',
    symbolism: 'Pure Peace & Soul Connection',
    defaultColor: '#38bdf8',
    accentBg: 'bg-sky-50 border-sky-200',
    icon: '🪷',
    textColor: 'text-sky-600',
  },
  sunflower: {
    type: 'sunflower',
    name: 'Golden Sunflower',
    hindiName: 'Surajmukhi',
    symbolism: 'Warmth, Joy & Sunshine Smile',
    defaultColor: '#eab308',
    accentBg: 'bg-amber-50 border-amber-200',
    icon: '🌻',
    textColor: 'text-amber-600',
  },
  lily: {
    type: 'lily',
    name: 'Graceful Cherry Lily',
    hindiName: 'Kumudini',
    symbolism: 'Beauty, Grace & Sweetness',
    defaultColor: '#f472b6',
    accentBg: 'bg-rose-50/60 border-rose-200',
    icon: '🌸',
    textColor: 'text-rose-500',
  },
  orchid: {
    type: 'orchid',
    name: 'Royal Purple Orchid',
    hindiName: 'Orchid',
    symbolism: 'Rare, Precious & Unique Bond',
    defaultColor: '#a855f7',
    accentBg: 'bg-purple-50 border-purple-200',
    icon: '🌺',
    textColor: 'text-purple-600',
  },
  daisy: {
    type: 'daisy',
    name: 'Happy Star Daisy',
    hindiName: 'Gulbahar',
    symbolism: 'Childlike Innocence & Happy Memories',
    defaultColor: '#10b981',
    accentBg: 'bg-emerald-50 border-emerald-200',
    icon: '🌼',
    textColor: 'text-emerald-600',
  },
};

export const FlowerGarden: React.FC<FlowerGardenProps> = () => {
  const [flowers, setFlowers] = useState<PlantedFlower[]>(() => getStoredFlowers());
  const [filterAuthor, setFilterAuthor] = useState<'all' | 'her' | 'him' | 'together'>('all');
  const [selectedFlower, setSelectedFlower] = useState<PlantedFlower | null>(null);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [editingFlower, setEditingFlower] = useState<PlantedFlower | null>(null);
  const [waterEffectId, setWaterEffectId] = useState<string | null>(null);

  // Form State
  const [formType, setFormType] = useState<FlowerType>('rose');
  const [formAuthor, setFormAuthor] = useState<'him' | 'her' | 'together'>('him');
  const [formMessage, setFormMessage] = useState('');
  const [formSecretNote, setFormSecretNote] = useState('');
  const [formColor, setFormColor] = useState('#f43f5e');

  const filteredFlowers = flowers.filter((f) => {
    if (filterAuthor === 'all') return true;
    return f.plantedBy === filterAuthor;
  });

  const totalWaterings = flowers.reduce((sum, f) => sum + (f.waterCount || 0), 0);
  const bloomingCount = flowers.filter((f) => f.growthStage === 'bloomed').length;

  const handleWater = (flowerId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playWaterSound();

    // Trigger local water splash
    setWaterEffectId(flowerId);
    setTimeout(() => setWaterEffectId(null), 1200);

    // Light confetti burst
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#60a5fa', '#38bdf8', '#93c5fd', '#34d399', '#f472b6'],
      shapes: ['circle'],
    });

    const updated = flowers.map((f) => {
      if (f.id !== flowerId) return f;
      const nextCount = (f.waterCount || 0) + 1;
      let nextStage = f.growthStage;
      if (nextCount >= 8) nextStage = 'bloomed';
      else if (nextCount >= 4) nextStage = 'bud';
      else if (nextCount >= 2) nextStage = 'sprout';

      if (nextStage === 'bloomed' && f.growthStage !== 'bloomed') {
        sound.playBloomChime();
      }

      return {
        ...f,
        waterCount: nextCount,
        growthStage: nextStage,
        lastWatered: new Date().toISOString(),
      };
    });

    setFlowers(updated);
    saveFlowers(updated);

    if (selectedFlower && selectedFlower.id === flowerId) {
      const match = updated.find((f) => f.id === flowerId);
      if (match) setSelectedFlower(match);
    }
  };

  const openPlantModal = (editItem?: PlantedFlower) => {
    sound.playHeartSound();
    if (editItem) {
      setEditingFlower(editItem);
      setFormType(editItem.flowerType);
      setFormAuthor(editItem.plantedBy);
      setFormMessage(editItem.message);
      setFormSecretNote(editItem.secretNote || '');
      setFormColor(editItem.petalColor || FLOWER_CATALOG[editItem.flowerType].defaultColor);
    } else {
      setEditingFlower(null);
      setFormType('rose');
      setFormAuthor('him');
      setFormMessage('');
      setFormSecretNote('');
      setFormColor(FLOWER_CATALOG.rose.defaultColor);
    }
    setIsPlantModalOpen(true);
  };

  const handleSaveFlower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMessage.trim()) return;

    sound.playBloomChime();
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#38bdf8', '#fbbf24'],
    });

    if (editingFlower) {
      const updated = flowers.map((f) => {
        if (f.id !== editingFlower.id) return f;
        return {
          ...f,
          flowerType: formType,
          plantedBy: formAuthor,
          message: formMessage.trim(),
          secretNote: formSecretNote.trim() || undefined,
          petalColor: formColor,
        };
      });
      setFlowers(updated);
      saveFlowers(updated);
      if (selectedFlower && selectedFlower.id === editingFlower.id) {
        const found = updated.find((f) => f.id === editingFlower.id);
        if (found) setSelectedFlower(found);
      }
    } else {
      const newFlower: PlantedFlower = {
        id: `flower-${Date.now()}`,
        flowerType: formType,
        plantedBy: formAuthor,
        message: formMessage.trim(),
        secretNote: formSecretNote.trim() || undefined,
        plantedAt: new Date().toISOString().slice(0, 10),
        waterCount: 3,
        growthStage: 'bloomed',
        petalColor: formColor,
      };
      const updated = [newFlower, ...flowers];
      setFlowers(updated);
      saveFlowers(updated);
    }

    setIsPlantModalOpen(false);
  };

  const handleDeleteFlower = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm('Kya aap is phool ko bageeche se hatana chahte hain?')) {
      const updated = flowers.filter((f) => f.id !== id);
      setFlowers(updated);
      saveFlowers(updated);
      sound.playHeartSound();
      if (selectedFlower?.id === id) {
        setSelectedFlower(null);
      }
    }
  };

  const renderFlowerVisual = (flower: PlantedFlower, size: 'card' | 'modal' = 'card') => {
    const meta = FLOWER_CATALOG[flower.flowerType] || FLOWER_CATALOG.rose;
    const isWatering = waterEffectId === flower.id;

    const sizeClasses =
      size === 'modal'
        ? 'w-24 h-24 text-6xl'
        : 'w-16 h-16 text-4xl';

    return (
      <div className="relative flex flex-col items-center justify-center">
        {/* Ambient Bloom Glow */}
        <div
          className={`absolute rounded-full blur-xl transition-all duration-500 ${
            size === 'modal' ? 'w-28 h-28 opacity-40' : 'w-16 h-16 opacity-30'
          }`}
          style={{ backgroundColor: flower.petalColor || meta.defaultColor }}
        />

        {/* Flower Emoji / Stem */}
        <motion.div
          animate={
            isWatering
              ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }
              : { y: [0, -3, 0] }
          }
          transition={{
            duration: isWatering ? 0.6 : 3,
            repeat: isWatering ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className={`${sizeClasses} flex items-center justify-center filter drop-shadow-md select-none cursor-pointer z-10`}
        >
          {meta.icon}
        </motion.div>

        {/* Stem and Leaves base */}
        <div className="w-1.5 h-3 bg-emerald-500 rounded-full mt-[-2px] relative z-0">
          <div className="absolute -left-1.5 top-0.5 w-2 h-1 bg-emerald-400 rounded-full rotate-[-30deg]" />
          <div className="absolute -right-1.5 top-1 w-2 h-1 bg-emerald-400 rounded-full rotate-[30deg]" />
        </div>

        {/* Soil Mound */}
        <div className="w-8 h-2 bg-amber-900/20 rounded-full mt-0.5" />
      </div>
    );
  };

  return (
    <section id="garden" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Soft Sunlight & Garden Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-rose-100/30 via-sky-100/30 to-emerald-50/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin-slow" />
            <span>Virtual Flower Sanctuary · Dil Se Khilta Pyar</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1 mb-3">
            Our Virtual Flower Garden 🌸
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-serif-luxury">
            Ek aisi pyaari jagah jahan hum dono phool laga sakte hain, apne dil ki baatein unme likh sakte hain, aur pyaar ka paani dekar unhe hamesha khilta dekh sakte hain.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 max-w-xl mx-auto">
            <div className="glass-card rounded-2xl p-3 border border-white/80 text-center shadow-xs">
              <span className="block text-2xl font-serif-luxury font-bold text-rose-600">
                {flowers.length}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Planted Blooms 💐</span>
            </div>
            <div className="glass-card rounded-2xl p-3 border border-white/80 text-center shadow-xs">
              <span className="block text-2xl font-serif-luxury font-bold text-sky-600">
                {totalWaterings}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Times Watered 💧</span>
            </div>
            <div className="glass-card rounded-2xl p-3 border border-white/80 text-center shadow-xs">
              <span className="block text-2xl font-serif-luxury font-bold text-emerald-600">
                {bloomingCount}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">In Full Bloom 🌸</span>
            </div>
            <div className="glass-card rounded-2xl p-3 border border-white/80 text-center shadow-xs">
              <span className="block text-2xl font-serif-luxury font-bold text-purple-600">
                Forever
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Growing Bond 🫶🏻</span>
            </div>
          </div>

          {/* Controls: Filter & Plant Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {/* Filter Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-medium border border-slate-200/60">
              <button
                type="button"
                onClick={() => setFilterAuthor('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterAuthor === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Flowers ({flowers.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterAuthor('her')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterAuthor === 'her'
                    ? 'bg-white text-rose-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                Uma's 🌸
              </button>
              <button
                type="button"
                onClick={() => setFilterAuthor('him')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterAuthor === 'him'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                His 💙
              </button>
              <button
                type="button"
                onClick={() => setFilterAuthor('together')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterAuthor === 'together'
                    ? 'bg-white text-purple-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                Together 🫶🏻
              </button>
            </div>

            {/* Plant a New Flower Button */}
            <button
              type="button"
              onClick={() => openPlantModal()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Plant a Love Flower 🌷</span>
            </button>
          </div>
        </div>

        {/* Garden Meadow Grid */}
        {filteredFlowers.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 border border-white text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl mx-auto mb-3 shadow-xs">
              🌱
            </div>
            <h4 className="text-lg font-serif-luxury font-bold text-slate-800 mb-1">
              Bageeche me abhi koi phool nahi hai
            </h4>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Aap ya Uma yahan pehla digital phool laga sakte hain aur usme apne dil ka paigaam likh sakte hain.
            </p>
            <button
              type="button"
              onClick={() => openPlantModal()}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Pehla Phool Lagao 🌸</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFlowers.map((flower) => {
              const meta = FLOWER_CATALOG[flower.flowerType] || FLOWER_CATALOG.rose;
              const isWatering = waterEffectId === flower.id;

              const authorLabel =
                flower.plantedBy === 'her'
                  ? 'Uma (Rasmalai) 🌸'
                  : flower.plantedBy === 'him'
                  ? 'Her Special Someone 💙'
                  : 'Hum Dono 🫶🏻';

              const authorBadgeBg =
                flower.plantedBy === 'her'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : flower.plantedBy === 'him'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200';

              return (
                <div
                  key={flower.id}
                  onClick={() => {
                    sound.playHeartSound();
                    setSelectedFlower(flower);
                  }}
                  className="glass-card rounded-3xl p-5 border border-white/90 hover:border-rose-200 transition-all duration-300 hover:shadow-lg relative group cursor-pointer flex flex-col justify-between"
                >
                  {/* Card Header: Type & Author */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${authorBadgeBg}`}
                    >
                      {authorLabel}
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {flower.plantedAt}
                    </span>
                  </div>

                  {/* Card Center: Visual Flower Bloom */}
                  <div className="py-4 my-auto flex flex-col items-center justify-center">
                    {renderFlowerVisual(flower, 'card')}

                    <h3 className="text-base font-serif-luxury font-bold text-slate-900 mt-3 text-center">
                      {meta.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 italic">
                      «{meta.symbolism}»
                    </span>
                  </div>

                  {/* Card Content: Love Message Snippet */}
                  <div className="my-3 px-3 py-2.5 rounded-2xl bg-white/70 border border-slate-100 text-xs text-slate-700 leading-relaxed font-serif-luxury italic line-clamp-2">
                    “{flower.message}”
                  </div>

                  {/* Card Footer: Watering Interaction & Details */}
                  <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Droplets className="w-3.5 h-3.5 text-sky-500" />
                      <span>{flower.waterCount || 0} times watered</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleWater(flower.id, e)}
                        title="Water this flower with love 💧"
                        className="px-3 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1 transition-all active:scale-90 cursor-pointer shadow-2xs"
                      >
                        <Droplets className={`w-3 h-3 ${isWatering ? 'animate-bounce text-sky-600' : ''}`} />
                        <span>Water 💧</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playHeartSound();
                          setSelectedFlower(flower);
                        }}
                        title="Open flower love note"
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: View Flower Details & Secret Note */}
        <AnimatePresence>
          {selectedFlower && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-lg glass-card rounded-3xl p-6 border border-white shadow-2xl my-8 relative overflow-hidden"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedFlower(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Top Flower Visual Display */}
                <div className="flex flex-col items-center text-center pt-2 pb-4 border-b border-slate-100">
                  {renderFlowerVisual(selectedFlower, 'modal')}

                  <h3 className="text-2xl font-serif-luxury font-bold text-slate-900 mt-4">
                    {FLOWER_CATALOG[selectedFlower.flowerType]?.name || selectedFlower.flowerType}
                  </h3>

                  <p className="text-xs text-rose-600 font-medium italic mt-0.5">
                    {FLOWER_CATALOG[selectedFlower.flowerType]?.symbolism}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Planted by:{' '}
                      {selectedFlower.plantedBy === 'her'
                        ? 'Uma 🌸'
                        : selectedFlower.plantedBy === 'him'
                        ? 'Her Love 💙'
                        : 'Hum Dono 🫶🏻'}
                    </span>

                    <span className="text-[11px] font-mono text-slate-500">
                      On {selectedFlower.plantedAt}
                    </span>
                  </div>
                </div>

                {/* Love Note Body */}
                <div className="my-5 space-y-4">
                  <div className="p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-2xs">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Love Message From The Heart
                    </span>
                    <p className="text-sm font-serif-luxury text-slate-800 leading-relaxed italic whitespace-pre-wrap">
                      “{selectedFlower.message}”
                    </p>
                  </div>

                  {selectedFlower.secretNote && (
                    <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Secret Whisper / Dil Ki Baat</span>
                      </span>
                      <p className="text-xs font-serif-luxury text-rose-950 leading-relaxed italic whitespace-pre-wrap">
                        {selectedFlower.secretNote}
                      </p>
                    </div>
                  )}

                  {/* Growth Status */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs">
                    <div className="flex items-center gap-2 text-sky-900 font-medium">
                      <Droplets className="w-4 h-4 text-sky-500" />
                      <span>Watered {selectedFlower.waterCount || 0} times with love</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-white text-emerald-700 font-semibold text-[11px] border border-emerald-200 shadow-2xs">
                      {selectedFlower.growthStage === 'bloomed' ? '🌸 In Full Bloom' : '🌱 Growing Sprout'}
                    </span>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedFlower(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWater(selectedFlower.id)}
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <Droplets className="w-4 h-4 text-white" />
                    <span>Water Bloom 💧</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Plant / Edit Flower */}
        <AnimatePresence>
          {isPlantModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg glass-card rounded-3xl p-6 border border-white shadow-2xl my-8 relative"
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-serif-luxury font-bold text-slate-900">
                      {editingFlower ? 'Edit Planted Flower' : 'Plant a New Love Flower 🌷'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ek digital phool lagayein jo aap dono ke badhte pyaar ka prateek ho.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlantModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveFlower} className="space-y-4 text-xs">
                  {/* Flower Variety Selector */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      Choose Flower Variety 🌺
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(Object.keys(FLOWER_CATALOG) as FlowerType[]).map((ft) => {
                        const meta = FLOWER_CATALOG[ft];
                        const isSelected = formType === ft;
                        return (
                          <button
                            key={ft}
                            type="button"
                            onClick={() => {
                              setFormType(ft);
                              setFormColor(meta.defaultColor);
                            }}
                            className={`p-2.5 rounded-2xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200 text-slate-900 shadow-2xs'
                                : 'bg-white/80 border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className="text-2xl">{meta.icon}</span>
                            <div className="min-w-0">
                              <span className="block font-bold text-[11px] truncate">
                                {meta.name}
                              </span>
                              <span className="block text-[10px] text-slate-500 truncate">
                                {meta.symbolism}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Planter Selection */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">
                      Who is Planting This Flower? ✍️
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormAuthor('him')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          formAuthor === 'him'
                            ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold ring-1 ring-blue-300'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-sm">💙</span>
                        <span>Him</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormAuthor('her')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          formAuthor === 'her'
                            ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold ring-1 ring-rose-300'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-sm">🌸</span>
                        <span>Uma (Her)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormAuthor('together')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          formAuthor === 'together'
                            ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold ring-1 ring-purple-300'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-sm">🫶🏻</span>
                        <span>Together</span>
                      </button>
                    </div>
                  </div>

                  {/* Custom Message */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Love Message / Dil Ka Paigaam 💌
                    </label>
                    <textarea
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      rows={3}
                      placeholder="e.g. BGMI match spectate se shuru hua ye rishta hamesha aise hi gulab ki tarah khilta rahe..."
                      required
                      className="w-full px-3 py-2 rounded-xl glass-input font-serif-luxury"
                    />
                  </div>

                  {/* Secret Note */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Secret Love Whisper (Optional) 🤫
                    </label>
                    <input
                      type="text"
                      value={formSecretNote}
                      onChange={(e) => setFormSecretNote(e.target.value)}
                      placeholder="Ek aisi baat jo phool kholne par dikhe..."
                      className="w-full px-3 py-2 rounded-xl glass-input font-serif-luxury"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsPlantModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingFlower ? 'Update Flower' : 'Plant in Garden 🌸'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
