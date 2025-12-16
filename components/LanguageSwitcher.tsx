import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="flex gap-2 bg-white/20 p-1 rounded-lg backdrop-blur-sm">
      {(['ar', 'fr', 'en'] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            current === lang
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-white hover:bg-white/10'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
