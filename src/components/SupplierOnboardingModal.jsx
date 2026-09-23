import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  ShieldCheck,
  Shirt,
  Printer,
  Coffee,
  ShoppingBag,
  Truck,
  Award,
  Store,
  FileCheck2,
  UserRound,
  Factory,
  Crown,
  ClipboardCheck,
  Camera,
  LifeBuoy,
  FileText,
  Phone,
  Gift
} from 'lucide-react';
import { toast } from '../lib/toast';
import { Sheet, Button, Field, Input, Select, Badge, IconCircle, Panel, cx } from './ui';
import { MAKER_PERKS, MAKER_PRO_PRICE, MAKER_PRO_PERKS, PRO_PLANS } from '../lib/pro';

const PERK_ICONS = { documents: FileText, calls: Phone };

/** Included for every registered maker, on the Free plan too */
function MakerPerksNote() {
  return (
    <div className="rounded-[22px] bg-gradient-to-br from-blue-50 to-violet-50 p-4">
      <p className="flex items-center gap-2 text-[15px] font-semibold text-slate-900">
        <Gift className="w-4 h-4 text-[#003CF5]" /> Included for every registered maker
      </p>
      <ul className="mt-3 space-y-3">
        {MAKER_PERKS.map((perk) => {
          const Icon = PERK_ICONS[perk.id] || Check;
          return (
            <li key={perk.id} className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-white text-[#003CF5] flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
              <span>
                <span className="block text-[14px] font-medium text-slate-900">{perk.title}</span>
                <span className="block text-[13px] text-slate-600 leading-snug">{perk.text}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[12px] text-slate-500">Free plan included. These turn on once you submit your application.</p>
    </div>
  );
}

const INCOME_OPTIONS = [
  {
    id: 'apparel',
    title: 'Apparel and uniforms',
    subtitle: 'Bulk shirts, uniforms, hoodies and sportswear',
    incomeEst: '₱25,000 – ₱180,000 per batch',
    icon: Shirt,
    tone: 'blue',
    badge: 'High demand',
    specialty: 'Apparel & Screen Printing'
  },
  {
    id: 'event-print',
    title: 'Event print and lanyards',
    subtitle: 'Sublimation lanyards, PVC IDs, stickers and banners',
    incomeEst: '₱15,000 – ₱90,000 per event',
    icon: Printer,
    tone: 'amber',
    badge: 'Fast turnaround',
    specialty: 'Event Lanyards & Sublimation'
  },
  {
    id: 'drinkware',
    title: 'Drinkware and engraving',
    subtitle: 'Tumblers, mugs, flasks and VIP gift items',
    incomeEst: '₱20,000 – ₱120,000 per order',
    icon: Coffee,
    tone: 'green',
    badge: 'Corporate',
    specialty: 'Laser Engraved Drinkware & Tumblers'
  },
  {
    id: 'bags',
    title: 'Bags and packaging',
    subtitle: 'Canvas totes, drawstring pouches and event kits',
    incomeEst: '₱15,000 – ₱75,000 per batch',
    icon: ShoppingBag,
    tone: 'rose',
    badge: 'Eco craft',
    specialty: 'Canvas Bags & Totes'
  },
  {
    id: 'logistics',
    title: 'Event logistics',
    subtitle: 'Workshop-to-venue dispatch (BGC, SMX, WTC)',
    incomeEst: '₱1,000 – ₱5,000 per day',
    icon: Truck,
    tone: 'violet',
    badge: 'Courier',
    specialty: 'Event Venue Dispatch Fleet'
  },
  {
    id: 'ambassador',
    title: 'Referral partner',
    subtitle: 'Earn commissions by referring organizers or makers',
    incomeEst: '₱500 per sign-up',
    icon: Award,
    tone: 'slate',
    badge: 'Instant',
    specialty: 'Referral Partner'
  }
];

const STEPS = [
  { title: 'What do you make?', subtitle: 'Pick your main line. You can add more later.', icon: Store },
  { title: 'About you', subtitle: 'The contact organizers will talk to.', icon: UserRound },
  { title: 'Your business', subtitle: 'Where you work and how much you can make.', icon: Factory },
  { title: 'Verification documents', subtitle: 'Verified makers get a badge and more orders.', icon: FileCheck2 },
  { title: 'Choose a plan', subtitle: 'Start free. Upgrade any time.', icon: Crown },
  { title: 'Review and submit', subtitle: 'We check documents within 24 hours.', icon: ClipboardCheck }
];

const BUSINESS_DOCS = [
  { id: 'dti', label: 'DTI or SEC registration', hint: 'Certificate of business name or SEC registration' },
  { id: 'bir', label: 'BIR certificate (Form 2303)', hint: 'Certificate of registration' },
  { id: 'permit', label: "Mayor's or business permit", hint: 'Current year' }
];

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₱0',
    period: 'forever',
    perks: ['Up to 5 product listings', 'Bid on open requests', 'Chat with organizers']
  },
  {
    id: 'pro',
    name: PRO_PLANS.maker.name,
    price: `₱${MAKER_PRO_PRICE.firstMonth.toLocaleString('en-PH')}`,
    regular: `₱${MAKER_PRO_PRICE.monthly.toLocaleString('en-PH')}`,
    period: 'first month',
    terms: `Then ₱${MAKER_PRO_PRICE.monthly.toLocaleString('en-PH')}/month after your first month. Cancel anytime.`,
    perks: MAKER_PRO_PERKS.map((p) => p.title),
    note: 'Sponsoring events as a brand? Sponsorship Connect Pro is a separate plan with sponsor matching, sponsorship documents and reach reports.'
  }
];

/** Tap-to-upload tile for images or PDFs */
function UploadTile({ label, hint, file, onFile, tall = false }) {
  return (
    <label
      className={cx(
        'flex items-center gap-3 rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] px-4 cursor-pointer transition-colors',
        tall ? 'flex-col justify-center text-center py-5' : 'py-3 min-h-[64px]'
      )}
    >
      {file?.url && file.isImage ? (
        <img src={file.url} alt={label} className={cx('rounded-xl object-cover bg-white shrink-0', tall ? 'w-full h-20' : 'w-10 h-10')} />
      ) : (
        <span
          className={cx(
            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
            file ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-700'
          )}
        >
          {file ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      )}
      <span className={cx('min-w-0', !tall && 'flex-1')}>
        <span className="block text-[15px] font-medium text-slate-900">{label}</span>
        <span className="block text-[13px] text-slate-500 truncate">{file ? file.name : hint}</span>
      </span>
      <input
        type="file"
        accept="image/*,application/pdf"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files && e.target.files[0];
          if (f) onFile({ name: f.name, url: URL.createObjectURL(f), isImage: f.type.startsWith('image/') });
        }}
      />
    </label>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-200/70 last:border-0">
      <span className="text-[13px] text-slate-500 shrink-0">{label}</span>
      <span className="text-[14px] font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function SupplierOnboardingModal({
  isOpen,
  onClose,
  onComplete,
  onCompleteOnboarding,
  initialCategory = 'apparel'
}) {
  const [step, setStep] = useState(1);
  const totalSteps = STEPS.length;

  // Step 1: main line
  const [selectedIncomeTrack, setSelectedIncomeTrack] = useState(initialCategory || 'apparel');

  // Step 2: personal info
  const [photo, setPhoto] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [extensionName, setExtensionName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Taguig City, Metro Manila');

  // Step 4: verification documents
  const [docFront, setDocFront] = useState(null);
  const [docBack, setDocBack] = useState(null);
  const [businessDocs, setBusinessDocs] = useState({});
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expDate, setExpDate] = useState('');

  // Step 3: business
  const [workshopName, setWorkshopName] = useState('');
  const [address, setAddress] = useState('');
  const [specialty, setSpecialty] = useState('Apparel & Screen Printing');
  const [dailyCapacity, setDailyCapacity] = useState('500 pcs/day');
  const [minOrder, setMinOrder] = useState('50');
  const [leadTime, setLeadTime] = useState('5-7 business days');

  // Step 5: plan
  const [plan, setPlan] = useState('free');

  // Step 6: review
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const current = STEPS[step - 1];
  const track = INCOME_OPTIONS.find((o) => o.id === selectedIncomeTrack);
  const docsUploaded = BUSINESS_DOCS.filter((d) => businessDocs[d.id]).length + (docFront ? 1 : 0);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }
    const payload = {
      firstName,
      surname,
      middleName,
      extensionName,
      dob,
      workshopName,
      incomeTrack: selectedIncomeTrack,
      specialty,
      dailyCapacity,
      minOrder: Number(minOrder) || null,
      avgLeadTime: leadTime,
      plan,
      documents: Object.keys(businessDocs),
      phone: `+63 ${phone.replace(/\D/g, '').slice(0, 10)}`,
      email,
      city,
      address
    };
    if (onComplete) onComplete(payload);
    if (onCompleteOnboarding) {
      onCompleteOnboarding(payload);
    } else {
      toast('Application submitted. We will verify your documents within 24 hours.');
    }
    onClose();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const footer = (
    <div className="flex items-center gap-2">
      {step > 1 && (
        <Button variant="secondary" size="lg" icon={ArrowLeft} onClick={handleBack} aria-label="Previous step" className="w-[52px] px-0" />
      )}
      <Button
        size="lg"
        full
        iconRight={step === totalSteps ? undefined : ArrowRight}
        icon={step === totalSteps ? ShieldCheck : undefined}
        onClick={handleNext}
        disabled={step === totalSteps && !agreed}
      >
        {step === totalSteps ? 'Submit application' : step === 5 ? `Continue with ${plan === 'pro' ? 'Pro' : 'Free'}` : 'Continue'}
      </Button>
    </div>
  );

  return (
    <Sheet
      onClose={onClose}
      size="sm"
      icon={current.icon}
      title={current.title}
      subtitle={current.subtitle}
      footer={footer}
      headerAction={
        <button
          type="button"
          onClick={() => toast('Aygo maker support: support@aygo.store · Viber +63 917 555 0101')}
          aria-label="Help"
          className="w-9 h-9 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-700 flex items-center justify-center shrink-0 transition-colors"
        >
          <LifeBuoy className="w-4 h-4" />
        </button>
      }
    >
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[13px] mb-1.5">
          <span className="font-medium text-slate-900">Step {step} of {totalSteps}</span>
          <span className="text-slate-500">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="flex gap-1" role="progressbar" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={step}>
          {STEPS.map((s, i) => (
            <span
              key={s.title}
              className={cx('h-1.5 flex-1 rounded-full transition-colors', i < step ? 'bg-[#003CF5]' : 'bg-slate-200')}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: main line */}
      {step === 1 && (
        <div className="space-y-2" role="radiogroup" aria-label="Main line">
          {INCOME_OPTIONS.map((opt) => {
            const isSelected = selectedIncomeTrack === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  setSelectedIncomeTrack(opt.id);
                  setSpecialty(opt.specialty);
                }}
                className={cx(
                  'w-full p-3.5 rounded-2xl border text-left transition-colors flex items-start gap-3',
                  isSelected ? 'border-[#003CF5] bg-blue-50/60' : 'border-slate-200 hover:bg-[#F4F3F0]'
                )}
              >
                <IconCircle icon={opt.icon} tone={opt.tone} />
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[15px] font-medium text-slate-900">{opt.title}</span>
                    <Badge tone="slate">{opt.badge}</Badge>
                  </span>
                  <span className="block text-[13px] text-slate-500 mt-0.5">{opt.subtitle}</span>
                  <span className="block text-[13px] font-medium text-emerald-700 mt-1">Typical: {opt.incomeEst}</span>
                </span>
                <span
                  className={cx(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-2.5',
                    isSelected ? 'bg-[#003CF5] text-white' : 'border-2 border-slate-300'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* STEP 2: about you */}
      {step === 2 && (
        <div className="space-y-4">
          <label className="flex items-center gap-4 cursor-pointer">
            <span className="w-20 h-20 rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] overflow-hidden flex items-center justify-center shrink-0 transition-colors">
              {photo ? (
                <img src={photo} alt="Your profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6 text-slate-500" />
              )}
            </span>
            <span>
              <span className="block text-[15px] font-medium text-slate-900">{photo ? 'Change photo' : 'Add a profile photo'}</span>
              <span className="block text-[13px] text-slate-500">A clear face photo builds trust</span>
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setPhoto(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Juan" autoComplete="given-name" />
            </Field>
            <Field label="Last name">
              <Input value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Dela Cruz" autoComplete="family-name" />
            </Field>
            <Field label="Middle name">
              <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="Suffix">
              <Input value={extensionName} onChange={(e) => setExtensionName(e.target.value)} placeholder="Jr., III" />
            </Field>
          </div>
          <Field label="Date of birth">
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </Field>
          <Field label="Mobile number">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-slate-500">+63</span>
              <Input
                type="tel"
                inputMode="numeric"
                placeholder="917 555 0101"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-14"
                autoComplete="tel-national"
              />
            </div>
          </Field>
          <Field label="Email">
            <Input type="email" placeholder="maker@workshop.ph" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label="City or municipality">
            <Input placeholder="Taytay, Rizal" value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
        </div>
      )}

      {/* STEP 3: business */}
      {step === 3 && (
        <div className="space-y-4">
          <Field label="Business name">
            <Input value={workshopName} onChange={(e) => setWorkshopName(e.target.value)} placeholder="Thread & Co. Studios" />
          </Field>
          <Field label="Workshop address" hint="Used to estimate delivery time to event venues.">
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Highway 2000, Brgy. San Juan, Taytay" />
          </Field>
          <Field label="Specialty">
            <Select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              <option>Apparel & Screen Printing</option>
              <option>Event Lanyards & Sublimation</option>
              <option>Canvas Bags & Totes</option>
              <option>Laser Engraved Drinkware & Tumblers</option>
              <option>Badges, Wristbands & RFID IDs</option>
              <option>Event Venue Dispatch Fleet</option>
              <option>Referral Partner</option>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Daily capacity">
              <Input value={dailyCapacity} onChange={(e) => setDailyCapacity(e.target.value)} placeholder="500 pcs/day" />
            </Field>
            <Field label="Minimum order (pcs)">
              <Input type="number" inputMode="numeric" min="1" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="50" />
            </Field>
          </div>
          <Field label="Typical lead time">
            <Input value={leadTime} onChange={(e) => setLeadTime(e.target.value)} placeholder="5-7 business days" />
          </Field>
        </div>
      )}

      {/* STEP 4: verification documents */}
      {step === 4 && (
        <div className="space-y-4">
          <Panel className="flex gap-3 bg-blue-50/70">
            <ShieldCheck className="w-5 h-5 text-[#003CF5] shrink-0 mt-0.5" />
            <p className="text-[13px] text-slate-700">
              Files are only seen by the Aygo review team. Photos or PDFs are fine.
            </p>
          </Panel>

          <div className="space-y-2">
            {BUSINESS_DOCS.map((d) => (
              <UploadTile
                key={d.id}
                label={d.label}
                hint={d.hint}
                file={businessDocs[d.id]}
                onFile={(f) => setBusinessDocs((prev) => ({ ...prev, [d.id]: f }))}
              />
            ))}
          </div>

          <div>
            <p className="text-[13px] font-medium text-slate-700 mb-1.5">Owner's valid government ID</p>
            <div className="grid grid-cols-2 gap-2">
              <UploadTile tall label="Front" hint="UMID, passport, license" file={docFront} onFile={setDocFront} />
              <UploadTile tall label="Back" hint="Tap to upload" file={docBack} onFile={setDocBack} />
            </div>
          </div>

          <Field label="TIN or ID number">
            <Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="000-000-000-000" />
          </Field>
          <Field label="ID expiry date">
            <Input type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
          </Field>
        </div>
      )}

      {/* STEP 5: plan */}
      {step === 5 && (
        <div className="space-y-3" role="radiogroup" aria-label="Plan">
          <MakerPerksNote />
          {PLANS.map((p) => {
            const isSelected = plan === p.id;
            const isPro = p.id === 'pro';
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setPlan(p.id)}
                className={cx(
                  'w-full text-left rounded-[28px] border p-5 transition-colors',
                  isSelected ? 'border-[#003CF5] bg-blue-50/60 ring-1 ring-[#003CF5]' : 'border-slate-200 hover:bg-[#F4F3F0]'
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="flex items-center gap-2">
                      <span className="text-[17px] font-semibold text-slate-900">{p.name}</span>
                      {isPro && <Badge tone="violet" icon={Crown}>Recommended</Badge>}
                    </span>
                    <span className="block mt-0.5 text-[13px] text-slate-500">
                      {p.regular && <span className="mr-1.5 text-[15px] text-slate-400 line-through">{p.regular}</span>}
                      <span className="text-[19px] font-semibold text-slate-900">{p.price}</span> {p.period}
                    </span>
                    {p.regular && (
                      <span className="mt-1.5 inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700">
                        Save ₱{(MAKER_PRO_PRICE.monthly - MAKER_PRO_PRICE.firstMonth).toLocaleString('en-PH')} on your first month
                      </span>
                    )}
                    {p.terms && <span className="block mt-1 text-[12.5px] text-slate-500">{p.terms}</span>}
                  </span>
                  <span
                    className={cx(
                      'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1',
                      isSelected ? 'bg-[#003CF5] text-white' : 'border-2 border-slate-300'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                  </span>
                </span>
                <ul className="mt-3 space-y-1.5">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-[14px] text-slate-700">
                      <Check className={cx('w-4 h-4 mt-0.5 shrink-0', isPro ? 'text-[#003CF5]' : 'text-emerald-600')} />
                      {perk}
                    </li>
                  ))}
                </ul>
                {p.note && <span className="block mt-3 text-[12px] text-slate-500 leading-snug">{p.note}</span>}
              </button>
            );
          })}
          <p className="text-[13px] text-slate-500 text-center">Pro is billed after you are verified. Cancel anytime.</p>
        </div>
      )}

      {/* STEP 6: review */}
      {step === 6 && (
        <div className="space-y-4">
          <Panel className="py-1">
            <ReviewRow label="Main line" value={track?.title || specialty} />
            <ReviewRow label="Contact" value={`${firstName || '—'} ${surname}`.trim()} />
            <ReviewRow label="Mobile" value={phone ? `+63 ${phone}` : '—'} />
            <ReviewRow label="Business" value={workshopName || '—'} />
            <ReviewRow label="Location" value={address || city || '—'} />
            <ReviewRow label="Capacity · MOQ" value={`${dailyCapacity || '—'} · ${minOrder || '—'} pcs`} />
            <ReviewRow label="Documents" value={`${docsUploaded} of ${BUSINESS_DOCS.length + 1} uploaded`} />
            <ReviewRow label="Plan" value={plan === 'pro' ? `Aygo Pro · ₱${MAKER_PRO_PRICE.firstMonth.toLocaleString('en-PH')} first month` : 'Free'} />
          </Panel>

          <MakerPerksNote />

          {docsUploaded < BUSINESS_DOCS.length + 1 && (
            <p className="text-[13px] text-amber-700 bg-amber-50 rounded-2xl px-4 py-3">
              You can submit now and upload missing documents later. You get the Verified badge once all are approved.
            </p>
          )}

          <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded accent-[#003CF5] shrink-0"
            />
            <span className="text-[14px] text-slate-700">
              I confirm these details are accurate and agree to the Aygo maker quality standards.
            </span>
          </label>
        </div>
      )}
    </Sheet>
  );
}
