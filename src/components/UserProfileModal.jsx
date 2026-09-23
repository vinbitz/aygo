import React, { useState } from 'react';
import { 
  ArrowLeft, 
  X, 
  ChevronRight, 
  Pencil, 
  MapPin, 
  Car, 
  Package, 
  Truck, 
  Shirt, 
  LogOut, 
  Check, 
  Camera, 
  Trash2,
  ShieldCheck,
  Building2
} from 'lucide-react';

const POPULAR_CITIES = [
  'Metro Manila',
  'Taguig City (BGC)',
  'Makati City',
  'Quezon City',
  'Pasig City (Ortigas)',
  'Manila City',
  'Parañaque City',
  'Mandaluyong City',
  'Taytay, Rizal',
  'Cebu City',
  'Davao City'
];

export default function UserProfileModal({
  isOpen,
  onClose,
  initialView = 'overview', // 'overview' (Image 1) | 'edit' (Image 3)
  userProfile = {},
  onSaveProfile,
  onOpenOnboarding
}) {
  const [currentView, setCurrentView] = useState(initialView); // 'overview' | 'edit' | 'city_picker'
  
  // Form State
  const [firstName, setFirstName] = useState(userProfile.firstName || 'Marvin');
  const [lastName, setLastName] = useState(userProfile.lastName || 'Barrios');
  const [email, setEmail] = useState(userProfile.email || 'vinbarrios.work@gmail.com');
  
  const cleanPhone = (userProfile.phone || '9175550149')
    .replace(/^\+?63/, '')
    .replace(/\D/g, '')
    .slice(0, 10);
  
  const [phone, setPhone] = useState(cleanPhone);
  const [city, setCity] = useState(userProfile.city || 'Metro Manila');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        setAvatarUrl(uploadEvt.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const updated = {
      ...userProfile,
      firstName: firstName.trim() || 'Marvin',
      lastName: lastName.trim() || 'Barrios',
      email: email.trim() || 'vinbarrios.work@gmail.com',
      phone: phone.trim() || '9175550149',
      formattedPhone: `+63 ${phone}`,
      city: city || 'Metro Manila',
      avatarUrl
    };

    if (onSaveProfile) {
      onSaveProfile(updated);
    }

    setToastMessage('Profile updated successfully!');
    setTimeout(() => {
      setToastMessage('');
      setCurrentView('overview');
    }, 600);
  };

  const getInitials = () => {
    const f = (firstName || 'M').charAt(0).toUpperCase();
    const l = (lastName || 'B').charAt(0).toUpperCase();
    return `${f}${l}`;
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 font-sans">
      <div className="relative w-full max-w-md bg-[#F4F4F4] rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[580px] max-h-[92vh]">
        
        {/* ============================================================ */}
        {/* VIEW 1: PROFILE & INCOME OVERVIEW (MATCHING SCREENSHOT 1) */}
        {/* ============================================================ */}
        {currentView === 'overview' && (
          <div className="flex flex-col h-full flex-1">
            {/* Top Header */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <h2 className="text-xl font-bold text-slate-950 tracking-tight flex-1 text-left pl-3">
                {firstName}
              </h2>

              {/* Top Right Avatar Thumbnail -> opens Profile Settings */}
              <div 
                onClick={() => setCurrentView('edit')}
                className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-xs cursor-pointer hover:scale-105 transition-transform"
                title="Edit profile settings"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#003CF5] text-white flex items-center justify-center font-bold text-xs">
                    {getInitials()}
                  </div>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
              
              {/* Card 1: How do you want to get income with us? */}
              <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
                <h3 className="text-xl font-black text-slate-950 tracking-tight leading-tight">
                  How do you want to get income with us?
                </h3>

                <div className="divide-y divide-slate-100">
                  {/* Verified Supplier & Maker */}
                  <div 
                    onClick={() => {
                      onClose();
                      if (onOpenOnboarding) onOpenOnboarding();
                    }}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-2xl px-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003CF5] shrink-0">
                        <Shirt className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-950 block leading-tight">Verified Supplier & Maker</span>
                        <span className="text-xs text-slate-500 font-medium">Produce custom apparel, garments & bulk merchandise</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </div>

                  {/* Print & Craft Workshop */}
                  <div 
                    onClick={() => {
                      onClose();
                      if (onOpenOnboarding) onOpenOnboarding();
                    }}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-2xl px-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-950 block leading-tight">Print & Craft Workshop</span>
                        <span className="text-xs text-slate-500 font-medium">Fulfill DTF, sublimation, lanyards, tumblers & event swag</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Card 2: City / Location */}
              <div 
                onClick={() => setCurrentView('city_picker')}
                className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div>
                  <h4 className="font-black text-base text-slate-950 leading-tight">{city}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Change the city</p>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4 fill-emerald-600 text-white" />
                </div>
              </div>

              {/* Card 3: Log out button */}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) {
                    alert('Logged out of Aygo session.');
                    onClose();
                  }
                }}
                className="w-full py-4 bg-white hover:bg-slate-100 text-slate-950 rounded-3xl font-black text-sm shadow-xs border border-slate-100 transition-colors cursor-pointer text-center"
              >
                Log out
              </button>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: PROFILE SETTINGS (MATCHING SCREENSHOT 3) */}
        {/* ============================================================ */}
        {currentView === 'edit' && (
          <div className="flex flex-col h-full flex-1">
            {/* Top Header matching Image 3 */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView('overview')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <h2 className="text-lg font-black text-slate-950 tracking-tight flex-1 text-center pr-9">
                Profile settings
              </h2>
            </div>

            {/* Form Content matching Image 3 */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scroll">
              
              {/* Profile Avatar Center with Edit Pencil */}
              <div className="flex justify-center py-2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-300">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#003CF5] text-white flex items-center justify-center font-bold text-2xl">
                        {getInitials()}
                      </div>
                    )}
                  </div>
                  <label 
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                    title="Change profile picture"
                  >
                    <Pencil className="w-4 h-4 text-slate-900" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Inputs matching Image 3 (Light gray rounded cards) */}
              <div className="space-y-2.5">
                {/* Name */}
                <div className="bg-[#EDEDED] rounded-2xl px-4 py-2.5">
                  <label className="block text-[11px] font-medium text-slate-500">Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Marvin"
                    className="w-full bg-transparent font-bold text-sm text-slate-950 focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Last name */}
                <div className="bg-[#EDEDED] rounded-2xl px-4 py-2.5">
                  <label className="block text-[11px] font-medium text-slate-500">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full bg-transparent font-bold text-sm text-slate-950 focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Email */}
                <div className="bg-[#EDEDED] rounded-2xl px-4 py-2.5">
                  <label className="block text-[11px] font-medium text-slate-500">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vinbarrios.work@gmail.com"
                    className="w-full bg-transparent font-bold text-sm text-slate-950 focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* City */}
                <div 
                  onClick={() => setCurrentView('city_picker')}
                  className="bg-[#EDEDED] rounded-2xl px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#e4e4e4] transition-colors"
                >
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500">City</label>
                    <span className="font-bold text-sm text-slate-950 block">{city}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>

                {/* Phone number (63*********49) */}
                <div className="bg-[#EDEDED] rounded-2xl px-4 py-2.5">
                  <label className="block text-[11px] font-medium text-slate-500">Phone number</label>
                  <div className="flex items-center">
                    <span className="font-bold text-sm text-slate-900 mr-1">63</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9175550149"
                      className="w-full bg-transparent font-bold text-sm text-slate-950 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Feedback Toast */}
              {toastMessage && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-bold text-center animate-fade-in">
                  ✓ {toastMessage}
                </div>
              )}

              {/* Bottom Lime Save Button matching Image 3 */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#C5F76B] hover:bg-[#b5ee50] text-[#1a3300] font-black text-base rounded-2xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: CITY PICKER MODAL */}
        {/* ============================================================ */}
        {currentView === 'city_picker' && (
          <div className="flex flex-col h-full flex-1">
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView('edit')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <h2 className="text-lg font-black text-slate-950 tracking-tight flex-1 text-center pr-9">
                Select City
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll">
              {POPULAR_CITIES.map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    setCity(c);
                    setCurrentView('edit');
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    city === c ? 'bg-blue-50 border-[#003CF5] text-[#003CF5] font-black' : 'bg-white border-slate-100 text-slate-800 font-bold hover:bg-slate-50'
                  }`}
                >
                  <span>{c}</span>
                  {city === c && <Check className="w-4 h-4 text-[#003CF5]" />}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
