import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  BarChart3,
  Zap,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
  IndianRupee,
  ShieldCheck,
  Star,
  KeyRound,
  RefreshCw,
  PlusCircle,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Booking, Helper, ServiceItem, PaymentTransaction, BookingStatus } from '../types';

interface MultiWindowSimulatorProps {
  bookings: Booking[];
  services: ServiceItem[];
  helpers: Helper[];
  transactions: PaymentTransaction[];
  onUpdateStatus: (bookingId: string, status: BookingStatus, otp?: string) => Promise<void>;
  onQuickSimulateBooking: () => void;
  onOpenInvoice: (booking: Booking) => void;
  onNavigateWindow: (win: 'client' | 'provider' | 'admin') => void;
}

export const MultiWindowSimulator: React.FC<MultiWindowSimulatorProps> = ({
  bookings,
  services,
  helpers,
  transactions,
  onUpdateStatus,
  onQuickSimulateBooking,
  onOpenInvoice,
  onNavigateWindow
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState<string>(helpers[0]?.id || 'hlp-101');
  const [activeSegment, setActiveSegment] = useState<'revenue' | 'demand' | 'fleet' | 'regions'>('revenue');
  const [providerOtpInput, setProviderOtpInput] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const activeHelper = helpers.find(h => h.id === selectedProviderId) || helpers[0];

  // Derive metrics
  const totalRevenue = transactions
    .filter(t => t.status === 'success')
    .reduce((acc, t) => acc + t.amount, 0);

  const activeJobs = bookings.filter(b =>
    ['assigned', 'en_route', 'arrived', 'in_progress'].includes(b.status)
  );

  const completedJobs = bookings.filter(b => b.status === 'completed');

  // Next active or pending booking for demonstration
  const highlightedBooking = bookings.find(b => b.status !== 'completed' && b.status !== 'cancelled') || bookings[0];

  const handleStepAction = async (booking: Booking, nextStatus: BookingStatus) => {
    setIsProcessing(true);
    setFeedbackMessage(null);
    try {
      if (nextStatus === 'in_progress') {
        const enteredOtp = providerOtpInput[booking.id] || booking.otp;
        await onUpdateStatus(booking.id, nextStatus, enteredOtp);
        setFeedbackMessage(`Security OTP verified! Job ${booking.id} started.`);
      } else {
        await onUpdateStatus(booking.id, nextStatus);
        setFeedbackMessage(`Status updated to ${nextStatus.replace('_', ' ')}! Admin reports recalculated.`);
      }
    } catch (err: any) {
      setFeedbackMessage(`Action error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-6 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-6" id="multi-window-simulator">

      {/* Simulator Control Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0C356A] to-[#0E7490] rounded-2xl p-4 sm:p-6 text-white shadow-lg border border-cyan-500/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-slate-950" /> Live Synchronized Simulator
              </span>
              <span className="text-xs text-cyan-200 hidden sm:inline">• Internal State Reactive</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              3 Windows in Action: Client ➔ Service Provider ➔ Admin Reports
            </h2>
            <p className="text-xs text-cyan-100 max-w-2xl mt-0.5">
              Interact with any window below. When the client books, the provider gets alerted with customer address and security OTP. When the provider completes the job, the Admin segment reports immediately calculate revenue, helper payout, and GST.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <button
              onClick={onQuickSimulateBooking}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              id="sim-create-booking-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulate 1-Click Maid Booking</span>
            </button>

            {highlightedBooking && highlightedBooking.status !== 'completed' && (
              <button
                onClick={() => {
                  const next: Record<BookingStatus, BookingStatus> = {
                    pending: 'assigned',
                    assigned: 'en_route',
                    en_route: 'arrived',
                    arrived: 'in_progress',
                    in_progress: 'completed',
                    completed: 'completed',
                    cancelled: 'pending'
                  };
                  handleStepAction(highlightedBooking, next[highlightedBooking.status]);
                }}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                id="sim-advance-step-btn"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Next Lifecycle Step: {highlightedBooking.status}</span>
              </button>
            )}
          </div>
        </div>

        {feedbackMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-cyan-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* 3 Windows Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ========================================================= */}
        {/* WINDOW 1: CLIENT APP                                     */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border-2 border-cyan-600/60 shadow-sm flex flex-col overflow-hidden">
          {/* Window Title Bar */}
          <div className="bg-[#0C356A] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <Users className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                  Window 1: Client App
                </h3>
                <span className="text-[10px] text-cyan-200">Customer Interface (Bangalore)</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateWindow('client')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
            >
              Open Full ↗
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col space-y-4 bg-slate-50/50">
            {/* Customer Identity Card */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Active Customer Profile</span>
                  <h4 className="font-extrabold text-slate-900 text-sm">Rajesh Malhotra</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    Flat 402, Prestige Ferns, Koramangala
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded-md">
                  HomeeLynn Care Member
                </span>
              </div>
            </div>

            {/* Quick 1-Click Booking Action */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3.5 rounded-xl border border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-cyan-950 uppercase tracking-wide">
                  15-Min Domestic Dispatch
                </span>
                <span className="text-[10px] bg-cyan-600 text-white font-bold px-2 py-0.5 rounded-full">
                  15-Min Guaranteed
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Need household help right now? Click to request domestic staff:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onQuickSimulateBooking}
                  className="p-2 rounded-lg bg-white hover:bg-cyan-100/70 border border-cyan-300 text-slate-900 text-xs font-bold text-left flex items-center justify-between cursor-pointer"
                >
                  <span>🧹 Book Maid (₹449)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-700" />
                </button>
                <button
                  onClick={onQuickSimulateBooking}
                  className="p-2 rounded-lg bg-white hover:bg-cyan-100/70 border border-cyan-300 text-slate-900 text-xs font-bold text-left flex items-center justify-between cursor-pointer"
                >
                  <span>🍳 Book Cook (₹599)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-700" />
                </button>
              </div>
            </div>

            {/* Client's Active Booking & OTP Card */}
            <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">Active Service Radar</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {bookings.length} Orders in History
                </span>
              </div>

              {highlightedBooking ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-xs text-slate-900">
                        {highlightedBooking.serviceTitle}
                      </h5>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        highlightedBooking.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {highlightedBooking.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Assigned Helper: <strong className="text-slate-800">{highlightedBooking.helper?.name || 'Nearest Proximity Fleet'}</strong>
                    </p>

                    {/* Customer Security OTP Display */}
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-900 uppercase block">
                          Security Start OTP
                        </span>
                        <span className="text-xs text-amber-800">
                          Share with helper only when they arrive at door
                        </span>
                      </div>
                      <span className="font-mono text-base font-black text-amber-950 bg-amber-200/80 px-2.5 py-1 rounded-md tracking-wider">
                        {highlightedBooking.otp}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                      <span className="font-bold text-slate-700">Fare: ₹{highlightedBooking.pricing?.total || 449}</span>
                      <button
                        onClick={() => onOpenInvoice(highlightedBooking)}
                        className="text-cyan-800 hover:text-cyan-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No active orders. Click "Simulate 1-Click Maid Booking" above!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* WINDOW 2: SERVICE PROVIDER PORTAL                        */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border-2 border-cyan-700/60 shadow-sm flex flex-col overflow-hidden">
          {/* Window Title Bar */}
          <div className="bg-[#0E7490] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                  Window 2: Service Provider
                </h3>
                <span className="text-[10px] text-cyan-100">Partner & Domestic Staff Portal</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateWindow('provider')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
            >
              Open Full ↗
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col space-y-4 bg-slate-50/50">
            {/* Helper Switcher & Status */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Active Domestic Staff</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Online & On Duty
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={activeHelper?.photoUrl}
                  alt={activeHelper?.name}
                  className="w-12 h-12 rounded-xl object-cover border border-cyan-200"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">{activeHelper?.name}</h4>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {activeHelper?.rating}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-800 font-medium">{activeHelper?.categoryTitle}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Police Cleared • {activeHelper?.totalJobs} jobs fulfilled
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Switch Domestic Worker:
                </label>
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  className="w-full text-xs font-semibold p-1.5 rounded-lg border border-slate-300 bg-white"
                >
                  {helpers.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} — {h.categoryTitle} ({h.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Provider Earnings Badge */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Payout</span>
                <span className="text-base font-black text-emerald-700">₹3,240</span>
                <span className="text-[10px] text-emerald-600 block">80% direct to bank</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Arrival SLA</span>
                <span className="text-base font-black text-cyan-800">100%</span>
                <span className="text-[10px] text-cyan-600 block">&lt; 15 min average</span>
              </div>
            </div>

            {/* Provider's Active Dispatch Action Card */}
            <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">Incoming Job Radar</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  Real-Time Dispatch
                </span>
              </div>

              {highlightedBooking ? (
                <div className="p-3 rounded-xl border border-cyan-200 bg-cyan-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">
                      {highlightedBooking.serviceTitle}
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      ₹{Math.round((highlightedBooking.pricing?.total || 449) * 0.8)} Payout
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{highlightedBooking.customer?.address || 'Flat 402, Koramangala, Bangalore'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3 text-cyan-600 shrink-0" />
                      <span>Customer: {highlightedBooking.customer?.name} ({highlightedBooking.customer?.phone})</span>
                    </div>
                  </div>

                  {/* Provider Action Buttons based on status */}
                  <div className="pt-2 border-t border-slate-200">
                    {highlightedBooking.status === 'pending' && (
                      <button
                        onClick={() => handleStepAction(highlightedBooking, 'assigned')}
                        disabled={isProcessing}
                        className="w-full py-2 rounded-lg bg-[#0C356A] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Accept Service Request ➔
                      </button>
                    )}

                    {highlightedBooking.status === 'assigned' && (
                      <button
                        onClick={() => handleStepAction(highlightedBooking, 'en_route')}
                        disabled={isProcessing}
                        className="w-full py-2 rounded-lg bg-[#0E7490] hover:bg-cyan-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Start Trip (Mark En Route) ➔
                      </button>
                    )}

                    {highlightedBooking.status === 'en_route' && (
                      <button
                        onClick={() => handleStepAction(highlightedBooking, 'arrived')}
                        disabled={isProcessing}
                        className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Mark Arrived at Customer Door ➔
                      </button>
                    )}

                    {highlightedBooking.status === 'arrived' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-600 uppercase block">
                          Enter 4-Digit Customer OTP:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            placeholder={highlightedBooking.otp}
                            value={providerOtpInput[highlightedBooking.id] || ''}
                            onChange={(e) => setProviderOtpInput({
                              ...providerOtpInput,
                              [highlightedBooking.id]: e.target.value
                            })}
                            className="w-24 text-center font-mono font-bold text-sm border border-slate-300 rounded-lg p-1 bg-white"
                          />
                          <button
                            onClick={() => handleStepAction(highlightedBooking, 'in_progress')}
                            disabled={isProcessing}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                          >
                            Verify & Start Job
                          </button>
                        </div>
                      </div>
                    )}

                    {highlightedBooking.status === 'in_progress' && (
                      <button
                        onClick={() => handleStepAction(highlightedBooking, 'completed')}
                        disabled={isProcessing}
                        className="w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        ✓ Job Completed & Collect Fare
                      </button>
                    )}

                    {highlightedBooking.status === 'completed' && (
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs text-center">
                        ✓ Service Completed & Payout Credited
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  Ready for incoming dispatch requests.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* WINDOW 3: ADMIN DASHBOARD & SEGMENT-WISE REPORTS         */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border-2 border-emerald-600/60 shadow-sm flex flex-col overflow-hidden">
          {/* Window Title Bar */}
          <div className="bg-[#009688] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                  Window 3: Admin & Reports
                </h3>
                <span className="text-[10px] text-teal-100">Executive Control & Segments</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateWindow('admin')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
            >
              Open Full ↗
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col space-y-4 bg-slate-50/50">
            {/* Live Financial Metrics Summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Gross GMV</span>
                <span className="text-sm font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Completed</span>
                <span className="text-sm font-black text-emerald-700">{completedJobs.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Active Fleet</span>
                <span className="text-sm font-black text-amber-600">{activeJobs.length}</span>
              </div>
            </div>

            {/* Segment Selector Tabs */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center gap-1">
              <button
                onClick={() => setActiveSegment('revenue')}
                className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeSegment === 'revenue'
                    ? 'bg-[#0C356A] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Financials
              </button>
              <button
                onClick={() => setActiveSegment('demand')}
                className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeSegment === 'demand'
                    ? 'bg-[#0C356A] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demand
              </button>
              <button
                onClick={() => setActiveSegment('fleet')}
                className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeSegment === 'fleet'
                    ? 'bg-[#0C356A] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fleet
              </button>
              <button
                onClick={() => setActiveSegment('regions')}
                className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeSegment === 'regions'
                    ? 'bg-[#0C356A] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cities
              </button>
            </div>

            {/* Segment Details Box */}
            <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              {activeSegment === 'revenue' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] pb-1 border-b border-slate-100">
                    <span>Revenue Ledger Audit</span>
                    <span className="text-emerald-700 font-bold">18% GST Compliant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Total GMV Booked:</span>
                    <span className="font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Platform Share (20%):</span>
                    <span className="font-bold text-cyan-800">₹{Math.round(totalRevenue * 0.2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Staff Payouts (80%):</span>
                    <span className="font-bold text-emerald-700">₹{Math.round(totalRevenue * 0.8).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">GST Collected (18%):</span>
                    <span className="font-mono text-slate-700">₹{Math.round((totalRevenue * 0.2) * 0.18).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {activeSegment === 'demand' && (
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] text-slate-500 font-semibold block">Demand by Service:</span>
                  <div className="space-y-1.5">
                    {['Maid / Housekeeping', 'Cook / Chef', 'CarePlans Warranty', 'Driver'].map((cat, idx) => {
                      const pct = [48, 26, 16, 10][idx];
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-[11px] mb-0.5">
                            <span className="font-medium text-slate-700">{cat}</span>
                            <span className="font-bold text-slate-900">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeSegment === 'fleet' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] pb-1 border-b border-slate-100">
                    <span>Workforce Verification</span>
                    <span className="text-emerald-700 font-bold">100% Police Verified</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    All {helpers.length} domestic helpers are vetted with Aadhaar biometric verification and local police clearance.
                  </p>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                    Replacement SLA: If helper is unavailable, replacement arrives in &lt; 15 mins.
                  </div>
                </div>
              )}

              {activeSegment === 'regions' && (
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] text-slate-500 font-semibold block">City Cluster Share:</span>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block">Bangalore</span>
                      <span className="text-[10px] text-cyan-800">58% Orders</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block">Mumbai</span>
                      <span className="text-[10px] text-cyan-800">24% Orders</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block">Delhi NCR</span>
                      <span className="text-[10px] text-cyan-800">12% Orders</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block">Hyderabad</span>
                      <span className="text-[10px] text-cyan-800">6% Orders</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => onNavigateWindow('admin')}
                className="w-full mt-2 py-2 rounded-xl bg-[#009688] hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                id="sim-open-full-reports-btn"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Open Full-Phase Segment Reports Suite ➔</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
