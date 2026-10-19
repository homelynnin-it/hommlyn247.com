import { Helper } from '../../src/types';
import { getMongoDb } from '../db/connection';
import { memoryStore } from '../db/memoryStore';

export async function getHelpers(category?: string): Promise<Helper[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const query = category && category !== 'all' ? { category } : {};
      const items = await mongoDb.collection('helpers').find(query).toArray();
      if (items.length > 0) return items as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo read helpers failed:', err);
    }
  }
  if (category && category !== 'all') {
    return memoryStore.helpers.filter(h => h.category === category);
  }
  return memoryStore.helpers;
}

export async function getHelperById(id: string): Promise<Helper | null> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const h = await mongoDb.collection('helpers').findOne({ id });
      if (h) return h as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo getHelperById failed:', err);
    }
  }
  return memoryStore.helpers.find(h => h.id === id) || null;
}

export async function createHelper(helperData: Partial<Helper>): Promise<Helper> {
  const mongoDb = getMongoDb();
  const newHelper: Helper = {
    id: helperData.id || `hlp-${Date.now()}`,
    name: helperData.name || 'Domestic Professional',
    category: helperData.category || 'maid',
    categoryTitle: helperData.categoryTitle || (helperData.category || 'maid').toUpperCase(),
    photoUrl: helperData.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    rating: helperData.rating || 5.0,
    completedJobs: helperData.completedJobs || 0,
    experienceYears: Number(helperData.experienceYears) || 3,
    languages: helperData.languages || ['Hindi', 'English'],
    hourlyRate: Number(helperData.hourlyRate) || 299,
    isAvailable: helperData.isAvailable ?? true,
    policeVerified: helperData.policeVerified ?? true,
    aadharVerified: helperData.aadharVerified ?? true,
    trainingCertified: helperData.trainingCertified ?? true,
    healthCheckPassed: helperData.healthCheckPassed ?? true,
    location: helperData.location || 'Bangalore Central Hub',
    currentEtaMinutes: helperData.currentEtaMinutes || 15,
    bio: helperData.bio || 'Verified workforce professional registered on hommlyn247 network.',
    phone: helperData.phone || '+91 98765 00000'
  };

  memoryStore.helpers.unshift(newHelper);
  if (mongoDb) {
    try {
      await mongoDb.collection('helpers').insertOne({ ...newHelper } as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createHelper failed:', err);
    }
  }
  return newHelper;
}

export async function updateHelper(id: string, updates: Partial<Helper>): Promise<Helper | null> {
  const mongoDb = getMongoDb();
  const index = memoryStore.helpers.findIndex(h => h.id === id);
  if (index === -1) return null;

  memoryStore.helpers[index] = { ...memoryStore.helpers[index], ...updates };
  const updated = memoryStore.helpers[index];

  if (mongoDb) {
    try {
      await mongoDb.collection('helpers').updateOne({ id }, { $set: updates });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateHelper failed:', err);
    }
  }
  return updated;
}

export async function deleteHelper(id: string): Promise<boolean> {
  const mongoDb = getMongoDb();
  const initialLength = memoryStore.helpers.length;
  memoryStore.helpers = memoryStore.helpers.filter(h => h.id !== id);
  const deleted = memoryStore.helpers.length < initialLength;

  if (mongoDb) {
    try {
      await mongoDb.collection('helpers').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deleteHelper failed:', err);
    }
  }
  return deleted;
}
