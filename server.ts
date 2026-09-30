import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON parser with 50mb limit for base64 photo uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Persistent storage directory for shared photos
  const DATA_DIR = path.join(__dirname, 'data');
  const PHOTOS_FILE = path.join(DATA_DIR, 'shared_photos.json');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  interface StoredPhoto {
    id: string;
    title: string;
    url: string;
    caption: string;
    author: 'him' | 'her' | 'both';
    date: string;
    tag: string;
    likes: number;
    comments?: { id: string; author: 'him' | 'her'; text: string; date: string }[];
    createdAt: string;
  }

  // Initial photos if file does not exist
  const DEFAULT_PHOTOS: StoredPhoto[] = [
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

  function loadPhotos(): StoredPhoto[] {
    try {
      if (fs.existsSync(PHOTOS_FILE)) {
        const raw = fs.readFileSync(PHOTOS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading photos file:', err);
    }
    return DEFAULT_PHOTOS;
  }

  function savePhotos(photos: StoredPhoto[]) {
    try {
      fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving photos file:', err);
    }
  }

  // Initialize file if not existing
  if (!fs.existsSync(PHOTOS_FILE)) {
    savePhotos(DEFAULT_PHOTOS);
  }

  // --- API Endpoints for Real-Time Shared Photos ---
  app.get('/api/photos', (_req, res) => {
    const photos = loadPhotos();
    res.json(photos);
  });

  app.post('/api/photos', (req, res) => {
    try {
      const incoming = Array.isArray(req.body) ? req.body : [req.body];
      const current = loadPhotos();
      // Prepend newly added photos
      const updated = [...incoming, ...current];
      savePhotos(updated);
      res.status(201).json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save photos' });
    }
  });

  app.put('/api/photos/:id', (req, res) => {
    try {
      const { id } = req.params;
      const current = loadPhotos();
      const updated = current.map((p) => (p.id === id ? { ...p, ...req.body } : p));
      savePhotos(updated);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update photo' });
    }
  });

  app.delete('/api/photos/:id', (req, res) => {
    try {
      const { id } = req.params;
      const current = loadPhotos();
      const updated = current.filter((p) => p.id !== id);
      savePhotos(updated);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete photo' });
    }
  });

  app.post('/api/photos/:id/like', (req, res) => {
    try {
      const { id } = req.params;
      const current = loadPhotos();
      const updated = current.map((p) => {
        if (p.id === id) {
          return { ...p, likes: (p.likes || 0) + 1 };
        }
        return p;
      });
      savePhotos(updated);
      const target = updated.find((p) => p.id === id);
      res.json(target);
    } catch (err) {
      res.status(500).json({ error: 'Failed to like photo' });
    }
  });

  app.post('/api/photos/:id/comment', (req, res) => {
    try {
      const { id } = req.params;
      const { author, text } = req.body;
      const current = loadPhotos();
      const comment = {
        id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        author: author || 'him',
        text,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      const updated = current.map((p) => {
        if (p.id === id) {
          const comments = p.comments || [];
          return { ...p, comments: [...comments, comment] };
        }
        return p;
      });
      savePhotos(updated);
      const target = updated.find((p) => p.id === id);
      res.json(target);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add comment' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Mount Vite in dev mode, or serve dist in production
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
