import React, { useState } from 'react';
import {
  Users,
  Star,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  Trash2,
  ThumbsUp,
  HeartHandshake
} from 'lucide-react';
import { Booking, Review } from '../../types';

interface CorporateCustomersViewProps {
  bookings: Booking[];
  reviews: Review[];
  isDarkMode: boolean;
  onToggleFeatureReview?: (reviewId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
}

export const CorporateCustomersView: React.FC<CorporateCustomersViewProps> = ({
  bookings,
  reviews,
  isDarkMode,
  onToggleFeatureReview,
  onDeleteReview
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'reviews'>('directory');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique customer accounts from bookings
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    address: string;
    city: string;
    totalOrders: number;
    totalSpend: number;
    lastBookingDate: string;
  }>();

  bookings.forEach(b => {
    const key = b.customer?.phone || b.customer?.name || 'Customer';
    const existing = customerMap.get(key);
    const amount = b.pricing?.total || 449;
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpend += amount;
      if (new Date(b.createdAt) > new Date(existing.lastBookingDate)) {
        existing.lastBookingDate = b.createdAt;
      }
    } else {
      customerMap.set(key, {
        name: b.customer?.name || 'Valued Resident',
        phone: b.customer?.phone || '+91 98765 43210',
        address: b.customer?.address || 'Indiranagar 100ft Road',
        city: b.customer?.city || 'Bangalore',
        totalOrders: 1,
        totalSpend: amount,
        lastBookingDate: b.createdAt
      });
    }
  });

  const customersList = Array.from(customerMap.values()).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReviews = reviews.filter(r =>
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Sub Tabs Toggle */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'directory'
                ? 'bg-teal-700 text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Directory ({customersList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'reviews'
                ? 'bg-teal-700 text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reviews & Feedback ({reviews.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search customer or review..."
            className={`pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-teal-600 ${
              isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* SUB-VIEW 1: CUSTOMER DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className={`p-6 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Phone</th>
                  <th className="pb-3 font-semibold">Service Address</th>
                  <th className="pb-3 font-semibold">Total Orders</th>
                  <th className="pb-3 font-semibold">Tier / Loyalty</th>
                  <th className="pb-3 font-semibold text-right">Lifetime GMV</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {customersList.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className={`py-3.5 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td className={`py-3.5 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {c.phone}
                    </td>
                    <td className={`py-3.5 max-w-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {c.address}, {c.city}
                    </td>
                    <td className={`py-3.5 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {c.totalOrders} visits
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Gold Resident
                      </span>
                    </td>
                    <td className={`py-3.5 font-black text-right ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      ₹{c.totalSpend.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: REVIEWS & FEEDBACK */}
      {activeSubTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map(r => (
            <div
              key={r.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs">
                    {r.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {r.customerName}
                    </h4>
                    <p className="text-[11px] text-slate-400">{r.serviceTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{r.rating}.0</span>
                </div>
              </div>

              <p className={`text-xs italic mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                "{r.comment}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
                <div className="flex items-center gap-2">
                  {onToggleFeatureReview && (
                    <button
                      onClick={() => onToggleFeatureReview(r.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        r.featured
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {r.featured ? 'Featured on Home' : 'Feature Review'}
                    </button>
                  )}
                </div>

                {onDeleteReview && (
                  <button
                    onClick={() => onDeleteReview(r.id)}
                    className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
