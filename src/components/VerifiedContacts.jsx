import React from 'react';
import { BadgeCheck, Phone, Mail, FileCheck2, Globe, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from './ui';

/**
 * Shows which of a maker's accounts Aygo has verified, without revealing the
 * phone, email or social handles. Organizers reach makers through Aygo Chat,
 * which keeps the order record and protects both sides.
 */
export default function VerifiedContacts({ supplier, onMessage }) {
  const socials = Object.entries(supplier.socials || {}).filter(([, v]) => v).map(([k]) => k);
  const items = [
    supplier.phone && { icon: Phone, label: 'Mobile number' },
    supplier.email && { icon: Mail, label: 'Business email' },
    supplier.verified !== false && { icon: FileCheck2, label: 'Business documents (DTI/SEC, BIR, permit)' },
    ...socials.map((s) => ({ icon: Globe, label: `${s.charAt(0).toUpperCase()}${s.slice(1)} page` })),
  ].filter(Boolean);

  return (
    <div>
      <ul className="space-y-2">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5 text-[14px] text-slate-700">
            <Icon className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="flex-1">{label}</span>
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-emerald-700">
              <BadgeCheck className="w-4 h-4" /> Verified
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-start gap-2 rounded-2xl bg-blue-50 px-3 py-2.5 text-[12px] text-slate-600">
        <ShieldCheck className="w-4 h-4 text-[#003CF5] shrink-0 mt-px" />
        Contact details stay private. Keep talks and payments in Aygo so your order, offers and files are protected.
      </p>
      {onMessage && (
        <Button className="mt-3" full icon={MessageSquare} onClick={onMessage}>Message on Aygo</Button>
      )}
    </div>
  );
}
