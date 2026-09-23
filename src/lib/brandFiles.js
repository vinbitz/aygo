// Files an event needs from its sponsor brand. `kind: 'text'` items are typed, not uploaded.
export const BRAND_FILE_TYPES = [
  { id: 'logo', label: 'Logo, full color', hint: 'PNG with a clear background, or SVG / AI / EPS / PDF', accept: 'image/*,.svg,.ai,.eps,.pdf' },
  { id: 'logo-white', label: 'Logo, white or one-color', hint: 'For dark shirts, lanyards and LED screens', accept: 'image/*,.svg,.ai,.eps,.pdf' },
  { id: 'guidelines', label: 'Brand guidelines & colors', hint: 'PDF, or list HEX / Pantone colors and fonts', accept: '.pdf,image/*', allowText: true },
  { id: 'social', label: 'Pages to feature', hint: 'Facebook, Instagram and TikTok pages for likes, tags and reels', kind: 'text' },
  { id: 'photos', label: 'Product photos', hint: 'For posts, reels and the booth', accept: 'image/*', multiple: true },
  { id: 'video', label: 'Ad video or reel assets', hint: 'MP4 up to 60 seconds, plus music you have rights to', accept: 'video/*' },
  { id: 'copy', label: 'Captions, hashtags & emcee spiel', hint: 'What to say on stage and in posts', kind: 'text' },
  { id: 'booth', label: 'Booth, standee & tarpaulin artwork', hint: 'Print-ready PDF or AI with sizes', accept: '.pdf,.ai,.eps,image/*' },
  { id: 'speaker', label: 'Speaker bio & photo', hint: 'For the program and pubmats', accept: 'image/*,.pdf,.doc,.docx', allowText: true },
  { id: 'billing', label: 'Billing details for the official receipt', hint: 'Registered company name, TIN and address', kind: 'text' },
];

export const MAX_BRAND_FILE_MB = 25;

const has = (text, words) => words.some((w) => text.includes(w));

/**
 * Which files to ask for, from the package perks text and the event's perk ids.
 * Logo, white logo, guidelines and billing are always needed.
 */
export function filesForPackage(pkg, eventPerks = {}) {
  const text = `${pkg?.perks || ''} ${Object.keys(eventPerks).join(' ')}`.toLowerCase();
  const ids = new Set(['logo', 'logo-white', 'guidelines']);
  if (has(text, ['social', 'post', 'reel', 'tiktok', 'fb-likes', 'likes', 'shout'])) ['social', 'photos', 'copy'].forEach((id) => ids.add(id));
  if (has(text, ['reel', 'video', 'livestream', 'stream', 'led'])) ids.add('video');
  if (has(text, ['stage', 'emcee', 'mention'])) ids.add('copy');
  if (has(text, ['booth', 'standee', 'tarp', 'banner', 'sampling', 'arch'])) ids.add('booth');
  if (has(text, ['speak', 'keynote', 'talk'])) ids.add('speaker');
  ids.add('billing');
  return BRAND_FILE_TYPES.filter((t) => ids.has(t.id)).map((t) => t.id);
}

export const fileTypeLabel = (id) => BRAND_FILE_TYPES.find((t) => t.id === id)?.label || id;

export const formatBytes = (n) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
