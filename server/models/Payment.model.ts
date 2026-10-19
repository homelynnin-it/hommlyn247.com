import { PaymentTransaction } from '../../src/types';
import { getMongoDb } from '../db/connection';
import { memoryStore } from '../db/memoryStore';

export async function getTransactions(): Promise<PaymentTransaction[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const txns = await mongoDb.collection('transactions').find({}).sort({ timestamp: -1 }).toArray();
      if (txns.length > 0) return txns as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Failed reading transactions from Mongo:', err);
    }
  }
  return memoryStore.transactions;
}

export async function createTransaction(txnData: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
  const mongoDb = getMongoDb();
  const now = new Date().toISOString();
  const newTxn: PaymentTransaction = {
    id: txnData.id || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    bookingId: txnData.bookingId || '',
    userId: txnData.userId,
    amount: Number(txnData.amount) || 0,
    currency: txnData.currency || 'INR',
    method: txnData.method || 'upi',
    status: txnData.status || 'success',
    referenceId: txnData.referenceId || `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}/swiftly`,
    upiId: txnData.upiId,
    cardLast4: txnData.cardLast4,
    serviceTitle: txnData.serviceTitle || 'Service Booking',
    customerName: txnData.customerName || 'Customer',
    timestamp: txnData.timestamp || now,
    invoiceUrl: txnData.invoiceUrl || '#'
  };

  memoryStore.transactions.unshift(newTxn);
  if (mongoDb) {
    try {
      await mongoDb.collection('transactions').insertOne({ ...newTxn } as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Failed saving transaction to MongoDB:', err);
    }
  }
  return newTxn;
}
