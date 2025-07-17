import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, HardDrive, Wifi, Battery } from 'lucide-react';

interface BootScreenProps {
  onBootComplete: () => void;
}

const bootMessages = [
  'Initializing system...',
  'Loading kernel modules...',
  'Starting system services...',
  'Mounting filesystems...',
  'Configuring network interfaces...',
  'Starting portfolio services...',
  'Loading user interface...',
  'System ready!'
];

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev < bootMessages.length - 1) {
          setProgress((prev + 1) / bootMessages.length * 100);
          return prev + 1;
        } else {
          setIsComplete(true);
          setTimeout(() => {
            onBootComplete();
          }, 1000);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onBootComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-os-darker flex flex-col items-center justify-center crt-effect"
      >
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
          className="mb-12"
        >
          <div className="relative">
            <Terminal className="w-24 h-24 text-os-accent glow-effect" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2"
            >
              <div className="w-28 h-28 border-2 border-os-accent/30 rounded-full border-t-os-accent"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* System Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-mono font-bold text-os-accent mb-8 text-shadow"
        >
          PortfolioOS
        </motion.h1>

        {/* Version Info */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-os-text-muted font-mono mb-12"
        >
          Version 1.0.0 - Developer Edition
        </motion.p>

        {/* Boot Messages */}
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-os-dark/50 border border-os-border rounded-lg p-6 font-mono text-sm">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-os-success rounded-full"></div>
              <div className="w-3 h-3 bg-os-warning rounded-full"></div>
              <div className="w-3 h-3 bg-os-error rounded-full"></div>
              <span className="text-os-text-muted ml-4">System Boot Log</span>
            </div>
            
            <div className="space-y-2 h-32 overflow-hidden">
              {bootMessages.slice(0, currentMessageIndex + 1).map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-2 ${
                    index === currentMessageIndex ? 'text-os-accent' : 'text-os-text-muted'
                  }`}
                >
                  <span className="text-os-success">[OK]</span>
                  <span>{message}</span>
                  {index === currentMessageIndex && !isComplete && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-2 h-4 bg-os-accent"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-os-darker border border-os-border rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-os-accent to-os-accent-hover"
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-os-text-muted font-mono">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex space-x-8 text-os-text-muted"
        >
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-os-accent" />
            <span className="font-mono text-sm">CPU: OK</span>
          </div>
          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-os-accent" />
            <span className="font-mono text-sm">Storage: OK</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-os-accent" />
            <span className="font-mono text-sm">Network: OK</span>
          </div>
          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4 text-os-accent" />
            <span className="font-mono text-sm">Power: OK</span>
          </div>
        </motion.div>

        {/* Loading Animation */}
        {!isComplete && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8"
          >
            <div className="w-8 h-8 border-2 border-os-accent/30 border-t-os-accent rounded-full animate-spin" />
          </motion.div>
        )}

        {/* Complete Message */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 text-os-success font-mono text-lg"
          >
            Boot Complete - Welcome!
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BootScreen;
