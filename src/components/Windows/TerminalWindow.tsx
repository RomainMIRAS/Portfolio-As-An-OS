import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { TerminalCommand } from '../../types/os';

const TerminalWindow: React.FC = () => {
  const { t, i18n } = useTranslation();
  const portfolioData = usePortfolioData();
  const [history, setHistory] = useState<Array<{ command: string; output: string; timestamp: Date }>>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPath] = useState('~/portfolio');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Commandes disponibles
  const commands: Record<string, TerminalCommand> = useMemo(() => ({
    help: {
      command: 'help',
      description: t('terminal.commands.help', 'Show list of available commands'),
      action: () => {
        const commandList = Object.values(commands)
          .map(cmd => `  ${cmd.command.padEnd(15)} - ${cmd.description}`)
          .join('\n');
        return `${t('terminal.commandsAvailable', 'Available commands:')}\n${commandList}\n\n${t('terminal.useHelpCommand', 'Use \'help <command>\' for more information.')}`;
      }
    },
    about: {
      command: 'about',
      description: t('terminal.commands.about', 'Display personal information'),
      action: () => {
        const { personal } = portfolioData;
        return `${personal.name} - ${personal.title}\n\nBio: ${personal.bio}\n\n${t('terminal.location', 'Location')}: ${personal.location}\n${t('personal.availability', 'Availability')}: ${personal.availability}`;
      }
    },
    projects: {
      command: 'projects',
      description: t('terminal.commands.projects', 'List projects'),
      action: (args) => {
        if (args.length === 0) {
          return portfolioData.projects
            .map((p, i) => `${i + 1}. ${p.title} (${p.category}) - ${p.description}`)
            .join('\n');
        }
        
        const projectIndex = parseInt(args[0]) - 1;
        const project = portfolioData.projects[projectIndex];
        
        if (!project) {
          return t('terminal.projectNotFound', 'Project #{{number}} not found. Use \'projects\' to see the list.', { number: args[0] });
        }
        
        return `${project.title}\n${'='.repeat(project.title.length)}\n\n${t('projects.description', 'Description')}: ${project.longDescription}\n\n${t('terminal.technologies', 'Technologies')}: ${project.technologies.join(', ')}\n\n${t('terminal.github', 'GitHub')}: ${project.githubUrl || t('terminal.notAvailable', 'N/A')}\n${t('terminal.demo', 'Demo')}: ${project.liveUrl || t('terminal.notAvailable', 'N/A')}`;
      }
    },
    skills: {
      command: 'skills',
      description: t('terminal.commands.skills', 'Display technical skills'),
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
          return t('terminal.categoryNotFound', 'Category \'{{category}}\' not found.', { category: args[0] });
        }
        
        return `${category.category}:\n${category.skills.map(s => `  ${s.name.padEnd(15)} ${s.level}% (${s.years} ${t('skills.years', '{{count}} year', { count: s.years })})`).join('\n')}`;
      }
    },
    experience: {
      command: 'experience',
      description: t('terminal.commands.experience', 'Display professional experience'),
      action: () => {
        return portfolioData.experience
          .map(exp => `${exp.position} ${t('experience.at', 'at')} ${exp.company}\n  ${t('terminal.period', 'Period')}: ${exp.duration}\n  ${t('terminal.location', 'Location')}: ${exp.location}\n  ${t('terminal.technologies', 'Technologies')}: ${exp.technologies.join(', ')}\n`)
          .join('\n');
      }
    },
    contact: {
      command: 'contact',
      description: t('terminal.commands.contact', 'Display contact information'),
      action: () => {
        const { contact } = portfolioData;
        return `${t('terminal.contactInfo', 'Contact Information:')}\n\nEmail: ${contact.email}\n${t('contact.phone', 'Phone')}: ${contact.phone || t('terminal.notAvailable', 'N/A')}\nLinkedIn: ${contact.linkedin || t('terminal.notAvailable', 'N/A')}\nGitHub: ${contact.github || t('terminal.notAvailable', 'N/A')}\n${t('contact.website', 'Website')}: ${contact.website || t('terminal.notAvailable', 'N/A')}`;
      }
    },
    clear: {
      command: 'clear',
      description: t('terminal.commands.clear', 'Clear terminal screen'),
      action: () => {
        setHistory([]);
        return '';
      }
    },
    ls: {
      command: 'ls',
      description: t('terminal.commands.ls', 'List directory contents'),
      action: () => {
        return 'about.txt\nprojects/\nskills.json\nexperience.md\ncontact.vcf\nREADME.md';
      }
    },
    pwd: {
      command: 'pwd',
      description: t('terminal.commands.pwd', 'Display current directory'),
      action: () => currentPath
    },
    whoami: {
      command: 'whoami',
      description: t('terminal.commands.whoami', 'Display current user'),
      action: () => portfolioData.personal.name.toLowerCase().replace(' ', '_')
    },
    date: {
      command: 'date',
      description: t('terminal.commands.date', 'Display current date and time'),
      action: () => new Date().toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')
    },
    echo: {
      command: 'echo',
      description: t('terminal.commands.echo', 'Display text'),
      action: (args) => args.join(' ')
    }
  }), [t, portfolioData, currentPath, i18n.language, setHistory]);

  // Traitement des commandes
  const processCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    setIsProcessing(true);
    
    const [cmd, ...args] = trimmedCommand.split(' ');
    const commandHandler = commands[cmd.toLowerCase()];
    
    let output: string;
    
    if (commandHandler && Object.keys(commands).length > 0) {
      try {
        output = await Promise.resolve(commandHandler.action(args));
      } catch (error) {
        output = t('terminal.executionError', 'Error executing \'{{command}}\': {{error}}', { command: cmd, error: String(error) });
      }
    } else {
      output = t('terminal.commandNotFound', 'Command \'{{command}}\' not recognized. Type \'help\' to see available commands.', { command: cmd });
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
      output: t('terminal.welcome', 'PortfolioOS Terminal v1.0.0\nWelcome! Type \'help\' to see available commands.\n'),
      timestamp: new Date()
    };
    setHistory([welcomeMessage]);
  }, [t, i18n.language]); // Re-run when language changes

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
              placeholder={t('terminal.prompt', 'Type a command...')}
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
            <span className="mr-2">{t('terminal.processing', 'Processing')}</span>
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
        {t('terminal.helpFooter', 'Tip: Use \'help\' to see all commands | \'clear\' to clear screen')}
      </div>
    </div>
  );
};

export default TerminalWindow;
