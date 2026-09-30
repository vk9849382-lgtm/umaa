import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Database, Lock, Menu, X } from 'lucide-react';
import { SectionId, SectionVisibilityMap } from '../types';

interface NavbarProps {
  onOpenDataBackup: () => void;
  onLockApp: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  editMode?: boolean;
  onToggleEditMode?: () => void;
  sectionsVisibility?: SectionVisibilityMap;
  onOpenSectionManager?: () => void;
}

const ALL_NAV_LINKS: { label: string; href: string; sectionId: SectionId }[] = [
  { label: 'Story', href: '#hero', sectionId: 'hero' },
  { label: 'Birthday 🎂', href: '#birthday', sectionId: 'birthday' },
  { label: 'Bday Game 🎮', href: '#birthday-game', sectionId: 'birthday' },
  { label: 'Journey', href: '#journey', sectionId: 'journey' },
  { label: 'Gallery', href: '#gallery', sectionId: 'gallery' },
  { label: 'Live Photos 📸', href: '#vault', sectionId: 'vault' },
  { label: 'Voice', href: '#voice', sectionId: 'voice' },
  { label: 'Mood', href: '#mood', sectionId: 'mood' },
  { label: 'Events', href: '#events', sectionId: 'events' },
  { label: 'Patch Up', href: '#patchup', sectionId: 'fights' },
  { label: 'Garden 🌸', href: '#garden', sectionId: 'garden' },
  { label: 'Letter', href: '#letter', sectionId: 'letter' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDataBackup,
  onLockApp,
  isMusicPlaying,
  onToggleMusic,
  sectionsVisibility,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ALL_NAV_LINKS.filter(
    (item) => !sectionsVisibility || sectionsVisibility[item.sectionId] !== false
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'glass-panel py-3 border-b border-white/60 shadow-sm'
          : 'bg-white/40 backdrop-blur-md py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#hero"
          className="text-lg md:text-xl font-serif-luxury font-bold tracking-tight text-slate-900 flex items-center gap-1.5 group"
        >
          <span>Dear Uma</span>
          <span className="text-blue-500 group-hover:scale-125 transition-transform duration-200">💙</span>
        </a>

        {/* Zone 2: Clean text navigation links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium text-slate-600">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {/* Background Music Toggle */}
          <button
            type="button"
            onClick={onToggleMusic}
            title={isMusicPlaying ? 'Mute romantic ambient music' : 'Play romantic ambient music'}
            className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
              isMusicPlaying
                ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                : 'bg-white/80 text-slate-600 border-slate-200/80 hover:text-slate-900'
            }`}
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-blue-500 animate-pulse" />
                <span className="hidden sm:inline whitespace-nowrap">Music On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline whitespace-nowrap">Music Off</span>
              </>
            )}
          </button>

          {/* Backup / Export Data */}
          <button
            type="button"
            onClick={onOpenDataBackup}
            title="Backup memories (JSON Export / Restore)"
            className="p-2 rounded-xl text-slate-600 hover:text-blue-600 bg-white/80 hover:bg-white border border-slate-200/80 transition-all text-xs flex items-center gap-1 cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span className="hidden lg:inline font-medium">Backup</span>
          </button>

          {/* Lock Universe */}
          <button
            type="button"
            onClick={onLockApp}
            title="Lock Universe"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-white border border-slate-200/80 transition-all text-xs cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 bg-white/80 border border-slate-200/80 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card mt-2 mx-4 p-4 rounded-2xl border border-white/80 shadow-lg space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
