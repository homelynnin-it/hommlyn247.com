import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  Search,
  CalendarClock,
  User,
  ShieldCheck,
  Users,
  Briefcase,
  Building2,
  ArrowLeftRight,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  PhoneCall,
  FileText,
  Lock,
  RefreshCw,
  LogOut,
  ChevronRight,
  Zap,
  Layers,
  Award,
  LogIn
} from 'lucide-react';
import { AppWindow, UserProfile, ServiceItem, LegalDocType } from '../types';

interface MobileBottomNavProps {
  activeWindow: AppWindow;
  onNavigate: (win: AppWindow) => void;
  activeBookingsCount: number;
  onOpenChat: () => void;
  unreadNotificationsCount?: number;
  currentRole?: 'client' | 'provider' | 'admin';
  onChangeRole?: (role: 'client' | 'provider' | 'admin') => void;
  currentUser?: UserProfile | null;
  services?: ServiceItem[];
  onSelectService?: (service: ServiceItem, mode: 'instant' | 'scheduled') => void;
  onOpenLegalModal?: (type: LegalDocType) => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

const DEFAULT_POPULAR_SERVICES = [
  { id: 'srv-maid-1', title: 'Daily House Maid (Cooking & Mopping)', category: 'maid', price: 499, time: '15 Mins' },
  { id: 'srv-cook-1', title: 'Experienced North & South Indian Cook', category: 'cook', price: 699, time: '15 Mins' },
  { id: 'srv-baby-1', title: 'Certified Infant Babysitter & Nanny', category: 'nanny', price: 799, time: '30 Mins' },
  { id: 'srv-driver-1', title: 'Personal Chauffeur & Daily Driver', category: 'driver', price: 549, time: '15 Mins' },
  { id: 'srv-clean-1', title: 'Full Home Deep Mopping & Kitchen Scrub', category: 'deep_clean', price: 1299, time: '45 Mins' },
  { id: 'srv-elder-1', title: 'Senior Citizen Care & Mobility Support', category: 'eldercare', price: 899, time: '30 Mins' },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeWindow,
  onNavigate,
  activeBookingsCount,
  onOpenChat,
  unreadNotificationsCount = 0,
  currentRole = 'client',
  onChangeRole,
  currentUser,
  services = [],
  onSelectService,
  onOpenLegalModal,
  onOpenAuth,
  onLogout
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<string>('all');

  const effectiveRole: 'client' | 'provider' | 'admin' =
    activeWindow === 'admin' ? 'admin' :
    activeWindow === 'provider' ? 'provider' :
    (currentUser?.role || currentRole || 'client');

  const handleRoleSelect = (role: 'client' | 'provider' | 'admin') => {
    setIsProfileSheetOpen(false);
    if (role === 'client') {
      if (!currentUser) {
        onOpenAuth?.();
      } else {
        onNavigate('client');
      }
    } else if (role === 'provider') {
      if (currentUser?.role === 'provider' || currentUser?.role === 'admin') {
        onNavigate('provider');
      } else {
        onOpenAuth?.();
      }
    } else if (role === 'admin') {
      if (currentUser?.role === 'admin') {
        onNavigate('admin');
      } else {
        onOpenAuth?.();
      }
    }
  };

  // Filter services for the mobile search drawer
  const displayedServices = (services.length > 0 ? services : DEFAULT_POPULAR_SERVICES as any[]).filter(s => {
    const matchesQuery = searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedSearchCategory === 'all' || s.category === selectedSearchCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <>
      {/* ======================================================== */}
      {/* 1. MOBILE FAST SEARCH DRAWER / MODAL                     */}
      {/* ======================================================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full mx-auto max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">

            {/* Search Header with Input */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0C356A] text-cyan-300 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Search Domestic Staff &amp; Services
                    </h3>
                    <p className="text-[11px] text-slate-500">15-minute guaranteed doorstep dispatch</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search maid, cook, babysitter, driver, deep clean..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-cyan-500 text-slate-900 dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'All Services' },
                  { id: 'maid', label: 'House Maid' },
                  { id: 'cook', label: 'Cook & Chef' },
                  { id: 'nanny', label: 'Babysitter' },
                  { id: 'driver', label: 'Chauffeur' },
                  { id: 'deep_clean', label: 'Deep Clean' },
                  { id: 'eldercare', label: 'Eldercare' }
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedSearchCategory(chip.id)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-bold transition-all cursor-pointer ${
                      selectedSearchCategory === chip.id
                        ? 'bg-[#0C356A] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                <span>Matching Verified Services ({displayedServices.length})</span>
                <span className="text-cyan-700">15m Arrival</span>
              </div>

              {displayedServices.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <p className="font-semibold text-xs">No matching domestic services found.</p>
                  <p className="text-[11px]">Try searching for "maid", "cook", "driver", or "clean".</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSearchCategory('all');
                    }}
                    className="px-3 py-1.5 bg-cyan-50 text-cyan-800 rounded-lg text-xs font-bold"
                  >
                    Reset Search Filter
                  </button>
                </div>
              ) : (
                displayedServices.map((service: any) => (
                  <div
                    key={service.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      if (onSelectService) {
                        onSelectService(service, 'instant');
                      } else {
                        onNavigate('services');
                      }
                    }}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 bg-white dark:bg-slate-800/80 hover:bg-cyan-50/40 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {service.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="capitalize font-bold text-cyan-800 dark:text-cyan-300">
                            {service.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                            <Clock className="w-3 h-3" />
                            15m dispatch
                          </span>
                          <span>•</span>
                          <span>Police Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-xs text-slate-900 dark:text-white block">
                        ₹{service.price || service.pricing?.oneTime || 499}
                      </span>
                      <span className="text-[10px] text-cyan-700 font-bold flex items-center gap-0.5 justify-end">
                        Book <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Search Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <span className="flex items-center gap-1 text-cyan-800 dark:text-cyan-300 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Active in Bangalore, Mumbai, Delhi NCR</span>
              </span>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  onNavigate('services');
                }}
                className="font-bold text-[#0C356A] dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Browse Full Catalog →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MOBILE PROFILE & SWITCHER SHEET                       */}
      {/* ======================================================== */}
      {isProfileSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full mx-auto max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">

            {/* Profile Sheet Header */}
            <div className="p-4 bg-[#0C356A] text-white flex items-center justify-between shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-cyan-300 shadow-sm">
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">{currentUser.name}</h3>
                    <p className="text-[11px] text-cyan-200">{currentUser.phone} • {currentUser.city || 'Bangalore'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-cyan-300 shadow-sm">
                    <User className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">Welcome, Resident</h3>
                    <p className="text-[11px] text-cyan-200">Sign in to manage orders & staff</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsProfileSheetOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700 dark:text-slate-300">

              {/* Perspective Role Switcher */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Switch App Mode
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRoleSelect('client')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      effectiveRole === 'client'
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/20 text-cyan-950 dark:text-cyan-200 font-extrabold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Home className="w-4 h-4 text-cyan-700" />
                    <span className="text-[11px]">Resident</span>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('provider')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      effectiveRole === 'provider'
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/20 text-teal-950 dark:text-teal-200 font-extrabold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-teal-700" />
                    <span className="text-[11px]">Partner Pro</span>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      effectiveRole === 'admin'
                        ? 'bg-slate-900 border-slate-900 text-white font-extrabold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-teal-400" />
                    <span className="text-[11px]">Admin OS</span>
                  </button>
                </div>
              </div>

              {/* Bookings & Invoices Shortcuts */}
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setIsProfileSheetOpen(false);
                    onNavigate('client');
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700/80 flex items-center justify-between font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-cyan-700" />
                    <span>My Bookings &amp; Invoices</span>
                  </span>
                  {activeBookingsCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-600 text-white font-mono text-[10px]">
                      {activeBookingsCount} Active
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsProfileSheetOpen(false);
                    onOpenChat();
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700/80 flex items-center justify-between font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                    <span>24/7 AI &amp; Human Helpline</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">1800-247-HOMM</span>
                </button>
              </div>

              {/* Institutional Policies & Compliance */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Terms, Privacy &amp; Guarantees
                </span>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileSheetOpen(false);
                      onOpenLegalModal?.('terms');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Terms of Service (15-Min Arrival SLA)</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileSheetOpen(false);
                      onOpenLegalModal?.('privacy');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Privacy &amp; Aadhaar KYC Security</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileSheetOpen(false);
                      onOpenLegalModal?.('refund');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Cancellations, Refunds &amp; CarePlans</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileSheetOpen(false);
                      onOpenLegalModal?.('safety');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Domestic Worker Welfare Charter</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Sign In / Sign Out */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsProfileSheetOpen(false);
                    onOpenAuth?.();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  {currentUser ? 'Switch Account' : 'Register Account'}
                </button>

                {currentUser ? (
                  <button
                    onClick={() => {
                      setIsProfileSheetOpen(false);
                      if (onLogout) {
                        onLogout();
                      } else {
                        onOpenAuth?.();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsProfileSheetOpen(false);
                      onOpenAuth?.();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0C356A] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. NATIVE MOBILE APP BOTTOM NAVIGATION BAR               */}
      {/* (Home, Services, Search, Orders, Profile)                */}
      {/* ======================================================== */}
      <nav
        id="mobile-bottom-navigation"
        aria-label="Mobile Bottom App Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.07)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-15 max-w-md mx-auto items-center px-1">

          {/* TAB 1: HOME */}
          <button
            id="mobile-nav-home"
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center justify-center py-1 px-1 transition-all rounded-xl cursor-pointer ${
              activeWindow === 'home'
                ? 'text-[#0C356A] font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-full transition-transform ${activeWindow === 'home' ? 'scale-110 bg-cyan-50' : ''}`}>
              <Home className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Home</span>
          </button>

          {/* TAB 2: SERVICES */}
          <button
            id="mobile-nav-services"
            onClick={() => onNavigate('services')}
            className={`flex flex-col items-center justify-center py-1 px-1 transition-all rounded-xl cursor-pointer ${
              activeWindow === 'services'
                ? 'text-[#0C356A] font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-full transition-transform ${activeWindow === 'services' ? 'scale-110 bg-cyan-50' : ''}`}>
              <Layers className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Services</span>
          </button>

          {/* TAB 3: SEARCH (POPUP FAST DRAWER) */}
          <button
            id="mobile-nav-search"
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-1 transition-all rounded-xl cursor-pointer text-slate-500 hover:text-cyan-800"
          >
            <div className="p-1 rounded-full bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 transition-colors">
              <Search className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-bold">Search</span>
          </button>

          {/* TAB 4: ORDERS / BOOKINGS */}
          <button
            id="mobile-nav-orders"
            onClick={() => onNavigate('client')}
            className={`flex flex-col items-center justify-center py-1 px-1 transition-all rounded-xl cursor-pointer relative ${
              activeWindow === 'client'
                ? 'text-[#0C356A] font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`relative p-1 rounded-full transition-transform ${activeWindow === 'client' ? 'scale-110 bg-cyan-50' : ''}`}>
              <CalendarClock className="w-4.5 h-4.5" />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-emerald-500 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {activeBookingsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Orders</span>
          </button>

          {/* TAB 5: PROFILE & SWITCHER */}
          <button
            id="mobile-nav-profile"
            onClick={() => setIsProfileSheetOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-1 transition-all rounded-xl cursor-pointer text-slate-500 hover:text-slate-800"
          >
            <div className="relative p-1 rounded-full">
              <User className="w-4.5 h-4.5 text-[#0C356A]" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-600 rounded-full ring-2 ring-white" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-bold">Profile</span>
          </button>

        </div>
      </nav>
    </>
  );
};
