import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import type { AppConfig } from '../../types/os';

interface DesktopIconsProps {
  availableApps: AppConfig[];
  onOpenApp: (app: AppConfig) => void;
  visible?: boolean;
  onToggleDesktopIcons?: () => void;
}

const DesktopIcons: React.FC<DesktopIconsProps> = ({
  availableApps,
  onOpenApp,
  visible = true,
  onToggleDesktopIcons
}) => {
  const { t } = useTranslation();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  
  // Filtrer uniquement les applications configurées pour apparaître sur le bureau
  const desktopApps = availableApps.filter(app => app.showOnDesktop !== false);
  
  // Configuration de la grille d'icônes sur le bureau
  const gridPositions = [
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

  const handleDoubleClick = (app: AppConfig) => {
    onOpenApp(app);
  };

  // Fonction pour obtenir le nom d'affichage (court ou complet)
  const getDisplayName = (app: AppConfig) => {
    return app.shortName || app.name;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  if (!visible) {
    return (
      <div 
        className="absolute inset-0 cursor-default pointer-events-auto"
        onContextMenu={handleContextMenu}
        onClick={handleCloseContextMenu}
      >
        {/* Menu contextuel */}
        <AnimatePresence>
          {contextMenu && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={handleCloseContextMenu}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed z-50 bg-os-darker/95 backdrop-blur-md border border-os-light/20 rounded-lg shadow-xl min-w-48"
                style={{
                  left: contextMenu.x,
                  top: contextMenu.y,
                }}
              >
                <div className="p-1">
                  <button
                    onClick={() => {
                      onToggleDesktopIcons?.();
                      handleCloseContextMenu();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md flex items-center gap-2"
                  >
                    <Icons.Eye size={16} />
                    {t('ui.desktop.showIcons')}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div 
      className="absolute inset-0 p-4 pointer-events-auto"
      onContextMenu={handleContextMenu}
      onClick={handleCloseContextMenu}
    >
      {desktopApps.map((app, index) => {
        const position = gridPositions[index];
        const IconComponent = Icons[app.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; size?: number }> | undefined;
        
        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.3,
              type: "spring",
              stiffness: 200 
            }}
            className="absolute pointer-events-auto group cursor-pointer"
            style={{
              top: `${20 + position.row * ICON_SPACING.vertical}px`,
              left: `${20 + position.col * ICON_SPACING.horizontal}px`
            }}
            onDoubleClick={() => handleDoubleClick(app)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Icône */}
            <div className="flex flex-col items-center space-y-2 select-none">
              <motion.div
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Ombre de l'icône */}
                <div 
                  className="absolute inset-0 rounded-2xl blur-sm opacity-20"
                  style={{ backgroundColor: app.color || '#58a6ff' }}
                />
                
                {/* Container de l'icône */}
                <div 
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${app.color || '#58a6ff'}40, ${app.color || '#58a6ff'}20)` 
                  }}
                >
                  <IconComponent 
                    size={28} 
                    className="text-white drop-shadow-sm" 
                  />
                </div>

                {/* Effet de surbrillance au hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/40 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Label */}
              <motion.div
                className="w-28 flex justify-center" // Largeur augmentée de w-24 à w-28
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                <span
                  className="text-white text-sm font-medium px-2 py-1 rounded-md bg-black/30 backdrop-blur-sm border border-white/20 text-center leading-tight break-words hyphens-auto"
                  style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    fontSize: '11px',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '105px' // Largeur augmentée de 90px à 105px
                  }}
                  title={app.name} // Affiche le nom complet au survol
                >
                  {getDisplayName(app)}
                </span>
              </motion.div>
            </div>

            {/* Tooltip au hover */}
            <motion.div
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-os-darker/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md border border-os-light/20 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50"
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {t('ui.desktop.doubleClickToOpen', { appName: app.name })}
              {/* Flèche */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-os-darker/90" />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Menu contextuel */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={handleCloseContextMenu}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed z-50 bg-os-darker/95 backdrop-blur-md border border-os-light/20 rounded-lg shadow-xl min-w-48"
              style={{
                left: contextMenu.x,
                top: contextMenu.y,
              }}
            >
              <div className="p-1">
                <button
                  onClick={() => {
                    onToggleDesktopIcons?.();
                    handleCloseContextMenu();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md flex items-center gap-2"
                >
                  <Icons.EyeOff size={16} />
                  {t('ui.desktop.hideIcons')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopIcons;
