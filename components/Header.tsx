import React from 'react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, theme, toggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[110] flex flex-col md:flex-row items-center justify-between p-4 md:p-6 bg-white/10 dark:bg-gray-900/80 backdrop-blur-2xl shadow-2xl border-b border-white/10 transition-all">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <svg className="w-10 h-10 text-gray-900" viewBox="0 0 100 100" fill="currentColor">
            {/* Base Bar */}
            <rect x="15" y="78" width="70" height="6" rx="3" />
            {/* Central Pillar */}
            <path d="M47 78 V40 Q50 37 53 40 V78 Z" />
            {/* The Stylized M Structure */}
            <path d="M25 42 V15 L50 38 L75 15 V42" fill="none" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
            {/* Pan Hangers */}
            <path d="M25 42 L15 62 M25 42 L35 62" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M75 42 L65 62 M75 42 L85 62" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Scale Pans */}
            <path d="M12 62 A13 13 0 0 0 38 62 Z" />
            <path d="M62 62 A13 13 0 0 0 88 62 Z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-white leading-none">
            الميزان
          </h1>
          <p className="text-sm font-bold text-yellow-400 uppercase tracking-[0.2em] mt-1">
            Mizan
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/5"
        >
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/5"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 6.364l.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;