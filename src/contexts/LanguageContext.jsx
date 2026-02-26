import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // RTL languages map
  const rtlLanguages = ['fa', 'ar', 'he', 'ur'];

  // Update document direction when language changes
  const updateDocumentDirection = (lang) => {
    const isRTL = rtlLanguages.includes(lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Add RTL class for styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  // Change language function
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    updateDocumentDirection(lang);
  };

  // Initialize on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || 'fa';
    if (savedLanguage !== i18n.language) {
      changeLanguage(savedLanguage);
    } else {
      updateDocumentDirection(i18n.language);
    }
  }, []);

  // Listen for language changes from i18n
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
      updateDocumentDirection(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const isRTL = rtlLanguages.includes(currentLanguage);

  const value = {
    currentLanguage,
    changeLanguage,
    isRTL,
    availableLanguages: [
      { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
