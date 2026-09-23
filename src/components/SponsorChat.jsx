import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Send, Building2, GraduationCap, MessagesSquare, ShieldCheck, Phone, Crown, Gift, CreditCard, CheckCheck } from 'lucide-react';
import { Input, EmptyState, Button, Chip, cx } from './ui';
import { maskContactInfo } from '../lib/contactGuard';
import { toast } from '../lib/toast';
import { canCall } from '../lib/pro';
import { packageAmount, SPONSOR_PAY_METHODS } from '../lib/sponsorDeals';
import { peso } from '../lib/marketplace';

/**
 * Brand ↔ organizer chat inside Sponsorship Connect.
 * threads: [{ id, name, subtitle, kind: 'brand'|'organizer', messages: [{ id, from: 'me'|'them', text, time }] }]
 */
const amountLabel = (amount) => (packageAmount(amount) ? peso(packageAmount(amount)) : 'In-kind');

/** A sponsorship package shown inside the chat */
function PackageOption({ pkg, onChoose }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-slate-900">{pkg.tier}</p>
          <p className="text-[12.5px] text-slate-500 leading-snug">{pkg.perks}</p>
        </div>
        <p className="text-[15px] font-semibold text-slate-900 shrink-0">{amountLabel(pkg.amount)}</p>
      </div>
      {onChoose && (
        <Button size="sm" variant="outline" className="mt-2.5 w-full h-10" onClick={() => onChoose(pkg)}>
          Choose {pkg.tier}
        </Button>
      )}
    </div>
  );
}

/** The package a brand picked, paid through Aygo */
function SelectionCard({ m, canPay, onPay }) {
  const [method, setMethod] = useState(SPONSOR_PAY_METHODS[0]);
  const amount = packageAmount(m.pkg.amount);
  const paid = m.status === 'paid';
  return (
    <div className="w-[290px] max-w-full rounded-2xl bg-white border border-slate-200/80 p-3.5 text-left">
      <div className="flex items-center gap-2">
        <span className="w-9 h-9 rounded-full bg-violet-50 text-violet-700 flex items-center justify-center shrink-0"><Gift className="w-4 h-4" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-slate-500">Sponsorship package</p>
          <p className="text-[15px] font-semibold text-slate-900 leading-tight">{m.pkg.tier}</p>
        </div>
        <p className="text-[15px] font-semibold text-slate-900">{amountLabel(m.pkg.amount)}</p>
      </div>
      <p className="mt-2 text-[12.5px] text-slate-600 leading-snug">{m.pkg.perks}</p>
      {paid ? (
        <p className="mt-3 flex items-start gap-1.5 text-[13px] font-medium text-emerald-700">
          <CheckCheck className="w-4 h-4 shrink-0 mt-px" />
          {amount ? `${peso(amount)} paid via ${m.method}. Aygo holds it until the event delivers the perks.` : 'In-kind sponsorship confirmed.'}
        </p>
      ) : canPay ? (
        <div className="mt-3 space-y-2">
          {amount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {SPONSOR_PAY_METHODS.map((pm) => (
                <Chip key={pm} selected={method === pm} onClick={() => setMethod(pm)}>{pm}</Chip>
              ))}
            </div>
          )}
          <Button size="sm" icon={amount ? CreditCard : CheckCheck} className="w-full h-11" onClick={() => onPay(m.id, method)}>
            {amount ? `Pay ${peso(amount)}` : 'Confirm in-kind sponsorship'}
          </Button>
          <p className="text-[11.5px] text-slate-500">Paying in Aygo protects both sides. Preview only: no money moves.</p>
        </div>
      ) : (
        <p className="mt-3 text-[13px] text-slate-500">Waiting for the brand to pay</p>
      )}
    </div>
  );
}

export default function SponsorChat({ threads, activeId, onOpen, onBack, onSend, onCall, viewerIsPro, onChoosePackage, onPayPackage, onSendPackages }) {
  const active = threads.find((t) => t.id === activeId);
  const [draft, setDraft] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [active?.messages.length, activeId]);

  if (!threads.length) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="No conversations yet"
        text="Send an inquiry and your chat will show up here."
      />
    );
  }

  if (!active) {
    return (
      <ul className="divide-y divide-slate-100">
        {threads.map((t) => {
          const last = t.messages[t.messages.length - 1];
          const Icon = t.kind === 'brand' ? Building2 : GraduationCap;
          return (
            <li key={t.id}>
              <button type="button" onClick={() => onOpen(t.id)} className="w-full flex items-center gap-3 py-3 text-left">
                <span className="w-11 h-11 rounded-full bg-blue-50 text-[#003CF5] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[15px] font-medium text-slate-900 truncate">{t.name}</span>
                    <span className="text-[12px] text-slate-400 shrink-0">{last?.time}</span>
                  </span>
                  <span className="block text-[13px] text-slate-500 truncate">{t.subtitle}</span>
                  <span className={cx('block text-[13px] truncate', t.unread ? 'text-slate-900 font-medium' : 'text-slate-500')}>
                    {last?.from === 'me' ? 'You: ' : ''}{last?.text}
                  </span>
                </span>
                {t.unread > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#003CF5] text-white text-[11px] font-semibold flex items-center justify-center">{t.unread}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  // One package per chat: once chosen, the options become read-only
  const chosen = active.messages.some((m) => m.type === 'selection');

  const send = () => {
    const raw = draft.trim();
    if (!raw) return;
    const { text, found } = maskContactInfo(raw);
    if (found) toast('Phone numbers, emails and outside chat handles are hidden. Keep talks in Aygo so your deal stays protected.');
    onSend(active.id, text);
    setDraft('');
  };

  return (
    <div className="flex flex-col h-[60vh] sm:h-[480px] -mx-5">
      <div className="flex items-center gap-2 px-3 pb-2 border-b border-slate-100">
        <button type="button" onClick={onBack} aria-label="Back to chats" className="w-10 h-10 rounded-full hover:bg-[#F4F3F0] flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] font-semibold text-slate-900 truncate">{active.name}</span>
          <span className="block text-[12px] text-slate-500 truncate">{active.subtitle}{active.pro ? ' · Pro' : ''}</span>
        </span>
        {onCall && (
          <button
            type="button"
            onClick={() => onCall(active)}
            aria-label={canCall(viewerIsPro, active.pro) ? `Call ${active.name}` : 'Calls need Pro'}
            className="relative w-11 h-11 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-700 flex items-center justify-center shrink-0"
          >
            <Phone className="w-4 h-4" />
            {!canCall(viewerIsPro, active.pro) && (
              <Crown className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0.5 rounded-full bg-violet-600 text-white" />
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-[#F7F6F3] px-4 py-3 space-y-2">
        <p className="mx-auto w-fit flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#003CF5]" /> Contact details stay private on Aygo
        </p>
        {active.messages.map((m) => (
          <div key={m.id} className={cx('flex flex-col gap-1.5', m.from === 'me' ? 'items-end' : 'items-start')}>
            {m.text && (
              <div className={cx(
                'max-w-[80%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug',
                m.from === 'me' ? 'bg-[#003CF5] text-white rounded-br-md' : 'bg-white text-slate-900 rounded-bl-md shadow-sm'
              )}>
                {m.text}
                <span className={cx('block mt-0.5 text-[10.5px]', m.from === 'me' ? 'text-blue-100' : 'text-slate-400')}>{m.time}</span>
              </div>
            )}
            {m.packages?.length > 0 && (
              <div className="w-[290px] max-w-full space-y-1.5">
                {m.packages.map((pkg) => (
                  <PackageOption
                    key={pkg.tier}
                    pkg={pkg}
                    onChoose={m.from === 'them' && onChoosePackage && !chosen ? (p) => onChoosePackage(active.id, p) : null}
                  />
                ))}
              </div>
            )}
            {m.type === 'selection' && (
              <SelectionCard m={m} canPay={m.from === 'me'} onPay={(msgId, method) => onPayPackage(active.id, msgId, method)} />
            )}
          </div>
        ))}
        {active.typing && <p className="text-[12px] text-slate-500">{active.name} is typing…</p>}
        <div ref={endRef} />
      </div>

      {onSendPackages && (
        <div className="px-3 pt-2">
          <Chip icon={Gift} onClick={() => onSendPackages(active.id)}>Send our packages</Chip>
        </div>
      )}
      <div className="flex items-center gap-2 px-3 pt-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={`Message ${active.name}`}
          aria-label="Message"
          className="py-2.5"
        />
        <button
          type="button"
          onClick={send}
          disabled={!draft.trim()}
          aria-label="Send"
          className="w-11 h-11 rounded-full bg-[#003CF5] text-white flex items-center justify-center shrink-0 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


