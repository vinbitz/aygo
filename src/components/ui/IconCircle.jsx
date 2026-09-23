import React from 'react';
import { cx } from './cx';

export const TINTS = {
  blue: 'bg-blue-50 text-[#003CF5]',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-500',
  slate: 'bg-[#F4F3F0] text-slate-700',
  solid: 'bg-[#003CF5] text-white',
};

/** Soft tinted circle holding an icon, used as the leading visual in rows and cards */
export default function IconCircle({ icon: Icon, tone = 'blue', size = 'md', className }) {
  const dims = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconDims = size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <span className={cx('rounded-full flex items-center justify-center shrink-0', dims, TINTS[tone], className)}>
      <Icon className={iconDims} />
    </span>
  );
}
