import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Star } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { Skill } from '../../data/portfolio';

// Composant SkillBar memoized pour éviter les re-renders
const SkillBar = React.memo<{ skill: Skill; index: number; getSkillLevel: (level: number) => { label: string; color: string; bgColor: string } }>(({ skill, index, getSkillLevel }) => {
  const levelInfo = getSkillLevel(skill.level);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-os-darker/30 rounded-lg p-4 border border-os-border"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h4 className="font-medium text-os-text">{skill.name}</h4>
          <span className={`text-xs px-2 py-1 rounded-full ${levelInfo.color} bg-opacity-20 border border-current`}>
            {levelInfo.label}
          </span>
        </div>
        
        <div className="text-right text-sm text-os-text-muted">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>{skill.years} an{skill.years > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
      
      {/* Barre de progression */}
      <div className="relative">
        <div className="w-full bg-os-border rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className={`h-full ${levelInfo.bgColor} rounded-full`}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-os-text-subtle">0%</span>
          <span className={`font-medium ${levelInfo.color}`}>{skill.level}%</span>
          <span className="text-os-text-subtle">100%</span>
        </div>
      </div>
    </motion.div>
  );
});

const SkillsWindow: React.FC = () => {
  const { skills } = usePortfolioData();

  // Fonction memoized pour éviter les re-renders
  const getSkillLevel = useCallback((level: number) => {
    if (level >= 90) return { label: 'Expert', color: 'text-os-success', bgColor: 'bg-os-success' };
    if (level >= 75) return { label: 'Avancé', color: 'text-os-accent', bgColor: 'bg-os-accent' };
    if (level >= 60) return { label: 'Intermédiaire', color: 'text-os-warning', bgColor: 'bg-os-warning' };
    return { label: 'Débutant', color: 'text-os-error', bgColor: 'bg-os-error' };
  }, []);

  // Categories triées memoized
  const sortedCategories = useMemo(() => {
    return skills.map(category => ({
      ...category,
      skills: [...category.skills].sort((a, b) => b.level - a.level)
    }));
  }, [skills]);

  return (
    <div className="h-full overflow-auto space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-os-text mb-2">Compétences Techniques</h2>
        <p className="text-os-text-muted">
          Aperçu de mes compétences et niveau d'expertise dans différentes technologies
        </p>
      </motion.div>

      {/* Stats générales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-os-darker/30 rounded-lg p-4 border border-os-border text-center">
          <Award className="w-8 h-8 text-os-success mx-auto mb-2" />
          <div className="text-2xl font-bold text-os-success mb-1">
            {skills.reduce((acc, cat) => acc + cat.skills.filter(s => s.level >= 90).length, 0)}
          </div>
          <div className="text-sm text-os-text-muted">Expert</div>
        </div>
        
        <div className="bg-os-darker/30 rounded-lg p-4 border border-os-border text-center">
          <Star className="w-8 h-8 text-os-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-os-accent mb-1">
            {skills.reduce((acc, cat) => acc + cat.skills.filter(s => s.level >= 75).length, 0)}
          </div>
          <div className="text-sm text-os-text-muted">Avancé</div>
        </div>
        
        <div className="bg-os-darker/30 rounded-lg p-4 border border-os-border text-center">
          <TrendingUp className="w-8 h-8 text-os-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-os-warning mb-1">
            {Math.round(skills.reduce((acc, cat) => acc + cat.skills.reduce((sum, s) => sum + s.years, 0), 0) / skills.reduce((acc, cat) => acc + cat.skills.length, 0))}
          </div>
          <div className="text-sm text-os-text-muted">Années moy.</div>
        </div>
      </motion.div>

      {/* Compétences par catégorie */}
      {sortedCategories.map((category, categoryIndex) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + categoryIndex * 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-os-text flex items-center space-x-2">
            <span className="text-os-accent">&gt;</span>
            <span>{category.category}</span>
            <span className="text-sm text-os-text-muted font-normal">
              ({category.skills.length} compétence{category.skills.length > 1 ? 's' : ''})
            </span>
          </h3>
          
          <div className="grid gap-4">
            {category.skills.map((skill, skillIndex) => (
              <SkillBar 
                key={skill.name} 
                skill={skill} 
                index={skillIndex} 
                getSkillLevel={getSkillLevel}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Légende */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-os-darker/30 rounded-lg p-6 border border-os-border"
      >
        <h3 className="text-lg font-semibold text-os-text mb-4 flex items-center space-x-2">
          <span className="text-os-accent">&gt;</span>
          <span>Légende des niveaux</span>
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-os-success rounded-full"></div>
            <span className="text-sm text-os-text-muted">Expert (90%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-os-accent rounded-full"></div>
            <span className="text-sm text-os-text-muted">Avancé (75%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-os-warning rounded-full"></div>
            <span className="text-sm text-os-text-muted">Intermédiaire (60%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-os-error rounded-full"></div>
            <span className="text-sm text-os-text-muted">Débutant (&lt;60%)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SkillsWindow;
