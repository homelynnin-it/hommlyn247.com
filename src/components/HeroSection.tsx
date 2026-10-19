import React from 'react';
import {
  Zap,
  Search,
  Sparkles,
  Utensils,
  Wrench,
  Car,
  ShieldCheck,
  HeartHandshake,
  Flame,
  Tv,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface HeroSectionProps {
  selectedCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickBookMaid: () => void;
  onQuickBookCook: () => void;
  onOpenLeadModal?: () => void;
  onOpenEmergencySos?: () => void;
  onOpenCalculator?: () => void;
}

const CATEGORIES: { id: ServiceCategory; label: string; icon: React.ReactNode; eta: string }[] = [
  { id: 'all', label: 'All Services', icon: <Sparkles className="w-4 h-4" />, eta: 'Instant' },
  { id: 'maid', label: 'House Maid', icon: <Sparkles className="w-4 h-4 text-cyan-600" />, eta: '12m' },
  { id: 'cook', label: 'Home Cook', icon: <Utensils className="w-4 h-4 text-cyan-700" />, eta: '18m' },
  { id: 'electrician', label: 'Electrician', icon: <Zap className="w-4 h-4 text-amber-500" />, eta: '15m' },
  { id: 'plumber', label: 'Plumber', icon: <Wrench className="w-4 h-4 text-cyan-600" />, eta: '20m' },
  { id: 'driver', label: 'Car Driver', icon: <Car className="w-4 h-4 text-emerald-600" />, eta: '25m' },
  { id: 'security', label: 'Security Guard', icon: <ShieldCheck className="w-4 h-4 text-blue-700" />, eta: '45m' },
  { id: 'nanny', label: 'Nanny / Babysitter', icon: <HeartHandshake className="w-4 h-4 text-pink-600" />, eta: '30m' },
  { id: 'deep_clean', label: 'Deep Cleaning', icon: <Flame className="w-4 h-4 text-teal-600" />, eta: 'Today' },
  { id: 'appliance', label: 'Appliance & AC', icon: <Tv className="w-4 h-4 text-cyan-700" />, eta: '30m' }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onQuickBookMaid,
  onQuickBookCook,
  onOpenLeadModal,
  onOpenEmergencySos,
  onOpenCalculator
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/70 via-white to-slate-50 border-b border-cyan-100/70 pt-8 pb-10">
      {/* Subtle decorative background circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Main Headline & Slogan */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-300 text-cyan-900 text-xs font-bold mb-4 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
            <span>Trusted Hands for Your Home and Family • CarePlans Protected</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0C356A] tracking-tight leading-tight">
            Verified Helpers At Your Doorstep in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009688] via-[#0891B2] to-[#0C356A]">
              15 Minutes.
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
            Reliable domestic help with guaranteed free replacement. Book maids, cooks, electricians, plumbers, drivers, security, and nannies on-demand or with monthly CarePlans.
          </p>

          {/* Quick Action Badges / Callouts */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4">
            <button
              onClick={onQuickBookMaid}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-cyan-200 shadow-2xs hover:shadow-xs hover:border-cyan-500 text-xs font-semibold text-slate-800 transition-all cursor-pointer group"
              id="hero-quick-maid"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Book Maid Now</span>
              <span className="text-slate-400 text-[11px] font-normal">from ₹199/hr</span>
              <ArrowRight className="w-3 h-3 text-cyan-700 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onQuickBookCook}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-cyan-200 shadow-2xs hover:shadow-xs hover:border-cyan-500 text-xs font-semibold text-slate-800 transition-all cursor-pointer group"
              id="hero-quick-cook"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Book Cook Now</span>
              <span className="text-slate-400 text-[11px] font-normal">from ₹249/visit</span>
              <ArrowRight className="w-3 h-3 text-cyan-700 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Monthly Budget Calculator */}
            {onOpenCalculator && (
              <button
                onClick={onOpenCalculator}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-cyan-300 shadow-2xs hover:shadow-xs hover:border-cyan-600 text-xs font-bold text-[#0C356A] transition-all cursor-pointer group"
                id="hero-quick-calc"
              >
                <span>🧮 Monthly Staff Calculator</span>
                <ArrowRight className="w-3 h-3 text-cyan-700 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {onOpenLeadModal && (
              <button
                onClick={onOpenLeadModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50/90 border border-cyan-300 shadow-2xs hover:shadow-xs hover:border-cyan-600 text-xs font-bold text-cyan-900 transition-all cursor-pointer group"
                id="hero-quick-quote"
              >
                <Headphones className="w-3 h-3 text-cyan-700" />
                <span>Request Custom Quote & Callback</span>
                <ArrowRight className="w-3 h-3 text-cyan-700 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            <span className="text-xs text-slate-500 hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              Arrives in ~12 mins near you
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white rounded-2xl shadow-md shadow-slate-200/70 border border-slate-200 p-1.5 transition-all focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-100">
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-cyan-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search services (e.g. daily maid, cook for lunch, fan repair, driver, nanny)..."
              className="w-full py-2.5 text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              id="search-services-input"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="px-2.5 text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Horizontal Scroll / Chips */}
        <div className="overflow-x-auto pb-3 pt-1 scrollbar-none">
          <div className="flex items-center gap-2 justify-start md:justify-center min-w-max px-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#0C356A] text-white border-[#0C356A] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200/90 hover:border-cyan-300 hover:bg-cyan-50/50'
                  }`}
                  id={`cat-btn-${cat.id}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {cat.id !== 'all' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                        isActive ? 'bg-white/20 text-cyan-200' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.eta}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Trust Highlights Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto pt-4 border-t border-slate-200/60">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-cyan-700 text-cyan-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">15 Min Arrival</p>
              <p className="text-[11px] text-slate-500">Fastest dispatch guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Police & ID Verified</p>
              <p className="text-[11px] text-slate-500">100% Background checked</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Free Replacement</p>
              <p className="text-[11px] text-slate-500">CarePlans protection</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Zero Advance Cash</p>
              <p className="text-[11px] text-slate-500">Pay after satisfied service</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
