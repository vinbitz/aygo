// Who can call you: 'anytime' (anyone who can make calls) or 'chat-first' (only after you've chatted)
const KEY = 'aygo.callPolicy';

export function getCallPolicy() {
  try {
    return localStorage.getItem(KEY) === 'chat-first' ? 'chat-first' : 'anytime';
  } catch {
    return 'anytime';
  }
}

export function setCallPolicy(policy) {
  try {
    localStorage.setItem(KEY, policy);
  } catch {
    // storage unavailable: keep for this visit
  }
}

/**
 * Whether a call can start now, given the other person's setting and the chat so far.
 * `mine` / `theirs` are how the thread marks each side's messages.
 */
export function chattedEnough(messages = [], isMine) {
  const fromMe = messages.some((m) => isMine(m) && m.text);
  const fromThem = messages.some((m) => !isMine(m) && m.text);
  return fromMe && fromThem;
}
