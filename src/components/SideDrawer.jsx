import React, { useEffect, useRef } from 'react';
import {
  X,
  Map as MapIcon,
  Clock,
  Users,
  Bell,
  Settings,
  HelpCircle,
  Repeat,
  MessageSquare,
  Building2,
  Wallet,
  Gift,
  UserCheck,
  Store,
  Crown,
  ChevronRight,
  Star,
} from 'lucide-react';
import { toast } from '../lib/toast';
import { ListRow, Badge, Button, Logo } from './ui';

/** Small red counter used for unread items */
function CountBadge({ count }) {
  return (
    <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-red-500 text-white text-[12px] font-semibold flex items-center justify-center shrink-0">
      {count}
    </span>
  );
}

/** White rounded group with a sentence-case label, matching the home sheet sections */
function MenuGroup({ title, children }) {
  return (
    <section className="bg-white rounded-[28px] px-4 pt-3 pb-1.5">
      <h3 className="px-0.5 pb-0.5 text-[13px] font-semibold text-slate-500">{title}</h3>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

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
  onOpenMessages,
  onOpenSupplierSetup,
  onOpenBalance,
  onOpenSuppliers,
  onOpenHistory,
  onOpenPro,
  isPro = false,
  onOpenReferral,
  onOpenOnboarding,
  isSupplierMode = false,
  onToggleSupplierMode
}) {
  const panelRef = useRef(null);

  // Slide-in animation (runs once each time the drawer opens)
  useEffect(() => {
    if (!isOpen) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && panelRef.current?.animate) {
      panelRef.current.animate(
        [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
        { duration: 260, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
      );
    }
  }, [isOpen]);

  // Esc to close + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initials = `${(userProfile.firstName || 'M').charAt(0)}${(userProfile.lastName || 'B').charAt(0)}`.toUpperCase();

  // Run a callback (if provided) and close the drawer
  const go = (fn) => () => {
    if (fn) fn();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] animate-fade-in"
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className="relative z-10 w-[340px] max-w-[88vw] h-full bg-[#F2F1ED] shadow-2xl flex flex-col overflow-y-auto overscroll-contain no-scrollbar rounded-r-[28px]"
      >
        {/* Profile header */}
        <div className="bg-white rounded-b-[28px] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2">
              <Logo variant="icon" className="w-8 h-8" />
              <Logo className="h-6" />
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="w-11 h-11 -mr-1.5 rounded-full flex items-center justify-center text-slate-700 hover:bg-[#F4F3F0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={go(onOpenUserProfile)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] text-left transition-colors active:scale-[0.99]"
          >
            <span
              className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-white text-[17px] font-semibold shrink-0"
              style={{ backgroundColor: userProfile.avatarUrl ? '#0f172a' : (userProfile.avatarColor || '#003CF5') }}
            >
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[17px] font-semibold text-slate-900 truncate">
                {userProfile.firstName} {userProfile.lastName}
              </span>
              <span className="flex items-center gap-1 text-[13px] text-slate-500 truncate">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                {userProfile.rating || 4.84}
                <span className="text-slate-300">·</span>
                <span className="truncate">{userProfile.city || 'Taguig City'}</span>
              </span>
              <span className="block text-[13px] font-medium text-[#003CF5] mt-0.5">View profile</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="mt-3">
            <Badge tone={isSupplierMode ? 'violet' : 'blue'}>
              {isSupplierMode ? 'Supplier mode' : 'Organizer mode'}
            </Badge>
          </div>
        </div>

        <div className="flex-1 px-2 py-2 space-y-2">
          {/* Sourcing */}
          <MenuGroup title="Sourcing">
            <ListRow icon={MapIcon} tone="blue" title="Home map" subtitle="Find makers near your venue" onClick={onClose} />
            <ListRow icon={Clock} tone="slate" title="My requests" subtitle="Active bids and past orders" onClick={go(onOpenHistory)} />
            <ListRow
              icon={MessageSquare}
              tone="blue"
              title="Messages"
              subtitle="Chat with your makers"
              onClick={go(onOpenMessages)}
              trailing={<CountBadge count={2} />}
            />
            <ListRow icon={Users} tone="green" title="Suppliers" subtitle="Browse verified makers" onClick={go(onOpenSuppliers)} />
          </MenuGroup>

          {/* Supplier-only tools */}
          {isSupplierMode && (
            <MenuGroup title="Your workshop">
              <ListRow icon={Building2} tone="violet" title="Maker profile" subtitle="Services, pricing and portfolio" onClick={go(onOpenSupplierSetup)} />
              <ListRow
                icon={UserCheck}
                tone="amber"
                title="Verification"
                subtitle="Get the verified badge"
                onClick={go(onOpenOnboarding)}
                trailing={<Badge tone="amber">1 of 4</Badge>}
              />
            </MenuGroup>
          )}

          {/* Account */}
          <MenuGroup title="Account">
            <ListRow
              icon={Wallet}
              tone="green"
              title="Wallet"
              subtitle="Balance & payments"
              onClick={go(onOpenBalance)}
              trailing={<span className="text-[13px] font-semibold text-emerald-700 shrink-0">₱15,000</span>}
            />
            <ListRow
              icon={Gift}
              tone="rose"
              title="Refer & earn"
              subtitle="Get ₱500 per partner"
              onClick={go(onOpenReferral)}
            />
            <ListRow
              icon={Bell}
              tone="slate"
              title="Notifications"
              onClick={go(() => toast('You have 4 new notifications.'))}
              trailing={<CountBadge count={4} />}
            />
            <ListRow
              icon={Settings}
              tone="slate"
              title="Settings"
              onClick={go(onOpenAppSettings || onOpenUserProfile)}
            />
            <ListRow
              icon={HelpCircle}
              tone="slate"
              title="Help"
              subtitle="support@aygo.store"
              onClick={go(() => toast('Support: support@aygo.store'))}
            />
          </MenuGroup>

          {/* Supplier mode card */}
          <section className="bg-white rounded-[28px] p-4">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-slate-900">
                  {isSupplierMode ? 'Planning an event?' : 'Make things for events?'}
                </p>
                <p className="text-[13px] text-slate-500 leading-snug">
                  {isSupplierMode
                    ? 'Switch back to post requests and compare bids.'
                    : 'Bid on organizer requests near you and grow your workshop.'}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                variant={isSupplierMode ? 'secondary' : 'primary'}
                full
                icon={Repeat}
                onClick={go(onToggleSupplierMode)}
              >
                {isSupplierMode ? 'Switch to organizer mode' : 'Switch to supplier mode'}
              </Button>
              {!isSupplierMode && (
                <Button variant="ghost" full onClick={go(onOpenOnboarding)}>
                  Become a verified supplier
                </Button>
              )}
            </div>
          </section>

          {/* Aygo Pro upsell */}
          <button
            type="button"
            onClick={go(onOpenPro)}
            className="w-full flex items-center gap-3 rounded-[28px] bg-white hover:bg-[#FBFAF8] text-left p-4 transition-colors active:scale-[0.99]"
          >
            <span className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="flex items-center gap-1.5 text-[15px] font-semibold text-slate-900">Aygo Pro {isPro ? <Badge tone="violet">Active</Badge> : <Badge tone="blue">3 free tries</Badge>}</span>
              <span className="block text-[13px] text-slate-500 leading-snug">Your event sourcing workspace</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pt-2 pb-[max(20px,env(safe-area-inset-bottom))] text-[12px] text-slate-500 flex items-center justify-between">
          <span>You Plan. We Connect.</span>
          <span>aygo.store</span>
        </div>
      </aside>
    </div>
  );
}
