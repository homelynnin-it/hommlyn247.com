import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  Lock,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Award,
  HeartHandshake
} from 'lucide-react';
import { LegalDocType } from '../types';

interface LegalModalsProps {
  type: LegalDocType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ type, onClose }) => {
  const [activeTab, setActiveTab] = useState<LegalDocType>(type);

  useEffect(() => {
    if (type) {
      setActiveTab(type);
    }
  }, [type]);

  if (!type && !activeTab) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="bg-[#0C356A] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {activeTab === 'terms' && 'Terms of Service & SLA Agreement'}
                {activeTab === 'privacy' && 'Privacy, Aadhaar & Biometric Security Policy'}
                {activeTab === 'refund' && 'Cancellation, Refund & Replacement Policy'}
                {activeTab === 'safety' && 'Domestic Worker Welfare & Police Clearance'}
                {activeTab === 'about' && 'About hommlyn247 Platform'}
                {activeTab === 'contact' && 'Contact Us & 24/7 Operations Helpline'}
              </h3>
              <p className="text-[11px] text-cyan-200/80">
                Official institutional compliance policies • Engineered by TitanArtstudio, India
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close legal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-1 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white text-[#0C356A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Terms of Service
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white text-[#0C356A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Privacy & Aadhaar
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-white text-[#0C356A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Refunds & CarePlans
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'safety'
                ? 'bg-white text-[#0C356A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Police & Safety Charter
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-white text-[#0C356A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Helpline & Contact
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'bg-white text-[#0C356A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            About Us
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed flex-1">

          {/* TAB 1: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    Guaranteed 15-Minute Doorstep Arrival SLA
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    For all rapid on-demand requests in covered cluster societies (Bangalore, Mumbai, Delhi NCR), hommlyn247 dispatches pre-cleared staff within 15 minutes. In the rare event of traffic or rain delays exceeding 25 minutes, a ₹100 courtesy wallet credit is automatically credited.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>1. Doorstep Security: 4-Digit Job-Start OTP</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Every booking creates a tamper-proof 4-digit numeric OTP displayed on the customer app and delivered via SMS. Work duration begins only after the domestic pro enters and verifies this OTP at your doorstep. Never share this code until the helper is physically present.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>2. Transparent Pricing, GST Invoices & Zero Surge Charges</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    All hourly rates and monthly package budgets are all-inclusive with mandatory 18% GST. Official GST-compliant tax invoices with breakdown of CGST, SGST, and platform insurance are automatically generated and archived in your client account.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>3. Monthly CarePlans & Continuous Replacement Warranty</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Monthly domestic staffing plans include up to 3 complimentary candidate replacements. If a regular worker is on leave, an on-demand standby domestic helper is routed to your home within 2 hours at zero additional billing.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>4. Society Gate Community Compliance</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    All hommlyn247 staff hold valid MyGate, NoBrokerHood, and ADDA gate entry badges. Staff carry physical photographic IDs and verified police clearance certificates for security checkpoint clearance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY & AADHAAR SECURITY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    UIDAI & DPDP Act 2023 Compliance
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    hommlyn247 complies strictly with India’s Digital Personal Data Protection (DPDP) Act. Biometric records and government IDs are encrypted via AES-256 and stored in ISO-27001 certified data centers.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">1. Aadhaar Tokenization & Non-Storage</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Raw 12-digit Aadhaar numbers are never stored in plain text. We utilize UIDAI-authorized Aadhaar masking and biometric tokenization to verify helper identity, ensuring zero identity compromise risk.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">2. Phone Number Masking (Virtual Calling)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Calls initiated between residents and domestic partners via our platform are connected through automated cloud PBX virtual numbers. Your personal mobile number is never displayed to service providers.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">3. Dynamic GPS Location Privacy</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Live GPS telemetry is recorded strictly during the active "En Route" dispatch window to show expected arrival time. Geolocation tracking is automatically terminated the instant the job OTP is validated.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">4. Household Non-Disclosure Commitment</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Every domestic partner signs an enforceable Non-Disclosure and Household Privacy Agreement prohibiting recording, photography, or sharing of any resident private information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REFUNDS & CANCELLATIONS */}
          {activeTab === 'refund' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    100% Instant Refund & Free Trial Assurance
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    We believe in complete transparency. If a booking is cancelled before helper arrival or if a 3-day trial demo does not meet expectations, full refunds are processed immediately.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">1. Cancellation Window</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    • <strong>Free Cancellation:</strong> Any time prior to pro arrival at your gate (100% immediate refund to original source or wallet).<br />
                    • <strong>Doorstep Cancellation:</strong> If cancelled after pro arrives and checks in with OTP, a nominal ₹99 pro conveyance charge applies.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">2. 3-Day CarePlan Trial Guarantee</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    For all monthly domestic helper placements (Cook, Maid, Nanny, Driver), clients receive a 3-day working evaluation period. If unsatisfied with cooking taste, cleaning hygiene, or demeanor, you can request an instant alternative candidate or receive a pro-rata refund.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">3. Delayed Arrival Credit</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    If our rapid 15-minute dispatch exceeds 25 minutes due to non-force majeure events, a ₹100 courtesy credit is credited to your hommlyn247 account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOMESTIC WORKER SAFETY & POLICE VERIFICATION */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-teal-50/80 rounded-2xl border border-teal-200 flex items-start gap-3">
                <Award className="w-5 h-5 text-teal-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    100% State Police Clearance & Biometrics
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Every service pro in our fleet is verified through State Police portal background records, court record verification, biometric fingerprint cross-matching, and health screening.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">1. Verification Steps</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    ✅ State Police Criminal Record Verification Certificate (PCC)<br />
                    ✅ Government Photo ID & Permanent Residential Address Physical Verification<br />
                    ✅ Prior Employer Reference Checks & Skill Testing in Certified Training Hubs<br />
                    ✅ Basic Medical & Hygiene Screenings
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">2. Fair Wages & Worker Dignity Charter</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    hommlyn247 is committed to ethical employment. Domestic workers receive fair minimum wages, mandatory weekly rest days for full-time contracts, accident insurance, and emergency healthcare assistance.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">3. Zero Tolerance for Harassment</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Both clients and workers are protected by our Zero Harassment Policy. Dedicated grievance response teams are active 24/7 to address any safety escalation within 10 minutes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & HELPLINE */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  National 24/7 Operations Desk
                </span>
                <p className="text-2xl font-black font-mono text-white">
                  1800-247-HOMM (Toll Free)
                </p>
                <p className="text-xs text-slate-300">
                  Round-the-clock rapid dispatch control, OTP confirmation, and emergency assistance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Mail className="w-4 h-4 text-cyan-700" />
                    <span>Official Email Desks</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Client Support: <strong className="text-slate-800">support@hommlyn247.com</strong>
                  </p>
                  <p className="text-xs text-slate-600">
                    Partners & KYC: <strong className="text-slate-800">partners@hommlyn247.com</strong>
                  </p>
                  <p className="text-xs text-slate-600">
                    Corporate Office: <strong className="text-slate-800">homelynn.in@gmail.com</strong>
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-cyan-700" />
                    <span>Corporate Headquarters</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Bangalore Hub:</strong> Embassy Tech Village, Outer Ring Road, Bellandur, Bengaluru 560103
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Mumbai Center:</strong> Nesco IT Park, Western Express Hwy, Goregaon East, Mumbai 400063
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-cyan-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    hommlyn247 — 24/7 Domestic Workforce & Facility Network
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Proudly engineered and maintained by <strong>TitanArtstudio, India</strong>, hommlyn247 is India’s premier verified domestic staffing platform. We solve urban household pain points with guaranteed 15-minute doorstep dispatch, biometric background checks, and structured CarePlans warranty.
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">Platform Capabilities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">⚡ Rapid 15-Min Doorstep Dispatch</span>
                  <p className="text-xs text-slate-500 mt-0.5">Automated GPS radius dispatch across 5,000+ premium gated communities.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">🛡️ 100% Police Verified</span>
                  <p className="text-xs text-slate-500 mt-0.5">Biometric Aadhaar KYC, judicial court records, and physical residential inspection.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            hommlyn247 Legal Compliance Standard • v2.4
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0C356A] hover:bg-[#082245] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            I Acknowledge &amp; Accept
          </button>
        </div>

      </div>
    </div>
  );
};
