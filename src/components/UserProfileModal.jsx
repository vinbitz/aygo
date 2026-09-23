import React, { useState } from 'react';
import {
  ArrowLeft,
  Pencil,
  MapPin,
  Package,
  Shirt,
  Check,
  Settings,
  LogOut,
  Mail,
  Phone,
  UserRound
} from 'lucide-react';
import { toast } from '../lib/toast';
import { Sheet, Button, Field, Input, ListRow, Section, Panel } from './ui';

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

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className="w-9 h-9 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-700 flex items-center justify-center shrink-0 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
}

export default function UserProfileModal({
  isOpen,
  onClose,
  initialView = 'overview', // 'overview' | 'edit'
  userProfile = {},
  onSaveProfile,
  onOpenOnboarding,
  onOpenSettings
}) {
  const [currentView, setCurrentView] = useState(initialView); // 'overview' | 'edit' | 'city_picker'
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Form state
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

    toast('Profile saved');
    setCurrentView('overview');
  };

  const getInitials = () => {
    const f = (firstName || 'M').charAt(0).toUpperCase();
    const l = (lastName || 'B').charAt(0).toUpperCase();
    return `${f}${l}`;
  };

  const openOnboarding = () => {
    onClose();
    if (onOpenOnboarding) onOpenOnboarding();
  };

  const avatar = (sizeClass, textClass) => (
    <span className={`${sizeClass} rounded-full overflow-hidden bg-[#003CF5] text-white flex items-center justify-center font-semibold shrink-0 ${textClass}`}>
      {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : getInitials()}
    </span>
  );

  const formattedPhone = phone ? `+63 ${phone}` : 'Add a phone number';

  /* ---------------------------------------------------------------- */
  /* Edit profile                                                      */
  /* ---------------------------------------------------------------- */
  if (currentView === 'edit') {
    return (
      <Sheet
        onClose={onClose}
        title="Edit profile"
        subtitle="Makers see your name and city on requests"
        headerAction={<BackButton onClick={() => setCurrentView('overview')} />}
        size="sm"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" size="lg" onClick={() => setCurrentView('overview')}>
              Cancel
            </Button>
            <Button type="submit" form="aygo-profile-form" size="lg" full>
              Save changes
            </Button>
          </div>
        }
      >
        <form id="aygo-profile-form" onSubmit={handleSave} className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center pt-1 pb-2">
            <div className="relative">
              {avatar('w-24 h-24', 'text-[24px]')}
              <label
                className="absolute -bottom-1 -right-1 w-11 h-11 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                title="Change photo"
              >
                <Pencil className="w-4 h-4 text-slate-900" />
                <span className="sr-only">Change photo</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <Input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Marvin"
                autoComplete="given-name"
              />
            </Field>
            <Field label="Last name">
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Barrios"
                autoComplete="family-name"
              />
            </Field>
          </div>

          <Field label="Email">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Mobile number" hint="Used for order updates via SMS">
            <div className="flex items-center gap-2">
              <span className="h-[50px] px-3.5 rounded-2xl bg-[#F4F3F0] text-[15px] font-medium text-slate-700 flex items-center shrink-0">
                +63
              </span>
              <Input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="917 555 0149"
                autoComplete="tel-national"
              />
            </div>
          </Field>

          <div>
            <span className="block mb-1.5 text-[13px] font-medium text-slate-700">City</span>
            <button
              type="button"
              onClick={() => setCurrentView('city_picker')}
              className="w-full min-h-[50px] rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] px-4 flex items-center gap-2 text-left transition-colors"
            >
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="flex-1 text-[15px] font-medium text-slate-900 truncate">{city}</span>
              <span className="text-[13px] font-medium text-[#003CF5]">Change</span>
            </button>
          </div>
        </form>
      </Sheet>
    );
  }

  /* ---------------------------------------------------------------- */
  /* City picker                                                       */
  /* ---------------------------------------------------------------- */
  if (currentView === 'city_picker') {
    return (
      <Sheet
        onClose={onClose}
        title="Choose your city"
        subtitle="We'll show makers who deliver there"
        icon={MapPin}
        headerAction={<BackButton onClick={() => setCurrentView('edit')} />}
        size="sm"
      >
        <div className="flex flex-col">
          {POPULAR_CITIES.map((c) => {
            const selected = city === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCity(c);
                  setCurrentView('edit');
                }}
                aria-pressed={selected}
                className={`w-full min-h-[52px] px-4 rounded-2xl flex items-center justify-between text-left text-[15px] font-medium transition-colors ${
                  selected ? 'bg-blue-50 text-[#003CF5]' : 'text-slate-900 hover:bg-[#F4F3F0]'
                }`}
              >
                <span>{c}</span>
                {selected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </Sheet>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Overview                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <Sheet onClose={onClose} title="Your profile" subtitle="Account details and ways to earn" icon={UserRound} size="sm">
      {/* Profile card */}
      <Panel className="flex items-center gap-3.5 rounded-[28px]">
        {avatar('w-16 h-16', 'text-[19px]')}
        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-semibold text-slate-900 truncate">
            {firstName} {lastName}
          </p>
          <p className="text-[13px] text-slate-500 truncate">{city}</p>
        </div>
        <Button variant="outline" icon={Pencil} onClick={() => setCurrentView('edit')}>
          Edit
        </Button>
      </Panel>

      <Section title="Contact">
        <ListRow icon={Mail} tone="slate" title={email} subtitle="Email" />
        <ListRow icon={Phone} tone="slate" title={formattedPhone} subtitle="Mobile number" />
        <ListRow
          icon={MapPin}
          tone="green"
          title={city}
          subtitle="Change your city"
          onClick={() => setCurrentView('city_picker')}
        />
      </Section>

      <Section title="Earn with Aygo">
        <ListRow
          icon={Shirt}
          tone="blue"
          title="Verified supplier & maker"
          subtitle="Custom apparel, garments and bulk merch"
          onClick={openOnboarding}
        />
        <ListRow
          icon={Package}
          tone="amber"
          title="Print & craft workshop"
          subtitle="DTF, sublimation, lanyards, tumblers, swag"
          onClick={openOnboarding}
        />
      </Section>

      {onOpenSettings && (
        <Section title="App">
          <ListRow icon={Settings} tone="slate" title="App settings" subtitle="Appearance, language, privacy" onClick={onOpenSettings} />
        </Section>
      )}

      <div className="pt-2">
        {confirmLogout ? (
          <Panel className="space-y-3">
            <div>
              <p className="text-[15px] font-semibold text-slate-900">Log out of Aygo?</p>
              <p className="text-[13px] text-slate-500">Your requests and chats stay saved to your account.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" full onClick={() => setConfirmLogout(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                full
                icon={LogOut}
                onClick={() => {
                  toast('Logged out of Aygo');
                  setConfirmLogout(false);
                  onClose();
                }}
              >
                Log out
              </Button>
            </div>
          </Panel>
        ) : (
          <Button variant="secondary" full icon={LogOut} onClick={() => setConfirmLogout(true)}>
            Log out
          </Button>
        )}
      </div>
    </Sheet>
  );
}
