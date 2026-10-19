import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { memoryStore } from './server/db/memoryStore';
import { createBooking, getBookings } from './server/models/Booking.model';
import { createService } from './server/models/Service.model';
import { isBookingsEnabled, BOOKINGS_ERROR } from './server/config/featureFlags';
import { getMongoDb, getDbStatus } from './server/db/connection';

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

describe('Vercel / Serverless Compatibility', () => {
  it('should keep public read-only service endpoints accessible without Mongo', async () => {
    const { getServices } = await import('./server/models/Service.model');
    const services = await getServices();
    expect(services.length).toBeGreaterThan(0);
  });

  it('should expose the Vercel API handler module', async () => {
    const handler = await import('./api/index.js');
    expect(typeof handler.default).toBe('function');
  });
});

describe('Production Persistence Failure Behavior', () => {
  it('should report in-memory fallback without claiming durable persistence', async () => {
    const status = await getDbStatus();
    expect(status.connected).toBe(false);
    expect(status.mode).not.toBe('mongodb');
  });

  it('should fail closed for booking creation when bookings are locked', async () => {
    await expect(createBooking({ category: 'maid' })).rejects.toMatchObject({ code: BOOKINGS_ERROR.code });
  });

  it('should not silently persist a booking when Mongo is unavailable', async () => {
    const before = memoryStore.bookings.length;
    await expect(getBookings()).rejects.toMatchObject({ code: BOOKINGS_ERROR.code });
    expect(memoryStore.bookings.length).toBe(before);
  });

  it('should keep BOOKINGS_ENABLED=false by default', () => {
    expect(isBookingsEnabled()).toBe(false);
  });
});