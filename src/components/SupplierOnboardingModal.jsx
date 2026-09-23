import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Plus,
  Shield
} from 'lucide-react';
import { toast } from '../lib/toast';

export default function SupplierOnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Personal info (matches screenshot 1)
  const [photo, setPhoto] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [extensionName, setExtensionName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dob, setDob] = useState('');

  // Step 2: Identification & Permits (matches screenshot 3)
  const [docFront, setDocFront] = useState(null);
  const [docBack, setDocBack] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expDate, setExpDate] = useState('');

  // Step 3: Workshop & Business
  const [workshopName, setWorkshopName] = useState('');
  const [address, setAddress] = useState('');
  const [specialty, setSpecialty] = useState('Apparel & Screen Printing');

  // Step 4: Review & Agree
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (onComplete) onComplete({ firstName, surname, workshopName });
      toast('Onboarding submitted! Your maker credentials are now under 24h verification review.');
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 font-sans">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col min-h-[580px] max-h-[92vh] overflow-hidden">
        
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
            onClick={() => toast('Aygo Maker Support: support@aygo.store / Viber: +63 917 555 0101')}
            className="text-sm font-bold text-[#003CF5] hover:underline"
          >
            Help
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scroll">
          
          {/* STEP 1: Personal information (Screenshot 1) */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Personal information</h2>

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
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <input 
                  type="text" 
                  placeholder="Surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <input 
                  type="text" 
                  placeholder="Extension Name"
                  value={extensionName}
                  onChange={(e) => setExtensionName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <input 
                  type="text" 
                  placeholder="Middle name (optional)"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
                <input 
                  type="text" 
                  placeholder="Date of birth (dd/mm/yyyy)"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Credentials & Permits (Screenshot 3) */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Government & Business ID</h2>
              <p className="text-xs text-slate-500">Upload your government ID or DTI/BIR permit for verified maker status.</p>

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
                    Valid ID / DTI Front
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
                  placeholder="ID / Tax Identification Number"
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

          {/* STEP 3: Workshop Details */}
          {step === 3 && (
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
                  placeholder="Workshop Address (e.g. Taytay / Marikina)"
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
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Verification review</h2>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Verified Maker Badge Activation</span>
                </div>
                <p>
                  Once submitted, your workshop will be listed in the Aygo Sourcing Radar and can bid directly on bulk event requirements.
                </p>
              </div>

              <div className="p-3 bg-slate-100 rounded-2xl space-y-1 text-xs text-slate-700">
                <p><strong>Applicant:</strong> {firstName || 'Marvin'} {surname || 'Barrios'}</p>
                <p><strong>Workshop:</strong> {workshopName || 'Aygo Maker Partner'}</p>
                <p><strong>Location:</strong> {address || 'Metro Manila'}</p>
              </div>

              <label className="flex items-start gap-2 pt-2 cursor-pointer text-xs text-slate-700">
                <input 
                  type="checkbox" 
                  checked={agreed} 
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#003CF5]"
                />
                <span>I confirm all provided personal and workshop credentials are authentic and comply with Aygo Supplier Guidelines.</span>
              </label>
            </div>
          )}

        </div>

        {/* Bottom Navigation matching Screenshot 1 & 3: "X of 13" Progress Bar & Lime Green Next */}
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
              disabled={step === 4 && !agreed}
              className={`h-12 px-6 rounded-2xl font-black text-sm flex items-center gap-1.5 transition-all shadow-md ${
                step === 4 && !agreed
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#C5F76B] hover:bg-[#b5ee50] text-[#1a3300]'
              }`}
            >
              <span>{step === totalSteps ? 'Submit' : 'Next'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
