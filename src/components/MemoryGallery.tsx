import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, MessageCircle, Maximize2, Download, X, Heart } from 'lucide-react';
import { GalleryItem } from '../types';
import { getStoredGallery } from '../services/storage';
import { sound } from '../services/sound';

export const MemoryGallery: React.FC = () => {
  const [gallery] = useState<GalleryItem[]>(() => getStoredGallery());
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'BGMI Drops', 'Voice Notes', 'Special Photos', 'Sweet Chats'];

  const filteredItems = gallery.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.tag.toLowerCase() === activeFilter.toLowerCase();
  });

  const getMediaIcon = (type: GalleryItem['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-sky-500" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-1">
            Pinterest-Style Visual Vault 📸
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1 mb-3">
            Memory Gallery 📸
          </h2>
          <p className="text-sm text-slate-600">
            Har tasveer, har screenshot aur har BGMI match jo hamare dilon ke kareeb hai.
          </p>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 p-1.5 bg-slate-100/90 rounded-xl max-w-fit mx-auto border border-slate-200/60">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pinterest Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => {
                sound.playHeartSound();
                setActiveItem(item);
              }}
            >
              <div className="glass-card rounded-3xl overflow-hidden border border-white/80 shadow-xs hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                {/* Media Container */}
                <div className="relative overflow-hidden bg-slate-100">
                  {item.type === 'chat' ? (
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 flex flex-col justify-between min-h-[160px]">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                          WhatsApp Whisper
                        </span>
                      </div>
                      <p className="font-serif-luxury italic text-slate-800 text-sm leading-relaxed">
                        “{item.caption}”
                      </p>
                      <span className="text-[11px] text-slate-500 mt-4 block text-right font-medium">
                        — {item.date}
                      </span>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.title}
                        loading="lazy"
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500 max-h-96"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                        <span className="text-xs font-medium">{item.tag}</span>
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata & Caption */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {getMediaIcon(item.type)}
                      <span className="font-medium text-slate-700">{item.tag}</span>
                    </div>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-serif-luxury font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  {item.type !== 'chat' && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}

                  {/* Badges */}
                  {item.badge && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                        <Heart className="w-3 h-3 fill-blue-500 text-blue-500" />
                        <span>{item.badge}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {activeItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Header Close */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveItem(null)}
                    className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Media Viewport */}
                <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden max-h-[70vh]">
                  {activeItem.type === 'chat' ? (
                    <div className="p-8 sm:p-14 text-center max-w-lg mx-auto text-white">
                      <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="font-serif-luxury italic text-xl sm:text-2xl leading-relaxed mb-4">
                        “{activeItem.caption}”
                      </p>
                      <span className="text-sm text-blue-300 font-medium">
                        — {activeItem.date}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={activeItem.url}
                      alt={activeItem.title}
                      className="max-h-[70vh] w-auto max-w-full object-contain mx-auto"
                    />
                  )}
                </div>

                {/* Bottom Details Panel */}
                <div className="p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{activeItem.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-600 font-medium">{activeItem.tag}</span>
                    </div>
                    <h3 className="text-xl font-serif-luxury font-bold text-slate-900">
                      {activeItem.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                      {activeItem.caption}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={activeItem.url}
                      download={`Uma_Memory_${activeItem.id}.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
