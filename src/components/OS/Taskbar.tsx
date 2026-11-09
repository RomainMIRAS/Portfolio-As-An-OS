import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Terminal, Settings, Power } from 'lucide-react';
import { getAppIcon } from './appIcons';
import LanguageSelector from './LanguageSelector';
import type { AppConfig, WindowState } from '../../types/os';
import { APP_VERSION } from '../../config/version';

interface TaskbarProps {
  availableApps: AppConfig[];
  openWindows: WindowState[];
  currentTime: Date;
  onOpenApp: (app: AppConfig) => void;
  onToggleMinimize: (windowId: string) => void;
  onAddNotification: (notification: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; duration?: number }) => void;
  onShutdown: () => void;
}

const DOCK_BTN =
  'dock-item group relative transition-[transform,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 [@media(hover:hover)_and_(pointer:fine)]:hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent';

const Taskbar: React.FC<TaskbarProps> = ({ 
  availableApps, 
  openWindows, 
  currentTime, 
  onOpenApp, 
  onToggleMinimize,
  onAddNotification,
  onShutdown
}) => {
  const { t, i18n } = useTranslation();
  const getIcon = (iconName: string) => {
    const IconComponent = getAppIcon(iconName);
    return <IconComponent className="w-6 h-6" aria-hidden="true" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const handleShutdown = () => {
    onAddNotification({
      title: t('ui.shutdown.shuttingDown'),
      message: t('ui.shutdown.closingApplications'),
      type: 'warning',
      duration: 2000
    });
    
    setTimeout(() => {
      onShutdown();
    }, 1000);
  };

  const handleLanguageChange = (language: string) => {
    onAddNotification({
      title: t('ui.notifications.languageChanged'),
      message: t('ui.notifications.languageChangedMessage', { 
        language: language === 'en' ? 'English' : 'Français' 
      }),
      type: 'info',
      duration: 3000
    });
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="taskbar"
    >
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        {/* Section gauche - Logo et menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onAddNotification({
              title: t('ui.taskbar.startMenu'),
              message: `Portfolio OS v${APP_VERSION} - Romain MIRAS`,
              type: 'info',
              duration: 4000
            })}
            className={DOCK_BTN}
            title={t('ui.taskbar.startMenu')}
            aria-label={t('ui.taskbar.startMenu')}
          >
            <Terminal className="w-6 h-6 text-os-accent" aria-hidden="true" />
          </button>
        </div>

        {/* Section centrale - Applications */}
        <div className="flex items-center space-x-2 flex-1 justify-center">
          {availableApps.map((app) => {
            const isOpen = openWindows.some(w => w.id === app.id);
            const window = openWindows.find(w => w.id === app.id);
            
            return (
              <button
                key={app.id}
                onClick={() => {
                  if (isOpen && window) {
                    onToggleMinimize(window.id);
                  } else {
                    onOpenApp(app);
                  }
                }}
                className={`${DOCK_BTN} ${isOpen ? 'bg-os-accent/30 border-os-accent' : ''}`}
                title={app.name}
                aria-label={app.name}
                aria-pressed={isOpen}
              >
                {getIcon(app.icon)}
                {isOpen && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-os-accent rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Section droite - Contrôles système */}
        <div className="flex items-center space-x-4">
          {/* Bouton paramètres */}
          <button
            className={DOCK_BTN}
            title={t('ui.taskbar.settings')}
            aria-label={t('ui.taskbar.settings')}
            onClick={() => onAddNotification({
              title: t('ui.taskbar.settings'),
              message: t('ui.comingSoon'),
              type: 'info',
              duration: 3000
            })}
          >
            <Settings className="w-6 h-6 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:rotate-90" aria-hidden="true" />
          </button>

          {/* Language Selector */}
          <LanguageSelector onLanguageChange={handleLanguageChange} />

          {/* Horloge système */}
          <div className="bg-os-lighter/50 border border-os-border rounded-lg px-4 py-2 text-center">
            <div className="text-os-text font-mono text-sm font-medium">
              {formatTime(currentTime)}
            </div>
            <div className="text-os-text-muted font-mono text-xs">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Bouton power */}
          <button
            className={`${DOCK_BTN} text-os-error`}
            title={t('ui.taskbar.shutdown')}
            aria-label={t('ui.taskbar.shutdown')}
            onClick={handleShutdown}
          >
            <Power className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Taskbar;
