import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Flame, Calendar as CalendarIcon, BarChart2, Plus, Smile, Meh, Frown, Edit2, Trash2, Check, RotateCcw, Sparkles, Tag } from 'lucide-react';
import { MoodEntry, MoodType } from '../types';
import { getStoredMoods, saveMoods } from '../services/storage';
import { sound } from '../services/sound';

export const MoodTracker: React.FC = () => {
  const [moods, setMoods] = useState<MoodEntry[]>(getStoredMoods());
  const [selectedMood, setSelectedMood] = useState<MoodType>('in_love');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [entryTag, setEntryTag] = useState<string>('Voice Call');
  const [noteText, setNoteText] = useState('');
  const [activeView, setActiveView] = useState<'journal' | 'calendar' | 'analytics'>('journal');
  
  // Edit existing entry
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editMood, setEditMood] = useState<MoodType>('in_love');
  const [editDate, setEditDate] = useState('');
  const [editTag, setEditTag] = useState('');

  const moodConfig: Record<MoodType, { label: string; emoji: string; color: string; bg: string; border: string }> = {
    in_love: { label: 'In Love', emoji: '🥰', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    happy: { label: 'Happy & Joyful', emoji: '😊', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    missing_you: { label: 'Missing You', emoji: '🥺', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    angry: { label: 'Thoda Angry / Cute Fight', emoji: '😤', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    sleepy: { label: 'Sleepy / Tired', emoji: '😴', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    emotional: { label: 'Deeply Emotional', emoji: '😭', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  };

  const commonTags = ['Voice Call', 'Long Distance', 'Late Night', 'BGMI Match', 'Sweet Fight', 'Missing Her', 'Special Surprise'];

  const handleAddMood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    sound.playHeartSound();
    const targetDate = entryDate || new Date().toISOString().slice(0, 10);
    const newEntry: MoodEntry = {
      id: `m-${Date.now()}`,
      date: targetDate,
      mood: selectedMood,
      note: noteText.trim(),
      tag: entryTag.trim() || undefined,
      createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Replace if same date already exists, or prepend
    const filtered = moods.filter((m) => m.date !== targetDate);
    const updated = [newEntry, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setMoods(updated);
    saveMoods(updated);
    setNoteText('');
  };

  const openEditModal = (entry: MoodEntry) => {
    setEditingEntry(entry);
    setEditNote(entry.note);
    setEditMood(entry.mood);
    setEditDate(entry.date);
    setEditTag(entry.tag || '');
    sound.playHeartSound();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || !editNote.trim()) return;

    const updated = moods.map((m) =>
      m.id === editingEntry.id
        ? {
            ...m,
            note: editNote.trim(),
            mood: editMood,
            date: editDate,
            tag: editTag.trim() || undefined
          }
        : m
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setMoods(updated);
    saveMoods(updated);
    setEditingEntry(null);
    sound.playHeartSound();
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Kya aap is mood entry ko delete karna chahte hain?')) {
      const updated = moods.filter((m) => m.id !== id);
      setMoods(updated);
      saveMoods(updated);
      sound.playHeartSound();
    }
  };

  const handleClearAllMoods = () => {
    if (confirm('Kya aap saare mood entries delete karke 100% fresh/empty state rakhna chahte hain? (Website publish hone ke baad roz manually feed karne ke liye)')) {
      setMoods([]);
      saveMoods([]);
      sound.playHeartSound();
    }
  };

  const handleCalendarClick = (dateStr: string) => {
    const existing = moods.find((m) => m.date === dateStr);
    if (existing) {
      openEditModal(existing);
    } else {
      setEntryDate(dateStr);
      setActiveView('journal');
      sound.playHeartSound();
    }
  };

  const calculateStreak = () => {
    if (moods.length === 0) return 0;
    let streak = 0;
    const sorted = [...moods].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let checkDate = new Date();

    for (const item of sorted) {
      const itemDate = new Date(item.date);
      const diffDays = Math.floor((checkDate.getTime() - itemDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 1) {
        streak++;
        checkDate = itemDate;
      } else {
        break;
      }
    }
    return Math.max(streak, 1);
  };

  const moodCounts = moods.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {} as Record<MoodType, number>);

  const totalEntries = moods.length;

  return (
    <section id="mood" className="py-16 md:py-24 bg-gradient-to-b from-blue-50/20 via-transparent to-blue-50/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Mood Journal & Heart Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1 mb-3">
            Mood Tracker & Journal 📖
          </h2>
          <p className="text-sm text-slate-600">
            Dono ke dilon ka haal — har din ka mood, choti choti baatein aur pyaar ka streak.
          </p>

          {/* Streak Counter & Clear Action */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>
                {moods.length === 0
                  ? 'Love Streak: 0 Days'
                  : `Love Streak: ${calculateStreak()} Consecutive Days Logged`}
              </span>
            </div>

            {moods.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllMoods}
                className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs"
                title="Website publish karne se pehle saare demo entries clear karein"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All (Publish Fresh)</span>
              </button>
            )}
          </div>

          {/* View Switcher Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveView('journal')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeView === 'journal' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Daily Journal ({moods.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveView('calendar')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeView === 'calendar' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Calendar View
              </button>
              <button
                type="button"
                onClick={() => setActiveView('analytics')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeView === 'analytics' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Mood Analytics
              </button>
            </div>
          </div>
        </div>

        {/* View 1: Today's Journal & Form */}
        {activeView === 'journal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Card */}
            <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-serif-luxury font-bold text-slate-900">
                  Log Today's Feeling ✍️
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  Daily Log
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Choose Uma's or your feeling, select date & write a sweet note.
              </p>

              {/* Date & Tag Picker */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={entryTag}
                    onChange={(e) => setEntryTag(e.target.value)}
                    placeholder="e.g. Voice Call, BGMI"
                    className="w-full px-2.5 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              {/* Quick Tag suggestions */}
              <div className="flex flex-wrap gap-1 mb-4">
                {commonTags.slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setEntryTag(tag)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                      entryTag === tag
                        ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Mood Emojis Grid */}
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Select Feeling / Mood:
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(Object.keys(moodConfig) as MoodType[]).map((type) => {
                  const cfg = moodConfig[type];
                  const isSelected = selectedMood === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedMood(type)}
                      className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? `${cfg.bg} ${cfg.border} ring-2 ring-blue-400 scale-102 shadow-xs`
                          : 'bg-white/80 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{cfg.emoji}</span>
                      <span className="text-[11px] font-medium text-slate-700 truncate w-full">
                        {cfg.label.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Note Form */}
              <form onSubmit={handleAddMood} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Journal Note / Dil Ki Baat:
                  </label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                    placeholder="Aaj ka din kaisa raha? Uma se kya baat hui ya kya mehsoos hua..."
                    required
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-serif-luxury"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Today's Mood ✍️</span>
                </button>
              </form>
            </div>

            {/* Right: Recent Journal Entries or Empty State */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold uppercase tracking-wider text-slate-700">
                  Our Logged Moments ({moods.length})
                </span>
                <span className="text-[11px] text-blue-600 font-medium">Safe in Local Storage</span>
              </div>

              {moods.length === 0 ? (
                /* Empty state when no dummy data exists */
                <div className="glass-card rounded-3xl p-8 border border-white text-center shadow-xs">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xs">
                    📝
                  </div>
                  <h4 className="text-lg font-serif-luxury font-bold text-slate-800 mb-2">
                    Tracker Is Fresh & Ready
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                    Aap dono yahan har din ka mood, choti choti khushiyan aur dil ki baat log kar sakte hain.
                  </p>
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left max-w-md mx-auto text-xs text-amber-900 space-y-2">
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>✨</span> How to Use:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                      <li>Left side form me date, feeling aur dil ki baat likh kar save karein.</li>
                      <li>Calendar me kisi bhi date par click karke us din ka mood view ya update karein.</li>
                      <li>Published website par har entry safe aur real-time save rahegi.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                moods.map((entry) => {
                  const cfg = moodConfig[entry.mood] || moodConfig.in_love;
                  return (
                    <div
                      key={entry.id}
                      className="glass-card rounded-2xl p-4 border border-white hover:shadow-md transition-all flex items-start gap-4 group relative"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center text-2xl shrink-0 shadow-xs`}>
                        {cfg.emoji}
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{entry.date}</span>
                            {entry.tag && (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                                #{entry.tag}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
                            <button
                              type="button"
                              onClick={() => openEditModal(entry)}
                              title="Edit this journal moment"
                              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEntry(entry.id)}
                              title="Delete entry"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif-luxury">
                          “{entry.note}”
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* View 2: Calendar View */}
        {activeView === 'calendar' && (
          <div className="glass-card rounded-3xl p-6 border border-white max-w-2xl mx-auto shadow-sm">
            <h3 className="text-xl font-serif-luxury font-bold text-slate-900 mb-1 text-center">
              October 2026 Mood Calendar
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              October mahine me hamare dilon ke pyare ehsaas aur yaadein.
            </p>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="font-bold text-slate-400 py-1">
                  {d}
                </div>
              ))}

              {/* October 1, 2026 is Thursday (4 empty cells: Sun, Mon, Tue, Wed) */}
              {[0, 1, 2, 3].map((emptyIdx) => (
                <div key={`empty-${emptyIdx}`} className="aspect-square opacity-0 pointer-events-none" />
              ))}

              {Array.from({ length: 31 }, (_, i) => {
                const dayNum = i + 1;
                const dateStr = `2026-10-${dayNum.toString().padStart(2, '0')}`;
                const entry = moods.find((m) => m.date === dateStr);
                const cfg = entry ? moodConfig[entry.mood] : null;

                return (
                  <div
                    key={dayNum}
                    onClick={() => handleCalendarClick(dateStr)}
                    className={`aspect-square rounded-2xl p-1.5 flex flex-col items-center justify-between border transition-all cursor-pointer ${
                      dayNum === 1
                        ? 'bg-rose-100/90 border-rose-400 font-bold ring-2 ring-rose-500/30'
                        : entry
                        ? `${cfg?.bg} ${cfg?.border} hover:scale-105 shadow-xs`
                        : 'bg-white/60 border-slate-100 text-slate-400 hover:bg-rose-50/50 hover:border-rose-200'
                    }`}
                    title={entry ? `${dateStr}: ${cfg?.label} - Click to edit` : `${dateStr}: Click to manually feed mood`}
                  >
                    <span className="text-[11px] font-medium">{dayNum}</span>
                    {dayNum === 1 && !entry ? (
                      <span className="text-xs">🎂</span>
                    ) : cfg ? (
                      <span className="text-sm">{cfg.emoji}</span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                1 Oct: Birthday Special 🎂
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                Click date to log manually
              </span>
            </div>
          </div>
        )}

        {/* View 3: Analytics View */}
        {activeView === 'analytics' && (
          <div className="glass-card rounded-3xl p-6 border border-white max-w-3xl mx-auto shadow-sm">
            <h3 className="text-xl font-serif-luxury font-bold text-slate-900 mb-1 text-center">
              Emotional Breakdown & Balance
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              Relationship equilibrium analyzed over time.
            </p>

            {moods.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Abhi tak koi mood manually feed nahi hua hai.
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Jaise hi aap aur Uma entries add karenge, yahan automatic percentage aur emotional chart banna shuru ho jayega!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView('journal')}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manual Feed Par Jayein</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {(Object.keys(moodConfig) as MoodType[]).map((type) => {
                  const count = moodCounts[type] || 0;
                  const percentage = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
                  const cfg = moodConfig[type];

                  return (
                    <div key={type} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                          <span className="text-base">{cfg.emoji}</span>
                          <span>{cfg.label}</span>
                        </div>
                        <span className="font-mono tabular-nums text-slate-500">
                          {count} days ({percentage}%)
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            type === 'in_love'
                              ? 'bg-rose-500'
                              : type === 'happy'
                              ? 'bg-amber-500'
                              : type === 'missing_you'
                              ? 'bg-blue-500'
                              : type === 'angry'
                              ? 'bg-orange-500'
                              : 'bg-indigo-500'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {editingEntry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md glass-card rounded-3xl p-6 border border-white shadow-2xl my-8"
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <h3 className="text-xl font-serif-luxury font-bold text-slate-900">
                    Edit Journal Moment Words
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingEntry(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Date</label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Tag</label>
                      <input
                        type="text"
                        value={editTag}
                        onChange={(e) => setEditTag(e.target.value)}
                        placeholder="Tag name"
                        className="w-full px-3 py-2 rounded-xl glass-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Select Mood Feeling</label>
                    <select
                      value={editMood}
                      onChange={(e) => setEditMood(e.target.value as MoodType)}
                      className="w-full px-3 py-2 rounded-xl glass-input"
                    >
                      {(Object.keys(moodConfig) as MoodType[]).map((t) => (
                        <option key={t} value={t}>
                          {moodConfig[t].emoji} {moodConfig[t].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Journal Note Words</label>
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 rounded-xl glass-input font-serif-luxury text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingEntry(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
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
