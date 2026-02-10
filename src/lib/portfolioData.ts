export interface Project {
  name: string;
  status: string;
  tech: string;
  description: string;
  link?: string;
}

export interface WorkRecord {
  title: string;
  organization: string;
  period: string;
  description: string;
}

export interface CommLink {
  label: string;
  url: string;
  type: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export const personnel = {
  name: "JOHN DOE",
  designation: "Full Stack Developer",
  status: "ACTIVE",
  location: "New York, USA",
  clearance: "LEVEL 4",
  bio: [
    "Experienced software engineer specializing in modern web",
    "technologies. Proficient in building scalable applications",
    "with React, TypeScript, and Node.js. Passionate about clean",
    "code architecture and user experience design.",
  ],
};

export const projects: Project[] = [
  {
    name: "VAULT MANAGEMENT SYSTEM",
    status: "COMPLETE",
    tech: "React, TypeScript, Supabase",
    description: "Full-stack vault resource management dashboard with real-time monitoring",
    link: "https://github.com/username/vault-mgmt",
  },
  {
    name: "WASTELAND TRACKER",
    status: "COMPLETE",
    tech: "Next.js, PostgreSQL, Tailwind",
    description: "Geolocation-based exploration app with interactive mapping",
    link: "https://github.com/username/wasteland-tracker",
  },
  {
    name: "PIP-BOY INTERFACE",
    status: "IN PROGRESS",
    tech: "React, Three.js, WebGL",
    description: "3D interactive personal information processor with retro UI",
    link: "https://github.com/username/pip-boy",
  },
  {
    name: "TERMINAL NETWORK",
    status: "COMPLETE",
    tech: "Node.js, Socket.io, Redis",
    description: "Real-time messaging platform with end-to-end encryption",
  },
];

export const records: WorkRecord[] = [
  {
    title: "Senior Software Engineer",
    organization: "Vault-Tec Industries",
    period: "2023 - PRESENT",
    description: "Lead development of critical infrastructure systems and mentored junior engineers.",
  },
  {
    title: "Software Engineer",
    organization: "RobCo Industries",
    period: "2021 - 2023",
    description: "Built and maintained consumer-facing web applications serving 100k+ users.",
  },
  {
    title: "Junior Developer",
    organization: "Nuka-Cola Corporation",
    period: "2019 - 2021",
    description: "Developed internal tools and automated deployment pipelines.",
  },
];

export const comms: CommLink[] = [
  { label: "GITHUB", url: "https://github.com/username", type: "CODE REPOSITORY" },
  { label: "LINKEDIN", url: "https://linkedin.com/in/username", type: "PROFESSIONAL NETWORK" },
  { label: "EMAIL", url: "mailto:user@example.com", type: "DIRECT COMMUNICATION" },
  { label: "TWITTER/X", url: "https://x.com/username", type: "PUBLIC BROADCAST" },
];

export const skills: SkillCategory[] = [
  {
    category: "PROGRAMMING LANGUAGES",
    items: ["TypeScript", "JavaScript", "Python", "Rust", "SQL"],
  },
  {
    category: "FRAMEWORKS & LIBRARIES",
    items: ["React", "Next.js", "Node.js", "Tailwind CSS", "Express"],
  },
  {
    category: "TOOLS & PLATFORMS",
    items: ["Git", "Docker", "AWS", "Supabase", "Vercel"],
  },
  {
    category: "CERTIFICATIONS",
    items: ["AWS Solutions Architect", "Google Cloud Professional"],
  },
];
