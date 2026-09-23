import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Check,
  Package,
  Shirt,
  Printer,
  Coffee,
  ShoppingBag,
  Tag,
  Megaphone,
  Download,
  Globe,
  LayoutGrid
} from 'lucide-react';
import { PRESET_VENUES } from '../data/mockData';
import AygoGoogleMap from './AygoGoogleMap';
import RequestOffers from './RequestOffers';
import { Sheet, Button, Input, ListRow, Section, Logo } from './ui';

const CATEGORY_TILES = [
  { id: 'apparel', label: 'Apparel', Icon: Shirt, tint: { bg: 'bg-blue-100', fg: 'text-[#003CF5]' } },
  { id: 'event-print', label: 'Event Print', Icon: Printer, tint: { bg: 'bg-amber-100', fg: 'text-amber-600' } },
  { id: 'drinkware', label: 'Drinkware', Icon: Coffee, tint: { bg: 'bg-emerald-100', fg: 'text-emerald-600' } },
  { id: 'bags', label: 'Bags & Swag', Icon: ShoppingBag, tint: { bg: 'bg-rose-100', fg: 'text-rose-500' } }
];

const REQUEST_TYPES = [
  { mode: 'single', label: 'Single Category', hint: 'One item or service type', Icon: Tag, tint: { bg: 'bg-blue-100', fg: 'text-[#003CF5]' } },
  { mode: 'package', label: 'Event Package', hint: 'Multi-category bundle', Icon: Package, tint: { bg: 'bg-violet-100', fg: 'text-violet-600' } }
];

export default function AygoSourcingView({
  onOpenDrawer,
  activeVenue,
  onSelectVenue,
  deliveryType = 'venue',
  onSelectSupplier,
  onOpenChatWithSupplier,
  onRequestNewJob,
  request,
  onAcceptBid,
  onCompareBids,
  onOpenSponsorship,
  onOpenTools,
  onOpenWaitlist
}) {
  const [localVenue, setLocalVenue] = useState(PRESET_VENUES[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customAddressInput, setCustomAddressInput] = useState('');

  const currentVenue = activeVenue || localVenue;
  const currentType = deliveryType;

  const handleUpdateVenue = (venue) => {
    if (onSelectVenue) {
      onSelectVenue(venue);
    } else {
      setLocalVenue(venue);
    }
    setIsLocationModalOpen(false);
  };

  const handleApplyCustomLocation = () => {
    if (!customAddressInput.trim()) return;
    const customVenue = {
      id: `custom-${Date.now()}`,
      name: customAddressInput.trim(),
      address: customAddressInput.trim(),
      city: 'Metro Manila',
      type: currentType
    };
    handleUpdateVenue(customVenue);
    setCustomAddressInput('');
  };

  const filteredVenues = PRESET_VENUES.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.address.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e5ecf6] font-sans selection:bg-[#003CF5] selection:text-white">
      
      {/* 1. FULL-BLEED REAL MAP BACKGROUND (NO DOTS) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <AygoGoogleMap
          activeLocation={currentVenue}
          deliveryType={currentType}
          onSelectSupplier={onSelectSupplier}
          onOpenDrawer={onOpenDrawer}
          onOpenLocationPicker={() => setIsLocationModalOpen(true)}
        />
      </div>

      {/* Floating shortcuts on the map (the sheet scrolls over them on phones) */}
      <div className="absolute z-20 right-4 bottom-[calc(58vh+72px)] lg:right-6 lg:bottom-20 flex flex-col items-end gap-2.5">
        <FloatingButton icon={Megaphone} tone="text-rose-500" label="Sponsors" onClick={onOpenSponsorship} />
        <FloatingButton icon={LayoutGrid} tone="text-[#003CF5]" label="Tools" onClick={onOpenTools} />
      </div>

      {/* 2. BOTTOM SHEET: scrolls up over the map on mobile, floating panel on desktop */}
      <div className="absolute inset-0 z-30 overflow-y-auto no-scrollbar overscroll-contain pointer-events-none lg:inset-auto lg:top-20 lg:bottom-4 lg:left-6 lg:w-[400px] lg:rounded-[28px]">
        {/* Map peek area on mobile (touches pass through to the map) */}
        <div className="h-[42vh] lg:hidden" />

        <div className="pointer-events-auto min-h-[58vh] lg:min-h-0 bg-[#F2F1ED] rounded-t-[28px] lg:rounded-[28px] shadow-[0_-8px_30px_rgba(15,23,42,0.12)] lg:shadow-2xl space-y-2 pb-6 lg:pb-2">

          {/* SECTION 1: Search */}
          <section className="bg-white rounded-[28px] px-4 pt-2.5 pb-4">
            <div className="flex justify-center pb-3 lg:hidden">
              <div className="w-9 h-1 bg-slate-200 rounded-full" />
            </div>
            <div className="hidden lg:flex items-center gap-2 pt-2 pb-3">
              <Logo variant="icon" className="w-8 h-8" />
              <Logo className="h-6" />
            </div>

            <button
              type="button"
              onClick={() => onRequestNewJob && onRequestNewJob()}
              className="w-full bg-[#F4F3F0] hover:bg-[#ECEAE5] px-4 py-4 rounded-2xl flex items-center gap-3 text-left transition-colors active:scale-[0.99]"
            >
              <Search className="w-5 h-5 text-slate-900 shrink-0" strokeWidth={2.5} />
              <span className="text-[17px] font-semibold text-slate-900 tracking-tight">
                What do you need made?
              </span>
            </button>

          </section>

          {/* SECTION 2: Request type (single category vs event package) + popular categories */}
          <section className="bg-white rounded-[28px] p-3">
            <div className="grid grid-cols-2 gap-2">
              {REQUEST_TYPES.map(({ mode, label, hint, Icon, tint }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onRequestNewJob && onRequestNewJob(mode, mode === 'single' ? 'apparel' : undefined)}
                  className="relative h-[108px] flex flex-col items-start rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] p-3.5 text-left overflow-hidden transition-colors active:scale-[0.98]"
                >
                  <span className="relative z-10 text-[15px] font-semibold text-slate-900">{label}</span>
                  <span className="relative z-10 text-[12px] text-slate-500 leading-snug max-w-[70%]">{hint}</span>
                  <span className={`absolute -bottom-4 -right-3 w-20 h-20 rounded-full flex items-center justify-center ${tint.bg}`}>
                    <Icon className={`w-9 h-9 -translate-x-1 -translate-y-1.5 ${tint.fg}`} strokeWidth={1.75} />
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3">
              {CATEGORY_TILES.map(({ id, label, Icon, tint }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onRequestNewJob && onRequestNewJob('single', id)}
                  className="shrink-0 flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-[13px] font-medium text-slate-800 transition-colors active:scale-95"
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center ${tint.bg}`}>
                    <Icon className={`w-4 h-4 ${tint.fg}`} />
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 3: Live offers for the active request */}
          <RequestOffers
            request={request}
            onAccept={onAcceptBid}
            onCompare={onCompareBids}
            onChat={onOpenChatWithSupplier}
            onViewSupplier={onSelectSupplier}
            onNewRequest={() => onRequestNewJob && onRequestNewJob()}
          />

          {/* SECTION 5: Get the app + international waitlist */}
          <section className="relative overflow-hidden rounded-[28px] p-4 bg-[#003CF5] text-white">
            <Logo variant="icon" className="absolute -right-5 -top-5 w-28 h-28 opacity-25 rotate-12" />
            <Logo tone="white" className="h-6" />
            <p className="mt-2 text-[17px] font-semibold">Make It Aygo.</p>
            <p className="text-[13px] text-blue-100 mt-0.5">Get offers on the go with the Aygo app.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="https://aygo.store" target="_blank" rel="noreferrer" className="h-10 px-4 rounded-2xl bg-white text-[#003CF5] text-[14px] font-semibold inline-flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Aygo
              </a>
              <button type="button" onClick={onOpenWaitlist} className="h-10 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-[14px] font-medium inline-flex items-center gap-2">
                <Globe className="w-4 h-4" /> Outside the Philippines?
              </button>
            </div>
          </section>

        </div>
      </div>

      {isLocationModalOpen && (
        <Sheet
          title="Delivery venue"
          subtitle="Makers near this place will see your requests first."
          icon={MapPin}
          onClose={() => setIsLocationModalOpen(false)}
        >
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCustomAddressInput(e.target.value);
              }}
              placeholder="Search a venue or type an address"
              className="pl-10"
              autoFocus
            />
          </div>

          {customAddressInput.trim() && (
            <Button variant="secondary" full className="mt-2" icon={Check} onClick={handleApplyCustomLocation}>
              Use “{customAddressInput.trim()}”
            </Button>
          )}

          <Section title="Popular venues" className="pt-4">
            {filteredVenues.map((venue) => {
              const isSelected = currentVenue.id === venue.id || currentVenue.name === venue.name;
              return (
                <ListRow
                  key={venue.id}
                  icon={MapPin}
                  tone={isSelected ? 'solid' : 'slate'}
                  title={venue.name}
                  subtitle={venue.address}
                  onClick={() => handleUpdateVenue(venue)}
                  trailing={isSelected ? <Check className="w-5 h-5 text-[#003CF5]" /> : undefined}
                />
              );
            })}
            {filteredVenues.length === 0 && <p className="text-[13px] text-slate-500 py-3">No saved venue matches. Use the address above.</p>}
          </Section>
        </Sheet>
      )}
    </div>
  );
}

function FloatingButton({ icon: Icon, tone, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="h-11 pl-3 pr-3.5 rounded-full bg-white shadow-xl border border-slate-200/80 flex items-center gap-2 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 active:scale-95 transition-all"
    >
      <Icon className={`w-5 h-5 ${tone}`} />
      {label}
    </button>
  );
}
