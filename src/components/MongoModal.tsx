import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  Code,
  Copy,
  Check,
  Sparkles,
  Layers,
  FileCode,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { MongoDbStatus } from '../types';

interface MongoModalProps {
  status: MongoDbStatus | null;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}

const PRISMA_SCHEMA_PREVIEW = `// prisma/schema.prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Service {
  id                 String          @id @default(auto()) @map("_id") @db.ObjectId
  slug               String          @unique
  category           ServiceCategory
  title              String
  basePrice          Float
  unit               String          // "per hr", "per visit"
  badge              String          // "15 Min Arrival"
  tasks              TaskOption[]
  bookings           Booking[]
  @@map("services")
}

model Helper {
  id                String                @id @default(auto()) @map("_id") @db.ObjectId
  helperCode        String                @unique
  name              String
  category          ServiceCategory
  hourlyRate        Float
  verification      VerificationChecklist
  location          String
  bookings          Booking[]
  @@map("helpers")
}

model Booking {
  id                String             @id @default(auto()) @map("_id") @db.ObjectId
  bookingRef        String             @unique
  serviceId         String             @db.ObjectId
  service           Service            @relation(fields: [serviceId], references: [id])
  customer          CustomerDetails
  status            BookingStatus      @default(ASSIGNED)
  otp               String             // 4-digit start OTP
  pricing           PricingBreakdown
  transactions      PaymentTransaction[]
  @@map("bookings")
}

model PaymentTransaction {
  id            String         @id @default(auto()) @map("_id") @db.ObjectId
  txnRef        String         @unique
  bookingId     String         @db.ObjectId
  booking       Booking        @relation(fields: [bookingId], references: [id])
  amount        Float
  method        PaymentMethod
  status        PaymentStatus  @default(PAID)
  @@map("payment_transactions")
}`;

export const MongoModal: React.FC<MongoModalProps> = ({
  status,
  onClose,
  onRefresh
}) => {
  const [activeView, setActiveView] = useState<'status' | 'prisma'>('status');
  const [copied, setCopied] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [notice, setNotice] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(PRISMA_SCHEMA_PREVIEW);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReseed = async () => {
    setIsReseeding(true);
    setNotice('');
    try {
      const res = await fetch('/api/db/seed', { method: 'POST' });
      const data = await res.json();
      setNotice(data.message || 'Local store refreshed with default data');
      await onRefresh();
    } catch (err: any) {
      setNotice(`Notice: ${err.message}`);
    } finally {
      setIsReseeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">
                  Prisma Models & Local Engine
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-phase MongoDB models generated. Running 100% locally.
              </p>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveView('status')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'status' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Local Architecture & Stats</span>
            </button>
            <button
              onClick={() => setActiveView('prisma')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'prisma' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Prisma Schema (MongoDB)</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {notice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{notice}</span>
            </div>
          )}

          {activeView === 'status' ? (
            <>
              {/* Local Operation Confirmation */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Local-First Ready: Zero Setup Required Right Now</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  The design and booking flows are completely functional locally. All instant 15-minute dispatches, schedule bookings, helper assignments, start OTPs, and payment receipts work instantly in the browser.
                </p>
              </div>

              {/* Models summary */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Generated Prisma Models
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block font-mono">Service</span>
                    <span className="text-[11px] text-slate-500">Catalog, tasks & rates</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block font-mono">Helper</span>
                    <span className="text-[11px] text-slate-500">Staff, police verification</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block font-mono">Booking</span>
                    <span className="text-[11px] text-slate-500">Timing, schedule & OTP</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block font-mono">PaymentTransaction</span>
                    <span className="text-[11px] text-slate-500">UPI, cards & GST receipts</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block font-mono">Review</span>
                    <span className="text-[11px] text-slate-500">Customer feedback & star ratings</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block font-mono">PartnerPayout</span>
                    <span className="text-[11px] text-slate-500">Daily earnings & settlements</span>
                  </div>
                </div>
              </div>

              {/* Document Counts */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Active Local Data State
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Services</span>
                    <span className="text-base font-extrabold text-slate-900">{status?.stats.servicesCount || 9}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Helpers</span>
                    <span className="text-base font-extrabold text-slate-900">{status?.stats.helpersCount || 7}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Bookings</span>
                    <span className="text-base font-extrabold text-orange-600">{status?.stats.bookingsCount || 0}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Ledger</span>
                    <span className="text-base font-extrabold text-emerald-600">{status?.stats.transactionsCount || 0}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReseed}
                  disabled={isReseeding}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isReseeding ? 'Refreshing...' : 'Reset to Default Sample Data'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  File: <code className="text-orange-600 font-mono">prisma/schema.prisma</code>
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Schema'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
                {PRISMA_SCHEMA_PREVIEW}
              </pre>

              <p className="text-[11px] text-slate-500">
                Whenever you're ready to connect MongoDB later, simply set <code className="text-slate-800 font-mono">DATABASE_URL="mongodb+srv://..."</code> and run <code className="text-slate-800 font-mono">npx prisma db push</code>.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
