// Documents for a supply order and for a sponsorship deal
export const ORDER_DOCS = [
  { id: 'rfq', name: 'Request for quotation', meta: 'Specs, quantity, deadline and venue' },
  { id: 'po', name: 'Purchase order', meta: 'Confirms the price, quantity and delivery' },
  { id: 'invoice', name: 'Invoice', meta: 'Amount due, downpayment and balance' },
  { id: 'dr', name: 'Delivery receipt', meta: 'For counting and signing on delivery day' },
  { id: 'compare', name: 'Offer comparison sheet', meta: 'All offers side by side for approval' },
];

export const SPONSOR_DOCS = [
  { id: 'proposal', name: 'Sponsorship proposal', meta: 'Event, audience, reach and packages' },
  { id: 'agreement', name: 'Sponsorship agreement', meta: 'Package, perks, payment and deadlines' },
  { id: 'billing', name: 'Billing statement', meta: 'Amount due for the chosen package' },
  { id: 'report', name: 'Post-event report', meta: 'Reach, photos and perks delivered' },
];

// Builds a simple printable page for a generated document and downloads it
export function downloadDocument({ name, meta, url }, details = []) {
  const a = document.createElement('a');
  if (url) {
    a.href = url;
    a.download = name;
  } else {
    const title = name.replace(/\.pdf$/i, '');
    const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    const rows = details.filter(Boolean).map((d) => `<li>${esc(d)}</li>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;color:#0f172a}h1{font-size:22px}p{color:#475569}li{margin:6px 0}</style></head>
<body><h1>${esc(title)}</h1><p>${esc(meta || '')}</p><ul>${rows}</ul>
<p style="margin-top:32px;font-size:12px">Made with Aygo · ${new Date().toLocaleDateString('en-PH')}. Print or save as PDF.</p></body></html>`;
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `${title}.html`;
  }
  document.body.appendChild(a);
  a.click();
  a.remove();
}
