# NetflixX AI

A production-ready Netflix-inspired streaming platform built with React + TypeScript + Vite. Features AI-powered recommendations, stunning animations, and a premium dark UI.

## Quick Start

```bash
npm install --legacy-peer-deps
npm run dev
```

Opens at **http://localhost:3000** — no backend needed.

## Features

- **Netflix-style UI**: Hero banner with auto-playing trailers, glassmorphism cards, smooth scrolling
- **Animations**: Framer Motion page transitions, GSAP scroll reveals, 3D card hover effects, floating particles, custom cursor
- **AI Assistant**: Built-in chatbot for movie recommendations, mood-based suggestions
- **Search**: Instant debounced search with genre/language/rating/year filters
- **Video Player**: React Player with custom controls, speed/quality selectors, fullscreen
- **User Dashboard**: Watchlist, favorites, watch history, profile settings (all persisted in localStorage)
- **Admin Panel**: Movie management, analytics dashboard, user management
- **Responsive**: Desktop, tablet, mobile layouts

## Tech Stack

| Library | Purpose |
|---------|---------|
| React 19 + TypeScript | UI framework |
| Vite 7 | Build tool |
| Redux Toolkit | State management |
| React Router DOM v7 | Routing |
| Framer Motion + GSAP | Animations |
| Tailwind CSS | Styling |
| React Player | Video streaming |
| React Icons | Iconography |
| Firebase (optional) | Auth (falls back to mock) |

## No Backend Required

The app comes with **36 pre-loaded movies** (real titles, descriptions, cast) and works fully standalone. User data (watchlist, history, favorites) persists in `localStorage`.

For real data, add a TMDB API key in `.env`:

```
VITE_TMDB_API_KEY=your_key_here
```

For Firebase authentication, add Firebase config in `.env`.

## Project Structure

```
src/
├── components/        # Reusable UI
│   ├── home/          # Hero banner, movie cards, rows
│   ├── movie/         # Video player
│   ├── search/        # Search bar, filters
│   ├── auth/          # Login/signup modal
│   ├── chatbot/       # AI movie assistant
│   ├── dashboard/     # User dashboard widgets
│   ├── admin/         # Admin panel components
│   └── common/        # GlassCard, LoadingScreen, Skeleton, etc.
├── pages/             # Route-level page components
├── store/             # Redux state (auth, movies, user, search)
├── hooks/             # useAuth, useMovies, useSearch
├── services/          # API layer (mock data + optional TMDB)
├── animations/        # Framer Motion variants, particles, cursor
├── layouts/           # Navbar, footer, main layout
├── routes/            # Protected routes, app routes
├── data/              # 36 mock movies with real data
└── types/             # TypeScript interfaces
```

## Build for Production

```bash
npm run build
# Output in dist/
```

Deploy `dist/` to Netlify, Vercel, or any static host.
