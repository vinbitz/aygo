# AYGO Platform Engineering Architecture & Handoff Document

Platform: aygo.store  
Positioning: AYGO — You Plan. We Connect.  
Taglines: Make It Aygo. | go with the trends.  
Target Release: Web + Mobile Responsive App (Philippines First, Multi-Country Affiliate Waitlist)

## 0. Monorepo Target Architecture

```
aygo/
├── apps/
│   ├── web/          # Main platform (Web application console)
│   ├── mobile/       # Mobile app (inDrive-inspired mobile UI)
│   └── landing/      # Public landing page (Separate conversation)
├── packages/
│   ├── ui/           # Shared components and branding
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configurations
└── package.json
```

---

## 1. Executive Summary & Core Workflow

AYGO replaces manual, fragmented event sourcing (endless Facebook Messenger threads, delayed quotations, and opaque pricing) with a centralized marketplace powered by an Aygo-inspired peer-to-peer bidding engine.

### Core Loop:
1. **Post Sourcing Request (Smart Event Sourcing)**: Organizers describe their requirement in plain language or structured input (item, quantity, budget, location, deadline, customization, and reference images).
2. **Competitive Aygo Bidding**: Verified local suppliers within geographic reach receive the broadcast. Rather than accepting a single rigid posted price, suppliers submit competing bids (unit price, production lead time, committed delivery date, inclusions, and custom proposals).
3. **Compare & Negotiate**: Organizers compare bids side-by-side (price, rating, turnaround, location proximity, and terms), accept the winning bid, or propose an competitive bidding counter-offer.
4. **Connect & Finalize**: Organizers and suppliers finalize details via Aygo Chat, AI mockup previews, and automated branded procurement documents (RFQs, Purchase Orders, Delivery Checklists).

---

## 2. Platform Component Breakdown

### A. competitive bidding Sourcing & Bidding Map
- **Geographic Sourcing Hubs**: Taytay (Garments), Marikina (Bags & Leather), Parañaque (Sublimation & Print), Valenzuela (Drinkware & Laser), Quezon City, BGC, and Makati.
- **Aygo Bottom Sheet**:
  - Input field: "What to print & for how much?"
  - Dynamic delivery destination selector (e.g. Common Ground Rockwell, Grand Hyatt BGC, UP Diliman).
  - Quick category tiles: Apparel & Uniforms, Bags & Totes, Drinkware & Tumblers, Event Print & Lanyards.
  - Competing supplier bids with instant counter-offer functionality.

### B. Verified Supplier Profile
- **Header**: Branded cover, factory avatar, verified partner badge, rating, completed jobs count, and on-time delivery rate.
- **Tab 1: Services & Capabilities**: Printing methods (Silkscreen, DTF, Embroidery, Sublimation, Laser, UV Flatbed), machine capacities, MOQ, and supported blanks.
- **Tab 2: Location & Logistics**: Physical facility address, transit distance/time to event venue, courier dispatch options (Lalamove, Borzo, Grab Express, in-house van, provincial cargo), and pickup bay hours.
- **Tab 3: Aygo Bidding**: Live bid price per piece, cost breakdown, inclusions, counter-offer proposal input, and Aygo Chat trigger.
- **Tab 4: Storefront Bio**: Company history, factory profile, and direct points of contact.
- **Aygo Pro Feature**: "Book a Call" calendar integration for large-scale custom consultations.

### C. AI Mockup Generator
- Select blank apparel, drinkware, bags, or event banners.
- Upload vector logo or input branding copy.
- Real-time client preview that attaches directly to supplier RFQs.

### D. Quote & Document Generator
- Generates standardized, auto-branded PDF documents:
  - Request for Quotation (RFQ)
  - Supplier Quotation
  - Purchase Order (PO)
  - Bid Comparison Sheet
  - Delivery & On-Site Event Checklist

### E. Aygo Sponsorship Connect
- Connects student and tech community event organizers with corporate brand sponsors.
- Organizers post event decks, expected attendance, and sponsorship tiers.
- Brand partners review opportunities and offer in-kind or cash sponsorship packages.

### F. Global Partner Program
- Philippines launch first.
- International expansion waitlist with regional affiliate commission registration.

---

## 3. Database Schema Specification (PostgreSQL / Supabase)

```sql
-- 1. Users and Profiles
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('organizer', 'supplier', 'admin', 'sponsor')) NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Supplier Profiles (Verified)
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  tagline TEXT,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_pro BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  reviews_count INT DEFAULT 0,
  on_time_rate NUMERIC(5, 2) DEFAULT 100.00,
  avg_lead_time_days INT DEFAULT 5,
  daily_capacity INT DEFAULT 1000,
  cover_image_url TEXT,
  avatar_url TEXT,
  bio TEXT,
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Supplier Services & Techniques
CREATE TABLE supplier_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  technique_name TEXT NOT NULL, -- Silkscreen, DTF, Embroidery, etc.
  moq INT NOT NULL DEFAULT 50,
  turnaround_days INT NOT NULL,
  price_tier TEXT,
  description TEXT
);

-- 4. Sourcing Requests (Organizers)
CREATE TABLE sourcing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INT NOT NULL,
  target_budget NUMERIC(12, 2) NOT NULL,
  target_price_per_unit NUMERIC(10, 2) NOT NULL,
  delivery_location TEXT NOT NULL,
  delivery_lat DOUBLE PRECISION,
  delivery_lng DOUBLE PRECISION,
  delivery_date DATE NOT NULL,
  event_date DATE,
  customization_specs TEXT,
  mockup_image_url TEXT,
  status TEXT CHECK (status IN ('draft', 'open', 'reviewing', 'awarded', 'fulfilled', 'cancelled')) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Supplier Offers (Suppliers)
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES sourcing_requests(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  lead_time_days INT NOT NULL,
  committed_delivery_date DATE NOT NULL,
  inclusions TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('submitted', 'counter_offered', 'accepted', 'declined', 'expired')) DEFAULT 'submitted',
  counter_price_per_unit NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sponsorship Listings
CREATE TABLE sponsorship_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  expected_attendance INT NOT NULL,
  event_date DATE NOT NULL,
  venue TEXT NOT NULL,
  deck_url TEXT,
  seeking_tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. WebSocket & Real-Time Bidding Events

For the cloud and software engineering team implementing the real-time Aygo experience:

| Event Name | Direction | Payload Description |
| :--- | :--- | :--- |
| `request:broadcast` | Server -> Suppliers | Dispatches new request to verified suppliers matching category and radius. |
| `bid:submit` | Supplier -> Server | Supplier submits price per unit, turnaround, delivery date, and inclusions. |
| `bid:new` | Server -> Organizer | Real-time push notifying organizer of a new competing offer. |
| `bid:counter` | Organizer <-> Supplier | Proposes a counter-offer price per unit for live price negotiation. |
| `bid:accept` | Organizer -> Server | Locks in winning bid and triggers PO and chat generation. |

---

## 5. Local Development & Deployment

The complete working frontend is compiled and verified in this repository:
Directory: `C:\Users\Marvin Barrios\.gemini\antigravity\scratch\aygo-app`

### Running the Development Server:
```bash
cd "C:\Users\Marvin Barrios\.gemini\antigravity\scratch\aygo-app"
cmd.exe /c "npm run dev"
```

### Production Build:
```bash
cmd.exe /c "npm run build"
```
The output is bundled into the `dist/` directory, ready for deployment to Vercel, AWS S3/CloudFront, or Google Cloud Run.
