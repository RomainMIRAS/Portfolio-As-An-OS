import {
  User, FolderOpen, Briefcase, Code, Terminal, Mail, Settings, Power, Eye, EyeOff
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Map explicite (named imports) pour permettre le tree-shaking de lucide-react.
// Ajouter ici toute nouvelle icône référencée par `AppConfig.icon`.
export const appIcons: Record<string, LucideIcon> = {
  User,
  FolderOpen,
  Briefcase,
  Code,
  Terminal,
  Mail,
  Settings,
  Power,
  Eye,
  EyeOff
};

export const getAppIcon = (name: string): LucideIcon => appIcons[name] ?? Code;
