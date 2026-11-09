import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { appIcons } from './appIcons';
import type { AppConfig } from '../../types/os';

interface DesktopIconsProps {
  availableApps: AppConfig[];
  onOpenApp: (app: AppConfig) => void;
  visible?: boolean;
  onToggleDesktopIcons?: () => void;
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Configuration de la grille d'icônes sur le bureau
const GRID_POSITIONS = [
  { row: 0, col: 0 }, // Coin supérieur gauche
  { row: 1, col: 0 },
  { row: 2, col: 0 },
  { row: 3, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 1 },
  { row: 2, col: 1 },
  { row: 3, col: 1 }
];

const ICON_SPACING = {
  horizontal: 130, // Encore plus d'espace pour les noms plus longs
  vertical: 140    // Plus d'espace vertical aussi
};

interface DesktopContextMenuProps {
  position: { x: number; y: number } | null;
  label: string;
  icon: React.ReactNode;
  onAction: () => void;
  onClose: () => void;
}

const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({ position, label, icon, onAction, onClose }) => (
  <AnimatePresence>
    {position && (
      <>
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
          className="fixed z-50 bg-os-darker/95 backdrop-blur-md border border-os-light/20 rounded-lg shadow-xl min-w-48 origin-top-left"
          style={{ left: position.x, top: position.y }}
          role="menu"
        >
          <div className="p-1">
            <button
              role="menuitem"
              autoFocus
              onClick={() => {
                onAction();
                onClose();
              }}
              className="w-full text-left px-3 py-2 text-sm text-white rounded-md flex items-center gap-2 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/10 focus-visible:outline-none focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-os-accent"
            >
              {icon}
              {label}
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const DesktopIcons: React.FC<DesktopIconsProps> = ({
  availableApps,
  onOpenApp,
  visible = true,
  onToggleDesktopIcons
}) => {
  const { t } = useTranslation();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Filtrer uniquement les applications configurées pour apparaître sur le bureau
  const desktopApps = useMemo(
    () => availableApps.filter(app => app.showOnDesktop !== false),
    [availableApps]
  );

  const handleIconClick = useCallback((e: React.MouseEvent, app: AppConfig) => {
    e.stopPropagation();
    onOpenApp(app);
  }, [onOpenApp]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleToggle = useCallback(() => {
    onToggleDesktopIcons?.();
  }, [onToggleDesktopIcons]);

  return (
    <div
      className={`absolute inset-0 pointer-events-auto ${visible ? 'p-4' : 'cursor-default'}`}
      onContextMenu={handleContextMenu}
      onClick={handleCloseContextMenu}
    >
      {visible && desktopApps.map((app, index) => {
        const position = GRID_POSITIONS[index];
        if (!position) return null;

        return (
          <DesktopIconItem
            key={app.id}
            app={app}
            index={index}
            top={20 + position.row * ICON_SPACING.vertical}
            left={20 + position.col * ICON_SPACING.horizontal}
            onClick={handleIconClick}
          />
        );
      })}

      <DesktopContextMenu
        position={contextMenu}
        label={visible ? t('ui.desktop.hideIcons') : t('ui.desktop.showIcons')}
        icon={visible ? <EyeOff size={16} /> : <Eye size={16} />}
        onAction={handleToggle}
        onClose={handleCloseContextMenu}
      />
    </div>
  );
};

interface DesktopIconItemProps {
  app: AppConfig;
  index: number;
  top: number;
  left: number;
  onClick: (e: React.MouseEvent, app: AppConfig) => void;
}

const DesktopIconItem: React.FC<DesktopIconItemProps> = React.memo(({ app, index, top, left, onClick }) => {
  const { t } = useTranslation();
  const IconComponent = appIcons[app.icon];

  if (!IconComponent) return null;

  // Nom d'affichage (court si disponible, sinon complet)
  const displayName = app.shortName || app.name;
  const color = app.color || '#58a6ff';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.035, duration: 0.2, ease: EASE_OUT }}
      className="absolute"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      {/* Les <button> natifs gèrent Enter / Espace */}
      <button
        type="button"
        aria-label={app.name}
        onClick={(e) => onClick(e, app)}
        className="group relative cursor-pointer select-none rounded-xl p-1 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="relative transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-0.5">
            {/* Ombre de l'icône */}
            <div
              className="absolute inset-0 rounded-2xl blur-sm opacity-20"
              style={{ backgroundColor: color }}
            />

            {/* Container de l'icône */}
            <div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)` }}
            >
              <IconComponent size={28} className="text-white drop-shadow-sm" aria-hidden="true" />
            </div>

            {/* Surbrillance au hover / focus */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/40 opacity-0 transition-opacity duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 group-focus-visible:opacity-100" />
          </div>

          {/* Label */}
          <div className="w-28 flex justify-center opacity-80 transition-opacity duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 group-focus-visible:opacity-100">
            <span
              className="text-white text-sm font-medium px-2 py-1 rounded-md bg-black/30 backdrop-blur-sm border border-white/20 text-center leading-tight break-words hyphens-auto"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                fontSize: '11px',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '105px'
              }}
              title={app.name}
            >
              {displayName}
            </span>
          </div>
        </div>

        {/* Tooltip (hover précis ou focus clavier) */}
        <div
          aria-hidden="true"
          className="absolute -top-12 left-1/2 -translate-x-1/2 translate-y-1 bg-os-darker/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md border border-os-light/20 whitespace-nowrap opacity-0 pointer-events-none z-50 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
        >
          {t('ui.desktop.clickToOpen', { appName: app.name })}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-os-darker/90" />
        </div>
      </button>
    </motion.div>
  );
});

DesktopIconItem.displayName = 'DesktopIconItem';

export default DesktopIcons;
