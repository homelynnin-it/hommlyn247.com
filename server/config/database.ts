import { MongoClientOptions } from 'mongodb';

export function getMongoUri(): string | undefined {
  return process.env.DATABASE_URL || process.env.MONGODB_URI;
}

export function getDbName(): string {
  return process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || 'hommlyn247';
}

export const MONGO_CLIENT_OPTIONS: MongoClientOptions = {
  serverSelectionTimeoutMS: 4000,
  connectTimeoutMS: 5000,
  maxPoolSize: 20,
  minPoolSize: 2,
  retryWrites: true,
};
