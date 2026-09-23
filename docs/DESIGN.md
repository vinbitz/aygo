# AYGO Home Screen Design Guide

Reference for the home screen design (commit `c0e11f4` on branch `claude/github-improvement-review-y630pv`). Keep these rules when changing the UI.
Live preview of this version: https://claude.ai/artifact/E3oHgi3iLeh8XqHjF6G2cP (private).

## Layout
- **Mobile:** map fills the top ~42% of the screen; the bottom sheet starts below it and scrolls up over the map. Never cover the search bar on first load.
- **Desktop (lg+):** the sheet becomes a floating 400px panel on the left (`top-20`, `left-6`), scrolling on its own.
- Sheet sections, top to bottom:
  1. Search bar: **"What do you need made?"** (no recent list under it)
  2. Two request-type tiles: **Single Category** ("One item or service type") and **Event Package** ("Multi-category bundle")
  3. Scrollable category chips: Apparel, Event Print, Drinkware, Bags & Swag (no "NEW" badges)
  4. **Choose a maker** (handshake icon): horizontal bid cards → order tracker (Proofing → Printing → Pack → Dispatch) → "Chat with maker"

## Visual style
| Token | Value |
| --- | --- |
| Brand / primary action | `#003CF5` |
| Sheet background (gaps between sections) | `#F2F1ED` |
| Tile / input background | `#F4F3F0` (hover `#ECEAE5`) |
| Section cards | white, `rounded-[28px]` |
| Tiles | `rounded-2xl` |
| Body text | 15px medium, slate-900; secondary 12–13px slate-500 |
| Headings | 19px semibold |

- Icons: lucide-react, shown in soft tinted circles (blue, violet, amber, emerald, rose). Blue fill is reserved for the main button.
- Keep type light: prefer `font-medium`/`font-semibold`; avoid `font-black` and tiny 8–10px uppercase labels.
- Inspired by ride-hailing apps but not a copy: no 3D illustrations, AYGO blue accent, bid cards with prices.

## Source
- Home sheet: `src/components/AygoSourcingView.jsx` (`REQUEST_TYPES`, `CATEGORY_TILES`, `MAKER_BIDS`, `ORDER_STEPS` at the top)
- Map + top buttons: `src/components/AygoGoogleMap.jsx`

## Restoring this version
```bash
git checkout c0e11f4 -- src/components/AygoSourcingView.jsx src/components/AygoGoogleMap.jsx src/index.css
```

## UI kit (`src/components/ui`)
Use these instead of hand-rolled markup so every screen feels the same:

| Component | Use for |
| --- | --- |
| `Sheet` | Every popup. Bottom sheet on phones, centered dialog on desktop. Props: `title`, `subtitle`, `icon`, `onClose`, `footer`, `size` (sm/md/lg/xl). Handles Esc, backdrop click, scroll lock. |
| `Button` | `variant`: primary (one per view), secondary, outline, ghost, danger, success. `size`: sm/md/lg. `full`, `icon`. |
| `Field` + `Input`/`Textarea`/`Select` | Forms. Label above, hint/error below. |
| `Badge`, `VerifiedBadge` | Status labels. Verified suppliers always show `VerifiedBadge`. |
| `Chip` | Filters and quick picks (selected = dark). |
| `Tabs` | Segmented switch between views inside a sheet. |
| `ListRow` + `IconCircle` | Menu items and settings rows. |
| `Section`, `Panel` | Titled groups; soft grey panel. |
| `EmptyState` | Lists with no items. |
| `toast()` (`src/lib/toast`) | Feedback after actions. Never use `alert()`. |

Rules: one primary button per view, sticky in the `footer` when it completes the flow; 44px minimum tap targets; sentence-case labels (no ALL CAPS), no text under 11px.

## Brand
- Marks live in `src/assets/brand/` (cut from `public/aygo-wordmark.jpg` and `public/aygo-app-icon.jpg`): `wordmark-blue.png`, `wordmark-white.png`, `icon-192.png`. Use them through `<Logo />` (`variant="wordmark" | "icon"`, `tone="blue" | "white"`).
- Placements: side menu header, desktop sheet header, "Get the app" card, Pro screen, generated documents, splash screen (`index.html`).
- Taglines: use "You Plan. We Connect." and "Make It Aygo." Do not use the banner line "go with the trends."
- Brand blue `#003CF5` (UI); app icon background `#0060FC` (splash, theme color).

## Home layout update
- The sheet holds only the core flow: search, request type + categories, live offers, and the "Get the app" card.
- Sponsorship Connect and Tools are floating buttons on the map (right side, above the locate button). Tools opens a sheet with Event workspace, AI mockup studio, Quotes & documents and Compare offers.

## Pro (free vs Aygo Pro)
- Pro tools: Aygo Assist, AI mockup studio, branded documents, offer comparison, event workspace (`src/lib/pro.js`).
- Free plan: 3 uses of each (`FREE_USES`), counted on open; then the Aygo Pro screen (`ProUpgradeSheet`). Always free: posting requests, offers, chat, accepting, Sponsorship Connect.
- Gate new Pro features with `usePro().gate('feature', open)`; show remaining tries with `remaining('feature')`.
- Prices in `ProUpgradeSheet.jsx` (`PRO_PRICING`) are placeholders.

## Catalog ("Find anything")
- `src/data/catalog.js`: 13 categories, ~85 products, gift kits and event services, 18 occasions, with options, customization methods, minimum order and lead time. Prices always come from maker offers.
- The home search bar and category chips open `CatalogSheet`. Picking an item opens its details, then "Get offers" pre-fills the request form. Anything not listed goes through "Describe anything".
- Every catalog category must have at least 2 makers (`categories` on each supplier in `mockData.js`).
