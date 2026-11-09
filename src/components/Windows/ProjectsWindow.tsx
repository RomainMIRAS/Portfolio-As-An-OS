import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Github, ExternalLink, Calendar, Tag, Filter, Search, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../../hooks/usePortfolioData';

// Largeur (px) sous laquelle on empile liste/détail au lieu de deux colonnes
const NARROW_BREAKPOINT = 640;
const EASE = [0.23, 1, 0.32, 1] as const;

const ProjectsWindow: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { projects } = usePortfolioData();

  const formatDate = (dateStr: string): string => {
    const [year, month] = dateStr.split('-').map(Number);
    return new Intl.DateTimeFormat(i18n.language, { month: 'short', year: 'numeric' }).format(new Date(year, month - 1));
  };

  const formatPeriod = (startDate: string, endDate?: string): string => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : t('ui.projects.ongoing');
    return `${start} — ${end}`;
  };
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const prefersReducedMotion = useReducedMotion();

  // Mesure la largeur de la fenêtre (pas du viewport) pour le responsive
  const rootRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setIsNarrow(el.clientWidth < NARROW_BREAKPOINT);
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? el.clientWidth;
      setIsNarrow(width < NARROW_BREAKPOINT);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Remonte le détail en haut quand on change de projet
  useEffect(() => {
    detailRef.current?.scrollTo({ top: 0 });
  }, [selectedProject]);

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
    <div ref={rootRef} className="h-full flex flex-col">
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
            aria-label={t('ui.projects.searchLabel')}
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
              type="button"
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 rounded-full text-sm transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent ${
                filter === category
                  ? 'bg-os-accent text-white'
                  : 'bg-os-lighter text-os-text-muted [@media(hover:hover)_and_(pointer:fine)]:hover:bg-os-border'
              }`}
            >
              {category === 'all' ? t('ui.projects.all') : category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Liste des projets (masquée en mode étroit quand un détail est ouvert) */}
        <div className={`${isNarrow ? (selectedProjectData ? 'hidden' : 'w-full') : 'w-1/2 border-r border-os-border'} overflow-auto`}>
          <div className="space-y-2 p-4">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                aria-pressed={selectedProject === project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`block w-full text-left p-4 rounded-lg border cursor-pointer transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.985] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent ${
                  selectedProject === project.id
                    ? 'bg-os-accent/20 border-os-accent'
                    : 'bg-os-darker/30 border-os-border [@media(hover:hover)_and_(pointer:fine)]:hover:border-os-accent/50'
                }`}
              >
                {project.images[0] && (
                  <img
                    src={project.images[0]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-video object-cover rounded-md mb-3 bg-os-darker/30"
                  />
                )}
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
                    <span>{formatPeriod(project.startDate, project.endDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <Tag className="w-3 h-3 text-os-accent" />
                    <span className="text-os-accent">{project.category}</span>
                  </div>
                </div>
              </button>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-8 text-os-text-muted">
                <p>{t('ui.projects.noProjectsFound')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Détail du projet sélectionné */}
        <div
          ref={detailRef}
          className={`relative overflow-auto ${isNarrow ? (selectedProjectData ? 'w-full' : 'hidden') : 'w-1/2'}`}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {selectedProjectData ? (
              <motion.div
                key={selectedProjectData.id}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.18, ease: EASE } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="p-6 space-y-6 w-full"
              >
                {/* Retour à la liste (mode étroit) */}
                {isNarrow && (
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="flex items-center space-x-2 text-sm text-os-text-muted transition-[color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-os-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent rounded"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('ui.projects.back')}</span>
                  </button>
                )}

                {/* Capture principale */}
                {selectedProjectData.images[0] && (
                  <img
                    src={selectedProjectData.images[0]}
                    alt={`${selectedProjectData.title} - ${t('ui.projects.screenshots')} 1`}
                    decoding="async"
                    className="w-full aspect-video object-contain rounded-lg border border-os-border bg-os-darker/30 p-1"
                  />
                )}

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
                      {formatPeriod(selectedProjectData.startDate, selectedProjectData.endDate)}
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

                {/* Autres captures */}
                {selectedProjectData.images.length > 1 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-os-text">{t('ui.projects.screenshots')}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedProjectData.images.slice(1).map((image: string, index: number) => (
                      <div
                        key={image}
                        className="rounded-lg border border-os-border overflow-hidden bg-os-darker/30 p-1"
                      >
                        <img 
                          src={image} 
                          alt={`${selectedProjectData.title} - ${t('ui.projects.screenshots')} ${index + 2}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full aspect-video object-contain rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </motion.div>
            ) : (
              <div key="empty" className="flex items-center justify-center h-full text-os-text-muted">
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
