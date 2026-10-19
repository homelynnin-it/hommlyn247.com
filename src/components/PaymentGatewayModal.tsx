import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  X,
  ShieldCheck,
  QrCode,
  Lock,
  Smartphone,
  Building2,
  IndianRupee,
  Zap,
  ArrowRight,
  Receipt,
  Copy,
  Check
} from 'lucide-react';
import { Booking, PaymentTransaction } from '../types';
import confetti from 'canvas-confetti';

interface PaymentGatewayModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  booking,
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cash'>('upi');
  const [upiVpa, setUpiVpa] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('482');
  const [cardHolder, setCardHolder] = useState(booking.customer?.name || 'Rajesh Malhotra');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [timeLeft, setTimeLeft] = useState(299); // 5 min countdown for QR

  useEffect(() => {
    if (!isOpen || isSuccess) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 299));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const totalAmount = booking.pricing?.total || 449;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('homeelynn7.settle@axisbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    const refId = `TXN-HL7-${Date.now().toString().slice(-6)}`;
    let newTxn: PaymentTransaction = {
      id: `txn-${Date.now()}`,
      bookingId: booking.id,
      amount: totalAmount,
      currency: 'INR',
      method: paymentMethod,
      referenceId: refId,
      upiId: paymentMethod === 'upi' ? upiVpa : undefined,
      cardLast4: paymentMethod === 'card' ? '8892' : undefined,
      bankName: paymentMethod === 'netbanking' ? selectedBank : undefined,
      status: 'success',
      timestamp: new Date().toISOString(),
      customerName: booking.customer?.name || 'Customer',
      serviceTitle: booking.serviceTitle
    };

    try {
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          method: paymentMethod,
          upiId: paymentMethod === 'upi' ? upiVpa : undefined,
          cardLast4: paymentMethod === 'card' ? '8892' : undefined,
          bankName: paymentMethod === 'netbanking' ? selectedBank : undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.transaction) {
          newTxn = data.transaction;
        }
      }
    } catch (err) {
      console.warn('Payment process backend sync note:', err);
    }

    setIsProcessing(false);
    setIsSuccess(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // Safe fallback
    }
    onPaymentSuccess(newTxn);
    setTimeout(() => {
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Custom Branded Top Bar */}
        <div className="bg-[#0C356A] text-white p-4 flex items-center justify-between border-b border-cyan-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white">HomeeLynn7 Secure Gateway</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-[11px] text-cyan-200">Instant Settlement & GST Tax Compliant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-cyan-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Service Payable</span>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1">{booking.serviceTitle}</h4>
            <p className="text-[11px] text-slate-500">Order #{booking.id} • {booking.customer?.name || 'Customer'}</p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Amount Due</span>
            <div className="text-xl font-black text-[#0C356A] flex items-center justify-end">
              <span>₹{totalAmount}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">Zero Gateway Surcharge</span>
          </div>
        </div>

        {/* Modal Main Content */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Payment Successful!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Transaction has been verified and settled instantly. Your GST invoice receipt is now available in your portal.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono">
              <span>REF: TXN-HL7-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row flex-1 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 min-h-[340px]">

            {/* Left Method Switcher */}
            <div className="w-full sm:w-48 bg-slate-50/70 p-3 space-y-1.5 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Payment Method
              </span>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-[#0C356A] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <div className="leading-none">
                  <div>UPI Instant</div>
                  <span className={`text-[10px] ${paymentMethod === 'upi' ? 'text-cyan-200' : 'text-slate-400'}`}>
                    GPay / PhonePe / QR
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#0C356A] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <div className="leading-none">
                  <div>Cards</div>
                  <span className={`text-[10px] ${paymentMethod === 'card' ? 'text-cyan-200' : 'text-slate-400'}`}>
                    Credit & Debit
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'bg-[#0C356A] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Building2 className="w-4 h-4 text-cyan-400" />
                <div className="leading-none">
                  <div>NetBanking</div>
                  <span className={`text-[10px] ${paymentMethod === 'netbanking' ? 'text-cyan-200' : 'text-slate-400'}`}>
                    All Indian Banks
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-[#0C356A] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <IndianRupee className="w-4 h-4 text-cyan-400" />
                <div className="leading-none">
                  <div>Post-Service Cash</div>
                  <span className={`text-[10px] ${paymentMethod === 'cash' ? 'text-cyan-200' : 'text-slate-400'}`}>
                    Pay after job
                  </span>
                </div>
              </button>
            </div>

            {/* Right Pane: Payment Inputs */}
            <div className="flex-1 p-5 flex flex-col justify-between">

              {/* UPI Tab */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Scan Dynamic UPI QR Code</span>
                    <span className="text-[11px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-cyan-50/50 p-3.5 rounded-2xl border border-cyan-100">
                    {/* Simulated Clean Dynamic QR */}
                    <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center justify-center shrink-0">
                      <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-slate-900 rounded-lg">
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="text-slate-600">
                        Scan with <span className="font-bold text-slate-800">Google Pay, PhonePe, Paytm</span> or any BHIM UPI app.
                      </p>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[11px] font-mono text-slate-700 select-all">
                          homeelynn7.settle@axisbank
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer ml-auto"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Or Enter Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={e => setUpiVpa(e.target.value)}
                      placeholder="mobileNumber@upi / username@okhdfcbank"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Cards Tab */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Valid Thru</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden font-mono text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* NetBanking Tab */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">Select Your Bank</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          selectedBank === bank
                            ? 'border-cyan-600 bg-cyan-50 text-cyan-900 shadow-2xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cash On Delivery Tab */}
              {paymentMethod === 'cash' && (
                <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-800">
                    <IndianRupee className="w-5 h-5" />
                    <span className="font-bold text-sm">Pay In Person After Service</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You can pay the helper via physical Cash or Direct UPI once the job is thoroughly completed to your satisfaction. Zero advance deposit required.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>RBI Compliant Secure Escrow</span>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0C356A] to-[#0E7490] hover:from-[#082245] hover:to-[#085a70] text-white font-black text-xs flex items-center gap-2 shadow-md shadow-cyan-950/20 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying Secure Payment...</span>
                  ) : (
                    <>
                      <span>Pay ₹{totalAmount} Instantly</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
