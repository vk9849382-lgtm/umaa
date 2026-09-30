import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Gift, Phone, Heart, CheckCircle2, Circle, Plus, Sparkles, Edit2, Trash2, RotateCcw, Check } from 'lucide-react';
import { RelationshipEvent } from '../types';
import { getStoredEvents, saveEvents } from '../services/storage';
import { sound } from '../services/sound';

export const EventTracker: React.FC = () => {
  const [events, setEvents] = useState<RelationshipEvent[]>(getStoredEvents());
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RelationshipEvent | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('21:00');
  const [type, setType] = useState<RelationshipEvent['type']>('date');
  const [reminderNote, setReminderNote] = useState('');

  const typeConfig: Record<RelationshipEvent['type'], { icon: typeof Heart; label: string; color: string; bg: string; emoji: string }> = {
    birthday: { icon: Sparkles, label: 'Birthday', color: 'text-rose-600', bg: 'bg-rose-50', emoji: '🎂' },
    anniversary: { icon: Heart, label: 'Anniversary', color: 'text-blue-600', bg: 'bg-blue-50', emoji: '❤️' },
    monthly: { icon: Heart, label: 'Monthly Anniversary', color: 'text-indigo-600', bg: 'bg-indigo-50', emoji: '🫶🏻' },
    date: { icon: Calendar, label: 'Date Plan', color: 'text-sky-600', bg: 'bg-sky-50', emoji: '🎬' },
    call: { icon: Phone, label: 'Voice Call', color: 'text-emerald-600', bg: 'bg-emerald-50', emoji: '📞' },
    gift: { icon: Gift, label: 'Gift / Surprise', color: 'text-amber-600', bg: 'bg-amber-50', emoji: '🎁' },
    custom: { icon: Calendar, label: 'Custom Plan', color: 'text-purple-600', bg: 'bg-purple-50', emoji: '✨' },
  };

  const toggleEventComplete = (id: string) => {
    sound.playHeartSound();
    const updated = events.map((ev) =>
      ev.id === id ? { ...ev, completed: !ev.completed } : ev
    );
    setEvents(updated);
    saveEvents(updated);
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDate(new Date().toISOString().slice(0, 10));
    setTime('21:00');
    setType('date');
    setReminderNote('');
    setIsAddModalOpen(true);
    sound.playHeartSound();
  };

  const openEditModal = (ev: RelationshipEvent) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setDate(ev.date);
    setTime(ev.time || '21:00');
    setType(ev.type);
    setReminderNote(ev.reminderNote);
    setIsAddModalOpen(true);
    sound.playHeartSound();
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    sound.playHeartSound();

    if (editingEvent) {
      const updated = events.map((ev) =>
        ev.id === editingEvent.id
          ? {
              ...ev,
              title: title.trim(),
              date,
              time,
              type,
              reminderNote: reminderNote.trim(),
            }
          : ev
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(updated);
      saveEvents(updated);
    } else {
      const newEv: RelationshipEvent = {
        id: `ev-${Date.now()}`,
        title: title.trim(),
        date,
        time,
        type,
        reminderNote: reminderNote.trim(),
        completed: false,
      };
      const updated = [...events, newEv].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(updated);
      saveEvents(updated);
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Kya aap is relationship event ko delete karna chahte hain?')) {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      saveEvents(updated);
      sound.playHeartSound();
    }
  };

  const handleClearAllEvents = () => {
    if (confirm('Kya aap saare events clear karke date tracker ko 100% fresh/empty rakhna chahte hain? (Website publish hone ke baad manually feed karne ke liye)')) {
      setEvents([]);
      saveEvents([]);
      sound.playHeartSound();
    }
  };

  const getDaysRemaining = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  const upcomingEvents = events.filter((e) => !e.completed);
  const completedEvents = events.filter((e) => e.completed);
  const displayedList = activeTab === 'upcoming' ? upcomingEvents : completedEvents;

  return (
    <section id="events" className="py-16 md:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Special Dates & Anniversaries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1 mb-3">
            Event & Date Tracker 🗓️
          </h2>
          <p className="text-sm text-slate-600">
            Birthdays, monthly anniversaries, movie dates aur call reminders ka pyara countdown.
          </p>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === 'upcoming' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Upcoming Plans ({upcomingEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === 'completed' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Completed History ({completedEvents.length})
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Plan a Special Date 📅</span>
            </button>

            {events.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllEvents}
                className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs"
                title="Website publish karne se pehle saare demo events clear karein"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All (Publish Fresh)</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State when no events exist */}
        {displayedList.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 border border-white text-center max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xs">
              {activeTab === 'upcoming' ? '🗓️' : '✨'}
            </div>
            <h4 className="text-lg font-serif-luxury font-bold text-slate-800 mb-2">
              {activeTab === 'upcoming' ? 'No Upcoming Dates Planned Yet' : 'Koi Completed Event History Nahi Hai'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              {activeTab === 'upcoming'
                ? 'Aane wale birthday, monthly anniversaries, movie dates, surprises ya video calls yahan plan karein!'
                : 'Jab aap kisi aane wale event ko poora karke "Mark Done" karenge, wo yahan history me safe rahega.'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                type="button"
                onClick={openAddModal}
                className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Pehla Date Plan Add Karein ✍️</span>
              </button>
            )}
          </div>
        ) : (
          /* Events List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedList.map((ev) => {
              const cfg = typeConfig[ev.type] || typeConfig.custom;
              const Icon = cfg.icon;
              const countdown = getDaysRemaining(ev.date);
              const isToday = countdown === 'Today!';

              return (
                <div
                  key={ev.id}
                  className={`glass-card rounded-2xl p-5 border transition-all relative group ${
                    isToday
                      ? 'border-blue-400 bg-gradient-to-br from-white to-blue-50/80 shadow-md ring-1 ring-blue-300'
                      : 'border-white/90 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left Icon */}
                    <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>

                    {/* Middle Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-slate-700">{ev.date}</span>
                        {ev.time && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{ev.time}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className={`font-medium ${cfg.color}`}>{cfg.emoji} {cfg.label}</span>
                      </div>

                      <h3 className="text-base font-serif-luxury font-bold text-slate-900 mb-1">
                        {ev.title}
                      </h3>

                      {ev.reminderNote && (
                        <p className="text-xs text-slate-600 leading-relaxed font-serif-luxury italic">
                          «{ev.reminderNote}»
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span
                          className={`font-semibold font-mono tabular-nums ${
                            isToday ? 'text-rose-600 animate-pulse' : 'text-blue-600'
                          }`}
                        >
                          {countdown}
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEditModal(ev)}
                            title="Edit this event"
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(ev.id)}
                            title="Remove event"
                            className="text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleEventComplete(ev.id)}
                            className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {ev.completed ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Done</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-4 h-4 text-slate-300" />
                                <span>Mark Done</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Event Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md glass-card rounded-3xl p-6 border border-white shadow-2xl my-8"
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <h3 className="text-xl font-serif-luxury font-bold text-slate-900">
                    {editingEvent ? 'Edit Relationship Event' : 'Manually Plan Date / Event'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Event / Date Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Virtual Candlelight Dinner, Monthly Anniversary, Zomato Surprise"
                      required
                      className="w-full px-3 py-2 rounded-xl glass-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Time</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">
                      Event Category
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {(Object.keys(typeConfig) as RelationshipEvent['type'][]).map((t) => {
                        const cfg = typeConfig[t];
                        const isSelected = type === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium ring-1 ring-blue-300'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-base">{cfg.emoji}</span>
                            <span className="text-[11px] truncate">{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Reminder Note / Special Plan
                    </label>
                    <textarea
                      value={reminderNote}
                      onChange={(e) => setReminderNote(e.target.value)}
                      rows={2}
                      placeholder="Kya special karna hai, gift order karna hai, dress code..."
                      className="w-full px-3 py-2 rounded-xl glass-input font-serif-luxury"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingEvent ? 'Save Changes' : 'Schedule Event'}</span>
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
