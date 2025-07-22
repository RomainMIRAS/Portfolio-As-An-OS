import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BootScreen from './components/OS/BootScreen';
import ShutdownScreen from './components/OS/ShutdownScreen';
import Wallpaper from './components/OS/Wallpaper';
import Taskbar from './components/OS/Taskbar';
import WindowManager from './components/OS/WindowManager';
import NotificationCenter from './components/OS/NotificationCenter';
import DesktopIcons from './components/OS/DesktopIcons';
import useOSState from './hooks/useOSState';
import { useLocalizedApps } from './hooks/useLocalizedApps';

const App: React.FC = () => {
  const {
    osState,
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
    resetSystem,
    toggleDesktopIcons
  } = useOSState();

  const availableApps = useLocalizedApps();

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {!osState.isBootComplete ? (
          <BootScreen onBootComplete={markBootComplete} />
        ) : osState.isShuttingDown ? (
          <ShutdownScreen onComplete={resetSystem} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-screen overflow-hidden"
          >
            {/* Wallpaper */}
            <Wallpaper theme={osState.theme} wallpaper={osState.wallpaper} />

            {/* Desktop Icons */}
            <DesktopIcons
              availableApps={availableApps}
              onOpenApp={openApp}
              visible={osState.desktopIconsVisible}
              onToggleDesktopIcons={toggleDesktopIcons}
            />

            {/* Window Manager */}
            <WindowManager
              windows={osState.windows}
              onClose={closeWindow}
              onFocus={focusWindow}
              onMinimize={toggleMinimize}
              onMaximize={toggleMaximize}
              onUpdatePosition={updateWindowPosition}
              onUpdateSize={updateWindowSize}
            />

            {/* Taskbar */}
            <Taskbar
              availableApps={availableApps}
              openWindows={osState.windows}
              currentTime={osState.time}
              theme={osState.theme}
              onOpenApp={openApp}
              onToggleMinimize={toggleMinimize}
              onToggleTheme={toggleTheme}
              onAddNotification={addNotification}
              onShutdown={initiateShutdown}
            />

            {/* Notification Center */}
            <NotificationCenter
              notifications={osState.notifications}
              onRemove={removeNotification}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
