import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

// Composants de drapeaux SVG pour une meilleure compatibilité
const FlagUS: React.FC<{ className?: string }> = ({ className = "w-5 h-4" }) => (
  <svg className={className} viewBox="0 0 24 18" fill="none">
    <rect width="24" height="18" fill="#B22234"/>
    <rect width="24" height="1.385" y="1.385" fill="white"/>
    <rect width="24" height="1.385" y="4.154" fill="white"/>
    <rect width="24" height="1.385" y="6.923" fill="white"/>
    <rect width="24" height="1.385" y="9.692" fill="white"/>
    <rect width="24" height="1.385" y="12.462" fill="white"/>
    <rect width="24" height="1.385" y="15.231" fill="white"/>
    <rect width="9.6" height="9.692" fill="#3C3B6E"/>
  </svg>
);

const FlagFR: React.FC<{ className?: string }> = ({ className = "w-5 h-4" }) => (
  <svg className={className} viewBox="0 0 24 18" fill="none">
    <rect width="8" height="18" fill="#002395"/>
    <rect width="8" height="18" x="8" fill="white"/>
    <rect width="8" height="18" x="16" fill="#ED2939"/>
  </svg>
);

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'en', label: t('ui.languageSelector.english'), flag: <FlagUS /> },
    { code: 'fr', label: t('ui.languageSelector.french'), flag: <FlagFR /> }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    setIsOpen(false);
    onLanguageChange?.(langCode);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-os-lighter/50 hover:bg-os-lighter text-os-text rounded-lg border border-os-border/50 backdrop-blur-sm transition-colors min-w-[120px]"
        title={t('ui.languageSelector.selectLanguage')}
      >
        <Globe className="w-4 h-4" />
        <div className="flex items-center justify-center">{currentLanguage?.flag}</div>
        <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 right-0 bg-os-light/95 backdrop-blur-sm border border-os-border/50 rounded-lg shadow-lg overflow-hidden z-[100] min-w-[160px]"
          >
            {languages.map((language) => (
              <motion.button
                key={language.code}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3 flex items-center space-x-3 text-left transition-colors ${
                  i18n.language === language.code 
                    ? 'bg-os-accent/20 text-os-accent' 
                    : 'text-os-text hover:text-os-accent hover:bg-os-accent/10'
                }`}
              >
                <div className="flex items-center justify-center">{language.flag}</div>
                <div>
                  <div className="text-sm font-medium">{language.label}</div>
                  <div className="text-xs text-os-text-muted">{language.code.toUpperCase()}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[90]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;