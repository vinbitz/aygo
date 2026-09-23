import React from 'react';
import { cx } from './cx';

/** Segmented control. tabs: [{ id, label, icon? }] */
export default function Tabs({ tabs, value, onChange, className }) {
  return (
    <div role="tablist" className={cx('flex gap-1 p-1 rounded-2xl bg-[#F4F3F0] overflow-x-auto no-scrollbar', className)}>
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = id === value;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={cx(
              'flex-1 shrink-0 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all',
              active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
