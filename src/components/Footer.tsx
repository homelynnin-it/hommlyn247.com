import React from 'react';
import {
  ShieldCheck,
  Home,
  Layers,
  Users,
  Building2,
  Zap,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Clock,
  Lock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { AppWindow, LegalDocType } from '../types';

interface FooterProps {
  setActiveWindow: (win: AppWindow) => void;
  onOpenLegalModal: (type: LegalDocType) => void;
  onOpenAuth: () => void;
  onOpenLeadModal?: () => void;
  onOpenEmergencySos?: () => void;
  onOpenCalculator?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveWindow,
  onOpenLegalModal,
  onOpenAuth,
  onOpenLeadModal,
  onOpenEmergencySos,
  onOpenCalculator
}) => {
  return (
    <footer className="bg-[#071952] text-slate-400 text-xs border-t border-cyan-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 pb-8 border-b border-slate-800">

          {/* Col 1 & 2: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-black text-xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white text-xs font-black shadow-md">
                24/7
              </div>
              <span>
                hommlyn<span className="text-cyan-400">247</span>
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              India's premier 24/7 verified domestic workforce & facility network. Rapid 15-minute doorstep dispatch with monthly replacement CarePlans warranty protection.
            </p>

            <div className="flex flex-col gap-1.5 pt-1 text-[11px] text-emerald-400 font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Police & Aadhaar Verified Workforce</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>15-Minute Guaranteed Dispatch in Bangalore, Mumbai & NCR</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300 font-medium">
                Developed by <strong className="text-white">TitanArtstudio, India</strong>
              </span>
            </div>
          </div>

          {/* Col 3: Specialized Segments */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              Services & Segments
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setActiveWindow('services'); }}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Housekeeping & Deep Clean
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveWindow('services'); }}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Culinary Chef & Daily Cooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveWindow('services'); }}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Infant Babysitters & Nannies
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveWindow('services'); }}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Personal Chauffeurs & Drivers
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveWindow('services'); }}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Electricians & Rapid Plumbers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Navigation */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveWindow('home')}
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Consumer Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveWindow('client')}
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Client App & Radar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveWindow('provider')}
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Partner Dispatch Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveWindow('admin')}
                  className="flex items-center gap-1.5 hover:text-teal-300 transition-colors cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Admin OS Console</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveWindow('simulator')}
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-bold cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>3-in-1 Sync Simulator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveWindow('home');
                    setTimeout(() => {
                      document.getElementById('household-calculator-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 60);
                  }}
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Household Budget Calculator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveWindow('home');
                    setTimeout(() => {
                      document.getElementById('society-pooling-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 60);
                  }}
                  className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Apartment Society Hub</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Company, Support & Legal Policies */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              Institutional & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              {onOpenLeadModal && (
                <li>
                  <button
                    onClick={onOpenLeadModal}
                    className="text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer text-left flex items-center gap-1"
                    id="footer-quote-btn"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Request Custom Quote & Callback</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => onOpenLegalModal('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About hommlyn247
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact Us & 24/7 Helpline
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms & Conditions (SLA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy & Aadhaar Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('refund')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Refund & CarePlans Warranty
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('safety')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Worker Safety & Police Charter
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAuth}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer text-left font-bold"
                >
                  Helper Onboarding / KYC
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} hommlyn247 Technologies Pvt Ltd. All rights reserved. •{' '}
            <span className="text-cyan-300 font-bold">Developed by TitanArtstudio, India</span>
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => onOpenLegalModal('terms')} className="hover:text-white cursor-pointer">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => onOpenLegalModal('privacy')} className="hover:text-white cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onOpenLegalModal('contact')} className="hover:text-white cursor-pointer">
              24/7 Helpline: 1800-247-HOMM
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
