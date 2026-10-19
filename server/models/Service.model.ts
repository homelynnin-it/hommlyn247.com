import { ServiceItem } from '../../src/types';
import { getMongoDb } from '../db/connection';
import { memoryStore } from '../db/memoryStore';

export async function getServices(): Promise<ServiceItem[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const items = await mongoDb.collection('services').find({}).toArray();
      if (items.length > 0) return items as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo read services failed, falling back to memory store:', err);
    }
  }
  return memoryStore.services;
}

export async function getServiceById(id: string): Promise<ServiceItem | null> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const item = await mongoDb.collection('services').findOne({ id });
      if (item) return item as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo getServiceById failed:', err);
    }
  }
  return memoryStore.services.find(s => s.id === id) || null;
}

export async function createService(serviceData: Partial<ServiceItem>): Promise<ServiceItem> {
  const mongoDb = getMongoDb();
  const newService: ServiceItem = {
    id: serviceData.id || `srv-${Date.now()}`,
    category: serviceData.category || 'maid',
    title: serviceData.title || 'New Domestic Service',
    subtitle: serviceData.subtitle || 'Professional home service',
    tagline: serviceData.tagline || '15 Min Arrival Guarantee',
    basePrice: Number(serviceData.basePrice) || 199,
    unit: serviceData.unit || 'per visit',
    badge: serviceData.badge || '15 Min Arrival',
    eta: serviceData.eta || '12-15 mins',
    rating: 5.0,
    reviewsCount: 1,
    availableCount: 10,
    iconName: serviceData.iconName || 'Sparkles',
    imageUrl: serviceData.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    popular: !!serviceData.popular,
    equipmentProvided: serviceData.equipmentProvided ?? true,
    includedHighlights: serviceData.includedHighlights?.length ? serviceData.includedHighlights : [
      'Police & Biometric Verified Professional',
      'Doorstep Start-Job Security OTP',
      'CarePlans Warranty Backed'
    ],
    tasks: serviceData.tasks?.length ? serviceData.tasks : [
      { id: 't-default-1', name: 'Primary Service Delivery', priceDelta: 0, defaultChecked: true },
      { id: 't-default-2', name: 'Sanitization & Post-Job Cleanup', priceDelta: 49, defaultChecked: false }
    ],
    pricingTiers: serviceData.pricingTiers
  };

  memoryStore.services.unshift(newService);
  if (mongoDb) {
    try {
      await mongoDb.collection('services').insertOne({ ...newService } as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createService failed:', err);
    }
  }
  return newService;
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem | null> {
  const mongoDb = getMongoDb();
  const index = memoryStore.services.findIndex(s => s.id === id);
  if (index === -1) return null;

  memoryStore.services[index] = { ...memoryStore.services[index], ...updates };
  const updated = memoryStore.services[index];

  if (mongoDb) {
    try {
      await mongoDb.collection('services').updateOne({ id }, { $set: updates });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateService failed:', err);
    }
  }
  return updated;
}

export async function deleteService(id: string): Promise<boolean> {
  const mongoDb = getMongoDb();
  const initialLength = memoryStore.services.length;
  memoryStore.services = memoryStore.services.filter(s => s.id !== id);
  const deleted = memoryStore.services.length < initialLength;

  if (mongoDb) {
    try {
      await mongoDb.collection('services').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deleteService failed:', err);
    }
  }
  return deleted;
}
