import React from 'react';
import { cx } from './cx';

/** Selectable pill used for filters, categories and quick options */
export default function Chip({ selected = false, icon: Icon, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        'shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-medium transition-colors active:scale-95',
        selected ? 'bg-slate-900 text-white' : 'bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-800',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
