import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cx } from './cx';

const WIDTHS = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

/**
 * Standard popup shell: a bottom sheet on phones, a centered dialog on larger screens.
 * Header (icon, title, subtitle, close), scrollable body, optional sticky footer.
 */
export default function Sheet({
  onClose,
  title,
  subtitle,
  icon: Icon,
  headerAction,
  footer,
  size = 'md',
  bodyClassName,
  children,
}) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cx(
          'relative w-full bg-white flex flex-col max-h-[92vh] sm:max-h-[88vh]',
          'rounded-t-[28px] sm:rounded-[28px] shadow-2xl animate-sheet-up sm:animate-pop-in',
          WIDTHS[size] || WIDTHS.md
        )}
      >
        <div className="sm:hidden flex justify-center pt-2.5">
          <div className="w-9 h-1 rounded-full bg-slate-200" />
        </div>

        {(title || Icon) && (
          <header className="flex items-start gap-3 px-5 pt-3 sm:pt-5 pb-3">
            {Icon && (
              <span className="w-10 h-10 rounded-full bg-blue-50 text-[#003CF5] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </span>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-[19px] font-semibold text-slate-900 tracking-tight leading-tight">{title}</h2>
              {subtitle && <p className="mt-0.5 text-[13px] text-slate-500 leading-snug">{subtitle}</p>}
            </div>
            {headerAction}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 -mr-1 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-700 flex items-center justify-center shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </header>
        )}

        <div className={cx('flex-1 overflow-y-auto overscroll-contain px-5 pb-5', bodyClassName)}>
          {children}
        </div>

        {footer && (
          <footer className="px-5 py-3.5 border-t border-slate-100 bg-white rounded-b-none sm:rounded-b-[28px] pb-[max(14px,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
