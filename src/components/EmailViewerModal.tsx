import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  ShieldCheck,
  Clock,
  FileText,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { SentEmail } from '../types';

interface EmailViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: SentEmail[];
  onSendTestEmail?: (to: string, type: SentEmail['type']) => void;
}

export const EmailViewerModal: React.FC<EmailViewerModalProps> = ({
  isOpen,
  onClose,
  emails,
  onSendTestEmail
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(
    emails[0]?.id || ''
  );

  if (!isOpen) return null;

  const activeEmail = emails.find(e => e.id === selectedEmailId) || emails[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-[#0C356A] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  hommlyn247 Automated Mail Dispatch Service
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-900 text-[10px] font-black uppercase">
                  Live API Engine
                </span>
              </div>
              <p className="text-xs text-cyan-200/80">
                Simulated SMTP / SendGrid API gateway for customer order confirmations and registration dispatches.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split: Email List (Left) & Email Preview (Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Left: Email Mailbox List */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-cyan-700" />
                <span>Outbox Feed ({emails.length})</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                SMTP 200 OK
              </span>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {emails.map((em) => {
                const isSelected = em.id === activeEmail?.id;
                return (
                  <button
                    key={em.id}
                    onClick={() => setSelectedEmailId(em.id)}
                    className={`w-full text-left p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-cyan-600 shadow-2xs'
                        : 'hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-900 truncate">
                        {em.recipientName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {em.timestamp}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {em.subject}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {em.previewText}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-900">
                        {em.type.replace('_', ' ')}
                      </span>
                      {em.bookingId && (
                        <span className="text-[9px] font-mono text-slate-500">
                          #{em.bookingId}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Button */}
            {onSendTestEmail && (
              <div className="p-3 border-t border-slate-200 bg-white">
                <button
                  onClick={() => onSendTestEmail('prasad.sharma@gmail.com', 'order_confirmation')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Send Sample Order Confirmation</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Email Body Preview */}
          <div className="flex-1 bg-white flex flex-col overflow-y-auto">
            {activeEmail ? (
              <div className="p-6">

                {/* Email Metadata Header */}
                <div className="mb-6 pb-4 border-b border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Message ID: {activeEmail.id}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Delivered via hommlyn247 Mail Engine
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">
                    {activeEmail.subject}
                  </h3>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-400 block text-[10px] uppercase">
                        From
                      </span>
                      <span className="font-semibold text-slate-800">
                        hommlyn247 Rapid Dispatch &lt;orders@hommlyn247.in&gt;
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 block text-[10px] uppercase">
                        To
                      </span>
                      <span className="font-semibold text-slate-800">
                        {activeEmail.recipientName} &lt;{activeEmail.to}&gt;
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email HTML / Rendered Card */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs p-6 max-w-xl mx-auto space-y-5 text-slate-800">

                  {/* Brand Banner */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0C356A] text-white flex items-center justify-center font-black text-xs">
                        24/7
                      </div>
                      <div>
                        <span className="font-black text-base tracking-tight text-[#0C356A] block">
                          hommlyn247
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          Developed by TitanArtstudio, India
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {activeEmail.timestamp}
                    </span>
                  </div>

                  {/* Rendered HTML content */}
                  <div
                    className="email-rendered-body text-xs sm:text-sm leading-relaxed text-slate-700 space-y-3"
                    dangerouslySetInnerHTML={{ __html: activeEmail.htmlContent }}
                  />

                  {/* Footer of the email */}
                  <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-600">
                      Need help? Call 24/7 Helpline: 1800-247-HOMM or WhatsApp +91 98765 43210
                    </p>
                    <p>
                      © {new Date().getFullYear()} hommlyn247 Technologies Pvt Ltd. Developed by TitanArtstudio, India.
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                No emails dispatched yet.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
