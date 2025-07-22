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
  highlightedTerms: string[];
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
    title: "Software Engineer & DevOps Specialist",
    bio: "Étudiant en 5e année à Polytech Grenoble (Informatique), actuellement en stage DevOps/Backend jusqu'à mi-septembre 2025.\n\nMon parcours a commencé par un DUT Informatique à Grenoble, où j'ai acquis des bases solides en développement logiciel et web. Depuis, je me suis spécialisé dans des environnements techniques variés, avec une appétence particulière pour les projets collaboratifs et la résolution de problèmes concrets.\n\nDurant mes expériences, j'ai travaillé sur des projets mêlant développement backend (Node.js, Python…), DevOps (CI/CD, Docker, GitLab), et parfois frontend (React). J'aime explorer tout le cycle de vie d'une application, de la conception à la mise en production.\n\nJe suis ouvert aux opportunités de CDI ou VIE en DevOps, Backend ou FullStack à partir de septembre 2025, en France ou à l'international.",
    avatar: "/avatar.jpg",
    location: "Grenoble, France",
    availability: "Disponible pour de nouveaux projets",
    highlightedTerms: [
      "Polytech Grenoble",
      "DUT Informatique", 
      "DevOps",
      "Backend",
      "Frontend", 
      "FullStack",
      "Node.js",
      "Python",
      "React",
      "Docker",
      "GitLab",
      "CI/CD",
      "Terraform",
      "AWS",
      "CDI",
      "VIE",
      "septembre 2025"
    ]
  },
  projects: [
    {
      id: "os-portfolio",
      title: "OS Portfolio",
      description: "Portfolio immersif simulant un système d'exploitation",
      longDescription: "Un portfolio interactif unique qui simule l'expérience d'un système d'exploitation personnalisé. Développé avec React, TypeScript et TailwindCSS, il offre une interface utilisateur innovante avec des fenêtres draggables, un terminal interactif et des animations fluides utilisant Framer Motion.",
      technologies: ["React", "TypeScript", "TailwindCSS", "Framer Motion", "Vite"],
      category: "Frontend",
      githubUrl: "https://github.com/RomainMIRAS/Portfolio-As-An-OS",
      liveUrl: "https://romain-miras-portfolio.vercel.app",
      images: ["/projects/os-portfolio-1.png", "/projects/os-portfolio-2.png"],
      featured: true,
      startDate: "2024-12",
      endDate: "2025-01"
    },
    {
      id: "devops-automation",
      title: "Automatisation DevOps",
      description: "Pipelines CI/CD et infrastructure as code",
      longDescription: "Projets d'automatisation DevOps incluant la création de pipelines CI/CD robustes, l'infrastructure as code avec Terraform et AWS CDK, et l'orchestration de conteneurs Docker. Focus sur les bonnes pratiques DevOps et la sécurité.",
      technologies: ["Azure DevOps", "GitLab CI", "Terraform", "AWS CDK", "Docker", "Azure", "AWS"],
      category: "DevOps",
      githubUrl: "https://github.com/RomainMIRAS",
      images: ["/projects/devops-1.jpg"],
      featured: true,
      startDate: "2024-04",
      endDate: "2025-01"
    },
    {
      id: "polytech-projects",
      title: "Projets Académiques Polytech",
      description: "Collection de projets développés durant la formation d'ingénieur",
      longDescription: "Ensemble de projets académiques couvrant différents domaines : développement web fullstack, applications mobiles, systèmes distribués, et projets de réseau. Ces projets démontrent la maîtrise de technologies variées et la capacité à travailler en équipe sur des problématiques complexes.",
      technologies: ["Java", "Spring", "React", "Node.js", "Android", "Python", "C++", "Docker"],
      category: "Academic",
      githubUrl: "https://github.com/RomainMIRAS",
      images: ["/projects/polytech-1.jpg"],
      featured: false,
      startDate: "2022-09",
      endDate: "2025-08"
    },
    {
      id: "iut-web-projects",
      title: "Projets Web IUT",
      description: "Applications web développées durant le DUT Informatique",
      longDescription: "Projets web réalisés en équipe durant la formation DUT, incluant des sites e-commerce, des applications de gestion, et des projets utilisant différentes technologies web. Focus sur les bonnes pratiques de développement et l'expérience utilisateur.",
      technologies: ["PHP", "Symfony", "JavaScript", "HTML5", "CSS3", "MySQL", "Bootstrap"],
      category: "Academic",
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
      company: "VISEO",
      position: "Stage d'ingénieur DevOps / Backend",
      duration: "7 mois",
      startDate: "2025-03",
      endDate: "2025-09",
      description: "Stage de fin d'études d'ingénieur chez VISEO Grenoble. Mise en place de processus DevOps pour des projets web sur Cloud Azure/AWS. Maintenance et création de solutions CI/CD sur Azure DevOps et GitLab CI. Développement et maintenance de solutions backend .NET et Spring. Automatisation des déploiements et gestion de l'infrastructure as code.",
      technologies: ["DevOps", "Azure", "AWS", "Azure DevOps", "GitLab CI", ".NET", "C#", "Docker", "AWS", "AWS CDK"],
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
      description: "Développement et maintenance de l'application web Redtaag ainsi qu'une application mobile Android.",
      technologies: ["React", "JavaScript", "Android", "Agile", "PHP", "Bootstrap", "MySQL"],
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
      description: "Évolution et maintenance de l'applicatif web de gestion orthopédique. Développement de nouvelles fonctionnalités et correction de bugs. Travail avec les technologies web modernes et participation à l'amélioration de l'expérience utilisateur.",
      technologies: ["JavaScript", "HTML", "CSS", "PHP", "MySQL", "Symfony"],
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
      institution: "IUT2 Grenoble - Université Grenoble Alpes",
      degree: "Diplôme universitaire de technologie (DUT)",
      field: "Informatique",
      duration: "2 ans",
      startDate: "2020-09",
      endDate: "2022-06",
      description: "Formation en informatique généraliste couvrant la programmation, les bases de données, les réseaux, le développement web et le génie logiciel. Équivalent d'un Bachelor en Computer Science.",
      location: "Grenoble, France"
    },
    {
      id: "lycee-buisson",
      institution: "Lycée Polyvalent Ferdinand Buisson",
      degree: "Baccalauréat général",
      field: "Sciences et Technologies de l'Ingénieur",
      duration: "3 ans",
      startDate: "2017-09",
      endDate: "2020-06",
      description: "Baccalauréat général avec spécialisation en sciences et technologies de l'ingénieur, incluant mathématiques, physique et sciences de l'ingénieur.",
      location: "Voiron, France"
    }
  ],
  skills: [
    {
      category: "Programming Languages",
      skills: [
        { name: "JavaScript", level: 90, years: 4, category: "Programming Languages" },
        { name: "TypeScript", level: 85, years: 3, category: "Programming Languages" },
        { name: "Python", level: 80, years: 3, category: "Programming Languages" },
        { name: "C#", level: 75, years: 2, category: "Programming Languages" },
        { name: "Java", level: 70, years: 3, category: "Programming Languages" },
        { name: "PHP", level: 65, years: 2, category: "Programming Languages" },
        { name: "C/C++", level: 70, years: 2, category: "Programming Languages" },
        { name: "Rust", level: 60, years: 1, category: "Programming Languages" }
      ]
    },
    {
      category: "Frontend Development",
      skills: [
        { name: "React", level: 90, years: 4, category: "Frontend Development" },
        { name: "HTML5", level: 95, years: 5, category: "Frontend Development" },
        { name: "CSS3", level: 90, years: 5, category: "Frontend Development" },
        { name: "Bootstrap", level: 80, years: 3, category: "Frontend Development" },
        { name: "React Native", level: 70, years: 2, category: "Frontend Development" }
      ]
    },
    {
      category: "Backend Development",
      skills: [
        { name: "Node.js", level: 85, years: 4, category: "Backend Development" },
        { name: ".NET", level: 80, years: 2, category: "Backend Development" },
        { name: "Spring Framework", level: 75, years: 2, category: "Backend Development" },
        { name: "Symfony", level: 70, years: 2, category: "Backend Development" }
      ]
    },
    {
      category: "Database",
      skills: [
        { name: "MySQL", level: 85, years: 4, category: "Database" },
        { name: "PostgreSQL", level: 80, years: 3, category: "Database" },
        { name: "MongoDB", level: 75, years: 3, category: "Database" },
        { name: "SQLite", level: 70, years: 2, category: "Database" }
      ]
    },
    {
      category: "DevOps & Cloud",
      skills: [
        { name: "Docker", level: 85, years: 2, category: "DevOps & Cloud" },
        { name: "Azure", level: 80, years: 1, category: "DevOps & Cloud" },
        { name: "AWS", level: 75, years: 2, category: "DevOps & Cloud" },
        { name: "Azure DevOps", level: 85, years: 1, category: "DevOps & Cloud" },
        { name: "GitLab CI", level: 80, years: 2, category: "DevOps & Cloud" },
        { name: "Jenkins", level: 70, years: 1, category: "DevOps & Cloud" },
        { name: "Terraform", level: 70, years: 1, category: "DevOps & Cloud" },
        { name: "AWS CDK", level: 65, years: 1, category: "DevOps & Cloud" }
      ]
    },
    {
      category: "Mobile & Desktop",
      skills: [
        { name: "Android", level: 70, years: 2, category: "Mobile & Desktop" },
        { name: "React Native", level: 70, years: 2, category: "Mobile & Desktop" },
        { name: "Electron", level: 65, years: 1, category: "Mobile & Desktop" }
      ]
    },
    {
      category: "Tools & Other",
      skills: [
        { name: "Git", level: 95, years: 5, category: "Tools & Other" },
        { name: "Linux", level: 85, years: 4, category: "Tools & Other" },
        { name: "Nginx", level: 75, years: 2, category: "Tools & Other" }
      ]
    }
  ],
  contact: {
    email: "romain.miras@gmail.com",
    phone: "+33 6 01 30 67 94",
    linkedin: "https://linkedin.com/in/romain-miras-427126232",
    github: "https://github.com/RomainMIRAS",
    website: "http://79.92.83.218",
    location: "Grenoble, France"
  }
};
