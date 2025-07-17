import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, Download } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';

const AboutWindow: React.FC = () => {
  const { personal } = portfolioData;

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
            <div className="w-24 h-24 bg-gradient-to-br from-os-accent to-os-accent-hover rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {personal.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-os-text mb-2">{personal.name}</h2>
            <p className="text-lg text-os-accent mb-3">{personal.title}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-os-text-muted">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{personal.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-os-success" />
                <span>{personal.availability}</span>
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
            <span>À propos de moi</span>
          </h3>
          
          <div className="bg-os-darker/30 rounded-lg p-6 border border-os-border">
            <p className="text-os-text-muted leading-relaxed">
              {personal.bio}
            </p>
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
            <div className="text-sm text-os-text-muted">Projets</div>
          </div>
          
          <div className="bg-os-darker/30 rounded-lg p-4 border border-os-border text-center">
            <div className="text-2xl font-bold text-os-success mb-1">
              {portfolioData.experience.length}
            </div>
            <div className="text-sm text-os-text-muted">Expériences</div>
          </div>
          
          <div className="bg-os-darker/30 rounded-lg p-4 border border-os-border text-center">
            <div className="text-2xl font-bold text-os-warning mb-1">
              {portfolioData.skills.reduce((acc, category) => acc + category.skills.length, 0)}
            </div>
            <div className="text-sm text-os-text-muted">Compétences</div>
          </div>
        </motion.div>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex space-x-4"
        >
          <button className="button-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Télécharger CV</span>
          </button>
          
          <button className="button-secondary">
            Voir Portfolio
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
            <span>Parcours récent</span>
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
