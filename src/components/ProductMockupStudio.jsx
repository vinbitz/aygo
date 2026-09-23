import React, { useRef, useState } from 'react';
import {
  Wand2,
  Upload,
  Check,
  Move,
  RotateCcw,
  Sparkles,
  Shirt,
  ShoppingBag,
  CupSoda,
  Coffee,
  IdCard,
  Umbrella,
  NotebookPen,
  Store,
  Gift,
  Loader2
} from 'lucide-react';
import { AYGO_LOGO_DATA_URI } from '../assets/logoBase64';
import { generateMockupConfig } from '../services/jevAiService';
import { toast } from '../lib/toast';
import { Sheet, Button, Chip, Tabs, Section, cx } from './ui';

/* ------------------------------------------------------------------ */
/* Options                                                             */
/* ------------------------------------------------------------------ */

const COLORS = [
  { name: 'Pitch Black', hex: '#111827', dark: true },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Royal Navy', hex: '#1e3a8a', dark: true },
  { name: 'Forest Green', hex: '#14532d', dark: true },
  { name: 'Sand Cream', hex: '#f5ebe0' },
  { name: 'Crimson Red', hex: '#991b1b', dark: true },
  { name: 'Heather Gray', hex: '#64748b', dark: true },
  { name: 'Aygo Electric Blue', hex: '#003CF5', dark: true }
];

const TECHNIQUES = ['DTF full colour', 'Silkscreen', 'Embroidery', 'Laser etch', 'Sublimation', 'UV print'];

// spot = default logo placement (percent of canvas) and scale
const PRODUCTS = [
  { id: 'tee', label: 'T-shirt', name: 'Heavy cotton T-shirt (220 GSM)', icon: Shirt, technique: 'DTF full colour', sides: true, spot: [50, 40, 100] },
  { id: 'hoodie', label: 'Hoodie', name: 'Fleece hoodie (320 GSM)', icon: Shirt, technique: 'Embroidery', sides: true, spot: [50, 42, 90] },
  { id: 'tote', label: 'Tote bag', name: 'Canvas tote bag (14oz)', icon: ShoppingBag, technique: 'Silkscreen', spot: [50, 62, 110] },
  { id: 'tumbler', label: 'Tumbler', name: 'Matte thermal tumbler (500ml)', icon: CupSoda, technique: 'Laser etch', spot: [50, 55, 70] },
  { id: 'mug', label: 'Mug', name: 'Ceramic mug (11oz)', icon: Coffee, technique: 'Sublimation', spot: [47, 56, 90] },
  { id: 'lanyard', label: 'Lanyard', name: 'Satin lanyard + ID (20mm)', icon: IdCard, technique: 'Sublimation', spot: [50, 84, 65] },
  { id: 'umbrella', label: 'Umbrella', name: 'Golf umbrella (30")', icon: Umbrella, technique: 'Silkscreen', spot: [50, 36, 90] },
  { id: 'notebook', label: 'Notebook', name: 'A5 hardcover notebook', icon: NotebookPen, technique: 'UV print', spot: [55, 48, 100] },
  { id: 'booth', label: 'Booth', name: '3×3m event booth backwall', icon: Store, technique: 'UV print', spot: [50, 38, 150] },
  { id: 'giveaway', label: 'Giveaway box', name: 'Giveaway gift box', icon: Gift, technique: 'UV print', spot: [50, 66, 95] }
];

const APPAREL_PRESETS = [
  { label: 'Center', spot: [50, 42, 100] },
  { label: 'Left chest', spot: [38, 36, 60] },
  { label: 'Right chest', spot: [62, 36, 60] },
  { label: 'Full back', spot: [50, 46, 130], side: 'back' }
];

const SAMPLE_LOGOS = [
  { id: 'aygo', name: 'Aygo crest', type: 'image', uri: AYGO_LOGO_DATA_URI },
  { id: 'devcon', name: 'DevCon Manila', type: 'text', text: 'DEVCON 2026', subtext: 'MANILA' },
  { id: 'startup', name: 'PH Startup Gala', type: 'text', text: 'STARTUP PH', subtext: 'FOUNDERS' }
];

const LOGO_BOX = 88; // px, logo bounding box at 100% scale

function guessProduct(text = '') {
  const t = text.toLowerCase();
  const rules = [
    ['hoodie', /hoodie|jacket/],
    ['tote', /tote|bag/],
    ['tumbler', /tumbler|bottle|flask/],
    ['mug', /mug|cup/],
    ['lanyard', /lanyard|badge|\bid\b/],
    ['umbrella', /umbrella/],
    ['notebook', /notebook|journal|planner/],
    ['booth', /booth|backdrop|backwall|tarp/],
    ['giveaway', /giveaway|kit|box|swag/]
  ];
  const hit = rules.find(([, re]) => re.test(t));
  return PRODUCTS.find((p) => p.id === (hit ? hit[0] : 'tee'));
}

function matchTechnique(text = '') {
  const t = text.toLowerCase();
  if (t.includes('laser')) return 'Laser etch';
  if (t.includes('sublimation')) return 'Sublimation';
  if (t.includes('embroider')) return 'Embroidery';
  if (t.includes('silkscreen') || t.includes('screen')) return 'Silkscreen';
  return 'DTF full colour';
}

/* ------------------------------------------------------------------ */
/* Product artwork (viewBox 0 0 400 400)                              */
/* ------------------------------------------------------------------ */

function ProductArt({ id, fill, dark, side }) {
  const line = '#1e293b';
  const soft = dark ? '#374151' : '#e2e8f0';
  const seam = dark ? '#475569' : '#cbd5e1';
  const common = { stroke: line, strokeWidth: 2.5, strokeLinejoin: 'round' };

  switch (id) {
    case 'tee':
      return (
        <g>
          <path d="M130 90 L160 110 C180 118 220 118 240 110 L270 90 L320 135 L290 175 L260 160 L260 340 C260 345 255 350 250 350 L150 350 C145 350 140 345 140 340 L140 160 L110 175 L80 135 Z" fill={fill} {...common} />
          <path d={side === 'front' ? 'M160 110 C180 125 220 125 240 110 C225 132 175 132 160 110 Z' : 'M160 110 C180 102 220 102 240 110 C225 115 175 115 160 110 Z'} fill={soft} stroke={line} strokeWidth="1.5" />
          <path d="M260 160 L270 90 M140 160 L130 90" stroke={seam} strokeWidth="1.5" strokeDasharray="3 2" />
        </g>
      );
    case 'hoodie':
      return (
        <g>
          <path d="M160 110 C160 60 240 60 240 110 Z" fill={soft} stroke={line} strokeWidth="2" />
          <path d="M130 110 L160 120 C180 125 220 125 240 120 L270 110 L325 170 L295 205 L265 180 L265 340 L135 340 L135 180 L105 205 L75 170 Z" fill={fill} {...common} />
          {side === 'front' && (
            <>
              <path d="M160 270 L240 270 L250 325 L150 325 Z" fill={fill} stroke={line} strokeWidth="2" />
              <path d="M185 125 L182 185 M215 125 L218 185" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
        </g>
      );
    case 'tote':
      return (
        <g>
          <path d="M160 160 C160 70 190 70 190 160 M210 160 C210 70 240 70 240 160" fill="none" stroke={fill} strokeWidth="14" strokeLinecap="round" />
          <path d="M160 160 C160 70 190 70 190 160 M210 160 C210 70 240 70 240 160" fill="none" stroke={line} strokeWidth="1" opacity="0.3" />
          <rect x="110" y="160" width="180" height="195" rx="12" fill={fill} {...common} />
          <line x1="110" y1="180" x2="290" y2="180" stroke={seam} strokeWidth="2" strokeDasharray="4 2" />
        </g>
      );
    case 'tumbler':
      return (
        <g>
          <rect x="155" y="70" width="90" height="22" rx="5" fill="#94a3b8" stroke={line} strokeWidth="2" />
          <rect x="150" y="92" width="100" height="16" rx="3" fill="#cbd5e1" stroke={line} strokeWidth="2" />
          <path d="M152 108 L162 335 C162 345 238 345 238 335 L248 108 Z" fill={fill} {...common} />
          <path d="M172 125 L178 322" stroke="rgba(255,255,255,0.22)" strokeWidth="8" />
        </g>
      );
    case 'mug':
      return (
        <g>
          <path d="M268 170 C335 165 335 285 268 280" fill="none" stroke={line} strokeWidth="24" strokeLinecap="round" />
          <path d="M268 170 C335 165 335 285 268 280" fill="none" stroke={fill} strokeWidth="18" strokeLinecap="round" />
          <path d="M100 120 L100 310 C100 335 120 345 145 345 L225 345 C250 345 270 335 270 310 L270 120 Z" fill={fill} {...common} />
          <ellipse cx="185" cy="120" rx="85" ry="16" fill={soft} stroke={line} strokeWidth="2.5" />
          <path d="M120 145 L120 310" stroke="rgba(255,255,255,0.25)" strokeWidth="8" strokeLinecap="round" />
        </g>
      );
    case 'lanyard':
      return (
        <g>
          <path d="M140 60 C140 30 260 30 260 60 L210 240 L190 240 Z" fill="none" stroke={fill} strokeWidth="26" strokeLinejoin="round" />
          <path d="M140 60 C140 30 260 30 260 60 L210 240 L190 240 Z" fill="none" stroke={line} strokeWidth="1" opacity="0.25" />
          <rect x="192" y="240" width="16" height="22" rx="3" fill="#94a3b8" stroke={line} strokeWidth="1.5" />
          <circle cx="200" cy="270" r="8" fill="none" stroke="#64748b" strokeWidth="3" />
          <rect x="140" y="278" width="120" height="100" rx="8" fill="#f8fafc" stroke={line} strokeWidth="2" />
          <rect x="185" y="285" width="30" height="6" rx="3" fill="#cbd5e1" />
        </g>
      );
    case 'umbrella':
      return (
        <g>
          <line x1="200" y1="135" x2="200" y2="330" stroke="#475569" strokeWidth="6" />
          <path d="M200 330 C200 365 235 365 235 340" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <path d="M40 230 Q200 40 360 230 Q325 205 290 230 Q255 205 220 230 L180 230 Q145 205 110 230 Q75 205 40 230 Z" fill={fill} {...common} />
          <path d="M200 136 L110 230 M200 136 L290 230 M200 136 L200 230" stroke={seam} strokeWidth="1.5" opacity="0.7" />
          <line x1="200" y1="116" x2="200" y2="136" stroke={line} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'notebook':
      return (
        <g>
          <rect x="120" y="68" width="185" height="270" rx="8" fill="#f1f5f9" stroke={line} strokeWidth="2" />
          <rect x="110" y="62" width="185" height="270" rx="10" fill={fill} {...common} />
          <rect x="110" y="62" width="24" height="270" rx="6" fill="rgba(0,0,0,0.15)" />
          <line x1="272" y1="62" x2="272" y2="332" stroke={dark ? '#0f172a' : '#334155'} strokeWidth="6" />
        </g>
      );
    case 'booth':
      return (
        <g>
          <ellipse cx="200" cy="360" rx="175" ry="14" fill="rgba(15,23,42,0.08)" />
          <rect x="40" y="60" width="320" height="220" rx="6" fill={fill} {...common} />
          <rect x="40" y="60" width="320" height="16" rx="6" fill="rgba(0,0,0,0.12)" />
          <path d="M40 280 L40 350 M360 280 L360 350" stroke="#94a3b8" strokeWidth="5" />
          <rect x="120" y="270" width="160" height="80" rx="6" fill={soft} stroke={line} strokeWidth="2.5" />
          <rect x="120" y="270" width="160" height="12" rx="4" fill={dark ? '#1f2937' : '#cbd5e1'} />
        </g>
      );
    case 'giveaway':
      return (
        <g>
          <rect x="105" y="175" width="190" height="165" rx="8" fill={fill} {...common} />
          <rect x="95" y="140" width="210" height="45" rx="8" fill={fill} {...common} />
          <rect x="190" y="140" width="20" height="200" fill={dark ? '#e2e8f0' : '#1e293b'} opacity="0.85" />
          <path d="M200 140 C160 95 140 130 200 140 C260 130 240 95 200 140 Z" fill="none" stroke={dark ? '#e2e8f0' : '#1e293b'} strokeWidth="8" strokeLinejoin="round" />
        </g>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Studio                                                              */
/* ------------------------------------------------------------------ */

export default function ProductMockupStudio({
  isOpen = true,
  onClose,
  activeItemTitle = 'Custom Event Merch',
  onSaveMockup,
  activeItemCategory = 'Apparel'
}) {
  const [product, setProduct] = useState(() => guessProduct(`${activeItemTitle} ${activeItemCategory}`));
  const [color, setColor] = useState(COLORS[0]);
  const [technique, setTechnique] = useState(() => product.technique);
  const [side, setSide] = useState('front');
  const [logo, setLogo] = useState(SAMPLE_LOGOS[0]);
  const [pos, setPos] = useState(() => ({ x: product.spot[0], y: product.spot[1] }));
  const [scale, setScale] = useState(() => product.spot[2]);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const placeAt = ([x, y, s]) => {
    setPos({ x, y });
    setScale(s);
    setRotation(0);
  };

  const chooseProduct = (p) => {
    setProduct(p);
    setTechnique(p.technique);
    if (!p.sides) setSide('front');
    placeAt(p.spot);
  };

  /* ---------- drag the logo (pointer events cover mouse, touch and pen) ---------- */
  const moveTo = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clamp = (v) => Math.max(8, Math.min(92, Math.round(v)));
    setPos({ x: clamp(((e.clientX - rect.left) / rect.width) * 100), y: clamp(((e.clientY - rect.top) / rect.height) * 100) });
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e) => dragging && moveTo(e);
  const onPointerUp = () => setDragging(false);

  const nudge = (e) => {
    const step = e.shiftKey ? 5 : 1;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d) return;
    e.preventDefault();
    setPos((p) => ({ x: Math.max(8, Math.min(92, p.x + d[0])), y: Math.max(8, Math.min(92, p.y + d[1])) }));
  };

  /* ---------- logo upload (button or file drop on the canvas) ---------- */
  const readLogo = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast('Please use a PNG, JPG or SVG image');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setLogo({ id: 'custom-upload', name: file.name, type: 'image', uri: evt.target.result });
      toast('Logo added. Drag it into place');
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDropActive(false);
    if (e.dataTransfer.files?.[0]) readLogo(e.dataTransfer.files[0]);
  };

  /* ---------- AI suggestion via jevAiService ---------- */
  const suggestWithAi = async () => {
    setAiLoading(true);
    try {
      const cfg = await generateMockupConfig(activeItemTitle);
      const p = PRODUCTS.find((x) => x.id === cfg.product) || product;
      chooseProduct(p);
      setColor(COLORS.find((c) => c.name === cfg.color) || color);
      setTechnique(matchTechnique(cfg.technique));
      toast(`Suggested: ${p.label.toLowerCase()} in ${(cfg.color || color.name).toLowerCase()}`);
    } catch {
      toast('Could not get a suggestion right now');
    } finally {
      setAiLoading(false);
    }
  };

  /* ---------- export the mockup as an SVG image ---------- */
  const buildMockupImage = () => {
    const svg = svgRef.current;
    if (!svg) return null;
    const width = canvasRef.current?.getBoundingClientRect().width || 400;
    const box = (LOGO_BOX * (scale / 100) * 400) / width;
    const cx = (pos.x / 100) * 400;
    const cy = (pos.y / 100) * 400;
    const tf = `rotate(${rotation} ${cx} ${cy})`;
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const art =
      logo.type === 'image'
        ? `<image href="${esc(logo.uri)}" x="${cx - box / 2}" y="${cy - box / 2}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet" transform="${tf}"/>`
        : `<g transform="${tf}" font-family="DM Sans, sans-serif" text-anchor="middle">` +
          `<text x="${cx}" y="${cy}" font-size="${box * 0.2}" font-weight="700" fill="${color.dark ? '#ffffff' : '#0f172a'}">${esc(logo.text)}</text>` +
          `<text x="${cx}" y="${cy + box * 0.17}" font-size="${box * 0.11}" font-weight="600" fill="${color.dark ? '#93c5fd' : '#003CF5'}">${esc(logo.subtext)}</text></g>`;
    const markup = new XMLSerializer().serializeToString(svg).replace(/<\/svg>\s*$/, `${art}</svg>`);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  };

  const handleSave = () => {
    const name = `${product.label} mockup · ${color.name}`;
    onSaveMockup?.({
      name,
      data: buildMockupImage(),
      item: activeItemTitle,
      product: product.name,
      color: color.name,
      technique,
      side,
      position: `X: ${pos.x}%, Y: ${pos.y}%, Angle: ${rotation}°, Scale: ${scale}%`,
      logoUrl: logo.type === 'image' ? logo.uri : null
    });
    toast('Mockup attached to request');
    onClose?.();
  };

  const logoFilter = technique === 'Embroidery'
    ? 'drop-shadow(1px 2px 1px rgba(0,0,0,0.4))'
    : technique === 'Laser etch'
      ? 'grayscale(1) contrast(1.4) brightness(1.15)'
      : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';

  return (
    <Sheet
      size="xl"
      onClose={onClose}
      icon={Wand2}
      title="Mockup studio"
      subtitle={`For ${activeItemTitle}`}
      bodyClassName="pt-1"
      footer={
        <div className="flex items-center gap-3">
          <p className="hidden sm:block flex-1 min-w-0 text-[13px] text-slate-500 truncate">
            {product.name} · {color.name} · {technique}
          </p>
          <Button size="lg" icon={Check} onClick={handleSave} className="w-full sm:w-auto">
            Save & attach to request
          </Button>
        </div>
      }
    >
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_300px] md:gap-5">
        {/* Canvas */}
        <div className="md:sticky md:top-0 md:self-start">
          <div
            ref={canvasRef}
            onDragOver={(e) => {
              e.preventDefault();
              setDropActive(true);
            }}
            onDragLeave={() => setDropActive(false)}
            onDrop={onDrop}
            className={cx(
              'relative w-full aspect-square rounded-[28px] bg-[#F4F3F0] overflow-hidden select-none touch-none transition-shadow',
              dropActive && 'ring-2 ring-inset ring-[#003CF5]'
            )}
          >
            <svg ref={svgRef} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full drop-shadow-xl">
              <ProductArt id={product.id} fill={color.hex} dark={!!color.dark} side={side} />
            </svg>

            {/* Print area guide */}
            <div className="absolute inset-[12%] rounded-2xl border border-dashed border-slate-400/40 pointer-events-none" />

            {/* Draggable logo */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Logo. Drag to move, or use the arrow keys"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={nudge}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: LOGO_BOX,
                height: LOGO_BOX,
                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale / 100})`,
                cursor: dragging ? 'grabbing' : 'grab'
              }}
              className={cx(
                'absolute z-10 flex items-center justify-center rounded-xl outline-none',
                dragging ? 'ring-2 ring-[#003CF5]' : 'hover:ring-1 hover:ring-[#003CF5]/50 focus-visible:ring-2 focus-visible:ring-[#003CF5]'
              )}
            >
              {logo.type === 'image' ? (
                <img src={logo.uri} alt="" draggable={false} className="max-w-full max-h-full object-contain pointer-events-none" style={{ filter: logoFilter }} />
              ) : (
                <div className="text-center pointer-events-none leading-none">
                  <div className="text-[17px] font-bold tracking-tight" style={{ color: color.dark ? '#ffffff' : '#0f172a' }}>
                    {logo.text}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold" style={{ color: color.dark ? '#93c5fd' : '#003CF5' }}>
                    {logo.subtext}
                  </div>
                </div>
              )}
            </div>

            {product.sides && (
              <div className="absolute top-3 right-3 z-20 w-40">
                <Tabs
                  className="bg-white/90 backdrop-blur"
                  value={side}
                  onChange={setSide}
                  tabs={[
                    { id: 'front', label: 'Front' },
                    { id: 'back', label: 'Back' }
                  ]}
                />
              </div>
            )}

            <div className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[12px] font-medium text-slate-600 pointer-events-none">
              <Move className="w-3.5 h-3.5" />
              Drag logo to place
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {product.sides &&
              APPAREL_PRESETS.map((p) => (
                <Chip
                  key={p.label}
                  className="h-10"
                  onClick={() => {
                    if (p.side) setSide(p.side);
                    placeAt(p.spot);
                  }}
                >
                  {p.label}
                </Chip>
              ))}
            <Chip className="h-10" icon={RotateCcw} onClick={() => placeAt(product.spot)}>
              Reset
            </Chip>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-2 md:mt-0">
          <Section title="Item">
            <div className="-mx-5 px-5 md:mx-0 md:px-0 flex md:flex-wrap gap-2 overflow-x-auto no-scrollbar">
              {PRODUCTS.map((p) => (
                <Chip key={p.id} selected={product.id === p.id} icon={p.icon} onClick={() => chooseProduct(p)} className="h-10">
                  {p.label}
                </Chip>
              ))}
            </div>
          </Section>

          <Section title="Logo">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="sr-only"
              onChange={(e) => {
                readLogo(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <Button variant="secondary" full icon={Upload} onClick={() => fileInputRef.current?.click()}>
              {logo.id === 'custom-upload' ? 'Replace logo' : 'Upload your logo'}
            </Button>
            <p className="mt-1.5 text-[12px] text-slate-500">PNG, JPG or SVG. You can also drop a file on the canvas.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {logo.id === 'custom-upload' && (
                <Chip selected className="h-10 max-w-full">
                  <span className="truncate max-w-[160px]">{logo.name}</span>
                </Chip>
              )}
              {SAMPLE_LOGOS.map((l) => (
                <Chip key={l.id} selected={logo.id === l.id} onClick={() => setLogo(l)} className="h-10">
                  {l.name}
                </Chip>
              ))}
            </div>
          </Section>

          <Section title="Size and rotation">
            {[
              ['Size', scale, setScale, 40, 180, `${scale}%`],
              ['Rotation', rotation, setRotation, -180, 180, `${rotation}°`]
            ].map(([label, value, set, min, max, shown]) => (
              <label key={label} className="block py-1.5">
                <span className="flex justify-between text-[13px]">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="text-slate-500">{shown}</span>
                </span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full h-8 accent-[#003CF5] cursor-pointer"
                />
              </label>
            ))}
          </Section>

          <Section title="Colour" action={<span className="text-[13px] text-slate-500">{color.name}</span>}>
            <div className="flex flex-wrap gap-1">
              {COLORS.map((c) => {
                const on = c.hex === color.hex;
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={c.name}
                    aria-pressed={on}
                    title={c.name}
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                  >
                    <span
                      className={cx(
                        'w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 transition-shadow',
                        on && 'ring-2 ring-offset-2 ring-slate-900'
                      )}
                      style={{ backgroundColor: c.hex }}
                    >
                      {on && <Check className="w-4 h-4" style={{ color: c.dark ? '#fff' : '#0f172a' }} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Print technique">
            <div className="flex flex-wrap gap-2">
              {TECHNIQUES.map((t) => (
                <Chip key={t} selected={technique === t} onClick={() => setTechnique(t)} className="h-10">
                  {t}
                </Chip>
              ))}
            </div>
          </Section>

          <Section>
            <Button variant="outline" full icon={aiLoading ? Loader2 : Sparkles} disabled={aiLoading} onClick={suggestWithAi}>
              {aiLoading ? 'Thinking…' : 'Suggest item and colour with AI'}
            </Button>
          </Section>
        </div>
      </div>
    </Sheet>
  );
}
