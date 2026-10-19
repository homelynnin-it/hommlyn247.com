import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Calendar,
  Clock,
  Check,
  MapPin,
  User,
  Phone,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  QrCode,
  Tag,
  ArrowRight,
  Layers,
  ShieldAlert,
  Copy,
  CheckCircle2,
  Sun,
  Moon,
  Coffee,
  HeartHandshake
} from 'lucide-react';
import { ServiceItem, Booking, BookingType, Helper, UserProfile, PackageDurationType, ShiftMode, ReadyMadeTemplate } from '../types';
import { READY_MADE_TEMPLATES, SHIFT_SLOTS } from '../data/templates';

interface BookingModalProps {
  service: ServiceItem;
  initialMode: 'instant' | 'scheduled';
  initialPackageType?: PackageDurationType;
  initialShiftMode?: ShiftMode;
  initialVisitsPerDay?: number;
  initialTemplateName?: string;
  initialSelectedTasks?: string[];
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  currentCity: string;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
}

const TIME_SLOTS = [
  '07:00 AM - 08:30 AM (Early Morning)',
  '08:30 AM - 10:00 AM (Breakfast)',
  '10:30 AM - 12:00 PM (Morning)',
  '01:00 PM - 02:30 PM (Lunch)',
  '03:30 PM - 05:00 PM (Afternoon)',
  '05:30 PM - 07:00 PM (Evening)',
  '07:30 PM - 09:00 PM (Dinner)'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  service,
  initialMode,
  initialPackageType = 'hourly',
  initialShiftMode,
  initialVisitsPerDay,
  initialTemplateName,
  initialSelectedTasks,
  onClose,
  onBookingSuccess,
  currentCity,
  currentUser,
  onOpenAuth
}) => {
  // Step state: 1: Package & Tasks, 2: Address & Gate Pass, 3: Payment Gateway Checkout
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Package Duration Type: 'hourly' | 'daily' | 'monthly'
  const [packageType, setPackageType] = useState<PackageDurationType>(initialPackageType);

  // Multi-slot & Shift Mode: 'single' (1 visit/day) | 'dual' (Morning + Evening) | 'triple'
  const [shiftMode, setShiftMode] = useState<ShiftMode>(
    initialShiftMode || (initialPackageType === 'monthly' ? 'dual' : 'single')
  );
  const [morningSlot, setMorningSlot] = useState<string>(SHIFT_SLOTS.morning[1]);
  const [afternoonSlot, setAfternoonSlot] = useState<string>(SHIFT_SLOTS.afternoon[0]);
  const [eveningSlot, setEveningSlot] = useState<string>(SHIFT_SLOTS.evening[1]);
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplateName || '');

  // Booking details state
  const [bookingType, setBookingType] = useState<BookingType>(
    initialPackageType === 'hourly' ? initialMode : 'scheduled'
  );
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState<string>(TIME_SLOTS[1]);
  const [durationHours, setDurationHours] = useState<number>(1.5);
  const [frequency, setFrequency] = useState<'one-time' | 'daily' | 'monthly'>(
    initialPackageType === 'monthly' ? 'monthly' : (initialPackageType === 'daily' ? 'daily' : 'one-time')
  );

  // Auto-generated Society Gate Pass Code
  const [gatePassCode] = useState<string>(`GATE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copiedGatePass, setCopiedGatePass] = useState(false);

  // Task customization
  const [selectedTasks, setSelectedTasks] = useState<string[]>(
    initialSelectedTasks && initialSelectedTasks.length > 0
      ? initialSelectedTasks
      : service.tasks.filter(t => t.defaultChecked).map(t => t.name)
  );

  // Customer contact state - initialized from verified profile if available
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(
    currentUser?.phone ? currentUser.phone.replace(/[^0-9]/g, '').slice(-10) : ''
  );
  const [houseNumber, setHouseNumber] = useState(
    currentUser?.address ? currentUser.address.split(',')[0].trim() : ''
  );
  const [societyAddress, setSocietyAddress] = useState(
    currentUser?.address ? currentUser.address.split(',').slice(1).join(',').trim() : ''
  );
  const [pincode, setPincode] = useState(currentUser?.pincode || '560034');
  const [instructions, setInstructions] = useState('');

  // Sync state if user authenticates while modal is open
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && !customerPhone) {
        setCustomerPhone(currentUser.phone.replace(/[^0-9]/g, '').slice(-10));
      }
      if (currentUser.address && (!houseNumber || !societyAddress)) {
        const parts = currentUser.address.split(',');
        if (!houseNumber) setHouseNumber(parts[0]?.trim() || '');
        if (!societyAddress) setSocietyAddress(parts.slice(1).join(',').trim() || '');
      }
      if (currentUser.pincode && !pincode) setPincode(currentUser.pincode);
    }
  }, [currentUser]);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cash'>('upi');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [promoCode, setPromoCode] = useState('SWIFT50');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingUnavailable, setBookingUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/health', { method: 'GET' })
      .then(r => r.json())
      .then((data: any) => {
        if (!cancelled && data?.bookingsEnabled === false) {
          setBookingUnavailable(true);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Find tier prices
  const hourlyTier = service.pricingTiers?.find(t => t.type === 'hourly');
  const dailyTier = service.pricingTiers?.find(t => t.type === 'daily');
  const monthlyTier = service.pricingTiers?.find(t => t.type === 'monthly');

  const hourlyRate = hourlyTier?.price || service.basePrice;
  const dailyRate = dailyTier?.price || Math.round(service.basePrice * 4.5);
  const monthlyRate = monthlyTier?.price || Math.round(service.basePrice * 20);

  // Calculate pricing based on selected package & multi-shift visits
  const tasksDelta = service.tasks
    .filter(t => selectedTasks.includes(t.name))
    .reduce((sum, t) => sum + t.priceDelta, 0);

  let subtotal = 0;
  if (packageType === 'hourly') {
    subtotal = Math.round((hourlyRate + tasksDelta) * durationHours);
  } else if (packageType === 'daily') {
    if (shiftMode === 'dual') {
      subtotal = Math.round((dailyRate * 1.25) + tasksDelta);
    } else {
      subtotal = Math.round(dailyRate + tasksDelta);
    }
  } else {
    // monthly
    if (shiftMode === 'dual') {
      // 2 visits per day (Morning + Evening) with attractive 25% bundle savings on 2nd shift
      subtotal = Math.round((monthlyRate * 1.75) + (tasksDelta * 15));
    } else if (shiftMode === 'triple') {
      // 3 visits per day with 35% bundle savings on 3rd shift
      subtotal = Math.round((monthlyRate * 2.45) + (tasksDelta * 20));
    } else {
      // single visit per day
      subtotal = Math.round(monthlyRate + (tasksDelta * 10));
    }
  }

  const platformFee = packageType === 'monthly' ? 99 : 29;
  const taxAmount = Math.round((subtotal + platformFee) * 0.18);
  const discountAmount = isPromoApplied ? (packageType === 'monthly' ? 250 : 50) : 0;
  const packageBonusDiscount = packageType === 'daily' ? 100 : (packageType === 'monthly' ? 500 : 0);
  const totalAmount = Math.max(99, subtotal + platformFee + taxAmount - discountAmount - packageBonusDiscount);

  const toggleTask = (taskName: string) => {
    if (selectedTasks.includes(taskName)) {
      if (selectedTasks.length > 1) {
        setSelectedTasks(selectedTasks.filter(t => t !== taskName));
      }
    } else {
      setSelectedTasks([...selectedTasks, taskName]);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SWIFT50' || promoCode.trim().toUpperCase() === 'HOMELYNN') {
      setIsPromoApplied(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid code. Use SWIFT50 or HOMELYNN');
    }
  };

  const handleCopyGatePass = () => {
    navigator.clipboard?.writeText?.(gatePassCode);
    setCopiedGatePass(true);
    setTimeout(() => setCopiedGatePass(false), 2000);
  };

  const handleApplyTemplate = (tmpl: ReadyMadeTemplate) => {
    setPackageType(tmpl.recommendedPackage);
    setShiftMode(tmpl.shiftMode);
    if (tmpl.defaultMorningSlot) setMorningSlot(tmpl.defaultMorningSlot);
    if (tmpl.defaultEveningSlot) setEveningSlot(tmpl.defaultEveningSlot);
    setActiveTemplate(tmpl.title);
    if (tmpl.recommendedPackage === 'monthly') {
      setBookingType('scheduled');
      setFrequency('monthly');
    } else if (tmpl.recommendedPackage === 'daily') {
      setBookingType('scheduled');
      setFrequency('daily');
    }
    // Check template tasks
    const matched = service.tasks.filter(t =>
      tmpl.defaultTasks.some(dt => dt.toLowerCase().includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(dt.toLowerCase()))
    ).map(t => t.name);
    if (matched.length > 0) {
      setSelectedTasks(matched);
    }
  };

  const handleSubmitBooking = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !houseNumber.trim()) {
      setErrorMsg('Please fill in required name, phone number, and address fields.');
      setStep(2);
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const visitsPerDay = shiftMode === 'single' ? 1 : (shiftMode === 'dual' ? 2 : 3);
      const computedTimeSlots = shiftMode === 'single'
        ? [scheduledTimeSlot]
        : (shiftMode === 'dual' ? [morningSlot, eveningSlot] : [morningSlot, afternoonSlot, eveningSlot]);

      const formattedSlotSummary = bookingType === 'instant'
        ? 'Instant Dispatch (10-15 mins)'
        : (shiftMode === 'dual'
            ? `Dual Shift: Morning (${morningSlot.split(' ')[0]}) + Evening (${eveningSlot.split(' ')[0]})`
            : (shiftMode === 'triple'
                ? `3 Shifts: Morning, Afternoon & Evening`
                : scheduledTimeSlot));

      const titleSuffix = packageType === 'hourly'
        ? 'Hourly'
        : (packageType === 'daily'
            ? (shiftMode === 'dual' ? 'Dual-Shift Day Pass' : 'Day Pass')
            : (shiftMode === 'dual' ? 'Dual-Shift Monthly (Morning + Evening)' : 'Monthly CarePlan'));

      const payload: Partial<Booking> = {
        serviceId: service.id,
        category: service.category,
        serviceTitle: `${service.title} (${titleSuffix})`,
        bookingType,
        packageType,
        gatePassCode,
        shiftMode,
        visitsPerDay,
        timeSlots: computedTimeSlots,
        morningSlot: shiftMode !== 'single' ? morningSlot : undefined,
        eveningSlot: shiftMode !== 'single' ? eveningSlot : undefined,
        afternoonSlot: shiftMode === 'triple' ? afternoonSlot : undefined,
        templateName: activeTemplate || undefined,
        scheduledDate: bookingType === 'instant' ? new Date().toISOString().split('T')[0] : scheduledDate,
        scheduledTimeSlot: formattedSlotSummary,
        durationHours: packageType === 'daily' ? (shiftMode === 'dual' ? 6 : 8) : (packageType === 'monthly' ? (visitsPerDay * 30) : durationHours),
        frequency: packageType === 'monthly' ? 'monthly' : (packageType === 'daily' ? 'daily' : frequency),
        selectedTasks,
        customer: {
          name: customerName,
          phone: `+91 ${customerPhone}`,
          address: `${houseNumber}, ${societyAddress}`,
          houseNumber,
          city: currentCity,
          pincode,
          instructions: `${instructions ? instructions + ' • ' : ''}${shiftMode === 'dual' ? 'Shifts: Morning (' + morningSlot + ') & Evening (' + eveningSlot + ') • ' : ''}Gate Pass: ${gatePassCode}`
        },
        status: bookingType === 'instant' ? 'en_route' : 'assigned',
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        paymentMethod,
        pricing: {
          baseAmount: subtotal,
          addOnsAmount: tasksDelta,
          platformFee,
          taxAmount,
          discount: discountAmount + packageBonusDiscount,
          total: totalAmount
        },
        notes: instructions
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, promoCode })
      });

      if (response.status === 401) {
        setIsProcessing(false);
        setErrorMsg('Please sign in or create an account to finalize your booking.');
        onOpenAuth?.();
        return;
      }

      if (response.status === 503) {
        const errJson = await response.json().catch(() => ({}));
        setIsProcessing(false);
        setErrorMsg(errJson.error || 'Bookings are launching soon. Please check back later.');
        return;
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to create booking in database');
      }

      const createdBooking: Booking = await response.json();

      // Quick gateway confirmation delay
      setTimeout(() => {
        setIsProcessing(false);
        onBookingSuccess(createdBooking);
      }, 600);

    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Booking submission failed. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-150"
        id="booking-modal-container"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            id="close-booking-modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500 text-white uppercase tracking-wider">
              {service.category.toUpperCase()}
            </span>
            <span className="text-xs text-slate-300">
              📍 {currentCity}
            </span>
            <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded">
              ⚡ 15-Min Snabbit Arrival
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            {service.title}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {service.subtitle}
          </p>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs font-semibold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                step === 1 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>1. Package & Tasks</span>
            </button>
            <span className="text-slate-600">→</span>
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                step === 2 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>2. Address & Gate Pass</span>
            </button>
            <span className="text-slate-600">→</span>
            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                step === 3 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>3. Payment Gateway</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
          {bookingUnavailable && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Bookings are launching soon. Please check back later.</span>
            </div>
          )}

          {/* STEP 1: Package Duration, Timing Mode & Micro-tasks */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Ready-Made Household Combos & Templates Bar */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-cyan-50/80 to-slate-50 border border-amber-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Ready-Made Household Combos (1-Click Setup)
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded-full">
                    Pre-configured Multi-Shift
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {READY_MADE_TEMPLATES.filter(t => t.category === service.category || t.serviceId === service.id || t.popular).slice(0, 4).map(tmpl => {
                    const isSelected = activeTemplate === tmpl.title;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleApplyTemplate(tmpl)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-cyan-600 ring-2 ring-cyan-300 shadow-xs'
                            : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-slate-900 line-clamp-1">
                            {tmpl.title}
                          </span>
                          <span className="text-[9px] font-extrabold bg-cyan-100 text-cyan-800 px-1 rounded shrink-0">
                            {tmpl.shiftMode === 'dual' ? 'Dual-Shift' : 'Single Shift'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{tmpl.tagline}</p>
                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100 text-[10px]">
                          <span className="font-bold text-[#0C356A]">
                            ~₹{tmpl.approxMonthlyPrice} {tmpl.recommendedPackage === 'monthly' ? '/mo' : '/day'}
                          </span>
                          <span className="text-emerald-700 font-extrabold">
                            Save {tmpl.savingsPercentage}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Package Type Selector (Hourly / Daily / Monthly) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Package Type
                  </label>
                  <span className="text-[11px] text-cyan-800 font-bold bg-cyan-100 px-2 py-0.5 rounded">
                    Staff Replacement Assured
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Hourly Package */}
                  <button
                    type="button"
                    onClick={() => {
                      setPackageType('hourly');
                      setBookingType('instant');
                      setFrequency('one-time');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      packageType === 'hourly'
                        ? 'border-cyan-600 bg-cyan-50/70 shadow-xs ring-2 ring-cyan-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-cyan-600 text-cyan-600" />
                        Hourly
                      </span>
                      <span className="text-[9px] bg-amber-400 text-cyan-950 font-black px-1.5 py-0.5 rounded">
                        15 Min
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-[#0C356A]">
                      ₹{hourlyRate} <span className="text-[10px] text-slate-500 font-normal">/hr</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Flexible 1-4 hrs on-demand</p>
                  </button>

                  {/* Daily Package */}
                  <button
                    type="button"
                    onClick={() => {
                      setPackageType('daily');
                      setBookingType('scheduled');
                      setFrequency('daily');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      packageType === 'daily'
                        ? 'border-[#0C356A] bg-cyan-50/70 shadow-xs ring-2 ring-cyan-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#0C356A]" />
                        Per Day Pass
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        Save 35%
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-[#0C356A]">
                      ₹{dailyRate} <span className="text-[10px] text-slate-500 font-normal">/day</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">8-10 Hours dedicated shift</p>
                  </button>

                  {/* Monthly Package */}
                  <button
                    type="button"
                    onClick={() => {
                      setPackageType('monthly');
                      setBookingType('scheduled');
                      setFrequency('monthly');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      packageType === 'monthly'
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs ring-2 ring-amber-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        Monthly Plan
                      </span>
                      <span className="text-[9px] bg-amber-200 text-amber-900 font-black px-1.5 py-0.5 rounded">
                        CarePlan
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-[#0C356A]">
                      ₹{monthlyRate} <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">30 Days + Zero Absentee Guarantee</p>
                  </button>
                </div>
              </div>

              {/* Timing Mode Toggle (for Hourly) */}
              {packageType === 'hourly' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    When do you need the helper?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingType('instant')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        bookingType === 'instant'
                          ? 'border-cyan-600 bg-cyan-50/70 shadow-xs ring-2 ring-cyan-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 fill-cyan-600 text-cyan-600" />
                          <span className="font-bold text-slate-900 text-sm">Instant 15-Min Dispatch</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Doorstep in 12-15 mins</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Assigned instantly to nearest verified pro</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingType('scheduled')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        bookingType === 'scheduled'
                          ? 'border-[#0C356A] bg-slate-50 shadow-xs ring-2 ring-cyan-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="w-4 h-4 text-[#0C356A]" />
                        <span className="font-bold text-slate-900 text-sm">Schedule for Later</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Pick Date & Time Slot</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Guaranteed slot reservation</p>
                    </button>
                  </div>
                </div>
              )}

              {/* If Scheduled or Daily/Monthly, show Shift Frequency & Time Slot Configuration */}
              {(bookingType === 'scheduled' || packageType !== 'hourly') && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {packageType === 'monthly' ? 'Subscription Start Date' : 'Service Date'}
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {packageType === 'monthly' ? '30-day recurring domestic cycle' : 'Single day dedicated pass'}
                      </span>
                    </div>
                    <input
                      type="date"
                      value={scheduledDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden font-medium text-slate-800"
                    />
                  </div>

                  {/* Visit Frequency / Shift Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Daily Shifts & Visit Frequency
                      </label>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {shiftMode === 'dual' ? '🌅 Morning + 🌙 Evening Active' : (shiftMode === 'triple' ? '3 Shifts Active' : 'Single Daily Visit')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Option 1: Single Shift */}
                      <button
                        type="button"
                        onClick={() => setShiftMode('single')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          shiftMode === 'single'
                            ? 'bg-white border-cyan-600 ring-2 ring-cyan-200 shadow-xs'
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                            1 Visit / Day
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">Standard single shift</p>
                      </button>

                      {/* Option 2: Dual Shift (Morning + Evening) */}
                      <button
                        type="button"
                        onClick={() => setShiftMode('dual')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                          shiftMode === 'dual'
                            ? 'bg-cyan-50/70 border-cyan-600 ring-2 ring-cyan-300 shadow-xs'
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <span className="text-amber-500">🌅</span> + <span className="text-indigo-600">🌙</span>
                            2 Visits / Day
                          </span>
                        </div>
                        <p className="text-[10px] text-cyan-800 font-bold">Morning + Evening (Save 25%)</p>
                      </button>

                      {/* Option 3: Triple Shift */}
                      <button
                        type="button"
                        onClick={() => setShiftMode('triple')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          shiftMode === 'triple'
                            ? 'bg-white border-cyan-600 ring-2 ring-cyan-200 shadow-xs'
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <Coffee className="w-3.5 h-3.5 text-purple-600" />
                            3 Visits / Day
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">Morning + Midday + Dinner</p>
                      </button>
                    </div>
                  </div>

                  {/* Slot Configuration based on Shift Mode */}
                  {shiftMode === 'single' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Daily Time Slot
                      </label>
                      <select
                        value={scheduledTimeSlot}
                        onChange={(e) => setScheduledTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden font-medium"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : shiftMode === 'dual' ? (
                    <div className="space-y-2.5 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Morning Slot Picker */}
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Sun className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-amber-950">
                              ☀️ Shift 1: Morning Slot
                            </span>
                            <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1 rounded ml-auto">
                              Breakfast & Chores
                            </span>
                          </div>
                          <select
                            value={morningSlot}
                            onChange={(e) => setMorningSlot(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:border-amber-500 focus:outline-hidden font-medium"
                          >
                            {SHIFT_SLOTS.morning.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>

                        {/* Evening Slot Picker */}
                        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Moon className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-950">
                              🌙 Shift 2: Evening Slot
                            </span>
                            <span className="text-[9px] bg-indigo-200 text-indigo-900 font-bold px-1 rounded ml-auto">
                              Dinner & Vessels
                            </span>
                          </div>
                          <select
                            value={eveningSlot}
                            onChange={(e) => setEveningSlot(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-hidden font-medium"
                          >
                            {SHIFT_SLOTS.evening.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-[11px] text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Dual-Shift Household Guarantee:</span> Helper visits twice daily at both selected time slots.
                          25% package savings included in monthly billing with zero-cancellation backup replacement.
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Triple Shift: Morning, Afternoon, Evening */
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                          <span className="text-[11px] font-bold text-amber-950 block mb-1">☀️ Morning</span>
                          <select
                            value={morningSlot}
                            onChange={(e) => setMorningSlot(e.target.value)}
                            className="w-full px-2 py-1.5 text-[11px] bg-white border border-amber-300 rounded-lg focus:outline-hidden"
                          >
                            {SHIFT_SLOTS.morning.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="p-2.5 rounded-xl bg-cyan-50/80 border border-cyan-200">
                          <span className="text-[11px] font-bold text-cyan-950 block mb-1">🍲 Afternoon</span>
                          <select
                            value={afternoonSlot}
                            onChange={(e) => setAfternoonSlot(e.target.value)}
                            className="w-full px-2 py-1.5 text-[11px] bg-white border border-cyan-300 rounded-lg focus:outline-hidden"
                          >
                            {SHIFT_SLOTS.afternoon.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200">
                          <span className="text-[11px] font-bold text-indigo-950 block mb-1">🌙 Evening</span>
                          <select
                            value={eveningSlot}
                            onChange={(e) => setEveningSlot(e.target.value)}
                            className="w-full px-2 py-1.5 text-[11px] bg-white border border-indigo-300 rounded-lg focus:outline-hidden"
                          >
                            {SHIFT_SLOTS.evening.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Task Checklist Customization */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Customize Tasks & Micro-Chores
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {selectedTasks.length} tasks included
                  </span>
                </div>

                <div className="space-y-2">
                  {service.tasks.map((task) => {
                    const isChecked = selectedTasks.includes(task.name);
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.name)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-cyan-50/50 border-cyan-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isChecked
                                ? 'bg-[#0E7490] border-[#0E7490] text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{task.name}</p>
                            {task.priceDelta > 0 && (
                              <p className="text-[11px] text-slate-500">+₹{task.priceDelta} add-on</p>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-bold text-slate-800">
                          {task.priceDelta === 0 ? 'Included' : `+₹${task.priceDelta}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duration Slider (Only for hourly) */}
              {packageType === 'hourly' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Duration Required
                    </label>
                    <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
                      {durationHours} Hours
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 1.5, 2, 3, 4].map((hours) => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => setDurationHours(hours)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                          durationHours === hours
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {hours} hr{hours > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Address & Society Gate Pass */}
          {step === 2 && (
            <div className="space-y-4">
              {!currentUser && (
                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-[#0C356A]">Already have an account?</span>
                    <span className="text-slate-600 ml-1">Sign in to auto-fill saved address and track live.</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-2.5 py-1 bg-[#0C356A] text-white text-xs font-bold rounded-lg hover:bg-[#08244a] cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Society Gate Pass Auto-Generation Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-900 to-[#0C356A] text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-0.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Society Gate Entry Pass</span>
                  </div>
                  <p className="text-[11px] text-cyan-200">
                    Pre-authorized gate pass for MyGate, NoBrokerHood or Adda security guards.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-white/20 rounded-xl text-center">
                    <span className="text-sm font-mono font-black tracking-wider text-white">
                      {gatePassCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyGatePass}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs cursor-pointer transition-colors"
                    title="Copy Gate Pass"
                  >
                    {copiedGatePass ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone (+91) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10 digit mobile number"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Flat / House Number / Tower / Floor *
                </label>
                <input
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="e.g. Flat 402, Tower B, 4th Floor"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Apartment / Society / Street Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={societyAddress}
                    onChange={(e) => setSocietyAddress(e.target.value)}
                    placeholder="e.g. Godrej Woods, Sector 43, Near Metro Station"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentCity}
                    className="w-full px-3 py-2 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Instructions / Landmark (Optional)
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Please bring clean floor duster. Ring bell twice. Society gate security pass code: 4920"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden"
                />
              </div>

              {/* Safety & SOS Shield Note */}
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center justify-between gap-2 text-xs text-[#0C356A]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span>Doorstep Start-OTP security & police background verified staff.</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  24/7 SOS Ready
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Gateway Checkout */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Payment Methods selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Payment Gateway Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'upi', label: 'UPI (GPay/PhonePe)', icon: <Zap className="w-4 h-4 text-cyan-600" /> },
                    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard className="w-4 h-4 text-[#0C356A]" /> },
                    { id: 'netbanking', label: 'NetBanking', icon: <Clock className="w-4 h-4 text-emerald-600" /> },
                    { id: 'cash', label: 'Cash on Service', icon: <ShieldCheck className="w-4 h-4 text-cyan-700" /> },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? 'border-[#0C356A] bg-cyan-50/60 ring-2 ring-cyan-200'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="mb-2">{m.icon}</span>
                      <span className="text-xs font-bold text-slate-800">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Payment Input based on method */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#0C356A]" />
                      Instant UPI Auto-Verification
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">
                      Zero Surcharge
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@oksbi"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Promo Code Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter Promo Code"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono tracking-wider focus:outline-hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-[#0C356A] hover:bg-[#071952] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isPromoApplied ? 'Applied ✓' : 'Apply'}
                </button>
              </div>

              {/* Transparent Price Breakdown */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>
                    {packageType === 'hourly'
                      ? `Hourly Rate (${durationHours} hrs)`
                      : (packageType === 'daily'
                          ? (shiftMode === 'dual' ? 'Dual-Shift Day Pass (Morning + Evening)' : 'Full Day Shift (8-10 hrs)')
                          : (shiftMode === 'dual' ? 'Dual-Shift Monthly Plan (Morning + Evening)' : 'Monthly CarePlan (30 Days)'))}
                  </span>
                  <span>₹{subtotal}</span>
                </div>
                {shiftMode === 'dual' && (
                  <div className="flex justify-between text-cyan-800 font-bold bg-cyan-50/80 px-2 py-1 rounded-lg">
                    <span>Daily Schedule: 🌅 {morningSlot.split(' ')[0]} + 🌙 {eveningSlot.split(' ')[0]}</span>
                    <span>2 Visits / Day</span>
                  </div>
                )}
                {shiftMode === 'triple' && (
                  <div className="flex justify-between text-cyan-800 font-bold bg-cyan-50/80 px-2 py-1 rounded-lg">
                    <span>Daily Schedule: 3 Visits (Morning, Midday, Evening)</span>
                    <span>3 Visits / Day</span>
                  </div>
                )}
                {tasksDelta > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Task Customizations ({selectedTasks.length})</span>
                    <span>+₹{tasksDelta}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Safety & Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST & Service Taxes (18%)</span>
                  <span>₹{taxAmount}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promotional Voucher Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                {packageBonusDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{packageType === 'daily' ? 'Day Pass Surcharge Waiver' : 'Monthly CarePlan Privilege Discount'}</span>
                    <span>-₹{packageBonusDiscount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm text-slate-900">
                  <span>Total Payable</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[#0C356A]">₹{totalAmount}</span>
                    <span className="text-[10px] text-slate-400 font-normal">incl. all taxes</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase block font-medium">Estimated Total</span>
              <span className="text-base font-black text-[#0C356A]">₹{totalAmount}</span>
            </div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="px-6 py-2.5 bg-[#0C356A] hover:bg-[#071952] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
              id="booking-next-step"
            >
              <span>Next: {step === 1 ? 'Address & Gate Pass' : 'Payment Checkout'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSubmitBooking}
              className="px-6 py-2.5 bg-[#0E7490] hover:bg-[#0C356A] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
              id="confirm-pay-booking-btn"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Gateway...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'cash' ? 'Confirm Booking (Pay Later)' : `Pay ₹${totalAmount} & Confirm`}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
