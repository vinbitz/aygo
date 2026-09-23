// Marketplace rules for the demo: which makers see a request, what they bid,
// and how offers are ranked. Pure functions so the UI stays simple.
import { SUPPLIERS, CATEGORIES } from '../data/mockData';

const DAY_MS = 24 * 60 * 60 * 1000;

export const peso = (value, decimals = 0) =>
  `₱${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

export const shortDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name || id;

// Deterministic 0..1 value so the same request always gets the same offers
function seeded(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

/** Makers whose categories cover the request, nearest first */
export function matchSuppliers(request) {
  const wanted = request.categories?.length ? request.categories : [request.category];
  return SUPPLIERS
    .filter((s) => s.categories?.some((c) => wanted.includes(c)))
    .sort((a, b) => a.km - b.km);
}

const INCLUSIONS = {
  apparel: ['Free digital proof', 'Individual polybag + size sticker', 'Free delivery in Metro Manila', '1 revision of artwork'],
  'event-print': ['Free digital proof', 'Safety breakaway clip', 'Individual packaging', 'Free delivery in Metro Manila'],
  drinkware: ['Kraft gift box', 'Free digital proof', 'Laser test on 1 sample', 'Free delivery in Metro Manila'],
  bags: ['Free digital proof', 'Reinforced handles', 'Folded + bundled per 50', 'Free delivery in Metro Manila'],
  eco: ['Eco kraft packaging', 'Free digital proof', 'Material sample photo'],
  booths: ['Site ocular', 'Installation + dismantling', 'Free digital layout'],
  writing: ['Free digital proof', 'Engraving / deboss included', 'Individual sleeve packaging'],
  tech: ['Free digital proof', 'Tested before packing', 'Individual gift box', '1-year replacement warranty'],
  'rain-care': ['Free digital proof', 'Individual sleeve', 'Free delivery in Metro Manila'],
  'gift-sets': ['Branded gift box', 'Custom message card', 'Kitting and packing per recipient', 'Free digital layout'],
  packaging: ['Free dieline and proof', 'Flat-packed delivery', 'Free delivery in Metro Manila'],
  'event-services': ['Ocular visit', 'Crew and set-up', 'Pack-up after the event'],
  marketing: ['2 rounds of revisions', 'Source files included', 'Social-ready sizes'],
};

/** Builds one maker's offer for a request */
export function makeBid(request, supplier, index = 0) {
  const r = seeded(`${request.id}:${supplier.id}`);
  const qty = Math.max(1, Number(request.quantity) || 1);
  const targetUnit = (Number(request.targetBudget) || 0) / qty;
  const factor = 0.84 + r * 0.26 + (supplier.verified ? 0 : -0.04);
  const pricePerUnit = Math.max(1, Math.round((targetUnit * factor) * 2) / 2);
  const minDays = parseInt(supplier.avgLeadTime, 10) || 5;
  const leadDays = minDays + Math.round(r * 2);
  const inclusionPool = INCLUSIONS[request.categories?.[0] || request.category] || INCLUSIONS.apparel;

  return {
    id: `${request.id}-${supplier.id}`,
    supplierId: supplier.id,
    supplier,
    pricePerUnit,
    total: pricePerUnit * qty,
    leadDays,
    deliveryDate: new Date(Date.now() + (leadDays + 1) * DAY_MS).toISOString(),
    inclusions: inclusionPool.slice(0, 2 + Math.round(r * (inclusionPool.length - 2))),
    notes: r > 0.5
      ? 'Materials are in stock. Production starts once the artwork proof is approved.'
      : 'Happy to adjust specs to hit your budget. Send your logo and we will prepare a proof today.',
    status: 'pending',
    arrivalDelayMs: 1200 + index * 1400 + Math.round(r * 600),
  };
}

/** Adds ranking labels and sorts: best overall match first */
export function rankBids(bids, request) {
  if (!bids.length) return [];
  const budget = Number(request.targetBudget) || 0;
  const minPrice = Math.min(...bids.map((b) => b.total));
  const minDays = Math.min(...bids.map((b) => b.leadDays));
  const score = (b) =>
    (budget ? Math.max(0, 1 - Math.max(0, b.total - budget) / budget) : 1) * 50 +
    (minPrice / b.total) * 20 +
    (b.supplier.rating / 5) * 20 +
    (minDays / b.leadDays) * 10 +
    (b.supplier.verified ? 5 : 0);

  const ranked = bids
    .map((b) => ({ ...b, score: score(b) }))
    .sort((a, b) => b.score - a.score);

  return ranked.map((b, i) => {
    const tags = [];
    if (i === 0) tags.push('Best match');
    if (b.total === minPrice) tags.push('Lowest price');
    if (b.leadDays === minDays) tags.push('Fastest');
    return { ...b, tags, withinBudget: !budget || b.total <= budget };
  });
}

/** Maker's reply to a counter-offer: accept if close enough, otherwise meet halfway */
export function respondToCounter(bid, counterPrice) {
  if (counterPrice >= bid.pricePerUnit * 0.93) {
    return { pricePerUnit: counterPrice, accepted: true };
  }
  const middle = Math.round(((bid.pricePerUnit + counterPrice) / 2) * 2) / 2;
  return { pricePerUnit: middle, accepted: false };
}

export const ORDER_STEPS = ['Proofing', 'Printing', 'Pack', 'Dispatch'];
