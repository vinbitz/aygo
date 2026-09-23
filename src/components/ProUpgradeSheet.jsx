import React, { useState } from 'react';
import {
  Crown, Infinity as InfinityIcon, Sparkles, FileText, ArrowLeftRight, Bookmark, CalendarDays, Users, Zap, HardDrive, Check, Phone,
  Rocket, BarChart3, Store, Wand2, Handshake, Target, BadgeCheck,
} from 'lucide-react';
import { Sheet, Button, Tabs, Logo, cx } from './ui';
import { FREE_USES, PRO_FEATURES, PRO_PLANS, MAKER_PRO_PERKS } from '../lib/pro';

const php = (n) => `₱${n.toLocaleString('en-PH')}`;

// "Aygo Pro for Organizers" benefits from the master plan
const ORGANIZER_BENEFITS = [
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

// "Aygo Pro for Suppliers": for the supplier portal
const MAKER_ICONS = { listings: Store, placement: Rocket, analytics: BarChart3, mockups: Wand2, documents: FileText, calls: Phone, badge: BadgeCheck };
const MAKER_BENEFITS = MAKER_PRO_PERKS.map((p) => ({ icon: MAKER_ICONS[p.id], title: p.title, text: p.text }));

// "Sponsorship Connect Pro": for brands and organizers closing sponsorships
const SPONSORSHIP_BENEFITS = [
  { icon: Target, title: 'Priority matching', text: 'Show first to the brands or events that fit you' },
  { icon: Phone, title: 'Calls with brands and organizers', text: 'Voice or video, with booked times in the chat' },
  { icon: FileText, title: 'Sponsorship documents', text: 'Proposals, agreements, billing and post-event reports' },
  { icon: Handshake, title: 'Unlimited inquiries', text: 'Reach every event or brand you want' },
  { icon: BarChart3, title: 'Reach reports', text: 'Likes, reels and attendance your sponsorship delivered' },
  { icon: BadgeCheck, title: 'Sponsor Pro badge', text: 'Stand out as a serious sponsor or organizer' },
];

const BENEFITS_BY_PLAN = { organizer: ORGANIZER_BENEFITS, maker: MAKER_BENEFITS, sponsorship: SPONSORSHIP_BENEFITS };

/** Paywall shown after the free uses of a Pro feature run out, or from "Go Pro" entry points */
export default function ProUpgradeSheet({ feature, plan: planId = 'organizer', isPro, onClose, onUpgrade, onDowngrade }) {
  const [billing, setBilling] = useState('monthly');
  const plan = PRO_PLANS[planId] || PRO_PLANS.organizer;
  const benefits = BENEFITS_BY_PLAN[plan.id];
  const yearly = billing === 'yearly' && plan.yearly;
  const info = feature ? PRO_FEATURES[feature] : null;
  const price = yearly
    ? { now: php(plan.yearly), per: '/year', note: '2 months free. Cancel anytime.' }
    : { now: php(plan.firstMonth), per: ' first month', was: php(plan.monthly), note: `Then ${php(plan.monthly)}/month. Cancel anytime.` };

  return (
    <Sheet
      title={plan.name}
      subtitle={plan.tagline}
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
              {yearly ? `Go Pro · ${price.now}/year` : `Start Pro · ${price.now} first month`}
            </Button>
            <p className="mt-2 text-center text-[12px] text-slate-500">Preview only: no payment is taken.</p>
          </div>
        )
      }
    >
      <div className="rounded-[22px] bg-[#003CF5] p-5 text-white relative overflow-hidden">
        <Logo tone="white" className="h-6" />
        <p className="mt-3 text-[19px] font-semibold leading-snug">
          {info?.headline || (info ? `You've used your ${FREE_USES} free ${info.noun}.` : plan.headline)}
        </p>
        <p className="mt-1 text-[13px] text-blue-100">
          {info?.text || (info ? `Go Pro to keep using ${info.label} and every other tool without limits.` : `Free accounts get ${FREE_USES} tries of each Pro tool.`)}
        </p>
        <Logo variant="icon" className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20 rotate-12" />
      </div>

      {!isPro && plan.yearly && (
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
        <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-center">
          <p className="text-[15px] text-emerald-900">
            {price.was && <span className="mr-2 text-slate-400 line-through">{price.was}</span>}
            <span className="text-[22px] font-semibold">{price.now}</span>{price.per}
          </p>
          <p className="text-[12.5px] text-emerald-800/80">{price.note}</p>
          {!yearly && (
            <span className="mt-1.5 inline-flex rounded-full bg-white px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700">
              First month {Math.round((1 - plan.firstMonth / plan.monthly) * 100)}% off
            </span>
          )}
        </div>
      )}

      <ul className="mt-4 space-y-3">
        {benefits.map(({ icon: Icon, title, text }) => (
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
        {plan.id === 'maker'
          ? 'Always free: bidding on requests, chat with organizers, sending packages and getting paid through Aygo.'
          : plan.id === 'sponsorship'
            ? 'Always free: browsing events and brands, sending inquiries, chat, packages and payments through Aygo.'
            : 'Always free: posting requests, receiving offers, chat, accepting a maker and Sponsorship Connect.'}
      </p>
    </Sheet>
  );
}
