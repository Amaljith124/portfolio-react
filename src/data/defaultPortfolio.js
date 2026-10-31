// The default portfolio of this site: the same content and theme as the database seed (backend/database/scripts/dataCreation.sql).
// It is shown at once while the API answers, and it is the whole site in demo mode (VITE_DEMO_MODE=true).
export const DEFAULT_PORTFOLIO_SLUG = import.meta.env.VITE_DEFAULT_PORTFOLIO_SLUG || 'amaljith';

export const defaultPortfolio = {
  "slug": "amaljith",
  "name": "Amaljith Anaswaran",
  "templateKey": "default",
  "portfolio": {
    "profile": {
      "name": "Amaljith Anaswaran",
      "initials": "AA",
      "eyebrow": "FULL STACK DEVELOPER",
      "heroTitle": "Amaljith\n{Anaswaran.}",
      "intro": "Backend-focused Full Stack Developer with 3 years of experience in product development, AI and cloud.",
      "location": "Based in Kodungallur, Kerala, India",
      "availability": "Available for opportunities",
      "floatingNote": "Building practical\nsoftware and\nAI-powered products.",
      "footerTagline": "Building practical software, backend systems and AI-powered products.",
      "links": {
        "linkedin": "https://www.linkedin.com/in/amaljith-anaswaran-738a41192",
        "github": "https://github.com/Amaljith124"
      },
      "portrait": {
        "src": "/images/amaljith-portrait.webp",
        "alt": "Amaljith Anaswaran",
        "cutout": true
      },
      "email": "amaljithanaswar@gmail.com"
    },
    "skillChips": [
      {
        "label": "Node.js",
        "icon": "Hexagon",
        "color": "#5fb04e"
      },
      {
        "label": "Python",
        "icon": "Braces",
        "color": "#f2c14e"
      },
      {
        "label": "PostgreSQL",
        "icon": "Database",
        "color": "#4f9bff"
      },
      {
        "label": "React.js",
        "icon": "Atom",
        "color": "#4cd6f5"
      },
      {
        "label": "AWS",
        "icon": "Cloud",
        "color": "#ff9b3d"
      },
      {
        "label": "AI / GenAI",
        "icon": "Sparkles",
        "color": "#a58bff"
      },
      {
        "label": "REST APIs",
        "icon": "Webhook",
        "color": "#8fa3bd"
      },
      {
        "label": "Integrations",
        "icon": "Puzzle",
        "color": "#4f9bff"
      }
    ],
    "heroServices": [
      {
        "icon": "Server",
        "title": "Backend Development",
        "text": "Scalable APIs, integrations and robust backend systems."
      },
      {
        "icon": "BrainCircuit",
        "title": "Applied AI",
        "text": "LLM applications, RAG, AI agents and automation."
      },
      {
        "icon": "Cloud",
        "title": "Cloud & Integrations",
        "text": "AWS, third-party APIs and production workflows."
      },
      {
        "icon": "Code2",
        "title": "Full Stack Development",
        "text": "End-to-end web and mobile applications."
      }
    ],
    "stats": [
      {
        "icon": "Clock3",
        "value": "3 years",
        "label": "Professional experience"
      },
      {
        "icon": "GraduationCap",
        "value": "B.Tech CSE",
        "label": "2019 – 2023"
      },
      {
        "icon": "Rocket",
        "value": "Production experience",
        "label": "Startup product development"
      },
      {
        "icon": "Zap",
        "value": "Always learning",
        "label": "Solving real-world problems"
      }
    ],
    "about": {
      "eyebrow": "About me",
      "title": "From curiosity\nto {creation.}",
      "text": "I'm Amaljith Anaswaran, a Full Stack Developer who enjoys building practical software, working with AI and solving real-world problems. My strongest focus is backend engineering, integrations and applied AI.",
      "buttonLabel": "Learn More About Me",
      "journey": [
        {
          "date": "2019 – 2023",
          "title": "B.Tech, Computer Science & Engineering",
          "detail": "S.N.M. Institute of Management & Technology, Maliankara."
        },
        {
          "date": "2023",
          "title": "Joined Y's TechSolutions",
          "detail": "Started as a fresher and grew through hands-on delivery and production work."
        },
        {
          "date": "2023 – Present",
          "title": "Full Stack Developer",
          "detail": "Working across backend systems, AI applications, cloud services and product development."
        }
      ]
    },
    "skills": {
      "eyebrow": "Skills",
      "title": "Technologies I work with",
      "groups": [
        {
          "icon": "Server",
          "title": "Backend",
          "detail": "Node.js, Express.js, Python, FastAPI, Flask"
        },
        {
          "icon": "Database",
          "title": "Databases",
          "detail": "PostgreSQL, SQL, data modelling and query work"
        },
        {
          "icon": "Code2",
          "title": "Frontend & mobile",
          "detail": "React, React Native, JavaScript, HTML and CSS"
        },
        {
          "icon": "Cloud",
          "title": "Cloud",
          "detail": "AWS, S3, Lambda, AWS Connect and transcription services"
        },
        {
          "icon": "BrainCircuit",
          "title": "Applied AI",
          "detail": "LLMs, RAG, FAISS, embeddings, MMR and tool calling"
        },
        {
          "icon": "Link2",
          "title": "Integrations",
          "detail": "REST APIs, webhooks and third-party services"
        }
      ]
    },
    "projectsSection": {
      "eyebrow": "Featured projects",
      "title": "Things I've built",
      "description": "A few highlights from my recent work. Each project represents a real-world problem, a practical solution and valuable learning.",
      "linkLabel": "Explore a case study"
    },
    "projects": [
      {
        "slug": "ai-hotel-guest-support-agent",
        "icon": "Bot",
        "title": "AI Hotel Guest Support Agent",
        "category": "Applied AI · Production",
        "summary": "An AI-powered guest support agent that answers hotel questions using internal documentation, handles guest issues and supports human escalation.",
        "description": "Worked on retrieval, agent workflows and integrations that connect guest conversations with hotel systems.",
        "contribution": [
          "Worked on RAG retrieval using embeddings, FAISS similarity search and Maximal Marginal Relevance.",
          "Improved prompts, workflows and LLM tool calling for practical guest-support tasks.",
          "Integrated WhatsApp through Meta APIs.",
          "Connected Protel, OwnerRez and Hostfully through APIs and webhooks."
        ],
        "technologies": [
          "Python",
          "Node.js",
          "FAISS",
          "RAG",
          "PostgreSQL",
          "Meta APIs",
          "PMS integrations"
        ],
        "featured": true
      },
      {
        "slug": "ai-voice-appointment-booking",
        "icon": "AudioLines",
        "title": "AI Voice Doctor Appointment Booking",
        "category": "Applied AI · Voice",
        "summary": "A phone-based appointment booking workflow using AWS Connect, transcription and a Node.js backend.",
        "description": "Redesigned a broad conversational prompt into deterministic stages for collecting details, selecting doctors and choosing appointment slots.",
        "contribution": [
          "Built staged LLM workflows for patient details, doctor selection and appointment scheduling.",
          "Used PostgreSQL to persist session state and support backtracking.",
          "Used tool calls to fetch only the availability required at each step."
        ],
        "technologies": [
          "Node.js",
          "PostgreSQL",
          "AWS Connect",
          "Transcription",
          "LLM workflows"
        ],
        "featured": true
      },
      {
        "slug": "courtside",
        "icon": "Trophy",
        "title": "Courtside",
        "category": "Full Stack · Web & Mobile",
        "summary": "A pickleball community and tournament platform supporting event creation, tournament operations and live scoring.",
        "description": "A full-stack web and mobile platform with tournament formats and match operations.",
        "contribution": [
          "Built features using React, React Native, Node.js and PostgreSQL.",
          "Implemented round robin, single elimination, double elimination, Swiss and group-stage formats.",
          "Worked on magic-link event pages, live scores, court assignments, brackets and winner calculations."
        ],
        "technologies": [
          "React",
          "React Native",
          "Node.js",
          "PostgreSQL"
        ],
        "featured": true
      },
      {
        "slug": "fasttrackehr-and-minutzz",
        "icon": "Workflow",
        "title": "FastTrackEHR & Minutzz",
        "category": "Backend · Cloud workflows",
        "summary": "Healthcare and productivity applications involving APIs, database workflows and transcription-driven processing.",
        "description": "Worked on APIs and database development, with AWS transcription and OpenAI processing used to generate structured information from audio.",
        "contribution": [
          "Built and supported APIs and database workflows.",
          "Worked with AWS S3 and transcription services.",
          "Supported structured information generation from transcribed audio."
        ],
        "technologies": [
          "Node.js",
          "PostgreSQL",
          "AWS S3",
          "AWS Transcribe",
          "OpenAI"
        ],
        "featured": false
      }
    ],
    "services": {
      "eyebrow": "How I can help",
      "title": "Services & collaboration",
      "description": "Practical engineering support for teams and businesses building useful products.",
      "items": [
        {
          "icon": "Server",
          "title": "Backend development",
          "text": "REST APIs, backend workflows and reliable application services.",
          "service": "backend-development"
        },
        {
          "icon": "BrainCircuit",
          "title": "AI integration",
          "text": "LLM applications, RAG pipelines and practical AI agent workflows.",
          "service": "ai-integration"
        },
        {
          "icon": "Link2",
          "title": "API integrations",
          "text": "Third-party APIs, webhooks and service-to-service integrations.",
          "service": "api-integrations"
        },
        {
          "icon": "Database",
          "title": "Database development",
          "text": "PostgreSQL schema design, data modelling and query workflows.",
          "service": "database-development"
        },
        {
          "icon": "Code2",
          "title": "Full-stack development",
          "text": "End-to-end web applications with a backend-first approach.",
          "service": "full-stack-development"
        }
      ]
    },
    "opportunities": {
      "eyebrow": "What's next",
      "title": "Open to meaningful work",
      "description": "I'm interested in good engineering problems, thoughtful teams and collaborations that create useful products.",
      "items": [
        {
          "icon": "BriefcaseBusiness",
          "tag": "CAREER",
          "title": "Backend & full-stack roles",
          "text": "Backend Developer, Full Stack Developer, Python Developer and Applied AI / GenAI application roles.",
          "linkLabel": "Discuss an opportunity",
          "href": "mailto:{email}?subject=Career%20opportunity"
        },
        {
          "icon": "Handshake",
          "tag": "FREELANCE",
          "title": "Project collaborations",
          "text": "Backend APIs, AI integrations, third-party integrations and full-stack application development.",
          "linkLabel": "Start a conversation",
          "href": "#contact"
        }
      ]
    },
    "contact": {
      "eyebrow": "Get in touch",
      "title": "Have something\n{in mind?}",
      "description": "Tell me a little about what you're building. I'll get back to you by email."
    },
    "assistant": {
      "greeting": "Hi! I'm Byte, the AI assistant on this site. Ask me about Amaljith's experience, projects or services, or tell me what you're building."
    }
  },
  "theme": {
    "colors": {
      "background": "#070b13",
      "surface": "#0e1624",
      "surfaceElevated": "#131e30",
      "text": "#f4f7fc",
      "mutedText": "#9aa9bf",
      "border": "#1b293d",
      "borderStrong": "#2b405c",
      "primary": "#3d8bff",
      "primaryHover": "#7db3ff",
      "primarySoft": "#11294b",
      "onPrimary": "#ffffff",
      "solidBackground": "#ffffff",
      "solidForeground": "#0b1220",
      "glow": "#3d8bff66",
      "grid": "#ffffff09",
      "shadow": "0 24px 60px #00000066",
      "navBackground": "#070b13c4",
      "heroGlowA": "#5a82c133",
      "heroGlowB": "#3d8bff1c",
      "haloA": "#2a6bd1",
      "haloB": "#0b2653",
      "portraitShadow": "#0008",
      "accent": "#7db3ff"
    },
    "light": {
      "colors": {
        "background": "#f6f5f1",
        "surface": "#ffffff",
        "surfaceElevated": "#eef1f6",
        "text": "#0f1828",
        "mutedText": "#5b6a81",
        "border": "#e1e5ed",
        "borderStrong": "#c6cfdc",
        "primary": "#2f6bea",
        "primaryHover": "#4f8bff",
        "primarySoft": "#e3ecff",
        "onPrimary": "#ffffff",
        "solidBackground": "#0f1828",
        "solidForeground": "#ffffff",
        "glow": "#2f6bea40",
        "grid": "#0f182808",
        "shadow": "0 24px 60px #1b2a3d1f",
        "navBackground": "#f6f5f1d0",
        "heroGlowA": "#9db8f02e",
        "heroGlowB": "#2f6bea14",
        "haloA": "#5b8def",
        "haloB": "#cfe0ff",
        "portraitShadow": "#1b2a3d3d",
        "accent": "#4f8bff"
      }
    },
    "typography": {
      "bodyFont": "'DM Sans', sans-serif",
      "headingFont": "'Manrope', sans-serif"
    },
    "radius": {
      "card": "18px",
      "button": "12px"
    }
  },
  "features": {
    "isAssistantEnabled": true
  }
};
