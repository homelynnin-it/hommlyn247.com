import React, { useState } from 'react';
import {
  ShieldCheck,
  Tag,
  Database,
  CheckCircle2,
  Settings,
  Sliders,
  Lock,
  Bell,
  Key,
  Cpu,
  Globe,
  Sparkles
} from 'lucide-react';
import { CarePlansCMS } from './CarePlansCMS';
import { PromotionsCMS } from './PromotionsCMS';
import { ApiTesterConsole } from './ApiTesterConsole';
import { CarePlan } from '../../types';

interface CorporateSettingsCMSProps {
  carePlans: CarePlan[];
  isDarkMode: boolean;
  onRefreshData?: () => void;
}

export const CorporateSettingsCMS: React.FC<CorporateSettingsCMSProps> = ({
  carePlans,
  isDarkMode,
  onRefreshData
}) => {
  const [activeSection, setActiveSection] = useState<'careplans' | 'promotions' | 'apitester' | 'general'>('careplans');
  const [platformFee, setPlatformFee] = useState('18');
  const [sosHotline, setSosHotline] = useState('1800-247-HOMM');
  const [autoDispatchRange, setAutoDispatchRange] = useState('4.5');
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveGeneralConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  return (
    <div className="space-y-6">

      {/* Toast */}
      {saveToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Platform dispatch and commission parameters updated in production.</span>
          </div>
          <button onClick={() => setSaveToast(false)} className="text-emerald-700 hover:text-emerald-950 text-xs">Dismiss</button>
        </div>
      )}

      {/* Sub Header Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSection('careplans')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'careplans'
              ? 'bg-[#0E3F37] text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CarePlans Warranty CMS</span>
        </button>

        <button
          onClick={() => setActiveSection('promotions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'promotions'
              ? 'bg-[#0E3F37] text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Coupons & Banners CMS</span>
        </button>

        <button
          onClick={() => setActiveSection('apitester')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'apitester'
              ? 'bg-[#0E3F37] text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Live API & SQLite Console</span>
        </button>

        <button
          onClick={() => setActiveSection('general')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'general'
              ? 'bg-[#0E3F37] text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Dispatch & Commission Rules</span>
        </button>
      </div>

      {/* Embedded Sub-Section */}
      {activeSection === 'careplans' && (
        <CarePlansCMS carePlans={carePlans} onRefresh={onRefreshData} />
      )}

      {activeSection === 'promotions' && (
        <PromotionsCMS isDarkMode={isDarkMode} />
      )}

      {activeSection === 'apitester' && (
        <ApiTesterConsole />
      )}

      {activeSection === 'general' && (
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="mb-5">
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Platform Parameters & Dispatch Engine Settings
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Configure marketplace commission take-rates, radius geofencing, and emergency helplines
            </p>
          </div>

          <form onSubmit={handleSaveGeneralConfig} className="space-y-4 max-w-xl text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Platform Take-Rate Margin (%)
              </label>
              <input
                type="number"
                value={platformFee}
                onChange={e => setPlatformFee(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-teal-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default 18% automatically deducted from domestic service bookings</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                15-Minute Geo-Dispatch Max Radius (Kilometers)
              </label>
              <input
                type="text"
                value={autoDispatchRange}
                onChange={e => setAutoDispatchRange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-teal-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">Helpers within this perimeter receive instant sound alert on mobile app</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Emergency SOS Helpline Hotline
              </label>
              <input
                type="text"
                value={sosHotline}
                onChange={e => setSosHotline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-teal-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">Printed on digital ID badges and customer safety passes</p>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Save Configuration
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
