import { Coupon, AnnouncementBanner, Review } from '../../src/types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'FIRST100',
    description: 'Flat ₹100 instant discount on your first 15-min domestic help booking',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 249,
    active: true,
    validTill: '2026-12-31',
    usageCount: 428,
    applicableCategory: 'all'
  },
  {
    id: 'cpn-2',
    code: 'CARE20',
    description: '20% off on all CarePlan 6-month and 12-month staff replacement warranties',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 3999,
    maxDiscount: 1500,
    active: true,
    validTill: '2026-11-30',
    usageCount: 94,
    applicableCategory: 'all'
  },
  {
    id: 'cpn-3',
    code: 'KITCHEN50',
    description: '₹50 off Home Cook & Chef instant visit',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 199,
    active: true,
    validTill: '2026-10-31',
    usageCount: 215,
    applicableCategory: 'cook'
  },
  {
    id: 'cpn-4',
    code: 'DEEPCLEAN15',
    description: '15% off full house intensive scrub & vacuum',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 799,
    maxDiscount: 300,
    active: false,
    validTill: '2026-08-15',
    usageCount: 160,
    applicableCategory: 'deep_clean'
  }
];

export const INITIAL_ANNOUNCEMENT: AnnouncementBanner = {
  id: 'ann-1',
  title: '⚡ 15-Minute Guaranteed Domestic Staffing Active',
  message: 'All Bangalore, Mumbai & Delhi hubs are 100% operational with biometric and police-verified domestic helpers.',
  type: 'info',
  active: true,
  ctaText: 'View CarePlans',
  ctaLink: '/services',
  updatedAt: new Date().toISOString()
};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-101',
    bookingId: 'HL7-4821',
    helperId: 'hlp-101',
    helperName: 'Sunita Devi',
    customerName: 'Prasad Sharma',
    customerCity: 'Bangalore',
    serviceTitle: 'House Help & Maid',
    category: 'maid',
    rating: 5,
    comment: 'Sunita arrived in 11 minutes at Koramangala. Cleaned 3BHK floors spotless and sanitized kitchen counters!',
    tags: ['⚡ Super Punctual (15 Min Arrival)', '✨ Spotless & Deep Cleaning'],
    createdAt: '2026-03-05T09:30:00Z',
    verifiedBooking: true,
    isFeaturedHomepage: true
  },
  {
    id: 'rev-102',
    bookingId: 'HL7-2910',
    helperId: 'hlp-102',
    helperName: 'Ramesh Kumar',
    customerName: 'Ankit & Sneha Verma',
    customerCity: 'Mumbai',
    serviceTitle: 'Home Cook & Chef (Family Dinner)',
    category: 'cook',
    rating: 5,
    comment: 'Ramesh cooked piping hot phulkas and fresh dal tadka. Clean apron, low oil, and delicious homemade taste.',
    tags: ['🍲 Delicious Home Cooked Taste', '🧼 Hygienic (Clean Apron & Gloves)'],
    createdAt: '2026-03-04T19:45:00Z',
    verifiedBooking: true,
    isFeaturedHomepage: true
  },
  {
    id: 'rev-103',
    bookingId: 'HL7-8832',
    helperId: 'hlp-103',
    helperName: 'Meena Kumari',
    customerName: 'Dr. Kavita Menon',
    customerCity: 'Delhi NCR',
    serviceTitle: 'Infant Childcare & Babysitter',
    category: 'nanny',
    rating: 5,
    comment: 'Handled our 2-year old toddler with immense warmth and care. Background check certificate provided total peace of mind.',
    tags: ['🛡️ Verified & Trusted Behavior', '💯 Exceeded Expectations'],
    createdAt: '2026-03-03T14:15:00Z',
    verifiedBooking: true,
    isFeaturedHomepage: true
  }
];
