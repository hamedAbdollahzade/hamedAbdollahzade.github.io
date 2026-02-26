import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages, isRTL } = useLanguage();

  const handleLanguageChange = (langCode) => {
    if (langCode !== currentLanguage) {
      changeLanguage(langCode);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      <GlobalOutlined className="text-gray-600 dark:text-gray-300" />
      <div className="flex gap-1">
        {availableLanguages.map((lang) => (
          <Button
            key={lang.code}
            type={currentLanguage === lang.code ? 'primary' : 'text'}
            size="small"
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
              currentLanguage === lang.code
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span className="text-xs font-medium hidden sm:inline">
              {lang.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
