import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import type { PortfolioData } from '../data/portfolio';

export const usePortfolioData = (): PortfolioData => {
  const { t } = useTranslation();

  return useMemo(() => ({
    personal: {
      name: t('personal.name'),
      title: t('personal.title'),
      bio: t('personal.bio'),
      avatar: "/avatar.jpg",
      location: t('personal.location'),
      availability: t('personal.availability'),
      highlightedTerms: t('personal.highlightedTerms', { returnObjects: true }) as string[]
    },
    projects: [
      {
        id: "os-portfolio",
        title: t('projects.0.title'),
        description: t('projects.0.description'),
        longDescription: t('projects.0.longDescription'),
        technologies: ["React", "TypeScript", "TailwindCSS", "Framer Motion", "Vite"],
        category: t('projects.0.category'),
        githubUrl: "https://github.com/RomainMIRAS/Portfolio-As-An-OS",
        liveUrl: "https://romain-miras-portfolio.vercel.app",
        images: ["/projects/os-portfolio-1.png", "/projects/os-portfolio-2.png"],
        featured: true,
        startDate: "2024-12",
        endDate: "2025-01"
      },
      {
        id: "devops-automation",
        title: t('projects.1.title'),
        description: t('projects.1.description'),
        longDescription: t('projects.1.longDescription'),
        technologies: ["Azure DevOps", "GitLab CI", "Terraform", "AWS CDK", "Docker", "Azure", "AWS"],
        category: t('projects.1.category'),
        githubUrl: "https://github.com/RomainMIRAS",
        images: ["/projects/devops-1.jpg"],
        featured: true,
        startDate: "2024-04",
        endDate: "2025-01"
      },
      {
        id: "polytech-projects",
        title: t('projects.2.title'),
        description: t('projects.2.description'),
        longDescription: t('projects.2.longDescription'),
        technologies: ["Java", "Spring", "React", "Node.js", "Android", "Python", "C++", "Docker"],
        category: t('projects.2.category'),
        githubUrl: "https://github.com/RomainMIRAS",
        images: ["/projects/polytech-1.jpg"],
        featured: false,
        startDate: "2022-09",
        endDate: "2025-08"
      },
      {
        id: "iut-web-projects",
        title: t('projects.3.title'),
        description: t('projects.3.description'),
        longDescription: t('projects.3.longDescription'),
        technologies: ["PHP", "Symfony", "JavaScript", "HTML5", "CSS3", "MySQL", "Bootstrap"],
        category: t('projects.3.category'),
        githubUrl: "https://github.com/RomainMIRAS",
        images: ["/projects/iut-web-1.jpg"],
        featured: false,
        startDate: "2020-09",
        endDate: "2022-06"
      }
    ],
    experience: [
      {
        id: "viseo-devops",
        company: t('experience.0.company'),
        position: t('experience.0.position'),
        duration: t('experience.0.duration'),
        startDate: "2025-03",
        endDate: "2025-09",
        description: t('experience.0.description'),
        technologies: ["DevOps", "Azure", "AWS", "Azure DevOps", "GitLab CI", ".NET", "C#", "Docker", "AWS", "AWS CDK"],
        location: t('experience.0.location'),
        type: t('experience.0.type') as 'full-time' | 'part-time' | 'contract' | 'internship'
      },
      {
        id: "redtaag",
        company: t('experience.1.company'),
        position: t('experience.1.position'),
        duration: t('experience.1.duration'),
        startDate: "2024-04",
        endDate: "2024-08",
        description: t('experience.1.description'),
        technologies: ["React", "JavaScript", "Android", "Agile", "PHP", "Bootstrap", "MySQL"],
        location: t('experience.1.location'),
        type: t('experience.1.type') as 'full-time' | 'part-time' | 'contract' | 'internship'
      },
      {
        id: "blue-ortho",
        company: t('experience.2.company'),
        position: t('experience.2.position'),
        duration: t('experience.2.duration'),
        startDate: "2022-04",
        endDate: "2022-07",
        description: t('experience.2.description'),
        technologies: ["JavaScript", "HTML", "CSS", "PHP", "MySQL", "Symfony"],
        location: t('experience.2.location'),
        type: t('experience.2.type') as 'full-time' | 'part-time' | 'contract' | 'internship'
      }
    ],
    education: [
      {
        id: "polytech-grenoble",
        institution: t('education.0.institution'),
        degree: t('education.0.degree'),
        field: t('education.0.field'),
        duration: t('education.0.duration'),
        startDate: "2022-09",
        endDate: "2025-08",
        description: t('education.0.description'),
        location: t('education.0.location')
      },
      {
        id: "iut2-grenoble",
        institution: t('education.1.institution'),
        degree: t('education.1.degree'),
        field: t('education.1.field'),
        duration: t('education.1.duration'),
        startDate: "2020-09",
        endDate: "2022-06",
        description: t('education.1.description'),
        location: t('education.1.location')
      },
      {
        id: "lycee-buisson",
        institution: t('education.2.institution'),
        degree: t('education.2.degree'),
        field: t('education.2.field'),
        duration: t('education.2.duration'),
        startDate: "2017-09",
        endDate: "2020-06",
        description: t('education.2.description'),
        location: t('education.2.location')
      }
    ],
    skills: [
      {
        category: t('skills.categories.Programming Languages'),
        skills: [
          { name: "JavaScript", level: 90, years: 4, category: t('skills.categories.Programming Languages') },
          { name: "TypeScript", level: 85, years: 3, category: t('skills.categories.Programming Languages') },
          { name: "Python", level: 80, years: 3, category: t('skills.categories.Programming Languages') },
          { name: "C#", level: 75, years: 2, category: t('skills.categories.Programming Languages') },
          { name: "Java", level: 70, years: 3, category: t('skills.categories.Programming Languages') },
          { name: "PHP", level: 65, years: 2, category: t('skills.categories.Programming Languages') },
          { name: "C/C++", level: 70, years: 2, category: t('skills.categories.Programming Languages') },
          { name: "Rust", level: 60, years: 1, category: t('skills.categories.Programming Languages') }
        ]
      },
      {
        category: t('skills.categories.Frontend Development'),
        skills: [
          { name: "React", level: 90, years: 4, category: t('skills.categories.Frontend Development') },
          { name: "HTML5", level: 95, years: 5, category: t('skills.categories.Frontend Development') },
          { name: "CSS3", level: 90, years: 5, category: t('skills.categories.Frontend Development') },
          { name: "Bootstrap", level: 80, years: 3, category: t('skills.categories.Frontend Development') },
          { name: "React Native", level: 70, years: 2, category: t('skills.categories.Frontend Development') }
        ]
      },
      {
        category: t('skills.categories.Backend Development'),
        skills: [
          { name: "Node.js", level: 85, years: 4, category: t('skills.categories.Backend Development') },
          { name: ".NET", level: 80, years: 2, category: t('skills.categories.Backend Development') },
          { name: "Spring Framework", level: 75, years: 2, category: t('skills.categories.Backend Development') },
          { name: "Symfony", level: 70, years: 2, category: t('skills.categories.Backend Development') }
        ]
      },
      {
        category: t('skills.categories.Database'),
        skills: [
          { name: "MySQL", level: 85, years: 4, category: t('skills.categories.Database') },
          { name: "PostgreSQL", level: 80, years: 3, category: t('skills.categories.Database') },
          { name: "MongoDB", level: 75, years: 3, category: t('skills.categories.Database') },
          { name: "SQLite", level: 70, years: 2, category: t('skills.categories.Database') }
        ]
      },
      {
        category: t('skills.categories.DevOps & Cloud'),
        skills: [
          { name: "Docker", level: 85, years: 2, category: t('skills.categories.DevOps & Cloud') },
          { name: "Azure", level: 80, years: 1, category: t('skills.categories.DevOps & Cloud') },
          { name: "AWS", level: 75, years: 2, category: t('skills.categories.DevOps & Cloud') },
          { name: "Azure DevOps", level: 85, years: 1, category: t('skills.categories.DevOps & Cloud') },
          { name: "GitLab CI", level: 80, years: 2, category: t('skills.categories.DevOps & Cloud') },
          { name: "Jenkins", level: 70, years: 1, category: t('skills.categories.DevOps & Cloud') },
          { name: "Terraform", level: 70, years: 1, category: t('skills.categories.DevOps & Cloud') },
          { name: "AWS CDK", level: 65, years: 1, category: t('skills.categories.DevOps & Cloud') }
        ]
      },
      {
        category: t('skills.categories.Mobile & Desktop'),
        skills: [
          { name: "Android", level: 70, years: 2, category: t('skills.categories.Mobile & Desktop') },
          { name: "React Native", level: 70, years: 2, category: t('skills.categories.Mobile & Desktop') },
          { name: "Electron", level: 65, years: 1, category: t('skills.categories.Mobile & Desktop') }
        ]
      },
      {
        category: t('skills.categories.Tools & Other'),
        skills: [
          { name: "Git", level: 95, years: 5, category: t('skills.categories.Tools & Other') },
          { name: "Linux", level: 85, years: 4, category: t('skills.categories.Tools & Other') },
          { name: "Nginx", level: 75, years: 2, category: t('skills.categories.Tools & Other') }
        ]
      }
    ],
    contact: {
      email: t('contact.email'),
      phone: t('contact.phone'),
      linkedin: "https://linkedin.com/in/romain-miras-427126232",
      github: "https://github.com/RomainMIRAS",
      website: "http://79.92.83.218",
      location: t('contact.location')
    }
  }), [t]);
};