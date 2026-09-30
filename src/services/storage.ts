import {
  MemoryItem,
  GalleryItem,
  VoiceItem,
  MoodEntry,
  RelationshipEvent,
  LoveQuote,
  HeroConfig,
  FightConfig,
  SectionId,
  SectionMeta,
  SectionVisibilityMap,
  CoupleVaultItem,
  PlantedFlower
} from '../types';

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    date: '17 April 2026',
    title: 'First Met in BGMI (Random Match Spectate)',
    tag: 'BGMI',
    description: 'A random squad match that changed everything. Tumne mic on karke pehli baar bola aur main game ke saare enemies bhool gaya.',
    hinglishNote: '“Bhai revive do jaldi!” — Wo pehli line aaj bhi mere kaano me goonjti hai. Tab nahi pata tha ki game haar ke bhi main apni poori zindagi jeet raha hoon.',
    image: '/src/assets/images/bgmi_memory_moment_1790514533291.jpg',
    location: 'Erangel & Our Hearts'
  },
  {
    id: 'mem-2',
    date: '02 May 2026',
    title: 'Pehli Late Night Call (Till 4:15 AM)',
    tag: 'Call',
    description: '“Bas 5 minute baat karte hain” bolke humne poori raat kaat di. Baatein khatam nahi ho rahi thi.',
    hinglishNote: 'Jab tumne kaha “Tumhari awaaz sunke neend achi aati hai”, mera dil 200 km/h ki speed se dhadakne laga tha.',
    location: 'WhatsApp Voice Call'
  },
  {
    id: 'mem-3',
    date: '15 June 2026',
    title: 'Officially Couple Ban Gaye ❤️',
    tag: 'Milestone',
    description: 'The most precious day of our lives. Long distance tha par dono ke dilon me doori zero ho chuki thi.',
    hinglishNote: 'Jab tumne “Haan” bola tha, mere room me achanak saara sannata khushiyon me badal gaya. Hum do alag sheher me the, par dil ek ho gaye the.',
    image: '/src/assets/images/uma_hero_portrait_1790514519283.jpg',
    location: '15 June Special'
  },
  {
    id: 'mem-4',
    date: '04 July 2026',
    title: 'When You Fell In Love With My Smile & Eyes',
    tag: 'Special',
    description: 'Video call par tum chupchap dekh rahi thi aur achanak boli: “Tum muskurate ho toh sab theek lagta hai.”',
    hinglishNote: 'Aur tumhari wo mithi rasmalai jaisi awaaz... sach kaho toh mere chehre ki muskurahat tumhari hi toh den hai!',
    location: 'Late Night Video Call'
  },
  {
    id: 'mem-5',
    date: '28 July 2026',
    title: 'Surprise Rasmalai Delivery 🫶🏻',
    tag: 'Gift',
    description: 'Kyunki meri pyaari Uma ko Rasmalai se beintehaa pyaar hai, toh surprise sweet delivery bheji thi.',
    hinglishNote: 'Jab parcel kholte hi tumhara video call aaya aur tumhari aankhon me wo chamak dekhi, mera din ban gaya tha.',
    image: '/src/assets/images/couple_rasmalai_celebration_1790514548037.jpg',
    location: 'Swiggy/Zomato Surprise'
  },
  {
    id: 'mem-6',
    date: '19 August 2026',
    title: 'The Great Fight & Sweetest Patch-Up',
    tag: 'Special',
    description: 'Chhoti si baat par 3 ghante ka silence, phir ek lamba paragraph aur sab sorted.',
    hinglishNote: 'Humare beech ki ladai hi humara pyaar hai. Kitna bhi gussa ho jayein, raat ko ek dusre ke paas hi aana hota hai.',
    location: 'Our Sacred Bond'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    type: 'photo',
    title: 'Meri Rasmalai Ki Muskaan',
    url: '/src/assets/images/uma_hero_portrait_1790514519283.jpg',
    caption: 'Duniya ki sabse khoobsurat aankhein aur wo meethi smile jo mera saara stress chheen leti hai.',
    date: '2026',
    tag: 'Special Photos',
    badge: 'Her Beauty'
  },
  {
    id: 'gal-2',
    type: 'bgmi',
    title: 'BGMI Random Match Victory',
    url: '/src/assets/images/bgmi_memory_moment_1790514533291.jpg',
    caption: '17 April 2026 — Jahan se shuru hua hamara digital love story. Chicken dinner se bada prize tum thi.',
    date: '17 Apr 2026',
    tag: 'BGMI Drops',
    badge: '17 April 2026'
  },
  {
    id: 'gal-3',
    type: 'photo',
    title: 'Meethi Rasmalai Treat',
    url: '/src/assets/images/couple_rasmalai_celebration_1790514548037.jpg',
    caption: 'Ek rasmalai plate me aur ek rasmalai mere dil me ❤️',
    date: 'Sweet Moments',
    tag: 'Special Photos',
    badge: 'Her Favorite'
  },
  {
    id: 'gal-4',
    type: 'chat',
    title: 'The Confession Night Chat',
    url: '/src/assets/images/long_distance_night_call_1790514563136.jpg',
    caption: 'Wo 2:00 AM wale messages jo aaj bhi screenshot leke rakhe hain.',
    date: '15 Jun 2026',
    tag: 'Cute Chats',
    badge: 'Heart to Heart',
    chatMessages: [
      { sender: 'him', text: 'Suno... sach bataun toh BGMI me aane ka ek hi reason tha.', time: '02:14 AM' },
      { sender: 'her', text: 'Kya reason? Batao na... 🙈', time: '02:15 AM' },
      { sender: 'him', text: 'Tumhari awaaz sunna. Aur ab lagta hai zindagi bhar yehi sunna hai.', time: '02:16 AM' },
      { sender: 'her', text: 'Aap sach me kitne cute ho... I love you ❤️', time: '02:17 AM' }
    ]
  },
  {
    id: 'gal-5',
    type: 'video',
    title: 'Long Distance Night Connection',
    url: '/src/assets/images/long_distance_night_call_1790514563136.jpg',
    caption: 'Earphones on, lights off, aur ghanto tak sirf humari baatein.',
    date: 'Every Night',
    tag: 'Video Clips',
    badge: '4+ Hour Calls'
  }
];

export const INITIAL_VOICE_ITEMS: VoiceItem[] = [
  {
    id: 'v-real-1',
    category: 'Funny',
    title: '“Nahi Karti Pyaar... Bilkul Nahi Karti! 🙈”',
    hinglishText: '“Sach sach bol na? — Haan nahi karti... Bilkul nahi karti... Kabhi kiya hi nahi! (Cute banter between us)”',
    duration: '0:14',
    theme: 'Real Call Moment',
    frequencies: [35, 60, 85, 95, 75, 45, 80, 90, 85, 55, 70, 45]
  },
  {
    id: 'v-real-2',
    category: 'Funny',
    title: '“Budhape me jo sathiyate hain... Ghutne me dimag!”',
    hinglishText: '“Dimag ki kami hai tere andar? — Haan hai! Ghutne me hai dimag? — Haan! Toh tez kyu nahi karti? — Meri marzi! Hahaha ❤️”',
    duration: '0:23',
    theme: 'Real Fight & Laughter',
    frequencies: [45, 70, 90, 80, 65, 85, 100, 75, 60, 90, 80, 50]
  },
  {
    id: 'v-real-3',
    category: 'Emotional',
    title: '“Permission de di... Sabko suna do!”',
    hinglishText: '“Permission de rahi ho bhai sabko suna du main ye baat? — Haaan, de di maine permission! — Okay, thank you ❤️”',
    duration: '0:06',
    theme: 'Her Sweet Voice',
    frequencies: [25, 45, 75, 90, 85, 60, 70, 80, 50, 40, 65, 30]
  },
  {
    id: 'v-1',
    category: 'Good Morning',
    title: '“Utho Meri Jaan, Din Ho Gaya...”',
    hinglishText: '“Good morning meri rasmalai! Uth jao jaldi, dekho kitna pyara din hai. Chai pi lo aur apna dhyan rakhna, okay? Miss you a lot!”',
    duration: '0:28',
    theme: 'Morning Glow',
    frequencies: [20, 45, 60, 80, 55, 30, 70, 95, 80, 40, 60, 85, 50, 30]
  },
  {
    id: 'v-2',
    category: 'Good Night',
    title: '“Suno, Time Pe So Jana...”',
    hinglishText: '“Suno, phone side me rakho aur aaram se so jao. Sapno me sirf mere aana, kisi aur ke nahi! Good night, sweet dreams Uma ❤️”',
    duration: '0:34',
    theme: 'Moonlight Whisper',
    frequencies: [15, 30, 40, 55, 45, 35, 50, 60, 50, 35, 25, 40, 30, 15]
  },
  {
    id: 'v-3',
    category: 'Funny',
    title: '“REVIVE KARO JALDI!”',
    hinglishText: '“Arre yaar aage squad hai! Tum kahan dekh rahe ho? Main knock ho gayi... jaldi smoke dalo aur revive karo na please!! Hahaha!”',
    duration: '0:22',
    theme: 'BGMI Banter',
    frequencies: [40, 75, 90, 100, 85, 95, 60, 85, 100, 90, 70, 85, 60, 45]
  },
  {
    id: 'v-4',
    category: 'Emotional',
    title: '“Chahe Kitni Bhi Doori Ho...”',
    hinglishText: '“Uma, main jaanta hoon long distance thoda mushkil hota hai. Par sach kahu toh jitna pyaar mujhe tumse hai, utna kabhi kisi se nahi hua. Hum hamesha saath rahenge.”',
    duration: '0:48',
    theme: 'Pure Heart',
    frequencies: [25, 35, 55, 65, 75, 85, 80, 70, 60, 50, 45, 55, 40, 20]
  },
  {
    id: 'v-5',
    category: 'Miss You',
    title: '“Tumhari Awaaz Sune Bina Din Adhoora Hai”',
    hinglishText: '“Aaj tumhara call nahi aaya toh sab soona lag raha hai. Jaldi free ho jao na, tumse bohot saari baatein karni hain.”',
    duration: '0:31',
    theme: 'Missing Her',
    frequencies: [30, 50, 65, 75, 60, 45, 70, 80, 65, 50, 40, 60, 45, 30]
  }
];

export const INITIAL_MOODS: MoodEntry[] = [];

export const INITIAL_EVENTS: RelationshipEvent[] = [];

export const INITIAL_VAULT: CoupleVaultItem[] = [];

export const INITIAL_FLOWERS: PlantedFlower[] = [
  {
    id: 'flower-1',
    flowerType: 'rose',
    plantedBy: 'him',
    message: 'BGMI game ke us random match spectate se lekar aaj tak, mera har din tumhare naam hai.',
    secretNote: 'Tumhari pyari aawaz hi meri sabse badi khushi hai, Meri Rasmalai ❤️',
    plantedAt: '2026-04-17',
    waterCount: 18,
    growthStage: 'bloomed',
    petalColor: '#f43f5e'
  },
  {
    id: 'flower-2',
    flowerType: 'lotus',
    plantedBy: 'together',
    message: 'Hamari understanding aur respect hamesha aisi hi shant aur pavitra rahegi.',
    secretNote: 'Dono sheher chahe kitne bhi door hon, doori hamare dilon ke beech zero hai.',
    plantedAt: '2026-06-15',
    waterCount: 14,
    growthStage: 'bloomed',
    petalColor: '#38bdf8'
  },
  {
    id: 'flower-3',
    flowerType: 'tulip',
    plantedBy: 'him',
    message: 'Uma ke 1 October birthday ke liye ye gulaabi tulip hamesha khilta rahega.',
    secretNote: 'Har saal tumhara birthday aur bhi dhoom dhaam se manayenge!',
    plantedAt: '2026-10-01',
    waterCount: 9,
    growthStage: 'bloomed',
    petalColor: '#ec4899'
  },
  {
    id: 'flower-4',
    flowerType: 'sunflower',
    plantedBy: 'her',
    message: 'Subah ki pehli dhoop aur raat ki aakhri baat hamesha tumhi se ho.',
    secretNote: 'Tum meri zindagi me dher saari muskaan laye ho.',
    plantedAt: '2026-09-28',
    waterCount: 6,
    growthStage: 'bud',
    petalColor: '#eab308'
  }
];

export const DAILY_QUOTES: LoveQuote[] = [
  {
    id: 'q-1',
    quote: "You don't love someone because they're perfect, you love them because in spite of everything, they make your whole world make sense.",
    hinglish: "Tum meri zindagi ka wo hissa ho jiske aane ke baad sab kuch theek lagne laga hai.",
    author: "For My Rasmalai"
  },
  {
    id: 'q-2',
    quote: "Distance is just a test to see how far love can travel.",
    hinglish: "Sheher kitne bhi door ho, har dua me sabse pehle tumhara hi naam aata hai.",
    author: "17 April Se Forever"
  },
  {
    id: 'q-3',
    quote: "Her voice is my favorite melody, and her happiness is my only goal.",
    hinglish: "Jab tum hasti ho na Uma, toh lagta hai BGMI me nahi, meri kismat me clutch ho gaya.",
    author: "Always Yours"
  },
  {
    id: 'q-4',
    quote: "Our fights don't push us apart; they just remind us how much we cannot live without each other.",
    hinglish: "Humari ladai kabhi ek din se zyada nahi chalti. Gussa thanda hote hi sirf tumhari yaad aati hai.",
    author: "Sweet Patch-Up Rule"
  },
  {
    id: 'q-5',
    quote: "You fell for my eyes and smile, but I fell for your pure, sweet soul.",
    hinglish: "Tum kehti ho meri muskaan pasand hai, par sach yeh hai ki yeh muskaan tumhari hi den hai.",
    author: "To Uma ❤️"
  }
];

const STORAGE_KEYS = {
  MEMORIES: 'dear_uma_memories_v1',
  GALLERY: 'dear_uma_gallery_v1',
  VOICE: 'dear_uma_voice_v1',
  MOODS: 'dear_uma_moods_v1',
  EVENTS: 'dear_uma_events_v1',
  HER_PHOTO: 'dear_uma_her_photo_v1',
  UNLOCKED: 'dear_uma_unlocked_v1',
  LOVE_LETTER: 'dear_uma_love_letter_v1',
  HERO_CONFIG: 'dear_uma_hero_config_v1',
  FIGHT_CONFIG: 'dear_uma_fight_config_v1',
  SECTIONS: 'dear_uma_sections_v1',
  VAULT: 'dear_uma_vault_v1',
  FLOWERS: 'dear_uma_flowers_v1'
};

export const DEFAULT_SECTION_VISIBILITY: SectionVisibilityMap = {
  hero: true,
  birthday: true,
  journey: true,
  gallery: true,
  vault: true,
  voice: true,
  mood: true,
  events: true,
  fights: true,
  garden: true,
  letter: true,
};

export const ALL_SECTIONS: SectionMeta[] = [
  {
    id: 'hero',
    name: 'Hero & Birthday Universe',
    hindiTitle: 'Birthday Countdown & Intro',
    description: 'Live clock, BGMI meeting counter, couple days counter, Uma photo, and daily love quote.',
    icon: '🎂',
    anchor: '#hero'
  },
  {
    id: 'birthday',
    name: 'Birthday Special Celebration',
    hindiTitle: '1 Oct Birthday Celebration',
    description: 'Interactive birthday cake with candles, balloon popping game, surprise gift unwrapping, and birthday song.',
    icon: '🎉',
    anchor: '#birthday'
  },
  {
    id: 'journey',
    name: 'Our Journey Timeline',
    hindiTitle: 'Humara Pyara Safar',
    description: 'Interactive milestone roadmap from BGMI random match spectate to forever milestones.',
    icon: '🗺️',
    anchor: '#journey'
  },
  {
    id: 'gallery',
    name: 'Memory Gallery',
    hindiTitle: 'Yaadon Ka Masonry Album',
    description: 'Pinterest-style masonry photo album, BGMI clips, sweet chats, and special moments.',
    icon: '📸',
    anchor: '#gallery'
  },
  {
    id: 'vault',
    name: 'Live Shared Photo Vault',
    hindiTitle: 'Humare Pal (Live Album)',
    description: 'Real-time couple photo album where both can manually upload and edit photos anytime.',
    icon: '📸',
    anchor: '#vault'
  },
  {
    id: 'voice',
    name: 'Voice Museum',
    hindiTitle: 'Awazon Ki Duniya & Waves',
    description: 'Audio player with interactive waveform visualizations of cute call banters.',
    icon: '🎙️',
    anchor: '#voice'
  },
  {
    id: 'mood',
    name: 'Mood Tracker & Journal',
    hindiTitle: 'Emotional Calendar & Logs',
    description: 'Interactive monthly mood calendar, relationship wellness stats, and journal notes.',
    icon: '✨',
    anchor: '#mood'
  },
  {
    id: 'events',
    name: 'Relationship Planner & Reminders',
    hindiTitle: 'Upcoming Dates & Anniversaries',
    description: 'Countdowns to anniversaries, virtual date nights, gifts, and calls.',
    icon: '📅',
    anchor: '#events'
  },
  {
    id: 'fights',
    name: 'Fight & Patch Up Rules',
    hindiTitle: 'Khatti-Meethi Ladaiyan',
    description: 'Our sacred relationship golden rule & sweet resolved fight cards.',
    icon: '🩹',
    anchor: '#patchup'
  },
  {
    id: 'garden',
    name: 'Virtual Flower Garden',
    hindiTitle: 'Pyar Ka Phoolon Ka Bageecha',
    description: 'Plant digital flowers together with custom messages as a sign of our growing love.',
    icon: '🌸',
    anchor: '#garden'
  },
  {
    id: 'letter',
    name: 'Handwritten Love Letter',
    hindiTitle: 'Dil Ka Paigaam (Letter)',
    description: 'Heartfelt emotional Hinglish letter sealed with digital wax stamp.',
    icon: '💌',
    anchor: '#letter'
  }
];

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  badgeText: "1 October Special · Uma's Birthday Universe",
  mainTitle: "Happy Birthday, Meri Pyaari Uma ❤️",
  subtitle: "BGMI ke random match spectate se shuru hua ye safar, aaj meri poori zindagi ban chuka hai. Chahe sheher kitne bhi door hon, meri har subah aur har raat sirf meri Rasmalai 🫶🏻 ke naam hai.",
  nickname: "Uma ❤️ Rasmalai",
  photoQuote: "«“She loves my smile & eyes; I love her gorgeous voice.”»",
  herPhoto: "/src/assets/images/uma_hero_portrait_1790514519283.jpg",
  bgmiStartDate: "2026-04-17T00:00:00",
  bgmiLabel: "Since BGMI First Met",
  bgmiSub: "«“BGMI ke us random match spectate ne hamari kismat badal di.”»",
  coupleStartDate: "2026-06-15T00:00:00",
  coupleLabel: "Officially In Love",
  coupleSub: "«“Do dilon ki doori zero ban gayi thi us din.”»"
};

export const DEFAULT_FIGHT_CONFIG: FightConfig = {
  tag: "Fights & Forever Patch-Ups",
  heading: "Humare Beech Ki Ladai Hi Humara Pyaar Hai ❤️",
  quote: "«“Hmari ladai kabhi ek din se zyada nahi chalti. Kitna bhi gussa ho jaye, akhir me hum ek dusre ke paas hi laut aate hain.”»",
  cards: [
    {
      id: 'fight',
      title: 'The Biggest Fight',
      tag: 'Ego: 0% · Love: 100%',
      summary: 'Wo 3 ghante ka cold war jab dono gusse me the par phone check karna nahi chhod rahe the.',
      details: 'Baat bilkul choti si thi — BGMI me bina bataye aage rush kar diya tha aur squad ne knock kar diya! Fir baat aage badh gayi. Dono ne bola “Ab se baat nahi karenge”. Par 3 ghante bhi nahi huye aur WhatsApp par pehla message aa gaya: “Khaana khaya?” Aur saara gussa ek pal me gayab ho gaya.',
      lesson: 'Lesson: Hum chahe kitna bhi lad lein, ek dusre ke bina rehna namumkin hai.'
    },
    {
      id: 'sorry',
      title: 'The Sweetest Sorry',
      tag: 'Heart Melting Moment',
      summary: 'Ek lamba paragraph aur ek 40 second ka cute voice note jisne saara gussa pighla diya.',
      details: 'Jab tumne bola: “Mujhe gussa mat dilaaya karo na, mujhe tumse ladna bilkul acha nahi lagta meri jaan”. Tumhari awaaz me jo softness thi aur jis tareeqe se tumne “Sorry” bola, lag raha tha duniya ki saari khushiyan us ek voice note me band hain. Us din maine decide kiya tha ki tumhari aankhon me kabhi dukh nahi aane dunga.',
      lesson: 'Sweet Patch-Up Rule: No fight survives after one honest hug and sweet Rasmalai.'
    },
    {
      id: 'call',
      title: 'The Longest Call',
      tag: 'Record: 6 Hours 42 Mins',
      summary: 'Phone garam ho chuka tha, battery 3 baar charge hui, par call cut karne ki himmat kisi ki nahi thi.',
      details: 'Shuruat 11:30 PM par hui thi. Pehle din bhar ki baatein, fir bachpan ke kisse, fir BGMI ke funny moments, aur 3:00 AM ke baad wo deep baatein jo sirf ek sacche partner ke saath ho sakti hain. 5:00 AM par dono ki aawaz dheemi ho gayi thi par phone disconnected nahi tha. Sirf ek dusre ki saansien sunte sunte so gaye the.',
      lesson: 'Long-distance rule: Distance doesn’t matter when hours feel like seconds.'
    },
    {
      id: 'promise',
      title: 'Our Strongest Promise',
      tag: 'Unbreakable Oath',
      summary: '“No matter how big the fight is, we will never go to sleep angry.”',
      details: 'Hamara sabse bada niyam: Ladai kitni bhi badi ho, din dhalne se pehle patch-up compulsory hai. Na koi third person aayega, na koi block karega, aur na hi koi ek dusre ka haath chhodega. Hum ek doosre ke hain aur hamesha rahenge.',
      lesson: 'Forever Pact: Har ladai hume door nahi, balki aur zyada paas laati hai.'
    }
  ]
};

export function getStoredHeroConfig(): HeroConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HERO_CONFIG);
    if (!raw) return DEFAULT_HERO_CONFIG;
    const parsed = JSON.parse(raw);
    let changed = false;
    if (parsed.badgeText && parsed.badgeText.includes('27 September')) {
      parsed.badgeText = "1 October Special · Uma's Birthday Universe";
      changed = true;
    }
    if (parsed.subtitle && parsed.subtitle.includes('Pochinki')) {
      parsed.subtitle = DEFAULT_HERO_CONFIG.subtitle;
      changed = true;
    }
    if (parsed.bgmiSub && parsed.bgmiSub.includes('Pochinki')) {
      parsed.bgmiSub = DEFAULT_HERO_CONFIG.bgmiSub;
      changed = true;
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.HERO_CONFIG, JSON.stringify(parsed));
    }
    return { ...DEFAULT_HERO_CONFIG, ...parsed };
  } catch {
    return DEFAULT_HERO_CONFIG;
  }
}

export function saveHeroConfig(config: HeroConfig) {
  localStorage.setItem(STORAGE_KEYS.HERO_CONFIG, JSON.stringify(config));
}

export function getStoredFightConfig(): FightConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FIGHT_CONFIG);
    return raw ? { ...DEFAULT_FIGHT_CONFIG, ...JSON.parse(raw) } : DEFAULT_FIGHT_CONFIG;
  } catch {
    return DEFAULT_FIGHT_CONFIG;
  }
}

export function saveFightConfig(config: FightConfig) {
  localStorage.setItem(STORAGE_KEYS.FIGHT_CONFIG, JSON.stringify(config));
}

export const DEFAULT_LOVE_LETTER = `Meri Pyaari Uma, Meri Rasmalai 🫶🏻,

Aaj tumhare is sabse khaas din par, main bas yeh likhna chahta hoon jo mera dil har ek second mehsoos karta hai.

Hamara safar kisi film ki script jaisa lagta hai. 17 April 2026 ko BGMI game ke us ek random match me jab spectate kiya aur tum meri squad me aayi thi. Mujhe lag raha tha bas normal game hai, par jaise hi tumne apna mic open kiya aur wo pehla lafz bola — kasam se, game haar ke bhi lag raha tha maine poori duniya jeet li hai. Tumhari wo gorgeous, meethi aawaz sidha mere dil me utar gayi thi. 

Dheere dheere wo game matches kab 4 baje tak chalne wali late-night calls me badal gaye, pata hi nahi chala. Aur fir aaya hamara sabse anmol din — 15 June 2026. Us din jab hum dono ne ek doosre ko apna humsafar maana, tab hum officially ek ho gaye the. ❤️

Haan, main jaanta hoon ki hamara relation Long Distance hai. Kabhi kabhi jab bohot mann karta hai tumhara haath pakadne ka ya tumhare chehre ko saamne baith ke dekhne ka, toh thoda dard hota hai. Par sach kahu toh is distance ne humare pyaar ko kamzor nahi, balki 100 guna zyada mazboot banaya hai. Sheher kitne bhi door hon, mera har khayal, meri har saans sirf tumhare ird-gird ghoomti hai.

Tum hamesha kehti ho ki tumhe meri aankhein aur meri smile bohot pasand hai... Par Uma, tum nahi jaanti ki meri aankhon me wo chamak aur mere chehre par wo muskaan sirf tumhari wajah se aati hai. Jab tum hasti ho, toh mera poora din sawar jata hai.

Aur haan, hamari ladaiyan! Hum kitna ladte hain na? Chhoti chhoti baaton par gussa hona, "Ab baat nahi karungi" bolna... par hum dono jaante hain ki hamari ladai kabhi ek din se zyada chal hi nahi sakti. Kitna bhi gussa ho jayein, raat hote hote hum ek doosre ki baahon me (virtual hi sahi!) hi laut aate hain. Kyunki humare beech ki ladai hi toh humara sabse saccha pyaar hai.

Aaj tumhare birthday par main tumse ek sabse mazboot promise karta hoon:
Chahe kitni bhi mushkilein aayein, chahe kitna bhi faasla ho, main hamesha tumhara haath pakad ke khada rahunga. Main tumhari aawaz ka sabse bada fan tha, hoon aur hamesha rahunga. Meri har kamyaabi, meri har khushi sirf tumhare saath poori hogi.

Happy Birthday, Meri Jaan. Hamesha aise hi muskurati raho aur meri Rasmalai ban ke raho.

Tumhara aur sirf tumhara,
Forever & Always 💙✨`;

export function getStoredLoveLetter(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.LOVE_LETTER) || DEFAULT_LOVE_LETTER;
  } catch {
    return DEFAULT_LOVE_LETTER;
  }
}

export function saveLoveLetter(text: string) {
  localStorage.setItem(STORAGE_KEYS.LOVE_LETTER, text);
}

export function getStoredMemories(): MemoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    return raw ? JSON.parse(raw) : INITIAL_MEMORIES;
  } catch {
    return INITIAL_MEMORIES;
  }
}

export function saveMemories(items: MemoryItem[]) {
  localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(items));
}

export function getStoredGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GALLERY);
    return raw ? JSON.parse(raw) : INITIAL_GALLERY;
  } catch {
    return INITIAL_GALLERY;
  }
}

export function saveGallery(items: GalleryItem[]) {
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
}

export function getStoredVoiceItems(): VoiceItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOICE);
    return raw ? JSON.parse(raw) : INITIAL_VOICE_ITEMS;
  } catch {
    return INITIAL_VOICE_ITEMS;
  }
}

export function saveVoiceItems(items: VoiceItem[]) {
  localStorage.setItem(STORAGE_KEYS.VOICE, JSON.stringify(items));
}

export function getStoredMoods(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOODS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ensure automatic dummy feed items ('m-1' through 'm-6') are removed so user has a 100% manual feed
    const filtered = parsed.filter(
      (item: MoodEntry) => !['m-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6'].includes(item.id)
    );
    if (filtered.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(filtered));
    }
    return filtered;
  } catch {
    return [];
  }
}

export function saveMoods(items: MoodEntry[]) {
  localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(items));
}

export function getStoredEvents(): RelationshipEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ensure automatic dummy feed events ('ev-1' through 'ev-8') are removed so user has a 100% manual feed
    const filtered = parsed.filter(
      (item: RelationshipEvent) => !['ev-1', 'ev-2', 'ev-3', 'ev-4', 'ev-5', 'ev-6', 'ev-7', 'ev-8'].includes(item.id)
    );
    if (filtered.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered));
    }
    return filtered;
  } catch {
    return [];
  }
}

export function saveEvents(items: RelationshipEvent[]) {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(items));
}

export function getStoredHerPhoto(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.HER_PHOTO) || '/src/assets/images/uma_hero_portrait_1790514519283.jpg';
  } catch {
    return '/src/assets/images/uma_hero_portrait_1790514519283.jpg';
  }
}

export function saveHerPhoto(url: string) {
  localStorage.setItem(STORAGE_KEYS.HER_PHOTO, url);
}

export function getIsUnlocked(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.UNLOCKED) === 'true';
  } catch {
    return false;
  }
}

export function setStoredUnlocked(val: boolean) {
  localStorage.setItem(STORAGE_KEYS.UNLOCKED, val ? 'true' : 'false');
}

export function getStoredSectionVisibility(): SectionVisibilityMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    return raw ? { ...DEFAULT_SECTION_VISIBILITY, ...JSON.parse(raw) } : DEFAULT_SECTION_VISIBILITY;
  } catch {
    return DEFAULT_SECTION_VISIBILITY;
  }
}

export function saveSectionVisibility(visibility: SectionVisibilityMap) {
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(visibility));
}

export function removeSection(id: SectionId): SectionVisibilityMap {
  const current = getStoredSectionVisibility();
  const updated = { ...current, [id]: false };
  saveSectionVisibility(updated);
  return updated;
}

export function restoreSection(id: SectionId): SectionVisibilityMap {
  const current = getStoredSectionVisibility();
  const updated = { ...current, [id]: true };
  saveSectionVisibility(updated);
  return updated;
}

export function restoreAllSections(): SectionVisibilityMap {
  saveSectionVisibility(DEFAULT_SECTION_VISIBILITY);
  return DEFAULT_SECTION_VISIBILITY;
}

export function getStoredFlowers(): PlantedFlower[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLOWERS);
    return raw ? JSON.parse(raw) : INITIAL_FLOWERS;
  } catch {
    return INITIAL_FLOWERS;
  }
}

export function saveFlowers(items: PlantedFlower[]) {
  localStorage.setItem(STORAGE_KEYS.FLOWERS, JSON.stringify(items));
}

export function exportFullData() {
  const fullBackup = {
    heroConfig: getStoredHeroConfig(),
    fightConfig: getStoredFightConfig(),
    memories: getStoredMemories(),
    gallery: getStoredGallery(),
    voice: getStoredVoiceItems(),
    moods: getStoredMoods(),
    events: getStoredEvents(),
    flowers: getStoredFlowers(),
    herPhoto: getStoredHerPhoto(),
    loveLetter: getStoredLoveLetter(),
    sectionsVisibility: getStoredSectionVisibility(),
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Dear_Uma_Memory_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFullData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.heroConfig) saveHeroConfig(data.heroConfig);
    if (data.fightConfig) saveFightConfig(data.fightConfig);
    if (data.memories) saveMemories(data.memories);
    if (data.gallery) saveGallery(data.gallery);
    if (data.voice) saveVoiceItems(data.voice);
    if (data.moods) saveMoods(data.moods);
    if (data.events) saveEvents(data.events);
    if (data.flowers) saveFlowers(data.flowers);
    if (data.herPhoto) saveHerPhoto(data.herPhoto);
    if (data.loveLetter) saveLoveLetter(data.loveLetter);
    if (data.sectionsVisibility) saveSectionVisibility(data.sectionsVisibility);
    return true;
  } catch {
    return false;
  }
}

export function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEYS.HERO_CONFIG);
  localStorage.removeItem(STORAGE_KEYS.FIGHT_CONFIG);
  localStorage.removeItem(STORAGE_KEYS.MEMORIES);
  localStorage.removeItem(STORAGE_KEYS.GALLERY);
  localStorage.removeItem(STORAGE_KEYS.VOICE);
  localStorage.removeItem(STORAGE_KEYS.MOODS);
  localStorage.removeItem(STORAGE_KEYS.EVENTS);
  localStorage.removeItem(STORAGE_KEYS.FLOWERS);
  localStorage.removeItem(STORAGE_KEYS.HER_PHOTO);
  localStorage.removeItem(STORAGE_KEYS.LOVE_LETTER);
  localStorage.removeItem(STORAGE_KEYS.SECTIONS);
}
