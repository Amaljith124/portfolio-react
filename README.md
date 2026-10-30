# Frontend

React + Vite + JavaScript + SCSS portfolio website.

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

Demo mode is enabled by default. It uses local project data and simulated enquiry/chat responses.

## Connect to Node
Set:
```env
VITE_API_BASE_URL=http://localhost:5000/api/general
VITE_DEMO_MODE=false
```

The browser calls Node only. Do not put Gemini, Resend or PostgreSQL credentials in Vite environment variables.

## Portrait
The handoff includes `public/images/amaljith-portrait.jpg`, copied from the user-provided photograph. It is the original photo, not a background-removed edit. Replace it with an approved transparent cutout later if desired.
