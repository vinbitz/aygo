import React, { useRef } from 'react';
import { Building2, Camera, Pencil, Send, Phone, Crown, Target, Wallet, Users, Gift } from 'lucide-react';
import { Button, Field, Input, Textarea, Chip, Badge, Panel, IconCircle } from './ui';
import { SPONSOR_PERKS, perkLabel } from '../lib/sponsorPerks';
import { loadImageFile } from '../lib/images';
import { toast } from '../lib/toast';
import { BRAND_GIVES, BRAND_EVENT_TYPES } from '../lib/brands';

const toggle = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

function BrandLogo({ brand, size = 'md' }) {
  const dims = size === 'lg' ? 'w-16 h-16 rounded-[20px]' : 'w-11 h-11 rounded-2xl';
  if (brand.logo?.src) return <img src={brand.logo.src} alt={`${brand.name} logo`} className={`${dims} object-cover shrink-0 bg-[#F4F3F0]`} />;
  return (
    <span className={`${dims} bg-blue-50 text-[#003CF5] flex items-center justify-center shrink-0 font-semibold ${size === 'lg' ? 'text-[26px]' : 'text-[17px]'}`}>
      {brand.name ? brand.name.slice(0, 1) : <Building2 className="w-5 h-5" />}
    </span>
  );
}

export function BrandProfileForm({ brand, onChange }) {
  const fileRef = useRef(null);
  const whiteRef = useRef(null);
  const set = (key) => (e) => onChange({ ...brand, [key]: e.target.value });

  const pickLogo = (key) => async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      onChange({ ...brand, [key]: await loadImageFile(file, { maxSize: 512 }) });
    } catch (err) {
      toast(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <Panel className="flex items-start gap-3">
        <IconCircle icon={Building2} tone="blue" size="sm" className="bg-white" />
        <p className="text-[13px] text-slate-600 leading-snug">
          Organizers see this when you send an inquiry, and events that fit you get matched first.
        </p>
      </Panel>

      <div className="flex items-center gap-4">
        <BrandLogo brand={brand} size="lg" />
        <div>
          <Button type="button" size="sm" variant="secondary" icon={Camera} className="h-11" onClick={() => fileRef.current?.click()}>
            {brand.logo ? 'Change logo' : 'Upload logo'}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickLogo('logo')} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Brand or company name">
          <Input required value={brand.name} onChange={set('name')} placeholder="e.g. Kape Tayo Coffee" />
        </Field>
        <Field label="Industry">
          <Input value={brand.industry} onChange={set('industry')} placeholder="e.g. Food & beverage" />
        </Field>
      </div>
      <Field label="About the brand">
        <Textarea value={brand.about} onChange={set('about')} placeholder="What you do and why you sponsor events" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Audience you want to reach">
          <Input value={brand.audience} onChange={set('audience')} placeholder="e.g. College students in Metro Manila" />
        </Field>
        <Field label="Budget per event">
          <Input value={brand.budget} onChange={set('budget')} placeholder="e.g. ₱10,000–₱50,000 or in-kind" />
        </Field>
      </div>

      <div>
        <p className="mb-1.5 text-[13px] font-medium text-slate-700">Events you support</p>
        <div className="flex flex-wrap gap-2">
          {BRAND_EVENT_TYPES.map((t) => (
            <Chip key={t} selected={brand.supports.includes(t)} onClick={() => onChange({ ...brand, supports: toggle(brand.supports, t) })}>{t}</Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[13px] font-medium text-slate-700">What you give</p>
        <div className="flex flex-wrap gap-2">
          {BRAND_GIVES.map((g) => (
            <Chip key={g} selected={brand.gives.includes(g)} onClick={() => onChange({ ...brand, gives: toggle(brand.gives, g) })}>{g}</Chip>
          ))}
        </div>
      </div>
      <Field label="Your usual offer">
        <Input value={brand.offer} onChange={set('offer')} placeholder="e.g. Free coffee for up to 500 guests" />
      </Field>

      <div className="rounded-2xl border border-slate-200 p-3.5 space-y-3">
        <div>
          <p className="text-[15px] font-semibold text-slate-900">Brand kit</p>
          <p className="text-[12px] text-slate-500">Saved once, filled in whenever an event asks for your files.</p>
        </div>
        <div className="flex items-center gap-3">
          {brand.logoWhite?.src
            ? <img src={brand.logoWhite.src} alt="White logo" className="w-12 h-12 rounded-xl object-contain bg-slate-800 p-1 shrink-0" />
            : <span className="w-12 h-12 rounded-xl bg-slate-800 shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-slate-900">White or one-color logo</p>
            <p className="text-[12px] text-slate-500">For dark shirts and LED screens</p>
          </div>
          <Button type="button" size="sm" variant="secondary" icon={Camera} className="h-10 shrink-0" onClick={() => whiteRef.current?.click()}>
            {brand.logoWhite ? 'Change' : 'Upload'}
          </Button>
          <input ref={whiteRef} type="file" accept="image/*" className="hidden" onChange={pickLogo('logoWhite')} />
        </div>
        <Field label="Brand colors & fonts">
          <Input value={brand.colors || ''} onChange={set('colors')} placeholder="e.g. Red #E4002B, black #1A1A1A, Montserrat" />
        </Field>
        <Field label="Pages to feature">
          <Input value={brand.socialPages || ''} onChange={set('socialPages')} placeholder="e.g. facebook.com/yourbrand, @yourbrand on IG & TikTok" />
        </Field>
      </div>

      <div>
        <p className="text-[13px] font-medium text-slate-700">What you want in return</p>
        <p className="mb-2 text-[12px] text-slate-500">Events that offer these show up first for you.</p>
        <div className="flex flex-wrap gap-2">
          {SPONSOR_PERKS.map((p) => (
            <Chip key={p.id} selected={brand.wants.includes(p.id)} onClick={() => onChange({ ...brand, wants: toggle(brand.wants, p.id) })}>{p.label}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Brand profile card. isOwn shows Edit; otherwise Send inquiry and Call. */
export function BrandProfileCard({ brand, isOwn, onEdit, onInquiry, onCall, callLocked }) {
  return (
    <div className="rounded-[28px] border border-slate-200 p-4 sm:p-5 space-y-4">
      <div className="flex items-start gap-3">
        <BrandLogo brand={brand} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[17px] font-semibold text-slate-900">{brand.name}</h3>
            {brand.pro && <Badge tone="violet" icon={Crown}>Pro</Badge>}
          </div>
          <p className="text-[13px] text-slate-500">{brand.industry || 'Brand'}</p>
        </div>
        {isOwn && <Button size="sm" variant="secondary" icon={Pencil} className="h-11" onClick={onEdit}>Edit</Button>}
      </div>

      {brand.about && <p className="text-[15px] text-slate-700 leading-relaxed">{brand.about}</p>}

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {brand.offer && <Fact icon={Gift} label="Usual offer" value={brand.offer} />}
        {brand.budget && <Fact icon={Wallet} label="Budget per event" value={brand.budget} />}
        {brand.audience && <Fact icon={Users} label="Wants to reach" value={brand.audience} />}
        {brand.supports?.length > 0 && <Fact icon={Target} label="Supports" value={brand.supports.join(', ')} />}
      </dl>

      {brand.gives?.length > 0 && (
        <div>
          <p className="mb-1.5 text-[13px] text-slate-500">Gives</p>
          <div className="flex flex-wrap gap-1.5">{brand.gives.map((g) => <Badge key={g}>{g}</Badge>)}</div>
        </div>
      )}
      {brand.wants?.length > 0 && (
        <div>
          <p className="mb-1.5 text-[13px] text-slate-500">Wants in return</p>
          <div className="flex flex-wrap gap-1.5">{brand.wants.map((w) => <Badge key={w} tone="blue">{perkLabel(w)}</Badge>)}</div>
        </div>
      )}

      {!isOwn && (
        <div className="flex gap-2">
          <Button icon={Send} className="flex-1" onClick={onInquiry}>Send inquiry</Button>
          <Button variant="secondary" icon={callLocked ? Crown : Phone} onClick={onCall}>Call</Button>
        </div>
      )}
    </div>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-[#F4F3F0] px-3 py-2.5 flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <dt className="text-[12px] text-slate-500">{label}</dt>
        <dd className="text-[14px] text-slate-900">{value}</dd>
      </div>
    </div>
  );
}

/** Small list row used when a brand has not set up a profile yet */
export function BrandProfilePrompt({ onSetup }) {
  return (
    <Panel className="flex items-center gap-3">
      <IconCircle icon={Building2} tone="blue" size="sm" className="bg-white" />
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-slate-900">Set up your brand profile</p>
        <p className="text-[13px] text-slate-500">Logo, what you give and what you want back</p>
      </div>
      <Button size="sm" className="h-11 shrink-0" onClick={onSetup}>Set up</Button>
    </Panel>
  );
}
