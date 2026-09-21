import React, { useState } from 'react';
import { X, FileText, Download, Printer, CheckCircle, Copy } from 'lucide-react';

const DOC_TYPES = [
  { id: 'rfq', name: 'Request for Quotation (RFQ)', desc: 'Standardized spec sheet sent to competing suppliers' },
  { id: 'po', name: 'Purchase Order (PO)', desc: 'Legally binding order confirmation with agreed payment terms' },
  { id: 'comparison', name: 'Bid Comparison Sheet', desc: 'Side-by-side evaluation of price, lead time, and terms' },
  { id: 'checklist', name: 'Event Supply Delivery Checklist', desc: 'On-site receiving checklist for event leads' }
];

export default function DocumentGeneratorModal({ onClose }) {
  const [selectedDoc, setSelectedDoc] = useState(DOC_TYPES[0]);
  const [organization, setOrganization] = useState('Philippine Tech Summit 2026');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink-950">Aygo Document & RFQ Studio</h2>
              <p className="text-xs text-slate-500">Auto-generate branded procurement documents for organizers and suppliers.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Document Type Selector */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-2">
              Select Document Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DOC_TYPES.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDoc.id === doc.id
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-sm text-ink-950">{doc.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Document Preview Canvas */}
          <div className="border border-slate-300 rounded-2xl p-6 bg-white shadow-inner font-mono text-[11px] leading-relaxed space-y-4">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-start font-sans">
              <div>
                <h3 className="text-sm font-black text-ink-950 uppercase tracking-wide">
                  {selectedDoc.name}
                </h3>
                <p className="text-xs text-slate-500">AYGO Procurement Reference: #AYGO-2026-0911</p>
              </div>
              <div className="text-right">
                <span className="font-black text-brand-600 text-sm">AYGO.STORE</span>
                <p className="text-[10px] text-slate-400">Date: September 21, 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 font-sans text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Issuing Organization</span>
                <p className="font-bold text-slate-900">{organization}</p>
                <p className="text-slate-500">Quezon City, Metro Manila</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Fulfillment Channel</span>
                <p className="font-bold text-slate-900">Verified Aygo Supplier Network</p>
                <p className="text-slate-500">Competitive Bidding Pool</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden font-sans">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5">Quantity</th>
                    <th className="p-2.5">Target (PHP)</th>
                    <th className="p-2.5">Required Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5">Customized Satin Lanyards (20mm, Sublimation)</td>
                    <td className="p-2.5">300 pcs</td>
                    <td className="p-2.5">PHP 50.00 / pc</td>
                    <td className="p-2.5 text-brand-700 font-medium">October 12, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              Terms: All bids submitted through Aygo include production lead time, delivery commitment, and artwork approval SLA.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied to Clipboard' : 'Copy Template'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                alert('Downloading PDF for this document.');
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Branded PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
