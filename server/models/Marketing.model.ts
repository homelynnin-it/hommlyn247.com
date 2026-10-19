import {
  Coupon,
  AnnouncementBanner,
  Review,
  BrandAdCampaign,
  PushNotificationCampaign
} from '../../src/types';
import { getMongoDb } from '../db/connection';
import { memoryStore } from '../db/memoryStore';

// ==========================================
// COUPONS & PROMOS
// ==========================================
export async function getCoupons(): Promise<Coupon[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const items = await mongoDb.collection('coupons').find({}).toArray();
      if (items.length > 0) return items as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo read coupons failed:', err);
    }
  }
  return memoryStore.coupons;
}

export async function createCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
  const mongoDb = getMongoDb();
  const newCoupon: Coupon = {
    id: couponData.id || `cpn-${Date.now()}`,
    code: (couponData.code || 'DISCOUNT10').toUpperCase().trim(),
    description: couponData.description || 'Promotional coupon discount',
    discountType: couponData.discountType || 'fixed',
    discountValue: Number(couponData.discountValue) || 50,
    minOrderAmount: Number(couponData.minOrderAmount) || 199,
    maxDiscount: couponData.maxDiscount ? Number(couponData.maxDiscount) : undefined,
    active: couponData.active ?? true,
    validTill: couponData.validTill || '2026-12-31',
    usageCount: 0,
    applicableCategory: couponData.applicableCategory || 'all'
  };

  memoryStore.coupons.unshift(newCoupon);
  if (mongoDb) {
    try {
      await mongoDb.collection('coupons').insertOne({ ...newCoupon } as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createCoupon failed:', err);
    }
  }
  return newCoupon;
}

export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon | null> {
  const mongoDb = getMongoDb();
  const index = memoryStore.coupons.findIndex(c => c.id === id);
  if (index === -1) return null;

  memoryStore.coupons[index] = { ...memoryStore.coupons[index], ...updates };
  const updated = memoryStore.coupons[index];

  if (mongoDb) {
    try {
      await mongoDb.collection('coupons').updateOne({ id }, { $set: updates });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateCoupon failed:', err);
    }
  }
  return updated;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const mongoDb = getMongoDb();
  const initialLength = memoryStore.coupons.length;
  memoryStore.coupons = memoryStore.coupons.filter(c => c.id !== id);
  const deleted = memoryStore.coupons.length < initialLength;

  if (mongoDb) {
    try {
      await mongoDb.collection('coupons').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deleteCoupon failed:', err);
    }
  }
  return deleted;
}

// ==========================================
// ANNOUNCEMENTS
// ==========================================
export async function getAnnouncement(): Promise<AnnouncementBanner> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const banner = await mongoDb.collection('announcements').findOne({ id: 'current_banner' });
      if (banner) return banner as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo read announcement failed:', err);
    }
  }
  return memoryStore.announcement;
}

export async function updateAnnouncement(announcementData: Partial<AnnouncementBanner>): Promise<AnnouncementBanner> {
  const mongoDb = getMongoDb();
  memoryStore.announcement = {
    ...memoryStore.announcement,
    ...announcementData,
    updatedAt: new Date().toISOString()
  };

  if (mongoDb) {
    try {
      await mongoDb.collection('announcements').updateOne(
        { id: 'current_banner' },
        { $set: memoryStore.announcement },
        { upsert: true }
      );
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateAnnouncement failed:', err);
    }
  }
  return memoryStore.announcement;
}

// ==========================================
// REVIEWS & MODERATION
// ==========================================
export async function getReviews(): Promise<Review[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const items = await mongoDb.collection('reviews').find({}).sort({ createdAt: -1 }).toArray();
      if (items.length > 0) return items as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo read reviews failed:', err);
    }
  }
  return memoryStore.reviews;
}

export async function createReview(reviewData: Partial<Review>): Promise<Review> {
  const mongoDb = getMongoDb();
  const newReview: Review = {
    id: reviewData.id || `rev-${Date.now()}`,
    bookingId: reviewData.bookingId || `HL7-${Math.floor(1000 + Math.random() * 9000)}`,
    helperId: reviewData.helperId || 'hlp-101',
    helperName: reviewData.helperName || 'Domestic Specialist',
    customerName: reviewData.customerName || 'Verified Resident',
    customerCity: reviewData.customerCity || 'Bangalore',
    serviceTitle: reviewData.serviceTitle || 'Home Service',
    category: reviewData.category || 'maid',
    rating: Number(reviewData.rating) || 5,
    comment: reviewData.comment || 'Prompt, professional, and thorough service delivery.',
    tags: reviewData.tags || ['⚡ 15 Min Arrival', '✨ Spotless Service'],
    createdAt: new Date().toISOString(),
    verifiedBooking: reviewData.verifiedBooking ?? true,
    isFeaturedHomepage: reviewData.isFeaturedHomepage ?? false
  };

  memoryStore.reviews.unshift(newReview);
  if (mongoDb) {
    try {
      await mongoDb.collection('reviews').insertOne({ ...newReview } as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createReview failed:', err);
    }
  }
  return newReview;
}

export async function updateReview(id: string, updates: Partial<Review>): Promise<Review | null> {
  const mongoDb = getMongoDb();
  const index = memoryStore.reviews.findIndex(r => r.id === id);
  if (index === -1) return null;

  memoryStore.reviews[index] = { ...memoryStore.reviews[index], ...updates };
  const updated = memoryStore.reviews[index];

  if (mongoDb) {
    try {
      await mongoDb.collection('reviews').updateOne({ id }, { $set: updates });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateReview failed:', err);
    }
  }
  return updated;
}

export async function deleteReview(id: string): Promise<boolean> {
  const mongoDb = getMongoDb();
  const initialLength = memoryStore.reviews.length;
  memoryStore.reviews = memoryStore.reviews.filter(r => r.id !== id);
  const deleted = memoryStore.reviews.length < initialLength;

  if (mongoDb) {
    try {
      await mongoDb.collection('reviews').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deleteReview failed:', err);
    }
  }
  return deleted;
}

// ==========================================
// BRAND ADS & MONETIZATION
// ==========================================
export async function getBrandAds(placement?: string): Promise<BrandAdCampaign[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const query = placement ? { placement, active: true } : {};
      const ads = await mongoDb.collection('brand_ads').find(query).toArray();
      if (ads.length > 0) return ads as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo getBrandAds failed:', err);
    }
  }
  if (placement) {
    return memoryStore.brandAds.filter(a => a.placement === placement && a.active);
  }
  return memoryStore.brandAds;
}

export async function createBrandAd(adData: Partial<BrandAdCampaign>): Promise<BrandAdCampaign> {
  const mongoDb = getMongoDb();
  const newAd: BrandAdCampaign = {
    id: `ad-${Date.now()}`,
    brandName: adData.brandName || 'Brand Partner',
    brandLogoUrl: adData.brandLogoUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=150',
    campaignTitle: adData.campaignTitle || 'Brand Partner Feature',
    tagline: adData.tagline || 'Verified Brand Partner for hommlyn247',
    bannerImageUrl: adData.bannerImageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    placement: adData.placement || 'hero_home',
    targetCategory: adData.targetCategory,
    badgeText: adData.badgeText || 'Official Partner',
    ctaText: adData.ctaText || 'Learn More',
    ctaUrlOrAction: adData.ctaUrlOrAction || '/services',
    impressionsCount: 0,
    clicksCount: 0,
    sponsorContributionAmount: Number(adData.sponsorContributionAmount) || 50000,
    active: adData.active !== undefined ? adData.active : true,
    startDate: adData.startDate || new Date().toISOString().split('T')[0],
    endDate: adData.endDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
  };

  memoryStore.brandAds.unshift(newAd);

  if (mongoDb) {
    try {
      await mongoDb.collection('brand_ads').insertOne(newAd as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo createBrandAd failed:', err);
    }
  }
  return newAd;
}

export async function updateBrandAd(id: string, updates: Partial<BrandAdCampaign>): Promise<BrandAdCampaign | null> {
  const mongoDb = getMongoDb();
  const index = memoryStore.brandAds.findIndex(a => a.id === id);
  if (index === -1) return null;

  memoryStore.brandAds[index] = { ...memoryStore.brandAds[index], ...updates };
  const updated = memoryStore.brandAds[index];

  if (mongoDb) {
    try {
      await mongoDb.collection('brand_ads').updateOne({ id }, { $set: updates });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo updateBrandAd failed:', err);
    }
  }
  return updated;
}

export async function deleteBrandAd(id: string): Promise<boolean> {
  const mongoDb = getMongoDb();
  const initial = memoryStore.brandAds.length;
  memoryStore.brandAds = memoryStore.brandAds.filter(a => a.id !== id);
  const deleted = memoryStore.brandAds.length < initial;

  if (mongoDb) {
    try {
      await mongoDb.collection('brand_ads').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deleteBrandAd failed:', err);
    }
  }
  return deleted;
}

export async function recordBrandAdClick(id: string): Promise<void> {
  const mongoDb = getMongoDb();
  const ad = memoryStore.brandAds.find(a => a.id === id);
  if (ad) ad.clicksCount = (ad.clicksCount || 0) + 1;

  if (mongoDb) {
    try {
      await mongoDb.collection('brand_ads').updateOne({ id }, { $inc: { clicksCount: 1 } });
    } catch (err) {
      console.error('[hommlyn247 DB] recordBrandAdClick failed:', err);
    }
  }
}

export async function recordBrandAdImpression(id: string): Promise<void> {
  const mongoDb = getMongoDb();
  const ad = memoryStore.brandAds.find(a => a.id === id);
  if (ad) ad.impressionsCount = (ad.impressionsCount || 0) + 1;

  if (mongoDb) {
    try {
      await mongoDb.collection('brand_ads').updateOne({ id }, { $inc: { impressionsCount: 1 } });
    } catch (err) {
      console.error('[hommlyn247 DB] recordBrandAdImpression failed:', err);
    }
  }
}

// ==========================================
// PUSH CAMPAIGNS
// ==========================================
export async function getPushCampaigns(): Promise<PushNotificationCampaign[]> {
  const mongoDb = getMongoDb();
  if (mongoDb) {
    try {
      const items = await mongoDb.collection('push_campaigns').find({}).sort({ sentAt: -1 }).toArray();
      if (items.length > 0) return items as any;
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo getPushCampaigns failed:', err);
    }
  }
  return memoryStore.pushCampaigns;
}

export async function broadcastPushCampaign(campaignData: Partial<PushNotificationCampaign>): Promise<PushNotificationCampaign> {
  const mongoDb = getMongoDb();
  const newCampaign: PushNotificationCampaign = {
    id: `push-${Date.now()}`,
    title: campaignData.title || 'Special Society Offer',
    body: campaignData.body || '15-Minute Home Helper at your society gate.',
    targetAudience: campaignData.targetAudience || 'all_residents',
    promoCode: campaignData.promoCode,
    discountValue: campaignData.discountValue,
    actionUrl: campaignData.actionUrl || '/services',
    sentAt: 'Just now',
    sentCount: 3840,
    openedCount: 310,
    clickedCount: 95,
    icon: campaignData.icon || 'Sparkles',
    urgency: campaignData.urgency || 'high',
    status: 'delivered'
  };

  memoryStore.pushCampaigns.unshift(newCampaign);

  if (mongoDb) {
    try {
      await mongoDb.collection('push_campaigns').insertOne(newCampaign as any);
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo broadcastPushCampaign failed:', err);
    }
  }
  return newCampaign;
}

export async function deletePushCampaign(id: string): Promise<boolean> {
  const mongoDb = getMongoDb();
  const initial = memoryStore.pushCampaigns.length;
  memoryStore.pushCampaigns = memoryStore.pushCampaigns.filter(c => c.id !== id);
  const deleted = memoryStore.pushCampaigns.length < initial;

  if (mongoDb) {
    try {
      await mongoDb.collection('push_campaigns').deleteOne({ id });
    } catch (err) {
      console.error('[hommlyn247 DB] Mongo deletePushCampaign failed:', err);
    }
  }
  return deleted;
}
