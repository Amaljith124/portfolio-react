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
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEMO_MODE=false
```

The browser calls Node only. Do not put Gemini, Resend or PostgreSQL credentials in Vite environment variables.

## Portrait
The handoff includes `public/images/amaljith-portrait.jpg`, copied from the user-provided photograph. It is the original photo, not a background-removed edit. Replace it with an approved transparent cutout later if desired.

## Multi-user portfolio + admin (revision addendum v2)
- `/` is the default portfolio (slug `VITE_DEFAULT_PORTFOLIO_SLUG`), `/p/<slug>` any other user's. Content, theme and the assistant flag come from `GET /api/public/portfolios/:slug`; `src/data/defaultPortfolio.js` is the bundled copy of the seed (shown at once, and the whole site in demo mode).
- `/admin` is the admin / user area (sign-in, dashboard, user list with create / edit, per-user editor with profile, portfolio JSON, images, theme). It needs `VITE_DEMO_MODE=false` and the Node server; the server enforces roles and tenants on every call.
- The theme is applied as CSS custom properties on `<html>` (`--bg`, `--accent`, ... plus `--color-*` aliases and `--font-body` / `--font-heading`); the SCSS only reads those variables.

## Folder layout (src/)
```
pages/
  Home/Home.jsx                      the portfolio page ("/", "/p/<slug>", "/portfolio/<token>")
  ProjectDetail/ProjectDetail.jsx    a project case study
  Admin/
    AdminApp.jsx, Admin.scss         /admin: routes, layout, session guard
    Login/Login.jsx                  /admin/login
    Dashboard/Dashboard.jsx          /admin
    Users/Users.jsx                  /admin/users (list, create and edit modals)
    UserEditor/UserEditor.jsx        /admin/users/:userId (profile, portfolio JSON, images, knowledge document, theme)
components/                          Hero, Navbar, ... and Admin/ (Modal, UserForm, MagicLinkPanel, ThemeEditor, ImageSlot, PortraitSlot)
webservices/                         webservices.js (visitor + public API), adminApi.js (admin API)
```
