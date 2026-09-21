import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { AYGO_LOGO_DATA_URI } from '../assets/logoBase64';

export default function Navbar({ 
  onOpenDrawer, 
  onNewItem, 
  onOpenSupplierSetup,
  isSupplierMode = false,
  onToggleSupplierMode,
  destinationLabel = 'Venue: Arthaland Tower, BGC' 
}) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
            {/* Left: Hamburger Menu */}
            <div className="flex items-center gap-3">
              <button 
                onClick={onOpenDrawer}
                className="relative w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-1 transition-colors"
                aria-label="Open Navigation Menu"
              >
                <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
                <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
                <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#003CF5] rounded-full border-2 border-white" />
              </button>
            </div>

        </div>
      </div>
    </header>
  );
}
