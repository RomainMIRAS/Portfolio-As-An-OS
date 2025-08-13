import React from 'react';
import { AnimatePresence } from 'framer-motion';
import DraggableWindow from './DraggableWindow.tsx';
import type { WindowState } from '../../types/os';

// Import des composants de fenêtres
import AboutWindow from '../Windows/AboutWindow.tsx';
import ProjectsWindow from '../Windows/ProjectsWindow.tsx';
import ExperienceWindow from '../Windows/ExperienceWindow.tsx';
import SkillsWindow from '../Windows/SkillsWindow.tsx';
import TerminalWindow from '../Windows/TerminalWindow.tsx';
import ContactWindow from '../Windows/ContactWindow.tsx';

interface WindowManagerProps {
  windows: WindowState[];
  onClose: (windowId: string) => void;
  onFocus: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onUpdatePosition: (windowId: string, position: { x: number; y: number }) => void;
  onUpdateSize: (windowId: string, size: { width: number; height: number }) => void;
  onAddNotification?: (n: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; duration?: number }) => void;
}

const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  onUpdateSize,
  onAddNotification
}) => {
  // Composants de fenêtres disponibles
  const windowComponents = {
    AboutWindow,
    ProjectsWindow,
    ExperienceWindow,
    SkillsWindow,
    TerminalWindow,
    ContactWindow
  };

  const renderWindowContent = (window: WindowState) => {
    const Component = windowComponents[window.component as keyof typeof windowComponents];
    
    if (!Component) {
      return (
        <div className="p-6 text-center">
          <p className="text-os-text-muted">Composant '{window.component}' non trouvé</p>
        </div>
      );
    }

    // Inject props conditionnellement pour certaines fenêtres (ex: Contact)
    if (window.component === 'ContactWindow' && onAddNotification) {
      return <Component onAddNotification={onAddNotification} />;
    }
    return <Component />;
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        {windows
          .filter(window => window.isOpen && !window.isMinimized)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((window) => (
            <DraggableWindow
              key={window.id}
              window={window}
              onClose={() => onClose(window.id)}
              onFocus={() => onFocus(window.id)}
              onMinimize={() => onMinimize(window.id)}
              onMaximize={() => onMaximize(window.id)}
              onUpdatePosition={(position) => onUpdatePosition(window.id, position)}
              onUpdateSize={(size) => onUpdateSize(window.id, size)}
            >
              {renderWindowContent(window)}
            </DraggableWindow>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default WindowManager;
