export const CATEGORIES = [
  { id: 'apparel', name: 'Apparel & Uniforms', count: 42, icon: 'Shirt' },
  { id: 'bags', name: 'Bags & Totes', count: 28, icon: 'ShoppingBag' },
  { id: 'drinkware', name: 'Drinkware & Tumblers', count: 35, icon: 'Coffee' },
  { id: 'event-print', name: 'Event Print & Lanyards', count: 50, icon: 'Printer' },
  { id: 'eco', name: 'Eco Line & Wooden Wares', count: 18, icon: 'Leaf' },
  { id: 'tech', name: 'Tech & Gadgets', count: 22, icon: 'Cpu' },
  { id: 'booths', name: 'Booths & Event Equipment', count: 15, icon: 'Layers' },
];

export const PRESET_VENUES = [
  {
    id: 'arthaland',
    name: 'Arthaland Century Pacific Tower',
    address: '4th Ave, 30th St, Taguig, Metro Manila',
    city: 'BGC, Taguig',
    lat: 14.5518,
    lng: 121.0475,
    type: 'venue'
  },
  {
    id: 'bgc-arts',
    name: 'BGC Arts Center',
    address: '26th St cor 9th Ave, Bonifacio Global City, Taguig',
    city: 'BGC, Taguig',
    lat: 14.5492,
    lng: 121.0505,
    type: 'venue'
  },
  {
    id: 'smx-manila',
    name: 'SMX Convention Center Manila',
    address: 'Seashell Lane, Mall of Asia Complex, Pasay City',
    city: 'Pasay City',
    lat: 14.5322,
    lng: 120.9818,
    type: 'venue'
  },
  {
    id: 'wtc-manila',
    name: 'World Trade Center Metro Manila',
    address: 'Gil Puyat Ave cor Diosdado Macapagal Blvd, Pasay City',
    city: 'Pasay City',
    lat: 14.5519,
    lng: 120.9866,
    type: 'venue'
  },
  {
    id: 'makati-shangri',
    name: 'Makati Shangri-La / Ayala Center',
    address: 'Ayala Ave cor Makati Ave, Makati City',
    city: 'Makati City',
    lat: 14.5532,
    lng: 121.0261,
    type: 'venue'
  }
];

export const PRESET_HOMES = [
  {
    id: 'salcedo-peak',
    name: 'The Peak Tower, Salcedo Village',
    address: 'Unit 802, The Peak Tower, Salcedo Village, Makati',
    city: 'Makati City',
    lat: 14.5585,
    lng: 121.0220,
    type: 'home'
  },
  {
    id: 'bgc-highstreet',
    name: 'Bonifacio High Street HQ',
    address: '7th Ave cor 28th St, BGC, Taguig',
    city: 'BGC, Taguig',
    lat: 14.5505,
    lng: 121.0520,
    type: 'home'
  }
];

export const PRINT_METHODS = [
  'Silkscreen',
  'DTF (Direct-to-Film)',
  'Embroidery',
  'Sublimation',
  'Laser Engraving',
  'UV Flatbed Print',
  'Pad Print',
  'Foil Stamping'
];

export const SUPPLIERS = [
  {
    id: 's1',
    shortName: 'Thread & Co.',
    categories: ['apparel', 'event-print', 'bags'],
    verified: true,
    km: 12.4,
    name: 'Thread & Co. Apparel Solutions',
    tagline: "Taytay's premier automated screen & DTF garment house",
    badge: 'Verified Aygo Partner',
    rating: 4.9,
    reviewsCount: 142,
    onTimeRate: '99.2%',
    avgLeadTime: '5-7 business days',
    city: 'Taytay, Rizal',
    address: 'Highway 2000, Brgy. San Juan, Taytay, Rizal',
    lat: 14.568,
    lng: 121.132,
    distanceFromVenue: '12.4 km from BGC',
    contactPerson: 'Patricia Santos',
    phone: '+63 917 555 0101',
    email: 'patricia@threadco.example',
    terms: '50% downpayment, balance upon delivery',
    coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Established in Taytay Garment Capital. We run an 8-color automatic MHM screen printing oval press, 4 high-speed DTF printers, and a 4-head Barudan embroidery system with a daily capacity of 3,000 shirts. Specialized in corporate uniforms, university merchandise, and tech conference swag.',
    services: [
      { name: 'Silkscreen Printing', moq: 50, turnaround: '4-6 days', priceTier: 'Economical' },
      { name: 'DTF Full Color', moq: 20, turnaround: '2-4 days', priceTier: 'Mid-range' },
      { name: 'Computerized Embroidery', moq: 30, turnaround: '5-7 days', priceTier: 'Premium' },
      { name: 'Custom Woven Neck Tags & Polybagging', moq: 100, turnaround: '3 days', priceTier: 'Add-on' }
    ],
    supportedBlanks: ['200-240 GSM Combed Cotton', 'CVC Cotton Blend', 'Interlock Poly-DriFit', 'French Terry Hoodies'],
    dispatchOptions: ['Lalamove MPV / Van ready', 'Borzo dispatch', 'In-house delivery van (Metro Manila)', 'LBC / 2GO for provincial'],
    pickupHours: 'Monday - Saturday: 8:00 AM - 7:00 PM',
    proStorefront: true
  },
  {
    id: 's2',
    shortName: 'Manila Bag Works',
    categories: ['bags', 'eco'],
    verified: true,
    km: 15.1,
    name: 'Manila Bag Works & Leathercraft',
    tagline: 'Custom canvas totes, backpacks, and event pouches',
    badge: 'Verified Aygo Partner',
    rating: 4.8,
    reviewsCount: 98,
    onTimeRate: '98.5%',
    avgLeadTime: '6-8 business days',
    city: 'Marikina City',
    address: 'Shoe Avenue, Brgy. San Roque, Marikina City',
    lat: 14.650,
    lng: 121.099,
    distanceFromVenue: '15.1 km from BGC',
    contactPerson: 'Marco Reyes',
    phone: '+63 917 555 0102',
    email: 'marco@manilabags.example',
    terms: 'Net 15 approved accounts',
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Crafted in Marikina. Over 15 years producing heavy-duty canvas tote bags, custom drawstring pouches, conference sling bags, and personalized leather accessories for Fortune 500 events and university summits.',
    services: [
      { name: 'Heavy Canvas Totes (12oz / 14oz)', moq: 50, turnaround: '5-7 days', priceTier: 'Best Seller' },
      { name: 'Drawstring Bags (Water-resistant Nylon)', moq: 100, turnaround: '4-5 days', priceTier: 'Economical' },
      { name: 'Debossed Leatherette Luggage Tags', moq: 50, turnaround: '5-7 days', priceTier: 'Corporate' }
    ],
    supportedBlanks: ['Unbleached Off-white Canvas', 'Black / Navy Heavy Twill', 'Ripstop Nylon', 'Recycled PET Fabric'],
    dispatchOptions: ['Pickup counter', 'Lalamove Courier', 'Grab Express', 'Freight forwarder'],
    pickupHours: 'Monday - Friday: 8:30 AM - 6:00 PM',
    proStorefront: true
  },
  {
    id: 's3',
    shortName: 'JJT Digital',
    categories: ['event-print', 'apparel', 'booths'],
    verified: true,
    km: 11.8,
    name: 'JJT Digital Innovative Print',
    tagline: 'Lanyards, ID badges, stickers, and roll-up event prints',
    badge: 'Verified Aygo Partner',
    rating: 4.9,
    reviewsCount: 215,
    onTimeRate: '99.5%',
    avgLeadTime: '3-5 business days',
    city: 'Parañaque City',
    address: 'Dr. A. Santos Ave, Sucat, Parañaque City',
    lat: 14.479,
    lng: 121.015,
    distanceFromVenue: '11.8 km from Makati',
    contactPerson: 'Sales Team JJT',
    phone: '+63 917 143 5890',
    email: 'sales.jtdigital@gmail.com',
    terms: '50% downpayment, balance on pickup',
    coverImage: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: 'Industrial heat transfer and sublimation facility specializing in high-definition satin lanyards, RFID conference badges, weatherproof vinyl stickers, and pull-up banners. Rush 48-hour turnarounds available for approved graphics.',
    services: [
      { name: 'Full-Color Sublimation Lanyards', moq: 100, turnaround: '3-4 days', priceTier: 'Competitive' },
      { name: 'RFID PVC Event Badges', moq: 100, turnaround: '3-5 days', priceTier: 'Tech Events' },
      { name: 'Die-cut Matte/Glossy Sticker Packs', moq: 200, turnaround: '2-3 days', priceTier: 'Fast Run' },
      { name: 'Retractable Aluminum Roll-Up Banners', moq: 1, turnaround: '24-48 hours', priceTier: 'Event Gear' }
    ],
    supportedBlanks: ['Polyester Satin', 'Smooth Nylon Ribbon', 'Waterproof Vinyl Sheets', 'Matte Lam PVC'],
    dispatchOptions: ['Direct van courier', 'Grab Express', 'Lalamove', 'Airspeed Air Cargo'],
    pickupHours: 'Monday - Saturday: 8:00 AM - 8:00 PM',
    proStorefront: true
  },
  {
    id: 's4',
    shortName: 'Everyday Drinkware',
    categories: ['drinkware', 'eco'],
    verified: true,
    km: 19.5,
    name: 'Everyday Drinkware & Custom Vessels',
    tagline: 'Laser-engraved thermal tumblers, coffee mugs, and water bottles',
    badge: 'Verified Aygo Partner',
    rating: 4.7,
    reviewsCount: 84,
    onTimeRate: '97.8%',
    avgLeadTime: '4-6 business days',
    city: 'Valenzuela City',
    address: 'McArthur Highway, Karuhatan, Valenzuela City',
    lat: 14.685,
    lng: 120.978,
    distanceFromVenue: '19.5 km from BGC',
    contactPerson: 'Bea Lim',
    phone: '+63 917 555 0103',
    email: 'bea@everyday.example',
    terms: 'Cash on delivery / Bank transfer',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    bio: 'Dedicated beverage container personalization hub. Utilizing rotary fiber lasers and UV rotary cylindrical printers capable of 360-degree seamless prints on stainless steel tumblers, ceramic mugs, and double-wall egg mugs.',
    services: [
      { name: 'Rotary Fiber Laser Engraving', moq: 30, turnaround: '3-5 days', priceTier: 'Permanent Mark' },
      { name: 'Full Wrap UV Rotary Print', moq: 50, turnaround: '4-6 days', priceTier: 'Full Color' },
      { name: 'Custom Kraft Gift Packaging', moq: 50, turnaround: '3 days', priceTier: 'Packaging' }
    ],
    supportedBlanks: ['SUS304 Stainless Steel', 'Borosilicate Glass', 'Ceramic Matte', 'Bamboo Lid Caps'],
    dispatchOptions: ['Lalamove Long Bed', 'In-house courier', 'Forwarding to VisMin'],
    pickupHours: 'Monday - Friday: 9:00 AM - 5:30 PM',
    proStorefront: false
  },
  {
    id: 's5',
    shortName: 'Makati Print Hub',
    categories: ['event-print', 'apparel', 'booths'],
    verified: true,
    km: 3.2,
    name: 'Makati Print Hub & Event Booths',
    tagline: 'Rush event prints, backdrops and modular booths near the CBD',
    badge: 'Verified Aygo Partner',
    rating: 4.6,
    reviewsCount: 58,
    onTimeRate: '96.4%',
    avgLeadTime: '2-4 business days',
    city: 'Makati City',
    address: 'Chino Roces Ave, Brgy. Pio del Pilar, Makati City',
    lat: 14.548,
    lng: 121.012,
    distanceFromVenue: '3.2 km from BGC',
    contactPerson: 'Joel Ramirez',
    phone: '+63 917 555 0105',
    email: 'hello@makatiprinthub.example',
    terms: '50% downpayment, balance before dispatch',
    coverImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    bio: 'Walk-in friendly print shop beside the Makati CBD. Tarpaulins, photo backdrops, PVC IDs, lanyards and modular booth builds with same-week installation for conferences and activations.',
    services: [
      { name: 'Tarpaulin & Backdrop Printing', moq: 1, turnaround: '24-48 hours', priceTier: 'Rush' },
      { name: 'PVC ID & Lanyard Sets', moq: 50, turnaround: '2-3 days', priceTier: 'Competitive' },
      { name: 'Modular Booth Build & Install', moq: 1, turnaround: '5-7 days', priceTier: 'Event Gear' }
    ],
    supportedBlanks: ['Tarpaulin 13oz', 'PVC 0.76mm', 'Polyester Satin', 'Aluminum Truss'],
    dispatchOptions: ['Same-day Lalamove', 'In-house van with installers', 'Pickup counter'],
    pickupHours: 'Monday - Sunday: 8:00 AM - 9:00 PM',
    proStorefront: false
  },
  {
    id: 's6',
    shortName: 'Pasig Eco Wares',
    categories: ['eco', 'bags', 'drinkware'],
    verified: false,
    km: 7.9,
    name: 'Pasig Eco Wares Collective',
    tagline: 'Bamboo, cork and recycled-material giveaways',
    badge: 'New on Aygo',
    rating: 4.4,
    reviewsCount: 12,
    onTimeRate: '94.0%',
    avgLeadTime: '7-10 business days',
    city: 'Pasig City',
    address: 'Caruncho Ave, San Nicolas, Pasig City',
    lat: 14.561,
    lng: 121.078,
    distanceFromVenue: '7.9 km from BGC',
    contactPerson: 'Lia Mendoza',
    phone: '+63 917 555 0106',
    email: 'lia@pasigeco.example',
    terms: 'Full payment upon order confirmation',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
    bio: 'Community workshop making sustainable event giveaways: bamboo tumblers, cork notebooks, abaca pouches and recycled PET totes, laser-marked with your logo.',
    services: [
      { name: 'Bamboo & Cork Laser Marking', moq: 50, turnaround: '7-9 days', priceTier: 'Eco' },
      { name: 'Recycled PET Tote Sewing', moq: 100, turnaround: '8-10 days', priceTier: 'Eco' }
    ],
    supportedBlanks: ['Bamboo', 'Cork', 'Abaca', 'Recycled PET Fabric'],
    dispatchOptions: ['Lalamove', 'Pickup at workshop'],
    pickupHours: 'Tuesday - Saturday: 10:00 AM - 6:00 PM',
    proStorefront: false
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    title: '300 Full-Color Customized Lanyards',
    client: 'Philippine Tech Summit 2026',
    organizer: 'Miguel Alcantara',
    location: 'UP Diliman, Quezon City',
    deliveryDate: 'October 12, 2026',
    targetBudget: 15000,
    targetPricePerUnit: 50,
    quantity: 300,
    category: 'Event Print & Lanyards',
    specs: '2cm width, smooth satin finish, full color 2-sided sublimation, heavy-duty trigger snap hook + safety breakaway clip.',
    status: 'Bidding in Progress',
    bidsCount: 3,
    bids: [
      {
        id: 'bid-1',
        supplierId: 's3',
        supplierName: 'JJT Digital Innovative Print',
        supplierCity: 'Parañaque City',
        pricePerUnit: 46.00,
        totalPrice: 13800,
        leadTime: '4 business days',
        committedDelivery: 'October 8, 2026',
        inclusions: 'Free digital mockup, individual packaging, safety clip included, free delivery within Metro Manila for orders > PHP 12,000.',
        notes: 'We have pre-slit 20mm satin ribbons in stock. Once artwork vector is approved, production starts immediately.',
        status: 'Counter-Offer'
      },
      {
        id: 'bid-2',
        supplierId: 's1',
        supplierName: 'Thread & Co. Apparel Solutions',
        supplierCity: 'Taytay, Rizal',
        pricePerUnit: 49.50,
        totalPrice: 14850,
        leadTime: '5 business days',
        committedDelivery: 'October 9, 2026',
        inclusions: 'Satin lanyard + trigger hook + PVC badge holder included in bundle.',
        notes: 'Can bundle with ID card printing if required.',
        status: 'Counter-Offer'
      }
    ]
  },
  {
    id: 'req-2',
    title: '500 Heavyweight Dri-Fit Event Shirts',
    client: 'Fintech Leaders Forum',
    organizer: 'Karen De Leon',
    location: 'Grand Hyatt Manila, BGC, Taguig',
    deliveryDate: 'October 18, 2026',
    targetBudget: 100000,
    targetPricePerUnit: 200,
    quantity: 500,
    category: 'Apparel & Uniforms',
    specs: 'Navy Blue shirts, 220 GSM breathable dri-fit or cotton-rich blend. 2-color silkscreen print on chest, 1-color sponsor logo on sleeve. Size breakdown: S: 80, M: 180, L: 160, XL: 60, 2XL: 20.',
    status: 'Bidding in Progress',
    bidsCount: 2,
    bids: [
      {
        id: 'bid-3',
        supplierId: 's1',
        supplierName: 'Thread & Co. Apparel Solutions',
        supplierCity: 'Taytay, Rizal',
        pricePerUnit: 195.00,
        totalPrice: 97500,
        leadTime: '6 business days',
        committedDelivery: 'October 15, 2026',
        inclusions: 'Premium 220 GSM interlock dri-fit, plastisol 2-color screen print, folded and individual polybag packaging with size sticker.',
        notes: 'Fabric rolls currently in warehouse. Navy shade matches your Pantone 288C reference.',
        status: 'Best Match'
      }
    ]
  }
];

export const SPONSORSHIP_LISTINGS = [
  {
    id: 'spon-1',
    eventTitle: 'DevCon Manila Hackathon 2026',
    organization: 'Junior Developers Society (UP & UST Chapter)',
    expectedAttendance: '450 Student & Junior Developers',
    eventDate: 'November 14-15, 2026',
    venue: 'SMX Aura Convention Center, BGC',
    seeking: ['Merchandise Partner (Event Shirts & Lanyards)', 'Cloud Compute Credits', 'Cash Prize Pool'],
    packages: [
      { tier: 'Title Partner', amount: 'PHP 80,000', perks: 'Keynote speaking slot, main logo on lanyards & shirts, booth space' },
      { tier: 'Swag Sponsor', amount: 'PHP 35,000 (or In-Kind)', perks: 'Logo on all attendee tote bags and shirts, resume book access' },
      { tier: 'Community Supporter', amount: 'PHP 15,000', perks: 'Social media recognition, logo on event stream backdrop' }
    ]
  }
];
