import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '../../data/portfolio';
import type { TerminalCommand } from '../../types/os';

const TerminalWindow: React.FC = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<Array<{ command: string; output: string; timestamp: Date }>>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPath] = useState('~/portfolio');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Commandes disponibles
  const commands: Record<string, TerminalCommand> = {
    help: {
      command: 'help',
      description: t('terminal.help.description'),
      action: () => {
        const commandList = Object.values(commands)
          .map(cmd => `  ${cmd.command.padEnd(15)} - ${cmd.description}`)
          .join('\n');
        return `${t('terminal.responses.availableCommands')}\n${commandList}\n\n${t('terminal.responses.useHelpCommand')}`;
      }
    },
    about: {
      command: 'about',
      description: t('terminal.about.description'),
      action: () => {
        return `${t('personal.name')} - ${t('personal.title')}\n\nBio: ${t('personal.bio')}\n\n${t('ui.location')}: ${t('personal.location')}\n${t('ui.status')}: ${t('personal.availability')}`;
      }
    },
    projects: {
      command: 'projects',
      description: t('terminal.projects.description'),
      action: (args) => {
        if (args.length === 0) {
          return portfolioData.projects
            .map((p, i) => `${i + 1}. ${p.title} (${p.category}) - ${p.description}`)
            .join('\n');
        }
        
        const projectIndex = parseInt(args[0]) - 1;
        const project = portfolioData.projects[projectIndex];
        
        if (!project) {
          return t('terminal.responses.projectNotFound', { number: args[0] });
        }
        
        return `${project.title}\n${'='.repeat(project.title.length)}\n\nDescription: ${project.longDescription}\n\nTechnologies: ${project.technologies.join(', ')}\n\nGitHub: ${project.githubUrl || 'N/A'}\nDemo: ${project.liveUrl || 'N/A'}`;
      }
    },
    skills: {
      command: 'skills',
      description: 'Affiche les compétences techniques',
      action: (args) => {
        if (args.length === 0) {
          return portfolioData.skills
            .map(cat => `${cat.category}:\n${cat.skills.map(s => `  - ${s.name} (${s.level}%)`).join('\n')}`)
            .join('\n\n');
        }
        
        const category = portfolioData.skills.find(c => 
          c.category.toLowerCase().includes(args[0].toLowerCase())
        );
        
        if (!category) {
          return `Catégorie '${args[0]}' non trouvée.`;
        }
        
        return `${category.category}:\n${category.skills.map(s => `  ${s.name.padEnd(15)} ${s.level}% (${s.years} ans)`).join('\n')}`;
      }
    },
    experience: {
      command: 'experience',
      description: 'Affiche l\'expérience professionnelle',
      action: () => {
        return portfolioData.experience
          .map(exp => `${exp.position} chez ${exp.company}\n  Période: ${exp.duration}\n  Lieu: ${exp.location}\n  Technologies: ${exp.technologies.join(', ')}\n`)
          .join('\n');
      }
    },
    contact: {
      command: 'contact',
      description: 'Affiche les informations de contact',
      action: () => {
        const { contact } = portfolioData;
        return `Informations de contact:\n\nEmail: ${contact.email}\nTéléphone: ${contact.phone || 'N/A'}\nLinkedIn: ${contact.linkedin || 'N/A'}\nGitHub: ${contact.github || 'N/A'}\nSite web: ${contact.website || 'N/A'}`;
      }
    },
    clear: {
      command: 'clear',
      description: 'Efface l\'écran du terminal',
      action: () => {
        setHistory([]);
        return '';
      }
    },
    ls: {
      command: 'ls',
      description: 'Liste le contenu du répertoire',
      action: () => {
        return 'about.txt\nprojects/\nskills.json\nexperience.md\ncontact.vcf\nREADME.md';
      }
    },
    pwd: {
      command: 'pwd',
      description: 'Affiche le répertoire courant',
      action: () => currentPath
    },
    whoami: {
      command: 'whoami',
      description: 'Affiche l\'utilisateur courant',
      action: () => portfolioData.personal.name.toLowerCase().replace(' ', '_')
    },
    date: {
      command: 'date',
      description: 'Affiche la date et l\'heure actuelles',
      action: () => new Date().toLocaleString('fr-FR')
    },
    echo: {
      command: 'echo',
      description: 'Affiche du texte',
      action: (args) => args.join(' ')
    }
  };

  // Traitement des commandes
  const processCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    setIsProcessing(true);
    
    const [cmd, ...args] = trimmedCommand.split(' ');
    const commandHandler = commands[cmd.toLowerCase()];
    
    let output: string;
    
    if (commandHandler) {
      try {
        output = await Promise.resolve(commandHandler.action(args));
      } catch (error) {
        output = `Erreur lors de l'exécution de '${cmd}': ${error}`;
      }
    } else {
      output = `Commande '${cmd}' non reconnue. Tapez 'help' pour voir les commandes disponibles.`;
    }

    const newEntry = {
      command: trimmedCommand,
      output,
      timestamp: new Date()
    };

    if (cmd.toLowerCase() !== 'clear') {
      setHistory(prev => [...prev, newEntry]);
    }
    
    setCurrentCommand('');
    setIsProcessing(false);
  };

  // Gestion des touches
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(currentCommand);
    }
  };

  // Auto-scroll vers le bas
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus automatique sur l'input
  useEffect(() => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  // Message de bienvenue
  useEffect(() => {
    const welcomeMessage = {
      command: '',
      output: `PortfolioOS Terminal v1.0.0\nBienvenue ! Tapez 'help' pour voir les commandes disponibles.\n`,
      timestamp: new Date()
    };
    setHistory([welcomeMessage]);
  }, []);

  return (
    <div className="h-full flex flex-col bg-os-darker text-os-text font-mono text-sm">
      {/* En-tête du terminal */}
      <div className="terminal-header">
        <div className="terminal-dot bg-os-error"></div>
        <div className="terminal-dot bg-os-warning"></div>
        <div className="terminal-dot bg-os-success"></div>
        <span className="ml-4 text-os-text-muted">portfolio@terminal: {currentPath}</span>
      </div>

      {/* Contenu du terminal */}
      <div 
        ref={terminalRef}
        className="terminal-content flex-1 overflow-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Historique des commandes */}
        {history.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-2"
          >
            {entry.command && (
              <div className="text-os-accent">
                <span className="text-os-success">$</span> {entry.command}
              </div>
            )}
            {entry.output && (
              <pre className="text-os-text-muted whitespace-pre-wrap mt-1 leading-relaxed">
                {entry.output}
              </pre>
            )}
          </motion.div>
        ))}

        {/* Ligne de commande active */}
        {!isProcessing && (
          <div className="flex items-center">
            <span className="text-os-success mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-none outline-none text-os-text"
              placeholder="Tapez une commande..."
              autoComplete="off"
              spellCheck={false}
            />
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="w-2 h-4 bg-os-accent ml-1"
            />
          </div>
        )}

        {/* Indicateur de traitement */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-os-warning"
          >
            <span className="mr-2">Traitement</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-os-warning border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </div>

      {/* Aide en bas */}
      <div className="px-4 py-2 border-t border-os-border text-xs text-os-text-subtle">
        Astuce: Utilisez 'help' pour voir toutes les commandes | 'clear' pour effacer l'écran
      </div>
    </div>
  );
};

export default TerminalWindow;
