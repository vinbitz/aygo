import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  MapPin,
  Image as ImageIcon,
  CheckCheck,
  ChevronLeft,
  ChevronDown,
  Phone,
  Search,
  FileText,
  Package,
  Tag,
  MessageSquare,
  Download,
  Wallet
} from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';
import { toast } from '../lib/toast';
import SupplierDetailsPanel from './SupplierDetailsPanel';
import { maskContactInfo } from '../lib/contactGuard';
import { Sheet, Button, Chip, VerifiedBadge, Badge, IconCircle, cx, inputClass } from './ui';

const ME_NAME = 'Marvin (Organizer)';

// Each conversation is attached to a sourcing request so the context stays pinned in the thread
const INITIAL_CONVERSATIONS = {
  s3: {
    supplier: SUPPLIERS[2], // JJT Digital (Parañaque)
    unreadCount: 1,
    request: null, // uses the organizer's active request (activeItem / activeVenue)
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        time: '10:15 AM',
        type: 'text',
        text: 'Hi JJT Digital! We posted a request for 300 satin lanyards for our Tech Summit in BGC on Oct 15. Can you make the delivery timeline?'
      },
      {
        id: 'm2',
        sender: 'supplier',
        time: '10:22 AM',
        type: 'text',
        text: 'Hello Marvin! Yes, we have 20mm smooth satin rolls in stock. Full sublimation, 2-sided, at ₱46.00/pc with 4 business days turnaround.'
      },
      {
        id: 'm3',
        sender: 'supplier',
        time: '10:24 AM',
        type: 'bid_card',
        text: 'Here is our quotation for your request:',
        bidData: {
          unitPrice: '₱46.00',
          totalPrice: '₱13,800.00',
          quantity: '300 pcs',
          turnaround: '4 business days (ready Oct 8)',
          inclusions: 'Free digital mockup, metal trigger hook, individual polybag'
        }
      },
      {
        id: 'm3b',
        sender: 'supplier',
        time: '10:25 AM',
        type: 'product_ref',
        text: 'This is the exact lanyard we would use:',
        productData: {
          name: 'Full-color sublimation lanyard',
          detail: '20mm satin · trigger hook · MOQ 100',
          price: '₱46.00/pc',
          image: SUPPLIERS[2].coverImage
        }
      },
      {
        id: 'm4',
        sender: 'customer',
        time: '10:30 AM',
        type: 'mockup_attachment',
        text: 'Great price! Here is our artwork proof from the Studio.',
        mockupData: {
          title: 'DevCon Manila 2026 satin lanyard',
          spec: '20mm full-color sublimation · 2-sided',
          status: 'Artwork approved'
        }
      },
      {
        id: 'm5',
        sender: 'supplier',
        time: '10:35 AM',
        type: 'text',
        text: 'Artwork checked, the vector is sharp. We can dispatch via Lalamove straight to your venue as soon as it is finished.'
      }
    ]
  },
  s1: {
    supplier: SUPPLIERS[0], // Thread & Co. (Taytay)
    unreadCount: 1,
    request: { item: '300 event shirts, 220 GSM cotton', qty: '300 pcs', budget: '₱15,000', venue: 'Arthaland Tower, BGC', date: 'Oct 15' },
    messages: [
      {
        id: 'tm1',
        sender: 'customer',
        time: 'Yesterday',
        type: 'text',
        text: 'Good day Patricia! We need 300 units of 220 GSM combed cotton shirts. Are your navy blanks available for silkscreen or DTF?'
      },
      {
        id: 'tm2',
        sender: 'supplier',
        time: 'Yesterday',
        type: 'image',
        text: 'Yes, 220 GSM pre-shrunk cotton is in stock at our Taytay factory. Here are the navy blanks:',
        imageData: { src: SUPPLIERS[0].coverImage, caption: 'Navy 220 GSM blanks' }
      },
      {
        id: 'tm3',
        sender: 'supplier',
        time: '09:00 AM',
        type: 'document',
        text: 'Formal quotation attached. ₱49.50/pc for 300 pcs, 5 business days.',
        docData: { name: 'Quotation QT-0412 — Thread & Co.pdf', meta: 'Supplier quotation · 2 pages' }
      }
    ]
  },
  s2: {
    supplier: SUPPLIERS[1], // Manila Bag Works (Marikina)
    unreadCount: 0,
    request: { item: '300 canvas tote bags, 1-color print', qty: '300 pcs', budget: '₱18,000', venue: 'SMX Convention Center', date: 'Oct 20' },
    messages: [
      {
        id: 'bm1',
        sender: 'customer',
        time: 'Sep 19',
        type: 'text',
        text: 'Hi Marco, asking about 12oz natural off-white canvas totes with a 1-color screen print.'
      },
      {
        id: 'bm2',
        sender: 'supplier',
        time: 'Sep 19',
        type: 'text',
        text: 'Hi Marvin! We can supply 300 units at ₱55.00/pc. Cross-stitched handles for durability.'
      }
    ]
  },
  s4: {
    supplier: SUPPLIERS[3], // Everyday Drinkware (Valenzuela)
    unreadCount: 0,
    request: { item: '80 laser-engraved VIP tumblers', qty: '80 pcs', budget: '₱28,000', venue: 'Makati Shangri-La', date: 'Oct 22' },
    messages: [
      {
        id: 'dm1',
        sender: 'customer',
        time: 'Sep 18',
        type: 'text',
        text: 'Hello! Do you offer 360° rotary laser engraving on matte tumblers for VIP packs?'
      },
      {
        id: 'dm2',
        sender: 'supplier',
        time: 'Sep 18',
        type: 'text',
        text: 'Yes we do! Rotary laser leaves a permanent brushed silver finish. Turnaround is 3–5 days.'
      }
    ]
  }
};

const ATTACH_OPTIONS = [
  { id: 'photo', label: 'Photo', icon: ImageIcon, tone: 'rose' },
  { id: 'mockup', label: 'Mockup', icon: Package, tone: 'violet' },
  { id: 'product', label: 'Product', icon: Tag, tone: 'amber' },
  { id: 'document', label: 'Quote or document', icon: FileText, tone: 'blue' },
  { id: 'location', label: 'Venue', icon: MapPin, tone: 'green' }
];

const lastMessagePreview = (m) => {
  switch (m.type) {
    case 'bid_card': return 'Sent a quotation';
    case 'mockup_attachment': return 'Shared a mockup';
    case 'product_ref': return 'Shared a product';
    case 'image': return 'Sent a photo';
    case 'document': return 'Sent a document';
    case 'location_pin': return 'Shared the venue';
    case 'counter_offer': return 'Sent a counter-offer';
    case 'accepted_bid': return 'Bid accepted';
    default: return m.text;
  }
};

function Avatar({ supplier, size = 'md' }) {
  const [failed, setFailed] = useState(false);
  const dims = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10';
  if (!supplier.avatar || failed) {
    return (
      <span className={cx(dims, 'rounded-full bg-blue-50 text-[#003CF5] flex items-center justify-center text-[15px] font-semibold shrink-0')}>
        {supplier.name.slice(0, 1)}
      </span>
    );
  }
  return (
    <img
      src={supplier.avatar}
      alt=""
      onError={() => setFailed(true)}
      className={cx(dims, 'rounded-full object-cover bg-[#F4F3F0] shrink-0')}
    />
  );
}

// Friendly short name used in the composer and message meta
const shortName = (s) =>
  s.contactPerson && !/team|desk/i.test(s.contactPerson)
    ? s.contactPerson.split(' ')[0]
    : s.name.split(' ').slice(0, 2).join(' ');

/** Rich attachment cards rendered inside the thread */
function MessageCard({ m, isMine, onAccept, onCounter, onOpenStudio }) {
  const cardBase = 'w-[280px] max-w-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden';

  switch (m.type) {
    case 'bid_card':
      return (
        <div className={cx(cardBase, 'p-4')}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-semibold text-slate-900">Quotation</span>
            <Badge tone="green">Active offer</Badge>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[13px] text-slate-500">Unit price</p>
              <p className="text-[22px] font-semibold text-slate-900 leading-tight">{m.bidData.unitPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-slate-500">{m.bidData.quantity}</p>
              <p className="text-[15px] font-semibold text-slate-900">{m.bidData.totalPrice}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[13px] text-slate-600">
            <p><span className="text-slate-500">Turnaround:</span> {m.bidData.turnaround}</p>
            <p><span className="text-slate-500">Includes:</span> {m.bidData.inclusions}</p>
          </div>
          {!isMine && (
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1 h-11" onClick={onAccept}>Accept bid</Button>
              <Button size="sm" variant="secondary" className="h-11" onClick={onCounter}>Counter</Button>
            </div>
          )}
        </div>
      );

    case 'mockup_attachment':
      return (
        <div className={cardBase}>
          <div className="h-28 bg-gradient-to-br from-blue-50 via-violet-50 to-rose-50 flex items-center justify-center">
            <div className="w-40 h-6 rounded-full bg-[#003CF5]/80 shadow-sm flex items-center justify-center">
              <span className="text-[11px] font-semibold text-white">DevCon Manila</span>
            </div>
          </div>
          <div className="p-3.5">
            <p className="text-[13px] text-slate-500">Mockup</p>
            <p className="text-[15px] font-medium text-slate-900 leading-snug">{m.mockupData.title}</p>
            <p className="mt-0.5 text-[13px] text-slate-500">{m.mockupData.spec}</p>
            <div className="mt-2.5 flex items-center justify-between">
              <Badge tone="green">{m.mockupData.status}</Badge>
              <a
                href="#product-mockup-studio"
                onClick={onOpenStudio}
                className="text-[13px] font-semibold text-[#003CF5] hover:underline min-h-[44px] inline-flex items-center"
              >
                Open in Studio
              </a>
            </div>
          </div>
        </div>
      );

    case 'product_ref':
      return (
        <div className={cx(cardBase, 'flex gap-3 p-2.5')}>
          <img src={m.productData.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-[#F4F3F0] shrink-0" />
          <div className="min-w-0 py-0.5">
            <p className="text-[15px] font-medium text-slate-900 leading-snug truncate">{m.productData.name}</p>
            <p className="text-[13px] text-slate-500 truncate">{m.productData.detail}</p>
            <p className="mt-0.5 text-[13px] font-semibold text-slate-900">{m.productData.price}</p>
          </div>
        </div>
      );

    case 'image':
      return (
        <figure className={cardBase}>
          <img src={m.imageData.src} alt={m.imageData.caption} className="w-full h-40 object-cover bg-[#F4F3F0]" />
          {m.imageData.caption && (
            <figcaption className="px-3.5 py-2.5 text-[13px] text-slate-500">{m.imageData.caption}</figcaption>
          )}
        </figure>
      );

    case 'document':
      return (
        <div className={cx(cardBase, 'flex items-center gap-3 p-3')}>
          <IconCircle icon={FileText} tone="blue" />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium text-slate-900 truncate">{m.docData.name}</p>
            <p className="text-[13px] text-slate-500 truncate">{m.docData.meta}</p>
          </div>
          <button
            type="button"
            onClick={() => toast(`Downloading ${m.docData.name}`)}
            aria-label="Download document"
            className="w-11 h-11 rounded-full hover:bg-[#F4F3F0] text-slate-600 flex items-center justify-center shrink-0"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      );

    case 'counter_offer':
      return (
        <div className={cx(cardBase, 'p-4')}>
          <p className="text-[13px] text-slate-500">Counter-offer</p>
          <p className="text-[22px] font-semibold text-slate-900 leading-tight">{m.offerData.price}</p>
          <p className="mt-1 text-[13px] text-slate-500">{m.offerData.note}</p>
        </div>
      );

    case 'location_pin':
      return (
        <div className={cx(cardBase, 'flex items-center gap-3 p-3')}>
          <IconCircle icon={MapPin} tone="green" />
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-slate-900 truncate">{m.locationData.venue}</p>
            <p className="text-[13px] text-slate-500 truncate">{m.locationData.address}</p>
          </div>
        </div>
      );

    case 'accepted_bid':
      return (
        <div className="w-[280px] max-w-full rounded-2xl bg-emerald-50 p-3.5 flex items-start gap-2.5">
          <CheckCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[15px] font-medium text-emerald-900">Bid accepted</p>
            <p className="text-[13px] text-emerald-800/80">Purchase order created for {m.bidData.supplier}.</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function AygoMessagingModal({
  isOpen,
  onClose,
  initialSupplier = null,
  activeVenue = null,
  activeItem = null,
  onAcceptBid = null,
  onViewSupplier = null
}) {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeSupplierId, setActiveSupplierId] = useState(initialSupplier?.id || 's3');
  const [trackedInitialId, setTrackedInitialId] = useState(initialSupplier?.id);
  const [mobileView, setMobileView] = useState(initialSupplier ? 'thread' : 'list');
  const [messageInput, setMessageInput] = useState('');
  const [listQuery, setListQuery] = useState('');
  const [counterPriceInput, setCounterPriceInput] = useState('');
  const [showCounterBox, setShowCounterBox] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  // Maker details panel, opened by tapping the maker's name in the thread header
  const [showDetails, setShowDetails] = useState(false);

  const scrollRef = useRef(null);

  // Follow a new supplier passed in from outside (e.g. "Chat with maker")
  if (initialSupplier?.id && initialSupplier.id !== trackedInitialId) {
    setTrackedInitialId(initialSupplier.id);
    setActiveSupplierId(initialSupplier.id);
    setMobileView('thread');
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversations, activeSupplierId, mobileView, showAttachMenu, showCounterBox]);

  if (!isOpen) return null;

  // A supplier we have no thread with yet gets a fresh, empty conversation
  const currentConvo =
    conversations[activeSupplierId] ||
    (initialSupplier?.id === activeSupplierId
      ? { supplier: initialSupplier, unreadCount: 0, request: null, messages: [] }
      : conversations.s3);
  const currentSupplier = currentConvo.supplier;
  const convoKey = conversations[activeSupplierId] || initialSupplier?.id === activeSupplierId ? activeSupplierId : 's3';

  const venueName = activeVenue?.name || 'Arthaland Century Pacific Tower';
  const venueAddress = activeVenue?.address || '4th Ave, 30th St, Taguig, Metro Manila';
  const request = currentConvo.request || {
    item: activeItem?.title || '300 Customized Satin Lanyards',
    qty: activeItem?.qty || '300 pcs',
    budget: activeItem?.budget || '₱15,000',
    venue: venueName,
    date: 'Oct 15'
  };

  const firstName = shortName(currentSupplier);

  const threadIds = Object.keys(conversations).filter((id) => {
    const q = listQuery.trim().toLowerCase();
    if (!q) return true;
    const c = conversations[id];
    return c.supplier.name.toLowerCase().includes(q) || (c.request?.item || request.item).toLowerCase().includes(q);
  });

  const openThread = (id) => {
    setActiveSupplierId(id);
    setShowDetails(false);
    setMobileView('thread');
    setShowAttachMenu(false);
    setShowCounterBox(false);
    setConversations((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], unreadCount: 0 } } : prev));
  };

  const handleSendMessage = (textToSend = null, customType = 'text', extraData = {}) => {
    const raw = textToSend || messageInput.trim();
    if (!raw && customType === 'text') return;
    const { text, found } = customType === 'text' ? maskContactInfo(raw) : { text: raw, found: false };
    if (found) toast('Phone numbers, emails and outside chat handles are hidden. Keep talks in Aygo so your order stays protected.');

    const newMsg = {
      id: 'msg-' + Date.now(),
      sender: 'customer',
      senderName: ME_NAME,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      type: customType,
      ...extraData
    };

    setConversations((prev) => {
      const base = prev[convoKey] || currentConvo;
      return {
        ...prev,
        [convoKey]: { ...base, unreadCount: 0, messages: [...base.messages, newMsg] }
      };
    });

    setMessageInput('');
    setShowAttachMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendActiveMockup = () => {
    handleSendMessage('Here is our final mockup and spec sheet for production.', 'mockup_attachment', {
      mockupData: {
        title: activeItem?.title || 'Satin event lanyard',
        spec: activeItem?.specs || 'Full-color sublimation · 2-sided · metal hook',
        status: 'Shared from Studio'
      }
    });
  };

  const handleSendCounterOffer = () => {
    if (!counterPriceInput) return;
    const price = `₱${Number(counterPriceInput).toFixed(2)}/pc`;
    handleSendMessage(`Counter-offer: ${price}`, 'counter_offer', {
      offerData: { price, note: 'Price adjustment based on our volume commitment.' }
    });
    setShowCounterBox(false);
    setCounterPriceInput('');
  };

  const handleSendDeliveryPlace = () => {
    handleSendMessage(`Delivery venue: ${venueName}`, 'location_pin', {
      locationData: { venue: venueName, address: venueAddress, city: activeVenue?.city || 'BGC, Taguig' }
    });
  };

  const handleAttach = (id) => {
    if (id === 'mockup') return handleSendActiveMockup();
    if (id === 'location') return handleSendDeliveryPlace();
    if (id === 'photo') {
      return handleSendMessage('Reference photo for the print colors.', 'image', {
        imageData: { src: currentSupplier.coverImage || SUPPLIERS[2].coverImage, caption: 'Reference photo' }
      });
    }
    if (id === 'product') {
      return handleSendMessage('Can you match this product?', 'product_ref', {
        productData: {
          name: request.item,
          detail: activeItem?.specs || 'Custom event item',
          price: `Budget ${request.budget}`,
          image: currentSupplier.coverImage || SUPPLIERS[2].coverImage
        }
      });
    }
    if (id === 'document') {
      return handleSendMessage('Sharing our RFQ for this request.', 'document', {
        docData: { name: 'RFQ — ' + request.item + '.pdf', meta: 'Request for quotation · 1 page' }
      });
    }
  };

  const handleAcceptSupplierBid = () => {
    handleSendMessage(`Bid accepted. Proceeding with ${currentSupplier.name}.`, 'accepted_bid', {
      bidData: { supplier: currentSupplier.name, confirmedBy: ME_NAME }
    });
    if (onAcceptBid) onAcceptBid(currentSupplier);
  };

  const unreadTotal = Object.values(conversations).reduce((n, c) => n + (c.unreadCount || 0), 0);

  return (
    <Sheet
      onClose={onClose}
      title="Aygo Chat"
      subtitle={unreadTotal > 0 ? `${unreadTotal} unread · chats with your makers` : 'Chats with your makers, per request'}
      icon={MessageSquare}
      size="xl"
      bodyClassName="!px-0 !pb-0 !overflow-hidden flex"
    >
      <div className="flex w-full h-[calc(92vh-96px)] sm:h-[min(680px,calc(88vh-100px))] border-t border-slate-100">
        {/* Conversation list */}
        <aside
          className={cx(
            'w-full md:w-80 md:border-r border-slate-100 flex-col min-h-0 md:flex',
            mobileView === 'list' ? 'flex' : 'hidden'
          )}
        >
          <div className="p-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={listQuery}
                onChange={(e) => setListQuery(e.target.value)}
                placeholder="Search makers or requests"
                className={cx(inputClass, 'pl-10 py-2.5')}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
            {threadIds.map((id) => {
              const c = conversations[id];
              const s = c.supplier;
              const lastMsg = c.messages[c.messages.length - 1];
              const selected = id === activeSupplierId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => openThread(id)}
                  className={cx(
                    'w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-colors',
                    selected ? 'md:bg-[#F4F3F0]' : 'hover:bg-[#F4F3F0]/70'
                  )}
                >
                  <Avatar supplier={s} />
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[15px] font-medium text-slate-900 truncate">{s.name}</span>
                      <span className="ml-auto text-[12px] text-slate-400 shrink-0">{lastMsg?.time}</span>
                    </span>
                    <span className="block text-[13px] text-slate-500 truncate">
                      {c.request?.item || request.item}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className={cx('flex-1 text-[13px] truncate', c.unreadCount ? 'text-slate-900 font-medium' : 'text-slate-500')}>
                        {lastMsg ? `${lastMsg.sender === 'customer' ? 'You: ' : ''}${lastMessagePreview(lastMsg)}` : 'No messages yet'}
                      </span>
                      {c.unreadCount > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#003CF5] text-white text-[11px] font-semibold flex items-center justify-center">
                          {c.unreadCount}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
            {threadIds.length === 0 && (
              <p className="px-3 py-8 text-center text-[13px] text-slate-500">No chats match “{listQuery}”.</p>
            )}
          </div>
        </aside>

        {/* Active thread */}
        <section
          className={cx(
            'flex-1 min-w-0 flex-col min-h-0 md:flex',
            mobileView === 'thread' ? 'flex' : 'hidden'
          )}
        >
          {/* Thread header */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setMobileView('list')}
              aria-label="Back to chats"
              className="md:hidden w-11 h-11 -ml-1 rounded-full hover:bg-[#F4F3F0] flex items-center justify-center text-slate-700 shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              aria-label={`${showDetails ? 'Hide' : 'Show'} details for ${currentSupplier.name}`}
              className="flex-1 min-w-0 flex items-center gap-2 text-left rounded-2xl -my-1 py-1 pr-2 hover:bg-[#F4F3F0] transition-colors"
            >
              <Avatar supplier={currentSupplier} size="sm" />
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[15px] font-semibold text-slate-900 truncate">{currentSupplier.name}</span>
                  <VerifiedBadge className="shrink-0" />
                </span>
                <span className="block text-[13px] text-slate-500 truncate">
                  {showDetails ? 'Tap to go back to chat' : <><span className="text-emerald-600">Online</span> · <span className="text-[#003CF5] font-medium">Details</span> · {currentSupplier.contactPerson}</>}
                </span>
              </span>
              <ChevronDown className={cx('w-4 h-4 text-slate-400 shrink-0 transition-transform', showDetails && 'rotate-180')} />
            </button>
            <button
              type="button"
              onClick={() => toast('Calls are coming soon')}
              aria-label="Call maker"
              className="w-11 h-11 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-700 flex items-center justify-center shrink-0"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>

          {showDetails ? (
            <SupplierDetailsPanel
              supplier={SUPPLIERS.find((x) => x.id === currentSupplier.id) || currentSupplier}
              onBack={() => setShowDetails(false)}
              onViewProfile={onViewSupplier}
            />
          ) : (
          <>
          {/* Pinned request context */}
          <div className="px-3 sm:px-4 py-2.5 border-b border-slate-100 bg-white">
            <div className="rounded-2xl bg-[#F4F3F0] p-3 flex items-center gap-3">
              <IconCircle icon={Package} tone="blue" size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-slate-900 truncate">{request.item}</p>
                <p className="text-[13px] text-slate-500 truncate">
                  {[request.qty, request.budget, request.venue, request.date].filter(Boolean).join(' · ')}
                </p>
              </div>
              <Button size="sm" variant="outline" className="h-11 shrink-0" onClick={handleAcceptSupplierBid}>
                Accept
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain bg-[#F2F1ED] px-3 sm:px-5 py-4 space-y-3">
            <div className="flex justify-center">
              <span className="text-[12px] text-slate-500 bg-white/80 px-3 py-1 rounded-full">
                Chat linked to this request
              </span>
            </div>

            {currentConvo.messages.map((m) => {
              const isMine = m.sender === 'customer';
              const hasCard = m.type !== 'text';
              return (
                <div key={m.id} className={cx('flex flex-col gap-1', isMine ? 'items-end' : 'items-start')}>
                  {m.text && (
                    <div
                      className={cx(
                        'max-w-[85%] sm:max-w-md px-3.5 py-2.5 rounded-2xl text-[15px] leading-snug',
                        isMine ? 'bg-[#003CF5] text-white rounded-br-md' : 'bg-white text-slate-900 rounded-bl-md'
                      )}
                    >
                      {m.text}
                    </div>
                  )}
                  {hasCard && (
                    <MessageCard
                      m={m}
                      isMine={isMine}
                      onAccept={handleAcceptSupplierBid}
                      onCounter={() => setShowCounterBox(true)}
                      onOpenStudio={onClose}
                    />
                  )}
                  <span className="px-1 text-[11px] text-slate-400">
                    {isMine ? 'You' : firstName} · {m.time}
                  </span>
                </div>
              );
            })}

            {currentConvo.messages.length === 0 && (
              <p className="py-10 text-center text-[13px] text-slate-500">
                Say hi to {firstName}. Your request details are shared automatically.
              </p>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-slate-100 bg-white px-3 sm:px-4 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))] space-y-2.5">
            <div className={cx('gap-2 overflow-x-auto no-scrollbar -mx-1 px-1', showAttachMenu ? 'hidden' : 'flex')}>
              <Chip icon={Package} onClick={handleSendActiveMockup}>Share mockup</Chip>
              <Chip icon={Wallet} selected={showCounterBox} onClick={() => setShowCounterBox((v) => !v)}>Counter-offer</Chip>
              <Chip icon={MapPin} onClick={handleSendDeliveryPlace}>Send venue</Chip>
              <Chip onClick={() => handleSendMessage('Can you send a physical sample to our office before we confirm the final quantity?')}>
                Request sample
              </Chip>
            </div>

            {showCounterBox && (
              <div className="flex items-center gap-2 rounded-2xl bg-[#F4F3F0] p-2 pl-4">
                <span className="text-[13px] text-slate-600 shrink-0">Your price ₱</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="43.50"
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(e.target.value)}
                  className="flex-1 min-w-0 h-11 px-3 rounded-xl bg-white text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]/40"
                  autoFocus
                />
                <Button size="sm" className="h-11" onClick={handleSendCounterOffer} disabled={!counterPriceInput}>
                  Send
                </Button>
              </div>
            )}

            {showAttachMenu && (
              <div className="grid grid-cols-5 gap-1 rounded-2xl bg-[#F4F3F0] p-2">
                {ATTACH_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleAttach(opt.id)}
                    className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white transition-colors"
                  >
                    <IconCircle icon={opt.icon} tone={opt.tone} size="sm" />
                    <span className="text-[11px] font-medium text-slate-700 text-center leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAttachMenu((v) => !v)}
                aria-label="Attach"
                aria-expanded={showAttachMenu}
                className={cx(
                  'w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors',
                  showAttachMenu ? 'bg-slate-900 text-white' : 'bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-700'
                )}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder={`Message ${firstName}`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-0 h-11 px-4 rounded-full bg-[#F4F3F0] text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003CF5]/40"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!messageInput.trim()}
                aria-label="Send message"
                className="w-11 h-11 rounded-full bg-[#003CF5] hover:bg-[#0030c7] text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          </>
          )}
        </section>
      </div>
    </Sheet>
  );
}
