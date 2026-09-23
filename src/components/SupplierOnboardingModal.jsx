import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Check, 
  Shield, 
  Shirt, 
  Printer, 
  Coffee, 
  ShoppingBag, 
  Truck, 
  Award, 
  ChevronRight,
  Sparkles,
  Building2,
  DollarSign
} from 'lucide-react';

const INCOME_OPTIONS = [
  {
    id: 'apparel',
    title: 'Garment Manufacturer & Apparel Press',
    subtitle: 'Direct supplier for bulk shirts, uniforms, hoodies & sportswear',
    incomeEst: '₱25,000 - ₱180,000 / batch',
    icon: Shirt,
    badge: 'HIGH DEMAND'
  },
  {
    id: 'event-print',
    title: 'Event Print & Lanyards Craft Workshop',
    subtitle: 'Full-color sublimation satin lanyards, PVC event IDs & stickers',
    incomeEst: '₱15,000 - ₱90,000 / event',
    icon: Printer,
    badge: 'FAST TURNAROUND'
  },
  {
    id: 'drinkware',
    title: 'Laser Engraving & Drinkware Studio',
    subtitle: 'Thermal tumblers, mugs, vacuum flasks & VIP gift items',
    incomeEst: '₱20,000 - ₱120,000 / order',
    icon: Coffee,
    badge: 'CORPORATE'
  },
  {
    id: 'bags',
    title: 'Bags, Totes & Packaging Craft Studio',
    subtitle: 'Canvas tote bags, drawstring pouches & custom event kits',
    incomeEst: '₱15,000 - ₱75,000 / batch',
    icon: ShoppingBag,
    badge: 'ECO CRAFT'
  },
  {
    id: 'logistics',
    title: 'Event Logistics & Fast Courier Fleet',
    subtitle: 'Direct workshop-to-venue dispatch (BGC, SMX, World Trade Center)',
    incomeEst: '₱1,000 - ₱5,000 / day',
    icon: Truck,
    badge: 'COURIER'
  },
  {
    id: 'ambassador',
    title: 'Referral Partner & Event Ambassador',
    subtitle: 'Earn cash commissions by referring organizers or workshops',
    incomeEst: '₱500 cash per signup',
    icon: Award,
    badge: 'INSTANT'
  }
];

export default function SupplierOnboardingModal({ 
  isOpen, 
  onClose, 
  onComplete,
  initialCategory = 'apparel'
}) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Selected Income Method
  const [selectedIncomeTrack, setSelectedIncomeTrack] = useState(initialCategory || 'apparel');

  // Step 2: Personal info (matches screenshot 1)
  const [photo, setPhoto] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [extensionName, setExtensionName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Taguig City, Metro Manila');

  // Step 3: Identification & Permits (matches screenshot 3)
  const [docFront, setDocFront] = useState(null);
  const [docBack, setDocBack] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expDate, setExpDate] = useState('');

  // Step 4: Workshop & Business
  const [workshopName, setWorkshopName] = useState('');
  const [address, setAddress] = useState('');
  const [specialty, setSpecialty] = useState('Apparel & Screen Printing');
  const [dailyCapacity, setDailyCapacity] = useState('500 pcs/day');

  // Step 5: Review & Agree
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (onComplete) {
        onComplete({ 
          firstName, 
          surname, 
          workshopName, 
          incomeTrack: selectedIncomeTrack,
          phone: `+63 ${phone.replace(/\D/g, '').slice(0, 10)}`,
          email,
          city 
        });
      }
      alert('Application submitted! Your maker credentials are now under expedited 24h verification.');
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 font-sans">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col min-h-[600px] max-h-[92vh] overflow-hidden">
        
        {/* Top Header matching Screenshots 1 & 3 */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white">
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
          
          <button 
            type="button" 
            onClick={() => alert('Aygo Maker Support: support@aygo.store / Viber: +63 917 555 0101')}
            className="text-sm font-bold text-[#003CF5] hover:underline"
          >
            Help
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scroll">
          
          {/* STEP 1: How do you want to get income with us? */}
          {step === 1 && (
            <div className="space-y-3.5">
              <div>
                <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-tight">
                  How do you want to get income with us?
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Select your primary crafting specialization, manufacturing capability, or service role.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {INCOME_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedIncomeTrack === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setSelectedIncomeTrack(opt.id);
                        if (opt.id === 'apparel') setSpecialty('Apparel & Screen Printing');
                        else if (opt.id === 'event-print') setSpecialty('Event Lanyards & Sublimation');
                        else if (opt.id === 'drinkware') setSpecialty('Laser Engraved Drinkware & Tumblers');
                        else if (opt.id === 'bags') setSpecialty('Canvas Bags & Totes');
                        else if (opt.id === 'logistics') setSpecialty('Event Venue Dispatch Fleet');
                        else if (opt.id === 'ambassador') setSpecialty('Referral Partner');
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isSelected 
                          ? 'border-[#003CF5] bg-blue-50/70 shadow-sm ring-1 ring-blue-300' 
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#003CF5] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-950 leading-tight">
                              {opt.title}
                            </h4>
                            <span className="text-[8px] font-black uppercase tracking-wider text-[#003CF5] bg-blue-100 px-1.5 py-0.2 rounded">
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                            {opt.subtitle}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-black text-emerald-700">
                            <DollarSign className="w-3 h-3 text-emerald-600" />
                            <span>Est: {opt.incomeEst}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                        isSelected ? 'bg-[#003CF5] text-white' : 'border border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Personal Information (Matches Screenshot 1) */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950 tracking-tight">Personal information</h2>
                <p className="text-xs text-slate-500 mt-0.5">Please provide your legal contact name for order settlements.</p>
              </div>

              {/* Personal picture upload */}
              <div>
                <label className="block w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200/80 transition-colors overflow-hidden">
                  {photo ? (
                    <img src={photo} alt="Personal" className="w-full h-full object-cover" />
                  ) : (
                    <Plus className="w-8 h-8 text-slate-800 stroke-[2]" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPhoto(URL.createObjectURL(e.target.files[0]));
                      }
                    }} 
                  />
                </label>
                <span className="block text-xs font-semibold text-slate-600 mt-2">Personal picture</span>
              </div>

              {/* Inputs */}
              <div className="space-y-2.5">
                <input 
                  type="text" 
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <input 
                  type="text" 
                  placeholder="Surname / Last name"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Middle name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                  <input 
                    type="text" 
                    placeholder="Extension (Jr, III)"
                    value={extensionName}
                    onChange={(e) => setExtensionName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>
                
                {/* Phone Number with +63 */}
                <div className="flex rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-200 text-slate-900 font-black text-xs select-none">
                    <span>🇵🇭</span>
                    <span>+63</span>
                  </div>
                  <input 
                    type="tel"
                    placeholder="917 555 0101"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full bg-transparent px-3.5 py-3 text-sm font-black text-slate-900 focus:outline-none font-mono"
                  />
                </div>

                <input 
                  type="email" 
                  placeholder="Email Address (e.g. maker@workshop.ph)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />

                <input 
                  type="text" 
                  placeholder="City / Municipality (e.g. Taytay, Rizal / Taguig BGC)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Credentials & Permits (Matches Screenshot 3) */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Government & Business ID</h2>
              <p className="text-xs text-slate-500">Upload your valid ID (Driver License, UMID, Passport) or DTI/BIR permit.</p>

              {/* Front & Back Upload boxes */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="w-full h-24 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200/80 transition-colors overflow-hidden">
                    {docFront ? (
                      <img src={docFront} alt="ID Front" className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="w-8 h-8 text-slate-800 stroke-[2]" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDocFront(URL.createObjectURL(e.target.files[0]));
                        }
                      }} 
                    />
                  </label>
                  <span className="block text-[11px] font-semibold text-slate-600 mt-2 text-center leading-tight">
                    Valid ID / Permit Front
                  </span>
                </div>

                <div className="flex-1">
                  <label className="w-full h-24 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200/80 transition-colors overflow-hidden">
                    {docBack ? (
                      <img src={docBack} alt="ID Back" className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="w-8 h-8 text-slate-800 stroke-[2]" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDocBack(URL.createObjectURL(e.target.files[0]));
                        }
                      }} 
                    />
                  </label>
                  <span className="block text-[11px] font-semibold text-slate-600 mt-2 text-center leading-tight">
                    Valid ID / BIR Back
                  </span>
                </div>
              </div>

              {/* ID number & expiry */}
              <div className="space-y-2.5 pt-2">
                <input 
                  type="text" 
                  placeholder="ID / Tax Identification Number (TIN)"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <input 
                  type="text" 
                  placeholder="Expiration date (dd/mm/yyyy)"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Workshop Details */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Workshop & Machinery</h2>
              <p className="text-xs text-slate-500">Provide your shop location so organizers around Metro Manila can source from you.</p>

              <div className="space-y-2.5">
                <input 
                  type="text" 
                  placeholder="Workshop Name (e.g. Thread & Co. Studios)"
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <input 
                  type="text" 
                  placeholder="Workshop Address (e.g. Highway 2000, Taytay)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <select 
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                >
                  <option>Apparel & Screen Printing</option>
                  <option>Event Lanyards & Sublimation</option>
                  <option>Canvas Bags & Totes</option>
                  <option>Laser Engraved Drinkware & Tumblers</option>
                  <option>Badges, Wristbands & RFID IDs</option>
                  <option>Event Venue Dispatch Fleet</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Daily Production Capacity (e.g. 500 pcs/day)"
                  value={dailyCapacity}
                  onChange={(e) => setDailyCapacity(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Verification review</h2>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Verified Partner Activation</span>
                </div>
                <p>
                  Once approved, your workshop will be featured on the Aygo Radar and receive real-time bulk RFQs from corporate & event organizers.
                </p>
              </div>

              <div className="p-3.5 bg-slate-100 rounded-2xl space-y-1.5 text-xs text-slate-700">
                <p><strong>Income Stream:</strong> {INCOME_OPTIONS.find(o => o.id === selectedIncomeTrack)?.title || specialty}</p>
                <p><strong>Representative:</strong> {firstName || 'Marvin'} {surname || 'Barrios'}</p>
                <p><strong>Phone & City:</strong> +63 {phone || '917 555 0101'} · {city || 'Metro Manila'}</p>
                <p><strong>Facility:</strong> {workshopName || 'Aygo Craft Workshop'} ({address || 'Taytay / Metro Manila'})</p>
              </div>

              <label className="flex items-start gap-2 pt-2 cursor-pointer text-xs text-slate-700">
                <input 
                  type="checkbox" 
                  checked={agreed} 
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#003CF5]"
                />
                <span>I confirm all provided personal, business, and production details are accurate and agree to Aygo Maker Quality Standards.</span>
              </label>
            </div>
          )}

        </div>

        {/* Bottom Navigation matching Screenshot 1 & 3: "X of 5" Progress Bar & Lime Green Next */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="space-y-1.5 flex-1 pr-4">
            <span className="text-xs font-black text-slate-900">{step} of {totalSteps}</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#C5F76B] h-full transition-all duration-300" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-900 font-bold transition-colors"
                aria-label="Previous step"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={step === totalSteps && !agreed}
              className={`h-12 px-6 rounded-2xl font-black text-sm flex items-center gap-1.5 transition-all shadow-md ${
                step === totalSteps && !agreed
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#C5F76B] hover:bg-[#b5ee50] text-[#1a3300]'
              }`}
            >
              <span>{step === totalSteps ? 'Submit Application' : 'Next'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
