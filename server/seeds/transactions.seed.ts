import { PaymentTransaction } from '../../src/types';

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'TXN-948101',
    userId: 'usr-101',
    bookingId: 'SWIFT-9481',
    amount: 322,
    currency: 'INR',
    method: 'upi',
    status: 'success',
    referenceId: 'UPI/3891029481/swiftly@icici',
    upiId: 'aarav@okaxis',
    serviceTitle: 'House Help & Maid',
    customerName: 'Aarav Sharma',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    invoiceUrl: '#'
  },
  {
    id: 'TXN-891002',
    userId: 'usr-101',
    bookingId: 'SWIFT-8910',
    amount: 335,
    currency: 'INR',
    method: 'card',
    status: 'success',
    referenceId: 'CARD/HDFC/992102',
    cardLast4: '4821',
    serviceTitle: 'Home Cook & Chef',
    customerName: 'Neha Kapoor',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    invoiceUrl: '#'
  }
];
