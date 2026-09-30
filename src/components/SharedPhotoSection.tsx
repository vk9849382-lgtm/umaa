import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Plus,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Edit2,
  Trash2,
  Download,
  Calendar,
  X,
  Check,
  Sparkles,
  Wifi,
  ExternalLink,
  ZoomIn,
  Send,
  User,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SharedPhotoItem } from '../types';
import {
  fetchSharedPhotos,
  uploadPhotos,
  updatePhoto,
  deletePhoto,
  likePhoto,
  addPhotoComment,
  compressImageFile
} from '../services/sharedPhotos';
import { sound } from '../services/sound';

export const SharedPhotoSection: React.FC = () => {
  const [photos, setPhotos] = useState<SharedPhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'her' | 'him' | 'both'>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<SharedPhotoItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<SharedPhotoItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form states for upload / edit
  const [formAuthor, setFormAuthor] = useState<'him' | 'her' | 'both'>('him');
  const [formTitle, setFormTitle] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formTag, setFormTag] = useState('Special Photos');
  const [formDate, setFormDate] = useState('');
  const [formUrlInput, setFormUrlInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; dataUrl: string }[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  // Comment input state
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState<'him' | 'her'>('him');
  const [activeCommentPhotoId, setActiveCommentPhotoId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial load and periodic real-time sync (every 4 seconds)
  useEffect(() => {
    let isMounted = true;

    const loadData = async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      else setIsSyncing(true);

      const data = await fetchSharedPhotos();
      if (isMounted) {
        setPhotos(data);
        setLoading(false);
        setIsSyncing(false);
      }
    };

    loadData(false);

    // Poll every 4 seconds for real-time multi-device sync
    const interval = setInterval(() => {
      loadData(true);
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.author === activeFilter;
  });

  const herPhotosCount = photos.filter((p) => p.author === 'her').length;
  const hisPhotosCount = photos.filter((p) => p.author === 'him').length;
  const totalLikes = photos.reduce((acc, p) => acc + (p.likes || 0), 0);

  const openUploadModal = (itemToEdit?: SharedPhotoItem) => {
    sound.playHeartSound();
    if (itemToEdit) {
      setEditingPhoto(itemToEdit);
      setFormAuthor(itemToEdit.author);
      setFormTitle(itemToEdit.title);
      setFormCaption(itemToEdit.caption);
      setFormTag(itemToEdit.tag);
      setFormDate(itemToEdit.date);
      setFormUrlInput(itemToEdit.url);
      setSelectedFiles([]);
    } else {
      setEditingPhoto(null);
      setFormAuthor('him');
      setFormTitle('');
      setFormCaption('');
      setFormTag('Special Photos');
      setFormDate(
        new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      );
      setFormUrlInput('');
      setSelectedFiles([]);
    }
    setIsUploadModalOpen(true);
  };

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImages(true);
    try {
      const processed: { name: string; dataUrl: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImageFile(file, 1280, 0.85);
        processed.push({ name: file.name, dataUrl: compressed });
      }
      setSelectedFiles((prev) => [...prev, ...processed]);
      sound.playHeartSound();
    } catch (err) {
      console.error('Error processing images:', err);
      alert('Photos load hone me error aayi. Kripya dobara try karein.');
    } finally {
      setIsProcessingImages(false);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingImages) return;

    sound.playUnlockCelebration();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#3b82f6', '#ec4899', '#f43f5e', '#60a5fa'],
    });

    if (editingPhoto) {
      const photoUrl = selectedFiles.length > 0 ? selectedFiles[0].dataUrl : formUrlInput || editingPhoto.url;
      const updatedList = await updatePhoto(editingPhoto.id, {
        title: formTitle.trim() || 'Hamari Yaadein',
        caption: formCaption.trim(),
        author: formAuthor,
        tag: formTag,
        date: formDate,
        url: photoUrl,
      });
      setPhotos(updatedList);
      if (lightboxPhoto?.id === editingPhoto.id) {
        setLightboxPhoto({
          ...lightboxPhoto,
          title: formTitle.trim(),
          caption: formCaption.trim(),
          author: formAuthor,
          tag: formTag,
          date: formDate,
          url: photoUrl,
        });
      }
    } else {
      // Create new photos
      const newItems: SharedPhotoItem[] = [];

      // If user uploaded multiple files
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file, idx) => {
          newItems.push({
            id: `shared-photo-${Date.now()}-${idx}`,
            title:
              selectedFiles.length > 1
                ? `${formTitle.trim() || 'Sweet Memory'} #${idx + 1}`
                : formTitle.trim() || 'Sweet Memory',
            caption: formCaption.trim() || 'A beautiful moment added with love ❤️',
            url: file.dataUrl,
            author: formAuthor,
            tag: formTag,
            date: formDate,
            likes: 1,
            comments: [],
            createdAt: new Date().toISOString(),
          });
        });
      } else if (formUrlInput.trim()) {
        newItems.push({
          id: `shared-photo-${Date.now()}`,
          title: formTitle.trim() || 'Sweet Memory',
          caption: formCaption.trim() || 'A beautiful moment added with love ❤️',
          url: formUrlInput.trim(),
          author: formAuthor,
          tag: formTag,
          date: formDate,
          likes: 1,
          comments: [],
          createdAt: new Date().toISOString(),
        });
      } else {
        alert('Kripya kam se kam ek photo select karein ya URL dalein.');
        return;
      }

      const updated = await uploadPhotos(newItems);
      setPhotos(updated);
    }

    setIsUploadModalOpen(false);
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm('Kya aap is photo ko album se delete karna chahte hain?')) {
      sound.playHeartSound();
      const updated = await deletePhoto(id);
      setPhotos(updated);
      if (lightboxPhoto?.id === id) {
        setLightboxPhoto(null);
      }
    }
  };

  const handleLike = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playHeartSound();
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#ec4899', '#f43f5e', '#fb7185'],
    });
    const newLikes = await likePhoto(id);
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, likes: newLikes } : p)));
    if (lightboxPhoto?.id === id) {
      setLightboxPhoto((prev) => (prev ? { ...prev, likes: newLikes } : null));
    }
  };

  const handleAddComment = async (photoId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    sound.playHeartSound();
    const updated = await addPhotoComment(photoId, commentAuthor, commentText.trim());
    if (updated) {
      setPhotos((prev) => prev.map((p) => (p.id === photoId ? updated : p)));
      if (lightboxPhoto?.id === photoId) {
        setLightboxPhoto(updated);
      }
    }
    setCommentText('');
  };

  return (
    <section id="vault" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-100/40 via-pink-100/30 to-purple-100/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Real-Time Cloud Photo Vault · Live on Both Phones</span>
            {isSyncing && <span className="text-[10px] text-blue-500 font-mono">Syncing...</span>}
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1 mb-3">
            Humare Pal · Shared Live Album 📸
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-serif-luxury">
            Hum dono ka private shared photo vault jahan hum ek doosre ke saath pyari yaadein aur photos share kar sakte hain.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 max-w-lg mx-auto">
            <div className="glass-card rounded-2xl p-2.5 border border-white/80 text-center shadow-xs">
              <span className="block text-xl font-bold font-serif-luxury text-slate-900">
                {photos.length}
              </span>
              <span className="text-[11px] text-slate-500">Total Photos 📸</span>
            </div>
            <div className="glass-card rounded-2xl p-2.5 border border-white/80 text-center shadow-xs">
              <span className="block text-xl font-bold font-serif-luxury text-pink-600">
                {herPhotosCount}
              </span>
              <span className="text-[11px] text-slate-500">By Uma 🌸</span>
            </div>
            <div className="glass-card rounded-2xl p-2.5 border border-white/80 text-center shadow-xs">
              <span className="block text-xl font-bold font-serif-luxury text-blue-600">
                {hisPhotosCount}
              </span>
              <span className="text-[11px] text-slate-500">By Him 💙</span>
            </div>
            <div className="glass-card rounded-2xl p-2.5 border border-white/80 text-center shadow-xs">
              <span className="block text-xl font-bold font-serif-luxury text-rose-500">
                {totalLikes}
              </span>
              <span className="text-[11px] text-slate-500">Heart Likes ❤️</span>
            </div>
          </div>

          {/* Actions & Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-medium border border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Photos ({photos.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('her')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'her'
                    ? 'bg-white text-pink-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-pink-700'
                }`}
              >
                Uma's 🌸 ({herPhotosCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('him')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'him'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                His 💙 ({hisPhotosCount})
              </button>
            </div>

            <button
              type="button"
              onClick={() => openUploadModal()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nayi Photo Upload Karo 📸</span>
            </button>
          </div>
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading live memories...</span>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center max-w-md mx-auto border border-white">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-800">Abhi koi photo nahi hai</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Aap ya Uma yahan pehli photo phone gallery se upload kar sakte hain.
            </p>
            <button
              type="button"
              onClick={() => openUploadModal()}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pehli Photo Upload Karo</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => {
              const authorLabel =
                photo.author === 'her'
                  ? 'Uploaded by Uma 🌸'
                  : photo.author === 'him'
                  ? 'Uploaded by Him 💙'
                  : 'Hum Dono 🫶🏻';

              const authorBadgeClass =
                photo.author === 'her'
                  ? 'bg-pink-50 text-pink-700 border-pink-200'
                  : photo.author === 'him'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200';

              const commentsCount = photo.comments?.length || 0;

              return (
                <div
                  key={photo.id}
                  onClick={() => setLightboxPhoto(photo)}
                  className="glass-card rounded-3xl overflow-hidden border border-white/90 hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay on bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-md ${authorBadgeClass}`}
                      >
                        {authorLabel}
                      </span>

                      {/* Quick Edit & Delete Icons on Card */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUploadModal(photo);
                          }}
                          title="Edit Photo Details"
                          className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(photo.id, e)}
                          title="Delete Photo"
                          className="p-1.5 rounded-full bg-white/90 hover:bg-rose-50 text-rose-600 shadow-sm transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Title Bar over image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-sm font-bold font-serif-luxury truncate drop-shadow-sm">
                        {photo.title}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-white/80 mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" />
                          {photo.date}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs">
                          {photo.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Caption & Interactions */}
                  <div className="p-4 flex flex-col justify-between flex-1 bg-white/60">
                    <p className="text-xs text-slate-700 font-serif-luxury italic leading-relaxed line-clamp-2 mb-3">
                      “{photo.caption}”
                    </p>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={(e) => handleLike(photo.id, e)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold transition-all active:scale-90"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>{photo.likes || 0}</span>
                      </button>

                      {/* Comment Count / Open button */}
                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>{commentsCount} Notes</span>
                      </div>

                      {/* Zoom view icon */}
                      <span className="text-[11px] text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>View</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Fullscreen Lightbox & Comments */}
        <AnimatePresence>
          {lightboxPhoto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl my-auto grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
              >
                {/* Left: Full Photo Display */}
                <div className="md:col-span-7 bg-slate-950 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[500px]">
                  <img
                    src={lightboxPhoto.url}
                    alt={lightboxPhoto.title}
                    className="max-h-[60vh] md:max-h-[80vh] w-full object-contain"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md">
                      {lightboxPhoto.author === 'her'
                        ? 'Uma 🌸'
                        : lightboxPhoto.author === 'him'
                        ? 'Him 💙'
                        : 'Together 🫶🏻'}
                    </span>
                  </div>
                </div>

                {/* Right: Details, Edit & Comments */}
                <div className="md:col-span-5 p-6 flex flex-col justify-between overflow-y-auto bg-slate-50/50">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h3 className="text-xl font-bold font-serif-luxury text-slate-900">
                          {lightboxPhoto.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {lightboxPhoto.date} · {lightboxPhoto.tag}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLightboxPhoto(null)}
                        className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Romantic Caption */}
                    <div className="my-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Caption / Dil Ki Baat
                      </span>
                      <p className="text-sm font-serif-luxury text-slate-800 leading-relaxed italic whitespace-pre-wrap">
                        “{lightboxPhoto.caption}”
                      </p>
                    </div>

                    {/* Action Bar (Like, Download, Edit) */}
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => handleLike(lightboxPhoto.id)}
                        className="px-4 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>{lightboxPhoto.likes || 0} Likes</span>
                      </button>

                      <a
                        href={lightboxPhoto.url}
                        download={`Dear_Uma_${lightboxPhoto.title.replace(/\s+/g, '_')}.jpg`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          const target = lightboxPhoto;
                          setLightboxPhoto(null);
                          openUploadModal(target);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(lightboxPhoto.id)}
                        className="px-3 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Love Notes / Comments List */}
                    <div className="border-t border-slate-200 pt-3">
                      <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                        Love Notes on this Photo ({lightboxPhoto.comments?.length || 0})
                      </span>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {lightboxPhoto.comments && lightboxPhoto.comments.length > 0 ? (
                          lightboxPhoto.comments.map((comm) => (
                            <div
                              key={comm.id}
                              className={`p-2.5 rounded-xl text-xs ${
                                comm.author === 'her'
                                  ? 'bg-pink-50 border border-pink-100 text-pink-950'
                                  : 'bg-blue-50 border border-blue-100 text-blue-950'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-semibold mb-0.5">
                                <span>{comm.author === 'her' ? 'Uma 🌸' : 'Him 💙'}</span>
                                <span className="text-slate-400 font-mono">{comm.date}</span>
                              </div>
                              <p className="font-serif-luxury italic">{comm.text}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic py-2">
                            Pehla love comment yahan likhein...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add Comment Input */}
                  <form
                    onSubmit={(e) => handleAddComment(lightboxPhoto.id, e)}
                    className="pt-3 border-t border-slate-200 mt-3"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] text-slate-500">Writing as:</span>
                      <button
                        type="button"
                        onClick={() => setCommentAuthor('him')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          commentAuthor === 'him' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        Him 💙
                      </button>
                      <button
                        type="button"
                        onClick={() => setCommentAuthor('her')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          commentAuthor === 'her' ? 'bg-pink-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        Uma 🌸
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a sweet note..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-serif-luxury"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Upload / Edit Photo */}
        <AnimatePresence>
          {isUploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg glass-card rounded-3xl p-6 border border-white shadow-2xl my-8 relative"
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold font-serif-luxury text-slate-900">
                      {editingPhoto ? 'Edit Photo Details ✏️' : 'Upload Photos To Live Vault 📸'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dono ke phone par real-time save ho jayegi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  {/* Who is Uploading? */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">
                      Who is Adding This Photo? ✍️
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormAuthor('him')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          formAuthor === 'him'
                            ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold ring-2 ring-blue-200'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-sm">💙</span>
                        <span>Him</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormAuthor('her')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          formAuthor === 'her'
                            ? 'bg-pink-50 border-pink-400 text-pink-700 font-bold ring-2 ring-pink-200'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-sm">🌸</span>
                        <span>Uma (Her)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormAuthor('both')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          formAuthor === 'both'
                            ? 'bg-purple-50 border-purple-400 text-purple-700 font-bold ring-2 ring-purple-200'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-sm">🫶🏻</span>
                        <span>Hum Dono</span>
                      </button>
                    </div>
                  </div>

                  {/* Photo Selection / File Input */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Choose Photo(s) From Device 🖼️
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleFiles}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-4 text-center bg-blue-50/40 hover:bg-blue-50/80 transition-all cursor-pointer"
                    >
                      <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <span className="block font-semibold text-slate-700">
                        {isProcessingImages
                          ? 'Compressing & Loading Photos...'
                          : 'Click to select multiple photos from gallery'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        PNG, JPG, HEIC, WebP (auto-optimized for instant fast syncing)
                      </span>
                    </div>

                    {/* Previews of Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {selectedFiles.map((f, i) => (
                          <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                            <img src={f.dataUrl} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(i)}
                              className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Or Image URL */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Or Paste Image URL (Optional) 🔗
                    </label>
                    <input
                      type="url"
                      value={formUrlInput}
                      onChange={(e) => setFormUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl glass-input"
                    />
                  </div>

                  {/* Title & Tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Photo Title 🏷️</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Gorgeous Smile in BGMI Match"
                        required
                        className="w-full px-3 py-2 rounded-xl glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Category / Tag ✨</label>
                      <select
                        value={formTag}
                        onChange={(e) => setFormTag(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input bg-white"
                      >
                        <option value="Special Photos">Special Photos 🌸</option>
                        <option value="Her Gorgeous Smile">Her Gorgeous Smile 🫶🏻</option>
                        <option value="BGMI Moments">BGMI Moments 🎮</option>
                        <option value="Late Night Calls">Late Night Calls 🌙</option>
                        <option value="Birthday Special">Birthday Special 🎂</option>
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Memory Date 📅</label>
                    <input
                      type="text"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      placeholder="e.g. 28 Sep 2026"
                      className="w-full px-3 py-2 rounded-xl glass-input"
                    />
                  </div>

                  {/* Caption / Note */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Love Caption / Dil Ki Baat 💌
                    </label>
                    <textarea
                      value={formCaption}
                      onChange={(e) => setFormCaption(e.target.value)}
                      rows={3}
                      placeholder="Is photo ke baare me koi pyari baat likhein..."
                      className="w-full px-3 py-2 rounded-xl glass-input font-serif-luxury"
                    />
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingImages}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingPhoto ? 'Save Changes' : 'Upload & Sync Live 📸'}</span>
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
