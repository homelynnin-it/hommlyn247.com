import { Db } from 'mongodb';
import { INITIAL_SERVICES } from './services.seed';
import { INITIAL_HELPERS } from './helpers.seed';
import { INITIAL_BOOKINGS } from './bookings.seed';
import { INITIAL_TRANSACTIONS } from './transactions.seed';
import { INITIAL_CAREPLANS } from './careplans.seed';
import { INITIAL_COUPONS, INITIAL_ANNOUNCEMENT, INITIAL_REVIEWS } from './marketing.seed';
import { INITIAL_USERS } from './users.seed';
import { INITIAL_BRAND_ADS, INITIAL_PUSH_CAMPAIGNS } from '../../src/data/servicePresets';
import { INITIAL_LEADS } from '../../src/data/leadsPresets';

export {
  INITIAL_SERVICES,
  INITIAL_HELPERS,
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_CAREPLANS,
  INITIAL_COUPONS,
  INITIAL_ANNOUNCEMENT,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_BRAND_ADS,
  INITIAL_PUSH_CAMPAIGNS,
  INITIAL_LEADS
};

export async function seedMongoIfEmpty(db: Db): Promise<void> {
  try {
    const servicesCount = await db.collection('services').countDocuments();
    if (servicesCount === 0) {
      await db.collection('services').insertMany(INITIAL_SERVICES as any);
      console.log('[hommlyn247 DB] Seeded initial services into MongoDB');
    }

    const helpersCount = await db.collection('helpers').countDocuments();
    if (helpersCount === 0) {
      await db.collection('helpers').insertMany(INITIAL_HELPERS as any);
      console.log('[hommlyn247 DB] Seeded initial helpers into MongoDB');
    }

    const bookingsCount = await db.collection('bookings').countDocuments();
    if (bookingsCount === 0) {
      await db.collection('bookings').insertMany(INITIAL_BOOKINGS as any);
      console.log('[hommlyn247 DB] Seeded initial bookings into MongoDB');
    }

    const txnCount = await db.collection('transactions').countDocuments();
    if (txnCount === 0) {
      await db.collection('transactions').insertMany(INITIAL_TRANSACTIONS as any);
      console.log('[hommlyn247 DB] Seeded initial transactions into MongoDB');
    }

    const usersCount = await db.collection('users').countDocuments();
    if (usersCount === 0) {
      await db.collection('users').insertMany(INITIAL_USERS as any);
      console.log('[hommlyn247 DB] Seeded initial users into MongoDB');
    }

    const careCount = await db.collection('careplans').countDocuments();
    if (careCount === 0) {
      await db.collection('careplans').insertMany(INITIAL_CAREPLANS as any);
      console.log('[hommlyn247 DB] Seeded initial careplans into MongoDB');
    }

    const couponCount = await db.collection('coupons').countDocuments();
    if (couponCount === 0) {
      await db.collection('coupons').insertMany(INITIAL_COUPONS as any);
      console.log('[hommlyn247 DB] Seeded initial coupons into MongoDB');
    }

    const adsCount = await db.collection('brand_ads').countDocuments();
    if (adsCount === 0) {
      await db.collection('brand_ads').insertMany(INITIAL_BRAND_ADS as any);
      console.log('[hommlyn247 DB] Seeded initial brand ads into MongoDB');
    }

    const pushCount = await db.collection('push_campaigns').countDocuments();
    if (pushCount === 0) {
      await db.collection('push_campaigns').insertMany(INITIAL_PUSH_CAMPAIGNS as any);
      console.log('[hommlyn247 DB] Seeded initial push campaigns into MongoDB');
    }

    const leadsCount = await db.collection('leads').countDocuments();
    if (leadsCount === 0) {
      await db.collection('leads').insertMany(INITIAL_LEADS as any);
      console.log('[hommlyn247 DB] Seeded initial telecalling CRM leads into MongoDB');
    }
  } catch (err) {
    console.error('[hommlyn247 DB] Error seeding MongoDB:', err);
  }
}
