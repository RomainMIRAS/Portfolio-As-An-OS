import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import type { NotificationState } from '../../types/os';

interface NotificationCenterProps {
  notifications: NotificationState[];
  onRemove: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onRemove }) => {
  const getIcon = (type: NotificationState['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-os-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-os-error" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-os-warning" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-os-accent" />;
    }
  };

  const getBorderColor = (type: NotificationState['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-os-success';
      case 'error':
        return 'border-l-os-error';
      case 'warning':
        return 'border-l-os-warning';
      case 'info':
      default:
        return 'border-l-os-accent';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-os-light/90 backdrop-blur-md border border-os-border ${getBorderColor(notification.type)} border-l-4 rounded-lg shadow-2xl p-4 min-w-80`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-os-text mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-os-text-muted leading-relaxed">
                  {notification.message}
                </p>
                <p className="text-xs text-os-text-subtle mt-2">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>

              <button
                onClick={() => onRemove(notification.id)}
                className="flex-shrink-0 text-os-text-muted hover:text-os-text transition-colors p-1 rounded-md hover:bg-os-border/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
