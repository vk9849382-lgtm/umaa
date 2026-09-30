import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Mic, MicOff, Volume2, Upload, Sparkles, Heart, Edit2, Trash2, RotateCcw, Check } from 'lucide-react';
import { VoiceItem } from '../types';
import { getStoredVoiceItems, saveVoiceItems, INITIAL_VOICE_ITEMS } from '../services/storage';
import { sound } from '../services/sound';

export const VoiceMuseum: React.FC = () => {
  const [voiceList, setVoiceList] = useState<VoiceItem[]>(getStoredVoiceItems());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState<VoiceItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<VoiceItem['category']>('Emotional');
  const [formHinglish, setFormHinglish] = useState('');
  const [formDuration, setFormDuration] = useState('0:30');
  const [formAudioUrl, setFormAudioUrl] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);

  const categories: Array<VoiceItem['category'] | 'All'> = [
    'All',
    'Good Morning',
    'Good Night',
    'Funny',
    'Emotional',
    'Miss You'
  ];

  const filteredVoices = voiceList.filter((v) => {
    if (selectedCategory === 'All') return true;
    return v.category === selectedCategory;
  });

  const handlePlayVoice = (item: VoiceItem) => {
    if (currentPlayingId === item.id) {
      setCurrentPlayingId(null);
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
    } else {
      setCurrentPlayingId(item.id);

      if (item.audioBlobUrl) {
        if (!customAudioRef.current) {
          customAudioRef.current = new Audio(item.audioBlobUrl);
        } else {
          customAudioRef.current.src = item.audioBlobUrl;
        }
        customAudioRef.current.play();
        customAudioRef.current.onended = () => setCurrentPlayingId(null);
      } else {
        sound.playVoiceSnippet(item.category);
        setTimeout(() => {
          setCurrentPlayingId(null);
        }, 3000);
      }
    }
  };

  const openAddModal = () => {
    setEditingVoice(null);
    setFormTitle('');
    setFormCategory('Emotional');
    setFormHinglish('');
    setFormDuration('0:30');
    setFormAudioUrl('');
    setRecordedAudioUrl(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: VoiceItem) => {
    setEditingVoice(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormHinglish(item.hinglishText);
    setFormDuration(item.duration);
    setFormAudioUrl(item.audioBlobUrl || '');
    setRecordedAudioUrl(item.audioBlobUrl || null);
    setIsModalOpen(true);
  };

  const startLiveRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setFormAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      alert('Microphone access is required to record real voice messages.');
    }
  };

  const stopLiveRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setFormDuration(`${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = event.target.result as string;
          setFormAudioUrl(res);
          setRecordedAudioUrl(res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveVoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    sound.playHeartSound();

    if (editingVoice) {
      const updated = voiceList.map((item) =>
        item.id === editingVoice.id
          ? {
              ...item,
              title: formTitle,
              category: formCategory,
              hinglishText: formHinglish,
              duration: formDuration,
              audioBlobUrl: formAudioUrl || undefined,
            }
          : item
      );
      setVoiceList(updated);
      saveVoiceItems(updated);
    } else {
      const newItem: VoiceItem = {
        id: `v-${Date.now()}`,
        category: formCategory,
        title: formTitle,
        hinglishText: formHinglish || 'Recorded voice memory for Uma.',
        duration: formDuration,
        audioBlobUrl: formAudioUrl || undefined,
        theme: 'Live Audio Note',
        frequencies: [30, 45, 70, 85, 90, 60, 40, 80, 75, 50, 65, 45],
      };
      const updated = [newItem, ...voiceList];
      setVoiceList(updated);
      saveVoiceItems(updated);
    }

    setIsModalOpen(false);
  };

  const handleDeleteVoice = (id: string) => {
    if (confirm('Kya aap is voice note ko delete karna chahte hain?')) {
      const updated = voiceList.filter((v) => v.id !== id);
      setVoiceList(updated);
      saveVoiceItems(updated);
      if (currentPlayingId === id) setCurrentPlayingId(null);
      sound.playHeartSound();
    }
  };

  const handleResetVoices = () => {
    if (confirm('Kya aap voice notes ko initial default list par reset karna chahte hain?')) {
      setVoiceList(INITIAL_VOICE_ITEMS);
      saveVoiceItems(INITIAL_VOICE_ITEMS);
      sound.playHeartSound();
    }
  };

  return (
    <motion.section
      id="voice"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 md:py-24 relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Acoustic Memory Archive · Fully Editable
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1 mb-3">
            Voice Museum 🎙️
          </h2>
          <p className="text-sm text-slate-600">
            «“I love her gorgeous voice.”» — Har dialogue aur voice note ko edit, customize ya add karein.
          </p>

          {/* Categories Tab Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 p-1.5 bg-slate-100/80 rounded-xl max-w-fit mx-auto border border-slate-200/50">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Mic className="w-4 h-4" />
              <span>Record or Add Voice Note</span>
            </button>

            <button
              type="button"
              onClick={handleResetVoices}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Voices</span>
            </button>
          </div>
        </motion.div>

        {/* Voice Note Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVoices.map((item, index) => {
            const isPlaying = currentPlayingId === item.id;
            const freqs = item.frequencies || [25, 45, 65, 80, 50, 35, 60, 90, 75, 40, 55, 30];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.08 }}
                className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative group ${
                  isPlaying ? 'border-blue-400 bg-blue-50/40 shadow-md' : 'border-white/90 hover:shadow-md'
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-blue-600">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums">{item.duration}</span>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      title="Edit voice dialogue and words"
                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVoice(item.id)}
                      title="Remove voice note"
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-serif-luxury font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>

                {/* Hinglish Transcript */}
                <p className="text-xs text-slate-600 font-serif-luxury italic leading-relaxed mb-4 bg-white/70 p-3 rounded-xl border border-white">
                  {item.hinglishText}
                </p>

                {/* Animated Waveform & Player Control */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => handlePlayVoice(item)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform active:scale-95 shrink-0 shadow-sm ${
                      isPlaying
                        ? 'bg-blue-600 text-white shadow-blue-500/30'
                        : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  {/* Waveform Bars */}
                  <div className="flex-1 flex items-center gap-1 h-8 px-2 bg-blue-50/60 rounded-xl overflow-hidden">
                    {freqs.map((val, idx) => (
                      <motion.div
                        key={idx}
                        className={`flex-1 rounded-full ${
                          isPlaying ? 'bg-blue-500' : 'bg-blue-200'
                        }`}
                        animate={
                          isPlaying
                            ? {
                                height: [`${Math.max(15, val * 0.4)}%`, `${Math.min(100, val * 1.2)}%`, `${Math.max(20, val * 0.6)}%`],
                              }
                            : { height: `${val}%` }
                        }
                        transition={
                          isPlaying
                            ? {
                                repeat: Infinity,
                                duration: 0.6,
                                delay: idx * 0.05,
                                ease: 'easeInOut',
                              }
                            : { duration: 0.3 }
                        }
                        style={{ minHeight: '4px' }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add/Edit Voice Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md glass-card rounded-3xl p-6 border border-white shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <h3 className="text-xl font-serif-luxury font-bold text-slate-900">
                    {editingVoice ? 'Edit Voice Words & Audio' : 'Add Voice Note'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Live Recorder UI */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center mb-4">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-blue-700">Microphone Audio Recording</span>
                    {isRecording && (
                      <div className="text-sm font-mono text-rose-600 font-bold mt-1 animate-pulse">
                        Recording: {recordingTime}s
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-3">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startLiveRecording}
                        className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopLiveRecording}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>Stop & Save Audio</span>
                      </button>
                    )}
                  </div>

                  {recordedAudioUrl && (
                    <div className="mt-3">
                      <p className="text-[11px] text-emerald-600 font-medium mb-1">
                        Audio captured! Ready to save.
                      </p>
                      <audio src={recordedAudioUrl} controls className="w-full h-8" />
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveVoice} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Meethi Good Morning Voice..."
                      required
                      className="w-full px-3 py-2 rounded-xl glass-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as VoiceItem['category'])}
                        className="w-full px-3 py-2 rounded-xl glass-input"
                      >
                        <option value="Good Morning">Good Morning</option>
                        <option value="Good Night">Good Night</option>
                        <option value="Funny">Funny</option>
                        <option value="Emotional">Emotional</option>
                        <option value="Miss You">Miss You</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Duration</label>
                      <input
                        type="text"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        placeholder="e.g. 0:25"
                        className="w-full px-3 py-2 rounded-xl glass-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Upload Audio File (Optional)</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileUpload}
                      className="w-full px-3 py-1.5 rounded-xl border border-dashed border-blue-200 text-slate-600 bg-blue-50/40"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Transcript / Dialogue (Words)</label>
                    <textarea
                      value={formHinglish}
                      onChange={(e) => setFormHinglish(e.target.value)}
                      rows={3}
                      placeholder="Write what she/he said in this audio..."
                      className="w-full px-3 py-2 rounded-xl glass-input font-serif-luxury text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingVoice ? 'Save Changes' : 'Add Voice Memory'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
