import React from 'react';
import { cx } from './cx';

/** Titled block inside a sheet or page */
export default function Section({ title, action, className, children }) {
  return (
    <section className={cx('py-3', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-2 mb-2">
          {title && <h3 className="text-[13px] font-semibold text-slate-500">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Soft grey panel for grouped content */
export function Panel({ className, children }) {
  return <div className={cx('rounded-2xl bg-[#F4F3F0] p-4', className)}>{children}</div>;
}
