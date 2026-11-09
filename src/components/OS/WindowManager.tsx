import React, { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import DraggableWindow from './DraggableWindow.tsx';
import type { WindowState } from '../../types/os';

// Fenêtres chargées à la demande (code splitting)
const AboutWindow = lazy(() => import('../Windows/AboutWindow.tsx'));
const ProjectsWindow = lazy(() => import('../Windows/ProjectsWindow.tsx'));
const ExperienceWindow = lazy(() => import('../Windows/ExperienceWindow.tsx'));
const SkillsWindow = lazy(() => import('../Windows/SkillsWindow.tsx'));
const TerminalWindow = lazy(() => import('../Windows/TerminalWindow.tsx'));
const ContactWindow = lazy(() => import('../Windows/ContactWindow.tsx'));

const WindowFallback: React.FC = () => (
  <div className="flex h-full min-h-32 items-center justify-center" role="status" aria-busy="true">
    <div className="h-5 w-5 rounded-full border-2 border-os-accent/30 border-t-os-accent animate-spin" />
  </div>
);

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
      return (
        <Suspense fallback={<WindowFallback />}>
          <Component onAddNotification={onAddNotification} />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<WindowFallback />}>
        <Component />
      </Suspense>
    );
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
