import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Taskbar from './Taskbar.tsx';
import WindowManager from './WindowManager.tsx';
import Wallpaper from './Wallpaper.tsx';
import NotificationCenter from './NotificationCenter.tsx';
import type { WindowState, AppConfig, OSState, NotificationState } from '../../types/os.ts';

const Desktop: React.FC = () => {
  const [osState, setOSState] = useState<OSState>({
    windows: [],
    notifications: [],
    isBootComplete: true,
    theme: 'dark',
    wallpaper: 'default',
    time: new Date(),
    maxZIndex: 100
  });

  // Applications disponibles
  const availableApps: AppConfig[] = [
    {
      id: 'about',
      name: 'À propos',
      icon: 'User',
      component: 'AboutWindow',
      defaultSize: { width: 600, height: 500 },
      defaultPosition: { x: 100, y: 100 },
      resizable: true,
      color: '#58a6ff'
    },
    {
      id: 'projects',
      name: 'Projets',
      icon: 'FolderOpen',
      component: 'ProjectsWindow',
      defaultSize: { width: 800, height: 600 },
      defaultPosition: { x: 150, y: 150 },
      resizable: true,
      color: '#3fb950'
    },
    {
      id: 'experience',
      name: 'Expérience',
      icon: 'Briefcase',
      component: 'ExperienceWindow',
      defaultSize: { width: 700, height: 550 },
      defaultPosition: { x: 200, y: 100 },
      resizable: true,
      color: '#d29922'
    },
    {
      id: 'skills',
      name: 'Compétences',
      icon: 'Code',
      component: 'SkillsWindow',
      defaultSize: { width: 650, height: 500 },
      defaultPosition: { x: 250, y: 150 },
      resizable: true,
      color: '#f85149'
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: 'Terminal',
      component: 'TerminalWindow',
      defaultSize: { width: 750, height: 450 },
      defaultPosition: { x: 300, y: 200 },
      resizable: true,
      color: '#21262d'
    },
    {
      id: 'contact',
      name: 'Contact',
      icon: 'Mail',
      component: 'ContactWindow',
      defaultSize: { width: 500, height: 400 },
      defaultPosition: { x: 350, y: 250 },
      resizable: true,
      color: '#8b949e'
    }
  ];

  // Mettre à jour l'heure toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setOSState(prev => ({ ...prev, time: new Date() }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Ouvrir une application
  const openApp = (appConfig: AppConfig) => {
    const existingWindow = osState.windows.find(w => w.id === appConfig.id);
    
    if (existingWindow) {
      // Si la fenêtre existe déjà, la mettre au premier plan
      focusWindow(existingWindow.id);
      if (existingWindow.isMinimized) {
        setOSState(prev => ({
          ...prev,
          windows: prev.windows.map(w =>
            w.id === existingWindow.id ? { ...w, isMinimized: false } : w
          )
        }));
      }
      return;
    }

    // Créer une nouvelle fenêtre
    const newWindow: WindowState = {
      id: appConfig.id,
      title: appConfig.name,
      component: appConfig.component,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: appConfig.defaultPosition,
      size: appConfig.defaultSize,
      zIndex: osState.maxZIndex + 1,
      icon: appConfig.icon
    };

    setOSState(prev => ({
      ...prev,
      windows: [...prev.windows, newWindow],
      maxZIndex: prev.maxZIndex + 1
    }));
  };

  // Fermer une fenêtre
  const closeWindow = (windowId: string) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.filter(w => w.id !== windowId)
    }));
  };

  // Mettre une fenêtre au premier plan
  const focusWindow = (windowId: string) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w =>
        w.id === windowId ? { ...w, zIndex: prev.maxZIndex + 1 } : w
      ),
      maxZIndex: prev.maxZIndex + 1
    }));
  };

  // Minimiser/restaurer une fenêtre
  const toggleMinimize = (windowId: string) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w =>
        w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
      )
    }));
  };

  // Maximiser/restaurer une fenêtre
  const toggleMaximize = (windowId: string) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w =>
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
      )
    }));
  };

  // Mettre à jour la position d'une fenêtre
  const updateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w =>
        w.id === windowId ? { ...w, position } : w
      )
    }));
  };

  // Mettre à jour la taille d'une fenêtre
  const updateWindowSize = (windowId: string, size: { width: number; height: number }) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w =>
        w.id === windowId ? { ...w, size } : w
      )
    }));
  };

  // Ajouter une notification
  const addNotification = (notification: Omit<NotificationState, 'id' | 'timestamp'>) => {
    const newNotification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: Date.now()
    };

    setOSState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification]
    }));

    // Supprimer automatiquement après la durée spécifiée
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration);
    }
  };

  // Supprimer une notification
  const removeNotification = (notificationId: string) => {
    setOSState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== notificationId)
    }));
  };

  // Changer le thème
  const toggleTheme = () => {
    setOSState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 overflow-hidden"
    >
      {/* Fond d'écran */}
      <Wallpaper theme={osState.theme} wallpaper={osState.wallpaper} />

      {/* Gestionnaire de fenêtres */}
      <WindowManager
        windows={osState.windows}
        onClose={closeWindow}
        onFocus={focusWindow}
        onMinimize={toggleMinimize}
        onMaximize={toggleMaximize}
        onUpdatePosition={updateWindowPosition}
        onUpdateSize={updateWindowSize}
      />

      {/* Centre de notifications */}
      <NotificationCenter
        notifications={osState.notifications}
        onRemove={removeNotification}
      />

      {/* Barre des tâches */}
      <Taskbar
        availableApps={availableApps}
        openWindows={osState.windows}
        currentTime={osState.time}
        theme={osState.theme}
        onOpenApp={openApp}
        onToggleMinimize={toggleMinimize}
        onToggleTheme={toggleTheme}
        onAddNotification={addNotification}
      />
    </motion.div>
  );
};

export default Desktop;
