import React from 'react';
import { cx } from './cx';

export const inputClass =
  'w-full rounded-2xl bg-[#F4F3F0] border border-transparent px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 ' +
  'focus:bg-white focus:border-[#003CF5] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-colors';

export function Field({ label, hint, error, children, className }) {
  return (
    <label className={cx('block', className)}>
      {label && <span className="block mb-1.5 text-[13px] font-medium text-slate-700">{label}</span>}
      {children}
      {error ? (
        <span className="block mt-1 text-[12px] text-red-600">{error}</span>
      ) : hint ? (
        <span className="block mt-1 text-[12px] text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...props }) {
  return <input className={cx(inputClass, className)} {...props} />;
}

export function Textarea({ className, rows = 3, ...props }) {
  return <textarea rows={rows} className={cx(inputClass, 'resize-none', className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cx(inputClass, 'appearance-none pr-10 bg-[url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27none%27 stroke=%27%2364748b%27 stroke-width=%272%27 viewBox=%270 0 24 24%27><path d=%27m6 9 6 6 6-6%27/></svg>")] bg-no-repeat bg-[right_14px_center]', className)} {...props}>
      {children}
    </select>
  );
}
