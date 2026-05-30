export const profile = {
  name: "Yashas Bajaj",
  title: "Full-Stack Architect & Systems Engineer",
  location: "New Delhi, India",
  summary: "Yashas Bajaj",
  supporting: "Full-Stack Architect & Systems Engineer",
  ethos:
    "Engineering resilient infrastructure and high-throughput systems that bridge academic depth with production-grade reliability. Specializing in secure, cost-optimized backend ecosystems—from graph-based modeling and E2EE security to automated, zero-touch deployment pipelines."
} as const;

export const contactLinks = {
  calendly: "https://calendly.com/autorandy89/30min",
  email: "mailto:yashasbajaj2403@gmail.com?subject=Let%27s%20build%20something",
  linkedin: "https://www.linkedin.com/in/yashas-bajaj/",
  github: "https://github.com/MOONCHILD2403",
  resume: "/Yashas-Bajaj-Resume.pdf",
  easterEgg: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
} as const;

export const experiences = [
  {
    company: "WALLT",
    role: "Software Developer Intern",
    duration: "October 2024 - July 2025",
    accent: "var(--accent-rose)",
    linkedin: "https://www.linkedin.com/company/wallt-in/",
    summary:
      "Security and infrastructure work focused on cheaper operations, safer user flows, and steadier releases.",
    bullets: [
      "Designed an AWS S3-based cache for cron jobs, removing recurring Redis cost and improving resilience.",
      "Implemented E2EE and account lockout to strengthen user security and compliance.",
      "Automated zero-touch deployment with GitHub Actions and AWS ECS for faster releases.",
      "Executed large production migrations while maintaining data integrity with minimal downtime."
    ]
  },
  {
    company: "Fingrowth MediaTech",
    role: "Backend Developer Intern",
    duration: "August 2024 - September 2024",
    accent: "var(--accent-amber)",
    linkedin: "https://www.linkedin.com/company/fingrowth-media/",
    summary:
      "Backend delivery around schemas, migrations, query performance, and secure authentication.",
    bullets: [
      "Designed database schemas and migration workflows for cleaner backend evolution.",
      "Built Express.js APIs with MongoDB and JWT-based authentication.",
      "Implemented secure user authentication patterns with Next.js and NextAuth."
    ]
  },
  {
    company: "Pawsaathi",
    role: "Software Developer Intern",
    duration: "May 2024 - July 2024",
    accent: "var(--accent-cyan)",
    linkedin: "https://www.linkedin.com/company/pawsaathi/",
    summary:
      "Core backend and operations work across REST APIs, serverless architecture, and developer workflow tooling.",
    bullets: [
      "Designed and maintained RESTful APIs, improving performance and functionality.",
      "Implemented serverless architecture to improve scalability and efficiency.",
      "Used CLI tooling and SSH for remote server administration and task automation.",
      "Adopted Docker and Git to streamline development and deployment workflows."
    ]
  }
] as const;

export const projectCards = [
  {
    id: "batwara",
    name: "BATWARA",
    category: "Expense platform",
    accent: "var(--accent-cyan)",
    year: "2025",
    image: "/project-batwara.svg",
    description:
      "Modular monolith featuring Neo4j graph modeling for 3x transaction reconciliation speed.",
    liveHref: "https://batwara-five.vercel.app/",
    codeHref: "https://github.com/MOONCHILD2403",
    docsHref: "/under-construction?project=batwara",
    stack: ["TypeScript", "Next.js", "PostgreSQL", "Neo4j"],
    detail:
      "Built a modular monolith for group expense management, using graph modeling for settlements and optimized aggregation paths for a 3x faster balance computation flow.",
    highlights: [
      "Neo4j graph modeling for reconciliation-heavy paths.",
      "AI background jobs for summaries and classification.",
      "Docker and Inngest-backed background orchestration."
    ]
  },
  {
    id: "wallt-release-system",
    name: "WALLT",
    category: "Infrastructure",
    accent: "var(--accent-rose)",
    year: "2025",
    image: "/project-wallt.svg",
    description:
      "Secure AWS infrastructure utilizing S3-based caching to eliminate recurring cloud costs.",
    liveHref: "/under-construction?project=wallt-live",
    codeHref: "https://github.com/MOONCHILD2403",
    docsHref: "/under-construction?project=wallt",
    stack: ["AWS S3", "GitHub Actions", "ECS", "Migrations"],
    detail:
      "Reduced infra cost with an S3-based caching strategy, automated zero-touch releases, and handled high-stakes database migrations with a bias toward repeatable operations.",
    highlights: [
      "Redis cost removed via S3-backed cron cache.",
      "Zero-touch ECS delivery pipeline.",
      "Production migration safeguards and rollback awareness."
    ]
  },
  {
    id: "legal-lingo",
    name: "LEGAL LINGO",
    category: "Multilingual blog",
    accent: "var(--accent-amber)",
    year: "2025",
    image: "/project-legal-lingo.svg",
    description:
      "Multilingual platform serving 11 languages with 30% Prisma query optimization.",
    liveHref: "https://blog-42u2abjfa-yashas-projects-27a7e7e6.vercel.app/",
    codeHref: "https://github.com/MOONCHILD2403",
    docsHref: "/under-construction?project=legal-lingo",
    stack: ["Next.js", "Prisma", "MySQL", "NextAuth.js"],
    detail:
      "Built a multilingual legal blog with structured schema design, authentication coverage, and search-focused UX. Query paths were optimized by roughly 30% without sacrificing maintainability.",
    highlights: [
      "Prisma ORM schema and migration structure.",
      "Email, mobile, and OTP-based auth flows.",
      "Search, analytics, and responsive reading experience."
    ]
  },
  {
    id: "leaflens",
    name: "LEAFLENS",
    category: "ML system",
    accent: "var(--accent-cyan)",
    year: "2023",
    image: "/project-leaflens.svg",
    description:
      "ML system with 92% classification accuracy integrated into a production Flask backend.",
    liveHref: "/under-construction?project=leaflens-live",
    codeHref: "https://github.com/MOONCHILD2403",
    docsHref: "/under-construction?project=leaflens",
    stack: ["Python", "Flask", "Computer Vision", "ML"],
    detail:
      "Built a classification workflow around a Flask backend, connecting model inference to a production-ready API surface instead of leaving the work trapped in a notebook.",
    highlights: [
      "92% classification accuracy on the target pipeline.",
      "Flask integration for production-serving paths.",
      "Model output shaped for practical downstream use."
    ]
  },
  {
    id: "terminal-view-all",
    name: "THE TERMINAL",
    category: "View all",
    accent: "var(--accent-amber)",
    year: "LIVE",
    image: "/project-terminal.svg",
    description: "Access the full repository of experimental systems.",
    liveHref: "/under-construction?project=terminal",
    codeHref: "https://github.com/MOONCHILD2403",
    docsHref: "/under-construction?project=terminal",
    stack: ["projects.yashas.dev", "Archive", "Experiments"],
    detail:
      "A future project hub for experiments, production case studies, and long-form system notes. For now, this acts as the preview portal.",
    highlights: [
      "Terminal-styled gateway to the future project subdomain.",
      "Designed to expand into a searchable grid of systems work.",
      "Reserved for deeper documentation and blog-style breakdowns."
    ]
  }
] as const;

export const toolSphere = [
  { name: "TypeScript", icon: "typescript", color: "#3178c6" },
  { name: "Python", icon: "python", color: "#ffd43b" },
  { name: "Node.js", icon: "node", color: "#5fa04e" },
  { name: "Next.js", icon: "next", color: "currentColor" },
  { name: "AWS", icon: "aws", color: "#ff9900" },
  { name: "Docker", icon: "docker", color: "#2496ed" },
  { name: "PostgreSQL", icon: "postgres", color: "#4169e1" },
  { name: "MongoDB", icon: "mongo", color: "#47a248" },
  { name: "Neo4j", icon: "neo4j", color: "#4581c3" },
  { name: "Kafka", icon: "kafka", color: "currentColor" },
  { name: "Prisma", icon: "prisma", color: "#5a67d8" },
  { name: "GitHub Actions", icon: "github-actions", color: "#2088ff" }
] as const;

export const toolPanels = [
  {
    title: "Backend",
    body: "REST APIs, auth flows, migrations, and data modeling with a bias toward maintainability."
  },
  {
    title: "Infrastructure",
    body: "AWS, CI/CD, Docker, and deployment automation built to reduce manual release work."
  },
  {
    title: "Data",
    body: "PostgreSQL, MongoDB, Neo4j, and query optimization shaped around real product constraints."
  },
  {
    title: "Approach",
    body: "Practical systems work over ornamental architecture. Fewer moving parts, better outcomes."
  }
] as const;

export const loaderSteps = [
  "Warming up the caffeine pipeline",
  "Untangling auth, APIs, and infra",
  "Politely asking the pixels to behave",
  "Almost there, no server smoke detected"
] as const;
