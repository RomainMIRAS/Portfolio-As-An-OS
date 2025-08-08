import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Star, Download } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';

const AboutWindow: React.FC = () => {
  const { t } = useTranslation();
  const portfolioData = usePortfolioData();

  // Fonction pour télécharger le CV
  const downloadCV = async () => {
    if (!portfolioData.personal.cvUrl) {
      console.warn('Aucune URL de CV configurée');
      return;
    }

    try {
      // Vérifier si le fichier existe
      const response = await fetch(portfolioData.personal.cvUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        console.error('Le fichier CV n\'est pas accessible');
        return;
      }

      // Créer le lien de téléchargement
      const link = document.createElement('a');
      link.href = portfolioData.personal.cvUrl;
      link.download = portfolioData.personal.cvUrl.split('/').pop() || 'CV_Romain_MIRAS.pdf';
      link.style.display = 'none';
      
      // Ajouter au DOM, cliquer et supprimer
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement du CV:', error);
    }
  };

  // Fonction pour mettre en évidence les termes spécifiés
  const highlightTerms = (text: string, terms: string[]) => {
    if (!terms.length) return text;
    
    // Créer une regex avec tous les termes à mettre en évidence
    const pattern = new RegExp(`(\\b(?:${terms.map(term => 
      term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Échapper les caractères spéciaux
    ).join('|')})\\b)`, 'gi');
    
    return text.split(pattern).map((part, index) => {
      const isHighlighted = terms.some(term => 
        part.toLowerCase() === term.toLowerCase()
      );
      
      return isHighlighted ? (
        <span key={index} className="text-os-accent font-medium">
          {part}
        </span>
      ) : part;
    });
  };

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-6">
        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start space-x-6 p-6 bg-os-darker/30 rounded-lg border border-os-border"
        >
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-os-accent/50 shadow-lg">
              {portfolioData.personal.avatar ? (
                <img 
                  src={portfolioData.personal.avatar} 
                  alt={portfolioData.personal.name}
                  className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    transform: 'scale(1.01)' 
                  }}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-os-accent to-os-accent-hover flex items-center justify-center text-4xl font-bold text-white">
                  {portfolioData.personal.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-os-text mb-2">{portfolioData.personal.name}</h2>
            <p className="text-lg text-os-accent mb-3">{portfolioData.personal.title}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-os-text-muted">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{portfolioData.personal.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-os-success" />
                <span>{portfolioData.personal.availability}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Biographie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-os-text flex items-center space-x-2">
            <span className="text-os-accent">&gt;</span>
            <span>{t('ui.about.overview')}</span>
          </h3>
          
          <div className="bg-os-darker/30 rounded-lg p-6 border border-os-border">
            <div className="text-os-text-muted leading-relaxed space-y-4">
              {portfolioData.personal.bio.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-justify">
                  {paragraph.split('\n').map((line, lineIndex, lines) => (
                    <span key={lineIndex}>
                      {highlightTerms(line, portfolioData.personal.highlightedTerms)}
                      {lineIndex < lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-os-darker/30 rounded-lg p-4 border border-os-border text-center">
            <div className="text-2xl font-bold text-os-accent mb-1">
              {portfolioData.projects.length}
            </div>
            <div className="text-sm text-os-text-muted">{t('ui.about.projects')}</div>
          </div>
          
          <div className="bg-os-darker/30 rounded-lg p-4 border border-os-border text-center">
            <div className="text-2xl font-bold text-os-success mb-1">
              {portfolioData.experience.length}
            </div>
            <div className="text-sm text-os-text-muted">{t('ui.about.experiences')}</div>
          </div>
          
          <div className="bg-os-darker/30 rounded-lg p-4 border border-os-border text-center">
            <div className="text-2xl font-bold text-os-warning mb-1">
              {portfolioData.skills.reduce((acc, category) => acc + category.skills.length, 0)}
            </div>
            <div className="text-sm text-os-text-muted">{t('ui.about.skills')}</div>
          </div>
        </motion.div>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex space-x-4"
        >
          <button 
            className={`button-primary flex items-center space-x-2 ${
              !portfolioData.personal.cvUrl ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={downloadCV}
            disabled={!portfolioData.personal.cvUrl}
            title={!portfolioData.personal.cvUrl ? 'CV non disponible' : 'Télécharger le CV'}
          >
            <Download className="w-4 h-4" />
            <span>{t('ui.about.downloadCv')}</span>
          </button>
          
          <button className="button-secondary">
            {t('ui.about.viewPortfolio')}
          </button>
        </motion.div>

        {/* Timeline rapide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-os-text flex items-center space-x-2">
            <span className="text-os-accent">&gt;</span>
            <span>{t('ui.about.recentJourney')}</span>
          </h3>
          
          <div className="space-y-3">
            {portfolioData.experience.slice(0, 2).map((exp) => (
              <div key={exp.id} className="flex items-start space-x-3 p-4 bg-os-darker/30 rounded-lg border border-os-border">
                <div className="flex-shrink-0 mt-1">
                  <Calendar className="w-4 h-4 text-os-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-os-text">{exp.position}</h4>
                  <p className="text-sm text-os-accent">{exp.company}</p>
                  <p className="text-xs text-os-text-muted mt-1">{exp.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutWindow;
