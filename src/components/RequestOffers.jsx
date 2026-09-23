import React, { useMemo, useState } from 'react';
import { Handshake, MessageSquare, Star, Clock, Truck, Check, Loader2, ArrowLeftRight, Plus } from 'lucide-react';
import { Button, Badge, VerifiedBadge, cx } from './ui';
import { peso, shortDate, rankBids, ORDER_STEPS } from '../lib/marketplace';

const TAG_TONE = { 'Best match': 'solidGreen', 'Lowest price': 'green', Fastest: 'blue' };

/**
 * Home-sheet section for the active request: live offers from makers,
 * the selected offer's details, and the order tracker once booked.
 */
export default function RequestOffers({ request, onAccept, onCompare, onChat, onViewSupplier, onNewRequest }) {
  const ranked = useMemo(() => (request ? rankBids(request.bids, request) : []), [request]);
  const [selectedId, setSelectedId] = useState(null);

  if (!request) {
    return (
      <section className="bg-white rounded-[28px] p-5 text-center">
        <p className="text-[15px] font-semibold text-slate-900">No active request</p>
        <p className="text-[13px] text-slate-500 mt-1">Post what you need and verified makers will send offers.</p>
        <Button className="mt-4" icon={Plus} onClick={onNewRequest}>New request</Button>
      </section>
    );
  }

  const accepted = request.bids.find((b) => b.id === request.acceptedBidId);
  const selected = ranked.find((b) => b.id === selectedId) || ranked[0];
  const waiting = request.pendingBids.length > 0;

  return (
    <section className="bg-white rounded-[28px] py-4">
      <div className="px-4 flex items-center gap-3">
        <span className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-[#003CF5] shrink-0">
          <Handshake className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-[19px] font-semibold text-slate-900 tracking-tight leading-tight">
            {accepted ? 'Your maker' : 'Choose a maker'}
          </h4>
          <p className="text-[13px] text-slate-500 truncate">
            {request.title} · {request.quantity} {request.unit || 'pcs'} · {peso(request.targetBudget)}
          </p>
        </div>
        {!accepted && ranked.length > 1 && (
          <button
            type="button"
            onClick={onCompare}
            className="shrink-0 h-9 px-3 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-[13px] font-medium text-slate-800 inline-flex items-center gap-1.5"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Compare
          </button>
        )}
      </div>

      {accepted ? (
        <OrderTracker bid={accepted} request={request} onChat={() => onChat(accepted.supplier)} />
      ) : (
        <>
          {waiting && (
            <div className="mx-4 mt-3 flex items-center gap-2 rounded-2xl bg-blue-50 px-3.5 py-2.5 text-[13px] text-slate-700">
              <Loader2 className="w-4 h-4 text-[#003CF5] animate-spin shrink-0" />
              <span>
                Sent to {request.matchedCount} verified makers near you · {request.bids.length} offer{request.bids.length === 1 ? '' : 's'} so far
              </span>
            </div>
          )}

          {ranked.length > 0 && (
            <div className="mt-3 px-4 py-1 scroll-px-4 flex gap-2 overflow-x-auto no-scrollbar snap-x">
              {ranked.map((bid) => {
                const isSelected = selected?.id === bid.id;
                return (
                  <button
                    key={bid.id}
                    type="button"
                    onClick={() => setSelectedId(bid.id)}
                    className={cx(
                      'snap-start shrink-0 w-[172px] rounded-2xl p-3 text-left transition-all animate-pop-in',
                      isSelected ? 'bg-blue-50 ring-2 ring-inset ring-[#003CF5]' : 'bg-[#F4F3F0] hover:bg-[#ECEAE5]'
                    )}
                  >
                    <div className="h-5 flex items-center gap-1">
                      {bid.tags[0] ? <Badge tone={TAG_TONE[bid.tags[0]]}>{bid.tags[0]}</Badge> : bid.supplier.verified ? <VerifiedBadge /> : <Badge>New maker</Badge>}
                    </div>
                    <div className="mt-2 text-[15px] font-medium text-slate-900 truncate">{bid.supplier.shortName}</div>
                    <div className="text-[12px] text-slate-500 truncate flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {bid.supplier.rating} · {bid.supplier.km} km
                    </div>
                    <div className="mt-2 flex items-baseline justify-between gap-1">
                      <span className="text-[17px] font-semibold text-slate-900">{peso(bid.pricePerUnit, 2)}</span>
                      <span className="text-[12px] text-slate-500">{bid.leadDays} days</span>
                    </div>
                    {bid.status === 'countered' && <p className="mt-1 text-[11px] text-amber-700">Counter sent: {peso(bid.counterPrice, 2)}</p>}
                    {bid.revised && bid.status === 'pending' && <p className="mt-1 text-[11px] text-emerald-700">Revised offer</p>}
                  </button>
                );
              })}
              {waiting &&
                request.pendingBids.slice(0, 2).map((b) => (
                  <div key={b.id} className="shrink-0 w-[172px] h-[124px] rounded-2xl bg-[#F4F3F0] animate-pulse" />
                ))}
            </div>
          )}

          {selected && (
            <OfferDetails
              bid={selected}
              request={request}
              onAccept={() => onAccept(selected)}
              onChat={() => onChat(selected.supplier)}
              onViewSupplier={() => onViewSupplier(selected.supplier)}
            />
          )}
        </>
      )}
    </section>
  );
}

function OfferDetails({ bid, request, onAccept, onChat, onViewSupplier }) {
  const overBy = bid.total - request.targetBudget;
  return (
    <div className="mx-4 mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={onViewSupplier} className="min-w-0 text-left">
          <p className="text-[15px] font-semibold text-slate-900 truncate hover:underline">{bid.supplier.name}</p>
          <p className="text-[13px] text-slate-500">{bid.supplier.city} · {bid.supplier.reviewsCount} reviews</p>
        </button>
        <div className="text-right shrink-0">
          <p className="text-[17px] font-semibold text-slate-900">{peso(bid.total)}</p>
          <p className={cx('text-[12px]', overBy > 0 ? 'text-amber-700' : 'text-emerald-700')}>
            {overBy > 0 ? `${peso(overBy)} over budget` : 'Within budget'}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
        <div className="rounded-2xl bg-[#F4F3F0] px-3 py-2.5 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <span><span className="text-slate-500">Production</span><br /><span className="font-medium text-slate-900">{bid.leadDays} business days</span></span>
        </div>
        <div className="rounded-2xl bg-[#F4F3F0] px-3 py-2.5 flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-500 shrink-0" />
          <span><span className="text-slate-500">Delivery</span><br /><span className="font-medium text-slate-900">{shortDate(bid.deliveryDate)}</span></span>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        {bid.inclusions.map((inc) => (
          <li key={inc} className="flex items-center gap-2 text-[13px] text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" /> {inc}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-slate-500 italic">“{bid.notes}”</p>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="lg" icon={MessageSquare} onClick={onChat} aria-label="Chat with maker">
          <span className="hidden sm:inline">Chat</span>
        </Button>
        <Button size="lg" full onClick={onAccept} disabled={bid.status === 'countered'}>
          Accept {peso(bid.pricePerUnit, 2)}/pc
        </Button>
      </div>
    </div>
  );
}

function OrderTracker({ bid, request, onChat }) {
  return (
    <div className="mx-4 mt-4">
      <div className="rounded-2xl bg-[#F4F3F0] p-3.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-slate-900 truncate">{bid.supplier.name}</p>
          <p className="text-[13px] text-slate-500">{peso(bid.pricePerUnit, 2)}/pc · {peso(bid.total)} total</p>
        </div>
        <Badge tone="blue">Ready {shortDate(bid.deliveryDate)}</Badge>
      </div>

      <ol className="mt-5 grid grid-cols-4">
        {ORDER_STEPS.map((step, i) => {
          const done = i <= request.orderStep;
          const current = i === request.orderStep;
          return (
            <li key={step} className="relative flex flex-col items-center text-center">
              {i > 0 && <span className={cx('absolute top-[5px] right-1/2 w-full h-0.5', done ? 'bg-[#003CF5]' : 'bg-slate-200')} />}
              <span className={cx('relative z-10 w-3 h-3 rounded-full', current ? 'bg-[#003CF5] ring-4 ring-blue-100' : done ? 'bg-[#003CF5]' : 'bg-slate-200')} />
              <span className={cx('mt-2 text-[12px]', current ? 'font-semibold text-slate-900' : 'text-slate-500')}>{step}</span>
            </li>
          );
        })}
      </ol>

      <Button className="mt-4" size="lg" full icon={MessageSquare} onClick={onChat}>
        Chat with maker
      </Button>
    </div>
  );
}
