'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Custom language context for EduGenius Pro

interface LanguageContextType {
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  const handleLanguageChange = (lang: 'en' | 'ur') => {
    setLanguage(lang);
    // Update document direction for RTL support
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string, defaultValue?: string): string => {
    // Simple translation function
    const translations = {
      // Common translations
      "common.loading": language === 'ur' ? "لوڈ ہو رہا ہے..." : "Loading...",
      "common.error": language === 'ur' ? "خرابی" : "Error",
      "common.success": language === 'ur' ? "کامیابی" : "Success",
      "common.save": language === 'ur' ? "محفوظ کریں" : "Save",
      "common.cancel": language === 'ur' ? "منسوخ کریں" : "Cancel",
      "common.delete": language === 'ur' ? "حذف کریں" : "Delete",
      "common.edit": language === 'ur' ? "ترمیم کریں" : "Edit",
      "common.view": language === 'ur' ? "دیکھیں" : "View",

      // Navigation
      "navigation.home": language === 'ur' ? "ہوم" : "Home",
      "navigation.summaries": language === 'ur' ? "خلاصے" : "Summaries",
      "navigation.quizzes": language === 'ur' ? "کوئز" : "Quizzes",
      "navigation.progress": language === 'ur' ? "پیش رفت" : "Progress",
      "navigation.profile": language === 'ur' ? "پروفائل" : "Profile",

      // Summaries page
      "summaries.title": language === 'ur' ? "AI سے تقویت یافتہ باب کے خلاصے" : "AI-Powered Chapter Summaries",
      "summaries.subtitle": language === 'ur' ? "انگریزی یا اردو میں اختصار شدہ، ذاتی نوعیت کے خلاصے حاصل کریں تاکہ اپنی سیکھنے کی رفتار بڑھائیں۔" : "Get concise, personalized summaries in English or Urdu to accelerate your learning.",
      "summaries.generateSummary": language === 'ur' ? "خلاصہ بنائیں" : "Generate Summary",
      "summaries.selectChapter": language === 'ur' ? "باب منتخب کریں" : "Select Chapter",
      "summaries.language": language === 'ur' ? "زبان" : "Language",
      "summaries.english": language === 'ur' ? "انگریزی" : "English",
      "summaries.urdu": language === 'ur' ? "اردو" : "Urdu",
      "summaries.generateWithAI": language === 'ur' ? "AI سے بنائیں" : "Generate with AI",
      "summaries.createManual": language === 'ur' ? "دستی بنائیں" : "Create Manual",
      "summaries.chapterSummary": language === 'ur' ? "باب کا خلاصہ" : "Chapter Summary",
      "summaries.aiGenerated": language === 'ur' ? "AI سے بنایا گیا" : "AI Generated",
      "summaries.recentSummaries": language === 'ur' ? "حالیہ خلاصے" : "Recent Summaries",
      "summaries.takeQuiz": language === 'ur' ? "کوئز لیں" : "Take Quiz",
      "summaries.noSummaries": language === 'ur' ? "ابھی کوئی خلاصے نہیں۔ اوپر سے اپنا پہلا خلاصہ بنائیں!" : "No summaries yet. Create your first summary above!",
    };

    return translations[key as keyof typeof translations] || defaultValue || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleLanguageChange,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
