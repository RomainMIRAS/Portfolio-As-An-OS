import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import DraggableWindow, { type ExitContext } from './DraggableWindow.tsx';
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

  const visible = windows
    .filter(window => window.isOpen && !window.isMinimized)
    .sort((a, b) => a.zIndex - b.zIndex);
  // La fenêtre visible au zIndex le plus élevé est la fenêtre active
  const focusedId = visible.length ? visible[visible.length - 1].id : null;

  // Contexte d'exit : permet à une fenêtre qui part de savoir si elle est minimisée ou fermée
  const exitContext: ExitContext = {};
  windows.forEach(w => { exitContext[w.id] = w.isOpen && w.isMinimized; });

  // Ids minimisés au commit précédent : un montage qui en fait partie est une restauration
  const minimizedRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    minimizedRef.current = new Set(windows.filter(w => w.isMinimized).map(w => w.id));
  });

  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence custom={exitContext}>
        {visible
          .map((window) => (
            <DraggableWindow
              key={window.id}
              window={window}
              isFocused={window.id === focusedId}
              fromMinimized={minimizedRef.current.has(window.id)}
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
