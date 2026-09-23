import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Mic, MicOff, Volume2, PhoneOff, ShieldCheck, Crown } from 'lucide-react';
import { cx } from './ui';
import { callLength as clock } from '../lib/calls';

/**
 * In-app voice call. Numbers are never shown to either side.
 * proNote says whose Pro plan unlocked the call, e.g. "You have Pro".
 */
export default function CallScreen({ name, subtitle, initial, proNote, onEnd }) {
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!connected) return undefined;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onEnd(seconds);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onEnd, seconds]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`Call with ${name}`} className="fixed inset-0 z-[70] bg-[#0A1A4A] text-white flex flex-col animate-fade-in">
      <div className="desk-zoom flex-1 flex flex-col items-center justify-between px-6 pt-24 pb-[max(40px,env(safe-area-inset-bottom))]">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] text-blue-100">
            <Crown className="w-3.5 h-3.5 text-amber-300" /> Aygo Pro call · {proNote}
          </span>
          <span className={cx('mt-10 w-28 h-28 rounded-full bg-[#003CF5] flex items-center justify-center text-[44px] font-semibold', !connected && 'animate-pulse')}>
            {initial}
          </span>
          <h2 className="mt-5 text-[24px] font-semibold">{name}</h2>
          {subtitle && <p className="text-[15px] text-blue-100/80">{subtitle}</p>}
          <p className="mt-3 text-[17px] tabular-nums text-blue-100">{connected ? clock(seconds) : 'Calling…'}</p>
        </div>

        <div className="w-full max-w-xs">
          <p className="mb-8 flex items-center justify-center gap-1.5 text-[12px] text-blue-100/70">
            <ShieldCheck className="w-3.5 h-3.5" /> In-app call. Phone numbers stay private.
          </p>
          <div className="flex items-center justify-between">
            <CallButton label={muted ? 'Unmute' : 'Mute'} active={muted} onClick={() => setMuted((v) => !v)} icon={muted ? MicOff : Mic} />
            <button
              type="button"
              onClick={() => onEnd(seconds)}
              aria-label="End call"
              className="w-[72px] h-[72px] rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center shadow-lg active:scale-95 transition"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <CallButton label="Speaker" active={speaker} onClick={() => setSpeaker((v) => !v)} icon={Volume2} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function CallButton({ label, active, onClick, icon: Icon }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="flex flex-col items-center gap-2">
      <span className={cx('w-14 h-14 rounded-full flex items-center justify-center transition-colors', active ? 'bg-white text-[#0A1A4A]' : 'bg-white/15 hover:bg-white/25')}>
        <Icon className="w-6 h-6" />
      </span>
      <span className="text-[12px] text-blue-100">{label}</span>
    </button>
  );
}
