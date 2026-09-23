import React from 'react';
import { X, FileText, Download, Crown } from 'lucide-react';
import { Chip } from './ui';
import { usePro } from '../state/pro';
import { downloadDocument } from '../lib/chatDocs';

/** Chat shortcut for a Pro tool, with the free tries left (3 on the Free plan) */
export function ProChip({ feature, icon, children, onClick, gateOnClick = true, plan = 'organizer' }) {
  const pro = usePro();
  const left = pro.remaining(feature);
  return (
    <Chip icon={icon} onClick={() => (gateOnClick ? pro.gate(feature, onClick, plan) : onClick())}>
      <span className="inline-flex items-center gap-1.5">
        {children}
        {left !== Infinity && (
          left > 0
            ? <span className="rounded-full bg-violet-100 text-violet-700 px-1.5 text-[10.5px] font-semibold leading-4">{left} free</span>
            : <Crown className="w-3.5 h-3.5 text-violet-600" aria-label="Pro" />
        )}
      </span>
    </Chip>
  );
}

/** Pick a document to generate and send in the chat */
export function DocumentPicker({ docs, subtitle, onPick, onClose }) {
  return (
    <div className="absolute inset-0 z-10 bg-white flex flex-col animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-semibold text-slate-900">Send a document</p>
          <p className="text-[13px] text-slate-500 truncate">{subtitle}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="w-11 h-11 rounded-full hover:bg-[#F4F3F0] flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto px-2 py-2">
        {docs.map((d) => (
          <li key={d.id}>
            <button type="button" onClick={() => onPick(d)} className="w-full flex items-center gap-3 rounded-2xl p-3 text-left hover:bg-[#F4F3F0]">
              <span className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0"><FileText className="w-5 h-5" /></span>
              <span className="min-w-0">
                <span className="block text-[15px] font-medium text-slate-900">{d.name}</span>
                <span className="block text-[13px] text-slate-500">{d.meta}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="px-4 pb-4 text-[12px] text-slate-500">Filled in from this chat, with your own name and contact. Free plan: 3 documents, then Go Pro.</p>
    </div>
  );
}

/** Generated document, shown in the chat */
export function DocumentCard({ doc }) {
  return (
    <div className="w-[280px] max-w-full rounded-2xl bg-white border border-slate-200/80 p-3 flex items-center gap-3 text-left">
      <span className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0"><FileText className="w-5 h-5" /></span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-slate-900 truncate">{doc.name}</p>
        <p className="text-[12px] text-slate-500 truncate">{doc.meta}</p>
      </div>
      <button
        type="button"
        onClick={() => downloadDocument(doc, [doc.meta])}
        aria-label={`Download ${doc.name}`}
        className="w-10 h-10 rounded-full hover:bg-[#F4F3F0] text-slate-600 flex items-center justify-center shrink-0"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

/** Shown at the top of a Pro tool opened on the Free plan: look around freely, saving uses a free try */
export function ProPreviewBanner({ feature, plan = 'organizer', action }) {
  const pro = usePro();
  const left = pro.remaining(feature);
  if (left === Infinity) return null;
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl bg-violet-50 px-4 py-3">
      <Crown className="w-5 h-5 text-violet-700 shrink-0" />
      <p className="flex-1 min-w-0 text-[13px] text-violet-900 leading-snug">
        <span className="font-semibold">Preview.</span>{' '}
        {left > 0
          ? `Look around for free. ${action} uses 1 of your ${left} free ${left === 1 ? 'try' : 'tries'} left.`
          : `You've used your free tries. Go Pro to ${action.toLowerCase()}.`}
      </p>
      <button type="button" onClick={() => pro.openPaywall(feature, plan)} className="h-9 px-3 rounded-full bg-white text-[13px] font-semibold text-violet-700 shrink-0">
        Go Pro
      </button>
    </div>
  );
}
