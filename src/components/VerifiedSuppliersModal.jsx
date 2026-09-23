import React, { useState } from 'react';
import { Search, MapPin, Star, ShieldCheck, MessageSquare, Clock, Crown, Store } from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';
import { CATALOG_CATEGORIES } from '../data/catalog';
import { Sheet, Input, Badge, VerifiedBadge, Chip, EmptyState } from './ui';

// "All" plus every catalog category; makers are matched on the categories they serve
const CATEGORIES = [
  { id: 'All', label: 'All' },
  ...CATALOG_CATEGORIES.map((c) => ({ id: c.id, label: c.short })),
];

const searchableText = (s) =>
  [s.name, s.tagline, s.city, ...(s.services || []).map((x) => x.name)].join(' ').toLowerCase();

export default function VerifiedSuppliersModal({ isOpen, onClose, onSelectSupplier, onOpenChat, onChatSupplier }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const category = CATEGORIES.find((c) => c.id === selectedCategory);
  const query = searchTerm.trim().toLowerCase();

  const filtered = SUPPLIERS.filter((s) => {
    const text = searchableText(s);
    const matchCat = !category || category.id === 'All' || (s.categories || []).includes(category.id);
    const matchText = !query || text.includes(query);
    return matchCat && matchText;
  });

  const handleChat = (s) => {
    const chat = onChatSupplier || onOpenChat;
    if (chat) chat(s);
    onClose();
  };

  const handleView = (s) => {
    if (onSelectSupplier) onSelectSupplier(s);
    onClose();
  };

  return (
    <Sheet
      onClose={onClose}
      size="lg"
      icon={ShieldCheck}
      title="Verified makers"
      subtitle="Every maker here passed Aygo's business and document checks."
    >
      <div className="sticky top-0 z-10 bg-white pb-3 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="search"
            aria-label="Search makers"
            placeholder="Search by name, product or city"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {CATEGORIES.map((c) => (
            <Chip key={c.id} selected={selectedCategory === c.id} onClick={() => setSelectedCategory(c.id)} className="h-10">
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <p className="text-[13px] text-slate-500 mb-2">
        {filtered.length} {filtered.length === 1 ? 'maker' : 'makers'}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No makers match"
          text="Try another category or a shorter search."
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map((s) => (
            <li key={s.id} className="flex items-stretch gap-2 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors">
              <button
                type="button"
                onClick={() => handleView(s)}
                aria-label={`View ${s.name}`}
                className="flex-1 min-w-0 flex items-start gap-3 p-3 text-left rounded-2xl"
              >
                <span className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F4F3F0] shrink-0 flex items-center justify-center">
                  {s.avatar ? (
                    <img src={s.avatar} alt={s.name} className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                    />
                  ) : (
                    <Store className="w-5 h-5 text-slate-400" />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-semibold text-slate-900 leading-snug">{s.name}</span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    <VerifiedBadge />
                    {s.proStorefront && <Badge tone="violet" icon={Crown}>Pro</Badge>}
                  </span>
                  <span className="mt-1 block text-[13px] text-slate-500 line-clamp-1">{s.tagline}</span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-slate-500">
                    <span className="inline-flex items-center gap-1 text-slate-900 font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {s.rating}
                      <span className="font-normal text-slate-500">({s.reviewsCount})</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {s.city}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {s.avgLeadTime}
                    </span>
                  </span>
                </span>
              </button>
              <div className="flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => handleChat(s)}
                  aria-label={`Chat with ${s.name}`}
                  className="w-11 h-11 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-800 flex items-center justify-center transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}
