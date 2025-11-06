'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ur' : 'en';
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      title={language === 'en' ? 'Switch to Urdu' : 'انگریزی میں تبدیل کریں'}
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === 'en' ? 'اردو' : 'EN'}
      </span>
    </button>
  );
}
