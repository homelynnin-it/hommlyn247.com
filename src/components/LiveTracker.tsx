import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  Star,
  RotateCcw,
  KeyRound,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  Copy,
  ShieldAlert,
  Layers,
  Radio,
  Navigation,
  X
} from 'lucide-react';
import { Booking, BookingStatus, Helper } from '../types';
import { LiveTrackingMap } from './LiveTrackingMap';

interface LiveTrackerProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, status: BookingStatus, otp?: string) => Promise<void>;
  onSelectBookingForInvoice?: (booking: Booking) => void;
  onExploreServices: () => void;
  onOpenReviewModal?: (booking: Booking) => void;
  onOpenPaymentModal?: (booking: Booking) => void;
  onOpenEmergencySos?: () => void;
  onOpenHelperDossier?: (helper: Helper) => void;
}

const STATUS_STEPS: { status: BookingStatus; label: string; desc: string }[] = [
  { status: 'assigned', label: 'Pro Assigned', desc: 'Partner accepted request' },
  { status: 'en_route', label: 'En Route', desc: 'On bike / approaching' },
  { status: 'arrived', label: 'At Doorstep', desc: 'Reached your location' },
  { status: 'in_progress', label: 'Work In Progress', desc: 'OTP verified & servicing' },
  { status: 'completed', label: 'Completed', desc: 'Job finished & verified' }
];

export const LiveTracker: React.FC<LiveTrackerProps> = ({
  bookings,
  onUpdateStatus,
  onSelectBookingForInvoice,
  onExploreServices,
  onOpenReviewModal,
  onOpenPaymentModal,
  onOpenEmergencySos,
  onOpenHelperDossier
}) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    bookings.find(b => b.status !== 'completed' && b.status !== 'cancelled')?.id || bookings[0]?.id || ''
  );
  const [userRating, setUserRating] = useState<number>(5);
  const [userReview, setUserReview] = useState<string>('');
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [copiedGatePass, setCopiedGatePass] = useState<boolean>(false);
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [sosActivated, setSosActivated] = useState<boolean>(false);

  // ETA countdown simulator in seconds (12 mins = 720 secs)
  const [etaSeconds, setEtaSeconds] = useState<number>(720);

  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prev) => (prev > 30 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeBooking = bookings.find(b => b.id === selectedBookingId) || bookings[0];

  const getStepIndex = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'assigned': return 0;
      case 'en_route': return 1;
      case 'arrived': return 2;
      case 'in_progress': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const handleSimulateNextStep = async () => {
    if (!activeBooking) return;
    setIsUpdating(true);
    try {
      if (activeBooking.status === 'assigned') {
        await onUpdateStatus(activeBooking.id, 'en_route');
      } else if (activeBooking.status === 'en_route') {
        await onUpdateStatus(activeBooking.id, 'arrived');
      } else if (activeBooking.status === 'arrived') {
        // Pass the booking's own OTP
        await onUpdateStatus(activeBooking.id, 'in_progress', activeBooking.otp);
      } else if (activeBooking.status === 'in_progress') {
        await onUpdateStatus(activeBooking.id, 'completed');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyGatePass = () => {
    const code = activeBooking?.gatePassCode || 'GATE-4821';
    navigator.clipboard?.writeText?.(code);
    setCopiedGatePass(true);
    setTimeout(() => setCopiedGatePass(false), 2000);
  };

  const handleTriggerSos = () => {
    setSosActivated(true);
    setShowSosModal(true);
  };

  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0E7490]">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">No Active Bookings</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
          You haven't scheduled any home services yet. Book a verified maid, cook or cleaner in 15 minutes!
        </p>
        <button
          onClick={onExploreServices}
          className="px-6 py-2.5 bg-[#0E7490] hover:bg-[#0C356A] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
        >
          Explore Services Now
        </button>
      </div>
    );
  }

  const currentStep = activeBooking ? getStepIndex(activeBooking.status) : 0;
  const isEnRouteOrAssigned = activeBooking?.status === 'assigned' || activeBooking?.status === 'en_route';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="live-tracker-section">
      {/* SOS Alert Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
                <span>24/7 Rapid SOS Emergency Response</span>
              </div>
              <button
                onClick={() => setShowSosModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              HomeeLynn7 Safety Dispatch desk has been alerted for Booking <strong>{activeBooking?.id}</strong>.
              The verified partner coordinates, live GPS trace, and society gate pass have been shared with local emergency response.
            </p>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between font-bold text-red-900">
                <span>Direct Safety Desk Hotline:</span>
                <span className="font-mono text-sm">+91 1800-247-4663</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>National Emergency:</span>
                <span className="font-mono text-sm">112</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:18002474663"
                className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Safety Desk</span>
              </a>
              <button
                type="button"
                onClick={() => setShowSosModal(false)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracker Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Live Order & Partner Radar Tracker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time status updates, start-job security OTP, society gate pass, and 15-min Snabbit-speed arrival radar.
          </p>
        </div>

        {/* Quick Booking Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {bookings.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBookingId(b.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                b.id === activeBooking?.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{b.id}</span>
              <span className="ml-1.5 text-[10px] opacity-80 uppercase">
                ({b.status})
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeBooking && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Status & Stepper Progress (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Status Hero Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-900 uppercase font-mono">
                      {activeBooking.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#0C356A] text-white">
                      {activeBooking.packageType === 'daily'
                        ? '☀️ Full Day Pass'
                        : (activeBooking.packageType === 'monthly' ? '👑 Monthly CarePlan' : '⚡ Hourly 15-Min')}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {activeBooking.bookingType === 'instant' ? '⚡ Instant Dispatch' : '📅 Scheduled Slot'}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    {activeBooking.serviceTitle}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Slot: {activeBooking.scheduledDate} • {activeBooking.scheduledTimeSlot}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Gate Pass Badge */}
                  <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-2xl text-center shrink-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider block text-slate-500">
                      Gate Pass
                    </span>
                    <span className="text-sm font-mono font-black text-slate-800 block">
                      {activeBooking.gatePassCode || 'GATE-4821'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyGatePass}
                      className="text-[9px] text-[#0E7490] hover:underline font-bold mt-0.5 flex items-center justify-center gap-0.5 cursor-pointer mx-auto"
                    >
                      {copiedGatePass ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>

                  {/* Prominent OTP Security Badge */}
                  <div className="bg-gradient-to-br from-[#0C356A] to-[#0E7490] text-white p-3.5 rounded-2xl shadow-md text-center shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">
                      Start-Job OTP
                    </span>
                    <span className="text-2xl font-mono font-extrabold tracking-widest block leading-tight">
                      {activeBooking.otp}
                    </span>
                    <span className="text-[9px] opacity-80 block">
                      Share with pro at door
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Steps Horizontal */}
              <div className="relative mb-6">
                <div className="grid grid-cols-5 gap-2 text-center">
                  {STATUS_STEPS.map((stepItem, idx) => {
                    const isDone = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div key={stepItem.status} className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : isCurrent
                              ? 'bg-[#0E7490] text-white ring-4 ring-cyan-100 scale-110'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-bold mt-2 ${isCurrent ? 'text-[#0E7490]' : 'text-slate-700'}`}>
                          {stepItem.label}
                        </span>
                        <span className="text-[9px] text-slate-400 hidden sm:block">
                          {stepItem.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Status Message & Simulation Quick Buttons */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#0E7490] flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 fill-[#0E7490]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {activeBooking.status === 'assigned' && 'Partner accepted and is dispatching'}
                      {activeBooking.status === 'en_route' && `Partner is en route on bike (Arriving in ~${Math.floor(etaSeconds / 60)} mins)`}
                      {activeBooking.status === 'arrived' && 'Partner has arrived at your doorstep. Provide OTP to begin.'}
                      {activeBooking.status === 'in_progress' && `Service in progress. Estimated duration: ${activeBooking.durationHours} hrs.`}
                      {activeBooking.status === 'completed' && 'Service completed successfully! Rate your experience.'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Snabbit 15-Min Live GPS Telemetry & OTP Safeguard Active
                    </p>
                  </div>
                </div>

                {/* Simulator Action Button */}
                {activeBooking.status !== 'completed' && activeBooking.status !== 'cancelled' && (
                  <button
                    onClick={handleSimulateNextStep}
                    disabled={isUpdating}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {isUpdating ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Simulate Next: </span>
                        <span className="text-cyan-400">
                          {activeBooking.status === 'assigned' && 'En Route'}
                          {activeBooking.status === 'en_route' && 'Arrived'}
                          {activeBooking.status === 'arrived' && 'Start Job'}
                          {activeBooking.status === 'in_progress' && 'Complete'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Snabbit 15-Minute Live Dispatch Radar Strip */}
              {isEnRouteOrAssigned && (
                <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-900 to-[#0C356A] text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="w-3 h-3 rounded-full bg-amber-400 inline-block animate-ping" />
                      <span className="w-3 h-3 rounded-full bg-amber-400 absolute inset-0" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Radio className="w-4 h-4 animate-pulse" />
                        <span>Snabbit 15-Min Live Doorstep Radar</span>
                      </div>
                      <p className="text-[11px] text-cyan-200">
                        Partner speed: 28 km/h • Distance: 1.4 km • Transit time remaining:
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black font-mono text-amber-300">
                      {Math.floor(etaSeconds / 60)}m {etaSeconds % 60}s
                    </div>
                    <span className="text-[9px] text-cyan-200 block">On-Time Guarantee</span>
                  </div>
                </div>
              )}

              {/* Live Interactive Map with GPS Telemetry */}
              <div className="mt-5">
                <LiveTrackingMap booking={activeBooking} />
              </div>

              {/* Tasks Checklist */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Tasks Ordered in this Visit
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeBooking.selectedTasks.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Review & Rating Box when completed */}
              {activeBooking.status === 'completed' && (
                <div className="mt-6 pt-5 border-t border-slate-100 bg-cyan-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    Rate Your Experience with {activeBooking.helper?.name || 'Partner'}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Your honest feedback helps us maintain strict standards for the community.
                  </p>

                  {ratingSubmitted ? (
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Thank you! Your 5-star rating & feedback have been recorded.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-2">
                          {userRating === 5 ? 'Excellent & Courteous!' : `${userRating} Stars`}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                          placeholder="Add comments (e.g. spotless cleaning, on time, very courteous)..."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                        />
                        <button
                          onClick={() => setRatingSubmitted(true)}
                          className="px-4 py-2 bg-[#0E7490] hover:bg-[#0C356A] text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer"
                        >
                          Submit
                        </button>
                      </div>

                      {onOpenReviewModal && (
                        <div className="pt-2 text-center">
                          <button
                            type="button"
                            onClick={() => onOpenReviewModal(activeBooking)}
                            className="text-xs font-bold text-cyan-800 hover:text-cyan-900 underline cursor-pointer"
                          >
                            Open Detailed Review Form with Compliment Badges →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address & Booking Info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Service Address & Society Security Note
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-[#0E7490] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{activeBooking.customer?.name} ({activeBooking.customer?.phone})</p>
                    <p className="text-slate-600">{activeBooking.customer?.address}, {activeBooking.customer?.city || 'Bangalore'} - {activeBooking.customer?.pincode}</p>
                    {activeBooking.customer?.instructions && (
                      <p className="mt-1 text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                        "{activeBooking.customer.instructions}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Assigned Pro Profile, SOS Emergency & Payment */}
          <div className="space-y-6">

            {/* SOS Emergency Response Card */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-5 text-white shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-wider">Safety & SOS Shield</span>
                </div>
                <span className="text-[10px] bg-white/20 font-bold px-2 py-0.5 rounded-full">
                  24x7 Active
                </span>
              </div>
              <p className="text-xs text-red-100 mb-3 leading-relaxed">
                Feel safe at home. If you notice any discomfort or emergency, one tap dispatches safety supervisors.
              </p>
              <button
                type="button"
                onClick={() => onOpenEmergencySos ? onOpenEmergencySos() : handleTriggerSos()}
                className="w-full py-2.5 px-3 rounded-xl bg-white text-red-700 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 cursor-pointer transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{sosActivated ? 'SOS Alerted (View Helpline)' : 'Trigger Emergency SOS'}</span>
              </button>
            </div>

            {/* Helper Profile Card */}
            {activeBooking.helper ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Assigned Professional
                  </span>
                  {onOpenHelperDossier && activeBooking.helper ? (
                    <button
                      type="button"
                      onClick={() => onOpenHelperDossier(activeBooking.helper!)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 transition-colors cursor-pointer group shadow-2xs"
                      title="View Official Police & Identity Dossier"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Police Dossier</span>
                      <ArrowRight className="w-3 h-3 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Police Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={activeBooking.helper.photoUrl}
                    alt={activeBooking.helper.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-200"
                  />
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {activeBooking.helper.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {activeBooking.helper.categoryTitle}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-800">
                        {activeBooking.helper.rating}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {activeBooking.helper.completedJobs} jobs completed
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  "{activeBooking.helper.bio}"
                </p>

                {/* Verification Checkmarks */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Aadhaar Checked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Skill Certified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Medical Cleared</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Uniform Equipped</span>
                  </div>
                </div>

                {/* Call Pro Button */}
                <a
                  href={`tel:${activeBooking.helper.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Call {activeBooking.helper.name.split(' ')[0]} ({activeBooking.helper.phone})</span>
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center">
                <Clock className="w-8 h-8 text-[#0E7490] mx-auto mb-2 animate-spin" />
                <p className="text-xs font-bold text-slate-900">Matching with nearest pro...</p>
                <p className="text-[11px] text-slate-500">Usually assigned within 45 seconds</p>
              </div>
            )}

            {/* Payment & Invoice Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Payment Summary
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    activeBooking.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeBooking.paymentStatus === 'paid' ? 'Paid Online' : 'Cash on Service'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mb-4 pb-3 border-b border-slate-100">
                <div className="flex justify-between">
                  <span>Base & Tasks</span>
                  <span>₹{activeBooking.pricing.baseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{activeBooking.pricing.platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Taxes (18%)</span>
                  <span>₹{activeBooking.pricing.taxAmount}</span>
                </div>
                {activeBooking.pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Applied</span>
                    <span>-₹{activeBooking.pricing.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="text-[#0C356A]">₹{activeBooking.pricing.total}</span>
                </div>
              </div>

              {activeBooking.paymentStatus !== 'paid' && onOpenPaymentModal && (
                <button
                  type="button"
                  onClick={() => onOpenPaymentModal(activeBooking)}
                  className="w-full mb-2.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0C356A] to-[#0E7490] hover:from-[#082245] hover:to-[#085a70] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-950/20 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-cyan-300" />
                  <span>Pay ₹{activeBooking.pricing.total} via HomeeLynn Gateway</span>
                </button>
              )}

              {onSelectBookingForInvoice && (
                <button
                  onClick={() => onSelectBookingForInvoice(activeBooking)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Tax Invoice (GST)</span>
                </button>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
