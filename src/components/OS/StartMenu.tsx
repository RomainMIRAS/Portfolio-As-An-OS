import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Terminal } from 'lucide-react';
import { getAppIcon } from './appIcons';
import DockTooltip from './DockTooltip';
import type { AppConfig } from '../../types/os';
import { APP_VERSION } from '../../config/version';

interface StartMenuProps {
  apps: AppConfig[];
  onOpenApp: (app: AppConfig) => void;
}

const EASE = [0.23, 1, 0.32, 1] as const;

const StartMenu: React.FC<StartMenuProps> = ({ apps, onOpenApp }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Fermeture au clic extérieur et à Escape
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close]);

  // Focus clavier sur le premier élément à l'ouverture
  useEffect(() => {
    if (isOpen) itemRefs.current[0]?.focus();
  }, [isOpen]);

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = itemRefs.current.filter((el): el is HTMLButtonElement => el !== null);
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);
    let next = -1;
    if (e.key === 'ArrowDown') next = (idx + 1) % items.length;
    else if (e.key === 'ArrowUp') next = (idx - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else if (e.key === 'Tab') {
      close();
      return;
    }
    if (next >= 0) {
      e.preventDefault();
      items[next].focus();
    }
  };

  const label = t('ui.taskbar.startMenu');

  return (
    <div ref={rootRef} className="relative">
      <DockTooltip label={label}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="dock-item group max-[767px]:w-11 max-[767px]:h-11"
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <Terminal className="w-6 h-6 text-os-accent" aria-hidden="true" />
        </button>
      </DockTooltip>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label={label}
            onKeyDown={handleMenuKeyDown}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: EASE } }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.97, transition: { duration: 0.1, ease: EASE } }}
            style={{ transformOrigin: 'bottom left' }}
            className="absolute bottom-full left-0 mb-3 w-64 max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto bg-os-light/95 backdrop-blur-os border border-os-border rounded-lg shadow-2xl z-[100]"
          >
            <div className="px-4 py-3 border-b border-os-border text-xs font-medium text-os-text-muted">
              {`Portfolio OS v${APP_VERSION} – Romain MIRAS`}
            </div>
            <div className="p-1">
              {apps.map((app, i) => {
                const Icon = getAppIcon(app.icon);
                return (
                  <button
                    key={app.id}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onOpenApp(app);
                      close();
                    }}
                    className="w-full min-h-11 px-3 flex items-center gap-3 rounded-md text-left text-sm text-os-text transition-colors duration-150 focus-visible:outline-none focus-visible:bg-os-accent/15 focus-visible:text-os-accent [@media(hover:hover)_and_(pointer:fine)]:hover:bg-os-accent/10 [@media(hover:hover)_and_(pointer:fine)]:hover:text-os-accent"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">{app.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StartMenu;
