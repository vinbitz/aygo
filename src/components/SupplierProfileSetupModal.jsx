import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Clock, 
  Truck, 
  Layers, 
  ShieldCheck, 
  Save, 
  Upload, 
  Check, 
  Phone, 
  Mail, 
  User, 
  Camera, 
  Calendar,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';

export default function SupplierProfileSetupModal({ 
  isOpen, 
  onClose, 
  initialSupplier = null, 
  onSaveProfile = null 
}) {
  const current = initialSupplier || SUPPLIERS[0]; // default to Thread & Co. or selected

  // Form State
  const [name, setName] = useState(current.name || 'Thread & Co. Apparel Solutions');
  const [tagline, setTagline] = useState(current.tagline || 'Direct garment manufacturer & DTF silkscreen press');
  const [bio, setBio] = useState(current.bio || '');
  const [city, setCity] = useState(current.city || 'Taytay, Rizal');
  const [address, setAddress] = useState(current.address || 'Highway 2000, Brgy. San Juan, Taytay, Rizal');
  const [lat, setLat] = useState(current.lat || 14.568);
  const [lng, setLng] = useState(current.lng || 121.132);
  const [avgLeadTime, setAvgLeadTime] = useState(current.avgLeadTime || '4-6 business days');
  const [contactPerson, setContactPerson] = useState(current.contactPerson || 'Patricia Santos');
  const [phone, setPhone] = useState(current.phone || '+63 917 555 0101');
  const [email, setEmail] = useState(current.email || 'patricia@threadco.example');
  const [terms, setTerms] = useState(current.terms || '50% downpayment, balance upon delivery');
  const [pickupHours, setPickupHours] = useState(current.pickupHours || 'Monday - Saturday: 8:00 AM - 7:00 PM');
  const [dispatchNotes, setDispatchNotes] = useState('Standard production takes 4-6 business days after digital mockup sign-off. Daily dispatch cutoff at 4:00 PM.');

  // Crafting Capabilities Checkboxes
  const [capabilities, setCapabilities] = useState([
    'DTF Full Color Printing',
    'Silkscreen Oval Press',
    'Computerized Embroidery',
    'Custom Neck Tags & Packaging'
  ]);

  // Dispatch Methods
  const [dispatchMethods, setDispatchMethods] = useState([
    'Lalamove MPV / Van ready',
    'In-house delivery van (Metro Manila)',
    'Workshop pickup counter',
    'LBC / 2GO Provincial Freight'
  ]);

  const [activeStep, setActiveStep] = useState('identity'); // 'identity' | 'location' | 'craft' | 'logistics'

  if (!isOpen) return null;

  const handleToggleCapability = (cap) => {
    if (capabilities.includes(cap)) {
      setCapabilities(capabilities.filter(c => c !== cap));
    } else {
      setCapabilities([...capabilities, cap]);
    }
  };

  const handleToggleDispatch = (method) => {
    if (dispatchMethods.includes(method)) {
      setDispatchMethods(dispatchMethods.filter(m => m !== method));
    } else {
      setDispatchMethods([...dispatchMethods, method]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...current,
      name,
      tagline,
      bio,
      city,
      address,
      lat: Number(lat),
      lng: Number(lng),
      avgLeadTime,
      contactPerson,
      phone,
      email,
      terms,
      pickupHours,
      dispatchNotes,
      dispatchOptions: dispatchMethods,
      supportedBlanks: current.supportedBlanks || ['220 GSM Cotton', 'Interlock Poly-DriFit']
    };

    if (onSaveProfile) onSaveProfile(updated);
    alert(`Supplier profile for "${name}" successfully updated and synchronized across the Sourcing Radar!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-2 sm:p-4 md:p-6 font-sans">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#003CF5] text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-950">Setup Supplier / Maker Profile</h3>
                <span className="text-[10px] font-bold bg-blue-100 text-[#003CF5] px-2 py-0.5 rounded">
                  Verified Maker
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Configure your workshop branding, machinery specifications, and dispatch delivery options.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP TABS */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setActiveStep('identity')}
            className={`py-3 transition-colors border-b-2 ${
              activeStep === 'identity'
                ? 'border-[#003CF5] text-[#003CF5] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Workshop Identity
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('location')}
            className={`py-3 transition-colors border-b-2 ${
              activeStep === 'location'
                ? 'border-[#003CF5] text-[#003CF5] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            2. The Place (Map Hub)
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('craft')}
            className={`py-3 transition-colors border-b-2 ${
              activeStep === 'craft'
                ? 'border-[#003CF5] text-[#003CF5] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            3. Capabilities & Gear
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('logistics')}
            className={`py-3 transition-colors border-b-2 ${
              activeStep === 'logistics'
                ? 'border-[#003CF5] text-[#003CF5] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            4. Logistics & Dispatch
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scroll text-slate-800">
          
          {/* STEP 1: WORKSHOP IDENTITY */}
          {activeStep === 'identity' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-slate-700">
                <strong>Maker Profile Tip:</strong> Event organizers in the Philippines trust makers with clear facility details, actual workshop machinery, and verified owner contact.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop / Business Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Thread & Co. Apparel Solutions"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tagline & Specialty
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Direct garment manufacturer, DTF silkscreen, and embroidery"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop Story & Equipment Overview
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your machinery, daily production capacity, and background..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Direct Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Patricia Santos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Direct Phone / Viber / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +63 917 555 0101"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contact@workshop.ph"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: THE PLACE / MAP LOCATION */}
          {activeStep === 'location' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-slate-700">
                <strong>Sourcing Radar Location:</strong> Setting precise coordinates allows the Aygo Radar to accurately calculate delivery transit time to event venues like Arthaland Tower, BGC or SMX.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Maker Hub / City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  >
                    <option value="Taytay, Rizal">Taytay, Rizal (Garment Hub)</option>
                    <option value="Marikina City">Marikina City (Bag & Leathercraft Hub)</option>
                    <option value="Parañaque City">Parañaque City (Digital Print Hub)</option>
                    <option value="Valenzuela City">Valenzuela City (Laser & Hard Goods)</option>
                    <option value="Quezon City">Quezon City (Print & Corporate Hub)</option>
                    <option value="Mandaluyong City">Mandaluyong / Ortigas (Central Hub)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Average Lead Time
                  </label>
                  <input
                    type="text"
                    value={avgLeadTime}
                    onChange={(e) => setAvgLeadTime(e.target.value)}
                    placeholder="e.g. 4-6 business days"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Workshop / Factory Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Highway 2000, Brgy. San Juan, Taytay, Rizal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    GPS Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    GPS Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop Operating & Dispatch Hours
                </label>
                <input
                  type="text"
                  value={pickupHours}
                  onChange={(e) => setPickupHours(e.target.value)}
                  placeholder="e.g. Monday - Saturday: 8:00 AM - 7:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: CAPABILITIES & GEAR */}
          {activeStep === 'craft' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-slate-700">
                <strong>Equipment Badges:</strong> Select the production technologies available directly inside your workshop so organizers matching your craft can find your listing.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Production Techniques & Capabilities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
                  {[
                    'DTF Full Color Printing',
                    'Silkscreen Oval Press',
                    'Computerized Embroidery',
                    'Full Sublimation Heat Press',
                    'Rotary Laser Engraving',
                    'Flatbed UV Print',
                    'Industrial Bag Stitching',
                    'Custom Neck Tags & Packaging'
                  ].map((cap) => {
                    const isChecked = capabilities.includes(cap);
                    return (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => handleToggleCapability(cap)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isChecked
                            ? 'border-[#003CF5] bg-blue-50 text-[#003CF5]'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate pr-1">{cap}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                          isChecked ? 'bg-[#003CF5] text-white' : 'border border-slate-300'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Standard Commercial & Payment Terms
                </label>
                <input
                  type="text"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="e.g. 50% downpayment, balance upon delivery / Bank Transfer or GCash"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: LOGISTICS & DISPATCH */}
          {activeStep === 'logistics' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-slate-700">
                <strong>Dispatch & Fulfillment:</strong> Specify supported delivery channels for sending finished orders directly to client venues or office hubs.
              </div>

              {/* Supported Couriers */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Supported Dispatch & Delivery Methods
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {[
                    'Lalamove MPV / Van ready',
                    'Grab Express motorcycle dispatch',
                    'In-house delivery van (Metro Manila)',
                    'Workshop pickup counter',
                    'LBC / 2GO Provincial Freight',
                    'J&T Express bulk carton dispatch'
                  ].map((method) => {
                    const isChecked = dispatchMethods.includes(method);
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => handleToggleDispatch(method)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isChecked
                            ? 'border-[#003CF5] bg-blue-50 text-[#003CF5]'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate pr-1">{method}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                          isChecked ? 'bg-[#003CF5] text-white' : 'border border-slate-300'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dispatch & Production Lead Time Notes
                </label>
                <textarea
                  rows={2}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="e.g. Daily dispatch cutoff at 4:00 PM. Same-day Lalamove MPV available for rush Manila deliverables."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>
          )}

          {/* MODAL FOOTER */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <div className="flex gap-2">
              {activeStep !== 'logistics' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === 'identity') setActiveStep('location');
                    else if (activeStep === 'location') setActiveStep('craft');
                    else if (activeStep === 'craft') setActiveStep('logistics');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  Next Step →
                </button>
              ) : null}

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Maker Profile</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
