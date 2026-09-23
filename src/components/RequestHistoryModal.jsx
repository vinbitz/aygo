import React, { useState } from 'react';
import { Clock, ChevronRight, MapPin, Inbox } from 'lucide-react';
import { Sheet, Badge, Chip, EmptyState } from './ui';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Completed' }
];

export default function RequestHistoryModal({ isOpen, onClose, activeItem, onOpenItem, onSelectRequest }) {
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const pastRequests = [
    {
      id: 'req-01',
      title: activeItem?.title || '300 Customized Satin Lanyards',
      qty: activeItem?.qty || '300 pcs',
      budget: activeItem?.budget || '₱15,000',
      status: 'Collecting bids',
      bids: 4,
      date: 'Oct 15, 2026',
      isActive: true
    },
    {
      id: 'req-02',
      title: '500 Dri-Fit Event Shirts for Run Manila',
      qty: '500 pcs',
      budget: '₱100,000',
      status: 'Delivered',
      date: 'Sep 02, 2026',
      isActive: false
    },
    {
      id: 'req-03',
      title: '200 Bamboo Thermal Tumblers Laser Engraved',
      qty: '200 pcs',
      budget: '₱68,000',
      status: 'Delivered',
      date: 'Aug 14, 2026',
      isActive: false
    }
  ];

  const visible = pastRequests.filter((r) =>
    filter === 'all' ? true : filter === 'active' ? r.isActive : !r.isActive
  );

  const counts = {
    all: pastRequests.length,
    active: pastRequests.filter((r) => r.isActive).length,
    done: pastRequests.filter((r) => !r.isActive).length
  };

  const openRequest = (req) => {
    const handler = onOpenItem || onSelectRequest;
    if (handler) handler(req);
    onClose();
  };

  return (
    <Sheet
      onClose={onClose}
      title="My requests"
      subtitle="Track live bids and past event orders"
      icon={Clock}
      size="lg"
    >
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 -mx-5 px-5">
        {FILTERS.map(({ id, label }) => (
          <Chip key={id} selected={filter === id} onClick={() => setFilter(id)} className="!h-11">
            {label}
            <span className={filter === id ? 'text-white/70' : 'text-slate-500'}>{counts[id]}</span>
          </Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nothing here yet"
          text="Post what you need from the home screen and verified makers will start bidding."
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((req) => {
            const Tag = req.isActive ? 'button' : 'div';
            return (
              <li key={req.id}>
                <Tag
                  {...(req.isActive ? { type: 'button', onClick: () => openRequest(req) } : {})}
                  className={`w-full text-left rounded-2xl p-4 transition-colors ${
                    req.isActive
                      ? 'bg-white border border-[#003CF5]/30 shadow-sm hover:border-[#003CF5]/60 active:scale-[0.99]'
                      : 'bg-[#F4F3F0]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={req.isActive ? 'blue' : 'green'}>
                      {req.isActive ? `${req.status} · ${req.bids} bids` : req.status}
                    </Badge>
                    <span className="text-[12px] text-slate-500 shrink-0">
                      {req.isActive ? 'Needed by' : 'Delivered'} {req.date}
                    </span>
                  </div>

                  <p className="mt-2 text-[15px] font-semibold text-slate-900 leading-snug">{req.title}</p>
                  <p className="mt-0.5 text-[13px] text-slate-500">
                    {req.qty} · Budget {req.budget}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 min-w-0 text-[13px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Arthaland Century Pacific Tower, BGC</span>
                    </span>
                    {req.isActive && (
                      <span className="flex items-center gap-0.5 text-[13px] font-semibold text-[#003CF5] shrink-0">
                        View bids
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </Tag>
              </li>
            );
          })}
        </ul>
      )}
    </Sheet>
  );
}
