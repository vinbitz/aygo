import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cx } from './cx';
import IconCircle from './IconCircle';

/** Tappable row: leading icon, title/subtitle, trailing content (defaults to a chevron) */
export default function ListRow({ icon, tone, title, subtitle, trailing, onClick, className }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'w-full flex items-center gap-3 py-3 text-left',
        onClick && 'rounded-2xl -mx-2 px-2 hover:bg-[#F4F3F0] transition-colors',
        className
      )}
    >
      {icon && <IconCircle icon={icon} tone={tone} />}
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-medium text-slate-900 truncate">{title}</span>
        {subtitle && <span className="block text-[13px] text-slate-500 truncate">{subtitle}</span>}
      </span>
      {trailing !== undefined ? trailing : onClick ? <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" /> : null}
    </Tag>
  );
}
