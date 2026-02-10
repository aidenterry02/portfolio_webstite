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
  name: "Aiden Terry",
  designation: "Engineer | Devoloper | Builder | Leader",
  status: "ACTIVE",
  location: "Texas, USA",
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
    name: "Reliability Evaluation Engine (REE) Supplier Scorecard Automation",
    status: "COMPLETE",
    tech: "Python, Pandas, NumPy, Excel/CSV",
    description: "Developed a fully automated reliability scoring engine that standardizes supplier evaluation using quantitative metrics such as MTBF, failure rate, and severity indices. The system ingests raw supplier data, cleans and validates it, computes reliability metrics, applies weighted scoring, and exports traceable results. Replaced subjective assessments with a defensible, repeatable process used during supplier reviews. ",
    link: "[--REDACTED--]",
  },
  {
    name: "FRACAS Failure Classification Mode",
    status: "COMPLETE",
    tech: "Python, Scikit-learn, Pandas, Numpy",
    description: "Engineered a machine‑learning classifier to automatically categorize unstructured FRACAS failure text into 19 defect types. Used TF‑IDF feature extraction and a Random Forest classifier optimized for imbalance. Achieved 98.45% accuracy, significantly reducing triage time and increasing cross‑engineer consistency.",
    link: "[--REDACTED--]",
  },
  {
    name: " FRACAS Data Quality Assessment Tool",
    status: "COMPLETE",
    tech: "Python, Tkinter, Pandas",
    description: "Created a data‑quality checker for inconsistent FRACAS datasets. Automatically detects column mappings, computes completeness, accuracy, timeliness, and consistency scores, and outputs an A–F quality grade. Lightweight GUI ensures analysts can quickly validate data before downstream modeling.",
    link: "[--REDACTED--]",
  },
  {
    name: "Anomoly Detection",
    status: "COMPLETE",
    tech: "Python, Pandas, scikit‑learn, Matplotlib",
    description: "Built a pipeline that consolidates reliability KPIs from hundreds of Excel sheets and detects anomalous patterns in time‑series data. Used Isolation Forest to automatically flag abnormal behavior and generate visual + Excel outputs. Reduced analysis time from hours to minutes and improved early detection of reliability issues.",
    link: "[--REDACTED--]"
  },
  {
    name: "Component Review & Validation ",
    status: "COMPLETE",
    tech: "Internal Systems",
    description: "Led a team of 5 to perform a technical validation of proposed component replacements during major fleet inspections. Consolidated data from multiple systems, evaluated inspection history, operational data, and risk tradeoffs, and produced engineering justifications approved by review boards. Helped avoid unnecessary maintenance costs.",
    link: "[--REDACTED--]",
  },
  {
    name: "Enterprise Workflow Automation for Supplier Communication",
    status: "COMPLETE",
    tech: "PowerAutomate, PowerApps, Azure",
    description: "Architected an automated supplier‑communication process replacing multi‑month manual loops with structured workflows. Included conditional branching, approvals, validation, automated notifications, and document generation. Achieved >90% cycle‑time reduction (6 months → ~2 weeks).",
    link: "[--REDACTED--]",
  },
  {
    name: "AI Voice Assistant (STT → LLM → TTS)",
    status: "COMPLETE",
    tech: "Python, Assembly AI, ElevenLabs ",
    description: "Built a real‑time AI voice assistant integrating cloud speech recognition, a conversational LLM, and text‑to‑speech. Implemented microphone streaming, low‑latency inference, and robust error handling for smooth hands‑free interaction.",
    link: "https://github.com/aidenterry02/AI-Voice-Assistant",
  },
  {
    name: "Email Screener — Email ↔ Calendar (24‑Hour Challenge)",
    status: "COMPLETE",
    tech: "Python",
    description: "created a script that scans emails for meeting‑related content, extracts date/time information, and automatically creates calendar events after user confirmation. Designed to eliminate manual errors and reduce scheduling friction.",
    link: "HIDDEN",
  },
  {
    name: "Hydration Hero - Garmin Connect IQ App",
    status: "COMPLETE",
    tech: "MonkeyC, Garmin Hardware, Embedded UI",
    description: "Developed a wearable app that directs athletes to the nearest hydration point using onboard GPS and compass data. Engineered distance/bearing calculations and a minimal UI for low‑power devices. Field‑tested for accuracy and responsiveness",
    link: "https://github.com/aidenterry02/HydrationHeroGarminApp",
  },
  {
    name: "LunchTime - Social Planning & Events App",
    status: "COMPLETE",
    tech: "Flutter, Dart, Supabase",
    description: "Designed and iterated a consumer social app that shows friends’ availability and nearby spontaneous events. Features included real‑time maps, personalized notifications, event creation, and social coordination tools. Tested through multi‑month prototyping and user feedback cycles.",
    link: "--[REDACTED]--",
  },
  {
    name: "FRATS — Fraternal Revenue Access Ticketing System",
    status: "COMPLETE",
    tech: "Barcode Generation, SQL, React",
    description: "Built an invite‑only ticketing and access control system for small organizations using one‑time‑use barcodes, door‑side validation, and attendance tracking. Improved security and reduced friction at event entry points",
    link: "--[REDACTED]--",
  },
  {
    name: "AI Stock Trading Bot — News‑Driven Signal Analysis",
    status: "COMPLETE",
    tech: "Python, AlphaVantage, FRED API",
    description: "Developed an experimental analytics pipeline that correlates news sentiment with short‑term stock price direction. Engineered headline features, computed signals, and performed walk‑forward/backtesting. Focused on research rather than execution.",
    link: "--[RECATED]--",
  },
  {
    name: "Rocket Launch & Structural Analysis",
    status: "COMPLETE",
    tech: "MATLAB, AutoCAD, Excel",
    description: "Designed, built, and tested a model rocket, balancing stability, drag, and structural strength. Simulated various fin and mass configurations, then validated through physical launch achieving 159 m apogee and stable flight characteristics.",
    link: "[UNAVAILABLE]",
  },
  {
    name: " Wind Tunnel Testing of Rocket Aerodynamics",
    status: "COMPLETE",
    tech: "Wind Tunnel, Excel, MATLAB",
    description: "Conducted aerodynamic testing to measure lift, drag, and moment coefficients across angle‑of‑attack and Reynolds ranges. Extracted CP, CN, CA, and CM to validate rocket stability predictions. Ensured repeatability and corrected for tunnel effects.",
    link: "[UNAVAILABLE]",
  },
  {
    name: "Motorized Lifeguard Spineboard Adapter",
    status: "COMPLETE",
    tech: "AutoCAD",
    description: "Designed an adapter enabling a motorized assist for lifeguards during aquatic rescues. Engineered mounting geometry, quick‑release mechanisms, and thrust‑balance improvements for predictable handling. Validated through pool and field testing",
    link: "[UNAVAILABLE]",
  },
  {
    name: "Crystal Growth Simulator",
    status: "COMPLETE",
    tech: "C++, Custom Engine",
    description: "Created an interactive C++ simulator modeling nucleation and growth behavior under varying environmental parameters. Includes real‑time graphics, data export, and parameter sweeps to analyze morphology changes.",
    link: "https://github.com/aidenterry02/Crystal-Growth-Simulator",
  },
  {
    name: "AuraAI",
    status: "COMPLETE",
    tech: "Python, OpenAI, CLI",
    description: "Built a command‑line “aura points” tracker that gamifies social interactions. Users report an event (what happened, who, audience size), and the tool assigns a positive or negative score—clamped between –1000 and +1000—based on custom rules (e.g., “hitting the gym” vs. “messy dorm”), with audience size scaling the impact. Integrates the OpenAI API to generate a playful, roast‑style comment with each update. Includes a quick lookup to view any person’s current aura score. The repo documents features, usage (python aura_tracker.py), and next steps like adding persistence and a web/mobile UI",
    link: "https://github.com/aidenterry02/AuraAI",
  },
   {
    name: "CVWriter",
    status: "COMPLETE",
    tech: "Python, WebScraping, FPDF",
    description: "Built a Python script that automates personalized cover‑letter creation. It reads a CSV of job postings (e.g., LinkedIn exports) plus your resume/profile fields, then assembles PDF cover letters with templated sections tailored per role/company. Uses FPDF for layout/formatting and supports rapid, repeatable generation to streamline high‑volume applications.",
    link: "https://github.com/aidenterry02/CVWriter",
  },
   {
    name: "Wifi_Connect",
    status: "COMPLETE",
    tech: "Python, OS, Networking",
    description: "Developed a Python tool that scans all available Wi‑Fi networks and attempts to connect by cycling through intelligently generated password variations. The script supports both macOS and Windows, detecting the operating system and using the correct native Wi‑Fi command set. Users can choose to target a single network or attempt connections on every discovered SSID. Passwords are sourced from an included CSV file, and the tool automatically creates variations (uppercase, alternating‑case, numeric conversions, etc.) before testing them. Designed as a utility for network analysis and connectivity automation",
    link: "https://github.com/aidenterry02/Wifi_Connect",
  },
   {
    name: "SolarPowerSimulation",
    status: "COMPLETE",
    tech: "Python, Matplotlib, numPY",
    description: "Developed a detailed simulation that models how much of a city’s daily and annual electricity consumption could be offset by rooftop solar installations across multiple building types. The script runs simulations for San Francisco, Chicago, and Dallas, accounting for panel efficiency, rooftop suitability, cloud‑cover‑adjusted irradiance, building inventories, and seasonal (sinusoidal) sunlight variation. It calculates rooftop area per building type (residential, commercial, gas stations, parking garages), computes total solar production, compares it to city‑level consumption, and generates daily offset curves for an entire year. Visual outputs include per‑city line plots showing daily % energy met by solar.",
    link: "https://github.com/aidenterry02/SolarPowerSimulation",
  },
   {
    name: "Sodoku Solver",
    status: "COMPLETE",
    tech: "Python, Tkinter, Human Deduction",
    description: "This Sudoku solver is a fully offline, pure‑Python engine designed to mimic human expert logical reasoning rather than rely on brute‑force backtracking. Inspired by over a year of playing Sudoku at a top‑1% ranking, you reverse‑engineered and codified the actual mental techniques used by advanced players.",
    link: "https://github.com/aidenterry02/sudoku_solver",
  },
   {
    name: "Human‑Directory",
    status: "IN-PROGRESS",
    tech: "JavaScript, TypeScript",
    description: "Human‑Directory is set up as a two‑part monorepo intended to ship a people‑directory product with a mobile client and a server backend. The repo is early but already split into dedicated workspaces (mobile-app/ and backend/), positioned for shared TypeScript models/utilities across both sides. This structure sets you up to add API endpoints, auth, and a mobile UI while keeping types in sync",
    link: "https://github.com/aidenterry02/Human-Directory",
  },
];

export const records: WorkRecord[] = [
  {
    title: "Manufacturing Engineer",
    organization: "Caterpillar Inc.",
    period: "January 2025 - PRESENT",
    description: "Lead development of critical infrastructure systems and mentored junior engineers.",
  },
  {
    title: "Reliability Engineer",
    organization: "Gulfstream Aerospace",
    period: "August 2025 - December 2025",
    description: "Built and maintained consumer-facing web applications serving 100k+ users.",
  },
 
];

export const comms: CommLink[] = [
  { label: "GITHUB", url: "https://github.com/aidenterry02", type: "CODE REPOSITORY" },
  { label: "LINKEDIN", url: "https://www.linkedin.com/in/aiden-terry/e", type: "PROFESSIONAL NETWORK" },
  { label: "EMAIL", url: "mailto:aiden.t.terry@gmail.com", type: "DIRECT COMMUNICATION" },
];

export const skills: SkillCategory[] = [
  {
    category: "PROGRAMMING LANGUAGES",
    items: ["Python", "Java", "C", "C++", "SQL"],
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
    items: ["Lean Six Sigma White Belt", "Autodesk Certified User"]
  },
];
