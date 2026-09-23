import React, { useState } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  ChevronRight,
  CreditCard,
  Wallet,
  Plus,
  Lock,
  Gift,
  ShieldCheck,
  Landmark,
  Check
} from 'lucide-react';
import { toast } from '../lib/toast';
import { Sheet, Button, Field, Input, Chip, Badge, ListRow, Section, Panel } from './ui';

const METHODS = {
  gcash: { label: 'GCash', short: 'G', color: 'bg-[#007DFE]', hint: 'Instant · Scan QR or send to 0917 555 0101' },
  maya: { label: 'Maya', short: 'M', color: 'bg-emerald-500', hint: 'Instant · Pay with your Maya wallet' },
  bank: { label: 'Bank transfer', short: null, color: 'bg-slate-800', hint: 'BDO / BPI · Aygo Solutions Inc.' }
};

const QUICK_AMOUNTS = ['1000', '5000', '15000'];

const ACTIVITY = [
  { id: 'a1', icon: Lock, tone: 'slate', title: '50% escrow hold · Thread & Co.', sub: 'Order #AYGO-8842', amount: '−₱7,500', positive: false },
  { id: 'a2', icon: Gift, tone: 'green', title: 'Referral bonus', sub: 'Partner: Manila Bag Works', amount: '+₱500', positive: true }
];

function MethodLogo({ id }) {
  const m = METHODS[id];
  return (
    <span className={`w-10 h-10 rounded-full ${m.color} text-white flex items-center justify-center text-[15px] font-semibold shrink-0`}>
      {m.short || <Landmark className="w-5 h-5" />}
    </span>
  );
}

function MethodRow({ id, on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 -mx-2 px-2 rounded-2xl text-left hover:bg-[#F4F3F0] transition-colors"
    >
      <MethodLogo id={id} />
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-medium text-slate-900">{METHODS[id].label}</span>
        <span className="block text-[13px] text-slate-500 truncate">{METHODS[id].hint}</span>
      </span>
      <Badge tone={on ? 'green' : 'slate'}>{on ? 'On' : 'Off'}</Badge>
    </button>
  );
}

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

export default function BalancePaymentModal({ isOpen, onClose }) {
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'methods' | 'topup'
  const [balance, setBalance] = useState(15000);
  const [bonuses] = useState(500);
  const [topUpAmount, setTopUpAmount] = useState('5000');
  const [selectedMethod, setSelectedMethod] = useState('gcash');
  const [isGcashActive, setIsGcashActive] = useState(true);

  if (!isOpen) return null;

  const amountValue = parseFloat(topUpAmount) || 0;

  const handleTopUpSubmit = () => {
    const amt = amountValue;
    if (amt > 0) {
      setBalance(prev => prev + amt);
      toast(`Added ₱${amt.toLocaleString()} via ${METHODS[selectedMethod].label}. Ready for your next supplier deposit.`);
      setCurrentView('main');
    } else {
      toast('Enter an amount above ₱0');
    }
  };

  const back = <BackButton onClick={() => setCurrentView('main')} />;

  /* ---------------------------------------------------------------- */
  /* Payment methods                                                   */
  /* ---------------------------------------------------------------- */
  if (currentView === 'methods') {
    return (
      <Sheet
        onClose={onClose}
        title="Payment methods"
        subtitle="For order deposits and maker payouts"
        headerAction={back}
        size="sm"
      >
        <Section title="Wallets">
          <MethodRow
            id="gcash"
            on={isGcashActive}
            onClick={() => {
              setIsGcashActive(!isGcashActive);
              toast(isGcashActive ? 'GCash turned off' : 'GCash turned on');
            }}
          />
          <MethodRow id="maya" on onClick={() => toast('Maya is ready to use when you top up')} />
        </Section>
        <Section title="Bank">
          <MethodRow id="bank" on onClick={() => toast('Bank transfers are verified within 1 business day')} />
        </Section>

        <Panel className="flex items-start gap-3 mt-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[13px] text-slate-600 leading-snug">
            Payments are held in Aygo escrow and released to your maker only when you approve delivery.
          </p>
        </Panel>
      </Sheet>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Top up                                                            */
  /* ---------------------------------------------------------------- */
  if (currentView === 'topup') {
    return (
      <Sheet
        onClose={onClose}
        title="Top up"
        subtitle="Add funds for faster order confirmation"
        headerAction={back}
        size="sm"
        footer={
          <Button size="lg" full onClick={handleTopUpSubmit} disabled={amountValue <= 0}>
            Top up ₱{amountValue.toLocaleString()}
          </Button>
        }
      >
        <Section title="Amount">
          <div className="flex gap-2 mb-3">
            {QUICK_AMOUNTS.map((amt) => (
              <Chip key={amt} selected={topUpAmount === amt} onClick={() => setTopUpAmount(amt)} className="flex-1 justify-center !h-11">
                ₱{parseInt(amt, 10).toLocaleString()}
              </Chip>
            ))}
          </div>
          <Field label="Or enter an amount">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-slate-500">₱</span>
              <Input
                type="number"
                inputMode="decimal"
                min="1"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="pl-8"
                aria-label="Top up amount in pesos"
              />
            </div>
          </Field>
        </Section>

        <Section title="Pay with">
          <div role="radiogroup" className="space-y-2">
            {Object.keys(METHODS).map((id) => {
              const selected = selectedMethod === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedMethod(id)}
                  className={`w-full min-h-[60px] flex items-center gap-3 px-3 rounded-2xl border text-left transition-colors ${
                    selected ? 'border-[#003CF5] bg-blue-50/60' : 'border-transparent bg-[#F4F3F0] hover:bg-[#ECEAE5]'
                  }`}
                >
                  <MethodLogo id={id} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium text-slate-900">{METHODS[id].label}</span>
                    <span className="block text-[13px] text-slate-500 truncate">{METHODS[id].hint}</span>
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      selected ? 'bg-[#003CF5] text-white' : 'border-2 border-slate-300'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>
      </Sheet>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Main wallet                                                       */
  /* ---------------------------------------------------------------- */
  return (
    <Sheet
      onClose={onClose}
      title="Wallet"
      subtitle="Your Aygo escrow balance"
      icon={Wallet}
      size="sm"
      footer={
        <Button size="lg" full icon={Plus} onClick={() => setCurrentView('topup')}>
          Top up
        </Button>
      }
    >
      {/* Balance card */}
      <Panel className="rounded-[28px] p-5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-slate-500">Available balance</span>
          <button
            type="button"
            onClick={() => toast('Your Aygo balance secures orders, pays suppliers and holds referral bonuses.')}
            aria-label="What is this balance?"
            className="w-11 h-11 -mr-2 -my-2 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[36px] leading-none font-semibold text-slate-900 tracking-tight mt-1">
          ₱{balance.toLocaleString()}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Badge tone="green" icon={Gift}>{bonuses} bonus points</Badge>
          <span className="text-[12px] text-slate-500">1 point = ₱1</span>
        </div>
      </Panel>

      <Section>
        <ListRow
          icon={CreditCard}
          tone="blue"
          title="Payment methods"
          subtitle="GCash, Maya, bank transfer"
          onClick={() => setCurrentView('methods')}
        />
      </Section>

      <Section title="Recent activity">
        {ACTIVITY.map((a) => (
          <ListRow
            key={a.id}
            icon={a.icon}
            tone={a.tone}
            title={a.title}
            subtitle={a.sub}
            trailing={
              <span className={`text-[15px] font-semibold shrink-0 ${a.positive ? 'text-emerald-600' : 'text-slate-900'}`}>
                {a.amount}
              </span>
            }
          />
        ))}
      </Section>

      <button
        type="button"
        onClick={() => setCurrentView('methods')}
        className="w-full min-h-[44px] flex items-center justify-center gap-1 text-[13px] font-medium text-slate-500 hover:text-slate-800"
      >
        How escrow keeps you safe
        <ChevronRight className="w-4 h-4" />
      </button>
    </Sheet>
  );
}
