import React, { useState } from 'react';
import { Building2, Save, Check, ArrowLeft, ArrowRight, Store, MapPin, Wrench, Truck } from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';
import { toast } from '../lib/toast';
import { Sheet, Button, Field, Input, Textarea, Select, Chip, Tabs, Panel, cx } from './ui';

const STEPS = [
  { id: 'identity', label: 'Business', icon: Store, tip: 'Organizers trust makers with a clear story, real workshop photos and a named contact.' },
  { id: 'location', label: 'Location', icon: MapPin, tip: 'Your exact location lets Aygo estimate delivery time to venues like BGC or SMX.' },
  { id: 'craft', label: 'Capabilities', icon: Wrench, tip: 'Pick what you can make in-house so matching requests reach you first.' },
  { id: 'logistics', label: 'Delivery', icon: Truck, tip: 'Tell organizers how finished orders get to their venue or office.' }
];

const CAPABILITY_OPTIONS = [
  'DTF Full Color Printing',
  'Silkscreen Oval Press',
  'Computerized Embroidery',
  'Full Sublimation Heat Press',
  'Rotary Laser Engraving',
  'Flatbed UV Print',
  'Industrial Bag Stitching',
  'Custom Neck Tags & Packaging'
];

const DISPATCH_OPTIONS = [
  'Lalamove MPV / Van ready',
  'Grab Express motorcycle dispatch',
  'In-house delivery van (Metro Manila)',
  'Workshop pickup counter',
  'LBC / 2GO Provincial Freight',
  'J&T Express bulk carton dispatch'
];

const AREA_OPTIONS = ['Metro Manila', 'Rizal', 'Cavite', 'Laguna', 'Bulacan', 'Pampanga', 'Cebu', 'Davao', 'Nationwide'];

/** Checkbox-style tile for multi-select lists */
function CheckTile({ checked, onClick, children }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className={cx(
        'w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-colors',
        checked ? 'border-[#003CF5] bg-blue-50/60' : 'border-slate-200 hover:bg-[#F4F3F0]'
      )}
    >
      <span className="text-[14px] font-medium text-slate-900">{children}</span>
      <span
        className={cx(
          'w-5 h-5 rounded-md flex items-center justify-center shrink-0',
          checked ? 'bg-[#003CF5] text-white' : 'border-2 border-slate-300'
        )}
      >
        {checked && <Check className="w-3 h-3" strokeWidth={3} />}
      </span>
    </button>
  );
}

export default function SupplierProfileSetupModal({
  isOpen,
  onClose,
  initialSupplier = null,
  onSaveProfile = null
}) {
  const current = initialSupplier || SUPPLIERS[0]; // default to Thread & Co. or selected

  // Form state
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
  const [facebook, setFacebook] = useState(current.socials?.facebook || '');
  const [instagram, setInstagram] = useState(current.socials?.instagram || '');
  const [terms, setTerms] = useState(current.terms || '50% downpayment, balance upon delivery');
  const [pickupHours, setPickupHours] = useState(current.pickupHours || 'Monday - Saturday: 8:00 AM - 7:00 PM');
  const [dispatchNotes, setDispatchNotes] = useState('Standard production takes 4-6 business days after digital mockup sign-off. Daily dispatch cutoff at 4:00 PM.');
  const [dailyCapacity, setDailyCapacity] = useState(current.dailyCapacity || '');
  const [minOrder, setMinOrder] = useState(
    current.minOrder || (current.services?.length ? Math.min(...current.services.map((s) => s.moq)) : '')
  );
  const [serviceAreas, setServiceAreas] = useState(current.serviceAreas || ['Metro Manila', 'Rizal']);

  // Capabilities
  const [capabilities, setCapabilities] = useState([
    'DTF Full Color Printing',
    'Silkscreen Oval Press',
    'Computerized Embroidery',
    'Custom Neck Tags & Packaging'
  ]);

  // Dispatch methods
  const [dispatchMethods, setDispatchMethods] = useState([
    'Lalamove MPV / Van ready',
    'In-house delivery van (Metro Manila)',
    'Workshop pickup counter',
    'LBC / 2GO Provincial Freight'
  ]);

  const [activeStep, setActiveStep] = useState('identity'); // 'identity' | 'location' | 'craft' | 'logistics'

  if (!isOpen) return null;

  const stepIndex = STEPS.findIndex((s) => s.id === activeStep);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const handleToggleCapability = (cap) => toggle(capabilities, setCapabilities, cap);
  const handleToggleDispatch = (method) => toggle(dispatchMethods, setDispatchMethods, method);

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
      socials: { facebook, instagram },
      terms,
      pickupHours,
      dispatchNotes,
      dailyCapacity,
      minOrder: Number(minOrder) || undefined,
      serviceAreas,
      capabilities,
      dispatchOptions: dispatchMethods,
      supportedBlanks: current.supportedBlanks || ['220 GSM Cotton', 'Interlock Poly-DriFit']
    };

    if (onSaveProfile) onSaveProfile(updated);
    toast(`Profile for "${name}" saved. Organizers see the update right away.`);
    onClose();
  };

  const footer = (
    <div className="flex items-center gap-2">
      {stepIndex > 0 ? (
        <Button
          variant="secondary"
          size="lg"
          icon={ArrowLeft}
          aria-label="Previous step"
          className="w-[52px] px-0"
          onClick={() => setActiveStep(STEPS[stepIndex - 1].id)}
        />
      ) : (
        <Button variant="ghost" size="lg" onClick={onClose}>Cancel</Button>
      )}
      {!isLast && (
        <Button variant="secondary" size="lg" iconRight={ArrowRight} onClick={() => setActiveStep(STEPS[stepIndex + 1].id)} className="ml-auto">
          Next
        </Button>
      )}
      <Button type="submit" form="supplier-profile-setup" size="lg" icon={Save} className={isLast ? 'flex-1' : ''}>
        Save
      </Button>
    </div>
  );

  return (
    <Sheet
      onClose={onClose}
      size="lg"
      icon={Building2}
      title="Edit maker profile"
      subtitle="This is what organizers see on your storefront."
      footer={footer}
    >
      <Tabs
        tabs={STEPS.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.label}` }))}
        value={activeStep}
        onChange={setActiveStep}
      />
      <div className="mt-3 flex gap-1" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span key={s.id} className={cx('h-1 flex-1 rounded-full', i <= stepIndex ? 'bg-[#003CF5]' : 'bg-slate-200')} />
        ))}
      </div>

      <Panel className="mt-4 flex gap-3">
        <step.icon className="w-5 h-5 text-[#003CF5] shrink-0 mt-0.5" />
        <p className="text-[13px] text-slate-600">{step.tip}</p>
      </Panel>

      <form id="supplier-profile-setup" onSubmit={handleSave} className="mt-4 space-y-4">
        {/* Step 1: business identity */}
        {activeStep === 'identity' && (
          <>
            <Field label="Business name">
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Thread & Co. Apparel Solutions" />
            </Field>
            <Field label="Tagline" hint="One line about what you make best.">
              <Input required value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Direct garment manufacturer, DTF and embroidery" />
            </Field>
            <Field label="About your workshop">
              <Textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Machines, daily output, years in business, notable clients" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Contact person">
                <Input required value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Patricia Santos" />
              </Field>
              <Field label="Mobile number">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-slate-500">+63</span>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={phone.replace(/^\+?63\s*/, '')}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(`+63 ${raw}`);
                    }}
                    placeholder="917 555 0101"
                    className="pl-14"
                  />
                </div>
              </Field>
            </div>
            <Field label="Business email">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@workshop.ph" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Facebook page">
                <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="facebook.com/yourshop" />
              </Field>
              <Field label="Instagram">
                <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourshop" />
              </Field>
            </div>
          </>
        )}

        {/* Step 2: location */}
        {activeStep === 'location' && (
          <>
            <Field label="City">
              <Select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="Taytay, Rizal">Taytay, Rizal (garment hub)</option>
                <option value="Marikina City">Marikina City (bags and leathercraft)</option>
                <option value="Parañaque City">Parañaque City (digital print)</option>
                <option value="Valenzuela City">Valenzuela City (laser and hard goods)</option>
                <option value="Quezon City">Quezon City (print and corporate)</option>
                <option value="Mandaluyong City">Mandaluyong / Ortigas</option>
              </Select>
            </Field>
            <Field label="Street address">
              <Input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Highway 2000, Brgy. San Juan, Taytay, Rizal" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Latitude">
                <Input type="number" step="0.0001" value={lat} onChange={(e) => setLat(e.target.value)} />
              </Field>
              <Field label="Longitude">
                <Input type="number" step="0.0001" value={lng} onChange={(e) => setLng(e.target.value)} />
              </Field>
            </div>
            <Field label="Opening hours">
              <Input value={pickupHours} onChange={(e) => setPickupHours(e.target.value)} placeholder="Monday - Saturday: 8:00 AM - 7:00 PM" />
            </Field>
            <div>
              <p className="text-[13px] font-medium text-slate-700 mb-1.5">Areas you serve</p>
              <div className="flex flex-wrap gap-2">
                {AREA_OPTIONS.map((a) => (
                  <Chip
                    key={a}
                    selected={serviceAreas.includes(a)}
                    onClick={() => toggle(serviceAreas, setServiceAreas, a)}
                    className="h-11"
                  >
                    {a}
                  </Chip>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 3: capabilities */}
        {activeStep === 'craft' && (
          <>
            <div>
              <p className="text-[13px] font-medium text-slate-700 mb-1.5">Production methods</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CAPABILITY_OPTIONS.map((cap) => (
                  <CheckTile key={cap} checked={capabilities.includes(cap)} onClick={() => handleToggleCapability(cap)}>
                    {cap}
                  </CheckTile>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Daily capacity">
                <Input value={dailyCapacity} onChange={(e) => setDailyCapacity(e.target.value)} placeholder="3,000 pcs/day" />
              </Field>
              <Field label="Minimum order (pcs)">
                <Input type="number" inputMode="numeric" min="1" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="50" />
              </Field>
              <Field label="Typical lead time">
                <Input value={avgLeadTime} onChange={(e) => setAvgLeadTime(e.target.value)} placeholder="4-6 business days" />
              </Field>
            </div>
            <Field label="Payment terms">
              <Input value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="50% downpayment, balance on delivery · GCash or bank transfer" />
            </Field>
          </>
        )}

        {/* Step 4: delivery */}
        {activeStep === 'logistics' && (
          <>
            <div>
              <p className="text-[13px] font-medium text-slate-700 mb-1.5">Delivery methods</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DISPATCH_OPTIONS.map((method) => (
                  <CheckTile key={method} checked={dispatchMethods.includes(method)} onClick={() => handleToggleDispatch(method)}>
                    {method}
                  </CheckTile>
                ))}
              </div>
            </div>
            <Field label="Delivery notes" hint="Cut-off times, rush options, provincial shipping.">
              <Textarea rows={3} value={dispatchNotes} onChange={(e) => setDispatchNotes(e.target.value)} placeholder="Daily dispatch cut-off at 4:00 PM. Same-day Lalamove for rush Metro Manila orders." />
            </Field>
          </>
        )}
      </form>
    </Sheet>
  );
}
