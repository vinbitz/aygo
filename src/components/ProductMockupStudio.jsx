import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Download, 
  Check, 
  RotateCw, 
  Sliders, 
  Layers, 
  FileText, 
  Clock, 
  Share2, 
  CheckCircle2, 
  Palette, 
  Move,
  Tag,
  Maximize2,
  Image as ImageIcon,
  PlusCircle,
  Eye,
  FileCheck,
  AlertCircle,
  X
} from 'lucide-react';
import { AYGO_LOGO_DATA_URI } from '../assets/logoBase64';

// Preset Colors
const COLOR_SWATCHES = [
  { name: 'Pitch Black', hex: '#111827', textHex: '#ffffff' },
  { name: 'Pure White', hex: '#ffffff', textHex: '#0f172a' },
  { name: 'Royal Navy', hex: '#1e3a8a', textHex: '#ffffff' },
  { name: 'Forest Green', hex: '#14532d', textHex: '#ffffff' },
  { name: 'Sand Cream', hex: '#f5ebe0', textHex: '#1e293b' },
  { name: 'Crimson Red', hex: '#991b1b', textHex: '#ffffff' },
  { name: 'Heather Gray', hex: '#64748b', textHex: '#ffffff' },
  { name: 'Aygo Electric Blue', hex: '#003CF5', textHex: '#ffffff' }
];

// Initial Mockup Products
const INITIAL_MOCKUP_PRODUCTS = [
  {
    id: 'tee',
    name: 'Heavy Cotton Oversized T-Shirt (220 GSM)',
    category: 'Apparel & Uniforms',
    craftingDays: '4-6 Days',
    moq: '50 pcs',
    recommendedTechnique: 'DTF Full Color',
    safeZone: '10" x 12" (Front Center)',
    material: '100% Combed Compact Cotton, Preshrunk',
    origin: 'studio'
  },
  {
    id: 'tote',
    name: 'Heavyweight Canvas Tote Bag (14oz)',
    category: 'Bags & Totes',
    craftingDays: '5-7 Days',
    moq: '50 pcs',
    recommendedTechnique: 'Silkscreen / DTF',
    safeZone: '8" x 9" (Center Flat)',
    material: '14oz Natural Unbleached Cotton Duck Canvas',
    origin: 'studio'
  },
  {
    id: 'tumbler',
    name: 'Matte Thermal Tumbler (500ml)',
    category: 'Drinkware & Vessels',
    craftingDays: '3-5 Days',
    moq: '30 pcs',
    recommendedTechnique: 'Rotary Laser Engraving',
    safeZone: '2.5" x 5" (Cylindrical Wrap)',
    material: 'SUS304 Double-Wall Vacuum Insulated Steel',
    origin: 'studio'
  },
  {
    id: 'lanyard',
    name: 'Custom Satin Event Lanyards (20mm)',
    category: 'Event Print & Badges',
    craftingDays: '3-4 Days',
    moq: '100 pcs',
    recommendedTechnique: 'Full Sublimation',
    safeZone: '20mm x 900mm (Double-sided Continuous)',
    material: 'High-Density Satin Ribbon with Heavy Trigger Hook',
    origin: 'studio'
  },
  {
    id: 'hoodie',
    name: 'Heavyweight Fleece Pullover Hoodie (320 GSM)',
    category: 'Apparel & Uniforms',
    craftingDays: '5-7 Days',
    moq: '30 pcs',
    recommendedTechnique: 'Computerized Embroidery',
    safeZone: '4" x 4" (Left Chest) or 11" x 12" (Center)',
    material: '320 GSM French Terry Fleece, Ribbed Hem',
    origin: 'studio'
  }
];

// Sample Event Logos for Studio Generator
const SAMPLE_LOGOS = [
  { id: 'aygo', name: 'Aygo Crest', type: 'image', uri: AYGO_LOGO_DATA_URI },
  { id: 'tech', name: 'DevCon Tech Summit', type: 'text', title: 'DEVCON MANILA 2026', subtitle: 'HACKATHON & EXPO' },
  { id: 'startup', name: 'PH Startup Gala', type: 'text', title: 'STARTUP PH', subtitle: 'FOUNDERS ASSEMBLY' },
  { id: 'minimal', name: 'Aygo Minimal', type: 'text', title: 'aygo.store', subtitle: 'VERIFIED SOURCING' }
];

// Sample Pre-made Mockup Proofs for quick testing of Upload option
const SAMPLE_UPLOADED_PROOFS = [
  {
    id: 'proof-1',
    name: 'Agency 3D Bottle & Drinkware Render',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    fileName: 'devcon-drinkware-3d-proof.png',
    fileSize: '3.4 MB',
    technique: 'Rotary Laser Etch',
    material: 'SUS304 Double Wall 500ml',
    moq: '100 pcs',
    craftingDays: '3-5 Days',
    safeZone: 'Rotary 360° Wrap',
    instructions: 'Matte powder coat finish with silver exposed steel etching.'
  },
  {
    id: 'proof-2',
    name: 'Photoshop Event Hoodie 3D Render',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    fileName: 'tech-hoodie-client-mockup.jpg',
    fileSize: '4.8 MB',
    technique: 'Direct-to-Film + Embroidery',
    material: '340 GSM French Terry Cotton',
    moq: '50 pcs',
    craftingDays: '5-7 Days',
    safeZone: '11" x 13" Center Front',
    instructions: 'Puff screen print on chest, micro-embroidery on left sleeve.'
  }
];

export default function ProductMockupStudio({ 
  activeItemTitle = '300 Customized Satin Lanyards',
  onClose = null,
  onSaveMockup = null 
}) {
  // Option: 'create' (Interactive Generator) vs 'upload' (Upload Your Own Mockup)
  const [studioMode, setStudioMode] = useState('create');

  // Gallery state
  const [mockupGallery, setMockupGallery] = useState(INITIAL_MOCKUP_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_MOCKUP_PRODUCTS[0]);
  
  // Customizer State (Create Mode)
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0]);
  const [logoOption, setLogoOption] = useState(SAMPLE_LOGOS[0]);
  const [viewAngle, setViewAngle] = useState('front');
  const [printTechnique, setPrintTechnique] = useState('DTF Full Color');
  const [logoPosition, setLogoPosition] = useState('center');
  const [logoScale, setLogoScale] = useState(100);
  const [logoRotation, setLogoRotation] = useState(0);

  // Upload Mode State
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [uploadedFileDetails, setUploadedFileDetails] = useState({
    name: 'custom-event-mockup.png',
    size: '2.8 MB',
    type: 'image/png'
  });
  const [uploadForm, setUploadForm] = useState({
    name: 'In-House 3D Event Merch Mockup',
    material: '220 GSM 100% Combed Cotton / Preshrunk',
    technique: 'DTF Full Color + Screen',
    craftingDays: '4-5 Days',
    moq: '50 pcs',
    safeZone: '10" x 12" Centered Front',
    instructions: 'Pantone matched to 003CF5, double needle stitched seams.'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Real-time Activity Log (like printingan.com)
  const [activityLogs, setActivityLogs] = useState([
    { time: '16:05', event: 'Initialized Mockup Studio for job specs.' },
    { time: '16:08', event: 'Selected Heavy Cotton Oversized T-Shirt (220 GSM).' },
    { time: '16:10', event: 'Set base color to Pitch Black (#111827).' },
    { time: '16:12', event: 'Applied Official AYGO brand crest to Center Chest.' }
  ]);

  const addLog = (eventText) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityLogs((prev) => [{ time: timeStr, event: eventText }, ...prev.slice(0, 20)]);
  };

  const handleProductChange = (prod) => {
    setSelectedProduct(prod);
    if (prod.origin === 'upload') {
      setStudioMode('upload');
      setUploadedImagePreview(prod.image);
      setUploadForm({
        name: prod.name,
        material: prod.material,
        technique: prod.recommendedTechnique,
        craftingDays: prod.craftingDays,
        moq: prod.moq,
        safeZone: prod.safeZone,
        instructions: prod.instructions || 'Standard production guidelines.'
      });
      addLog(`Loaded uploaded mockup proof: ${prod.name}.`);
    } else {
      setStudioMode('create');
      setPrintTechnique(prod.recommendedTechnique.split('/')[0].trim());
      addLog(`Selected ${prod.name} in Mockup Studio.`);
    }
  };

  const handleColorChange = (swatch) => {
    setSelectedColor(swatch);
    addLog(`Changed garment color to ${swatch.name} (${swatch.hex}).`);
  };

  const handleTechniqueChange = (tech) => {
    setPrintTechnique(tech);
    addLog(`Updated printing method to ${tech}.`);
  };

  const handlePositionChange = (pos) => {
    setLogoPosition(pos);
    const label = pos === 'center' ? 'Center Chest' : pos === 'left-chest' ? 'Left Pocket / Chest' : 'Back Large';
    addLog(`Moved artwork position to ${label}.`);
  };

  // Upload existing mockup file handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        const resultUri = uploadEvt.target?.result;
        setUploadedImagePreview(resultUri);
        setUploadedFileDetails({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          type: file.type || 'image/png'
        });
        setUploadForm(prev => ({
          ...prev,
          name: file.name.replace(/\.[^/.]+$/, "")
        }));
        addLog(`Uploaded external mockup file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplySampleProof = (sample) => {
    setUploadedImagePreview(sample.image);
    setUploadedFileDetails({
      name: sample.fileName,
      size: sample.fileSize,
      type: 'image/jpeg'
    });
    setUploadForm({
      name: sample.name,
      material: sample.material,
      technique: sample.technique,
      craftingDays: sample.craftingDays,
      moq: sample.moq,
      safeZone: sample.safeZone,
      instructions: sample.instructions
    });
    addLog(`Loaded sample external proof: ${sample.name}.`);
  };

  const handleSaveUploadedMockup = () => {
    const newId = `upload-${Date.now()}`;
    const newMockupItem = {
      id: newId,
      name: uploadForm.name || 'Uploaded Custom Mockup',
      category: 'Custom Uploaded Proof',
      craftingDays: uploadForm.craftingDays || '4-6 Days',
      moq: uploadForm.moq || '50 pcs',
      recommendedTechnique: uploadForm.technique || 'DTF Full Color',
      safeZone: uploadForm.safeZone || 'Custom Spec',
      material: uploadForm.material || 'Client Provided Spec',
      instructions: uploadForm.instructions,
      origin: 'upload',
      image: uploadedImagePreview || SAMPLE_UPLOADED_PROOFS[0].image
    };

    setMockupGallery(prev => [newMockupItem, ...prev]);
    setSelectedProduct(newMockupItem);
    setIsSaved(true);
    setSaveToast(true);
    addLog(`Attached custom uploaded mockup "${newMockupItem.name}" to Active Sourcing RFP.`);
    setTimeout(() => setSaveToast(false), 3500);

    if (onSaveMockup) {
      onSaveMockup({
        name: newMockupItem.name,
        data: newMockupItem.image || AYGO_LOGO_DATA_URI
      });
    }
    if (onClose) {
      setTimeout(() => onClose(), 800);
    }
  };

  const handleSaveStudioMockup = () => {
    setIsSaved(true);
    setSaveToast(true);
    addLog(`Attached generated ${selectedProduct.name} mockup (${printTechnique}) to Sourcing Request.`);
    setTimeout(() => setSaveToast(false), 3500);

    if (onSaveMockup) {
      onSaveMockup({
        name: `${selectedProduct.name} (${selectedColor.name} / ${printTechnique})`,
        data: AYGO_LOGO_DATA_URI
      });
    }
    if (onClose) {
      setTimeout(() => onClose(), 800);
    }
  };

  // Render Interactive SVG for Studio Mode
  const renderProductGraphic = () => {
    const fillColor = selectedColor.hex;
    const isDark = selectedColor.hex === '#111827' || selectedColor.hex === '#1e3a8a' || selectedColor.hex === '#14532d' || selectedColor.hex === '#991b1b';
    const scaleFactor = logoScale / 100;
    const posClass = 
      logoPosition === 'left-chest' 
        ? 'top-[36%] left-[34%] -translate-x-1/2 -translate-y-1/2'
        : logoPosition === 'back-large'
        ? 'top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-125'
        : 'top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2';

    return (
      <div className="relative w-full h-80 sm:h-96 flex items-center justify-center select-none overflow-hidden">
        {selectedProduct.id === 'tee' && (
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-80 drop-shadow-xl transition-colors duration-300">
            <path
              d="M 130 90 L 160 110 C 180 118, 220 118, 240 110 L 270 90 L 320 135 L 290 175 L 260 160 L 260 340 C 260 345, 255 350, 250 350 L 150 350 C 145 350, 140 345, 140 340 L 140 160 L 110 175 L 80 135 Z"
              fill={fillColor}
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M 160 110 C 180 125, 220 125, 240 110 C 225 132, 175 132, 160 110 Z"
              fill={isDark ? '#374151' : '#e2e8f0'}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            <path d="M 260 160 L 270 90" stroke={isDark ? '#475569' : '#cbd5e1'} strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 140 160 L 130 90" stroke={isDark ? '#475569' : '#cbd5e1'} strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 145 330 Q 150 240 155 170" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} strokeWidth="6" fill="none" />
            <path d="M 255 330 Q 250 240 245 170" stroke={isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'} strokeWidth="6" fill="none" />
          </svg>
        )}

        {selectedProduct.id === 'tote' && (
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-80 drop-shadow-xl transition-colors duration-300">
            <path d="M 160 160 C 160 70, 190 70, 190 160" fill="none" stroke={fillColor} strokeWidth="14" strokeLinecap="round" />
            <path d="M 210 160 C 210 70, 240 70, 240 160" fill="none" stroke={fillColor} strokeWidth="14" strokeLinecap="round" />
            <rect x="120" y="160" width="160" height="180" rx="12" fill={fillColor} stroke="#0f172a" strokeWidth="2.5" />
            <line x1="120" y1="180" x2="280" y2="180" stroke={isDark ? '#475569' : '#cbd5e1'} strokeWidth="2" strokeDasharray="4 2" />
          </svg>
        )}

        {selectedProduct.id === 'tumbler' && (
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-80 drop-shadow-xl transition-colors duration-300">
            <rect x="155" y="85" width="90" height="20" rx="4" fill="#8d6e63" stroke="#0f172a" strokeWidth="2" />
            <rect x="150" y="105" width="100" height="15" rx="3" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
            <path d="M 152 120 L 160 330 C 160 340, 240 340, 240 330 L 248 120 Z" fill={fillColor} stroke="#0f172a" strokeWidth="2.5" />
            <path d="M 161 325 L 239 325 L 238 335 L 162 335 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
            <path d="M 170 130 L 175 320" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
          </svg>
        )}

        {selectedProduct.id === 'lanyard' && (
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-80 drop-shadow-xl transition-colors duration-300">
            <path d="M 140 70 C 140 40, 260 40, 260 70 L 210 240 L 190 240 Z" fill="none" stroke={fillColor} strokeWidth="26" strokeLinejoin="round" />
            <rect x="192" y="240" width="16" height="22" rx="3" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="200" cy="270" r="8" fill="none" stroke="#64748b" strokeWidth="3" />
            <rect x="160" y="280" width="80" height="100" rx="6" fill="#f8fafc" stroke="#003CF5" strokeWidth="2" />
            <rect x="185" y="286" width="30" height="6" rx="3" fill="#cbd5e1" />
            <rect x="170" y="305" width="60" height="60" rx="4" fill="#e2e8f0" />
          </svg>
        )}

        {selectedProduct.id === 'hoodie' && (
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-80 drop-shadow-xl transition-colors duration-300">
            <path d="M 160 110 C 160 60, 240 60, 240 110 Z" fill={isDark ? '#1f2937' : '#e2e8f0'} stroke="#0f172a" strokeWidth="2" />
            <path d="M 130 110 L 160 120 C 180 125, 220 125, 240 120 L 270 110 L 325 170 L 295 205 L 265 180 L 265 340 L 135 340 L 135 180 L 105 205 L 75 170 Z" fill={fillColor} stroke="#0f172a" strokeWidth="2.5" />
            <path d="M 160 260 L 240 260 L 250 320 L 150 320 Z" fill={fillColor} stroke="#0f172a" strokeWidth="2" />
            <line x1="185" y1="125" x2="182" y2="185" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
            <line x1="215" y1="125" x2="218" y2="185" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {/* Live Logo Overlay */}
        <div 
          className={`absolute pointer-events-none transition-all duration-200 ${posClass}`}
          style={{
            transform: `scale(${scaleFactor}) rotate(${logoRotation}deg)`,
            filter: 
              printTechnique.includes('Embroidery') 
                ? 'drop-shadow(1px 2px 1px rgba(0,0,0,0.5))' 
                : printTechnique.includes('Laser')
                ? 'contrast(1.4) brightness(1.2)'
                : 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))'
          }}
        >
          {logoOption.type === 'image' ? (
            <img 
              src={logoOption.uri} 
              alt="Mockup Artwork" 
              className="max-w-[75px] max-h-[75px] object-contain rounded-lg"
            />
          ) : (
            <div className="text-center px-2 py-1 bg-black/10 backdrop-blur-2xs rounded border border-white/20">
              <div className="text-[11px] font-black tracking-tight leading-none" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                {logoOption.title}
              </div>
              <div className="text-[8px] font-extrabold tracking-widest uppercase mt-0.5" style={{ color: isDark ? '#93c5fd' : '#003CF5' }}>
                {logoOption.subtitle}
              </div>
            </div>
          )}
        </div>

        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-200 text-[9px] font-bold text-slate-600 flex items-center gap-1">
          <Maximize2 className="w-3 h-3 text-[#003CF5]" />
          <span>Safe Zone: {selectedProduct.safeZone}</span>
        </div>

        <div className="absolute top-2 right-2 z-10 flex gap-1 bg-white/90 backdrop-blur-md p-1 rounded-lg border border-slate-200 text-[10px] font-bold">
          <button 
            type="button"
            onClick={() => setViewAngle('front')}
            className={`px-2 py-0.5 rounded ${viewAngle === 'front' ? 'bg-[#003CF5] text-white' : 'text-slate-600'}`}
          >
            Front
          </button>
          <button 
            type="button"
            onClick={() => setViewAngle('back')}
            className={`px-2 py-0.5 rounded ${viewAngle === 'back' ? 'bg-[#003CF5] text-white' : 'text-slate-600'}`}
          >
            Back
          </button>
        </div>
      </div>
    );
  };

  const studioBody = (
    <div className="max-w-7xl mx-auto space-y-6">
        
        {/* SECTION 1: Top Mockups Gallery ("All the mockups for the product") */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#003CF5] text-white">
                  Active Proofs & Mockups
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Ready for Verified Supplier Bids
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-950 mt-1">
                Product Mockups for "{activeItemTitle}"
              </h2>
            </div>

            {/* Quick Action to switch modes */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Specs Synchronized with Suppliers</span>
              </span>
            </div>
          </div>

          {/* Cards for all mockups (Studio Created & Uploaded) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {mockupGallery.map((item) => {
              const isSelected = selectedProduct.id === item.id;
              const isUploaded = item.origin === 'upload';
              return (
                <div
                  key={item.id}
                  onClick={() => handleProductChange(item)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#003CF5] bg-blue-50/60 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span className={`px-1.5 py-0.2 rounded font-extrabold ${isUploaded ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'}`}>
                        {isUploaded ? 'Uploaded Proof' : 'Studio Created'}
                      </span>
                      <span>{item.craftingDays}</span>
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-900 line-clamp-2">{item.name}</h3>
                    <p className="text-[11px] text-[#003CF5] font-semibold mt-1">{item.recommendedTechnique}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] font-bold">
                    <span className={isSelected ? 'text-[#003CF5]' : 'text-slate-500'}>
                      {isSelected ? 'Viewing Proof ↓' : 'Select'}
                    </span>
                    {isUploaded ? <ImageIcon className="w-3 h-3 text-amber-600" /> : <Sliders className="w-3 h-3 text-slate-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: DUAL OPTION SELECTOR: Create Mockup vs Upload Mockup */}
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setStudioMode('create');
              addLog('Switched to Interactive Mockup Generator Studio.');
            }}
            className={`py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2.5 ${
              studioMode === 'create'
                ? 'bg-white text-[#003CF5] shadow-md border border-slate-200 ring-1 ring-blue-200'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#003CF5]" />
            <div className="text-left">
              <div>Create Mockup (Interactive Studio)</div>
              <p className="text-[10px] font-normal text-slate-500">Design online with blanks, colors, techniques & logo placement</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setStudioMode('upload');
              addLog('Switched to Upload Your Own Mockup mode.');
            }}
            className={`py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2.5 ${
              studioMode === 'upload'
                ? 'bg-white text-[#003CF5] shadow-md border border-slate-200 ring-1 ring-blue-200'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/50'
            }`}
          >
            <Upload className="w-4 h-4 text-[#003CF5]" />
            <div className="text-left">
              <div>Upload Your Mockup / Ready Proof</div>
              <p className="text-[10px] font-normal text-slate-500">Upload existing designer PNG, PDF, or 3D product renders</p>
            </div>
          </button>
        </div>

        {/* SECTION 3A: CREATE MOCKUP IN STUDIO (Printingan Style Generator) */}
        {studioMode === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/80 border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            
            {/* LEFT: Live Interactive Product Canvas */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#003CF5] tracking-wider">Live Proofing Canvas</span>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedProduct.name}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {selectedColor.name}
                  </span>
                  <span className="text-xs font-bold text-[#003CF5] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {printTechnique}
                  </span>
                </div>
              </div>

              {/* Graphic SVG Stage */}
              {renderProductGraphic()}

              {/* Bottom Proof Actions */}
              <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveStudioMockup}
                    className="px-4 py-2 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSaved ? 'Mockup Attached to Job' : 'Save Mockup to Request'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`High-resolution production proof exported for ${selectedProduct.name} (${selectedColor.name}, ${printTechnique}).`);
                      addLog(`Exported high-res production proof spec PDF.`);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Proof</span>
                  </button>
                </div>

                {saveToast && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 animate-fade-in">
                    Synchronized with active supplier bids!
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT: Customizer Controls */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* 1. Base Garment / Item Color Swatches */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#003CF5]" />
                    <span>1. Item Colorway</span>
                  </label>
                  <span className="text-[11px] font-bold text-slate-500">{selectedColor.name}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => handleColorChange(swatch)}
                      title={swatch.name}
                      style={{ backgroundColor: swatch.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        selectedColor.name === swatch.name 
                          ? 'scale-125 border-[#003CF5] ring-2 ring-blue-300' 
                          : 'border-slate-300 hover:scale-110'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Artwork & Logo Selection */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#003CF5]" />
                  <span>2. Logo / Artwork</span>
                </label>

                <div className="grid grid-cols-2 gap-1.5">
                  {SAMPLE_LOGOS.map((logo) => (
                    <button
                      key={logo.id}
                      type="button"
                      onClick={() => {
                        setLogoOption(logo);
                        addLog(`Selected preset artwork: ${logo.name}.`);
                      }}
                      className={`px-2.5 py-2 rounded-xl text-left border text-xs font-bold transition-all ${
                        logoOption.id === logo.id
                          ? 'border-[#003CF5] bg-blue-50 text-[#003CF5]'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {logo.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Placement & Technique */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#003CF5]" />
                  <span>3. Print Technique & Placement</span>
                </label>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {['DTF Full Color', 'Silkscreen Print', 'Computerized Embroidery', 'Rotary Laser'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTechniqueChange(t)}
                      className={`py-1.5 px-2 rounded-xl font-bold border transition-all text-center ${
                        printTechnique === t
                          ? 'border-[#003CF5] bg-[#003CF5] text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600">Print Area Position</span>
                  <div className="grid grid-cols-3 gap-1.5 mt-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handlePositionChange('center')}
                      className={`py-1 rounded-lg font-semibold border ${
                        logoPosition === 'center' ? 'border-[#003CF5] bg-blue-50 text-[#003CF5]' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Center
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePositionChange('left-chest')}
                      className={`py-1 rounded-lg font-semibold border ${
                        logoPosition === 'left-chest' ? 'border-[#003CF5] bg-blue-50 text-[#003CF5]' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Left Pocket
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePositionChange('back-large')}
                      className={`py-1 rounded-lg font-semibold border ${
                        logoPosition === 'back-large' ? 'border-[#003CF5] bg-blue-50 text-[#003CF5]' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Full Back
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                      <span>Artwork Size</span>
                      <span>{logoScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={logoScale}
                      onChange={(e) => setLogoScale(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#003CF5]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                      <span>Rotation</span>
                      <span>{logoRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      value={logoRotation}
                      onChange={(e) => setLogoRotation(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#003CF5]"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 3B: UPLOAD YOUR OWN MOCKUP / PROOF */}
        {studioMode === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/80 border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            
            {/* LEFT: Uploaded Proof Inspector & Display */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">External Mockup Proof</span>
                  <h3 className="text-base font-extrabold text-slate-900">{uploadForm.name || 'Uploaded Design Proof'}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    Client Design File
                  </span>
                </div>
              </div>

              {/* Upload Dropzone or Image Preview */}
              <div className="my-4">
                {uploadedImagePreview ? (
                  <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-200">
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded Mockup Preview"
                      className="w-full h-full object-contain"
                    />
                    {/* Floating Info Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900 truncate max-w-xs">{uploadedFileDetails.name}</p>
                        <p className="text-[10px] text-slate-500">{uploadedFileDetails.size} · Verified Design File</p>
                      </div>
                      <label className="px-3 py-1.5 bg-[#003CF5] hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors">
                        <span>Replace File</span>
                        <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="w-full h-80 sm:h-96 rounded-2xl border-2 border-dashed border-blue-300 hover:border-[#003CF5] bg-blue-50/40 hover:bg-blue-50/70 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#003CF5] flex items-center justify-center mb-3 shadow-inner">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h4 className="font-black text-sm text-slate-900">Drag and drop your mockup proof here</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Supports PNG, JPG, WebP, PDF, or SVG design proofs (up to 50MB)
                    </p>
                    <span className="mt-4 px-4 py-2 rounded-xl bg-[#003CF5] text-white text-xs font-bold shadow-md shadow-blue-500/20">
                      Browse Computer Files
                    </span>
                    <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Sample Quick Proofs */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-700">Or test with pre-rendered agency proof:</span>
                  <span className="text-[10px] text-slate-400">Click to preview</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_UPLOADED_PROOFS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleApplySampleProof(sample)}
                      className="p-2 rounded-xl border border-slate-200 hover:border-[#003CF5] bg-slate-50 hover:bg-blue-50/50 text-left transition-all flex items-center gap-2"
                    >
                      <img src={sample.image} alt={sample.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-slate-900 truncate">{sample.name}</p>
                        <p className="text-[10px] text-slate-500">{sample.fileSize} · {sample.technique}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-slate-100 pt-4 mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSaveUploadedMockup}
                  className="px-5 py-2.5 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Attach Uploaded Mockup to Job & Suppliers</span>
                </button>

                {saveToast && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    Uploaded mockup added to active proofs!
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT: Metadata and Specification Details for Uploaded Proof */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <h4 className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#003CF5]" />
                    <span>Uploaded Proof Specifications</span>
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500">For Bidding Suppliers</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item / Garment Name</label>
                  <input
                    type="text"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    placeholder="e.g. 240 GSM Acid Wash Cotton Tee"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Material & Fabric Grade</label>
                  <input
                    type="text"
                    value={uploadForm.material}
                    onChange={(e) => setUploadForm({ ...uploadForm, material: e.target.value })}
                    placeholder="e.g. 100% Combed Cotton / SUS304 Steel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Print Technique</label>
                    <select
                      value={uploadForm.technique}
                      onChange={(e) => setUploadForm({ ...uploadForm, technique: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                    >
                      <option value="DTF Full Color">DTF Full Color</option>
                      <option value="Silkscreen Spot Color">Silkscreen Spot Color</option>
                      <option value="Computerized Embroidery">Computerized Embroidery</option>
                      <option value="Rotary Laser Engraving">Rotary Laser Engraving</option>
                      <option value="Full Sublimation">Full Sublimation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target MOQ</label>
                    <input
                      type="text"
                      value={uploadForm.moq}
                      onChange={(e) => setUploadForm({ ...uploadForm, moq: e.target.value })}
                      placeholder="e.g. 100 pcs"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Print Safe Zone / Dimensions</label>
                  <input
                    type="text"
                    value={uploadForm.safeZone}
                    onChange={(e) => setUploadForm({ ...uploadForm, safeZone: e.target.value })}
                    placeholder="e.g. 10.5 x 12 inches Center Chest"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Special Notes for Suppliers</label>
                  <textarea
                    rows={3}
                    value={uploadForm.instructions}
                    onChange={(e) => setUploadForm({ ...uploadForm, instructions: e.target.value })}
                    placeholder="e.g. Needs neck tag print and individual polybag packaging."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003CF5] resize-none"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SECTION 4: Live Specifications & Activity Log (like printingan.com) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Spec Sheet Table */}
          <div className="md:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#003CF5]" />
                <span>Active Production Spec Sheet</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Sourcing Ready
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Selected Proof</span>
                <span className="font-bold text-slate-900">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Proof Origin</span>
                <span className={`font-bold ${selectedProduct.origin === 'upload' ? 'text-amber-700' : 'text-[#003CF5]'}`}>
                  {selectedProduct.origin === 'upload' ? 'Uploaded Design Proof' : 'Studio Generated'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Fabric / Material Spec</span>
                <span className="font-semibold text-slate-800 text-right max-w-[240px]">{selectedProduct.material}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Print Technique</span>
                <span className="font-bold text-[#003CF5]">{selectedProduct.recommendedTechnique || printTechnique}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Safe Print Area</span>
                <span className="font-semibold text-slate-800">{selectedProduct.safeZone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Est. Crafting Turnaround</span>
                <span className="font-bold text-emerald-600">{selectedProduct.craftingDays} (MOQ: {selectedProduct.moq})</span>
              </div>
            </div>
          </div>

          {/* Real-time Activity / Audit Log (like printingan.com) */}
          <div className="md:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#003CF5]" />
                <span>Real-Time Modification & Activity Log</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-500">
                {activityLogs.length} Events Tracked
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
              {activityLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 text-slate-700 py-1 border-b border-slate-50 last:border-none">
                  <span className="text-[10px] font-black text-slate-400 font-mono mt-0.5">{log.time}</span>
                  <p className="font-medium text-slate-800 text-[11px] leading-relaxed">
                    {log.event}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-2 sm:p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003CF5] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950">Aygo Mockup Studio & Specification Generator</h2>
                <p className="text-xs text-slate-500">Design your event merchandise proofs or upload custom artwork for verified makers.</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={onClose} 
              className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Scrollable Body */}
          <div className="overflow-y-auto p-4 sm:p-6 custom-scroll">
            {studioBody}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-white border-t border-slate-200 p-4 sm:p-8 font-sans">
      {studioBody}
    </section>
  );
}
