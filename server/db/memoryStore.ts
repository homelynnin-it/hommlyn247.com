import {
  ServiceItem,
  Helper,
  Booking,
  PaymentTransaction,
  CarePlan,
  Coupon,
  AnnouncementBanner,
  Review,
  UserProfile,
  BrandAdCampaign,
  PushNotificationCampaign,
  LeadClient
} from '../../src/types';
import {
  INITIAL_SERVICES,
  INITIAL_HELPERS,
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_CAREPLANS,
  INITIAL_COUPONS,
  INITIAL_ANNOUNCEMENT,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_BRAND_ADS,
  INITIAL_PUSH_CAMPAIGNS,
  INITIAL_LEADS
} from '../seeds';

export interface AuthCredential {
  userId: string;
  email: string;
  phone: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  tokenHash: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export class DataStore {
  services: ServiceItem[] = [...INITIAL_SERVICES];
  helpers: Helper[] = [...INITIAL_HELPERS];
  bookings: Booking[] = [...INITIAL_BOOKINGS];
  transactions: PaymentTransaction[] = [...INITIAL_TRANSACTIONS];
  carePlans: CarePlan[] = [...INITIAL_CAREPLANS];
  coupons: Coupon[] = [...INITIAL_COUPONS];
  announcement: AnnouncementBanner = { ...INITIAL_ANNOUNCEMENT };
  reviews: Review[] = [...INITIAL_REVIEWS];
  users: UserProfile[] = [...INITIAL_USERS];
  brandAds: BrandAdCampaign[] = [...INITIAL_BRAND_ADS];
  pushCampaigns: PushNotificationCampaign[] = [...INITIAL_PUSH_CAMPAIGNS];
  leads: LeadClient[] = [...INITIAL_LEADS];
  credentials: AuthCredential[] = [];
  sessions: SessionRecord[] = [];
}

export const memoryStore = new DataStore();
