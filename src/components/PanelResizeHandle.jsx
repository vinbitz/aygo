import React, { useRef } from 'react';
import { PANEL_MIN, PANEL_MAX, applyPanelWidth } from '../lib/panelWidth';

// Measure the panel itself (its default width is responsive, not a fixed number)
const currentWidth = (el) => el?.closest('[data-panel]')?.getBoundingClientRect().width || 460;

/**
 * The small line at the top of the panel. On phones it's just the sheet handle;
 * on the website, drag it left or right to make the panel narrower or wider (double-click resets).
 */
export default function PanelResizeHandle({ className = '' }) {
  const drag = useRef(null);

  const onPointerDown = (e) => {
    if (window.innerWidth < 1024) return;
    drag.current = { x: e.clientX, w: currentWidth(e.currentTarget) };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    // The handle sits in the middle of the panel, so moving it 1px widens the panel 2px
    const next = Math.round(Math.min(PANEL_MAX, Math.max(PANEL_MIN, drag.current.w + (e.clientX - drag.current.x) * 2)));
    applyPanelWidth(next);
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const step = e.key === 'ArrowRight' ? 20 : -20;
    applyPanelWidth(Math.round(Math.min(PANEL_MAX, Math.max(PANEL_MIN, currentWidth(e.currentTarget) + step))));
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Drag to resize the panel"
        title="Drag to resize · double-click to reset"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => applyPanelWidth(null)}
        onKeyDown={onKeyDown}
        className="group lg:cursor-ew-resize touch-none px-4 py-1.5 -my-1.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003CF5]/40"
      >
        <div className="w-9 h-1 bg-slate-200 rounded-full transition-colors lg:group-hover:bg-[#003CF5]/60 lg:group-active:bg-[#003CF5]" />
      </div>
    </div>
  );
}
