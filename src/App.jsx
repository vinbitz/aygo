import React, { Suspense, lazy, useState } from 'react';
import SideDrawer from './components/SideDrawer';
import AygoSourcingView from './components/AygoSourcingView';
import Toaster from './components/Toaster';
import { toast } from './lib/toast';
import useMarketplace from './state/useMarketplace';
import { usePro } from './state/pro';
import { peso } from './lib/marketplace';
import { EMPTY_EVENT_PHOTOS } from './lib/images';

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
const BiddingComparisonModal = lazy(() => import('./components/BiddingComparisonModal'));
const CatalogSheet = lazy(() => import('./components/CatalogSheet'));
const ToolsSheet = lazy(() => import('./components/ToolsSheet'));
const EventWorkspace = lazy(() => import('./components/EventWorkspace'));
const InternationalWaitlistModal = lazy(() => import('./components/InternationalWaitlistModal'));
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
  // Package a maker sent from the portal, posted into the chat thread
  const [chatPackage, setChatPackage] = useState(null);
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
  // Extra pre-fill for the request form (from the catalog or a typed search)
  const [createPrefill, setCreatePrefill] = useState({});
  const [catalogCategory, setCatalogCategory] = useState(undefined); // undefined = catalog closed

  const openCreate = (mode = 'single', cat = 'apparel', prefill = {}) => {
    setCreateMode(mode);
    setCreateCategory(cat);
    setCreatePrefill(prefill);
    setIsCreateOpen(true);
  };
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [setupSupplier, setSetupSupplier] = useState(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  // Event cover + gallery, shared by the event workspace and Sponsorship Connect
  const [eventPhotos, setEventPhotos] = useState(EMPTY_EVENT_PHOTOS);
  const [registrationLink, setRegistrationLink] = useState('');

  // Pro tools: 3 free uses each on the Free plan, then the Aygo Pro paywall
  const pro = usePro();
  const openMockup = () => pro.gate('mockup', () => setIsMockupOpen(true));
  const openDocs = () => pro.gate('documents', () => setIsDocsOpen(true));
  const openWorkspace = () => pro.gate('workspace', () => setIsWorkspaceOpen(true));
  const openCompare = () => pro.gate('compare', () => setIsCompareOpen(true));
  const openTool = (feature) => {
    setIsToolsOpen(false);
    ({ mockup: openMockup, documents: openDocs, workspace: openWorkspace, compare: openCompare })[feature]?.();
  };

  // Requests, live offers, counter-offers and bookings
  const market = useMarketplace({
    onEvent: (e) => {
      if (e.type === 'bid') {
        toast(`New offer from ${e.bid.supplier.shortName}: ${peso(e.bid.pricePerUnit, 2)}/pc`);
      } else if (e.type === 'counterReply') {
        toast(e.accepted
          ? `${e.bid.supplier.shortName} accepted your counter-offer of ${peso(e.pricePerUnit, 2)}/pc`
          : `${e.bid.supplier.shortName} met you halfway: ${peso(e.pricePerUnit, 2)}/pc`);
      }
    },
  });

  const acceptOffer = (bid) => {
    market.acceptBid(market.activeRequestId, bid.id);
    setIsCompareOpen(false);
    toast(`Order booked with ${bid.supplier.shortName} and now in proofing`);
  };

  const openChat = (supplier) => {
    setChatSupplier(supplier);
    setIsMessagesOpen(true);
  };

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

  // Accept from a supplier profile or chat: book that maker's offer on the active request
  const handleAcceptBid = (supplier) => {
    const bid = market.activeRequest?.bids.find((b) => b.supplierId === supplier?.id);
    if (bid && market.activeRequest.status !== 'booked') acceptOffer(bid);
    else toast(`Ask ${supplier?.name || 'this maker'} to send an offer on your request first.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950 font-sans selection:bg-[#003CF5] selection:text-white">


      {/* Side Navigation Drawer (Matching Reference Screenshot) */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userProfile={userProfile}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        onOpenMessages={() => {
          setChatSupplier(null);
          setIsMessagesOpen(true);
        }}
        onOpenBalance={() => setIsBalanceOpen(true)}
        onOpenReferral={() => setIsReferralOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSuppliers={() => setIsSuppliersOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPro={() => pro.openPaywall(null)}
        isPro={pro.isPro}
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
              onOpenChatWithCustomer={(supplier, pkg = null) => {
                setChatSupplier(supplier);
                setChatPackage(pkg);
                setIsMessagesOpen(true);
              }}
              onOpenMockupStudio={openMockup}
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
            onRequestNewJob={(mode = 'single', cat = 'apparel') => openCreate(mode, cat)}
            onOpenCatalog={(cat = null) => setCatalogCategory(cat)}
            request={market.activeRequest}
            onAcceptBid={acceptOffer}
            onCompareBids={openCompare}
            onOpenSponsorship={() => setIsSponsorshipOpen(true)}
            onOpenWaitlist={() => setIsWaitlistOpen(true)}
            onOpenTools={() => setIsToolsOpen(true)}
          />
        )}
      </main>

      <Toaster />

      {/* Modals & Tools (Triggered contextually when needed) */}
      <Suspense fallback={null}>
      {selectedSupplier && (
        <SupplierProfileModal
          supplier={selectedSupplier}
          liveOffer={(() => {
            const bid = market.activeRequest?.bids.find((b) => b.supplierId === selectedSupplier.id);
            return bid ? { bid, request: market.activeRequest } : null;
          })()}
          onClose={() => setSelectedSupplier(null)}
          onAcceptBid={handleAcceptBid}
          onOpenChat={(supplier) => {
            setChatSupplier(supplier);
            setIsMessagesOpen(true);
          }}
          onOpenSupplierSetup={(supplier) => {
            setSetupSupplier(supplier || selectedSupplier);
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
          incomingPackage={chatPackage}
          activeVenue={activeVenue}
          activeItem={activeItem}
          onAcceptBid={handleAcceptBid}
          onViewSupplier={(supplier) => {
            setIsMessagesOpen(false);
            setSelectedSupplier(supplier);
          }}
        />
      )}

      {/* Meetup-Style Supplier Profile Setup Modal (User Requested) */}
      {isSupplierSetupOpen && (
        <SupplierProfileSetupModal
          isOpen={isSupplierSetupOpen}
          onClose={() => { setIsSupplierSetupOpen(false); setSetupSupplier(null); }}
          initialSupplier={setupSupplier || selectedSupplier || chatSupplier}
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
          {...createPrefill}
          onClose={() => setIsCreateOpen(false)}
          onOpenMockupStudio={openMockup}
          onCreateRequest={(draft) => {
            const req = market.createRequest(draft);
            setActiveItem({
              title: req.title,
              qty: `${req.quantity} ${req.unit}`,
              budget: peso(req.targetBudget),
              specs: req.specs,
              isPackage: req.isPackage,
              categories: req.categories,
              mockupImage: req.mockupImage,
              mockupName: req.mockupName
            });
            toast(`Request posted. Sent to ${req.matchedCount} verified makers.`);
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
          photos={eventPhotos}
          onPhotosChange={setEventPhotos}
          registrationLink={registrationLink}
          onRegistrationLinkChange={setRegistrationLink}
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
      {isCompareOpen && market.activeRequest && (
        <BiddingComparisonModal
          request={market.activeRequest}
          onClose={() => setIsCompareOpen(false)}
          onAccept={acceptOffer}
          onCounter={(bid, price) => {
            market.counterBid(market.activeRequest, bid, price);
            toast(`Counter-offer of ${peso(price, 2)}/pc sent to ${bid.supplier.shortName}`);
          }}
          onChat={openChat}
        />
      )}

      {isWaitlistOpen && (
        <InternationalWaitlistModal isOpen onClose={() => setIsWaitlistOpen(false)} />
      )}
      {isWorkspaceOpen && (
        <EventWorkspace
          requests={market.requests}
          activeRequestId={market.activeRequestId}
          venue={activeVenue}
          onClose={() => setIsWorkspaceOpen(false)}
          onSelectRequest={(id) => {
            market.selectRequest(id);
            setIsWorkspaceOpen(false);
          }}
          onNewRequest={() => {
            setIsWorkspaceOpen(false);
            openCreate();
          }}
          onOpenDocs={openDocs}
          onOpenMockup={openMockup}
          onOpenSponsorship={() => setIsSponsorshipOpen(true)}
          photos={eventPhotos}
          onPhotosChange={setEventPhotos}
          registrationLink={registrationLink}
          onRegistrationLinkChange={setRegistrationLink}
        />
      )}

      {isToolsOpen && <ToolsSheet onClose={() => setIsToolsOpen(false)} onOpen={openTool} />}

      {catalogCategory !== undefined && (
        <CatalogSheet
          initialCategory={catalogCategory}
          onClose={() => setCatalogCategory(undefined)}
          onDescribe={(text) => {
            setCatalogCategory(undefined);
            openCreate('single', 'apparel', text.trim() ? { initialPrompt: text.trim() } : {});
          }}
          onOrder={({ item, quantity, specs }) => {
            setCatalogCategory(undefined);
            const isCustomSet = item.id === 'custom-gift-set';
            openCreate(isCustomSet ? 'package' : 'single', item.category, {
              initialTitle: isCustomSet ? 'Custom gift set' : `${quantity} ${item.name.toLowerCase()}`,
              initialQuantity: quantity,
              initialBudget: '',
              initialSpecs: specs,
            });
          }}
        />
      )}

      </Suspense>
    </div>
  );
}
