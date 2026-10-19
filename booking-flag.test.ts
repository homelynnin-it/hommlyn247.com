import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isBookingsEnabled, BOOKINGS_ERROR } from './server/config/featureFlags';

const originalEnv = { ...process.env };

describe('Booking Feature Flag', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should be disabled in production by default', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.BOOKINGS_ENABLED;
    expect(isBookingsEnabled()).toBe(false);
  });

  it('should respect BOOKING_ENABLED=false in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.BOOKINGS_ENABLED = 'false';
    expect(isBookingsEnabled()).toBe(false);
  });

  it('should be enabled in production when explicitly set to true', () => {
    process.env.NODE_ENV = 'production';
    process.env.BOOKINGS_ENABLED = 'true';
    expect(isBookingsEnabled()).toBe(true);
  });

  it('should be disabled in non-production by default for showcase', () => {
    process.env.NODE_ENV = 'test';
    delete process.env.BOOKINGS_ENABLED;
    expect(isBookingsEnabled()).toBe(false);
  });

  it('should be enabled in non-production when explicitly set', () => {
    process.env.NODE_ENV = 'development';
    process.env.BOOKINGS_ENABLED = 'true';
    expect(isBookingsEnabled()).toBe(true);
  });

  it('should have stable error code', () => {
    expect(BOOKINGS_ERROR.code).toBe('BOOKINGS_NOT_AVAILABLE');
    expect(BOOKINGS_ERROR.message).toBeDefined();
  });
});
