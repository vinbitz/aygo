import React, { useEffect, useState } from 'react';
import { MoveHorizontal, RotateCcw } from 'lucide-react';
import { PANEL_MIN, PANEL_MAX, loadPanelWidth, applyPanelWidth } from '../lib/panelWidth';

/** Website only: slider that makes the side panel wider or narrower */
export default function PanelWidthSlider() {
  const [width, setWidth] = useState(() => loadPanelWidth());
  const current = width || (typeof window !== 'undefined' && window.innerWidth >= 1536 ? 520 : 460);

  useEffect(() => {
    applyPanelWidth(width);
  }, [width]);

  return (
    <div className="hidden lg:flex items-center gap-2.5 rounded-full bg-white/95 shadow border border-slate-200/80 pl-3 pr-1.5 h-10">
      <MoveHorizontal className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
      <label htmlFor="panel-width" className="text-[12px] font-medium text-slate-600 whitespace-nowrap">Panel width</label>
      <input
        id="panel-width"
        type="range"
        min={PANEL_MIN}
        max={PANEL_MAX}
        step={20}
        value={current}
        onChange={(e) => setWidth(Number(e.target.value))}
        className="flex-1 min-w-0 accent-[#003CF5] cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003CF5]/40"
        aria-valuetext={`${current} pixels`}
      />
      <button
        type="button"
        onClick={() => setWidth(null)}
        disabled={!width}
        aria-label="Reset panel width"
        title="Reset"
        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-[#F4F3F0] disabled:opacity-30"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
