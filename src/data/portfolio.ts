export interface PortfolioData {
  personal: PersonalInfo;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  contact: ContactInfo;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  availability: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  featured: boolean;
  startDate: string;
  endDate?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  startDate: string;
  endDate: string;
  description?: string;
  location: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number; // 1-100
  years: number;
  category: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  location: string;
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Votre Nom",
    title: "Développeur Full Stack",
    bio: "Passionné par la création d'expériences numériques innovantes, je développe des applications web modernes et performantes. Avec une expertise en React, TypeScript et Node.js, j'aime transformer des idées complexes en solutions élégantes et intuitives.",
    avatar: "/avatar.jpg",
    location: "Paris, France",
    availability: "Disponible pour de nouveaux projets"
  },
  projects: [
    {
      id: "os-portfolio",
      title: "OS Portfolio",
      description: "Portfolio immersif simulant un système d'exploitation",
      longDescription: "Un portfolio interactif unique qui simule l'expérience d'un système d'exploitation personnalisé. Développé avec React, TypeScript et TailwindCSS, il offre une interface utilisateur innovante avec des fenêtres draggables, un terminal interactif et des animations fluides.",
      technologies: ["React", "TypeScript", "TailwindCSS", "Framer Motion", "Vite"],
      category: "Frontend",
      githubUrl: "https://github.com/username/os-portfolio",
      liveUrl: "https://os-portfolio.vercel.app",
      images: ["/projects/os-portfolio-1.jpg", "/projects/os-portfolio-2.jpg"],
      featured: true,
      startDate: "2024-01",
      endDate: "2024-02"
    },
    {
      id: "ecommerce-app",
      title: "E-commerce Platform",
      description: "Plateforme e-commerce complète avec paiement intégré",
      longDescription: "Application e-commerce full-stack avec gestion des produits, panier d'achat, système de paiement Stripe, tableau de bord administrateur et interface utilisateur responsive.",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "JWT"],
      category: "Full Stack",
      githubUrl: "https://github.com/username/ecommerce-platform",
      liveUrl: "https://my-ecommerce.vercel.app",
      images: ["/projects/ecommerce-1.jpg", "/projects/ecommerce-2.jpg"],
      featured: true,
      startDate: "2023-09",
      endDate: "2023-12"
    },
    {
      id: "task-manager",
      title: "Task Manager",
      description: "Application de gestion de tâches collaborative",
      longDescription: "Outil de productivité en équipe avec gestion de projets, attribution de tâches, suivi du temps et notifications en temps réel.",
      technologies: ["Vue.js", "Firebase", "Vuetify", "PWA"],
      category: "Frontend",
      githubUrl: "https://github.com/username/task-manager",
      liveUrl: "https://task-manager-app.netlify.app",
      images: ["/projects/task-manager-1.jpg"],
      featured: false,
      startDate: "2023-06",
      endDate: "2023-08"
    }
  ],
  experience: [
    {
      id: "senior-dev",
      company: "TechCorp Solutions",
      position: "Développeur Senior Full Stack",
      duration: "2 ans",
      startDate: "2022-03",
      description: "Développement d'applications web complexes pour des clients enterprise. Lead technique sur plusieurs projets, mentoring des développeurs juniors et optimisation des performances.",
      technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "TypeScript"],
      location: "Paris, France",
      type: "full-time"
    },
    {
      id: "full-stack-dev",
      company: "StartupXYZ",
      position: "Développeur Full Stack",
      duration: "1.5 ans",
      startDate: "2020-09",
      endDate: "2022-02",
      description: "Développement de l'application principale de la startup, de la conception à la mise en production. Travail en équipe agile avec des cycles de développement rapides.",
      technologies: ["React", "Python", "Django", "PostgreSQL", "Redis"],
      location: "Lyon, France",
      type: "full-time"
    },
    {
      id: "frontend-dev",
      company: "WebAgency Pro",
      position: "Développeur Frontend",
      duration: "1 an",
      startDate: "2019-08",
      endDate: "2020-08",
      description: "Création d'interfaces utilisateur responsives et interactives pour des sites web et applications mobiles. Collaboration étroite avec les designers UX/UI.",
      technologies: ["Vue.js", "SASS", "JavaScript", "Figma", "Webpack"],
      location: "Remote",
      type: "contract"
    }
  ],
  education: [
    {
      id: "master-cs",
      institution: "École Supérieure d'Informatique",
      degree: "Master",
      field: "Informatique et Systèmes d'Information",
      duration: "2 ans",
      startDate: "2017-09",
      endDate: "2019-06",
      description: "Spécialisation en développement web et architecture logicielle. Projet de fin d'études sur les Progressive Web Apps.",
      location: "Paris, France"
    },
    {
      id: "license-info",
      institution: "Université de Technologie",
      degree: "Licence",
      field: "Informatique",
      duration: "3 ans",
      startDate: "2014-09",
      endDate: "2017-06",
      description: "Formation complète en informatique avec focus sur la programmation et les algorithmes.",
      location: "Lyon, France"
    }
  ],
  skills: [
    {
      category: "Frontend",
      skills: [
        { name: "React", level: 90, years: 4, category: "Frontend" },
        { name: "TypeScript", level: 85, years: 3, category: "Frontend" },
        { name: "Vue.js", level: 80, years: 3, category: "Frontend" },
        { name: "TailwindCSS", level: 85, years: 2, category: "Frontend" },
        { name: "Next.js", level: 75, years: 2, category: "Frontend" },
        { name: "SASS/SCSS", level: 80, years: 4, category: "Frontend" }
      ]
    },
    {
      category: "Backend",
      skills: [
        { name: "Node.js", level: 85, years: 4, category: "Backend" },
        { name: "Python", level: 80, years: 3, category: "Backend" },
        { name: "Express.js", level: 85, years: 4, category: "Backend" },
        { name: "Django", level: 70, years: 2, category: "Backend" },
        { name: "PostgreSQL", level: 75, years: 3, category: "Backend" },
        { name: "MongoDB", level: 80, years: 3, category: "Backend" }
      ]
    },
    {
      category: "DevOps & Tools",
      skills: [
        { name: "Git", level: 90, years: 5, category: "DevOps & Tools" },
        { name: "Docker", level: 75, years: 2, category: "DevOps & Tools" },
        { name: "AWS", level: 70, years: 2, category: "DevOps & Tools" },
        { name: "CI/CD", level: 75, years: 2, category: "DevOps & Tools" },
        { name: "Linux", level: 80, years: 4, category: "DevOps & Tools" },
        { name: "Figma", level: 70, years: 3, category: "DevOps & Tools" }
      ]
    }
  ],
  contact: {
    email: "contact@votre-nom.com",
    phone: "+33 6 12 34 56 78",
    linkedin: "https://linkedin.com/in/votre-profil",
    github: "https://github.com/votre-username",
    twitter: "https://twitter.com/votre-username",
    website: "https://votre-site.com",
    location: "Paris, France"
  }
};
