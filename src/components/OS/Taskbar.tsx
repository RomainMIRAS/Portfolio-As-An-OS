import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, FolderOpen, Briefcase, Code, Terminal, Mail, 
  Settings, Power 
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import type { AppConfig, WindowState } from '../../types/os';

interface TaskbarProps {
  availableApps: AppConfig[];
  openWindows: WindowState[];
  currentTime: Date;
  onOpenApp: (app: AppConfig) => void;
  onToggleMinimize: (windowId: string) => void;
  onAddNotification: (notification: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; duration?: number }) => void;
  onShutdown: () => void;
}

const iconMap = {
  User,
  FolderOpen,
  Briefcase,
  Code,
  Terminal,
  Mail,
  Settings,
  Power
};

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
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Code className="w-6 h-6" />;
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="taskbar"
    >
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        {/* Section gauche - Logo et menu */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddNotification({
              title: t('ui.taskbar.startMenu'),
              message: 'Portfolio OS v1.0 - Romain MIRAS',
              type: 'info',
              duration: 4000
            })}
            className="dock-item group"
            title={t('ui.taskbar.startMenu')}
          >
            <Terminal className="w-6 h-6 text-os-accent" />
          </motion.button>
        </div>

        {/* Section centrale - Applications */}
        <div className="flex items-center space-x-2 flex-1 justify-center">
          {availableApps.map((app) => {
            const isOpen = openWindows.some(w => w.id === app.id);
            const window = openWindows.find(w => w.id === app.id);
            
            return (
              <motion.button
                key={app.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (isOpen && window) {
                    onToggleMinimize(window.id);
                  } else {
                    onOpenApp(app);
                  }
                }}
                className={`dock-item group ${isOpen ? 'bg-os-accent/30 border-os-accent' : ''}`}
                title={app.name}
              >
                {getIcon(app.icon)}
                {isOpen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-os-accent rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Section droite - Contrôles système */}
        <div className="flex items-center space-x-4">
          {/* Bouton paramètres */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="dock-item group"
            title={t('ui.taskbar.settings')}
            onClick={() => onAddNotification({
              title: t('ui.taskbar.settings'),
              message: t('ui.comingSoon'),
              type: 'info',
              duration: 3000
            })}
          >
            <Settings className="w-6 h-6" />
          </motion.button>

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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="dock-item group text-os-error"
            title={t('ui.taskbar.shutdown')}
            onClick={handleShutdown}
          >
            <Power className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Taskbar;
