import { LeadClient, CallLogEntry, LeadStatus, LeadSource, ServiceCategory, Booking } from '../../src/types';
import { getMongoDb } from '../db/connection';
import { memoryStore } from '../db/memoryStore';
import { createBooking } from './Booking.model';

export async function getLeads(filter?: { status?: string; source?: string; search?: string }): Promise<LeadClient[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const query: any = {};
      if (filter?.status && filter.status !== 'all') query.status = filter.status;
      if (filter?.source && filter.source !== 'all') query.source = filter.source;
      if (filter?.search) {
        query.$or = [
          { name: { $regex: filter.search, $options: 'i' } },
          { phone: { $regex: filter.search, $options: 'i' } },
          { societyOrLocality: { $regex: filter.search, $options: 'i' } },
          { requirementDescription: { $regex: filter.search, $options: 'i' } }
        ];
      }
      const leads = await mongoDb.collection('leads').find(query).sort({ updatedAt: -1 }).toArray();
      if (leads.length > 0) return leads as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo getLeads failed, fallback to memory:', err);
    }
  }

  let result = [...memoryStore.leads];
  if (filter?.status && filter.status !== 'all') {
    result = result.filter(l => l.status === filter.status);
  }
  if (filter?.source && filter.source !== 'all') {
    result = result.filter(l => l.source === filter.source);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.societyOrLocality.toLowerCase().includes(q) ||
      l.requirementDescription.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function getLeadById(id: string): Promise<LeadClient | null> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const lead = await mongoDb.collection('leads').findOne({ id });
      if (lead) return lead as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo getLeadById failed:', err);
    }
  }
  return memoryStore.leads.find(l => l.id === id) || null;
}

export async function createLead(leadData: Partial<LeadClient>): Promise<LeadClient> {
  const mongoDb = getMongoDb();
  const newLead: LeadClient = {
    id: `lead-${Date.now()}`,
    name: leadData.name || 'New Inbound Inquirer',
    phone: leadData.phone || '+91 ',
    email: leadData.email,
    address: leadData.address || '',
    societyOrLocality: leadData.societyOrLocality || 'Bangalore Gated Society',
    city: leadData.city || 'Bangalore',
    pincode: leadData.pincode || '560001',
    source: leadData.source || 'direct_call',
    requirementCategory: leadData.requirementCategory || 'maid',
    requirementDescription: leadData.requirementDescription || 'Domestic helper requirement',
    shiftPreference: leadData.shiftPreference || 'part_time_morning',
    budgetExpectation: leadData.budgetExpectation || 'Market Rate',
    priority: leadData.priority || 'hot',
    status: leadData.status || 'new',
    assignedTelecaller: leadData.assignedTelecaller || 'Priya Sharma (Senior Telecaller)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nextFollowUpDate: leadData.nextFollowUpDate || 'Today within 2 hours',
    callLogs: leadData.callLogs || [],
    tags: leadData.tags || ['New Lead', leadData.source || 'Inbound']
  };

  memoryStore.leads.unshift(newLead);

  if (mongoDb) {
    try {
      await mongoDb.collection('leads').insertOne(newLead as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createLead failed:', err);
    }
  }
  return newLead;
}

export async function updateLead(id: string, updates: Partial<LeadClient>): Promise<LeadClient | null> {
  const mongoDb = getMongoDb();
  const index = memoryStore.leads.findIndex(l => l.id === id);
  if (index === -1) return null;

  const updatedLead = {
    ...memoryStore.leads[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  memoryStore.leads[index] = updatedLead;

  if (mongoDb) {
    try {
      await mongoDb.collection('leads').updateOne({ id }, { $set: { ...updates, updatedAt: updatedLead.updatedAt } });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateLead failed:', err);
    }
  }
  return updatedLead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const mongoDb = getMongoDb();
  const initial = memoryStore.leads.length;
  memoryStore.leads = memoryStore.leads.filter(l => l.id !== id);
  const deleted = memoryStore.leads.length < initial;

  if (mongoDb) {
    try {
      await mongoDb.collection('leads').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deleteLead failed:', err);
    }
  }
  return deleted;
}

export async function addLeadCallLog(id: string, logData: Partial<CallLogEntry> & { newStatus?: LeadStatus }): Promise<LeadClient | null> {
  const mongoDb = getMongoDb();
  const lead = memoryStore.leads.find(l => l.id === id);
  if (!lead) return null;

  const newLog: CallLogEntry = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    telecallerName: logData.telecallerName || lead.assignedTelecaller || 'Telecalling Desk',
    callOutcome: logData.callOutcome || 'connected',
    notes: logData.notes || 'Spoke to client regarding helper requirement.',
    nextFollowUpDate: logData.nextFollowUpDate
  };

  lead.callLogs.unshift(newLog);
  lead.updatedAt = new Date().toISOString();
  if (logData.nextFollowUpDate) {
    lead.nextFollowUpDate = logData.nextFollowUpDate;
  }
  if (logData.newStatus) {
    lead.status = logData.newStatus;
  } else if (logData.callOutcome === 'converted') {
    lead.status = 'converted';
  } else if (logData.callOutcome === 'rejected') {
    lead.status = 'lost';
  } else if (lead.status === 'new') {
    lead.status = 'contacted';
  }

  if (mongoDb) {
    try {
      await mongoDb.collection('leads').updateOne(
        { id },
        {
          $push: { callLogs: { $each: [newLog], $position: 0 } } as any,
          $set: {
            updatedAt: lead.updatedAt,
            status: lead.status,
            nextFollowUpDate: lead.nextFollowUpDate
          }
        }
      );
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo addLeadCallLog failed:', err);
    }
  }
  return lead;
}

export async function convertLeadToBooking(id: string, bookingDetails?: any): Promise<{ lead: LeadClient; bookingId: string; booking: Booking } | null> {
  const mongoDb = getMongoDb();
  const lead = memoryStore.leads.find(l => l.id === id);
  if (!lead) return null;

  // Resolve matching category & service
  let category: ServiceCategory = 'maid';
  if (lead.requirementCategory === 'cook') category = 'cook';
  else if (lead.requirementCategory === 'nanny') category = 'nanny';
  else if (lead.requirementCategory === 'eldercare') category = 'eldercare';
  else if (lead.requirementCategory === 'driver') category = 'driver';
  else if (lead.requirementCategory === 'all_rounder') category = 'maid';

  const matchedService = memoryStore.services.find(s => s.category === category) || memoryStore.services[0];

  // Resolve matching helper if requested
  let matchedHelper = bookingDetails?.helperId
    ? memoryStore.helpers.find(h => h.id === bookingDetails.helperId)
    : undefined;

  if (!matchedHelper) {
    const available = memoryStore.helpers.filter(h => h.category === category && h.isAvailable);
    matchedHelper = available[0] || memoryStore.helpers[0];
  }

  // Parse custom budget expectation or default to standard base price
  const numBudget = Number(String(lead.budgetExpectation || '').replace(/[^0-9]/g, '')) || (matchedService.basePrice * 30);

  // Generate real Booking in the dispatch system
  const newBooking = await createBooking({
    category: category,
    serviceId: matchedService.id,
    serviceTitle: `${matchedService.title} (${(lead.shiftPreference || 'Standard Shift').replace(/_/g, ' ')})`,
    bookingType: 'scheduled',
    scheduledDate: bookingDetails?.scheduledDate || new Date().toISOString().split('T')[0],
    scheduledTimeSlot: bookingDetails?.scheduledTimeSlot || (lead.nextFollowUpDate || 'Confirmed Immediate Trial'),
    customer: {
      name: lead.name,
      phone: lead.phone,
      address: lead.address || lead.societyOrLocality,
      houseNumber: lead.societyOrLocality,
      city: lead.city || 'Bangalore',
      pincode: '560103'
    },
    helper: matchedHelper,
    status: 'assigned',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    pricing: {
      baseAmount: numBudget,
      addOnsAmount: 0,
      platformFee: 99,
      taxAmount: Math.round(numBudget * 0.18),
      discount: 0,
      total: numBudget + 99 + Math.round(numBudget * 0.18)
    },
    notes: `Converted from Telecalling Desk Lead #${lead.id} (${lead.source.toUpperCase()}). Client Requirement: ${lead.requirementDescription}`
  }, { bypassLock: true });

  lead.status = 'converted';
  lead.convertedBookingId = newBooking.id;
  lead.updatedAt = new Date().toISOString();

  // Add auto-conversion call log
  lead.callLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    telecallerName: lead.assignedTelecaller || 'Telecalling Desk',
    callOutcome: 'converted',
    notes: `CONVERTED TO OFFICIAL LIVE BOOKING #${newBooking.id}. Assigned Helper: ${matchedHelper?.name || 'Assigned'}. Dispatch status set to Confirmed.`,
    nextFollowUpDate: 'Booking Active'
  });

  if (mongoDb) {
    try {
      await mongoDb.collection('leads').updateOne(
        { id },
        {
          $set: {
            status: 'converted',
            convertedBookingId: newBooking.id,
            updatedAt: lead.updatedAt
          },
          $push: { callLogs: { $each: [lead.callLogs[0]], $position: 0 } } as any
        }
      );
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo convertLeadToBooking failed:', err);
    }
  }

  return { lead, bookingId: newBooking.id, booking: newBooking };
}

export async function bulkImportLeads(rawLeads: Partial<LeadClient>[]): Promise<{ importedCount: number; skippedCount: number; leads: LeadClient[] }> {
  const mongoDb = getMongoDb();
  let importedCount = 0;
  let skippedCount = 0;
  const newLeadsToInsert: LeadClient[] = [];

  const existingPhones = new Set(memoryStore.leads.map(l => l.phone.replace(/[^0-9]/g, '')));

  for (const raw of rawLeads) {
    if (!raw.name || !raw.phone) {
      skippedCount++;
      continue;
    }

    const cleanPhone = raw.phone.replace(/[^0-9]/g, '');
    if (existingPhones.has(cleanPhone)) {
      skippedCount++;
      continue;
    }

    const lead: LeadClient = {
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: raw.name.trim(),
      phone: raw.phone.trim(),
      email: raw.email?.trim(),
      address: raw.address || '',
      societyOrLocality: raw.societyOrLocality || 'Bangalore Society',
      city: raw.city || 'Bangalore',
      pincode: raw.pincode || '560001',
      source: (raw.source as LeadSource) || 'website_form',
      requirementCategory: raw.requirementCategory || 'maid',
      requirementDescription: raw.requirementDescription || 'Domestic helper requirement',
      shiftPreference: raw.shiftPreference || 'part_time_morning',
      budgetExpectation: raw.budgetExpectation || 'Market Rate',
      priority: raw.priority || 'warm',
      status: raw.status || 'new',
      assignedTelecaller: raw.assignedTelecaller || 'Auto-Assigned Queue',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextFollowUpDate: 'Next 24 Hours',
      callLogs: [],
      tags: ['Bulk Import', raw.source || 'Campaign']
    };

    existingPhones.add(cleanPhone);
    newLeadsToInsert.push(lead);
    importedCount++;
  }

  if (newLeadsToInsert.length > 0) {
    memoryStore.leads.unshift(...newLeadsToInsert);
    if (mongoDb) {
      try {
        await mongoDb.collection('leads').insertMany(newLeadsToInsert as any);
      } catch (err) {
        console.error('[hommlyn247 DB] Mongo bulkImportLeads failed:', err);
      }
    }
  }

  return { importedCount, skippedCount, leads: memoryStore.leads };
}
