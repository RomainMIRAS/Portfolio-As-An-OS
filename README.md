# Portfolio OS 🖥️

An interactive and immersive portfolio simulating a custom operating system. A unique experience that showcases my skills and projects in a modern and innovative interface.

![Portfolio OS](./public/screenshot.png)

## ✨ Features

### 🚀 Simulated Operating System
- **Animated boot screen** with realistic boot sequence
- **Desktop interface** with dynamic wallpaper and particles
- **Draggable and resizable windows** with macOS controls
- **Interactive taskbar** with application dock
- **Real-time notification system**

### 📱 Integrated Applications
- **About** : Personal presentation with stats
- **Projects** : Portfolio with filters and search
- **Experience** : Professional timeline and education
- **Skills** : Progress bars with skill levels
- **Terminal** : Interactive command-line interface
- **Contact** : Contact form and information

### 🎨 Design and UX
- **Dark/light theme** with smooth transitions
- **Framer Motion animations** for fluid experience
- **Responsive design** adapted for mobile and desktop
- **Visual effects** : backdrop blur, particles, scan lines
- **Typography** : Inter for interface, JetBrains Mono for code

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript
- **Styles** : TailwindCSS with custom theme
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Build** : Vite
- **Deployment** : Compatible with Vercel, Netlify, GitHub Pages

## 🚀 Installation and Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/os-portfolio.git
cd os-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Lint code
```

## 📁 Project Structure

```
src/
├── components/
│   ├── OS/              # System components
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
│   └── useOSState.ts    # Global OS state
├── types/
│   └── os.ts           # TypeScript types
├── data/
│   └── portfolio.ts    # Portfolio data
└── styles/
  └── index.css       # TailwindCSS styles
```

## ⚙️ Configuration

### Customize Data
Edit the `src/data/portfolio.ts` file to adapt:
- Personal information
- Project list
- Professional experience
- Technical skills
- Contact details

### Customize Theme
Colors are defined in `tailwind.config.js`:
```js
colors: {
  'os-dark': '#0d1117',
  'os-accent': '#58a6ff',
  // ... other colors
}
```

### Add Applications
1. Create component in `src/components/Windows/`
2. Add to `availableApps` in `src/hooks/useOSState.ts`
3. Import in `WindowManager.tsx`

## 🎮 Interactive Terminal

The terminal supports several commands:
- `help` : List of commands
- `about` : Personal information
- `projects [number]` : List/detail projects
- `skills [category]` : Skills by category
- `experience` : Professional experience
- `contact` : Contact information
- `clear` : Clear screen
- `ls`, `pwd`, `whoami` : Basic Unix commands

## 🔧 Development

### Add a New Window
1. Create component in `components/Windows/`
2. Add necessary types
3. Configure app in `useOSState.ts`
4. Style with TailwindCSS classes

### Code Conventions
- Use strict TypeScript
- Functional components with hooks
- Well-typed props with interfaces
- TailwindCSS classes for styling
- Framer Motion animations for interactivity

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the project
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## 📞 Contact

**Your Name** - [romain.miras@gmail.com](mailto:romain.miras@gmail.com)

Project Link: [https://github.com/RomainMIRAS/Portfolio-As-An-OS](https://github.com/RomainMIRAS/Portfolio-As-An-OS)

Live Demo: [http://79.92.83.218/OS%20Portfolio](http://79.92.83.218/OS%20Portfolio)

---

⭐ Don't hesitate to star this project if you like it!