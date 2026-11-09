import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Power } from 'lucide-react';
import { getAppIcon } from './appIcons';
import LanguageSelector from './LanguageSelector';
import type { AppConfig, WindowState } from '../../types/os';
import DockTooltip from './DockTooltip';
import StartMenu from './StartMenu';

interface TaskbarProps {
  availableApps: AppConfig[];
  openWindows: WindowState[];
  currentTime: Date;
  onOpenApp: (app: AppConfig) => void;
  onToggleMinimize: (windowId: string) => void;
  onAddNotification: (notification: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; duration?: number }) => void;
  onShutdown: () => void;
}

// Style de base du dock : tout le reste vit dans .dock-item (index.css)
const DOCK_BTN = 'dock-item group max-md:w-11 max-md:h-11';

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

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const formatTime = (date: Date, withSeconds: boolean) =>
    date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' } : {})
    });

  // Fenêtre au premier plan : non minimisée, zIndex maximal
  const focusedId = openWindows
    .filter((w) => !w.isMinimized)
    .reduce<WindowState | null>((top, w) => (!top || w.zIndex > top.zIndex ? w : top), null)?.id;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale, {
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
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto gap-2 md:gap-4">
        {/* Section gauche - Menu démarrer */}
        <div className="flex-shrink-0">
          <StartMenu apps={availableApps} onOpenApp={onOpenApp} />
        </div>

        {/* Section centrale - Applications (sous md : seulement les fenêtres ouvertes) */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-center max-md:justify-start max-md:overflow-x-auto max-md:py-1.5 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
          {availableApps.map((app) => {
            const win = openWindows.find(w => w.id === app.id);
            const isOpen = !!win;
            const isMinimized = !!win?.isMinimized;
            const isFocused = isOpen && app.id === focusedId;

            const stateClass = isFocused
              ? 'bg-os-accent/30 border-os-accent'
              : isMinimized
                ? 'opacity-60'
                : isOpen
                  ? 'border-os-accent/40'
                  : 'max-md:hidden';
            const dotClass = isFocused
              ? 'bg-os-accent'
              : isMinimized
                ? 'border border-os-accent/70 bg-transparent'
                : 'bg-os-text-muted';

            return (
              <DockTooltip key={app.id} label={app.name}>
                <button
                  data-dock-id={app.id}
                  onClick={() => {
                    if (win) {
                      onToggleMinimize(win.id);
                    } else {
                      onOpenApp(app);
                    }
                  }}
                  className={`${DOCK_BTN} flex-shrink-0 ${stateClass}`}
                  aria-label={app.name}
                  aria-pressed={isOpen && !isMinimized}
                >
                  {getIcon(app.icon)}
                  {isOpen && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      aria-hidden="true"
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-150 ${dotClass}`}
                    />
                  )}
                </button>
              </DockTooltip>
            );
          })}
        </div>

        {/* Section droite - Contrôles système */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <LanguageSelector onLanguageChange={handleLanguageChange} />

          {/* Horloge système : HH:mm seul sous md */}
          <div className="bg-os-lighter/50 border border-os-border rounded-lg px-2 md:px-4 py-1 md:py-2 text-center">
            <div className="text-os-text font-mono text-sm font-medium">
              <span className="md:hidden">{formatTime(currentTime, false)}</span>
              <span className="hidden md:inline">{formatTime(currentTime, true)}</span>
            </div>
            <div className="hidden md:block text-os-text-muted font-mono text-xs">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Bouton power */}
          <DockTooltip label={t('ui.taskbar.shutdown')}>
            <button
              className={`${DOCK_BTN} text-os-error`}
              aria-label={t('ui.taskbar.shutdown')}
              onClick={handleShutdown}
            >
              <Power className="w-6 h-6" aria-hidden="true" />
            </button>
          </DockTooltip>
        </div>
      </div>
    </motion.div>
  );
};

export default Taskbar;
