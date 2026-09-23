import React, { useMemo, useState } from 'react';
import {
  Search, ArrowLeft, Sparkles, Shirt, ShoppingBag, Coffee, Printer, NotebookPen, Cpu, Umbrella, Leaf, Gift,
  Package, Store, PartyPopper, Megaphone, Send, BadgeCheck, Clock, Boxes, X,
} from 'lucide-react';
import { Sheet, Button, Input, Chip, Badge, Section, EmptyState, TINTS, cx } from './ui';
import { CATALOG, CATALOG_CATEGORIES, OCCASIONS, searchCatalog } from '../data/catalog';
import { matchSuppliers } from '../lib/marketplace';

const ICONS = { Shirt, ShoppingBag, Coffee, Printer, NotebookPen, Cpu, Umbrella, Leaf, Gift, Package, Store, PartyPopper, Megaphone };
const categoryOf = (id) => CATALOG_CATEGORIES.find((c) => c.id === id);

function ItemIcon({ item, size = 'md' }) {
  const cat = categoryOf(item.category);
  const Icon = ICONS[cat?.icon] || Package;
  const dims = size === 'lg' ? 'w-16 h-16 rounded-[22px]' : 'w-11 h-11 rounded-2xl';
  return (
    <span className={cx('flex items-center justify-center shrink-0', dims, TINTS[cat?.tone || 'blue'])}>
      <Icon className={size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'} />
    </span>
  );
}

function ItemCard({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="text-left rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] p-3 flex flex-col gap-2 transition-colors active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <ItemIcon item={item} />
        {item.type === 'service' ? <Badge tone="violet">Service</Badge> : item.isKit ? <Badge tone="rose">Kit</Badge> : null}
      </div>
      <span className="text-[15px] font-medium text-slate-900 leading-tight">{item.name}</span>
      <span className="text-[12px] text-slate-500 leading-snug line-clamp-2">{item.specs}</span>
      <span className="mt-auto text-[12px] text-slate-600">
        {item.type === 'service' ? item.leadTime : `Min. ${item.moq} pcs`}
      </span>
    </button>
  );
}

/**
 * "Find anything": searchable catalog of products, gift sets and event services.
 * Picking an item sends a pre-filled request to matching makers.
 */
export default function CatalogSheet({ initialCategory = null, onClose, onOrder, onDescribe, onViewMaker }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [occasion, setOccasion] = useState(null);
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => searchCatalog(query, { category, occasion }), [query, category, occasion]);
  const browsing = !query.trim() && !category && !occasion;

  if (selected) {
    return <ItemDetail item={selected} onBack={() => setSelected(null)} onClose={onClose} onOrder={onOrder} onViewMaker={onViewMaker} />;
  }

  return (
    <Sheet title="Find anything" subtitle="Merch, gift sets, event services and more. Makers send you offers." icon={Search} onClose={onClose} size="lg">
      <div className="sticky top-0 z-10 bg-white -mx-5 px-5 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tumblers, lanyards, photo booth…"
            className="pl-10 pr-10"
            aria-label="Search the catalog"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full text-slate-500 hover:bg-slate-200 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          <Chip selected={!category} onClick={() => setCategory(null)}>All</Chip>
          {CATALOG_CATEGORIES.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <Chip key={c.id} icon={Icon} selected={category === c.id} onClick={() => setCategory(category === c.id ? null : c.id)}>
                {c.short}
              </Chip>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {OCCASIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOccasion(occasion === o.id ? null : o.id)}
              className={cx(
                'shrink-0 h-8 px-3 rounded-full text-[12px] font-medium border transition-colors',
                occasion === o.id ? 'border-[#003CF5] bg-blue-50 text-[#003CF5]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>

      {/* Anything not listed can still be requested */}
      <button
        type="button"
        onClick={() => onDescribe(query)}
        className="w-full mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 p-3.5 text-left"
      >
        <span className="w-10 h-10 rounded-full bg-white text-[#003CF5] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] font-medium text-slate-900">
            {query.trim() ? `Request “${query.trim()}”` : "Can't find it? Describe anything"}
          </span>
          <span className="block text-[13px] text-slate-500">Makers quote custom items and services too</span>
        </span>
      </button>

      {browsing ? (
        <>
          <Section title="Popular" className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATALOG.filter((i) => i.popular).map((item) => <ItemCard key={item.id} item={item} onOpen={setSelected} />)}
            </div>
          </Section>
          <Section title="Browse by category">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATALOG_CATEGORIES.map((c) => {
                const Icon = ICONS[c.icon];
                const count = CATALOG.filter((i) => i.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className="flex items-center gap-2.5 rounded-2xl bg-[#F4F3F0] hover:bg-[#ECEAE5] p-3 text-left transition-colors"
                  >
                    <span className={cx('w-9 h-9 rounded-full flex items-center justify-center shrink-0', TINTS[c.tone])}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium text-slate-900 leading-tight">{c.name}</span>
                      <span className="block text-[12px] text-slate-500">{count} items</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>
        </>
      ) : results.length ? (
        <Section title={`${results.length} result${results.length === 1 ? '' : 's'}`} className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {results.map((item) => <ItemCard key={item.id} item={item} onOpen={setSelected} />)}
          </div>
        </Section>
      ) : (
        <EmptyState
          icon={Search}
          title="Not in the catalog yet"
          text="Send it as a custom request and makers will still quote."
          action={<Button icon={Send} onClick={() => onDescribe(query)}>Request it anyway</Button>}
        />
      )}
    </Sheet>
  );
}

function ItemDetail({ item, onBack, onClose, onOrder, onViewMaker }) {
  const cat = categoryOf(item.category);
  const makers = matchSuppliers({ categories: [item.category] });
  const [choices, setChoices] = useState(() =>
    Object.fromEntries(item.options.map((o) => [o.label, o.values[0]]))
  );
  const [method, setMethod] = useState(item.customization[0] || null);
  const [quantity, setQuantity] = useState(String(item.type === 'service' ? 1 : Math.max(item.moq, 100)));

  const qty = Number(quantity) || 0;
  const belowMoq = item.type !== 'service' && qty > 0 && qty < item.moq;

  const submit = () => {
    const details = [
      item.specs,
      ...Object.entries(choices).map(([k, v]) => `${k}: ${v}`),
      method ? `Customization: ${method}` : null,
    ].filter(Boolean).join('. ');
    onOrder({ item, quantity: qty, specs: details });
  };

  return (
    <Sheet
      title={item.name}
      subtitle={cat?.name}
      onClose={onClose}
      size="lg"
      headerAction={
        <button type="button" onClick={onBack} aria-label="Back to catalog" className="w-9 h-9 rounded-full bg-[#F4F3F0] hover:bg-[#ECEAE5] flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
      }
      footer={
        <Button size="lg" full icon={Send} onClick={submit} disabled={!qty}>
          Get offers from {makers.length} makers
        </Button>
      }
    >
      <div className="flex items-center gap-4">
        <ItemIcon item={item} size="lg" />
        <div className="min-w-0">
          <p className="text-[15px] text-slate-700">{item.specs}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {item.type === 'service' ? <Badge tone="violet">Service</Badge> : <Badge icon={Boxes}>Min. {item.moq} pcs</Badge>}
            <Badge icon={Clock}>{item.leadTime}</Badge>
          </div>
        </div>
      </div>

      {item.options.map((opt) => (
        <Section key={opt.label} title={opt.label}>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((v) => (
              <Chip key={v} selected={choices[opt.label] === v} onClick={() => setChoices((c) => ({ ...c, [opt.label]: v }))}>{v}</Chip>
            ))}
          </div>
        </Section>
      ))}

      {item.customization.length > 0 && (
        <Section title={item.isKit ? 'Packaging' : 'Customization'}>
          <div className="flex flex-wrap gap-2">
            {item.customization.map((m) => (
              <Chip key={m} selected={method === m} onClick={() => setMethod(m)}>{m}</Chip>
            ))}
          </div>
        </Section>
      )}

      <Section title={item.type === 'service' ? 'How many days or units?' : item.isKit ? 'How many sets?' : 'Quantity'}>
        <Input type="number" inputMode="numeric" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="max-w-[180px]" />
        {belowMoq && <p className="mt-1.5 text-[12px] text-amber-700">Most makers start at {item.moq} pcs. You can still ask.</p>}
      </Section>

      {item.occasions.length > 0 && (
        <Section title="Great for">
          <p className="text-[13px] text-slate-600">
            {item.occasions.map((o) => OCCASIONS.find((x) => x.id === o)?.name).filter(Boolean).join(' · ')}
          </p>
        </Section>
      )}

      <Section title={`${makers.length} makers make this`}>
        <div className="space-y-1">
          {makers.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onViewMaker?.(m)}
              className="w-full flex items-center gap-2 text-[14px] text-left rounded-xl -mx-2 px-2 min-h-[40px] hover:bg-[#F4F3F0]"
            >
              <span className="font-medium text-slate-900 truncate">{m.shortName}</span>
              {m.verified && <BadgeCheck className="w-4 h-4 text-[#003CF5] shrink-0" aria-label="Verified" />}
              <span className="flex-1 text-slate-500 truncate">· {m.city} · ★ {m.rating}</span>
              <span className="text-[12px] font-medium text-[#003CF5] shrink-0">View</span>
            </button>
          ))}
        </div>
      </Section>
    </Sheet>
  );
}
