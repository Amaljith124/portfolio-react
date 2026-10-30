export const projects = [
  {
    slug: 'ai-hotel-guest-support-agent',
    title: 'AI Hotel Guest Support Agent',
    category: 'Applied AI · Production',
    summary: 'An AI-powered guest support agent that answers hotel questions using internal documentation, handles guest issues and supports human escalation.',
    description: 'Worked on retrieval, agent workflows and integrations that connect guest conversations with hotel systems.',
    contribution: [
      'Worked on RAG retrieval using embeddings, FAISS similarity search and Maximal Marginal Relevance.',
      'Improved prompts, workflows and LLM tool calling for practical guest-support tasks.',
      'Integrated WhatsApp through Meta APIs.',
      'Connected Protel, OwnerRez and Hostfully through APIs and webhooks.'
    ],
    technologies: [
      'Python',
      'Node.js',
      'FAISS',
      'RAG',
      'PostgreSQL',
      'Meta APIs',
      'PMS integrations'
    ],
    featured: true
  },
  {
    slug: 'ai-voice-appointment-booking',
    title: 'AI Voice Doctor Appointment Booking',
    category: 'Applied AI · Voice',
    summary: 'A phone-based appointment booking workflow using AWS Connect, transcription and a Node.js backend.',
    description: 'Redesigned a broad conversational prompt into deterministic stages for collecting details, selecting doctors and choosing appointment slots.',
    contribution: [
      'Built staged LLM workflows for patient details, doctor selection and appointment scheduling.',
      'Used PostgreSQL to persist session state and support backtracking.',
      'Used tool calls to fetch only the availability required at each step.'
    ],
    technologies: [
      'Node.js',
      'PostgreSQL',
      'AWS Connect',
      'Transcription',
      'LLM workflows'
    ],
    featured: true
  },
  {
    slug: 'courtside',
    title: 'Courtside',
    category: 'Full Stack · Web & Mobile',
    summary: 'A pickleball community and tournament platform supporting event creation, tournament operations and live scoring.',
    description: 'A full-stack web and mobile platform with tournament formats and match operations.',
    contribution: [
      'Built features using React, React Native, Node.js and PostgreSQL.',
      'Implemented round robin, single elimination, double elimination, Swiss and group-stage formats.',
      'Worked on magic-link event pages, live scores, court assignments, brackets and winner calculations.'
    ],
    technologies: [
      'React',
      'React Native',
      'Node.js',
      'PostgreSQL'
    ],
    featured: true
  },
  {
    slug: 'fasttrackehr-and-minutzz',
    title: 'FastTrackEHR & Minutzz',
    category: 'Backend · Cloud workflows',
    summary: 'Healthcare and productivity applications involving APIs, database workflows and transcription-driven processing.',
    description: 'Worked on APIs and database development, with AWS transcription and OpenAI processing used to generate structured information from audio.',
    contribution: [
      'Built and supported APIs and database workflows.',
      'Worked with AWS S3 and transcription services.',
      'Supported structured information generation from transcribed audio.'
    ],
    technologies: [
      'Node.js',
      'PostgreSQL',
      'AWS S3',
      'AWS Transcribe',
      'OpenAI'
    ],
    featured: false
  }
];
