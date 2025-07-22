import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../../hooks/usePortfolioData';

const ExperienceWindow: React.FC = () => {
  const { t } = useTranslation();
  const portfolioData = usePortfolioData();
  const { experience, education } = portfolioData;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-os-success/20 text-os-success';
      case 'part-time':
        return 'bg-os-warning/20 text-os-warning';
      case 'contract':
        return 'bg-os-accent/20 text-os-accent';
      case 'internship':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-os-text-muted/20 text-os-text-muted';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time':
        return t('ui.experience.fullTime');
      case 'part-time':
        return t('ui.experience.partTime');
      case 'contract':
        return t('ui.experience.contract');
      case 'internship':
        return t('ui.experience.internship');
      default:
        return type;
    }
  };

  return (
    <div className="h-full overflow-auto space-y-8">
      {/* Expérience professionnelle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-os-text flex items-center space-x-2 mb-6">
          <span className="text-os-accent">&gt;</span>
          <span>{t('ui.experience.professionalExperience')}</span>
        </h2>
        
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 pb-6"
            >
              {/* Timeline line */}
              {index < experience.length - 1 && (
                <div className="absolute left-2 top-8 w-0.5 h-full bg-os-border" />
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-4 h-4 bg-os-accent rounded-full border-2 border-os-dark" />
              
              <div className="bg-os-darker/30 rounded-lg p-6 border border-os-border ml-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-os-text">{exp.position}</h3>
                    <p className="text-os-accent font-medium">{exp.company}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(exp.type)}`}>
                      {getTypeLabel(exp.type)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-os-text-muted mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                </div>
                
                <p className="text-os-text-muted mb-4 leading-relaxed">
                  {exp.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-os-accent/20 text-os-accent text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Formation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-os-text flex items-center space-x-2 mb-6">
          <span className="text-os-accent">&gt;</span>
          <span>{t('ui.experience.education')}</span>
        </h2>
        
        <div className="space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="relative pl-8 pb-6"
            >
              {/* Timeline line */}
              {index < education.length - 1 && (
                <div className="absolute left-2 top-8 w-0.5 h-full bg-os-border" />
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-4 h-4 bg-os-success rounded-full border-2 border-os-dark" />
              
              <div className="bg-os-darker/30 rounded-lg p-6 border border-os-border ml-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-os-text">{edu.degree}</h3>
                    <p className="text-os-success font-medium">{edu.institution}</p>
                    <p className="text-sm text-os-text-muted">{edu.field}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-os-text-muted mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{edu.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{edu.location}</span>
                  </div>
                </div>
                
                {edu.description && (
                  <p className="text-os-text-muted leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Certificatons et liens utiles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-os-darker/30 rounded-lg p-6 border border-os-border"
      >
        <h3 className="text-lg font-semibold text-os-text mb-4 flex items-center space-x-2">
          <span className="text-os-accent">&gt;</span>
          <span>{t('ui.experience.usefulLinks')}</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={portfolioData.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-os-light/50 rounded-lg border border-os-border hover:border-os-accent transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-os-accent" />
            <span className="text-os-text">{t('ui.experience.linkedinProfile')}</span>
          </a>
          
          <a
            href={portfolioData.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-os-light/50 rounded-lg border border-os-border hover:border-os-accent transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-os-accent" />
            <span className="text-os-text">{t('ui.experience.github')}</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ExperienceWindow;
