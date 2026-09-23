import React, { useState } from 'react';
import {
  X,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';

export default function VerifiedSuppliersModal({ isOpen, onClose, onSelectSupplier, onOpenChat }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Apparel', 'Print & Lanyards', 'Bags', 'Drinkware'];

  const filtered = SUPPLIERS.filter(s => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory || (selectedCategory === 'Apparel' && s.name.includes('Apparel'));
    const matchText = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 font-sans">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003CF5] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">Verified Suppliers & Makers</h3>
              <p className="text-[11px] text-slate-500">Curated Metro Manila workshops with verified machinery and escrow guarantee.</p>
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

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by workshop name, machinery, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto custom-scroll pb-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === c
                    ? 'bg-[#003CF5] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Supplier List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
          {filtered.map((s) => (
            <div 
              key={s.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-900 text-sm">{s.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{s.tagline}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-[#003CF5]" />
                    {s.city}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {s.rating} ({s.jobsCompleted} orders)
                  </span>
                  <span className="text-[11px] font-bold text-[#003CF5] bg-blue-50 px-2 py-0.5 rounded">
                    Lead time: {s.avgLeadTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenChat) onOpenChat(s);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#003CF5] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectSupplier) onSelectSupplier(s);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <span>View Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
