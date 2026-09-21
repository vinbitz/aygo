import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronRight, 
  ChevronDown,
  Clock, 
  Search, 
  Edit2, 
  Check, 
  X, 
  Package, 
  Sparkles,
  Shirt,
  Printer,
  Coffee,
  ShoppingBag,
  Factory,
  MessageSquare,
  Tag
} from 'lucide-react';
import { SUPPLIERS, PRESET_VENUES, PRESET_HOMES } from '../data/mockData';
import { AYGO_LOGO_DATA_URI } from '../assets/logoBase64';
import AygoGoogleMap from './AygoGoogleMap';

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
  const [isMakersExpanded, setIsMakersExpanded] = useState(false);
  const [selectedMaker, setSelectedMaker] = useState({
    id: 's3',
    name: 'JJT Digital (Parañaque City)',
    loc: 'Parañaque · 11.8 km from venue',
    price: '₱46.00/pc',
    days: '4 Business Days',
    readyDate: 'Ready Oct 8, 2026'
  });

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

  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: currentItem.title,
    qty: currentItem.qty,
    budget: currentItem.budget,
    specs: currentItem.specs,
    date: currentDate,
    isPackage: currentItem.isPackage || false
  });
  const [itemUpdatedToast, setItemUpdatedToast] = useState(false);
  const [showAllPackageItems, setShowAllPackageItems] = useState(false);

  const handleOpenEditModal = () => {
    setEditFormData({
      title: currentItem.title,
      qty: currentItem.qty,
      budget: currentItem.budget,
      specs: currentItem.specs,
      date: currentDate,
      isPackage: currentItem.isPackage || false
    });
    setIsEditItemModalOpen(true);
  };

  const handleSaveItemEdit = (e) => {
    e.preventDefault();
    const updated = {
      ...currentItem,
      title: editFormData.title,
      qty: editFormData.qty,
      budget: editFormData.budget,
      specs: editFormData.specs,
      isPackage: editFormData.isPackage
    };
    if (onUpdateActiveItem) {
      onUpdateActiveItem(updated);
    } else {
      setInternalItem(updated);
    }
    if (editFormData.date && editFormData.date !== currentDate) {
      if (onChangeDeliveryDate) onChangeDeliveryDate(editFormData.date);
      else setLocalDate(editFormData.date);
    }
    setIsEditItemModalOpen(false);
    setItemUpdatedToast(true);
    setTimeout(() => setItemUpdatedToast(false), 3500);
  };

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

      {/* 2. FLOATING inDrive-STYLE BOTTOM STACK (Matching User Inspo media_1789999889260.jpg) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 lg:bottom-4 lg:left-6 lg:right-auto lg:w-[460px] pointer-events-none flex flex-col justify-end max-h-[58vh] sm:max-h-[70vh] lg:max-h-[88vh] overflow-y-auto custom-scroll touch-pan-y overscroll-contain px-3 pb-3 sm:px-0 sm:pb-0">
        <div className="pointer-events-auto space-y-2.5 sm:space-y-3">
          
          {/* CARD 1: Search & Recent Destinations */}
          <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-100 space-y-3">
            {/* Top Pull Handle */}
            <div className="pt-0.5 pb-1 flex justify-center cursor-grab">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* SEARCH BAR (Matching inspo: "Where to & for how much?") */}
            <div 
              onClick={() => onRequestNewJob && onRequestNewJob()}
              className="bg-[#F4F3F0] hover:bg-[#eae8e4] p-3.5 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all active:scale-[0.99] group"
              title="Post custom request or package"
            >
              <Search className="w-5 h-5 text-slate-800 shrink-0 group-hover:text-[#003CF5] transition-colors" />
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-[#003CF5] transition-colors">
                Where to & for how much?
              </span>
            </div>

            {/* RECENT DESTINATIONS / SOURCING ITEMS (Matching inspo recent list with Clock icons) */}
            <div className="space-y-1 pt-0.5">
              
              {/* Item 1: Active Sourcing Job */}
              <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                <div 
                  onClick={() => onRequestNewJob && onRequestNewJob()}
                  className="flex items-center gap-3 min-w-0 flex-1"
                >
                  <Clock className="w-5 h-5 text-slate-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 leading-tight truncate group-hover:text-[#003CF5] transition-colors">
                      {currentItem.title}
                    </div>
                    <div className="text-xs text-slate-500 font-normal mt-0.5 truncate">
                      {currentVenue.name} · {currentItem.budget}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-[#003CF5] hover:bg-white transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {currentItem.mockupImage && (
                    <button
                      type="button"
                      onClick={() => onOpenMockupStudio && onOpenMockupStudio()}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-[#003CF5] hover:bg-white transition-colors"
                      title="View Mockup"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Item 2: Common Ground Rockwell (Matching inspo) */}
              <div 
                onClick={() => {
                  const pastItem = {
                    title: '500 Dri-Fit Event Shirts',
                    qty: '500 pcs',
                    budget: '₱85,000 (₱170.00/pc)',
                    specs: '220 GSM Navy Cotton Blend, 2-color silkscreen.',
                    isPackage: false
                  };
                  if (onUpdateActiveItem) onUpdateActiveItem(pastItem);
                  else setInternalItem(pastItem);
                }}
                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <Clock className="w-5 h-5 text-slate-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 leading-tight truncate group-hover:text-[#003CF5] transition-colors">
                    Common Ground Rockwell
                  </div>
                  <div className="text-xs text-slate-500 font-normal mt-0.5 truncate">
                    Plaza Drive, Makati City, Metro Manila
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CARD 2: Requirement Types (Single Category vs Event Package) + Recommended Categories */}
          <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-xl border border-slate-100 space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Tile 1: Single Category */}
              <div 
                onClick={() => onRequestNewJob && onRequestNewJob('single', 'apparel')}
                className="p-3.5 rounded-2xl bg-[#F5F4F0] hover:bg-blue-50/70 border border-transparent hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between h-28 group relative overflow-hidden active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-white group-hover:bg-[#003CF5] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-[#003CF5] transition-colors leading-tight">
                      Single Category
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight pl-0.5">
                    One item or service type
                  </p>
                </div>
                <div className="flex justify-end items-end pt-1">
                  <div className="w-7 h-7 rounded-full bg-white group-hover:bg-[#003CF5] text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Tile 2: Event Package */}
              <div 
                onClick={() => onRequestNewJob && onRequestNewJob('package')}
                className="p-3.5 rounded-2xl bg-[#F5F4F0] hover:bg-blue-50/70 border border-transparent hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between h-28 group relative overflow-hidden active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-white group-hover:bg-[#003CF5] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-[#003CF5] transition-colors leading-tight">
                      Event Package
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight pl-0.5">
                    Multi-category bundle
                  </p>
                </div>
                <div className="flex justify-end items-end pt-1">
                  <div className="w-7 h-7 rounded-full bg-white group-hover:bg-[#003CF5] text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>

            {/* Recommended Row (The 4 Categories moved here) */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
                Recommended:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'apparel', label: 'Apparel & Shirts' },
                  { id: 'event-print', label: 'Event Print', isNew: true },
                  { id: 'drinkware', label: 'Drinkware', isNew: true },
                  { id: 'bags', label: 'Couriers & Swag' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onRequestNewJob && onRequestNewJob('single', item.id)}
                    className="shrink-0 px-2.5 py-1 rounded-xl bg-[#F5F4F0] hover:bg-blue-50 text-slate-700 hover:text-[#003CF5] border border-transparent hover:border-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{item.label}</span>
                    {item.isNew && (
                      <span className="text-[8px] font-black text-white bg-[#FF3B30] px-1 py-0.2 rounded-full leading-none">
                        NEW
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 3: Craft Maker Selection Bar / Milestone Tracker (Matching inDrive inspo "Choose a City ride >") */}
          <div className="bg-white rounded-3xl p-3.5 shadow-xl border border-slate-100">
            {selectedMaker ? (
              /* SELECTED MAKER STATE: Shows Turnaround & 4 Steps ONLY when already selected */
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#003CF5] text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
                      <Factory className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-slate-950">{selectedMaker.name}</h4>
                        <span className="text-[8px] font-black text-white bg-emerald-600 px-1.5 py-0.2 rounded uppercase">
                          SELECTED
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        {selectedMaker.loc} · {selectedMaker.price}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMaker(null)}
                    className="text-xs font-bold text-[#003CF5] hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* Crafting Time: 4 Business Days · Ready Oct 8, 2026 */}
                <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Clock className="w-4 h-4 text-[#003CF5]" />
                    <span>Crafting Time: <span className="font-black text-slate-950">{selectedMaker.days || '4 Business Days'}</span></span>
                  </div>
                  <span className="text-xs font-black text-[#003CF5] bg-white px-2 py-0.5 rounded-xl border border-blue-200">
                    {selectedMaker.readyDate || 'Ready Oct 8, 2026'}
                  </span>
                </div>

                {/* 4 Steps */}
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="p-2 rounded-xl bg-[#003CF5] text-white text-center shadow-xs">
                    <span className="text-[8px] font-black tracking-wider block text-blue-200 uppercase">1. Step</span>
                    <span className="text-xs font-black block mt-0.5">Proofing</span>
                    <span className="text-[8px] font-bold block mt-1 bg-white/20 text-white rounded px-1 py-0.2">In Progress</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-700 text-center border border-slate-200">
                    <span className="text-[8px] font-bold text-slate-400 block uppercase">2. Step</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">Printing</span>
                    <span className="text-[8px] font-semibold text-slate-400 block mt-1">Pending</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-700 text-center border border-slate-200">
                    <span className="text-[8px] font-bold text-slate-400 block uppercase">3. Step</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">Pack</span>
                    <span className="text-[8px] font-semibold text-slate-400 block mt-1">Pending</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-700 text-center border border-slate-200">
                    <span className="text-[8px] font-bold text-slate-400 block uppercase">4. Step</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">Dispatch</span>
                    <span className="text-[8px] font-semibold text-slate-400 block mt-1">Oct 8</span>
                  </div>
                </div>

                {/* Chat CTA */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      const s = SUPPLIERS.find(x => x.id === selectedMaker.id) || SUPPLIERS[0];
                      if (onOpenChatWithSupplier) onOpenChatWithSupplier(s);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat with Maker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMaker(null)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Change Maker
                  </button>
                </div>
              </div>
            ) : (
              /* UNSELECTED STATE: Clean "Choose a Craft Maker >" Bar matching inDrive */
              <div>
                <div 
                  onClick={() => setIsMakersExpanded(!isMakersExpanded)}
                  className="flex items-center justify-between cursor-pointer group py-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#003CF5] group-hover:bg-blue-50 transition-colors">
                      <Factory className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#003CF5] transition-colors flex items-center gap-1.5">
                        <span>Choose a Craft Maker</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">4 Verified Maker Bids Available</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#003CF5] group-hover:bg-blue-50 transition-colors">
                    <ChevronRight className={`w-4 h-4 transition-transform ${isMakersExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expandable Bids & Suppliers List with Direct Select / Accept buttons */}
                {isMakersExpanded && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                    {/* Supplier 1: JJT Digital (Parañaque) */}
                    <div className="p-3 rounded-2xl border border-emerald-300 bg-emerald-50/40 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900">JJT Digital (Parañaque City)</span>
                          <span className="text-[8px] font-black text-white bg-emerald-600 px-1 py-0.2 rounded">LOW</span>
                        </div>
                        <p className="text-[10px] text-slate-500">₱46.00/pc · Total: ₱13,800 · 4 Days Turnaround</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const s = SUPPLIERS.find(x => x.id === 's3');
                            if (onOpenChatWithSupplier && s) onOpenChatWithSupplier(s);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMaker({
                            id: 's3',
                            name: 'JJT Digital (Parañaque City)',
                            loc: 'Parañaque · 11.8 km from venue',
                            price: '₱46.00/pc',
                            days: '4 Business Days',
                            readyDate: 'Ready Oct 8, 2026'
                          })}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                      </div>
                    </div>

                    {/* Supplier 2: Thread & Co. (Taytay) */}
                    <div className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900">Thread (Taytay)</span>
                          <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">VERIFIED</span>
                        </div>
                        <p className="text-[10px] text-slate-500">₱49.50/pc · Total: ₱14,850 · 6 Days Turnaround</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const s = SUPPLIERS.find(x => x.id === 's1');
                            if (onOpenChatWithSupplier && s) onOpenChatWithSupplier(s);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMaker({
                            id: 's1',
                            name: 'Thread & Co. (Taytay)',
                            loc: 'Taytay · 14.2 km from venue',
                            price: '₱49.50/pc',
                            days: '6 Business Days',
                            readyDate: 'Ready Oct 12, 2026'
                          })}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                      </div>
                    </div>

                    {/* Supplier 3: Manila Bag Works */}
                    <div className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-2 opacity-90">
                      <div>
                        <span className="font-extrabold text-xs text-slate-900">Manila (Marikina City)</span>
                        <p className="text-[10px] text-slate-500">Canvas Bags & Totes · ₱55.00/pc</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const s = SUPPLIERS.find(x => x.id === 's2');
                            if (onOpenChatWithSupplier && s) onOpenChatWithSupplier(s);
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Chat
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMaker({
                            id: 's2',
                            name: 'Manila Bag Works (Marikina)',
                            loc: 'Marikina City',
                            price: '₱55.00/pc',
                            days: '7 Business Days',
                            readyDate: 'Ready Oct 14, 2026'
                          })}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Select
                        </button>
                      </div>
                    </div>

                    {/* Supplier 4: Everyday Drinkware */}
                    <div className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-2 opacity-90">
                      <div>
                        <span className="font-extrabold text-xs text-slate-900">Everyday (Valenzuela City)</span>
                        <p className="text-[10px] text-slate-500">Laser Tumblers & Flasks · ₱340.00/pc</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const s = SUPPLIERS.find(x => x.id === 's4');
                            if (onOpenChatWithSupplier && s) onOpenChatWithSupplier(s);
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Chat
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMaker({
                            id: 's4',
                            name: 'Everyday Drinkware (Valenzuela)',
                            loc: 'Valenzuela City',
                            price: '₱340.00/pc',
                            days: '5 Business Days',
                            readyDate: 'Ready Oct 10, 2026'
                          })}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Select
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>

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

      {/* INTERACTIVE EDIT ITEM MODAL */}
      {isEditItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-950">Edit Sourcing Request</h3>
                <p className="text-xs text-slate-500 font-medium">Update item name, quantities, budget, or specifications.</p>
              </div>
              <button 
                onClick={() => setIsEditItemModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItemEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Quantity</label>
                  <input
                    type="text"
                    value={editFormData.qty}
                    onChange={(e) => setEditFormData({ ...editFormData, qty: e.target.value })}
                    placeholder="e.g. 500 pcs or 300 sets"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Budget</label>
                  <input
                    type="text"
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                    placeholder="e.g. ₱25,000 (₱50/pc)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Delivery Date</label>
                <input
                  type="text"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                  placeholder="e.g. Oct 15, 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specifications & Crafting Notes</label>
                <textarea
                  rows={3}
                  value={editFormData.specs}
                  onChange={(e) => setEditFormData({ ...editFormData, specs: e.target.value })}
                  placeholder="e.g. Fabric GSM, print colors, packaging requirements..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5] resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
