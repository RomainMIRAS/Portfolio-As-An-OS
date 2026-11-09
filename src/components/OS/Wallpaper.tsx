import React, { useMemo } from 'react';

interface WallpaperProps {
  theme: 'light' | 'dark';
  wallpaper: string;
}

interface Particle {
  left: number; // %
  top: number;  // %
  dx: number;   // vw
  dy: number;   // vh
  duration: number;
  delay: number;
}

const PARTICLE_COUNT = 18;

// Générées une seule fois (module-level) : pas de re-randomisation au re-render
const PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  dx: (Math.random() - 0.5) * 40,
  dy: (Math.random() - 0.5) * 40,
  duration: Math.random() * 20 + 20,
  delay: -Math.random() * 20
}));

const WALLPAPER_CSS = `
@keyframes wallpaper-drift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(var(--dx), var(--dy), 0); }
}
.wallpaper-particle {
  animation: wallpaper-drift var(--dur) linear var(--delay) infinite alternate;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .wallpaper-particle { animation: none; }
}
`;

const Wallpaper: React.FC<WallpaperProps> = ({ theme }) => {
  const particles = useMemo(
    () =>
      PARTICLES.map((p, i) => (
        <div
          key={i}
          className="wallpaper-particle absolute w-1 h-1 bg-os-accent/20 rounded-full"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              '--dx': `${p.dx}vw`,
              '--dy': `${p.dy}vh`,
              '--dur': `${p.duration}s`,
              '--delay': `${p.delay}s`
            } as React.CSSProperties
          }
        />
      )),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden">
      <style>{WALLPAPER_CSS}</style>

      {/* Gradient de fond */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        theme === 'dark'
          ? 'from-os-darker via-os-dark to-os-light'
          : 'from-gray-100 via-gray-200 to-gray-300'
      }`} />

      {/* Particules (CSS transform uniquement) */}
      <div className="absolute inset-0" aria-hidden="true">
        {particles}
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

      {/* Logo en arrière-plan */}
      <div className="absolute bottom-10 right-10 opacity-5" aria-hidden="true">
        <div className="text-9xl font-mono font-bold text-os-accent">
          &lt;/&gt;
        </div>
      </div>
    </div>
  );
};

export default Wallpaper;
