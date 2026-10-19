import React, { useState } from 'react';
import {
  Building2,
  Users,
  MapPin,
  Tag,
  Sparkles,
  ArrowRight,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ChevronRight,
  TrendingUp,
  Percent,
  Plus
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface SocietyPool {
  id: string;
  societyName: string;
  city: string;
  tower: string;
  serviceTitle: string;
  category: ServiceCategory;
  serviceId: string;
  residentsJoined: number;
  targetResidents: number;
  discountPercentage: number;
  savingsText: string;
  timeSlot: string;
  badge: string;
}

const POPULAR_SOCIETIES = [
  'Prestige Shantiniketan (Whitefield, Bangalore)',
  'DLF Phase 5 (Golf Course Rd, Gurgaon)',
  'Hiranandani Gardens (Powai, Mumbai)',
  'Sobha City (Thanisandra, Bangalore)',
  'Godrej Woods (Sector 43, Noida)',
  'Brigade Gateway (Rajajinagar, Bangalore)',
  'My Home Bhooja (Hitec City, Hyderabad)',
  'Lodha Park (Worli, Mumbai)',
  'Purva Palm Beach (Hennur, Bangalore)'
];

const INITIAL_POOLS: SocietyPool[] = [
  {
    id: 'pool-1',
    societyName: 'Prestige Shantiniketan (Whitefield, Bangalore)',
    city: 'Bangalore',
    tower: 'Tower 4 & 5 (B-Wing)',
    serviceTitle: 'Morning Maid & Floor Deep Mopping',
    category: 'maid',
    serviceId: 'preset-maid',
    residentsJoined: 4,
    targetResidents: 5,
    discountPercentage: 15,
    savingsText: 'Save ₹650/month per flat',
    timeSlot: '07:30 AM - 09:30 AM',
    badge: '1 Slot Left for 15% OFF'
  },
  {
    id: 'pool-2',
    societyName: 'Prestige Shantiniketan (Whitefield, Bangalore)',
    city: 'Bangalore',
    tower: 'Tower 9 (Executive Towers)',
    serviceTitle: 'Daily Home Cook & Fresh Phulka Prep',
    category: 'cook',
    serviceId: 'preset-cook',
    residentsJoined: 3,
    targetResidents: 4,
    discountPercentage: 20,
    savingsText: 'Save ₹900/month + Free Salad Prep',
    timeSlot: '06:30 PM - 08:30 PM (Dinner)',
    badge: 'Trending in Prestige'
  },
  {
    id: 'pool-3',
    societyName: 'DLF Phase 5 (Golf Course Rd, Gurgaon)',
    city: 'Delhi NCR',
    tower: 'The Crest / Tower B',
    serviceTitle: 'Infant Babysitter & Childcare Nanny',
    category: 'nanny',
    serviceId: 'srv-nanny',
    residentsJoined: 3,
    targetResidents: 3,
    discountPercentage: 15,
    savingsText: 'Verified Pediatric Nanny on-site',
    timeSlot: '10:00 AM - 02:00 PM',
    badge: 'Pool Full • Join Waitlist'
  },
  {
    id: 'pool-4',
    societyName: 'Hiranandani Gardens (Powai, Mumbai)',
    city: 'Mumbai',
    tower: 'Heritage / Somerset Wing',
    serviceTitle: 'Weekend Kitchen & Bathroom Deep Cleaning',
    category: 'deep_clean',
    serviceId: 'preset-deep-clean',
    residentsJoined: 6,
    targetResidents: 8,
    discountPercentage: 25,
    savingsText: 'Save ₹850 on Deep Scrubbing',
    timeSlot: 'Saturdays 09:00 AM - 01:00 PM',
    badge: 'Mega Society Weekend'
  }
];

interface SocietyPoolingSectionProps {
  onJoinPool: (pool: SocietyPool) => void;
  onOpenRwaCallback: () => void;
  currentCity: string;
}

export const SocietyPoolingSection: React.FC<SocietyPoolingSectionProps> = ({
  onJoinPool,
  onOpenRwaCallback,
  currentCity
}) => {
  const [selectedSociety, setSelectedSociety] = useState<string>(POPULAR_SOCIETIES[0]);
  const [customSocietyInput, setCustomSocietyInput] = useState('');
  const [pools, setPools] = useState<SocietyPool[]>(INITIAL_POOLS);
  const [showAddPoolModal, setShowAddPoolModal] = useState(false);
  const [newPoolTower, setNewPoolTower] = useState('');
  const [newPoolService, setNewPoolService] = useState('Daily Maid & Floor Mopping');

  const filteredPools = pools.filter(p =>
    p.societyName.toLowerCase().includes(selectedSociety.toLowerCase().split(' (')[0]) ||
    selectedSociety === 'All Societies'
  );

  const handleShareToSocietyWhatsApp = (pool: SocietyPool) => {
    const text = `🏢 *Hey Neighbors at ${pool.societyName}!*\n\n` +
      `We have an active hommlyn247 domestic helper pool for *${pool.serviceTitle}* in *${pool.tower}*!\n\n` +
      `• *Current Members:* ${pool.residentsJoined}/${pool.targetResidents} flats\n` +
      `• *Discount:* ${pool.discountPercentage}% OFF (${pool.savingsText})\n` +
      `• *Schedule:* ${pool.timeSlot}\n` +
      `• *Staff:* 100% Police Verified with hommlyn CarePlans free backup replacement.\n\n` +
      `Join this pool to save transit fees and lock in the 15% discount together!`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCreateNewPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoolTower.trim()) return;

    const newP: SocietyPool = {
      id: `pool-${Date.now()}`,
      societyName: selectedSociety,
      city: currentCity || 'Bangalore',
      tower: newPoolTower,
      serviceTitle: newPoolService,
      category: newPoolService.includes('Cook') ? 'cook' : 'maid',
      serviceId: newPoolService.includes('Cook') ? 'preset-cook' : 'preset-maid',
      residentsJoined: 1,
      targetResidents: 4,
      discountPercentage: 15,
      savingsText: 'Flat 15% Society Group Discount',
      timeSlot: 'Morning Shift (07:30 AM - 09:30 AM)',
      badge: 'New Resident Pool'
    };

    setPools([newP, ...pools]);
    setShowAddPoolModal(false);
    setNewPoolTower('');
  };

  return (
    <section className="py-12 bg-white border-b border-slate-200" id="society-pooling-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Gated Society & Apartment Community Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0C356A] tracking-tight">
              Apartment Pooling: Group Bookings & Save 15-20%
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              When 3+ flats in your apartment tower share a verified maid, cook, or deep cleaning slot, you eliminate travel delays and unlock community bulk discounts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddPoolModal(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-700" />
              <span>Start Pool for Your Tower</span>
            </button>
            <button
              onClick={onOpenRwaCallback}
              className="px-4 py-2.5 rounded-xl bg-[#0C356A] hover:bg-[#082245] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span>RWA / Society Kiosk Partnership</span>
            </button>
          </div>
        </div>

        {/* Society Selector Bar */}
        <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold shrink-0">
            <MapPin className="w-4 h-4 text-cyan-700" />
            <span>Select Your Apartment Complex:</span>
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <select
              value={selectedSociety}
              onChange={(e) => setSelectedSociety(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:border-cyan-600 cursor-pointer"
            >
              {POPULAR_SOCIETIES.map((soc) => (
                <option key={soc} value={soc}>{soc}</option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-slate-500 hidden lg:block shrink-0">
            Over 120+ Gated Communities Active in India
          </div>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPools.map((pool) => {
            const progressPercent = Math.min(100, Math.round((pool.residentsJoined / pool.targetResidents) * 100));
            const isFull = pool.residentsJoined >= pool.targetResidents;

            return (
              <div
                key={pool.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-cyan-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge Strip */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {pool.badge}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      <span>{pool.discountPercentage}% OFF</span>
                    </span>
                  </div>

                  {/* Title & Tower */}
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {pool.serviceTitle}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-800 font-semibold mt-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                    <span>{pool.tower}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    ⏰ {pool.timeSlot}
                  </p>

                  {/* Progress towards discount */}
                  <div className="my-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Society Flats Joined:</span>
                      <span className="text-[#0C356A] font-extrabold">
                        {pool.residentsJoined} / {pool.targetResidents} Flats
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull ? 'bg-emerald-500' : 'bg-cyan-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
                      <span>{pool.savingsText}</span>
                      <span className="text-emerald-700 font-bold">
                        {isFull ? 'Target Met!' : `${pool.targetResidents - pool.residentsJoined} more needed`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onJoinPool(pool)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#0C356A] hover:bg-[#082245] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Join This Pool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleShareToSocietyWhatsApp(pool)}
                    className="p-2.5 rounded-xl border border-emerald-300 hover:bg-emerald-50 text-emerald-800 transition-colors cursor-pointer"
                    title="Invite Neighbors via WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Advantage Highlights for Gated Communities */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-3xl bg-cyan-50/60 border border-cyan-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white text-cyan-800 flex items-center justify-center shrink-0 shadow-2xs font-bold">
              1
            </div>
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Zero Transit Wait Times</h5>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Staff stays inside your tower cluster, seamlessly moving from Flat 402 to Flat 504 on time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white text-cyan-800 flex items-center justify-center shrink-0 shadow-2xs font-bold">
              2
            </div>
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Society Gate Pre-Approved Pass</h5>
              <p className="text-[11px] text-slate-600 mt-0.5">
                MyGate & NoBrokerHood permanent QR pass eliminates daily security delay at visitor booths.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white text-cyan-800 flex items-center justify-center shrink-0 shadow-2xs font-bold">
              3
            </div>
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Shared Backup Coverage</h5>
              <p className="text-[11px] text-slate-600 mt-0.5">
                If one worker is on medical leave, hommlyn's on-site tower buffer pro steps in immediately.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal to start a new pool */}
      {showAddPoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-slate-900">
                Start a New Tower Pool
              </h4>
              <button
                onClick={() => setShowAddPoolModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Create a group for your apartment tower. Invite your neighbors to join and everyone unlocks a flat 15% discount.
            </p>

            <form onSubmit={handleCreateNewPool} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Apartment Society
                </label>
                <input
                  type="text"
                  value={selectedSociety}
                  readOnly
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tower / Wing (e.g. Tower C, 4th Floor)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower B (Flats 301-801)"
                  value={newPoolTower}
                  onChange={(e) => setNewPoolTower(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Service Type
                </label>
                <select
                  value={newPoolService}
                  onChange={(e) => setNewPoolService(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  <option value="Daily Maid & Floor Mopping">Daily Maid & Floor Mopping</option>
                  <option value="Daily Home Cook & Chef">Daily Home Cook & Chef</option>
                  <option value="Infant Babysitter & Childcare">Infant Babysitter & Childcare</option>
                  <option value="Weekend Deep Mopping & Sanitization">Weekend Deep Mopping & Sanitization</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPoolModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0C356A] hover:bg-[#082245] text-white text-xs font-extrabold cursor-pointer"
                >
                  Create Tower Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
