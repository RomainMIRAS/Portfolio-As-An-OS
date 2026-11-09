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
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center space-x-2 px-3 py-2 bg-os-lighter/50 text-os-text rounded-lg border border-os-border/50 backdrop-blur-sm transition-colors duration-150 min-w-[120px] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-os-lighter"
        title={t('ui.languageSelector.selectLanguage')}
      >
        <Globe className="w-4 h-4" />
        <div className="flex items-center justify-center">{currentLanguage?.flag}</div>
        <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-150 ease-out-strong ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, y: 8, scale: 0.95, transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] } }}
            style={{ transformOrigin: 'bottom right' }}
            className="absolute bottom-full mb-2 right-0 bg-os-light/95 backdrop-blur-sm border border-os-border/50 rounded-lg shadow-lg overflow-hidden z-[100] min-w-[160px]"
          >
            {languages.map((language) => (
              <motion.button
                key={language.code}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3 flex items-center space-x-3 text-left transition-colors duration-150 ${
                  i18n.language === language.code
                    ? 'bg-os-accent/20 text-os-accent'
                    : 'text-os-text [@media(hover:hover)_and_(pointer:fine)]:hover:text-os-accent [@media(hover:hover)_and_(pointer:fine)]:hover:bg-os-accent/10'
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