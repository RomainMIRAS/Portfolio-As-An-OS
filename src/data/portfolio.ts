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

// Static configuration data that doesn't need translation
export const portfolioConfig = {
  personal: {
    avatar: "avatar.jpg"
  },
  projects: [
    {
      id: "os-portfolio",
      technologies: ["React", "TypeScript", "TailwindCSS", "Framer Motion", "Vite"],
      githubUrl: "https://github.com/RomainMIRAS/Portfolio-As-An-OS",
      liveUrl: "https://romain-miras-portfolio.vercel.app",
      images: ["projects/os-portfolio-1.png", "projects/os-portfolio-2.png"],
      featured: true,
      startDate: "2024-12",
      endDate: "2025-01"
    },
    {
      id: "devops-automation",
      technologies: ["Azure DevOps", "GitLab CI", "Terraform", "AWS CDK", "Docker", "Azure", "AWS"],
      githubUrl: "https://github.com/RomainMIRAS?tab=repositories&q=&type=&language=&sort=",
      images: ["projects/devops-1.jpg"],
      featured: true,
      startDate: "2024-04",
      endDate: "2025-01"
    },
    {
      id: "polytech-projects",
      technologies: ["Java", "Spring", "React", "Node.js", "Android", "Python", "C++", "Docker"],
      githubUrl: "https://github.com/RomainMIRAS/Age-Of-Empires",
      images: ["/projects/polytech-1.jpg"],
      featured: false,
      startDate: "2022-09",
      endDate: "2025-08"
    },
    {
      id: "iut-web-projects",
      technologies: ["PHP", "Symfony", "JavaScript", "HTML5", "CSS3", "MySQL", "Bootstrap"],
      githubUrl: "https://github.com/RomainMIRAS/TechAWay",
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
      startDate: "2025-03",
      endDate: "2025-09",
      technologies: ["DevOps", "Azure", "AWS", "Azure DevOps", "GitLab CI", ".NET", "C#", "Docker", "AWS", "AWS CDK"],
      type: "internship"
    },
    {
      id: "redtaag",
      company: "Redtaag",
      startDate: "2024-04",
      endDate: "2024-08",
      technologies: ["React", "JavaScript", "Android", "Agile", "PHP", "Bootstrap", "MySQL"],
      type: "internship"
    },
    {
      id: "blue-ortho",
      company: "BLUE ORTHO",
      startDate: "2022-04",
      endDate: "2022-07",
      technologies: ["JavaScript", "HTML", "CSS", "PHP", "MySQL", "Symfony"],
      type: "internship"
    }
  ],
  education: [
    {
      id: "polytech-grenoble",
      institution: "Polytech Grenoble",
      startDate: "2022-09",
      endDate: "2025-08"
    },
    {
      id: "iut2-grenoble",
      institution: "IUT2 Grenoble - Université Grenoble Alpes",
      startDate: "2020-09",
      endDate: "2022-06"
    },
    {
      id: "lycee-buisson",
      institution: "Lycée Polyvalent Ferdinand Buisson",
      startDate: "2017-09",
      endDate: "2020-06"
    }
  ],
  skills: [
    {
      categoryKey: "Programming Languages",
      skills: [
        { name: "JavaScript", level: 90, years: 4 },
        { name: "TypeScript", level: 85, years: 3 },
        { name: "Python", level: 80, years: 3 },
        { name: "C#", level: 75, years: 2 },
        { name: "Java", level: 70, years: 3 },
        { name: "PHP", level: 65, years: 2 },
        { name: "C/C++", level: 70, years: 2 },
        { name: "Rust", level: 60, years: 1 }
      ]
    },
    {
      categoryKey: "Frontend Development",
      skills: [
        { name: "React", level: 90, years: 4 },
        { name: "HTML5", level: 95, years: 5 },
        { name: "CSS3", level: 90, years: 5 },
        { name: "Bootstrap", level: 80, years: 3 },
        { name: "React Native", level: 70, years: 2 }
      ]
    },
    {
      categoryKey: "Backend Development",
      skills: [
        { name: "Node.js", level: 85, years: 4 },
        { name: ".NET", level: 80, years: 2 },
        { name: "Spring Framework", level: 75, years: 2 },
        { name: "Symfony", level: 70, years: 2 }
      ]
    },
    {
      categoryKey: "Database",
      skills: [
        { name: "MySQL", level: 85, years: 4 },
        { name: "PostgreSQL", level: 80, years: 3 },
        { name: "MongoDB", level: 75, years: 3 },
        { name: "SQLite", level: 70, years: 2 }
      ]
    },
    {
      categoryKey: "DevOps & Cloud",
      skills: [
        { name: "Docker", level: 85, years: 2 },
        { name: "Azure", level: 80, years: 1 },
        { name: "AWS", level: 75, years: 2 },
        { name: "Azure DevOps", level: 85, years: 1 },
        { name: "GitLab CI", level: 80, years: 2 },
        { name: "Jenkins", level: 70, years: 1 },
        { name: "Terraform", level: 70, years: 1 },
        { name: "AWS CDK", level: 65, years: 1 }
      ]
    },
    {
      categoryKey: "Mobile & Desktop",
      skills: [
        { name: "Android", level: 70, years: 2 },
        { name: "React Native", level: 70, years: 2 },
        { name: "Electron", level: 65, years: 1 }
      ]
    },
    {
      categoryKey: "Tools & Other",
      skills: [
        { name: "Git", level: 95, years: 5 },
        { name: "Linux", level: 85, years: 4 },
        { name: "Nginx", level: 75, years: 2 }
      ]
    }
  ],
  contact: {
    email: "romain.miras@gmail.com",
    phone: "+33 6 01 30 67 94",
    linkedin: "https://linkedin.com/in/romain-miras-427126232",
    github: "https://github.com/RomainMIRAS",
    website: "http://79.92.83.218"
  }
};
