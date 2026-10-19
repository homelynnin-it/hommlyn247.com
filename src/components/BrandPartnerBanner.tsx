import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { BrandAdCampaign } from '../types';
import { INITIAL_BRAND_ADS } from '../data/servicePresets';

interface BrandPartnerBannerProps {
  placement?: string;
  onSelectCategory?: (category: string) => void;
}

export const BrandPartnerBanner: React.FC<BrandPartnerBannerProps> = ({
  placement = 'hero_home',
  onSelectCategory
}) => {
  const [ads, setAds] = useState<BrandAdCampaign[]>(INITIAL_BRAND_ADS);
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/ads/brands?placement=${placement}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAds(data);
        }
      })
      .catch(() => {});
  }, [placement]);

  const currentAd = ads[activeAdIndex] || ads[0];

  useEffect(() => {
    if (currentAd && currentAd.id) {
      // Record impression
      fetch(`/api/ads/brands/${currentAd.id}/impression`, { method: 'POST' }).catch(() => {});
    }
  }, [currentAd?.id]);

  if (!currentAd) return null;

  const handleAdClick = () => {
    if (currentAd.id) {
      fetch(`/api/ads/brands/${currentAd.id}/click`, { method: 'POST' }).catch(() => {});
    }
    if (currentAd.targetCategory && onSelectCategory) {
      onSelectCategory(currentAd.targetCategory);
    } else if (currentAd.ctaUrlOrAction && currentAd.ctaUrlOrAction.startsWith('http')) {
      window.open(currentAd.ctaUrlOrAction, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-emerald-500/30">

        {/* Background ambient decorative shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Brand Sponsor Identity & Tagline */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={currentAd.brandLogoUrl}
                alt={currentAd.brandName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover bg-white p-1 border-2 border-emerald-400/50 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>Verified</span>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  {currentAd.badgeText || 'Brand Partner'}
                </span>
                <span className="text-[11px] text-teal-200/80 font-medium">
                  Official Sponsor • {currentAd.brandName}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {currentAd.campaignTitle}
              </h3>
              <p className="text-xs md:text-sm text-slate-200 max-w-xl leading-relaxed">
                {currentAd.tagline}
              </p>
            </div>
          </div>

          {/* Right: CTA Button & Partner Ad Switcher */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {ads.length > 1 && (
              <div className="flex items-center gap-1.5 bg-emerald-950/60 p-1 rounded-full border border-emerald-500/20">
                {ads.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveAdIndex(idx)}
                    aria-label={`Show partner ad ${idx + 1}`}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      activeAdIndex === idx ? 'w-5 bg-emerald-400' : 'bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

            <button
              onClick={handleAdClick}
              className="px-6 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs md:text-sm transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>{currentAd.ctaText || 'Explore Partner Offer'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
