import { isBookingsEnabled, BOOKINGS_ERROR } from '../config/featureFlags';
import crypto from 'crypto';
import { Booking, PaymentTransaction } from '../../src/types';
import { getServiceById } from './Service.model';
import { getMongoDb } from '../db/connection';
import { memoryStore } from '../db/memoryStore';

// Redact private booking fields from API responses for non-admin roles.
// Admins receive the full authoritative record; everyone else gets a privacy-safe subset.
export function sanitizeBookingForRole(booking: Booking, role?: string): Booking {
  if (role === 'admin') return booking;
  const safe: Booking = { ...booking };
  if (safe.customer) {
    safe.customer = {
      ...safe.customer,
      phone: redactPhone(safe.customer.phone),
      address: redactAddress(safe.customer.address)
    };
  }
  safe.otp = '[REDACTED]';
  if (safe.gatePassCode) safe.gatePassCode = '[REDACTED]';
  return safe;
}
function redactPhone(phone?: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length < 4) return '***';
  return `+91 ${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}
function redactAddress(address?: string): string {
  if (!address) return '';
  const parts = address.split(',');
  if (parts.length <= 1) return `${'*'.repeat(Math.min(address.length, 6))}...`;
  return `${parts[parts.length - 1].trim()}`;
}

// Server-side authoritative price calculation
export async function calculateBookingPrice(
  serviceId: string,
  packageType: 'hourly' | 'daily' | 'monthly',
  shiftMode: 'single' | 'dual' | 'triple',
  durationHours: number,
  selectedTaskIds: string[],
  promoCode?: string
): Promise<{
  baseAmount: number;
  addOnsAmount: number;
  platformFee: number;
  taxAmount: number;
  discount: number;
  total: number;
}> {
  const service = await getServiceById(serviceId);
  if (!service) {
    // Fallback defaults
    return { baseAmount: 199, addOnsAmount: 0, platformFee: 29, taxAmount: 41, discount: 50, total: 219 };
  }
  // Find tier price
  const tier = service.pricingTiers?.find(t => t.type === packageType);
  const baseRate = tier?.price ?? service.basePrice;
  // Calculate task add-ons
  const addOns = service.tasks
    .filter(t => selectedTaskIds.includes(t.id))
    .reduce((sum, t) => sum + (t.priceDelta || 0), 0);
  let subtotal = 0;
  if (packageType === 'hourly') {
    subtotal = Math.round((baseRate + addOns) * durationHours);
  } else if (packageType === 'daily') {
    const mult = shiftMode === 'dual' ? 1.25 : (shiftMode === 'triple' ? 1.75 : 1);
    subtotal = Math.round((baseRate + addOns) * mult);
  } else {
    // monthly
    const mult = shiftMode === 'dual' ? 1.75 : (shiftMode === 'triple' ? 2.45 : 1);
    subtotal = Math.round((baseRate * mult) + (addOns * (shiftMode === 'single' ? 10 : 15)));
  }
  const platformFee = packageType === 'monthly' ? 99 : 29;
  const taxAmount = Math.round((subtotal + platformFee) * 0.18);
  const isValidPromo = promoCode?.trim().toUpperCase() === 'SWIFT50' || promoCode?.trim().toUpperCase() === 'HOMELYNN';
  const discount = isValidPromo ? (packageType === 'monthly' ? 250 : 50) : 0;
  const packageBonus = packageType === 'daily' ? 100 : (packageType === 'monthly' ? 500 : 0);
  const total = Math.max(99, subtotal + platformFee + taxAmount - discount - packageBonus);
  return {
    baseAmount: baseRate,
    addOnsAmount: addOns,
    platformFee,
    taxAmount,
    discount,
    total
  };
}
export async function getBookings(options: { bypassLock?: boolean } = {}): Promise<Booking[]> {
  if (!options.bypassLock) {
    await requireBookingsEnabled();
  }
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const items = await mongoDb.collection('bookings').find({}).sort({ createdAt: -1 }).toArray();
      if (items.length > 0) return items as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo read bookings failed:', err);
    }
  }
  return [...memoryStore.bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
export async function getBookingById(id: string): Promise<Booking | null> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const found = await mongoDb.collection("bookings").findOne({ id });
      if (found) return found as any;
    } catch (err) {
      console.error("[hommlyn247 DB] Error finding booking in Mongo:", err);
    }
  }
  return memoryStore.bookings.find(b => b.id === id) || null;
}
export async function requireBookingsEnabled() {
  if (!isBookingsEnabled()) {
    const err: any = new Error(BOOKINGS_ERROR.message);
    err.code = BOOKINGS_ERROR.code;
    throw err;
  }
}
export async function createBooking(data: Partial<Booking>, options: { bypassLock?: boolean } = {}): Promise<Booking> {
  if (!options.bypassLock) {
    await requireBookingsEnabled();
  }
  const mongoDb = getMongoDb();
  const newBookingId = `SWIFT-${crypto.randomInt(1000, 10000)}`;
  const otp = crypto.randomInt(1000, 10000).toString();
  const now = new Date().toISOString();
  // Pick suitable helper if not assigned
  let matchedHelper = data.helper;
  if (!matchedHelper && data.category) {
    const available = memoryStore.helpers.filter(h => h.category === data.category && h.isAvailable);
    matchedHelper = available[0] || memoryStore.helpers[0];
  }
  const booking: Booking = {
    id: newBookingId,
    userId: data.userId,
    serviceId: data.serviceId || 'srv-maid-hourly',
    category: data.category || 'maid',
    serviceTitle: data.serviceTitle || 'Home Service',
    bookingType: data.bookingType || 'instant',
    scheduledDate: data.scheduledDate || now.split('T')[0],
    scheduledTimeSlot: data.scheduledTimeSlot || 'Instant Dispatch (10-15 mins)',
    durationHours: data.durationHours || 1,
    frequency: data.frequency || 'one-time',
    selectedTasks: data.selectedTasks || [],
    customer: data.customer || {
      name: 'Valued Customer',
      phone: '+91 99999 88888',
      address: 'Near City Center',
      houseNumber: '101',
      city: 'Bangalore',
      pincode: '560001'
    },
    helper: matchedHelper,
    status: data.status || 'assigned',
    otp: otp,
    gatePassCode: data.gatePassCode || `GATE-${crypto.randomInt(1000, 9999)}`,
    packageType: data.packageType || 'hourly',
    shiftMode: data.shiftMode || 'single',
    visitsPerDay: data.visitsPerDay || 1,
    timeSlots: data.timeSlots || (data.scheduledTimeSlot ? [data.scheduledTimeSlot] : []),
    morningSlot: data.morningSlot,
    eveningSlot: data.eveningSlot,
    afternoonSlot: data.afternoonSlot,
    templateName: data.templateName,
    paymentStatus: 'pending' as const,
    paymentMethod: data.paymentMethod || 'upi',
    pricing: await calculateBookingPrice(
      data.serviceId || "srv-maid-hourly",
      data.packageType || "hourly",
      data.shiftMode || "single",
      data.durationHours || 1,
      ((data as any).selectedTasks || []).map(t => typeof t === "string" ? t : t.id).filter(Boolean),
      (data as any).promoCode
    ),
    createdAt: now,
    updatedAt: now,
    notes: data.notes || ''
  };
  // Persist to memory
  memoryStore.bookings.unshift(booking);
  // Record Transaction
const newTxn: PaymentTransaction = {
    id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    bookingId: booking.id,
    userId: booking.userId,
    amount: booking.pricing.total,
    currency: 'INR',
    method: booking.paymentMethod,
    status: booking.paymentStatus === 'paid' ? 'success' : 'pending',
    referenceId: `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}/swiftly`,
    upiId: `${booking.customer.phone}@upi`,
    serviceTitle: booking.serviceTitle,
    customerName: booking.customer.name,
    timestamp: now
  };
  memoryStore.transactions.unshift(newTxn);
  // Persist to Mongo if available
  if (mongoDb) {
    try {
      await mongoDb.collection('bookings').insertOne({ ...booking } as any);
      await mongoDb.collection('transactions').insertOne({ ...newTxn } as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Failed saving booking to MongoDB:', err);
      throw new Error('Database write failed - booking not persisted');
    }
  }
  return booking;
}
export async function updateBooking(id: string, updates: Partial<Booking>, options: { bypassLock?: boolean } = {}): Promise<Booking | null> {
  if (!options.bypassLock) {
    await requireBookingsEnabled();
  }
  const mongoDb = getMongoDb();
  const index = memoryStore.bookings.findIndex(b => b.id === id);
  if (index === -1) return null;
  memoryStore.bookings[index] = { ...memoryStore.bookings[index], ...updates, updatedAt: new Date().toISOString() };
  const updated = memoryStore.bookings[index];
  if (mongoDb) {
    try {
      await mongoDb.collection('bookings').updateOne({ id }, { $set: { ...updates, updatedAt: new Date().toISOString() } });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateBooking failed:', err);
      throw new Error('Database write failed - update not persisted');
    }
  }
  return updated;
}
export async function updateBookingStatus(
  id: string,
  newStatus: Booking['status'],
  otpInput?: string,
  options: { bypassLock?: boolean } = {}
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  if (!options.bypassLock) {
    await requireBookingsEnabled();
  }
  const mongoDb = getMongoDb();
  let booking = memoryStore.bookings.find(b => b.id === id);
  if (mongoDb && !booking) {
    try {
      const found = await mongoDb.collection('bookings').findOne({ id });
      if (found) booking = found as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Error finding booking in Mongo:', err);
    }
  }
  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }
  // If changing to in_progress, verify OTP securely without leaking expected value
  if (newStatus === 'in_progress') {
    if (!otpInput || String(otpInput).trim() === '') {
      return { success: false, error: 'OTP is required to start the job.' };
    }
    if (String(otpInput) !== booking.otp) {
      return { success: false, error: 'Invalid OTP.' };
    }
  }
  booking.status = newStatus;
  booking.updatedAt = new Date().toISOString();
  if (mongoDb) {
    try {
      await mongoDb.collection('bookings').updateOne(
        { id },
        { $set: { status: newStatus, updatedAt: booking.updatedAt } }
      );
    } catch (err) {
      console.error('[hommlyn247 DB] Error updating status in Mongo:', err);
      throw new Error('Database write failed - status update not persisted');
    }
  }
  return { success: true, booking };
}
export async function deleteBooking(id: string, options: { bypassLock?: boolean } = {}): Promise<boolean> {
  if (!options.bypassLock) {
    await requireBookingsEnabled();
  }
  const mongoDb = getMongoDb();
  const initialLength = memoryStore.bookings.length;
  memoryStore.bookings = memoryStore.bookings.filter(b => b.id !== id);
  const deleted = memoryStore.bookings.length < initialLength;
  if (mongoDb) {
    try {
      await mongoDb.collection('bookings').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deleteBooking failed:', err);
      throw new Error('Database write failed - delete not persisted');
    }
  }
  return deleted;
}
