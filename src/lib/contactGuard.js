// Hides phone numbers, emails and "message me on…" handles typed in Aygo Chat,
// so deals and payments stay inside the app where orders are protected.
const PATTERNS = [
  /[\w.+-]+@[\w-]+\.[\w.]+/g, // emails
  /(?:\+?63|0)\s?9\d{2}[\s-]?\d{3}[\s-]?\d{4}/g, // PH mobile numbers
  /\b\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4}\b/g, // other long numbers split in groups
  /(?:viber|whatsapp|telegram|wechat|messenger|fb\.me|m\.me|t\.me|wa\.me)[\s:/]*[@\w./-]+/gi, // off-app handles
];

export function maskContactInfo(text) {
  let masked = text;
  let found = false;
  for (const re of PATTERNS) {
    masked = masked.replace(re, () => {
      found = true;
      return '[hidden by Aygo]';
    });
  }
  return { text: masked, found };
}

// Softer check for form fields like billing details, where long numbers (TIN) are expected:
// only emails, mobile numbers and off-app chat handles are hidden
export function maskDirectContact(text) {
  let masked = text;
  let found = false;
  for (const re of [PATTERNS[0], PATTERNS[1], PATTERNS[3]]) {
    masked = masked.replace(re, () => {
      found = true;
      return '[hidden by Aygo]';
    });
  }
  return { text: masked, found };
}
