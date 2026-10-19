import { CarePlan } from '../../src/types';
import { getMongoDb } from '../db/connection';
import { memoryStore } from '../db/memoryStore';

export async function getCarePlans(): Promise<CarePlan[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const plans = await mongoDb.collection('careplans').find({}).toArray();
      if (plans.length > 0) return plans as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Failed reading care plans from Mongo:', err);
    }
  }
  return memoryStore.carePlans;
}

export async function getCarePlanById(id: string): Promise<CarePlan | null> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const found = await mongoDb.collection('careplans').findOne({ id });
      if (found) return found as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Failed finding care plan in Mongo:', err);
    }
  }
  return memoryStore.carePlans.find(p => p.id === id) || null;
}

export async function createCarePlan(planData: Partial<CarePlan>): Promise<CarePlan> {
  const mongoDb = getMongoDb();
  const newPlan: CarePlan = {
    id: planData.id || `care-${Date.now()}`,
    code: planData.code || 'CARE CUSTOM',
    title: planData.title || 'Staff Warranty CarePlan',
    durationMonths: Number(planData.durationMonths) || 6,
    badge: planData.badge || 'GUARANTEED',
    price: Number(planData.price) || 4999,
    isPopular: !!planData.isPopular,
    validityText: planData.validityText || `For ${planData.durationMonths || 6} Months Plan`,
    features: planData.features?.length ? planData.features : [
      'Free replacement if staff leaves without prior information',
      'Free replacement if performance does not meet expectations',
      'Dedicated support throughout the plan period'
    ],
    category: planData.category
  };

  memoryStore.carePlans.push(newPlan);
  if (mongoDb) {
    try {
      await mongoDb.collection('careplans').insertOne({ ...newPlan } as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createCarePlan failed:', err);
    }
  }
  return newPlan;
}

export async function updateCarePlan(id: string, updates: Partial<CarePlan>): Promise<CarePlan | null> {
  const mongoDb = getMongoDb();
  const index = memoryStore.carePlans.findIndex(p => p.id === id);
  if (index === -1) return null;

  memoryStore.carePlans[index] = { ...memoryStore.carePlans[index], ...updates };
  const updated = memoryStore.carePlans[index];

  if (mongoDb) {
    try {
      await mongoDb.collection('careplans').updateOne({ id }, { $set: updates });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateCarePlan failed:', err);
    }
  }
  return updated;
}

export async function deleteCarePlan(id: string): Promise<boolean> {
  const mongoDb = getMongoDb();
  const initialLength = memoryStore.carePlans.length;
  memoryStore.carePlans = memoryStore.carePlans.filter(p => p.id !== id);
  const deleted = memoryStore.carePlans.length < initialLength;

  if (mongoDb) {
    try {
      await mongoDb.collection('careplans').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deleteCarePlan failed:', err);
    }
  }
  return deleted;
}
