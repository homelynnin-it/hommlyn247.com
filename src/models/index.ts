// TypeScript Data Models for Swiftly
// Mirrors prisma/schema.prisma for seamless client & server operation

export type ServiceCategory =
  | 'maid'
  | 'cook'
  | 'electrician'
  | 'plumber'
  | 'driver'
  | 'security'
  | 'nanny'
  | 'deep_clean'
  | 'appliance';

export type BookingType = 'instant' | 'scheduled' | 'subscription';

export type BookingStatus =
  | 'pending'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type Frequency = 'one-time' | 'daily' | 'alternate-days' | 'monthly';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cash';

export interface TaskOptionModel {
  id: string;
  name: string;
  priceDelta: number;
  description?: string;
  defaultChecked?: boolean;
}

export interface CustomerDetailsModel {
  name: string;
  phone: string;
  address: string;
  houseNumber: string;
  city: string;
  pincode: string;
  instructions?: string;
}

export interface PricingBreakdownModel {
  baseAmount: number;
  addOnsAmount: number;
  platformFee: number;
  taxAmount: number;
  discount: number;
  total: number;
}

export interface VerificationChecklistModel {
  policeVerified: boolean;
  aadharVerified: boolean;
  trainingCertified: boolean;
  healthCheckPassed: boolean;
}

export interface ServiceModel {
  id: string;
  slug: string;
  category: ServiceCategory;
  title: string;
  subtitle: string;
  tagline: string;
  basePrice: number;
  unit: string;
  badge: string;
  eta: string;
  rating: number;
  reviewsCount: number;
  availableCount: number;
  iconName: string;
  popular: boolean;
  equipmentProvided: boolean;
  includedHighlights: string[];
  tasks: TaskOptionModel[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HelperModel {
  id: string;
  helperCode: string;
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
  verification: VerificationChecklistModel;
  location: string;
  currentEtaMinutes: number;
  bio: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingModel {
  id: string;
  bookingRef: string;
  serviceId: string;
  category: ServiceCategory;
  serviceTitle: string;
  bookingType: BookingType;
  scheduledDate: string;
  scheduledTimeSlot: string;
  durationHours: number;
  frequency: Frequency;
  selectedTasks: string[];
  customer: CustomerDetailsModel;
  helperId?: string;
  helper?: HelperModel;
  status: BookingStatus;
  otp: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  pricing: PricingBreakdownModel;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransactionModel {
  id: string;
  txnRef: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  referenceId: string;
  upiId?: string;
  cardLast4?: string;
  serviceTitle: string;
  customerName: string;
  timestamp: string;
  invoiceUrl?: string;
}

export interface ReviewModel {
  id: string;
  bookingId: string;
  helperId: string;
  rating: number;
  feedback?: string;
  createdAt: string;
}

export interface PartnerPayoutModel {
  id: string;
  helperId: string;
  date: string;
  totalEarned: number;
  jobsCompleted: number;
  payoutStatus: 'PENDING' | 'SETTLED';
  settledAt?: string;
  createdAt: string;
}

export interface UserProfileModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  role: 'client' | 'provider' | 'admin';
  avatarUrl?: string;
  joinedDate: string;
}

export interface CarePlanModel {
  id: string;
  title: string;
  pricePerMonth: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  badge: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface CouponModel {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount: number;
  description: string;
}

export interface AnnouncementBannerModel {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  buttonText: string;
  isActive: boolean;
}

export interface TransactionalEmailModel {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bodyPreview: string;
  timestamp: string;
  type: 'booking_confirmation' | 'service_assigned' | 'otp_verification' | 'invoice_receipt';
}

export interface BrandAdCampaignModel {
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

export interface PushNotificationCampaignModel {
  id: string;
  title: string;
  body: string;
  targetAudience: 'all_residents' | 'inactive_users' | 'active_subscribers' | 'koramangala_hsr' | 'whitefield_bellandur';
  promoCode?: string;
  discountValue?: string;
  actionUrl?: string;
  sentAt: string;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  icon?: string;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
  status: 'delivered' | 'scheduled';
}
