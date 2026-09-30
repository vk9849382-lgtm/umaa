export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  tag: 'BGMI' | 'Milestone' | 'Call' | 'Special' | 'Gift';
  description: string;
  hinglishNote?: string;
  image?: string;
  location?: string;
}

export interface GalleryItem {
  id: string;
  type: 'photo' | 'video' | 'chat' | 'bgmi';
  title: string;
  url: string;
  caption: string;
  date: string;
  tag: string;
  badge?: string;
  chatMessages?: Array<{ sender: 'him' | 'her'; text: string; time: string }>;
}

export interface VoiceItem {
  id: string;
  category: 'Good Morning' | 'Good Night' | 'Funny' | 'Emotional' | 'Miss You';
  title: string;
  hinglishText: string;
  duration: string;
  audioBlobUrl?: string;
  theme: string;
  frequencies?: number[];
}

export type MoodType = 'in_love' | 'happy' | 'missing_you' | 'angry' | 'sleepy' | 'emotional';

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  note: string;
  tag?: string;
  createdTime?: string;
}

export interface RelationshipEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'birthday' | 'anniversary' | 'monthly' | 'date' | 'call' | 'gift' | 'custom';
  reminderNote: string;
  completed: boolean;
  priority?: 'normal' | 'high';
}

export interface LoveQuote {
  id: string;
  quote: string;
  hinglish: string;
  author: string;
}

export interface HeroConfig {
  badgeText: string;
  mainTitle: string;
  subtitle: string;
  nickname: string;
  photoQuote: string;
  herPhoto: string;
  bgmiStartDate: string;
  bgmiLabel: string;
  bgmiSub: string;
  coupleStartDate: string;
  coupleLabel: string;
  coupleSub: string;
}

export interface FightCardItem {
  id: string;
  title: string;
  tag: string;
  summary: string;
  details: string;
  lesson: string;
}

export interface FightConfig {
  tag: string;
  heading: string;
  quote: string;
  cards: FightCardItem[];
}

export type VaultItemType = 'photo' | 'video' | 'note' | 'voice';

export interface PhotoComment {
  id: string;
  author: 'him' | 'her';
  text: string;
  date: string;
}

export interface SharedPhotoItem {
  id: string;
  title: string;
  url: string;
  caption: string;
  author: 'him' | 'her' | 'both';
  date: string;
  tag: string;
  likes: number;
  comments?: PhotoComment[];
  createdAt: string;
}

export interface CoupleVaultItem {
  id: string;
  type: VaultItemType;
  title: string;
  content: string; // note text, caption, or description
  mediaUrl?: string; // photo base64/url, video url/base64, or audio data url
  audioDuration?: string;
  date: string;
  author: 'him' | 'her' | 'both';
  tag?: string;
  createdAt?: string;
}

export type SectionId =
  | 'hero'
  | 'birthday'
  | 'journey'
  | 'gallery'
  | 'vault'
  | 'voice'
  | 'mood'
  | 'events'
  | 'fights'
  | 'garden'
  | 'letter';

export type FlowerType = 'rose' | 'tulip' | 'lotus' | 'sunflower' | 'lily' | 'orchid' | 'daisy';

export interface PlantedFlower {
  id: string;
  flowerType: FlowerType;
  plantedBy: 'him' | 'her' | 'together';
  message: string;
  secretNote?: string;
  plantedAt: string;
  waterCount: number;
  lastWatered?: string;
  growthStage: 'seed' | 'sprout' | 'bud' | 'bloomed';
  petalColor: string;
}

export interface SectionMeta {
  id: SectionId;
  name: string;
  hindiTitle: string;
  description: string;
  icon: string;
  anchor: string;
}

export type SectionVisibilityMap = Record<SectionId, boolean>;
