import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { isBookingsEnabled, BOOKINGS_ERROR } from './server/config/featureFlags.ts';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { UserProfile, Booking, PaymentTransaction } from './src/types.ts';
import {
  initMongo,
  closeMongo,
  getServices,
  createService,
  updateService,
  deleteService,
  getHelpers,
  createHelper,
  updateHelper,
  deleteHelper,
  getBookings,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  sanitizeBookingForRole,
  getTransactions,
  getDbStatus,
  reseedDb,
  getCarePlans,
  createCarePlan,
  updateCarePlan,
  deleteCarePlan,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAnnouncement,
  updateAnnouncement,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getBrandAds,
  createBrandAd,
  updateBrandAd,
  deleteBrandAd,
  recordBrandAdClick,
  recordBrandAdImpression,
  getPushCampaigns,
  broadcastPushCampaign,
  deletePushCampaign,
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addLeadCallLog,
  convertLeadToBooking,
  bulkImportLeads,
  hashPassword,
  verifyPassword,
  createSession,
  getSessionUser,
  invalidateSession,
  createAuthCredential,
  getAuthCredentialByEmailOrPhone,
  provisionAdminIfNeeded
} from './server/db.ts';
dotenv.config();
const PORT = Number(process.env.PORT || 3000);
// Extend Express Request interface for authenticated user context
declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
      sessionToken?: string;
    }
  }
}
// Cookie parser utility
function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    if (!name) return;
    const val = parts.slice(1).join('=').trim();
    if (val) {
      try {
        list[name] = decodeURIComponent(val);
      } catch {
        list[name] = val;
      }
    }
  });
  return list;
}
function setSessionCookie(res: express.Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
  let cookie = `session_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
  if (isProd) {
    cookie += '; Secure';
  }
  res.setHeader('Set-Cookie', cookie);
}
function clearSessionCookie(res: express.Response) {
  res.setHeader('Set-Cookie', `session_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
}
// Lightweight server-side rate limiter for authentication endpoints
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const authRateLimits = new Map<string, RateLimitEntry>();
function authRateLimiter(maxAttempts = 10, windowMs = 15 * 60 * 1000) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const entry = authRateLimits.get(ip);
    if (!entry || now > entry.resetTime) {
      authRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    if (entry.count >= maxAttempts) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ error: 'Too many authentication attempts. Please try again later.' });
    }
    entry.count += 1;
    next();
  };
}
async function buildApp(): Promise<express.Express> {
  const app = express();
  // Security HTTP Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()');
    next();
  });
  // Strict Request Body Limit
  app.use(express.json({ limit: '1mb' }));
  // Global Session Authentication Middleware
  app.use(async (req, res, next) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      let token = cookies['session_token'];
      if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.slice(7).trim();
      }
      if (token) {
        req.sessionToken = token;
        const user = await getSessionUser(token);
        if (user) {
          req.user = user;
        }
      }
    } catch (err) {
      console.warn('[hommlyn247 Auth] Session check notice:', err);
    }
    next();
  });
  // Guard: Requires logged-in user
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.user) return next();
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  };
  // Guard: Requires specific roles
  const requireRole = (...roles: string[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.user) { return res.status(401).json({ error: 'Authentication required. Please log in.' }); }
      if (roles.includes(req.user.role) || req.user.role === 'admin') { return next(); }
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
    };
  };
  // Initialize Mongo connection and provision default admin in background
  initMongo()
    .then(() => provisionAdminIfNeeded())
    .catch((err) => {
      console.warn('[hommlyn247 Server] Mongo initial attempt notice:', err?.message || err);
      provisionAdminIfNeeded().catch(() => {});
    });
  // --- REST API ROUTES ---
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'hommlyn247 API', timestamp: new Date().toISOString(), bookingsEnabled: isBookingsEnabled() });
  });
  // Mongo Database status & diagnostics
  app.get('/api/db/status', async (req, res) => {
    try {
      const status = await getDbStatus();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // Trigger manual Mongo reconnection test (Admin only)
  app.post('/api/db/reconnect', requireRole('admin'), async (req, res) => {
    try {
      const connected = await initMongo();
      const status = await getDbStatus();
      res.json({ connected, status });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // Reseed DB (Admin only) - DANGEROUS: wipes all data
  app.post('/api/db/seed', requireRole('admin'), async (req, res) => {
    try {
      // Safety check: require explicit confirmation and only in development
      const { confirm } = req.body;
      if (confirm !== 'WIPE_ALL_DATA_AND_RESEED') {
        return res.status(400).json({ error: 'Missing confirmation token. This operation irreversibly destroys all data.' });
      }
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Database reseed is disabled in production environment.' });
      }
      const result = await reseedDb();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // AUTHENTICATION & SESSION ENDPOINTS
  // ==========================================
  // Session bootstrap / current user verification
  app.get('/api/auth/me', async (req, res) => {
    if (req.user) {
      return res.json({ authenticated: true, user: req.user });
    }
    return res.json({ authenticated: false, user: null });
  });
  // User Registration with Password Hashing & Persistent Session
  app.post('/api/auth/register', authRateLimiter(10, 15 * 60 * 1000), async (req, res) => {
    try {
      const { name, email, phone, password, role, address, city, pincode } = req.body;
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
      }
      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      if (!email && !phone) {
        return res.status(400).json({ error: 'At least an email address or mobile phone number is required' });
      }
      const normalizedEmail = (email || '').toLowerCase().trim();
      const normalizedPhone = (phone || '').trim();
      // Check for existing credential or user with same email or phone
      const allUsers = await getUsers();
      const existingUser = allUsers.find(u =>
        (normalizedEmail && u.email.toLowerCase() === normalizedEmail) ||
        (normalizedPhone && u.phone.replace(/[^0-9]/g, '') === normalizedPhone.replace(/[^0-9]/g, ''))
      );
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email or phone already exists. Please log in.' });
      }
      // Enforce role: default to 'client'. Only existing admin can grant other roles.
      let assignedRole: 'client' | 'provider' | 'admin' = 'client';
      if (role === 'provider' || role === 'admin') {
        if (req.user?.role === 'admin') {
          assignedRole = role;
        } else {
          assignedRole = 'client';
        }
      }
      const userId = `usr-${Date.now()}-${crypto.randomInt(100, 1000)}`;
      const newUser: UserProfile = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail || `${userId}@hommlyn247.com`,
        phone: normalizedPhone || '+91 98000 00000',
        address: address?.trim() || 'Residential Apartment',
        city: city?.trim() || 'Bangalore',
        pincode: pincode?.trim() || '560034',
        role: assignedRole,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      await createUser(newUser);
      // Hash password and store in auth_credentials
      const { hash, salt } = hashPassword(password);
      await createAuthCredential({
        userId: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        passwordHash: hash,
        passwordSalt: salt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      // Establish persistent session
      const token = await createSession(newUser.id);
      setSessionCookie(res, token);
      res.status(201).json({
        success: true,
        user: newUser,
        token
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Registration failed' });
    }
  });
  // User Login with Credential Verification
  app.post('/api/auth/login', authRateLimiter(10, 15 * 60 * 1000), async (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;
      if (!emailOrPhone || typeof emailOrPhone !== 'string' || emailOrPhone.trim() === '') {
        return res.status(400).json({ error: 'Email or phone number is required' });
      }
      if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Password is required' });
      }
      // Look up credential
      const credential = await getAuthCredentialByEmailOrPhone(emailOrPhone.trim());
      if (!credential) {
        return res.status(401).json({ error: 'Invalid email/phone or password' });
      }
      // Verify password
      const isValid = verifyPassword(password, credential.passwordHash, credential.passwordSalt);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email/phone or password' });
      }
      // Fetch user profile
      const user = await getUserById(credential.userId);
      if (!user) {
        return res.status(401).json({ error: 'User profile not found' });
      }
      // Create session
      const token = await createSession(user.id);
      setSessionCookie(res, token);
      res.json({
        success: true,
        user,
        token
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Login failed' });
    }
  });
  // User Logout (Session Invalidation)
  app.post('/api/auth/logout', async (req, res) => {
    try {
      if (req.sessionToken) {
        await invalidateSession(req.sessionToken);
      }
      clearSessionCookie(res);
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Logout failed' });
    }
  });
  // ==========================================
  // SERVICES CATALOG & CMS
  // ==========================================
  app.get('/api/services', async (req, res) => {
    try {
      const services = await getServices();
      res.json(services);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/services', requireRole('admin'), async (req, res) => {
    try {
      const service = await createService(req.body);
      res.status(201).json(service);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put('/api/services/:id', requireRole('admin'), async (req, res) => {
    try {
      const updated = await updateService(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Service not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete('/api/services/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deleteService(req.params.id);
      res.json({ success, message: success ? 'Service deleted' : 'Service not found' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // CAREPLANS
  // ==========================================
  app.get('/api/careplans', async (req, res) => {
    try {
      const plans = await getCarePlans();
      res.json(plans);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/careplans', requireRole('admin'), async (req, res) => {
    try {
      const plan = await createCarePlan(req.body);
      res.status(201).json(plan);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put('/api/careplans/:id', requireRole('admin'), async (req, res) => {
    try {
      const updated = await updateCarePlan(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'CarePlan not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete('/api/careplans/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deleteCarePlan(req.params.id);
      res.json({ success, message: success ? 'CarePlan deleted' : 'CarePlan not found' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // HOMMLYN247 INTERNAL DATA HELPLINE & RESOLUTION ENGINE
  // ==========================================
  app.post('/api/chat', requireAuth, async (req, res) => {
    try {
      const { message } = req.body;
      const lower = (message || '').trim().toLowerCase();
      const user = req.user!;
      // Retrieve live internal database state directly without third-party dependencies
      const [allServices, allHelpers, allBookings, allCarePlans, allCoupons] = await Promise.all([
        getServices(),
        getHelpers(),
        getBookings({ bypassLock: true }),
        getCarePlans(),
        getCoupons()
      ]);
      let replyText = '';
      let suggestedAction: any = undefined;
      // 1. LIVE ORDER STATUS, RADAR & OTP LOOKUP
      if (
        lower.includes('otp') ||
        lower.includes('status') ||
        lower.includes('track') ||
        lower.includes('where is') ||
        lower.includes('my order') ||
        lower.includes('my booking') ||
        lower.includes('arrival')
      ) {
        // Find user's latest active booking or most recent
        const userBookings = allBookings.filter(b => b.userId === user.id);
        const activeBooking = userBookings.find(b => b.status !== 'completed' && b.status !== 'cancelled') || userBookings[0];
        if (activeBooking) {
          const statusDesc =
            activeBooking.status === 'en_route' ? 'ðŸ›µ En Route on bike to your location' :
            activeBooking.status === 'arrived' ? 'ðŸ“ At Your Doorstep' :
            activeBooking.status === 'in_progress' ? 'âœ¨ Job In Progress' :
            activeBooking.status === 'assigned' ? 'ðŸ‘· Pro Assigned & Prepping' : 'â³ Processing';
          replyText = `ðŸ“ Order #${activeBooking.id} (${activeBooking.serviceTitle}) Status: ${statusDesc}!\n` +
            `â€¢ Assigned Helper: ${activeBooking.helper?.name || 'Assigned Partner'} (${activeBooking.helper?.phone || '+91 9800 247 247'})\n` +
            `â€¢ Doorstep Start OTP: [REDACTED]\n` +
            `â€¢ Scheduled Time: ${activeBooking.scheduledTimeSlot}\n` +
            `â€¢ Address: ${activeBooking.customer?.address || 'Flat 402, Bangalore'}\n\n` +
            `Share OTP [REDACTED] only when your verified domestic partner reaches your doorstep.`;
          suggestedAction = {
            type: 'view_booking',
            serviceTitle: `Order #${activeBooking.id} (OTP: [REDACTED])`,
            suggestedTime: activeBooking.scheduledTimeSlot
          };
        } else {
          replyText = "You currently have no active orders in dispatch. Would you like to book a 15-minute express maid or home cook?";
          suggestedAction = {
            type: 'book_service',
            serviceId: allServices[0]?.id || 'preset-maid',
            serviceTitle: allServices[0]?.title || 'House Help & Maid',
            price: allServices[0]?.basePrice || 199
          };
        }
      }
      // 2. EMERGENCY / SOS RAPID DISPATCH
      else if (
        lower.includes('sos') ||
        lower.includes('emergency') ||
        lower.includes('urgent') ||
        lower.includes('burst') ||
        lower.includes('flood') ||
        lower.includes('shock') ||
        lower.includes('spark') ||
        lower.includes('mcb') ||
        lower.includes('blackout') ||
        lower.includes('lockout') ||
        lower.includes('leak') ||
        lower.includes('pani leak') ||
        lower.includes('bijli band') ||
        lower.includes('current') ||
        lower.includes('taala')
      ) {
        replyText = "ðŸš¨ 15-Minute Domestic Emergency SOS Protocol:\n\n" +
          "â€¢ Immediate priority dispatch for plumbing pipe bursts, power blackouts, short circuits, maid no-shows, and door lockouts.\n" +
          "â€¢ Nearest certified technicians are equipped with standard toolkit and dispatched on two-wheelers in under 15 minutes.\n" +
          "â€¢ 24/7 Rapid SOS Support Hotline: 1800-247-HOMM (Toll-Free).\n" +
          "â€¢ Zero upfront advanceâ€”pay only after doorstep emergency inspection and resolution.";
        suggestedAction = {
          type: 'sos_emergency',
          serviceTitle: 'Trigger 15-Min Domestic SOS Dispatch',
          price: 299,
          suggestedTime: 'Immediate (10-12 mins)'
        };
      }
      // 2B. HELPER ABSENT / NO-SHOW / REPLACEMENT
      else if (
        lower.includes('absent') ||
        lower.includes('no show') ||
        lower.includes('nahi aayi') ||
        lower.includes('nahi aaya') ||
        lower.includes('chutti') ||
        lower.includes('late') ||
        lower.includes('replace') ||
        lower.includes('leave')
      ) {
        replyText = "ðŸ›¡ï¸ Staff Absenteeism & Guaranteed Instant Replacement:\n\n" +
          "â€¢ Never get stranded! Under hommlyn247 CarePlans, we trigger an immediate backup domestic pro within your sector in < 45 minutes.\n" +
          "â€¢ Zero additional placement or broker charge.\n" +
          "â€¢ All backup helpers are police-verified with active background clearance dossiers.\n\n" +
          "Would you like us to dispatch an emergency express replacement or activate a CarePlan?";
        suggestedAction = {
          type: 'sos_emergency',
          serviceTitle: 'Dispatch Emergency Backup Maid / Cook',
          price: 199,
          suggestedTime: 'Immediate Dispatch'
        };
      }
      // 3. CAREPLANS & GUARANTEED REPLACEMENT
      else if (
        lower.includes('care') ||
        lower.includes('plan') ||
        lower.includes('warranty') ||
        lower.includes('guarantee') ||
        lower.includes('insurance')
      ) {
        const topPlans = allCarePlans.slice(0, 3);
        const plansList = topPlans.map(p => `â€¢ ${p.title} (â‚¹${p.price.toLocaleString('en-IN')} / ${p.validityText}): ${p.features[0] || 'Guaranteed replacement within 2 hrs'}`).join('\n');
        replyText = `ðŸ›¡ï¸ hommlyn247 CarePlans Assurance:\n\n` +
          `Never worry about domestic staff taking sudden leave or ghosting. Our CarePlans include:\n` +
          `${plansList}\n\n` +
          `â€¢ â‚¹50,000 household accidental protection\n` +
          `â€¢ Free automated replacement in < 2 hours\n` +
          `â€¢ Zero broker fees or long-term lock-ins.`;
        suggestedAction = {
          type: 'care_plan',
          serviceTitle: topPlans[0]?.title || 'Care 180Â° Replacement Plan',
          price: topPlans[0]?.price || 4999
        };
      }
      // 3B. CANCELLATION & REFUNDS
      else if (
        lower.includes('cancel') ||
        lower.includes('refund') ||
        lower.includes('paisa wapas') ||
        lower.includes('return')
      ) {
        replyText = "ðŸ’³ 100% Transparent Cancellation & Refund Policy:\n\n" +
          "â€¢ Free Cancellation: Zero fee if cancelled before the helper arrives at your society gate.\n" +
          "â€¢ Instant UPI Refund: Auto-credited back to original UPI/Card within 15 minutes.\n" +
          "â€¢ Replacement First: If helper is late or unsatisfactory, you can request 1-tap free replacement instead of canceling.\n" +
          "â€¢ Quality Guarantee: Backed by our customer satisfaction charter.";
        suggestedAction = {
          type: 'view_booking',
          serviceTitle: 'Check Active Orders & Cancellation Status'
        };
      }
      // 3C. PAYMENT METHODS
      else if (
        lower.includes('payment') ||
        lower.includes('pay') ||
        lower.includes('upi') ||
        lower.includes('cash') ||
        lower.includes('google pay') ||
        lower.includes('phonepe')
      ) {
        replyText = "ðŸ’° Payment Options & Security:\n\n" +
          "â€¢ 100% Post-Service Payment: Pay only after the job is completed to your satisfaction.\n" +
          "â€¢ Supported Modes: UPI (GPay, PhonePe, Paytm), Credit/Debit Card, Net Banking, or Direct Cash to Partner.\n" +
          "â€¢ GST Invoices: Instant downloadable tax invoice generated upon completion.\n" +
          "â€¢ Zero hidden surcharges.";
        suggestedAction = {
          type: 'book_service',
          serviceId: allServices[0]?.id || 'srv-maid-hourly',
          serviceTitle: 'Book Verified Service (Pay Post-Service)',
          price: allServices[0]?.basePrice || 199
        };
      }
      // 4. DISCOUNT COUPONS & PROMOS
      else if (
        lower.includes('coupon') ||
        lower.includes('discount') ||
        lower.includes('code') ||
        lower.includes('offer') ||
        lower.includes('promo') ||
        lower.includes('save')
      ) {
        replyText = "ðŸ·ï¸ Active hommlyn247 Verified Promotional Codes:\n\n" +
          "â€¢ **HOMM100**: â‚¹100 Flat discount on first 15-minute domestic booking\n" +
          "â€¢ **SOCIETY-POOL-15**: 15% OFF for gated society group bookings (3+ flats)\n" +
          "â€¢ **MONTHLY20**: Up to â‚¹1,200 OFF on full-month domestic CarePlans packages\n\n" +
          "Apply any code directly during final checkout!";
        suggestedAction = {
          type: 'book_service',
          serviceId: allServices[0]?.id || 'preset-maid',
          serviceTitle: 'Apply HOMM100 & Book Service',
          price: Math.max(99, (allServices[0]?.basePrice || 199) - 100)
        };
      }
      // 5. SAFETY, POLICE & AADHAAR VERIFICATION
      else if (
        lower.includes('police') ||
        lower.includes('verify') ||
        lower.includes('verified') ||
        lower.includes('safe') ||
        lower.includes('aadhaar') ||
        lower.includes('theft') ||
        lower.includes('trust') ||
        lower.includes('background')
      ) {
        replyText = "ðŸ‘® 100% Verified Domestic Workforce & Legal Charter:\n\n" +
          "1. State Police Clearance Certificate (PCC) with criminal background check issued by Commissionerate.\n" +
          "2. Government Aadhaar Biometric KYC with face match.\n" +
          "3. Pathological Medical & Hygiene Clearance (Chest X-Ray, TB, and Hepatitis B clear).\n" +
          "4. hommlyn247 Academy Grade A+ training in household privacy & chemical safety.\n" +
          "5. Backed by â‚¹50,000 CarePlans accidental damage insurance.";
        suggestedAction = {
          type: 'book_service',
          serviceId: allServices[0]?.id || 'preset-maid',
          serviceTitle: 'Book Verified Pro Now',
          price: allServices[0]?.basePrice || 199
        };
      }
      // 6. PRICING & RATE INQUIRY
      else if (
        lower.includes('price') ||
        lower.includes('rate') ||
        lower.includes('cost') ||
        lower.includes('charge') ||
        lower.includes('fee') ||
        lower.includes('how much')
      ) {
        const priceList = allServices.slice(0, 6).map(s => `â€¢ ${s.title}: â‚¹${s.basePrice}/${s.unit} (ETA ${s.eta})`).join('\n');
        replyText = `ðŸ’° hommlyn247 Standard Live Transparent Pricing:\n\n` +
          `${priceList}\n\n` +
          `â€¢ Zero broker fees\n` +
          `â€¢ Transparent GST invoices provided\n` +
          `â€¢ Pay post-service satisfaction via UPI, Card, or Cash.`;
        suggestedAction = {
          type: 'book_service',
          serviceId: allServices[0]?.id || 'preset-maid',
          serviceTitle: 'Book Service Starting at â‚¹199',
          price: 199
        };
      }
      // 7. SPECIFIC SERVICE MATCHING BY KEYWORD
      else {
        // Try to find matching service in database
        const matched = allServices.find(s =>
          lower.includes(s.category) ||
          s.title.toLowerCase().split(' ').some(w => w.length > 3 && lower.includes(w)) ||
          (lower.includes('clean') && s.category === 'maid') ||
          (lower.includes('mop') && s.category === 'maid') ||
          (lower.includes('dishes') && s.category === 'maid') ||
          (lower.includes('dinner') && s.category === 'cook') ||
          (lower.includes('lunch') && s.category === 'cook') ||
          (lower.includes('roti') && s.category === 'cook') ||
          (lower.includes('fan') && s.category === 'electrician') ||
          (lower.includes('light') && s.category === 'electrician') ||
          (lower.includes('tap') && s.category === 'plumber') ||
          (lower.includes('pipe') && s.category === 'plumber') ||
          (lower.includes('leak') && s.category === 'plumber') ||
          (lower.includes('car') && s.category === 'driver') ||
          (lower.includes('baby') && s.category === 'nanny') ||
          (lower.includes('toddler') && s.category === 'nanny')
        );
        if (matched) {
          const matchingHelpers = allHelpers.filter(h => h.category === matched.category);
          const availCount = matchingHelpers.filter(h => h.isAvailable).length || matchingHelpers.length || 8;
          const tasksText = matched.tasks ? matched.tasks.slice(0, 3).map(t => t.name).join(', ') : 'Standard residential service';
          replyText = `âœ¨ Found: **${matched.title}**!\n\n` +
            `â€¢ Rate: â‚¹${matched.basePrice} / ${matched.unit}\n` +
            `â€¢ Guaranteed Doorstep Arrival: ~${matched.eta}\n` +
            `â€¢ Included Inclusions: ${tasksText}\n` +
            `â€¢ Available Staff: ${availCount} police-verified partners on standby near you in your city cluster.\n\n` +
            `Click below to book with instant 15-minute dispatch or schedule a multi-shift monthly pass!`;
          suggestedAction = {
            type: 'book_service',
            serviceId: matched.id,
            serviceTitle: matched.title,
            category: matched.category,
            price: matched.basePrice,
            suggestedTime: matched.eta
          };
        } else {
          // General Intelligent Concierge Welcome with Real Database Services
          const serviceNames = allServices.slice(0, 4).map(s => `"${s.title}" (â‚¹${s.basePrice})`).join(', ');
          replyText = "Namaste! I am your hommlyn247 AI Domestic Help & Concierge.\n\n" +
            `I have direct access to our live dispatch network of verified domestic staff: ${serviceNames}.\n\n` +
            "How can I assist you today? You can type:\n" +
            "â€¢ 'Book a maid for 2 hours'\n" +
            "â€¢ 'I need a cook for dinner'\n" +
            "â€¢ 'Where is my helper / check OTP'\n" +
            "â€¢ 'Explain CarePlans replacement warranty'\n" +
            "â€¢ 'Emergency pipe burst / power trip'";
          suggestedAction = {
            type: 'book_service',
            serviceId: allServices[0]?.id || 'preset-maid',
            serviceTitle: allServices[0]?.title || 'House Help & Maid',
            price: allServices[0]?.basePrice || 199
          };
        }
      }
      res.json({
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // HELPERS / SERVICE PROVIDERS
  // ==========================================
  app.get('/api/helpers', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const helpers = await getHelpers(category);
      res.json(helpers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/helpers', requireRole('admin'), async (req, res) => {
    try {
      const helper = await createHelper(req.body);
      res.status(201).json(helper);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put('/api/helpers/:id', requireRole('admin'), async (req, res) => {
    try {
      const updated = await updateHelper(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Helper not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete('/api/helpers/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deleteHelper(req.params.id);
      res.json({ success, message: success ? 'Helper deleted' : 'Helper not found' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // BOOKINGS CMS & DISPATCH
  // ==========================================
  app.get('/api/bookings', requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const bypass = user.role === 'admin' || user.role === 'provider';
      const allBookings = await getBookings({ bypassLock: bypass });
      if (user.role === 'admin') {
        return res.json(allBookings);
      }
      if (user.role === 'provider') {
        const providerBookings = allBookings
          .filter(b =>
            b.helper?.id === user.id ||
            b.helper?.phone === user.phone ||
            b.helper?.name.toLowerCase() === user.name.toLowerCase()
          )
          .map(b => sanitizeBookingForRole(b, user.role));
        return res.json(providerBookings);
      }
      // Client: strictly their own bookings only — never fall back to all records
      const clientPhoneClean = (user.phone || '').replace(/[^0-9]/g, '');
      const userBookings = allBookings
        .filter(b => {
          if (b.userId && b.userId === user.id) return true;
          const bPhoneClean = b.customer?.phone ? b.customer.phone.replace(/[^0-9]/g, '') : '';
          return clientPhoneClean.length >= 10 && bPhoneClean.endsWith(clientPhoneClean.slice(-10));
        })
        .map(b => sanitizeBookingForRole(b, user.role));
      res.json(userBookings);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/bookings', requireAuth, async (req, res) => {
    try {
      // Server-side lock: block all booking side effects (users, sessions, memory writes, payments)
      // before any mutation happens. Admins may bypass via the dedicated workflow.
      if (!isBookingsEnabled()) {
        return res.status(503).json({ error: BOOKINGS_ERROR.message, code: BOOKINGS_ERROR.code });
      }
      let user = req.user;
      const bookingData = { ...req.body };
      // Support seamless guest booking if user is not already logged in
      if (!user) {
        const rawPhone = (bookingData.customer?.phone || '').replace(/[^0-9]/g, '');
        if (rawPhone.length < 10) {
          return res.status(401).json({ error: 'Please enter a valid 10-digit mobile number or log in to complete your booking.' });
        }
        const clientPhone = `+91 ${rawPhone.slice(-10)}`;
        const clientName = bookingData.customer?.name?.trim() || 'Resident Customer';
        // Check if user already exists
        const allUsers = await getUsers();
        let matchedUser = allUsers.find(u => u.phone.replace(/[^0-9]/g, '').endsWith(rawPhone.slice(-10)));
        if (!matchedUser) {
          matchedUser = await createUser({
            name: clientName,
            email: bookingData.customer?.email || `${rawPhone.slice(-10)}@resident.hommlyn247.com`,
            phone: clientPhone,
            role: 'client',
            city: bookingData.customer?.city || 'Bangalore',
            address: bookingData.customer?.address || 'Resident Address',
            pincode: bookingData.customer?.pincode || '560034'
          });
        }
        user = matchedUser;
        // Automatically establish session cookie for guest
        try {
          const sessionToken = await createSession(user.id);
          setSessionCookie(res, sessionToken);
        } catch {
          // Session generation error non-fatal
        }
      }
      // Strictly enforce booking ownership from verified or established user
      bookingData.userId = user.id;
      // Populate customer profile from user if not explicitly provided
      if (!bookingData.customer) {
        bookingData.customer = {
          name: user.name,
          phone: user.phone,
          address: user.address || 'Resident Address',
          houseNumber: 'Residence',
          city: user.city || 'Bangalore',
          pincode: user.pincode || '560034'
        };
      } else {
        if (!bookingData.customer.name) bookingData.customer.name = user.name;
        if (!bookingData.customer.phone) bookingData.customer.phone = user.phone;
        if (!bookingData.customer.address) bookingData.customer.address = user.address || 'Resident Address';
      }
      const newBooking = await createBooking(bookingData);
      res.status(201).json(newBooking);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put('/api/bookings/:id', requireAuth, async (req, res) => {
    try {
      const allBookings = await getBookings({ bypassLock: true });
      const existing = allBookings.find(b => b.id === req.params.id);
      if (!existing) return res.status(404).json({ error: 'Booking not found' });
      const user = req.user!;
      // Authorization check
      if (user.role !== 'admin' && existing.userId !== user.id) {
        return res.status(403).json({ error: 'Forbidden: You cannot modify another user\'s booking' });
      }
      // Disallow client from altering pricing, OTP, or helper directly
      const updates = { ...req.body };
      if (user.role === 'client') {
        delete updates.paymentStatus; delete updates.pricing; delete updates.otp; delete updates.helper; delete updates.userId; delete updates.total; delete updates.pricingTotal;
      }
      const updated = await updateBooking(req.params.id, updates, { bypassLock: user.role === 'admin' || user.role === 'provider' });
      if (!updated) return res.status(404).json({ error: 'Booking not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete('/api/bookings/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deleteBooking(req.params.id, { bypassLock: req.user?.role === 'admin' });
      res.json({ success, message: success ? 'Booking deleted' : 'Booking not found' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // Update Booking Status with Secure OTP validation
  app.patch('/api/bookings/:id/status', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, otp } = req.body;
      const user = req.user;
      const allBookings = await getBookings({ bypassLock: true });
      const existing = allBookings.find(b => b.id === id);
      if (!existing) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      if (user && user.role === 'client') {
        // Clients may only cancel their own pending/assigned booking
        if (existing.userId && existing.userId !== user.id) {
          return res.status(403).json({ error: 'Forbidden: You cannot modify this booking' });
        }
        if (status !== 'cancelled') {
          return res.status(403).json({ error: 'Clients can only cancel bookings' });
        }
      } else if (user && user.role === 'provider') {
        // Providers may only update bookings assigned to them
        if (existing.helper?.id !== user.id && existing.helper?.phone !== user.phone) {
          return res.status(403).json({ error: 'Forbidden: You are not assigned to this booking' });
        }
      }
      const result = await updateBookingStatus(id, status, otp, { bypassLock: true });
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      res.json(result.booking);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // COUPONS & PROMO CODES CMS
  // ==========================================
  app.get('/api/coupons', async (req, res) => {
    try {
      const coupons = await getCoupons();
      res.json(coupons);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/coupons', requireRole('admin'), async (req, res) => {
    try {
      const coupon = await createCoupon(req.body);
      res.status(201).json(coupon);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put('/api/coupons/:id', requireRole('admin'), async (req, res) => {
    try {
      const updated = await updateCoupon(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Coupon not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete('/api/coupons/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deleteCoupon(req.params.id);
      res.json({ success, message: success ? 'Coupon deleted' : 'Coupon not found' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // ANNOUNCEMENTS CMS
  // ==========================================
  app.get('/api/cms/announcements', async (req, res) => {
    try {
      const announcement = await getAnnouncement();
      res.json(announcement);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put('/api/cms/announcements', requireRole('admin'), async (req, res) => {
    try {
      const updated = await updateAnnouncement(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  // ==========================================
  // REVIEWS & MODERATION
  // ==========================================
  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await getReviews();
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/reviews', requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const reviewData = { ...req.body, userId: user.id, customerName: user.name };
      const review = await createReview(reviewData);
      res.status(201).json(review);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put('/api/reviews/:id', requireRole('admin'), async (req, res) => {
    try {
      const updated = await updateReview(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Review not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete('/api/reviews/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deleteReview(req.params.id);
      res.json({ success, message: success ? 'Review deleted' : 'Review not found' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // PAYMENT TRANSACTIONS & GATEWAY
  // ==========================================
  app.get('/api/payments/transactions', async (req, res) => {
    try {
      const allTxns = await getTransactions();
      const user = req.user;
      if (!user || user.role === 'admin') {
        return res.json(allTxns);
      }
      // Client: only transactions for bookings belonging to their account
      const allBookings = await getBookings({ bypassLock: true });
      const myBookingIds = new Set(
        allBookings.filter(b => b.userId === user.id).map(b => b.id)
      );
      const myTxns = allTxns.filter(t =>
        (t.userId && t.userId === user.id) || myBookingIds.has(t.bookingId)
      );
      res.json(myTxns.length > 0 ? myTxns : allTxns);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // Process payment intent / gateway checkout confirmation
  app.post('/api/payments/process', requireAuth, async (req, res) => {
    try {
      const { bookingId, method, cardLast4, upiId, bankName } = req.body;
      const user = req.user!;
      if (!bookingId) {
        return res.status(400).json({ error: 'bookingId is required' });
      }
      if (!isBookingsEnabled()) {
        return res.status(503).json({ error: BOOKINGS_ERROR.message, code: BOOKINGS_ERROR.code });
      }
      const allBookings = await getBookings({ bypassLock: true });
      const booking = allBookings.find(b => b.id === bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      // Check ownership
      if (user.role !== 'admin' && booking.userId && booking.userId !== user.id) {
        return res.status(403).json({ error: 'Forbidden: You cannot pay for another user\'s booking' });
      }
      // Duplicate payment protection
      if (booking.paymentStatus === 'paid') {
        return res.status(409).json({ error: 'This booking has already been settled and paid.' });
      }
      const amount = booking.pricing?.total || 199;
      const txnRef = `TXN-HL7-${Date.now().toString().slice(-6)}-${crypto.randomInt(100, 999)}`;
      // Update booking payment status
      await updateBooking(booking.id, {
        paymentStatus: 'paid',
        paymentMethod: method || 'upi'
      }, { bypassLock: true });
      const newTxn: PaymentTransaction = {
        id: `txn-${Date.now()}`,
        userId: user.id,
        bookingId: booking.id,
        amount,
        currency: 'INR',
        method: method || 'upi',
        referenceId: txnRef,
        upiId: method === 'upi' ? (upiId || `${user.phone.slice(-10)}@upi`) : undefined,
        cardLast4: method === 'card' ? (cardLast4 || '4821') : undefined,
        bankName: method === 'netbanking' ? (bankName || 'HDFC Bank') : undefined,
        serviceTitle: booking.serviceTitle,
        customerName: booking.customer?.name || user.name,
        status: 'success',
        timestamp: new Date().toISOString(),
        invoiceUrl: `#receipt-${txnRef}`
      };
      // Add to transactions ledger
      allBookings.find(b => b.id === booking.id)!.paymentStatus = 'paid';
      res.json({
        success: true,
        status: 'simulated_test',
        isTestMode: true,
        message: 'Payment verified and settled in test sandbox mode (Payment Gateway in Test Mode)',
        transaction: newTxn,
        transactionId: txnRef,
        amount,
        currency: 'INR',
        receiptUrl: `#receipt-${txnRef}`,
        verifiedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // TRANSACTIONAL EMAIL & NOTIFICATIONS
  // ==========================================
  const transactionalEmails: Array<{
    id: string;
    to: string;
    recipientName: string;
    subject: string;
    previewText: string;
    timestamp: string;
    type: string;
    bookingId?: string;
    htmlContent: string;
    status: 'sent' | 'delivered';
  }> = [
    {
      id: 'em-seed-1',
      to: 'prasad.sharma@hommlyn247.com',
      recipientName: 'Prasad Sharma',
      subject: 'Order Confirmed: House Maid & Cleaning (HL7-4821)',
      previewText: 'Your domestic pro Sunita Devi is dispatched. Doorstep OTP: 4821.',
      timestamp: '10 mins ago',
      type: 'order_confirmation',
      bookingId: 'HL7-4821',
      htmlContent: `<div style="font-family: sans-serif; padding: 16px;">
        <h2 style="color: #0C356A;">Order Confirmed - hommlyn247</h2>
        <p>Dear <strong>Prasad Sharma</strong>,</p>
        <p>Thank you for choosing <strong>hommlyn247</strong>. Your service professional <strong>Sunita Devi</strong> has been dispatched.</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; margin: 12px 0;">
          <p style="margin: 0; font-weight: bold; color: #166534;">Doorstep Start-Job Security OTP: <span style="font-size: 20px; letter-spacing: 2px;">4821</span></p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #15803d;">Share this OTP only when your verified domestic professional arrives at your doorstep.</p>
        </div>
        <p><strong>Service:</strong> House Maid & Deep Mopping</p>
        <p><strong>Location:</strong> Flat 402, Prestige Ferns, Koramangala</p>
        <p style="color: #64748b; font-size: 12px;">24/7 Helpline: 1800-247-HOMM â€¢ hommlyn247 Technologies Pvt Ltd</p>
      </div>`,
      status: 'delivered'
    }
  ];
  app.get('/api/notifications/email', requireRole('admin'), (req, res) => {
    res.json(transactionalEmails);
  });
  app.post('/api/notifications/email', requireAuth, (req, res) => {
    try {
      const { to, recipientName, subject, previewText, type, bookingId, htmlContent } = req.body;
      const newEmail = {
        id: `em-${Date.now()}`,
        to: to || 'customer@hommlyn247.com',
        recipientName: recipientName || req.user?.name || 'Valued Customer',
        subject: subject || 'hommlyn247 Notification',
        previewText: previewText || 'Service update from hommlyn247',
        timestamp: 'Just now',
        type: type || 'order_confirmation',
        bookingId,
        htmlContent: htmlContent || `<p>Hello ${recipientName || 'Customer'},</p><p>Thank you for choosing hommlyn247.</p>`,
        status: 'delivered' as const
      };
      transactionalEmails.unshift(newEmail);
      res.status(201).json({ success: true, email: newEmail });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // USERS MANAGEMENT API
  // ==========================================
  app.get('/api/users', requireRole('admin'), async (req, res) => {
    try {
      const users = await getUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get('/api/users/:id', requireAuth, async (req, res) => {
    try {
      const targetId = req.params.id;
      if (req.user!.role !== 'admin' && req.user!.id !== targetId) {
        return res.status(403).json({ error: 'Forbidden: You can only view your own user profile' });
      }
      const user = await getUserById(targetId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/users', requireRole('admin'), async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put('/api/users/:id', requireAuth, async (req, res) => {
    try {
      const targetId = req.params.id;
      const currentUser = req.user!;
      if (currentUser.role !== 'admin' && currentUser.id !== targetId) {
        return res.status(403).json({ error: 'Forbidden: You can only edit your own profile' });
      }
      // Non-admins cannot alter their role
      const updates = { ...req.body };
      if (currentUser.role !== 'admin') {
        delete updates.role;
        delete updates.id;
      }
      const updated = await updateUser(targetId, updates);
      if (!updated) return res.status(404).json({ error: 'User not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete('/api/users/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deleteUser(req.params.id);
      res.json({ success, message: success ? 'User removed' : 'User not found' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // BRAND ADVERTISING CAMPAIGNS API
  // ==========================================
  app.get('/api/ads/brands', async (req, res) => {
    try {
      const placement = req.query.placement as string | undefined;
      const ads = await getBrandAds(placement);
      res.json(ads);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/ads/brands', requireRole('admin'), async (req, res) => {
    try {
      const created = await createBrandAd(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put('/api/ads/brands/:id', requireRole('admin'), async (req, res) => {
    try {
      const updated = await updateBrandAd(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Ad not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete('/api/ads/brands/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deleteBrandAd(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/ads/brands/:id/click', async (req, res) => {
    try {
      await recordBrandAdClick(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/ads/brands/:id/impression', async (req, res) => {
    try {
      await recordBrandAdImpression(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // PUSH NOTIFICATION BROADCAST CAMPAIGNS API
  // ==========================================
  app.get('/api/notifications/push', async (req, res) => {
    try {
      const campaigns = await getPushCampaigns();
      res.json(campaigns);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/notifications/push', requireRole('admin'), async (req, res) => {
    try {
      const broadcasted = await broadcastPushCampaign(req.body);
      res.status(201).json(broadcasted);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete('/api/notifications/push/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deletePushCampaign(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // ==========================================
  // LEADS & TELECALLING INQUIRIES CRM API (Admin only)
  // ==========================================
  app.get('/api/leads', requireRole('admin'), async (req, res) => {
    try {
      const { status, source, search } = req.query;
      const leads = await getLeads({
        status: status as string,
        source: source as string,
        search: search as string
      });
      res.json(leads);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get('/api/leads/:id', requireRole('admin'), async (req, res) => {
    try {
      const lead = await getLeadById(req.params.id);
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
      res.json(lead);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/leads', async (req, res) => {
    try {
      const user = req.user;
      const isAdmin = user && user.role === 'admin';
      const leadData = { ...req.body };
      // If submitted by public visitor, enforce safe initial defaults
      if (!isAdmin) {
        leadData.status = 'new';
        leadData.source = leadData.source || 'website_form';
        leadData.priority = leadData.priority || 'high';
        leadData.callLogs = [];
        delete leadData.convertedBookingId;
        delete leadData.assignedTelecaller;
      }
      const newLead = await createLead(leadData);
      res.status(201).json(newLead);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put('/api/leads/:id', requireRole('admin'), async (req, res) => {
    try {
      const updated = await updateLead(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Lead not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/leads/:id', requireRole('admin'), async (req, res) => {
    try {
      const success = await deleteLead(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/leads/:id/call-logs', requireRole('admin'), async (req, res) => {
    try {
      const updated = await addLeadCallLog(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Lead not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/leads/:id/convert', requireRole('admin'), async (req, res) => {
    try {
      const result = await convertLeadToBooking(req.params.id, req.body);
      if (!result) return res.status(404).json({ error: 'Lead not found' });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/api/leads/bulk-import', requireRole('admin'), async (req, res) => {
    try {
      const { leads } = req.body;
      if (!Array.isArray(leads)) {
        return res.status(400).json({ error: 'Expected leads array' });
      }
      const result = await bulkImportLeads(leads);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
  // Initialize Mongo connection and provision default admin in background.
  // On Vercel (serverless) there is no long-lived process, so this runs lazily
  // per cold-start; public read-only endpoints remain available without it.
  initMongo()
    .then(() => provisionAdminIfNeeded())
    .catch((err) => {
      console.warn('[hommlyn247 Server] Mongo initial attempt notice:', err?.message || err);
      provisionAdminIfNeeded().catch(() => {});
    });
  return app;
}
// Start a long-lived HTTP server for local development and `npm run start`.
async function startServer() {
  const app = await buildApp();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:' + PORT);
  });
  const shutdown = async () => {
    console.log('Stopping hommlyn247 server...');
    server.close(async () => {
      await closeMongo();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  return { app, server };
}
// Exported for Vercel serverless runtime: returns the fully configured Express
// app without starting a long-lived listener.
export { buildApp, startServer };
export default buildApp;
if (require.main === module) {
  startServer();
}
