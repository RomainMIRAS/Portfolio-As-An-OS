import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Power, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ShutdownScreenProps {
  onComplete: () => void;
}

const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'preparing' | 'shutting-down' | 'goodbye' | 'complete'>('preparing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep('shutting-down'), 1000);
    const timer2 = setTimeout(() => setStep('goodbye'), 3000);
    const timer3 = setTimeout(() => setStep('complete'), 5000);
    const timer4 = setTimeout(() => onComplete(), 6000);

    // Animation du progrès
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const getMessage = () => {
    switch (step) {
      case 'preparing':
        return t('ui.shutdown.preparing');
      case 'shutting-down':
        return t('ui.shutdown.systemShutdown');
      case 'goodbye':
        return t('ui.shutdown.thankYouMessage');
      case 'complete':
        return t('ui.shutdown.goodbye');
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: step === 'complete' ? 2 : 0.5 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-os-darker via-os-dark to-black flex items-center justify-center"
    >
      <div className="text-center space-y-8 max-w-lg px-8">
        {/* Icône principale */}
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ 
            scale: step === 'complete' ? 0 : 1, 
            rotate: step === 'complete' ? 360 : 0 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="mx-auto w-24 h-24 rounded-full bg-os-error/20 border-2 border-os-error flex items-center justify-center"
        >
          <Power className="w-12 h-12 text-os-error" />
        </motion.div>

        {/* Message principal */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-white">
            {step === 'goodbye' ? (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-center gap-2"
              >
                {t('ui.shutdown.thankYouMessage')} 
                <Heart className="w-8 h-8 text-red-500 fill-current" />
              </motion.span>
            ) : (
              getMessage()
            )}
          </h1>
          
          {step !== 'goodbye' && step !== 'complete' && (
            <p className="text-os-text-muted text-lg">
              {t('ui.shutdown.savingData')}
            </p>
          )}

          {step === 'goodbye' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-os-text-muted text-lg"
            >
              {t('ui.shutdown.enjoyedVisit')}
            </motion.p>
          )}
        </motion.div>

        {/* Barre de progression */}
        {step !== 'goodbye' && step !== 'complete' && (
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between text-sm text-os-text-muted mb-2">
              <span>{t('ui.shutdown.progress')}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-os-darker rounded-full h-2 overflow-hidden border border-os-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full bg-gradient-to-r from-os-error via-red-500 to-red-600 rounded-full relative"
              >
                {/* Effet de brillance sur la barre */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              </motion.div>
            </div>
          </div>
        )}

        {/* Animation de particules améliorée */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Particules montantes */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              initial={{ 
                opacity: 0, 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100 
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: -100,
                x: Math.random() * window.innerWidth
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 5
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
            />
          ))}
          
          {/* Effet d'onde circulaire lors de l'extinction */}
          {step === 'complete' && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 10, opacity: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full"
            />
          )}
        </div>

        {/* Message final */}
        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-bold text-white"
          >
            {t('ui.shutdown.portfolioOSClosed')}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ShutdownScreen;
