import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// État partagé au niveau module : après un premier tooltip visible, les suivants
// apparaissent instantanément pendant une courte fenêtre (comportement type barre d'outils).
const INITIAL_DELAY_MS = 300;
const WARM_WINDOW_MS = 400;
let warmUntil = 0;

interface DockTooltipProps {
  label: string;
  children: React.ReactNode;
}

const DockTooltip: React.FC<DockTooltipProps> = ({ label, children }) => {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [instant, setInstant] = useState(false);
  const timerRef = useRef<number | null>(null);
  const visibleRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const hide = useCallback(() => {
    clearTimer();
    if (visibleRef.current) {
      visibleRef.current = false;
      warmUntil = Date.now() + WARM_WINDOW_MS;
      setVisible(false);
    }
  }, []);

  const show = useCallback(() => {
    clearTimer();
    const reveal = (isInstant: boolean) => {
      visibleRef.current = true;
      setInstant(isInstant);
      setVisible(true);
    };
    if (Date.now() < warmUntil) {
      reveal(true);
    } else {
      timerRef.current = window.setTimeout(() => reveal(false), INITIAL_DELAY_MS);
    }
  }, []);

  useEffect(() => () => clearTimer(), []);

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={(e) => {
        // Hover précis uniquement (pas de tactile)
        if (e.pointerType === 'mouse') show();
      }}
      onPointerLeave={hide}
      onPointerDown={hide}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) show();
      }}
      onBlur={hide}
    >
      {children}
      {visible && (
        <motion.span
          role="presentation"
          aria-hidden="true"
          initial={instant ? false : { opacity: 0, y: reduceMotion ? 0 : 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={instant ? { duration: 0 } : { duration: 0.125, ease: 'easeOut' }}
          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] whitespace-nowrap rounded-md border border-os-border bg-os-light px-2 py-1 text-xs text-os-text shadow-lg"
        >
          {label}
        </motion.span>
      )}
    </span>
  );
};

export default DockTooltip;
