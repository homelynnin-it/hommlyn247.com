import { LeadClient } from '../types';

export const INITIAL_LEADS: LeadClient[] = [
  {
    id: 'lead-1001',
    name: 'Vikram & Sunita Malhotra',
    phone: '+91 98201 44521',
    email: 'v.malhotra@prestige-invest.com',
    address: 'Tower 4, Flat 1402, Prestige Shantiniketan, Whitefield',
    societyOrLocality: 'Prestige Shantiniketan, Whitefield',
    city: 'Bangalore',
    pincode: '560066',
    source: 'justdial',
    requirementCategory: 'cook',
    requirementDescription: 'North Indian vegetarian cook required for family of 4. Morning breakfast (8 AM) & evening dinner (7:30 PM). Must know low-oil Gujarati & Punjabi dishes.',
    shiftPreference: 'part_time_morning',
    budgetExpectation: '₹12,000 / month',
    priority: 'hot',
    status: 'interview_scheduled',
    assignedTelecaller: 'Priya Sharma (Senior Telecaller)',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    nextFollowUpDate: 'Tomorrow at 11:00 AM (Trial Visit)',
    callLogs: [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 34 * 3600 * 1000).toISOString(),
        telecallerName: 'Priya Sharma',
        callOutcome: 'connected',
        notes: 'Client came via JustDial premium domestic inquiry. Desired staff: Verified Brahmin/North Indian vegetarian cook. Shared 2 verified candidate profiles over WhatsApp.',
        nextFollowUpDate: 'Today 4:00 PM'
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        telecallerName: 'Priya Sharma',
        callOutcome: 'connected',
        notes: 'Client reviewed profiles. Selected Sunita Devi for interview & trial cook tomorrow. Trial fee ₹299 confirmed.',
        nextFollowUpDate: 'Tomorrow 11:00 AM'
      }
    ],
    tags: ['High Value', 'JustDial Verified', 'Whitefield Gated Society']
  },
  {
    id: 'lead-1002',
    name: 'Dr. Arindam Sen & Shalini Sen',
    phone: '+91 97412 88910',
    email: 'dr.arindam.sen@manipal.edu',
    address: 'Villa 28, Adarsh Palm Meadows, Varthur Road',
    societyOrLocality: 'Adarsh Palm Meadows',
    city: 'Bangalore',
    pincode: '560066',
    source: 'facebook_meta',
    requirementCategory: 'nanny',
    requirementDescription: 'Certified Nanny for 10-month-old infant. Both parents doctors working shift rotations. Required: CPR trained, hygiene conscious, minimum 3 years infant care experience.',
    shiftPreference: 'day_12hr',
    budgetExpectation: '₹22,000 / month',
    priority: 'immediate',
    status: 'trial_active',
    assignedTelecaller: 'Rahul Verma (Lead Executive)',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    nextFollowUpDate: 'Today at 6:30 PM (Trial feedback call)',
    callLogs: [
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 70 * 3600 * 1000).toISOString(),
        telecallerName: 'Rahul Verma',
        callOutcome: 'connected',
        notes: 'Lead captured from Facebook Ad campaign "Gated Society Verified Nannies". Explained CarePlan 6-month staff guarantee.',
        nextFollowUpDate: 'Yesterday 10:00 AM'
      },
      {
        id: 'log-4',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        telecallerName: 'Rahul Verma',
        callOutcome: 'connected',
        notes: 'Placed Geeta Kumari on 3-day paid trial starting yesterday. Client pleased with punctuality & infant feeding routine.',
        nextFollowUpDate: 'Today 6:30 PM'
      }
    ],
    tags: ['Doctor Family', 'CarePlan Prospect', 'High Budget']
  },
  {
    id: 'lead-1003',
    name: 'Meera Krishnan',
    phone: '+91 99002 33145',
    email: 'meera.k@startupgrowth.in',
    address: 'C-503, Salarpuria Greenage, Hosur Road, Bommanahalli',
    societyOrLocality: 'Salarpuria Greenage',
    city: 'Bangalore',
    pincode: '560068',
    source: 'society_kiosk',
    requirementCategory: 'maid',
    requirementDescription: 'Daily 2-hour morning house maid for 3BHK flat. Utensils cleaning (sink & dishwasher loading), sweeping & organic floor mopping, dusting of living room.',
    shiftPreference: 'part_time_morning',
    budgetExpectation: '₹4,500 / month',
    priority: 'hot',
    status: 'new',
    assignedTelecaller: 'Anjali Rao (Telecaller)',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    nextFollowUpDate: 'Today at 3:00 PM',
    callLogs: [],
    tags: ['Society Booth Lead', 'Salarpuria Society', 'Quick Conversion']
  },
  {
    id: 'lead-1004',
    name: 'Rajesh & Kavita Agarwal',
    phone: '+91 98450 71234',
    email: 'rajesh.agarwal@infy.com',
    address: 'Penthouse 1201, Raheja Vivarea, Koramangala 4th Block',
    societyOrLocality: 'Raheja Vivarea, Koramangala',
    city: 'Bangalore',
    pincode: '560034',
    source: 'referral',
    requirementCategory: 'eldercare',
    requirementDescription: 'Dedicated 24hr Live-in patient care attendant for 78-year-old grandfather recovering from knee surgery. Assistance with walking, wheelchair, medication reminders & sponge bath.',
    shiftPreference: 'full_time_24hr',
    budgetExpectation: '₹28,000 / month',
    priority: 'immediate',
    status: 'discussion',
    assignedTelecaller: 'Priya Sharma (Senior Telecaller)',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    nextFollowUpDate: 'Today at 4:30 PM (Family decision meeting)',
    callLogs: [
      {
        id: 'log-5',
        timestamp: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
        telecallerName: 'Priya Sharma',
        callOutcome: 'connected',
        notes: 'Referred by resident Neha Kapoor (Existing CarePlan subscriber). Discussed medical caregiver background check & police verification certificates.',
        nextFollowUpDate: 'Today 4:30 PM'
      }
    ],
    tags: ['VIP Client', 'Friend Referral', 'Elder Care Live-in']
  },
  {
    id: 'lead-1005',
    name: 'Siddharth Roy',
    phone: '+91 98110 55678',
    email: 'sid.roy@gmail.com',
    address: 'Apartment 204, Embassy Habitat, Vasanth Nagar',
    societyOrLocality: 'Embassy Habitat',
    city: 'Bangalore',
    pincode: '560052',
    source: 'direct_call',
    requirementCategory: 'deep_clean',
    requirementDescription: 'Complete post-tenancy deep scrubbing, steam sanitization of kitchen & 3 bathrooms, balcony pressure wash before shifting on weekend.',
    shiftPreference: 'hourly',
    budgetExpectation: '₹4,999 (Flat rate)',
    priority: 'warm',
    status: 'follow_up',
    assignedTelecaller: 'Rahul Verma (Lead Executive)',
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    nextFollowUpDate: 'In 2 days at 10:00 AM',
    callLogs: [
      {
        id: 'log-6',
        timestamp: new Date(Date.now() - 90 * 3600 * 1000).toISOString(),
        telecallerName: 'Rahul Verma',
        callOutcome: 'connected',
        notes: 'Client compared with Urban Company rates. Explained our 4-member machine team with German industrial vacuum & non-toxic eco sanitizers.',
        nextFollowUpDate: 'Follow-up sent with coupon code DEEPCLEAN15'
      },
      {
        id: 'log-7',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        telecallerName: 'Rahul Verma',
        callOutcome: 'callback_requested',
        notes: 'Client in office meeting. Asked to call on Thursday morning to confirm Saturday morning 9 AM slot.',
        nextFollowUpDate: 'Thursday 10:00 AM'
      }
    ],
    tags: ['Deep Cleaning', 'Direct Inquiry', 'Price Sensitive']
  },
  {
    id: 'lead-1006',
    name: 'Deepak & Sneha Joshi',
    phone: '+91 97118 90234',
    email: 'sneha.joshi@wipro.com',
    address: 'Flat 602, Sobha Dream Acres, Panathur',
    societyOrLocality: 'Sobha Dream Acres, Panathur',
    city: 'Bangalore',
    pincode: '560087',
    source: 'whatsapp',
    requirementCategory: 'all_rounder',
    requirementDescription: 'All-in-one domestic helper required: Morning cleaning, evening cooking (simple Maharashtrian dishes), and laundry ironing twice a week.',
    shiftPreference: 'day_12hr',
    budgetExpectation: '₹16,000 / month',
    priority: 'hot',
    status: 'converted',
    assignedTelecaller: 'Priya Sharma (Senior Telecaller)',
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    convertedBookingId: 'SWIFT-9942',
    callLogs: [
      {
        id: 'log-8',
        timestamp: new Date(Date.now() - 110 * 3600 * 1000).toISOString(),
        telecallerName: 'Priya Sharma',
        callOutcome: 'connected',
        notes: 'WhatsApp greeting converted to phone discussion. Matched with all-rounder helper Rekha Bai with 5 years society experience.',
        nextFollowUpDate: 'Trial arranged'
      },
      {
        id: 'log-9',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        telecallerName: 'Priya Sharma',
        callOutcome: 'converted',
        notes: 'SUCCESS: Client confirmed monthly CarePlan booking! Advance token paid via UPI. Helper starts Monday.',
        nextFollowUpDate: 'Completed'
      }
    ],
    tags: ['Converted', 'WhatsApp Inbound', 'Monthly Contract']
  },
  {
    id: 'lead-1007',
    name: 'Amitabh Choudhary',
    phone: '+91 98455 12099',
    email: 'amitabh.c@titan.co.in',
    address: 'Apartment 4B, Brigade Millennium, JP Nagar 7th Phase',
    societyOrLocality: 'Brigade Millennium, JP Nagar',
    city: 'Bangalore',
    pincode: '560078',
    source: 'google_search',
    requirementCategory: 'driver',
    requirementDescription: 'Professional private chauffeur for luxury sedan (BMW 5-series). Daily airport trips, city executive commute, weekend family driving.',
    shiftPreference: 'day_12hr',
    budgetExpectation: '₹22,000 / month',
    priority: 'warm',
    status: 'contacted',
    assignedTelecaller: 'Anjali Rao (Telecaller)',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    nextFollowUpDate: 'Tomorrow at 10:30 AM',
    callLogs: [
      {
        id: 'log-10',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        telecallerName: 'Anjali Rao',
        callOutcome: 'connected',
        notes: 'Verified driver credentials requested: Clean DL, commercial luxury driving experience, zero criminal record check. Shared Ramesh Gowda profile.',
        nextFollowUpDate: 'Tomorrow 10:30 AM'
      }
    ],
    tags: ['Executive Driver', 'Google Search', 'High Touch']
  }
];
