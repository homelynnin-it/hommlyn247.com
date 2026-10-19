import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Booking } from '../types';

interface InvoiceModalProps {
  booking: Booking;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${booking.id}`;
  const invoiceDate = new Date(booking.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const cgst = Math.round(booking.pricing.taxAmount / 2);
  const sgst = booking.pricing.taxAmount - cgst;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 print:m-0 print:p-0 print:border-none print:shadow-none">

        {/* Header bar */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Tax Invoice Receipt</h3>
              <p className="text-[11px] text-slate-400">GSTIN: 29AABCU9603R1ZM</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 text-xs text-slate-800 space-y-6">
          {/* Top Company & Invoice meta */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-1.5 text-orange-600 font-black text-xl tracking-tight">
                <Zap className="w-5 h-5 fill-orange-600" />
                <span>Swiftly Technologies</span>
              </div>
              <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                4th Floor, Salarpuria Towers, Indiranagar<br />
                Bangalore, Karnataka - 560038<br />
                Support: care@swiftly.in | 1800-123-9898
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">TAX INVOICE</span>
              <p className="text-sm font-extrabold font-mono text-slate-900">{invoiceNumber}</p>
              <p className="text-[11px] text-slate-500 mt-1">Date: {invoiceDate}</p>
              <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold rounded-sm bg-emerald-100 text-emerald-800 uppercase">
                {booking.paymentStatus === 'paid' ? 'PAID IN FULL' : 'PAY ON COMPLETION'}
              </span>
            </div>
          </div>

          {/* Customer & Booking Details */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 text-[11px]">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Billed To:
              </span>
              <p className="font-bold text-slate-900 text-xs">{booking.customer?.name || 'Valued Customer'}</p>
              <p className="text-slate-600">{booking.customer?.address || 'Service Location'}</p>
              <p className="text-slate-600">{booking.customer?.city || 'Bangalore'} - {booking.customer?.pincode || ''}</p>
              <p className="text-slate-600 font-mono">Tel: {booking.customer?.phone || 'N/A'}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Service Assigned:
              </span>
              <p className="font-bold text-slate-900 text-xs">{booking.serviceTitle}</p>
              <p className="text-slate-600">Assigned Partner: {booking.helper?.name || 'Assigned Pro'}</p>
              <p className="text-slate-600">Slot: {booking.scheduledDate} ({booking.scheduledTimeSlot})</p>
              <p className="text-slate-600 font-mono">Security OTP: {booking.otp}</p>
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold">
                <th className="py-2">Description & Tasks</th>
                <th className="py-2 text-center">Duration</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5">
                  <span className="font-bold text-slate-900">{booking.serviceTitle}</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Tasks: {booking.selectedTasks.join(', ')}
                  </div>
                </td>
                <td className="py-2.5 text-center text-slate-600 font-mono">
                  {booking.durationHours} hr(s)
                </td>
                <td className="py-2.5 text-right font-bold text-slate-900">
                  ₹{booking.pricing.baseAmount}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-600">Safety & Rapid Dispatch Fee</td>
                <td className="py-2 text-center font-mono">1</td>
                <td className="py-2 text-right font-medium text-slate-800">₹{booking.pricing.platformFee}</td>
              </tr>
              {booking.pricing.discount > 0 && (
                <tr className="text-emerald-600">
                  <td className="py-2">Promotional Discount (Welcome Offer)</td>
                  <td className="py-2 text-center">-</td>
                  <td className="py-2 text-right font-semibold">-₹{booking.pricing.discount}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Tax breakdown & Total */}
          <div className="border-t border-slate-200 pt-4 space-y-1 text-right text-slate-600 text-xs">
            <div className="flex justify-between">
              <span>CGST (9%)</span>
              <span>₹{cgst}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9%)</span>
              <span>₹{sgst}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Amount (INR)</span>
              <span className="text-orange-600">₹{booking.pricing.total}</span>
            </div>
            <p className="text-[10px] text-slate-400 text-left pt-2">
              Payment Method: {booking.paymentMethod.toUpperCase()} • This is a computer-generated tax invoice and requires no physical signature.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close Invoice
          </button>
        </div>

      </div>
    </div>
  );
};
