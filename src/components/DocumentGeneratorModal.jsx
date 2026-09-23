import React, { useState } from 'react';
import {
  FileText,
  Download,
  MessageSquare,
  Upload,
  ImagePlus,
  Trash2,
  ClipboardList,
  ShoppingCart,
  Receipt,
  Scale,
  Truck,
  ListChecks,
  FileSpreadsheet,
  FileSignature
} from 'lucide-react';
import { toast } from '../lib/toast';
import { downloadDocument } from '../lib/chatDocs';
import { usePro } from '../state/pro';
import { ProPreviewBanner } from './ChatTools';
import { INITIAL_REQUESTS } from '../data/mockData';
import { Sheet, Button, Field, Input, Tabs, Chip, cx } from './ui';

const REQUEST = INITIAL_REQUESTS[0];
const peso = (n) => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const DATE = 'September 23, 2026';

const LINE_ITEMS = [
  { desc: 'Customized satin lanyard, 20mm, 2-sided sublimation', qty: 300, unit: 46 },
  { desc: 'Metal trigger hook + safety breakaway clip', qty: 300, unit: 0 },
  { desc: 'Delivery to venue (Metro Manila)', qty: 1, unit: 0 }
];
const subtotal = LINE_ITEMS.reduce((s, i) => s + i.qty * i.unit, 0);

const EVENT_SUPPLIES = [
  ['Satin lanyards', '300 pcs', 'JJT Digital', 'Confirmed'],
  ['Event shirts (navy, 220 GSM)', '300 pcs', 'Thread & Co.', 'In production'],
  ['Canvas tote bags', '300 pcs', 'Manila Bag Works', 'Bidding'],
  ['VIP engraved tumblers', '80 pcs', 'Everyday Drinkware', 'Bidding'],
  ['Roll-up banners', '4 pcs', 'JJT Digital', 'Confirmed']
];

// Content for every document type, built from the mock request data
const DOC_TYPES = [
  {
    id: 'rfq',
    name: 'Request for quotation',
    short: 'RFQ',
    icon: FileSignature,
    desc: 'Spec sheet sent to competing makers',
    prefix: 'RFQ',
    parties: ['Issued by', 'Sent to'],
    counterparty: ['Verified Aygo makers', 'Open bidding pool'],
    columns: ['Item', 'Qty', 'Target price', 'Needed by'],
    rows: [[REQUEST.specs, `${REQUEST.quantity} pcs`, `${peso(REQUEST.targetPricePerUnit)}/pc`, REQUEST.deliveryDate]],
    notes: 'Please include lead time, delivery terms and artwork approval timeline in your quotation. Bids close in 48 hours.'
  },
  {
    id: 'quotation',
    name: 'Supplier quotation',
    short: 'Quotation',
    icon: FileText,
    desc: 'Priced offer from a maker to an organizer',
    prefix: 'QT',
    parties: ['From', 'Quoted to'],
    counterparty: [REQUEST.client, REQUEST.location],
    columns: ['Item', 'Qty', 'Unit price', 'Amount'],
    rows: LINE_ITEMS.map((i) => [i.desc, i.qty, i.unit ? peso(i.unit) : 'Included', i.unit ? peso(i.qty * i.unit) : '—']),
    totals: [['Total', peso(subtotal)]],
    notes: 'Valid for 15 days. 50% downpayment to start production, balance on delivery.'
  },
  {
    id: 'pr',
    name: 'Purchase request',
    short: 'Purchase request',
    icon: ClipboardList,
    desc: 'Internal request for budget approval',
    prefix: 'PR',
    parties: ['Requested by', 'For approval of'],
    counterparty: ['Finance committee', 'Budget line: event swag'],
    columns: ['Item', 'Qty', 'Est. unit cost', 'Est. total'],
    rows: [[REQUEST.title, REQUEST.quantity, peso(REQUEST.targetPricePerUnit), peso(REQUEST.targetBudget)]],
    totals: [['Estimated total', peso(REQUEST.targetBudget)]],
    notes: 'Purpose: attendee kits for the event. Lowest verified bid will be selected.',
    signatures: ['Requested by', 'Approved by']
  },
  {
    id: 'po',
    name: 'Purchase order',
    short: 'Purchase order',
    icon: ShoppingCart,
    desc: 'Order confirmation with agreed terms',
    prefix: 'PO',
    parties: ['Buyer', 'Supplier'],
    counterparty: ['JJT Digital Innovative Print', 'Parañaque City'],
    columns: ['Item', 'Qty', 'Unit price', 'Amount'],
    rows: LINE_ITEMS.map((i) => [i.desc, i.qty, i.unit ? peso(i.unit) : 'Included', i.unit ? peso(i.qty * i.unit) : '—']),
    totals: [['Subtotal', peso(subtotal)], ['Downpayment (50%)', peso(subtotal / 2)], ['Balance on delivery', peso(subtotal / 2)]],
    notes: `Deliver to ${REQUEST.location} on or before October 8, 2026.`,
    signatures: ['Authorized buyer', 'Supplier conforme']
  },
  {
    id: 'comparison',
    name: 'Comparison sheet',
    short: 'Comparison',
    icon: Scale,
    desc: 'Bids side by side: price, lead time, terms',
    prefix: 'CMP',
    parties: ['Prepared by', 'Request'],
    counterparty: [REQUEST.title, `${REQUEST.bids.length + 1} bids received`],
    columns: ['Maker', 'Unit price', 'Total', 'Lead time'],
    rows: [
      ...REQUEST.bids.map((b) => [b.supplierName, peso(b.pricePerUnit), peso(b.totalPrice), b.leadTime]),
      ['Manila Bag Works & Leathercraft', peso(55), peso(16500), '7 business days']
    ],
    highlightRow: 0,
    notes: 'Recommended: JJT Digital — lowest price and earliest delivery.'
  },
  {
    id: 'delivery',
    name: 'Delivery checklist',
    short: 'Delivery',
    icon: Truck,
    desc: 'On-site receiving checklist',
    prefix: 'DC',
    parties: ['Receiving team', 'Delivered by'],
    counterparty: ['JJT Digital Innovative Print', 'Lalamove MPV'],
    columns: ['Item', 'Expected', 'Received', 'Condition'],
    rows: [
      ['Satin lanyards (boxed per 50)', '300 pcs', '', ''],
      ['Trigger hooks attached', '300 pcs', '', ''],
      ['Spare lanyards', '10 pcs', '', ''],
      ['Delivery receipt signed', '1', '', '']
    ],
    checklist: true,
    signatures: ['Received by', 'Delivered by']
  },
  {
    id: 'event',
    name: 'Event supply checklist',
    short: 'Event supplies',
    icon: ListChecks,
    desc: 'Everything the event needs, in one list',
    prefix: 'ESC',
    parties: ['Organizer', 'Event date and venue'],
    counterparty: ['October 15, 2026', REQUEST.location],
    columns: ['Supply', 'Qty', 'Maker', 'Status'],
    rows: EVENT_SUPPLIES,
    checklist: true
  },
  {
    id: 'invoice',
    name: 'Invoice / receipt',
    short: 'Invoice',
    icon: Receipt,
    desc: 'Billing with VAT and payments',
    prefix: 'INV',
    parties: ['Billed by', 'Bill to'],
    counterparty: [REQUEST.client, REQUEST.location],
    columns: ['Item', 'Qty', 'Unit price', 'Amount'],
    rows: LINE_ITEMS.map((i) => [i.desc, i.qty, i.unit ? peso(i.unit) : 'Included', i.unit ? peso(i.qty * i.unit) : '—']),
    totals: [
      ['Subtotal (VAT exclusive)', peso(subtotal / 1.12)],
      ['VAT 12%', peso(subtotal - subtotal / 1.12)],
      ['Total', peso(subtotal)],
      ['Paid (downpayment)', `− ${peso(subtotal / 2)}`],
      ['Balance due', peso(subtotal / 2)]
    ],
    notes: 'Pay via GCash, Maya or bank transfer. Thank you for sourcing on Aygo.'
  }
];

function DocumentPreview({ doc, brand, logo }) {
  const number = `${doc.prefix}-2026-0911`;
  const [left, right] = doc.parties;
  return (
    <article className="bg-white rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)] p-5 sm:p-8 text-slate-800">
      {/* Letterhead */}
      <header className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3 min-w-0">
          {logo ? (
            <img src={logo} alt="" className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-100 shrink-0" />
          ) : (
            <span className="w-12 h-12 rounded-lg bg-[#F4F3F0] text-slate-500 flex items-center justify-center text-[17px] font-semibold shrink-0">
              {(brand.name || 'A').slice(0, 1)}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-slate-900 truncate">{brand.name || 'Your business name'}</p>
            <p className="text-[12px] text-slate-500 truncate">{brand.address || 'Business address'}</p>
            <p className="text-[12px] text-slate-500 truncate">{brand.contact || 'Email · phone'}</p>
          </div>
        </div>
        <div className="sm:text-right shrink-0">
          <p className="text-[17px] font-semibold text-slate-900 leading-tight">{doc.name}</p>
          <p className="text-[12px] text-slate-500 mt-0.5">No. {number}</p>
          <p className="text-[12px] text-slate-500">{DATE}</p>
        </div>
      </header>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="min-w-0">
          <p className="text-[12px] text-slate-500">{left}</p>
          <p className="text-[13px] font-medium text-slate-900">{brand.name || 'Your business name'}</p>
          <p className="text-[12px] text-slate-500">{brand.address || '—'}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] text-slate-500">{right}</p>
          <p className="text-[13px] font-medium text-slate-900">{doc.counterparty[0]}</p>
          <p className="text-[12px] text-slate-500">{doc.counterparty[1]}</p>
        </div>
      </div>

      {/* Line items */}
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[380px] text-left text-[12px]">
          <thead>
            <tr className="border-y border-slate-200 text-slate-500">
              {doc.checklist && <th className="py-2 pr-2 w-6 font-medium" aria-label="Done" />}
              {doc.columns.map((c, i) => (
                <th key={c} className={cx('py-2 pr-3 font-medium', i > 0 && 'whitespace-nowrap')}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doc.rows.map((row, r) => (
              <tr
                key={r}
                className={cx('border-b border-slate-100 align-top', doc.highlightRow === r && 'bg-blue-50/60')}
              >
                {doc.checklist && (
                  <td className="py-2.5 pr-2">
                    <span className="block w-4 h-4 rounded border border-slate-300" />
                  </td>
                )}
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={cx('py-2.5 pr-3', c === 0 ? 'text-slate-900' : 'whitespace-nowrap text-slate-700')}
                  >
                    {cell === '' ? <span className="inline-block w-14 border-b border-dotted border-slate-300">&nbsp;</span> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {doc.totals && (
        <dl className="mt-3 ml-auto w-full sm:w-64 space-y-1 text-[12px]">
          {doc.totals.map(([label, value], i) => (
            <div
              key={label}
              className={cx(
                'flex justify-between gap-4',
                i === doc.totals.length - 1 && 'pt-1.5 border-t border-slate-200 text-[13px] font-semibold text-slate-900'
              )}
            >
              <dt className={i === doc.totals.length - 1 ? '' : 'text-slate-500'}>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {doc.notes && <p className="mt-5 text-[12px] text-slate-500 leading-relaxed">{doc.notes}</p>}

      {doc.signatures && (
        <div className="mt-8 grid grid-cols-2 gap-6">
          {doc.signatures.map((s) => (
            <div key={s}>
              <div className="h-8 border-b border-slate-300" />
              <p className="mt-1 text-[12px] text-slate-500">{s}</p>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        {/* The issuer's own logo and contact, not Aygo's */}
        <span className="inline-flex items-center gap-1.5 min-w-0">
          {logo
            ? <img src={logo} alt="" className="w-4 h-4 object-contain shrink-0" />
            : <span className="w-4 h-4 rounded bg-slate-200 text-[9px] font-semibold text-slate-600 flex items-center justify-center shrink-0">{(brand.name || '?').slice(0, 1)}</span>}
          <span className="truncate">{[brand.name, brand.contact].filter(Boolean).join(' · ')}</span>
        </span>
        <span>{number}</span>
      </footer>
    </article>
  );
}

export default function DocumentGeneratorModal({ onClose, onAttach, plan = 'organizer' }) {
  const pro = usePro();
  const isPreview = pro.remaining('documents') !== Infinity;
  const [selectedDoc, setSelectedDoc] = useState(DOC_TYPES[0]);
  const [brand, setBrand] = useState({
    name: REQUEST.client,
    address: 'Quezon City, Metro Manila',
    contact: 'events@phtechsummit.example · +63 917 555 0199'
  });
  const [logo, setLogo] = useState(null);
  const [mobileTab, setMobileTab] = useState('edit');

  const updateBrand = (key) => (e) => setBrand((b) => ({ ...b, [key]: e.target.value }));

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Please choose an image file for your logo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <Sheet
      onClose={onClose}
      title="Documents"
      subtitle="Branded quotes, orders and checklists from your requests"
      icon={FileText}
      size="xl"
      footer={
        <div className="flex gap-2 sm:justify-end">
          <Button
            variant="secondary"
            icon={MessageSquare}
            className="flex-1 sm:flex-none"
            onClick={() => pro.gate('documents', () => onAttach?.({ name: `${selectedDoc.name} — ${REQUEST.title}.pdf`, meta: `${selectedDoc.desc} · from ${brand.name}` }), plan)}
          >
            Attach to chat
          </Button>
          <Button
            icon={Download}
            className="flex-1 sm:flex-none"
            onClick={() => pro.gate('documents', () => downloadDocument({ name: `${selectedDoc.name} — ${REQUEST.title}.pdf`, meta: selectedDoc.desc }, [
              `Issued by: ${brand.name}`,
              ...LINE_ITEMS.map((i) => `${i.qty} × ${i.desc}: ${peso(i.qty * i.unit)}`),
              `Total: ${peso(subtotal)}`,
              `Date: ${DATE}`
            ], { issuer: brand.name, contact: [brand.address, brand.contact].filter(Boolean).join(' · '), logo }), plan)}
          >
            Download
          </Button>
        </div>
      }
    >
      <ProPreviewBanner feature="documents" plan={plan} action="Downloading or sending a document" />
      <Tabs
        className="md:hidden mb-4"
        value={mobileTab}
        onChange={setMobileTab}
        tabs={[
          { id: 'edit', label: 'Details', icon: FileSpreadsheet },
          { id: 'preview', label: 'Preview', icon: FileText }
        ]}
      />

      <div className="md:grid md:grid-cols-[300px_1fr] md:gap-6">
        {/* Controls */}
        <div className={cx('space-y-6', mobileTab === 'edit' ? 'block' : 'hidden', 'md:block')}>
          <section>
            <h3 className="text-[13px] font-semibold text-slate-500 mb-2">Document type</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
              {DOC_TYPES.map((doc) => {
                const active = doc.id === selectedDoc.id;
                const Icon = doc.icon;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoc(doc)}
                    aria-pressed={active}
                    className={cx(
                      'flex items-center gap-2.5 min-h-[48px] px-3 py-2 rounded-2xl text-left transition-colors',
                      active ? 'bg-slate-900 text-white' : 'bg-[#F4F3F0] hover:bg-[#ECEAE5] text-slate-900'
                    )}
                  >
                    <Icon className={cx('w-4 h-4 shrink-0', active ? 'text-white' : 'text-slate-500')} />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium leading-tight">{doc.name}</span>
                      <span className={cx('hidden md:block text-[12px] truncate', active ? 'text-white/70' : 'text-slate-500')}>
                        {doc.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-[13px] font-semibold text-slate-500">Your branding</h3>
            <div className="flex items-center gap-3">
              {logo ? (
                <img src={logo} alt="Your logo" className="w-14 h-14 rounded-2xl object-contain bg-[#F4F3F0]" />
              ) : (
                <span className="w-14 h-14 rounded-2xl bg-[#F4F3F0] text-slate-400 flex items-center justify-center">
                  <ImagePlus className="w-6 h-6" />
                </span>
              )}
              <label className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-[14px] font-semibold text-slate-900 cursor-pointer">
                <Upload className="w-4 h-4" />
                {logo ? 'Change logo' : 'Upload logo'}
                <input type="file" accept="image/*" className="sr-only" onChange={handleLogo} />
              </label>
              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  aria-label="Remove logo"
                  className="w-11 h-11 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <Field label="Business or organization name">
              <Input value={brand.name} onChange={updateBrand('name')} placeholder="e.g. ACM Student Chapter" />
            </Field>
            <Field label="Address">
              <Input value={brand.address} onChange={updateBrand('address')} placeholder="City, province" />
            </Field>
            <Field label="Contact details">
              <Input value={brand.contact} onChange={updateBrand('contact')} placeholder="Email · phone" />
            </Field>
          </section>

          <div className="md:hidden">
            <Button variant="outline" full onClick={() => setMobileTab('preview')}>
              See preview
            </Button>
          </div>
        </div>

        {/* Live preview */}
        <div className={cx(mobileTab === 'preview' ? 'block' : 'hidden', 'md:block min-w-0')}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-[13px] font-semibold text-slate-500">Live preview</h3>
            <Chip className="pointer-events-none">{selectedDoc.short}</Chip>
          </div>
          <div className="rounded-[28px] bg-[#F4F3F0] p-3 sm:p-5">
            <div className="relative">
              <DocumentPreview doc={selectedDoc} brand={brand} logo={logo} />
              {isPreview && (
                <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl">
                  <span className="-rotate-[24deg] text-[64px] font-bold tracking-[0.2em] text-slate-900/[0.07] select-none">PREVIEW</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
