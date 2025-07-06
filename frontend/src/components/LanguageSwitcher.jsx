import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'العربية', flag: '🇶🇦' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 hidden sm:block">Language:</span>
      <div className="relative">
        <select
          onChange={handleChange}
          value={i18n.language}
          className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
          aria-label="Select language"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 