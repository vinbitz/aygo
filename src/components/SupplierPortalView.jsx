import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  Edit3,
  MessageSquare,
  Sliders,
  Check,
  Truck,
  Plus,
  Star,
  Camera,
  Trash2,
  Users,
  MessageCircle,
  CornerDownRight,
  Search,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';

const INITIAL_SAMPLES = [
  {
    id: 'samp-1',
    name: 'BGC Tech Summit Premium Satin Lanyards',
    category: 'Event Print & Lanyards',
    technique: 'Double-sided Sublimation (20mm)',
    event: 'BGC Tech Summit 2026',
    price: '₱46.00/pc',
    turnaround: '4 Days',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'samp-2',
    name: '240 GSM Heavyweight Oversized Cotton Shirts',
    category: 'Apparel & Uniforms',
    technique: 'High-Density Screen + DTF',
    event: 'Manila Hackathon Expo',
    price: '₱165.00/pc',
    turnaround: '5 Days',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'samp-3',
    name: '14oz Natural Canvas Conference Tote Bag',
    category: 'Bags & Totes',
    technique: '2-Color Silkscreen Print',
    event: 'PH Startup Assembly',
    price: '₱72.00/pc',
    turnaround: '5 Days',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'samp-4',
    name: 'SUS304 Matte Black Thermal Tumbler 500ml',
    category: 'Drinkware & Vessels',
    technique: 'Rotary 360° Laser Etch',
    event: 'Fintech Leadership Gala',
    price: '₱340.00/pc',
    turnaround: '3 Days',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Marvin Barrios',
    role: 'Lead Organizer · BGC Tech Summit',
    rating: 5,
    date: 'Sep 18, 2026',
    order: '300 Satin Lanyards + Badges',
    comment: 'Exceptional craft quality and delivered 1 full day ahead of our BGC Arts Center event setup. Sublimation colors matched our Pantone code perfectly!',
    reply: 'Thank you Marvin! It was a pleasure crafting the lanyards for BGC Tech Summit. Looking forward to your next event!'
  },
  {
    id: 'rev-2',
    author: 'Kaye Domingo',
    role: 'DevCon Manila Producer',
    rating: 5,
    date: 'Aug 24, 2026',
    order: '500 Dri-Fit Event Shirts',
    comment: 'Prints stayed vibrant even after multiple test washes. Escrow settlement with Aygo was super smooth and on-time.',
    reply: null
  },
  {
    id: 'rev-3',
    author: 'Carlo Mendoza',
    role: 'Startup PH Founders Forum',
    rating: 4.8,
    date: 'Jul 12, 2026',
    order: '100 Laser Engraved Tumblers',
    comment: 'Crisp rotary laser engraving on the matte black steel bottles. All 100 VIP attendees loved them!',
    reply: null
  }
];

export default function SupplierPortalView({
  onOpenDrawer,
  onSwitchToCustomer,
  onOpenChatWithCustomer,
  onOpenMockupStudio
}) {
  const [activeTab, setActiveTab] = useState('rfqs'); // 'rfqs' | 'orders' | 'profile' | 'samples' | 'reviews' | 'network'
  
  // Current logged in supplier state
  const [supplierProfile, setSupplierProfile] = useState({
    name: 'JJT Digital & Craft Garments',
    tagline: "Taytay & Parañaque's premier automated sublimation & DTF press",
    contactFirstName: 'Joshua',
    contactLastName: 'Tan',
    contactPerson: 'Joshua Tan (Lead Merch Engineer)',
    phone: '9171435890',
    email: 'sales.jtdigital@gmail.com',
    city: 'Parañaque City, Metro Manila',
    address: 'Dr. A. Santos Ave, Sucat, Parañaque City',
    rating: '4.9',
    reviewsCount: 215,
    completedJobs: 215,
    turnaround: '3 - 5 Business Days',
    moq: '30 pcs',
    bio: 'Industrial heat transfer, sublimation, and screen printing facility specializing in high-definition satin lanyards, RFID conference badges, custom apparel, and weatherproof vinyl stickers with 24-48h rush capability.',
    equipment: ['Full-Color Sublimation', 'Computerized Silkscreen', 'DTF Heat Transfer', 'Rotary Laser Etcher', 'Automatic Heat Press', 'Embroidery Barudan 4-Head'],
    verified: true,
    payoutAccount: 'BDO Unibank •••• 8821 (Verified Escrow)'
  });

  // Samples Portfolio State
  const [samplesList, setSamplesList] = useState(INITIAL_SAMPLES);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [newSampleForm, setNewSampleForm] = useState({
    name: '',
    category: 'Apparel & Uniforms',
    technique: 'DTF Full Color',
    event: 'Event Merch Order',
    price: '₱150.00/pc',
    turnaround: '4 Days',
    image: ''
  });

  // Customer Reviews State
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [replyInput, setReplyInput] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  // Customer Requests / RFQ Feed
  const [customerRequests, setCustomerRequests] = useState([
    {
      id: 'req-101',
      title: '300 Customized Satin Lanyards',
      organizer: 'Marvin Barrios (BGC Tech Summit)',
      category: 'Event Print & Lanyards',
      quantity: 300,
      targetBudget: 15000,
      targetUnitPrice: 50.00,
      venue: 'Arthaland Century Pacific Tower, BGC',
      deliveryDate: 'Oct 15, 2026',
      specs: '2cm smooth satin ribbon, 2-sided full color sublimation, heavy-duty trigger snap hook.',
      myBid: { price: 46.00, days: '4 Business Days', status: 'Submitted (Lowest Bid)' },
      bidsCount: 4
    },
    {
      id: 'req-102',
      title: '500 Navy Dri-Fit Marathon Shirts',
      organizer: 'Pinoy Runners Manila',
      category: 'Apparel & Uniforms',
      quantity: 500,
      targetBudget: 85000,
      targetUnitPrice: 170.00,
      venue: 'SMX Convention Center, Pasay City',
      deliveryDate: 'Oct 20, 2026',
      specs: 'Honeycomb athletic dri-fit, 1-color chest silkscreen logo, individual sizing polybags.',
      myBid: null,
      bidsCount: 2
    },
    {
      id: 'req-103',
      title: '100 Laser Engraved Matte Thermal Tumblers',
      organizer: 'Fintech Leadership Forum',
      category: 'Drinkware & Vessels',
      quantity: 100,
      targetBudget: 35000,
      targetUnitPrice: 350.00,
      venue: 'Rockwell Center, Makati City',
      deliveryDate: 'Nov 02, 2026',
      specs: 'SUS304 double wall steel 500ml, rotary laser mark with individual kraft boxes.',
      myBid: null,
      bidsCount: 3
    }
  ]);

  // Active Customer Orders & Milestone Tracking
  const [activeOrders, setActiveOrders] = useState([
    {
      id: 'ord-8812',
      title: '300 Customized Satin Lanyards + PVC IDs',
      customer: 'Marvin (BGC Tech Summit)',
      totalPayout: '₱13,800.00',
      deadline: 'Oct 15, 2026',
      venue: 'Arthaland Century Pacific Tower, BGC',
      currentStep: 3, // 1 to 5
      steps: [
        { label: 'Art Approval', done: true },
        { label: 'Materials Ready', done: true },
        { label: 'Sublimation Print', done: true },
        { label: 'QC & Packaging', done: false },
        { label: 'Dispatched to Venue', done: false }
      ]
    }
  ]);

  // Modal / Bid input state
  const [biddingOnReq, setBiddingOnReq] = useState(null);
  const [bidPriceInput, setBidPriceInput] = useState('');
  const [bidDaysInput, setBidDaysInput] = useState('4');
  const [bidNoteInput, setBidNoteInput] = useState('Includes digital mockup proof, individual polybagging, and free Metro Manila delivery.');
  const [bidSuccessToast, setBidSuccessToast] = useState(false);

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(supplierProfile);
  const [profileSaveToast, setProfileSaveToast] = useState(false);

  // Search filter for Makers Network
  const [networkSearch, setNetworkSearch] = useState('');

  const handleOpenBidModal = (req) => {
    setBiddingOnReq(req);
    setBidPriceInput(req.myBid ? req.myBid.price.toString() : (req.targetUnitPrice * 0.92).toFixed(2));
  };

  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (!biddingOnReq || !bidPriceInput) return;

    const updated = customerRequests.map(r => {
      if (r.id === biddingOnReq.id) {
        return {
          ...r,
          myBid: {
            price: parseFloat(bidPriceInput),
            days: `${bidDaysInput} Business Days`,
            status: 'Active Bid Submitted'
          },
          bidsCount: r.myBid ? r.bidsCount : r.bidsCount + 1
        };
      }
      return r;
    });

    setCustomerRequests(updated);
    setBiddingOnReq(null);
    setBidSuccessToast(true);
    setTimeout(() => setBidSuccessToast(false), 3000);
  };

  const handleAdvanceOrderStep = (orderId) => {
    setActiveOrders(prev => prev.map(ord => {
      if (ord.id === orderId && ord.currentStep < 5) {
        const nextStep = ord.currentStep + 1;
        const newSteps = ord.steps.map((s, idx) => ({
          ...s,
          done: idx < nextStep
        }));
        return { ...ord, currentStep: nextStep, steps: newSteps };
      }
      return ord;
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...profileForm,
      contactPerson: `${profileForm.contactFirstName || ''} ${profileForm.contactLastName || ''}`.trim() || profileForm.contactPerson
    };
    setSupplierProfile(updated);
    setIsEditingProfile(false);
    setProfileSaveToast(true);
    setTimeout(() => setProfileSaveToast(false), 3000);
  };

  const handleAddSample = (e) => {
    e.preventDefault();
    if (!newSampleForm.name.trim()) return;

    const newSample = {
      id: `sample-${Date.now()}`,
      name: newSampleForm.name.trim(),
      category: newSampleForm.category,
      technique: newSampleForm.technique,
      event: newSampleForm.event.trim() || 'Verified Order',
      price: newSampleForm.price.trim() || '₱120.00/pc',
      turnaround: newSampleForm.turnaround || '4 Days',
      image: newSampleForm.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    };

    setSamplesList([newSample, ...samplesList]);
    setIsSampleModalOpen(false);
    setNewSampleForm({
      name: '',
      category: 'Apparel & Uniforms',
      technique: 'DTF Full Color',
      event: 'Event Merch Order',
      price: '₱150.00/pc',
      turnaround: '4 Days',
      image: ''
    });
  };

  const handleDeleteSample = (id) => {
    setSamplesList(samplesList.filter(s => s.id !== id));
  };

  const handleSampleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        setNewSampleForm(prev => ({
          ...prev,
          image: uploadEvt.target?.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostReply = (reviewId) => {
    const text = replyInput[reviewId];
    if (!text || !text.trim()) return;

    setReviewsList(reviewsList.map(r => {
      if (r.id === reviewId) {
        return { ...r, reply: text.trim() };
      }
      return r;
    }));

    setReplyInput(prev => ({ ...prev, [reviewId]: '' }));
    setActiveReplyId(null);
  };

  const formatPhoneDisplay = (p) => {
    const clean = (p || '').replace(/\D/g, '').slice(0, 10);
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col selection:bg-[#003CF5] selection:text-white">
      
      {/* 1. TOP SUPPLIER WORKSPACE HEADER (Minimalist matching customer view with hamburger menu) */}
      <header className="sticky top-0 z-30 bg-slate-950 text-white px-4 sm:px-6 py-3 border-b border-slate-800 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0"
            title="Open Menu"
          >
            <span className="w-4 h-0.5 bg-white rounded-full" />
            <span className="w-4 h-0.5 bg-white rounded-full" />
            <span className="w-4 h-0.5 bg-white rounded-full" />
          </button>
        </div>
      </header>

      {/* 2. TAB NAVIGATION BAR */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 shadow-xs sticky top-[57px] z-20">
        <div className="max-w-6xl mx-auto flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'rfqs', label: 'Live Customer RFQs', count: customerRequests.length, icon: Package },
            { id: 'orders', label: 'Active Orders', count: activeOrders.length, icon: Truck },
            { id: 'profile', label: 'Maker Profile', icon: Sliders },
            { id: 'samples', label: 'Production Samples', count: samplesList.length, icon: Camera },
            { id: 'reviews', label: 'Customer Reviews', count: reviewsList.length, icon: Star },
            { id: 'network', label: 'Suppliers Network', count: SUPPLIERS.length, icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 sm:px-2 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#003CF5] text-[#003CF5]'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-blue-100 text-[#003CF5]' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE BODY */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Toast Alerts */}
        {bidSuccessToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs font-bold">
              <span>Your maker bid has been submitted and dispatched to the event organizer!</span>
            </div>
          </div>
        )}

        {profileSaveToast && (
          <div className="p-4 bg-blue-50 border border-blue-300 rounded-2xl flex items-center gap-3 text-blue-900 shadow-sm animate-fade-in">
            <Check className="w-5 h-5 text-[#003CF5] shrink-0" />
            <div className="text-xs font-bold">
              <span>Supplier profile and crafting credentials updated successfully across the Sourcing Radar!</span>
            </div>
          </div>
        )}

        {/* TAB 1: LIVE CUSTOMER RFQS & BIDDING FEED */}
        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">Live Event Requests for Bidding</h2>
                <p className="text-xs text-slate-500 font-medium">Verified customer requirements ready for direct factory quotes in Metro Manila.</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 w-fit">
                ● {customerRequests.length} Active RFQs
              </span>
            </div>

            <div className="space-y-3">
              {customerRequests.map((req) => (
                <div 
                  key={req.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#003CF5] px-2 py-0.5 rounded-lg border border-blue-200">
                        {req.category}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-950">{req.title}</h3>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{req.specs}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="font-bold text-slate-800">Organizer: {req.organizer}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#003CF5]" />
                        {req.venue}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <Clock className="w-3.5 h-3.5" />
                        Due {req.deliveryDate}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Bidding Box */}
                  <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5 shrink-0 gap-2">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Organizer Target</span>
                      <span className="font-black text-sm text-slate-900">₱{req.targetBudget.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block">₱{req.targetUnitPrice.toFixed(2)}/pc ({req.quantity} pcs)</span>
                    </div>

                    {req.myBid ? (
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 block mb-1">
                          {req.myBid.status} (₱{req.myBid.price.toFixed(2)}/pc)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenBidModal(req)}
                          className="text-xs font-bold text-[#003CF5] hover:underline cursor-pointer"
                        >
                          Modify Bid
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenBidModal(req)}
                        className="px-4 py-2 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
                      >
                        Submit Maker Bid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE PRODUCTION ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-black text-slate-950">Active Orders & Production Stepper</h2>
              <p className="text-xs text-slate-500">Track and advance confirmed orders. Advancing milestones notifies the event organizer in real-time.</p>
            </div>

            {activeOrders.map((ord) => (
              <div key={ord.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#003CF5] tracking-wider">Order #{ord.id}</span>
                    <h3 className="text-base font-extrabold text-slate-950">{ord.title}</h3>
                    <p className="text-xs text-slate-500">Customer: {ord.customer} · Delivery to {ord.venue}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 block">
                      Payout: {ord.totalPayout} (Escrow Secured)
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold mt-1 block">Deadline: {ord.deadline}</span>
                  </div>
                </div>

                {/* 5-Step Milestone Progress Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {ord.steps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = step.done;
                    const isCurrent = ord.currentStep === stepNum;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                            : isCurrent
                            ? 'bg-blue-50 border-[#003CF5] text-[#003CF5] ring-2 ring-blue-300 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="text-[9px] font-black uppercase block tracking-wider">
                          Step {stepNum}
                        </span>
                        <p className="text-xs font-extrabold mt-0.5 leading-tight">{step.label}</p>
                        <span className="text-[9px] font-bold mt-1 inline-block">
                          {isCompleted ? '✓ Done' : isCurrent ? '● Active' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAdvanceOrderStep(ord.id)}
                    disabled={ord.currentStep >= 5}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      ord.currentStep >= 5
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-[#003CF5] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer'
                    }`}
                  >
                    {ord.currentStep >= 5 ? '✓ Order Completed' : `Advance to Step ${ord.currentStep + 1} →`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: VERIFIED MAKER PROFILE & EDIT FORM */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">Verified Supplier Profile & Machine Capabilities</h2>
                <p className="text-xs text-slate-500">Manage your workshop contact details, equipment capabilities, and turnaround commitments.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileForm(supplierProfile);
                  setIsEditingProfile(!isEditingProfile);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">Company / Workshop Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">Tagline & Specialty</label>
                    <input
                      type="text"
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">Contact First Name</label>
                    <input
                      type="text"
                      value={profileForm.contactFirstName || 'Joshua'}
                      onChange={(e) => setProfileForm({ ...profileForm, contactFirstName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">Contact Last Name</label>
                    <input
                      type="text"
                      value={profileForm.contactLastName || 'Tan'}
                      onChange={(e) => setProfileForm({ ...profileForm, contactLastName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">Direct Phone (+63 Philippines)</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-slate-50">
                      <div className="flex items-center gap-1 px-3 py-2 bg-slate-200 text-slate-900 font-black text-xs select-none">
                        <span>🇵🇭</span>
                        <span>+63</span>
                      </div>
                      <input
                        type="tel"
                        value={formatPhoneDisplay(profileForm.phone)}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        placeholder="917 143 5890"
                        className="w-full bg-transparent px-3 py-2 text-xs font-black text-slate-900 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">City / Municipality</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">Standard Turnaround</label>
                    <input
                      type="text"
                      value={profileForm.turnaround}
                      onChange={(e) => setProfileForm({ ...profileForm, turnaround: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">Minimum Order Qty (MOQ)</label>
                    <input
                      type="text"
                      value={profileForm.moq}
                      onChange={(e) => setProfileForm({ ...profileForm, moq: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">Workshop Facility Bio</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#003CF5] text-white text-xs font-bold shadow-md hover:bg-blue-700 cursor-pointer"
                  >
                    Save & Synchronize Profile
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-950">{supplierProfile.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{supplierProfile.tagline}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-2">
                      <span className="flex items-center gap-1 font-bold text-slate-900">
                        <User className="w-3.5 h-3.5 text-[#003CF5]" />
                        {supplierProfile.contactPerson}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        +63 {formatPhoneDisplay(supplierProfile.phone)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        {supplierProfile.email}
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Maker
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Facility Turnaround</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">{supplierProfile.turnaround}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Minimum Order (MOQ)</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">{supplierProfile.moq}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Escrow Payout Account</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-700">{supplierProfile.payoutAccount}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase block mb-2">Registered Machinery & Production Gear:</span>
                  <div className="flex flex-wrap gap-2">
                    {supplierProfile.equipment.map((eq, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#003CF5] text-xs font-bold border border-blue-200">
                        ✓ {eq}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                  {supplierProfile.bio}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PRODUCTION SAMPLES & PORTFOLIO UPLOAD */}
        {activeTab === 'samples' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">Finished Production Samples & Portfolio</h2>
                <p className="text-xs text-slate-500">Upload high-resolution proofs and photos of actual event orders crafted in your workshop.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsSampleModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Upload New Sample</span>
              </button>
            </div>

            {/* Samples Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {samplesList.map((sample) => (
                <div 
                  key={sample.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img 
                      src={sample.image} 
                      alt={sample.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-white">
                      {sample.category}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSample(sample.id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete sample"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-950 line-clamp-2 leading-tight">
                        {sample.name}
                      </h4>
                      <p className="text-[11px] text-[#003CF5] font-bold mt-1">{sample.technique}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Event: {sample.event}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-700">{sample.price}</span>
                      <span className="text-slate-400 text-[10px]">Turnaround: {sample.turnaround}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER REVIEWS & RATINGS (WITH MAKER REPLY) */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">Organizer Reviews & Verified Ratings</h2>
                <p className="text-xs text-slate-500">Real feedback from event producers and corporate organizers across the Philippines.</p>
              </div>

              {/* Rating Summary Pill */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl w-fit">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-black text-sm text-slate-900">4.9 / 5.0</span>
                <span className="text-xs text-slate-500 font-semibold">({reviewsList.length} reviews)</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-950">{rev.author}</h4>
                        <span className="text-[10px] font-bold bg-blue-50 text-[#003CF5] px-2 py-0.5 rounded-full border border-blue-200">
                          {rev.order}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{rev.role} · {rev.date}</p>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                    "{rev.comment}"
                  </p>

                  {/* Maker Reply Box */}
                  {rev.reply ? (
                    <div className="pl-4 border-l-2 border-[#003CF5] py-1 bg-blue-50/50 rounded-r-2xl p-3 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#003CF5] text-[11px]">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Maker Response ({supplierProfile.name}):</span>
                      </div>
                      <p className="text-slate-800 font-medium">{rev.reply}</p>
                    </div>
                  ) : (
                    <div>
                      {activeReplyId === rev.id ? (
                        <div className="pt-2 space-y-2">
                          <textarea
                            rows={2}
                            placeholder="Write a professional reply to the customer..."
                            value={replyInput[rev.id] || ''}
                            onChange={(e) => setReplyInput({ ...replyInput, [rev.id]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveReplyId(null)}
                              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePostReply(rev.id)}
                              className="px-4 py-1.5 rounded-lg bg-[#003CF5] text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
                            >
                              Publish Reply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(rev.id)}
                          className="text-xs font-bold text-[#003CF5] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Reply to Customer</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: VERIFIED SUPPLIERS & MAKERS NETWORK */}
        {activeTab === 'network' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">Verified Makers & Suppliers Directory</h2>
                <p className="text-xs text-slate-500">Explore partner workshops, machine capacities, and collaboration opportunities.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by name or city..."
                  value={networkSearch}
                  onChange={(e) => setNetworkSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUPPLIERS.filter(s => 
                s.name.toLowerCase().includes(networkSearch.toLowerCase()) || 
                s.city.toLowerCase().includes(networkSearch.toLowerCase())
              ).map((sup) => (
                <div key={sup.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 hover:border-blue-300 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-950">{sup.name}</h4>
                          <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                            VERIFIED
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{sup.tagline}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {sup.rating}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">({sup.reviewsCount} orders)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#003CF5]" />
                        {sup.city}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">Turnaround: {sup.avgLeadTime}</span>
                    </div>

                    {sup.services && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {sup.services.slice(0, 3).map((svc, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-[#003CF5] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {svc.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Contact: {sup.contactPerson}</span>
                    <button
                      type="button"
                      onClick={() => onOpenChatWithCustomer && onOpenChatWithCustomer(sup)}
                      className="px-3 py-1.5 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat Partner</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 4. MODAL: UPLOAD NEW SAMPLE PROOF */}
      {isSampleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scroll">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#003CF5] tracking-wider">Portfolio Showcase</span>
                <h3 className="text-base font-extrabold text-slate-950 leading-tight">Upload Finished Production Sample</h3>
              </div>
              <button onClick={() => setIsSampleModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddSample} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Sample Photo</label>
                <label className="w-full h-36 rounded-2xl border-2 border-dashed border-blue-300 hover:border-[#003CF5] bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden">
                  {newSampleForm.image ? (
                    <img src={newSampleForm.image} alt="Sample Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-3">
                      <Camera className="w-8 h-8 text-[#003CF5] mx-auto mb-1" />
                      <span className="font-bold text-slate-800 block">Click to upload sample image</span>
                      <span className="text-[10px] text-slate-500">PNG, JPG up to 25MB</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleSampleImageUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newSampleForm.name}
                  onChange={(e) => setNewSampleForm({ ...newSampleForm, name: e.target.value })}
                  placeholder="e.g. 240 GSM Combed Cotton Acid Wash Tee"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={newSampleForm.category}
                    onChange={(e) => setNewSampleForm({ ...newSampleForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  >
                    <option>Apparel & Uniforms</option>
                    <option>Event Print & Lanyards</option>
                    <option>Bags & Totes</option>
                    <option>Drinkware & Vessels</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Crafting Technique</label>
                  <input
                    type="text"
                    value={newSampleForm.technique}
                    onChange={(e) => setNewSampleForm({ ...newSampleForm, technique: e.target.value })}
                    placeholder="e.g. DTF Full Color"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Event / Client Name</label>
                  <input
                    type="text"
                    value={newSampleForm.event}
                    onChange={(e) => setNewSampleForm({ ...newSampleForm, event: e.target.value })}
                    placeholder="e.g. BGC Hackathon 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Price per Unit</label>
                  <input
                    type="text"
                    value={newSampleForm.price}
                    onChange={(e) => setNewSampleForm({ ...newSampleForm, price: e.target.value })}
                    placeholder="e.g. ₱165.00/pc"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSampleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003CF5] text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Publish to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: SUBMIT MAKER BID */}
      {biddingOnReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#003CF5] tracking-wider">Submit Maker Bid</span>
                <h3 className="text-base font-extrabold text-slate-950 leading-tight">{biddingOnReq.title}</h3>
              </div>
              <button onClick={() => setBiddingOnReq(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Price (PHP / pc)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={bidPriceInput}
                    onChange={(e) => setBidPriceInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Total: ₱{(parseFloat(bidPriceInput || 0) * biddingOnReq.quantity).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Turnaround Days</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={bidDaysInput}
                    onChange={(e) => setBidDaysInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Business days</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Inclusions & Crafting Notes</label>
                <textarea
                  rows={2}
                  value={bidNoteInput}
                  onChange={(e) => setBidNoteInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBiddingOnReq(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003CF5] text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Confirm & Broadcast Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
