import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  HelpCircle,
  ChevronRight,
  CreditCard,
  Coins
} from 'lucide-react';
import { toast } from '../lib/toast';

export default function BalancePaymentModal({ isOpen, onClose }) {
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'methods' | 'topup'
  const [balance, setBalance] = useState(15000);
  const [bonuses, setBonuses] = useState(500);
  const [topUpAmount, setTopUpAmount] = useState('5000');
  const [selectedMethod, setSelectedMethod] = useState('gcash');
  const [isGcashActive, setIsGcashActive] = useState(true);

  if (!isOpen) return null;

  const handleTopUpSubmit = () => {
    const amt = parseFloat(topUpAmount) || 0;
    if (amt > 0) {
      setBalance(prev => prev + amt);
      toast(`Successfully topped up ₱${amt.toLocaleString()} via ${selectedMethod === 'gcash' ? 'GCash' : 'Bank Transfer'}. Funds available for supplier escrow deposit.`);
      setCurrentView('main');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 font-sans">
      <div className="relative w-full max-w-sm bg-[#f9f9f9] rounded-[32px] shadow-2xl flex flex-col min-h-[520px] max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* HEADER (matching screenshots 4 & 5) */}
        <div className="p-4 flex items-center justify-between bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            {currentView !== 'main' ? (
              <button 
                type="button" 
                onClick={() => setCurrentView('main')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            ) : null}
            <h3 className="text-base font-black text-slate-950">
              {currentView === 'methods' ? 'Payment methods' : currentView === 'topup' ? 'Top up Balance' : 'Account Balance'}
            </h3>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scroll">
          
          {/* VIEW 1: MAIN BALANCE & WALLET (Screenshot 4) */}
          {currentView === 'main' && (
            <div className="space-y-3.5">
              {/* Card 1: Balance Card */}
              <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E5F9C9] flex items-center justify-center text-[#2a4d00]">
                      <Coins className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-base font-bold text-slate-900">Balance</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => toast('Aygo Escrow Balance is used to secure orders, pay suppliers, and claim referral bonuses.')}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-extrabold text-slate-950 tracking-tight">
                      ₱{balance.toLocaleString()}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setCurrentView('methods')}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-1 block">
                    {bonuses} bonuses (1 bonus = ₱1)
                  </span>
                </div>

                {/* Lime-green Top Up Button */}
                <button
                  type="button"
                  onClick={() => setCurrentView('topup')}
                  className="w-full py-3.5 rounded-2xl bg-[#C5F76B] hover:bg-[#b2ee50] text-[#1a3300] font-black text-sm shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Top up</span>
                </button>
              </div>

              {/* Card 2: Payment Methods navigation */}
              <div 
                onClick={() => setCurrentView('methods')}
                className="bg-white rounded-3xl p-4.5 shadow-xs border border-slate-100 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-slate-800 stroke-[2]" />
                  <span className="text-sm font-bold text-slate-900">Payment methods</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>

              {/* Recent Transaction Activity */}
              <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Escrow Activity</span>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">50% Escrow Hold: Thread & Co.</p>
                      <p className="text-[10px] text-slate-400">Order #AYGO-8842</p>
                    </div>
                    <span className="font-bold text-slate-800">₱7,500</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-700">Referral Bonus Credited</p>
                      <p className="text-[10px] text-slate-400">Partner: Manila Bag Works</p>
                    </div>
                    <span className="font-bold text-emerald-600">+₱500</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: PAYMENT METHODS (Screenshot 5) */}
          {currentView === 'methods' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-600 font-medium">Setting up payments for orders & payouts</p>
              </div>

              {/* Status Section */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  {isGcashActive ? 'Active' : 'Inactive'}
                </span>

                {/* GCash manual transfer with GCash blue logo */}
                <div 
                  onClick={() => setIsGcashActive(!isGcashActive)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:border-[#003CF5] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#007DFE] text-white flex items-center justify-center font-bold text-xs">
                      G
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">GCash manual transfer</p>
                      <p className="text-[10px] text-slate-500">Scan QR or Transfer: 0917 555 0101</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isGcashActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                      {isGcashActive ? 'Enabled' : 'Disabled'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Maya / Bank Transfer */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:border-[#003CF5] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      BPI
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">BPI Corporate Bank Transfer</p>
                      <p className="text-[10px] text-slate-500">Aygo Solutions Inc. · Instant Verification</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Callout Info Box (matching Screenshot 5) */}
              <div className="p-4 rounded-2xl bg-[#f2eee9] text-xs text-slate-700 leading-relaxed font-medium">
                Methods available for Event Deliverables and Supplier Escrow Payouts. Visit other service pages in side menu for more options.
              </div>
            </div>
          )}

          {/* VIEW 3: TOP UP FORM */}
          {currentView === 'topup' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Add funds to your Aygo Escrow balance for immediate supplier order confirmation.</p>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Select Amount (PHP)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1000', '5000', '15000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        topUpAmount === amt
                          ? 'border-[#003CF5] bg-blue-50 text-[#003CF5]'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      ₱{parseInt(amt).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">Custom Amount</label>
                <input 
                  type="number" 
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                    <span className="text-xs font-bold text-slate-800">GCash Instant QR</span>
                    <input 
                      type="radio" 
                      name="topup-method" 
                      checked={selectedMethod === 'gcash'} 
                      onChange={() => setSelectedMethod('gcash')} 
                      className="text-[#003CF5]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                    <span className="text-xs font-bold text-slate-800">BDO / BPI Bank Transfer</span>
                    <input 
                      type="radio" 
                      name="topup-method" 
                      checked={selectedMethod === 'bank'} 
                      onChange={() => setSelectedMethod('bank')} 
                      className="text-[#003CF5]"
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTopUpSubmit}
                className="w-full py-3.5 rounded-2xl bg-[#C5F76B] hover:bg-[#b2ee50] text-[#1a3300] font-black text-sm shadow-md transition-all text-center mt-2"
              >
                Confirm ₱{parseFloat(topUpAmount || 0).toLocaleString()} Top Up
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
