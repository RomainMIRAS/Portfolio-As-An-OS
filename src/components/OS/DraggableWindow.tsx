import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square, Maximize } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { WindowState } from '../../types/os';

interface DraggableWindowProps {
  window: WindowState;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
  onUpdateSize: (size: { width: number; height: number }) => void;
}

const MOBILE_QUERY = '(max-width: 767px)';
const TASKBAR_HEIGHT = 64;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// Gating du hover : uniquement pour les pointeurs précis avec survol
const HOVER = '[@media(hover:hover)_and_(pointer:fine)]:hover';
const CONTROL_BASE =
  'relative w-6 h-6 rounded-full flex items-center justify-center ' +
  'transition-[background-color,transform] duration-150 ease-out-strong active:scale-95 ' +
  'before:content-[""] before:absolute before:-inset-1 ' +
  'pointer-coarse:w-8 pointer-coarse:h-8';

type Gesture =
  | { mode: 'drag'; pointerId: number; startX: number; startY: number; originX: number; originY: number; x: number; y: number }
  | { mode: 'resize'; pointerId: number; startX: number; startY: number; width: number; height: number; w: number; h: number };

const DraggableWindow: React.FC<DraggableWindowProps> = ({
  window,
  children,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  onUpdateSize
}) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(() => globalThis.window.matchMedia(MOBILE_QUERY).matches);

  const windowRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture | null>(null);

  useEffect(() => {
    const mql = globalThis.window.matchMedia(MOBILE_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Donne le focus clavier à la fenêtre à l'ouverture (nécessaire pour Escape)
  useEffect(() => {
    windowRef.current?.focus({ preventScroll: true });
  }, []);

  const fullscreen = window.isMaximized || isMobile;
  const canMove = !fullscreen;

  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if ((e.target as HTMLElement).closest('button')) return;
    onFocus();
    if (!canMove || gestureRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gestureRef.current = {
      mode: 'drag',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: window.position.x,
      originY: window.position.y,
      x: window.position.x,
      y: window.position.y
    };
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    onFocus();
    if (gestureRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gestureRef.current = {
      mode: 'resize',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      width: window.size.width,
      height: window.size.height,
      w: window.size.width,
      h: window.size.height
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gestureRef.current;
    const el = windowRef.current;
    if (!g || !el || e.pointerId !== g.pointerId) return;

    if (g.mode === 'drag') {
      g.x = Math.max(0, Math.min(globalThis.window.innerWidth - window.size.width, g.originX + e.clientX - g.startX));
      g.y = Math.max(0, Math.min(globalThis.window.innerHeight - window.size.height - 80, g.originY + e.clientY - g.startY));
      // Propriété CSS `translate` : indépendante du `transform` géré par framer-motion
      el.style.translate = `${g.x - g.originX}px ${g.y - g.originY}px`;
    } else {
      g.w = Math.max(300, g.width + e.clientX - g.startX);
      g.h = Math.max(200, g.height + e.clientY - g.startY);
      el.style.width = `${g.w}px`;
      el.style.height = `${g.h}px`;
    }
  };

  // Un seul commit vers l'état global à la fin du geste
  const endGesture = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gestureRef.current;
    if (!g || e.pointerId !== g.pointerId) return;
    gestureRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const el = windowRef.current;
    if (el) el.style.translate = '';
    if (g.mode === 'drag') {
      if (g.x !== g.originX || g.y !== g.originY) onUpdatePosition({ x: g.x, y: g.y });
    } else if (g.w !== g.width || g.h !== g.height) {
      onUpdateSize({ width: g.w, height: g.h });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && !e.defaultPrevented) {
      e.stopPropagation();
      onClose();
    }
  };

  const windowStyle = fullscreen
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: `calc(100dvh - ${TASKBAR_HEIGHT}px)`
      }
    : {
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height
      };

  return (
    <motion.div
      ref={windowRef}
      role="dialog"
      aria-label={window.title}
      tabIndex={-1}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.2, ease: EASE_OUT } }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12, ease: EASE_OUT } }}
      className="fixed pointer-events-auto outline-none"
      style={{
        ...windowStyle,
        zIndex: window.zIndex
      }}
      onPointerDown={() => onFocus()}
      onKeyDown={handleKeyDown}
    >
      <div className="window h-full flex flex-col">
        {/* Barre de titre */}
        <div
          className={`window-header select-none touch-none ${canMove ? 'cursor-move' : ''}`}
          onPointerDown={handleHeaderPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="text-os-text font-medium truncate">{window.title}</div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bouton minimiser */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className={`${CONTROL_BASE} bg-os-warning/80 ${HOVER}:bg-os-warning`}
              title={t('ui.windowControls.minimize')}
              aria-label={t('ui.windowControls.minimize')}
            >
              <Minus className="w-3 h-3 text-os-darker" />
            </button>

            {/* Bouton maximiser/restaurer */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className={`${CONTROL_BASE} bg-os-success/80 ${HOVER}:bg-os-success`}
              title={window.isMaximized ? t('ui.windowControls.restore') : t('ui.windowControls.maximize')}
              aria-label={window.isMaximized ? t('ui.windowControls.restore') : t('ui.windowControls.maximize')}
            >
              {window.isMaximized ?
                <Square className="w-3 h-3 text-os-darker" /> :
                <Maximize className="w-3 h-3 text-os-darker" />
              }
            </button>

            {/* Bouton fermer */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className={`${CONTROL_BASE} bg-os-error/80 ${HOVER}:bg-os-error`}
              title={t('ui.windowControls.close')}
              aria-label={t('ui.windowControls.close')}
            >
              <X className="w-3 h-3 text-os-darker" />
            </button>
          </div>
        </div>

        {/* Contenu de la fenêtre */}
        <div className="window-content flex-1 overflow-auto">
          {children}
        </div>

        {/* Poignée de redimensionnement */}
        {!fullscreen && (
          <div
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-4 h-4 pointer-coarse:w-8 pointer-coarse:h-8 cursor-se-resize touch-none"
            onPointerDown={handleResizePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endGesture}
            onPointerCancel={endGesture}
          >
            <div className="absolute bottom-1 right-1 w-0 h-0 border-l-4 border-b-4 border-l-transparent border-b-os-border opacity-50" />
            <div className="absolute bottom-0.5 right-0.5 w-0 h-0 border-l-[3px] border-b-[3px] border-l-transparent border-b-os-border opacity-30" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DraggableWindow;
