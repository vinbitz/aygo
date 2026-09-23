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
