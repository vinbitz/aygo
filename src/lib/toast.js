// Minimal app-wide toast notifications. Call toast('message') from anywhere;
// <Toaster /> (mounted once in App) renders them.
const listeners = new Set();
let nextId = 1;

export function toast(message) {
  const item = { id: nextId++, message: String(message) };
  listeners.forEach((listener) => listener(item));
}

export function subscribeToasts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
