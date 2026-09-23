import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { cx } from './cx';

const TONES = {
  blue: 'bg-blue-50 text-[#003CF5]',
  green: 'bg-emerald-50 text-emerald-700',
  solidGreen: 'bg-emerald-600 text-white',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-600',
  violet: 'bg-violet-50 text-violet-700',
  slate: 'bg-[#F4F3F0] text-slate-600',
  dark: 'bg-slate-900 text-white',
};

export function Badge({ tone = 'slate', icon: Icon, className, children }) {
  return (
    <span className={cx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap', TONES[tone], className)}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}

/** The Aygo verified-supplier mark */
export function VerifiedBadge({ label = 'Verified', className }) {
  return (
    <Badge tone="blue" icon={BadgeCheck} className={className}>
      {label}
    </Badge>
  );
}
