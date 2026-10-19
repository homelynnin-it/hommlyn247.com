import { MongoClient, Db } from 'mongodb';
import { getMongoUri, getDbName, MONGO_CLIENT_OPTIONS } from '../config/database';
import { memoryStore } from './memoryStore';
import {
  seedMongoIfEmpty,
  INITIAL_SERVICES,
  INITIAL_HELPERS,
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_CAREPLANS,
  INITIAL_COUPONS,
  INITIAL_ANNOUNCEMENT,
  INITIAL_REVIEWS,
  INITIAL_USERS
} from '../seeds';
import { MongoDbStatus } from '../../src/types';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let isMongoConnecting = false;
let mongoConnectionError: string | null = null;

export function getMongoDb(): Db | null {
  return mongoDb;
}

export function getMongoClient(): MongoClient | null {
  return mongoClient;
}

export async function initMongo(): Promise<boolean> {
  const uri = getMongoUri();
  if (!uri || uri.trim() === '') {
    mongoConnectionError = 'Local memory store active. Connect DATABASE_URL or MONGODB_URI when ready.';
    return false;
  }

  if (mongoDb) return true;
  if (isMongoConnecting) return false;

  isMongoConnecting = true;
  try {
    const dbName = getDbName();
    mongoClient = new MongoClient(uri, MONGO_CLIENT_OPTIONS);
    await mongoClient.connect();
    mongoDb = mongoClient.db(dbName);
    mongoConnectionError = null;
    console.log(`[hommlyn247 DB] Successfully connected to MongoDB database: "${dbName}"`);

    // Ensure production indexing
    await ensureMongoIndexes();

    // Auto-seed collection templates if database is fresh
    await seedMongoIfEmpty(mongoDb);

    return true;
  } catch (err: any) {
    mongoConnectionError = err?.message || 'Failed to connect to MongoDB';
    console.warn(`[hommlyn247 DB] MongoDB connection failed (${mongoConnectionError}). Running in high-performance in-memory mode.`);
    mongoClient = null;
    mongoDb = null;
    return false;
  } finally {
    isMongoConnecting = false;
  }
}

export async function closeMongo(): Promise<void> {
  if (mongoClient) {
    try {
      await mongoClient.close();
      console.log('[hommlyn247 DB] MongoDB connection closed.');
    } catch (err) {
      console.error('[hommlyn247 DB] Error closing MongoDB:', err);
    } finally {
      mongoClient = null;
      mongoDb = null;
    }
  }
}

export async function ensureMongoIndexes(): Promise<void> {
  if (!mongoDb) return;
  try {
    await mongoDb.collection('users').createIndex({ email: 1 }, { sparse: true });
    await mongoDb.collection('users').createIndex({ phone: 1 }, { sparse: true });

    await mongoDb.collection('auth_credentials').createIndex({ userId: 1 }, { unique: true });
    await mongoDb.collection('auth_credentials').createIndex({ email: 1 }, { sparse: true });
    await mongoDb.collection('auth_credentials').createIndex({ phone: 1 }, { sparse: true });

    await mongoDb.collection('sessions').createIndex({ tokenHash: 1 }, { unique: true });
    await mongoDb.collection('sessions').createIndex({ userId: 1 });
    await mongoDb.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    await mongoDb.collection('bookings').createIndex({ userId: 1 });
    await mongoDb.collection('bookings').createIndex({ id: 1 });
    await mongoDb.collection('bookings').createIndex({ status: 1 });
    await mongoDb.collection('bookings').createIndex({ createdAt: -1 });

    await mongoDb.collection('transactions').createIndex({ userId: 1 });
    await mongoDb.collection('transactions').createIndex({ bookingId: 1 });
    await mongoDb.collection('transactions').createIndex({ id: 1 });
  } catch (err) {
    console.warn('[hommlyn247 DB] Index creation notice:', err);
  }
}

export async function getDbStatus(): Promise<MongoDbStatus> {
  const uriConfigured = !!getMongoUri();
  const isConnected = !!mongoDb;

  let servicesCount = memoryStore.services.length;
  let helpersCount = memoryStore.helpers.length;
  let bookingsCount = memoryStore.bookings.length;
  let transactionsCount = memoryStore.transactions.length;
  let usersCount = memoryStore.users.length;

  if (mongoDb) {
    try {
      servicesCount = await mongoDb.collection('services').countDocuments();
      helpersCount = await mongoDb.collection('helpers').countDocuments();
      bookingsCount = await mongoDb.collection('bookings').countDocuments();
      transactionsCount = await mongoDb.collection('transactions').countDocuments();
      usersCount = await mongoDb.collection('users').countDocuments();
    } catch (err) {
      console.warn('[hommlyn247 DB] Error counting Mongo documents:', err);
    }
  }

  return {
    connected: isConnected,
    mode: isConnected ? 'mongodb' : 'in-memory-fallback',
    databaseName: getDbName(),
    uriConfigured,
    lastChecked: new Date().toISOString(),
    error: mongoConnectionError || undefined,
    stats: {
      servicesCount,
      helpersCount,
      bookingsCount,
      transactionsCount
    }
  };
}

export async function reseedDb(): Promise<{ success: boolean; message: string }> {
  memoryStore.services = [...INITIAL_SERVICES];
  memoryStore.helpers = [...INITIAL_HELPERS];
  memoryStore.bookings = [...INITIAL_BOOKINGS];
  memoryStore.transactions = [...INITIAL_TRANSACTIONS];
  memoryStore.carePlans = [...INITIAL_CAREPLANS];
  memoryStore.coupons = [...INITIAL_COUPONS];
  memoryStore.announcement = { ...INITIAL_ANNOUNCEMENT };
  memoryStore.reviews = [...INITIAL_REVIEWS];
  memoryStore.users = [...INITIAL_USERS];

  if (mongoDb) {
    try {
      await mongoDb.collection('services').deleteMany({});
      await mongoDb.collection('helpers').deleteMany({});
      await mongoDb.collection('bookings').deleteMany({});
      await mongoDb.collection('transactions').deleteMany({});
      await mongoDb.collection('careplans').deleteMany({});
      await mongoDb.collection('coupons').deleteMany({});
      await mongoDb.collection('reviews').deleteMany({});
      await mongoDb.collection('users').deleteMany({});

      await mongoDb.collection('services').insertMany(INITIAL_SERVICES as any);
      await mongoDb.collection('helpers').insertMany(INITIAL_HELPERS as any);
      await mongoDb.collection('bookings').insertMany(INITIAL_BOOKINGS as any);
      await mongoDb.collection('transactions').insertMany(INITIAL_TRANSACTIONS as any);
      await mongoDb.collection('careplans').insertMany(INITIAL_CAREPLANS as any);
      await mongoDb.collection('coupons').insertMany(INITIAL_COUPONS as any);
      await mongoDb.collection('reviews').insertMany(INITIAL_REVIEWS as any);
      await mongoDb.collection('users').insertMany(INITIAL_USERS as any);
      return { success: true, message: 'MongoDB successfully re-seeded with fresh records.' };
    } catch (err: any) {
      return { success: false, message: `MongoDB reseed error: ${err.message}` };
    }
  }

  return { success: true, message: 'In-memory database re-seeded successfully.' };
}
