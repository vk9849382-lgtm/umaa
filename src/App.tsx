import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { FloatingParticles } from './components/FloatingParticles';
import { SplashScreen } from './components/SplashScreen';
import { PasswordGate } from './components/PasswordGate';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BirthdayCelebration } from './components/BirthdayCelebration';
import { JourneyTimeline } from './components/JourneyTimeline';
import { MemoryGallery } from './components/MemoryGallery';
import { SharedPhotoSection } from './components/SharedPhotoSection';
import { VoiceMuseum } from './components/VoiceMuseum';
import { MoodTracker } from './components/MoodTracker';
import { EventTracker } from './components/EventTracker';
import { FightAndPatchUp } from './components/FightAndPatchUp';
import { FlowerGarden } from './components/FlowerGarden';
import { LoveLetter } from './components/LoveLetter';
import { Footer } from './components/Footer';
import { DataBackupModal } from './components/DataBackupModal';
import { SectionWrapper } from './components/SectionWrapper';
import {
  getIsUnlocked,
  setStoredUnlocked,
  getStoredSectionVisibility,
} from './services/storage';
import { sound } from './services/sound';

export default function App() {
  const [hasCompletedSplash, setHasCompletedSplash] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(getIsUnlocked());
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [sectionsVisibility] = useState(() => getStoredSectionVisibility());
  const [, setRefreshKey] = useState(0);

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    setStoredUnlocked(true);
    // Automatically start soft ambient background music
    sound.startBackgroundMusic((playing) => setIsMusicPlaying(playing));
  };

  const handleLockApp = () => {
    sound.stopBackgroundMusic((playing) => setIsMusicPlaying(playing));
    setIsUnlocked(false);
    setStoredUnlocked(false);
  };

  const handleToggleMusic = () => {
    sound.toggleBackgroundMusic((playing) => setIsMusicPlaying(playing));
  };

  const handleDataChanged = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#F8FBFE] to-[#FFFFFF] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Background Floating Ambient Particles */}
      <FloatingParticles />

      {/* 1. Splash Screen Phase */}
      <AnimatePresence>
        {!hasCompletedSplash && (
          <SplashScreen onComplete={() => setHasCompletedSplash(true)} />
        )}
      </AnimatePresence>

      {/* 2. Password Gate Phase */}
      <AnimatePresence>
        {hasCompletedSplash && !isUnlocked && (
          <PasswordGate onUnlockSuccess={handleUnlockSuccess} />
        )}
      </AnimatePresence>

      {/* 3. Main Unlocked Digital Universe */}
      {isUnlocked && (
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Top Bar Navigation */}
          <Navbar
            onOpenDataBackup={() => setIsDataModalOpen(true)}
            onLockApp={handleLockApp}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={handleToggleMusic}
            sectionsVisibility={sectionsVisibility}
          />

          {/* Main Website Sections */}
          <main className="flex-1">
            {/* 1. Home / Hero with Birthday Countdown, Clock, Days Counters & Quote */}
            {sectionsVisibility.hero !== false && (
              <SectionWrapper id="hero">
                <HeroSection
                  isMusicPlaying={isMusicPlaying}
                  onToggleMusic={handleToggleMusic}
                />
              </SectionWrapper>
            )}

            {/* 2. Birthday Special Celebration Section */}
            {sectionsVisibility.birthday !== false && (
              <SectionWrapper id="birthday">
                <BirthdayCelebration />
              </SectionWrapper>
            )}

            {/* 3. Our Journey Interactive Timeline */}
            {sectionsVisibility.journey !== false && (
              <SectionWrapper id="journey">
                <JourneyTimeline />
              </SectionWrapper>
            )}

            {/* 4. Memory Gallery (Pinterest-style Masonry) */}
            {sectionsVisibility.gallery !== false && (
              <SectionWrapper id="gallery">
                <MemoryGallery />
              </SectionWrapper>
            )}

            {/* 5. Live Shared Photo Vault */}
            {sectionsVisibility.vault !== false && (
              <SectionWrapper id="vault">
                <SharedPhotoSection />
              </SectionWrapper>
            )}

            {/* 6. Voice Museum */}
            {sectionsVisibility.voice !== false && (
              <SectionWrapper id="voice">
                <VoiceMuseum />
              </SectionWrapper>
            )}

            {/* 7. Mood Tracker & Emotional Journal */}
            {sectionsVisibility.mood !== false && (
              <SectionWrapper id="mood">
                <MoodTracker />
              </SectionWrapper>
            )}

            {/* 8. Relationship Planner & Reminders */}
            {sectionsVisibility.events !== false && (
              <SectionWrapper id="events">
                <EventTracker />
              </SectionWrapper>
            )}

            {/* 9. Fight & Patch Up Rules */}
            {sectionsVisibility.fights !== false && (
              <SectionWrapper id="fights">
                <FightAndPatchUp />
              </SectionWrapper>
            )}

            {/* 10. Virtual Flower Garden */}
            {sectionsVisibility.garden !== false && (
              <SectionWrapper id="garden">
                <FlowerGarden />
              </SectionWrapper>
            )}

            {/* 11. Handwritten Hinglish Love Letter */}
            {sectionsVisibility.letter !== false && (
              <SectionWrapper id="letter">
                <LoveLetter />
              </SectionWrapper>
            )}
          </main>

          {/* Clean Footer */}
          <Footer />

          {/* Data Backup Modal */}
          <DataBackupModal
            isOpen={isDataModalOpen}
            onClose={() => setIsDataModalOpen(false)}
            onDataChanged={handleDataChanged}
          />
        </div>
      )}
    </div>
  );
}
