import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Check,
  Move,
  Image as ImageIcon,
  X,
  Type,
  RefreshCw
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

// Product Blanks
const PRODUCT_BLANKS = [
  {
    id: 'tee',
    name: 'Heavy Cotton T-Shirt (220 GSM)',
    category: 'Apparel',
    defaultTechnique: 'DTF Full Color',
    safeZone: '10" × 12"',
    leadTime: '3-5 Days'
  },
  {
    id: 'hoodie',
    name: 'Heavyweight Fleece Hoodie (320 GSM)',
    category: 'Apparel',
    defaultTechnique: 'Computerized Embroidery',
    safeZone: '11" × 12"',
    leadTime: '5-7 Days'
  },
  {
    id: 'tote',
    name: 'Canvas Tote Bag (14oz)',
    category: 'Bags',
    defaultTechnique: 'Silkscreen / DTF',
    safeZone: '8" × 9"',
    leadTime: '4-6 Days'
  },
  {
    id: 'tumbler',
    name: 'Matte Thermal Tumbler (500ml)',
    category: 'Drinkware',
    defaultTechnique: 'Rotary Laser Etch',
    safeZone: '2.5" × 5"',
    leadTime: '3-4 Days'
  },
  {
    id: 'lanyard',
    name: 'Custom Satin Lanyard (20mm)',
    category: 'Event Print',
    defaultTechnique: 'Full Sublimation',
    safeZone: '20mm × 900mm',
    leadTime: '3-4 Days'
  }
];

// Sample Event Logos
const SAMPLE_LOGOS = [
  { id: 'aygo', name: 'Aygo Crest', type: 'image', uri: AYGO_LOGO_DATA_URI },
  { id: 'devcon', name: 'DevCon Manila', type: 'text', text: 'DEVCON 2026', subtext: 'MANILA' },
  { id: 'startup', name: 'PH Startup Gala', type: 'text', text: 'STARTUP PH', subtext: 'FOUNDERS' },
  { id: 'minimal', name: 'Aygo Store', type: 'text', text: 'AYGO STUDIO', subtext: 'CRAFT HUB' }
];

export default function ProductMockupStudio({
  isOpen = true,
  onClose,
  activeItemTitle = 'Custom Event Merch',
  onSaveMockup,
  activeItemCategory = 'Apparel'
}) {
  // Studio States
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_BLANKS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0]);
  const [printTechnique, setPrintTechnique] = useState('DTF Full Color');
  const [viewAngle, setViewAngle] = useState('front'); // 'front' | 'back'
  
  // Logo & Positioning State (printingan.com interactive drag & drop)
  const [logoOption, setLogoOption] = useState(SAMPLE_LOGOS[0]);
  const [customLogoUrl, setCustomLogoUrl] = useState(null);
  const [customText, setCustomText] = useState('YOUR BRAND');
  const [customSubtext, setCustomSubtext] = useState('EST. 2026');
  
  // Interactive Coordinates (Percentage 0-100%)
  const [logoX, setLogoX] = useState(50); // Center X: 50%
  const [logoY, setLogoY] = useState(42); // Center Y: 42%
  const [logoScale, setLogoScale] = useState(100); // 40% - 180%
  const [logoRotation, setLogoRotation] = useState(0); // -180 to 180 deg
  const [logoOpacity, setLogoOpacity] = useState(100);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Feedback states
  const [isSaved, setIsSaved] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Position presets
  const applyPresetPosition = (preset) => {
    if (preset === 'center') {
      setLogoX(50);
      setLogoY(42);
      setLogoScale(100);
      setLogoRotation(0);
    } else if (preset === 'left-chest') {
      setLogoX(35);
      setLogoY(36);
      setLogoScale(65);
      setLogoRotation(0);
    } else if (preset === 'right-chest') {
      setLogoX(65);
      setLogoY(36);
      setLogoScale(65);
      setLogoRotation(0);
    } else if (preset === 'back-large') {
      setViewAngle('back');
      setLogoX(50);
      setLogoY(45);
      setLogoScale(130);
      setLogoRotation(0);
    } else if (preset === 'lower-pocket') {
      setLogoX(50);
      setLogoY(68);
      setLogoScale(85);
      setLogoRotation(0);
    }
  };

  // Drag Handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Keep within bounds (15% to 85%)
      const boundedX = Math.max(15, Math.min(85, Math.round(x)));
      const boundedY = Math.max(15, Math.min(85, Math.round(y)));
      
      setLogoX(boundedX);
      setLogoY(boundedY);
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !canvasRef.current || !e.touches[0]) return;
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      
      const boundedX = Math.max(15, Math.min(85, Math.round(x)));
      const boundedY = Math.max(15, Math.min(85, Math.round(y)));
      
      setLogoX(boundedX);
      setLogoY(boundedY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target.result;
        setCustomLogoUrl(resultUrl);
        setLogoOption({
          id: 'custom-upload',
          name: file.name,
          type: 'image',
          uri: resultUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Mockup
  const handleSave = () => {
    setIsSaved(true);
    setSaveToast(true);
    if (onSaveMockup) {
      onSaveMockup({
        product: selectedProduct.name,
        color: selectedColor.name,
        technique: printTechnique,
        position: `X: ${logoX}%, Y: ${logoY}%, Angle: ${logoRotation}°, Scale: ${logoScale}%`,
        logoUrl: logoOption.type === 'image' ? (logoOption.uri || customLogoUrl) : null
      });
    }
    setTimeout(() => {
      setSaveToast(false);
      if (onClose) onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  const isDark = selectedColor.hex === '#111827' || selectedColor.hex === '#1e3a8a' || selectedColor.hex === '#14532d' || selectedColor.hex === '#991b1b';
  const fillColor = selectedColor.hex;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-2 sm:p-4 font-sans selection:bg-[#003CF5] selection:text-white">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200">
        
        {/* Top Header */}
        <div className="p-4 sm:px-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003CF5]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950 tracking-tight flex items-center gap-2">
                Mockup Editor
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#003CF5] border border-blue-200">
                  Interactive Drag & Place
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Drag logo anywhere on product blank. Adjust scale, color & view.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#003CF5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSaved ? 'Saved!' : 'Save Mockup'}</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Editor Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 custom-scroll">
          
          {/* LEFT: Live Interactive Product Canvas (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            
            {/* Canvas Container */}
            <div 
              ref={canvasRef}
              className="relative w-full aspect-square max-h-[460px] bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center select-none overflow-hidden touch-none"
            >
              {/* Product Blank Graphic */}
              {selectedProduct.id === 'tee' && (
                <svg viewBox="0 0 400 400" className="w-full h-full p-6 drop-shadow-xl transition-colors duration-300">
                  <path
                    d="M 130 90 L 160 110 C 180 118, 220 118, 240 110 L 270 90 L 320 135 L 290 175 L 260 160 L 260 340 C 260 345, 255 350, 250 350 L 150 350 C 145 350, 140 345, 140 340 L 140 160 L 110 175 L 80 135 Z"
                    fill={fillColor}
                    stroke="#0f172a"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {viewAngle === 'front' ? (
                    <path
                      d="M 160 110 C 180 125, 220 125, 240 110 C 225 132, 175 132, 160 110 Z"
                      fill={isDark ? '#374151' : '#e2e8f0'}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                  ) : (
                    <path
                      d="M 160 110 C 180 102, 220 102, 240 110 C 225 115, 175 115, 160 110 Z"
                      fill={isDark ? '#374151' : '#e2e8f0'}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                  )}
                  <path d="M 260 160 L 270 90" stroke={isDark ? '#475569' : '#cbd5e1'} strokeWidth="1.5" strokeDasharray="3 2" />
                  <path d="M 140 160 L 130 90" stroke={isDark ? '#475569' : '#cbd5e1'} strokeWidth="1.5" strokeDasharray="3 2" />
                  <path d="M 145 330 Q 150 240 155 170" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} strokeWidth="6" fill="none" />
                  <path d="M 255 330 Q 250 240 245 170" stroke={isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'} strokeWidth="6" fill="none" />
                </svg>
              )}

              {selectedProduct.id === 'hoodie' && (
                <svg viewBox="0 0 400 400" className="w-full h-full p-6 drop-shadow-xl transition-colors duration-300">
                  <path d="M 160 110 C 160 60, 240 60, 240 110 Z" fill={isDark ? '#1f2937' : '#e2e8f0'} stroke="#0f172a" strokeWidth="2" />
                  <path d="M 130 110 L 160 120 C 180 125, 220 125, 240 120 L 270 110 L 325 170 L 295 205 L 265 180 L 265 340 L 135 340 L 135 180 L 105 205 L 75 170 Z" fill={fillColor} stroke="#0f172a" strokeWidth="2.5" />
                  {viewAngle === 'front' && (
                    <path d="M 160 260 L 240 260 L 250 320 L 150 320 Z" fill={fillColor} stroke="#0f172a" strokeWidth="2" />
                  )}
                  <line x1="185" y1="125" x2="182" y2="185" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                  <line x1="215" y1="125" x2="218" y2="185" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}

              {selectedProduct.id === 'tote' && (
                <svg viewBox="0 0 400 400" className="w-full h-full p-6 drop-shadow-xl transition-colors duration-300">
                  <path d="M 160 160 C 160 70, 190 70, 190 160" fill="none" stroke={fillColor} strokeWidth="14" strokeLinecap="round" />
                  <path d="M 210 160 C 210 70, 240 70, 240 160" fill="none" stroke={fillColor} strokeWidth="14" strokeLinecap="round" />
                  <rect x="120" y="160" width="160" height="180" rx="12" fill={fillColor} stroke="#0f172a" strokeWidth="2.5" />
                  <line x1="120" y1="180" x2="280" y2="180" stroke={isDark ? '#475569' : '#cbd5e1'} strokeWidth="2" strokeDasharray="4 2" />
                </svg>
              )}

              {selectedProduct.id === 'tumbler' && (
                <svg viewBox="0 0 400 400" className="w-full h-full p-6 drop-shadow-xl transition-colors duration-300">
                  <rect x="155" y="85" width="90" height="20" rx="4" fill="#8d6e63" stroke="#0f172a" strokeWidth="2" />
                  <rect x="150" y="105" width="100" height="15" rx="3" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
                  <path d="M 152 120 L 160 330 C 160 340, 240 340, 240 330 L 248 120 Z" fill={fillColor} stroke="#0f172a" strokeWidth="2.5" />
                  <path d="M 161 325 L 239 325 L 238 335 L 162 335 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
                  <path d="M 170 130 L 175 320" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                </svg>
              )}

              {selectedProduct.id === 'lanyard' && (
                <svg viewBox="0 0 400 400" className="w-full h-full p-6 drop-shadow-xl transition-colors duration-300">
                  <path d="M 140 70 C 140 40, 260 40, 260 70 L 210 240 L 190 240 Z" fill="none" stroke={fillColor} strokeWidth="26" strokeLinejoin="round" />
                  <rect x="192" y="240" width="16" height="22" rx="3" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
                  <circle cx="200" cy="270" r="8" fill="none" stroke="#64748b" strokeWidth="3" />
                  <rect x="160" y="280" width="80" height="100" rx="6" fill="#f8fafc" stroke="#003CF5" strokeWidth="2" />
                  <rect x="185" y="286" width="30" height="6" rx="3" fill="#cbd5e1" />
                  <rect x="170" y="305" width="60" height="60" rx="4" fill="#e2e8f0" />
                </svg>
              )}

              {/* Safe Printable Area Overlay Guides */}
              <div className="absolute inset-[15%] border-2 border-dashed border-blue-400/30 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[9px] font-bold text-blue-500/60 uppercase tracking-widest absolute top-2 right-2">
                  Print Area
                </span>
              </div>

              {/* Interactive Draggable Logo Container */}
              <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                style={{
                  left: `${logoX}%`,
                  top: `${logoY}%`,
                  transform: `translate(-50%, -50%) rotate(${logoRotation}deg) scale(${logoScale / 100})`,
                  opacity: logoOpacity / 100,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                className={`absolute z-20 select-none group transition-[transform,opacity] duration-75 ${
                  isDragging ? 'ring-2 ring-[#003CF5] ring-offset-2 rounded-xl scale-105' : 'hover:ring-1 hover:ring-blue-400 hover:ring-offset-1 rounded-xl'
                }`}
              >
                {/* Artwork Rendering */}
                {logoOption.type === 'image' ? (
                  <img
                    src={logoOption.uri}
                    alt="Logo Artwork"
                    className="max-w-[85px] max-h-[85px] object-contain pointer-events-none drop-shadow-md"
                    style={{
                      filter: printTechnique.includes('Embroidery')
                        ? 'drop-shadow(1px 2px 1px rgba(0,0,0,0.4))'
                        : printTechnique.includes('Laser')
                        ? 'contrast(1.5) brightness(1.2)'
                        : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                  />
                ) : (
                  <div className="px-3 py-1.5 bg-black/15 backdrop-blur-2xs rounded-lg border border-white/20 text-center pointer-events-none">
                    <div 
                      className="text-xs font-black tracking-tight leading-none"
                      style={{ color: isDark ? '#ffffff' : '#0f172a' }}
                    >
                      {logoOption.text || customText}
                    </div>
                    <div 
                      className="text-[8px] font-bold tracking-widest uppercase mt-0.5"
                      style={{ color: isDark ? '#93c5fd' : '#003CF5' }}
                    >
                      {logoOption.subtext || customSubtext}
                    </div>
                  </div>
                )}

                {/* Drag Handle Indicator */}
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#003CF5] text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Move className="w-3 h-3" />
                </div>
              </div>

              {/* View Angle Switcher (Front/Back) */}
              <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-md rounded-xl p-1 border border-slate-200 shadow-xs text-xs font-bold z-10">
                <button
                  type="button"
                  onClick={() => setViewAngle('front')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    viewAngle === 'front' ? 'bg-[#003CF5] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => setViewAngle('back')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    viewAngle === 'back' ? 'bg-[#003CF5] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Back
                </button>
              </div>

              {/* Live Coordinates Badge */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs text-[10px] font-bold text-slate-600 flex items-center gap-1.5 z-10">
                <Move className="w-3 h-3 text-[#003CF5]" />
                <span>X: {logoX}% · Y: {logoY}% · {logoScale}% Size</span>
              </div>
            </div>

            {/* Quick Placement Presets */}
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-1 overflow-x-auto text-xs font-bold">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 pl-2">Placement:</span>
              <button
                type="button"
                onClick={() => applyPresetPosition('center')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#003CF5] text-slate-700 transition-colors"
              >
                Center
              </button>
              <button
                type="button"
                onClick={() => applyPresetPosition('left-chest')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#003CF5] text-slate-700 transition-colors"
              >
                Left Chest
              </button>
              <button
                type="button"
                onClick={() => applyPresetPosition('right-chest')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#003CF5] text-slate-700 transition-colors"
              >
                Right Chest
              </button>
              <button
                type="button"
                onClick={() => applyPresetPosition('back-large')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#003CF5] text-slate-700 transition-colors"
              >
                Full Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoX(50);
                  setLogoY(42);
                  setLogoRotation(0);
                  setLogoScale(100);
                }}
                className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                title="Reset Position"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* RIGHT: Visual Controls & Options (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 1. Blank Selector */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Select Blank Product</span>
                <span className="text-[11px] font-semibold text-slate-400">{selectedProduct.category}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRODUCT_BLANKS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(item);
                      setPrintTechnique(item.defaultTechnique);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedProduct.id === item.id
                        ? 'border-[#003CF5] bg-blue-50/60 ring-2 ring-blue-500/20 text-[#003CF5] font-black'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="text-xs line-clamp-1">{item.name.split('(')[0]}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{item.leadTime}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Colorways */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Garment Color</span>
                <span className="text-xs font-black text-[#003CF5]">{selectedColor.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => setSelectedColor(swatch)}
                    title={swatch.name}
                    style={{ backgroundColor: swatch.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor.hex === swatch.hex
                        ? 'border-[#003CF5] scale-110 shadow-md ring-2 ring-blue-400/40'
                        : 'border-slate-200 hover:scale-105'
                    }`}
                  >
                    {selectedColor.hex === swatch.hex && (
                      <Check className="w-4 h-4 stroke-[3]" style={{ color: swatch.textHex }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Logo & Artwork Source */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Artwork / Logo</span>
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png, image/jpeg, image/svg+xml"
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-[#003CF5] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload PNG</span>
                </button>
              </div>

              {/* Preset Logos */}
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_LOGOS.map((logo) => (
                  <button
                    key={logo.id}
                    type="button"
                    onClick={() => setLogoOption(logo)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                      logoOption.id === logo.id
                        ? 'border-[#003CF5] bg-blue-50/50 text-[#003CF5] ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-white text-slate-700'
                    }`}
                  >
                    {logo.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-[#003CF5] shrink-0" />
                    ) : (
                      <Type className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate">{logo.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Fine Controls: Scale, Rotation & Print Method */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900">Transform & Print Method</span>
              
              {/* Scale Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Size (Scale)</span>
                  <span>{logoScale}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="180"
                  value={logoScale}
                  onChange={(e) => setLogoScale(Number(e.target.value))}
                  className="w-full accent-[#003CF5] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Rotation Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Rotation Angle</span>
                  <span>{logoRotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={logoRotation}
                  onChange={(e) => setLogoRotation(Number(e.target.value))}
                  className="w-full accent-[#003CF5] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Print Technique Pill Selector */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Print Technique</label>
                <div className="flex flex-wrap gap-1.5">
                  {['DTF Full Color', 'Silkscreen', 'Embroidery', 'Laser Etch', 'Sublimation'].map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setPrintTechnique(tech)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        printTechnique === tech
                          ? 'bg-[#003CF5] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Final Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-3.5 rounded-2xl bg-[#003CF5] hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>{isSaved ? 'Mockup Saved to Request!' : 'Save & Attach to Request'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
