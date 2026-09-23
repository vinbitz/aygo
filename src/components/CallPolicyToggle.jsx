import React, { useState } from 'react';
import { PhoneIncoming, MessageSquare } from 'lucide-react';
import { cx } from './ui';
import { getCallPolicy, setCallPolicy } from '../lib/callPrefs';
import { toast } from '../lib/toast';

/** "They can call you any time" setting, shown wherever people edit their profile or availability */
export default function CallPolicyToggle({ className }) {
  const [policy, setPolicy] = useState(getCallPolicy);
  const anytime = policy === 'anytime';

  const toggle = () => {
    const next = anytime ? 'chat-first' : 'anytime';
    setPolicy(next);
    setCallPolicy(next);
    toast(next === 'anytime' ? 'People can call you any time.' : 'People need to chat with you first before calling.');
  };

  return (
    <div className={cx('rounded-2xl border border-slate-200 p-3.5', className)}>
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-full bg-blue-50 text-[#003CF5] flex items-center justify-center shrink-0">
          {anytime ? <PhoneIncoming className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-slate-900">They can call you any time</p>
          <p className="text-[12.5px] text-slate-500 leading-snug">
            {anytime
              ? 'On: people who can make calls can ring you right away.'
              : 'Off: they need to chat with you first, even if they have Pro. Booked calls still work.'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={anytime}
          aria-label="They can call you any time"
          onClick={toggle}
          className={cx('relative w-12 h-7 rounded-full shrink-0 transition-colors', anytime ? 'bg-[#003CF5]' : 'bg-slate-300')}
        >
          <span className={cx('absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform', anytime && 'translate-x-5')} />
        </button>
      </div>
    </div>
  );
}
