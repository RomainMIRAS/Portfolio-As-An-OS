import React from 'react';
import { motion } from 'framer-motion';

interface WallpaperProps {
  theme: 'light' | 'dark';
  wallpaper: string;
}

const Wallpaper: React.FC<WallpaperProps> = ({ theme }) => {
  const generateParticles = () => {
    return Array.from({ length: 50 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-os-accent/20 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        animate={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        transition={{
          duration: Math.random() * 20 + 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />
    ));
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Gradient de fond */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        theme === 'dark' 
          ? 'from-os-darker via-os-dark to-os-light' 
          : 'from-gray-100 via-gray-200 to-gray-300'
      }`} />

      {/* Particules animées */}
      <div className="absolute inset-0">
        {generateParticles()}
      </div>

      {/* Grille subtile */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(88, 166, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88, 166, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Overlay avec effet de scan lines */}
      <div className="absolute inset-0 scan-lines pointer-events-none" />

      {/* Logo en arrière-plan */}
      <div className="absolute bottom-10 right-10 opacity-5">
        <div className="text-9xl font-mono font-bold text-os-accent">
          &lt;/&gt;
        </div>
      </div>
    </div>
  );
};

export default Wallpaper;
