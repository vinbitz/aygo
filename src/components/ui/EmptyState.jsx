import React from 'react';
import IconCircle from './IconCircle';

export default function EmptyState({ icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6">
      {icon && <IconCircle icon={icon} size="lg" tone="slate" />}
      <p className="mt-3 text-[15px] font-semibold text-slate-900">{title}</p>
      {text && <p className="mt-1 text-[13px] text-slate-500 max-w-xs">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
