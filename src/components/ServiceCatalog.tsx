import React, { useState } from 'react';
import {
  Sparkles,
  Utensils,
  Zap,
  Wrench,
  Car,
  ShieldCheck,
  HeartHandshake,
  Flame,
  Tv,
  Star,
  Clock,
  Check,
  Calendar,
  Users,
  ShieldAlert,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { ServiceItem, ServiceCategory, PackageDurationType } from '../types';

interface ServiceCatalogProps {
  services: ServiceItem[];
  selectedCategory: ServiceCategory;
  searchQuery: string;
  onSelectService: (service: ServiceItem, mode: 'instant' | 'scheduled', initialPackage?: PackageDurationType) => void;
}

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles className="w-4 h-4 text-cyan-700" />;
    case 'Utensils':
      return <Utensils className="w-4 h-4 text-cyan-800" />;
    case 'Zap':
      return <Zap className="w-4 h-4 text-amber-500" />;
    case 'Wrench':
      return <Wrench className="w-4 h-4 text-cyan-600" />;
    case 'Car':
      return <Car className="w-4 h-4 text-emerald-600" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4 text-blue-700" />;
    case 'HeartHandshake':
      return <HeartHandshake className="w-4 h-4 text-pink-600" />;
    case 'Flame':
      return <Flame className="w-4 h-4 text-teal-600" />;
    case 'Tv':
      return <Tv className="w-4 h-4 text-cyan-700" />;
    default:
      return <Sparkles className="w-4 h-4 text-cyan-700" />;
  }
};

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  services,
  selectedCategory,
  searchQuery,
  onSelectService
}) => {
  const [selectedPackageFilter, setSelectedPackageFilter] = useState<'all' | PackageDurationType>('all');

  // Filter by category, search and package duration filter
  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.tasks.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPackage =
      selectedPackageFilter === 'all' ||
      (srv.pricingTiers && srv.pricingTiers.some(t => t.type === selectedPackageFilter));

    return matchesCategory && matchesSearch && matchesPackage;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="services-grid-section">
      {/* Competitor / Snabbit & Quick-Commerce Advantage Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-cyan-900 via-cyan-800 to-[#0C356A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-cyan-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-cyan-950 font-black flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-5 h-5 fill-cyan-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-amber-300">
                ⚡ Snabbit-Speed Dispatch
              </span>
              <span className="text-xs text-cyan-200">12 - 15 Mins Guaranteed Arrival</span>
            </div>
            <p className="text-xs text-cyan-100 mt-0.5">
              Instant helpers for rapid dishwashing, kitchen prep, ironing, or choose <strong>Full Day Pass</strong> & <strong>Monthly CarePlans</strong> with zero absentee guarantee.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>65+ Active Pros</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>100% Police Verified</span>
          </div>
        </div>
      </div>

      {/* Header and Package Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0C356A] tracking-tight">
            {selectedCategory === 'all' ? 'All On-Demand Home Services & Packages' : `Available ${selectedCategory.toUpperCase()} Services`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Flexible booking options: Hourly on-demand, Full Day passes, and Monthly CarePlan subscriptions.
          </p>
        </div>

        {/* Package Mode Tabs (Hourly, Daily, Monthly) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setSelectedPackageFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedPackageFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Packages
          </button>
          <button
            onClick={() => setSelectedPackageFilter('hourly')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedPackageFilter === 'hourly'
                ? 'bg-[#0E7490] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Hourly (15-Min Instant)</span>
          </button>
          <button
            onClick={() => setSelectedPackageFilter('daily')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedPackageFilter === 'daily'
                ? 'bg-[#0C356A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Per Day Pass (8-10 Hrs)</span>
          </button>
          <button
            onClick={() => setSelectedPackageFilter('monthly')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedPackageFilter === 'monthly'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Monthly CarePlan</span>
          </button>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs max-w-lg mx-auto">
          <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-700">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No services found</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try searching for terms like "maid", "cook", "express", "eldercare", or reset package filters.
          </p>
          <button
            onClick={() => {
              setSelectedPackageFilter('all');
            }}
            className="px-4 py-2 bg-[#0E7490] text-white rounded-xl text-xs font-bold hover:bg-[#0C356A] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-cyan-400 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              id={`service-card-${service.id}`}
            >
              {/* Service Hero Image & Badge */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Badges on image */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#0C356A]/90 text-white backdrop-blur-xs shadow-xs">
                    {getServiceIcon(service.iconName)}
                    <span className="text-white">{service.badge}</span>
                  </span>
                  {service.eta.includes('10') || service.eta.includes('12') || service.eta.includes('15') ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400 text-cyan-950 shadow-xs">
                      ⚡ 15-Min Doorstep
                    </span>
                  ) : null}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{service.rating}</span>
                    <span className="text-slate-300 font-normal text-[11px]">({service.reviewsCount})</span>
                  </div>

                  <span className="text-[11px] bg-emerald-500/90 backdrop-blur-xs text-white font-bold px-2 py-0.5 rounded-md">
                    ⚡ {service.availableCount} available now
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0C356A] transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {service.subtitle}
                </p>

                {/* Highlights list */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                  {service.includedHighlights.slice(0, 3).map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Available Package Tiers Strip */}
                {service.pricingTiers && service.pricingTiers.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Choose Package Duration
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {service.pricingTiers.map((tier) => (
                        <button
                          key={tier.type}
                          onClick={() => onSelectService(service, tier.type === 'hourly' ? 'instant' : 'scheduled', tier.type)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-cyan-500 bg-slate-50/70 hover:bg-cyan-50/50 transition-all text-left flex flex-col justify-between cursor-pointer group/tier"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-bold text-slate-700 capitalize">
                              {tier.type}
                            </span>
                            {tier.savingsBadge && (
                              <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-1 rounded">
                                {tier.savingsBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-black text-[#0C356A] group-hover/tier:text-cyan-700">
                            ₹{tier.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Price & Action Buttons */}
              <div className="p-5 pt-3 bg-cyan-50/40 border-t border-cyan-100/60">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[11px] text-slate-500">Starting at</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-slate-900">₹{service.basePrice}</span>
                      <span className="text-xs font-medium text-slate-500">/{service.unit}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-cyan-800 bg-cyan-100 font-semibold px-2 py-0.5 rounded-md">
                    CarePlan eligible
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectService(service, 'instant', 'hourly')}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0E7490] hover:bg-[#0C356A] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs shadow-cyan-900/10 active:scale-[0.98] transition-all cursor-pointer"
                    id={`btn-instant-${service.id}`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Book 15-Min</span>
                  </button>

                  <button
                    onClick={() => onSelectService(service, 'scheduled', 'daily')}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                    id={`btn-schedule-${service.id}`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span>Day / Month Pass</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
