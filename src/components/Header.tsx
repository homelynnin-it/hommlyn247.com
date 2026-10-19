import React, { useState } from 'react';
import {
  Zap,
  MapPin,
  PhoneCall,
  ChevronDown,
  ShieldCheck,
  Users,
  Home,
  Layers,
  Bell,
  Building2,
  Mail,
  User,
  LogOut,
  ChevronRight,
  FileText,
  CalendarCheck,
  Sparkles,
  Lock,
  ArrowLeftRight,
  LogIn,
  Headphones
} from 'lucide-react';
import { AppWindow, UserProfile, LegalDocType } from '../types';
import {
  Radio,
  Calculator,
  MessageCircle,
  ShieldAlert
} from 'lucide-react';

export interface HeaderProps {
  activeWindow: AppWindow;
  setActiveWindow: (win: AppWindow) => void;
  activeClientSubTab?: 'services' | 'bookings' | 'payments' | 'reviews';
  setActiveClientSubTab?: (tab: 'services' | 'bookings' | 'payments' | 'reviews') => void;
  activeBookingsCount: number;
  currentCity: string;
  onCityChange: (city: string) => void;
  onOpenChat: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onOpenEmails?: () => void;
  sentEmailsCount?: number;
  onOpenLegalModal?: (type: LegalDocType) => void;
  onLogout?: () => void;
  onOpenLeadModal?: () => void;
  onOpenEmergencySos?: () => void;
  onOpenCalculator?: () => void;
  onOpenSocietyHub?: () => void;
}

const POPULAR_CITIES = [
  { name: 'Bangalore', areas: 'Koramangala, Indiranagar, HSR, Whitefield, Bellandur' },
  { name: 'Mumbai', areas: 'Powai, Bandra, Andheri West, Thane' },
  { name: 'Delhi NCR', areas: 'Gurgaon Sec 54, Noida Sec 62, South Ex' },
  { name: 'Hyderabad', areas: 'Gachibowli, Madhapur, Jubilee Hills' },
  { name: 'Pune', areas: 'Koregaon Park, Wakad, Viman Nagar' },
];

export const Header: React.FC<HeaderProps> = ({
  activeWindow,
  setActiveWindow,
  activeBookingsCount,
  currentCity,
  onCityChange,
  onOpenChat,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  currentUser,
  onOpenAuth,
  onOpenEmails,
  sentEmailsCount = 0,
  onOpenLegalModal,
  onLogout,
  onOpenLeadModal,
  onOpenEmergencySos,
  onOpenCalculator,
  onOpenSocietyHub
}) => {
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = currentUser;
  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cyan-100/90 shadow-xs">

      {/* Top Banner Notice */}
      <div className="bg-[#0C356A] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-extrabold text-cyan-200 bg-cyan-900/60 px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase border border-cyan-700">
              <Zap className="w-3 h-3 fill-cyan-400 text-cyan-400" />
              15-Min Doorstep Dispatch
            </span>
            <span className="hidden sm:inline text-cyan-100 text-xs font-medium">
              100% Police &amp; Aadhaar Verified Staff • Free Replacement CarePlans
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            {/* Instant WhatsApp Support */}
            <a
              href="https://wa.me/918002474666?text=Hi%20hommlyn247%2C%20I%20need%20domestic%20help%20assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-200 hover:text-white bg-emerald-600/30 hover:bg-emerald-600/50 px-2.5 py-0.5 rounded-md font-bold transition-colors cursor-pointer"
              title="Instant WhatsApp Domestic Help Concierge"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>WhatsApp</span>
            </a>

            {onOpenLeadModal && (
              <button
                onClick={onOpenLeadModal}
                className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors cursor-pointer bg-amber-400/20 hover:bg-amber-400/30 px-2.5 py-0.5 rounded-md font-bold"
                title="Request customized household quote or human callback"
                id="header-top-quote-btn"
              >
                <Headphones className="w-3 h-3 text-amber-300" />
                <span>Request Callback</span>
              </button>
            )}

            {/* Email Outbox Gateway Trigger */}
            {onOpenEmails && (
              <button
                onClick={onOpenEmails}
                className="relative flex items-center gap-1.5 text-cyan-100 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                title="View Sent Order Confirmations & OTP Mails"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden md:inline font-bold">Mail Queue</span>
                {sentEmailsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-black text-[9px]">
                    {sentEmailsCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification Bell */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative flex items-center gap-1 text-cyan-100 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer"
                title="Live Notifications"
              >
                <Bell className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Alerts</span>
                {unreadNotificationsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center -ml-0.5 animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onOpenChat}
              className="flex items-center gap-1 text-cyan-200 hover:text-white transition-colors cursor-pointer bg-white/10 px-2.5 py-0.5 rounded-md"
            >
              <PhoneCall className="w-3 h-3 text-cyan-300" />
              <span>AI Helpline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Clean, Focused: Home & Services + Thin Profile Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">

          {/* Brand Logo & City Picker */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setActiveWindow('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
              title="hommlyn247 Home"
            >
              <img
                src="/logo.png"
                alt="hommlyn247"
                className="h-10 w-auto max-h-11 object-contain rounded-lg group-hover:scale-105 transition-transform"
              />
            </button>

            {/* City Selector */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-200 hover:border-cyan-500 bg-cyan-50/50 hover:bg-cyan-50 text-xs font-medium text-slate-800 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-700" />
                <div className="text-left">
                  <span className="block font-bold text-slate-900 leading-none">{currentCity}</span>
                  <span className="text-[10px] text-cyan-800">15m arrival hub</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {showCityPicker && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Select City Cluster
                  </div>
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        onCityChange(c.name);
                        setShowCityPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                        currentCity === c.name
                          ? 'bg-cyan-50 text-cyan-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-medium text-slate-900">{c.name}</span>
                      <span className="text-[10px] text-slate-500">{c.areas}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Primary Nav: HOME, SERVICES, CARE PLANS */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {/* View 1: Home */}
            <button
              onClick={() => setActiveWindow('home')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeWindow === 'home'
                  ? 'bg-[#0C356A] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4 text-cyan-300" />
              <span>Home</span>
            </button>

            {/* View 2: Services */}
            <button
              onClick={() => setActiveWindow('services')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeWindow === 'services'
                  ? 'bg-[#0C356A] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-300" />
              <span>Services</span>
            </button>

            {/* View 3: Care Plans */}
            <button
              onClick={() => {
                setActiveWindow('home');
                setTimeout(() => {
                  const el = document.getElementById('homeelynn-careplans-section') || document.getElementById('careplans-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 60);
              }}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>Care Plans</span>
            </button>

            {/* View 4: Budget Calculator */}
            <button
              onClick={() => {
                setActiveWindow('home');
                setTimeout(() => {
                  const el = document.getElementById('household-calculator-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 60);
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
              title="Calculate monthly domestic staffing cost"
              id="header-nav-calc-btn"
            >
              <Calculator className="w-4 h-4 text-cyan-700" />
              <span>Budget Calc</span>
            </button>

            {/* View 5: Society Pooling Hub */}
            <button
              onClick={() => {
                setActiveWindow('home');
                setTimeout(() => {
                  const el = document.getElementById('society-pooling-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 60);
              }}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
              title="Gated community group bookings and 15% discount"
              id="header-nav-society-btn"
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Society Hub</span>
            </button>

            {/* Quick My Orders Link if bookings active & user is logged in */}
            {user && activeBookingsCount > 0 && (
              <button
                onClick={() => setActiveWindow('client')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#0C356A] border border-cyan-200 text-xs font-bold transition-colors cursor-pointer"
                title="View Active Bookings"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-cyan-700" />
                <span>Orders</span>
                <span className="w-4 h-4 rounded-full bg-cyan-600 text-white font-mono text-[9px] flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              </button>
            )}
          </nav>

          {/* Sleek Right Section: Quick Admin OS Link + Thin Profile Switcher / Sign In */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Direct Admin OS Button - only for verified admin users */}
            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveWindow('admin')}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeWindow === 'admin'
                    ? 'bg-[#009688] text-white shadow-xs'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200/80'
                }`}
                title="Open Admin OS Console"
              >
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden md:inline">Admin OS</span>
              </button>
            )}

            {/* Quick SOS Trigger in Right Toolbar */}
            {onOpenEmergencySos && (
              <button
                onClick={onOpenEmergencySos}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95"
                title="1-Tap Emergency Rapid SOS Dispatch"
                id="header-right-sos-btn"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">15m SOS</span>
                <span className="sm:hidden">SOS</span>
              </button>
            )}

            {/* Custom Quote Inbound Lead Trigger */}
            {onOpenLeadModal && (
              <button
                onClick={onOpenLeadModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-200 hover:border-cyan-400 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                id="header-quote-inquiry-button"
              >
                <Headphones className="w-3.5 h-3.5 text-cyan-700" />
                <span>Custom Quote</span>
              </button>
            )}

            {/* Thin Profile Switcher or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-cyan-500 bg-slate-50/80 hover:bg-white transition-all cursor-pointer"
                  aria-label="User profile and role switcher"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0C356A] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {userInitials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 leading-tight">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-900 font-bold text-[9px] uppercase tracking-wide">
                        {activeWindow === 'admin' ? 'Admin' : activeWindow === 'provider' ? 'Partner' : 'Resident'}
                      </span>
                    </div>
                    <span className="block text-[10px] text-slate-400">
                      {user.city || currentCity}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

              {/* Profile Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in">
                  {/* User Overview */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-xs text-slate-900">{user.name}</p>
                      <span className="px-1.5 py-0.2 rounded bg-cyan-600 text-white font-bold text-[9px] uppercase">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                    <p className="text-[10px] text-cyan-800 font-semibold mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
                      <span className="truncate">{user.address || 'Koramangala, Bangalore'}</span>
                    </p>
                  </div>

                  {/* Mode & Perspective Switcher */}
                  <div className="space-y-1 py-1 text-xs border-b border-slate-100 pb-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5">
                      Switch Perspective
                    </div>

                    <button
                      onClick={() => {
                        setActiveWindow('client');
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        activeWindow === 'client' ? 'bg-cyan-50 text-cyan-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Resident Client App</span>
                      </div>
                      {activeBookingsCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-cyan-600 text-white font-mono text-[9px]">
                          {activeBookingsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (user.role === 'provider' || user.role === 'admin') {
                          setActiveWindow('provider');
                        } else {
                          onOpenAuth?.();
                        }
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        activeWindow === 'provider' ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                        <span>Service Partner Portal</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (user.role === 'admin') {
                          setActiveWindow('admin');
                        } else {
                          onOpenAuth?.();
                        }
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        activeWindow === 'admin' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Admin Enterprise OS</span>
                      </div>
                      <span className="text-[9px] text-teal-300 font-mono">Dark</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveWindow('simulator');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-amber-50 text-amber-900 transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>3-in-1 Simulator</span>
                      </div>
                    </button>
                  </div>

                  {/* Legal Policies & Help Desk */}
                  <div className="py-1 text-xs border-b border-slate-100">
                    <button
                      onClick={() => {
                        onOpenLegalModal?.('terms');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Terms of Service & SLA</span>
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onOpenLegalModal?.('privacy');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Privacy & Aadhaar Policy</span>
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onOpenLegalModal?.('contact');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                        <span>24/7 Helpline Desk</span>
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>

                  {/* Switch / Sign Out */}
                  <div className="pt-1.5 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        onOpenAuth?.();
                        setShowUserMenu(false);
                      }}
                      className="px-2 py-1 text-cyan-800 hover:text-cyan-900 font-bold hover:bg-cyan-50 rounded-md transition-colors cursor-pointer"
                    >
                      Switch Account
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onLogout) {
                          onLogout();
                        } else {
                          onOpenAuth?.();
                        }
                      }}
                      className="px-2 py-1 text-rose-600 hover:text-rose-700 font-bold hover:bg-rose-50 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0C356A] hover:bg-[#09254a] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              id="header-sign-in-button"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-300" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        </div>
      </div>

    </header>
  );
};
