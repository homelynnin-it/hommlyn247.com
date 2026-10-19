import crypto from 'crypto';
import { UserProfile } from '../../src/types';
import { getMongoDb } from '../db/connection';
import { memoryStore, AuthCredential, SessionRecord } from '../db/memoryStore';
import { getUsers, createUser, updateUser, getUserById } from './User.model';

export type { AuthCredential, SessionRecord };

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computed = crypto.scryptSync(password, salt, 64);
    const stored = Buffer.from(hash, 'hex');
    if (computed.length !== stored.length) return false;
    return crypto.timingSafeEqual(computed, stored);
  } catch {
    return false;
  }
}

export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<string> {
  const mongoDb = getMongoDb();
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashSessionToken(rawToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  const session: SessionRecord = {
    tokenHash,
    userId,
    createdAt: now.toISOString(),
    expiresAt
  };

  memoryStore.sessions.push(session);
  if (mongoDb) {
    try {
      await mongoDb.collection('sessions').insertOne({ ...session } as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createSession failed:', err);
    }
  }
  return rawToken;
}

export async function getSessionUser(rawToken: string): Promise<UserProfile | null> {
  if (!rawToken || typeof rawToken !== 'string') return null;
  const mongoDb = getMongoDb();
  const tokenHash = hashSessionToken(rawToken);
  let session: SessionRecord | undefined = memoryStore.sessions.find(s => s.tokenHash === tokenHash);

  if (mongoDb && !session) {
    try {
      const found = await mongoDb.collection('sessions').findOne({ tokenHash });
      if (found) session = found as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo getSessionUser failed:', err);
    }
  }

  if (!session) return null;

  // Verify expiration
  if (new Date(session.expiresAt) <= new Date()) {
    await invalidateSession(rawToken);
    return null;
  }

  return await getUserById(session.userId);
}

export async function invalidateSession(rawToken: string): Promise<boolean> {
  if (!rawToken) return false;
  const mongoDb = getMongoDb();
  const tokenHash = hashSessionToken(rawToken);
  memoryStore.sessions = memoryStore.sessions.filter(s => s.tokenHash !== tokenHash);

  if (mongoDb) {
    try {
      await mongoDb.collection('sessions').deleteOne({ tokenHash });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo invalidateSession failed:', err);
    }
  }
  return true;
}

export async function cleanExpiredSessions(): Promise<void> {
  const mongoDb = getMongoDb();
  const now = new Date().toISOString();
  memoryStore.sessions = memoryStore.sessions.filter(s => s.expiresAt > now);
  if (mongoDb) {
    try {
      await mongoDb.collection('sessions').deleteMany({ expiresAt: { $lte: now } });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo cleanExpiredSessions failed:', err);
    }
  }
}

export async function createAuthCredential(cred: AuthCredential): Promise<void> {
  const mongoDb = getMongoDb();
  const normalizedEmail = cred.email.toLowerCase().trim();
  const normalizedPhone = cred.phone.trim();
  const record: AuthCredential = {
    ...cred,
    email: normalizedEmail,
    phone: normalizedPhone
  };

  const existingIdx = memoryStore.credentials.findIndex(c => c.userId === cred.userId);
  if (existingIdx >= 0) {
    memoryStore.credentials[existingIdx] = record;
  } else {
    memoryStore.credentials.push(record);
  }

  if (mongoDb) {
    try {
      await mongoDb.collection('auth_credentials').updateOne(
        { userId: cred.userId },
        { $set: record },
        { upsert: true }
      );
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createAuthCredential failed:', err);
    }
  }
}

export async function getAuthCredentialByUserId(userId: string): Promise<AuthCredential | null> {
  const mongoDb = getMongoDb();
  let cred = memoryStore.credentials.find(c => c.userId === userId);
  if (mongoDb && !cred) {
    try {
      const found = await mongoDb.collection('auth_credentials').findOne({ userId });
      if (found) cred = found as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo getAuthCredentialByUserId failed:', err);
    }
  }
  return cred || null;
}

export async function getAuthCredentialByEmailOrPhone(emailOrPhone: string): Promise<AuthCredential | null> {
  const mongoDb = getMongoDb();
  const query = emailOrPhone.toLowerCase().trim();
  const cleanPhone = emailOrPhone.replace(/[^0-9]/g, '');

  let cred = memoryStore.credentials.find(c => {
    const cEmail = c.email.toLowerCase().trim();
    const cPhone = c.phone.replace(/[^0-9]/g, '');
    return cEmail === query || (cleanPhone.length >= 10 && cPhone.endsWith(cleanPhone.slice(-10)));
  });

  if (mongoDb && !cred) {
    try {
      const found = await mongoDb.collection('auth_credentials').findOne({
        $or: [
          { email: query },
          { phone: emailOrPhone.trim() }
        ]
      });
      if (found) cred = found as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo getAuthCredentialByEmailOrPhone failed:', err);
    }
  }
  return cred || null;
}

export async function provisionAdminIfNeeded(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || 'admin@hommlyn247.com';
  let adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[hommlyn247 Auth] ADMIN_PASSWORD not set - admin provisioning skipped in production');
      return;
    }
    console.warn('[hommlyn247 Auth] ADMIN_PASSWORD not set - using default for development only');
    // In development only, use a default
    adminPassword = 'admin12345';
  }

  const users = await getUsers();
  let adminUser = users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());

  if (!adminUser) {
    adminUser = await createUser({
      id: `usr-adm-${Date.now()}`,
      name: 'System Administrator',
      email: adminEmail,
      phone: '+91 98000 00000',
      address: 'hommlyn247 Operations HQ',
      city: 'Bangalore',
      pincode: '560103',
      role: 'admin',
      joinedDate: new Date().toISOString().split('T')[0]
    });
  } else if (adminUser.role !== 'admin') {
    await updateUser(adminUser.id, { role: 'admin' });
    adminUser.role = 'admin';
  }

  const { hash, salt } = hashPassword(adminPassword);
  await createAuthCredential({
    userId: adminUser.id,
    email: adminEmail,
    phone: adminUser.phone,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  console.log(`[hommlyn247 DB] Admin credentials provisioned securely for: ${adminEmail}`);
}
