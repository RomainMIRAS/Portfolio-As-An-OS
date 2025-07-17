import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square, Maximize } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0 
  });
  
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Gérer le déplacement de la fenêtre
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === headerRef.current || headerRef.current?.contains(e.target as Node)) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onFocus();
    }
  };

  // Gérer le redimensionnement
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    });
    onFocus();
  };

  // Gérer les mouvements de souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(globalThis.window.innerWidth - window.size.width, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(globalThis.window.innerHeight - window.size.height - 80, e.clientY - dragStart.y)); // -80 pour la taskbar
        
        onUpdatePosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        const newWidth = Math.max(300, resizeStart.width + deltaX);
        const newHeight = Math.max(200, resizeStart.height + deltaY);
        
        onUpdateSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, window.size, onUpdatePosition, onUpdateSize]);

  // Calculer les styles de la fenêtre
  const windowStyle = window.isMaximized
    ? { 
        left: 0, 
        top: 0, 
        width: '100vw', 
        height: 'calc(100vh - 64px)' // -64px pour la taskbar
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed pointer-events-auto"
      style={{
        ...windowStyle,
        zIndex: window.zIndex
      }}
      onMouseDown={() => onFocus()}
    >
      <div className="window h-full flex flex-col">
        {/* Barre de titre */}
        <div
          ref={headerRef}
          className="window-header cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-3">
            <div className="text-os-text font-medium">{window.title}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Bouton minimiser */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-6 h-6 rounded-full bg-os-warning/80 hover:bg-os-warning flex items-center justify-center transition-colors"
              title="Minimiser"
            >
              <Minus className="w-3 h-3 text-os-darker" />
            </button>
            
            {/* Bouton maximiser/restaurer */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="w-6 h-6 rounded-full bg-os-success/80 hover:bg-os-success flex items-center justify-center transition-colors"
              title={window.isMaximized ? "Restaurer" : "Maximiser"}
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
              className="w-6 h-6 rounded-full bg-os-error/80 hover:bg-os-error flex items-center justify-center transition-colors"
              title="Fermer"
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
        {!window.isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
          >
            <div className="absolute bottom-1 right-1 w-0 h-0 border-l-4 border-b-4 border-l-transparent border-b-os-border opacity-50" />
            <div className="absolute bottom-0.5 right-0.5 w-0 h-0 border-l-3 border-b-3 border-l-transparent border-b-os-border opacity-30" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DraggableWindow;
