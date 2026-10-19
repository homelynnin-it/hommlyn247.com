import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Star,
  Download,
  Search,
  Filter,
  Plus,
  QrCode,
  Phone,
  MapPin,
  FileText,
  Check,
  X,
  Briefcase,
  BadgeCheck,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Printer
} from 'lucide-react';
import { Helper, Booking } from '../../types';

interface WorkerHRMSViewProps {
  helpers: Helper[];
  bookings: Booking[];
  isDarkMode: boolean;
  onAddHelper: (helper: Helper) => void;
  onUpdateHelper: (helper: Helper) => void;
  onDeleteHelper: (id: string) => void;
}

interface WorkerAttendance {
  id: string;
  helperId: string;
  helperName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'on_duty' | 'leave' | 'absent';
  hoursLogged: number;
  jobsCompleted: number;
}

interface LeaveRequest {
  id: string;
  helperId: string;
  helperName: string;
  category: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  replacementAssigned?: string;
}

export const WorkerHRMSView: React.FC<WorkerHRMSViewProps> = ({
  helpers,
  bookings,
  isDarkMode,
  onAddHelper,
  onUpdateHelper,
  onDeleteHelper
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'attendance' | 'payouts' | 'leaves' | 'idcard'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedHelperForId, setSelectedHelperForId] = useState<Helper | null>(helpers[0] || null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Daily Attendance Records generated directly from actual helpers roster
  const initialAttendance: WorkerAttendance[] = helpers.map((h, i) => {
    const jobsCount = bookings.filter(b => b.helper?.id === h.id).length;
    const isAvail = h.isAvailable;
    return {
      id: `att-${h.id}`,
      helperId: h.id,
      helperName: h.name,
      date: 'Today',
      checkIn: isAvail ? (i % 2 === 0 ? '08:15 AM' : '09:00 AM') : '-',
      checkOut: isAvail ? 'In Progress' : '-',
      status: isAvail ? 'on_duty' : 'leave',
      hoursLogged: isAvail ? (6 + (i % 3)) : 0,
      jobsCompleted: jobsCount > 0 ? jobsCount : Math.min(5, h.completedJobs || 1)
    };
  });

  const [attendanceRecords, setAttendanceRecords] = useState<WorkerAttendance[]>(
    initialAttendance.length > 0 ? initialAttendance : []
  );

  // Sample Leave Requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'lv-101',
      helperId: 'hlp-5',
      helperName: 'Pooja Verma',
      category: 'Childcare & Babysitter',
      startDate: '16 Sep 2026',
      endDate: '18 Sep 2026',
      reason: 'Family wedding in native village',
      status: 'approved',
      replacementAssigned: 'Meena Kumari (Auto-assigned)'
    },
    {
      id: 'lv-102',
      helperId: 'hlp-2',
      helperName: 'Ramesh Kumar',
      category: 'Home Cook & Chef',
      startDate: '20 Sep 2026',
      endDate: '21 Sep 2026',
      reason: 'Medical health checkup and rest',
      status: 'pending'
    }
  ]);

  // HRMS Metrics
  const totalStaff = helpers.length;
  const activeDutyCount = attendanceRecords.filter(a => a.status === 'on_duty').length;
  const verifiedCount = helpers.filter(h => h.verified).length;
  const verifiedPct = Math.round((verifiedCount / (totalStaff || 1)) * 100);
  const totalPayoutLiability = helpers.reduce((sum, h) => sum + (h.hourlyRate * 32), 0);

  // Filter helpers
  const filteredHelpers = helpers.filter(h => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.phone.includes(searchQuery);
    const matchesCategory = categoryFilter === 'all' || h.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleApproveLeave = (leaveId: string) => {
    setLeaveRequests(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'approved', replacementAssigned: 'Sunita Devi (Auto-assigned)' } : l));
    showToast('Leave request approved & backup replacement allocated.');
  };

  const handleRejectLeave = (leaveId: string) => {
    setLeaveRequests(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'rejected' } : l));
    showToast('Leave request rejected.');
  };

  const handleMarkAttendance = (helper: Helper) => {
    const existing = attendanceRecords.find(a => a.helperId === helper.id);
    if (existing) {
      setAttendanceRecords(prev => prev.map(a => a.helperId === helper.id ? { ...a, status: a.status === 'on_duty' ? 'present' : 'on_duty', checkOut: '05:30 PM' } : a));
      showToast(`Updated shift status for ${helper.name}`);
    } else {
      setAttendanceRecords(prev => [
        {
          id: `att-${Date.now()}`,
          helperId: helper.id,
          helperName: helper.name,
          date: 'Today, 16 Sep',
          checkIn: '09:00 AM',
          status: 'on_duty',
          hoursLogged: 4,
          jobsCompleted: 1
        },
        ...prev
      ]);
      showToast(`Checked in ${helper.name} for today's shift.`);
    }
  };

  const handleDisburseSinglePayout = (helper: Helper, amount: number) => {
    showToast(`Instant payout ₹${amount.toLocaleString('en-IN')} initiated via UPI AutoPay to ${helper.name}. Settlement ref: PAY-${Date.now().toString().slice(-6)}`);
  };

  return (
    <div className="space-y-6">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-emerald-700 hover:text-emerald-950 text-xs">Dismiss</button>
        </div>
      )}

      {/* HRMS Top Metrics (Matching Deep Corporate Teal Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
          isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 text-teal-800">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Domestic Workforce:</span>
            <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {totalStaff} Active Staff
            </div>
            <p className="text-[11px] text-teal-700 font-semibold mt-0.5">Across 6 Metro Hubs</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
          isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 text-teal-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">On Active Duty Today:</span>
            <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {activeDutyCount} On Shift
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">99.4% On-Time SLA</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
          isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 text-teal-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Police Verified & KYC:</span>
            <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {verifiedPct}% Verified
            </div>
            <p className="text-[11px] text-teal-700 font-semibold mt-0.5">Biometrics & Aadhaar Clear</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
          isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 text-teal-800">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Weekly Payout Ledger:</span>
            <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              ₹{totalPayoutLiability.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-teal-700 font-semibold mt-0.5">TDS 1% 194C Deducted</p>
          </div>
        </div>

      </div>

      {/* HRMS Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('roster')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'roster'
                ? 'bg-[#0E3F37] text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Worker Staff Roster ({helpers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'attendance'
                ? 'bg-[#0E3F37] text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Attendance & Shifts
          </button>
          <button
            onClick={() => setActiveSubTab('payouts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'payouts'
                ? 'bg-[#0E3F37] text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Worker Payouts & TDS
          </button>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'leaves'
                ? 'bg-[#0E3F37] text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Leaves & Substitutes ({leaveRequests.filter(l => l.status === 'pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveSubTab('idcard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'idcard'
                ? 'bg-[#0E3F37] text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Digital ID & QR Badges
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search helper name or skill..."
              className={`pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-teal-700 ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className={`px-2.5 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-teal-700 ${
              isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">All Roles</option>
            <option value="maid">House Maid</option>
            <option value="cook">Home Cook</option>
            <option value="nanny">Babysitter</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="driver">Driver</option>
          </select>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: WORKER STAFF ROSTER                            */}
      {/* ========================================================= */}
      {activeSubTab === 'roster' && (
        <div className={`p-6 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Domestic Staff Directory & Verification Ledger
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Aadhaar e-KYC, police station clearance, training badges & shift availability
              </p>
            </div>
            <div className="text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
              Active Fleet: {filteredHelpers.length} helpers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-3 font-semibold">Worker Details</th>
                  <th className="pb-3 font-semibold">Service Role</th>
                  <th className="pb-3 font-semibold">Police Verification</th>
                  <th className="pb-3 font-semibold">CSAT & Rating</th>
                  <th className="pb-3 font-semibold">Availability</th>
                  <th className="pb-3 font-semibold">Base Rate</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {filteredHelpers.map(helper => (
                  <tr key={helper.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={helper.photoUrl}
                          alt={helper.name}
                          className="w-10 h-10 rounded-full object-cover border border-teal-200 shrink-0"
                        />
                        <div>
                          <span className={`font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {helper.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {helper.phone} • {helper.experienceYears} yrs exp
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md text-[11px]">
                        {helper.categoryTitle}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {helper.verified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <BadgeCheck className="w-3 h-3 text-emerald-600" />
                          Police Verified (KYC Clear)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Pending Clearance
                        </span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{helper.rating}</span>
                        <span className="text-[10px] text-slate-400">({helper.reviewsCount} reviews)</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        helper.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${helper.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {helper.isAvailable ? 'On Duty / Available' : 'Off Shift'}
                      </span>
                    </td>
                    <td className={`py-3.5 font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      ₹{helper.hourlyRate}/hr
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedHelperForId(helper);
                            setActiveSubTab('idcard');
                          }}
                          className="px-2 py-1 rounded-lg text-teal-800 hover:bg-teal-50 text-[11px] font-bold cursor-pointer"
                          title="View Digital ID Card"
                        >
                          ID Card
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(helper)}
                          className="px-2 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold cursor-pointer"
                        >
                          Shift Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: ATTENDANCE & SHIFT MANAGEMENT                  */}
      {/* ========================================================= */}
      {activeSubTab === 'attendance' && (
        <div className={`p-6 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Daily Worker Attendance & Shift Log
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Biometric punch-in status, society gate entry timestamps, and active dispatch hours
              </p>
            </div>
            <button
              onClick={() => showToast('Attendance report exported to HRMS Excel file.')}
              className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Attendance</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-3 font-semibold">Helper</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Gate Punch In</th>
                  <th className="pb-3 font-semibold">Shift Punch Out</th>
                  <th className="pb-3 font-semibold">Shift Status</th>
                  <th className="pb-3 font-semibold">Hours Logged</th>
                  <th className="pb-3 font-semibold text-right">Jobs Finished</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {attendanceRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className={`py-3.5 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {rec.helperName}
                    </td>
                    <td className={`py-3.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {rec.date}
                    </td>
                    <td className={`py-3.5 font-mono ${isDarkMode ? 'text-teal-400' : 'text-teal-800'}`}>
                      {rec.checkIn}
                    </td>
                    <td className={`py-3.5 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {rec.checkOut || '-'}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rec.status === 'on_duty'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.status === 'present'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`py-3.5 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {rec.hoursLogged} hrs
                    </td>
                    <td className={`py-3.5 font-black text-right ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {rec.jobsCompleted} dispatches
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: WORKER PAYOUTS & TDS CALCULATOR               */}
      {/* ========================================================= */}
      {activeSubTab === 'payouts' && (
        <div className={`p-6 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Domestic Staff Compensation, Tips & TDS Deductions
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Weekly auto-settlement ledger with Section 194C 1% TDS deduction and UPI disbursement
              </p>
            </div>
            <button
              onClick={() => showToast('Batch payout of ₹' + totalPayoutLiability.toLocaleString('en-IN') + ' sent to bank gateway via UPI AutoPay.')}
              className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Disburse All Payouts</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-3 font-semibold">Worker</th>
                  <th className="pb-3 font-semibold">Hours Logged</th>
                  <th className="pb-3 font-semibold">Base Earnings</th>
                  <th className="pb-3 font-semibold">Client Tips</th>
                  <th className="pb-3 font-semibold">1% TDS (194C)</th>
                  <th className="pb-3 font-semibold text-right">Net Payable</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {helpers.map(helper => {
                  const hours = 32;
                  const base = helper.hourlyRate * hours;
                  const tips = 450;
                  const tds = Math.round((base + tips) * 0.01);
                  const net = base + tips - tds;

                  return (
                    <tr key={helper.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className={`py-3.5 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {helper.name}
                        <span className="block text-[10px] text-slate-400 font-normal">{helper.categoryTitle}</span>
                      </td>
                      <td className={`py-3.5 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {hours} hrs
                      </td>
                      <td className={`py-3.5 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        ₹{base.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 font-medium text-emerald-700">
                        +₹{tips}
                      </td>
                      <td className="py-3.5 font-medium text-rose-600">
                        -₹{tds}
                      </td>
                      <td className={`py-3.5 font-black text-right ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        ₹{net.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDisburseSinglePayout(helper, net)}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          Pay UPI
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: LEAVES & SUBSTITUTE ALLOCATION                 */}
      {/* ========================================================= */}
      {activeSubTab === 'leaves' && (
        <div className={`p-6 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="mb-4">
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Worker Leave Management & Automated Backup Allocator
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              When a domestic worker takes planned leave, our AI system automatically assigns a verified replacement to resident homes
            </p>
          </div>

          <div className="space-y-3">
            {leaveRequests.map(leave => (
              <div
                key={leave.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {leave.helperName}
                    </span>
                    <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-semibold">
                      {leave.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      leave.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : leave.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Dates: <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{leave.startDate} to {leave.endDate}</strong> • Reason: {leave.reason}
                  </p>
                  {leave.replacementAssigned && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Domestic Backup: {leave.replacementAssigned}</span>
                    </div>
                  )}
                </div>

                {leave.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveLeave(leave.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Assign Backup</span>
                    </button>
                    <button
                      onClick={() => handleRejectLeave(leave.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 5: DIGITAL ID CARD & VERIFICATION BADGES          */}
      {/* ========================================================= */}
      {activeSubTab === 'idcard' && selectedHelperForId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left Column: Worker Selector */}
          <div className={`p-6 rounded-2xl border ${
            isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <h3 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Select Staff Member to Generate Security Badge
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {helpers.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHelperForId(h)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    selectedHelperForId?.id === h.id
                      ? 'border-teal-700 bg-teal-50/50 shadow-xs'
                      : isDarkMode ? 'border-slate-800 hover:bg-slate-800/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={h.photoUrl} alt={h.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {h.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{h.categoryTitle}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-teal-800">
                    Badge ID #{h.id.replace('hlp-', 'HL')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Print-Ready Official Digital ID Card */}
          <div className={`p-6 rounded-2xl border ${
            isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Society Gate Security Pass
              </h3>
              <button
                onClick={() => showToast(`Sent verification pass for ${selectedHelperForId.name} to resident WhatsApp.`)}
                className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
            </div>

            {/* Official ID Card Preview */}
            <div className="max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-teal-800 shadow-xl bg-white text-slate-900">

              {/* Card Header */}
              <div className="bg-[#0E3F37] text-white p-4 text-center">
                <div className="text-[10px] uppercase font-bold tracking-widest text-teal-300">
                  Govt. Approved Police Verification ID
                </div>
                <h4 className="text-base font-extrabold tracking-wider mt-0.5">
                  HOMMLYN 24/7 FLEET PASS
                </h4>
                <p className="text-[9px] text-teal-200">Domestic Workforce Security Credential</p>
              </div>

              {/* Card Body */}
              <div className="p-5 text-center space-y-3">
                <img
                  src={selectedHelperForId.photoUrl}
                  alt={selectedHelperForId.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-teal-100 shadow-sm"
                />

                <div>
                  <h5 className="text-base font-black text-slate-900">
                    {selectedHelperForId.name}
                  </h5>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mt-1">
                    {selectedHelperForId.categoryTitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Staff Badge ID</span>
                    <strong className="font-mono text-teal-900">HL7-{selectedHelperForId.id.replace('hlp-', '')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Verification</span>
                    <strong className="text-emerald-700 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Aadhaar Status</span>
                    <strong className="text-slate-800 font-mono">XXXX-4892</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Emergency SOS</span>
                    <strong className="text-slate-800">1800-247-HOMM</strong>
                  </div>
                </div>

                {/* QR Code Simulation */}
                <div className="pt-2 flex items-center justify-center gap-2">
                  <QrCode className="w-12 h-12 text-teal-900" />
                  <div className="text-left text-[10px] text-slate-500">
                    <p className="font-bold text-slate-800">Scan at Society Gate</p>
                    <p>Instant biometric verification pass for guard room</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 text-[10px] text-center text-slate-500 font-mono">
                Issued by hommlyn247 Security & Compliance Division
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
