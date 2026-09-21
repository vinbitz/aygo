import React, { useState } from 'react';
import { ShieldCheck, MapPin, Clock, Star, ChevronRight, Search, Filter } from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';

export default function SuppliersDirectoryView({ onSelectSupplier }) {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const filteredSuppliers = SUPPLIERS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.bio.toLowerCase().includes(search.toLowerCase()) ||
                          s.services.some(svc => svc.name.toLowerCase().includes(search.toLowerCase()));
    const matchesCity = selectedCity === 'all' || s.city.includes(selectedCity);
    return matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-brand-600 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white">
            AYGO VERIFIED NETWORK
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Verified Event Suppliers & Print Houses
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Every business is vetted for production capacity, registration, on-time delivery track record, and commercial reliability across Greater Manila.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none font-black text-9xl">
          AYGO
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by supplier name, print technique, or garment..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase">Hub Location:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            <option value="all">All Locations</option>
            <option value="Taytay">Taytay (Apparel Hub)</option>
            <option value="Marikina">Marikina (Bag & Leathercraft)</option>
            <option value="Parañaque">Parañaque (Print & Sublimation)</option>
            <option value="Valenzuela">Valenzuela (Drinkware & Laser)</option>
          </select>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            onClick={() => onSelectSupplier(supplier)}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Cover Preview */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={supplier.coverImage}
                  alt={supplier.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-sm flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{supplier.rating} ({supplier.reviewsCount})</span>
                </div>
              </div>

              {/* Profile Card Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-ink-950 group-hover:text-brand-600 transition-colors">
                        {supplier.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{supplier.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    {supplier.city}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Lead time: {supplier.avgLeadTime}
                  </span>
                </div>

                {/* Services Chips */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Core Production Services
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {supplier.services.map((svc, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                      >
                        {svc.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer CTA */}
            <div className="border-t border-slate-100 p-4 bg-slate-50/70 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">
                On-time delivery: <strong className="text-slate-900">{supplier.onTimeRate}</strong>
              </span>
              <span className="text-brand-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Inspect Supplier Profile & Bids</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
