import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Home,
  Users,
  Utensils,
  Sparkles,
  Baby,
  HeartHandshake,
  Zap,
  Car,
  ShieldCheck,
  ArrowRight,
  Share2,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Info,
  Check,
  Clock,
  Layers,
  Sparkle
} from 'lucide-react';
import { ServiceCategory, PackageDurationType, ShiftMode } from '../types';

interface HouseholdCostCalculatorProps {
  currentCity: string;
  onBookCustomBundle: (config: {
    category: ServiceCategory;
    title: string;
    monthlyPrice: number;
    shiftMode: ShiftMode;
    tasks: string[];
    apartmentSize: string;
    servicesSelected: string[];
  }) => void;
  onRequestCallback: () => void;
}

type ApartmentType = '1bhk' | '2bhk' | '3bhk' | '4bhk' | 'villa';
type FamilyProfile = 'couple' | 'family_kids' | 'seniors' | 'bachelors';

export const HouseholdCostCalculator: React.FC<HouseholdCostCalculatorProps> = ({
  currentCity,
  onBookCustomBundle,
  onRequestCallback
}) => {
  const [apartment, setApartment] = useState<ApartmentType>('3bhk');
  const [profile, setProfile] = useState<FamilyProfile>('family_kids');
  const [city, setCity] = useState<string>(currentCity || 'Bangalore');

  // Selected Services
  const [needMaid, setNeedMaid] = useState(true);
  const [needCook, setNeedCook] = useState(true);
  const [needNanny, setNeedNanny] = useState(false);
  const [needElderCare, setNeedElderCare] = useState(false);
  const [needHandymanMaintenance, setNeedHandymanMaintenance] = useState(true);
  const [needDriver, setNeedDriver] = useState(false);

  // Shift type
  const [shiftDuration, setShiftDuration] = useState<'part_time' | 'dual_shift' | 'half_day' | 'full_day' | 'live_in'>('dual_shift');

  // Multiplier by apartment size
  const aptMultipliers: Record<ApartmentType, { label: string; sqft: string; factor: number }> = {
    '1bhk': { label: '1 BHK', sqft: '600 - 850 sq.ft', factor: 0.8 },
    '2bhk': { label: '2 BHK', sqft: '950 - 1350 sq.ft', factor: 1.0 },
    '3bhk': { label: '3 BHK', sqft: '1400 - 2100 sq.ft', factor: 1.25 },
    '4bhk': { label: '4 BHK+', sqft: '2200 - 3200 sq.ft', factor: 1.55 },
    'villa': { label: 'Villa / Duplex', sqft: '3500+ sq.ft', factor: 1.9 }
  };

  // City wage adjustment
  const cityMultipliers: Record<string, number> = {
    'Bangalore': 1.05,
    'Mumbai': 1.15,
    'Delhi NCR': 1.08,
    'Hyderabad': 0.95,
    'Pune': 0.98,
    'Chennai': 0.95,
    'Kolkata': 0.88
  };

  const cityFactor = cityMultipliers[city] || 1.0;
  const aptFactor = aptMultipliers[apartment].factor;

  // Monthly Price Calculation
  const calculation = useMemo(() => {
    let baseMaid = 0;
    let baseCook = 0;
    let baseNanny = 0;
    let baseElder = 0;
    let baseMaintenance = 0;
    let baseDriver = 0;

    const shiftFactor =
      shiftDuration === 'part_time' ? 0.7 :
      shiftDuration === 'dual_shift' ? 1.0 :
      shiftDuration === 'half_day' ? 1.3 :
      shiftDuration === 'full_day' ? 1.9 : 2.5; // live-in

    if (needMaid) {
      baseMaid = Math.round(3600 * aptFactor * shiftFactor * cityFactor);
    }
    if (needCook) {
      baseCook = Math.round(4200 * aptFactor * shiftFactor * cityFactor);
    }
    if (needNanny) {
      baseNanny = Math.round(8500 * (shiftDuration === 'live_in' ? 2.2 : shiftDuration === 'full_day' ? 1.8 : 1.0) * cityFactor);
    }
    if (needElderCare) {
      baseElder = Math.round(9500 * (shiftDuration === 'live_in' ? 2.4 : shiftDuration === 'full_day' ? 1.9 : 1.0) * cityFactor);
    }
    if (needHandymanMaintenance) {
      baseMaintenance = Math.round(699 * (apartment === 'villa' ? 1.5 : 1.0));
    }
    if (needDriver) {
      baseDriver = Math.round(14000 * (shiftDuration === 'part_time' ? 0.6 : 1.0) * cityFactor);
    }

    const totalStaffSalary = baseMaid + baseCook + baseNanny + baseElder + baseMaintenance + baseDriver;
    // hommlyn CarePlan protection value included (free replacement guarantee, police verification, ₹50k damage cover)
    const carePlanFee = Math.round(totalStaffSalary * 0.08);
    const bundleDiscount = Math.round(totalStaffSalary * 0.12); // 12% multi-service combo savings
    const netMonthlyTotal = totalStaffSalary + carePlanFee - bundleDiscount;

    // Local unorganized market estimate comparison
    const unorganizedBase = totalStaffSalary * 0.95;
    const unorganizedBrokerCommission = 5000; // one-time split across month
    const unorganizedHiddenAbsenceLoss = Math.round(totalStaffSalary * 0.18); // lost days/deductions
    const unorganizedEffectiveCost = Math.round(unorganizedBase + (unorganizedBrokerCommission / 12) + unorganizedHiddenAbsenceLoss);

    return {
      baseMaid,
      baseCook,
      baseNanny,
      baseElder,
      baseMaintenance,
      baseDriver,
      totalStaffSalary,
      carePlanFee,
      bundleDiscount,
      netMonthlyTotal,
      unorganizedEffectiveCost,
      annualSavings: Math.max(8400, (unorganizedEffectiveCost - netMonthlyTotal) * 12 + 6000)
    };
  }, [apartment, shiftDuration, city, needMaid, needCook, needNanny, needElderCare, needHandymanMaintenance, needDriver, aptFactor, cityFactor]);

  const selectedServicesCount = [needMaid, needCook, needNanny, needElderCare, needHandymanMaintenance, needDriver].filter(Boolean).length;

  const handleBookNow = () => {
    const servicesList: string[] = [];
    const tasksList: string[] = [];
    let primaryCat: ServiceCategory = 'maid';

    if (needMaid) {
      servicesList.push('Daily Maid & Floor Mopping');
      tasksList.push('Floor brooming & mopping', 'Utensil dishwashing', 'Kitchen counter sanitization');
      primaryCat = 'maid';
    }
    if (needCook) {
      servicesList.push('Daily Cook & Chef');
      tasksList.push('Breakfast & Dinner preparation', 'Fresh Phulkas/Rotis', 'Sabzi & Dal');
      primaryCat = 'cook';
    }
    if (needNanny) {
      servicesList.push('Nanny & Childcare');
      tasksList.push('Toddler assistance', 'Meal feeding', 'Playtime supervision');
      primaryCat = 'nanny';
    }
    if (needElderCare) {
      servicesList.push('Elder Care Attendant');
      tasksList.push('Vitals monitoring', 'Walking assistance', 'Medicine schedule');
      primaryCat = 'eldercare';
    }
    if (needHandymanMaintenance) {
      servicesList.push('Facility Maintenance Shield');
      tasksList.push('Priority Electrician & Plumber visits');
    }
    if (needDriver) {
      servicesList.push('Dedicated Chauffeur');
      tasksList.push('Office commute & city transit');
    }

    const title = `${aptMultipliers[apartment].label} Household Staffing Bundle (${city})`;

    onBookCustomBundle({
      category: primaryCat,
      title,
      monthlyPrice: calculation.netMonthlyTotal,
      shiftMode: shiftDuration === 'dual_shift' ? 'dual' : 'single',
      tasks: tasksList,
      apartmentSize: aptMultipliers[apartment].label,
      servicesSelected: servicesList
    });
  };

  const handleShareQuoteWhatsApp = () => {
    const text = `🏡 *hommlyn247 Household Staffing & Domestic Budget Estimate*\n\n` +
      `*City:* ${city} | *Home Size:* ${aptMultipliers[apartment].label} (${aptMultipliers[apartment].sqft})\n` +
      `*Shift:* ${shiftDuration.replace('_', ' ').toUpperCase()}\n\n` +
      `*Services Included:*\n` +
      (needMaid ? `• Daily Maid & Mopping: ₹${calculation.baseMaid}/mo\n` : '') +
      (needCook ? `• Daily Cook & Chef: ₹${calculation.baseCook}/mo\n` : '') +
      (needNanny ? `• Nanny & Childcare: ₹${calculation.baseNanny}/mo\n` : '') +
      (needElderCare ? `• Elder Care Attendant: ₹${calculation.baseElder}/mo\n` : '') +
      (needHandymanMaintenance ? `• Electrician & Plumber Shield: ₹${calculation.baseMaintenance}/mo\n` : '') +
      (needDriver ? `• Dedicated Driver: ₹${calculation.baseDriver}/mo\n` : '') +
      `\n` +
      `*Total Monthly Package:* ₹${calculation.netMonthlyTotal}/month\n` +
      `*Includes:* 100% Police Verified Staff + Guaranteed Free Replacements in 2 hrs + CarePlans ₹50,000 Safety Cover.\n\n` +
      `Book online at hommlyn247 (TitanArtstudio) or call 1800-247-HOMM.`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 via-white to-cyan-50/40 border-y border-slate-200" id="household-calculator-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-black uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5 text-cyan-700" />
            <span>Interactive Domestic Budget Planner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0C356A] tracking-tight">
            How Much Does Domestic Staff Cost for Your Home?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Configure your apartment size, daily duties, and shift timings. Get a 100% transparent monthly package with verified police checks, zero broker commissions, and free backup replacements.
          </p>
        </div>

        {/* Main 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Configuration Controls (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">

            {/* 1. Apartment Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-cyan-700" />
                  <span>1. Select Apartment Layout & Size</span>
                </label>
                <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md">
                  {aptMultipliers[apartment].sqft}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(aptMultipliers) as ApartmentType[]).map((aptKey) => (
                  <button
                    key={aptKey}
                    type="button"
                    onClick={() => setApartment(aptKey)}
                    className={`py-2.5 px-1 sm:px-2 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer ${
                      apartment === aptKey
                        ? 'bg-[#0C356A] text-white border-[#0C356A] shadow-xs ring-2 ring-cyan-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/40'
                    }`}
                  >
                    <span className="block leading-tight">{aptMultipliers[aptKey].label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. City & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 block mb-2">
                  City Cluster
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-hidden focus:border-cyan-600 cursor-pointer"
                >
                  <option value="Bangalore">Bangalore (Koramangala, Whitefield, HSR)</option>
                  <option value="Mumbai">Mumbai (BKC, Powai, Andheri, Thane)</option>
                  <option value="Delhi NCR">Delhi NCR (Gurgaon, Noida, South Delhi)</option>
                  <option value="Hyderabad">Hyderabad (Gachibowli, Hitec City, Jubilee)</option>
                  <option value="Pune">Pune (Kothrud, Hinjewadi, Viman Nagar)</option>
                  <option value="Chennai">Chennai (OMR, Anna Nagar, Adyar)</option>
                  <option value="Kolkata">Kolkata (Salt Lake, Newtown, Ballygunge)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 block mb-2">
                  Family Profile
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'family_kids', label: 'Family + Kids' },
                    { id: 'couple', label: 'Working Couple' },
                    { id: 'seniors', label: 'Senior Parents' },
                    { id: 'bachelors', label: 'Shared Flat' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProfile(p.id as FamilyProfile)}
                      className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                        profile === p.id
                          ? 'bg-cyan-50 text-cyan-900 border-cyan-400'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Services Required Checkboxes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-700" />
                  <span>2. Pick Staff & Household Services Needed</span>
                </label>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {selectedServicesCount} services active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Maid */}
                <div
                  onClick={() => setNeedMaid(!needMaid)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    needMaid ? 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-200' : 'bg-slate-50/50 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={needMaid}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-cyan-600 pointer-events-none"
                  />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">🧹 Daily Maid & Mopping</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Brooming, mopping, utensil wash & dusting
                    </p>
                    <span className="text-[11px] font-black text-[#0C356A] mt-1 block">
                      ~₹{calculation.baseMaid}/mo
                    </span>
                  </div>
                </div>

                {/* Cook */}
                <div
                  onClick={() => setNeedCook(!needCook)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    needCook ? 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-200' : 'bg-slate-50/50 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={needCook}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-cyan-600 pointer-events-none"
                  />
                  <div>
                    <span className="font-extrabold text-xs text-slate-900">🍳 Daily Cook & Chef</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Breakfast & Dinner, hot phulkas, dal & sabzi
                    </p>
                    <span className="text-[11px] font-black text-[#0C356A] mt-1 block">
                      ~₹{calculation.baseCook}/mo
                    </span>
                  </div>
                </div>

                {/* Babysitter */}
                <div
                  onClick={() => setNeedNanny(!needNanny)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    needNanny ? 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-200' : 'bg-slate-50/50 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={needNanny}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-cyan-600 pointer-events-none"
                  />
                  <div>
                    <span className="font-extrabold text-xs text-slate-900">🍼 Nanny & Babysitter</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Toddler care, feeding, evening play & hygiene
                    </p>
                    <span className="text-[11px] font-black text-[#0C356A] mt-1 block">
                      ~₹{calculation.baseNanny}/mo
                    </span>
                  </div>
                </div>

                {/* Elder Care */}
                <div
                  onClick={() => setNeedElderCare(!needElderCare)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    needElderCare ? 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-200' : 'bg-slate-50/50 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={needElderCare}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-cyan-600 pointer-events-none"
                  />
                  <div>
                    <span className="font-extrabold text-xs text-slate-900">👴 Elder Care Attendant</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Vitals check, medication reminder & mobility support
                    </p>
                    <span className="text-[11px] font-black text-[#0C356A] mt-1 block">
                      ~₹{calculation.baseElder}/mo
                    </span>
                  </div>
                </div>

                {/* Maintenance Shield */}
                <div
                  onClick={() => setNeedHandymanMaintenance(!needHandymanMaintenance)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    needHandymanMaintenance ? 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-200' : 'bg-slate-50/50 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={needHandymanMaintenance}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-cyan-600 pointer-events-none"
                  />
                  <div>
                    <span className="font-extrabold text-xs text-slate-900">⚡ Electrician & Plumber Shield</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Unlimited priority on-call handyman visits
                    </p>
                    <span className="text-[11px] font-black text-[#0C356A] mt-1 block">
                      ~₹{calculation.baseMaintenance}/mo
                    </span>
                  </div>
                </div>

                {/* Driver */}
                <div
                  onClick={() => setNeedDriver(!needDriver)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    needDriver ? 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-200' : 'bg-slate-50/50 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={needDriver}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-cyan-600 pointer-events-none"
                  />
                  <div>
                    <span className="font-extrabold text-xs text-slate-900">🚗 Private Chauffeur</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Daily office commute & family transit
                    </p>
                    <span className="text-[11px] font-black text-[#0C356A] mt-1 block">
                      ~₹{calculation.baseDriver}/mo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Shift Duration */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-2.5">
                <Clock className="w-4 h-4 text-cyan-700" />
                <span>3. Preferred Shift Duration & Timing</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'part_time', label: '1.5 - 2 Hrs', sub: 'Single Shift' },
                  { id: 'dual_shift', label: 'Dual Shift', sub: 'Morn + Eve' },
                  { id: 'half_day', label: '5 Hours', sub: 'Half Day' },
                  { id: 'full_day', label: '9 Hours', sub: 'Full Day' },
                  { id: 'live_in', label: '24/7 Live-In', sub: 'Full Stay' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShiftDuration(s.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      shiftDuration === s.id
                        ? 'bg-[#0C356A] text-white border-[#0C356A] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-bold text-xs">{s.label}</span>
                    <span className={`block text-[10px] ${shiftDuration === s.id ? 'text-cyan-200' : 'text-slate-400'}`}>
                      {s.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Transparent Budget Breakdown & Direct Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">

            <div className="bg-gradient-to-br from-[#0C356A] via-[#0E7490] to-[#0A2647] rounded-3xl p-6 text-white shadow-xl border border-cyan-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-cyan-800/80 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-white/10 px-2 py-0.5 rounded">
                    Monthly Household Package
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    {aptMultipliers[apartment].label} Staffing Budget
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-cyan-200 block">Total Package</span>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-3xl font-black text-white">₹{calculation.netMonthlyTotal.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-cyan-300">/mo</span>
                  </div>
                </div>
              </div>

              {/* Breakdown Line Items */}
              <div className="space-y-2 text-xs text-cyan-100 mb-5">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Base Verified Staff Remuneration:</span>
                  <span className="font-bold text-white">₹{calculation.totalStaffSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <div className="flex items-center gap-1">
                    <span>CarePlans Replacement & Safety Guarantee:</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="font-bold text-emerald-300">Included (Free)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10 text-emerald-300 font-bold">
                  <span>Multi-Service Combo Savings (12% off):</span>
                  <span>-₹{calculation.bundleDiscount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 text-cyan-200 text-[11px]">
                  <span>Police Verification & KYC Checks:</span>
                  <span className="text-white font-bold">₹0 (Zero Broker Cut)</span>
                </div>
              </div>

              {/* 4 Pillars Trust Chips inside package */}
              <div className="grid grid-cols-2 gap-2 text-[10px] mb-5">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Free Backup Replacement in &lt; 2 hrs</span>
                </div>
                <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>₹50,000 Accidental Damage Cover</span>
                </div>
                <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Police & Biometric Verified</span>
                </div>
                <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Doorstep OTP Attendance</span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-[0.99]"
                >
                  <span>Book This Household Bundle</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleShareQuoteWhatsApp}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Quote to WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={onRequestCallback}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/20"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                    <span>Free Home Trial</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Comparison with Unorganized Local Agency / Maid Broker */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-slate-900 uppercase tracking-wider">
                <span>hommlyn247 vs Local Maid Broker</span>
                <span className="text-emerald-700 font-extrabold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                  Save ₹{calculation.annualSavings.toLocaleString('en-IN')}/year
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 p-2 rounded-xl bg-red-50/70 border border-red-200/60 text-red-950">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-[11px]">
                    <span className="font-bold">Unorganized Local Maid:</span>
                    <p className="text-slate-600 text-[10px]">
                      High broker commissions (₹5,000 upfront), sudden absenteeism, no background checks, zero insurance against damage or theft.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px]">
                    <span className="font-bold">hommlyn247 Guarantee:</span>
                    <p className="text-slate-600 text-[10px]">
                      Zero broker commission, 100% police verified with certificate ID, automated replacement within 2 hours, and digital GST invoicing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
