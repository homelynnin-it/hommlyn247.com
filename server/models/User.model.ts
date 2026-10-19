import { UserProfile } from '../../src/types';
import { getMongoDb } from '../db/connection';
import { memoryStore } from '../db/memoryStore';

export async function getUsers(): Promise<UserProfile[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const items = await mongoDb.collection('users').find({}).toArray();
      if (items.length > 0) return items as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo read users failed:', err);
    }
  }
  return memoryStore.users;
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const u = await mongoDb.collection('users').findOne({ id });
      if (u) return u as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo read user failed:', err);
    }
  }
  return memoryStore.users.find(u => u.id === id) || null;
}

export async function createUser(userData: Partial<UserProfile>): Promise<UserProfile> {
  const mongoDb = getMongoDb();
  const newUser: UserProfile = {
    id: userData.id || `usr-${Date.now()}`,
    name: userData.name || 'Valued Resident',
    email: userData.email || 'customer@hommlyn247.com',
    phone: userData.phone || '+91 98765 00000',
    address: userData.address || 'Koramangala, Bangalore',
    city: userData.city || 'Bangalore',
    pincode: userData.pincode || '560034',
    role: userData.role || 'client',
    joinedDate: userData.joinedDate || new Date().toISOString().split('T')[0]
  };

  memoryStore.users.unshift(newUser);
  if (mongoDb) {
    try {
      await mongoDb.collection('users').insertOne({ ...newUser } as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createUser failed:', err);
    }
  }
  return newUser;
}

export async function updateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const mongoDb = getMongoDb();
  const index = memoryStore.users.findIndex(u => u.id === id);
  if (index === -1) return null;

  memoryStore.users[index] = { ...memoryStore.users[index], ...updates };
  const updated = memoryStore.users[index];

  if (mongoDb) {
    try {
      await mongoDb.collection('users').updateOne({ id }, { $set: updates });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateUser failed:', err);
    }
  }
  return updated;
}

export async function deleteUser(id: string): Promise<boolean> {
  const mongoDb = getMongoDb();
  const initialLen = memoryStore.users.length;
  memoryStore.users = memoryStore.users.filter(u => u.id !== id);
  const deleted = memoryStore.users.length < initialLen;

  if (mongoDb) {
    try {
      await mongoDb.collection('users').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deleteUser failed:', err);
    }
  }
  return deleted;
}
