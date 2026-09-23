import React, { useState } from 'react';
import {
  Crown, Infinity as InfinityIcon, Sparkles, FileText, ArrowLeftRight, Bookmark, CalendarDays, Users, Zap, HardDrive, Check, Phone,
} from 'lucide-react';
import { Sheet, Button, Tabs, Logo, cx } from './ui';
import { FREE_USES, PRO_FEATURES } from '../lib/pro';

// Example pricing; set the real numbers here
const PRO_PRICING = {
  monthly: { price: '₱299', per: '/month', note: 'Cancel anytime' },
  yearly: { price: '₱2,990', per: '/year', note: '2 months free' },
};

// "Aygo Pro for Organizers" benefits from the master plan
const BENEFITS = [
  { icon: InfinityIcon, title: 'Unlimited requests & Aygo Assist', text: 'Higher request limits and AI request fills' },
  { icon: Sparkles, title: 'Advanced AI mockups', text: 'Every item, unlimited sessions' },
  { icon: FileText, title: 'Branded documents', text: 'RFQs, POs, invoices with your logo' },
  { icon: ArrowLeftRight, title: 'Supplier comparison tools', text: 'Compare every offer side by side' },
  { icon: Bookmark, title: 'Saved supplier lists', text: 'Keep your go-to makers' },
  { icon: CalendarDays, title: 'Event workspaces', text: 'Budget, suppliers and checklist per event' },
  { icon: Phone, title: 'In-app calls', text: 'Call makers, brands and organizers. Works if either side has Pro' },
  { icon: Users, title: 'Team collaboration', text: 'Plan with your org mates' },
  { icon: Zap, title: 'Priority sourcing', text: 'Your requests reach makers first' },
  { icon: HardDrive, title: 'More document storage', text: 'Keep every quote and PO' },
];

/** Paywall shown after the free uses of a Pro feature run out, or from "Go Pro" entry points */
export default function ProUpgradeSheet({ feature, isPro, onClose, onUpgrade, onDowngrade }) {
  const [billing, setBilling] = useState('monthly');
  const plan = PRO_PRICING[billing];
  const info = feature ? PRO_FEATURES[feature] : null;

  return (
    <Sheet
      title="Aygo Pro"
      subtitle="Your event sourcing workspace."
      icon={Crown}
      onClose={onClose}
      size="md"
      footer={
        isPro ? (
          <div className="flex gap-2">
            <Button variant="secondary" size="lg" onClick={onDowngrade}>Reset to Free</Button>
            <Button size="lg" full onClick={onClose}>You're on Pro</Button>
          </div>
        ) : (
          <div>
            <Button size="lg" full icon={Crown} onClick={onUpgrade}>
              Go Pro · {plan.price}{plan.per}
            </Button>
            <p className="mt-2 text-center text-[12px] text-slate-500">Preview only: no payment is taken.</p>
          </div>
        )
      }
    >
      <div className="rounded-[22px] bg-[#003CF5] p-5 text-white relative overflow-hidden">
        <Logo tone="white" className="h-6" />
        <p className="mt-3 text-[19px] font-semibold leading-snug">
          {info?.headline || (info ? `You've used your ${FREE_USES} free ${info.noun}.` : 'Plan every event in one place.')}
        </p>
        <p className="mt-1 text-[13px] text-blue-100">
          {info?.text || (info ? `Go Pro to keep using ${info.label} and every other tool without limits.` : `Free accounts get ${FREE_USES} tries of each Pro tool.`)}
        </p>
        <Logo variant="icon" className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20 rotate-12" />
      </div>

      {!isPro && (
        <Tabs
          className="mt-4"
          value={billing}
          onChange={setBilling}
          tabs={[
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly', label: 'Yearly · save 17%' },
          ]}
        />
      )}
      {!isPro && (
        <p className="mt-2 text-center text-[13px] text-slate-500">
          <span className="text-[17px] font-semibold text-slate-900">{plan.price}</span>{plan.per} · {plan.note}
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-full bg-blue-50 text-[#003CF5] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-medium text-slate-900">{title}</span>
              <span className="block text-[13px] text-slate-500">{text}</span>
            </span>
            <Check className={cx('w-4 h-4 mt-1 shrink-0', isPro ? 'text-emerald-600' : 'text-slate-300')} />
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[13px] text-slate-500">
        Always free: posting requests, receiving offers, chat, accepting a maker and Sponsorship Connect.
      </p>
    </Sheet>
  );
}
