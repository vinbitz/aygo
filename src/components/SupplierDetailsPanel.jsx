import React from 'react';
import {
  Star, MapPin, Clock, Boxes, Truck, Wallet, Phone, Mail, User, Store, CheckCircle2, CalendarClock, ArrowLeft,
} from 'lucide-react';
import { Button, Badge, VerifiedBadge, Section } from './ui';

/** Maker details shown inside Aygo Chat when the organizer taps the maker's name */
export default function SupplierDetailsPanel({ supplier, onBack, onViewProfile }) {
  if (!supplier) return null;
  const services = supplier.services || [];
  const minOrder = services.length ? Math.min(...services.map((s) => s.moq)) : null;

  const facts = [
    { icon: Star, label: 'Rating', value: `${supplier.rating} (${supplier.reviewsCount} reviews)` },
    { icon: CheckCircle2, label: 'On-time delivery', value: supplier.onTimeRate },
    { icon: Clock, label: 'Lead time', value: supplier.avgLeadTime },
    { icon: Boxes, label: 'Minimum order', value: minOrder ? `${minOrder} ${minOrder === 1 ? 'pc' : 'pcs'}` : 'Ask the maker' },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4">
      <div className="flex items-start gap-3">
        {supplier.avatar ? (
          <img
            src={supplier.avatar}
            alt=""
            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
            className="w-14 h-14 rounded-full object-cover bg-[#F4F3F0] shrink-0"
          />
        ) : null}
        <div className="min-w-0">
          <p className="text-[17px] font-semibold text-slate-900 leading-tight">{supplier.name}</p>
          {supplier.tagline && <p className="mt-0.5 text-[13px] text-slate-500">{supplier.tagline}</p>}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {supplier.verified !== false ? <VerifiedBadge /> : <Badge>New on Aygo</Badge>}
            {supplier.proStorefront && <Badge tone="violet">Pro</Badge>}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl bg-[#F4F3F0] px-3 py-2.5">
            <p className="flex items-center gap-1.5 text-[12px] text-slate-500"><Icon className="w-3.5 h-3.5" /> {label}</p>
            <p className="mt-0.5 text-[14px] font-medium text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <Section title="Location">
        <p className="flex items-start gap-2 text-[14px] text-slate-700"><MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />{supplier.address || supplier.city}</p>
        {supplier.distanceFromVenue && <p className="mt-1 pl-6 text-[13px] text-slate-500">{supplier.distanceFromVenue}</p>}
        {supplier.pickupHours && (
          <p className="mt-1 flex items-start gap-2 text-[14px] text-slate-700"><CalendarClock className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />{supplier.pickupHours}</p>
        )}
      </Section>

      {services.length > 0 && (
        <Section title="Services">
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.name} className="rounded-2xl border border-slate-200 px-3 py-2.5">
                <p className="text-[14px] font-medium text-slate-900">{s.name}</p>
                <p className="text-[12px] text-slate-500">Min. {s.moq} · {s.turnaround}{s.priceTier ? ` · ${s.priceTier}` : ''}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {supplier.dispatchOptions?.length > 0 && (
        <Section title="Delivery options">
          <p className="flex items-start gap-2 text-[14px] text-slate-700"><Truck className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />{supplier.dispatchOptions.join(' · ')}</p>
        </Section>
      )}

      {supplier.terms && (
        <Section title="Payment terms">
          <p className="flex items-start gap-2 text-[14px] text-slate-700"><Wallet className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />{supplier.terms}</p>
        </Section>
      )}

      <Section title="Contact">
        <div className="space-y-2 text-[14px]">
          {supplier.contactPerson && <p className="flex items-center gap-2 text-slate-700"><User className="w-4 h-4 text-slate-400" />{supplier.contactPerson}</p>}
          {supplier.phone && (
            <a href={`tel:${supplier.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-[#003CF5] hover:underline"><Phone className="w-4 h-4" />{supplier.phone}</a>
          )}
          {supplier.email && (
            <a href={`mailto:${supplier.email}`} className="flex items-center gap-2 text-[#003CF5] hover:underline break-all"><Mail className="w-4 h-4 shrink-0" />{supplier.email}</a>
          )}
        </div>
      </Section>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="lg" icon={ArrowLeft} onClick={onBack}>Chat</Button>
        {onViewProfile && (
          <Button size="lg" full icon={Store} onClick={() => onViewProfile(supplier)}>View storefront</Button>
        )}
      </div>
    </div>
  );
}
