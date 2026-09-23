import React, { useEffect, useMemo, useState } from 'react';
import {
  Inbox,
  Gavel,
  Truck,
  Store,
  MapPin,
  Clock,
  CalendarDays,
  Package,
  Star,
  Trophy,
  Zap,
  Sparkles,
  BarChart3,
  Rocket,
  PhoneCall,
  MessageSquare,
  Plus,
  Trash2,
  Camera,
  Pencil,
  Check,
  Wand2,
  ArrowLeftRight,
  Search,
  CornerDownRight,
  Users,
  Boxes,
  LayoutList,
  Award,
  FileText,
  Crown
} from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';
import { MAKER_PRO_PRICE, MAKER_PRO_PERKS, PRO_PLANS } from '../lib/pro';
import { organizerParty } from '../lib/chatStore';
import SupplierMap from './SupplierMap';
import { toast } from '../lib/toast';
import {
  Sheet,
  Button,
  Field,
  Input,
  Textarea,
  Select,
  Badge,
  VerifiedBadge,
  Chip,
  Tabs,
  ListRow,
  IconCircle,
  Section,
  Panel,
  EmptyState,
  cx
} from './ui';

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const REQUEST_FILTERS = ['All', 'Apparel', 'Event print', 'Drinkware', 'Bags'];

const INITIAL_REQUESTS = [
  {
    id: 'req-101',
    pin: { x: 28, y: 34 }, // spot on the map, in percent
    item: 'Custom satin lanyards',
    category: 'Event print',
    organizer: 'BGC Tech Summit',
    qty: 300,
    budget: 15000,
    deadline: 'Oct 15',
    deadlineISO: '2026-10-15',
    venue: 'Arthaland Century Pacific Tower, BGC',
    distance: '8.2 km',
    posted: '12 min ago',
    bidsCount: 4,
    specs: '20mm satin ribbon, 2-sided full-colour sublimation, trigger snap hook.'
  },
  {
    id: 'req-102',
    pin: { x: 72, y: 30 }, // spot on the map, in percent
    item: 'Navy dri-fit shirts',
    category: 'Apparel',
    organizer: 'Pinoy Runners Manila',
    qty: 500,
    budget: 85000,
    deadline: 'Oct 20',
    deadlineISO: '2026-10-20',
    venue: 'SMX Convention Center, Pasay',
    distance: '6.5 km',
    posted: '1 hr ago',
    bidsCount: 2,
    specs: 'Honeycomb dri-fit, 1-colour chest silkscreen, individual size polybags.'
  },
  {
    id: 'req-103',
    pin: { x: 24, y: 70 }, // spot on the map, in percent
    item: 'Laser-engraved tumblers',
    category: 'Drinkware',
    organizer: 'Fintech Leadership Forum',
    qty: 100,
    budget: 35000,
    deadline: 'Nov 2',
    deadlineISO: '2026-11-02',
    venue: 'Rockwell Center, Makati',
    distance: '9.8 km',
    posted: '3 hr ago',
    bidsCount: 3,
    specs: 'SUS304 double-wall 500ml, rotary laser mark, individual kraft boxes.'
  },
  {
    id: 'req-104',
    pin: { x: 76, y: 68 }, // spot on the map, in percent
    item: 'Canvas tote bags',
    category: 'Bags',
    organizer: 'PH Startup Assembly',
    qty: 250,
    budget: 22500,
    deadline: 'Oct 28',
    deadlineISO: '2026-10-28',
    venue: 'World Trade Center, Pasay',
    distance: '7.1 km',
    posted: 'Yesterday',
    bidsCount: 5,
    specs: '12oz natural canvas, 2-colour silkscreen on one side.'
  }
];

// A request that arrives while the maker is looking at the map
const NEW_REQUEST = {
  id: 'req-new-1',
  pin: { x: 52, y: 86 }, // spot on the map, in percent
  item: 'Canvas tote bags with 1-color print',
  category: 'Bags',
  organizer: 'Ateneo Org Fair',
  qty: 250,
  budget: 21000,
  deadline: 'Oct 24',
  deadlineISO: '2026-10-24',
  venue: 'Ateneo de Manila, Quezon City',
  distance: '6.4 km',
  posted: 'Just now',
  bidsCount: 0,
  specs: '12oz natural canvas, 1-color screen print on one side, 38 × 42 cm.'
};

const VIEW_KEY = 'aygo.makerView';
const loadView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'board' ? 'board' : 'map';
  } catch {
    return 'map';
  }
};

const INITIAL_BIDS = [
  { id: 'bid-1', requestId: 'req-101', item: 'Custom satin lanyards', organizer: 'BGC Tech Summit', qty: 300, price: 46, days: 4, status: 'Pending', sent: '2 hr ago' },
  { id: 'bid-2', item: 'Event polo shirts', organizer: 'DevCon Manila', qty: 150, price: 280, counter: 260, days: 6, status: 'Countered', sent: 'Yesterday' },
  { id: 'bid-3', item: 'Dri-fit event shirts', organizer: 'Manila Hackathon Expo', qty: 500, price: 165, days: 5, status: 'Won', sent: 'Sep 12' },
  { id: 'bid-4', item: 'Enamel coffee mugs', organizer: 'Kape Summit PH', qty: 200, price: 190, days: 7, status: 'Lost', sent: 'Sep 8' }
];

const BID_STATUS = {
  Pending: { tone: 'amber', text: 'Waiting for organizer' },
  Countered: { tone: 'violet', text: 'Organizer sent a counter offer' },
  Won: { tone: 'green', text: 'You won this job' },
  Lost: { tone: 'slate', text: 'Organizer chose another maker' }
};

const ORDER_STEPS = ['Proofing', 'Printing', 'Pack', 'Dispatch'];

const INITIAL_ORDERS = [
  { id: 'ord-8812', item: '300 satin lanyards + PVC IDs', organizer: 'BGC Tech Summit', payout: 13800, deadline: 'Oct 15', venue: 'Arthaland Century Pacific Tower, BGC', step: 0 },
  { id: 'ord-8790', item: '500 dri-fit event shirts', organizer: 'Manila Hackathon Expo', payout: 82500, deadline: 'Oct 9', venue: 'SMX Convention Center, Pasay', step: 2 }
];

const INCLUSIONS = ['Digital mockup proof', 'Physical sample', 'Individual polybag', 'Free Metro Manila delivery', 'Rush option', 'Gift box packaging'];

const CATALOG = [
  { name: 'Satin lanyards', from: 38, moq: 50 },
  { name: 'Cotton & dri-fit shirts', from: 150, moq: 30 },
  { name: 'Canvas tote bags', from: 70, moq: 50 },
  { name: 'Laser-etched tumblers', from: 320, moq: 24 }
];

const INITIAL_SAMPLES = [
  { id: 'samp-1', name: 'Satin sublimation lanyards', event: 'BGC Tech Summit 2026', price: '₱46/pc', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=70' },
  { id: 'samp-2', name: '240 GSM oversized cotton shirts', event: 'Manila Hackathon Expo', price: '₱165/pc', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=70' },
  { id: 'samp-3', name: '14oz canvas conference tote', event: 'PH Startup Assembly', price: '₱72/pc', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=70' },
  { id: 'samp-4', name: 'Matte black thermal tumbler', event: 'Fintech Leadership Gala', price: '₱340/pc', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=70' }
];

const INITIAL_REVIEWS = [
  { id: 'rev-1', author: 'Marvin Barrios', event: 'BGC Tech Summit', rating: 5, date: 'Sep 18', comment: 'Delivered a full day early and the sublimation colours matched our Pantone perfectly.', reply: 'Thank you Marvin! Looking forward to your next event.' },
  { id: 'rev-2', author: 'Kaye Domingo', event: 'DevCon Manila', rating: 5, date: 'Aug 24', comment: 'Prints stayed vibrant after multiple washes. Payment through Aygo was smooth.', reply: null },
  { id: 'rev-3', author: 'Carlo Mendoza', event: 'Startup PH Founders Forum', rating: 4.8, date: 'Jul 12', comment: 'Crisp laser engraving on the matte black bottles. Our VIPs loved them.', reply: null }
];

// Same list as registration and the Go Pro screen
const PRO_PERK_STYLE = {
  listings: { icon: Store, tone: 'green' },
  placement: { icon: Rocket, tone: 'blue' },
  analytics: { icon: BarChart3, tone: 'violet' },
  mockups: { icon: Wand2, tone: 'amber' },
  documents: { icon: FileText, tone: 'blue' },
  calls: { icon: PhoneCall, tone: 'rose' },
  badge: { icon: Award, tone: 'slate' }
};
const PRO_PERKS = MAKER_PRO_PERKS.map((p) => ({ ...PRO_PERK_STYLE[p.id], title: p.title, text: p.text }));

const TABS = [
  { id: 'requests', label: 'Requests', icon: Inbox },
  { id: 'bids', label: 'My bids', icon: Gavel },
  { id: 'orders', label: 'Orders', icon: Truck },
  { id: 'store', label: 'Storefront', icon: Store }
];

const TAB_TITLES = { requests: 'Requests', bids: 'My bids', orders: 'Orders', store: 'Storefront' };

const EMPTY_SAMPLE = { name: '', event: '', price: '', image: '' };

const peso = (n) => `₱${Number(n || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 })}`;

function addDaysISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + Number(days || 0));
  return d.toISOString().slice(0, 10);
}

const card = 'bg-white rounded-[28px] p-4 sm:p-5';

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function OrderStepper({ step }) {
  return (
    <ol className="grid grid-cols-4">
      {ORDER_STEPS.map((label, i) => {
        const done = i <= step;
        const current = i === step;
        return (
          <li key={label} className="relative flex flex-col items-center text-center">
            {i > 0 && <span className={cx('absolute top-[5px] right-1/2 w-full h-0.5', done ? 'bg-[#003CF5]' : 'bg-slate-200')} />}
            <span
              className={cx(
                'relative z-10 w-3 h-3 rounded-full',
                current ? 'bg-[#003CF5] ring-4 ring-blue-100' : done ? 'bg-[#003CF5]' : 'bg-slate-200'
              )}
            />
            <span className={cx('mt-2 text-[12px]', current ? 'font-semibold text-slate-900' : 'text-slate-500')}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Stat({ icon, tone, value, label }) {
  return (
    <div className="rounded-2xl bg-[#F4F3F0] p-3">
      <IconCircle icon={icon} tone={tone} size="sm" />
      <p className="mt-2 text-[17px] font-semibold text-slate-900 leading-tight">{value}</p>
      <p className="text-[12px] text-slate-500">{label}</p>
    </div>
  );
}

function Meta({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-slate-500 min-w-0">
      <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
      <span className="truncate">{children}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Main view                                                           */
/* ------------------------------------------------------------------ */

export default function SupplierPortalView({
  onOpenDrawer,
  activeTab: tabProp,
  onTabChange,
  onOpenChatWithCustomer,
  onOpenMockupStudio,
  onOpenDocuments,
  onOpenPro
}) {
  const [innerTab, setInnerTab] = useState('requests');
  const activeTab = tabProp || innerTab;
  const setActiveTab = (t) => (onTabChange ? onTabChange(t) : setInnerTab(t));
  // Requests as a map (like the organizer home) or as a board
  const [view, setViewState] = useState(loadView);
  const setView = (v) => {
    setViewState(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      // storage unavailable
    }
  };
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [incomingId, setIncomingId] = useState(null);
  const [requestFilter, setRequestFilter] = useState('All');
  const [bidFilter, setBidFilter] = useState('all');

  const [profile, setProfile] = useState({
    name: SUPPLIERS.find((s) => s.id === 's3')?.name || 'JJT Digital',
    tagline: 'Sublimation, DTF and silkscreen press in Parañaque',
    contactPerson: 'Joshua Tan',
    phone: '+63 917 143 5890',
    email: 'sales.jtdigital@gmail.com',
    city: 'Parañaque City',
    turnaround: '3–5 business days',
    moq: '30 pcs',
    bio: 'Heat transfer, sublimation and screen printing for lanyards, RFID badges, apparel and weatherproof stickers, with 24–48h rush capability.'
  });
  const [profileForm, setProfileForm] = useState(null);

  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  // Demo: a new request pops up a few seconds after opening
  useEffect(() => {
    const t = setTimeout(() => {
      setRequests((prev) => (prev.some((r) => r.id === NEW_REQUEST.id) ? prev : [NEW_REQUEST, ...prev]));
      setIncomingId(NEW_REQUEST.id);
    }, 6000);
    return () => clearTimeout(t);
  }, []);
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [samples, setSamples] = useState(INITIAL_SAMPLES);
  const [sampleForm, setSampleForm] = useState(null);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [networkSearch, setNetworkSearch] = useState('');

  // Bid sheet
  const [bidReq, setBidReq] = useState(null);
  const [bidForm, setBidForm] = useState(null);

  const bidByRequest = useMemo(() => Object.fromEntries(bids.filter((b) => b.requestId).map((b) => [b.requestId, b])), [bids]);
  const visibleRequests = requests.filter((r) => requestFilter === 'All' || r.category === requestFilter);
  const visibleBids = bids.filter((b) => bidFilter === 'all' || b.status === bidFilter);
  const closedBids = bids.filter((b) => b.status === 'Won' || b.status === 'Lost');
  const winRate = closedBids.length ? Math.round((closedBids.filter((b) => b.status === 'Won').length / closedBids.length) * 100) : 0;
  const pendingCount = bids.filter((b) => b.status === 'Pending' || b.status === 'Countered').length;
  const activeOrders = orders.filter((o) => o.step < ORDER_STEPS.length).length;

  // Chat with the organizer behind a request, bid or order
  const organizerChat = (ctx) => {
    onOpenChatWithCustomer?.(organizerParty({
      organizer: ctx.organizer,
      item: ctx.item,
      qty: ctx.qty,
      budget: ctx.budget,
      venue: ctx.venue,
      deadline: ctx.deadline
    }));
  };

  /* ---------- bids ---------- */
  const openBid = (req) => {
    const existing = bidByRequest[req.id];
    const days = existing?.days || 4;
    setBidReq(req);
    setBidForm({
      price: existing ? String(existing.price) : ((req.budget / req.qty) * 0.92).toFixed(2),
      days: String(days),
      delivery: existing?.delivery || (addDaysISO(days) < req.deadlineISO ? addDaysISO(days) : req.deadlineISO),
      inclusions: existing?.inclusions || ['Digital mockup proof', 'Free Metro Manila delivery'],
      notes: existing?.notes || ''
    });
  };

  const bidTotal = bidReq && bidForm ? (parseFloat(bidForm.price) || 0) * bidReq.qty : 0;

  const submitBid = (e) => {
    e?.preventDefault();
    const price = parseFloat(bidForm.price);
    if (!price || price <= 0) {
      toast('Enter your price per piece');
      return;
    }
    const entry = {
      requestId: bidReq.id,
      item: bidReq.item,
      organizer: bidReq.organizer,
      qty: bidReq.qty,
      price,
      days: Number(bidForm.days) || 1,
      delivery: bidForm.delivery,
      inclusions: bidForm.inclusions,
      notes: bidForm.notes,
      status: 'Pending',
      sent: 'Just now'
    };
    const existing = bidByRequest[bidReq.id];
    if (existing) {
      setBids((prev) => prev.map((b) => (b.id === existing.id ? { ...b, ...entry } : b)));
    } else {
      setBids((prev) => [{ id: `bid-${Date.now()}`, ...entry }, ...prev]);
      setRequests((prev) => prev.map((r) => (r.id === bidReq.id ? { ...r, bidsCount: r.bidsCount + 1 } : r)));
    }
    setBidReq(null);
    setBidForm(null);
    toast('Bid sent');
  };

  // Send the offer straight into the organizer's chat as a payable package
  const sendPackage = () => {
    const price = parseFloat(bidForm.price);
    if (!price || price <= 0) {
      toast('Enter your price per piece');
      return;
    }
    submitBid();
    onOpenChatWithCustomer?.(organizerParty(bidReq), {
      id: `pkg-${Date.now()}`,
      type: 'package',
      text: `Hi ${bidReq.organizer}! Here is our package. You can pay the downpayment right here in chat.`,
      packageData: {
        title: bidReq.item,
        items: [{ name: bidReq.item, qty: bidReq.qty, unitPrice: price }],
        ready: new Date(bidForm.delivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        delivery: bidForm.inclusions.length ? bidForm.inclusions.join(' · ') : 'Delivery to venue',
        downpaymentPct: 50,
        status: 'open'
      }
    });
  };

  const toggleInclusion = (label) =>
    setBidForm((f) => ({
      ...f,
      inclusions: f.inclusions.includes(label) ? f.inclusions.filter((x) => x !== label) : [...f.inclusions, label]
    }));

  const acceptCounter = (bid) => {
    setBids((prev) => prev.map((b) => (b.id === bid.id ? { ...b, price: b.counter, counter: undefined, status: 'Pending', sent: 'Just now' } : b)));
    toast(`Counter accepted at ${peso(bid.counter)}/pc`);
  };

  /* ---------- orders ---------- */
  const advanceOrder = (order) => {
    const next = order.step + 1;
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, step: next } : o)));
    toast(next >= ORDER_STEPS.length ? 'Marked as dispatched. Organizer notified' : `${ORDER_STEPS[order.step]} done. Organizer notified`);
    // Demo: the organizer confirms delivery a moment later, which releases the payout
    if (next >= ORDER_STEPS.length) {
      setTimeout(() => {
        setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, received: true } : o)));
        toast(`${order.organizer} confirmed delivery. ${peso(order.payout)} released to your Aygo wallet.`);
      }, 4000);
    }
  };

  const withdraw = (order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, withdrawn: true } : o)));
    toast(`${peso(order.payout)} is on its way to your GCash. Usually within 1 business day.`);
  };

  /* ---------- storefront ---------- */
  const saveProfile = (e) => {
    e?.preventDefault();
    setProfile(profileForm);
    setProfileForm(null);
    toast('Storefront updated');
  };

  const saveSample = (e) => {
    e?.preventDefault();
    if (!sampleForm.name.trim()) {
      toast('Add a product name');
      return;
    }
    setSamples((prev) => [
      {
        id: `samp-${Date.now()}`,
        name: sampleForm.name.trim(),
        event: sampleForm.event.trim() || 'Verified order',
        price: sampleForm.price.trim(),
        image: sampleForm.image || INITIAL_SAMPLES[1].image
      },
      ...prev
    ]);
    setSampleForm(null);
    toast('Added to portfolio');
  };

  const onSampleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setSampleForm((f) => ({ ...f, image: evt.target?.result }));
    reader.readAsDataURL(file);
  };

  const postReply = (id) => {
    const text = replyDrafts[id]?.trim();
    if (!text) return;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: text } : r)));
    setReplyDrafts((d) => ({ ...d, [id]: '' }));
    setReplyingTo(null);
    toast('Reply posted');
  };

  const network = SUPPLIERS.filter(
    (s) => s.id !== 's3' && `${s.name} ${s.city}`.toLowerCase().includes(networkSearch.toLowerCase())
  );

  /* ------------------------------------------------------------------ */
  /* Tab content                                                         */
  /* ------------------------------------------------------------------ */

  const statsCard = (
    <section className={card}>
      <div className="grid grid-cols-3 gap-2">
        <Stat icon={Trophy} tone="green" value={`${winRate}%`} label="Win rate" />
        <Stat icon={Zap} tone="amber" value="18 min" label="Avg. response" />
        <Stat icon={Star} tone="violet" value="4.9" label="Rating" />
      </div>
    </section>
  );

  const requestsTab = (
    <div className="space-y-2">
      <div className="lg:hidden">{statsCard}</div>
      <section className={card}>
        <div className="flex items-center gap-3">
          <IconCircle icon={MapPin} tone="blue" size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="text-[19px] font-semibold text-slate-900 tracking-tight leading-tight">Requests near you</h2>
            <p className="text-[13px] text-slate-500">Matched to your categories within 15 km of {profile.city}</p>
          </div>
        </div>
        <div className="mt-3 -mx-4 sm:-mx-5 px-4 sm:px-5 flex gap-2 overflow-x-auto no-scrollbar">
          {REQUEST_FILTERS.map((f) => (
            <Chip key={f} selected={requestFilter === f} onClick={() => setRequestFilter(f)} className="h-10">
              {f}
            </Chip>
          ))}
        </div>
      </section>

      {visibleRequests.length === 0 && (
        <section className={card}>
          <EmptyState icon={Inbox} title="No requests in this category" text="New organizer requests near you will show up here." />
        </section>
      )}

      {visibleRequests.map((req) => {
        const myBid = bidByRequest[req.id];
        return (
          <article key={req.id} className={card}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] text-slate-500">
                  {req.organizer} · {req.posted}
                </p>
                <h3 className="mt-0.5 text-[17px] font-semibold text-slate-900 leading-snug">
                  {req.qty.toLocaleString()} {req.item.toLowerCase()}
                </h3>
              </div>
              <Badge tone="slate" className="shrink-0">{req.category}</Badge>
            </div>

            <p className="mt-2 text-[14px] text-slate-600 leading-relaxed">{req.specs}</p>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-[#F4F3F0] px-3 py-2.5">
                <p className="text-[12px] text-slate-500">Budget</p>
                <p className="text-[15px] font-semibold text-slate-900">{peso(req.budget)}</p>
              </div>
              <div className="rounded-2xl bg-[#F4F3F0] px-3 py-2.5">
                <p className="text-[12px] text-slate-500">Per piece</p>
                <p className="text-[15px] font-semibold text-slate-900">{peso(req.budget / req.qty)}</p>
              </div>
              <div className="rounded-2xl bg-[#F4F3F0] px-3 py-2.5">
                <p className="text-[12px] text-slate-500">Needed by</p>
                <p className="text-[15px] font-semibold text-slate-900">{req.deadline}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <Meta icon={MapPin}>{req.venue}</Meta>
              <Meta icon={ArrowLeftRight}>{req.distance} away</Meta>
              <Meta icon={Users}>{req.bidsCount} bids so far</Meta>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {myBid ? (
                <>
                  <div className="flex-1 min-w-0">
                    <Badge tone={BID_STATUS[myBid.status].tone} icon={Check}>
                      Bid sent · {peso(myBid.price)}/pc
                    </Badge>
                  </div>
                  <Button variant="secondary" icon={Pencil} onClick={() => openBid(req)}>
                    Edit bid
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" icon={MessageSquare} onClick={() => organizerChat(req)} aria-label="Message organizer">
                    <span className="hidden sm:inline">Ask</span>
                  </Button>
                  <Button className="flex-1" icon={Gavel} onClick={() => openBid(req)}>
                    Submit a bid
                  </Button>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );

  const bidsTab = (
    <div className="space-y-2">
      <section className={card}>
        <h2 className="text-[19px] font-semibold text-slate-900 tracking-tight">My bids</h2>
        <p className="text-[13px] text-slate-500">
          {pendingCount} waiting on organizers · {winRate}% win rate
        </p>
        <Tabs
          className="mt-3"
          value={bidFilter}
          onChange={setBidFilter}
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'Pending', label: 'Pending' },
            { id: 'Countered', label: 'Countered' },
            { id: 'Won', label: 'Won' },
            { id: 'Lost', label: 'Lost' }
          ]}
        />
      </section>

      {visibleBids.length === 0 && (
        <section className={card}>
          <EmptyState icon={Gavel} title="Nothing here yet" text="Bids you send to organizers will appear here." />
        </section>
      )}

      {visibleBids.map((bid) => {
        const meta = BID_STATUS[bid.status];
        return (
          <article key={bid.id} className={card}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-slate-900 truncate">
                  {bid.qty.toLocaleString()} {bid.item.toLowerCase()}
                </h3>
                <p className="text-[13px] text-slate-500 truncate">
                  {bid.organizer} · sent {bid.sent}
                </p>
              </div>
              <Badge tone={meta.tone} className="shrink-0">{bid.status}</Badge>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="text-[17px] font-semibold text-slate-900">
                {peso(bid.price)}
                <span className="text-[13px] font-medium text-slate-500">/pc</span>
              </span>
              <span className="text-[13px] text-slate-500">
                {peso(bid.price * bid.qty)} total · {bid.days} days
              </span>
            </div>
            <p className="mt-1 text-[13px] text-slate-500">{meta.text}</p>

            {bid.status === 'Countered' && (
              <Panel className="mt-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-slate-500">Counter offer</p>
                  <p className="text-[15px] font-semibold text-slate-900">
                    {peso(bid.counter)}/pc · {peso(bid.counter * bid.qty)}
                  </p>
                </div>
                <Button variant="outline" onClick={() => organizerChat(bid)}>Reply</Button>
                <Button onClick={() => acceptCounter(bid)}>Accept</Button>
              </Panel>
            )}
            {bid.status === 'Won' && (
              <Button variant="secondary" full className="mt-3" icon={Truck} onClick={() => setActiveTab('orders')}>
                View order
              </Button>
            )}
          </article>
        );
      })}
    </div>
  );

  const ordersTab = (
    <div className="space-y-2">
      <section className={card}>
        <h2 className="text-[19px] font-semibold text-slate-900 tracking-tight">Orders in production</h2>
        <p className="text-[13px] text-slate-500">Each step you complete notifies the organizer.</p>
      </section>

      {orders.length === 0 && (
        <section className={card}>
          <EmptyState icon={Package} title="No active orders" text="Won bids move here once the organizer pays the deposit." />
        </section>
      )}

      {orders.map((order) => {
        const finished = order.step >= ORDER_STEPS.length;
        return (
          <article key={order.id} className={card}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] text-slate-500">Order #{order.id.replace('ord-', '')} · {order.organizer}</p>
                <h3 className="text-[15px] font-semibold text-slate-900">{order.item}</h3>
              </div>
              <Badge tone={finished ? 'green' : 'blue'} className="shrink-0">
                {finished ? 'Dispatched' : `Due ${order.deadline}`}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <Meta icon={MapPin}>{order.venue}</Meta>
              <Meta icon={Package}>
                {order.withdrawn
                  ? `${peso(order.payout)} sent to your GCash`
                  : order.received
                    ? `${peso(order.payout)} released to your wallet`
                    : `${peso(order.payout)} payout, held by Aygo until the organizer confirms delivery`}
              </Meta>
            </div>

            <div className="mt-4">
              <OrderStepper step={order.step} />
            </div>

            <div className="mt-4 flex gap-2">
              {order.step === 0 && (
                <Button variant="secondary" icon={Wand2} onClick={() => onOpenMockupStudio?.()}>
                  Proof
                </Button>
              )}
              <Button variant="secondary" icon={MessageSquare} onClick={() => organizerChat(order)} aria-label="Message organizer" />
              {finished ? (
                order.received ? (
                  <Button className="flex-1" disabled={order.withdrawn} icon={order.withdrawn ? Check : undefined} onClick={() => withdraw(order)}>
                    {order.withdrawn ? 'Withdrawn' : `Withdraw ${peso(order.payout)}`}
                  </Button>
                ) : (
                  <Button className="flex-1" disabled>Waiting for delivery confirmation</Button>
                )
              ) : (
                <Button className="flex-1" onClick={() => advanceOrder(order)}>
                  {order.step === ORDER_STEPS.length - 1 ? 'Mark dispatched' : `${ORDER_STEPS[order.step]} done`}
                </Button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );

  const proCard = (
    <section className={card}>
      <div className="flex items-center gap-3">
        <IconCircle icon={Sparkles} tone="blue" size="lg" />
        <div className="min-w-0">
          <h2 className="text-[19px] font-semibold text-slate-900 tracking-tight leading-tight">{PRO_PLANS.maker.name}</h2>
          <p className="text-[13px] text-slate-500">Win more jobs</p>
        </div>
      </div>
      <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3">
        <p className="text-[15px] text-emerald-900">
          <span className="text-[19px] font-semibold">₱{MAKER_PRO_PRICE.firstMonth.toLocaleString('en-PH')}</span> first month
          <span className="ml-2 text-slate-400 line-through">₱{MAKER_PRO_PRICE.monthly.toLocaleString('en-PH')}</span>
        </p>
        <p className="text-[12.5px] text-emerald-800/80">Then ₱{MAKER_PRO_PRICE.monthly.toLocaleString('en-PH')}/month, or ₱{MAKER_PRO_PRICE.yearly.toLocaleString('en-PH')}/year. Cancel anytime.</p>
        <Button className="mt-2.5" full icon={Crown} onClick={() => onOpenPro?.()}>Start Pro</Button>
      </div>
      <div className="mt-2 divide-y divide-slate-100">
        {PRO_PERKS.map((p) => (
          <ListRow key={p.title} icon={p.icon} tone={p.tone} title={p.title} subtitle={p.text} trailing={null} />
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="secondary" icon={Wand2} onClick={() => onOpenMockupStudio?.()}>
          Try mockups
        </Button>
        <Button variant="secondary" icon={FileText} onClick={() => onOpenDocuments?.()}>
          Documents
        </Button>
        <Button className="flex-1" icon={PhoneCall} onClick={() => toast('Thanks! The Aygo team will call you within 1 business day about Pro.')}>
          Talk to Aygo
        </Button>
      </div>
    </section>
  );

  const storeTab = (
    <div className="space-y-2">
      {/* Storefront header */}
      <section className={card}>
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-[19px] font-semibold shrink-0">
            JJT
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[19px] font-semibold text-slate-900 tracking-tight leading-tight">{profile.name}</h2>
              <VerifiedBadge />
            </div>
            <p className="mt-0.5 text-[13px] text-slate-500">{profile.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <Meta icon={Star}>4.9 · {reviews.length + 212} reviews</Meta>
              <Meta icon={MapPin}>{profile.city}</Meta>
              <Meta icon={Clock}>{profile.turnaround}</Meta>
            </div>
          </div>
        </div>
        <p className="mt-3 text-[14px] text-slate-600 leading-relaxed">{profile.bio}</p>
        <Button variant="secondary" full className="mt-3" icon={Pencil} onClick={() => setProfileForm(profile)}>
          Edit storefront
        </Button>
      </section>

      {/* Catalog */}
      <section className={card}>
        <Section title="Catalog" className="py-0" action={<span className="text-[13px] text-slate-500">MOQ from {profile.moq}</span>}>
          <div className="divide-y divide-slate-100">
            {CATALOG.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-3">
                <span className="text-[15px] font-medium text-slate-900">{c.name}</span>
                <span className="text-[13px] text-slate-500">
                  from <span className="font-semibold text-slate-900">{peso(c.from)}</span> · {c.moq} pcs min
                </span>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* Portfolio */}
      <section className={card}>
        <Section
          title="Portfolio"
          className="py-0"
          action={
            <Button size="sm" variant="secondary" icon={Plus} onClick={() => setSampleForm(EMPTY_SAMPLE)}>
              Add
            </Button>
          }
        >
          <div className="-mx-4 sm:-mx-5 px-4 sm:px-5 flex gap-2 overflow-x-auto no-scrollbar snap-x">
            {samples.map((s) => (
              <figure key={s.id} className="snap-start shrink-0 w-[168px]">
                <div className="relative h-[124px] rounded-2xl overflow-hidden bg-[#F4F3F0]">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => {
                      setSamples((prev) => prev.filter((x) => x.id !== s.id));
                      toast('Removed from portfolio');
                    }}
                    aria-label={`Remove ${s.name}`}
                    className="absolute top-1.5 right-1.5 w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:text-red-600 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <figcaption className="mt-2">
                  <p className="text-[14px] font-medium text-slate-900 line-clamp-1">{s.name}</p>
                  <p className="text-[12px] text-slate-500 truncate">
                    {s.event}
                    {s.price ? ` · ${s.price}` : ''}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      </section>

      {/* Reviews */}
      <section className={card}>
        <Section title="Reviews" className="py-0" action={<span className="text-[13px] text-slate-500">4.9 average</span>}>
          <div className="divide-y divide-slate-100">
            {reviews.map((r) => (
              <div key={r.id} className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-slate-900">{r.author}</p>
                    <p className="text-[13px] text-slate-500">{r.event} · {r.date}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-900">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {r.rating}
                  </span>
                </div>
                <p className="mt-1.5 text-[14px] text-slate-700 leading-relaxed">{r.comment}</p>
                {r.reply ? (
                  <div className="mt-2 flex gap-2 rounded-2xl bg-[#F4F3F0] p-3">
                    <CornerDownRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-[13px] text-slate-600">{r.reply}</p>
                  </div>
                ) : replyingTo === r.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      rows={2}
                      autoFocus
                      aria-label="Your reply"
                      placeholder="Thank the organizer or respond to their feedback"
                      value={replyDrafts[r.id] || ''}
                      onChange={(e) => setReplyDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                      <Button variant="secondary" onClick={() => postReply(r.id)}>Post reply</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="mt-1 -ml-3 h-11" onClick={() => setReplyingTo(r.id)}>
                    Reply
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Section>
      </section>

      {proCard}

      {/* Maker network */}
      <section className={card}>
        <Section title="Maker network" className="py-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              className="pl-10"
              placeholder="Search makers or cities"
              aria-label="Search makers"
              value={networkSearch}
              onChange={(e) => setNetworkSearch(e.target.value)}
            />
          </div>
          <div className="mt-1">
            {network.map((s) => (
              <ListRow
                key={s.id}
                icon={Users}
                tone="slate"
                title={s.name}
                subtitle={`${s.city} · ${s.rating} rating`}
                onClick={() => onOpenChatWithCustomer?.(s)}
                trailing={<MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />}
              />
            ))}
            {network.length === 0 && <p className="py-4 text-[13px] text-slate-500">No makers match “{networkSearch}”.</p>}
          </div>
        </Section>
      </section>
    </div>
  );

  const content = { requests: requestsTab, bids: bidsTab, orders: ordersTab, store: storeTab }[activeTab];
  const mapMode = activeTab === 'requests' && view === 'map';

  const menuButton = (
    <button
      type="button"
      onClick={onOpenDrawer}
      aria-label="Open menu"
      title="Open Menu"
      className="relative w-11 h-11 rounded-full bg-white shadow-lg border border-slate-200/90 flex flex-col items-center justify-center gap-1 shrink-0 hover:bg-slate-50 transition-colors active:scale-95"
    >
      <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
      <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
      <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
    </button>
  );

  const viewSwitch = (
    <div role="group" aria-label="Show requests as" className="flex rounded-full bg-white shadow-lg border border-slate-200/90 p-1">
      {[{ id: 'map', label: 'Map', icon: MapPin }, { id: 'board', label: 'Board', icon: LayoutList }].map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={view === id}
          onClick={() => setView(id)}
          className={cx('h-9 px-3 rounded-full inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors', view === id ? 'bg-[#003CF5] text-white' : 'text-slate-700 hover:bg-[#F4F3F0]')}
        >
          <Icon className="w-4 h-4" /> {label}
        </button>
      ))}
    </div>
  );
  const badgeFor = { requests: requests.length, bids: pendingCount, orders: activeOrders };

  /* ------------------------------------------------------------------ */
  /* Layout                                                              */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#F2F1ED] font-sans text-slate-900 selection:bg-[#003CF5] selection:text-white">
      {/* Top bar: menu, and on Requests the Map / Board switch */}
      {!mapMode && (
        <header className="sticky top-0 z-30 bg-[#F2F1ED]/95 backdrop-blur">
          <div className="desk-zoom max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center gap-3">
            {menuButton}
            <h1 className="flex-1 min-w-0 text-[19px] font-semibold text-slate-900 tracking-tight truncate">{TAB_TITLES[activeTab]}</h1>
            {activeTab === 'requests' && viewSwitch}
          </div>
        </header>
      )}

      {mapMode && (
        <SupplierMap
          requests={requests}
          bidByRequest={bidByRequest}
          selectedId={selectedReqId}
          onSelect={(id) => {
            setSelectedReqId(id);
            if (id === incomingId) setIncomingId(null);
          }}
          incomingId={incomingId}
          onDismissIncoming={() => setIncomingId(null)}
          onBid={openBid}
          onAsk={organizerChat}
          workshopName={profile.name}
          topBar={
            <div className="desk-zoom absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-30 flex items-center gap-2 pointer-events-none">
              <span className="pointer-events-auto">{menuButton}</span>
              <nav aria-label="Supplier sections" className="hidden lg:flex ml-[460px] 2xl:ml-[520px] gap-1 rounded-full bg-white/95 shadow-lg border border-slate-200/90 p-1 pointer-events-auto">
                {TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={cx('h-9 px-3.5 rounded-full text-[13px] font-semibold', activeTab === id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-[#F4F3F0]')}
                  >
                    {label}
                  </button>
                ))}
              </nav>
              <span className="flex-1" />
              <span className="pointer-events-auto">{viewSwitch}</span>
            </div>
          }
        />
      )}

      {!mapMode && (
      <div className="desk-zoom max-w-6xl mx-auto lg:px-6 lg:py-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] space-y-2">
            <nav className={cx(card, 'p-2 sm:p-2')} aria-label="Supplier sections">
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'w-full h-12 px-3 rounded-2xl flex items-center gap-3 text-[15px] font-medium transition-colors',
                      active ? 'bg-[#F4F3F0] text-slate-900' : 'text-slate-600 hover:bg-[#F4F3F0]/60'
                    )}
                  >
                    <Icon className={cx('w-5 h-5', active ? 'text-[#003CF5]' : 'text-slate-400')} />
                    <span className="flex-1 text-left">{label}</span>
                    {badgeFor[id] > 0 && <span className="text-[13px] text-slate-500">{badgeFor[id]}</span>}
                  </button>
                );
              })}
            </nav>
            {statsCard}
            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className={cx(card, 'w-full text-left flex items-center gap-3 hover:bg-white/80')}
            >
              <IconCircle icon={Sparkles} tone="blue" />
              <span className="min-w-0">
                <span className="block text-[15px] font-medium text-slate-900">Upgrade to Aygo Pro</span>
                <span className="block text-[13px] text-slate-500">Priority placement and analytics</span>
              </span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="pt-2 pb-28 lg:py-0 max-w-2xl lg:max-w-none w-full mx-auto lg:mx-0">{content}</main>
      </div>
      )}

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Supplier sections"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-100 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  window.scrollTo({ top: 0 });
                }}
                aria-current={active ? 'page' : undefined}
                className={cx('relative h-16 flex flex-col items-center justify-center gap-1 transition-colors', active ? 'text-[#003CF5]' : 'text-slate-500')}
              >
                <Icon className="w-5 h-5" />
                <span className={cx('text-[12px]', active ? 'font-semibold' : 'font-medium')}>{label}</span>
                {badgeFor[id] > 0 && (
                  <span className="absolute top-2 left-1/2 ml-2 min-w-[18px] h-[18px] px-1 rounded-full bg-slate-900 text-white text-[11px] font-semibold flex items-center justify-center">
                    {badgeFor[id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bid sheet */}
      {bidReq && bidForm && (
        <Sheet
          onClose={() => setBidReq(null)}
          title={bidByRequest[bidReq.id] ? 'Update your bid' : 'Submit a bid'}
          subtitle={`${bidReq.qty.toLocaleString()} ${bidReq.item.toLowerCase()} · ${bidReq.organizer}`}
          icon={Gavel}
          footer={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="secondary" size="lg" icon={Boxes} className="sm:flex-1" onClick={sendPackage}>
                Send as package in chat
              </Button>
              <Button type="submit" form="bid-form" size="lg" className="sm:flex-1">
                Send bid · {peso(bidTotal)}
              </Button>
            </div>
          }
        >
          <form id="bid-form" onSubmit={submitBid} className="space-y-4">
            <Panel className="grid grid-cols-3 gap-2 p-3">
              <div>
                <p className="text-[12px] text-slate-500">Budget</p>
                <p className="text-[15px] font-semibold">{peso(bidReq.budget)}</p>
              </div>
              <div>
                <p className="text-[12px] text-slate-500">Needed by</p>
                <p className="text-[15px] font-semibold">{bidReq.deadline}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] text-slate-500">Distance</p>
                <p className="text-[15px] font-semibold">{bidReq.distance}</p>
              </div>
            </Panel>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Price per piece" hint={`Target ${peso(bidReq.budget / bidReq.qty)}/pc`}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-slate-500 pointer-events-none">₱</span>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    required
                    className="pl-8"
                    value={bidForm.price}
                    onChange={(e) => setBidForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
              </Field>
              <Field label="Total" hint={`${bidReq.qty.toLocaleString()} pcs`}>
                <div className="w-full rounded-2xl bg-blue-50 px-4 py-3 text-[15px] font-semibold text-[#003CF5]">{peso(bidTotal)}</div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Production time">
                <Select
                  value={bidForm.days}
                  onChange={(e) => {
                    const days = e.target.value;
                    setBidForm((f) => ({ ...f, days, delivery: addDaysISO(days) }));
                  }}
                >
                  {[2, 3, 4, 5, 6, 7, 10, 14].map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Delivery date" error={bidForm.delivery > bidReq.deadlineISO ? `After the ${bidReq.deadline} deadline` : undefined}>
                <Input
                  type="date"
                  value={bidForm.delivery}
                  onChange={(e) => setBidForm((f) => ({ ...f, delivery: e.target.value }))}
                />
              </Field>
            </div>

            <div>
              <p className="mb-1.5 text-[13px] font-medium text-slate-700">Inclusions</p>
              <div className="flex flex-wrap gap-2">
                {INCLUSIONS.map((label) => {
                  const on = bidForm.inclusions.includes(label);
                  return (
                    <Chip key={label} selected={on} icon={on ? Check : undefined} onClick={() => toggleInclusion(label)} className="h-10">
                      {label}
                    </Chip>
                  );
                })}
              </div>
            </div>

            <Field label="Proposal" hint="Materials, print method and anything that sets your bid apart">
              <Textarea
                rows={3}
                placeholder="e.g. 20mm satin, dye-sublimated both sides, sample ready in 2 days"
                value={bidForm.notes}
                onChange={(e) => setBidForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </Field>

            <ListRow
              icon={Wand2}
              tone="violet"
              title="Attach a mockup"
              subtitle="Bids with a mockup win more often"
              onClick={() => onOpenMockupStudio?.()}
            />
            <Meta icon={CalendarDays}>Organizer usually picks a maker within 24 hours</Meta>
          </form>
        </Sheet>
      )}

      {/* Edit storefront sheet */}
      {profileForm && (
        <Sheet
          onClose={() => setProfileForm(null)}
          title="Edit storefront"
          subtitle="What organizers see on your profile"
          icon={Store}
          size="lg"
          footer={
            <Button type="submit" form="profile-form" full size="lg">
              Save changes
            </Button>
          }
        >
          <form id="profile-form" onSubmit={saveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['name', 'Shop name', 'text', true],
              ['tagline', 'Tagline', 'text'],
              ['contactPerson', 'Contact person', 'text'],
              ['phone', 'Phone', 'tel'],
              ['email', 'Email', 'email', true],
              ['city', 'City', 'text'],
              ['turnaround', 'Usual turnaround', 'text'],
              ['moq', 'Minimum order', 'text']
            ].map(([key, label, type, required]) => (
              <Field key={key} label={label}>
                <Input
                  type={type}
                  required={required}
                  value={profileForm[key]}
                  onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </Field>
            ))}
            <Field label="About your shop" className="sm:col-span-2">
              <Textarea rows={3} value={profileForm.bio} onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))} />
            </Field>
          </form>
        </Sheet>
      )}

      {/* Add portfolio sample sheet */}
      {sampleForm && (
        <Sheet
          onClose={() => setSampleForm(null)}
          title="Add to portfolio"
          subtitle="Photos of real orders help you win bids"
          icon={Camera}
          footer={
            <Button type="submit" form="sample-form" full size="lg">
              Add to portfolio
            </Button>
          }
        >
          <form id="sample-form" onSubmit={saveSample} className="space-y-3">
            <label className="flex h-40 rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] cursor-pointer overflow-hidden items-center justify-center transition-colors">
              {sampleForm.image ? (
                <img src={sampleForm.image} alt="Sample preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-center">
                  <Camera className="w-7 h-7 text-slate-500 mx-auto" />
                  <span className="mt-1 block text-[15px] font-medium text-slate-900">Add a photo</span>
                  <span className="block text-[13px] text-slate-500">PNG or JPG</span>
                </span>
              )}
              <input type="file" accept="image/*" onChange={onSampleImage} className="sr-only" />
            </label>
            <Field label="Product">
              <Input
                required
                placeholder="e.g. 240 GSM acid wash tee"
                value={sampleForm.name}
                onChange={(e) => setSampleForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Event or client">
                <Input placeholder="e.g. BGC Hackathon" value={sampleForm.event} onChange={(e) => setSampleForm((f) => ({ ...f, event: e.target.value }))} />
              </Field>
              <Field label="Price">
                <Input placeholder="e.g. ₱165/pc" value={sampleForm.price} onChange={(e) => setSampleForm((f) => ({ ...f, price: e.target.value }))} />
              </Field>
            </div>
          </form>
        </Sheet>
      )}
    </div>
  );
}
