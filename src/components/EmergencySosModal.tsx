import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Zap,
  Wrench,
  Sparkles,
  HeartHandshake,
  Key,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Volume2,
  VolumeX,
  Share2,
  ShieldCheck,
  User,
  Radio
} from 'lucide-react';
import { Booking, Helper, ServiceItem, ServiceCategory, UserProfile } from '../types';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSosBooking: (sosBooking: Booking) => void;
  helpers: Helper[];
  services: ServiceItem[];
  currentUser?: UserProfile | null;
  currentCity: string;
}

interface EmergencyType {
  id: string;
  category: ServiceCategory;
  title: string;
  desc: string;
  icon: any;
  defaultPrice: number;
  expectedEta: string;
}

const EMERGENCY_TYPES: EmergencyType[] = [
  {
    id: 'sos-plumber',
    category: 'plumber',
    title: 'Water Pipe Burst / Severe Flooding',
    desc: 'Main inlet rupture, overhead tank overflow, or severe kitchen sink flood',
    icon: Wrench,
    defaultPrice: 299,
    expectedEta: '10-12 Mins'
  },
  {
    id: 'sos-electrician',
    category: 'electrician',
    title: 'MCB Trip / Complete Power Blackout',
    desc: 'Burnt wire, smoking switchboard, short-circuit, or inverter trip',
    icon: Zap,
    defaultPrice: 299,
    expectedEta: '8-11 Mins'
  },
  {
    id: 'sos-maid',
    category: 'maid',
    title: 'Maid Abandoned / Last-Minute Party Backup',
    desc: 'Regular domestic maid ghosted before festival/guest arrival',
    icon: Sparkles,
    defaultPrice: 249,
    expectedEta: '12-15 Mins'
  },
  {
    id: 'sos-eldercare',
    category: 'eldercare',
    title: 'Elder Fall / Urgent Mobility & Care Help',
    desc: 'Senior citizen bed transfer, medicine assistance, or companion standby',
    icon: HeartHandshake,
    defaultPrice: 349,
    expectedEta: '15 Mins'
  },
  {
    id: 'sos-carpenter',
    category: 'carpenter',
    title: 'Door Jam / Lockout / Broken Latch',
    desc: 'Main door locked from inside, stuck balcony door, or safety latch jam',
    icon: Key,
    defaultPrice: 299,
    expectedEta: '12 Mins'
  }
];

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  onTriggerSosBooking,
  helpers,
  services,
  currentUser,
  currentCity
}) => {
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyType>(EMERGENCY_TYPES[0]);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || 'Flat 402, Prestige Ferns, Koramangala');
  const [houseNumber, setHouseNumber] = useState('Flat 402');
  const [notes, setNotes] = useState('URGENT: Water pipe burst in master bathroom, need immediate plumber!');

  // Dispatch active stage
  const [isDispatched, setIsDispatched] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(900); // 15 mins
  const [dispatchedHelper, setDispatchedHelper] = useState<Helper | null>(null);
  const [sosOtp, setSosOtp] = useState('9821');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && !phone) setPhone(currentUser.phone);
      if (currentUser.address && (!address || address.includes('Prestige'))) setAddress(currentUser.address);
    }
  }, [currentUser]);

  // Countdown timer when dispatched
  useEffect(() => {
    if (!isDispatched) return;
    const interval = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isDispatched]);

  if (!isOpen) return null;

  const handleSelectEmergencyType = (type: EmergencyType) => {
    setSelectedEmergency(type);
    if (type.id === 'sos-plumber') {
      setNotes('URGENT: Water pipe burst, water flooding into hallway!');
    } else if (type.id === 'sos-electrician') {
      setNotes('URGENT: Complete flat power outage, MCB sparking!');
    } else if (type.id === 'sos-maid') {
      setNotes('URGENT: Maid did not turn up, dinner guests arriving in 1 hour!');
    } else if (type.id === 'sos-eldercare') {
      setNotes('URGENT: Elderly parent needs physical support and lifting assistance.');
    } else {
      setNotes('URGENT: Door locked from inside, need immediate unlock assistance.');
    }
  };

  const handleConfirmEmergencyDispatch = () => {
    // Pick nearest matching helper for category or fallback
    const matchedHelper =
      helpers.find(h => h.category === selectedEmergency.category && h.isAvailable) ||
      helpers.find(h => h.category === selectedEmergency.category) ||
      helpers[0];

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSosOtp(generatedOtp);
    setDispatchedHelper(matchedHelper);

    // Associated Service
    const matchedService = services.find(s => s.category === selectedEmergency.category) || services[0];

    const newBooking: Booking = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser?.id,
      serviceId: matchedService?.id || 'srv-sos',
      category: selectedEmergency.category,
      serviceTitle: `🚨 SOS Rapid: ${selectedEmergency.title}`,
      bookingType: 'instant',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: 'Immediate (15-Minute SOS Dispatch)',
      durationHours: 1,
      frequency: 'one-time',
      selectedTasks: ['Emergency Rapid Doorstep Resolution', 'Safety Inspection'],
      customer: {
        name: customerName || 'Emergency Resident',
        phone: phone || '+91 98000 24700',
        address: address || 'Current Location',
        houseNumber: houseNumber || 'Flat 402',
        city: currentCity || 'Bangalore',
        pincode: '560034',
        instructions: `🚨 SOS EMERGENCY: ${notes}`
      },
      helper: matchedHelper,
      status: 'assigned',
      otp: generatedOtp,
      paymentStatus: 'pending',
      paymentMethod: 'upi',
      safetySosTriggered: true,
      pricing: {
        baseAmount: selectedEmergency.defaultPrice,
        addOnsAmount: 0,
        platformFee: 0,
        taxAmount: Math.round(selectedEmergency.defaultPrice * 0.18),
        discount: 0,
        total: Math.round(selectedEmergency.defaultPrice * 1.18)
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: `🚨 1-Tap SOS Emergency Dispatch. Priority high-speed bike response.`
    };

    setIsDispatched(true);
    onTriggerSosBooking(newBooking);
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleShareWhatsAppAlert = () => {
    const text = `🚨 *hommlyn247 SOS Emergency Domestic Help Dispatched*\n\n` +
      `*Emergency:* ${selectedEmergency.title}\n` +
      `*Location:* ${houseNumber}, ${address}, ${currentCity}\n` +
      (dispatchedHelper ? `*Dispatched Pro:* ${dispatchedHelper.name} (${dispatchedHelper.categoryTitle}) - Phone: ${dispatchedHelper.phone}\n` : '') +
      `*Doorstep OTP:* ${sosOtp}\n` +
      `*Helpline:* 1800-247-HOMM (24/7 Rapid SOS Hotline)`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border-2 border-red-500/40">

        {/* Red Alert Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-5 relative overflow-hidden shrink-0">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner animate-pulse">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded text-white flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-ping" />
                    Priority Red Alert
                  </span>
                  <span className="text-[10px] text-amber-200 font-bold">
                    15-Minute Domestic SOS
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  1-Tap Household Emergency Dispatch
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              aria-label="Close SOS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800 text-xs">

          {!isDispatched ? (
            <>
              {/* Emergency Category Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-900 block mb-2">
                  1. What Household Emergency Are You Facing?
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {EMERGENCY_TYPES.map((type) => {
                    const IconComponent = type.icon;
                    const isSelected = selectedEmergency.id === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleSelectEmergencyType(type)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-red-50/80 border-red-500 ring-2 ring-red-200 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-slate-900">{type.title}</span>
                            <span className="text-[11px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-md">
                              ETA {type.expectedEta}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            {type.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Doorstep Location & Resident Contact */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                  2. Confirm Your Doorstep & Contact
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Mobile Number (for bike driver calling)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Flat / House No.
                    </label>
                    <input
                      type="text"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      placeholder="Flat 402, Tower B"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Society / Street Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Prestige Shantiniketan, Koramangala"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Emergency Situation Note
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Price & Guarantee Notice */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Emergency Flat Visit Fee: <strong className="text-slate-900">₹{selectedEmergency.defaultPrice}</strong> (Pay after job done)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  Zero Advance Cash
                </span>
              </div>
            </>
          ) : (
            /* DISPATCHED LIVE RADAR SCREEN */
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-2xl p-5 text-white text-center shadow-lg">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-mono text-xs font-black mb-2 animate-bounce">
                  <Clock className="w-3.5 h-3.5" />
                  <span>DISPATCH TIMER: {formatCountdown(countdownSeconds)}</span>
                </div>
                <h4 className="text-xl font-black">
                  🚨 Priority Emergency Pro Dispatched!
                </h4>
                <p className="text-xs text-red-100 mt-1 max-w-sm mx-auto">
                  Nearest verified professional has accepted your emergency request and is en-route on a two-wheeler.
                </p>
              </div>

              {/* Doorstep OTP Highlight Card */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Doorstep Security OTP
                  </span>
                  <div className="text-3xl font-black text-emerald-950 font-mono tracking-widest mt-0.5">
                    {sosOtp}
                  </div>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    Share only after technician arrives at your door.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-1 rounded-lg">
                    100% Police Verified
                  </span>
                </div>
              </div>

              {/* Assigned Technician Profile */}
              {dispatchedHelper && (
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-center gap-4">
                  <img
                    src={dispatchedHelper.photoUrl}
                    alt={dispatchedHelper.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-sm text-slate-900 truncate">
                        {dispatchedHelper.name}
                      </h5>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        En Route (1.2 km away)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {dispatchedHelper.categoryTitle} • {dispatchedHelper.phone}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={`tel:${dispatchedHelper.phone}`}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Technician Directly</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency Hotline Banner */}
              <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    24/7 Rapid SOS Hotline
                  </span>
                  <span className="text-sm font-black text-[#0C356A]">
                    1800-247-HOMM (Toll Free)
                  </span>
                </div>
                <a
                  href="tel:18002474666"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Hotline</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {!isDispatched ? (
            <>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Immediate broadcast to on-bike technicians within 3 km.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEmergencyDispatch}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors active:scale-[0.98]"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>TRIGGER 15-MIN EMERGENCY DISPATCH</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleShareWhatsAppAlert}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Alert on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#0C356A] hover:bg-[#082245] text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Track in Live Radar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
