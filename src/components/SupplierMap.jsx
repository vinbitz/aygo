import React from 'react';
import { MapPin, Clock, Users, Gavel, MessageSquare, Pencil, Check, Sparkles, X, Factory } from 'lucide-react';
import { Button, Badge, cx } from './ui';
import PanelWidthSlider from './PanelWidthSlider';

const peso = (n) => `₱${Number(n || 0).toLocaleString('en-PH', { maximumFractionDigits: 0 })}`;
const short = (n) => (n >= 1000 ? `₱${Math.round(n / 100) / 10}k` : peso(n));

// Fallback spots around the workshop (percent of the map area) for requests without a pin
const SPOTS = [
  { x: 28, y: 34 }, { x: 72, y: 30 }, { x: 24, y: 70 }, { x: 76, y: 68 },
  { x: 52, y: 86 }, { x: 14, y: 50 }, { x: 86, y: 50 },
];
const spotFor = (r) => r.pin || SPOTS[[...r.id].reduce((n, c) => n + c.charCodeAt(0), 0) % SPOTS.length];

/** Illustrated map, same style as the organizer home */
function MapBackdrop() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1000 700" aria-hidden="true">
      <path d="M-50,320 C180,310 260,370 420,350 C580,330 680,410 850,390 C950,380 1050,420 1100,430" fill="none" stroke="#BFDBFE" strokeWidth="24" strokeLinecap="round" />
      <path d="M-50,320 C180,310 260,370 420,350 C580,330 680,410 850,390 C950,380 1050,420 1100,430" fill="none" stroke="#93C5FD" strokeWidth="18" strokeLinecap="round" />
      <path d="M120,-50 L260,750" fill="none" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M480,-50 L520,750" fill="none" stroke="#FFFFFF" strokeWidth="12" />
      <path d="M820,-50 L780,750" fill="none" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M-50,180 L1050,220" fill="none" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M-50,480 L1050,460" fill="none" stroke="#FFFFFF" strokeWidth="9" />
      <path d="M220,100 L450,100 M480,140 L780,140 M300,280 L520,280 M520,540 L820,540" fill="none" stroke="#E2E8F0" strokeWidth="4" />
      <path d="M350,-50 L380,750 M650,-50 L640,750" fill="none" stroke="#E2E8F0" strokeWidth="4" />
    </svg>
  );
}

/** The request a maker tapped: details and the bid action, like the organizer's offer card */
function RequestCard({ req, myBid, onBid, onAsk, onClose }) {
  return (
    <div className="rounded-[24px] border border-slate-200 p-4 animate-pop-in">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-slate-500">{req.organizer} · {req.posted}</p>
          <p className="text-[19px] font-semibold text-slate-900 leading-tight">{req.item}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close request" className="w-9 h-9 -mr-1 -mt-1 rounded-full hover:bg-[#F4F3F0] flex items-center justify-center shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Fact label="Budget" value={peso(req.budget)} />
        <Fact label="Quantity" value={`${req.qty.toLocaleString('en-PH')} pcs`} />
        <Fact label="Needed by" value={req.deadline} />
      </div>
      {req.specs && <p className="mt-3 text-[13px] text-slate-600 leading-snug">{req.specs}</p>}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-slate-500">
        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{req.venue} · {req.distance}</span>
        <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{req.bidsCount} bids</span>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" icon={MessageSquare} onClick={() => onAsk(req)} aria-label="Message organizer">Ask</Button>
        {myBid ? (
          <Button className="flex-1" variant="outline" icon={Pencil} onClick={() => onBid(req)}>
            Edit bid · {peso(myBid.price)}/pc
          </Button>
        ) : (
          <Button className="flex-1" icon={Gavel} onClick={() => onBid(req)}>Submit a bid</Button>
        )}
      </div>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#F4F3F0] px-3 py-2">
      <p className="text-[11.5px] text-slate-500">{label}</p>
      <p className="text-[14px] font-semibold text-slate-900 truncate">{value}</p>
    </div>
  );
}

/**
 * Supplier home in map style: open requests pop up as pins around the workshop,
 * tap one to see it and bid. The bottom sheet lists every request.
 */
export default function SupplierMap({
  requests,
  bidByRequest,
  selectedId,
  onSelect,
  incomingId,
  onDismissIncoming,
  onBid,
  onAsk,
  workshopName,
  topBar,
  sectionTitle,
  children,
}) {
  // My bids, Orders and Storefront show their own content in the same sheet
  const otherSection = Boolean(children);
  const selected = requests.find((r) => r.id === selectedId);
  const incoming = requests.find((r) => r.id === incomingId);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#E5ECF6]">
      {/* Map with request pins (the top part on phones, beside the panel on desktop) */}
      <div className="absolute inset-x-0 top-0 h-[46vh] lg:h-auto lg:inset-y-0 lg:left-[calc(var(--panel-w)+40px)] lg:right-0">
        <MapBackdrop />
        <div className="desk-zoom absolute inset-0">
          {/* Workshop */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="absolute w-56 h-56 rounded-full border border-[#003CF5]/25 bg-[#003CF5]/5 animate-pulse" />
            <div className="relative w-11 h-11 rounded-2xl bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <Factory className="w-5 h-5" />
            </div>
            <span className="relative mt-1.5 max-w-[160px] truncate text-[11px] font-semibold text-slate-800 bg-white/95 px-2.5 py-0.5 rounded-full shadow">
              {workshopName}
            </span>
          </div>

          {requests.map((r, i) => {
            const spot = spotFor(r);
            const active = r.id === selectedId;
            const bid = bidByRequest[r.id];
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelect(r.id)}
                aria-label={`${r.item}, ${peso(r.budget)} budget, ${r.distance}`}
                aria-pressed={active}
                style={{ left: `${spot.x}%`, top: `${spot.y}%`, animationDelay: `${i * 120}ms` }}
                className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center animate-pop-in"
              >
                <span
                  className={cx(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-full pl-2 pr-2.5 py-1 text-[12px] font-semibold shadow-lg border transition-colors',
                    active ? 'bg-[#003CF5] text-white border-[#003CF5]' : 'bg-white text-slate-900 border-slate-200'
                  )}
                >
                  {r.id === incomingId && !active && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                  {bid ? <Check className="w-3.5 h-3.5" /> : null}
                  {short(r.budget)}
                  <span className={cx('font-normal max-w-[90px] truncate', active ? 'text-blue-100' : 'text-slate-500')}>{r.item}</span>
                </span>
                <span className={cx('w-0 h-0 border-x-[6px] border-x-transparent border-t-[7px] -mt-px', active ? 'border-t-[#003CF5]' : 'border-t-white')} />
              </button>
            );
          })}
        </div>
      </div>

      {topBar}

      {/* Sheet over the map on phones, floating panel on desktop */}
      <div className="absolute inset-0 z-20 overflow-y-auto no-scrollbar overscroll-contain pointer-events-none lg:inset-auto lg:top-24 lg:bottom-5 lg:left-7 lg:w-[var(--panel-w)] 2xl:top-28 lg:rounded-[32px]">
        <div className="h-[42vh] lg:hidden" />
        <div className={cx(
          'desk-zoom pointer-events-auto rounded-t-[28px] lg:rounded-[32px] min-h-[58vh] lg:min-h-0 pt-2.5 pb-28 lg:pb-5 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] space-y-3',
          otherSection ? 'bg-[#F2F1ED] px-2' : 'bg-white px-4'
        )}>
          <div className="flex justify-center lg:hidden">
            <div className="w-9 h-1 bg-slate-200 rounded-full" />
          </div>
          <PanelWidthSlider />

          {incoming && incoming.id !== selectedId && (
            <button
              type="button"
              onClick={() => onSelect(incoming.id)}
              className="w-full flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-left animate-pop-in"
            >
              <span className="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5" /></span>
              <span className="flex-1 min-w-0">
                <span className="block text-[12px] font-semibold text-emerald-800">New request nearby · {incoming.distance}</span>
                <span className="block text-[15px] font-semibold text-slate-900 truncate">{incoming.item}</span>
                <span className="block text-[12.5px] text-slate-600 truncate">{incoming.organizer} · {peso(incoming.budget)} · by {incoming.deadline}</span>
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label="Dismiss"
                onClick={(e) => { e.stopPropagation(); onDismissIncoming(); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onDismissIncoming(); } }}
                className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-slate-500 shrink-0"
              >
                <X className="w-4 h-4" />
              </span>
            </button>
          )}

          {/* Each section brings its own heading */}
          {otherSection && <div aria-label={sectionTitle} role="region">{children}</div>}

          {!otherSection && selected && (
            <RequestCard req={selected} myBid={bidByRequest[selected.id]} onBid={onBid} onAsk={onAsk} onClose={() => onSelect(null)} />
          )}

          {!otherSection && (
          <div>
            <div className="flex items-baseline justify-between px-1">
              <h2 className="text-[19px] font-semibold text-slate-900 tracking-tight">Requests near you</h2>
              <span className="text-[13px] text-slate-500">{requests.length} open</span>
            </div>
            <ul className="mt-2 divide-y divide-slate-100">
              {requests.map((r) => {
                const bid = bidByRequest[r.id];
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(r.id)}
                      className={cx('w-full flex items-center gap-3 py-3 px-1 text-left rounded-xl transition-colors', r.id === selectedId ? 'bg-blue-50/60' : 'hover:bg-[#F4F3F0]/60')}
                    >
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-medium text-slate-900 truncate">{r.item}</span>
                        <span className="block text-[13px] text-slate-500 truncate">
                          {r.organizer} · {r.qty.toLocaleString('en-PH')} pcs · {r.distance}
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-slate-500"><Clock className="w-3 h-3" />{r.posted}</span>
                      </span>
                      <span className="text-right shrink-0">
                        <span className="block text-[15px] font-semibold text-slate-900">{peso(r.budget)}</span>
                        {bid ? <Badge tone="green">Bid sent</Badge> : <span className="text-[12px] text-slate-500">by {r.deadline}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
