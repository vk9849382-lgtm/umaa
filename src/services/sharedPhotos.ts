import { SharedPhotoItem } from '../types';

const STORAGE_KEY = 'dear_uma_shared_photos_cache_v1';

export const DEFAULT_SHARED_PHOTOS: SharedPhotoItem[] = [
  {
    id: 'photo-hero-1',
    title: 'Meri Pyaari Uma ❤️',
    url: '/src/assets/images/uma_hero_portrait_1790514519283.jpg',
    caption: '1 October Birthday Special - Is muskaan par meri poori zindagi kurbaan hai. Hamesha haste rehna Meri Rasmalai 🫶🏻',
    author: 'him',
    date: '1 Oct 2026',
    tag: 'Special Photos',
    likes: 27,
    comments: [
      { id: 'c-1', author: 'him', text: 'Duniya ki sabse pyari smile! ❤️', date: '1 Oct 2026' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'photo-bgmi-1',
    title: 'BGMI Random Match Spectate Meeting',
    url: '/src/assets/images/bgmi_memory_moment_1790514533291.jpg',
    caption: 'Wo BGMI ka random squad match jisne hamari kismat ek kar di. Pehli baar mic on karke tumne baat ki thi.',
    author: 'both',
    date: '17 Apr 2026',
    tag: 'BGMI Moments',
    likes: 17,
    comments: [
      { id: 'c-2', author: 'her', text: '“Bhai revive do jaldi!” — Wo pehli line! 😂❤️', date: '17 Apr 2026' }
    ],
    createdAt: new Date().toISOString()
  }
];

export function getLocalCachedPhotos(): SharedPhotoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_SHARED_PHOTOS;
}

export function saveLocalCachedPhotos(photos: SharedPhotoItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.warn('Storage quota exceeded for local photo cache', err);
  }
}

// Fetch from backend server with fallback to local cache
export async function fetchSharedPhotos(): Promise<SharedPhotoItem[]> {
  try {
    const res = await fetch('/api/photos');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveLocalCachedPhotos(data);
        return data;
      }
    }
  } catch (err) {
    console.log('Using offline cached shared photos', err);
  }
  return getLocalCachedPhotos();
}

// Upload photo(s)
export async function uploadPhotos(newPhotos: SharedPhotoItem[]): Promise<SharedPhotoItem[]> {
  try {
    const res = await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPhotos),
    });
    if (res.ok) {
      const updated = await res.json();
      saveLocalCachedPhotos(updated);
      return updated;
    }
  } catch (err) {
    console.error('Failed to post to /api/photos, saving locally', err);
  }

  // Local fallback
  const current = getLocalCachedPhotos();
  const updated = [...newPhotos, ...current];
  saveLocalCachedPhotos(updated);
  return updated;
}

// Update photo
export async function updatePhoto(id: string, updates: Partial<SharedPhotoItem>): Promise<SharedPhotoItem[]> {
  try {
    const res = await fetch(`/api/photos/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      saveLocalCachedPhotos(updated);
      return updated;
    }
  } catch (err) {
    console.error('Failed to update photo on server', err);
  }

  // Local fallback
  const current = getLocalCachedPhotos();
  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveLocalCachedPhotos(updated);
  return updated;
}

// Delete photo
export async function deletePhoto(id: string): Promise<SharedPhotoItem[]> {
  try {
    const res = await fetch(`/api/photos/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const updated = await res.json();
      saveLocalCachedPhotos(updated);
      return updated;
    }
  } catch (err) {
    console.error('Failed to delete photo on server', err);
  }

  // Local fallback
  const current = getLocalCachedPhotos();
  const updated = current.filter((p) => p.id !== id);
  saveLocalCachedPhotos(updated);
  return updated;
}

// Like photo
export async function likePhoto(id: string): Promise<number> {
  try {
    const res = await fetch(`/api/photos/${encodeURIComponent(id)}/like`, {
      method: 'POST',
    });
    if (res.ok) {
      const item = await res.json();
      // update cache
      const current = getLocalCachedPhotos();
      const updated = current.map((p) => (p.id === id ? { ...p, likes: item.likes } : p));
      saveLocalCachedPhotos(updated);
      return item.likes;
    }
  } catch {
    // fallback
  }
  const current = getLocalCachedPhotos();
  let nextLikes = 1;
  const updated = current.map((p) => {
    if (p.id === id) {
      nextLikes = (p.likes || 0) + 1;
      return { ...p, likes: nextLikes };
    }
    return p;
  });
  saveLocalCachedPhotos(updated);
  return nextLikes;
}

// Add comment to photo
export async function addPhotoComment(
  id: string,
  author: 'him' | 'her',
  text: string
): Promise<SharedPhotoItem | null> {
  try {
    const res = await fetch(`/api/photos/${encodeURIComponent(id)}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text }),
    });
    if (res.ok) {
      const item = await res.json();
      const current = getLocalCachedPhotos();
      const updated = current.map((p) => (p.id === id ? item : p));
      saveLocalCachedPhotos(updated);
      return item;
    }
  } catch {
    // fallback
  }

  const current = getLocalCachedPhotos();
  let matchedItem: SharedPhotoItem | null = null;
  const newComment = {
    id: `comm-${Date.now()}`,
    author,
    text,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  const updated = current.map((p) => {
    if (p.id === id) {
      const comments = p.comments || [];
      matchedItem = { ...p, comments: [...comments, newComment] };
      return matchedItem;
    }
    return p;
  });
  saveLocalCachedPhotos(updated);
  return matchedItem;
}

// Client-side image compressor: scales high-res mobile photos to crisp, fast 1280px WebP/JPEG
export function compressImageFile(file: File, maxWidth = 1280, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use image/jpeg for reliable compact serialization
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
