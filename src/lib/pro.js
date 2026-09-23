// Free-plan limits: every Pro tool can be tried FREE_USES times before the paywall
export const FREE_USES = 3;

// Organizer Pro features from the master plan
export const PRO_FEATURES = {
  assist: { label: 'Aygo Assist', noun: 'AI request fills' },
  mockup: { label: 'AI mockup studio', noun: 'mockup sessions' },
  documents: { label: 'Branded documents', noun: 'document sessions' },
  compare: { label: 'Offer comparison', noun: 'comparisons' },
  workspace: { label: 'Event workspace', noun: 'workspace visits' },
  // Calls have no free tries: they work when either side of the chat has Pro
  calls: {
    label: 'In-app calls',
    headline: 'Calls are a Pro feature.',
    text: 'Call makers, brands and organizers inside Aygo. It works when either of you has Pro.',
  },
};

/** A call can start when the viewer or the other person is on Pro */
export const canCall = (viewerIsPro, otherIsPro) => Boolean(viewerIsPro || otherIsPro);

// Registered makers (suppliers) get these Pro tools free, without the 3-use limit
export const MAKER_FREE_FEATURES = ['documents'];

// What every registered maker gets, shown during supplier registration
export const MAKER_PERKS = [
  {
    id: 'documents',
    title: 'Document access, like Pro',
    text: 'Make quotations, invoices, purchase orders and delivery receipts with no limit.',
  },
  {
    id: 'calls',
    title: 'Calls in Sponsorship Connect',
    text: 'Want to sponsor events with your brand? Join as a brand and call organizers, even without Pro.',
  },
];

// Three Pro plans, one per interface. Each has a discounted first month.
export const PRO_PLANS = {
  organizer: {
    id: 'organizer',
    name: 'Aygo Pro for Organizers',
    tagline: 'Your event sourcing workspace.',
    headline: 'Plan every event in one place.',
    firstMonth: 399,
    monthly: 499,
    yearly: 4990,
  },
  maker: {
    id: 'maker',
    name: 'Aygo Pro for Suppliers',
    tagline: 'Win more jobs and grow your storefront.',
    headline: 'Win more jobs, faster.',
    firstMonth: 999,
    monthly: 1500,
    yearly: 15000,
  },
  sponsorship: {
    id: 'sponsorship',
    name: 'Sponsorship Connect Pro',
    tagline: 'Close more sponsorship deals.',
    headline: 'Close more sponsorship deals.',
    firstMonth: 399,
    monthly: 499,
    yearly: 4990,
  },
};

// Aygo Pro for Suppliers: what the plan includes (registration and the Go Pro screen use this list).
// Kept separate from Sponsorship Connect Pro, which covers sponsor matching, sponsorship documents and reach reports.
export const MAKER_PRO_PERKS = [
  { id: 'listings', title: 'Unlimited listings', text: 'List every product, sample and package' },
  { id: 'placement', title: 'Priority placement in search and bids', text: 'Show first to organizers near their venue' },
  { id: 'analytics', title: 'Storefront and bid analytics', text: 'Views, winning prices and response benchmarks' },
  { id: 'mockups', title: '20 AI mockup credits per month', text: 'Send proofs that win the job' },
  { id: 'calls', title: 'Book a call button on your storefront', text: 'Organizers book voice or video calls in your free times' },
  { id: 'badge', title: 'Pro badge on your storefront and bids', text: 'Stand out to organizers comparing offers' },
];

export const MAKER_PRO_PRICE = { firstMonth: PRO_PLANS.maker.firstMonth, monthly: PRO_PLANS.maker.monthly, yearly: PRO_PLANS.maker.yearly };
