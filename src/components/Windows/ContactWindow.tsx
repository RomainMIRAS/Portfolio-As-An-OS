import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, ExternalLink, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { sendContactEmail } from '../../services/email';

interface ContactWindowProps {
  onAddNotification?: (n: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; duration?: number }) => void;
}

const ContactWindow: React.FC<ContactWindowProps> = ({ onAddNotification }) => {
  const { t } = useTranslation();
  const portfolioData = usePortfolioData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { contact } = portfolioData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const result = await sendContactEmail(formData);
      
      if (result.status === 'ok') {
        setSubmitStatus('success');
        
        // Notification OS
        onAddNotification?.({
          title: t('ui.contact.messageSent'),
          message: t('ui.contact.messageSentSuccess'),
          type: 'success',
          duration: 4000
        });
        
        // Reset form after success
        setTimeout(() => {
          setFormData({ name: '', email: '', subject: '', message: '' });
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        onAddNotification?.({
          title: t('ui.contact.messageError'),
          message: result.error || t('ui.contact.messageErrorDetails'),
          type: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus('error');
      onAddNotification?.({
        title: t('ui.contact.messageError'),
        message: t('ui.contact.messageErrorDetails'),
        type: 'error',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API clipboard
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopiedField(field);
          setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
          console.error('Erreur lors de la copie:', err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full overflow-auto p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Version empilée pour très petits écrans, côte à côte pour les plus grands */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3 sm:space-y-4 lg:space-y-6 order-2 2xl:order-1"
          >
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-os-text mb-4 sm:mb-6 flex items-center space-x-2">
                <span className="text-os-accent">&gt;</span>
                <span>{t('ui.contact.contactInformation')}</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Email */}
                <div className="bg-os-darker/50 rounded-lg p-3 sm:p-4 border border-os-lighter">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-os-accent flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-os-text-muted">{t('ui.contact.email')}</div>
                        <div className="text-sm sm:text-base text-os-text font-medium truncate">{contact.email}</div>
                      </div>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                      <button
                        onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                        className="p-1.5 sm:p-2 text-os-text-muted hover:text-os-accent transition-colors rounded-md hover:bg-os-lighter/30"
                        title="Envoyer un email"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(contact.email, 'email')}
                        className="p-1.5 sm:p-2 text-os-text-muted hover:text-os-accent transition-colors rounded-md hover:bg-os-lighter/30"
                        title={t('ui.contact.copy')}
                      >
                        {copiedField === 'email' ? (
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-os-success" />
                        ) : (
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Téléphone */}
                {contact.phone && (
                  <div className="bg-os-darker/50 rounded-lg p-3 sm:p-4 border border-os-lighter">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-os-accent flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm text-os-text-muted">{t('ui.contact.phone')}</div>
                          <div className="text-sm sm:text-base text-os-text font-medium truncate">{contact.phone}</div>
                        </div>
                      </div>
                      <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                        <button
                          onClick={() => window.open(`tel:${contact.phone}`, '_blank')}
                          className="p-1.5 sm:p-2 text-os-text-muted hover:text-os-accent transition-colors rounded-md hover:bg-os-lighter/30"
                          title="Appeler"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(contact.phone || '', 'phone')}
                          className="p-1.5 sm:p-2 text-os-text-muted hover:text-os-accent transition-colors rounded-md hover:bg-os-lighter/30"
                          title={t('ui.contact.copy')}
                        >
                          {copiedField === 'phone' ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-os-success" />
                          ) : (
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Localisation */}
                <div className="bg-os-darker/50 rounded-lg p-3 sm:p-4 border border-os-lighter">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-os-accent flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-os-text-muted">{t('ui.contact.location')}</div>
                        <div className="text-sm sm:text-base text-os-text font-medium truncate">{contact.location || portfolioData.personal.location}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(contact.location || portfolioData.personal.location, 'location')}
                      className="p-1.5 sm:p-2 text-os-text-muted hover:text-os-accent transition-colors rounded-md hover:bg-os-lighter/30 flex-shrink-0"
                      title={t('ui.contact.copy')}
                    >
                      {copiedField === 'location' ? (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-os-success" />
                      ) : (
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Liens professionnels */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-os-text mb-3 sm:mb-4 flex items-center space-x-2">
                <span className="text-os-accent">&gt;</span>
                <span>{t('ui.contact.professionalLinks')}</span>
              </h3>
              
              <div className="space-y-2 sm:space-y-3">
                {contact.linkedin && (
                  <motion.button
                    onClick={() => openLink(contact.linkedin!)}
                    whileHover={{ scale: 1.02 }}
                    className="w-full bg-os-darker/50 rounded-lg p-3 sm:p-4 border border-os-lighter hover:border-os-accent transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">in</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm sm:text-base text-os-text font-medium">LinkedIn</div>
                        <div className="text-xs sm:text-sm text-os-text-muted truncate">{t('ui.contact.viewProfile')}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-os-text-muted flex-shrink-0" />
                    </div>
                  </motion.button>
                )}

                {contact.github && (
                  <motion.button
                    onClick={() => openLink(contact.github!)}
                    whileHover={{ scale: 1.02 }}
                    className="w-full bg-os-darker/50 rounded-lg p-3 sm:p-4 border border-os-lighter hover:border-os-accent transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">gh</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm sm:text-base text-os-text font-medium">GitHub</div>
                        <div className="text-xs sm:text-sm text-os-text-muted truncate">{t('ui.contact.viewProjects')}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-os-text-muted flex-shrink-0" />
                    </div>
                  </motion.button>
                )}

                {contact.website && (
                  <motion.button
                    onClick={() => openLink(contact.website!)}
                    whileHover={{ scale: 1.02 }}
                    className="w-full bg-os-darker/50 rounded-lg p-3 sm:p-4 border border-os-lighter hover:border-os-accent transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-os-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">🌐</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm sm:text-base text-os-text font-medium">{t('ui.contact.website')}</div>
                        <div className="text-xs sm:text-sm text-os-text-muted truncate">{t('ui.contact.visit')}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-os-text-muted flex-shrink-0" />
                    </div>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Disponibilité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-os-success/10 border border-os-success/30 rounded-lg p-3 sm:p-4"
            >
              <h3 className="text-base sm:text-lg font-semibold text-os-success mb-2">{t('ui.contact.availability')}</h3>
              <p className="text-sm sm:text-base text-os-text-muted">
                {portfolioData.personal.availability}
              </p>
            </motion.div>
          </motion.div>

          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3 sm:space-y-4 lg:space-y-6 order-1 2xl:order-2"
          >
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-os-text mb-4 sm:mb-6 flex items-center space-x-2">
                <span className="text-os-accent">&gt;</span>
                <span>{t('ui.contact.sendMessage')}</span>
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-os-text mb-1 sm:mb-2">
                      {t('ui.contact.nameRequired')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full text-sm sm:text-base"
                      placeholder={t('ui.contact.yourName')}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-os-text mb-1 sm:mb-2">
                      {t('ui.contact.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full text-sm sm:text-base"
                      placeholder={t('ui.contact.enterEmail')}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-os-text mb-1 sm:mb-2">
                    {t('ui.contact.subjectRequired')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full text-sm sm:text-base"
                    placeholder={t('ui.contact.messageSubject')}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-os-text mb-1 sm:mb-2">
                    {t('ui.contact.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="input-field w-full resize-none text-sm sm:text-base sm:min-h-[100px]"
                    placeholder={t('ui.contact.yourMessage')}
                    disabled={isSubmitting}
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'success'}
                  whileHover={{ scale: submitStatus === 'success' || isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitStatus === 'success' || isSubmitting ? 1 : 0.98 }}
                  className={`w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-4 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${
                    submitStatus === 'success'
                      ? 'bg-os-success hover:bg-os-success text-white cursor-default'
                      : submitStatus === 'error'
                      ? 'bg-os-error hover:bg-os-error text-white'
                      : isSubmitting
                      ? 'bg-os-text-muted text-os-dark cursor-not-allowed'
                      : 'button-primary'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span className="text-sm sm:text-base">{t('ui.contact.sending')}</span>
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-sm sm:text-base">{t('ui.contact.messageSentShort')}</span>
                    </>
                  ) : submitStatus === 'error' ? (
                    <>
                      <span>❌</span>
                      <span className="text-sm sm:text-base">{t('ui.contact.messageError')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-sm sm:text-base">{t('ui.contact.sendMessageButton')}</span>
                    </>
                  )}
                </motion.button>

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-os-error/10 border border-os-error/30 rounded-lg p-2 sm:p-3"
                  >
                    <p className="text-xs sm:text-sm text-os-error text-center">
                      {t('ui.contact.messageError')}
                    </p>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-os-darker/50 rounded-lg p-3 sm:p-4 border border-os-lighter"
            >
              <p className="text-xs sm:text-sm text-os-text-muted">
                <strong className="text-os-accent">{t('ui.contact.note')}</strong> {t('ui.contact.noteText')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactWindow;
