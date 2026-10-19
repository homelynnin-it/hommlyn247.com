import { CarePlan } from '../../src/types';

export const INITIAL_CAREPLANS: CarePlan[] = [
  {
    id: 'care-90',
    code: 'CARE 90°',
    title: 'CARE 90°',
    durationMonths: 4,
    badge: 'ESSENTIAL',
    price: 3999,
    isPopular: false,
    validityText: 'For 4 Months Plan',
    features: [
      'Free replacement if staff leaves without prior information',
      'Free replacement if performance does not meet expectations',
      'Free replacement for any other genuine issue',
      'Dedicated support throughout the plan period'
    ]
  },
  {
    id: 'care-180',
    code: 'CARE 180°',
    title: 'CARE 180°',
    durationMonths: 6,
    badge: 'BEST VALUE',
    price: 6999,
    isPopular: true,
    validityText: 'For 6 Months Plan',
    features: [
      'Free replacement if staff leaves without prior information',
      'Free replacement if performance does not meet expectations',
      'Free replacement for any other genuine issue',
      'Dedicated support throughout the plan period',
      '2 times staff change - hassle free'
    ]
  },
  {
    id: 'care-360',
    code: 'CARE 360°',
    title: 'CARE 360°',
    durationMonths: 12,
    badge: 'PREMIUM',
    price: 8999,
    isPopular: false,
    validityText: 'For 12 Months Plan',
    features: [
      'Free replacement if staff leaves without prior information',
      'Free replacement if performance does not meet expectations',
      'Free replacement for any other genuine issue',
      'Dedicated support throughout the plan period',
      'Backup staff on request for special occasions (Subject to availability)',
      'Priority Customer Care'
    ]
  }
];
