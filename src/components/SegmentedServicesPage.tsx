import React, { useState } from 'react';
import {
  Sparkles,
  Utensils,
  Zap,
  Wrench,
  Car,
  ShieldCheck,
  HeartHandshake,
  Star,
  Clock,
  Check,
  ArrowRight,
  Search,
  Filter,
  Users,
  Calendar,
  Baby,
  Activity,
  Award,
  ChevronRight,
  Tv,
  Trees,
  Paintbrush,
  Bug,
  Shield
} from 'lucide-react';
import { ServiceItem, ServiceCategory, Helper, PackageDurationType } from '../types';

interface SegmentedServicesPageProps {
  services: ServiceItem[];
  helpers: Helper[];
  onSelectService: (service: ServiceItem, mode: 'instant' | 'scheduled', initialPackage?: PackageDurationType) => void;
  onSelectCarePlan?: (planCode: string) => void;
}

export interface ServiceSegment {
  id: string;
  category: ServiceCategory | 'all';
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  badge: string;
}

export const SEGMENTS: ServiceSegment[] = [
  {
    id: 'seg-all',
    category: 'all',
    title: 'All Segments',
    subtitle: 'Entire verified fleet directory',
    icon: Sparkles,
    color: 'from-cyan-600 to-blue-700',
    badge: '15-Min Guaranteed'
  },
  {
    id: 'seg-maid',
    category: 'maid',
    title: 'Housekeeping & Sanitation',
    subtitle: 'Daily maid, mopping, dusting & utensil care',
    icon: Sparkles,
    color: 'from-cyan-500 to-teal-700',
    badge: 'Fastest 12 Min'
  },
  {
    id: 'seg-cook',
    category: 'cook',
    title: 'Gourmet Culinary & Cooks',
    subtitle: 'Breakfast, lunch, dinner & custom spice taste',
    icon: Utensils,
    color: 'from-amber-500 to-orange-600',
    badge: 'Custom Taste'
  },
  {
    id: 'seg-nanny',
    category: 'nanny',
    title: 'Infant Childcare & Nannies',
    subtitle: 'Pediatric verified babysitters & child monitoring',
    icon: Baby,
    color: 'from-pink-500 to-rose-600',
    badge: 'Pediatric Verified'
  },
  {
    id: 'seg-eldercare',
    category: 'eldercare',
    title: 'Senior Citizen Care & Escort',
    subtitle: 'Doctor visit escort, medication reminders & companion walk',
    icon: HeartHandshake,
    color: 'from-purple-500 to-indigo-700',
    badge: 'Compassion Certified'
  },
  {
    id: 'seg-deepclean',
    category: 'deep_clean',
    title: 'Deep House Scrubbing',
    subtitle: 'Industrial machine floor scrub & kitchen degreasing',
    icon: ShieldCheck,
    color: 'from-emerald-600 to-teal-800',
    badge: 'Hospital-Grade'
  },
  {
    id: 'seg-pestcontrol',
    category: 'pestcontrol',
    title: 'Pest Control & Bedbug Shield',
    subtitle: '100% odorless Bayer gel & herbal fogging treatments',
    icon: Bug,
    color: 'from-emerald-500 to-green-700',
    badge: '100% Odorless'
  },
  {
    id: 'seg-gardener',
    category: 'gardener',
    title: 'Gardener & Terrace Care',
    subtitle: 'Balcony plants potting, lawn trimming & organic soil nourishment',
    icon: Trees,
    color: 'from-green-600 to-emerald-800',
    badge: 'Green Thumb'
  },
  {
    id: 'seg-painter',
    category: 'painter',
    title: 'Painter & Wall Touch-Up',
    subtitle: 'Waterproof touchup, drill hole putty & room painting',
    icon: Paintbrush,
    color: 'from-rose-500 to-red-700',
    badge: 'Dust-Free Rollers'
  },
  {
    id: 'seg-appliance',
    category: 'appliance',
    title: 'Appliance Repair & AC Service',
    subtitle: 'AC jet cleaning, fridge cooling & washing machine fix',
    icon: Tv,
    color: 'from-sky-600 to-blue-800',
    badge: '90-Day Warranty'
  },
  {
    id: 'seg-security',
    category: 'security',
    title: 'Security Personnel & Guard',
    subtitle: 'Residential gate guarding, event security & personal escort',
    icon: Shield,
    color: 'from-slate-700 to-slate-900',
    badge: 'Trained & Alert'
  },
  {
    id: 'seg-driver',
    category: 'driver',
    title: 'Chauffeurs & Personal Drivers',
    subtitle: 'Commercial DL, office commute & outstation drives',
    icon: Car,
    color: 'from-emerald-500 to-teal-700',
    badge: 'Safe Driving'
  },
  {
    id: 'seg-electrician',
    category: 'electrician',
    title: 'ITI Electrician Repairs',
    subtitle: 'Fan rewiring, lights, MCB tripping & switches',
    icon: Zap,
    color: 'from-amber-600 to-yellow-600',
    badge: '30-Day Warranty'
  },
  {
    id: 'seg-plumber',
    category: 'plumber',
    title: 'Master Plumbing & Drainage',
    subtitle: 'Leak fixes, blocked pipelines & sanitary fittings',
    icon: Wrench,
    color: 'from-blue-600 to-cyan-700',
    badge: 'Fixed Pricing'
  }
];

export const SegmentedServicesPage: React.FC<SegmentedServicesPageProps> = ({
  services,
  helpers,
  onSelectService,
  onSelectCarePlan
}) => {
  const [activeSegmentId, setActiveSegmentId] = useState<string>('seg-all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState<'one-time' | 'weekly' | 'monthly'>('one-time');

  const activeSegment = SEGMENTS.find(s => s.id === activeSegmentId) || SEGMENTS[0];

  const filteredServices = services.filter(srv => {
    const matchesCategory = activeSegment.category === 'all' || srv.category === activeSegment.category;
    const matchesSearch =
      searchQuery.trim() === '' ||
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.tasks.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getMultiplier = () => {
    if (selectedFrequency === 'weekly') return 0.9; // 10% discount
    if (selectedFrequency === 'monthly') return 0.8; // 20% discount
    return 1.0;
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#0C356A] via-[#0E7490] to-[#009688] rounded-3xl p-8 text-white shadow-xl shadow-cyan-950/20 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-cyan-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Vast Multi-Segment Domestic Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Segment-Wise Domestic Help & Verified Specialists
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
            Choose from housekeeping, culinary chefs, infant nannies, personal chauffeurs, and home technicians. Pick instant 15-minute dispatch or lock in recurring shift savings.
          </p>
        </div>

        {/* Floating Stat Badges */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-cyan-200 block text-[11px]">Average Arrival</span>
            <span className="font-extrabold text-white text-base">12-15 Mins</span>
          </div>
          <div>
            <span className="text-cyan-200 block text-[11px]">Staff Verification</span>
            <span className="font-extrabold text-emerald-300 text-base">100% Police Checked</span>
          </div>
          <div>
            <span className="text-cyan-200 block text-[11px]">Customer Rating</span>
            <span className="font-extrabold text-amber-300 text-base">4.91 / 5.0 (45k+)</span>
          </div>
          <div>
            <span className="text-cyan-200 block text-[11px]">Replacement Warranty</span>
            <span className="font-extrabold text-white text-base">Free CarePlan SLA</span>
          </div>
        </div>
      </div>

      {/* Segment Selector Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">Explore by Specialized Segment</h2>
          <span className="text-xs text-slate-500 font-semibold">{SEGMENTS.length - 1} Segments Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {SEGMENTS.map(seg => {
            const Icon = seg.icon;
            const isSelected = activeSegmentId === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => setActiveSegmentId(seg.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0C356A] text-white border-[#0C356A] shadow-md shadow-cyan-950/20 scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-cyan-50 text-cyan-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-cyan-500/40 text-cyan-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {seg.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-xs leading-tight line-clamp-1">{seg.title}</h3>
                  <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-cyan-200' : 'text-slate-400'}`}>
                    {seg.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Frequency Switcher Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeSegment.title.toLowerCase()}...`}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
          />
        </div>

        {/* Frequency & Discount Switcher */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">Frequency Plan:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedFrequency('one-time')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedFrequency === 'one-time' ? 'bg-[#0C356A] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              One-Time (Instant)
            </button>
            <button
              onClick={() => setSelectedFrequency('weekly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedFrequency === 'weekly' ? 'bg-[#0C356A] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Weekly (10% Off)
            </button>
            <button
              onClick={() => setSelectedFrequency('monthly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedFrequency === 'monthly' ? 'bg-[#0C356A] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Monthly (20% Off)
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(srv => {
          const discountedPrice = Math.round(srv.basePrice * getMultiplier());
          return (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={srv.imageUrl}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-900/90 text-white font-extrabold text-[10px] backdrop-blur-md uppercase tracking-wider border border-cyan-400/30">
                    {srv.badge}
                  </span>
                  {srv.popular && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                      Most Booked
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-black text-lg text-white leading-tight">{srv.title}</h3>
                  <p className="text-xs text-cyan-100 line-clamp-1">{srv.tagline}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

                {/* Meta stats */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1 text-slate-700 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{srv.rating}</span>
                    <span className="text-slate-400 font-normal">({srv.reviewsCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-800 font-bold">
                    <Clock className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{srv.eta}</span>
                  </div>
                </div>

                {/* Task Checklist preview */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tasks & Inclusions
                  </span>
                  <div className="space-y-1">
                    {srv.tasks.slice(0, 3).map(task => (
                      <div key={task.id} className="flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="line-clamp-1">{task.name}</span>
                        </div>
                        {task.priceDelta > 0 && (
                          <span className="text-[10px] font-semibold text-slate-400">+₹{task.priceDelta}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Tiers Badges */}
                {srv.pricingTiers && srv.pricingTiers.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-center">
                    {srv.pricingTiers.map(t => (
                      <button
                        key={t.type}
                        onClick={() => onSelectService(srv, t.type === 'hourly' ? 'instant' : 'scheduled', t.type)}
                        className="p-1 rounded-lg border border-slate-100 hover:border-cyan-400 bg-slate-50/70 hover:bg-cyan-50/40 text-left transition-colors cursor-pointer"
                      >
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">{t.type}</span>
                        <span className="text-[11px] font-black text-[#0C356A]">₹{t.price}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Price & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting At</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-[#0C356A]">₹{discountedPrice}</span>
                      <span className="text-[11px] text-slate-500 font-semibold">{srv.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectService(srv, 'instant', 'hourly')}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0C356A] to-[#0E7490] hover:from-[#082245] hover:to-[#085a70] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-300" />
                      <span>15-Min Book</span>
                    </button>
                    <button
                      onClick={() => onSelectService(srv, 'scheduled', 'daily')}
                      className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      title="Schedule Day or Monthly Pass"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Homelynn CarePlans Direct Teaser Banner */}
      {onSelectCarePlan && (
        <div className="bg-gradient-to-br from-slate-900 to-[#071952] rounded-3xl p-8 text-white border border-cyan-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-cyan-900 text-cyan-200 text-xs font-black uppercase tracking-wider border border-cyan-700">
              Zero Staff Departure Risk
            </span>
            <h3 className="text-2xl font-black text-white">
              Upgrade to a Homelynn CarePlan & Enjoy Free Replacements
            </h3>
            <p className="text-xs text-slate-300">
              Whether your cook travels to village or maid moves away, our Care 90°, 180°, and 365° plans guarantee verified standby replacements within 24 hours at ₹0 extra fee.
            </p>
          </div>

          <button
            onClick={() => onSelectCarePlan('CARE-180')}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
          >
            <span>View CarePlans & Guarantees</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
