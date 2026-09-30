import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, Calendar, Sparkles } from 'lucide-react';
import { MemoryItem } from '../types';
import { getStoredMemories } from '../services/storage';
import { sound } from '../services/sound';

export const JourneyTimeline: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => getStoredMemories());
  const [filterTag, setFilterTag] = useState<string>('all');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  const filteredMemories = filterTag === 'all'
    ? memories
    : memories.filter((m) => m.tag?.toLowerCase() === filterTag.toLowerCase());

  const handleSelectMemory = (mem: MemoryItem) => {
    sound.playHeartSound();
    setSelectedMemory(selectedMemory?.id === mem.id ? null : mem);
  };

  return (
    <section id="journey" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-1">
            Our Interactive Timeline 🗺️
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1 mb-3">
            Hamara Khoobsurat Safar 💙
          </h2>
          <p className="text-sm text-slate-600">
            17 April 2026 ke pehle match se lekar aaj tak, hamare har khoobsurat pal ki yaadein.
          </p>

          {/* Segmented controls */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-xl max-w-fit mx-auto border border-slate-200/50">
            {['all', 'BGMI', 'Milestone', 'Call', 'Special', 'Gift'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  filterTag === tag
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tag === 'all' ? 'All Milestones' : tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timeline Path */}
        <div className="relative">
          {/* Vertical Center Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-blue-200 -translate-x-1/2" />

          <div className="space-y-8">
            {filteredMemories.map((mem, index) => {
              const isEven = index % 2 === 0;
              const isHighlight = mem.date.includes('17 April') || mem.date.includes('15 June');

              return (
                <motion.div
                  key={mem.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Node Indicator */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-blue-400 items-center justify-center shadow-sm z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  </div>

                  {/* Spacer for 2-column alternate look */}
                  <div className="hidden md:block w-1/2" />

                  {/* Card Container */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-10' : 'md:pl-10'}`}>
                    <div
                      onClick={() => handleSelectMemory(mem)}
                      className={`glass-card rounded-3xl p-6 border transition-all cursor-pointer ${
                        isHighlight
                          ? 'border-blue-300 ring-2 ring-blue-400/20 shadow-md bg-gradient-to-br from-white to-blue-50/40'
                          : 'border-white/80 hover:shadow-md'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{mem.date}</span>
                        </span>

                        {mem.tag && (
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            {mem.tag}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-serif-luxury font-bold text-slate-900 mb-2">
                        {mem.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-serif-luxury mb-4">
                        {mem.description}
                      </p>

                      {/* Image if available */}
                      {mem.image && (
                        <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 mb-4 border border-slate-100 shadow-2xs">
                          <img
                            src={mem.image}
                            alt={mem.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Hinglish Personal Love Note */}
                      {mem.hinglishNote && (
                        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/80 text-xs text-slate-700 font-serif-luxury italic leading-relaxed mb-3">
                          <div className="flex items-center gap-1.5 font-semibold text-blue-700 not-italic mb-1">
                            <Heart className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
                            <span>Dil Ki Baat:</span>
                          </div>
                          <p>{mem.hinglishNote}</p>
                        </div>
                      )}

                      {/* Location Badge */}
                      {mem.location && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{mem.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
