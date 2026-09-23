import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { cx } from './ui';
import { SLOT_HOURS, toSlot, slotLabel, dayKey, nextDays, dayLabel } from '../lib/availability';

const isPast = (day, h) => {
  const now = new Date();
  return dayKey(day) === dayKey(now) && h <= now.getHours();
};

/**
 * Two-week calendar of hourly slots.
 * mode 'edit': toggle your own free slots (value / onChange).
 * mode 'pick': choose one slot from `free` (the other person's); `mine` marks when you're free too.
 */
export default function AvailabilityCalendar({ mode = 'edit', value = {}, onChange, free = {}, mine = {}, picked, onPick }) {
  const days = nextDays(14);
  const firstUseful = mode === 'pick' ? days.find((d) => (free[dayKey(d)] || []).length) || days[0] : days[0];
  const [active, setActive] = useState(dayKey(firstUseful));
  const activeDay = days.find((d) => dayKey(d) === active) || days[0];
  const daySlots = (mode === 'edit' ? value : free)[active] || [];

  const toggle = (slot) => {
    const next = daySlots.includes(slot) ? daySlots.filter((s) => s !== slot) : [...daySlots, slot].sort();
    const copy = { ...value };
    if (next.length) copy[active] = next;
    else delete copy[active];
    onChange(copy);
  };

  const setDay = (slots) => {
    const copy = { ...value };
    if (slots.length) copy[active] = slots;
    else delete copy[active];
    onChange(copy);
  };

  const hours = SLOT_HOURS.filter((h) => !isPast(activeDay, h));

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {days.map((d) => {
          const key = dayKey(d);
          const count = ((mode === 'edit' ? value : free)[key] || []).length;
          const selected = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              aria-pressed={selected}
              aria-label={`${dayLabel(d, { weekday: 'long', month: 'long', day: 'numeric' })}, ${count} free ${count === 1 ? 'slot' : 'slots'}`}
              className={cx(
                'shrink-0 w-14 rounded-2xl py-2 flex flex-col items-center transition-colors',
                selected ? 'bg-[#003CF5] text-white' : 'bg-[#F4F3F0] text-slate-700 hover:bg-[#ECEAE5]'
              )}
            >
              <span className={cx('text-[11px]', selected ? 'text-blue-100' : 'text-slate-500')}>{dayLabel(d, { weekday: 'short' })}</span>
              <span className="text-[17px] font-semibold leading-tight">{d.getDate()}</span>
              <span className={cx('mt-1 w-1.5 h-1.5 rounded-full', count ? (selected ? 'bg-white' : 'bg-emerald-500') : 'bg-transparent')} />
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-slate-700">{dayLabel(activeDay, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        {mode === 'edit' && hours.length > 0 && (
          <div className="flex gap-3 text-[12px] font-medium">
            <button type="button" className="text-[#003CF5] h-8" onClick={() => setDay(hours.filter((h) => h >= 9 && h <= 17).map(toSlot))}>Office hours</button>
            <button type="button" className="text-slate-500 h-8" onClick={() => setDay([])}>Clear</button>
          </div>
        )}
      </div>

      {hours.length === 0 ? (
        <p className="mt-2 text-[13px] text-slate-500">No more slots today. Pick another day.</p>
      ) : mode === 'pick' && daySlots.length === 0 ? (
        <p className="mt-2 text-[13px] text-slate-500">Not free this day. Days with a green dot have open times.</p>
      ) : (
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
          {hours.map((h) => {
            const slot = toSlot(h);
            if (mode === 'pick') {
              if (!daySlots.includes(slot)) return null;
              const both = (mine[active] || []).includes(slot);
              const isPicked = picked?.day === active && picked?.slot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onPick({ day: active, slot })}
                  aria-pressed={isPicked}
                  className={cx(
                    'h-12 rounded-xl text-[13px] font-medium border transition-colors flex flex-col items-center justify-center leading-tight',
                    isPicked ? 'bg-[#003CF5] border-[#003CF5] text-white' : 'border-slate-200 text-slate-800 hover:bg-slate-50'
                  )}
                >
                  {slotLabel(slot)}
                  {both && <span className={cx('text-[10.5px]', isPicked ? 'text-blue-100' : 'text-emerald-700')}>You're free</span>}
                </button>
              );
            }
            const on = daySlots.includes(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => toggle(slot)}
                aria-pressed={on}
                className={cx(
                  'h-11 rounded-xl text-[13px] font-medium border transition-colors inline-flex items-center justify-center gap-1',
                  on ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                )}
              >
                {on && <Check className="w-3.5 h-3.5" />}
                {slotLabel(slot)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
