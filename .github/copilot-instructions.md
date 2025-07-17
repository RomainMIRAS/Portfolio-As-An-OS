<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Portfolio OS - Instructions Copilot

Ce projet est un portfolio immersif simulant un système d'exploitation personnalisé développé avec React, TypeScript, TailwindCSS et Framer Motion.

## Architecture du projet

- **React + TypeScript** : Framework principal avec typage strict
- **TailwindCSS** : Système de styles avec thème personnalisé OS
- **Framer Motion** : Animations et transitions fluides
- **Lucide React** : Icônes vectorielles cohérentes

## Structure des composants

### OS/ (Composants système)
- `BootScreen` : Écran de démarrage animé
- `WindowManager` : Gestionnaire de fenêtres draggables
- `DraggableWindow` : Fenêtre individuelle avec contrôles
- `Taskbar` : Barre des tâches avec dock d'applications
- `Wallpaper` : Fond d'écran animé avec particules
- `NotificationCenter` : Système de notifications

### Windows/ (Applications)
- `AboutWindow` : Informations personnelles
- `ProjectsWindow` : Portfolio de projets avec filtres
- `ExperienceWindow` : Expérience professionnelle et formation
- `SkillsWindow` : Compétences techniques avec niveaux
- `TerminalWindow` : Terminal interactif avec commandes
- `ContactWindow` : Formulaire de contact et infos

## Conventions de style

### Couleurs OS personnalisées
- `os-dark`, `os-darker`, `os-light`, `os-lighter` : Palette de gris
- `os-accent`, `os-accent-hover` : Bleu principal
- `os-success`, `os-warning`, `os-error` : Couleurs d'état
- `os-text`, `os-text-muted`, `os-text-subtle` : Textes

### Classes utilitaires
- `.window` : Style de fenêtre avec backdrop blur
- `.window-header` : En-tête avec contrôles macOS
- `.button-primary`, `.button-secondary` : Boutons cohérents
- `.dock-item` : Éléments de la barre des tâches
- `.terminal` : Style terminal avec dots colorés

## Gestion d'état

Le hook `useOSState` centralise :
- Fenêtres ouvertes avec position/taille
- Notifications système
- Thème clair/sombre
- État de boot et horloge système

## Animations

Utiliser Framer Motion pour :
- Transitions d'entrée/sortie des fenêtres
- Effets de hover sur les éléments interactifs
- Animations de boot et notifications
- Particules de fond d'écran

## Types TypeScript

Tous les types sont définis dans `types/os.ts` :
- `WindowState` : État d'une fenêtre
- `AppConfig` : Configuration d'application
- `OSState` : État global du système
- `NotificationState` : État des notifications

## Données du portfolio

Le fichier `data/portfolio.ts` contient toutes les données :
- Informations personnelles
- Projets avec technologies et liens
- Expérience professionnelle
- Compétences avec niveaux
- Informations de contact

## Responsive Design

Le design s'adapte sur mobile avec :
- Fenêtres en plein écran sur petits écrans
- Taskbar simplifiée
- Interactions tactiles optimisées

## Accessibilité

Respecter les standards :
- Contraste de couleurs suffisant
- Navigation au clavier
- Labels ARIA appropriés
- Focus visible sur les éléments interactifs
