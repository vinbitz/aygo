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
  MessagesSquare,
  Phone,
  Crown,
  Lock,
  ChevronLeft,
  ChevronRight,
  Repeat
} from 'lucide-react';
import { SPONSORSHIP_LISTINGS } from '../data/mockData';
import { toast } from '../lib/toast';
import EventPhotos from './EventPhotos';
import RegistrationLink from './RegistrationLink';
import { SponsorPerksPicker, SponsorPerksList } from './SponsorPerks';
import SponsorChat from './SponsorChat';
import { perkLabel } from '../lib/sponsorPerks';
import { BrandProfileForm, BrandProfileCard, BrandProfilePrompt } from './BrandProfile';
import { EMPTY_BRAND } from '../lib/brands';
import CallScreen from './CallScreen';
import { callLength } from '../lib/calls';
import { usePro } from '../state/pro';
import { canCall } from '../lib/pro';
import { packageAmount } from '../lib/sponsorDeals';
import { filesForPackage } from '../lib/brandFiles';
import { peso } from '../lib/marketplace';
import { Sheet, Button, Field, Input, Textarea, Tabs, Chip, Badge, Panel, IconCircle } from './ui';

const toPeso = (s) => {
  const str = String(s).trim();
  if (/^\d+$/.test(str)) return '₱' + Number(str).toLocaleString('en-PH');
  return str.replace(/PHP\s?/g, '₱') || '—';
};

// Simple placeholder logo for the demo brand's reply
function demoLogo(name, bg, fg, mono = false) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" rx="48" fill="${bg}"/><text x="120" y="150" font-family="Arial" font-weight="700" font-size="96" text-anchor="middle" fill="${fg}">${initials}</text></svg>`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return { name: `${slug}-logo${mono ? '-white' : ''}.svg`, size: svg.length, type: 'image/svg+xml', url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` };
}

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
// pro: the brand is on Aygo Pro, so anyone can call them
const BRANDS = [
  {
    id: 'b1', name: 'Kape Tayo Coffee', industry: 'Food & beverage', pro: false, logo: null,
    about: 'Local roaster serving campus and office crowds. We love events where people stay and talk.',
    supports: ['Campus fairs', 'Hackathons', 'Org anniversaries'], offer: 'Free coffee for up to 500 guests',
    gives: ['Food & drinks', 'Prizes'], wants: ['sampling', 'booth', 'posts'], budget: 'In-kind', audience: 'Students and young professionals',
  },
  {
    id: 'b2', name: 'Lakbay Telco', industry: 'Telecom', pro: true, logo: null,
    about: 'Prepaid data for students and gamers. We sponsor events that are loud online.',
    supports: ['Tech conferences', 'Esports', 'Hackathons'], offer: 'Cash ₱20,000–₱80,000 + data SIMs',
    gives: ['Cash', 'Prizes', 'Media partner'], wants: ['fb-likes', 'reels', 'logo', 'livestream', 'leads'], budget: '₱20,000–₱80,000', audience: 'Gen Z, 16–24',
  },
  {
    id: 'b3', name: 'Habi Apparel', industry: 'Local fashion', pro: false, logo: null,
    about: 'Filipino-made shirts and tote bags. We dress events and show our work on the crowd.',
    supports: ['Fun runs', 'Org anniversaries', 'Cultural nights'], offer: 'In-kind event shirts (up to 300 pcs)',
    gives: ['Event shirts', 'Lanyards & IDs'], wants: ['logo', 'reels', 'coverage'], budget: 'In-kind', audience: 'Runners, orgs and families',
  },
  {
    id: 'b4', name: 'Ulap Cloud PH', industry: 'Cloud & software', pro: true, logo: null,
    about: 'Cloud hosting for Filipino startups. We back builders with credits and mentors.',
    supports: ['Hackathons', 'Tech conferences'], offer: 'Cloud credits + mentors',
    gives: ['Cloud credits', 'Prizes'], wants: ['speaking', 'leads', 'logo'], budget: '₱10,000–₱40,000 + credits', audience: 'Developers and CS students',
  }
];

// Mock data listing plus a few more open opportunities
const OPPORTUNITIES = [
  ...SPONSORSHIP_LISTINGS.map((l) => ({
    ...l, kind: 'Tech', audience: 'Student and junior developers', socialReach: '18k followers', pro: true,
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

const brandTarget = (b) => ({ id: b.id, name: b.name, subtitle: `${b.industry} · brand`, kind: 'brand', pro: b.pro });

function OrganizerProfileView({ profile, onEdit, photos, registrationLink, onInquiry, onCall, viewerIsPro }) {
  const [openBrandId, setOpenBrandId] = useState(null);
  // Match on what the event needs and on what the brand wants in return
  const matches = BRANDS.map((b) => {
    const wantsMet = (b.wants || []).filter((w) => w in (profile.perks || {}));
    return { ...b, wantsMet, score: b.gives.filter((t) => profile.needs.includes(t)).length + wantsMet.length };
  })
    .sort((a, b) => b.score - a.score);

  const openBrand = matches.find((b) => b.id === openBrandId);
  if (openBrand) {
    return (
      <div className="space-y-3">
        <button type="button" onClick={() => setOpenBrandId(null)} className="inline-flex items-center gap-1 h-11 pr-3 text-[15px] font-medium text-[#003CF5]">
          <ChevronLeft className="w-5 h-5" /> Matched brands
        </button>
        <BrandProfileCard
          brand={openBrand}
          onInquiry={() => onInquiry(brandTarget(openBrand))}
          onCall={() => onCall(brandTarget(openBrand))}
          callLocked={!canCall(viewerIsPro, openBrand.pro)}
        />
      </div>
    );
  }

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
              <button type="button" onClick={() => setOpenBrandId(b.id)} className="flex items-start gap-3 flex-1 min-w-0 text-left" aria-label={`View ${b.name} brand profile`}>
                <IconCircle icon={Building2} tone={b.score > 0 ? 'blue' : 'slate'} className={b.score > 0 ? '' : 'bg-white'} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[15px] font-medium text-slate-900">{b.name}</p>
                    {b.pro && <Badge tone="violet" icon={Crown}>Pro</Badge>}
                    {b.score > 0 && <Badge tone="blue">{b.score === 1 ? '1 match' : `${b.score} matches`}</Badge>}
                  </div>
                  <p className="text-[13px] text-slate-500">{b.industry} · supports {b.supports.join(', ').toLowerCase()}</p>
                  <p className="text-[13px] text-slate-700 mt-0.5">{b.offer}</p>
                  {b.wantsMet.length > 0 && (
                    <p className="text-[12px] text-emerald-700 mt-0.5">Wants what you offer: {b.wantsMet.map(perkLabel).join(', ')}</p>
                  )}
                  <p className="mt-0.5 text-[12px] font-medium text-[#003CF5] inline-flex items-center">View brand profile <ChevronRight className="w-3.5 h-3.5" /></p>
                </div>
              </button>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={canCall(viewerIsPro, b.pro) ? Phone : Crown}
                  className="h-11"
                  aria-label={`Call ${b.name}`}
                  onClick={() => onCall(brandTarget(b))}
                >
                  Call
                </Button>
                <Button size="sm" variant="outline" icon={Send} className="h-11" onClick={() => onInquiry(brandTarget(b))}>
                  Send inquiry
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BrandsView({ brand, onEditBrand, onInquiry, onCall, viewerIsPro }) {
  const [kind, setKind] = useState('All');
  const [showBrand, setShowBrand] = useState(false);
  const wants = brand?.wants || [];
  // Events that give what this brand wants come first
  const list = OPPORTUNITIES.filter((o) => kind === 'All' || o.kind === kind)
    .map((o) => ({ ...o, wantsMet: wants.filter((w) => w in (o.perks || {})) }))
    .sort((a, b) => b.wantsMet.length - a.wantsMet.length);
  const eventTarget = (item) => ({ id: item.id, name: item.eventTitle, subtitle: item.organization, kind: 'organizer', pro: item.pro, packages: item.packages, perks: item.perks });

  return (
    <div className="space-y-4">
      {!brand?.name ? (
        <BrandProfilePrompt onSetup={onEditBrand} />
      ) : showBrand ? (
        <div className="space-y-2">
          <BrandProfileCard brand={{ ...brand, pro: viewerIsPro }} isOwn onEdit={onEditBrand} />
          <button type="button" onClick={() => setShowBrand(false)} className="h-11 text-[13px] font-medium text-[#003CF5]">Hide brand profile</button>
        </div>
      ) : (
        <Panel className="flex items-center gap-3">
          {brand.logo?.src
            ? <img src={brand.logo.src} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
            : <IconCircle icon={Building2} tone="blue" size="sm" className="bg-white" />}
          <button type="button" onClick={() => setShowBrand(true)} className="flex-1 min-w-0 text-left">
            <p className="text-[15px] font-medium text-slate-900 truncate">{brand.name}</p>
            <p className="text-[13px] text-slate-500 truncate">Your brand profile · tap to view</p>
          </button>
          <Button size="sm" variant="ghost" icon={Pencil} className="h-11 shrink-0" onClick={onEditBrand}>
            Edit
          </Button>
        </Panel>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {KIND_FILTERS.map((k) => (
          <Chip key={k} selected={kind === k} onClick={() => setKind(k)}>{k}</Chip>
        ))}
      </div>

      {list.map((item) => (
        <article key={item.id} className="rounded-[28px] border border-slate-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[17px] font-semibold text-slate-900 leading-snug">
                {item.eventTitle}
                {item.pro && <Badge tone="violet" icon={Crown} className="ml-2 align-middle">Pro</Badge>}
              </h3>
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
              {item.wantsMet.length > 0 && (
                <p className="mt-1.5 text-[12px] text-emerald-700">Gives what you want: {item.wantsMet.map(perkLabel).join(', ')}</p>
              )}
            </div>
          )}

          <PackageList packages={item.packages} />

          <div className="flex gap-2 sm:justify-end">
            <Button variant="secondary" icon={canCall(viewerIsPro, item.pro) ? Phone : Crown} onClick={() => onCall(eventTarget(item))}>
              Call
            </Button>
            <Button icon={Handshake} className="flex-1 sm:flex-none" onClick={() => onInquiry(eventTarget(item))}>
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
const BRAND_KEY = 'aygo.brandProfile';

function loadBrandProfile() {
  try {
    return JSON.parse(readStorage(BRAND_KEY)) || null;
  } catch {
    return null;
  }
}
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
      id: 'b2', name: 'Lakbay Telco', subtitle: 'Telecom · brand', kind: 'brand', unread: 1, pro: true,
      messages: [{ id: 'm1', from: 'them', text: 'Hi! We saw your event on Aygo. How many reels can you do for our data promo?', time: '9:12 AM' }],
    },
  ],
  brand: [
    {
      id: 'spon-1', name: 'DevCon Manila Hackathon 2026', subtitle: 'Junior Developers Society', kind: 'organizer', unread: 1, pro: true,
      packages: SPONSORSHIP_LISTINGS[0].packages,
      perks: OPPORTUNITIES[0].perks,
      messages: [{
        id: 'm1', from: 'them', time: '8:40 AM',
        text: 'Thanks for checking our event! Here are our packages. Our Swag Sponsor package puts your logo on 450 tote bags.',
        packages: SPONSORSHIP_LISTINGS[0].packages,
      }],
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
// Follow-up replies once the packages are already in the chat
const FOLLOW_UP = {
  organizer: 'Noted, thanks! We will check it with our team.',
  brand: 'Noted! Tap Choose on any package above when you are ready, or tell us what you have in mind.',
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
  const pro = usePro();
  const [brand, setBrand] = useState(loadBrandProfile);
  const [brandDraft, setBrandDraft] = useState(null); // non-null while editing the brand profile
  const [call, setCall] = useState(null); // { target }

  const threads = role ? threadsByRole[role] : [];
  const unread = threads.reduce((n, t) => n + (t.unread || 0), 0);

  const canPublish = profile.eventName.trim() && profile.org.trim() && profile.attendance.trim();
  const showForm = role === 'organizer' && activeTab === 'main' && !published;
  const editingBrand = role === 'brand' && activeTab === 'main' && brandDraft;

  const saveBrand = () => {
    if (!brandDraft.name.trim()) {
      toast('Add your brand or company name.');
      return;
    }
    setBrand(brandDraft);
    writeStorage(BRAND_KEY, JSON.stringify(brandDraft));
    setBrandDraft(null);
    toast('Brand profile saved. Organizers see it with your inquiries.');
  };

  // Calls work when either side is on Pro
  const startCall = (target) => {
    if (!canCall(pro.isPro, target.pro)) {
      pro.openPaywall('calls');
      return;
    }
    setCall({ target });
  };

  const endCall = (seconds) => {
    const { target } = call;
    setCall(null);
    if (!seconds) return;
    const msg = { id: `c${Date.now()}`, from: 'me', text: `Aygo call · ${callLength(seconds)}`, time: chatTime() };
    setThreadsByRole((prev) => {
      const list = prev[role];
      const exists = list.some((t) => t.id === target.id);
      return {
        ...prev,
        [role]: exists
          ? list.map((t) => (t.id === target.id ? { ...t, messages: [...t.messages, msg] } : t))
          : [{ ...target, unread: 0, messages: [msg] }, ...list],
      };
    });
  };

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
        [currentRole]: prev[currentRole].map((t) => {
          if (t.id !== threadId) return t;
          // The organizer asks which package and shows the packages right in the chat
          const shown = t.messages.some((x) => x.packages || x.type === 'selection');
          const packages = currentRole === 'brand' && !shown && t.packages?.length ? t.packages : undefined;
          const text = packages || !shown ? REPLY[currentRole] : FOLLOW_UP[currentRole];
          return { ...t, typing: false, messages: [...t.messages, { id: `r${Date.now()}`, from: 'them', text, packages, time: chatTime() }] };
        }),
      }));
    }, 1600);
  };

  // Delayed reply from the other side
  const replyLater = (threadId, text, delay = 1400, extra = []) => {
    const currentRole = role;
    updateThreads((list) => list.map((t) => (t.id === threadId ? { ...t, typing: true } : t)));
    setTimeout(() => {
      setThreadsByRole((prev) => ({
        ...prev,
        [currentRole]: prev[currentRole].map((t) =>
          t.id === threadId
            ? {
              ...t,
              typing: false,
              messages: [
                ...t.messages,
                { id: `r${Date.now()}`, from: 'them', text, time: chatTime() },
                ...extra.map((x, i) => ({ id: `r${Date.now()}-${i}`, from: 'them', time: chatTime(), ...x })),
              ],
            }
            : t
        ),
      }));
    }, delay);
  };

  // Brand picks a package from the organizer's list
  const choosePackage = (threadId, pkg) => {
    if (!lockedRole) {
      lockRole();
      toast("You're now a brand account. You can still edit your profile, but you can't switch to organizer for 1 day.");
    }
    const msg = { id: `s${Date.now()}`, from: 'me', type: 'selection', text: `We'd like the ${pkg.tier} package.`, pkg, status: 'open', time: chatTime() };
    updateThreads((list) => list.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, msg] } : t)));
    replyLater(threadId, packageAmount(pkg.amount)
      ? 'Great choice! You can pay through Aygo right here to lock it in. We will send the logo specs next.'
      : 'Great choice! Confirm it here and we will send the list of items and the delivery date.');
  };

  const payPackage = (threadId, msgId, method) => {
    const selection = threads.find((t) => t.id === threadId)?.messages.find((m) => m.id === msgId);
    if (!selection) return;
    const amount = packageAmount(selection.pkg.amount);
    updateThreads((list) => list.map((t) => (
      t.id === threadId
        ? { ...t, messages: t.messages.map((m) => (m.id === msgId ? { ...m, status: 'paid', method } : m)) }
        : t
    )));
    toast(amount ? `Paid ${peso(amount)} via ${method}. Sponsorship confirmed.` : 'In-kind sponsorship confirmed.');
    const thread = threads.find((t) => t.id === threadId);
    replyLater(threadId, `Received! Welcome aboard as our ${selection.pkg.tier}. Here is everything we need from you. You can upload it right here.`, 1400, [
      { type: 'file_request', text: '', fileRequest: { items: filesForPackage(selection.pkg, thread?.perks), sent: [] } },
    ]);
  };

  // Brand sends files for a request card
  const sendFiles = (threadId, requestId, entries) => {
    const ids = entries.map((e) => e.typeId);
    const msg = { id: `f${Date.now()}`, from: 'me', type: 'brand_files', text: `Sent ${entries.length} ${entries.length === 1 ? 'item' : 'items'}.`, brandFiles: entries, time: chatTime() };
    updateThreads((list) => list.map((t) => (t.id !== threadId ? t : {
      ...t,
      messages: [
        ...t.messages.map((m) => (m.id === requestId ? { ...m, fileRequest: { ...m.fileRequest, sent: [...m.fileRequest.sent, ...ids] } } : m)),
        msg,
      ],
    })));
    toast('Files sent to the organizer');
    replyLater(threadId, 'Got them, thank you! We will send the layout proofs here for your approval.');
  };

  // Organizer asks a brand for files; the demo brand answers with its logo and colors
  const requestFiles = (threadId) => {
    const pkgText = { perks: profile.packages.map((p) => p.perks).join(' ') };
    const requestId = `q${Date.now()}`;
    const items = filesForPackage(pkgText, profile.perks);
    const msg = { id: requestId, from: 'me', type: 'file_request', text: 'Here are the files we need for your sponsorship.', fileRequest: { items, sent: [] }, time: chatTime() };
    updateThreads((list) => list.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, msg] } : t)));
    const thread = threads.find((t) => t.id === threadId);
    const name = thread?.name || 'Brand';
    const demo = [
      { typeId: 'logo', files: [demoLogo(name, '#E4002B', 'white')], text: '' },
      { typeId: 'logo-white', files: [demoLogo(name, '#1A1A1A', 'white', true)], text: '' },
      { typeId: 'guidelines', files: [], text: 'Primary red #E4002B, black #1A1A1A. Font: Montserrat Bold. Keep clear space around the logo.' },
    ];
    const currentRole = role;
    setTimeout(() => {
      setThreadsByRole((prev) => ({
        ...prev,
        [currentRole]: prev[currentRole].map((t) => (t.id !== threadId ? t : {
          ...t,
          messages: [
            ...t.messages.map((m) => (m.id === requestId ? { ...m, fileRequest: { ...m.fileRequest, sent: demo.map((d) => d.typeId) } } : m)),
            { id: `f${Date.now()}`, from: 'them', type: 'brand_files', text: 'Here are our logos and colors. Photos and captions will follow.', brandFiles: demo, time: chatTime() },
          ],
        })),
      }));
    }, 2200);
  };

  // Organizer shares their packages in a brand chat
  const sendPackages = (threadId) => {
    const packages = profile.packages.filter((p) => p.tier);
    if (!packages.length) {
      toast('Add your sponsorship packages to your event profile first.');
      return;
    }
    const msg = { id: `p${Date.now()}`, from: 'me', text: 'Here are our sponsorship packages.', packages, time: chatTime() };
    updateThreads((list) => list.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, msg] } : t)));
    replyLater(threadId, `Thanks! The ${packages[0].tier} looks like a fit. We will confirm with our marketing team.`);
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
    document.querySelector('[role="dialog"] .overscroll-contain')?.scrollTo({ top: 0 });
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
      subtitle={!role
        ? 'Match events with brands'
        : lockedRole
          ? `${role === 'brand' ? 'Brand' : 'Organizer'} account${msUntilSwitch > 0 ? ` · switch locked for ${timeLeft(msUntilSwitch)}` : ''}`
          : `Looking around as ${role === 'brand' ? 'a brand' : 'an organizer'}`}
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
      ) : editingBrand ? (
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" onClick={() => setBrandDraft(null)}>Cancel</Button>
          <Button full size="lg" onClick={saveBrand}>Save brand profile</Button>
        </div>
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

          {lockedRole && activeTab === 'main' && !brandDraft && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3">
              {msUntilSwitch > 0 ? <Lock className="w-5 h-5 text-amber-700 shrink-0" /> : <Repeat className="w-5 h-5 text-amber-700 shrink-0" />}
              <p className="flex-1 min-w-0 text-[13px] text-amber-900 leading-snug">
                <span className="font-semibold">{role === 'brand' ? 'Brand' : 'Organizer'} account.</span>{' '}
                {msUntilSwitch > 0
                  ? <>You can switch to {otherRole === 'brand' ? 'a brand' : 'an organizer'} account in <span className="font-semibold tabular-nums">{timeLeft(msUntilSwitch)}</span>. You can still edit your profile.</>
                  : <>You can switch to {otherRole === 'brand' ? 'a brand' : 'an organizer'} account now.</>}
              </p>
              {msUntilSwitch <= 0 && (
                <Button size="sm" variant="secondary" className="h-11 shrink-0 bg-white" onClick={switchRole}>
                  Switch
                </Button>
              )}
            </div>
          )}

          {activeTab === 'chats' ? (
            <SponsorChat
              threads={threads}
              activeId={activeThreadId}
              onOpen={openThread}
              onBack={() => setActiveThreadId(null)}
              onSend={sendMessage}
              onCall={startCall}
              viewerIsPro={pro.isPro}
              onChoosePackage={role === 'brand' ? choosePackage : undefined}
              onPayPackage={payPackage}
              onSendPackages={role === 'organizer' && published ? sendPackages : undefined}
              onRequestFiles={role === 'organizer' ? requestFiles : undefined}
              onSendFiles={role === 'brand' ? sendFiles : undefined}
              brandKit={brand}
            />
          ) : role === 'brand' ? (
            brandDraft ? (
              <BrandProfileForm brand={brandDraft} onChange={setBrandDraft} />
            ) : (
              <BrandsView
                brand={brand}
                onEditBrand={() => setBrandDraft(brand || EMPTY_BRAND)}
                onInquiry={startInquiry}
                onCall={startCall}
                viewerIsPro={pro.isPro}
              />
            )
          ) : published ? (
            <OrganizerProfileView profile={profile} photos={photos} registrationLink={registrationLink} onEdit={() => setPublished(false)} onInquiry={startInquiry} onCall={startCall} viewerIsPro={pro.isPro} />
          ) : (
            <OrganizerProfileForm profile={profile} setProfile={setProfile} photos={photos} onPhotosChange={onPhotosChange} registrationLink={registrationLink} onRegistrationLinkChange={onRegistrationLinkChange} />
          )}

          {call && (
            <CallScreen
              name={call.target.name}
              subtitle={call.target.subtitle}
              initial={call.target.name.slice(0, 1)}
              proNote={pro.isPro ? 'You have Pro' : `${call.target.name} has Pro`}
              onEnd={endCall}
            />
          )}
        </>
      )}
    </Sheet>
  );
}
