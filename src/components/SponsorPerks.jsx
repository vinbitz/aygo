import React from 'react';
import {
  ThumbsUp, Clapperboard, BadgeCheck, Megaphone, Radio, Store, Mic, Presentation, Gift, Ticket, Contact, Camera, Check,
} from 'lucide-react';
import { Input, Chip, cx } from './ui';
import { SPONSOR_PERKS, LOGO_SPOTS } from '../lib/sponsorPerks';

const ICONS = {
  'fb-likes': ThumbsUp, reels: Clapperboard, logo: BadgeCheck, posts: Megaphone, livestream: Radio, booth: Store,
  stage: Mic, speaking: Presentation, sampling: Gift, raffle: Ticket, leads: Contact, coverage: Camera,
};

/**
 * Picker for what the event gives sponsors.
 * value = { [perkId]: detailString }, logoSpots = [spot]
 */
export function SponsorPerksPicker({ value, onChange, logoSpots, onLogoSpotsChange }) {
  const toggle = (id) => {
    const next = { ...value };
    if (id in next) delete next[id];
    else next[id] = '';
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {SPONSOR_PERKS.map((perk) => {
        const Icon = ICONS[perk.id];
        const on = perk.id in value;
        return (
          <div key={perk.id} className={cx('rounded-2xl border transition-colors', on ? 'border-[#003CF5] bg-blue-50/50' : 'border-slate-200')}>
            <button type="button" onClick={() => toggle(perk.id)} aria-pressed={on} className="w-full flex items-center gap-3 p-3 text-left">
              <span className={cx('w-9 h-9 rounded-full flex items-center justify-center shrink-0', on ? 'bg-[#003CF5] text-white' : 'bg-[#F4F3F0] text-slate-600')}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-medium text-slate-900">{perk.label}</span>
                <span className="block text-[12px] text-slate-500 leading-snug">{perk.hint}</span>
              </span>
              <span className={cx('w-6 h-6 rounded-full flex items-center justify-center shrink-0', on ? 'bg-[#003CF5] text-white' : 'border-2 border-slate-300')}>
                {on && <Check className="w-3.5 h-3.5" />}
              </span>
            </button>
            {on && perk.id === 'logo' && (
              <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                {LOGO_SPOTS.map((spot) => (
                  <Chip
                    key={spot}
                    selected={logoSpots.includes(spot)}
                    onClick={() => onLogoSpotsChange(logoSpots.includes(spot) ? logoSpots.filter((s) => s !== spot) : [...logoSpots, spot])}
                    className="!h-8 text-[12px]"
                  >
                    {spot}
                  </Chip>
                ))}
              </div>
            )}
            {on && perk.detail && (
              <div className="px-3 pb-3">
                <Input
                  value={value[perk.id]}
                  onChange={(e) => onChange({ ...value, [perk.id]: e.target.value })}
                  placeholder={perk.detail}
                  aria-label={`${perk.label} details`}
                  className="py-2.5 bg-white"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Read-only list of what sponsors get */
export function SponsorPerksList({ value = {}, logoSpots = [], compact = false }) {
  const chosen = SPONSOR_PERKS.filter((p) => p.id in value);
  if (!chosen.length) return null;
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {chosen.map((p) => {
          const Icon = ICONS[p.id];
          return (
            <span key={p.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[12px] font-medium text-[#003CF5]">
              <Icon className="w-3 h-3" /> {p.label}{value[p.id] ? ` · ${value[p.id]}` : ''}
            </span>
          );
        })}
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {chosen.map((p) => {
        const Icon = ICONS[p.id];
        const extra = p.id === 'logo' && logoSpots.length ? logoSpots.join(', ') : value[p.id];
        return (
          <li key={p.id} className="flex items-start gap-2.5">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-[#003CF5] flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
            <span className="min-w-0">
              <span className="block text-[14px] font-medium text-slate-900">{p.label}</span>
              {extra && <span className="block text-[13px] text-slate-500">{extra}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
