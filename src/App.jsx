import React, { Suspense, lazy, useState } from 'react';
import SideDrawer from './components/SideDrawer';
import AygoSourcingView from './components/AygoSourcingView';
import Toaster from './components/Toaster';
import { toast } from './lib/toast';

// Popups are loaded on first open so the home screen ships a smaller bundle
const SupplierProfileModal = lazy(() => import('./components/SupplierProfileModal'));
const CreateRequestModal = lazy(() => import('./components/CreateRequestModal'));
const ProductMockupStudio = lazy(() => import('./components/ProductMockupStudio'));
const DocumentGeneratorModal = lazy(() => import('./components/DocumentGeneratorModal'));
const SponsorshipConnectModal = lazy(() => import('./components/SponsorshipConnectModal'));
const AygoMessagingModal = lazy(() => import('./components/AygoMessagingModal'));
const SupplierProfileSetupModal = lazy(() => import('./components/SupplierProfileSetupModal'));
const BalancePaymentModal = lazy(() => import('./components/BalancePaymentModal'));
const ReferralRewardsModal = lazy(() => import('./components/ReferralRewardsModal'));
const SupplierOnboardingModal = lazy(() => import('./components/SupplierOnboardingModal'));
const VerifiedSuppliersModal = lazy(() => import('./components/VerifiedSuppliersModal'));
const RequestHistoryModal = lazy(() => import('./components/RequestHistoryModal'));
const SupplierPortalView = lazy(() => import('./components/SupplierPortalView'));
const UserProfileModal = lazy(() => import('./components/UserProfileModal'));
const AppSettingsModal = lazy(() => import('./components/AppSettingsModal'));

export default function App() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMockupOpen, setIsMockupOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSponsorshipOpen, setIsSponsorshipOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [chatSupplier, setChatSupplier] = useState(null);
  const [isSupplierSetupOpen, setIsSupplierSetupOpen] = useState(false);
  const [isSupplierMode, setIsSupplierMode] = useState(false);
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAppSettingsOpen, setIsAppSettingsOpen] = useState(false);
  const [createMode, setCreateMode] = useState('single');
  const [createCategory, setCreateCategory] = useState('apparel');

  // Customer / User Profile State (First Name, Last Name, Email, +63 Phone, City)
  const [userProfile, setUserProfile] = useState({
    firstName: 'Marvin',
    lastName: 'Barrios',
    email: 'marvin.barrios@gmail.com',
    phone: '9175550199',
    formattedPhone: '+63 917 555 0199',
    city: 'Taguig City (BGC)',
    organization: 'Aygo Event Sourcing Lead',
    avatarUrl: '',
    avatarColor: '#003CF5',
    rating: 4.84,
    eventsCount: 7
  });

  const handleToggleSupplierMode = () => {
    setIsSupplierMode(prev => !prev);
  };

  // Shared Location & Date State (Synchronized across Top Bar, Sourcing Radar, and Item Requests)
  const [activeVenue, setActiveVenue] = useState({
    id: 'arthaland',
    name: 'Arthaland Century Pacific Tower',
    address: '4th Ave, 30th St, Taguig, Metro Manila',
    city: 'BGC, Taguig',
    lat: 14.5518,
    lng: 121.0475,
    type: 'venue'
  });
  const [deliveryType] = useState('venue');
  const [deliveryDate] = useState('Oct 15, 2026');
  const [activeItem, setActiveItem] = useState({
    title: '300 Customized Satin Lanyards',
    qty: '300 pcs',
    budget: '₱15,000 (₱50.00/pc)',
    specs: '2cm smooth satin, full color 2-sided sublimation, trigger hook.',
    isPackage: false
  });

  const handleAcceptBid = (supplier) => {
    toast(`Bid successfully accepted with ${supplier.name}. Purchase order generated and Aygo Chat workspace initiated.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950 font-sans selection:bg-[#003CF5] selection:text-white">


      {/* Side Navigation Drawer (Matching Reference Screenshot) */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userProfile={userProfile}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        onOpenMockup={() => setIsMockupOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenSponsorship={() => setIsSponsorshipOpen(true)}
        onOpenMessages={() => {
          setChatSupplier(null);
          setIsMessagesOpen(true);
        }}
        onOpenBalance={() => setIsBalanceOpen(true)}
        onOpenReferral={() => setIsReferralOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSuppliers={() => setIsSuppliersOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAppSettings={() => setIsAppSettingsOpen(true)}
        isSupplierMode={isSupplierMode}
        onOpenSupplierSetup={() => setIsSupplierSetupOpen(true)}
        onToggleSupplierMode={handleToggleSupplierMode}
      />

      {/* Main Minimalist Workspace: Customer Sourcing View VS Dedicated Supplier Portal Hub */}
      <main className="flex-1">
        {isSupplierMode ? (
          <Suspense fallback={null}>
            <SupplierPortalView
              onOpenDrawer={() => setIsDrawerOpen(true)}
              onSwitchToCustomer={() => setIsSupplierMode(false)}
              onOpenChatWithCustomer={(supplier) => {
                setChatSupplier(supplier);
                setIsMessagesOpen(true);
              }}
              onOpenMockupStudio={() => setIsMockupOpen(true)}
            />
          </Suspense>
        ) : (
          <AygoSourcingView
            onOpenDrawer={() => setIsDrawerOpen(true)}
            activeVenue={activeVenue}
            onSelectVenue={(v) => setActiveVenue(v)}
            deliveryType={deliveryType}
            onSelectSupplier={(supplier) => setSelectedSupplier(supplier)}
            onOpenChatWithSupplier={(supplier) => {
              setChatSupplier(supplier);
              setIsMessagesOpen(true);
            }}
            onRequestNewJob={(mode = 'single', cat = 'apparel') => {
              setCreateMode(mode);
              setCreateCategory(cat);
              setIsCreateOpen(true);
            }}
          />
        )}
      </main>

      <Toaster />

      {/* Modals & Tools (Triggered contextually when needed) */}
      <Suspense fallback={null}>
      {selectedSupplier && (
        <SupplierProfileModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          onAcceptBid={handleAcceptBid}
          onOpenChat={(supplier) => {
            setChatSupplier(supplier);
            setIsMessagesOpen(true);
          }}
          onOpenSupplierSetup={() => {
            setIsSupplierSetupOpen(true);
          }}
        />
      )}

      {/* Real-time Customer & Supplier Messaging Modal (User Requested) */}
      {isMessagesOpen && (
        <AygoMessagingModal
          isOpen={isMessagesOpen}
          onClose={() => setIsMessagesOpen(false)}
          initialSupplier={chatSupplier}
          activeVenue={activeVenue}
          activeItem={activeItem}
          onAcceptBid={handleAcceptBid}
        />
      )}

      {/* Meetup-Style Supplier Profile Setup Modal (User Requested) */}
      {isSupplierSetupOpen && (
        <SupplierProfileSetupModal
          isOpen={isSupplierSetupOpen}
          onClose={() => setIsSupplierSetupOpen(false)}
          initialSupplier={selectedSupplier || chatSupplier}
          onSaveProfile={(updatedProfile) => {
            setSelectedSupplier(updatedProfile);
          }}
        />
      )}

      {isCreateOpen && (
        <CreateRequestModal
          initialMode={createMode}
          initialCategory={createCategory}
          initialLocation={`${activeVenue.name}, ${activeVenue.address}`}
          initialDeliveryDate={deliveryDate}
          onClose={() => setIsCreateOpen(false)}
          onOpenMockupStudio={() => setIsMockupOpen(true)}
          onCreateRequest={(newReq) => {
            setActiveItem({
              title: newReq.title,
              qty: newReq.quantity + (newReq.isPackage ? ' attendee sets' : ' pcs'),
              budget: `₱${Number(newReq.budget || 0).toLocaleString()}`,
              specs: newReq.specs,
              isPackage: newReq.isPackage,
              categories: newReq.categories
            });
            toast(`Request "${newReq.title}" placed and dispatched to verified craft suppliers!`);
          }}
        />
      )}

      {/* Mockup Studio: Contextual modal, only shown when needed */}
      {isMockupOpen && (
        <ProductMockupStudio
          activeItemTitle={activeItem.title}
          onClose={() => setIsMockupOpen(false)}
          onSaveMockup={(mockupData) => {
            setActiveItem((prev) => ({
              ...prev,
              mockupImage: mockupData.data,
              mockupName: mockupData.name
            }));
            setIsMockupOpen(false);
          }}
        />
      )}

      {isDocsOpen && (
        <DocumentGeneratorModal
          onClose={() => setIsDocsOpen(false)}
        />
      )}

      {isSponsorshipOpen && (
        <SponsorshipConnectModal
          onClose={() => setIsSponsorshipOpen(false)}
        />
      )}

      {/* Driver/Supplier Balance & Wallet Modal (Matching Screenshot) */}
      {isBalanceOpen && (
        <BalancePaymentModal
          isOpen={isBalanceOpen}
          onClose={() => setIsBalanceOpen(false)}
        />
      )}

      {/* Referral & Invite Rewards Modal (Matching Screenshot) */}
      {isReferralOpen && (
        <ReferralRewardsModal
          isOpen={isReferralOpen}
          onClose={() => setIsReferralOpen(false)}
        />
      )}

      {/* Full 4-Step Supplier Onboarding Modal (Matching Screenshots 1 & 3) */}
      {isOnboardingOpen && (
        <SupplierOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onCompleteOnboarding={() => {
            setIsOnboardingOpen(false);
            setIsSupplierMode(true);
            toast("Verification documents submitted! Your workshop is now in expedited review.");
          }}
        />
      )}

      {/* Directory of Verified Craft Suppliers */}
      {isSuppliersOpen && (
        <VerifiedSuppliersModal
          isOpen={isSuppliersOpen}
          onClose={() => setIsSuppliersOpen(false)}
          onSelectSupplier={(supplier) => {
            setIsSuppliersOpen(false);
            setSelectedSupplier(supplier);
          }}
          onChatSupplier={(supplier) => {
            setIsSuppliersOpen(false);
            setChatSupplier(supplier);
            setIsMessagesOpen(true);
          }}
        />
      )}

      {/* Customer / Supplier Request History Modal */}
      {isHistoryOpen && (
        <RequestHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectRequest={(req) => {
            setIsHistoryOpen(false);
            setActiveItem({
              title: req.title,
              qty: req.qty,
              budget: req.budget,
              specs: req.specs || 'Standard production specifications',
              isPackage: req.title.toLowerCase().includes('package')
            });
          }}
        />
      )}
      {/* Customer / Organizer User Profile & Account Settings Modal (Matching Screenshots 1 & 3) */}
      {isUserProfileOpen && (
        <UserProfileModal
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          userProfile={userProfile}
          onSaveProfile={(updatedProfile) => {
            setUserProfile(updatedProfile);
          }}
          onOpenSettings={() => {
            setIsUserProfileOpen(false);
            setIsAppSettingsOpen(true);
          }}
          onOpenOnboarding={() => {
            setIsUserProfileOpen(false);
            setIsOnboardingOpen(true);
          }}
        />
      )}

      {/* App Settings Modal (Matching Screenshot 2) */}
      {isAppSettingsOpen && (
        <AppSettingsModal
          isOpen={isAppSettingsOpen}
          onClose={() => setIsAppSettingsOpen(false)}
          onOpenProfileSettings={() => {
            setIsAppSettingsOpen(false);
            setIsUserProfileOpen(true);
          }}
        />
      )}
      </Suspense>
    </div>
  );
}
