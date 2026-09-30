/**
 * Romantic Audio Engine powered by Web Audio API
 * Generates ambient lofi romantic piano/chords, chime melodies, and audio recordings.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private musicVolume = 0.25;
  private currentNoteIndex = 0;

  // Romantic gentle chord progression in F Major / D Minor (gentle, warm, nostalgic)
  private readonly melodyProgression = [
    // F - A - C - E (Fmaj7)
    { root: 349.23, notes: [349.23, 440.0, 523.25, 659.25] },
    // D - F - A - C (Dm7)
    { root: 293.66, notes: [293.66, 349.23, 440.0, 523.25] },
    // Bb - D - F - A (Bbmaj7)
    { root: 233.08, notes: [233.08, 293.66, 349.23, 440.0] },
    // C - E - G - B (Cmaj7)
    { root: 261.63, notes: [261.63, 329.63, 392.0, 493.88] },
  ];

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft acoustic-like chime tone
  public playTone(freq: number, duration = 0.8, type: OscillatorType = 'sine', volumeScale = 1.0) {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const vol = this.musicVolume * volumeScale;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might require user interaction first
    }
  }

  // Start background romantic music
  public startBackgroundMusic(onStateChange?: (playing: boolean) => void) {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    onStateChange?.(true);

    const step = () => {
      if (!this.isMusicPlaying) return;
      const currentChord = this.melodyProgression[this.currentNoteIndex % this.melodyProgression.length];
      
      // Play soft bass root
      this.playTone(currentChord.root / 2, 2.8, 'sine', 0.6);

      // Play soft arpeggiated sparkle notes
      currentChord.notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (this.isMusicPlaying) {
            this.playTone(freq, 1.4, 'sine', 0.4);
          }
        }, idx * 350);
      });

      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melodyProgression.length;
    };

    step();
    this.musicInterval = window.setInterval(step, 2400);
  }

  public stopBackgroundMusic(onStateChange?: (playing: boolean) => void) {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    onStateChange?.(false);
  }

  public toggleBackgroundMusic(onStateChange?: (playing: boolean) => void): boolean {
    if (this.isMusicPlaying) {
      this.stopBackgroundMusic(onStateChange);
      return false;
    } else {
      this.startBackgroundMusic(onStateChange);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public setVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
  }

  // Play a celebratory chime sequence when unlocking or clicking confetti
  public playUnlockCelebration() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.7, 'triangle', 0.5);
      }, idx * 120);
    });
  }

  // Play heart tap sound
  public playHeartSound() {
    this.playTone(659.25, 0.35, 'sine', 0.4);
    setTimeout(() => this.playTone(880.0, 0.45, 'sine', 0.5), 100);
  }

  // Play voice message acoustic preview melody
  public playVoiceSnippet(category: string) {
    const scale = {
      'Good Morning': [440, 554.37, 659.25, 880], // Bright A Major
      'Good Night': [329.63, 392, 493.88, 587.33], // Calming E minor
      'Funny': [523.25, 659.25, 587.33, 783.99], // Playful
      'Emotional': [349.23, 440, 523.25, 698.46], // Nostalgic F Major
      'Miss You': [293.66, 369.99, 440, 587.33], // Heartfelt D Major
    }[category] || [440, 523.25, 659.25, 783.99];

    scale.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.8, 'sine', 0.6);
      }, i * 240);
    });
  }
  // Play water droplet nurturing sound
  public playWaterSound() {
    this.playTone(880, 0.15, 'sine', 0.4);
    setTimeout(() => this.playTone(1174.66, 0.25, 'triangle', 0.4), 80);
    setTimeout(() => this.playTone(1760.0, 0.35, 'sine', 0.3), 160);
  }

  // Play a gentle blooming chime sound for when a flower blossoms
  public playBloomChime() {
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C major 9th sparkle
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.9, 'sine', 0.45);
      }, idx * 100);
    });
  }

  // Play balloon pop sound
  public playBalloonPopSound() {
    this.playTone(320, 0.05, 'triangle', 0.8);
    setTimeout(() => this.playTone(850, 0.08, 'sine', 0.6), 20);
  }

  // Play candle blowing soft wind sound
  public playBlowCandlesSound() {
    this.playTone(220, 0.25, 'triangle', 0.3);
    setTimeout(() => this.playTone(180, 0.35, 'sine', 0.25), 80);
    setTimeout(() => this.playTone(140, 0.45, 'sine', 0.15), 180);
  }

  // Play "Happy Birthday To You" chime melody
  public playHappyBirthdayMelody() {
    // C4, C4, D4, C4, F4, E4 | C4, C4, D4, C4, G4, F4 | C4, C4, C5, A4, F4, E4, D4 | Bb4, Bb4, A4, F4, G4, F4
    const notes: [number, number][] = [
      [261.63, 0.25], // Hap-
      [261.63, 0.25], // py
      [293.66, 0.5],  // Birth-
      [261.63, 0.5],  // day
      [349.23, 0.5],  // to
      [329.63, 0.9],  // you!
      [261.63, 0.25], // Hap-
      [261.63, 0.25], // py
      [293.66, 0.5],  // Birth-
      [261.63, 0.5],  // day
      [392.00, 0.5],  // to
      [349.23, 0.9],  // you!
      [261.63, 0.25], // Hap-
      [261.63, 0.25], // py
      [523.25, 0.5],  // Birth-
      [440.00, 0.5],  // day
      [349.23, 0.5],  // dear
      [329.63, 0.5],  // U-
      [293.66, 0.9],  // ma!
      [466.16, 0.3],  // Hap-
      [466.16, 0.3],  // py
      [440.00, 0.5],  // Birth-
      [349.23, 0.5],  // day
      [392.00, 0.5],  // to
      [349.23, 1.2],  // you!
    ];

    let delay = 0;
    notes.forEach(([freq, dur]) => {
      setTimeout(() => {
        this.playTone(freq, dur, 'sine', 0.5);
      }, delay);
      delay += dur * 600;
    });
  }
}

export const sound = new SoundEngine();
