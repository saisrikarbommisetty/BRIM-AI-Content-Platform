export interface IndustryConfig {
  name: string;
  description: string;
  audience: string[];
  tone: string[];
  vocabulary: string[];
  contentPillars: {
    name: string;
    description: string;
  }[];
  strategy: string[];
  visualStyle: string;
  avoid: string[];
}

export const industryConfigs: Record<string, IndustryConfig> = {
  realestate: {
    name: "Real Estate",
    description: "Property showcasing, buyer education, location spotlights, and lifestyle marketing.",
    audience: [
      "Home buyers",
      "Families looking for residential upgrades",
      "Real estate investors",
      "Property seekers"
    ],
    tone: [
      "Trustworthy",
      "Professional",
      "Aspirational",
      "Clear",
      "Confidence-building"
    ],
    vocabulary: [
      "Configuration",
      "Amenities",
      "Lifestyle upgrade",
      "Investment potential",
      "Property USP",
      "Architectural elegance",
      "Connectivity",
      "Prime location",
      "Spacious layouts",
      "Community living"
    ],
    contentPillars: [
      { name: "Location Spotlight", description: "Focusing on connectivity, neighborhood value, infrastructure, and nearby conveniences." },
      { name: "Property Walkthrough", description: "Highlighting physical layout, space planning, lighting, ventilation, and materials." },
      { name: "Amenities & Lifestyle", description: "Highlighting the clubhouse, gym, swimming pool, landscape gardens, and community vibe." },
      { name: "Investment Perspective", description: "Discussing ROI, capital appreciation, rental yield, developer trust, and market growth." },
      { name: "Buyer Education", description: "Tips on home loans, documentation, property valuation, registration, and vastu/design." },
      { name: "Community Living", description: "Showcasing family moments, senior citizens, safety features, and green ecosystems." }
    ],
    strategy: [
      "Emphasize the physical location USP and connectivity advantages early.",
      "Showcase specific configurations (e.g. 2 & 3 BHK, Penthouse) clearly rather than generic houses.",
      "Link amenities to tangible lifestyle improvements (e.g., 'clubhouse' becomes 'your evening unwinding sanctuary').",
      "Use aspirational calls to action that encourage site visits or booking consultations."
    ],
    visualStyle: "Bright, airy, architectural photography, wide-angle interior shots, elegant renders, drone shots of the locality, clean and modern text overlays, warm lifestyle shots of family moments.",
    avoid: [
      "Do not make unsubstantiated claims about construction timelines or hidden pricing.",
      "Avoid overly aggressive sales pitches; build trust and long-term security instead.",
      "Avoid generic stock images that don't match the property specs."
    ]
  },
  jewellery: {
    name: "Jewellery",
    description: "Luxury craftsmanship, bridal designs, gifting emotions, and premium heritage storytelling.",
    audience: [
      "Jewellery buyers",
      "Brides and grooms",
      "Gift buyers for special occasions",
      "Luxury lifestyle consumers"
    ],
    tone: [
      "Elegant",
      "Luxurious",
      "Emotional",
      "Sophisticated",
      "Aspirational"
    ],
    vocabulary: [
      "Craftsmanship",
      "Artistry",
      "Heritage",
      "Timeless elegance",
      "Materials",
      "Gemstones",
      "Bridal heirloom",
      "Intricate detailing",
      "Ethereal glow",
      "Curation"
    ],
    contentPillars: [
      { name: "Craftsmanship Stories", description: "Diving deep into the making process, karigars, design blueprints, and precision detailing." },
      { name: "Product Spotlight", description: "Showcasing a specific piece—necklace, earrings, bangles—focusing on cut, clarity, and design." },
      { name: "Bridal & Occasion Wear", description: "Styling for weddings, festivals, and grand celebrations, linking pieces to special milestones." },
      { name: "Gifting & Emotions", description: "Focusing on expressions of love, anniversaries, birthday surprises, and family heirlooms." },
      { name: "Heritage & Legacy", description: "Tracing design inspirations, historical influence, royal motifs, and timeless values." },
      { name: "Styling & Fashion Tips", description: "How to pair jewellery with different outfits (sarees, lehengas, western wear) and necklines." }
    ],
    strategy: [
      "Use emotive and descriptive adjectives to highlight the design details.",
      "Position jewellery not just as an accessory, but as an heirloom and emotional milestone.",
      "Focus on the play of light, materials (e.g. 22kt gold, uncut diamonds, emeralds), and hand-finished artistry.",
      "Make the call to action feel exclusive, like scheduling a private viewing or visiting the boutique."
    ],
    visualStyle: "Editorial close-ups, dramatic studio lighting highlighting facets and sparkles, rich textures (velvet, silk backgrounds), classy model portraits, high-contrast gold/platinum reflections, soft focus backgrounds.",
    avoid: [
      "Avoid cheap-looking graphics or loud, cluttered promotional templates.",
      "Do not use casual slang; maintain an elegant, respectful and sophisticated vocabulary.",
      "Do not make false claims about purity; use certified phrasing (e.g. BIS Hallmarked, IGI Certified)."
    ]
  },
  perfume: {
    name: "Perfume / Fragrance",
    description: "Sensory branding, fragrance notes breakdown, mood-driven copy, and evocative storytelling.",
    audience: [
      "Fragrance enthusiasts",
      "Lifestyle consumers",
      "Luxury shoppers",
      "Gift buyers"
    ],
    tone: [
      "Sensory",
      "Sophisticated",
      "Evocative",
      "Premium",
      "Aspirational"
    ],
    vocabulary: [
      "Fragrance notes",
      "Olfactory journey",
      "Sillage",
      "Top, heart, and base notes",
      "Sensory language",
      "Signature scent",
      "Bergamot",
      "Amberwood",
      "Sophisticated blend",
      "Sensual undertones"
    ],
    contentPillars: [
      { name: "Fragrance Notes Breakdown", description: "Deconstructing the perfume hierarchy: fresh top notes, floral/spice heart notes, and deep base notes." },
      { name: "Scent Storytelling", description: "Narrating the mood, memory, or place the fragrance evokes (e.g., Parisian spring morning, midnight breeze)." },
      { name: "Usage & Occasion", description: "Recommending when to wear (day vs. night, summer vs. winter, boardroom vs. date night)." },
      { name: "Personality Match", description: "Linking fragrance profiles to character traits (e.g., bold, elegant, mysterious, fresh)." },
      { name: "Ingredient Spotlight", description: "Highlighting rare, high-quality ingredients like handpicked jasmine, rare oud, or organic patchouli." },
      { name: "Lifestyle & Luxury", description: "Placing the bottle in a premium environment, showcasing it as a vanity statement." }
    ],
    strategy: [
      "Use highly descriptive, sensory language that triggers imaginary smell, touch, and temperature.",
      "Avoid simple statements like 'smells amazing' or 'long-lasting'. Instead, explain *how* it evolves on the skin.",
      "Connect scent with visual and auditory associations (e.g., 'velvety dark rose', 'crisp citrus splash').",
      "Encourage the user to discover their signature scent through a discovery set or boutique visit."
    ],
    visualStyle: "Moody, artistic lighting, glass reflections, water droplets or mist sprays, natural raw ingredients (citrus halves, wooden bark, rose petals) arranged elegantly around the bottle, high fashion aesthetics, cinematic color grading.",
    avoid: [
      "Never use generic descriptions; make the notes feel tangible and artistic.",
      "Avoid static, flat product shots without mood or texture.",
      "Avoid making simple discount-based claims; sell the experience first."
    ]
  },
  food: {
    name: "FMCG — Food",
    description: "Appetizing recipes, quick meals, convenience, family moments, and snacking joy.",
    audience: [
      "Families and parents",
      "Young consumers & students",
      "Working professionals",
      "Everyday grocery shoppers"
    ],
    tone: [
      "Warm",
      "Approachable",
      "Appetizing",
      "Relatable",
      "Energetic"
    ],
    vocabulary: [
      "Delicious",
      "Burst of flavor",
      "Wholesome",
      "Quick and easy",
      "Snack time",
      "Consumption occasions",
      "Family moments",
      "Freshness",
      "Taste bud tickler",
      "Mouth-watering"
    ],
    contentPillars: [
      { name: "Taste & Flavor Explosion", description: "Highlighting texture, spice levels, crunch, and the immediate sensory pleasure of eating." },
      { name: "Convenience & Quick Recipes", description: "How to use the product to make a meal in under 10 minutes for busy days." },
      { name: "Family & Sharing Moments", description: "Focusing on Sunday breakfast, kid's lunchboxes, evening tea, and family bonding over food." },
      { name: "Product Benefits & Nutrition", description: "Stating physical benefits like high protein, real ingredients, no added preservatives, or low sugar." },
      { name: "Snacking & Everyday Occasions", description: "Fitting the product into midnight cravings, post-workout refueling, or office desk snacking." },
      { name: "Festivals & Celebrations", description: "Linking the food item to holidays, parties, get-togethers, and sharing joy." }
    ],
    strategy: [
      "Keep copy warm, direct, and upbeat. Focus on hunger-satisfying triggers.",
      "Describe the texture (e.g. 'crunchy', 'creamy', 'melt-in-the-mouth') alongside the flavor.",
      "Make the product feel like a natural part of daily life and family routines.",
      "Include clear calls to action, encouraging purchase at local supermarkets or online grocery apps."
    ],
    visualStyle: "Vibrant, high-contrast, macro food photography, action shots (cheese pulls, crunching, pouring sauce), happy faces enjoying the food, cozy kitchen setups, bright natural sunlight, clean modern typography overlay.",
    avoid: [
      "Avoid scientific or clinical jargon; keep it accessible and relatable.",
      "Do not show stale or unappealing food arrangements.",
      "Avoid preachy tones; food is about joy, connection, and satisfaction."
    ]
  }
};
