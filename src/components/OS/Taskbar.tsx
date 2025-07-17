import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, FolderOpen, Briefcase, Code, Terminal, Mail, 
  Sun, Moon, Settings, Power 
} from 'lucide-react';
import type { AppConfig, WindowState } from '../../types/os';

interface TaskbarProps {
  availableApps: AppConfig[];
  openWindows: WindowState[];
  currentTime: Date;
  theme: 'light' | 'dark';
  onOpenApp: (app: AppConfig) => void;
  onToggleMinimize: (windowId: string) => void;
  onToggleTheme: () => void;
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
  Sun,
  Moon,
  Settings,
  Power
};

const Taskbar: React.FC<TaskbarProps> = ({ 
  availableApps, 
  openWindows, 
  currentTime, 
  theme,
  onOpenApp, 
  onToggleMinimize,
  onToggleTheme,
  onAddNotification,
  onShutdown
}) => {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Code className="w-6 h-6" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const handleThemeToggle = () => {
    onToggleTheme();
    onAddNotification({
      title: 'Thème changé',
      message: `Thème ${theme === 'dark' ? 'clair' : 'sombre'} activé`,
      type: 'info',
      duration: 2000
    });
  };

  const handleShutdown = () => {
    // Afficher une notification de confirmation
    onAddNotification({
      title: 'Extinction en cours...',
      message: 'Fermeture de toutes les applications',
      type: 'warning',
      duration: 2000
    });
    
    // Démarrer la séquence d'extinction après un petit délai
    setTimeout(() => {
      onShutdown();
    }, 1000);
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
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="dock-item group bg-os-accent/20 border-os-accent/50"
          >
            <Terminal className="w-6 h-6 text-os-accent" />
          </motion.div>
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
          {/* Bouton thème */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleThemeToggle}
            className="dock-item group"
            title={`Passer au thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
          >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </motion.button>

          {/* Bouton paramètres */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="dock-item group"
            title="Paramètres"
            onClick={() => onAddNotification({
              title: 'Paramètres',
              message: 'Fonctionnalité bientôt disponible',
              type: 'info',
              duration: 3000
            })}
          >
            <Settings className="w-6 h-6" />
          </motion.button>

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
            title="Éteindre"
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
