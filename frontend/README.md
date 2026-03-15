# Research Paper Tracker — Frontend

React 18 frontend for the Research Paper Tracker application.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Smooth Scroll | Lenis |
| Charts | Recharts |
| HTTP | Axios (with interceptors + auto token refresh) |
| Notifications | react-hot-toast |
| Icons | react-icons |

## Project Structure

```
src/
├── App.js                        # Router + Lenis init
├── index.js                      # Entry point
├── index.css                     # Global styles + CSS vars
├── context/
│   └── AuthContext.js            # Global auth state
├── services/
│   └── api.js                    # Axios instance + all API calls
├── pages/
│   ├── Auth/Auth.jsx             # Login + Register page
│   ├── Dashboard/Dashboard.jsx   # Overview stats + recent papers
│   ├── Research/Research.jsx     # Paper library with filters + CRUD
│   ├── Analytics/Analytics.jsx   # 4 charts + summary table
│   └── Settings/Settings.jsx     # Profile + change password
└── components/
    ├── layout/
    │   ├── DashboardLayout.jsx   # Layout wrapper
    │   ├── Header.jsx            # Top bar with user dropdown
    │   └── Sidebar.jsx           # Collapsible nav sidebar
    ├── common/
    │   ├── LoadingSpinner.jsx    # Full-screen loader
    │   └── BackgroundGlow.jsx    # Ambient background effect
    └── papers/
        └── AddPaperModal.jsx     # Add / Edit paper modal
```

## Getting Started

### 1. Install

```bash
cd frontend
npm install
```

### 2. Configure

```bash
cp .env.example .env
# Set REACT_APP_API_URL to your backend URL
```

### 3. Run

```bash
npm start
# Opens http://localhost:3000
```

## Pages

### Auth (`/login`)
- Login / Register with form validation
- JWT access + refresh token storage
- Auto-redirect if already authenticated

### Dashboard (`/dashboard`)
- 4 summary stat cards (total, read, in-progress, completion rate)
- Recent papers timeline
- Stage breakdown chart

### Research Library (`/research`)
- Grid of paper cards
- Multi-select filters: Reading Stage, Domain, Impact Score, Date Range
- Sort by date, citation count, title
- Add / Edit / Delete papers
- Pagination

### Analytics (`/analytics`)
- Reading Stage Funnel (animated bars)
- Citation vs Impact Scatter Plot
- Domain × Reading Stage Stacked Bar
- Avg Citations per Domain summary table

### Settings (`/settings`)
- Profile info display
- Change password with validation
- Security status display

## Features

- **Lenis smooth scroll** — butter-smooth scrolling throughout
- **Protected routes** — JWT auth guard with auto redirect
- **Token refresh** — Axios interceptor silently refreshes expired tokens
- **Dark theme** — #0a0c0b base with #06f988 neon accent
- **Framer Motion** — page transitions, stagger animations, hover effects
- **Responsive** — works on mobile (collapsible sidebar)
