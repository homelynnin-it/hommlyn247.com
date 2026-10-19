import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  ShieldCheck,
  ExternalLink,
  Plus,
  Receipt
} from 'lucide-react';
import { Booking, Helper, BookingStatus } from '../../types';

interface OrdersDispatchViewProps {
  bookings: Booking[];
  helpers: Helper[];
  isDarkMode: boolean;
  onUpdateBookingStatus: (id: string, status: BookingStatus) => void;
  onOpenInvoice?: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
  onAddBooking?: (booking: Booking) => void;
  onSelectBookingForTrack?: (bookingId: string) => void;
}

export const OrdersDispatchView: React.FC<OrdersDispatchViewProps> = ({
  bookings,
  helpers,
  isDarkMode,
  onUpdateBookingStatus,
  onOpenInvoice,
  onDeleteBooking,
  onAddBooking,
  onSelectBookingForTrack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.helper?.name && b.helper.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.customer?.address && b.customer.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className={`rounded-2xl border transition-all ${
      isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>

      {/* Top Controls Bar */}
      <div className={`p-4 border-b flex flex-col sm:flex-row gap-3 items-center justify-between ${
        isDarkMode ? 'bg-[#0E1626] border-slate-800' : 'bg-slate-50/70 border-slate-200'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, resident, pro, or address..."
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl focus:outline-none focus:border-teal-700 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium border focus:outline-none focus:border-teal-700 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="en_route">En Route</option>
            <option value="arrived">Arrived</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium border focus:outline-none focus:border-teal-700 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Categories</option>
            <option value="maid">House Maid</option>
            <option value="cook">Home Cook</option>
            <option value="nanny">Babysitter</option>
            <option value="driver">Driver</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className={`font-semibold border-b text-[11px] ${
            isDarkMode ? 'bg-[#0A1220] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}>
            <tr>
              <th className="p-3.5">Order ID</th>
              <th className="p-3.5">Resident & Society</th>
              <th className="p-3.5">Domestic Service & Pro</th>
              <th className="p-3.5">Gate OTP</th>
              <th className="p-3.5">Payment</th>
              <th className="p-3.5">Live Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {filteredBookings.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                <td className={`p-3.5 font-mono font-bold ${isDarkMode ? 'text-teal-400' : 'text-teal-800'}`}>
                  #{b.id.replace('book-', '')}
                </td>
                <td className="p-3.5">
                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{b.customer?.name}</p>
                  <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{b.customer?.address}, {b.customer?.city}</p>
                </td>
                <td className="p-3.5">
                  <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{b.serviceTitle}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <select
                      value={b.helper?.id || ''}
                      onChange={async (e) => {
                        const selectedHelper = helpers.find(h => h.id === e.target.value);
                        if (selectedHelper) {
                          const updated = {
                            ...b,
                            helper: selectedHelper,
                            status: b.status === 'pending' ? ('assigned' as BookingStatus) : b.status
                          };
                          try {
                            await fetch(`/api/bookings/${b.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(updated)
                            });
                          } catch (err) {}
                          if (onAddBooking) onAddBooking(updated);
                        }
                      }}
                      className={`text-[11px] font-semibold rounded-lg border px-2 py-0.5 max-w-[150px] ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <option value="">-- Assign Helper --</option>
                      {helpers.map(h => (
                        <option key={h.id} value={h.id}>{h.name} ({h.category})</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {b.otp}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className={`font-black block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    ₹{b.pricing?.total || 449}
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${
                    b.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-600'
                  }`}>
                    {b.paymentStatus} ({b.paymentMethod || 'UPI'})
                  </span>
                </td>
                <td className="p-3.5">
                  <select
                    value={b.status}
                    onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg border cursor-pointer capitalize ${
                      b.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : b.status === 'in_progress'
                        ? 'bg-teal-50 text-teal-800 border-teal-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="en_route">En Route</option>
                    <option value="arrived">Arrived</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-3.5 text-right space-x-1">
                  {onOpenInvoice && (
                    <button
                      onClick={() => onOpenInvoice(b)}
                      title="View GST Tax Invoice"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-800 hover:bg-slate-100 transition-colors"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteBooking(b.id)}
                    title="Delete Order"
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
