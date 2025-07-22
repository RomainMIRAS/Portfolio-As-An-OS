import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { portfolioConfig } from '../data/portfolio';
import type { PortfolioData } from '../data/portfolio';

export const usePortfolioData = (): PortfolioData => {
  const { t } = useTranslation();

  return useMemo(() => ({
    personal: {
      name: t('personal.name'),
      title: t('personal.title'),
      bio: t('personal.bio'),
      avatar: portfolioConfig.personal.avatar,
      location: t('personal.location'),
      availability: t('personal.availability'),
      highlightedTerms: t('personal.highlightedTerms', { returnObjects: true }) as string[]
    },
    projects: portfolioConfig.projects.map((project, index) => ({
      id: project.id,
      title: t(`projects.${index}.title`),
      description: t(`projects.${index}.description`),
      longDescription: t(`projects.${index}.longDescription`),
      technologies: project.technologies,
      category: t(`projects.${index}.category`),
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      images: project.images,
      featured: project.featured,
      startDate: project.startDate,
      endDate: project.endDate
    })),
    experience: portfolioConfig.experience.map((exp, index) => ({
      id: exp.id,
      company: exp.company,
      position: t(`experience.${index}.position`),
      duration: t(`experience.${index}.duration`),
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: t(`experience.${index}.description`),
      technologies: exp.technologies,
      location: t(`experience.${index}.location`),
      type: t(`experience.${index}.type`) as 'full-time' | 'part-time' | 'contract' | 'internship'
    })),
    education: portfolioConfig.education.map((edu, index) => ({
      id: edu.id,
      institution: edu.institution,
      degree: t(`education.${index}.degree`),
      field: t(`education.${index}.field`),
      duration: t(`education.${index}.duration`),
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: t(`education.${index}.description`),
      location: t(`education.${index}.location`)
    })),
    skills: portfolioConfig.skills.map(skillGroup => ({
      category: t(`skills.categories.${skillGroup.categoryKey}`),
      skills: skillGroup.skills.map(skill => ({
        name: skill.name,
        level: skill.level,
        years: skill.years,
        category: t(`skills.categories.${skillGroup.categoryKey}`)
      }))
    })),
    contact: {
      email: portfolioConfig.contact.email,
      phone: portfolioConfig.contact.phone,
      linkedin: portfolioConfig.contact.linkedin,
      github: portfolioConfig.contact.github,
      website: portfolioConfig.contact.website,
      location: t('contact.location')
    }
  }), [t]);
};