# AYGO

**You Plan. We Connect.** A sourcing and bidding platform for event supplies and services in the Philippines. Organizers post what they need, verified local makers bid, and the organizer picks the best offer.

This repo is the web front end (React 19 + Vite + Tailwind CSS). All data is mock data from `src/data/mockData.js`; there is no backend yet.

## What works today (MVP loop)

1. **Tell Aygo what you need**: describe it in plain words ("300 lanyards in QC next month, budget ₱15,000") and Aygo Assist fills in category, quantity and budget. Single category or event package.
2. **Makers compete**: the request goes to verified makers whose categories match; their offers stream in (price, production time, delivery date, inclusions, notes), ranked by best match, lowest price and fastest.
3. **Compare, counter, chat**: compare every offer side by side, send a counter-offer (the maker accepts or meets you halfway), or chat.
4. **Accept**: the booked maker's order moves through Proofing → Printing → Pack → Dispatch.

Around it: supplier storefronts with verification and Pro badges, Book a Call, supplier portal, mockup studio, document generator, Sponsorship Connect, event workspace (budget, requests, checklist), wallet, referrals, and an international waitlist for launch partners.

**Key metric:** successful supplier matches (requests that end with a booked maker), not downloads. `useMarketplace().matchesMade` counts them.

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
├── components/ui/       # Shared UI kit (Sheet, Button, Field, Badge, Chip, Tabs, ListRow...)
├── lib/marketplace.js   # Matching makers, generating/ranking offers, counter-offers
├── lib/toast.js         # toast('message') helper
├── state/useMarketplace.js  # Requests, live offers, accept/counter state
├── services/jevAiService.js # Aygo Assist (AI request parsing, bid scoring)
└── data/mockData.js     # Sample suppliers, venues and requests
```

See `ENGINEERING_HANDOFF.md` for the product and architecture plan, and `docs/DESIGN.md` for the home screen design rules.

## Before going live

- **Backend needed.** Requests, offers, chat, payments and verification are all simulated in the browser.
- **AI key.** `jevAiService.js` calls the AI SDK from the browser (`dangerouslyAllowBrowser`). Any `VITE_*` key is visible to every visitor, so move those calls behind a server endpoint first. Without a key it falls back to local keyword parsing.
- **Google Maps key.** Set `VITE_GOOGLE_MAPS_API_KEY` and restrict it to your domains. The old key is in git history; rotate it.
