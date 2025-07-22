import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import type { AppConfig } from '../types/os';

export const useLocalizedApps = (): AppConfig[] => {
  const { t } = useTranslation();

  return useMemo(() => [
    {
      id: 'about',
      name: t('ui.about.title'),
      icon: 'User',
      component: 'AboutWindow',
      defaultSize: { width: 600, height: 500 },
      defaultPosition: { x: 100, y: 100 },
      resizable: true,
      color: '#58a6ff',
      showOnDesktop: true
    },
    {
      id: 'projects',
      name: t('ui.projects.title'),
      icon: 'FolderOpen',
      component: 'ProjectsWindow',
      defaultSize: { width: 800, height: 600 },
      defaultPosition: { x: 150, y: 50 },
      resizable: true,
      color: '#3fb950',
      showOnDesktop: true
    },
    {
      id: 'experience',
      name: t('ui.experience.title'),
      icon: 'Briefcase',
      component: 'ExperienceWindow',
      defaultSize: { width: 700, height: 550 },
      defaultPosition: { x: 200, y: 80 },
      resizable: true,
      color: '#d29922',
      showOnDesktop: true
    },
    {
      id: 'skills',
      name: t('ui.skills.title'),
      icon: 'Code',
      component: 'SkillsWindow',
      defaultSize: { width: 650, height: 500 },
      defaultPosition: { x: 250, y: 120 },
      resizable: true,
      color: '#f85149',
      showOnDesktop: true
    },
    {
      id: 'terminal',
      name: t('ui.terminal.title'),
      icon: 'Terminal',
      component: 'TerminalWindow',
      defaultSize: { width: 700, height: 400 },
      defaultPosition: { x: 300, y: 150 },
      resizable: true,
      color: '#8b949e',
      showOnDesktop: false
    },
    {
      id: 'contact',
      name: t('ui.contact.title'),
      icon: 'Mail',
      component: 'ContactWindow',
      defaultSize: { width: 600, height: 500 },
      defaultPosition: { x: 350, y: 200 },
      resizable: true,
      color: '#a5a5a5',
      showOnDesktop: true
    }
  ], [t]);
};