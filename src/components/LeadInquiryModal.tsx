import React, { useState } from 'react';
import {
  X,
  Phone,
  User,
  MapPin,
  Building,
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Headphones,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface LeadInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity?: string;
  onSuccess?: (lead: any) => void;
}

export const LeadInquiryModal: React.FC<LeadInquiryModalProps> = ({
  isOpen,
  onClose,
  currentCity = 'Bangalore',
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(currentCity);
  const [society, setSociety] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('maid');
  const [shiftPreference, setShiftPreference] = useState('dual_shift');
  const [homeSize, setHomeSize] = useState('2bhk');
  const [callbackTime, setCallbackTime] = useState('immediate');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedLead, setSubmittedLead] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        phone: `+91 ${cleanPhone.slice(-10)}`,
        city: city || 'Bangalore',
        societyOrLocality: society.trim() || 'Residential Locality',
        requirementCategory: category,
        shiftPreference: shiftPreference,
        homeSize: homeSize,
        budgetExpectation: shiftPreference === 'dual_shift' ? '₹8,500 - ₹12,000 / mo' : '₹5,000 - ₹8,000 / mo',
        requirementDescription: `${homeSize.toUpperCase()} Home • Preferred Shift: ${shiftPreference.replace(/_/g, ' ')} • Preferred Callback: ${callbackTime.toUpperCase()}${notes ? ' • Notes: ' + notes : ''}`,
        source: 'website_form',
        priority: 'high',
        status: 'new'
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to submit inquiry. Please try again.');
      }

      const createdLead = await res.json();
      setSubmittedLead(createdLead);
      if (onSuccess) onSuccess(createdLead);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedLead(null);
    setName('');
    setPhone('');
    setSociety('');
    setNotes('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-150"
        id="lead-inquiry-modal"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0C356A] via-[#0E7490] to-teal-800 p-5 sm:p-6 text-white relative">
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            id="close-lead-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>VIP Household Concierge & Custom Quote</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Request Callback & Tailored Quote
          </h2>
          <p className="text-xs text-cyan-100 mt-1">
            Need dual-shift routines, live-in maids, or specialized cooking? Our relationship manager will call with customized pricing and helper profiles in 15 minutes.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {submittedLead ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Inquiry Logged #{submittedLead.id}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Request Confirmed!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Thank you, <strong>{submittedLead.name}</strong>. Our telecalling manager has received your requirement for <strong>{submittedLead.requirementCategory.toUpperCase()}</strong> ({submittedLead.shiftPreference.replace(/_/g, ' ')}).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-bold text-slate-800">{submittedLead.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Locality:</span>
                  <span className="font-bold text-slate-800">{submittedLead.societyOrLocality}, {submittedLead.city}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Expected Call Window:</span>
                  <span className="font-bold text-cyan-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Within 15 Minutes
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3 bg-[#0C356A] hover:bg-[#071952] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Locality & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Society / Apartment / Locality
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={society}
                      onChange={(e) => setSociety(e.target.value)}
                      placeholder="e.g. Prestige Lakeside, Koramangala"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-600 focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    {['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service & Shift Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Service Requirement
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-600 focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="maid">House Maid & Cleaning</option>
                    <option value="cook">Gourmet Home Cook</option>
                    <option value="nanny">Babysitter / Nanny</option>
                    <option value="eldercare">Senior Citizen Companion</option>
                    <option value="driver">Personal Chauffeur / Driver</option>
                    <option value="deep_clean">Deep House Scrubbing</option>
                    <option value="pestcontrol">Pest Control Shield</option>
                    <option value="gardener">Gardener & Terrace Care</option>
                    <option value="painter">Painter & Wall Touch-Up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Shift / Timing Preference
                  </label>
                  <select
                    value={shiftPreference}
                    onChange={(e) => setShiftPreference(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-600 focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="dual_shift">🌅 + 🌙 Dual-Shift (Morning + Evening)</option>
                    <option value="morning_shift">☀️ Morning Shift Only (1 Visit)</option>
                    <option value="evening_shift">🌙 Evening Shift Only (1 Visit)</option>
                    <option value="full_day">⏰ Full Day In-House (8-10 Hours)</option>
                    <option value="live_in">🏠 24/7 Live-in Helper</option>
                  </select>
                </div>
              </div>

              {/* Home Size & Preferred Callback Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Home Size / Scope
                  </label>
                  <select
                    value={homeSize}
                    onChange={(e) => setHomeSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-600 focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="1bhk">1 BHK / Studio Flat</option>
                    <option value="2bhk">2 BHK Standard Flat</option>
                    <option value="3bhk">3 BHK Family Apartment</option>
                    <option value="4bhk">4 BHK Luxury Apartment</option>
                    <option value="villa">Independent House / Villa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Best Callback Window
                  </label>
                  <select
                    value={callbackTime}
                    onChange={(e) => setCallbackTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-600 focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="immediate">⚡ As Soon As Possible (15 mins)</option>
                    <option value="morning">🌅 Morning (09:00 AM - 12:00 PM)</option>
                    <option value="afternoon">☀️ Afternoon (12:00 PM - 04:00 PM)</option>
                    <option value="evening">🌙 Evening (04:00 PM - 08:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Requests / Dietary / Language Preference (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need Hindi speaking cook for vegetarian South Indian breakfast + dinner. 3 adults."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-600 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Trust Callout */}
              <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl flex items-center gap-2 text-xs text-cyan-900">
                <ShieldCheck className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>Zero obligation inquiry. Free replacement guarantee on all monthly placements.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0C356A] hover:bg-[#071952] disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                id="submit-lead-inquiry-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting Telecaller Desk...</span>
                  </>
                ) : (
                  <>
                    <Headphones className="w-4 h-4" />
                    <span>Request Free Callback & Custom Quote</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
