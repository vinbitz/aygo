import React, { useState } from 'react';
import { X, Globe, Mail, CheckCircle2, TrendingUp } from 'lucide-react';

export default function InternationalWaitlistModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Singapore');
  const [role, setRole] = useState('Organizer');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-950">Aygo Global Partner Program</h2>
              <p className="text-xs text-slate-500">Launch Aygo in your country & earn partner commission.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-slate-900 font-semibold mb-1">Philippines First, Expanding Globally</p>
            <p className="text-slate-500">
              We are scaling the Aygo Sourcing & Bidding marketplace across Southeast Asia and beyond. If you want to introduce Aygo to event organizers and suppliers in your market, register your email for our localized affiliate and partner commission program.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-950">Application Registered</h3>
              <p className="text-xs text-emerald-800">
                Thank you! Our international expansion team will reach out to {email} with partnership and commission terms.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Your Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Target Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="Singapore">Singapore</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Thailand">Thailand</option>
                  <option value="United States">United States</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other Region</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Your Role in the Ecosystem</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="Organizer">Event Organizer / Agency</option>
                  <option value="Supplier">Merchandise Supplier / Print Factory</option>
                  <option value="Affiliate">Regional Growth Partner / Affiliate</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-md shadow-brand-600/20"
              >
                Join Partner Waitlist
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
