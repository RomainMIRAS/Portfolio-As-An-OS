import { useState, useEffect, useCallback } from 'react';
import type { OSState, WindowState, AppConfig, NotificationState } from '../types/os';

const useOSState = () => {
  const [osState, setOSState] = useState<OSState>({
    windows: [],
    notifications: [],
    isBootComplete: false,
    isShuttingDown: false,
    theme: 'dark',
    wallpaper: 'default',
    time: new Date(),
    maxZIndex: 1000,
    desktopIconsVisible: true
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

  // Supprimer une notification
  const removeNotification = useCallback((notificationId: string) => {
    setOSState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== notificationId)
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
  }, [removeNotification]);

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
      maxZIndex: 1000,
      desktopIconsVisible: true
    });
  }, []);

  // Basculer la visibilité des icônes de bureau
  const toggleDesktopIcons = useCallback(() => {
    setOSState(prev => ({
      ...prev,
      desktopIconsVisible: !prev.desktopIconsVisible
    }));
  }, []);

  return {
    osState,
    markBootComplete,
    openApp,
    closeWindow,
    focusWindow,
    toggleMinimize,
    toggleMaximize,
    updateWindowPosition,
    updateWindowSize,
    addNotification,
    removeNotification,
    initiateShutdown,
    resetSystem,
    toggleDesktopIcons
  };
};

export default useOSState;
