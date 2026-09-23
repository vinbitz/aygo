import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Image as ImageIcon, 
  DollarSign, 
  Check, 
  CheckCheck, 
  Sparkles, 
  FileText, 
  Calendar,
  ExternalLink,
  ChevronRight,
  User,
  Building2,
  ArrowRightLeft
} from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';

// Initial pre-loaded conversation threads between Customer & Verified Suppliers
const INITIAL_CONVERSATIONS = {
  s3: {
    supplier: SUPPLIERS[2], // JJT Digital (Parañaque)
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'Marvin (Event Organizer)',
        time: '10:15 AM',
        text: 'Hi JJT Digital! We posted a requirement for 300 satin lanyards + RFID PVC cards for our Tech Summit in BGC on Oct 15. Can you accommodate the delivery timeline?',
        type: 'text'
      },
      {
        id: 'm2',
        sender: 'supplier',
        senderName: 'Sales Team JJT',
        time: '10:22 AM',
        text: 'Hello Marvin! Yes, we have 20mm smooth satin rolls in stock. We can do full sublimation 2-sided print at PHP 46.00/pc with 4 business days turnaround.',
        type: 'text'
      },
      {
        id: 'm3',
        sender: 'supplier',
        senderName: 'Sales Team JJT',
        time: '10:24 AM',
        text: 'Here is our official Aygo Bidding proposal:',
        type: 'bid_card',
        bidData: {
          unitPrice: 'PHP 46.00',
          totalPrice: 'PHP 13,800.00',
          quantity: '300 pcs',
          turnaround: '4 business days (Ready Oct 8)',
          inclusions: 'Free digital mockup, metal trigger hook, individual polybagging'
        }
      },
      {
        id: 'm4',
        sender: 'customer',
        senderName: 'Marvin (Event Organizer)',
        time: '10:30 AM',
        text: 'Great price! Attached is our event visual artwork proof from the Studio.',
        type: 'mockup_attachment',
        mockupData: {
          title: 'Devcon Manila 2026 Satin Lanyard Proof',
          spec: '20mm Full Color Sublimation · Safe Zone 10" x 12"',
          status: 'Artwork Approved'
        }
      },
      {
        id: 'm5',
        sender: 'supplier',
        senderName: 'Sales Team JJT',
        time: '10:35 AM',
        text: 'Artwork verified! Vector resolution is sharp. We can dispatch via Lalamove directly to Arthaland Century Pacific Tower, BGC as soon as finished.',
        type: 'text'
      }
    ]
  },
  s1: {
    supplier: SUPPLIERS[0], // Thread & Co. (Taytay)
    unreadCount: 1,
    messages: [
      {
        id: 'tm1',
        sender: 'customer',
        senderName: 'Marvin (Event Organizer)',
        time: 'Yesterday',
        text: 'Good day Patricia! We need 300 units of 220 GSM combed cotton shirts. Are your navy blue blanks available for silkscreen or DTF?',
        type: 'text'
      },
      {
        id: 'tm2',
        sender: 'supplier',
        senderName: 'Patricia Santos (Thread & Co.)',
        time: 'Yesterday',
        text: 'Good day Marvin! Yes, we have 220 GSM pre-shrunk cotton in stock at our Taytay factory. Our bid is PHP 49.50/pc for 300 sets with 5 business days crafting.',
        type: 'text'
      },
      {
        id: 'tm3',
        sender: 'supplier',
        senderName: 'Patricia Santos (Thread & Co.)',
        time: '09:00 AM',
        text: 'We also support Lalamove MPV and in-house delivery directly to Arthaland Tower in BGC. Let us know if you need physical swatch samples dispatched!',
        type: 'text'
      }
    ]
  },
  s2: {
    supplier: SUPPLIERS[1], // Manila Bag Works (Marikina)
    unreadCount: 0,
    messages: [
      {
        id: 'bm1',
        sender: 'customer',
        senderName: 'Marvin (Event Organizer)',
        time: 'Sep 19',
        text: 'Hi Marco, inquiring about 12oz natural off-white canvas tote bags with 1-color screen print.',
        type: 'text'
      },
      {
        id: 'bm2',
        sender: 'supplier',
        senderName: 'Marco Reyes (Manila Bag Works)',
        time: 'Sep 19',
        text: 'Hi Marvin! We can supply 300 units at PHP 55.00/pc. Heavy cross-stitched handles for durability.',
        type: 'text'
      }
    ]
  },
  s4: {
    supplier: SUPPLIERS[3], // Everyday Drinkware (Valenzuela)
    unreadCount: 0,
    messages: [
      {
        id: 'dm1',
        sender: 'customer',
        senderName: 'Marvin (Event Organizer)',
        time: 'Sep 18',
        text: 'Hello! Do you offer rotary 360-degree laser engraving on matte thermal tumblers for VIP packs?',
        type: 'text'
      },
      {
        id: 'dm2',
        sender: 'supplier',
        senderName: 'Engineering Desk (Everyday Drinkware)',
        time: 'Sep 18',
        text: 'Yes we do! Rotary laser leaves a permanent brushed silver finish. Turnaround is 3-5 days.',
        type: 'text'
      }
    ]
  }
};

export default function AygoMessagingModal({ 
  isOpen, 
  onClose, 
  initialSupplier = null, 
  activeVenue = null,
  activeItem = null,
  onAcceptBid = null 
}) {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeSupplierId, setActiveSupplierId] = useState(initialSupplier?.id || 's3');
  const [messageInput, setMessageInput] = useState('');
  const [senderRole, setSenderRole] = useState('customer'); // 'customer' or 'supplier' demo switch
  const [counterPriceInput, setCounterPriceInput] = useState('');
  const [showCounterBox, setShowCounterBox] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialSupplier && initialSupplier.id) {
      setActiveSupplierId(initialSupplier.id);
    }
  }, [initialSupplier]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeSupplierId]);

  if (!isOpen) return null;

  const currentConvo = conversations[activeSupplierId] || conversations['s3'];
  const currentSupplier = currentConvo.supplier;

  const handleSendMessage = (textToSend = null, customType = 'text', extraData = {}) => {
    const text = textToSend || messageInput.trim();
    if (!text && customType === 'text') return;

    const newMsg = {
      id: 'msg-' + Date.now(),
      sender: senderRole,
      senderName: senderRole === 'customer' ? 'Marvin (Organizer)' : currentSupplier.contactPerson,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text,
      type: customType,
      ...extraData
    };

    setConversations(prev => ({
      ...prev,
      [activeSupplierId]: {
        ...prev[activeSupplierId],
        unreadCount: 0,
        messages: [...prev[activeSupplierId].messages, newMsg]
      }
    }));

    setMessageInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendActiveMockup = () => {
    handleSendMessage(
      'Attached is our finalized product mockup and specification sheet for production verification.',
      'mockup_attachment',
      {
        mockupData: {
          title: activeItem?.title || 'Satin Event Lanyard Proof',
          spec: activeItem?.specs || 'Full Color Sublimation · 2-sided · Metal Hook',
          status: 'Shared from Aygo Studio'
        }
      }
    );
  };

  const handleSendCounterOffer = () => {
    if (!counterPriceInput) return;
    handleSendMessage(
      `Proposed counter-offer: PHP ${Number(counterPriceInput).toFixed(2)} / pc.`,
      'counter_offer',
      {
        offerData: {
          price: `PHP ${Number(counterPriceInput).toFixed(2)} / pc`,
          note: 'Organizer proposed price adjustment based on volume commitment.'
        }
      }
    );
    setShowCounterBox(false);
    setCounterPriceInput('');
  };

  const handleSendDeliveryPlace = () => {
    const venueName = activeVenue?.name || 'Arthaland Century Pacific Tower';
    const venueAddress = activeVenue?.address || '4th Ave, 30th St, Taguig, Metro Manila';
    handleSendMessage(
      `Here is our confirmed event delivery coordinate: ${venueName} (${venueAddress}).`,
      'location_pin',
      {
        locationData: {
          venue: venueName,
          address: venueAddress,
          city: activeVenue?.city || 'BGC, Taguig'
        }
      }
    );
  };

  const handleAcceptSupplierBid = () => {
    handleSendMessage(
      `Official Bid Accepted! Proceeding with bulk production with ${currentSupplier.name}.`,
      'accepted_bid',
      {
        bidData: {
          supplier: currentSupplier.name,
          confirmedBy: 'Marvin (Organizer)'
        }
      }
    );
    if (onAcceptBid) onAcceptBid(currentSupplier);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-2 sm:p-4 md:p-6 font-sans">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[90vh] max-h-[820px] overflow-hidden">
        
        {/* TOP HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#003CF5] text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-950">Aygo Supplier & Customer Workspace</h3>
                <span className="text-[10px] font-bold bg-blue-50 text-[#003CF5] px-2 py-0.5 rounded border border-blue-200">
                  Live Negotiation
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct maker-organizer messaging, specifications alignment, sample requests, and bid confirmations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: 2-Column Split View */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: Conversation Threads List */}
          <div className="w-80 border-r border-slate-200 bg-slate-50/70 flex flex-col justify-between hidden md:flex">
            <div className="p-3 border-b border-slate-200">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Verified Bidding Suppliers (4 Threads)
              </p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scroll">
              {Object.keys(conversations).map((supId) => {
                const item = conversations[supId];
                const s = item.supplier;
                const isSelected = supId === activeSupplierId;
                const lastMsg = item.messages[item.messages.length - 1];

                return (
                  <div
                    key={supId}
                    onClick={() => setActiveSupplierId(supId)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border text-left ${
                      isSelected
                        ? 'bg-white border-[#003CF5] shadow-sm'
                        : 'bg-white/60 border-transparent hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{s.name}</h4>
                          <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-[#003CF5]" />
                            <span>{s.city}</span>
                          </p>
                        </div>
                      </div>

                      {item.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#003CF5] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {item.unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-[11px] text-slate-600 truncate">
                      <span className="font-semibold text-slate-800">
                        {lastMsg.sender === 'customer' ? 'You: ' : `${s.contactPerson.split(' ')[0]}: `}
                      </span>
                      {lastMsg.type === 'bid_card' ? 'Sent formal price bid proposal' : lastMsg.text}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400 font-medium">
                      <span>{lastMsg.time}</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                        Verified Maker
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Sourcing Summary Card */}
            <div className="p-3 bg-white border-t border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-800 block">Sourcing Request:</span>
              <p className="font-extrabold text-[#003CF5] truncate">{activeItem?.title || '300 Customized Satin Lanyards'}</p>
              <p className="text-[10px] text-slate-500">Destination: {activeVenue?.name || 'BGC, Taguig'}</p>
            </div>
          </div>

          {/* RIGHT: Active Chat View */}
          <div className="flex-1 flex flex-col justify-between bg-white overflow-hidden">
            
            {/* Active Partner Bar */}
            <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentSupplier.avatar}
                  alt={currentSupplier.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{currentSupplier.name}</h4>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>Contact: <strong className="text-slate-700">{currentSupplier.contactPerson}</strong></span>
                    <span>·</span>
                    <span>{currentSupplier.city}</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-bold">Online now</span>
                  </p>
                </div>
              </div>

              {/* Quick Actions in Header */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcceptSupplierBid}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                  title="Accept this supplier's price offer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Accept Bid</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#f8fafc] custom-scroll">
              
              {/* Date divider */}
              <div className="flex items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-200 px-3 py-0.5 rounded-full">
                  Today · Direct Sourcing Chat
                </span>
              </div>

              {currentConvo.messages.map((m) => {
                const isMe = (senderRole === 'customer' && m.sender === 'customer') || (senderRole === 'supplier' && m.sender === 'supplier');
                const isCustomerMsg = m.sender === 'customer';

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isCustomerMsg ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-600">
                      <span className="font-bold">{m.senderName}</span>
                      <span>·</span>
                      <span>{m.time}</span>
                    </div>

                    {/* Standard Text Message */}
                    {m.type === 'text' && (
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                          isCustomerMsg
                            ? 'bg-[#003CF5] text-white rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                    )}

                    {/* Bidding Card Message */}
                    {m.type === 'bid_card' && (
                      <div className="max-w-md bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5 rounded-tl-none">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#003CF5]">Official Aygo Price Bid</span>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Active Offer</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="text-[10px] text-slate-600">Unit Price</span>
                            <p className="text-xl font-black text-slate-900">{m.bidData.unitPrice} <span className="text-xs font-normal text-slate-600">/pc</span></p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-600">Total for {m.bidData.quantity}</span>
                            <p className="text-sm font-bold text-[#003CF5]">{m.bidData.totalPrice}</p>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                          <p><strong>Crafting Turnaround:</strong> {m.bidData.turnaround}</p>
                          <p><strong>Inclusions:</strong> {m.bidData.inclusions}</p>
                        </div>
                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={handleAcceptSupplierBid}
                            className="flex-1 py-1.5 px-3 rounded-lg bg-[#003CF5] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                          >
                            Accept This Bid
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCounterBox(true)}
                            className="py-1.5 px-3 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Counter-Offer
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mockup Attachment Message */}
                    {m.type === 'mockup_attachment' && (
                      <div className="max-w-md bg-white border border-blue-200 rounded-2xl p-3.5 shadow-sm space-y-2 rounded-tr-none">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003CF5] flex items-center justify-center font-black">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-[#003CF5]">Product Mockup Proof</span>
                            <h5 className="text-xs font-bold text-slate-900 leading-tight">{m.mockupData.title}</h5>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          {m.mockupData.spec}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-slate-600 font-semibold pt-1">
                          <span className="text-emerald-600 font-bold">{m.mockupData.status}</span>
                          <a href="#product-mockup-studio" onClick={onClose} className="text-[#003CF5] font-bold hover:underline">
                            Inspect in Studio →
                          </a>
                        </div>
                      </div>
                    )}



                    {/* Counter Offer Message */}
                    {m.type === 'counter_offer' && (
                      <div className="max-w-md bg-blue-50 border border-blue-200 rounded-2xl p-3 shadow-sm text-xs rounded-tr-none">
                        <div className="flex items-center justify-between text-[#003CF5] font-bold mb-1">
                          <span>Organizer Counter-Proposal</span>
                          <span className="text-xs font-black">{m.offerData.price}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{m.offerData.note}</p>
                      </div>
                    )}

                    {/* Location Pin Card */}
                    {m.type === 'location_pin' && (
                      <div className="max-w-md bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-xs flex items-center gap-2.5 rounded-tr-none">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#003CF5] flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{m.locationData.venue}</p>
                          <p className="text-[10px] text-slate-500">{m.locationData.address}</p>
                        </div>
                      </div>
                    )}

                    {/* Bid Accepted Notice */}
                    {m.type === 'accepted_bid' && (
                      <div className="max-w-md bg-emerald-50 border border-emerald-300 rounded-2xl p-3 shadow-sm text-xs text-emerald-900 font-bold flex items-center gap-2">
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                        <span>Bid officially confirmed. Purchase order generated on Aygo.</span>
                      </div>
                    )}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Context Action Bar */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex flex-wrap gap-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 self-center pr-1 uppercase tracking-wider">Quick Actions:</span>
              
              <button
                type="button"
                onClick={handleSendActiveMockup}
                className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#003CF5] text-[11px] font-bold border border-blue-200 transition-colors flex items-center gap-1"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Share Active Mockup</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCounterBox(!showCounterBox)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <DollarSign className="w-3 h-3" />
                <span>Counter-Offer</span>
              </button>

              <button
                type="button"
                onClick={handleSendDeliveryPlace}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                <span>Send Destination Coordinate</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage('Can you dispatch a physical swatch sample to our office before we confirm final volume?', 'text')}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
              >
                Request Swatch Sample
              </button>
            </div>

            {/* Counter Offer Input Box (if opened) */}
            {showCounterBox && (
              <div className="mx-4 mb-2 p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Propose Target Unit Price (PHP):</span>
                <input
                  type="number"
                  placeholder="e.g. 43.50"
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(e.target.value)}
                  className="w-28 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <button
                  type="button"
                  onClick={handleSendCounterOffer}
                  className="px-3 py-1 rounded-lg bg-[#003CF5] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Send Proposal
                </button>
                <button
                  type="button"
                  onClick={() => setShowCounterBox(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Bottom Message Input Field */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendActiveMockup}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Attach File or Mockup"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Type a message to ${currentSupplier.contactPerson} (Press Enter to send)...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  className="px-4 py-2.5 rounded-2xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
