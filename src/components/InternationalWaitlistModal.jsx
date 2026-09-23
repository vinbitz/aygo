import React, { useState } from 'react';
import { Globe, CheckCircle2, Percent, Users, Rocket } from 'lucide-react';
import { Sheet, Button, Field, Input, Select, Chip, ListRow } from './ui';

const COUNTRIES = ['Singapore', 'Malaysia', 'Indonesia', 'Vietnam', 'Thailand', 'United Arab Emirates', 'United States', 'Australia', 'Other'];
const ROLES = ['Event organizer', 'Supplier / maker', 'Launch partner'];

/** Waitlist for countries outside the Philippines; launch partners earn commission */
export default function InternationalWaitlistModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [role, setRole] = useState(ROLES[2]);
  const [submitted, setSubmitted] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email);

  if (submitted) {
    return (
      <Sheet title="You're on the list" icon={CheckCircle2} onClose={onClose} size="sm"
        footer={<Button size="lg" full onClick={onClose}>Done</Button>}>
        <p className="text-[15px] text-slate-700">
          Thanks! We'll email <span className="font-semibold text-slate-900">{email}</span> when Aygo opens in {country}
          {role === 'Launch partner' ? ', with details on the partner commission.' : '.'}
        </p>
      </Sheet>
    );
  }

  return (
    <Sheet
      title="Bring Aygo to your country"
      subtitle="Aygo is live in the Philippines first. Tell us where you want it next."
      icon={Globe}
      onClose={onClose}
      size="sm"
      footer={
        <Button size="lg" full disabled={!valid} onClick={() => setSubmitted(true)}>
          Join the waitlist
        </Button>
      }
    >
      <div className="space-y-4">
        <Field label="Email">
          <Input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>
        <Field label="Country">
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <div>
          <span className="block mb-1.5 text-[13px] font-medium text-slate-700">I am a…</span>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => <Chip key={r} selected={role === r} onClick={() => setRole(r)}>{r}</Chip>)}
          </div>
        </div>

        {role === 'Launch partner' && (
          <div className="rounded-2xl bg-[#F4F3F0] px-3">
            <ListRow icon={Percent} tone="green" title="Earn commission" subtitle="On every booking in your country" />
            <ListRow icon={Users} tone="blue" title="Build the local network" subtitle="Onboard and verify suppliers" />
            <ListRow icon={Rocket} tone="violet" title="Launch support" subtitle="Brand kit, playbook and platform" />
          </div>
        )}
      </div>
    </Sheet>
  );
}
