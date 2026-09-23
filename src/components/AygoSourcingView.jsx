import React, { useState } from 'react';
import {
  MapPin,
  ChevronRight,
  Search,
  Check,
  X,
  Package,
  Shirt,
  Printer,
  Coffee,
  ShoppingBag,
  Factory,
  MessageSquare
} from 'lucide-react';
import { SUPPLIERS, PRESET_VENUES, PRESET_HOMES } from '../data/mockData';
import AygoGoogleMap from './AygoGoogleMap';

const CATEGORY_TILES = [
  { id: 'apparel', label: 'Apparel', Icon: Shirt, tint: { bg: 'bg-blue-100', fg: 'text-[#003CF5]' } },
  { id: 'event-print', label: 'Event Print', Icon: Printer, tint: { bg: 'bg-amber-100', fg: 'text-amber-600' } },
  { id: 'drinkware', label: 'Drinkware', Icon: Coffee, tint: { bg: 'bg-emerald-100', fg: 'text-emerald-600' } },
  { id: 'bags', label: 'Bags & Swag', Icon: ShoppingBag, tint: { bg: 'bg-rose-100', fg: 'text-rose-500' } }
];

const MAKER_BIDS = [
  { id: 's3', name: 'JJT Digital (Parañaque City)', shortName: 'JJT Digital', area: 'Parañaque · 11.8 km', loc: 'Parañaque · 11.8 km from venue', price: '₱46.00/pc', days: '4 Business Days', shortDays: '4 days', readyDate: 'Ready Oct 8', tag: 'Lowest bid' },
  { id: 's1', name: 'Thread & Co. (Taytay)', shortName: 'Thread & Co.', area: 'Taytay · 14.2 km', loc: 'Taytay · 14.2 km from venue', price: '₱49.50/pc', days: '6 Business Days', shortDays: '6 days', readyDate: 'Ready Oct 12', tag: 'Verified' },
  { id: 's2', name: 'Manila Bag Works (Marikina)', shortName: 'Manila Bag Works', area: 'Marikina City', loc: 'Marikina City', price: '₱55.00/pc', days: '7 Business Days', shortDays: '7 days', readyDate: 'Ready Oct 14', tag: 'Verified' },
  { id: 's4', name: 'Everyday Drinkware (Valenzuela)', shortName: 'Everyday Drinkware', area: 'Valenzuela City', loc: 'Valenzuela City', price: '₱340.00/pc', days: '5 Business Days', shortDays: '5 days', readyDate: 'Ready Oct 10', tag: 'Verified' }
];

const ORDER_STEPS = ['Proofing', 'Printing', 'Pack', 'Dispatch'];
const ACTIVE_STEP = 0;

export default function AygoSourcingView({
  onOpenDrawer,
  activeVenue,
  onSelectVenue,
  deliveryType = 'venue',
  onToggleDeliveryType,
  deliveryDate = 'Oct 15, 2026',
  onChangeDeliveryDate,
  onSelectSupplier,
  onOpenChatWithSupplier,
  onOpenMockupStudio,
  onRequestNewJob,
  activeItem: propActiveItem,
  onUpdateActiveItem
}) {
  const [localVenue, setLocalVenue] = useState(PRESET_VENUES[0]);
  const [localType, setLocalType] = useState('venue');
  const [localDate, setLocalDate] = useState('Oct 15, 2026');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customAddressInput, setCustomAddressInput] = useState('');
  const [focusedSupplierId, setFocusedSupplierId] = useState(null);
  const [selectedMaker, setSelectedMaker] = useState(MAKER_BIDS[0]);

  const currentVenue = activeVenue || localVenue;
  const currentType = deliveryType || localType;
  const currentDate = deliveryDate || localDate;

  // Active Item & Editing State
  const [internalItem, setInternalItem] = useState({
    title: '300 Customized Satin Lanyards',
    qty: '300 pcs',
    budget: '₱15,000 (₱50.00/pc)',
    specs: '2cm smooth satin, full color 2-sided sublimation, trigger hook.',
    isPackage: false
  });

  const currentItem = propActiveItem || internalItem;

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

  const filteredHomes = PRESET_HOMES.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e5ecf6] font-sans selection:bg-[#003CF5] selection:text-white">
      
      {/* 1. FULL-BLEED REAL MAP BACKGROUND (NO DOTS) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <AygoGoogleMap
          activeLocation={currentVenue}
          deliveryType={currentType}
          onSelectSupplier={onSelectSupplier}
          focusedSupplierId={focusedSupplierId}
          onOpenDrawer={onOpenDrawer}
          onOpenLocationPicker={() => setIsLocationModalOpen(true)}
        />
      </div>

      {/* 2. BOTTOM SHEET: scrolls up over the map on mobile, floating panel on desktop */}
      <div className="absolute inset-0 z-30 overflow-y-auto no-scrollbar overscroll-contain pointer-events-none lg:inset-auto lg:top-20 lg:bottom-4 lg:left-6 lg:w-[400px] lg:rounded-[28px]">
        {/* Map peek area on mobile (touches pass through to the map) */}
        <div className="h-[42vh] lg:hidden" />

        <div className="pointer-events-auto min-h-[58vh] lg:min-h-0 bg-[#F2F1ED] rounded-t-[28px] lg:rounded-[28px] shadow-[0_-8px_30px_rgba(15,23,42,0.12)] lg:shadow-2xl space-y-2 pb-6 lg:pb-2">

          {/* SECTION 1: Search */}
          <section className="bg-white rounded-[28px] px-4 pt-2.5 pb-4">
            <div className="flex justify-center pb-3">
              <div className="w-9 h-1 bg-slate-200 rounded-full" />
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

          {/* SECTION 2: Categories */}
          <section className="bg-white rounded-[28px] p-3">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_TILES.map(({ id, label, Icon, tint }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onRequestNewJob && onRequestNewJob('single', id)}
                  className="relative h-[92px] flex items-start rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] p-3.5 text-left overflow-hidden transition-colors active:scale-[0.98]"
                >
                  <span className="relative z-10 text-[15px] font-medium text-slate-900">{label}</span>
                  <span className={`absolute -bottom-4 -right-3 w-20 h-20 rounded-full flex items-center justify-center ${tint.bg}`}>
                    <Icon className={`w-9 h-9 -translate-x-1 -translate-y-1.5 ${tint.fg}`} strokeWidth={1.75} />
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onRequestNewJob && onRequestNewJob('package')}
              className="mt-2 w-full rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] px-3.5 py-3 flex items-center gap-3 text-left transition-colors active:scale-[0.99]"
            >
              <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#003CF5] shrink-0">
                <Package className="w-5 h-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-medium text-slate-900">Full event package</span>
                <span className="block text-[13px] text-slate-500 truncate">Bundle several items in one request</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          </section>

          {/* SECTION 3: Maker bids */}
          <section className="bg-white rounded-[28px] py-4">
            <div className="px-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#F4F3F0] flex items-center justify-center text-[#003CF5] shrink-0">
                <Factory className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-[19px] font-semibold text-slate-900 tracking-tight leading-tight">Choose a maker</h4>
                <p className="text-[13px] text-slate-500">{MAKER_BIDS.length} verified bids for your request</p>
              </div>
            </div>

            <div className="mt-2 px-4 py-1 scroll-px-4 flex gap-2 overflow-x-auto no-scrollbar snap-x">
              {MAKER_BIDS.map((bid) => {
                const isSelected = selectedMaker?.id === bid.id;
                return (
                  <button
                    key={bid.id}
                    type="button"
                    onClick={() => setSelectedMaker(bid)}
                    className={`snap-start shrink-0 w-[168px] rounded-2xl p-3 text-left transition-all ${
                      isSelected ? 'bg-blue-50 ring-2 ring-inset ring-[#003CF5]' : 'bg-[#F4F3F0] hover:bg-[#ECEAE5]'
                    }`}
                  >
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${
                      bid.tag === 'Lowest bid' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'
                    }`}>
                      {bid.tag}
                    </span>
                    <div className="mt-2 text-[15px] font-medium text-slate-900 truncate">{bid.shortName}</div>
                    <div className="text-[12px] text-slate-500 truncate">{bid.area}</div>
                    <div className="mt-2 flex items-baseline justify-between gap-1">
                      <span className="text-[17px] font-semibold text-slate-900">{bid.price}</span>
                      <span className="text-[12px] text-slate-500">{bid.shortDays}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active order tracker for the selected maker */}
            {selectedMaker && (
              <div className="mx-4 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-500">In production with</p>
                    <p className="text-[15px] font-semibold text-slate-900 truncate">{selectedMaker.name}</p>
                  </div>
                  <span className="shrink-0 text-[12px] font-semibold text-[#003CF5] bg-blue-50 px-2.5 py-1 rounded-full">
                    {selectedMaker.readyDate}
                  </span>
                </div>

                <ol className="mt-4 grid grid-cols-4">
                  {ORDER_STEPS.map((step, i) => {
                    const done = i <= ACTIVE_STEP;
                    return (
                      <li key={step} className="relative flex flex-col items-center text-center">
                        {i > 0 && (
                          <span className={`absolute top-[5px] right-1/2 w-full h-0.5 ${done ? 'bg-[#003CF5]' : 'bg-slate-200'}`} />
                        )}
                        <span className={`relative z-10 w-3 h-3 rounded-full ${
                          i === ACTIVE_STEP ? 'bg-[#003CF5] ring-4 ring-blue-100' : done ? 'bg-[#003CF5]' : 'bg-slate-200'
                        }`} />
                        <span className={`mt-2 text-[12px] ${i === ACTIVE_STEP ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                          {step}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <button
                  type="button"
                  onClick={() => {
                    const s = SUPPLIERS.find(x => x.id === selectedMaker.id) || SUPPLIERS[0];
                    if (onOpenChatWithSupplier) onOpenChatWithSupplier(s);
                  }}
                  className="mt-4 w-full py-3.5 rounded-2xl bg-[#003CF5] hover:bg-blue-700 text-white text-[15px] font-semibold transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with maker
                </button>
              </div>
            )}
          </section>

        </div>
      </div>

      {/* INTERACTIVE LOCATION PICKER MODAL */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-950">Change Delivery Venue</h3>
                <p className="text-xs text-slate-500 font-medium">Select an event venue or enter your custom delivery address.</p>
              </div>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Search & Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase text-slate-700">
                Search or Enter Custom Address
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCustomAddressInput(e.target.value);
                  }}
                  placeholder="e.g. Arthaland Tower, SMX Manila, or street address..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>

              {customAddressInput.trim() && (
                <button
                  type="button"
                  onClick={handleApplyCustomLocation}
                  className="w-full py-2 px-3 rounded-xl bg-[#003CF5] text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Use address: "{customAddressInput}"</span>
                </button>
              )}
            </div>

            {/* Popular Event Venues */}
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                Popular Venues
              </p>
              <div className="space-y-1.5">
                {filteredVenues.map((venue) => {
                  const isSelected = currentVenue.id === venue.id || currentVenue.name === venue.name;
                  return (
                    <div
                      key={venue.id}
                      onClick={() => handleUpdateVenue(venue)}
                      className={`p-3 rounded-2xl border cursor-pointer text-xs transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#003CF5] bg-blue-50/70 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-[#003CF5]' : 'text-slate-400'}`} />
                        <div>
                          <p className="font-bold text-slate-900">{venue.name}</p>
                          <p className="text-[11px] text-slate-500">{venue.address}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-[#003CF5] bg-blue-100 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
