export type ServiceCategory =
  | 'all'
  | 'maid'
  | 'cook'
  | 'electrician'
  | 'plumber'
  | 'driver'
  | 'security'
  | 'nanny'
  | 'deep_clean'
  | 'appliance'
  | 'eldercare'
  | 'carpenter'
  | 'pestcontrol'
  | 'gardener'
  | 'painter';

export type PackageDurationType = 'hourly' | 'daily' | 'monthly';
export type ShiftMode = 'single' | 'dual' | 'triple';

export interface ReadyMadeTemplate {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  category: ServiceCategory;
  serviceId: string;
  recommendedPackage: PackageDurationType;
  shiftMode: ShiftMode;
  visitsPerDay: number;
  defaultMorningSlot?: string;
  defaultEveningSlot?: string;
  defaultAfternoonSlot?: string;
  defaultTasks: string[];
  approxMonthlyPrice: number;
  savingsPercentage: number;
  highlightPills: string[];
  iconName: string;
  imageUrl: string;
  popular?: boolean;
}

export interface ServicePricingTier {
  type: PackageDurationType;
  label: string;
  price: number;
  unit: string;
  durationText: string;
  description: string;
  popular?: boolean;
  savingsBadge?: string;
}

export interface ServiceTaskOption {
  id: string;
  name: string;
  priceDelta: number;
  description?: string;
  defaultChecked?: boolean;
}

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  title: string;
  subtitle: string;
  tagline: string;
  basePrice: number;
  unit: 'per hr' | 'per visit' | 'per meal' | 'per day' | 'per month';
  badge: string;
  eta: string;
  rating: number;
  reviewsCount: number;
  availableCount: number;
  iconName: string;
  imageUrl: string;
  popular?: boolean;
  tasks: ServiceTaskOption[];
  includedHighlights: string[];
  equipmentProvided: boolean;
  pricingTiers?: ServicePricingTier[];
}

export interface CarePlan {
  id: string;
  code: string;
  title: string;
  durationMonths: number;
  badge: string;
  price: number;
  isPopular?: boolean;
  features: string[];
  validityText: string;
  category?: ServiceCategory;
  prioritySupport?: boolean;
  replacementsIncluded?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'book_service' | 'care_plan';
    serviceId?: string;
    serviceTitle?: string;
    suggestedDate?: string;
    suggestedTime?: string;
    price?: number;
    category?: ServiceCategory;
  };
}

export interface Helper {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryTitle: string;
  photoUrl: string;
  rating: number;
  completedJobs: number;
  experienceYears: number;
  languages: string[];
  hourlyRate: number;
  isAvailable: boolean;
  policeVerified: boolean;
  aadharVerified: boolean;
  trainingCertified: boolean;
  healthCheckPassed: boolean;
  location: string;
  currentEtaMinutes: number;
  bio: string;
  phone: string;
}

export type BookingStatus =
  | 'pending'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type BookingType = 'instant' | 'scheduled' | 'subscription';

export interface BookingCustomer {
  name: string;
  phone: string;
  address: string;
  houseNumber: string;
  city: string;
  pincode: string;
  instructions?: string;
}

export interface BookingPricing {
  baseAmount: number;
  addOnsAmount: number;
  platformFee: number;
  taxAmount: number;
  discount: number;
  total: number;
}

export interface Booking {
  id: string;
  userId?: string;
  serviceId: string;
  category: ServiceCategory;
  serviceTitle: string;
  bookingType: BookingType;
  scheduledDate: string;
  scheduledTimeSlot: string;
  durationHours: number;
  frequency: 'one-time' | 'daily' | 'alternate-days' | 'monthly';
  selectedTasks: string[];
  customer: BookingCustomer;
  helper?: Helper;
  status: BookingStatus;
  otp: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cash';
  packageType?: PackageDurationType;
  gatePassCode?: string;
  safetySosTriggered?: boolean;
  shiftMode?: ShiftMode;
  visitsPerDay?: number;
  timeSlots?: string[];
  morningSlot?: string;
  eveningSlot?: string;
  afternoonSlot?: string;
  templateName?: string;
  pricing: BookingPricing;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  userRating?: number;
  userReview?: string;
}

export interface PaymentTransaction {
  id: string;
  userId?: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: 'upi' | 'card' | 'netbanking' | 'cash';
  status: 'success' | 'pending' | 'failed' | 'refunded';
  referenceId: string;
  upiId?: string;
  cardLast4?: string;
  bankName?: string;
  serviceTitle: string;
  customerName: string;
  timestamp: string;
  invoiceUrl?: string;
}

export interface MongoDbStatus {
  connected: boolean;
  mode: 'mongodb' | 'in-memory-fallback';
  databaseName: string;
  uriConfigured: boolean;
  lastChecked: string;
  error?: string;
  stats: {
    servicesCount: number;
    helpersCount: number;
    bookingsCount: number;
    transactionsCount: number;
  };
}

export type AppWindow = 'home' | 'services' | 'client' | 'provider' | 'admin' | 'simulator';

export interface Review {
  id: string;
  userId?: string;
  bookingId: string;
  helperId: string;
  helperName: string;
  customerName: string;
  customerCity: string;
  serviceTitle: string;
  category: ServiceCategory;
  rating: number; // 1 to 5
  comment: string;
  tags: string[];
  createdAt: string;
  verifiedBooking: boolean;
  isFeaturedHomepage?: boolean;
}

export interface AppNotification {
  id: string;
  target: 'all' | 'client' | 'provider' | 'admin';
  title: string;
  message: string;
  type: 'order' | 'dispatch' | 'otp' | 'payment' | 'review' | 'system';
  timestamp: string;
  read: boolean;
  bookingId?: string;
  actionUrl?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  society: string;
  city: string;
  serviceTitle: string;
  helperName: string;
  rating: number;
  comment: string;
  avatarUrl: string;
  tag: string;
  verifiedMember: boolean;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  role: 'client' | 'provider' | 'admin';
  joinedDate: string;
  avatarUrl?: string;
}

export interface SentEmail {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  previewText: string;
  htmlContent: string;
  timestamp: string;
  type: 'welcome' | 'order_confirmation' | 'otp_alert' | 'partner_onboarding' | 'registration_welcome';
  bookingId?: string;
}

export type LegalDocType = 'about' | 'contact' | 'terms' | 'privacy' | 'refund' | 'safety' | null;

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  active: boolean;
  validTill: string;
  usageCount: number;
  applicableCategory?: ServiceCategory | 'all';
}

export interface AnnouncementBanner {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency' | 'promo';
  active: boolean;
  ctaText?: string;
  ctaLink?: string;
  linkText?: string;
  linkUrl?: string;
  updatedAt: string;
}

export interface BrandAdCampaign {
  id: string;
  brandName: string;
  brandLogoUrl: string;
  campaignTitle: string;
  tagline: string;
  bannerImageUrl: string;
  placement: 'hero_home' | 'service_category' | 'checkout_upsell' | 'tracking_screen';
  targetCategory?: ServiceCategory;
  badgeText: string;
  ctaText: string;
  ctaUrlOrAction: string;
  impressionsCount: number;
  clicksCount: number;
  sponsorContributionAmount: number;
  active: boolean;
  startDate: string;
  endDate: string;
}

export interface PushNotificationCampaign {
  id: string;
  title: string;
  body: string;
  targetAudience: 'all_residents' | 'inactive_users' | 'active_subscribers' | 'koramangala_hsr' | 'whitefield_bellandur' | 'prestige_shantiniketan' | 'inactive_30d' | 'high_spenders' | 'first_time_users' | string;
  promoCode?: string;
  discountValue?: string | number;
  actionUrl?: string;
  sentAt: string;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  icon?: string;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
  status: 'delivered' | 'scheduled';
}

export type LeadSource =
  | 'justdial'
  | 'direct_call'
  | 'facebook_meta'
  | 'referral'
  | 'society_kiosk'
  | 'whatsapp'
  | 'google_search'
  | 'website_form'
  | 'walk_in';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'discussion'
  | 'interview_scheduled'
  | 'trial_active'
  | 'converted'
  | 'follow_up'
  | 'lost';

export type LeadPriority = 'hot' | 'warm' | 'cold' | 'immediate';

export interface CallLogEntry {
  id: string;
  timestamp: string;
  telecallerName: string;
  callOutcome: 'connected' | 'busy' | 'callback_requested' | 'not_reachable' | 'converted' | 'rejected' | 'left_whatsapp';
  notes: string;
  nextFollowUpDate?: string;
}

export interface LeadClient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  societyOrLocality: string;
  city: string;
  pincode?: string;
  source: LeadSource;
  requirementCategory: ServiceCategory | 'all_rounder' | 'multiple';
  requirementDescription: string;
  shiftPreference: 'full_time_24hr' | 'day_12hr' | 'part_time_morning' | 'part_time_evening' | 'live_in' | 'hourly';
  budgetExpectation: string | number;
  priority: LeadPriority;
  status: LeadStatus;
  assignedTelecaller: string;
  createdAt: string;
  updatedAt: string;
  nextFollowUpDate?: string;
  callLogs: CallLogEntry[];
  tags?: string[];
  convertedBookingId?: string;
}
