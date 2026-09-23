import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
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
  LayoutGrid,
  NotebookPen,
  Cpu,
  Umbrella,
  Leaf,
  Gift,
  Store,
  PartyPopper
} from 'lucide-react';
import { PRESET_VENUES } from '../data/mockData';
import AygoGoogleMap from './AygoGoogleMap';
import RequestOffers from './RequestOffers';
import PanelResizeHandle from './PanelResizeHandle';
import { Sheet, Button, Input, ListRow, Section, Logo, TINTS } from './ui';
import { CATALOG_CATEGORIES } from '../data/catalog';

const CHIP_ICONS = { Shirt, ShoppingBag, Coffee, Printer, NotebookPen, Cpu, Umbrella, Leaf, Gift, Package, Store, PartyPopper, Megaphone };
const CATEGORY_CHIPS = CATALOG_CATEGORIES.map((c) => ({ ...c, Icon: CHIP_ICONS[c.icon] || Package }));

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
  onConfirmReceived,
  onRateOrder,
  onOpenSponsorship,
  onOpenTools,
  onOpenMessages,
  unreadMessages = 0,
  onOpenCatalog,
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
      <div className="desk-zoom absolute z-20 right-4 bottom-[calc(58vh+72px)] lg:right-6 lg:bottom-20 flex flex-col items-end gap-2.5">
        <FloatingButton icon={MessageSquare} tone="text-emerald-600" label="Chats" badge={unreadMessages} onClick={onOpenMessages} />
        <FloatingButton icon={Megaphone} tone="text-rose-500" label="Sponsors" onClick={onOpenSponsorship} />
        <FloatingButton icon={LayoutGrid} tone="text-[#003CF5]" label="Tools" onClick={onOpenTools} />
      </div>

      {/* 2. BOTTOM SHEET: scrolls up over the map on mobile, floating panel on desktop */}
      <div className="absolute inset-0 z-30 overflow-y-auto no-scrollbar overscroll-contain pointer-events-none lg:inset-auto lg:top-24 lg:bottom-5 lg:left-7 lg:w-[var(--panel-w)] 2xl:top-28 lg:rounded-[32px]">
        {/* Map peek area on mobile (touches pass through to the map) */}
        <div className="h-[42vh] lg:hidden" />

        <div className="desk-zoom pointer-events-auto min-h-[58vh] lg:min-h-0 bg-[#F2F1ED] rounded-t-[28px] lg:rounded-[28px] shadow-[0_-8px_30px_rgba(15,23,42,0.12)] lg:shadow-2xl space-y-2 pb-6 lg:pb-2">

          {/* SECTION 1: Search */}
          <section className="bg-white rounded-[28px] px-4 pt-2.5 pb-4">
            <PanelResizeHandle className="pb-3" />

            <button
              type="button"
              onClick={() => onOpenCatalog()}
              aria-label="Search products, suppliers and services"
              className="w-full h-16 bg-[#F4F3F0] hover:bg-[#ECEAE5] px-4 rounded-2xl flex items-center gap-3 text-left transition-colors active:scale-[0.99]"
            >
              <Search className="w-5 h-5 text-slate-500 shrink-0" strokeWidth={2.25} />
              <RotatingPrompt />
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
              {CATEGORY_CHIPS.map(({ id, short, Icon, tone }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onOpenCatalog(id)}
                  className="shrink-0 flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-[13px] font-medium text-slate-800 transition-colors active:scale-95"
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center ${TINTS[tone]}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  {short}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onOpenCatalog()}
                className="shrink-0 h-10 px-4 rounded-full border border-slate-200 text-[13px] font-medium text-[#003CF5] hover:bg-blue-50"
              >
                See all
              </button>
            </div>
          </section>

          {/* SECTION 3: Live offers for the active request */}
          <RequestOffers
            request={request}
            onAccept={onAcceptBid}
            onCompare={onCompareBids}
            onConfirmReceived={onConfirmReceived}
            onRate={onRateOrder}
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

// Search prompts on the home sheet, one every 5 seconds
const SEARCH_PROMPTS = [
  'Find it. Customize it. Make it happen.',
  'What are you looking for?',
  'What do you need for your event?',
  'Find what you need for your event',
  'Search products & services',
  'What can we help you find?',
  'Find products, suppliers & services',
  'Search for anything you need',
  'What are we sourcing today?',
  'What do you need today?',
];

function RotatingPrompt() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SEARCH_PROMPTS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const text = 'min-w-0 line-clamp-2 text-[17px] leading-tight font-medium text-slate-400 tracking-tight';
  const previous = (index - 1 + SEARCH_PROMPTS.length) % SEARCH_PROMPTS.length;
  return (
    // New prompt drops in from above while the old one drops out below
    <span className="relative flex-1 min-w-0 h-full flex items-center overflow-hidden" aria-hidden="true">
      {index > 0 && (
        <span key={`out-${index}`} className={`absolute inset-x-0 top-1/2 -translate-y-1/2 ${text}`}>
          <span className="block animate-drop-out">{SEARCH_PROMPTS[previous]}</span>
        </span>
      )}
      <span key={`in-${index}`} className={`${text} ${index > 0 ? 'animate-drop-in' : ''}`}>
        {SEARCH_PROMPTS[index]}
      </span>
    </span>
  );
}

function FloatingButton({ icon: Icon, tone, label, onClick, badge = 0 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={badge ? `${label}, ${badge} unread` : label}
      className="relative h-11 pl-3 pr-3.5 rounded-full bg-white shadow-xl border border-slate-200/80 flex items-center gap-2 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 active:scale-95 transition-all"
    >
      <Icon className={`w-5 h-5 ${tone}`} />
      {label}
      {badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#003CF5] text-white text-[11px] font-semibold flex items-center justify-center">{badge}</span>
      )}
    </button>
  );
}
