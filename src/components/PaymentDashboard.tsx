import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Receipt,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { PaymentTransaction, Booking } from '../types';

interface PaymentDashboardProps {
  transactions: PaymentTransaction[];
  bookings: Booking[];
  onOpenInvoice: (booking: Booking) => void;
}

export const PaymentDashboard: React.FC<PaymentDashboardProps> = ({
  transactions,
  bookings,
  onOpenInvoice
}) => {
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [searchTxn, setSearchTxn] = useState<string>('');
  const [refundAlert, setRefundAlert] = useState<string>('');

  // Financial calculations
  const totalSpent = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = bookings
    .filter(b => b.paymentStatus === 'pending')
    .reduce((sum, b) => sum + b.pricing.total, 0);

  const filteredTxns = transactions.filter(t => {
    const matchesMethod = filterMethod === 'all' || t.method === filterMethod;
    const matchesSearch =
      searchTxn.trim() === '' ||
      t.id.toLowerCase().includes(searchTxn.toLowerCase()) ||
      t.bookingId.toLowerCase().includes(searchTxn.toLowerCase()) ||
      t.serviceTitle.toLowerCase().includes(searchTxn.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchTxn.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  const handleDispute = (txnId: string) => {
    setRefundAlert(`Refund request for ${txnId} registered. Swiftly 24-hr resolution initiated with your bank.`);
    setTimeout(() => setRefundAlert(''), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="payment-dashboard-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Payment Gateway & Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor transactions, invoices, settlement receipts, and connected payment accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Razorpay & UPI Escrow Secured</span>
          </span>
        </div>
      </div>

      {refundAlert && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{refundAlert}</span>
        </div>
      )}

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Settled</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹{totalSpent.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Across all verified bookings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Transactions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{transactions.length}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">100% gateway success rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending / Cash on Service</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹{pendingAmount.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">To be collected post service</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Saved Methods</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">3 Methods</div>
          <p className="text-[11px] text-purple-600 font-medium mt-1">UPI VPAs & Tokenized Cards</p>
        </div>
      </div>

      {/* Saved Payment Instruments Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mb-8">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 mb-4">
          Configured Payment Instruments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/40 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                UPI
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Google Pay / UPI</p>
                <p className="text-xs text-slate-500 font-mono">rahul@okaxis</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm inline-block mt-1">
                  Primary Method
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                VISA
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">HDFC Regalia Card</p>
                <p className="text-xs text-slate-500 font-mono">•••• 4821 (Exp 08/28)</p>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-sm inline-block mt-1">
                  Tokenized RBI Compliant
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                CASH
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Cash on Service</p>
                <p className="text-xs text-slate-500">Pay directly after inspection</p>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-sm inline-block mt-1">
                  Zero Advance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Gateway Transactions & Invoice Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Detailed audit trail of all online and cash receipts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
            >
              <option value="all">All Methods</option>
              <option value="upi">UPI Only</option>
              <option value="card">Cards</option>
              <option value="cash">Cash on Service</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTxn}
                onChange={(e) => setSearchTxn(e.target.value)}
                placeholder="Search Txn ID..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {filteredTxns.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No transactions match your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTxns.map((txn) => {
                  const matchedBooking = bookings.find(b => b.id === txn.bookingId);
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {txn.id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-orange-600 font-semibold">
                        {txn.bookingId}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {txn.serviceTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold uppercase text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {txn.method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        ₹{txn.amount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            txn.status === 'success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {txn.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {matchedBooking && (
                          <button
                            onClick={() => onOpenInvoice(matchedBooking)}
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-orange-600 font-semibold text-xs cursor-pointer"
                            title="View GST Tax Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDispute(txn.id)}
                          className="text-[11px] text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          Dispute
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
