# AYGO

**You Plan. We Connect.** A sourcing and bidding platform for event supplies and services in the Philippines. Organizers post what they need, verified local makers bid, and the organizer picks the best offer.

This repo is the web front end (React 19 + Vite + Tailwind CSS). All data is mock data from `src/data/mockData.js`; there is no backend yet.

## Getting started

```bash
npm install
cp .env.example .env   # then add your Google Maps key (optional)
npm run dev            # http://localhost:3000
```

Without `VITE_GOOGLE_MAPS_API_KEY` the app still runs and shows a built-in illustrated map.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project layout

```
src/
├── App.jsx              # App shell: home view + popups (lazy-loaded)
├── components/
│   ├── AygoSourcingView.jsx   # Home screen: map + bottom sheet
│   ├── AygoGoogleMap.jsx      # Map with fallback when no API key
│   ├── Toaster.jsx            # In-app notifications
│   └── ...Modal.jsx           # Feature popups (requests, chat, suppliers, ...)
├── lib/toast.js         # toast('message') helper
└── data/mockData.js     # Sample suppliers, venues and requests
```

See `ENGINEERING_HANDOFF.md` for the product and architecture plan, and `docs/DESIGN.md` for the home screen design rules.
