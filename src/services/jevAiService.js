import { TypeSafeClient, choice, score } from '@typesafe-ai/sdk';

const apiKey = import.meta.env.VITE_TYPESAFE_API_KEY || import.meta.env.TYPESAFE_API_KEY || 'typesafe-dev-key';

let clientInstance = null;

function getClient() {
  if (!clientInstance) {
    try {
      clientInstance = new TypeSafeClient({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });
    } catch (err) {
      console.warn('TypeSafeClient lazy init warning:', err);
      return null;
    }
  }
  return clientInstance;
}

/**
 * 1. Smart Category & Requirement Tagging with Aygo Assist (TypeSafe Jev)
 * Analyzes organizer prompt text (e.g. "500 navy dri-fit event shirts for BGC marathon")
 * and extracts category, production method, urgency, and estimated price range.
 */
export async function analyzeSourcingRequest(userPrompt) {
  if (!userPrompt || !userPrompt.trim()) {
    return {
      success: false,
      error: 'Empty prompt'
    };
  }

  // Helper to extract numbers
  const qtyMatch = userPrompt.match(/(\d{1,6})\s*(pcs|pieces|sets|pax|attendees|units|shirts|totes|tumblers|lanyards)?/i);
  const parsedQty = qtyMatch ? parseInt(qtyMatch[1], 10) : 300;

  try {
    const client = getClient();
    if (!client) {
      throw new Error('Client unavailable, using fallback classification');
    }

    const response = await client.systemOne({
      state: {
        requestText: userPrompt,
      },
      questions: {
        category: choice('What primary category of event merchandise is requested?', {
          apparel: 'T-shirts, polo shirts, jackets, caps, jerseys, uniforms',
          event_print: 'Lanyards, IDs, stickers, flyers, banners, event badges, wristbands',
          drinkware: 'Tumblers, mugs, insulated bottles, cups',
          bags: 'Tote bags, canvas bags, backpacks, pouches, corporate gifts',
        }),
        printingMethod: choice('What is the best printing/crafting method for this order?', {
          silkscreen: 'Silkscreen printing for cotton shirts or bags',
          sublimation: 'Full color sublimation for dri-fit or satin lanyards',
          embroidery: 'Embroidered logos for polo shirts or jackets',
          dtf: 'Direct to Film heat transfer for detailed multicolor designs',
          laser: 'Laser engraving for stainless steel tumblers or wood/metal',
        }),
        urgency: choice('How urgent is this production timeline?', {
          expedited: 'Needs delivery in under 5 business days',
          standard: 'Standard 5 to 10 business days',
          relaxed: 'Flexible or over 10 business days',
        }),
      },
    });

    let rawCat = response.answers.category.choice;
    let mappedCat = 'apparel';
    if (rawCat === 'event_print' || rawCat === 'print') mappedCat = 'event-print';
    else if (rawCat === 'drinkware') mappedCat = 'drinkware';
    else if (rawCat === 'bags' || rawCat === 'swag') mappedCat = 'bags';
    else mappedCat = 'apparel';

    const method = response.answers.printingMethod.choice;
    const urgency = response.answers.urgency.choice;

    // Estimate Unit Price based on category and printing method
    let unitEstimate = 180;
    if (mappedCat === 'apparel') {
      unitEstimate = method === 'sublimation' ? 220 : method === 'embroidery' ? 320 : 160;
    } else if (mappedCat === 'event-print') {
      unitEstimate = method === 'sublimation' ? 48 : 35;
    } else if (mappedCat === 'drinkware') {
      unitEstimate = method === 'laser' ? 340 : 260;
    } else if (mappedCat === 'bags') {
      unitEstimate = 75;
    }

    const calculatedBudget = parsedQty * unitEstimate;

    // Detect if prompt mentions multiple items (Package Mode)
    const lower = userPrompt.toLowerCase();
    const isPackage = (lower.includes('package') || lower.includes('bundle') || lower.includes('pack') || (lower.includes(' and ') && (lower.includes('shirt') || lower.includes('lanyard') || lower.includes('bag') || lower.includes('tumbler'))));

    const detectedCategories = [mappedCat];
    if (lower.includes('shirt') || lower.includes('polo') || lower.includes('apparel') || lower.includes('hoodie')) {
      if (!detectedCategories.includes('apparel')) detectedCategories.push('apparel');
    }
    if (lower.includes('lanyard') || lower.includes('badge') || lower.includes('wristband') || lower.includes('sticker') || lower.includes('print')) {
      if (!detectedCategories.includes('event-print')) detectedCategories.push('event-print');
    }
    if (lower.includes('tumbler') || lower.includes('mug') || lower.includes('bottle')) {
      if (!detectedCategories.includes('drinkware')) detectedCategories.push('drinkware');
    }
    if (lower.includes('tote') || lower.includes('bag') || lower.includes('pouch') || lower.includes('swag')) {
      if (!detectedCategories.includes('bags')) detectedCategories.push('bags');
    }

    return {
      success: true,
      category: mappedCat,
      printingMethod: method,
      urgency: urgency,
      confidence: response.answers.category.confidence || 0.98,
      quantity: parsedQty,
      estimatedBudget: calculatedBudget,
      isPackage: isPackage,
      detectedCategories: detectedCategories,
      specsSummary: `${parsedQty}x custom items with ${method.toUpperCase()} technique. Formatted and verified with Aygo Assist.`,
      model: response.model || 'jev-1.13'
    };
  } catch (error) {
    console.warn('Aygo Assist (TypeSafe Jev) API fallback:', error);
    // Intelligent fallback parsing
    const lower = userPrompt.toLowerCase();
    let cat = 'apparel';
    if (lower.includes('lanyard') || lower.includes('badge') || lower.includes('print') || lower.includes('wristband')) cat = 'event-print';
    else if (lower.includes('tumbler') || lower.includes('mug') || lower.includes('bottle')) cat = 'drinkware';
    else if (lower.includes('tote') || lower.includes('bag') || lower.includes('gift') || lower.includes('swag')) cat = 'bags';

    let method = 'silkscreen';
    if (lower.includes('satin') || lower.includes('sublimat') || lower.includes('full color')) method = 'sublimation';
    else if (lower.includes('embroid') || lower.includes('polo')) method = 'embroidery';
    else if (lower.includes('laser') || lower.includes('engrav')) method = 'laser';
    else if (lower.includes('dtf') || lower.includes('transfer')) method = 'dtf';

    let unit = 180;
    if (cat === 'event-print') unit = 48;
    else if (cat === 'drinkware') unit = 320;
    else if (cat === 'bags') unit = 75;

    return {
      success: true,
      category: cat,
      printingMethod: method,
      urgency: lower.includes('rush') || lower.includes('urgent') ? 'expedited' : 'standard',
      quantity: parsedQty,
      estimatedBudget: parsedQty * unit,
      isPackage: false,
      detectedCategories: [cat],
      specsSummary: `${parsedQty} units. ${method.toUpperCase()} customization.`,
      fallback: true,
    };
  }
}

/**
 * 2. Automated Supplier Bid Match & Verification Scoring with Aygo Assist (TypeSafe Jev)
 * Scores supplier bids based on budget fit, location proximity, lead time, and capability.
 */
export async function scoreSupplierBid({ request, supplierBid }) {
  try {
    const client = getClient();
    if (!client) {
      throw new Error('Client unavailable, using fallback scoring');
    }

    const response = await client.systemOne({
      state: {
        organizerBudget: request.budget,
        deliveryDeadline: request.date,
        deliveryLocation: request.location,
        supplierName: supplierBid.name,
        supplierLocation: supplierBid.loc,
        supplierPrice: supplierBid.price,
        supplierLeadTime: supplierBid.days,
        supplierRating: supplierBid.rating || '4.8',
      },
      questions: {
        budgetFit: choice('Is the supplier bid pricing fair and within reasonable range of organizer budget?', {
          excellent: 'Substantially under or perfectly matches target budget',
          fair: 'Slightly above or requires minor negotiation',
          overpriced: 'Far exceeds target budget',
        }),
        logisticsFeasibility: choice('Is the supplier location and turnaround feasible for the venue location?', {
          highly_feasible: 'Supplier is nearby and turnaround is fast',
          feasible: 'Standard shipping distance and manageable timeline',
          risky: 'High risk of delivery delay due to distance or long lead time',
        }),
        overallMatchScore: score('Overall match rating for this maker bid', [
          'Poor fit or risky delivery timeframe',
          'Acceptable fit with minor tradeoffs',
          'Good match on budget and lead time',
          'Excellent match, highly recommended supplier',
        ]),
      },
    });

    return {
      success: true,
      budgetFit: response.answers.budgetFit.choice,
      logisticsFeasibility: response.answers.logisticsFeasibility.choice,
      matchScore: response.answers.overallMatchScore.score,
    };
  } catch (error) {
    console.warn('Aygo Assist scoring fallback:', error);
    return {
      success: false,
      budgetFit: 'excellent',
      logisticsFeasibility: 'highly_feasible',
      matchScore: 0.92,
      fallback: true,
    };
  }
}

/**
 * 3. Basic Mockup Sample Configuration with Aygo Assist (TypeSafe Jev)
 * Analyzes event theme or requested product to suggest appropriate base product, color swatch, and crafting method.
 */
export async function generateMockupConfig(promptText) {
  if (!promptText || !promptText.trim()) {
    return { product: 'tee', color: 'Royal Navy', technique: 'DTF Full Color' };
  }

  try {
    const client = getClient();
    if (!client) throw new Error('Client unavailable');

    const response = await client.systemOne({
      state: {
        eventMerchRequest: promptText,
      },
      questions: {
        productType: choice('Which base merchandise item fits this request best?', {
          tee: 'T-Shirt (220 GSM Combed Cotton)',
          tote: 'Heavy Canvas Tote Bag (14oz)',
          tumbler: 'Matte Thermal Tumbler (500ml)',
          lanyard: 'Custom Satin Event Lanyards (20mm)',
          hoodie: 'Fleece Pullover Hoodie (320 GSM)',
        }),
        colorScheme: choice('What is the best matching color swatch?', {
          navy: 'Royal Navy',
          black: 'Pitch Black',
          white: 'Pure White',
          green: 'Forest Green',
          cream: 'Sand Cream',
          blue: 'Aygo Electric Blue',
        }),
        craftingTechnique: choice('What is the recommended crafting technique?', {
          dtf: 'DTF Full Color',
          laser: 'Rotary Laser Engraving',
          sublimation: 'Full Sublimation',
          embroidery: 'Computerized Embroidery',
          silkscreen: 'Silkscreen / DTF',
        }),
      },
    });

    const COLOR_MAP = {
      navy: 'Royal Navy',
      black: 'Pitch Black',
      white: 'Pure White',
      green: 'Forest Green',
      cream: 'Sand Cream',
      blue: 'Aygo Electric Blue',
    };

    const TECHNIQUE_MAP = {
      dtf: 'DTF Full Color',
      laser: 'Rotary Laser Engraving',
      sublimation: 'Full Sublimation',
      embroidery: 'Computerized Embroidery',
      silkscreen: 'Silkscreen / DTF',
    };

    return {
      success: true,
      product: response.answers.productType.choice || 'tee',
      color: COLOR_MAP[response.answers.colorScheme.choice] || 'Royal Navy',
      technique: TECHNIQUE_MAP[response.answers.craftingTechnique.choice] || 'DTF Full Color',
    };
  } catch (err) {
    console.warn('Mockup config fallback:', err);
    const lower = promptText.toLowerCase();
    let p = 'tee';
    if (lower.includes('tumbler') || lower.includes('mug') || lower.includes('bottle')) p = 'tumbler';
    else if (lower.includes('lanyard') || lower.includes('badge') || lower.includes('wristband')) p = 'lanyard';
    else if (lower.includes('tote') || lower.includes('bag')) p = 'tote';
    else if (lower.includes('hoodie') || lower.includes('jacket')) p = 'hoodie';

    return {
      success: false,
      product: p,
      color: 'Royal Navy',
      technique: p === 'tumbler' ? 'Rotary Laser Engraving' : p === 'lanyard' ? 'Full Sublimation' : 'DTF Full Color',
      fallback: true,
    };
  }
}
