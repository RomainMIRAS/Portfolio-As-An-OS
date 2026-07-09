# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server (VS Code task: "Démarrer le serveur de développement")
npm run build      # tsc -b (typecheck all tsconfig projects) then vite build
npm run lint       # ESLint over the repo (flat config: eslint.config.js)
npm run preview    # Serve the production build locally
```

There is no test runner configured. `npm run build` is the correctness gate — it runs `tsc -b` before bundling, so a type error fails the build. Note: `npm run deploy:local` references `scripts/deploy-local.sh`, which does not exist in the repo.

## Architecture

Single-page React 19 + TypeScript + Vite app that simulates a desktop OS as a portfolio. No router, no backend — everything renders client-side.

### App lifecycle (`src/App.tsx`)
`App` switches between three mutually exclusive screens driven by `osState` flags: `BootScreen` (until `isBootComplete`) → the desktop → `ShutdownScreen` (when `isShuttingDown`, which then calls `resetSystem` to reboot). The desktop composes `Wallpaper`, `DesktopIcons`, `WindowManager`, `Taskbar`, and `NotificationCenter`.

### OS state (`src/hooks/useOSState.ts`)
`useOSState` is the single source of truth for all runtime OS state (open windows, z-index stacking via `maxZIndex`, notifications, boot/shutdown, theme, clock). It's instantiated once in `App` and its callbacks are threaded down as props — there is no context/store. Window focus, minimize/maximize, drag position, and resize all mutate this state.

This file also exports a hardcoded `availableApps` array, but **`App` uses the localized version from `useLocalizedApps` instead** (see below). Keep the two app lists in sync when adding/removing apps.

### Windows are string-keyed components (`src/components/OS/WindowManager.tsx`)
Each `AppConfig` has a `component: string` (e.g. `"AboutWindow"`). `WindowManager` maps that string to the actual React component via a local `windowComponents` lookup object. **Adding a new app requires editing three places:** (1) add the `AppConfig` entry in `useLocalizedApps` (and `useOSState`'s `availableApps`), (2) create the component under `src/components/Windows/`, (3) register it in `WindowManager`'s `windowComponents` map. Props are generally not passed to windows except a conditional injection of `onAddNotification` into `ContactWindow`.

### Internationalization is the data layer (`src/i18n/`)
This is the most important thing to understand. All user-facing content — including portfolio data (projects, experience, education, bio) — lives in `src/i18n/locales/{en,fr}.json`, not in components. i18next is configured in `src/i18n/index.ts` (default `en`, browser language detection, localStorage cache).

- **`src/data/portfolio.ts`** (`portfolioConfig`) holds only the non-translatable, structural bits: ids, URLs, tech-stack arrays, image paths, dates, skill levels. It also defines all the `PortfolioData` TypeScript interfaces.
- **`src/hooks/usePortfolioData.ts`** merges `portfolioConfig` with translations, indexing into the locale JSON **by array position** (e.g. `t('projects.${index}.title')`). Because it's positional, the order of items in `portfolioConfig` must exactly match the order of the corresponding arrays/objects in every locale file. Adding a project means adding an entry in `portfolioConfig` AND a matching entry at the same index in both `en.json` and `fr.json`.
- **`useLocalizedApps`** does the same merge for window titles (`t('ui.<app>.title')`).

Components consume data through `usePortfolioData()` and `useTranslation()`, never by importing raw JSON.

### Terminal (`src/components/Windows/TerminalWindow.tsx`)
Interactive shell built from a `Record<string, TerminalCommand>` map; commands read from `usePortfolioData()` so their output is localized. Add a command by adding an entry to that map.

### Contact form (`src/services/email.ts`)
`sendContactEmail` wraps EmailJS. Requires env vars `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` (see `.env.example`); returns `{status:'error'}` if any are missing rather than throwing.

## Styling
TailwindCSS with a custom theme in `tailwind.config.js`. Use the semantic `os-*` color tokens (`os-dark`, `os-accent`, `os-text-muted`, etc.) and the custom animations (`animate-boot`, `animate-glow`, `animate-terminal-cursor`, ...) rather than hardcoding colors. Fonts: `font-system` (Inter) for UI, `font-mono` (JetBrains Mono) for code/terminal. Framer Motion drives window/screen transitions.

## Conventions
- `vite.config.ts` sets `base: './'` so the build works when served from any subpath — keep asset references relative.
- Comments and some UI defaults are in French; the codebase is bilingual. New user-facing strings must be added to both locale files.
- Strict TypeScript, functional components with typed prop interfaces.
