import React, { useState } from 'react';
import {
  Handshake,
  Users,
  Building2,
  Calendar,
  MapPin,
  Megaphone,
  Link2,
  Pencil,
  Sparkles,
  GraduationCap,
  Send,
  MessagesSquare
} from 'lucide-react';
import { SPONSORSHIP_LISTINGS } from '../data/mockData';
import { toast } from '../lib/toast';
import EventPhotos from './EventPhotos';
import RegistrationLink from './RegistrationLink';
import { SponsorPerksPicker, SponsorPerksList } from './SponsorPerks';
import SponsorChat from './SponsorChat';
import { perkLabel } from '../lib/sponsorPerks';
import { Sheet, Button, Field, Input, Textarea, Tabs, Chip, Badge, Panel, IconCircle } from './ui';

const toPeso = (s) => {
  const str = String(s).trim();
  if (/^\d+$/.test(str)) return '₱' + Number(str).toLocaleString('en-PH');
  return str.replace(/PHP\s?/g, '₱') || '—';
};

const NEED_OPTIONS = ['Cash', 'Event shirts', 'Lanyards & IDs', 'Food & drinks', 'Prizes', 'Venue', 'Cloud credits', 'Media partner'];

const DEFAULT_PACKAGES = [
  { tier: 'Title partner', amount: '50000', perks: 'Stage mention, main logo on shirts and lanyards, booth' },
  { tier: 'Swag sponsor', amount: '20000', perks: 'Logo on tote bags, product sampling' },
  { tier: 'Community supporter', amount: '8000', perks: 'Social media shout-out, logo on backdrop' }
];

const EMPTY_PROFILE = {
  eventName: '',
  org: '',
  description: '',
  audience: '',
  attendance: '',
  date: '',
  needs: ['Event shirts', 'Cash'],
  // What sponsors get: { perkId: details }, plus where their logo appears
  perks: { 'fb-likes': '', reels: '', logo: '' },
  logoSpots: ['Event shirts', 'Backdrop / photo wall'],
  packages: DEFAULT_PACKAGES,
  deckLink: '',
  socialReach: ''
};

// Brands and the kinds of events they already support
const BRANDS = [
  { id: 'b1', name: 'Kape Tayo Coffee', industry: 'Food & beverage', supports: 'Campus fairs, hackathons, org weeks', offer: 'Free coffee for up to 500 guests', tags: ['Food & drinks', 'Prizes'], wants: ['sampling', 'booth', 'posts'] },
  { id: 'b2', name: 'Lakbay Telco', industry: 'Telecom', supports: 'Tech conferences, esports, student summits', offer: 'Cash ₱20,000–₱80,000 + data SIMs', tags: ['Cash', 'Prizes', 'Media partner'], wants: ['fb-likes', 'reels', 'logo', 'livestream', 'leads'] },
  { id: 'b3', name: 'Habi Apparel', industry: 'Local fashion', supports: 'Fun runs, org anniversaries, cultural nights', offer: 'In-kind event shirts (up to 300 pcs)', tags: ['Event shirts', 'Lanyards & IDs'], wants: ['logo', 'reels', 'coverage'] },
  { id: 'b4', name: 'Ulap Cloud PH', industry: 'Cloud & software', supports: 'Hackathons, dev meetups', offer: 'Cloud credits + mentors', tags: ['Cloud credits', 'Prizes'], wants: ['speaking', 'leads', 'logo'] }
];

// Mock data listing plus a few more open opportunities
const OPPORTUNITIES = [
  ...SPONSORSHIP_LISTINGS.map((l) => ({
    ...l, kind: 'Tech', audience: 'Student and junior developers', socialReach: '18k followers',
    perks: { 'fb-likes': '1,000 new likes', reels: '3 reels', logo: '', speaking: '10-minute talk', leads: '~300 opt-ins' },
    logoSpots: ['Event shirts', 'Lanyards & IDs', 'Stage LED'],
  })),
  {
    id: 'spon-2',
    eventTitle: 'Sinag Cultural Night 2026',
    organization: 'PUP Kultura Collective',
    expectedAttendance: '1,200 guests',
    eventDate: 'December 5, 2026',
    venue: 'PUP Sta. Mesa Gym, Manila',
    kind: 'Campus',
    audience: 'College students, alumni and families',
    socialReach: '32k followers',
    seeking: ['Food & drinks', 'Event shirts', 'Media partner'],
    perks: { booth: '2x2 m', stage: '6 mentions', posts: '5 posts', reels: '2 reels', logo: '' },
    logoSpots: ['Event shirts', 'Backdrop / photo wall', 'Pubmats & posters'],
    packages: [
      { tier: 'Major sponsor', amount: 'PHP 40,000', perks: 'Booth, stage mention, logo on shirts' },
      { tier: 'Minor sponsor', amount: 'PHP 12,000', perks: 'Logo on programme and social posts' }
    ]
  },
  {
    id: 'spon-3',
    eventTitle: 'Takbo Para sa Kalikasan Fun Run',
    organization: 'Marikina Youth Council',
    expectedAttendance: '800 runners',
    eventDate: 'January 18, 2027',
    venue: 'Marikina Riverbanks',
    kind: 'Community',
    audience: 'Young professionals and families',
    socialReach: '9k followers',
    seeking: ['Event shirts', 'Food & drinks', 'Prizes'],
    perks: { 'fb-likes': '800 new likes', logo: '', sampling: '800 race kits', coverage: '' },
    logoSpots: ['Race bibs', 'Event shirts', 'Tarpaulin & banners'],
    packages: [
      { tier: 'Race partner', amount: 'PHP 60,000', perks: 'Naming rights on race bib, finish-line arch' },
      { tier: 'Hydration partner', amount: 'In-kind', perks: 'Water stations branding' }
    ]
  }
];

const KIND_FILTERS = ['All', 'Tech', 'Campus', 'Community'];

function Meta({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-500">
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {children}
    </span>
  );
}

function PackageList({ packages }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {packages.map((pkg) => (
        <div key={pkg.tier} className="rounded-2xl bg-[#F4F3F0] p-3">
          <p className="text-[13px] text-slate-500">{pkg.tier}</p>
          <p className="text-[15px] font-semibold text-slate-900">{toPeso(pkg.amount)}</p>
          <p className="mt-1 text-[13px] text-slate-500 leading-snug">{pkg.perks}</p>
        </div>
      ))}
    </div>
  );
}

function OrganizerProfileForm({ profile, setProfile, photos, onPhotosChange, registrationLink, onRegistrationLinkChange }) {
  const set = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }));
  const toggleNeed = (need) =>
    setProfile((p) => ({
      ...p,
      needs: p.needs.includes(need) ? p.needs.filter((n) => n !== need) : [...p.needs, need]
    }));
  const setPackage = (i, key) => (e) =>
    setProfile((p) => ({
      ...p,
      packages: p.packages.map((pkg, idx) => (idx === i ? { ...pkg, [key]: e.target.value } : pkg))
    }));

  return (
    <div className="space-y-4">
      <Panel className="flex items-start gap-3">
        <IconCircle icon={Sparkles} tone="violet" size="sm" />
        <p className="text-[13px] text-slate-600 leading-snug">
          Create an event sponsorship profile. Brands that support events like yours will see it and can reach out.
        </p>
      </Panel>

      <div>
        <span className="block mb-1.5 text-[13px] font-medium text-slate-700">Event photos</span>
        <p className="mb-2 text-[12px] text-slate-500">Show brands what your event looks like: past editions, crowd, venue, booths.</p>
        <EventPhotos photos={photos} onChange={onPhotosChange} compact />
      </div>

      <div>
        <span className="block mb-1.5 text-[13px] font-medium text-slate-700">Registration link</span>
        <RegistrationLink value={registrationLink} onChange={onRegistrationLinkChange} />
      </div>

      <Field label="Event name">
        <Input required value={profile.eventName} onChange={set('eventName')} placeholder="e.g. UST Tech Week 2026" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="School, org or community">
          <Input required value={profile.org} onChange={set('org')} placeholder="e.g. ACM Student Chapter" />
        </Field>
        <Field label="Event date">
          <Input value={profile.date} onChange={set('date')} placeholder="e.g. Nov 14, 2026" />
        </Field>
      </div>
      <Field label="About the event">
        <Textarea value={profile.description} onChange={set('description')} placeholder="What happens, why it matters, what makes it special" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Audience">
          <Input value={profile.audience} onChange={set('audience')} placeholder="e.g. IT and CS students, 18–24" />
        </Field>
        <Field label="Expected attendance">
          <Input required inputMode="numeric" value={profile.attendance} onChange={set('attendance')} placeholder="e.g. 350" />
        </Field>
      </div>

      <div>
        <p className="mb-1.5 text-[13px] font-medium text-slate-700">What do you need?</p>
        <div className="flex flex-wrap gap-2">
          {NEED_OPTIONS.map((need) => (
            <Chip key={need} selected={profile.needs.includes(need)} onClick={() => toggleNeed(need)}>
              {need}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] font-medium text-slate-700">What sponsors get</p>
        <p className="mb-2 text-[12px] text-slate-500">Pick everything you can give. Add numbers so brands know the reach.</p>
        <SponsorPerksPicker
          value={profile.perks}
          onChange={(perks) => setProfile((p) => ({ ...p, perks }))}
          logoSpots={profile.logoSpots}
          onLogoSpotsChange={(logoSpots) => setProfile((p) => ({ ...p, logoSpots }))}
        />
      </div>

      <div>
        <p className="mb-1.5 text-[13px] font-medium text-slate-700">Sponsorship packages</p>
        <div className="space-y-2">
          {profile.packages.map((pkg, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 p-3 space-y-2">
              <div className="grid grid-cols-[1fr_120px] gap-2">
                <Input value={pkg.tier} onChange={setPackage(i, 'tier')} aria-label="Package name" className="py-2.5" />
                <Input value={pkg.amount} onChange={setPackage(i, 'amount')} inputMode="numeric" aria-label="Amount in pesos" placeholder="₱" className="py-2.5" />
              </div>
              <Input value={pkg.perks} onChange={setPackage(i, 'perks')} aria-label="Perks" placeholder="What the sponsor gets" className="py-2.5" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Sponsorship deck link" hint="Google Drive, Canva or PDF link">
          <Input type="url" value={profile.deckLink} onChange={set('deckLink')} placeholder="https://" />
        </Field>
        <Field label="Social media reach">
          <Input value={profile.socialReach} onChange={set('socialReach')} placeholder="e.g. 12k followers on FB + IG" />
        </Field>
      </div>
    </div>
  );
}

function OrganizerProfileView({ profile, onEdit, photos, registrationLink, onInquiry }) {
  // Match on what the event needs and on what the brand wants in return
  const matches = BRANDS.map((b) => {
    const wantsMet = (b.wants || []).filter((w) => w in (profile.perks || {}));
    return { ...b, wantsMet, score: b.tags.filter((t) => profile.needs.includes(t)).length + wantsMet.length };
  })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 overflow-hidden">
        {photos?.cover && (
          <img src={photos.cover.src} alt={`${profile.eventName} cover`} className="w-full aspect-[21/9] object-cover" />
        )}
        <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <IconCircle icon={GraduationCap} tone="violet" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[17px] font-semibold text-slate-900">{profile.eventName}</h3>
              <Badge tone="green">Live</Badge>
            </div>
            <p className="text-[13px] text-slate-500">{profile.org}</p>
          </div>
          <Button size="sm" variant="secondary" icon={Pencil} className="h-11" onClick={onEdit}>Edit</Button>
        </div>
        {profile.description && <p className="mt-3 text-[15px] text-slate-700 leading-relaxed">{profile.description}</p>}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          <Meta icon={Users}>{profile.attendance} attendees</Meta>
          {profile.audience && <Meta icon={GraduationCap}>{profile.audience}</Meta>}
          {profile.date && <Meta icon={Calendar}>{profile.date}</Meta>}
          {profile.socialReach && <Meta icon={Megaphone}>{profile.socialReach}</Meta>}
          {registrationLink && (
            <a href={registrationLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#003CF5] hover:underline">
              <Link2 className="w-3.5 h-3.5" /> Event registration
            </a>
          )}
          {profile.deckLink && (
            <a href={profile.deckLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#003CF5] hover:underline">
              <Link2 className="w-3.5 h-3.5" /> Sponsorship deck
            </a>
          )}
        </div>
        {profile.needs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.needs.map((n) => <Badge key={n}>{n}</Badge>)}
          </div>
        )}
        {Object.keys(profile.perks || {}).length > 0 && (
          <div className="mt-4">
            <p className="text-[13px] font-semibold text-slate-500 mb-2">What sponsors get</p>
            <SponsorPerksList value={profile.perks} logoSpots={profile.logoSpots} />
          </div>
        )}
        <div className="mt-4">
          <PackageList packages={profile.packages.filter((p) => p.tier)} />
        </div>
        {photos?.gallery?.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
            {photos.gallery.map((p) => (
              <img key={p.id} src={p.src} alt={p.name || 'Event photo'} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
            ))}
          </div>
        )}
        </div>
      </div>

      <section>
        <h3 className="text-[13px] font-semibold text-slate-500 mb-2">Matched brands</h3>
        <div className="space-y-2">
          {matches.map((b) => (
            <div key={b.id} className="rounded-2xl bg-[#F4F3F0] p-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <IconCircle icon={Building2} tone={b.score > 0 ? 'blue' : 'slate'} className={b.score > 0 ? '' : 'bg-white'} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[15px] font-medium text-slate-900">{b.name}</p>
                    {b.score > 0 && <Badge tone="blue">{b.score === 1 ? '1 match' : `${b.score} matches`}</Badge>}
                  </div>
                  <p className="text-[13px] text-slate-500">{b.industry} · supports {b.supports.toLowerCase()}</p>
                  <p className="text-[13px] text-slate-700 mt-0.5">{b.offer}</p>
                  {b.wantsMet.length > 0 && (
                    <p className="text-[12px] text-emerald-700 mt-0.5">Wants what you offer: {b.wantsMet.map(perkLabel).join(', ')}</p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                icon={Send}
                className="h-11 shrink-0"
                onClick={() => onInquiry({ id: b.id, name: b.name, subtitle: `${b.industry} · brand`, kind: 'brand' })}
              >
                Send inquiry
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BrandsView({ onInquiry }) {
  const [kind, setKind] = useState('All');
  const list = OPPORTUNITIES.filter((o) => kind === 'All' || o.kind === kind);

  return (
    <div className="space-y-4">
      <Panel className="flex items-center gap-3">
        <IconCircle icon={Building2} tone="blue" size="sm" className="bg-white" />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-slate-900">Your brand profile</p>
          <p className="text-[13px] text-slate-500 truncate">Kape Tayo Coffee · supports campus fairs and hackathons</p>
        </div>
        <Button size="sm" variant="ghost" className="h-11 shrink-0" onClick={() => toast('Brand profile editing is coming soon')}>
          Edit
        </Button>
      </Panel>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {KIND_FILTERS.map((k) => (
          <Chip key={k} selected={kind === k} onClick={() => setKind(k)}>{k}</Chip>
        ))}
      </div>

      {list.map((item) => (
        <article key={item.id} className="rounded-[28px] border border-slate-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[17px] font-semibold text-slate-900 leading-snug">{item.eventTitle}</h3>
              <p className="text-[13px] text-slate-500">{item.organization}</p>
            </div>
            <Badge tone="violet" className="shrink-0">{item.kind}</Badge>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Meta icon={Users}>{item.expectedAttendance}</Meta>
            <Meta icon={Calendar}>{item.eventDate}</Meta>
            <Meta icon={MapPin}>{item.venue}</Meta>
            {item.socialReach && <Meta icon={Megaphone}>{item.socialReach}</Meta>}
          </div>
          {item.audience && <p className="text-[15px] text-slate-700">Audience: {item.audience}</p>}

          <div>
            <p className="text-[13px] text-slate-500 mb-1.5">Looking for</p>
            <div className="flex flex-wrap gap-1.5">
              {item.seeking.map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
          </div>

          {item.perks && (
            <div>
              <p className="text-[13px] text-slate-500 mb-1.5">Sponsors get</p>
              <SponsorPerksList value={item.perks} compact />
              {item.logoSpots?.length > 0 && <p className="mt-1.5 text-[12px] text-slate-500">Logo on: {item.logoSpots.join(', ')}</p>}
            </div>
          )}

          <PackageList packages={item.packages} />

          <div className="flex justify-end">
            <Button
              icon={Handshake}
              className="w-full sm:w-auto"
              onClick={() => onInquiry({ id: item.id, name: item.eventTitle, subtitle: item.organization, kind: 'organizer' })}
            >
              Send inquiry
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

// The role is set once an organizer publishes an event or a brand sends an inquiry.
// After that it can only be switched once a day.
const LOCK_KEY = 'aygo.sponsorRoleLock';
const SWITCH_COOLDOWN_MS = 24 * 60 * 60 * 1000;

function loadLock() {
  try {
    const lock = JSON.parse(readStorage(LOCK_KEY));
    return lock?.role ? lock : null;
  } catch {
    return null;
  }
}

function timeLeft(ms) {
  const totalMin = Math.ceil(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
const PROFILE_KEY = 'aygo.sponsorProfile';
const chatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable: keep it for this visit only
  }
}

function loadPublishedProfile() {
  try {
    return JSON.parse(readStorage(PROFILE_KEY)) || null;
  } catch {
    return null;
  }
}

// Starter conversations so each side sees how chat works
const SEED_THREADS = {
  organizer: [
    {
      id: 'b2', name: 'Lakbay Telco', subtitle: 'Telecom · brand', kind: 'brand', unread: 1,
      messages: [{ id: 'm1', from: 'them', text: 'Hi! We saw your event on Aygo. How many reels can you do for our data promo?', time: '9:12 AM' }],
    },
  ],
  brand: [
    {
      id: 'spon-1', name: 'DevCon Manila Hackathon 2026', subtitle: 'Junior Developers Society', kind: 'organizer', unread: 1,
      messages: [{ id: 'm1', from: 'them', text: 'Thanks for checking our event! Our Swag sponsor package includes your logo on 450 tote bags.', time: '8:40 AM' }],
    },
  ],
};

const INTRO = {
  organizer: (t) => `Hi ${t.name}! We'd love to have you as a sponsor. Here's our event profile on Aygo.`,
  brand: (t) => `Hi ${t.name} team! We're interested in sponsoring your event. Can we talk about the packages?`,
};

const REPLY = {
  organizer: 'Thanks for reaching out! Send us your audience size and what sponsors get, and we will review it this week.',
  brand: 'Thank you! We would be happy to discuss. Which package are you looking at?',
};

function RoleChooser({ onChoose }) {
  const options = [
    { id: 'organizer', icon: GraduationCap, title: "I'm organizing an event", text: 'Create a sponsorship profile, show what sponsors get, and find brands.' },
    { id: 'brand', icon: Building2, title: "I'm a brand or company", text: 'Browse student and community events and sponsor the right ones.' },
  ];
  return (
    <div className="space-y-3">
      <p className="text-[15px] text-slate-700">First, tell us who you are.</p>
      {options.map(({ id, icon: Icon, title, text }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChoose(id)}
          className="w-full flex items-center gap-4 rounded-[22px] border border-slate-200 hover:border-[#003CF5] hover:bg-blue-50/40 p-4 text-left transition-colors active:scale-[0.99]"
        >
          <span className="w-12 h-12 rounded-full bg-blue-50 text-[#003CF5] flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6" />
          </span>
          <span className="flex-1">
            <span className="block text-[17px] font-semibold text-slate-900">{title}</span>
            <span className="block text-[13px] text-slate-500 leading-snug">{text}</span>
          </span>
        </button>
      ))}
      <p className="text-[12px] text-slate-500">
        Look around first. Your choice becomes permanent once you publish an event or send a sponsorship inquiry.
      </p>
    </div>
  );
}

export default function SponsorshipConnectModal({ onClose, photos, onPhotosChange, registrationLink, onRegistrationLinkChange }) {
  const [lock, setLock] = useState(loadLock);
  const lockedRole = lock?.role || null;
  // Until the role is locked, every visit starts at the brand/organizer choice
  const [role, setRole] = useState(lockedRole);
  const [activeTab, setActiveTab] = useState('main');
  const [savedProfile] = useState(loadPublishedProfile);
  const [profile, setProfile] = useState(savedProfile || EMPTY_PROFILE);
  const [published, setPublished] = useState(Boolean(savedProfile));
  // Pending first action that will lock the role: { kind: 'publish' } or { kind: 'inquiry', target }
  const [pendingLock, setPendingLock] = useState(null);
  const [threadsByRole, setThreadsByRole] = useState(SEED_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(null);

  const threads = role ? threadsByRole[role] : [];
  const unread = threads.reduce((n, t) => n + (t.unread || 0), 0);

  const canPublish = profile.eventName.trim() && profile.org.trim() && profile.attendance.trim();
  const showForm = role === 'organizer' && activeTab === 'main' && !published;

  const chooseRole = (next) => {
    setRole(next);
    setActiveTab('main');
    setActiveThreadId(null);
  };

  const lockRole = (nextRole = role) => {
    const next = { role: nextRole, at: Date.now() };
    writeStorage(LOCK_KEY, JSON.stringify(next));
    setLock(next);
  };

  // Switching is allowed once a day after the role is set
  const msUntilSwitch = lock ? Math.max(0, lock.at + SWITCH_COOLDOWN_MS - Date.now()) : 0;
  const switchRole = () => {
    if (msUntilSwitch > 0) return;
    const next = role === 'brand' ? 'organizer' : 'brand';
    lockRole(next);
    setRole(next);
    setActiveTab('main');
    setActiveThreadId(null);
    toast(`Switched to ${next === 'brand' ? 'a brand' : 'an organizer'} account. You can switch again after 1 day.`);
  };

  const updateThreads = (fn) => setThreadsByRole((prev) => ({ ...prev, [role]: fn(prev[role]) }));

  const openThread = (id) => {
    setActiveThreadId(id);
    updateThreads((list) => list.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  const sendMessage = (threadId, text) => {
    const msg = { id: `m${Date.now()}`, from: 'me', text, time: chatTime() };
    updateThreads((list) => list.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, msg], typing: true } : t)));
    const currentRole = role;
    setTimeout(() => {
      setThreadsByRole((prev) => ({
        ...prev,
        [currentRole]: prev[currentRole].map((t) =>
          t.id === threadId
            ? { ...t, typing: false, messages: [...t.messages, { id: `r${Date.now()}`, from: 'them', text: REPLY[currentRole], time: chatTime() }] }
            : t
        ),
      }));
    }, 1600);
  };

  // "Send inquiry" opens (or starts) a chat with that brand or event
  const openInquiry = (target) => {
    const exists = threads.some((t) => t.id === target.id);
    if (!exists) updateThreads((list) => [{ ...target, unread: 0, messages: [] }, ...list]);
    setActiveTab('chats');
    openThread(target.id);
    if (!exists) setTimeout(() => sendMessage(target.id, INTRO[role](target)), 0);
  };

  const startInquiry = (target) => {
    if (!lockedRole && role === 'brand') setPendingLock({ kind: 'inquiry', target });
    else openInquiry(target);
  };

  const publishNow = () => {
    setPublished(true);
    writeStorage(PROFILE_KEY, JSON.stringify(profile));
    toast('Sponsorship profile published. Matching brands can now see it.');
  };

  const handlePublish = () => {
    if (!canPublish) {
      toast('Add your event name, school or org, and expected attendance.');
      return;
    }
    if (!lockedRole) setPendingLock({ kind: 'publish' });
    else publishNow();
  };

  const confirmLock = () => {
    const action = pendingLock;
    setPendingLock(null);
    lockRole();
    if (action.kind === 'publish') publishNow();
    else openInquiry(action.target);
  };

  const roleName = role === 'brand' ? 'brand' : 'organizer';
  const otherRole = role === 'brand' ? 'organizer' : 'brand';

  return (
    <Sheet
      onClose={onClose}
      title="Sponsorship Connect"
      subtitle={!role ? 'Match events with brands' : lockedRole ? (role === 'brand' ? 'Brand account' : 'Organizer account') : `Looking around as ${role === 'brand' ? 'a brand' : 'an organizer'}`}
      icon={Handshake}
      size="lg"
      footer={pendingLock ? (
        <div>
          <p className="text-[15px] font-semibold text-slate-900">
            Continue as {roleName === 'brand' ? 'a brand' : 'an organizer'}?
          </p>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {pendingLock.kind === 'publish' ? 'Publishing your event' : 'Sending your first inquiry'} sets this as {roleName === 'brand' ? 'a brand' : 'an organizer'} account. You can still edit your profile anytime, but you can't switch to {otherRole === 'brand' ? 'a brand' : 'an organizer'} account for 1 day.
          </p>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="lg" onClick={() => setPendingLock(null)}>Not yet</Button>
            <Button size="lg" full onClick={confirmLock}>
              {pendingLock.kind === 'publish' ? 'Publish event' : 'Send inquiry'}
            </Button>
          </div>
        </div>
      ) : showForm ? (
        <Button full size="lg" onClick={handlePublish}>
          Publish sponsorship profile
        </Button>
      ) : null}
    >
      {!role ? (
        <RoleChooser onChoose={chooseRole} />
      ) : (
        <>
          <Tabs
            className="mb-4"
            value={activeTab}
            onChange={(t) => { setActiveTab(t); if (t !== 'chats') setActiveThreadId(null); }}
            tabs={[
              role === 'brand'
                ? { id: 'main', label: 'Events', icon: GraduationCap }
                : { id: 'main', label: 'My event', icon: GraduationCap },
              { id: 'chats', label: unread ? `Chats (${unread})` : 'Chats', icon: MessagesSquare },
            ]}
          />

          {activeTab === 'chats' ? (
            <SponsorChat
              threads={threads}
              activeId={activeThreadId}
              onOpen={openThread}
              onBack={() => setActiveThreadId(null)}
              onSend={sendMessage}
            />
          ) : role === 'brand' ? (
            <BrandsView onInquiry={startInquiry} />
          ) : published ? (
            <OrganizerProfileView profile={profile} photos={photos} registrationLink={registrationLink} onEdit={() => setPublished(false)} onInquiry={startInquiry} />
          ) : (
            <OrganizerProfileForm profile={profile} setProfile={setProfile} photos={photos} onPhotosChange={onPhotosChange} registrationLink={registrationLink} onRegistrationLinkChange={onRegistrationLinkChange} />
          )}

          {lockedRole && activeTab === 'main' && (
            <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-[#F4F3F0] px-4 py-3">
              <span className="text-[13px] text-slate-500">
                {role === 'brand' ? 'Brand' : 'Organizer'} account
                {msUntilSwitch > 0 && ` · switch available in ${timeLeft(msUntilSwitch)}`}
              </span>
              <Button size="sm" variant="ghost" className="shrink-0 text-[#003CF5]" disabled={msUntilSwitch > 0} onClick={switchRole}>
                Switch to {otherRole}
              </Button>
            </div>
          )}
        </>
      )}
    </Sheet>
  );
}
