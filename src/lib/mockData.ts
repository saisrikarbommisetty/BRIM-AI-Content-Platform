import { GeneratedCalendar, Post } from '../types';
import { industryConfigs } from '../config/industryIntelligence';

// Premium fictional sample briefs for the 4 industries
export const sampleReferenceData: Record<string, { filename: string; content: string }> = {
  realestate: {
    filename: "green_valley_heights_brochure.txt",
    content: `PROJECT: Green Valley Heights
DEVELOPER: Apex Living Group
LOCATION: Vijayawada, near Benz Circle (Premium Residential Zone)
CONFIGURATION: Ultra-luxurious 2 BHK (1400 sq.ft.) & 3 BHK (1850 sq.ft.) residences
ARCHITECTURE: Contemporary open-plan layout, floor-to-ceiling glass windows (80% open spaces)
KEY AMENITIES:
- Double-height Air-conditioned Clubhouse
- Rooftop Infinity Swimming Pool
- Fully equipped Cross-fit Gymnasium
- Landscaped Jogging Track & Children's Play Arena
- 24/7 Multi-tier Security & Power Backup
USP: The only project in Vijayawada offering direct lake views, 5-minute connectivity to premium schools, and private balcony gardens.`
  },
  jewellery: {
    filename: "royal_heritage_gold_collection.txt",
    content: `COLLECTION: The Royal Heritage Bridal Collection
BRAND: Aara Fine Jewellery
MATERIALS: 22 Karat Yellow Gold, Uncut Polki Diamonds, Hand-selected Zambian Emeralds
DESIGN INSPIRATION: Mughal architecture, floral filigree, and hand-carved heritage motifs
CRAFTSMANSHIP:
- 100% hand-crafted by master artisans (Karigars) in Jaipur
- Intricate Meenakari (enameling) work on the reverse
- Unique Jadau setting technique
RECOMMENDED OCCASIONS: Bridal wear, Muhurtham, Sangeet ceremony, and royal family gifting
WARRANTY: 100% BIS Hallmarked gold, certified Conflict-free diamonds, lifetime exchange policy.`
  },
  perfume: {
    filename: "maison_de_ambre_product_sheet.txt",
    content: `FRAGRANCE NAME: Ambre Nuit Extrait
BRAND: Maison de Parfum
SCENT PROFILE: Warm Oriental Woody Spicy
OLFACTORY NOTES:
- Top Notes: Zesty Italian Bergamot, Fresh Pink Pepper
- Heart Notes: Rich Turkish Rose, Spicy Indonesian Nutmeg
- Base Notes: Warm Grey Amber (Ambergris), Creamy Indian Sandalwood, Sweet Madagascar Vanilla
MOOD & PERSONALITY: Evocative, mysterious, sophisticated, warm, and highly sensual.
USAGE RECOMMENDATIONS:
- Evening and night-time wear
- Best suited for cool weather, romantic dinners, and luxury formal galas
- Sillage: Heavy, leaves a memorable trail
- Longevity: 12+ hours on skin`
  },
  food: {
    filename: "crunchy_bites_baked_chips_brief.txt",
    content: `PRODUCT: CrunchyBites Baked Multigrain Chips
BRAND: NourishFoods Co.
FLAVORS: Tangy Tomato & Basil, Creamy Sour Cream & Onion, Spicy Peri Peri Twist
INGREDIENTS: Whole Wheat, Ragi, Oats, Amaranth, Rice Flour (No Maida, No Palm Oil)
NUTRITIONAL BENEFITS:
- 70% Less Fat than regular fried potato chips
- Baked, never fried
- 4g Protein & 3g Fiber per serving
- Cholesterol-free & Trans-fat-free
OCCASIONS: School lunchbox snack, late-night office fuel, guilt-free tea-time snacking, children's picnics, and healthy party platters.`
  }
};

// Generates simulated dates starting from today
export function getSimulatedDates(count: number): string[] {
  const dates: string[] = [];
  const start = new Date();
  
  // Distribute posts across days
  // 3 posts -> every 2 days
  // 6 posts -> every 2 days
  // 12 posts -> every 2 days or 3 days
  const step = count <= 3 ? 2 : count <= 6 ? 2 : 2;
  
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i * step);
    dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  }
  return dates;
}

// Extractor helper to find variables from uploaded text
interface ExtractedContext {
  projectName?: string;
  location?: string;
  brand?: string;
  materials?: string[];
  productName?: string;
  notes?: string[];
  flavors?: string[];
  highlights?: string[];
}

function extractContext(text: string, industry: string): ExtractedContext {
  const context: ExtractedContext = {};
  if (!text) return context;

  const lines = text.split('\n');
  
  if (industry === 'realestate') {
    const projMatch = text.match(/(?:PROJECT|NAME|PROPERTY):\s*([^\r\n]+)/i);
    const locMatch = text.match(/(?:LOCATION|AREA):\s*([^\r\n]+)/i);
    const devMatch = text.match(/(?:DEVELOPER|BUILDER):\s*([^\r\n]+)/i);
    context.projectName = projMatch ? projMatch[1].trim() : "Aurora Crest Residences";
    context.location = locMatch ? locMatch[1].trim() : "Premium City Center";
    context.brand = devMatch ? devMatch[1].trim() : "Apex Living Group";
    
    // Find some configurations or highlights
    const configMatches = text.match(/(\d\s*BHK|\d\s*bedroom|Penthouse)/gi);
    context.materials = configMatches ? Array.from(new Set(configMatches.map(c => c.toUpperCase()))) : ["2 & 3 BHK"];
  } 
  else if (industry === 'jewellery') {
    const collMatch = text.match(/(?:COLLECTION|NAME|BRAND):\s*([^\r\n]+)/i);
    const matMatch = text.match(/(?:MATERIALS|METAL|STONES):\s*([^\r\n]+)/i);
    context.projectName = collMatch ? collMatch[1].trim() : "Imperial Filigree Diamond Suite";
    context.brand = text.match(/BRAND:\s*([^\r\n]+)/i)?.[1].trim() || "Aara Fine Jewellery";
    
    if (matMatch) {
      context.materials = matMatch[1].split(',').map(m => m.trim());
    } else {
      context.materials = ["22K gold", "polki diamonds", "Zambian emeralds"];
    }
  } 
  else if (industry === 'perfume') {
    const perfMatch = text.match(/(?:FRAGRANCE NAME|NAME|PRODUCT):\s*([^\r\n]+)/i);
    const brandMatch = text.match(/(?:BRAND|HOUSE):\s*([^\r\n]+)/i);
    context.productName = perfMatch ? perfMatch[1].trim() : "Elysian Mist Extrait";
    context.brand = brandMatch ? brandMatch[1].trim() : "Maison de Parfum";

    const topMatch = text.match(/Top\s*(?:Notes)?:\s*([^\r\n]+)/i);
    const heartMatch = text.match(/Heart\s*(?:Notes)?:\s*([^\r\n]+)/i);
    const baseMatch = text.match(/Base\s*(?:Notes)?:\s*([^\r\n]+)/i);
    
    if (topMatch || heartMatch || baseMatch) {
      context.notes = [];
      if (topMatch) context.notes.push(...topMatch[1].split(',').map(n => n.trim() + ' (Top)'));
      if (heartMatch) context.notes.push(...heartMatch[1].split(',').map(n => n.trim() + ' (Heart)'));
      if (baseMatch) context.notes.push(...baseMatch[1].split(',').map(n => n.trim() + ' (Base)'));
    } else {
      context.notes = ["Zesty Bergamot", "Turkish Rose", "Grey Amber", "Sandalwood"];
    }
  } 
  else if (industry === 'food') {
    const prodMatch = text.match(/(?:PRODUCT|ITEM|NAME):\s*([^\r\n]+)/i);
    const brandMatch = text.match(/(?:BRAND|MAKER):\s*([^\r\n]+)/i);
    context.productName = prodMatch ? prodMatch[1].trim() : "CrunchyBites Baked Chips";
    context.brand = brandMatch ? brandMatch[1].trim() : "NourishFoods Co.";

    const flavorMatch = text.match(/(?:FLAVORS|VARIETIES):\s*([^\r\n]+)/i);
    if (flavorMatch) {
      context.flavors = flavorMatch[1].split(',').map(f => f.trim());
    } else {
      context.flavors = ["Tangy Tomato & Basil", "Creamy Sour Cream & Onion"];
    }
  }

  return context;
}

// Generate fallback content calendar
export function generateDemoCalendar(
  industry: string,
  duration: string,
  referenceText: string
): GeneratedCalendar {
  const config = industryConfigs[industry] || industryConfigs.realestate;
  const count = duration === '1week' ? 3 : duration === '2weeks' ? 6 : 12;
  const dates = getSimulatedDates(count);
  const ext = extractContext(referenceText, industry);
  
  const posts: Post[] = [];

  for (let i = 0; i < count; i++) {
    // Select a content pillar sequentially to ensure zero repetition
    const pillarIndex = i % config.contentPillars.length;
    const pillar = config.contentPillars[pillarIndex];
    
    let caption = "";
    let visualDirection = "";
    let hashtags: string[] = [];

    // Industry customized content generation
    if (industry === 'realestate') {
      const proj = ext.projectName || "Aurora Crest Residences";
      const loc = ext.location || "Premium City Center";
      const dev = ext.brand || "Apex Living Group";
      const configs = ext.materials?.join(" or ") || "2 & 3 BHK";

      hashtags = ["#RealEstate", `#${proj.replace(/\s+/g, '')}`, `#${loc.replace(/\s+/g, '')}`, "#LuxuryLiving", "#PropertyInvestment", "#HomeWalkthrough"];

      if (pillar.name === "Location Spotlight") {
        caption = `Location is the ultimate luxury. 📍 Nestled at the heart of ${loc}, ${proj} puts you minutes away from the city's finest dining, premium schools, and corporate hubs, while wrapping you in quiet comfort. \n\nNo long commutes, no traffic stress—just a seamless connection to everything you love. Experience the power of a prime address.\n\nCreated by ${dev}. DM us to schedule a private location walkthrough.`;
        visualDirection = `A beautiful, golden hour aerial view of the neighborhood around ${loc}, showcasing premium connectivity, wide tree-lined roads, and nearby green spaces.`;
      } else if (pillar.name === "Property Walkthrough") {
        caption = `Step into smart luxury. ✨ Our ${configs} apartments at ${proj} are engineered for spatial harmony. With floor-to-ceiling glass windows, every corner is bathed in natural daylight and gentle breezes.\n\nFrom the premium finishes to the spacious living layouts, we've designed a home that doesn't just look magnificent—it feels like an sanctuary. \n\nSchedule your private preview today.`;
        visualDirection = `A wide-angle, bright interior render of the living room at ${proj}, showing contemporary decor, natural sunlight streaming in, and high-end wooden flooring.`;
      } else if (pillar.name === "Amenities & Lifestyle") {
        caption = `Why step out when the world is at your doorstep? 🏊‍♂️ Rejuvenate with a dip in the rooftop infinity pool, host memorable dinners in the air-conditioned clubhouse, or start your morning at our state-of-the-art gym.\n\nAt ${proj}, the amenities aren't just features—they are the building blocks of your new, elevated lifestyle. \n\nWhich of these would be your favorite weekend spot? Let us know below!`;
        visualDirection = `A stunning shot of the rooftop infinity swimming pool at sunset, showing crystal clear water reflecting the sky, with stylish lounge chairs and soft ambient lighting.`;
      } else if (pillar.name === "Investment Perspective") {
        caption = `A home is more than a sanctuary—it's a legacy. 📈 Investing in ${proj} near ${loc} offers unparalleled potential. With rapid infrastructure expansion and the trusted delivery of ${dev}, this property represents both security and capital appreciation.\n\nSecure your family's future and watch your investment grow in the city's most sought-after corridor.\n\nRequest our financial projection sheet via DM.`;
        visualDirection = `A clean infographic showing a structural outline of the building with key value points: '80% Open Areas', 'High Rental Yield', and 'Prime City Connectivity'.`;
      } else if (pillar.name === "Buyer Education") {
        caption = `Buying your first home is a milestone, and we believe it should be completely stress-free. 🔑 From understanding configuration floorplans to evaluating home loan options and registration documentation, our advisory team is here to guide you step-by-step.\n\nNo hidden charges, no legal worries. Only trusted advisory.\n\nRead our guide on home buying by clicking the link in our bio.`;
        visualDirection = `A friendly, high-contrast lifestyle photograph of a professional advisor sitting with a young couple in a modern conference room, looking over property layouts.`;
      } else {
        caption = `Where security meets community. 🏡 At ${proj}, we've built more than apartments—we've crafted a thriving neighborhood. With 24/7 multi-tier security, safe children's play arenas, and quiet jogging tracks, every family member finds their space of joy.\n\nWelcome to a home where kids grow up with nature and neighbors become lifelong friends.`;
        visualDirection = `A heartwarming lifestyle photograph of a family laughing together in a beautifully landscaped private garden balcony, with soft warm lighting.`;
      }
    } 
    else if (industry === 'jewellery') {
      const coll = ext.projectName || "Royal Heritage Bridal Collection";
      const brand = ext.brand || "Aara Fine Jewellery";
      const mats = ext.materials ? ext.materials.slice(0, 3).join(", ") : "22K gold, polki diamonds, and Zambian emeralds";

      hashtags = ["#LuxuryJewellery", `#${brand.replace(/\s+/g, '')}`, "#BridalJewellery", "#HandcraftedJewellery", "#PolkiDiamonds", "#HeritageArtistry"];

      if (pillar.name === "Craftsmanship Stories") {
        caption = `Behind every masterpiece lies a story of patience, heritage, and precision. 🔨 Our karigars in Jaipur spend hundreds of hours handcrafting each piece in the ${coll}, using the traditional Jadau technique.\n\nLook closely at the intricate gold filigree and the delicate Meenakari enameled details on the reverse—made for those who appreciate pure artistry.\n\nCrafted by ${brand}. Experience heritage in every detail.`;
        visualDirection = `A macro close-up shot of an artisan's hands carefully setting a polki diamond into an intricate gold necklace, surrounded by design sketches.`;
      } else if (pillar.name === "Product Spotlight") {
        caption = `Ethereal glow, timeless design. ✨ Presenting our handcrafted necklace from the ${coll}. Fashioned from ${mats}, this piece features stunning symmetry and an opulent layout that captures light at every angle.\n\nCreated to make you feel like royalty, today and forever.\n\nAvailable for viewing at our flagship boutique. DM to schedule an appointment.`;
        visualDirection = `An editorial, high-contrast flat lay of the necklace on a dark green velvet background, lit carefully to catch the sparkle of diamonds and rich green of emeralds.`;
      } else if (pillar.name === "Bridal & Occasion Wear") {
        caption = `For the day you promise a lifetime. 💍 The ${coll} is designed to be the crowning glory of your bridal look. Pairing deep-colored Zambian emeralds with brilliant uncut polki, it complements the rich textures of your wedding ensemble.\n\nCreate a memory that will be handed down through generations. \n\nConnect with our bridal stylist via DM.`;
        visualDirection = `A soft, romantic portrait of a bride in an elegant red lehenga, looking down, highlighting the statement choker necklace and matching jhumkas.`;
      } else if (pillar.name === "Gifting & Emotions") {
        caption = `Some gifts need no words; they carry an eternity of love. 🎁 Celebrate your special milestone—whether it is a milestone anniversary or a grand family celebration—with a handcrafted heirloom from ${brand}.\n\nA token of love that grows more precious with every passing year. \n\nExplore our bespoke gifting collection.`;
        visualDirection = `A beautifully lit lifestyle shot of a premium leather jewellery box being opened, revealing a sparkling gold bracelet, against a background of soft candlelight.`;
      } else if (pillar.name === "Heritage & Legacy") {
        caption = `An echo of royal legacies. 👑 Inspired by the timeless arches of Mughal architecture, the ${coll} revives centuries-old design principles. Every curves, every setting, and every motif is a tribute to our glorious cultural heritage.\n\nWear history, carry elegance, and define your legacy with ${brand}.`;
        visualDirection = `An artistic collage showing a Mughal architectural dome side-by-side with the geometric design of a gold pendant, highlighting the design inspiration.`;
      } else {
        caption = `The art of styling. 💎 Wondering how to style a heavy heritage choker? Pair it with a classic, solid-colored silk saree and a deep neck blouse to let the ${mats} take center stage.\n\nMinimalist makeup, classic bun, and maximum elegance. Tell us: how would you style this piece?`;
        visualDirection = `A fashion editorial photo of a model styled in a modern black silk gown, wearing only the heritage choker, showcasing a fusion of ethnic and modern style.`;
      }
    } 
    else if (industry === 'perfume') {
      const perf = ext.productName || "Ambre Nuit Extrait";
      const brand = ext.brand || "Maison de Parfum";
      const notes = ext.notes ? ext.notes.slice(0, 3).join(", ") : "Bergamot, Turkish Rose, and Grey Amber";

      hashtags = ["#MaisonDeParfum", `#${perf.replace(/\s+/g, '')}`, "#FragranceNotes", "#SignatureScent", "#NichePerfumery", "#SensoryExperience"];

      if (pillar.name === "Fragrance Notes Breakdown") {
        caption = `Unlocking the olfactory layers of ${perf}. 🪵 The scent begins with a zesty splash of Bergamot (Top), immediately yielding to an opulent heart of Turkish Rose and spices (Heart), before settling into the deep, warm, and creamy embrace of Sandalwood and Ambergris (Base).\n\nAn evolution on the skin that tells a different story every hour. \n\nCrafted by ${brand}. DM us to order a discovery sample.`;
        visualDirection = `A creative layout showing the perfume bottle in the center, flanked by sliced bergamot, fresh rose petals, and raw sandalwood blocks on a slate surface.`;
      } else if (pillar.name === "Scent Storytelling") {
        caption = `Inspired by the mystery of a Parisian night. 🌌 ${perf} is an olfactory poem of shadows and warmth. It captures the exact moment the cold evening breeze meets the warm glow of candlelight—mysterious, seductive, and unforgettable.\n\nA scent that leaves a whisper of your presence long after you've left the room.\n\nDiscover the night. Link in bio.`;
        visualDirection = `A moody, low-key photo of the bottle reflecting soft amber candlelight on a dark, wet marble surface, with wisps of vapor or mist around it.`;
      } else if (pillar.name === "Usage & Occasion") {
        caption = `The art of sillage. 🌙 Heavy, evocative, and incredibly long-lasting—${perf} is best suited for evening formal galas, intimate dinners, and colder weather. \n\nApply to pulse points—behind the ears, on wrists, and the collarbone—to let your natural body heat radiate this sophisticated woody blend.\n\nWhat's your go-to occasion for a deep amber scent?`;
        visualDirection = `A close-up shot of a model spraying perfume on their wrist, with the spray mist captured in motion under dramatic backlighting.`;
      } else if (pillar.name === "Personality Match") {
        caption = `Your perfume is your silent introduction. 💼 ${perf} is crafted for the bold, the sophisticated, and the enigmatic. It is a fragrance for individuals who command a room without speaking a word, leaving a trail of gray amber and spices in their wake.\n\nIs this your signature identity? \n\nOrder online at ${brand}.`;
        visualDirection = `A high-fashion black and white shot of an elegant person in a tailored suit, adjusting their collar, with the perfume bottle in soft focus on the vanity table.`;
      } else if (pillar.name === "Ingredient Spotlight") {
        caption = `Quality without compromise. 🌹 The heart of ${perf} features hand-selected Turkish Rose, extracted at dawn to preserve its fresh, velvety sweetness. Blended with rare grey ambergris, we create a sensory contrast that is both animalic and sweet.\n\nExperience niche perfumery at its finest.`;
        visualDirection = `A macro shot of fresh dew-kissed pink rose petals floating in dark, rich oil, capturing the essence of luxury extraction.`;
      } else {
        caption = `Vanity luxury. 🏷️ The sleek glass bottle of ${perf} is designed to be a visual statement on your vanity table. A heavy magnetic cap, hand-polished glass, and a liquid gold hue that reflects its premium scent profile.\n\nLuxury inside and out. \n\nVisit our boutique for a sensory consultation.`;
        visualDirection = `A clean, minimalist product shot of the perfume bottle on a travertine stone pedestal, under bright natural sunlight with soft shadows.`;
      }
    } 
    else {
      // Food FMCG
      const prod = ext.productName || "CrunchyBites Baked Chips";
      const brand = ext.brand || "NourishFoods Co.";
      const flavors = ext.flavors ? ext.flavors.join(" and ") : "Tangy Tomato and Sour Cream";

      hashtags = ["#NourishFoods", `#${prod.replace(/\s+/g, '')}`, "#HealthySnacking", "#BakedNotFried", "#SnackOccasion", "#WholesomeBites"];

      if (pillar.name === "Taste & Flavor Explosion") {
        caption = `Crunchy, tangy, and absolutely delicious! 🍅 Treat your taste buds to the ultimate snack upgrade with our ${flavors} baked multigrain chips. \n\nEvery single bite is packed with real basil, tomato extracts, and a satisfying crunch that makes healthy eating taste like a cheat day!\n\nGrab your pack from the nearest supermarket today!`;
        visualDirection = `A dynamic, high-speed macro shot of chips tumbling down, with fresh tomato slices and basil leaves flying around them in a splash of seasoning.`;
      } else if (pillar.name === "Convenience & Quick Recipes") {
        caption = `Craving nachos but want to keep it healthy? 🥑 Here's a 5-minute snack hack: \n1. Grab a plate of ${prod}.\n2. Top with fresh avocado mash, chopped onions, and tomatoes.\n3. Sprinkle a dash of cheese and microwave for 30 seconds.\n\nVoila! High-fiber, guilt-free nachos are ready. Save this recipe for your next snack craving!`;
        visualDirection = `A step-by-step top-down photo showing a plate of healthy loaded nachos made with the chips, surrounded by fresh ingredients.`;
      } else if (pillar.name === "Family & Sharing Moments") {
        caption = `The school lunchbox hero! 🎒 Finding a snack that kids love and parents approve of is no longer a challenge. ${prod} are baked, made with oats, ragi, and whole wheat, and packed with flavor.\n\nGive them the crunch they crave without the palm oil or preservatives. \n\nLoved by kids, trusted by moms.`;
        visualDirection = `A warm kitchen shot of a mother smiling while pack a colorful lunchbox for her young school child, slipping in a packet of chips.`;
      } else if (pillar.name === "Product Benefits & Nutrition") {
        caption = `Baked to perfection, never fried. 🚫 Regular potato chips are loaded with palm oil and empty calories. But ${prod} contain 70% less fat, 4g of clean protein, and 3g of dietary fiber per serving.\n\nMake the smart switch for your body. Snacking made wholesome by ${brand}.\n\nOrder a box on Amazon or BigBasket.`;
        visualDirection = `A side-by-side graphical comparison layout: 'Fried Potato Chips (High Fat, Palm Oil)' vs 'NourishFoods Baked Chips (70% Less Fat, Whole Grains)'.`;
      } else if (pillar.name === "Snacking & Everyday Occasions") {
        caption = `3:00 PM office desk slump? 🥱 Skip the greasy samosas and fuel your workday with the wholesome goodness of ${prod}. Baked multigrain grains keep your energy levels steady without the heavy, sleepy feeling.\n\nKeep a packet in your office drawer for instant healthy refueling.`;
        visualDirection = `A modern, clean desk flat lay showing a laptop, notebook, a cup of green tea, and an open bag of baked multigrain chips.`;
      } else {
        caption = `Weekend movie night sorted! 🎬 Pop a bag of our Peri Peri or Tomato Basil chips, gather the family, and dive into your favorite movie without the snacking guilt.\n\nWholesome crunch, happy moments, and zero compromises. \n\nWhich flavor is your family fighting for? Tag them below!`;
        visualDirection = `A cozy living room photo of a family sitting on a couch laughing together, sharing a large bowl of chips, with soft TV glow in the background.`;
      }
    }

    posts.push({
      postNumber: i + 1,
      date: dates[i],
      contentPillar: pillar.name,
      caption: caption.trim(),
      visualDirection: visualDirection.trim(),
      hashtags
    });
  }

  return {
    industry: config.name,
    duration: duration === '1week' ? "1 Week" : duration === '2weeks' ? "2 Weeks" : "1 Month",
    totalPosts: count,
    posts
  };
}

export function generateDemoSinglePost(
  industry: string,
  postNumber: number,
  date: string,
  referenceText: string,
  avoidPillars: string[]
): Post {
  const config = industryConfigs[industry] || industryConfigs.realestate;
  const ext = extractContext(referenceText, industry);
  
  // Find a pillar that is NOT in the avoid list to prevent duplicates
  let pillar = config.contentPillars[postNumber % config.contentPillars.length];
  for (const p of config.contentPillars) {
    if (!avoidPillars.includes(p.name)) {
      pillar = p;
      break;
    }
  }

  let caption = "";
  let visualDirection = "";
  let hashtags: string[] = [];

  if (industry === 'realestate') {
    const proj = ext.projectName || "Aurora Crest Residences";
    const loc = ext.location || "Premium City Center";
    const configs = ext.materials?.join(" or ") || "2 & 3 BHK";
    hashtags = ["#RealEstate", `#${proj.replace(/\s+/g, '')}`, "#PropertySpotlight", "#DreamHome"];

    caption = `Elevate your expectations. 🌟 Discover the beautiful collection of ${configs} residences at ${proj}, located in the highly coveted district of ${loc}.\n\nWith world-class craftsmanship and luxurious spaces, we have created an address that you will be proud to call home.\n\nContact us today to schedule your private tour.`;
    visualDirection = `A premium close-up detail shot of the modern bathroom fixtures and luxury marble countertops in the mock apartment of ${proj}.`;
  } 
  else if (industry === 'jewellery') {
    const coll = ext.projectName || "Royal Heritage Bridal Collection";
    const brand = ext.brand || "Aara Fine Jewellery";
    hashtags = ["#LuxuryJewellery", `#${brand.replace(/\s+/g, '')}`, "#Handcrafted", "#FineArtistry"];

    caption = `A sparkling symbol of your finest moments. ✨ Our master artisans spend days detailing every facet of this statement piece from the ${coll}.\n\nDesigned to catch the light and capture the heart, it is the perfect companion for your bridal journey.\n\nExclusively curated by ${brand}. Book your private viewing today.`;
    visualDirection = `An editorial detail shot of a diamond earring shining on a soft white silk cloth background under warm side lighting.`;
  } 
  else if (industry === 'perfume') {
    const perf = ext.productName || "Ambre Nuit Extrait";
    const brand = ext.brand || "Maison de Parfum";
    hashtags = ["#PerfumeNotes", `#${perf.replace(/\s+/g, '')}`, "#SignatureScent", "#NichePerfume"];

    caption = `A fragrant symphony. 🌬️ ${perf} opens with zesty Bergamot before melting into a warm heart of Turkish rose and Indonesian nutmeg. \n\nIt is more than a perfume—it is an olfactory signature that captures your sophistication.\n\nAvailable now at ${brand}.`;
    visualDirection = `A creative macro photo of the heavy gold magnetic cap being snapped onto the perfume bottle, capturing water droplets in high detail.`;
  } 
  else {
    const prod = ext.productName || "CrunchyBites Baked Chips";
    const brand = ext.brand || "NourishFoods Co.";
    hashtags = ["#SnackTime", `#${prod.replace(/\s+/g, '')}`, "#HealthyBites", "#BakedNotFried"];

    caption = `Satisfy your crunchy cravings, the smart way! 😋 Made with a nourishing blend of oats, ragi, and whole wheat, our baked chips are packed with flavor and completely palm-oil free.\n\nGoodness in every bag, baked to absolute perfection by ${brand}.\n\nPick up your pack at your local grocery store today!`;
    visualDirection = `A high-contrast macro photo showing a single baked chip breaking in half with tiny seasoning particles falling off, against a bright orange background.`;
  }

  return {
    postNumber,
    date,
    contentPillar: pillar.name,
    caption,
    visualDirection,
    hashtags
  };
}
export type DemoCalendarGenerator = typeof generateDemoCalendar;
