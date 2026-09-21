import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Layers, 
  Truck, 
  Calendar, 
  MessageSquare, 
  Award, 
  DollarSign, 
  Send, 
  Video, 
  ExternalLink 
} from 'lucide-react';

export default function SupplierProfileModal({ 
  supplier, 
  onClose, 
  onAcceptBid,
  onOpenChat,
  onOpenSupplierSetup 
}) {
  const [activeTab, setActiveTab] = useState('services');
  const [counterPrice, setCounterPrice] = useState('');
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [callBooked, setCallBooked] = useState(false);

  if (!supplier) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-700 shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Verified Hero Header & Cover */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-800">
          <img
            src={supplier.coverImage}
            alt={supplier.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="flex items-center gap-4">
              <img
                src={supplier.avatar}
                alt={supplier.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white object-cover shadow-lg bg-white"
              />
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">{supplier.name}</h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium">{supplier.tagline}</p>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-lime-400" />
                    {supplier.city}
                  </span>
                  <span>·</span>
                  <span>{supplier.rating} ({supplier.reviewsCount} jobs)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 py-3 px-6 text-center text-xs">
          <div>
            <span className="text-slate-500 block">On-Time Rate</span>
            <span className="font-bold text-slate-900 text-sm">{supplier.onTimeRate}</span>
          </div>
          <div className="border-x border-slate-200">
            <span className="text-slate-500 block">Average Turnaround</span>
            <span className="font-bold text-brand-700 text-sm">{supplier.avgLeadTime}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Location Proximity</span>
            <span className="font-bold text-slate-900 text-sm">{supplier.distanceFromVenue}</span>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-sm font-semibold bg-white">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'services'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Services & Gear
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'location'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Location & Logistics
          </button>
          <button
            onClick={() => setActiveTab('bidding')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'bidding'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Live Bidding & Inclusions
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Storefront Bio
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: Services */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-ink-950 uppercase tracking-wider mb-3">
                  Production Techniques & Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {supplier.services.map((svc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-ink-950">{svc.name}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                          {svc.priceTier}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <p>Minimum Order: {svc.moq} units</p>
                        <p>Turnaround: {svc.turnaround}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink-950 uppercase tracking-wider mb-2">
                  Catalog Blanks in Stock
                </h3>
                <div className="flex flex-wrap gap-2">
                  {supplier.supportedBlanks.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-700 shadow-sm"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-brand-900">Book a Consultation Call</h4>
                  <p className="text-xs text-brand-700">
                    Schedule a 15-min discovery call directly with {supplier.contactPerson} for custom specs.
                  </p>
                </div>
                <button
                  onClick={() => setCallBooked(true)}
                  disabled={callBooked}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{callBooked ? 'Calendar Invite Sent' : 'Book a Call'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Location & Logistics */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-brand-100 text-brand-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ink-950">Workshop & Factory Facility</h4>
                    <p className="text-xs text-slate-600">{supplier.address}</p>
                    <p className="text-xs font-semibold text-brand-700 mt-1">
                      {supplier.distanceFromVenue} (estimated 35-45 minutes transit via express courier)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink-950 uppercase tracking-wider mb-2">
                  Couriers & Dispatch Methods
                </h3>
                <div className="space-y-2">
                  {supplier.dispatchOptions.map((opt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-2.5 text-xs font-semibold text-slate-700"
                    >
                      <Truck className="w-4 h-4 text-brand-600" />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">Operating / Loading Bay Hours:</p>
                <p>{supplier.pickupHours}</p>
                <p className="text-slate-500">Commercial payment terms: {supplier.terms}</p>
              </div>
            </div>
          )}

          {/* TAB 3: Bidding & Inclusions (competitive bidding model) */}
          {activeTab === 'bidding' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-slate-500">
                    Live Aygo Bidding Engine
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Competitive Offer
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs text-slate-500">Submitted Unit Price</p>
                    <p className="text-2xl font-black text-brand-700">PHP 46.00 <span className="text-xs font-normal text-slate-600">/ piece</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total for 300 units</p>
                    <p className="text-lg font-bold text-ink-950">PHP 13,800.00</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <p><strong className="text-slate-900">Committed Delivery:</strong> 4 business days (October 8, 2026)</p>
                  <p><strong className="text-slate-900">Inclusions:</strong> Free digital mockup, safety breakaway clip, individual polybagging, free delivery within Metro Manila.</p>
                  <p><strong className="text-slate-900">Printer Note:</strong> "We have pre-slit 20mm satin ribbons in stock. Once artwork vector is approved, production starts immediately."</p>
                </div>
              </div>

              {/* Counter Offer Section */}
              {showCounterInput ? (
                <div className="p-4 rounded-2xl border border-brand-300 bg-brand-50/50 space-y-3">
                  <label className="block text-xs font-bold text-brand-900 uppercase">
                    Propose Aygo Counter-Offer (PHP per unit)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      placeholder="e.g. 43.00"
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                    <button
                      onClick={() => {
                        alert(`Counter-offer of PHP ${counterPrice}/pc sent directly to ${supplier.name}.`);
                        setShowCounterInput(false);
                      }}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Send Counter-Offer
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    The supplier will be notified on Aygo. You will receive an instant notification if accepted.
                  </p>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => {
                    onAcceptBid(supplier);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Bid & Finalize</span>
                </button>

                <button
                  onClick={() => setShowCounterInput(!showCounterInput)}
                  className="py-3 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all text-center"
                >
                  Propose Counter-Offer
                </button>

                <button
                  onClick={() => {
                    if (onOpenChat) onOpenChat(supplier);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#003CF5] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 border border-blue-200"
                >
                  <MessageSquare className="w-4 h-4 text-[#003CF5]" />
                  <span>Aygo Chat & Negotiate</span>
                </button>
              </div>

              {/* Edit Profile Shortcut for Makers */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Are you the owner of this workshop?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenSupplierSetup) onOpenSupplierSetup(supplier);
                    onClose();
                  }}
                  className="font-bold text-[#003CF5] hover:underline"
                >
                  Edit Maker Profile →
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: About / Storefront Bio */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>{supplier.bio}</p>
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <p><strong className="text-slate-900">Direct Contact:</strong> {supplier.contactPerson}</p>
                <p><strong className="text-slate-900">Phone:</strong> {supplier.phone}</p>
                <p><strong className="text-slate-900">Email:</strong> {supplier.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
