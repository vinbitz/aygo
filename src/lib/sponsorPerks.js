// What an event can give its sponsors. `detail` is the placeholder for the amount/terms field.
export const SPONSOR_PERKS = [
  { id: 'fb-likes', label: 'Facebook page likes & follows', hint: 'Attendees like/follow the sponsor page to register or join', detail: 'e.g. 500 new likes' },
  { id: 'reels', label: 'Reel / TikTok creation', hint: 'Short videos featuring the brand, posted on the event pages', detail: 'e.g. 3 reels, 1 TikTok' },
  { id: 'logo', label: 'Logo placement', hint: 'Brand logo on event materials', detail: '' },
  { id: 'posts', label: 'Social media shout-outs', hint: 'Dedicated posts and stories', detail: 'e.g. 4 posts + 6 stories' },
  { id: 'livestream', label: 'Livestream mentions', hint: 'Logo overlay and on-air mentions', detail: 'e.g. every 30 min' },
  { id: 'booth', label: 'Booth space', hint: 'Space at the venue to sell or showcase', detail: 'e.g. 3x3 m near entrance' },
  { id: 'stage', label: 'Stage & emcee mentions', hint: 'Host shout-outs during the program', detail: 'e.g. 5 mentions' },
  { id: 'speaking', label: 'Speaking slot', hint: 'Talk, demo or product launch on stage', detail: 'e.g. 10-minute talk' },
  { id: 'sampling', label: 'Product sampling & kit inserts', hint: 'Samples, flyers or vouchers in attendee kits', detail: 'e.g. 500 kits' },
  { id: 'raffle', label: 'Raffle & giveaway feature', hint: 'Brand prizes announced on stage and online', detail: '' },
  { id: 'leads', label: 'Attendee leads (opt-in)', hint: 'Contacts of attendees who agree to share', detail: 'e.g. ~300 opt-ins' },
  { id: 'coverage', label: 'Photos & video with the brand', hint: 'Documentation the sponsor can reuse', detail: '' },
];

export const LOGO_SPOTS = [
  'Event shirts', 'Lanyards & IDs', 'Backdrop / photo wall', 'Stage LED', 'Tote bags', 'Tarpaulin & banners',
  'Event website', 'Registration page', 'Livestream overlay', 'Pubmats & posters', 'Certificates', 'Race bibs',
];

export const perkLabel = (id) => SPONSOR_PERKS.find((p) => p.id === id)?.label || id;
