import React, { useState } from 'react';
import { X, Sparkles, Send, MapPin, Calendar, DollarSign, Package, Layers, Check, Tag, Upload, Clock, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { analyzeSourcingRequest } from '../services/jevAiService';

export default function CreateRequestModal({ 
  onClose, 
  onCreateRequest,
  onOpenMockupStudio,
  initialLocation = 'Arthaland Century Pacific Tower, 4th Ave, 30th St, Taguig, Metro Manila',
  initialDeliveryDate = '2026-10-15',
  initialMode = 'single',
  initialCategory = 'apparel'
}) {
  const [requestMode, setRequestMode] = useState(initialMode);
  const [selectedCategories, setSelectedCategories] = useState(['apparel', 'event-print', 'bags']);
  const [title, setTitle] = useState('');
  const [singleCategory, setSingleCategory] = useState(initialCategory || CATEGORIES[0].id);
  const [packageBreakdown, setPackageBreakdown] = useState('');
  const [packageItems, setPackageItems] = useState([]);
  const [quantity, setQuantity] = useState('300');
  const [targetBudget, setTargetBudget] = useState('105000');
  const [location, setLocation] = useState(initialLocation);
  const [deliveryDate, setDeliveryDate] = useState(initialDeliveryDate);
  const [specs, setSpecs] = useState('');

  // Aygo Assist AI State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiTagSuggestion, setAiTagSuggestion] = useState(null);

  const handleRunAiAnalyze = async () => {
    const text = (title || specs || '').trim();
    if (!text) return;
    
    setIsAiAnalyzing(true);
    try {
      const result = await analyzeSourcingRequest(text);
      setIsAiAnalyzing(false);
      
      if (result && result.success) {
        if (result.isPackage && result.detectedCategories && result.detectedCategories.length > 1) {
          setRequestMode('package');
          setSelectedCategories(result.detectedCategories);
        } else if (result.category) {
          setRequestMode('single');
          setSingleCategory(result.category);
        }

        if (result.quantity) {
          setQuantity(result.quantity.toString());
        }

        if (result.estimatedBudget) {
          setTargetBudget(result.estimatedBudget.toString());
        }

        if (result.specsSummary && !specs) {
          setSpecs(result.specsSummary);
        }

        setAiTagSuggestion({
          category: result.category,
          printingMethod: result.printingMethod,
          urgency: result.urgency,
          confidence: Math.round((result.confidence || 0.98) * 100),
          quantity: result.quantity,
          budget: result.estimatedBudget
        });
      }
    } catch (err) {
      setIsAiAnalyzing(false);
      console.error('Error with Aygo Assist analysis:', err);
    }
  };

  // Mockup Attachment State
  const [mockupOption, setMockupOption] = useState('upload'); // 'upload' | 'later'
  const [uploadedMockupImg, setUploadedMockupImg] = useState(null);
  const [uploadedMockupName, setUploadedMockupName] = useState('');

  const handleMockupFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedMockupName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setUploadedMockupImg(evt.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catId));
      }
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isPkg = requestMode === 'package';
    const finalCategories = isPkg ? selectedCategories : [singleCategory];
    const categoryNames = finalCategories
      .map((catId) => CATEGORIES.find((c) => c.id === catId)?.name || catId)
      .join(', ');

    onCreateRequest({
      id: `req-${Date.now()}`,
      title: title || (isPkg ? `Event Package (${finalCategories.length} Categories)` : 'Custom Event Supplies'),
      client: 'Self-Organized Event',
      organizer: 'Current User',
      location,
      deliveryDate,
      targetBudget: Number(targetBudget),
      targetPricePerUnit: Math.round(Number(targetBudget) / (Number(quantity) || 1)),
      quantity: Number(quantity),
      category: isPkg ? 'package' : singleCategory,
      categories: finalCategories,
      categorySummary: isPkg ? `Multi-Category Package: ${categoryNames}` : categoryNames,
      packageBreakdown: isPkg ? packageBreakdown : null,
      packageItems: isPkg ? packageItems : null,
      specs: specs || (isPkg ? `Multi-item bundle covering: ${categoryNames}` : 'Custom event specifications.'),
      mockupImage: uploadedMockupImg,
      mockupName: uploadedMockupName,
      status: 'Bidding in Progress',
      bidsCount: 0,
      bids: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header: Pure 'Tell Aygo what you need' without 'Smart Event Sourcing' */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
              Tell Aygo what you need
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Post single supplies or complete multi-category event packages. Verified craft suppliers send bids directly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Synchronized Location from Top Bar */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#003CF5] text-white flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#003CF5]">
                  Venue / Location
                </span>
                <p className="text-xs font-black text-slate-900 leading-tight mt-0.5">{location}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Required Date: <span className="font-bold text-slate-700">{deliveryDate}</span>
                </p>
              </div>
            </div>
          </div>


          {/* Active Requirement Type Indicator (Already chosen on main screen) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-white ${
                requestMode === 'package' ? 'bg-[#003CF5]' : 'bg-slate-900'
              }`}>
                {requestMode === 'package' ? <Package className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                  {requestMode === 'package' ? 'Event Package' : 'Single Category'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {requestMode === 'package' ? 'Multi-category bundle' : 'One item or service type'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#003CF5] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Selected
            </span>
          </div>

          {/* If Event Package is Active: Multi-Category Selector & Presets */}
          {requestMode === 'package' ? (
            <div className="space-y-3.5 p-4 rounded-2xl bg-[#F7F8FA] border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#003CF5]" />
                  <span>Choose Categories Included in This Package</span>
                </span>
                <span className="text-[10px] font-bold text-[#003CF5] bg-blue-50 px-2 py-0.5 rounded-full">
                  {selectedCategories.length} selected
                </span>
              </div>

              {/* Multi-Category Checkbox Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((c) => {
                  const isChecked = selectedCategories.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleToggleCategory(c.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-[#003CF5] bg-white text-[#003CF5] shadow-sm'
                          : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="truncate pr-1">{c.name}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                        isChecked ? 'bg-[#003CF5] text-white' : 'border border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Package Breakdown */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Package Items Breakdown
                </label>
                <textarea
                  rows={2}
                  value={packageBreakdown}
                  onChange={(e) => setPackageBreakdown(e.target.value)}
                  placeholder="e.g. 300 Cotton Shirts, 300 Sublimation Lanyards, 300 Canvas Totes, 50 VIP Tumblers"
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                />
              </div>
            </div>
          ) : (
            /* Single Category Select with Recommended 4 Categories */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Category
                </label>
                <span className="text-[10px] font-bold text-slate-400">One item or service</span>
              </div>

              {/* Recommended Categories */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Popular Categories:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'apparel', label: 'Apparel & Shirts' },
                    { id: 'event-print', label: 'Event Print & Lanyards' },
                    { id: 'drinkware', label: 'Drinkware & Vessels' },
                    { id: 'bags', label: 'Bags & Totes' }
                  ].map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => setSingleCategory(rec.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        singleCategory === rec.id
                          ? 'bg-[#003CF5] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{rec.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <select
                value={singleCategory}
                onChange={(e) => setSingleCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title & Basic Specs */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                {requestMode === 'package' ? 'Event Package Title' : 'Item / Service Title'}
              </label>

              {/* Simple subtle circular Aygo Assist button */}
              <button
                type="button"
                onClick={() => handleRunAiAnalyze(title || specs)}
                disabled={isAiAnalyzing}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-[#003CF5] border border-slate-200 hover:border-blue-300 flex items-center justify-center transition-all cursor-pointer text-xs"
                title="Aygo Assist: Auto-detect category & specs"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={requestMode === 'package' ? 'e.g. Annual Tech Summit Event Package' : 'e.g. 500 Dri-Fit Event Shirts for BGC marathon'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
              />
            </div>

            {/* Simple compact dismissible Aygo Assist Result Tag */}
            {aiTagSuggestion && (
              <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200 flex items-center justify-between text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#003CF5]" />
                  <span>
                    Aygo Assist: <strong className="capitalize text-slate-900">{aiTagSuggestion.category}</strong> ({aiTagSuggestion.printingMethod})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAiTagSuggestion(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer ml-2"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {requestMode === 'package' ? 'Event Attendees / Sets' : 'Quantity Needed'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Target Total Budget (PHP)
              </label>
              <input
                type="number"
                min="1"
                required
                value={targetBudget}
                onChange={(e) => setTargetBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Target approx: PHP {(Number(targetBudget) / (Number(quantity) || 1)).toFixed(2)} per attendee set
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Delivery Venue / Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. SMX Convention Center / BGC, Taguig"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Required Delivery Date
              </label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Customization Requirements & Technical Specs
            </label>
            <textarea
              rows={3}
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              placeholder="Specify fabric GSM, print technique (Silkscreen, DTF, Sublimation), color pantones, or packaging instructions..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
            />
          </div>

          {/* PRODUCT MOCKUP / DESIGN ATTACHMENT SECTION (User Requested) */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900">
                  Product Mockup & Visuals for Suppliers
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload your mockup now so suppliers can see your artwork, or choose to generate/upload it later in the studio.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#003CF5] border border-blue-200">
                Supplier Preview
              </span>
            </div>

            {/* Radio / Tab choice: Design in Studio vs Upload Mockup vs Do Later */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMockupOption('create');
                  if (onOpenMockupStudio) onOpenMockupStudio();
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 border ${
                  mockupOption === 'create'
                    ? 'border-[#003CF5] bg-white text-[#003CF5] shadow-xs ring-1 ring-blue-300'
                    : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-[#003CF5]" />
                <div>
                  <p className="leading-tight">Design in Studio</p>
                  <p className="text-[10px] font-normal text-slate-400">Launch Mockup Editor</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMockupOption('upload')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 border ${
                  mockupOption === 'upload'
                    ? 'border-[#003CF5] bg-white text-[#003CF5] shadow-xs ring-1 ring-blue-300'
                    : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                <div>
                  <p className="leading-tight">Upload Mockup</p>
                  <p className="text-[10px] font-normal text-slate-400">Attach PNG, JPG, PDF</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMockupOption('later')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 border ${
                  mockupOption === 'later'
                    ? 'border-[#003CF5] bg-white text-[#003CF5] shadow-xs ring-1 ring-blue-300'
                    : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <div>
                  <p className="leading-tight">Do this later</p>
                  <p className="text-[10px] font-normal text-slate-400">Add mockup anytime</p>
                </div>
              </button>
            </div>

            {/* Design in Studio Action Banner */}
            {mockupOption === 'create' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#003CF5]" />
                  <span className="font-bold text-slate-800">
                    {uploadedMockupImg ? 'Mockup design attached from Studio!' : 'Design your custom merchandise mockup in the studio:'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenMockupStudio && onOpenMockupStudio()}
                  className="px-3 py-1 rounded-lg bg-[#003CF5] hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm"
                >
                  {uploadedMockupImg ? 'Edit in Studio' : 'Launch Mockup Studio'}
                </button>
              </div>
            )}

            {/* Upload Dropzone if 'upload' selected */}
            {mockupOption === 'upload' && (
              <div className="pt-1 space-y-2">
                {uploadedMockupImg ? (
                  <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-200">
                    <img src={uploadedMockupImg} alt="Uploaded Mockup" className="h-full object-contain" />
                    <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md p-1.5 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-xs">{uploadedMockupName || 'mockup.png'}</span>
                      <button
                        type="button"
                        onClick={() => { setUploadedMockupImg(null); setUploadedMockupName(''); }}
                        className="text-[10px] font-bold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-blue-300 hover:border-[#003CF5] bg-white rounded-xl cursor-pointer transition-colors text-center">
                    <Upload className="w-5 h-5 text-[#003CF5] mb-1" />
                    <span className="text-xs font-bold text-slate-800">Click or drag mockup image for suppliers</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, PDF up to 50MB</span>
                    <input type="file" accept="image/*,application/pdf" onChange={handleMockupFileChange} className="hidden" />
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {requestMode === 'package' ? 'Broadcast Event Package to Suppliers' : 'Broadcast Request to Suppliers'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
