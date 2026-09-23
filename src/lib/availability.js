// Free time slots, stored per day: { '2026-09-24': ['09:00', '14:00'] }
const KEY = 'aygo.availability';

export const SLOT_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
export const slotLabel = (slot) => {
  const h = Number(slot.slice(0, 2));
  return `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`;
};
export const toSlot = (h) => `${String(h).padStart(2, '0')}:00`;

export const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export function nextDays(count = 14, from = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    return d;
  });
}

export const dayLabel = (d, opts = { weekday: 'short', month: 'short', day: 'numeric' }) => d.toLocaleDateString('en-US', opts);

export function loadAvailability() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved === 'object') return saved;
  } catch {
    // storage unavailable
  }
  return {};
}

export function saveAvailability(value) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // storage unavailable: keep for this visit
  }
}

// Only today onward counts
export function upcomingSlotCount(value) {
  const today = dayKey(new Date());
  return Object.entries(value).filter(([k]) => k >= today).reduce((n, [, slots]) => n + slots.length, 0);
}

/** Demo availability for another person: weekdays, a stable pattern from their name */
export function demoAvailability(name = '') {
  let seed = [...name].reduce((n, c) => n + c.charCodeAt(0), 0);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const out = {};
  nextDays(14).forEach((d, i) => {
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    if (i === 0 || (weekend && rand() < 0.7)) return;
    const slots = SLOT_HOURS.filter((h) => h >= 9 && h <= 18 && rand() < 0.45).map(toSlot);
    if (slots.length) out[dayKey(d)] = slots;
  });
  return out;
}
