// Sponsorship package amounts are free text ("PHP 35,000 (or In-Kind)", "50000", "In-kind")
export function packageAmount(amount) {
  const match = String(amount || '').replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

export const SPONSOR_PAY_METHODS = ['GCash', 'Maya', 'Card', 'Bank transfer'];
