import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import GlobeIcon from './icons/GlobeIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        id="language-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-soft-blue"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <GlobeIcon className="w-6 h-6 text-gray-600" />
        <span className="font-semibold text-gray-700">{language.toUpperCase()}</span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu-button"
        >
          <button
            onClick={() => selectLanguage(Language.ES)}
            className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center ${language === Language.ES ? 'font-bold' : ''}`}
            role="menuitem"
          >
            Español (ES)
          </button>
          <button
            onClick={() => selectLanguage(Language.EN)}
            className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center ${language === Language.EN ? 'font-bold' : ''}`}
            role="menuitem"
          >
            English (EN)
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
