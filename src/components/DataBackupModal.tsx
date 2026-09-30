import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Upload, RotateCcw, Copy, Check, X, Database } from 'lucide-react';
import {
  exportFullData,
  importFullData,
  resetToDefaults,
  getStoredMemories,
  getStoredMoods,
  getStoredEvents,
  getStoredGallery,
  getStoredVoiceItems,
  getStoredLoveLetter,
  getStoredHeroConfig,
  getStoredFightConfig,
  getStoredSectionVisibility,
  getStoredFlowers
} from '../services/storage';
import { sound } from '../services/sound';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({ isOpen, onClose, onDataChanged }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentData = {
    heroConfig: getStoredHeroConfig(),
    fightConfig: getStoredFightConfig(),
    memories: getStoredMemories(),
    gallery: getStoredGallery(),
    voice: getStoredVoiceItems(),
    moods: getStoredMoods(),
    events: getStoredEvents(),
    flowers: getStoredFlowers(),
    loveLetter: getStoredLoveLetter(),
    sectionsVisibility: getStoredSectionVisibility(),
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(currentData, null, 2));
    setCopied(true);
    sound.playHeartSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    sound.playHeartSound();
    exportFullData();
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;

    const ok = importFullData(jsonInput);
    if (ok) {
      sound.playUnlockCelebration();
      setImportStatus('Data successfully imported and saved!');
      setTimeout(() => {
        onDataChanged();
        onClose();
      }, 1000);
    } else {
      setImportStatus('Invalid JSON format. Please verify the structure.');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset memories and events to initial defaults?')) {
      resetToDefaults();
      sound.playHeartSound();
      onDataChanged();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl glass-card rounded-3xl p-6 border border-white shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-serif-luxury font-bold">
              Memory Database & JSON Manager
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          <p className="text-slate-600">
            All your memories, gallery items, recorded voices, mood tracker entries, and relationship events are stored safely inside your browser's LocalStorage. You can export a JSON backup file or import one anytime.
          </p>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-medium flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export Full JSON</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-medium flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          {/* Import JSON Form */}
          <form onSubmit={handleImport} className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-slate-700 font-semibold">
              Import / Restore from JSON String:
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={5}
              placeholder='Paste exported backup JSON here ({"memories": [...], "moods": [...]})'
              className="w-full px-3 py-2 rounded-xl glass-input font-mono text-[11px]"
            />

            {importStatus && (
              <p className={`text-xs font-medium ${importStatus.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {importStatus}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Import & Overwrite</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
