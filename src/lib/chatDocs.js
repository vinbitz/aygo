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
