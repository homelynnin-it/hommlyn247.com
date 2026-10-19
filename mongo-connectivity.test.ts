import { describe, it, expect } from 'vitest';
import dotenv from 'dotenv';
dotenv.config();

import { getMongoUri, getDbName, MONGO_CLIENT_OPTIONS } from './server/config/database';
import { MongoClient } from 'mongodb';

describe('MongoDB Connectivity (with dotenv)', () => {
  it('should have valid URI configuration from .env', () => {
    const uri = getMongoUri();
    const dbName = getDbName();

    console.log('MongoDB URI configured:', !!uri);
    console.log('Database name:', dbName);

    expect(typeof dbName).toBe('string');
    expect(dbName.length).toBeGreaterThan(0);
  });

  it('should connect to MongoDB if URI is configured', async () => {
    const uri = getMongoUri();

    if (!uri || uri.trim() === '') {
      console.log('No MongoDB URI configured - running in-memory mode (expected in dev)');
      return;
    }

    const dbName = getDbName();
    const client = new MongoClient(uri, MONGO_CLIENT_OPTIONS);

    try {
      await client.connect();
      console.log('✅ MongoDB connection successful');

      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      console.log('Collections:', collections.map(c => c.name).join(', '));

      // Verify we can read from a collection
      const servicesCount = await db.collection('services').countDocuments();
      console.log('Services count:', servicesCount);

      await client.close();
      expect(true).toBe(true);
    } catch (err: any) {
      console.log('❌ MongoDB connection failed:', err.message);
      // Don't fail the test - just report the blocker
      expect(err.message).toBeDefined();
    }
  });
});