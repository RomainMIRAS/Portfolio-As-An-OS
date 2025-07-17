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
    name: "MIRAS Romain",
    title: "Développeur DevOps / Full Stack",
    bio: "Étudiant en 5e année à Polytech Grenoble (Informatique), actuellement en stage DevOps/Backend jusqu'à mi-septembre 2025.\n\nMon parcours a commencé par un DUT Informatique à Grenoble, où j'ai acquis des bases solides en développement logiciel et web. Depuis, je me suis spécialisé dans des environnements techniques variés, avec une appétence particulière pour les projets collaboratifs et la résolution de problèmes concrets.\n\nDurant mes expériences, j'ai travaillé sur des projets mêlant développement backend (Node.js, Python…), DevOps (CI/CD, Docker, GitLab), et parfois frontend (React). J'aime explorer tout le cycle de vie d'une application, de la conception à la mise en production.\n\nJe suis ouvert aux opportunités de CDI ou VIE en DevOps, Backend ou FullStack à partir de septembre 2025, en France ou à l'international.",
    avatar: "/avatar.jpg",
    location: "Grenoble, France",
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
      id: "viseo-devops",
      company: "VISEO",
      position: "Stage d'ingénieur DevOps / Backend",
      duration: "7 mois",
      startDate: "2025-03",
      endDate: "2025-09",
      description: "Stage de fin d'étude d'ingénieur Informatique chez Viseo Grenoble. Mise en place de processus DevOps pour des projets web sur Cloud Azure/AWS. Maintenance et création de solutions CI/CD sur Azure DevOps et Gitlab CI. Développement et maintenance de solutions backend Dotnet.",
      technologies: ["DevOps", "Azure", "AWS", "Azure DevOps", "GitLab CI", ".NET"],
      location: "Grenoble, France",
      type: "internship"
    },
    {
      id: "redtaag",
      company: "Redtaag",
      position: "Développeur web fullstack",
      duration: "5 mois",
      startDate: "2024-04",
      endDate: "2024-08",
      description: "Évolution et maintenance de l'applicatif web Redtaag ainsi qu'une application Android.",
      technologies: ["Web", "Android", "Fullstack"],
      location: "Valence, Espagne",
      type: "internship"
    },
    {
      id: "blue-ortho",
      company: "BLUE ORTHO",
      position: "Développeur web",
      duration: "4 mois",
      startDate: "2022-04",
      endDate: "2022-07",
      description: "Evolution et maintenance de l'applicatif Web.",
      technologies: ["Web"],
      location: "Meylan, France",
      type: "internship"
    }
  ],
  education: [
    {
      id: "polytech-grenoble",
      institution: "Polytech Grenoble",
      degree: "Diplôme d'ingénieur",
      field: "Informatique",
      duration: "3 ans",
      startDate: "2022-09",
      endDate: "2025-08",
      description: "Formation d'ingénieur en informatique généraliste avec une spécialisation dans le domaine du réseau.",
      location: "Grenoble, France"
    },
    {
      id: "iut2-grenoble",
      institution: "IUT2 Grenoble",
      degree: "Diplôme universitaire de technologie (DUT)",
      field: "Informatique",
      duration: "2 ans",
      startDate: "2020-09",
      endDate: "2022-06",
      description: "Formation en informatique généraliste avec une spécialisation en développement web.",
      location: "Grenoble, France"
    },
    {
      id: "lycee-buisson",
      institution: "Lycée Polyvalent Ferdinand Buisson",
      degree: "Baccalauréat général",
      field: "Ingénierie",
      duration: "3 ans",
      startDate: "2017-09",
      endDate: "2020-06",
      description: "Baccalauréat général avec une spécialisation en sciences et technologies de l'ingénierie.",
      location: "Voiron, France"
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
    email: "romain.miras@gmail.com",
    phone: "+33 6 01 30 67 94",
    linkedin: "https://linkedin.com/in/romain-miras-427126232",
    github: "https://github.com/romainmiras",
    twitter: "https://twitter.com/romainmiras",
    website: "http://79.92.83.218",
    location: "Grenoble, France"
  }
};
