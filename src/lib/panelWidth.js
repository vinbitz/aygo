// Website only: how wide the floating side panel is (organizer home and supplier map).
// Stored as a CSS variable on <html>, so every panel updates together.
const KEY = 'aygo.panelWidth';
export const PANEL_MIN = 380;
// Upper bound matches the default clamp() in index.css
export const PANEL_MAX = 760;

export function loadPanelWidth() {
  try {
    const v = Number(localStorage.getItem(KEY));
    return v >= PANEL_MIN && v <= PANEL_MAX ? v : null;
  } catch {
    return null;
  }
}

export function applyPanelWidth(px) {
  const root = document.documentElement;
  if (px) root.style.setProperty('--panel-w', `${px}px`);
  else root.style.removeProperty('--panel-w');
  try {
    if (px) localStorage.setItem(KEY, String(px));
    else localStorage.removeItem(KEY);
  } catch {
    // storage unavailable: keep for this visit
  }
}
