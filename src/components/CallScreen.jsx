import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Mic, MicOff, Volume2, PhoneOff, ShieldCheck, Crown, Video, VideoOff, SwitchCamera } from 'lucide-react';
import { cx } from './ui';
import { callLength as clock } from '../lib/calls';
import { toast } from '../lib/toast';

/**
 * In-app voice or video call. Numbers are never shown to either side.
 * proNote says whose Pro plan unlocked the call, e.g. "You have Pro".
 * video: start with the camera on. The back camera is handy for showing a venue during event setup.
 */
export default function CallScreen({ name, subtitle, initial, proNote, onEnd, video = false }) {
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [camOn, setCamOn] = useState(video);
  const [facing, setFacing] = useState('user');
  const videoRef = useRef(null);

  // Open the camera while it's on; stop it when turned off or the call ends
  useEffect(() => {
    if (!camOn) return undefined;
    let stream = null;
    let cancelled = false;
    if (!navigator.mediaDevices?.getUserMedia) {
      toast('This browser cannot open the camera.');
      setCamOn(false);
      return undefined;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: facing }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {
        if (cancelled) return;
        toast('Camera is blocked. Allow camera access in your browser to show video.');
        setCamOn(false);
      });
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [camOn, facing]);

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
      {camOn && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            aria-label="Your camera"
            className={cx('absolute inset-0 w-full h-full object-cover', facing === 'user' && '-scale-x-100')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        </>
      )}
      <div className="desk-zoom relative flex-1 flex flex-col items-center justify-between px-6 pt-24 pb-[max(40px,env(safe-area-inset-bottom))]">
        {camOn ? (
          <div className="w-full flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-semibold">{name}</h2>
              <p className="text-[14px] tabular-nums text-blue-100">{connected ? clock(seconds) : 'Calling…'}</p>
            </div>
            <span className={cx('w-24 h-32 rounded-2xl bg-[#003CF5] flex items-center justify-center text-[36px] font-semibold shadow-lg shrink-0', !connected && 'animate-pulse')}>
              {initial}
            </span>
          </div>
        ) : (
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
        )}

        <div className="w-full max-w-sm">
          <p className="mb-6 flex items-center justify-center gap-1.5 text-[12px] text-blue-100/80">
            <ShieldCheck className="w-3.5 h-3.5" /> In-app call. Phone numbers stay private.
          </p>
          {camOn && (
            <div className="mb-5 flex justify-center">
              <button
                type="button"
                onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white/15 hover:bg-white/25 text-[13px] font-medium"
              >
                <SwitchCamera className="w-4 h-4" /> {facing === 'user' ? 'Show the venue (back camera)' : 'Front camera'}
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <CallButton label={muted ? 'Unmute' : 'Mute'} active={muted} onClick={() => setMuted((v) => !v)} icon={muted ? MicOff : Mic} />
            <CallButton label={camOn ? 'Camera off' : 'Camera'} active={camOn} onClick={() => setCamOn((v) => !v)} icon={camOn ? Video : VideoOff} />
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
