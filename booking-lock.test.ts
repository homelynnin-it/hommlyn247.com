import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { memoryStore } from './server/db/memoryStore';
import { createBooking, getBookings, getBookingById, updateBooking, updateBookingStatus, deleteBooking } from './server/models/Booking.model';
import { createService } from './server/models/Service.model';
import { createUser, getUsers } from './server/models/User.model';
import { createSession, getSessionUser } from './server/models/Auth.model';
import { isBookingsEnabled, BOOKINGS_ERROR } from './server/config/featureFlags';

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

describe('Booking Lock Regression Tests', () => {
  it('should be disabled by default in test environment', () => {
    expect(isBookingsEnabled()).toBe(false);
  });

  it('should throw BOOKINGS_NOT_AVAILABLE when creating a booking while locked', async () => {
    await expect(createBooking({ category: 'maid' })).rejects.toMatchObject({
      code: BOOKINGS_ERROR.code,
      message: BOOKINGS_ERROR.message
    });
  });

  it('should create no users, sessions, memory records, or database writes when locked', async () => {
    const usersBefore = memoryStore.users.length;
    const sessionsBefore = memoryStore.sessions.length;
    const bookingsBefore = memoryStore.bookings.length;
    const transactionsBefore = memoryStore.transactions.length;

    await expect(createBooking({ category: 'maid' })).rejects.toMatchObject({ code: 'BOOKINGS_NOT_AVAILABLE' });

    expect(memoryStore.users.length).toBe(usersBefore);
    expect(memoryStore.sessions.length).toBe(sessionsBefore);
    expect(memoryStore.bookings.length).toBe(bookingsBefore);
    expect(memoryStore.transactions.length).toBe(transactionsBefore);
  });

  it('should not allow any booking mutation routes to run while locked', async () => {
    await expect(getBookings()).rejects.toMatchObject({ code: 'BOOKINGS_NOT_AVAILABLE' });
    await expect(updateBooking('any-id', { status: 'assigned' })).rejects.toMatchObject({ code: 'BOOKINGS_NOT_AVAILABLE' });
    await expect(updateBookingStatus('any-id', 'in_progress', '1234')).rejects.toMatchObject({ code: 'BOOKINGS_NOT_AVAILABLE' });
    await expect(deleteBooking('any-id')).rejects.toMatchObject({ code: 'BOOKINGS_NOT_AVAILABLE' });
  });

  it('should allow admin bypass via createBooking options', async () => {
    const booking = await createBooking({ category: 'maid' }, { bypassLock: true });
    expect(booking.id).toMatch(/^SWIFT-/);
    expect(memoryStore.bookings.length).toBe(1);
    expect(memoryStore.transactions.length).toBe(1);
  });

  it('should still allow user creation and session creation independent of booking lock', async () => {
    const user = await createUser({ name: 'Test User', phone: '+91 98765 43210', email: 'test@example.com' });
    expect(user.id).toMatch(/^usr-/);
    const token = await createSession(user.id);
    const sessionUser = await getSessionUser(token);
    expect(sessionUser?.id).toBe(user.id);
  });

  it('should return HTTP 503 contract shape from feature flag', () => {
    expect(BOOKINGS_ERROR.code).toBe('BOOKINGS_NOT_AVAILABLE');
    expect(typeof BOOKINGS_ERROR.message).toBe('string');
    expect(BOOKINGS_ERROR.message.length).toBeGreaterThan(0);
  });
});