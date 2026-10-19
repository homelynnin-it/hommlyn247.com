/**
 * hommlyn247 Modular Database & MongoDB Client Layer
 *
 * Architecture:
 * - /server/config/database.ts -> MongoDB URI, pool, and configuration settings
 * - /server/db/connection.ts   -> Connection singleton, indexing, status & reseed routines
 * - /server/db/memoryStore.ts  -> In-memory fallback and offline cache
 * - /server/seeds/             -> Domain preset data (Services, Helpers, Bookings, CarePlans, etc.)
 * - /server/models/            -> Specialized domain models with complete MongoDB CRUD
 */

export * from './config/database';
export * from './db/connection';
export * from './db/memoryStore';
export * from './seeds';
export * from './models';
