import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Users,
  Sparkles,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  Repeat,
  MessageSquare,
  Building2,
  Coins,
  Award,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { toast } from '../lib/toast';

export default function SideDrawer({ 
  isOpen, 
  onClose, 
  userProfile = {
    firstName: 'Marvin',
    lastName: 'Barrios',
    email: 'marvin.barrios@gmail.com',
    phone: '9175550199',
    city: 'Taguig City (BGC)',
    rating: 4.84,
    eventsCount: 7
  },
  onOpenUserProfile,
  onOpenAppSettings,
  onOpenMockup, 
  onOpenDocs, 
  onOpenSponsorship, 
  onOpenMessages,
  onOpenSupplierSetup,
  onOpenBalance,
  onOpenSuppliers,
  onOpenHistory,
  onOpenReferral,
  onOpenOnboarding,
  isSupplierMode = false,
  onToggleSupplierMode 
}) {
  if (!isOpen) return null;

  const initials = `${(userProfile.firstName || 'M').charAt(0)}${(userProfile.lastName || 'B').charAt(0)}`.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto font-sans">
        
        {/* Top Profile Card (Clickable to Edit Profile) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div 
            onClick={() => {
              if (onOpenUserProfile) onOpenUserProfile();
              onClose();
            }}
            className="flex items-center gap-3 cursor-pointer group flex-1 mr-2"
            title="Click to edit profile"
          >
            <div 
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center font-black text-white text-base transition-transform group-hover:scale-105 shrink-0"
              style={{ backgroundColor: userProfile.avatarUrl ? '#0f172a' : (userProfile.avatarColor || '#003CF5') }}
            >
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-950 truncate group-hover:text-[#003CF5] transition-colors">
                  {userProfile.firstName} {userProfile.lastName}
                </h3>
              </div>
              <p className="text-[11px] text-amber-600 font-bold mt-0.5 truncate">
                ★ {userProfile.rating || 4.84} · {userProfile.city || 'Taguig City'}
              </p>
              <span className="text-[10px] font-bold text-[#003CF5] group-hover:underline block mt-0.5">
                Edit Profile →
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="py-3 px-3 space-y-1.5 text-xs font-semibold text-slate-700 flex-1">
          
          {/* 1. Map */}
          <button 
            onClick={onClose} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-100 text-slate-950 font-bold text-left"
          >
            <MapPin className="w-4 h-4 text-[#003CF5]" />
            <span>Map</span>
          </button>

          {/* 2. Messages */}
          <button 
            onClick={() => { onOpenMessages(); onClose(); }} 
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-[#003CF5]" />
              <span>Messages</span>
            </div>
            <span className="w-5 h-5 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center">
              2
            </span>
          </button>

          {/* 3. Verified Suppliers Directory */}
          <button 
            onClick={() => { onOpenSuppliers(); onClose(); }} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Verified Suppliers Directory</span>
          </button>

          {/* 4. Studio (Mockups & Document Generator) */}
          <div className="space-y-1">
            <button 
              onClick={() => { onOpenMockup(); onClose(); }} 
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#003CF5]" />
                <span>Studio</span>
              </div>
              <span className="text-[9px] font-bold text-white bg-[#003CF5] px-1.5 py-0.5 rounded">MOCKUPS</span>
            </button>
            <button 
              onClick={() => { onOpenDocs(); onClose(); }} 
              className="w-full flex items-center justify-between pl-10 pr-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-left transition-colors text-[11px]"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Document Generator</span>
              </div>
              <span className="text-[9px] font-medium text-slate-400">RFQ/PO</span>
            </button>
          </div>

          {/* 5. Request History */}
          <button 
            onClick={() => { onOpenHistory(); onClose(); }} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Request History</span>
          </button>

          {/* 6. Balance & Payment */}
          <button 
            onClick={() => { onOpenBalance(); onClose(); }} 
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Balance & Payment</span>
            </div>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ₱15,000
            </span>
          </button>

          {/* 7. Notification */}
          <button 
            onClick={() => { toast('You have 4 new notifications.'); onClose(); }} 
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-500" />
              <span>Notification</span>
            </div>
            <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">
              4
            </span>
          </button>

          {/* 8. Setting (App settings modal) */}
          <button 
            onClick={() => { if (onOpenAppSettings) onOpenAppSettings(); else if (onOpenUserProfile) onOpenUserProfile(); onClose(); }} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Setting</span>
          </button>

          {/* 9. Help & Support */}
          <button 
            onClick={() => { toast('Support: support@aygo.store'); onClose(); }} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Help & Support</span>
          </button>

          {/* 10. How do you want to get income with us? */}
          <button 
            onClick={() => { onOpenOnboarding(); onClose(); }} 
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-[#003CF5]" />
              <div>
                <span className="font-extrabold text-slate-950 block leading-tight">How do you want to get income with us?</span>
                <span className="text-[10px] text-slate-500 font-medium">Makers, Fleet & Ambassadors</span>
              </div>
            </div>
            <span className="text-[9px] font-black text-[#003CF5] bg-white px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
              EARN
            </span>
          </button>

          {/* 11. Invite & Earn */}
          <button 
            onClick={() => { onOpenReferral(); onClose(); }} 
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Invite & Earn</span>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              ₱500
            </span>
          </button>

          {/* Supplier Mode Items: Setup Maker Profile & Maker Verification */}
          {isSupplierMode && (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button 
                onClick={() => { onOpenSupplierSetup(); onClose(); }} 
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-[#003CF5]" />
                  <span className="font-bold text-[#003CF5]">Setup Maker Profile</span>
                </div>
                <span className="text-[9px] font-black text-[#003CF5] bg-white px-1.5 py-0.5 rounded border border-blue-200">MAKER</span>
              </button>

              <button 
                onClick={() => { onOpenOnboarding(); onClose(); }} 
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-[#003CF5]" />
                  <span>Maker Verification (1 of 4)</span>
                </div>
                <span className="text-[9px] font-bold text-[#003CF5] bg-blue-50 px-1.5 py-0.5 rounded">ID</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Switch Mode Button */}
        <div className="p-5 border-t border-slate-100 space-y-3">
          <button 
            onClick={() => { onToggleSupplierMode(); onClose(); }}
            className={`w-full py-3.5 rounded-2xl font-black text-xs shadow-md transition-all text-center flex items-center justify-center gap-2 ${
              isSupplierMode
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-[#003CF5] hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span>{isSupplierMode ? 'Switch to Customer View' : 'Switch to Supplier Mode'}</span>
          </button>

          <div className="flex items-center justify-around text-slate-400 text-xs font-bold pt-1">
            <span className="hover:text-slate-800 cursor-pointer">TikTok</span>
            <span className="hover:text-slate-800 cursor-pointer">Viber</span>
            <span className="hover:text-slate-800 cursor-pointer">Facebook</span>
            <span className="hover:text-slate-800 cursor-pointer">Instagram</span>
          </div>
        </div>
      </div>
    </div>
  );
}
