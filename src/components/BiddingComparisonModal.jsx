import React, { useMemo, useState } from 'react';
import { ArrowLeftRight, Star, MessageSquare, Check, BadgeCheck } from 'lucide-react';
import { Sheet, Button, Badge, Input, Tabs, cx } from './ui';
import { peso, shortDate, rankBids } from '../lib/marketplace';

const SORTS = [
  { id: 'best', label: 'Best match' },
  { id: 'price', label: 'Lowest price' },
  { id: 'fast', label: 'Fastest' },
  { id: 'rating', label: 'Top rated' },
];

const sorters = {
  best: () => 0,
  price: (a, b) => a.total - b.total,
  fast: (a, b) => a.leadDays - b.leadDays,
  rating: (a, b) => b.supplier.rating - a.supplier.rating,
};

/** Side-by-side comparison of every offer on a request, with accept and counter-offer */
export default function BiddingComparisonModal({ request, onClose, onAccept, onCounter, onChat }) {
  const [sort, setSort] = useState('best');
  const [counterFor, setCounterFor] = useState(null);
  const [counterPrice, setCounterPrice] = useState('');

  const bids = useMemo(() => [...rankBids(request.bids, request)].sort(sorters[sort]), [request, sort]);
  const targetUnit = request.targetBudget / (request.quantity || 1);

  const submitCounter = (bid) => {
    const price = Number(counterPrice);
    if (!price) return;
    onCounter(bid, price);
    setCounterFor(null);
    setCounterPrice('');
  };

  return (
    <Sheet
      title="Compare offers"
      subtitle={`${request.title} · ${request.quantity} ${request.unit || 'pcs'} · budget ${peso(request.targetBudget)} (${peso(targetUnit, 2)}/pc)`}
      icon={ArrowLeftRight}
      onClose={onClose}
      size="xl"
    >
      <Tabs tabs={SORTS} value={sort} onChange={setSort} className="mb-4" />

      <div className="space-y-3">
        {bids.map((bid) => {
          const over = bid.total - request.targetBudget;
          return (
            <article key={bid.id} className="rounded-[22px] border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <img
                  src={bid.supplier.avatar}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover bg-[#F4F3F0] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[15px] font-semibold text-slate-900">{bid.supplier.shortName}</span>
                    {bid.supplier.verified && <BadgeCheck className="w-4 h-4 text-[#003CF5]" aria-label="Verified" />}
                    {bid.tags.map((t) => (
                      <Badge key={t} tone={t === 'Best match' ? 'solidGreen' : t === 'Lowest price' ? 'green' : 'blue'}>{t}</Badge>
                    ))}
                  </div>
                  <p className="text-[13px] text-slate-500 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {bid.supplier.rating} ({bid.supplier.reviewsCount}) · {bid.supplier.city} · {bid.supplier.km} km
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[17px] font-semibold text-slate-900">{peso(bid.pricePerUnit, 2)}<span className="text-[12px] font-normal text-slate-500">/pc</span></p>
                  <p className={cx('text-[12px]', over > 0 ? 'text-amber-700' : 'text-emerald-700')}>
                    {peso(bid.total)} {over > 0 ? `· ${peso(over)} over` : '· in budget'}
                  </p>
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                <div className="rounded-xl bg-[#F4F3F0] px-2.5 py-2">
                  <dt className="text-slate-500">Production</dt>
                  <dd className="font-medium text-slate-900">{bid.leadDays} days</dd>
                </div>
                <div className="rounded-xl bg-[#F4F3F0] px-2.5 py-2">
                  <dt className="text-slate-500">Delivery</dt>
                  <dd className="font-medium text-slate-900">{shortDate(bid.deliveryDate)}</dd>
                </div>
                <div className="rounded-xl bg-[#F4F3F0] px-2.5 py-2">
                  <dt className="text-slate-500">On time</dt>
                  <dd className="font-medium text-slate-900">{bid.supplier.onTimeRate}</dd>
                </div>
              </dl>

              <p className="mt-3 text-[13px] text-slate-700">
                <span className="text-slate-500">Includes: </span>{bid.inclusions.join(' · ')}
              </p>
              <p className="mt-1 text-[13px] text-slate-500">Terms: {bid.supplier.terms}</p>

              {bid.status === 'countered' ? (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
                  Counter-offer of {peso(bid.counterPrice, 2)}/pc sent. Waiting for {bid.supplier.shortName}…
                </p>
              ) : counterFor === bid.id ? (
                <div className="mt-3 flex gap-2">
                  <Input
                    type="number"
                    inputMode="decimal"
                    min="1"
                    step="0.5"
                    autoFocus
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    placeholder={`Your price per pc (e.g. ${Math.round(bid.pricePerUnit * 0.92)})`}
                    className="py-2.5"
                  />
                  <Button onClick={() => submitCounter(bid)} disabled={!Number(counterPrice)}>Send</Button>
                  <Button variant="ghost" onClick={() => setCounterFor(null)}>Cancel</Button>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" size="sm" icon={MessageSquare} onClick={() => onChat(bid.supplier)}>Chat</Button>
                  <Button variant="secondary" size="sm" onClick={() => { setCounterFor(bid.id); setCounterPrice(''); }}>Counter-offer</Button>
                  <Button size="sm" icon={Check} className="ml-auto" onClick={() => onAccept(bid)}>Accept</Button>
                </div>
              )}
              {bid.revised && bid.status === 'pending' && (
                <p className="mt-2 text-[12px] text-emerald-700">{bid.supplier.shortName} revised their offer to {peso(bid.pricePerUnit, 2)}/pc.</p>
              )}
            </article>
          );
        })}
      </div>
    </Sheet>
  );
}
