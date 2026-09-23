import React, { useState } from 'react';
import {
  X,
  Handshake,
  CheckCircle2
} from 'lucide-react';
import { SPONSORSHIP_LISTINGS } from '../data/mockData';
import { toast } from '../lib/toast';

export default function SponsorshipConnectModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('browse');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-950 flex items-center justify-center">
              <Handshake className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-ink-950">Aygo Sponsorship Connect</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-lime-400 text-lime-950">
                  New Feature
                </span>
              </div>
              <p className="text-xs text-slate-500">Connecting student & community organizers with brand sponsors and partners.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-200 px-6 gap-6 text-sm font-semibold bg-white">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'browse'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Open Sponsorship Opportunities
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'post'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Post Event Sponsorship Deck
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
          {activeTab === 'browse' ? (
            <div className="space-y-4">
              {SPONSORSHIP_LISTINGS.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-ink-950">{item.eventTitle}</h3>
                      <p className="text-slate-500 font-medium">{item.organization}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                      {item.expectedAttendance}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <p><strong>Date:</strong> {item.eventDate}</p>
                    <p><strong>Venue:</strong> {item.venue}</p>
                  </div>

                  <div>
                    <strong className="text-slate-900 block mb-1.5">Seeking:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {item.seeking.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <strong className="text-slate-900 block mb-2">Available Tiers:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {item.packages.map((pkg, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <p className="font-bold text-brand-700">{pkg.tier}</p>
                          <p className="text-ink-950 font-bold">{pkg.amount}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{pkg.perks}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => toast(`Inquiry sent to organizers of ${item.eventTitle}.`)}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Handshake className="w-3.5 h-3.5" />
                      <span>Sponsor This Event</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-bold text-emerald-950">Sponsorship Profile Published</h3>
                  <p className="text-xs text-emerald-800">
                    Your event is now visible to corporate sponsors and partner brands on Aygo.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Event Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. University Tech Conference 2026"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Student Org / School</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ACM Student Chapter"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Expected Attendance</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 350 Students"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Sponsorship Needs & Perks</label>
                    <textarea
                      rows={3}
                      placeholder="Specify if you need in-kind shirts/lanyards, cash sponsorship, food, or mentorship..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors"
                    >
                      Publish to Sponsorship Directory
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
