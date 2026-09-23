import React, { useState } from 'react';
import { X, Send, Award, Users, Check, Copy } from 'lucide-react';
import { toast } from '../lib/toast';

export default function ReferralRewardsModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const inviteLink = 'https://aygo.store/invite/MARVIN-BGC-2026';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 font-sans">
      <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* Close Button top-right (matching Screenshot 2) */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Partner Rewards</span>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scroll">
          
          {/* Top Vector Illustration: Two partners high-fiving (matching Screenshot 2) */}
          <div className="flex justify-center py-2">
            <svg className="w-48 h-32" viewBox="0 0 200 130" fill="none">
              <rect x="20" y="20" width="160" height="90" rx="16" fill="#F8FAFC" />
              {/* Partner 1 */}
              <circle cx="70" cy="50" r="14" fill="#003CF5" />
              <path d="M50 85 C50 68 90 68 90 85 Z" fill="#003CF5" />
              {/* Partner 2 */}
              <circle cx="130" cy="50" r="14" fill="#1E293B" />
              <path d="M110 85 C110 68 150 68 150 85 Z" fill="#1E293B" />
              {/* High-five arms */}
              <path d="M78 60 L100 45 L122 60" stroke="#C5F76B" strokeWidth="6" strokeLinecap="round" />
              {/* Sparkles / coins */}
              <circle cx="100" cy="30" r="6" fill="#FBBF24" />
              <circle cx="40" cy="40" r="4" fill="#60A5FA" />
              <circle cx="160" cy="40" r="4" fill="#60A5FA" />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Earn ₱500 Partner Bonus</h2>
            <p className="text-xs text-slate-500 mt-1">
              Invite event organizers or verified makers to join Aygo.
            </p>
          </div>

          {/* 3 Step Flow matching Screenshot 2 */}
          <div className="space-y-4 pt-1">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Send className="w-4 h-4 text-slate-800" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Send an invite</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Invite someone who doesn't have an Aygo organizer or maker account.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="w-4 h-4 text-slate-800" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Partners complete orders</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  They must register using your link and complete their first bulk deliverable order within 30 days.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award className="w-4 h-4 text-slate-800" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">You get a reward</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  ₱500 in bonuses to cover your service escrow fees or apply as discounts. 1 bonus = ₱1.
                </p>
              </div>
            </div>
          </div>

          {/* Share Link Box */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Your Referral Link</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-700 truncate">{inviteLink}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-[#003CF5] text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Terms & Conditions link (matching Screenshot 2) */}
          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={() => toast('Referral terms: Bonuses are non-transferable and can be redeemed towards escrow payments or bank withdrawals for verified makers.')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
            >
              Terms and Conditions
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
