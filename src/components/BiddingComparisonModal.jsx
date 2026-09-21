import React from 'react';
import { X, CheckCircle2, ShieldCheck, Clock, MapPin, DollarSign, Award } from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';

export default function BiddingComparisonModal({ onClose, onSelectSupplier }) {
  const comparisonData = [
    {
      supplier: SUPPLIERS[2], // JJT Digital
      bidPrice: 46.00,
      totalPrice: 13800,
      leadTime: '4 business days',
      deliveryDate: 'October 8, 2026',
      location: 'Parañaque City (11.8 km)',
      rating: '4.9 (215 reviews)',
      inclusions: 'Free digital mockup, individual polybagging, safety breakaway buckle, free Metro Manila delivery',
      terms: '50% downpayment, balance upon pickup/delivery',
      isBestValue: true
    },
    {
      supplier: SUPPLIERS[0], // Thread & Co.
      bidPrice: 49.50,
      totalPrice: 14850,
      leadTime: '5 business days',
      deliveryDate: 'October 9, 2026',
      location: 'Taytay, Rizal (12.4 km)',
      rating: '4.9 (142 reviews)',
      inclusions: 'Satin lanyard + heavy-duty trigger snap hook + clear PVC badge holder included in bundle',
      terms: '50% downpayment, balance upon delivery',
      isBestValue: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
              Aygo Bid Comparison
            </span>
            <h2 className="text-lg font-bold text-ink-950 mt-1">Side-by-Side Supplier Evaluation</h2>
            <p className="text-xs text-slate-500">Compare price, lead time, location, supplier rating, inclusions, and terms.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="p-3 bg-slate-50 font-bold text-slate-700 w-1/4">Evaluation Metric</th>
                  {comparisonData.map((col, idx) => (
                    <th key={idx} className="p-3 bg-white font-bold text-slate-900 border-l border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-ink-950">{col.supplier.name}</span>
                        {col.isBestValue && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Lowest Bid
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 bg-slate-50 font-bold text-slate-600">Unit Price & Total</td>
                  {comparisonData.map((c, i) => (
                    <td key={i} className="p-3 border-l border-slate-200">
                      <p className="text-base font-black text-brand-700">PHP {c.bidPrice.toFixed(2)} / pc</p>
                      <p className="text-[11px] text-slate-500">Total: PHP {c.totalPrice.toLocaleString()}</p>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-slate-50 font-bold text-slate-600">Turnaround & Delivery</td>
                  {comparisonData.map((c, i) => (
                    <td key={i} className="p-3 border-l border-slate-200">
                      <p className="font-bold text-slate-900">{c.leadTime}</p>
                      <p className="text-[11px] text-slate-500">Delivery: {c.deliveryDate}</p>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-slate-50 font-bold text-slate-600">Facility Location & Distance</td>
                  {comparisonData.map((c, i) => (
                    <td key={i} className="p-3 border-l border-slate-200">
                      <p className="font-semibold text-slate-800">{c.location}</p>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-slate-50 font-bold text-slate-600">Supplier Rating & Jobs</td>
                  {comparisonData.map((c, i) => (
                    <td key={i} className="p-3 border-l border-slate-200">
                      <p className="font-semibold text-slate-800">{c.rating}</p>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-slate-50 font-bold text-slate-600">Package Inclusions</td>
                  {comparisonData.map((c, i) => (
                    <td key={i} className="p-3 border-l border-slate-200 text-slate-600">
                      {c.inclusions}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-slate-50 font-bold text-slate-600">Payment Terms</td>
                  {comparisonData.map((c, i) => (
                    <td key={i} className="p-3 border-l border-slate-200 text-slate-600">
                      {c.terms}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-slate-50 font-bold text-slate-600">Decision</td>
                  {comparisonData.map((c, i) => (
                    <td key={i} className="p-3 border-l border-slate-200">
                      <button
                        onClick={() => {
                          onSelectSupplier(c.supplier);
                          onClose();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-colors text-center"
                      >
                        Inspect & Accept This Bid
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
