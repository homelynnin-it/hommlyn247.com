import { ServiceItem, ServiceCategory, BrandAdCampaign, PushNotificationCampaign } from '../types';

export interface ServicePresetTemplate {
  id: string;
  category: ServiceCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  tagline: string;
  basePrice: number;
  unit: 'per hr' | 'per visit' | 'per meal' | 'per day' | 'per month';
  badge: string;
  eta: string;
  rating: number;
  reviewsCount: number;
  availableCount: number;
  iconName: string;
  imageUrl: string;
  popular: boolean;
  equipmentProvided: boolean;
  includedHighlights: string[];
  tasks: Array<{
    id: string;
    name: string;
    priceDelta: number;
    description?: string;
    defaultChecked?: boolean;
  }>;
}

export const SERVICE_PRESET_TEMPLATES: ServicePresetTemplate[] = [
  {
    id: 'preset-maid',
    category: 'maid',
    categoryLabel: 'House Maid & Cleaning',
    title: 'House Help & Maid',
    subtitle: 'Floor brooming, wet mopping, kitchen sink utensils & dusting',
    tagline: 'Police-verified helper at your doorstep in 15 mins',
    basePrice: 199,
    unit: 'per hr',
    badge: '15 Min Express',
    eta: '12-15 mins',
    rating: 4.89,
    reviewsCount: 3840,
    availableCount: 16,
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      'Full floor brooming & hygienic microfiber wet mopping',
      'Sink utensils washing with gentle dish-bar',
      'Living room furniture & tabletop dusting',
      'Trash bag clearance & waste bin sanitization',
      'Verified Aadhaar KYC & uniform apron-equipped'
    ],
    tasks: [
      { id: 't-sweep-mop', name: 'Floor Brooming & Wet Mopping', priceDelta: 0, defaultChecked: true, description: 'Living room, bedrooms & hallways' },
      { id: 't-dishes', name: 'Sink Utensil Washing & Drying', priceDelta: 49, defaultChecked: true, description: 'Up to 25 plates/cookware items' },
      { id: 't-dusting', name: 'Furniture & Appliance Dusting', priceDelta: 39, defaultChecked: true, description: 'TV unit, dining table & bookshelves' },
      { id: 't-bathroom-scrub', name: 'Bathroom Tiles & Toilet Quick Scrub', priceDelta: 79, defaultChecked: false, description: 'Floor tiles descaling & toilet bowl clean' },
      { id: 't-balcony-wash', name: 'Balcony Washing & Railing Wipe', priceDelta: 49, defaultChecked: false, description: 'Dust removal & wet wash' },
      { id: 't-ironing', name: 'Garment Steam Ironing (5 pieces)', priceDelta: 59, defaultChecked: false, description: 'Shirts, kurtas, trousers' }
    ]
  },
  {
    id: 'preset-cook',
    category: 'cook',
    categoryLabel: 'Home Cook & Chef',
    title: 'Experienced Home Cook',
    subtitle: 'Fresh North/South Indian meals, rotis, sabzi, dal & healthy breakfast',
    tagline: 'Custom dietary recipes tailored to your taste & spice level',
    basePrice: 249,
    unit: 'per meal',
    badge: 'Hygiene Certified',
    eta: '15-20 mins',
    rating: 4.92,
    reviewsCount: 2910,
    availableCount: 12,
    iconName: 'Utensils',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600',
    popular: true,
    equipmentProvided: false,
    includedHighlights: [
      'Fresh cooking tailored to family spice & oil preferences',
      'Soft phulkas / chapatis rolling & fresh cooking',
      'Post-cooking kitchen platform & gas stove wiping',
      'Food safety & apron hygiene compliance'
    ],
    tasks: [
      { id: 't-standard-meal', name: 'Standard 2-Dish Meal + Rotis/Rice', priceDelta: 0, defaultChecked: true, description: '1 dry sabzi + 1 dal/gravy + 8 rotis' },
      { id: 't-extra-dish', name: 'Special Additional Dish or Gravy', priceDelta: 79, defaultChecked: false, description: 'Paneer butter masala, chicken curry, or biryani' },
      { id: 't-breakfast-prep', name: 'Morning Breakfast & Fresh Chutney', priceDelta: 89, defaultChecked: false, description: 'Idli, dosa batter, poha or parathas' },
      { id: 't-kitchen-deepclean', name: 'Post-Meal Chimney & Tile Grease Clean', priceDelta: 69, defaultChecked: false, description: 'Oil stain and counter deep wipe' }
    ]
  },
  {
    id: 'preset-nanny',
    category: 'nanny',
    categoryLabel: 'Babysitter & Childcare',
    title: 'Nanny & Babysitter',
    subtitle: 'Loving, patient childcare, feeding assistance, playful engagement & safety',
    tagline: 'Background-verified caregivers certified in infant first-aid',
    basePrice: 299,
    unit: 'per hr',
    badge: 'Police Verified',
    eta: '15-20 mins',
    rating: 4.94,
    reviewsCount: 1420,
    availableCount: 8,
    iconName: 'HeartHandshake',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600',
    popular: false,
    equipmentProvided: false,
    includedHighlights: [
      'Continuous vigilant supervision & safe indoor play',
      'Child meal assistance & milk bottle sanitization',
      'Bedtime story reading & gentle nap settling',
      'Zero screen-time engaging motor skill activities'
    ],
    tasks: [
      { id: 't-care-hourly', name: 'Active Childcare & Play Oversight', priceDelta: 0, defaultChecked: true, description: 'Supervised playtime, crafts & learning' },
      { id: 't-feeding', name: 'Kids Meal Preparation & Feeding', priceDelta: 49, defaultChecked: false, description: 'Purees, khichdi or finger foods' },
      { id: 't-bath-groom', name: 'Baby Bathing & Clothes Change', priceDelta: 69, defaultChecked: false, description: 'Warm water bath & diaper care' }
    ]
  },
  {
    id: 'preset-driver',
    category: 'driver',
    categoryLabel: 'Private Chauffeur',
    title: 'Private Chauffeur & Driver',
    subtitle: 'Hourly city driving, airport drops, office commutes & outstation trips',
    tagline: 'Commercial badge drivers tested on automatic & manual transmissions',
    basePrice: 299,
    unit: 'per hr',
    badge: 'Verified License',
    eta: '12-15 mins',
    rating: 4.87,
    reviewsCount: 1840,
    availableCount: 10,
    iconName: 'Car',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600',
    popular: false,
    equipmentProvided: false,
    includedHighlights: [
      'Commercial driving badge & clean RTO record verification',
      'Familiar with luxury sedans, SUVs & EVs',
      'Real-time GPS routing with traffic avoidance',
      'Polite, suited chauffeur etiquette'
    ],
    tasks: [
      { id: 't-city-drive', name: 'Bangalore City Transit / Shopping Drive', priceDelta: 0, defaultChecked: true, description: 'Smooth driving through peak city traffic' },
      { id: 't-airport-trip', name: 'KIA Airport Expressway Drop / Pickup', priceDelta: 149, defaultChecked: false, description: 'Luggage handling & toll queue clearance' },
      { id: 't-night-drive', name: 'Late Night Return Drive (Safe & Sober)', priceDelta: 99, defaultChecked: false, description: 'After 10 PM safe transit to your doorstep' }
    ]
  },
  {
    id: 'preset-eldercare',
    category: 'eldercare',
    categoryLabel: 'Eldercare Assistant',
    title: 'Senior Companion & Eldercare',
    subtitle: 'Mobility support, medicine reminders, BP/Sugar tracking & walking companion',
    tagline: 'Empathetic companions dedicated to senior citizen comfort',
    basePrice: 349,
    unit: 'per hr',
    badge: 'Compassionate Care',
    eta: '20-25 mins',
    rating: 4.96,
    reviewsCount: 960,
    availableCount: 6,
    iconName: 'Shield',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600',
    popular: false,
    equipmentProvided: false,
    includedHighlights: [
      'Assisted gentle walking & posture transfer support',
      'Timely medicine dispensing as prescribed by doctor',
      'Daily vitals monitoring (Oximeter, BP, Pulse)',
      'Warm conversation, newspaper reading & mental comfort'
    ],
    tasks: [
      { id: 't-elder-companion', name: 'Daily Living Support & Companionship', priceDelta: 0, defaultChecked: true, description: 'Vigilant accompaniment and emotional support' },
      { id: 't-vitals-log', name: 'Vitals Health Record Logging', priceDelta: 49, defaultChecked: true, description: 'Logged on app for family tracking' },
      { id: 't-physio-walk', name: 'Assisted Park Walk & Light Exercise', priceDelta: 69, defaultChecked: false, description: 'Gentle mobility stretching' }
    ]
  },
  {
    id: 'preset-electrician',
    category: 'electrician',
    categoryLabel: 'Certified Electrician',
    title: 'Electrical Repair & Installation',
    subtitle: 'Ceiling fans, switchboards, MCB trips, inverter repairs & chandeliers',
    tagline: 'ITI-certified technicians equipped with multi-meters & safety gear',
    basePrice: 149,
    unit: 'per visit',
    badge: 'Govt Certified',
    eta: '12-15 mins',
    rating: 4.88,
    reviewsCount: 3120,
    availableCount: 15,
    iconName: 'Zap',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      'Comprehensive wiring diagnosis & short-circuit check',
      'Insulated 1000V industrial safety tools',
      'Transparent rate card before part replacement',
      '30-day post-service warranty'
    ],
    tasks: [
      { id: 't-fan-switch', name: 'Fan / Switchboard / Light Fitting', priceDelta: 0, defaultChecked: true, description: 'Fix humming fan, regulator or loose sockets' },
      { id: 't-mcb-tripping', name: 'MCB Trip & Voltage Leakage Diagnosis', priceDelta: 99, defaultChecked: false, description: 'Distribution box circuit breaker fix' },
      { id: 't-geyser-repair', name: 'Water Heater / Geyser Element Fix', priceDelta: 149, defaultChecked: false, description: 'Thermostat replacement & heating check' }
    ]
  },
  {
    id: 'preset-plumber',
    category: 'plumber',
    categoryLabel: 'Certified Plumber',
    title: 'Plumbing & Leakage Specialist',
    subtitle: 'Tap drippings, bathroom flush leaks, pipeline blocks & RO installs',
    tagline: 'Zero-mess plumbing with heavy duty pipe wrenches & sealants',
    basePrice: 149,
    unit: 'per visit',
    badge: 'Fast Resolution',
    eta: '12-15 mins',
    rating: 4.85,
    reviewsCount: 2740,
    availableCount: 14,
    iconName: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      'Non-destructive acoustic leak finding',
      'Teflon sealant & O-ring gasket renewals',
      'Drain declogging with motorized spiral cable',
      'Clean post-work bathroom floor wipe'
    ],
    tasks: [
      { id: 't-tap-leak', name: 'Tap Cartridge / Spindle Replacement', priceDelta: 0, defaultChecked: true, description: 'Stop constant dripping and washer leaks' },
      { id: 't-flush-tank', name: 'Flush Tank Syphon & Float Valve Repair', priceDelta: 89, defaultChecked: false, description: 'Fix continuous cistern running water' },
      { id: 't-drain-block', name: 'Kitchen Sink / Bathroom Drain Unclog', priceDelta: 119, defaultChecked: false, description: 'Remove hair, grease & food waste blockage' }
    ]
  },
  {
    id: 'preset-carpenter',
    category: 'carpenter',
    categoryLabel: 'Carpenter & Handyman',
    title: 'Furniture & Carpentry Repair',
    subtitle: 'Door lock renewals, hydraulic cabinet hinges, IKEA assembly & drill work',
    tagline: 'Precision laser-level alignment with heavy duty drill bits',
    basePrice: 179,
    unit: 'per visit',
    badge: 'Tool Equipped',
    eta: '15-20 mins',
    rating: 4.84,
    reviewsCount: 1980,
    availableCount: 9,
    iconName: 'Hammer',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    popular: false,
    equipmentProvided: true,
    includedHighlights: [
      'Bosch industrial hammer drill & screw driver sets',
      'Hydraulic soft-close hinges installation',
      'Godrej / Yale mortise lock replacement',
      'Curtain rods & wall art mounting'
    ],
    tasks: [
      { id: 't-hinge-lock', name: 'Cabinet Hinge / Main Door Lock Tuning', priceDelta: 0, defaultChecked: true, description: 'Fix creaking doors or misaligned cabinets' },
      { id: 't-wall-drilling', name: 'Wall Mount Drilling (Up to 4 Holes)', priceDelta: 79, defaultChecked: false, description: 'Mirrors, paintings, wall shelves' },
      { id: 't-furniture-assembly', name: 'Flatpack Furniture / Bed Assembly', priceDelta: 249, defaultChecked: false, description: 'IKEA/Amazon wardrobe, study table or bed' }
    ]
  },
  {
    id: 'preset-deepclean',
    category: 'deep_clean',
    categoryLabel: 'Deep House Scrubbing',
    title: 'Deep House Scrubbing & Sanitization',
    subtitle: '2-member crew, single-disc floor scrubbers, acid-free tile descaling & balcony wash',
    tagline: 'Hospital-grade sanitized home transformation in 3 hours',
    basePrice: 999,
    unit: 'per visit',
    badge: 'Pro Equipment',
    eta: '30-45 mins',
    rating: 4.97,
    reviewsCount: 4210,
    availableCount: 7,
    iconName: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      '2-person trained deep cleaning brigade',
      'Industrial single-disc rotary machine scrubbing',
      'Bathroom hard-water scale & yellow stain removal',
      'Kitchen chimney, cabinets & tile degreasing',
      'Hospital grade germicidal sanitization spray'
    ],
    tasks: [
      { id: 't-bathrooms-deep', name: '2 Bathrooms Full Scrub & Descaling', priceDelta: 0, defaultChecked: true, description: 'Acid-free tile scrubbing, tap buffing & mirrors' },
      { id: 't-kitchen-deep', name: 'Kitchen Degreasing & Cabinet Interior', priceDelta: 299, defaultChecked: true, description: 'Exhaust fan, slab, cabinets and oil removal' },
      { id: 't-balcony-deep', name: 'Balconies Jet Wash & Glass Panes', priceDelta: 199, defaultChecked: false, description: 'High pressure wash and glass streak wipe' }
    ]
  },
  {
    id: 'preset-pestcontrol',
    category: 'pestcontrol',
    categoryLabel: 'Pest Control & Sanitization',
    title: 'Pest Control & Bedbug Shield',
    subtitle: 'Odorless Bayer gel treatment for cockroaches, ants & termites',
    tagline: 'Eco-safe, child & pet friendly herbal pest control',
    basePrice: 299,
    unit: 'per visit',
    badge: '100% Odorless',
    eta: '30 mins',
    rating: 4.91,
    reviewsCount: 1420,
    availableCount: 8,
    iconName: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&q=80&w=600',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      'Govt-certified Bayer & herbal formulation gel',
      'No need to empty kitchen cabinets or vacate home',
      'Anti-microbial drain & trap treatment included',
      '90-Day re-treatment guarantee'
    ],
    tasks: [
      { id: 't-cockroach-gel', name: 'Kitchen & Bathroom Odorless Gel Dotting', priceDelta: 0, defaultChecked: true, description: 'Sink pipe, cabinets, fridge motor area' },
      { id: 't-drain-cleanse', name: 'Bio-Enzymatic Drain Fly & Insect Flush', priceDelta: 69, defaultChecked: true, description: 'Disinfect floor traps and kitchen pipes' },
      { id: 't-bedbug-steam', name: 'Mattress & Bed High-Heat Steam Flush', priceDelta: 249, defaultChecked: false, description: 'Eradicate bedbugs from mattress seams & frames' }
    ]
  },
  {
    id: 'preset-gardener',
    category: 'gardener',
    categoryLabel: 'Gardener & Terrace Care',
    title: 'Gardener & Lawn Care Specialist',
    subtitle: 'Balcony plants potting, lawn trimming, organic soil nourishment',
    tagline: 'Transform your urban balcony or terrace into a thriving oasis',
    basePrice: 199,
    unit: 'per hr',
    badge: 'Green Thumb',
    eta: '25 mins',
    rating: 4.88,
    reviewsCount: 910,
    availableCount: 6,
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1599685315640-9ceab2f58944?auto=format&fit=crop&q=80&w=600',
    popular: false,
    equipmentProvided: true,
    includedHighlights: [
      'Bonsai, succulent & flowering plant pruning',
      'Vermicompost & neem-oil organic pest spray',
      'Repotting with enriched cocopeat & soil mix',
      'Seasonal flowering guidance & drip care'
    ],
    tasks: [
      { id: 't-pruning-weeding', name: 'Plant Weeding, Trimming & Dead Leaf Cut', priceDelta: 0, defaultChecked: true, description: 'Balcony, indoor pots and terrace plants' },
      { id: 't-fertilizer-mix', name: 'Organic Vermicompost & Soil Nourishment', priceDelta: 80, defaultChecked: true, description: 'Root feeding with organic nutrients' },
      { id: 't-repotting', name: 'Repotting in New Ceramic/Clay Pots (5 Pots)', priceDelta: 120, defaultChecked: false, description: 'Cocopeat & nutrient-dense potting mix' }
    ]
  },
  {
    id: 'preset-painter',
    category: 'painter',
    categoryLabel: 'Wall Painting & Waterproofing',
    title: 'Painter & Wall Touch-Up Pro',
    subtitle: 'Water leakage patch, drill-hole touchup, accent wall & room painting',
    tagline: 'Dust-free Asian Paints & Berger certified painters',
    basePrice: 249,
    unit: 'per hr',
    badge: 'Dust-Free Rollers',
    eta: '35 mins',
    rating: 4.87,
    reviewsCount: 780,
    availableCount: 5,
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600',
    popular: false,
    equipmentProvided: true,
    includedHighlights: [
      'Drop cloth & masking tape protection for furniture',
      'Putty filling for wall cracks, nail holes & peeling plaster',
      'Two coats of premium low-VOC emulsion paint',
      'Post-painting floor scrubbing and clean delivery'
    ],
    tasks: [
      { id: 't-crack-putty', name: 'Wall Crack & Nail Hole Putty Touchup', priceDelta: 0, defaultChecked: true, description: 'Smooth wall putty sanding and primer' },
      { id: 't-accent-wall', name: 'Single Accent Wall Designer Texture/Color', priceDelta: 350, defaultChecked: false, description: 'Royale texture or contrast bedroom wall' },
      { id: 't-waterproof-primer', name: 'Anti-Damp Waterproofing Primer Coat', priceDelta: 200, defaultChecked: false, description: 'Stops water marks and paint flaking' }
    ]
  }
];

// Initial Brand Partner Advertising Campaigns (MongoDB Compatible)
export const INITIAL_BRAND_ADS: BrandAdCampaign[] = [
  {
    id: 'ad-lizol-disinfectant',
    brandName: 'Lizol India',
    brandLogoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=150',
    campaignTitle: '10x Better Floor Germ Protection',
    tagline: 'Recommended by hommlyn247 Verified Maids across 120+ Gated Societies',
    bannerImageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    placement: 'hero_home',
    targetCategory: 'maid',
    badgeText: 'Official Hygiene Partner',
    ctaText: 'Claim Flat ₹40 Lizol Kit with Maid Order',
    ctaUrlOrAction: '/services?category=maid',
    impressionsCount: 24810,
    clicksCount: 3120,
    sponsorContributionAmount: 75000,
    active: true,
    startDate: '2026-03-01',
    endDate: '2026-06-30'
  },
  {
    id: 'ad-philips-airfryer',
    brandName: 'Philips Kitchen Appliances',
    brandLogoUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=150',
    campaignTitle: '90% Less Oil Cooking with Certified Chefs',
    tagline: 'Book our home cooks trained on Philips Digital Air Fryer recipes',
    bannerImageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
    placement: 'service_category',
    targetCategory: 'cook',
    badgeText: 'Healthy Living Sponsor',
    ctaText: 'Book Cook & Get Free Airfryer Demo',
    ctaUrlOrAction: '/services?category=cook',
    impressionsCount: 18450,
    clicksCount: 2190,
    sponsorContributionAmount: 90000,
    active: true,
    startDate: '2026-03-10',
    endDate: '2026-05-15'
  },
  {
    id: 'ad-tata-sampann',
    brandName: 'Tata Sampann',
    brandLogoUrl: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=150',
    campaignTitle: 'Unpolished Dals & Natural Protein Meals',
    tagline: 'Freshly prepared everyday by verified hommlyn247 chefs',
    bannerImageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    placement: 'checkout_upsell',
    targetCategory: 'cook',
    badgeText: 'Purity Guaranteed',
    ctaText: 'Explore Tata Sampann Chef Specials',
    ctaUrlOrAction: '/services?category=cook',
    impressionsCount: 14200,
    clicksCount: 1870,
    sponsorContributionAmount: 60000,
    active: true,
    startDate: '2026-03-01',
    endDate: '2026-04-30'
  },
  {
    id: 'ad-havells-lighting',
    brandName: 'Havells Professional',
    brandLogoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=150',
    campaignTitle: 'Surge-Proof MCB & Smart Switches',
    tagline: 'Installed in 15 mins by hommlyn247 ITI-Certified Electricians',
    bannerImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    placement: 'service_category',
    targetCategory: 'electrician',
    badgeText: 'Verified Electrical Hardware',
    ctaText: 'Book Electrician with Havells Kit',
    ctaUrlOrAction: '/services?category=electrician',
    impressionsCount: 11900,
    clicksCount: 1340,
    sponsorContributionAmount: 45000,
    active: true,
    startDate: '2026-03-05',
    endDate: '2026-06-01'
  }
];

// Initial Push Notification Broadcast Campaigns (MongoDB Compatible)
export const INITIAL_PUSH_CAMPAIGNS: PushNotificationCampaign[] = [
  {
    id: 'push-monsoon-alert',
    title: '🌧️ Monsoon Floor Dusting & Drying Special',
    body: 'Rainy muddy footprints? 15-min express house help arrives with microfiber mops and hospital-grade sanitizers.',
    targetAudience: 'all_residents',
    promoCode: 'CLEAN50',
    discountValue: 50,
    actionUrl: '/services?category=maid',
    sentAt: 'Yesterday, 04:30 PM',
    sentCount: 3840,
    openedCount: 1536,
    clickedCount: 461,
    icon: 'Sparkles',
    urgency: 'high',
    status: 'delivered'
  },
  {
    id: 'push-weekend-chef',
    title: '🍲 Weekend Chef Express Arrival in 15 Mins',
    body: 'Piping hot phulkas, fresh paneer & authentic biryani cooked right in your kitchen. Use code TASTE20 for 20% off.',
    targetAudience: 'all_residents',
    promoCode: 'TASTE20',
    discountValue: 100,
    actionUrl: '/services?category=cook',
    sentAt: 'Saturday, 10:15 AM',
    sentCount: 4120,
    openedCount: 1854,
    clickedCount: 618,
    icon: 'Utensils',
    urgency: 'high',
    status: 'delivered'
  },
  {
    id: 'push-society-prestige',
    title: '🏢 Prestige & Sobha Residents Exclusive: Flat ₹100 Off',
    body: 'Dedicated hommlyn247 station at your club gate. Zero waiting dispatch for maids, cooks and drivers.',
    targetAudience: 'prestige_shantiniketan',
    promoCode: 'SOCIETY100',
    discountValue: 100,
    actionUrl: '/services',
    sentAt: '3 days ago',
    sentCount: 1890,
    openedCount: 945,
    clickedCount: 378,
    icon: 'Shield',
    urgency: 'normal',
    status: 'delivered'
  }
];
