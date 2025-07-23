import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, ExternalLink, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../../hooks/usePortfolioData';

const ContactWindow: React.FC = () => {
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
    
    // Simulation d'envoi (remplacer par vraie logique d'envoi)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitStatus('success');
    setIsSubmitting(false);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitStatus('idle');
    }, 3000);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      // Use modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or insecure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('Fallback copy method failed');
        }
      }
      
      // Set success state
      setCopiedField(field);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
      
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      // Show error state briefly
      setCopiedField(`error-${field}`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const ContactItem: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: string; 
    href?: string;
    copyable?: boolean;
  }> = ({ icon, label, value, href, copyable = false }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-os-darker/30 rounded-lg p-4 border border-os-border"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 text-os-accent">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-os-text-muted">{label}</div>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-os-text hover:text-os-accent transition-colors flex items-center space-x-1"
            >
              <span className="truncate">{value}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          ) : (
            <div className="text-os-text">{value}</div>
          )}
        </div>
        {copyable && (
          <button
            onClick={() => copyToClipboard(value, label)}
            className="p-2 text-os-text-muted hover:text-os-accent transition-colors rounded-md hover:bg-os-border/50"
            title={t('ui.contact.copy')}
          >
            {copiedField === label ? (
              <Check className="w-4 h-4 text-os-success" />
            ) : copiedField?.startsWith('error-') && copiedField.endsWith(label) ? (
              <Copy className="w-4 h-4 text-os-error" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Informations de contact */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-os-text flex items-center space-x-2 mb-6">
              <span className="text-os-accent">&gt;</span>
              <span>{t('ui.contact.contactInformation')}</span>
            </h2>
            
            <div className="space-y-4">
              <ContactItem
                icon={<Mail className="w-5 h-5" />}
                label={t('ui.contact.email')}
                value={contact.email}
                href={`mailto:${contact.email}`}
                copyable
              />
              
              {contact.phone && (
                <ContactItem
                  icon={<Phone className="w-5 h-5" />}
                  label={t('ui.contact.phone')}
                  value={contact.phone}
                  href={`tel:${contact.phone}`}
                  copyable
                />
              )}
              
              <ContactItem
                icon={<MapPin className="w-5 h-5" />}
                label={t('ui.contact.location')}
                value={contact.location}
                copyable
              />
            </div>
          </motion.div>

          {/* Liens sociaux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-os-text flex items-center space-x-2 mb-4">
              <span className="text-os-accent">&gt;</span>
              <span>{t('ui.contact.professionalLinks')}</span>
            </h3>
            
            <div className="space-y-4">
              {contact.linkedin && (
                <ContactItem
                  icon={<ExternalLink className="w-5 h-5" />}
                  label="LinkedIn"
                  value={t('ui.contact.viewProfile')}
                  href={contact.linkedin}
                />
              )}
              
              {contact.github && (
                <ContactItem
                  icon={<ExternalLink className="w-5 h-5" />}
                  label="GitHub"
                  value={t('ui.contact.viewProjects')}
                  href={contact.github}
                />
              )}
              
              {contact.website && (
                <ContactItem
                  icon={<ExternalLink className="w-5 h-5" />}
                  label={t('ui.contact.website')}
                  value={t('ui.contact.visit')}
                  href={contact.website}
                />
              )}
            </div>
          </motion.div>

          {/* Disponibilité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-os-success/10 border border-os-success/30 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-os-success mb-2">{t('ui.contact.availability')}</h3>
            <p className="text-os-text-muted">
              {portfolioData.personal.availability}
            </p>
          </motion.div>
        </div>

        {/* Formulaire de contact */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-os-text flex items-center space-x-2 mb-6">
              <span className="text-os-accent">&gt;</span>
              <span>{t('ui.contact.sendMessage')}</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-os-text mb-2">
                    {t('ui.contact.nameRequired')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder={t('ui.contact.yourName')}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-os-text mb-2">
                    {t('ui.contact.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder={t('ui.contact.enterEmail')}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-os-text mb-2">
                  {t('ui.contact.subjectRequired')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="input-field w-full"
                  placeholder={t('ui.contact.messageSubject')}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-os-text mb-2">
                  {t('ui.contact.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="input-field w-full resize-none"
                  placeholder={t('ui.contact.yourMessage')}
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                  submitStatus === 'success'
                    ? 'bg-os-success text-white'
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
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>{t('ui.contact.sending')}</span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('ui.contact.messageSentShort')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('ui.contact.sendMessageButton')}</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-os-darker/30 rounded-lg p-4 border border-os-border"
          >
            <p className="text-sm text-os-text-muted">
              <strong className="text-os-accent">{t('ui.contact.note')}</strong> {t('ui.contact.noteText')}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactWindow;
