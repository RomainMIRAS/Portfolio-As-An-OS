import React from 'react';

interface WallpaperProps {
  theme: 'light' | 'dark';
  wallpaper: string;
}

// Grain statique (SVG feTurbulence en data URI), aucune animation
const GRAIN_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
      "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
      "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter>" +
      "<rect width='100%' height='100%' filter='url(#n)'/></svg>"
  );

// Fond entièrement statique : dégradés radiaux doux dans les tons os-*
const DARK_BACKGROUND = [
  'radial-gradient(ellipse 70% 60% at 85% 10%, rgba(88, 166, 255, 0.14), transparent 60%)',
  'radial-gradient(ellipse 60% 55% at 10% 95%, rgba(63, 185, 80, 0.07), transparent 65%)',
  'radial-gradient(ellipse 90% 70% at 50% 120%, rgba(33, 38, 45, 0.9), transparent 70%)',
  'linear-gradient(160deg, #010409 0%, #0d1117 55%, #161b22 100%)'
].join(', ');

const LIGHT_BACKGROUND =
  'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)';

const Wallpaper: React.FC<WallpaperProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND }}
      />

      {/* Grille subtile */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(88, 166, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88, 166, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px'
        }}
      />

      {/* Grain discret */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: '160px 160px' }}
      />
    </div>
  );
};

export default Wallpaper;
