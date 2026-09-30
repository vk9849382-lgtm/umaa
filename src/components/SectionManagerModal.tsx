import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  X,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { SectionId, SectionVisibilityMap } from '../types';
import { ALL_SECTIONS } from '../services/storage';
import { sound } from '../services/sound';

interface SectionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibility: SectionVisibilityMap;
  onToggleSection: (id: SectionId) => void;
  onRemoveSection: (id: SectionId) => void;
  onRestoreAll: () => void;
}

export const SectionManagerModal: React.FC<SectionManagerModalProps> = ({
  isOpen,
  onClose,
  visibility,
  onToggleSection,
  onRemoveSection,
  onRestoreAll
}) => {
  if (!isOpen) return null;

  const totalSections = ALL_SECTIONS.length;
  const activeCount = ALL_SECTIONS.filter((s) => visibility[s.id] !== false).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl glass-card rounded-3xl p-5 sm:p-7 border border-white/90 shadow-2xl flex flex-col max-h-[90vh] bg-white/95"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif-luxury font-bold text-slate-900 leading-tight">
                Manage & Remove Sections
              </h3>
              <p className="text-xs text-slate-500">
                Koi bhi section poora remove karein ya apni pasand se on/off karein
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Summary Bar */}
        <div className="py-3 px-4 my-3 bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-indigo-50/80 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span className="font-semibold text-slate-800">
              Active Sections: {activeCount} / {totalSections}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playHeartSound();
              onRestoreAll();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-medium border border-blue-200/80 shadow-xs transition-colors"
            title="Restore all removed sections"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sabhi Wapas Lao</span>
          </button>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1">
          {ALL_SECTIONS.map((section) => {
            const isVisible = visibility[section.id] !== false;

            return (
              <div
                key={section.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  isVisible
                    ? 'bg-white border-slate-200/80 hover:border-blue-300 shadow-xs'
                    : 'bg-slate-50/70 border-dashed border-slate-300 opacity-75'
                }`}
              >
                {/* Left: Icon & Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      isVisible ? 'bg-blue-50' : 'bg-slate-100 grayscale'
                    }`}
                  >
                    {section.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          isVisible ? 'text-slate-900' : 'text-slate-500 line-through'
                        }`}
                      >
                        {section.name}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                        {section.hindiTitle}
                      </span>
                      {isVisible ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                          <EyeOff className="w-3 h-3" /> Removed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Toggle button */}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playHeartSound();
                      onToggleSection(section.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isVisible
                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                    title={isVisible ? 'Hide Section' : 'Show Section'}
                  >
                    {isVisible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </>
                    )}
                  </button>

                  {/* Complete Remove Button */}
                  {isVisible && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playHeartSound();
                        onRemoveSection(section.id);
                      }}
                      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 transition-colors flex items-center gap-1"
                      title="Poora section remove karo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline font-semibold">Remove</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & Done button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Changes turant save ho jaate hain aur Navbar me bhi update ho jaate hain.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
