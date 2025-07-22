export interface WindowState {
  id: string;
  title: string;
  component: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  icon: string;
}

export interface AppConfig {
  id: string;
  name: string;
  shortName?: string; // Nom court pour l'affichage sur le bureau
  icon: string;
  component: string;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
  resizable: boolean;
  color?: string;
  showOnDesktop?: boolean; // Nouvelle propriété pour contrôler l'affichage sur le bureau
}

export interface NotificationState {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  duration?: number;
}

export interface OSState {
  windows: WindowState[];
  notifications: NotificationState[];
  isBootComplete: boolean;
  isShuttingDown: boolean;
  theme: 'light' | 'dark';
  wallpaper: string;
  time: Date;
  maxZIndex: number;
  desktopIconsVisible?: boolean; // Nouvelle propriété pour contrôler la visibilité des icônes
}

export interface TerminalCommand {
  command: string;
  description: string;
  action: (args: string[]) => string | Promise<string>;
  category?: string;
}

export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileSystemItem[];
  icon?: string;
  size?: number;
  modified?: Date;
}
