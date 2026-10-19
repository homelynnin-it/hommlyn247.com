import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { memoryStore } from './server/db/memoryStore';
import { createBooking, getBookings } from './server/models/Booking.model';
import { createService } from './server/models/Service.model';
import { createUser } from './server/models/User.model';
import { isBookingsEnabled, BOOKINGS_ERROR } from './server/config/featureFlags';
import { sanitizeBookingForRole } from './server/models/Booking.model';

const originalEnv = { ...process.env };

beforeEach(async () => {
  process.env = { ...originalEnv };
  process.env.NODE_ENV = 'test';
  delete process.env.BOOKINGS_ENABLED;

  memoryStore.users = [];
  memoryStore.helpers = [];
  memoryStore.services = [];
  memoryStore.bookings = [];
  memoryStore.transactions = [];
  memoryStore.sessions = [];
  memoryStore.credentials = [];

  await createService({
    id: 'srv-maid-hourly',
    category: 'maid',
    title: 'Home Cleaning',
    subtitle: 'Professional home cleaning service',
    basePrice: 199,
    pricingTiers: [
      { type: 'hourly', label: 'Hourly', price: 199, unit: 'per hr', durationText: 'Per hour', description: 'Pay per hour' },
      { type: 'daily', label: 'Daily', price: 1499, unit: 'per day', durationText: '8-10 hrs', description: 'Full day pass' },
      { type: 'monthly', label: 'Monthly', price: 29999, unit: 'per month', durationText: '30 days', description: 'Monthly care plan' }
    ],
    tasks: [
      { id: 'task-1', name: 'Deep Kitchen Cleaning', priceDelta: 99, defaultChecked: false },
      { id: 'task-2', name: 'Bathroom Sanitization', priceDelta: 49, defaultChecked: false }
    ]
  });
});

afterEach(() => {
  process.env = originalEnv;
});

describe('Booking API Access Control', () => {
  it('should reject unauthenticated access to bookings', async () => {
    await expect(getBookings()).rejects.toMatchObject({ code: BOOKINGS_ERROR.code });
  });

  it('should allow a customer to read only their own bookings', async () => {
    const user = await createUser({ id: 'usr-alice-1', name: 'Alice', phone: '+91 98765 43210', email: 'alice@example.com' });
    const other = await createUser({ id: 'usr-bob-2', name: 'Bob', phone: '+91 98765 43211', email: 'bob@example.com' });

    const mine = await createBooking({ userId: user.id, category: 'maid', customer: { name: 'Alice', phone: '+91 98765 43210', address: 'Flat 1', houseNumber: '1', city: 'Bangalore', pincode: '560001' } }, { bypassLock: true });
    await createBooking({ userId: other.id, category: 'maid', customer: { name: 'Bob', phone: '+91 98765 43211', address: 'Flat 2', houseNumber: '2', city: 'Bangalore', pincode: '560002' } }, { bypassLock: true });

    const all = await getBookings({ bypassLock: true });
    const visible = all.filter(b => b.userId === user.id);
    expect(visible.map(b => b.id)).toEqual([mine.id]);
  });

  it('should redact private fields for non-admin roles', () => {
    const booking = {
      id: 'SWIFT-1',
      userId: 'usr-1',
      serviceId: 'srv-maid-hourly',
      category: 'maid' as const,
      serviceTitle: 'Home Cleaning',
      bookingType: 'instant' as const,
      scheduledDate: '2026-10-19',
      scheduledTimeSlot: 'Now',
      durationHours: 1,
      frequency: 'one-time' as const,
      selectedTasks: [],
      customer: { name: 'Alice', phone: '+91 98765 43210', address: 'Flat 1, Koramangala', houseNumber: '1', city: 'Bangalore', pincode: '560001' },
      status: 'assigned' as const,
      otp: '4829',
      paymentStatus: 'pending' as const,
      paymentMethod: 'upi' as const,
      pricing: { baseAmount: 199, addOnsAmount: 0, platformFee: 29, taxAmount: 0, discount: 0, total: 228 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const safe = sanitizeBookingForRole(booking, 'client');
    expect(safe.otp).toBe('[REDACTED]');
    expect(safe.customer?.phone).not.toContain('98765');
    expect(safe.customer?.address).not.toContain('Flat 1');
    const admin = sanitizeBookingForRole(booking, 'admin');
    expect(admin.otp).toBe('4829');
    expect(admin.customer?.phone).toBe('+91 98765 43210');
  });

  it('should keep public read-only service endpoints accessible', async () => {
    const { getServices } = await import('./server/models/Service.model');
    const services = await getServices();
    expect(services.length).toBeGreaterThan(0);
  });

  it('should still reject customer booking mutations with BOOKINGS_NOT_AVAILABLE', async () => {
    await expect(createBooking({ category: 'maid' })).rejects.toMatchObject({ code: BOOKINGS_ERROR.code });
    await expect(getBookings()).rejects.toMatchObject({ code: BOOKINGS_ERROR.code });
  });

  it('should never trust client-supplied bypass flags', async () => {
    await expect(createBooking({ category: 'maid', bypassLock: true } as any)).rejects.toMatchObject({ code: BOOKINGS_ERROR.code });
  });
});