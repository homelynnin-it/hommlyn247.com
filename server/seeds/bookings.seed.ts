import { Booking } from '../../src/types';
import { INITIAL_HELPERS } from './helpers.seed';

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'SWIFT-9481',
    userId: 'usr-101',
    serviceId: 'srv-maid-hourly',
    category: 'maid',
    serviceTitle: 'House Help & Maid',
    bookingType: 'instant',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTimeSlot: 'Instant Dispatch (12 mins)',
    durationHours: 1.5,
    frequency: 'one-time',
    selectedTasks: ['Floor Brooming & Mopping', 'Sink Utensil Washing', 'Surface Dusting'],
    customer: {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      address: 'Tower 4, Flat 602, Prestige Lakeside Habitat',
      houseNumber: 'Flat 602',
      city: 'Bangalore',
      pincode: '560087',
      instructions: 'Please call once at the society security gate.'
    },
    helper: INITIAL_HELPERS[0],
    status: 'en_route',
    otp: '4829',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    pricing: {
      baseAmount: 199,
      addOnsAmount: 88,
      platformFee: 29,
      taxAmount: 56,
      discount: 50,
      total: 322
    },
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: 'SWIFT-8910',
    userId: 'usr-101',
    serviceId: 'srv-cook-fresh',
    category: 'cook',
    serviceTitle: 'Home Cook & Chef',
    bookingType: 'scheduled',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduledTimeSlot: '07:30 PM - 09:00 PM (Dinner)',
    durationHours: 1.5,
    frequency: 'one-time',
    selectedTasks: ['Full Meal (Sabzi, Dal, Rice)', 'Phulkas / Rotis (Up to 15 pcs)'],
    customer: {
      name: 'Neha Kapoor',
      phone: '+91 98199 87654',
      address: 'B-301, Raheja Vivarea, Koramangala 4th Block',
      houseNumber: 'B-301',
      city: 'Bangalore',
      pincode: '560034',
      instructions: 'Spices and vegetables already chopped in fridge.'
    },
    helper: INITIAL_HELPERS[2],
    status: 'assigned',
    otp: '1904',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    pricing: {
      baseAmount: 249,
      addOnsAmount: 49,
      platformFee: 29,
      taxAmount: 58,
      discount: 50,
      total: 335
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  }
];
