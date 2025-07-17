# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Portfolio OS 🖥️

Un portfolio interactif et immersif simulant un système d'exploitation personnalisé. Une expérience unique qui présente mes compétences et projets dans une interface moderne et innovante.

![Portfolio OS](./public/screenshot.png)

## ✨ Fonctionnalités

### 🚀 Système d'exploitation simulé
- **Écran de démarrage animé** avec séquence de boot réaliste
- **Interface de bureau** avec fond d'écran dynamique et particules
- **Fenêtres draggables et redimensionnables** avec contrôles macOS
- **Barre des tâches interactive** avec dock d'applications
- **Système de notifications** en temps réel

### 📱 Applications intégrées
- **À propos** : Présentation personnelle avec stats
- **Projets** : Portfolio avec filtres et recherche
- **Expérience** : Timeline professionnelle et formation
- **Compétences** : Barres de progression avec niveaux
- **Terminal** : Interface en ligne de commande interactive
- **Contact** : Formulaire et informations de contact

### 🎨 Design et UX
- **Thème sombre/clair** avec transition fluide
- **Animations Framer Motion** pour une expérience fluide
- **Design responsive** adapté mobile et desktop
- **Effets visuels** : backdrop blur, particules, scan lines
- **Typographie** : Inter pour l'interface, JetBrains Mono pour le code

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript
- **Styles** : TailwindCSS avec thème personnalisé
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Build** : Vite
- **Deployment** : Compatible Vercel, Netlify, GitHub Pages

## 🚀 Installation et développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/votre-username/os-portfolio.git
cd os-portfolio

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Scripts disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
```

## 📁 Structure du projet

```
src/
├── components/
│   ├── OS/              # Composants système
│   │   ├── BootScreen.tsx
│   │   ├── WindowManager.tsx
│   │   ├── DraggableWindow.tsx
│   │   ├── Taskbar.tsx
│   │   ├── Wallpaper.tsx
│   │   └── NotificationCenter.tsx
│   └── Windows/         # Applications
│       ├── AboutWindow.tsx
│       ├── ProjectsWindow.tsx
│       ├── ExperienceWindow.tsx
│       ├── SkillsWindow.tsx
│       ├── TerminalWindow.tsx
│       └── ContactWindow.tsx
├── hooks/
│   └── useOSState.ts    # État global de l'OS
├── types/
│   └── os.ts           # Types TypeScript
├── data/
│   └── portfolio.ts    # Données du portfolio
└── styles/
    └── index.css       # Styles TailwindCSS
```

## ⚙️ Configuration

### Personnaliser les données
Modifier le fichier `src/data/portfolio.ts` pour adapter :
- Informations personnelles
- Liste des projets
- Expérience professionnelle
- Compétences techniques
- Coordonnées de contact

### Personnaliser le thème
Les couleurs sont définies dans `tailwind.config.js` :
```js
colors: {
  'os-dark': '#0d1117',
  'os-accent': '#58a6ff',
  // ... autres couleurs
}
```

### Ajouter des applications
1. Créer le composant dans `src/components/Windows/`
2. L'ajouter à `availableApps` dans `src/hooks/useOSState.ts`
3. Importer dans `WindowManager.tsx`

## 🚀 Déploiement

### Vercel (recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Netlify
```bash
# Build du projet
npm run build

# Déployer le dossier dist/
```

### GitHub Pages
1. Configurer le repository pour GitHub Pages
2. Action automatique avec le workflow fourni
3. Le site sera disponible sur `username.github.io/os-portfolio`

## 🎮 Terminal interactif

Le terminal supporte plusieurs commandes :
- `help` : Liste des commandes
- `about` : Informations personnelles
- `projects [numéro]` : Liste/détail des projets
- `skills [catégorie]` : Compétences par catégorie
- `experience` : Expérience professionnelle
- `contact` : Informations de contact
- `clear` : Effacer l'écran
- `ls`, `pwd`, `whoami` : Commandes Unix basiques

## 🔧 Développement

### Ajouter une nouvelle fenêtre
1. Créer le composant dans `components/Windows/`
2. Ajouter les types nécessaires
3. Configurer l'app dans `useOSState.ts`
4. Styliser avec les classes TailwindCSS

### Conventions de code
- Utiliser TypeScript strict
- Composants fonctionnels avec hooks
- Props bien typées avec interfaces
- Classes TailwindCSS pour le style
- Animations Framer Motion pour l'interactivité

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :
1. Fork le project
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

**Votre Nom** - [email@example.com](mailto:email@example.com)

Lien du projet : [https://github.com/votre-username/os-portfolio](https://github.com/votre-username/os-portfolio)

Demo live : [https://os-portfolio.vercel.app](https://os-portfolio.vercel.app)

---

⭐ N'hésitez pas à mettre une étoile si ce projet vous plaît !

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
