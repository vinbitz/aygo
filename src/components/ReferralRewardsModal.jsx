import React, { useState } from 'react';
import { Send, Award, Users, Check, Copy, Gift, Share2 } from 'lucide-react';
import { toast } from '../lib/toast';
import { Sheet, Button, IconCircle, Panel, Section } from './ui';

const STEPS = [
  {
    icon: Send,
    tone: 'blue',
    title: 'Send your link',
    text: "Invite an organizer or maker who doesn't have an Aygo account yet."
  },
  {
    icon: Users,
    tone: 'violet',
    title: 'They complete an order',
    text: 'They sign up with your link and finish their first bulk order within 30 days.'
  },
  {
    icon: Award,
    tone: 'amber',
    title: 'You get ₱500',
    text: 'Use your bonus on escrow fees or as a discount. 1 bonus = ₱1.'
  }
];

export default function ReferralRewardsModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const inviteLink = 'https://aygo.store/invite/MARVIN-BGC-2026';

  if (!isOpen) return null;

  const handleCopy = () => {
    const done = () => {
      setCopied(true);
      toast('Invite link copied');
      setTimeout(() => setCopied(false), 2500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(inviteLink).then(done, () => toast("Couldn't copy. Press and hold the link to copy it."));
    } else {
      done();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Join me on Aygo',
          text: 'Source event supplies from verified makers on Aygo. You Plan. We Connect.',
          url: inviteLink
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <Sheet
      onClose={onClose}
      title="Refer & earn"
      subtitle="Invite partners, get ₱500 each"
      icon={Gift}
      size="sm"
      footer={
        <Button size="lg" full icon={Share2} onClick={handleShare}>
          Share invite link
        </Button>
      }
    >
      {/* Hero */}
      <Panel className="rounded-[28px] flex items-center gap-4 p-5">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-slate-500">Partner bonus</p>
          <p className="text-[32px] leading-none font-semibold text-slate-900 tracking-tight mt-1">₱500</p>
          <p className="text-[13px] text-slate-500 mt-2 leading-snug">For every organizer or verified maker who joins and orders.</p>
        </div>
        <span className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
          <Gift className="w-8 h-8" strokeWidth={1.75} />
        </span>
      </Panel>

      {/* Steps */}
      <Section title="How it works">
        <ol className="space-y-4">
          {STEPS.map(({ icon, tone, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <IconCircle icon={icon} tone={tone} />
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-slate-900">{title}</p>
                <p className="text-[13px] text-slate-500 leading-snug">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Link */}
      <Section title="Your invite link">
        <div className="flex items-center gap-2 rounded-2xl bg-[#F4F3F0] pl-4 pr-1.5 py-1.5">
          <span className="flex-1 min-w-0 text-[14px] font-medium text-slate-700 truncate select-all">
            {inviteLink.replace('https://', '')}
          </span>
          <Button variant={copied ? 'success' : 'outline'} icon={copied ? Check : Copy} onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </Section>

      <div className="text-center pt-1">
        <button
          type="button"
          onClick={() => toast('Referral terms: Bonuses are non-transferable and can be redeemed towards escrow payments or bank withdrawals for verified makers.')}
          className="min-h-[44px] px-3 text-[13px] font-medium text-slate-500 hover:text-slate-800 underline underline-offset-2"
        >
          Terms and conditions
        </button>
      </div>
    </Sheet>
  );
}
