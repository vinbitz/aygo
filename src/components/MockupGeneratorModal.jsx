import React, { useState } from 'react';
import {
  X,
  Sparkles
} from 'lucide-react';
import { toast } from '../lib/toast';

const MOCKUP_ITEMS = [
  { id: 'tee', name: 'Cotton T-Shirt', category: 'Apparel', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
  { id: 'tote', name: 'Canvas Tote Bag', category: 'Bags & Totes', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' },
  { id: 'tumbler', name: 'Thermal Tumbler', category: 'Drinkware', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { id: 'lanyard', name: 'Satin Event Lanyard', category: 'Event Print', image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=600&q=80' },
  { id: 'umbrella', name: 'Automatic Golf Umbrella', category: 'Rain Gear', image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=600&q=80' },
  { id: 'booth', name: 'Modular Event Booth Banner', category: 'Equipment', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80' }
];

export default function MockupGeneratorModal({ onClose }) {
  const [selectedItem, setSelectedItem] = useState(MOCKUP_ITEMS[0]);
  const [logoText, setLogoText] = useState('AYGO');
  const [logoColor, setLogoColor] = useState('#003CF5');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockupReady, setMockupReady] = useState(true);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setMockupReady(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink-950">AI Merchandise Mockup Studio</h2>
              <p className="text-xs text-slate-500">Visualize client branding on event merchandise before requesting bids.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Controls */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-2">
                1. Select Blank Merchandise
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOCKUP_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedItem.id === item.id
                        ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.category}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                2. Branding Text or Vector Logo
              </label>
              <input
                type="text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                placeholder="Enter client company name or logo label"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                3. Primary Brand Color
              </label>
              <div className="flex items-center gap-2">
                {['#003CF5', '#0C1425', '#C5F76B', '#d34845', '#2e604b', '#ffffff'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setLogoColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border border-slate-300 shadow-sm transition-transform ${
                      logoColor === c ? 'scale-125 ring-2 ring-brand-600 ring-offset-2' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Rendering AI Mockup...' : 'Generate Branded Mockup'}</span>
            </button>
          </div>

          {/* Right Live Canvas Preview */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl border border-slate-200">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white shadow-md flex items-center justify-center">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay simulated branded imprint */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  style={{ color: logoColor }}
                  className="px-4 py-2 rounded-lg bg-black/20 backdrop-blur-[1px] font-black text-xl tracking-wider uppercase border border-white/40 shadow-xl"
                >
                  {logoText || 'AYGO'}
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800">
                <span>{selectedItem.name}</span>
                <span className="text-brand-600">Aygo AI Engine</span>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-3">
              <button
                type="button"
                onClick={() => {
                  toast('Mockup attached to active supplier RFQ.');
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-center"
              >
                Attach to Supplier Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
