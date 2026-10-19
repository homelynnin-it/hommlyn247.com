import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  Eye,
  MousePointerClick,
  IndianRupee,
  Calendar,
  Tag,
  RefreshCw,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { BrandAdCampaign, ServiceCategory } from '../../types';
import { INITIAL_BRAND_ADS } from '../../data/servicePresets';

interface BrandAdsCMSProps {
  isDarkMode: boolean;
}

export const BrandAdsCMS: React.FC<BrandAdsCMSProps> = ({ isDarkMode }) => {
  const [ads, setAds] = useState<BrandAdCampaign[]>(INITIAL_BRAND_ADS);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Ad Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [brandName, setBrandName] = useState('Lizol India');
  const [brandLogoUrl, setBrandLogoUrl] = useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=150');
  const [campaignTitle, setCampaignTitle] = useState('10x Better Floor Germ Protection');
  const [tagline, setTagline] = useState('Recommended by hommlyn247 Verified Maids across 120+ Societies');
  const [bannerImageUrl, setBannerImageUrl] = useState('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800');
  const [placement, setPlacement] = useState<BrandAdCampaign['placement']>('hero_home');
  const [targetCategory, setTargetCategory] = useState<ServiceCategory>('maid');
  const [badgeText, setBadgeText] = useState('Official Hygiene Partner');
  const [ctaText, setCtaText] = useState('Claim Flat ₹40 Lizol Kit with Maid Order');
  const [ctaUrlOrAction, setCtaUrlOrAction] = useState('/services?category=maid');
  const [sponsorContributionAmount, setSponsorContributionAmount] = useState('75000');
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchBrandAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ads/brands');
      if (res.ok) {
        const data = await res.json();
        setAds(data);
      }
    } catch (err) {
      console.warn('Fallback to local brand ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandAds();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const updated = !currentActive;
    try {
      await fetch(`/api/ads/brands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: updated })
      });
      setAds(prev => prev.map(a => a.id === id ? { ...a, active: updated } : a));
      showToast(`Campaign ${updated ? 'activated' : 'paused'}`);
    } catch (err) {
      setAds(prev => prev.map(a => a.id === id ? { ...a, active: updated } : a));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/ads/brands/${id}`, { method: 'DELETE' });
      setAds(prev => prev.filter(a => a.id !== id));
      showToast('Brand ad campaign deleted');
    } catch (err) {
      setAds(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: Partial<BrandAdCampaign> = {
      brandName: brandName.trim(),
      brandLogoUrl: brandLogoUrl.trim(),
      campaignTitle: campaignTitle.trim(),
      tagline: tagline.trim(),
      bannerImageUrl: bannerImageUrl.trim(),
      placement,
      targetCategory,
      badgeText: badgeText.trim(),
      ctaText: ctaText.trim(),
      ctaUrlOrAction: ctaUrlOrAction.trim(),
      sponsorContributionAmount: parseInt(sponsorContributionAmount, 10) || 50000,
      startDate,
      endDate,
      active: true
    };

    try {
      const res = await fetch('/api/ads/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setAds(prev => [created, ...prev]);
        showToast('Brand partner ad campaign launched successfully!');
      } else {
        throw new Error('Failed to create ad on server');
      }
    } catch (err) {
      // Local fallback
      const fallbackAd: BrandAdCampaign = {
        id: `ad-${Date.now()}`,
        ...(payload as any),
        impressionsCount: 0,
        clicksCount: 0
      };
      setAds(prev => [fallbackAd, ...prev]);
      showToast('Campaign registered locally (ready for MongoDB sync)');
    } finally {
      setIsSubmitting(false);
      setIsAddModalOpen(false);
    }
  };

  // 1-Click Fast Brand Template Presets
  const applyPresetBrand = (type: 'lizol' | 'philips' | 'tata' | 'havells' | 'urban') => {
    if (type === 'lizol') {
      setBrandName('Lizol Disinfectant India');
      setBrandLogoUrl('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=150');
      setCampaignTitle('10x Better Floor Germ Protection with Verified Maids');
      setTagline('Exclusive hygiene partner for hommlyn247 residential cleaning network');
      setBannerImageUrl('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800');
      setPlacement('hero_home');
      setTargetCategory('maid');
      setBadgeText('Official Hygiene Partner');
      setCtaText('Get Free Lizol Disinfectant Kit with Maid');
      setCtaUrlOrAction('/services?category=maid');
      setSponsorContributionAmount('85000');
    } else if (type === 'philips') {
      setBrandName('Philips Air Fryer & Kitchenware');
      setBrandLogoUrl('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=150');
      setCampaignTitle('90% Less Oil Cooking by Certified Home Chefs');
      setTagline('Experience guilt-free biryani & snacks made in your kitchen');
      setBannerImageUrl('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800');
      setPlacement('service_category');
      setTargetCategory('cook');
      setBadgeText('Kitchen Wellness Sponsor');
      setCtaText('Book Cook & Request Airfryer Demo');
      setCtaUrlOrAction('/services?category=cook');
      setSponsorContributionAmount('95000');
    } else if (type === 'havells') {
      setBrandName('Havells Smart Living');
      setBrandLogoUrl('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=150');
      setCampaignTitle('Instant MCB & Inverter Diagnostic Shield');
      setTagline('Installed with certified Havells copper wiring & 1000V insulation');
      setBannerImageUrl('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800');
      setPlacement('service_category');
      setTargetCategory('electrician');
      setBadgeText('Certified Safety Partner');
      setCtaText('Book Electrician with Havells Hardware');
      setCtaUrlOrAction('/services?category=electrician');
      setSponsorContributionAmount('60000');
    } else if (type === 'urban') {
      setBrandName('Sleepwell Mattress Sanitization');
      setBrandLogoUrl('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=150');
      setCampaignTitle('Anti-Allergen Dustmite Deep Vacuuming');
      setTagline('UV-C light chemical free deep sanitization for healthy sleep');
      setBannerImageUrl('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800');
      setPlacement('checkout_upsell');
      setTargetCategory('deep_clean');
      setBadgeText('Clean Sleep Verified');
      setCtaText('Add Mattress UV Sanitization (+₹199)');
      setCtaUrlOrAction('/services?category=deep_clean');
      setSponsorContributionAmount('50000');
    }
  };

  // Aggregated Sponsor Metrics
  const totalSponsorRevenue = ads.reduce((acc, a) => acc + (a.sponsorContributionAmount || 0), 0);
  const totalImpressions = ads.reduce((acc, a) => acc + (a.impressionsCount || 0), 0);
  const totalClicks = ads.reduce((acc, a) => acc + (a.clicksCount || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '12.4';

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner & KPI Row */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <h2 className={`text-base font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Brand Partnership & Sponsorship Placement Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase">
                Enterprise Ad Monetization
              </span>
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Monetize domestic resident traffic by offering high-visibility ad placements to FMCG brands, appliance manufacturers, and home-care sponsors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBrandAds}
              disabled={loading}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Brand Campaign</span>
            </button>
          </div>
        </div>

        {/* 4 Commercial Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
            <span className="text-[11px] font-semibold text-slate-400 block">Sponsor Contribution Revenue</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                ₹{totalSponsorRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">+100% Margin</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
            <span className="text-[11px] font-semibold text-slate-400 block">Total Resident Impressions</span>
            <span className={`text-lg font-black mt-0.5 block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {totalImpressions.toLocaleString()}
            </span>
          </div>

          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
            <span className="text-[11px] font-semibold text-slate-400 block">Brand Clicks / Engagements</span>
            <span className={`text-lg font-black mt-0.5 block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {totalClicks.toLocaleString()}
            </span>
          </div>

          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
            <span className="text-[11px] font-semibold text-slate-400 block">Average Platform CTR</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {avgCtr}%
              </span>
              <span className="text-[10px] text-teal-600 font-bold">Industry High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className={`p-5 rounded-2xl border transition-all ${
              isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
            }`}
          >
            {/* Ad Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={ad.brandLogoUrl}
                  alt={ad.brandName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {ad.brandName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold border border-teal-200 dark:border-teal-800">
                      {ad.badgeText}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 capitalize">
                    Placement: <span className="font-semibold text-teal-700 dark:text-teal-400">{ad.placement.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>

              {/* Status Toggle & Delete */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleActive(ad.id, ad.active)}
                  className="p-1 text-slate-400 hover:text-teal-600 cursor-pointer"
                  title={ad.active ? 'Pause Campaign' : 'Activate Campaign'}
                >
                  {ad.active ? (
                    <ToggleRight className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                  title="Delete Campaign"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Campaign Visual Banner Mockup */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-3 group">
              <img
                src={ad.bannerImageUrl}
                alt={ad.campaignTitle}
                className="w-full h-32 object-cover transition-transform group-hover:scale-102 duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Sponsored</span>
                <h4 className="font-extrabold text-sm leading-tight text-white drop-shadow-xs">{ad.campaignTitle}</h4>
                <p className="text-[11px] text-slate-200 line-clamp-1 opacity-90">{ad.tagline}</p>
              </div>
            </div>

            {/* Ad Metrics & Call to Action */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs mb-3">
              <div>
                <span className="text-[10px] text-slate-400 block">Sponsor Fee</span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                  ₹{ad.sponsorContributionAmount?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Impressions</span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                  {ad.impressionsCount?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Clicks</span>
                <span className="font-extrabold text-teal-700 dark:text-teal-400 font-mono">
                  {ad.clicksCount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA Preview */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{ad.startDate} → {ad.endDate}</span>
              </div>
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                <span>{ad.ctaText}</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create New Brand Campaign */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Launch Brand Partner Ad Campaign
                </h3>
                <p className="text-xs text-slate-500">Configure sponsored placements, banner creative, and target services</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Brand Presets */}
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-900 space-y-2">
              <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>⚡ 1-Click Brand Partner Presets:</span>
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyPresetBrand('lizol')}
                  className="p-1.5 text-center bg-white dark:bg-slate-800 rounded-xl border border-teal-200 text-xs font-bold hover:bg-teal-100 cursor-pointer"
                >
                  Lizol
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetBrand('philips')}
                  className="p-1.5 text-center bg-white dark:bg-slate-800 rounded-xl border border-teal-200 text-xs font-bold hover:bg-teal-100 cursor-pointer"
                >
                  Philips
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetBrand('havells')}
                  className="p-1.5 text-center bg-white dark:bg-slate-800 rounded-xl border border-teal-200 text-xs font-bold hover:bg-teal-100 cursor-pointer"
                >
                  Havells
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetBrand('urban')}
                  className="p-1.5 text-center bg-white dark:bg-slate-800 rounded-xl border border-teal-200 text-xs font-bold hover:bg-teal-100 cursor-pointer"
                >
                  Sleepwell
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateAd} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Text *</label>
                  <input
                    type="text"
                    required
                    value={badgeText}
                    onChange={e => setBadgeText(e.target.value)}
                    placeholder="Official Hygiene Partner"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Campaign Headline *</label>
                <input
                  type="text"
                  required
                  value={campaignTitle}
                  onChange={e => setCampaignTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tagline / Value Prop *</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ad Placement Zone *</label>
                  <select
                    value={placement}
                    onChange={e => setPlacement(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
                  >
                    <option value="hero_home">Home Top Hero Banner</option>
                    <option value="service_category">Service Category Screen</option>
                    <option value="checkout_upsell">Checkout Add-on / Upsell</option>
                    <option value="tracking_screen">15-Min Live Map Tracking</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Category</label>
                  <select
                    value={targetCategory}
                    onChange={e => setTargetCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
                  >
                    <option value="maid">House Maid</option>
                    <option value="cook">Home Cook</option>
                    <option value="electrician">Electrician</option>
                    <option value="deep_clean">Deep Cleaning</option>
                    <option value="driver">Driver</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sponsor Fee (₹)</label>
                  <input
                    type="number"
                    value={sponsorContributionAmount}
                    onChange={e => setSponsorContributionAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Banner Image URL</label>
                <div className="flex gap-2 items-center">
                  <img
                    src={bannerImageUrl}
                    alt="Preview"
                    className="w-14 h-10 rounded-lg object-cover border border-slate-300 shrink-0"
                  />
                  <input
                    type="url"
                    value={bannerImageUrl}
                    onChange={e => setBannerImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Launching...' : 'Launch Brand Campaign'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
