import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Send, Building2, GraduationCap, MessagesSquare, ShieldCheck } from 'lucide-react';
import { Input, EmptyState, cx } from './ui';
import { maskContactInfo } from '../lib/contactGuard';
import { toast } from '../lib/toast';

/**
 * Brand ↔ organizer chat inside Sponsorship Connect.
 * threads: [{ id, name, subtitle, kind: 'brand'|'organizer', messages: [{ id, from: 'me'|'them', text, time }] }]
 */
export default function SponsorChat({ threads, activeId, onOpen, onBack, onSend }) {
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
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold text-slate-900 truncate">{active.name}</span>
          <span className="block text-[12px] text-slate-500 truncate">{active.subtitle}</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#F7F6F3] px-4 py-3 space-y-2">
        <p className="mx-auto w-fit flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#003CF5]" /> Contact details stay private on Aygo
        </p>
        {active.messages.map((m) => (
          <div key={m.id} className={cx('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
            <div className={cx(
              'max-w-[80%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug',
              m.from === 'me' ? 'bg-[#003CF5] text-white rounded-br-md' : 'bg-white text-slate-900 rounded-bl-md shadow-sm'
            )}>
              {m.text}
              <span className={cx('block mt-0.5 text-[10.5px]', m.from === 'me' ? 'text-blue-100' : 'text-slate-400')}>{m.time}</span>
            </div>
          </div>
        ))}
        {active.typing && <p className="text-[12px] text-slate-500">{active.name} is typing…</p>}
        <div ref={endRef} />
      </div>

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


