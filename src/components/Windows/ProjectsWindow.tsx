import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Calendar, Tag, Filter, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../../hooks/usePortfolioData';

const ProjectsWindow: React.FC = () => {
  const { t } = useTranslation();
  const { projects } = usePortfolioData();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...new Set(projects.map(p => p.category))];
  
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const selectedProjectData = selectedProject ? 
    projects.find(p => p.id === selectedProject) : null;

  return (
    <div className="h-full flex flex-col">
      {/* En-tête avec filtres */}
      <div className="p-4 border-b border-os-border space-y-4">
        <h2 className="text-xl font-semibold text-os-text flex items-center space-x-2">
          <span className="text-os-accent">&gt;</span>
          <span>{t('ui.projects.myProjects')}</span>
        </h2>
        
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-os-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder={t('ui.projects.searchProject')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
        
        {/* Filtres par catégorie */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-os-text-muted flex-shrink-0" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
                filter === category
                  ? 'bg-os-accent text-white'
                  : 'bg-os-lighter text-os-text-muted hover:bg-os-border'
              }`}
            >
              {category === 'all' ? t('ui.projects.all') : category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Liste des projets */}
        <div className="w-1/2 border-r border-os-border overflow-auto">
          <div className="space-y-2 p-4">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProject(project.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedProject === project.id
                    ? 'bg-os-accent/20 border-os-accent'
                    : 'bg-os-darker/30 border-os-border hover:border-os-accent/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-os-text">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-1 bg-os-warning/20 text-os-warning text-xs rounded-full">
                      {t('ui.projects.featured')}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-os-text-muted mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-os-text-subtle">
                    <Calendar className="w-3 h-3" />
                    <span>{project.startDate}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <Tag className="w-3 h-3 text-os-accent" />
                    <span className="text-os-accent">{project.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-8 text-os-text-muted">
                <p>{t('ui.projects.noProjectsFound')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Détail du projet sélectionné */}
        <div className="w-1/2 overflow-auto">
          <AnimatePresence mode="wait">
            {selectedProjectData ? (
              <motion.div
                key={selectedProjectData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 space-y-6"
              >
                {/* En-tête du projet */}
                <div>
                  <h3 className="text-2xl font-bold text-os-text mb-2">
                    {selectedProjectData.title}
                  </h3>
                  <p className="text-os-text-muted mb-4">
                    {selectedProjectData.longDescription}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedProjectData.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-os-accent/20 text-os-accent text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-os-darker/30 rounded-lg p-3 border border-os-border">
                    <div className="text-xs text-os-text-muted mb-1">{t('ui.projects.category')}</div>
                    <div className="text-sm text-os-text">{selectedProjectData.category}</div>
                  </div>
                  
                  <div className="bg-os-darker/30 rounded-lg p-3 border border-os-border">
                    <div className="text-xs text-os-text-muted mb-1">{t('ui.projects.period')}</div>
                    <div className="text-sm text-os-text">
                      {selectedProjectData.startDate} - {selectedProjectData.endDate || t('ui.projects.ongoing')}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {selectedProjectData.githubUrl && (
                    <a
                      href={selectedProjectData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-secondary w-full flex items-center justify-center space-x-2"
                    >
                      <Github className="w-4 h-4" />
                      <span>{t('ui.projects.viewSourceCode')}</span>
                    </a>
                  )}
                  
                  {selectedProjectData.liveUrl && (
                    <a
                      href={selectedProjectData.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-primary w-full flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{t('ui.projects.viewOnline')}</span>
                    </a>
                  )}
                </div>

                {/* Images du projet */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-os-text">{t('ui.projects.screenshots')}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedProjectData.images.map((image: string, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border border-os-border overflow-hidden bg-os-darker/30 p-1"
                      >
                        <img 
                          src={image} 
                          alt={`${selectedProjectData.title} - Image ${index + 1}`}
                          className="w-full object-contain max-h-[300px] mx-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-os-text-muted">
                <p>{t('ui.projects.selectProject')}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProjectsWindow;
