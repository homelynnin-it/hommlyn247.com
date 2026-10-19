export function isBookingsEnabled(): boolean {
  // Public booking default: disabled in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production') {
    return process.env.BOOKINGS_ENABLED === 'true';
  }
  // Non-production: can be enabled via env var; default disabled for showcase
  return process.env.BOOKINGS_ENABLED === 'true';
}
export const BOOKINGS_ERROR = { code: 'BOOKINGS_NOT_AVAILABLE', message: 'Bookings are temporarily unavailable. Please check back soon.' } as const;
