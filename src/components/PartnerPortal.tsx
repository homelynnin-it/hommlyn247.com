import React, { useState } from 'react';
import {
  UserCheck,
  MapPin,
  Phone,
  CheckCircle2,
  KeyRound,
  DollarSign,
  Star,
  Clock,
  ShieldCheck,
  Award,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ArrowRight
} from 'lucide-react';
import { Booking, BookingStatus, Helper } from '../types';

interface PartnerPortalProps {
  bookings: Booking[];
  helpers: Helper[];
  onUpdateStatus: (bookingId: string, status: BookingStatus, otp?: string) => Promise<void>;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  bookings,
  helpers,
  onUpdateStatus
}) => {
  const [selectedHelperId, setSelectedHelperId] = useState<string>(helpers[0]?.id || 'hlp-101');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [otpInput, setOtpInput] = useState<{ [bookingId: string]: string }>({});
  const [actionError, setActionError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeHelper = helpers.find(h => h.id === selectedHelperId) || helpers[0];

  // Jobs relevant to this helper or unassigned in this category
  const helperJobs = bookings.filter(b =>
    b.helper?.id === activeHelper?.id || (!b.helper && b.category === activeHelper?.category)
  );

  const handlePartnerAction = async (booking: Booking, newStatus: BookingStatus) => {
    setActionError('');
    setIsSubmitting(true);
    try {
      if (newStatus === 'in_progress') {
        const enteredOtp = otpInput[booking.id] || '';
        if (!enteredOtp) {
          setActionError('Please enter the 4-digit OTP provided by the customer to start the job.');
          setIsSubmitting(false);
          return;
        }
        await onUpdateStatus(booking.id, newStatus, enteredOtp);
      } else {
        await onUpdateStatus(booking.id, newStatus);
      }
    } catch (err: any) {
      setActionError(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="partner-portal-section">
      {/* Top Banner / Switch Worker view */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-slate-900 text-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={activeHelper?.photoUrl}
            alt={activeHelper?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-400 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Partner / Worker Portal
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                Verified Professional
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {activeHelper?.name}
            </h1>
            <p className="text-xs text-slate-300">
              {activeHelper?.categoryTitle} • {activeHelper?.location}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Switch Helper Dropdown for demo */}
          <div className="text-left">
            <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
              Switch Partner Account:
            </label>
            <select
              value={selectedHelperId}
              onChange={(e) => setSelectedHelperId(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 text-xs font-semibold text-white rounded-xl border border-slate-700"
            >
              {helpers.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.category.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Availability Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isOnline
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
            <span>{isOnline ? 'ONLINE & ACCEPTING' : 'OFFLINE'}</span>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Partner Daily Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Today's Earnings</span>
          <span className="text-2xl font-extrabold text-emerald-600">₹1,840</span>
          <span className="text-[11px] text-slate-500 block mt-1">Direct Bank Deposit at 11 PM</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Jobs Completed</span>
          <span className="text-2xl font-extrabold text-slate-900">{activeHelper?.completedJobs || 0}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Lifetime verified jobs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Partner Rating</span>
          <div className="flex items-center gap-1 text-2xl font-extrabold text-slate-900">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{activeHelper?.rating || 4.9}</span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium block mt-1">Top 5% Partner Tier</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Verification</span>
          <span className="text-sm font-extrabold text-emerald-700 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Cleared
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Police & Aadhaar active</span>
        </div>
      </div>

      {/* Active Service Requests List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            Assigned & Incoming Tasks ({helperJobs.length})
          </h2>
          <span className="text-xs text-slate-500">
            Enter start OTP at customer door to unlock timer
          </span>
        </div>

        {helperJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">No active jobs assigned</p>
            <p className="text-xs text-slate-500 mt-1">
              New instant bookings within 3 km will alert you with audio beep.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {helperJobs.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-orange-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {booking.id}
                      </span>
                      <span className="text-xs font-semibold text-orange-600">
                        {booking.bookingType === 'instant' ? '⚡ 15-Min Instant Booking' : '📅 Scheduled Slot'}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          booking.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {booking.serviceTitle} ({booking.durationHours} hrs)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Scheduled: {booking.scheduledDate} • {booking.scheduledTimeSlot}
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs text-slate-400 block">Job Payout</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      ₹{booking.pricing.total - booking.pricing.platformFee}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      {booking.paymentStatus === 'paid' ? 'Paid Online' : 'Collect Cash Post Job'}
                    </span>
                  </div>
                </div>

                {/* Customer Location & Contact */}
                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase block text-[10px] mb-1">
                      Customer Location
                    </span>
                    <p className="font-bold text-slate-800">{booking.customer?.name}</p>
                    <p className="text-slate-600">{booking.customer?.address}, {booking.customer?.city || 'Bangalore'}</p>
                    {booking.customer?.instructions && (
                      <p className="text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg">
                        Customer Note: "{booking.customer.instructions}"
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase block text-[10px] mb-1">
                      Tasks to Perform
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.selectedTasks.map((task, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                          ✓ {task}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Partner Action Bar & Start OTP Verification */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 -mx-6 -mb-6 p-6 rounded-b-3xl">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${booking.customer.phone}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-orange-600" />
                      <span>Call Customer</span>
                    </a>
                  </div>

                  {/* Actions by current status */}
                  <div className="flex items-center gap-2">
                    {booking.status === 'assigned' && (
                      <button
                        onClick={() => handlePartnerAction(booking, 'en_route')}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Accept & Start Moving (En Route)
                      </button>
                    )}

                    {booking.status === 'en_route' && (
                      <button
                        onClick={() => handlePartnerAction(booking, 'arrived')}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        I Have Arrived at Doorstep
                      </button>
                    )}

                    {booking.status === 'arrived' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpInput[booking.id] || ''}
                          onChange={(e) => setOtpInput({ ...otpInput, [booking.id]: e.target.value })}
                          placeholder="Customer 4-Digit OTP"
                          className="w-36 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono text-center font-bold"
                        />
                        <button
                          onClick={() => handlePartnerAction(booking, 'in_progress')}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Verify OTP & Start Job
                        </button>
                      </div>
                    )}

                    {booking.status === 'in_progress' && (
                      <button
                        onClick={() => handlePartnerAction(booking, 'completed')}
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Finish Job & Request Payment</span>
                      </button>
                    )}

                    {booking.status === 'completed' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Job Finished & Settled</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
