import React from 'react';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { NotificationState } from '../../types/os';

interface NotificationCenterProps {
  notifications: NotificationState[];
  onRemove: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onRemove }) => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();

  // Swipe horizontal : fermeture si déplacement > 80px ou vélocité > 500
  const handleDragEnd = (id: string, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) onRemove(id);
  };

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
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout={!reduceMotion}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.6}
            onDragEnd={(_, info) => handleDragEnd(notification.id, info)}
            initial={{ opacity: 0, x: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.95, transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] } }}
            style={{ touchAction: 'pan-y' }}
            className={`mb-3 bg-os-light/90 backdrop-blur-md border border-os-border ${getBorderColor(notification.type)} border-l-4 rounded-lg shadow-2xl p-4 min-w-[min(20rem,calc(100vw-2rem))]`}
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
                  {new Date(notification.timestamp).toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}
                </p>
              </div>

              <button
                onClick={() => onRemove(notification.id)}
                aria-label={t('ui.a11y.dismissNotification')}
                className="flex-shrink-0 text-os-text-muted p-1 rounded-md transition-[background-color,color,transform] duration-150 ease-out-strong active:scale-95 [@media(hover:hover)_and_(pointer:fine)]:hover:text-os-text [@media(hover:hover)_and_(pointer:fine)]:hover:bg-os-border/50"
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
