import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Package,
  Factory,
  Truck,
  MessageSquare,
  Video,
  CalendarCheck,
  CheckCircle2,
  Image as ImageIcon,
  Wallet,
  PenLine,
  Crown,
  Store,
  ArrowLeft
} from 'lucide-react';
import { INITIAL_REQUESTS } from '../data/mockData';
import { toast } from '../lib/toast';
import VerifiedContacts from './VerifiedContacts';
import {
  Sheet,
  Button,
  Field,
  Input,
  Badge,
  VerifiedBadge,
  Chip,
  Tabs,
  ListRow,
  Section,
  Panel,
  EmptyState
} from './ui';

const PROFILE_TABS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Catalog' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'bidding', label: 'Bid' }
];

const SAMPLE_REVIEWS = [
  { id: 'r1', name: 'Miguel A.', event: 'Philippine Tech Summit', rating: 5, text: 'Colors matched our brand guide exactly and everything arrived a day early at the venue.' },
  { id: 'r2', name: 'Karen D.', event: 'Fintech Leaders Forum', rating: 5, text: 'Very responsive on chat. Sent a digital mockup within hours and packed per size.' },
  { id: 'r3', name: 'Joanna R.', event: 'University Org Week', rating: 4, text: 'Solid quality for the price. Delivery was on time, packaging could be sturdier.' }
];

const CALL_TIMES = ['10:00 AM', '1:30 PM', '4:00 PM'];

const hideBroken = (e) => {
  e.currentTarget.style.visibility = 'hidden';
};

const shortDays = (text) => (text ? text.replace(/\s*business days?/i, ' days') : '—');

const peso = (n) =>
  `₱${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const pesoWhole = (n) => `₱${Math.round(Number(n || 0)).toLocaleString('en-PH')}`;

function findBid(supplierId) {
  for (const req of INITIAL_REQUESTS) {
    const bid = (req.bids || []).find((b) => b.supplierId === supplierId);
    if (bid) return { bid, request: req };
  }
  return null;
}

/** Maps a marketplace offer ({ bid, request }) to the fields this screen displays */
function toLegacyOffer({ bid, request }) {
  const qty = request.quantity || 1;
  return {
    request: { ...request, targetPricePerUnit: request.targetBudget / qty },
    bid: {
      ...bid,
      totalPrice: bid.total,
      leadTime: `${bid.leadDays} business days`,
      committedDelivery: new Date(bid.deliveryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: bid.status === 'accepted' ? 'Accepted' : bid.status === 'countered' ? 'Counter-offer sent' : 'Waiting for your decision',
      inclusions: Array.isArray(bid.inclusions) ? bid.inclusions.join(' · ') : bid.inclusions,
    },
  };
}

/** Next three weekdays, formatted for the call slot picker */
function upcomingDays() {
  const days = [];
  const d = new Date();
  while (days.length < 3) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      days.push(d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
  }
  return days;
}

function Stars({ value, className = 'w-3.5 h-3.5' }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${className} ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
        />
      ))}
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#F4F3F0] px-3 py-2.5 min-w-0">
      <p className="text-[12px] text-slate-500">{label}</p>
      <p className="text-[15px] font-semibold text-slate-900 leading-snug">{value}</p>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-200/70 last:border-0">
      <span className="text-[13px] text-slate-500 shrink-0">{label}</span>
      <span className="text-[14px] font-medium text-slate-900 text-right">{children}</span>
    </div>
  );
}

export default function SupplierProfileModal({
  supplier,
  onClose,
  onAcceptBid,
  onOpenChat,
  onOpenSupplierSetup,
  liveOffer
}) {
  const [activeTab, setActiveTab] = useState('about');
  const [counterPrice, setCounterPrice] = useState('');
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [callBooked, setCallBooked] = useState(false);
  const [isBookingCall, setIsBookingCall] = useState(false);
  const [callDay, setCallDay] = useState(null);
  const [callTime, setCallTime] = useState(null);

  if (!supplier) return null;

  const services = supplier.services || [];
  const blanks = supplier.supportedBlanks || [];
  const dispatch = supplier.dispatchOptions || [];
  const isPro = Boolean(supplier.proStorefront);
  const minOrder = supplier.minOrder || (services.length ? Math.min(...services.map((s) => s.moq)) : null);
  const serviceAreas =
    supplier.serviceAreas || [...new Set(['Metro Manila', supplier.city, 'Nearby provinces'].filter(Boolean))];
  // Prefer this maker's live offer on the organizer's active request, else sample data
  const bidMatch = liveOffer ? toLegacyOffer(liveOffer) : findBid(supplier.id);
  const bid = bidMatch?.bid;
  const request = bidMatch?.request;
  const callDays = upcomingDays();

  const openChat = () => {
    if (onOpenChat) onOpenChat(supplier);
    onClose();
  };

  const acceptBid = () => {
    if (onAcceptBid) onAcceptBid(supplier);
    onClose();
  };

  const sendCounter = () => {
    const value = Number(counterPrice);
    if (!value || value <= 0) {
      toast('Enter a price per piece for your counter-offer.');
      return;
    }
    toast(`Counter-offer of ${peso(value)}/pc sent to ${supplier.name}.`);
    setShowCounterInput(false);
    setCounterPrice('');
  };

  const confirmCall = () => {
    setCallBooked(true);
    setIsBookingCall(false);
    toast(`Call booked for ${callDay}, ${callTime}. ${supplier.contactPerson || 'The supplier'} gets it by email and calendar invite.`);
  };

  // ---- Book-a-call view (Pro storefronts) ----
  if (isBookingCall) {
    return (
      <Sheet
        onClose={onClose}
        size="sm"
        icon={Video}
        title="Book a call"
        subtitle={`15-minute video call with ${supplier.contactPerson || supplier.name}`}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" size="lg" icon={ArrowLeft} onClick={() => setIsBookingCall(false)} aria-label="Back to profile" className="w-[52px] px-0" />
            <Button size="lg" full icon={CalendarCheck} disabled={!callDay || !callTime} onClick={confirmCall}>
              Confirm call
            </Button>
          </div>
        }
      >
        <Section title="Pick a day">
          <div className="flex flex-wrap gap-2">
            {callDays.map((d) => (
              <Chip key={d} selected={callDay === d} onClick={() => setCallDay(d)} className="h-11">
                {d}
              </Chip>
            ))}
          </div>
        </Section>
        <Section title="Pick a time">
          <div className="flex flex-wrap gap-2">
            {CALL_TIMES.map((t) => (
              <Chip key={t} selected={callTime === t} onClick={() => setCallTime(t)} className="h-11">
                {t}
              </Chip>
            ))}
          </div>
        </Section>
        <Panel className="mt-2 text-[13px] text-slate-600">
          Times are in Philippine time. You and the supplier both get a calendar invite with the video link.
        </Panel>
      </Sheet>
    );
  }

  // ---- Main storefront ----
  const footer = (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="lg"
        icon={MessageSquare}
        onClick={openChat}
        className={bid ? '' : 'flex-1'}
      >
        Chat
      </Button>
      {bid ? (
        <Button size="lg" full icon={CheckCircle2} onClick={acceptBid}>
          Accept · {pesoWhole(bid.totalPrice)}
        </Button>
      ) : (
        isPro && (
          <Button size="lg" full icon={Video} onClick={() => setIsBookingCall(true)}>
            {callBooked ? 'Book another call' : 'Book a call'}
          </Button>
        )
      )}
    </div>
  );

  return (
    <Sheet onClose={onClose} size="lg" title={supplier.name} subtitle={supplier.tagline} footer={footer}>
      {/* Hero */}
      <div className="relative">
        <div className="h-28 sm:h-44 rounded-2xl overflow-hidden bg-[#F4F3F0]">
          {supplier.coverImage && (
            <img src={supplier.coverImage} alt={`${supplier.name} workshop`} className="w-full h-full object-cover" onError={hideBroken} />
          )}
        </div>
        <div className="absolute -bottom-7 left-4 w-16 h-16 rounded-2xl ring-4 ring-white overflow-hidden bg-[#F4F3F0] flex items-center justify-center">
          {supplier.avatar ? (
            <img src={supplier.avatar} alt={supplier.contactPerson || supplier.name} className="w-full h-full object-cover" onError={hideBroken} />
          ) : (
            <Store className="w-6 h-6 text-slate-500" />
          )}
        </div>
      </div>

      <div className="pl-[88px] pt-2 min-h-[40px] flex flex-wrap items-center gap-1.5">
        <VerifiedBadge />
        {isPro && <Badge tone="violet" icon={Crown}>Pro</Badge>}
        {callBooked && <Badge tone="green" icon={CalendarCheck}>Call booked</Badge>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Stars value={supplier.rating} />
          <span className="font-semibold text-slate-900">{supplier.rating}</span>
          <span>({supplier.reviewsCount} reviews)</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {supplier.city}
        </span>
      </div>

      {/* Key numbers */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat label="On-time delivery" value={supplier.onTimeRate || '—'} />
        <Stat label="Lead time" value={shortDays(supplier.avgLeadTime)} />
        <Stat label="Min. order" value={minOrder ? `${minOrder} ${minOrder === 1 ? 'pc' : 'pcs'}` : '—'} />
        <Stat label="Distance" value={supplier.distanceFromVenue ? supplier.distanceFromVenue.replace(/ from .*/, '') + ' away' : supplier.city} />
      </div>

      {isPro && bid && (
        <button
          type="button"
          onClick={() => setIsBookingCall(true)}
          className="mt-3 w-full flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 min-h-[56px] text-left hover:bg-[#F4F3F0] transition-colors"
        >
          <span className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[15px] font-medium text-slate-900">
              {callBooked ? 'Call booked · book another' : 'Book a call'}
            </span>
            <span className="block text-[13px] text-slate-500 truncate">
              15 min with {supplier.contactPerson || 'the team'} to talk specs
            </span>
          </span>
        </button>
      )}

      <Tabs tabs={PROFILE_TABS} value={activeTab} onChange={setActiveTab} className="mt-5 sticky top-0 z-10" />

      {/* About */}
      {activeTab === 'about' && (
        <div className="pt-2">
          <Section title="About the business">
            <p className="text-[15px] leading-relaxed text-slate-700">{supplier.bio}</p>
          </Section>

          <Section title="Production">
            <Panel className="py-1">
              <DetailRow label="Daily capacity">{supplier.dailyCapacity || 'Shared on request'}</DetailRow>
              <DetailRow label="Minimum order">{minOrder ? `From ${minOrder} pcs` : 'Ask the maker'}</DetailRow>
              <DetailRow label="Typical lead time">{supplier.avgLeadTime || 'Ask the maker'}</DetailRow>
              <DetailRow label="Payment terms">{supplier.terms || 'Ask the maker'}</DetailRow>
            </Panel>
          </Section>

          <Section title="Location and service areas">
            <ListRow icon={Factory} tone="blue" title={supplier.city} subtitle={supplier.address} />
            <div className="flex flex-wrap gap-1.5 mt-1">
              {serviceAreas.map((a) => (
                <Badge key={a} tone="slate" className="text-[12px] px-2.5 py-1">{a}</Badge>
              ))}
            </div>
            {supplier.pickupHours && (
              <p className="mt-3 text-[13px] text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {supplier.pickupHours}
              </p>
            )}
          </Section>

          {dispatch.length > 0 && (
            <Section title="Delivery options">
              <div className="divide-y divide-slate-100">
                {dispatch.map((opt) => (
                  <ListRow key={opt} icon={Truck} tone="green" title={opt} className="py-2" />
                ))}
              </div>
            </Section>
          )}

          <Section title="Verified accounts">
            <VerifiedContacts supplier={supplier} onMessage={openChat} />
          </Section>

          <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-[#F4F3F0] px-4 py-3">
            <span className="text-[13px] text-slate-500">Own this business?</span>
            <Button
              variant="ghost"
              size="sm"
              icon={PenLine}
              className="h-11 text-[#003CF5]"
              onClick={() => {
                if (onOpenSupplierSetup) onOpenSupplierSetup(supplier);
                onClose();
              }}
            >
              Edit profile
            </Button>
          </div>
        </div>
      )}

      {/* Catalog */}
      {activeTab === 'services' && (
        <div className="pt-2">
          <Section title="Products and services">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {services.map((svc) => (
                <div key={svc.name} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[15px] font-medium text-slate-900 leading-snug">{svc.name}</p>
                    {svc.priceTier && <Badge tone="blue">{svc.priceTier}</Badge>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-slate-500">
                    <span className="inline-flex items-center gap-1"><Package className="w-3.5 h-3.5" />MOQ {svc.moq} pcs</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{svc.turnaround}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {blanks.length > 0 && (
            <Section title="Materials in stock">
              <div className="flex flex-wrap gap-1.5">
                {blanks.map((b) => (
                  <Badge key={b} tone="slate" className="text-[12px] px-2.5 py-1">{b}</Badge>
                ))}
              </div>
            </Section>
          )}

          <Section title="Previous projects">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(supplier.portfolio || services.slice(0, 3).map((s, i) => ({ title: s.name, image: i === 0 ? supplier.coverImage : null }))).map((p) => (
                <figure key={p.title} className="rounded-2xl overflow-hidden bg-[#F4F3F0]">
                  <div className="aspect-[4/3] flex items-center justify-center bg-[#F4F3F0]">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" onError={hideBroken} />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <figcaption className="px-3 py-2 text-[12px] font-medium text-slate-700 truncate">{p.title}</figcaption>
                </figure>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Reviews */}
      {activeTab === 'reviews' && (
        <div className="pt-2">
          <Panel className="flex items-center gap-4 mt-3">
            <p className="text-[34px] font-semibold text-slate-900 leading-none">{supplier.rating}</p>
            <div>
              <Stars value={supplier.rating} className="w-4 h-4" />
              <p className="mt-1 text-[13px] text-slate-500">
                {supplier.reviewsCount} verified reviews · {supplier.onTimeRate} on time
              </p>
            </div>
          </Panel>
          <Section title="Recent reviews">
            <div className="divide-y divide-slate-100">
              {(supplier.reviews || SAMPLE_REVIEWS).map((r) => (
                <article key={r.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[15px] font-medium text-slate-900">{r.name}</p>
                    <Stars value={r.rating} className="w-3 h-3" />
                  </div>
                  <p className="text-[12px] text-slate-500">{r.event}</p>
                  <p className="mt-1.5 text-[14px] text-slate-700 leading-relaxed">{r.text}</p>
                </article>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Bid */}
      {activeTab === 'bidding' && (
        <div className="pt-2">
          {bid ? (
            <>
              <Section title={request ? `Bid for "${request.title}"` : 'Current bid'}>
                <Panel>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[13px] text-slate-500">Price per piece</p>
                      <p className="text-[28px] font-semibold text-slate-900 leading-tight">{peso(bid.pricePerUnit)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] text-slate-500">
                        Total{request?.quantity ? ` for ${request.quantity} pcs` : ''}
                      </p>
                      <p className="text-[17px] font-semibold text-[#003CF5]">{peso(bid.totalPrice)}</p>
                    </div>
                  </div>
                  {request?.targetPricePerUnit && bid.pricePerUnit <= request.targetPricePerUnit && (
                    <Badge tone="green" icon={Wallet} className="mt-2">Within your budget</Badge>
                  )}
                </Panel>
              </Section>

              <div className="rounded-2xl border border-slate-200 px-4 py-1">
                <DetailRow label="Production time">{bid.leadTime}</DetailRow>
                <DetailRow label="Delivery date">{bid.committedDelivery}</DetailRow>
                <DetailRow label="Status">{bid.status}</DetailRow>
              </div>

              <Section title="Inclusions">
                <p className="text-[15px] text-slate-700 leading-relaxed">{bid.inclusions}</p>
              </Section>

              {bid.notes && (
                <Section title="Proposal notes">
                  <p className="text-[15px] text-slate-700 leading-relaxed rounded-2xl bg-[#F4F3F0] px-4 py-3">“{bid.notes}”</p>
                </Section>
              )}

              {showCounterInput ? (
                <Panel className="mt-2 space-y-3">
                  <Field label="Your counter-offer (per piece)" hint="The supplier gets a notification and can accept or reply.">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-slate-500">₱</span>
                      <Input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.5"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(e.target.value)}
                        placeholder={String(Math.max(1, Math.floor(bid.pricePerUnit * 0.93)))}
                        className="pl-8 bg-white"
                      />
                    </div>
                  </Field>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setShowCounterInput(false)}>Cancel</Button>
                    <Button variant="outline" full onClick={sendCounter}>Send counter-offer</Button>
                  </div>
                </Panel>
              ) : (
                <Button variant="outline" full className="mt-3" onClick={() => setShowCounterInput(true)}>
                  Make a counter-offer
                </Button>
              )}
            </>
          ) : (
            <EmptyState
              icon={Wallet}
              title="No bid from this maker yet"
              text="Chat with them to share your specs, or invite them to bid on your open request."
              action={
                <Button
                  variant="outline"
                  onClick={() => toast(`Invite sent. ${supplier.name} will be notified of your open request.`)}
                >
                  Invite to bid
                </Button>
              }
            />
          )}
        </div>
      )}
    </Sheet>
  );
}
