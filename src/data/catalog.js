// Aygo product & service catalog. Customers browse or search it, pick options,
// and send the item as a request to matching makers. Prices come from maker offers.

export const CATALOG_CATEGORIES = [
  { id: 'apparel', name: 'Apparel & Headwear', short: 'Apparel', icon: 'Shirt', tone: 'blue' },
  { id: 'bags', name: 'Bags & Totes', short: 'Bags', icon: 'ShoppingBag', tone: 'rose' },
  { id: 'drinkware', name: 'Drinkware & Tumblers', short: 'Drinkware', icon: 'Coffee', tone: 'green' },
  { id: 'event-print', name: 'Lanyards, IDs & Print', short: 'Event print', icon: 'Printer', tone: 'amber' },
  { id: 'writing', name: 'Pens & Notebooks', short: 'Notebooks', icon: 'NotebookPen', tone: 'violet' },
  { id: 'tech', name: 'Tech & Gadgets', short: 'Tech', icon: 'Cpu', tone: 'blue' },
  { id: 'rain-care', name: 'Umbrellas, Rain & Care', short: 'Rain & care', icon: 'Umbrella', tone: 'violet' },
  { id: 'eco', name: 'Eco-Friendly Line', short: 'Eco', icon: 'Leaf', tone: 'green' },
  { id: 'gift-sets', name: 'Gift Sets & Kits', short: 'Gift sets', icon: 'Gift', tone: 'rose' },
  { id: 'packaging', name: 'Packaging & Boxes', short: 'Packaging', icon: 'Package', tone: 'amber' },
  { id: 'booths', name: 'Booths, Displays & Awards', short: 'Booths', icon: 'Store', tone: 'slate' },
  { id: 'event-services', name: 'Event Services', short: 'Event services', icon: 'PartyPopper', tone: 'violet' },
  { id: 'marketing', name: 'Design & Marketing', short: 'Marketing', icon: 'Megaphone', tone: 'rose' },
];

export const OCCASIONS = [
  { id: 'conference', name: 'Conferences' },
  { id: 'tech-event', name: 'Tech events' },
  { id: 'fun-run', name: 'Fun runs' },
  { id: 'concert', name: 'Concerts' },
  { id: 'awards', name: 'Awards night' },
  { id: 'onboarding', name: 'Onboarding' },
  { id: 'appreciation', name: 'Employee appreciation' },
  { id: 'anniversary', name: 'Corporate anniversary' },
  { id: 'christmas', name: 'Christmas' },
  { id: 'new-year', name: 'New Year' },
  { id: 'valentines', name: "Valentine's" },
  { id: 'mothers-day', name: "Mother's Day" },
  { id: 'fathers-day', name: "Men's gifts" },
  { id: 'graduation', name: 'Graduation' },
  { id: 'rainy-season', name: 'Rainy season' },
  { id: 'summer', name: 'Summer' },
  { id: 'halloween', name: 'Halloween' },
  { id: 'birthday', name: 'Birthdays & promotions' },
];

const P = (id, category, name, specs, extra = {}) => ({
  id,
  category,
  name,
  specs,
  type: 'product',
  moq: 50,
  leadTime: '5-7 days',
  customization: ['Full-color print'],
  options: [],
  occasions: [],
  tags: [],
  ...extra,
});

const S = (id, category, name, specs, extra = {}) =>
  P(id, category, name, specs, { type: 'service', moq: 1, leadTime: 'Book 1-2 weeks ahead', customization: [], ...extra });

export const CATALOG = [
  // Apparel & headwear
  P('tshirt', 'apparel', 'T-shirt', 'Cotton or dri-fit, XS to 5XL', {
    popular: true, moq: 30, customization: ['DTF', 'Silkscreen', 'Sublimation', 'Embroidery'],
    options: [{ label: 'Fabric', values: ['Cotton', 'Dri-fit', 'CVC blend'] }, { label: 'Sizes', values: ['XS to 5XL'] }],
    occasions: ['conference', 'fun-run', 'tech-event', 'concert', 'onboarding'], tags: ['shirt', 'tee', 'event shirt', 'uniform'],
  }),
  P('polo', 'apparel', 'Polo shirt', 'Cotton or dri-fit with collar, custom logo', {
    moq: 30, customization: ['Embroidery', 'DTF'], options: [{ label: 'Fabric', values: ['Cotton', 'Dri-fit'] }],
    occasions: ['onboarding', 'anniversary', 'conference'], tags: ['uniform', 'corporate shirt'],
  }),
  P('longsleeves', 'apparel', 'Long sleeves', 'Cotton or dri-fit, full-color print', { moq: 30, customization: ['DTF', 'Sublimation'], tags: ['shirt'] }),
  P('singlet', 'apparel', 'Running singlet / sando', 'Dri-fit, sublimation all-over print', {
    moq: 30, customization: ['Sublimation'], occasions: ['fun-run', 'summer'], tags: ['running', 'marathon', 'sleeveless', 'jersey'],
  }),
  P('hoodie', 'apparel', 'Hoodie / jacket', 'Cotton with fleece, zip or pullover', {
    moq: 20, customization: ['Embroidery', 'DTF'], occasions: ['christmas', 'onboarding', 'appreciation'], tags: ['jacket', 'sweater'],
  }),
  P('cap', 'apparel', 'Baseball cap', '5-panel, adjustable strap', {
    popular: true, moq: 50, customization: ['Embroidery', 'Print'], occasions: ['fun-run', 'summer', 'conference'], tags: ['hat', 'headwear'],
  }),
  P('bucket-hat', 'apparel', 'Bucket hat', 'Cotton, custom print', { moq: 50, occasions: ['summer', 'concert'], tags: ['hat'] }),
  P('visor', 'apparel', 'Visor cap', 'Adjustable, custom print', { moq: 50, occasions: ['fun-run', 'summer'], tags: ['hat', 'running'] }),
  P('socks', 'apparel', 'Socks', 'Knitted logo or sublimation', { moq: 100, occasions: ['christmas', 'fun-run'], tags: ['sports'] }),
  P('towel', 'apparel', 'Towel', 'Sports or face towel, embroidered logo', { moq: 50, customization: ['Embroidery'], occasions: ['fun-run', 'summer'], tags: ['sports towel'] }),

  // Bags
  P('canvas-tote', 'bags', 'Canvas tote bag', '12x14 in or 14x15 in canvas, custom print', {
    popular: true, moq: 50, customization: ['Silkscreen', 'DTF'], options: [{ label: 'Size', values: ['12 x 14 in', '14 x 15 in'] }, { label: 'Handle', values: ['Canvas', 'Rope'] }],
    occasions: ['conference', 'tech-event', 'onboarding'], tags: ['tote', 'ecobag', 'event bag', 'swag bag'],
  }),
  P('ecobag', 'bags', 'Non-woven ecobag', 'Flat or wide, reusable, multiple sizes', {
    moq: 100, customization: ['Silkscreen'], occasions: ['conference', 'christmas'], tags: ['eco bag', 'tote'],
  }),
  P('drawstring', 'bags', 'Drawstring bag', 'Polyester or string canvas, custom print', { moq: 50, occasions: ['fun-run', 'tech-event'], tags: ['string bag', 'backpack'] }),
  P('paper-bag', 'bags', 'Paper bag', 'Kraft or white, printed logo', { moq: 100, occasions: ['christmas', 'anniversary'], tags: ['shopping bag', 'gift bag'] }),
  P('jute-bag', 'bags', 'Jute bag', 'Natural jute, printed logo', { moq: 50, occasions: ['christmas'], tags: ['eco bag'] }),
  P('pouch', 'bags', 'Canvas pouch', 'Zip pouch for kits and toiletries', { moq: 50, tags: ['organizer', 'kit pouch'] }),
  P('laptop-bag', 'bags', 'Laptop bag', 'Fits up to 15.6 in, leather or fabric', { moq: 20, customization: ['Embroidery', 'Debossed logo'], occasions: ['onboarding', 'appreciation'], tags: ['office bag'] }),
  P('sling-bag', 'bags', 'Sling bag', 'Compact crossbody, custom logo', { moq: 30, tags: ['crossbody'] }),
  P('waist-bag', 'bags', 'Waist bag', 'Adjustable strap, custom logo', { moq: 30, occasions: ['fun-run', 'concert'], tags: ['belt bag', 'fanny pack'] }),
  P('dry-bag', 'bags', 'Dry bag', 'Waterproof roll-top, custom print', { moq: 30, occasions: ['summer', 'rainy-season'], tags: ['waterproof', 'beach'] }),

  // Drinkware
  P('tumbler', 'drinkware', 'Insulated tumbler', '500 ml vacuum insulated, hot and cold', {
    popular: true, moq: 30, customization: ['Laser engraving', 'UV print'], options: [{ label: 'Size', values: ['350 ml', '500 ml', '800 ml'] }],
    occasions: ['appreciation', 'onboarding', 'christmas', 'conference'], tags: ['water bottle', 'thermos', 'flask'],
  }),
  P('japanese-tumbler', 'drinkware', 'Travel tumbler with handle', '350-360 ml double wall stainless', { moq: 30, customization: ['Laser engraving'], tags: ['tumbler', 'bottle'] }),
  P('mug-handle-tumbler', 'drinkware', 'Stainless mug with straw', '800 ml, handle and straw lid', { moq: 30, customization: ['Laser engraving', 'UV print'], tags: ['tumbler', 'big tumbler'] }),
  P('egg-mug', 'drinkware', 'Double wall egg mug', 'Stainless steel with lid', { moq: 30, occasions: ['christmas', 'mothers-day'], tags: ['wine tumbler', 'mug'] }),
  P('coffee-mug', 'drinkware', 'Coffee mug', '11 oz ceramic or 12 oz double layer with lid', {
    moq: 36, customization: ['Sublimation'], occasions: ['appreciation', 'christmas', 'birthday'], tags: ['mug', 'ceramic'],
  }),
  P('magic-mug', 'drinkware', 'Magic mug', '11 oz, design appears when hot', { moq: 36, customization: ['Sublimation'], occasions: ['valentines', 'birthday', 'christmas'], tags: ['color changing mug'] }),
  P('glass-mug', 'drinkware', 'Frosted or clear glass mug', '11 oz, custom print', { moq: 36, tags: ['glass'] }),
  P('glass-cup-straw', 'drinkware', 'Glass cup with straw', 'Sleeve and lid, custom print', { moq: 36, occasions: ['summer'], tags: ['iced coffee cup'] }),

  // Event print, lanyards, IDs
  P('lanyard', 'event-print', 'Lanyard', 'Sublimation print, 0.5 to 1 in, G-hook or side release', {
    popular: true, moq: 100, customization: ['Sublimation'],
    options: [{ label: 'Width', values: ['1 in', '0.75 in', '0.5 in'] }, { label: 'Hook', values: ['G-hook', 'Trigger hook', 'Side release'] }],
    occasions: ['conference', 'tech-event', 'concert'], tags: ['id lace', 'id strap', 'lace'],
  }),
  P('id-card', 'event-print', 'ID card & holder', 'PVC ID with printed details, holder included', {
    popular: true, moq: 50, occasions: ['conference', 'tech-event', 'onboarding'], tags: ['badge', 'event badge', 'name tag'],
  }),
  P('qr-nfc-id', 'event-print', 'QR / NFC ID', 'Scannable IDs for registration and contact sharing', { moq: 50, occasions: ['tech-event', 'conference'], tags: ['smart id', 'rfid', 'badge'] }),
  P('button-pin', 'event-print', 'Button pins', '2.25 in, matte or glitter finish', { moq: 50, occasions: ['concert', 'tech-event'], tags: ['pins', 'badge'] }),
  P('stickers', 'event-print', 'Stickers', 'Die cut for giving out, kiss cut sheets with backing', { popular: true, moq: 100, occasions: ['tech-event', 'concert'], tags: ['decals', 'labels'] }),
  P('pull-up-banner', 'event-print', 'Pull-up banner', 'Retractable stand with printed banner', { moq: 1, leadTime: '1-2 days', occasions: ['conference', 'tech-event'], tags: ['roll up', 'standee', 'banner'] }),
  P('tarpaulin', 'event-print', 'Tarpaulin & backdrop', 'Any size, photo wall or stage backdrop', { moq: 1, leadTime: '1-2 days', occasions: ['awards', 'anniversary', 'birthday'], tags: ['tarp', 'backdrop', 'banner'] }),
  P('certificate', 'event-print', 'Certificate & diploma holder', 'Printed certificates with holders', { moq: 20, occasions: ['graduation', 'awards', 'conference'], tags: ['certificate', 'diploma'] }),

  // Writing & notebooks
  P('metal-pen', 'writing', 'Metal pen', 'Engraved name or logo', { popular: true, moq: 50, customization: ['Laser engraving'], occasions: ['conference', 'onboarding'], tags: ['ballpen', 'pen'] }),
  P('a5-notebook', 'writing', 'A5 notebook', 'Strap, magnetic or hardbound cover', {
    popular: true, moq: 30, customization: ['Debossed logo', 'Print'], options: [{ label: 'Cover', values: ['Leather strap', 'Magnetic', 'Hardbound'] }],
    occasions: ['conference', 'onboarding', 'graduation'], tags: ['notebook', 'journal', 'planner'],
  }),
  P('cable-organizer', 'writing', 'Tech organizer notebook', 'Cable organizer with wireless charging and pen holder', { moq: 20, occasions: ['appreciation', 'onboarding'], tags: ['organizer', 'powerbank notebook'] }),

  // Tech
  P('powerbank', 'tech', 'Powerbank', 'Slim, logo print or engraving', { popular: true, moq: 30, customization: ['UV print', 'Laser engraving'], occasions: ['tech-event', 'appreciation', 'christmas'], tags: ['power bank', 'charger'] }),
  P('wireless-charger', 'tech', 'Wireless charger & digital clock', 'Desk charger with clock or LED light', { moq: 30, occasions: ['appreciation', 'anniversary'], tags: ['charger', 'desk clock'] }),
  P('phone-stand', 'tech', 'Phone / laptop stand', 'Foldable, custom logo', { moq: 30, occasions: ['onboarding', 'tech-event'], tags: ['holder'] }),
  P('speaker', 'tech', 'Bluetooth speaker', 'Compact, custom logo', { moq: 20, occasions: ['christmas', 'fathers-day'], tags: ['speaker'] }),
  P('mini-fan', 'tech', 'Mini fan', 'USB rechargeable, handheld', { moq: 30, occasions: ['summer', 'concert'], tags: ['fan'] }),
  P('mouse-pad', 'tech', 'Mouse & mouse pad', 'Rubber or wireless-charging pad, full-color', { moq: 30, occasions: ['onboarding'], tags: ['mouse'] }),
  P('usb', 'tech', 'USB flash drive & cables', 'Custom-printed USB and multi-cables', { moq: 30, occasions: ['tech-event', 'conference'], tags: ['flash drive', 'cable'] }),
  P('night-light', 'tech', 'LED night light', 'Engraved acrylic light', { moq: 20, occasions: ['valentines', 'christmas'], tags: ['lamp'] }),

  // Rain gear & care
  P('umbrella', 'rain-care', 'Umbrella', 'Foldable automatic, J-handle or golf', {
    popular: true, moq: 30, options: [{ label: 'Type', values: ['Foldable automatic', 'J-handle', 'Golf 30 in', 'Double canopy golf'] }],
    occasions: ['rainy-season', 'appreciation', 'christmas'], tags: ['payong', 'golf umbrella', 'rain'],
  }),
  P('raincoat', 'rain-care', 'Raincoat', 'Reusable, custom print', { moq: 50, occasions: ['rainy-season', 'fun-run'], tags: ['poncho'] }),
  P('spray-bottle', 'rain-care', 'Spray bottle', 'Alcohol or mist bottle with label', { moq: 100, tags: ['sanitizer', 'alcohol'] }),
  P('humidifier', 'rain-care', 'Mini humidifier', 'USB desk humidifier with logo', { moq: 30, occasions: ['appreciation', 'christmas'], tags: ['diffuser'] }),
  P('organizer-box', 'rain-care', 'Toiletry organizer', 'Hanging travel organizer', { moq: 30, tags: ['travel kit'] }),
  P('tissue-box', 'rain-care', 'Tissue box organizer', 'Desk tissue box with compartments', { moq: 30, tags: ['desk organizer'] }),
  P('neck-pillow', 'rain-care', 'Neck pillow', 'Travel pillow with print', { moq: 30, tags: ['travel'] }),
  P('pocket-mirror', 'rain-care', 'Pocket mirror', 'Compact mirror with logo', { moq: 50, occasions: ['mothers-day', 'valentines'], tags: ['mirror'] }),

  // Eco
  P('bamboo-tumbler', 'eco', 'Bamboo tumbler', 'Bamboo shell, stainless inner', { moq: 30, customization: ['Laser engraving'], occasions: ['appreciation', 'christmas'], tags: ['tumbler', 'sustainable'] }),
  P('cutlery-set', 'eco', 'Bamboo cutlery + straw set', 'Spoon, fork, chopsticks, straw in pouch', { moq: 50, occasions: ['onboarding', 'christmas'], tags: ['utensils', 'sustainable'] }),
  P('lunch-box', 'eco', 'Glass lunch box', 'Bamboo lid, divided', { moq: 30, occasions: ['appreciation'], tags: ['food container'] }),

  // Gift sets & kits
  ...[
    ['kit-commute', 'Daily commute kit', 'Tumbler, umbrella, powerbank in a pouch'],
    ['kit-mobile-work', 'Mobile work kit', 'Notebook, pen, cable organizer, phone stand'],
    ['kit-executive', 'Executive desk kit', 'Leather notebook, metal pen, wireless charger clock'],
    ['kit-travel', 'Travel smart kit', 'Neck pillow, toiletry organizer, tumbler'],
    ['kit-wfa', 'Work-from-anywhere kit', 'Laptop stand, mouse pad, mug, earbuds pouch'],
    ['kit-event', 'Event essentials kit', 'Tote, lanyard with ID, notebook, pen, stickers'],
    ['kit-tech', 'Tech starter kit', 'Powerbank, cables, mouse pad, stickers'],
    ['kit-everyday', 'Everyday carry kit', 'Sling bag, tumbler, pocket mirror, spray bottle'],
    ['kit-welcome', 'Premium welcome kit', 'Hoodie, tumbler, notebook, pen in a gift box'],
  ].map(([id, name, specs]) =>
    P(id, 'gift-sets', name, specs, {
      moq: 20, leadTime: '7-10 days', customization: ['Branded box', 'Custom card'], isKit: true,
      occasions: id === 'kit-event' ? ['conference', 'tech-event'] : id === 'kit-welcome' ? ['onboarding', 'anniversary'] : ['appreciation', 'christmas', 'onboarding'],
      tags: ['gift set', 'bundle', 'giveaway', 'kit'],
    })
  ),
  P('custom-gift-set', 'gift-sets', 'Build your own gift set', 'Pick any items, set the budget per recipient', {
    popular: true, moq: 10, leadTime: '7-10 days', isKit: true, customization: ['Branded box', 'Custom card'],
    occasions: ['christmas', 'appreciation', 'anniversary', 'birthday', 'valentines', 'mothers-day', 'fathers-day', 'graduation', 'new-year', 'halloween'],
    tags: ['gift set', 'bundle', 'giveaway', 'hamper', 'token'],
  }),

  // Packaging
  P('gift-box', 'packaging', 'Custom gift box', 'Rigid or foldable box with logo', { moq: 30, occasions: ['christmas', 'anniversary', 'onboarding'], tags: ['box', 'packaging'] }),
  P('corrugated-box', 'packaging', 'Corrugated mailer box', 'Kraft brown, multiple sizes, printed', { moq: 50, tags: ['shipping box', 'mailer'] }),

  // Booths, displays & awards
  P('plaque', 'booths', 'Custom plaque & trophy', 'Acrylic, wood or glass, engraved', { moq: 1, occasions: ['awards', 'anniversary', 'graduation'], tags: ['award', 'trophy', 'recognition'] }),
  P('product-display', 'booths', 'Product display', 'Acrylic or wood display stands', { moq: 1, occasions: ['tech-event', 'conference'], tags: ['stand', 'shelf'] }),
  S('booth', 'booths', 'Booth build & installation', 'Small or big booth, design to install', { occasions: ['conference', 'tech-event'], tags: ['exhibit', 'stall', 'kiosk'] }),
  S('led-wall', 'booths', 'LED wall rental', 'Indoor LED screen with operator', { occasions: ['conference', 'concert', 'awards'], tags: ['led screen', 'video wall'] }),

  // Event services
  S('photo-booth', 'event-services', 'Photo booth', 'Booth, props and instant prints', { popular: true, occasions: ['awards', 'anniversary', 'birthday', 'christmas'], tags: ['photobooth', 'selfie'] }),
  S('registration', 'event-services', 'Registration support', 'Manpower plus automated registration website', { occasions: ['conference', 'tech-event', 'fun-run'], tags: ['check-in', 'attendance', 'website'] }),
  S('event-website', 'event-services', 'Event website', 'Landing page with registration and schedule', { occasions: ['conference', 'tech-event'], tags: ['web', 'microsite'] }),
  S('host', 'event-services', 'Event host', 'Professional host or emcee', { occasions: ['awards', 'anniversary', 'conference'], tags: ['emcee', 'mc'] }),
  S('tech-documentation', 'event-services', 'Tech & documentation', 'Sound, lights, photo and video coverage', { occasions: ['conference', 'concert', 'awards'], tags: ['photographer', 'videographer', 'sounds', 'av'] }),
  S('corporate-setup', 'event-services', 'Corporate event set-up', 'Venue styling and full set-up', { occasions: ['anniversary', 'awards', 'christmas', 'new-year'], tags: ['styling', 'decor', 'stage'] }),
  S('event-management', 'event-services', 'Full event management', 'From planning to execution', { occasions: ['conference', 'anniversary', 'fun-run'], tags: ['organizer', 'coordination'] }),

  // Design & marketing
  S('pubmat', 'marketing', 'Pubmat design & templates', 'Social posts, posters, templates', { leadTime: '2-4 days', occasions: ['conference', 'tech-event', 'concert'], tags: ['poster', 'graphics', 'social media'] }),
  S('campaign', 'marketing', 'Campaign & brand materials', 'Brand kits, print collaterals, campaign creatives', { tags: ['branding', 'collateral'] }),
  S('digital-marketing', 'marketing', 'Digital marketing support', 'Ads, content and promotion strategy', { tags: ['ads', 'social media', 'promotion'] }),
];

/**
 * Case-insensitive search. Items whose name, tags, specs or occasions match come first,
 * best matches on top; if nothing matches directly, fall back to category-name matches.
 */
export function searchCatalog(query, { category, occasion } = {}) {
  const words = (query || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const pool = CATALOG.filter(
    (item) => (!category || item.category === category) && (!occasion || item.occasions.includes(occasion))
  );
  if (!words.length) return pool;

  const has = (text, w) => text.includes(w) || (w.length > 3 && text.includes(w.replace(/(es|s)$/, '')));
  const scored = pool
    .map((item) => {
      const name = item.name.toLowerCase();
      const tags = item.tags.join(' ').toLowerCase();
      const specs = item.specs.toLowerCase();
      const occ = item.occasions.map((o) => OCCASIONS.find((x) => x.id === o)?.name || o).join(' ').toLowerCase();
      let score = 0;
      for (const w of words) {
        if (has(name, w)) score += 3;
        else if (has(tags, w)) score += 2;
        else if (has(occ, w)) score += 1.5;
        else if (has(specs, w)) score += 1;
        else return null; // every word must match somewhere
      }
      return { item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
  if (scored.length) return scored.map((x) => x.item);

  return pool.filter((item) => {
    const cat = CATALOG_CATEGORIES.find((c) => c.id === item.category)?.name.toLowerCase() || '';
    return words.every((w) => has(cat, w));
  });
}
