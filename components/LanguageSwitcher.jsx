import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const LanguageSwitcher = ({ current, onChange }) => {
  return html`
    <div className="flex gap-2 bg-white/20 p-1 rounded-lg backdrop-blur-sm">
      ${['ar', 'fr', 'en'].map((lang) => html`
        <button
          key=${lang}
          onClick=${() => onChange(lang)}
          className=${`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            current === lang
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-white hover:bg-white/10'
          }`}
        >
          ${lang.toUpperCase()}
        </button>
      `)}
    </div>
  `;
};

export default LanguageSwitcher;