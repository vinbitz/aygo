import React, { Suspense, lazy, useState } from 'react';
import SideDrawer from './components/SideDrawer';
import AygoSourcingView from './components/AygoSourcingView';
import Toaster from './components/Toaster';
import { toast } from './lib/toast';
import useMarketplace from './state/useMarketplace';
import { usePro } from './state/pro';
import { peso } from './lib/marketplace';
import { EMPTY_EVENT_PHOTOS } from './lib/images';
import { SUPPLIERS } from './data/mockData';
import { organizerParty, unreadTotal } from './lib/chatStore';

// Popups are loaded on first open so the home screen ships a smaller bundle
const SupplierProfileModal = lazy(() => import('./components/SupplierProfileModal'));
const CreateRequestModal = lazy(() => import('./components/CreateRequestModal'));
const ProductMockupStudio = lazy(() => import('./components/ProductMockupStudio'));
const DocumentGeneratorModal = lazy(() => import('./components/DocumentGeneratorModal'));
const SponsorshipConnectModal = lazy(() => import('./components/SponsorshipConnectModal'));
const AygoMessagingModal = lazy(() => import('./components/AygoMessagingModal'));
const SupplierProfileSetupModal = lazy(() => import('./components/SupplierProfileSetupModal'));
const BalancePaymentModal = lazy(() => import('./components/BalancePaymentModal'));
const AvailabilitySheet = lazy(() => import('./components/AvailabilitySheet'));
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
  // A message posted into the thread when the chat opens (a maker's package, a document)
  const [chatIncoming, setChatIncoming] = useState(null);
  const [isSupplierSetupOpen, setIsSupplierSetupOpen] = useState(false);
  const [isSupplierMode, setIsSupplierMode] = useState(false);
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
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
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  // Event cover + gallery, shared by the event workspace and Sponsorship Connect
  const [eventPhotos, setEventPhotos] = useState(EMPTY_EVENT_PHOTOS);
  const [registrationLink, setRegistrationLink] = useState('');

  // Pro tools: 3 free uses each on the Free plan, then the Aygo Pro paywall
  const pro = usePro();
  // Mockups and documents open as a free preview; saving, downloading or sending uses a free try
  const openMockup = () => setIsMockupOpen(true);
  const openDocs = () => setIsDocsOpen(true);
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
      } else if (e.type === 'dispatched') {
        toast('Your order is on the way. Confirm when it arrives to release the payment.');
      }
    },
  });

  const acceptOffer = (bid) => {
    market.acceptBid(market.activeRequestId, bid.id);
    setIsCompareOpen(false);
    toast(`Order booked with ${bid.supplier.shortName} and now in proofing`);
  };

  const openChat = (supplier, incoming = null) => {
    setChatSupplier(supplier);
    setChatIncoming(incoming);
    setIsMessagesOpen(true);
  };

  // One counter-offer path for chat, profile and the compare sheet
  const counterWith = (supplier, price) => {
    const r = market.activeRequest;
    const bid = r?.bids.find((b) => b.supplierId === supplier?.id);
    if (!bid || r.status !== 'bidding') {
      toast(`There is no open offer from ${supplier?.shortName || supplier?.name || 'this maker'} to counter.`);
      return false;
    }
    if (!(price > 0) || price >= bid.pricePerUnit) {
      toast(`Your counter needs to be below their ${peso(bid.pricePerUnit, 2)}/pc offer.`);
      return false;
    }
    market.counterBid(r, bid, price);
    toast(`Counter-offer of ${peso(price, 2)}/pc sent to ${bid.supplier.shortName}`);
    return true;
  };

  const closeChat = () => {
    setIsMessagesOpen(false);
    setChatIncoming(null);
  };

  // The maker the organizer is working with right now (booked maker, else the first offer)
  const currentMaker = () => {
    const r = market.activeRequest;
    const bid = r?.bids.find((b) => b.id === r.acceptedBidId) || r?.bids[0];
    return bid?.supplier || SUPPLIERS.find((x) => x.id === 's3');
  };

  // A generated document goes straight into the right chat
  const attachDocument = (doc) => {
    setIsDocsOpen(false);
    const party = isSupplierMode
      ? organizerParty({ organizer: 'BGC Tech Summit', item: 'Custom satin lanyards', qty: 300, budget: 15000, venue: 'Arthaland Century Pacific Tower, BGC', deadline: 'Oct 15' })
      : currentMaker();
    openChat(party, { id: `doc-${Date.now()}`, type: 'document', text: `Here is the ${doc.name.split(' — ')[0].toLowerCase()}.`, docData: doc });
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
  // Returns true when an offer was booked, so the chat only shows "accepted" when it really happened
  const handleAcceptBid = (supplier) => {
    const request = market.activeRequest;
    const bid = request?.bids.find((b) => b.supplierId === supplier?.id);
    if (request && request.status !== 'bidding') {
      toast(request.acceptedBidId === bid?.id ? 'This maker is already booked for your request.' : 'You already booked a maker for this request.');
      return false;
    }
    if (!bid) {
      toast(`Ask ${supplier?.name || 'this maker'} to send an offer on your request first.`);
      return false;
    }
    acceptOffer(bid);
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950 font-sans selection:bg-[#003CF5] selection:text-white">


      {/* Side Navigation Drawer (Matching Reference Screenshot) */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userProfile={userProfile}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        onOpenMessages={() => openChat(null)}
        unreadMessages={unreadTotal(isSupplierMode ? 'maker' : 'organizer') ?? (isSupplierMode ? 1 : 2)}
        onOpenBalance={() => setIsBalanceOpen(true)}
        onOpenReferral={() => setIsReferralOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSuppliers={() => setIsSuppliersOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAvailability={() => setIsAvailabilityOpen(true)}
        onOpenPro={() => pro.openPaywall(null, isSupplierMode ? 'maker' : 'organizer')}
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
              onOpenChatWithCustomer={(party, incoming = null) => openChat(party, incoming)}
              onOpenDocuments={openDocs}
              onOpenPro={() => pro.openPaywall(null, 'maker')}
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
            onOpenChatWithSupplier={(supplier) => openChat(supplier)}
            onOpenMessages={() => openChat(null)}
            unreadMessages={unreadTotal('organizer') ?? 2}
            onRequestNewJob={(mode = 'single', cat = 'apparel') => openCreate(mode, cat)}
            onOpenCatalog={(cat = null) => setCatalogCategory(cat)}
            request={market.activeRequest}
            onAcceptBid={acceptOffer}
            onCompareBids={openCompare}
            onConfirmReceived={(requestId, bid) => {
              market.confirmReceived(requestId);
              toast(`Delivery confirmed. Payment released to ${bid.supplier.shortName || bid.supplier.name}.`);
            }}
            onRateOrder={(requestId, bid, stars, comment) => {
              market.rateOrder(requestId, stars, comment);
              toast(`Thanks! Your ${stars}-star review is on ${bid.supplier.shortName || bid.supplier.name}'s storefront.`);
            }}
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
          onOpenChat={(supplier) => openChat(supplier)}
          onCounter={counterWith}
          onInvite={(supplier) => {
            setSelectedSupplier(null);
            const r = market.activeRequest;
            openChat(supplier, {
              id: `inv-${Date.now()}`,
              type: 'text',
              text: r
                ? `Hi ${supplier.shortName || supplier.name}! We'd like you to bid on our request: ${r.quantity} ${r.unit || 'pcs'} ${r.title.replace(/^\d+\s*/, '')}, needed by ${new Date(r.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. Budget ${peso(r.targetBudget)}.`
                : `Hi ${supplier.shortName || supplier.name}! We'd like you to bid on our next event order.`
            });
          }}
          onCallBooked={(supplier, when) => {
            setSelectedSupplier(null);
            openChat(supplier, { id: `call-${Date.now()}`, type: 'text', text: `Booked a call with you: ${when}. See you then!` });
          }}
        />
      )}

      {/* Real-time Customer & Supplier Messaging Modal (User Requested) */}
      {isMessagesOpen && (
        <AygoMessagingModal
          isOpen={isMessagesOpen}
          onClose={closeChat}
          initialSupplier={chatSupplier}
          incoming={chatIncoming}
          viewer={isSupplierMode ? 'maker' : 'organizer'}
          canAccept={market.activeRequest?.status === 'bidding'}
          onCounter={counterWith}
          onOpenMockup={openMockup}
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
      {/* Makers edit only their own profile, and only from supplier mode */}
      {isSupplierSetupOpen && isSupplierMode && (
        <SupplierProfileSetupModal
          isOpen={isSupplierSetupOpen}
          onClose={() => setIsSupplierSetupOpen(false)}
          initialSupplier={SUPPLIERS.find((x) => x.id === 's3')}
          onSaveProfile={() => toast('Your maker profile is updated.')}
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
          plan={isSupplierMode ? 'maker' : 'organizer'}
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
          plan={isSupplierMode ? 'maker' : 'organizer'}
          onClose={() => setIsDocsOpen(false)}
          onAttach={attachDocument}
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
            toast('Application submitted. We review your documents within 24 hours.');
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
          requests={market.requests}
          onReorder={(req) => openCreate('single', 'apparel', { initialPrompt: req.title })}
          onSelectRequest={(req) => {
            setIsHistoryOpen(false);
            if (req.marketId) {
              market.selectRequest(req.marketId);
              return;
            }
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

      {isAvailabilityOpen && <AvailabilitySheet onClose={() => setIsAvailabilityOpen(false)} />}

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
          onOpenAvailability={() => setIsAvailabilityOpen(true)}
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
          onViewMaker={(maker) => {
            setCatalogCategory(undefined);
            setSelectedSupplier(maker);
          }}
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
