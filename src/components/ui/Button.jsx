import React from 'react';
import { cx } from './cx';

const VARIANTS = {
  primary: 'bg-[#003CF5] hover:bg-[#0030c7] text-white shadow-sm shadow-blue-600/20',
  secondary: 'bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-900',
  outline: 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-900',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
  danger: 'bg-red-50 hover:bg-red-100 text-red-600',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-[13px] rounded-xl gap-1.5',
  md: 'h-11 px-4 text-[14px] rounded-2xl gap-2',
  lg: 'h-[52px] px-5 text-[15px] rounded-2xl gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all active:scale-[0.98]',
        'disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003CF5]/40',
        VARIANTS[variant],
        SIZES[size],
        full && 'w-full',
        className
      )}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
      {IconRight && <IconRight className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
    </button>
  );
}
