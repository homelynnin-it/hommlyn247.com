import { ServiceItem } from '../../src/types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-snabbit-express',
    category: 'maid',
    title: 'Express 15-Min Quick Chores',
    subtitle: 'Ultra-fast dispatch for dishwashing, kitchen prep, ironing & room tidy',
    tagline: 'Snabbit-speed doorstep helper in 10-15 mins',
    basePrice: 149,
    unit: 'per hr',
    badge: '⚡ 15 Min Arrival',
    eta: '10-15 mins',
    rating: 4.96,
    reviewsCount: 4210,
    availableCount: 18,
    iconName: 'Sparkles',
    imageUrl: '/src/assets/images/homeelynn_maid_clean_1788855102529.jpg',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      '10 to 15-minute guaranteed doorstep arrival',
      'Quick sink utensil clearance & dish scrub',
      'Vegetable chopping, dough kneading & salad prep',
      'Wardrobe ironing & garment fold (up to 10 pcs)'
    ],
    tasks: [
      { id: 't-snabbit-dishes', name: 'Express Sink & Dish Clearance', priceDelta: 0, defaultChecked: true },
      { id: 't-snabbit-prep', name: 'Kitchen Veggie Chopping & Prep', priceDelta: 39, defaultChecked: true },
      { id: 't-snabbit-mop', name: 'Quick Room Broom & Wet Mop', priceDelta: 49, defaultChecked: false },
      { id: 't-snabbit-iron', name: 'Express Ironing (10 Garments)', priceDelta: 59, defaultChecked: false },
      { id: 't-snabbit-bathroom', name: 'Express Bathroom Scrub & Wash', priceDelta: 69, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Hourly On-Demand',
        price: 149,
        unit: '/ hour',
        durationText: '1 - 4 Hours',
        description: 'Instant 15-min dispatch for rapid home chores & quick relief',
        popular: true,
        savingsBadge: '⚡ 15 Min Quick'
      },
      {
        type: 'daily',
        label: 'Full Day Pass',
        price: 799,
        unit: '/ day',
        durationText: '8 Hours Full Day',
        description: 'Dedicated helper for party hosting, deep cleaning & full-day chores',
        savingsBadge: 'Save 35%'
      },
      {
        type: 'monthly',
        label: 'Monthly CarePlan',
        price: 3999,
        unit: '/ month',
        durationText: '30 Days (Daily 1-Hr Visit)',
        description: 'Assured daily domestic help with free replacement staff guarantee',
        savingsBadge: 'Best Value'
      }
    ]
  },
  {
    id: 'srv-maid-hourly',
    category: 'maid',
    title: 'House Help & Maid',
    subtitle: 'Sweeping, mopping, utensil cleaning & dusting',
    tagline: 'Helper at your doorstep in 15 mins',
    basePrice: 199,
    unit: 'per hr',
    badge: 'Popular Choice',
    eta: '12-15 mins',
    rating: 4.89,
    reviewsCount: 3840,
    availableCount: 14,
    iconName: 'Sparkles',
    imageUrl: '/src/assets/images/homeelynn_maid_clean_1788855102529.jpg',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      'Full floor sweeping & wet mopping',
      'Utensils sink cleaning & dishwashing',
      'Surface dusting & trash disposal',
      'Hygiene verified & apron-equipped'
    ],
    tasks: [
      { id: 't-sweep-mop', name: 'Floor Brooming & Mopping', priceDelta: 0, defaultChecked: true },
      { id: 't-dishes', name: 'Sink Utensil Washing', priceDelta: 49, defaultChecked: true },
      { id: 't-dusting', name: 'Furniture & Appliance Dusting', priceDelta: 39, defaultChecked: true },
      { id: 't-bathroom', name: 'Bathroom Quick Scrub', priceDelta: 79, defaultChecked: false },
      { id: 't-balcony', name: 'Balcony Washing', priceDelta: 49, defaultChecked: false },
      { id: 't-ironing', name: 'Clothes Ironing (5 garments)', priceDelta: 59, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Hourly On-Demand',
        price: 199,
        unit: '/ hour',
        durationText: 'Flexible 1-4 Hours',
        description: 'Pay as you go for instant housecleaning & dishwashing',
        popular: true,
        savingsBadge: 'Instant 15m'
      },
      {
        type: 'daily',
        label: 'Full Day Pass',
        price: 949,
        unit: '/ day',
        durationText: '8 Hours Shift',
        description: 'Complete day support for intensive household chores & festival prep',
        savingsBadge: 'Save 40%'
      },
      {
        type: 'monthly',
        label: 'Monthly Subscription',
        price: 4999,
        unit: '/ month',
        durationText: '30 Days Recurring',
        description: 'Fixed daily domestic assistant with replacement guarantee CarePlan',
        savingsBadge: 'Staff Warranty'
      }
    ]
  },
  {
    id: 'srv-cook-fresh',
    category: 'cook',
    title: 'Home Cook & Chef',
    subtitle: 'Fresh hot breakfast, lunch or dinner in your kitchen',
    tagline: 'Cooks as per your family taste & oil preference',
    basePrice: 249,
    unit: 'per visit',
    badge: 'Custom Taste',
    eta: '20-25 mins',
    rating: 4.92,
    reviewsCount: 2910,
    availableCount: 9,
    iconName: 'Utensils',
    imageUrl: '/src/assets/images/homeelynn_cook_chef_1788855127504.jpg',
    popular: true,
    equipmentProvided: false,
    includedHighlights: [
      'Prepares 1-2 vegetable/curry dishes & daal',
      'Soft phulkas / chapatis / parathas',
      'Rice / Pulao preparation',
      'Post-cooking kitchen counter wipe'
    ],
    tasks: [
      { id: 't-lunch-dinner', name: 'Full Meal (Sabzi, Dal, Rice)', priceDelta: 0, defaultChecked: true },
      { id: 't-rotis', name: 'Phulkas / Rotis (Up to 15 pcs)', priceDelta: 49, defaultChecked: true },
      { id: 't-salad-raita', name: 'Fresh Salad & Tadka Raita', priceDelta: 29, defaultChecked: false },
      { id: 't-special-nonveg', name: 'Chicken / Fish / Egg Curry Special', priceDelta: 89, defaultChecked: false },
      { id: 't-snacks', name: 'Evening Chai & Snacks', priceDelta: 49, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Per Meal / 2 Hours',
        price: 249,
        unit: '/ meal',
        durationText: 'Single Fresh Meal',
        description: 'Fresh lunch or dinner cooked on-demand with customized spices',
        popular: true,
        savingsBadge: 'Instant Cook'
      },
      {
        type: 'daily',
        label: 'Full Day Cook Pass',
        price: 1199,
        unit: '/ day',
        durationText: 'Breakfast + Lunch + Dinner (3 Meals)',
        description: 'Dedicated in-home chef for full day family meals & guest hosting',
        savingsBadge: 'All 3 Meals'
      },
      {
        type: 'monthly',
        label: 'Monthly Cook Plan',
        price: 6999,
        unit: '/ month',
        durationText: '30 Days (2 Meals/Day)',
        description: 'Fixed daily home cook with taste adjustment & replacement warranty',
        savingsBadge: 'CarePlan Protected'
      }
    ]
  },
  {
    id: 'srv-kitchen-prep-cook',
    category: 'cook',
    title: 'Kitchen Prep & Roti Maker',
    subtitle: 'Phulkas, vegetable chopping, meal mise en place & packing',
    tagline: 'Quick 30-min kitchen helper for working professionals',
    basePrice: 179,
    unit: 'per hr',
    badge: 'Quick Prep',
    eta: '15 mins',
    rating: 4.94,
    reviewsCount: 1850,
    availableCount: 11,
    iconName: 'Utensils',
    imageUrl: '/src/assets/images/homeelynn_cook_chef_1788855127504.jpg',
    popular: false,
    equipmentProvided: false,
    includedHighlights: [
      '20-30 fresh soft phulkas or parathas',
      'Finely chopped vegetables for curries & salads',
      'Atta dough kneading and batter prep',
      'Office lunchbox packing'
    ],
    tasks: [
      { id: 't-phulkas-stack', name: '25 Fresh Phulkas / Chapatis', priceDelta: 0, defaultChecked: true },
      { id: 't-veggie-prep', name: 'Vegetable Peeling & Chopping', priceDelta: 39, defaultChecked: true },
      { id: 't-lunchbox-pack', name: 'Lunchbox Packing & Clean Up', priceDelta: 29, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Hourly Express Prep',
        price: 179,
        unit: '/ hour',
        durationText: '1 - 2 Hours',
        description: 'Quick morning or evening kitchen prep before office',
        popular: true,
        savingsBadge: '30-Min Fast'
      },
      {
        type: 'daily',
        label: 'Day Prep Pass (2 Visits)',
        price: 549,
        unit: '/ day',
        durationText: 'Morning + Evening Visits',
        description: 'Roti & salad prep for both lunch & dinner schedules',
        savingsBadge: 'Save 30%'
      },
      {
        type: 'monthly',
        label: 'Monthly Daily Roti Pack',
        price: 3499,
        unit: '/ month',
        durationText: '30 Days Daily Prep',
        description: 'Consistent daily fresh rotis & salad chopping at your fixed time',
        savingsBadge: 'Popular'
      }
    ]
  },
  {
    id: 'srv-eldercare-compassion',
    category: 'eldercare',
    title: 'Elderly Companion & Care',
    subtitle: 'Assistance with medicines, mobility, evening walks & gentle companionship',
    tagline: 'Certified empathetic carers with basic medical awareness',
    basePrice: 249,
    unit: 'per hr',
    badge: 'Gentle Care',
    eta: '25-30 mins',
    rating: 4.98,
    reviewsCount: 1240,
    availableCount: 7,
    iconName: 'HeartHandshake',
    imageUrl: '/src/assets/images/homeelynn_family_care_1788855314855.jpg',
    popular: true,
    equipmentProvided: false,
    includedHighlights: [
      'Timely medication reminders & water hydration',
      'Assisted walking, exercises & park companionship',
      'Doctor appointment escort & hospital visit support',
      'Daily vitals logging (BP & Sugar monitoring)'
    ],
    tasks: [
      { id: 't-elder-companion', name: 'Companionship & Conversation', priceDelta: 0, defaultChecked: true },
      { id: 't-elder-mobility', name: 'Mobility & Park Walk Escort', priceDelta: 49, defaultChecked: true },
      { id: 't-elder-vitals', name: 'Vitals & Medicine Schedule Log', priceDelta: 39, defaultChecked: false },
      { id: 't-elder-bath', name: 'Grooming & Sponge Bath Support', priceDelta: 79, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Hourly Support',
        price: 249,
        unit: '/ hour',
        durationText: '2 - 4 Hours',
        description: 'Flexible accompaniment for doctor appointments or errands',
        popular: true,
        savingsBadge: 'Flexible'
      },
      {
        type: 'daily',
        label: 'Full Day Care (10 Hrs)',
        price: 1199,
        unit: '/ day',
        durationText: '10-Hour Day Shift',
        description: 'Full daytime dedicated elderly care while family is at work',
        savingsBadge: 'Save 45%'
      },
      {
        type: 'monthly',
        label: 'Monthly Dedicated Carer',
        price: 17999,
        unit: '/ month',
        durationText: '30 Days (10-12 Hrs Daily)',
        description: 'Continuous trusted elder companion with CarePlan staff replacement',
        savingsBadge: 'Assured Replacement'
      }
    ]
  },
  {
    id: 'srv-nanny-care',
    category: 'nanny',
    title: 'Trained Nanny & Babysitter',
    subtitle: 'Gentle, verified care for infants, toddlers & young kids',
    tagline: 'Peace of mind with pediatric first-aid trained carers',
    basePrice: 349,
    unit: 'per hr',
    badge: 'Child-Safe Verified',
    eta: '30 mins',
    rating: 4.98,
    reviewsCount: 1650,
    availableCount: 6,
    iconName: 'HeartHandshake',
    imageUrl: '/src/assets/images/homeelynn_nanny_1788855219011.jpg',
    popular: true,
    equipmentProvided: false,
    includedHighlights: [
      'Infant feeding, burping & diaper changing',
      'Storytelling, interactive games & learning',
      'Baby food prep & utensil sanitization',
      'Live photo/video updates to parents'
    ],
    tasks: [
      { id: 't-toddler-care', name: 'Toddler Engagement & Supervision', priceDelta: 0, defaultChecked: true },
      { id: 't-infant-feed', name: 'Infant Feeding & Bath Assistance', priceDelta: 60, defaultChecked: false },
      { id: 't-nap-routine', name: 'Bedtime / Naptime Sleep Routine', priceDelta: 40, defaultChecked: false },
      { id: 't-homework-help', name: 'Primary School Homework Support', priceDelta: 50, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Hourly Babysitting',
        price: 349,
        unit: '/ hour',
        durationText: '2 - 6 Hours',
        description: 'Emergency date night or meeting babysitting with verified nanny',
        popular: true,
        savingsBadge: 'On-Demand'
      },
      {
        type: 'daily',
        label: 'Full Day Childcare (8 Hrs)',
        price: 1399,
        unit: '/ day',
        durationText: '8-Hour Work Shift',
        description: 'Full day attentive child supervision, feeding & educational play',
        savingsBadge: 'Save 40%'
      },
      {
        type: 'monthly',
        label: 'Monthly Professional Nanny',
        price: 19999,
        unit: '/ month',
        durationText: '30 Days Recurring',
        description: 'Dedicated maternal/child specialist with comprehensive CarePlan backup',
        savingsBadge: 'CarePlan Protected'
      }
    ]
  },
  {
    id: 'srv-driver-hourly',
    category: 'driver',
    title: 'On-Demand Chauffeur / Driver',
    subtitle: 'Drive your personal car for office, party or shopping',
    tagline: 'Skilled drivers for manual & automatic vehicles',
    basePrice: 299,
    unit: 'per hr',
    badge: 'Verified DL',
    eta: '25-30 mins',
    rating: 4.95,
    reviewsCount: 1980,
    availableCount: 6,
    iconName: 'Car',
    imageUrl: '/src/assets/images/homeelynn_driver_1788855203822.jpg',
    popular: false,
    equipmentProvided: false,
    includedHighlights: [
      'Commercial DL & police background verified',
      'Familiar with luxury & automatic cars',
      'Traffic savvy city navigation',
      'Punctual & courteous etiquette'
    ],
    tasks: [
      { id: 't-city-drive', name: 'City Drive (Within City Limits)', priceDelta: 0, defaultChecked: true },
      { id: 't-party-return', name: 'Late Night Safe Return Drive', priceDelta: 99, defaultChecked: false },
      { id: 't-airport-drop', name: 'Airport Drop / Pickup Route', priceDelta: 149, defaultChecked: false },
      { id: 't-outstation', name: 'Outstation Day Trip Surcharge', priceDelta: 499, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Hourly City Drive',
        price: 299,
        unit: '/ hour',
        durationText: '2 - 6 Hours',
        description: 'Personal chauffeur for errands, clinic visits, or dinner parties',
        popular: true,
        savingsBadge: 'City Trips'
      },
      {
        type: 'daily',
        label: 'Full Day Chauffeur (10 Hrs)',
        price: 1499,
        unit: '/ day',
        durationText: '10 Hours In-City',
        description: 'Dedicated driver for full business day, family weddings or outings',
        savingsBadge: 'Save 45%'
      },
      {
        type: 'monthly',
        label: 'Monthly Corporate Driver',
        price: 21999,
        unit: '/ month',
        durationText: '26 Working Days (9 Hrs/day)',
        description: 'Permanent private driver with automatic replacement guarantee',
        savingsBadge: 'Executive'
      }
    ]
  },
  {
    id: 'srv-electrician',
    category: 'electrician',
    title: 'Certified Electrician',
    subtitle: 'Fans, lights, MCB tripping & switchboard fixes',
    tagline: 'Govt ITI certified electricians with toolkits',
    basePrice: 149,
    unit: 'per visit',
    badge: '30-Day Guarantee',
    eta: '18-20 mins',
    rating: 4.84,
    reviewsCount: 1720,
    availableCount: 8,
    iconName: 'Zap',
    imageUrl: '/src/assets/images/homeelynn_electrician_1788855164999.jpg',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      'Complete diagnostic inspection',
      'Insulated safety tools & multimeters',
      '30-day service warranty on repairs',
      'Genuine spare parts at MRP'
    ],
    tasks: [
      { id: 't-fan-repair', name: 'Ceiling Fan Repair / Regulating', priceDelta: 50, defaultChecked: true },
      { id: 't-switchboard', name: 'Switchboard / Socket Replacement', priceDelta: 40, defaultChecked: false },
      { id: 't-mcb-tripping', name: 'MCB Tripping / Short Circuit Check', priceDelta: 99, defaultChecked: false },
      { id: 't-light-hanging', name: 'Chandelier / Spot Light Installation', priceDelta: 79, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Standard Visit',
        price: 149,
        unit: '/ visit',
        durationText: '45 - 60 Mins',
        description: 'Quick fix for switches, fan noises, sockets & light fixtures',
        popular: true,
        savingsBadge: 'Instant 20m'
      },
      {
        type: 'daily',
        label: 'Full Day Electrician',
        price: 1199,
        unit: '/ day',
        durationText: '8 Hours Full Day',
        description: 'Complete home rewiring, lighting installation & new flat setup',
        savingsBadge: 'Renovation'
      },
      {
        type: 'monthly',
        label: 'Society AMC / Monthly',
        price: 6499,
        unit: '/ month',
        durationText: 'Monthly Maintenance',
        description: 'Comprehensive electrical AMC for apartments, villas & offices',
        savingsBadge: 'AMC Plan'
      }
    ]
  },
  {
    id: 'srv-plumber',
    category: 'plumber',
    title: 'Expert Plumber',
    subtitle: 'Tap leaks, pipe repair, toilet cistern & blockages',
    tagline: 'Quick fix for low water pressure & leakage',
    basePrice: 149,
    unit: 'per visit',
    badge: 'Instant Fix',
    eta: '15-20 mins',
    rating: 4.78,
    reviewsCount: 1430,
    availableCount: 7,
    iconName: 'Wrench',
    imageUrl: '/src/assets/images/homeelynn_plumber_1788855185949.jpg',
    popular: false,
    equipmentProvided: true,
    includedHighlights: [
      'Leak detection & pipe sealing',
      'Sink & drain block unclogging',
      'Standard washers & seals included',
      'Post-service mess cleanup'
    ],
    tasks: [
      { id: 't-tap-leak', name: 'Tap / Mixer Repair & Washers', priceDelta: 50, defaultChecked: true },
      { id: 't-drain-clog', name: 'Basin / Sink Drain Unclogging', priceDelta: 80, defaultChecked: false },
      { id: 't-flush-tank', name: 'Flush Tank / Jet Spray Fixing', priceDelta: 90, defaultChecked: false },
      { id: 't-geyser-conn', name: 'Geyser Inlet/Outlet Piping', priceDelta: 120, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Inspection & Fix',
        price: 149,
        unit: '/ visit',
        durationText: '45 - 60 Mins',
        description: 'Taps, faucets, cistern leaks and flush repairs',
        popular: true,
        savingsBadge: '15-Min Fix'
      },
      {
        type: 'daily',
        label: 'Full Day Plumbing Pass',
        price: 1199,
        unit: '/ day',
        durationText: '8 Hours Full Day',
        description: 'Complete bathroom overhaul, piping layout and new sanitary fittings',
        savingsBadge: 'Save 40%'
      },
      {
        type: 'monthly',
        label: 'Monthly Facility Plumbing',
        price: 5999,
        unit: '/ month',
        durationText: 'Monthly AMC',
        description: 'Regular valve checking, pressure monitoring & drainage AMC',
        savingsBadge: 'AMC Pack'
      }
    ]
  },
  {
    id: 'srv-carpenter-woodwork',
    category: 'carpenter',
    title: 'Expert Carpenter & Woodwork',
    subtitle: 'Door locks, hinges, wardrobe assembly, drilling & furniture repairs',
    tagline: 'Precision carpentry with professional power tools',
    basePrice: 199,
    unit: 'per visit',
    badge: 'Pro Woodwork',
    eta: '25-30 mins',
    rating: 4.86,
    reviewsCount: 1120,
    availableCount: 6,
    iconName: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    popular: false,
    equipmentProvided: true,
    includedHighlights: [
      'Heavy-duty electric hammer drilling & wall mounting',
      'Hydraulic hinge alignment & door sagging repairs',
      'IKEA / UrbanLadder / Pepperfry furniture assembly',
      'Deadbolt locks & magnetic latch fittings'
    ],
    tasks: [
      { id: 't-hinge-fix', name: 'Door / Cabinet Hinge Alignment', priceDelta: 50, defaultChecked: true },
      { id: 't-lock-change', name: 'Door Lock / Deadbolt Replacement', priceDelta: 99, defaultChecked: false },
      { id: 't-bed-assembly', name: 'Bed / Wardrobe Assembly', priceDelta: 249, defaultChecked: false },
      { id: 't-wall-drilling', name: 'Curtain Rod / Frame Drilling (4 holes)', priceDelta: 80, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Single Job / 1 Hour',
        price: 199,
        unit: '/ visit',
        durationText: '1 - 2 Hours',
        description: 'Hinges, locks, curtain rods and single furniture fixes',
        popular: true,
        savingsBadge: 'Express'
      },
      {
        type: 'daily',
        label: 'Full Day Carpenter Pass',
        price: 1399,
        unit: '/ day',
        durationText: '8 Hours Full Day',
        description: 'Full flat furniture assembly, modular kitchen touchups & woodwork',
        savingsBadge: 'Save 35%'
      },
      {
        type: 'monthly',
        label: 'Commercial / AMC Pack',
        price: 7999,
        unit: '/ month',
        durationText: 'Monthly Retainer',
        description: 'Facility woodwork maintenance, office desks & chair maintenance',
        savingsBadge: 'Retainer'
      }
    ]
  },
  {
    id: 'srv-deep-clean',
    category: 'deep_clean',
    title: 'Deep Home Cleaning',
    subtitle: 'Intensive scrubbing for kitchens, bathrooms & full house',
    tagline: 'Industrial grade vacuuming & chemical-safe scrubbing',
    basePrice: 899,
    unit: 'per visit',
    badge: 'Super Scrub',
    eta: 'Same Day',
    rating: 4.87,
    reviewsCount: 3120,
    availableCount: 8,
    iconName: 'Flame',
    imageUrl: '/src/assets/images/homeelynn_deepclean_1788855257584.jpg',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      'High-pressure chemical descaling of tiles',
      'Kitchen chimney, stove & cabinets degreasing',
      'Balcony power wash & window tracks',
      'Bed mattress & sofa vacuuming'
    ],
    tasks: [
      { id: 't-1bhk-full', name: '1 BHK Complete Deep Cleaning', priceDelta: 0, defaultChecked: true },
      { id: 't-2bhk-upgrade', name: '2 BHK Space Upgrade', priceDelta: 400, defaultChecked: false },
      { id: 't-3bhk-upgrade', name: '3 BHK Villa / Large Apartment', priceDelta: 900, defaultChecked: false },
      { id: 't-sofa-shampoo', name: '5-Seater Sofa Shampoo & Vacuum', priceDelta: 350, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Single Room / Kitchen Scrub',
        price: 899,
        unit: '/ visit',
        durationText: '2 - 3 Hours',
        description: 'Deep bathroom or kitchen degreasing and tile scrubbing',
        popular: true,
        savingsBadge: 'Spotless'
      },
      {
        type: 'daily',
        label: 'Full House Deep Scrub Day',
        price: 2499,
        unit: '/ day',
        durationText: '6 - 8 Hours (2 Cleaners)',
        description: 'Complete 2/3 BHK deep cleaning with 2 staff & industrial machines',
        savingsBadge: 'Save 30%'
      },
      {
        type: 'monthly',
        label: 'Bi-Weekly Clean Subscription',
        price: 4999,
        unit: '/ month',
        durationText: '4 Visits (Every Weekend)',
        description: 'Monthly weekend deep refresh pack to keep home allergen-free',
        savingsBadge: '4 Deep Cleans'
      }
    ]
  },
  {
    id: 'srv-appliance-repair',
    category: 'appliance',
    title: 'Appliance Repair & AC Service',
    subtitle: 'AC gas recharge, washing machine, fridge & microwave',
    tagline: 'Brand certified engineers for Samsung, LG, Daikin, IFB',
    basePrice: 249,
    unit: 'per visit',
    badge: '90-Day Warranty',
    eta: '30 mins',
    rating: 4.82,
    reviewsCount: 1980,
    availableCount: 7,
    iconName: 'Tv',
    imageUrl: '/src/assets/images/homeelynn_appliance_1788855276790.jpg',
    popular: false,
    equipmentProvided: true,
    includedHighlights: [
      'Comprehensive error code diagnosis',
      'Gas leakage testing & refill',
      'Motor & PCB replacement options',
      '90-day warranty card issued'
    ],
    tasks: [
      { id: 't-ac-jet-clean', name: 'Split AC Power Jet Cleaning', priceDelta: 150, defaultChecked: true },
      { id: 't-washing-drain', name: 'Washing Machine Drum / Drain Fix', priceDelta: 100, defaultChecked: false },
      { id: 't-fridge-cooling', name: 'Refrigerator Cooling & Thermostat Fix', priceDelta: 120, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Diagnostic & Service',
        price: 249,
        unit: '/ visit',
        durationText: '1 - 2 Hours',
        description: 'Complete machine diagnosis, foam wash & jet clean',
        popular: true,
        savingsBadge: '90D Warranty'
      },
      {
        type: 'daily',
        label: 'Full House Multi-Appliance Day',
        price: 1299,
        unit: '/ day',
        durationText: 'Full Day Checkup',
        description: 'Service up to 4 ACs + Washing Machine + Fridge in one visit',
        savingsBadge: 'Bundle Deal'
      },
      {
        type: 'monthly',
        label: 'Annual Appliance AMC',
        price: 4499,
        unit: '/ month',
        durationText: 'Quarterly Maintenance',
        description: 'Yearly protection covering 4 AC services & priority breakdown support',
        savingsBadge: 'Complete AMC'
      }
    ]
  },
  {
    id: 'srv-security-guard',
    category: 'security',
    title: 'Security Personnel & Guard',
    subtitle: 'Residential gate guarding, event security & personal escort',
    tagline: 'Vigilant, disciplined & trained security professionals',
    basePrice: 499,
    unit: 'per day',
    badge: 'Trained & Alert',
    eta: '45 mins',
    rating: 4.88,
    reviewsCount: 860,
    availableCount: 5,
    iconName: 'ShieldCheck',
    imageUrl: '/src/assets/images/homeelynn_security_1788855237384.jpg',
    popular: false,
    equipmentProvided: true,
    includedHighlights: [
      'Uniformed with flashlight & security kit',
      'Visitor registration & CCTV monitoring',
      'Emergency response & fire safety trained',
      'Strict background & fitness clearance'
    ],
    tasks: [
      { id: 't-gate-shift', name: '8-Hour Residential Gate Duty', priceDelta: 0, defaultChecked: true },
      { id: 't-night-patrol', name: 'Night Shift Perimeter Patrolling', priceDelta: 120, defaultChecked: false },
      { id: 't-event-crowd', name: 'Party / Society Event Crowd Protocol', priceDelta: 250, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Event / Short Shift',
        price: 199,
        unit: '/ hour',
        durationText: '4 - 6 Hours',
        description: 'Temporary bouncer or parking security for private functions',
        savingsBadge: 'Short Shift'
      },
      {
        type: 'daily',
        label: 'Single Day Gate Shift',
        price: 799,
        unit: '/ day',
        durationText: '12-Hour Shift',
        description: 'Full day/night gate duty for residential societies and buildings',
        popular: true,
        savingsBadge: '12 Hours'
      },
      {
        type: 'monthly',
        label: 'Monthly Guard Deployment',
        price: 16999,
        unit: '/ month',
        durationText: '30 Days Continuous',
        description: 'Permanent trained guard deployment with replacement backup',
        savingsBadge: 'Staff Warranty'
      }
    ]
  },
  {
    id: 'srv-pest-control',
    category: 'pestcontrol',
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
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&q=80&w=800',
    popular: true,
    equipmentProvided: true,
    includedHighlights: [
      'Govt-certified Bayer & herbal formulation gel',
      'No need to empty kitchen cabinets or vacate home',
      'Anti-microbial drain & trap treatment included',
      '90-Day re-treatment guarantee'
    ],
    tasks: [
      { id: 't-cockroach-gel', name: 'Kitchen & Bathroom Odorless Gel Dotting', priceDelta: 0, defaultChecked: true },
      { id: 't-drain-cleanse', name: 'Bio-Enzymatic Drain Fly & Insect Flush', priceDelta: 69, defaultChecked: true },
      { id: 't-bedbug-steam', name: 'Mattress & Bed High-Heat Steam Flush', priceDelta: 249, defaultChecked: false },
      { id: 't-termite-barrier', name: 'Wooden Cabinet Drill & Termite Injection', priceDelta: 349, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Spot & Kitchen Gel',
        price: 299,
        unit: '/ visit',
        durationText: '45 - 60 Mins',
        description: 'Targeted kitchen cabinets and sink pipe cockroach eradication',
        popular: true,
        savingsBadge: 'Rapid Gel'
      },
      {
        type: 'daily',
        label: 'Complete Apartment Shield',
        price: 1199,
        unit: '/ flat',
        durationText: '2 - 3 Hours',
        description: 'Full 2/3 BHK odorless fogging, window netting & herbal spray',
        savingsBadge: 'Full Home'
      },
      {
        type: 'monthly',
        label: 'Annual 4-Season Pest AMC',
        price: 3499,
        unit: '/ year',
        durationText: '4 Visits (Every Quarter)',
        description: 'Quarterly preventive shield ensuring 365-day pest-free living',
        savingsBadge: 'Best Annual'
      }
    ]
  },
  {
    id: 'srv-gardener',
    category: 'gardener',
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
    imageUrl: 'https://images.unsplash.com/photo-1599685315640-9ceab2f58944?auto=format&fit=crop&q=80&w=800',
    popular: false,
    equipmentProvided: true,
    includedHighlights: [
      'Bonsai, succulent & flowering plant pruning',
      'Vermicompost & neem-oil organic pest spray',
      'Repotting with enriched cocopeat & soil mix',
      'Seasonal flowering guidance & drip care'
    ],
    tasks: [
      { id: 't-pruning-weeding', name: 'Plant Weeding, Trimming & Dead Leaf Cut', priceDelta: 0, defaultChecked: true },
      { id: 't-fertilizer-mix', name: 'Organic Vermicompost & Soil Nourishment', priceDelta: 80, defaultChecked: true },
      { id: 't-repotting', name: 'Repotting in New Ceramic/Clay Pots (5 Pots)', priceDelta: 120, defaultChecked: false },
      { id: 't-neem-spray', name: 'Foliar Neem Oil Pest & Fungus Protection', priceDelta: 60, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Balcony Refresh Hourly',
        price: 199,
        unit: '/ hour',
        durationText: '1 - 3 Hours',
        description: 'Fast cleanup, pruning and watering for balcony and indoor planters',
        popular: true,
        savingsBadge: 'Instant Bloom'
      },
      {
        type: 'daily',
        label: 'Full Day Garden Landscaping',
        price: 999,
        unit: '/ day',
        durationText: '6 - 8 Hours',
        description: 'Dedicated terrace garden setup, lawn mowing & shrub shaping',
        savingsBadge: 'Save 30%'
      },
      {
        type: 'monthly',
        label: 'Weekly Care Subscription',
        price: 2799,
        unit: '/ month',
        durationText: '4 Visits (Weekly 2-Hr Visit)',
        description: 'Regular weekly visits to ensure your plants flourish all season long',
        savingsBadge: 'Continuous Care'
      }
    ]
  },
  {
    id: 'srv-painter',
    category: 'painter',
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
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
    popular: false,
    equipmentProvided: true,
    includedHighlights: [
      'Drop cloth & masking tape protection for furniture',
      'Putty filling for wall cracks, nail holes & peeling plaster',
      'Two coats of premium low-VOC emulsion paint',
      'Post-painting floor scrubbing and clean delivery'
    ],
    tasks: [
      { id: 't-crack-putty', name: 'Wall Crack & Nail Hole Putty Touchup', priceDelta: 0, defaultChecked: true },
      { id: 't-accent-wall', name: 'Single Accent Wall Designer Texture/Color', priceDelta: 350, defaultChecked: false },
      { id: 't-waterproof-primer', name: 'Anti-Damp Waterproofing Primer Coat', priceDelta: 200, defaultChecked: false }
    ],
    pricingTiers: [
      {
        type: 'hourly',
        label: 'Hourly Touchup & Patch',
        price: 249,
        unit: '/ hour',
        durationText: '1 - 4 Hours',
        description: 'Fix move-out nail holes, water seepage spots and scuffs quickly',
        popular: true,
        savingsBadge: 'Quick Patch'
      },
      {
        type: 'daily',
        label: 'Single Room Painting Day',
        price: 1499,
        unit: '/ day',
        durationText: '8 Hours Full Day',
        description: 'Complete 1 room walls + ceiling double coat with masking cleanup',
        savingsBadge: 'Save 25%'
      },
      {
        type: 'monthly',
        label: 'Multi-Phase Home Refresh',
        price: 6999,
        unit: '/ package',
        durationText: '3 Days Scheduled',
        description: 'Full 2BHK renovation with color consultation and zero-mess guarantee',
        savingsBadge: 'Full Home AMC'
      }
    ]
  }
];
