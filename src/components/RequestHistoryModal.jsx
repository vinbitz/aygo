import React from 'react';
import {
  X,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function RequestHistoryModal({ isOpen, onClose, activeItem, onOpenItem }) {
  if (!isOpen) return null;

  const pastRequests = [
    {
      id: 'req-01',
      title: activeItem?.title || '300 Customized Satin Lanyards',
      qty: activeItem?.qty || '300 pcs',
      budget: activeItem?.budget || '₱15,000',
      status: 'Active RFP (4 Bids)',
      date: 'Oct 15, 2026',
      isActive: true
    },
    {
      id: 'req-02',
      title: '500 Dri-Fit Event Shirts for Run Manila',
      qty: '500 pcs',
      budget: '₱100,000',
      status: 'Delivered & Completed',
      date: 'Sep 02, 2026',
      isActive: false
    },
    {
      id: 'req-03',
      title: '200 Bamboo Thermal Tumblers Laser Engraved',
      qty: '200 pcs',
      budget: '₱68,000',
      status: 'Delivered & Completed',
      date: 'Aug 14, 2026',
      isActive: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003CF5] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">Sourcing Request History</h3>
              <p className="text-[11px] text-slate-500">Track active supplier bidding and historical event purchase records.</p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Requests List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
          {pastRequests.map((req) => (
            <div 
              key={req.id}
              className={`p-4 rounded-2xl border transition-all ${
                req.isActive 
                  ? 'border-blue-300 bg-blue-50/40 shadow-xs' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  req.isActive ? 'bg-[#003CF5] text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {req.status}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Target: {req.date}
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900">{req.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Quantity: <strong>{req.qty}</strong> · Target Budget: <strong>{req.budget}</strong>
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Dispatch: Arthaland Century Pacific Tower, BGC</span>
                {req.isActive && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenItem) onOpenItem(req);
                      onClose();
                    }}
                    className="text-[#003CF5] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Active Radar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
