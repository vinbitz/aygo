// Chat threads live here between openings of the chat, so nothing is lost when it closes.
// Keyed by viewer: 'organizer' (Aygo Chat) or 'maker' (supplier portal).
const store = { organizer: null, maker: null };

export const getThreads = (viewer) => store[viewer];
export const saveThreads = (viewer, threads) => {
  store[viewer] = threads;
};

// null until the chat has been opened once (the seed threads' counts apply then)
export const unreadTotal = (viewer = 'organizer') =>
  store[viewer] ? Object.values(store[viewer]).reduce((n, c) => n + (c.unreadCount || 0), 0) : null;

// The other side of a maker's chat: the organizer who posted the request
export function organizerParty({ organizer, item, qty, budget, venue, deadline }) {
  const slug = organizer.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    id: `org-${slug}`,
    name: organizer,
    shortName: organizer,
    contactPerson: 'Event organizer',
    isOrganizer: true,
    callPolicy: 'chat-first',
    request: {
      item: item || 'Event supplies',
      qty: qty ? `${Number(qty).toLocaleString('en-PH')} pcs` : '',
      budget: budget ? `₱${Number(budget).toLocaleString('en-PH')}` : '',
      venue: venue || '',
      date: deadline || '',
    },
  };
}

// Sponsorship Connect threads, per role
let sponsorThreads = null;
export const getSponsorThreads = () => sponsorThreads;
export const saveSponsorThreads = (threads) => {
  sponsorThreads = threads;
};
