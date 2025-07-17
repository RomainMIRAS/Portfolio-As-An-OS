import { useState, useEffect, useCallback } from 'react';
import type { OSState, WindowState, AppConfig, NotificationState } from '../types/os';

// Configuration des applications disponibles
export const availableApps: AppConfig[] = [
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
    defaultPosition: { x: 150, y: 50 },
    resizable: true,
    color: '#3fb950'
  },
  {
    id: 'experience',
    name: 'Expérience',
    icon: 'Briefcase',
    component: 'ExperienceWindow',
    defaultSize: { width: 700, height: 550 },
    defaultPosition: { x: 200, y: 80 },
    resizable: true,
    color: '#d29922'
  },
  {
    id: 'skills',
    name: 'Compétences',
    icon: 'Code',
    component: 'SkillsWindow',
    defaultSize: { width: 650, height: 500 },
    defaultPosition: { x: 250, y: 120 },
    resizable: true,
    color: '#f85149'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'Terminal',
    component: 'TerminalWindow',
    defaultSize: { width: 700, height: 400 },
    defaultPosition: { x: 300, y: 150 },
    resizable: true,
    color: '#8b949e'
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: 'Mail',
    component: 'ContactWindow',
    defaultSize: { width: 750, height: 550 },
    defaultPosition: { x: 180, y: 100 },
    resizable: true,
    color: '#79c0ff'
  }
];

const useOSState = () => {
  const [osState, setOSState] = useState<OSState>({
    windows: [],
    notifications: [],
    isBootComplete: false,
    isShuttingDown: false,
    theme: 'dark',
    wallpaper: 'default',
    time: new Date(),
    maxZIndex: 1000
  });

  // Mettre à jour l'heure toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setOSState(prev => ({ ...prev, time: new Date() }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Marquer le boot comme terminé
  const markBootComplete = useCallback(() => {
    setOSState(prev => ({ ...prev, isBootComplete: true }));
  }, []);

  // Ouvrir une application
  const openApp = useCallback((app: AppConfig) => {
    setOSState(prev => {
      // Vérifier si la fenêtre est déjà ouverte
      const existingWindow = prev.windows.find(w => w.id === app.id);
      
      if (existingWindow) {
        // Si elle existe mais est minimisée, la restaurer et la mettre au premier plan
        return {
          ...prev,
          windows: prev.windows.map(w => 
            w.id === app.id 
              ? { ...w, isMinimized: false, zIndex: prev.maxZIndex + 1 }
              : w
          ),
          maxZIndex: prev.maxZIndex + 1
        };
      }

      // Créer une nouvelle fenêtre
      const newWindow: WindowState = {
        id: app.id,
        title: app.name,
        component: app.component,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position: app.defaultPosition,
        size: app.defaultSize,
        zIndex: prev.maxZIndex + 1,
        icon: app.icon
      };

      return {
        ...prev,
        windows: [...prev.windows, newWindow],
        maxZIndex: prev.maxZIndex + 1
      };
    });
  }, []);

  // Fermer une fenêtre
  const closeWindow = useCallback((windowId: string) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.filter(w => w.id !== windowId)
    }));
  }, []);

  // Mettre au premier plan
  const focusWindow = useCallback((windowId: string) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w => 
        w.id === windowId 
          ? { ...w, zIndex: prev.maxZIndex + 1 }
          : w
      ),
      maxZIndex: prev.maxZIndex + 1
    }));
  }, []);

  // Minimiser/restaurer une fenêtre
  const toggleMinimize = useCallback((windowId: string) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w => 
        w.id === windowId 
          ? { ...w, isMinimized: !w.isMinimized }
          : w
      )
    }));
  }, []);

  // Maximiser/restaurer une fenêtre
  const toggleMaximize = useCallback((windowId: string) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w => 
        w.id === windowId 
          ? { ...w, isMaximized: !w.isMaximized }
          : w
      )
    }));
  }, []);

  // Mettre à jour la position d'une fenêtre
  const updateWindowPosition = useCallback((windowId: string, position: { x: number; y: number }) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w => 
        w.id === windowId 
          ? { ...w, position }
          : w
      )
    }));
  }, []);

  // Mettre à jour la taille d'une fenêtre
  const updateWindowSize = useCallback((windowId: string, size: { width: number; height: number }) => {
    setOSState(prev => ({
      ...prev,
      windows: prev.windows.map(w => 
        w.id === windowId 
          ? { ...w, size }
          : w
      )
    }));
  }, []);

  // Basculer le thème
  const toggleTheme = useCallback(() => {
    setOSState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  }, []);

  // Ajouter une notification
  const addNotification = useCallback((notification: Omit<NotificationState, 'id' | 'timestamp'>) => {
    const newNotification: NotificationState = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    setOSState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification]
    }));

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration);
    }
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((notificationId: string) => {
    setOSState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== notificationId)
    }));
  }, []);

  // Initier la séquence d'extinction
  const initiateShutdown = useCallback(() => {
    // Fermer toutes les fenêtres d'abord
    setOSState(prev => ({
      ...prev,
      windows: [],
      isShuttingDown: true
    }));
  }, []);

  // Réinitialiser le système (pour redémarrer)
  const resetSystem = useCallback(() => {
    setOSState({
      windows: [],
      notifications: [],
      isBootComplete: false,
      isShuttingDown: false,
      theme: 'dark',
      wallpaper: 'default',
      time: new Date(),
      maxZIndex: 1000
    });
  }, []);

  return {
    osState,
    availableApps,
    markBootComplete,
    openApp,
    closeWindow,
    focusWindow,
    toggleMinimize,
    toggleMaximize,
    updateWindowPosition,
    updateWindowSize,
    toggleTheme,
    addNotification,
    removeNotification,
    initiateShutdown,
    resetSystem
  };
};

export default useOSState;
