import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Minus, Square, Maximize } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { WindowState } from '../../types/os';

interface DraggableWindowProps {
  window: WindowState;
  isFocused: boolean;
  fromMinimized: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
  onUpdateSize: (size: { width: number; height: number }) => void;
}

// Contexte d'exit transmis par AnimatePresence (id -> fenêtre minimisée)
export type ExitContext = Record<string, boolean>;

const MOBILE_QUERY = '(max-width: 767px)';
const TASKBAR_HEIGHT = 64;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const MIN_SCALE = 0.3;

// Gating du hover : uniquement pour les pointeurs précis avec survol
const HOVER = '[@media(hover:hover)_and_(pointer:fine)]:hover';
const CONTROL_BASE =
  'relative w-6 h-6 rounded-full flex items-center justify-center ' +
  'transition-[background-color,transform] duration-150 ease-out-strong active:scale-95 ' +
  'before:content-[""] before:absolute before:-inset-1 ' +
  'pointer-coarse:w-8 pointer-coarse:h-8';

// Centre du lanceur (dock d'abord, sinon icône du bureau) ; null si absent
const getLauncherCenter = (id: string): { x: number; y: number } | null => {
  const selectors = [`[data-dock-id="${id}"]`, `[data-desktop-icon-id="${id}"]`];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return null;
};

type Gesture =
  | { mode: 'drag'; pointerId: number; startX: number; startY: number; originX: number; originY: number; x: number; y: number }
  | { mode: 'resize'; pointerId: number; startX: number; startY: number; width: number; height: number; w: number; h: number };

const DraggableWindow: React.FC<DraggableWindowProps> = ({
  window,
  isFocused,
  fromMinimized,
  children,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  onUpdateSize
}) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
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

  // Entrée calculée une seule fois au montage : depuis le dock (restauration) ou le lanceur (ouverture)
  const [enter] = useState(() => {
    const rect = fullscreen
      ? { left: 0, top: 0, width: globalThis.window.innerWidth, height: globalThis.window.innerHeight - TASKBAR_HEIGHT }
      : { left: window.position.x, top: window.position.y, width: window.size.width, height: window.size.height };
    const launcher = getLauncherCenter(window.id);
    if (reduceMotion || !launcher) {
      return { initial: { opacity: 0, scale: reduceMotion ? 1 : 0.96 }, origin: '50% 50%' };
    }
    if (fromMinimized) {
      return {
        initial: {
          opacity: 0,
          scale: MIN_SCALE,
          x: launcher.x - (rect.left + rect.width / 2),
          y: launcher.y - (rect.top + rect.height / 2)
        },
        origin: '50% 50%'
      };
    }
    return {
      initial: { opacity: 0, scale: 0.9 },
      origin: `${launcher.x - rect.left}px ${launcher.y - rect.top}px`
    };
  });

  // Transition courte lors du basculement maximiser/restaurer (hors drag/resize)
  const [morphing, setMorphing] = useState(false);
  const prevMaxRef = useRef(window.isMaximized);
  useEffect(() => {
    if (prevMaxRef.current === window.isMaximized) return;
    prevMaxRef.current = window.isMaximized;
    if (reduceMotion) return;
    setMorphing(true);
    const timer = globalThis.setTimeout(() => setMorphing(false), 220);
    return () => globalThis.clearTimeout(timer);
  }, [window.isMaximized, reduceMotion]);

  // Sortie : minimiser = vol vers le dock, fermer = fondu court
  const buildExit = (ctx?: ExitContext) => {
    const closeExit = { opacity: 0, scale: reduceMotion ? 1 : 0.96, transition: { duration: 0.12, ease: EASE_OUT } };
    if (!ctx?.[window.id]) return closeExit;
    const minimizeFade = { opacity: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' as const } };
    const dock = getLauncherCenter(window.id);
    const el = windowRef.current;
    if (reduceMotion || !dock || !el) return minimizeFade;
    const r = el.getBoundingClientRect();
    // Compense l'origine de transformation pour que le centre atterrisse sur le lanceur
    const [oxs, oys] = enter.origin.split(' ');
    const ox = oxs.endsWith('%') ? (parseFloat(oxs) / 100) * r.width : parseFloat(oxs);
    const oy = oys.endsWith('%') ? (parseFloat(oys) / 100) * r.height : parseFloat(oys);
    const k = 1 - MIN_SCALE;
    return {
      opacity: 0,
      scale: MIN_SCALE,
      x: dock.x - (r.left + r.width / 2) + k * (r.width / 2 - ox),
      y: dock.y - (r.top + r.height / 2) + k * (r.height / 2 - oy),
      transition: { duration: 0.2, ease: 'easeOut' as const }
    };
  };

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
      // Ne pas fermer pendant la saisie (évite la perte d'un brouillon)
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      e.stopPropagation();
      onClose();
    }
  };

  // Double-clic sur la barre de titre : maximiser/restaurer (desktop uniquement)
  const handleHeaderDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || (e.target as HTMLElement).closest('button')) return;
    onMaximize();
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
      data-focused={isFocused}
      variants={{
        initial: enter.initial,
        animate: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0.2, ease: EASE_OUT } },
        exit: (ctx?: ExitContext) => buildExit(ctx)
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`fixed pointer-events-auto outline-none ${
        morphing ? 'transition-[left,top,width,height] duration-200 ease-out-strong' : ''
      }`}
      style={{
        ...windowStyle,
        zIndex: window.zIndex,
        transformOrigin: enter.origin
      }}
      onPointerDown={() => onFocus()}
      onKeyDown={handleKeyDown}
    >
      <div className="window h-full flex flex-col">
        {/* Barre de titre */}
        <div
          className={`window-header select-none touch-none ${canMove ? 'cursor-move' : ''}`}
          onPointerDown={handleHeaderPointerDown}
          onDoubleClick={handleHeaderDoubleClick}
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
