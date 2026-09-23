import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { subscribeToasts } from '../lib/toast';

const TOAST_DURATION_MS = 4000;

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => subscribeToasts((item) => {
    setToasts((prev) => [...prev.slice(-2), item]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== item.id));
    }, TOAST_DURATION_MS);
  }), []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div
      aria-live="polite"
      className="fixed z-[100] top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-sm flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl text-[14px] leading-snug"
        >
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="shrink-0 -mr-1 p-0.5 rounded-full text-slate-400 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
