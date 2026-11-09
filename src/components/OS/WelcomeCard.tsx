import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { AppConfig, WindowState } from '../../types/os';

interface WelcomeCardProps {
  availableApps: AppConfig[];
  windows: WindowState[];
  onOpenApp: (app: AppConfig) => void;
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Carte d'accueil : visible tant qu'aucune fenêtre n'est ouverte et non minimisée
const WelcomeCard: React.FC<WelcomeCardProps> = ({ availableApps, windows, onOpenApp }) => {
  const { t } = useTranslation();
  const { personal } = usePortfolioData();

  const hasVisibleWindow = windows.some(w => w.isOpen && !w.isMinimized);
  const projectsApp = useMemo(() => availableApps.find(a => a.id === 'projects'), [availableApps]);
  const contactApp = useMemo(() => availableApps.find(a => a.id === 'contact'), [availableApps]);

  return (
    // Conteneur sans pointer-events : seule la carte capte les clics (le menu contextuel du bureau reste intact)
    <div
      className="absolute inset-x-0 top-0 bottom-14 pointer-events-none flex items-end justify-center px-4 pb-6 md:items-center md:justify-end md:pr-[8vw] md:pb-0 max-[359px]:hidden [@media(max-width:767px)_and_(max-height:699px)]:hidden"
    >
      <AnimatePresence>
        {!hasVisibleWindow && (
          <motion.section
            aria-label={t('ui.welcome.label')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE_OUT } }}
            className="pointer-events-auto w-full max-w-sm rounded-2xl border border-os-border bg-os-darker/85 p-6 shadow-xl"
          >
            <p className="text-xs font-mono uppercase tracking-wider text-os-accent">
              {t('ui.welcome.greeting')}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-os-text">{personal.name}</h1>
            <p className="mt-1 text-sm text-os-text-muted">{personal.title}</p>

            <p className="mt-4 flex items-center gap-2 text-xs text-os-text-muted">
              <MapPin size={14} className="shrink-0 text-os-success" aria-hidden="true" />
              <span>{personal.location} · {personal.availability}</span>
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {projectsApp && (
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => onOpenApp(projectsApp)}
                >
                  {t('ui.welcome.viewProjects')}
                </button>
              )}
              {contactApp && (
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => onOpenApp(contactApp)}
                >
                  {t('ui.welcome.contactMe')}
                </button>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeCard;
