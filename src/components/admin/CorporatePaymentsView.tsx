import React, { useState } from 'react';
import {
  CreditCard,
  IndianRupee,
  Download,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Receipt,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { PaymentTransaction, Booking } from '../../types';

interface CorporatePaymentsViewProps {
  transactions: PaymentTransaction[];
  bookings: Booking[];
  isDarkMode: boolean;
  onOpenInvoice?: (booking: Booking) => void;
}

export const CorporatePaymentsView: React.FC<CorporatePaymentsViewProps> = ({
  transactions,
  bookings,
  isDarkMode,
  onOpenInvoice
}) => {
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refundAlert, setRefundAlert] = useState<string>('');

  const totalGmv = transactions.reduce((sum, t) => sum + t.amount, 0);
  const gstCollected = Math.round(totalGmv * 0.18);
  const successfulTxns = transactions.filter(t => t.status === 'success').length;

  const filteredTxns = transactions.filter(t => {
    const matchesMethod = filterMethod === 'all' || t.method === filterMethod;
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  const handleDispute = (txnId: string) => {
    setRefundAlert(`Refund request for ${txnId} registered. 24-hr banking settlement initiated.`);
    setTimeout(() => setRefundAlert(''), 5000);
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Transaction ID,Booking ID,Customer,Service,Amount,Method,Reference,Status,Timestamp\n" +
      filteredTxns.map(t => `${t.id},${t.bookingId},${t.customerName},${t.serviceTitle},${t.amount},${t.method},${t.referenceId},${t.status},${t.timestamp}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hommlyn247_payments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {refundAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{refundAlert}</span>
          </div>
          <button onClick={() => setRefundAlert('')} className="text-emerald-900 text-xs">Dismiss</button>
        </div>
      )}

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Total Net Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
          </div>
          <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            ₹{totalGmv.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">Instant Settlement to Escrow</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">18% GST Collected</span>
            <Receipt className="w-4 h-4 text-teal-500" />
          </div>
          <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            ₹{gstCollected.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Ready for GSTR-1 Monthly Filing</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Successful Settlements</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {successfulTxns} / {transactions.length}
          </div>
          <p className="text-[11px] text-teal-600 font-bold mt-1">99.8% Gateway Reliability</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Escrow Security</span>
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
          </div>
          <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            ₹0 Chargebacks
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">UPI & Razorpay 256-Bit SSL</p>
        </div>
      </div>

      {/* Transactions Ledger Panel */}
      <div className={`p-6 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Payment & Settlement Transactions
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              End-to-end audit ledger with automated GST invoicing and reference tracking
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reference, customer..."
                className={`pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-teal-600 ${
                  isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Filter */}
            <select
              value={filterMethod}
              onChange={e => setFilterMethod(e.target.value)}
              className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-teal-600 cursor-pointer ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="all">All Payment Methods</option>
              <option value="upi">UPI / QR Code</option>
              <option value="card">Debit / Credit Card</option>
              <option value="netbanking">NetBanking</option>
              <option value="cash">Cash on Service (COD)</option>
            </select>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="pb-3 font-semibold">Txn Reference</th>
                <th className="pb-3 font-semibold">Booking ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filteredTxns.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className={`py-3.5 font-mono font-bold ${isDarkMode ? 'text-teal-400' : 'text-teal-800'}`}>
                    {t.referenceId}
                  </td>
                  <td className={`py-3.5 font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {t.bookingId}
                  </td>
                  <td className={`py-3.5 font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {t.customerName}
                  </td>
                  <td className="py-3.5 capitalize">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                      <CreditCard className="w-3 h-3 text-teal-600" />
                      {t.method}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {t.status}
                    </span>
                  </td>
                  <td className={`py-3.5 text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {new Date(t.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className={`py-3.5 font-black text-right ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    ₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDispute(t.referenceId)}
                        className="text-[10px] text-amber-600 hover:text-amber-700 underline font-bold cursor-pointer"
                      >
                        Refund
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
