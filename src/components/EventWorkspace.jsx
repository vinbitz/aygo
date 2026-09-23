import React, { useState } from 'react';
import {
  CalendarDays, ClipboardCheck, Wallet, Package, FileText, Sparkles, Megaphone, Check, Plus, Crown,
} from 'lucide-react';
import { Sheet, Button, Badge, Section, ListRow, cx } from './ui';
import { peso, shortDate } from '../lib/marketplace';
import EventPhotos from './EventPhotos';
import RegistrationLink from './RegistrationLink';

const DEFAULT_CHECKLIST = [
  { id: 'venue', label: 'Confirm venue and delivery bay hours', done: true },
  { id: 'artwork', label: 'Send final artwork to all makers', done: false },
  { id: 'proofs', label: 'Approve digital proofs', done: false },
  { id: 'payment', label: 'Pay downpayments', done: false },
  { id: 'delivery', label: 'Receive and count deliveries', done: false },
  { id: 'kits', label: 'Pack attendee kits', done: false },
  { id: 'eventday', label: 'Event day: registration table setup', done: false },
];

const STATUS = {
  booked: { label: 'Booked', tone: 'green' },
  bidding: { label: 'Getting offers', tone: 'blue' },
};

/**
 * One workspace per event: every request, its offers and booked maker,
 * the running budget, documents, sponsors and the event-day checklist.
 */
export default function EventWorkspace({
  requests,
  activeRequestId,
  venue,
  onClose,
  onSelectRequest,
  onNewRequest,
  onOpenDocs,
  onOpenMockup,
  onOpenSponsorship,
  photos,
  onPhotosChange,
  registrationLink,
  onRegistrationLinkChange,
}) {
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);

  const planned = requests.reduce((sum, r) => sum + (Number(r.targetBudget) || 0), 0);
  const committed = requests.reduce((sum, r) => {
    const bid = r.bids.find((b) => b.id === r.acceptedBidId);
    return sum + (bid ? bid.total : 0);
  }, 0);
  const booked = requests.filter((r) => r.status === 'booked').length;
  const doneCount = checklist.filter((c) => c.done).length;
  const nextDeadline = requests
    .map((r) => r.deliveryDate)
    .filter(Boolean)
    .sort()[0];

  return (
    <Sheet
      title="Event workspace"
      subtitle={`${venue?.name || 'Your event'}${nextDeadline ? ` · first delivery ${shortDate(nextDeadline)}` : ''}`}
      icon={CalendarDays}
      onClose={onClose}
      size="lg"
      headerAction={<Badge tone="violet" icon={Crown} className="self-center">Pro</Badge>}
      footer={<Button size="lg" full icon={Plus} onClick={onNewRequest}>Add supplies to this event</Button>}
    >
      {/* Event cover */}
      {photos?.cover && (
        <img src={photos.cover.src} alt="Event cover" className="w-full aspect-[21/9] object-cover rounded-[22px] mb-4" />
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Budget" value={peso(planned)} />
        <Stat label="Committed" value={peso(committed)} tone={committed > planned ? 'text-amber-700' : 'text-slate-900'} />
        <Stat label="Suppliers booked" value={`${booked}/${requests.length}`} />
      </div>
      <div className="mt-2 h-2 rounded-full bg-[#F4F3F0] overflow-hidden" aria-label="Budget used">
        <div className="h-full bg-[#003CF5] rounded-full" style={{ width: `${Math.min(100, planned ? (committed / planned) * 100 : 0)}%` }} />
      </div>

      <Section title="Supplies & requests" className="pt-5">
        <div className="space-y-2">
          {requests.map((r) => {
            const bid = r.bids.find((b) => b.id === r.acceptedBidId);
            const status = STATUS[r.status] || STATUS.bidding;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRequest(r.id)}
                className={cx(
                  'w-full text-left rounded-2xl p-3.5 transition-colors',
                  r.id === activeRequestId ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : 'bg-[#F4F3F0] hover:bg-[#ECEAE5]'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-medium text-slate-900 truncate">{r.title}</span>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
                <p className="mt-0.5 text-[13px] text-slate-500 truncate">
                  {r.quantity} {r.unit || 'pcs'} · {peso(r.targetBudget)} · by {shortDate(r.deliveryDate)}
                </p>
                <p className="mt-1 text-[13px] text-slate-700 truncate">
                  {bid
                    ? `${bid.supplier.shortName} · ${peso(bid.total)} · ready ${shortDate(bid.deliveryDate)}`
                    : `${r.bids.length} offer${r.bids.length === 1 ? '' : 's'} from ${r.matchedCount} matched makers`}
                </p>
              </button>
            );
          })}
          {requests.length === 0 && <p className="text-[13px] text-slate-500">No supplies yet.</p>}
        </div>
      </Section>

      <Section title="Registration" className="pt-5">
        <RegistrationLink value={registrationLink} onChange={onRegistrationLinkChange} />
      </Section>

      <Section title="Event photos">
        <p className="mb-3 text-[13px] text-slate-500">Your cover and photos also show on your Sponsorship Connect profile.</p>
        <EventPhotos photos={photos} onChange={onPhotosChange} />
      </Section>

      <Section title={`Event day checklist · ${doneCount}/${checklist.length}`}>
        <ul className="divide-y divide-slate-100">
          {checklist.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setChecklist((prev) => prev.map((c) => (c.id === item.id ? { ...c, done: !c.done } : c)))}
                className="w-full flex items-center gap-3 py-3 text-left"
              >
                <span className={cx(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors',
                  item.done ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300'
                )}>
                  {item.done && <Check className="w-3.5 h-3.5" />}
                </span>
                <span className={cx('text-[15px]', item.done ? 'text-slate-400 line-through' : 'text-slate-900')}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Everything for this event">
        <ListRow icon={FileText} tone="amber" title="Quotes & documents" subtitle="RFQs, POs, comparison sheet, delivery checklist" onClick={onOpenDocs} />
        <ListRow icon={Sparkles} tone="violet" title="Mockups" subtitle="Designs attached to your requests" onClick={onOpenMockup} />
        <ListRow icon={Megaphone} tone="rose" title="Sponsorships" subtitle="Brands supporting this event" onClick={onOpenSponsorship} />
        <ListRow icon={Wallet} tone="green" title="Budget" subtitle={`${peso(Math.max(0, planned - committed))} left to allocate`} trailing={null} />
        <ListRow icon={Package} tone="blue" title="Deliveries" subtitle={`${booked} order${booked === 1 ? '' : 's'} in production`} trailing={null} />
        <ListRow icon={ClipboardCheck} tone="slate" title="Checklist progress" subtitle={`${Math.round((doneCount / checklist.length) * 100)}% done`} trailing={null} />
      </Section>
    </Sheet>
  );
}

function Stat({ label, value, tone = 'text-slate-900' }) {
  return (
    <div className="rounded-2xl bg-[#F4F3F0] px-3 py-2.5">
      <p className="text-[12px] text-slate-500">{label}</p>
      <p className={cx('text-[15px] font-semibold truncate', tone)}>{value}</p>
    </div>
  );
}
