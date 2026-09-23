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
  Send
} from 'lucide-react';
import { SPONSORSHIP_LISTINGS } from '../data/mockData';
import { toast } from '../lib/toast';
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
  packages: DEFAULT_PACKAGES,
  deckLink: '',
  socialReach: ''
};

// Brands and the kinds of events they already support
const BRANDS = [
  { id: 'b1', name: 'Kape Tayo Coffee', industry: 'Food & beverage', supports: 'Campus fairs, hackathons, org weeks', offer: 'Free coffee for up to 500 guests', tags: ['Food & drinks', 'Prizes'] },
  { id: 'b2', name: 'Lakbay Telco', industry: 'Telecom', supports: 'Tech conferences, esports, student summits', offer: 'Cash ₱20,000–₱80,000 + data SIMs', tags: ['Cash', 'Prizes', 'Media partner'] },
  { id: 'b3', name: 'Habi Apparel', industry: 'Local fashion', supports: 'Fun runs, org anniversaries, cultural nights', offer: 'In-kind event shirts (up to 300 pcs)', tags: ['Event shirts', 'Lanyards & IDs'] },
  { id: 'b4', name: 'Ulap Cloud PH', industry: 'Cloud & software', supports: 'Hackathons, dev meetups', offer: 'Cloud credits + mentors', tags: ['Cloud credits', 'Prizes'] }
];

// Mock data listing plus a few more open opportunities
const OPPORTUNITIES = [
  ...SPONSORSHIP_LISTINGS.map((l) => ({ ...l, kind: 'Tech', audience: 'Student and junior developers', socialReach: '18k followers' })),
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

function OrganizerProfileForm({ profile, setProfile }) {
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

function OrganizerProfileView({ profile, onEdit }) {
  const matches = BRANDS.map((b) => ({ ...b, score: b.tags.filter((t) => profile.needs.includes(t)).length }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 p-4 sm:p-5">
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
        <div className="mt-4">
          <PackageList packages={profile.packages.filter((p) => p.tier)} />
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
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                icon={Send}
                className="h-11 shrink-0"
                onClick={() => toast(`Inquiry sent to ${b.name}.`)}
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

function BrandsView() {
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

          <PackageList packages={item.packages} />

          <div className="flex justify-end">
            <Button
              icon={Handshake}
              className="w-full sm:w-auto"
              onClick={() => toast(`Inquiry sent to the organizers of ${item.eventTitle}.`)}
            >
              Send inquiry
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function SponsorshipConnectModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('organizers');
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [published, setPublished] = useState(false);

  const canPublish = profile.eventName.trim() && profile.org.trim() && profile.attendance.trim();
  const showForm = activeTab === 'organizers' && !published;

  const handlePublish = () => {
    if (!canPublish) {
      toast('Add your event name, school or org, and expected attendance.');
      return;
    }
    setPublished(true);
    toast('Sponsorship profile published. Matching brands can now see it.');
  };

  return (
    <Sheet
      onClose={onClose}
      title="Sponsorship Connect"
      subtitle="Match student and community events with brands"
      icon={Handshake}
      size="lg"
      footer={
        showForm ? (
          <Button full size="lg" onClick={handlePublish}>
            Publish sponsorship profile
          </Button>
        ) : null
      }
    >
      <Tabs
        className="mb-4"
        value={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'organizers', label: 'For organizers', icon: GraduationCap },
          { id: 'brands', label: 'For brands', icon: Building2 }
        ]}
      />

      {activeTab === 'organizers' ? (
        published ? (
          <OrganizerProfileView profile={profile} onEdit={() => setPublished(false)} />
        ) : (
          <OrganizerProfileForm profile={profile} setProfile={setProfile} />
        )
      ) : (
        <BrandsView />
      )}
    </Sheet>
  );
}
