import React, { useState } from 'react';
import { Sparkles, Send, MapPin, Upload, Check, Loader2, X, Tag, Package } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { analyzeSourcingRequest } from '../services/jevAiService';
import { Sheet, Button, Field, Input, Textarea, Chip, Tabs, Section, cx } from './ui';
import { peso } from '../lib/marketplace';
import { usePro } from '../state/pro';

const MODES = [
  { id: 'single', label: 'Single category', icon: Tag },
  { id: 'package', label: 'Event package', icon: Package },
];

// Accepts "2026-10-15" or "Oct 15, 2026" and returns yyyy-mm-dd for <input type="date">
function toDateInput(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Pulls a peso amount like "₱15,000", "P15k" or "budget 15000" out of free text
function parseBudget(text) {
  const m = text.match(/(?:₱|\bphp\s*|\bp(?=\d)|\bbudget(?: is| of)?\s*₱?)\s*([\d,.]*\d)\s*(k\b)?/i);
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, ''));
  if (!n) return null;
  return m[2] ? n * 1000 : n;
}

export default function CreateRequestModal({
  onClose,
  onCreateRequest,
  onOpenMockupStudio,
  initialLocation = 'Arthaland Century Pacific Tower, 4th Ave, 30th St, Taguig, Metro Manila',
  initialDeliveryDate = '2026-10-15',
  initialMode = 'single',
  initialCategory = 'apparel',
}) {
  const [requestMode, setRequestMode] = useState(initialMode);
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [singleCategory, setSingleCategory] = useState(initialCategory || CATEGORIES[0].id);
  const [selectedCategories, setSelectedCategories] = useState(['apparel', 'event-print', 'bags']);
  const [packageBreakdown, setPackageBreakdown] = useState('');
  const [quantity, setQuantity] = useState('300');
  const [targetBudget, setTargetBudget] = useState('15000');
  const [location, setLocation] = useState(initialLocation);
  const [deliveryDate, setDeliveryDate] = useState(toDateInput(initialDeliveryDate));
  const [specs, setSpecs] = useState('');
  const [mockupImg, setMockupImg] = useState(null);
  const [mockupName, setMockupName] = useState('');

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const isPackage = requestMode === 'package';
  const unitPrice = Number(targetBudget) / (Number(quantity) || 1);

  const pro = usePro();
  const assistLeft = pro.remaining('assist');

  const handleAssist = () => {
    const text = (prompt || title || specs).trim();
    if (!text) return;
    pro.gate('assist', () => runAssist(text));
  };

  const runAssist = async (text) => {
    setIsAiAnalyzing(true);
    try {
      const result = await analyzeSourcingRequest(text);
      if (result?.success) {
        if (result.isPackage && result.detectedCategories?.length > 1) {
          setRequestMode('package');
          setSelectedCategories(result.detectedCategories);
        } else if (result.category) {
          setRequestMode('single');
          setSingleCategory(result.category);
        }
        if (result.quantity) setQuantity(String(result.quantity));
        const budget = parseBudget(text) || result.estimatedBudget;
        if (budget) setTargetBudget(String(Math.round(budget)));
        if (!title) {
          // "I need 200 canvas tote bags for a conference…" -> "200 canvas tote bags"
          const short = text.replace(/^(i|we)\s+(need|want|are looking for|am looking for)\s+/i, '').split(/\s+(for|in|at|by|with)\s+|[.,]/i)[0].trim();
          setTitle(short.length > 3 && short.length <= 70 ? short : text.slice(0, 67));
        }
        if (!specs && result.specsSummary) setSpecs(result.specsSummary);
        setAiResult({ category: result.category, method: result.printingMethod, budgetFromText: Boolean(parseBudget(text)) });
      }
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const toggleCategory = (id) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((c) => c !== id) : prev) : [...prev, id]
    );

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMockupName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => setMockupImg(evt.target?.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const categories = isPackage ? selectedCategories : [singleCategory];
    onCreateRequest({
      title: title.trim() || (isPackage ? 'Event package' : CATEGORIES.find((c) => c.id === singleCategory)?.name || 'Event supplies'),
      quantity: Number(quantity),
      unit: isPackage ? 'sets' : 'pcs',
      targetBudget: Number(targetBudget),
      category: isPackage ? 'package' : singleCategory,
      categories,
      isPackage,
      packageBreakdown: isPackage ? packageBreakdown : null,
      location,
      deliveryDate,
      specs,
      mockupImage: mockupImg,
      mockupName,
    });
    onClose();
  };

  const canSubmit = Number(quantity) > 0 && Number(targetBudget) > 0 && location.trim() && deliveryDate;

  return (
    <Sheet
      title="Tell Aygo what you need"
      subtitle="Verified makers near your venue will send their best offers."
      icon={Send}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0 text-[13px] text-slate-500">
            <span className="font-semibold text-slate-900">{peso(targetBudget)}</span> · {quantity || 0} {isPackage ? 'sets' : 'pcs'}
            <span className="hidden sm:inline"> · {peso(unitPrice, 2)} each</span>
          </div>
          <Button size="lg" icon={Send} onClick={handleSubmit} disabled={!canSubmit}>
            Get offers
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Plain-language request, filled out by Aygo Assist */}
        <div className="rounded-[22px] bg-gradient-to-br from-blue-50 to-violet-50 p-3.5">
          <label htmlFor="assist" className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
            <Sparkles className="w-4 h-4 text-[#003CF5]" /> Describe it in your own words
          </label>
          <div className="mt-2 flex gap-2">
            <Textarea
              id="assist"
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="I need 300 customized lanyards for an event in Quezon City next month. Budget is ₱15,000."
              className="bg-white"
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            {aiResult ? (
              <span className="text-[12px] text-slate-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Filled in below. Check and adjust.
              </span>
            ) : (
              <span className="text-[12px] text-slate-500">
                Aygo Assist fills in the form for you.{!pro.isPro && ` ${assistLeft} free ${assistLeft === 1 ? 'try' : 'tries'} left.`}
              </span>
            )}
            <Button size="sm" variant="primary" onClick={handleAssist} disabled={isAiAnalyzing || !(prompt || title).trim()} icon={isAiAnalyzing ? Loader2 : Sparkles} className={isAiAnalyzing ? '[&>svg]:animate-spin' : ''}>
              {isAiAnalyzing ? 'Reading…' : 'Fill for me'}
            </Button>
          </div>
        </div>

        <Tabs tabs={MODES} value={requestMode} onChange={setRequestMode} />

        {isPackage ? (
          <Section title="What's in the package?" className="py-0">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip key={c.id} selected={selectedCategories.includes(c.id)} onClick={() => toggleCategory(c.id)} icon={selectedCategories.includes(c.id) ? Check : undefined}>
                  {c.name}
                </Chip>
              ))}
            </div>
            <Field label="Items and quantities" className="mt-3">
              <Textarea
                value={packageBreakdown}
                onChange={(e) => setPackageBreakdown(e.target.value)}
                placeholder="300 cotton shirts, 300 lanyards, 300 canvas totes, 50 VIP tumblers"
              />
            </Field>
          </Section>
        ) : (
          <Section title="Category" className="py-0">
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
              {CATEGORIES.map((c) => (
                <Chip key={c.id} selected={singleCategory === c.id} onClick={() => setSingleCategory(c.id)}>
                  {c.name}
                </Chip>
              ))}
            </div>
          </Section>
        )}

        <Field label={isPackage ? 'Package name' : 'What do you need?'}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isPackage ? 'Tech Summit 2026 attendee kit' : '300 customized satin lanyards'}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={isPackage ? 'Attendee sets' : 'Quantity'}>
            <Input type="number" inputMode="numeric" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </Field>
          <Field label="Total budget (₱)" hint={`${peso(unitPrice, 2)} per ${isPackage ? 'set' : 'piece'}`}>
            <Input type="number" inputMode="numeric" min="1" value={targetBudget} onChange={(e) => setTargetBudget(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Deliver to">
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <Input value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" placeholder="Venue or address" />
            </div>
          </Field>
          <Field label="Needed by">
            <Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
          </Field>
        </div>

        <Field label="Customization details" hint="Material, print method, colors, sizes, packaging.">
          <Textarea
            rows={3}
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            placeholder="2cm satin, full-color sublimation both sides, trigger hook, individual packaging"
          />
        </Field>

        <Section title="Design or reference image" className="py-0">
          {mockupImg ? (
            <div className="relative rounded-2xl overflow-hidden bg-[#F4F3F0] h-36 flex items-center justify-center">
              <img src={mockupImg} alt="Attached design" className="h-full object-contain" />
              <button
                type="button"
                onClick={() => { setMockupImg(null); setMockupName(''); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="absolute bottom-2 left-2 max-w-[70%] truncate rounded-full bg-white/90 px-2.5 py-1 text-[12px] text-slate-700">{mockupName}</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <label className={cx('rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#003CF5] p-4 text-center cursor-pointer transition-colors')}>
                <Upload className="w-5 h-5 mx-auto text-slate-500" />
                <span className="block mt-1.5 text-[13px] font-medium text-slate-800">Upload image</span>
                <span className="block text-[12px] text-slate-500">Logo, artwork or reference</span>
                <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
              </label>
              <button
                type="button"
                onClick={() => onOpenMockupStudio && onOpenMockupStudio()}
                className="rounded-2xl bg-violet-50 hover:bg-violet-100 p-4 text-center transition-colors"
              >
                <Sparkles className="w-5 h-5 mx-auto text-violet-600" />
                <span className="block mt-1.5 text-[13px] font-medium text-slate-800">Make a mockup</span>
                <span className="block text-[12px] text-slate-500">Open the mockup studio</span>
              </button>
            </div>
          )}
        </Section>
      </form>
    </Sheet>
  );
}
