import React, { useState, useMemo } from 'react';
import {
  Users,
  Briefcase,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Search,
  Filter,
  ChevronRight,
  Phone,
  PhoneCall,
  Calendar,
  Download,
  Zap,
  RefreshCw,
  IndianRupee,
  ShieldCheck,
  Star,
  Plus,
  Trash2,
  Edit,
  Eye,
  Layers,
  Building2,
  X,
  FileText,
  Database,
  Mail,
  SlidersHorizontal,
  Server,
  Code2,
  Menu,
  Tag,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  WalletCards,
  UserCheck,
  BarChart3,
  Settings as SettingsIcon,
  LayoutDashboard,
  CalendarCheck2,
  ExternalLink,
  FileSpreadsheet,
  Megaphone,
  Sparkles
} from 'lucide-react';
import {
  Booking,
  ServiceItem,
  Helper,
  PaymentTransaction,
  Review,
  ServiceCategory,
  BookingStatus,
  CarePlan
} from '../types';
import { SegmentReportsModule } from './SegmentReportsModule';
import { EditServiceModal } from './admin/EditServiceModal';
import { EditHelperModal } from './admin/EditHelperModal';
import { CorporateOverview } from './admin/CorporateOverview';
import { OrdersDispatchView } from './admin/OrdersDispatchView';
import { WorkerHRMSView } from './admin/WorkerHRMSView';
import { ServicesCatalogView } from './admin/ServicesCatalogView';
import { CorporateAccountingView } from './admin/CorporateAccountingView';
import { CorporatePaymentsView } from './admin/CorporatePaymentsView';
import { CorporateCustomersView } from './admin/CorporateCustomersView';
import { CorporateSettingsCMS } from './admin/CorporateSettingsCMS';
import { ApiTesterConsole } from './admin/ApiTesterConsole';
import { BrandAdsCMS } from './admin/BrandAdsCMS';
import { PushBroadcastCMS } from './admin/PushBroadcastCMS';
import { PromotionsCMS } from './admin/PromotionsCMS';
import { LeadsTelecallingCMS } from './admin/LeadsTelecallingCMS';
import { SERVICE_PRESET_TEMPLATES } from '../data/servicePresets';

interface AdminDashboardProps {
  bookings: Booking[];
  services: ServiceItem[];
  helpers: Helper[];
  transactions: PaymentTransaction[];
  carePlans?: CarePlan[];
  reviews?: Review[];
  onSelectBookingForTrack: (booking: Booking) => void;
  onOpenInvoice: (booking: Booking) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: any) => void;
  onBookServiceClick: () => void;
  onAddBooking?: (booking: Booking) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onAddHelper?: (helper: Helper) => void;
  onUpdateHelper?: (helper: Helper) => void;
  onDeleteHelper?: (helperId: string) => void;
  onAddService?: (service: ServiceItem) => void;
  onUpdateService?: (service: ServiceItem) => void;
  onDeleteService?: (serviceId: string) => void;
  onToggleFeatureReview?: (reviewId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
  onRefreshData?: () => void;
  onExitAdmin?: () => void;
  initialModule?: string;
}

export type AdminSidebarTab =
  | 'overview'
  | 'leads'
  | 'orders'
  | 'helpers'
  | 'services'
  | 'accounting'
  | 'payments'
  | 'customers'
  | 'brand_ads'
  | 'push_broadcast'
  | 'promotions'
  | 'reports'
  | 'settings'
  | 'database';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  services,
  helpers,
  transactions,
  carePlans = [],
  reviews = [],
  onSelectBookingForTrack,
  onOpenInvoice,
  onUpdateBookingStatus,
  onBookServiceClick,
  onAddBooking,
  onDeleteBooking,
  onAddHelper,
  onUpdateHelper,
  onDeleteHelper,
  onAddService,
  onUpdateService,
  onDeleteService,
  onToggleFeatureReview,
  onDeleteReview,
  onRefreshData,
  onExitAdmin,
  initialModule
}) => {
  const [activeTab, setActiveTab] = useState<AdminSidebarTab>((initialModule as AdminSidebarTab) || 'overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for CRUD
  const [isAddHelperOpen, setIsAddHelperOpen] = useState(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingHelper, setEditingHelper] = useState<Helper | null>(null);

  // New Helper Form
  const [newHelperName, setNewHelperName] = useState('');
  const [newHelperCategory, setNewHelperCategory] = useState<ServiceCategory>('maid');
  const [newHelperPhone, setNewHelperPhone] = useState('');
  const [newHelperRate, setNewHelperRate] = useState('350');
  const [newHelperExp, setNewHelperExp] = useState('4');

  // Manual Booking Form
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualServiceId, setManualServiceId] = useState('');

  // New Service Form
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<ServiceCategory>('maid');
  const [newServicePrice, setNewServicePrice] = useState('449');
  const [newServiceSubtitle, setNewServiceSubtitle] = useState('');
  const [newServiceUnit, setNewServiceUnit] = useState('per visit');
  const [newServiceEta, setNewServiceEta] = useState('12-15 mins');
  const [newServiceBadge, setNewServiceBadge] = useState('15-Min Available');

  const handleCreateHelper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHelperName.trim()) return;

    const newH: Helper = {
      id: `hlp-${Date.now().toString().slice(-4)}`,
      name: newHelperName.trim(),
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      category: newHelperCategory,
      categoryTitle: newHelperCategory.toUpperCase(),
      rating: 5.0,
      completedJobs: 48,
      experienceYears: parseInt(newHelperExp, 10) || 3,
      languages: ['Hindi', 'English'],
      hourlyRate: parseInt(newHelperRate, 10) || 350,
      isAvailable: true,
      policeVerified: true,
      aadharVerified: true,
      trainingCertified: true,
      healthCheckPassed: true,
      phone: newHelperPhone.trim() || '+91 98765 43210',
      location: 'Koramangala, Bangalore',
      currentEtaMinutes: 12,
      bio: 'Verified professional domestic partner trained in residential hygiene standards.'
    };

    try {
      await fetch('/api/helpers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newH)
      });
    } catch (err) {}

    if (onAddHelper) onAddHelper(newH);
    setIsAddHelperOpen(false);
    setNewHelperName('');
    setNewHelperPhone('');
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;

    const newS: ServiceItem = {
      id: `srv-${Date.now().toString().slice(-4)}`,
      title: newServiceTitle.trim(),
      subtitle: newServiceSubtitle.trim() || 'Professional household service with verified staff.',
      category: newServiceCategory,
      basePrice: parseInt(newServicePrice, 10) || 449,
      unit: 'per visit',
      rating: 5.0,
      reviewsCount: 0,
      availableCount: 14,
      iconName: 'Sparkles',
      includedHighlights: ['Police Verified', '15-Min Express Dispatch', 'Equipment Provided'],
      equipmentProvided: true,
      eta: newServiceEta,
      badge: newServiceBadge,
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
      tagline: 'Police & Biometric Verified',
      tasks: [
        { id: 't1', name: 'Core Service Standard Execution', priceDelta: 0 },
        { id: 't2', name: 'Deep Chemical Sanitization', priceDelta: 99 }
      ]
    };

    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newS)
      });
    } catch (err) {}

    if (onAddService) onAddService(newS);
    setIsAddServiceOpen(false);
    setNewServiceTitle('');
    setNewServiceSubtitle('');
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim() || !manualAddress.trim()) return;

    const srv = services.find(s => s.id === manualServiceId) || services[0];
    const availableHelper = helpers.find(h => h.isAvailable) || helpers[0];

    const newB: Booking = {
      id: `HL7-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: srv ? srv.id : 'srv-1',
      serviceTitle: srv ? srv.title : 'Express Domestic Service',
      category: srv ? srv.category : 'maid',
      status: 'assigned',
      bookingType: 'instant',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: 'Now (15 Min Express)',
      durationHours: 1,
      frequency: 'one-time',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: {
        name: manualCustomerName.trim(),
        phone: manualCustomerPhone.trim() || '+91 99887 76655',
        address: manualAddress.trim(),
        houseNumber: 'Flat 402',
        city: 'Bangalore',
        pincode: '560066'
      },
      helper: availableHelper,
      pricing: {
        baseAmount: srv ? srv.basePrice : 449,
        addOnsAmount: 0,
        platformFee: 29,
        taxAmount: Math.round((srv ? srv.basePrice : 449) * 0.18),
        discount: 0,
        total: Math.round((srv ? srv.basePrice : 449) * 1.18) + 29
      },
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      selectedTasks: ['Standard Inspection & Service Execution']
    };

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newB)
      });
    } catch (err) {}

    if (onAddBooking) onAddBooking(newB);
    setIsAddBookingOpen(false);
    setManualCustomerName('');
    setManualAddress('');
  };

  const handleDeleteServiceClick = async (serviceId: string, title: string) => {
    if (window.confirm(`Are you sure you want to retire service "${title}"?`)) {
      try {
        await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
      } catch (err) {}
      if (onDeleteService) onDeleteService(serviceId);
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden ${isDarkMode ? 'bg-[#0B111E] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>

      {/* ========================================================= */}
      {/* CORPORATE SIDEBAR (Deep Emerald #0E3F37 matching image)   */}
      {/* ========================================================= */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0E3F37] text-white flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand Logo & Super Admin Header */}
          <div className="p-5 border-b border-[#16564B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0E3F37] flex items-center justify-center font-black text-sm shadow-md">
                H24
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-wide text-white">hommlyn247</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">Enterprise OS</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-teal-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Corporate Deep Emerald Palette) */}
          <div className="p-3 space-y-1 text-xs">

            {/* 1. Dashboard Overview */}
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-300" />
              <span>Dashboard Overview</span>
            </button>

            {/* 1.5. Leads & Inbound Telecalling CRM */}
            <button
              onClick={() => { setActiveTab('leads'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-teal-300" />
                <span>Leads & Telecalling</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                Inbound
              </span>
            </button>

            {/* 2. Bookings & 15m Dispatch */}
            <button
              onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck2 className="w-4 h-4 text-teal-300" />
                <span>Orders & Dispatch</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-[#144F45] text-[10px] text-teal-200 font-mono">
                {bookings.length}
              </span>
            </button>

            {/* 3. Worker Internal HRMS */}
            <button
              onClick={() => { setActiveTab('helpers'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'helpers'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-teal-300" />
                <span>Worker HRMS</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {helpers.length} Staff
              </span>
            </button>

            {/* 4. Services Catalog */}
            <button
              onClick={() => { setActiveTab('services'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-teal-300" />
                <span>Service Catalog</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-[#144F45] text-[10px] text-teal-200 font-mono">
                {services.length}
              </span>
            </button>

            {/* 5. Multipurpose Automated Accounting */}
            <button
              onClick={() => { setActiveTab('accounting'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'accounting'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-4 h-4 text-teal-300" />
                <span>Automated Accounting</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase">
                P&L / GST
              </span>
            </button>

            {/* 6. Payments & Gateway */}
            <button
              onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <WalletCards className="w-4 h-4 text-teal-300" />
                <span>Payments Ledger</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-[#144F45] text-[10px] text-teal-200 font-mono">
                {transactions.length}
              </span>
            </button>

            {/* 7. Customers & Moderation */}
            <button
              onClick={() => { setActiveTab('customers'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <UserCheck className="w-4 h-4 text-teal-300" />
              <span>Residents & CRM</span>
            </button>

            {/* 8. Brand Partner Ads & Monetization */}
            <button
              onClick={() => { setActiveTab('brand_ads'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'brand_ads'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4 text-teal-300" />
                <span>Brand Partner Ads</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold uppercase">
                Sponsors
              </span>
            </button>

            {/* 9. Push Notification Broadcasts */}
            <button
              onClick={() => { setActiveTab('push_broadcast'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'push_broadcast'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-teal-300" />
                <span>Push Broadcasts</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-[9px] font-bold uppercase">
                Live
              </span>
            </button>

            {/* 10. Promotions & Coupons CMS */}
            <button
              onClick={() => { setActiveTab('promotions'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'promotions'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <Tag className="w-4 h-4 text-teal-300" />
              <span>Promos & Coupons</span>
            </button>

            {/* 11. Corporate Analytics Reports */}
            <button
              onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-300" />
              <span>Analytics & Reports</span>
            </button>

            {/* 9. Platform CMS & Settings */}
            <button
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <SettingsIcon className="w-4 h-4 text-teal-300" />
              <span>Platform Settings CMS</span>
            </button>

            {/* 10. Live API & Diagnostics */}
            <button
              onClick={() => { setActiveTab('database'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-[#18584E] text-white shadow-xs font-bold border-l-3 border-teal-300'
                  : 'text-teal-100/80 hover:text-white hover:bg-[#144F45]/60'
              }`}
            >
              <Database className="w-4 h-4 text-teal-300" />
              <span>API Diagnostics</span>
            </button>

          </div>
        </div>

        {/* Sidebar Footer with Storefront Link & Admin Profile */}
        <div className="p-4 border-t border-[#16564B] space-y-3">

          {/* Exit to Customer Portal Button */}
          {onExitAdmin && (
            <button
              onClick={onExitAdmin}
              className="w-full py-2 px-3 rounded-xl bg-[#144F45] hover:bg-[#18584E] text-teal-100 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-300" />
              <span>View Customer Storefront</span>
            </button>
          )}

          <div className="flex items-center gap-3 pt-1">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#18584E] text-white flex items-center justify-center font-bold text-xs border border-teal-400/40">
                PS
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0E3F37] absolute bottom-0 right-0" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-white truncate">Prasad Sharma</div>
              <div className="text-[10px] text-teal-200 truncate">Super Admin • HQ Ops</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN ADMIN WORKSPACE                                      */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

        {/* Top Header Control Bar with Search Pill & Profile */}
        <div className={`px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-20 border-b transition-colors shrink-0 ${
          isDarkMode ? 'bg-[#0E1524] border-slate-800 shadow-md shadow-black/20' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          {/* Left: Mobile Menu & Current Tab Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`md:hidden p-2 rounded-xl cursor-pointer ${
                isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <h2 className={`text-base font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'leads' && 'Central Inbound Telecalling & Call Center Cockpit'}
                {activeTab === 'orders' && 'Bookings & 15-Minute Dispatch Control'}
                {activeTab === 'helpers' && 'Domestic Workers Internal HRMS'}
                {activeTab === 'services' && 'Services Catalog & Dynamic Rate Engine'}
                {activeTab === 'accounting' && 'Automated Corporate Accounting & Tax Ledger'}
                {activeTab === 'payments' && 'Payment Gateway Settlements & Escrow'}
                {activeTab === 'customers' && 'Resident CRM Directory & Review Moderation'}
                {activeTab === 'reports' && 'Corporate Performance & Segment Analytics'}
                {activeTab === 'settings' && 'Platform Settings, CarePlans & CMS'}
                {activeTab === 'database' && 'Live SQLite API & Diagnostics Console'}
              </h2>
            </div>
          </div>

          {/* Center: Search Pill Input matching Reference Layout */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search bookings, workers, invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/30 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Right: Notification Center, Theme Switcher & Admin Actions */}
          <div className="flex items-center gap-3">

            {/* System Alerts Bell */}
            <button
              className={`relative p-2 rounded-full cursor-pointer transition-colors ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full border cursor-pointer transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Dark / Light Theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            {/* Admin Profile Pill */}
            <div className={`hidden sm:flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border transition-all ${
              isDarkMode ? 'border-slate-800 bg-slate-900/80 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
            }`}>
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-[#0E3F37] text-teal-200 text-[10px] font-black flex items-center justify-center">
                  PS
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute bottom-0 right-0" />
              </div>
              <span className="text-xs font-bold">Prasad S.</span>
            </div>

            {/* Exit to Storefront Button (if mobile/compact) */}
            {onExitAdmin && (
              <button
                onClick={onExitAdmin}
                className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Return to customer website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
              </button>
            )}
          </div>
        </div>

        {/* Content View Container */}
        <div className="p-4 sm:p-8 space-y-6 flex-1">

          {/* TAB 1: CORPORATE OVERVIEW */}
          {activeTab === 'overview' && (
            <CorporateOverview
              bookings={bookings}
              helpers={helpers}
              services={services}
              reviews={reviews}
              isDarkMode={isDarkMode}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenInvoice={onOpenInvoice}
            />
          )}

          {/* TAB 1.5: LEADS & INBOUND TELECALLING CRM */}
          {activeTab === 'leads' && (
            <LeadsTelecallingCMS
              isDarkMode={isDarkMode}
              helpers={helpers}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onBookingCreated={onAddBooking}
            />
          )}

          {/* TAB 2: ORDERS & DISPATCH CRUD */}
          {activeTab === 'orders' && (
            <OrdersDispatchView
              bookings={bookings}
              helpers={helpers}
              isDarkMode={isDarkMode}
              onUpdateBookingStatus={onUpdateBookingStatus}
              onOpenInvoice={onOpenInvoice}
              onDeleteBooking={(id) => onDeleteBooking && onDeleteBooking(id)}
              onAddBooking={onAddBooking}
              onSelectBookingForTrack={onSelectBookingForTrack}
            />
          )}

          {/* TAB 3: WORKER INTERNAL HRMS */}
          {activeTab === 'helpers' && (
            <WorkerHRMSView
              helpers={helpers}
              bookings={bookings}
              isDarkMode={isDarkMode}
              onAddHelper={(h) => onAddHelper && onAddHelper(h)}
              onUpdateHelper={(h) => onUpdateHelper && onUpdateHelper(h)}
              onDeleteHelper={(id) => onDeleteHelper && onDeleteHelper(id)}
            />
          )}

          {/* TAB 4: SERVICES CATALOG & DYNAMIC RATE ENGINE */}
          {activeTab === 'services' && (
            <ServicesCatalogView
              services={services}
              isDarkMode={isDarkMode}
              onAddServiceClick={() => setIsAddServiceOpen(true)}
              onEditServiceClick={(s) => setEditingService(s)}
              onDeleteServiceClick={handleDeleteServiceClick}
            />
          )}

          {/* TAB 5: MULTIPURPOSE AUTOMATED ACCOUNTING */}
          {activeTab === 'accounting' && (
            <CorporateAccountingView
              bookings={bookings}
              transactions={transactions}
              isDarkMode={isDarkMode}
              onOpenInvoice={onOpenInvoice}
            />
          )}

          {/* TAB 6: PAYMENTS & FINANCIAL SETTLEMENTS */}
          {activeTab === 'payments' && (
            <CorporatePaymentsView
              transactions={transactions}
              bookings={bookings}
              isDarkMode={isDarkMode}
              onOpenInvoice={onOpenInvoice}
            />
          )}

          {/* TAB 7: CUSTOMERS & FEEDBACK DIRECTORY */}
          {activeTab === 'customers' && (
            <CorporateCustomersView
              bookings={bookings}
              reviews={reviews}
              isDarkMode={isDarkMode}
              onToggleFeatureReview={(id) => onToggleFeatureReview && onToggleFeatureReview(id)}
              onDeleteReview={(id) => onDeleteReview && onDeleteReview(id)}
            />
          )}

          {/* TAB 8: BRAND PARTNER ADVERTISING & MONETIZATION */}
          {activeTab === 'brand_ads' && (
            <BrandAdsCMS isDarkMode={isDarkMode} />
          )}

          {/* TAB 9: PUSH BROADCAST NOTIFICATIONS */}
          {activeTab === 'push_broadcast' && (
            <PushBroadcastCMS isDarkMode={isDarkMode} />
          )}

          {/* TAB 10: PROMOTIONS, CAREPLANS & COUPONS */}
          {activeTab === 'promotions' && (
            <PromotionsCMS />
          )}

          {/* TAB 11: SEGMENT AUDIT & ANALYTICS REPORTS */}
          {activeTab === 'reports' && (
            <SegmentReportsModule
              bookings={bookings}
              services={services}
              helpers={helpers}
              transactions={transactions}
            />
          )}

          {/* TAB 9: SETTINGS & PLATFORM CMS */}
          {activeTab === 'settings' && (
            <CorporateSettingsCMS
              carePlans={carePlans}
              isDarkMode={isDarkMode}
              onRefreshData={onRefreshData}
            />
          )}

          {/* TAB 10: DATABASE & LIVE API CONSOLE */}
          {activeTab === 'database' && (
            <ApiTesterConsole />
          )}

        </div>

      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <EditServiceModal
          service={editingService}
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onSave={(updated) => {
            if (onUpdateService) onUpdateService(updated);
            setEditingService(null);
          }}
        />
      )}

      {/* Edit Helper Modal */}
      {editingHelper && (
        <EditHelperModal
          helper={editingHelper}
          isOpen={!!editingHelper}
          onClose={() => setEditingHelper(null)}
          onSave={(updated) => {
            if (onUpdateHelper) onUpdateHelper(updated);
            setEditingHelper(null);
          }}
        />
      )}

      {/* Add Service Modal */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Add New Domestic Service Segment</h3>
                <p className="text-[11px] text-slate-500">Create custom service or use 1-click verified catalog templates</p>
              </div>
              <button onClick={() => setIsAddServiceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1-Click Smart Presets */}
            <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-teal-800 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>1-Click Preset Templates (Auto-fills title, category, price & scope)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SERVICE_PRESET_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setNewServiceTitle(tpl.title);
                      setNewServiceCategory(tpl.category as ServiceCategory);
                      setNewServicePrice(tpl.basePrice.toString());
                      setNewServiceSubtitle(tpl.subtitle);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white border border-teal-200 text-teal-900 hover:bg-teal-700 hover:text-white transition-all shadow-2xs"
                  >
                    + {tpl.title} (₹{tpl.basePrice})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newServiceTitle}
                  onChange={e => setNewServiceTitle(e.target.value)}
                  placeholder="e.g., House Maid & Floor Scrubbing"
                  className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newServiceCategory}
                    onChange={e => setNewServiceCategory(e.target.value as ServiceCategory)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="maid">Maid</option>
                    <option value="cook">Cook</option>
                    <option value="nanny">Babysitter</option>
                    <option value="driver">Driver</option>
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={e => setNewServicePrice(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtitle / Scope</label>
                <input
                  type="text"
                  value={newServiceSubtitle}
                  onChange={e => setNewServiceSubtitle(e.target.value)}
                  placeholder="e.g., Spotless sweeping, mopping and trash removal"
                  className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Helper Modal */}
      {isAddHelperOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Onboard Domestic Worker Pro</h3>
              <button onClick={() => setIsAddHelperOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateHelper} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newHelperName}
                  onChange={e => setNewHelperName(e.target.value)}
                  placeholder="e.g., Sunita Devi"
                  className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Skill</label>
                  <select
                    value={newHelperCategory}
                    onChange={e => setNewHelperCategory(e.target.value as ServiceCategory)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="maid">House Maid</option>
                    <option value="cook">Home Cook</option>
                    <option value="nanny">Babysitter</option>
                    <option value="driver">Driver</option>
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newHelperPhone}
                    onChange={e => setNewHelperPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hourly Base Rate (₹)</label>
                  <input
                    type="number"
                    value={newHelperRate}
                    onChange={e => setNewHelperRate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={newHelperExp}
                    onChange={e => setNewHelperExp(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddHelperOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
                >
                  Onboard & Clear KYC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Booking Creation Modal */}
      {isAddBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Manual Dispatch & Order Entry</h3>
              <button onClick={() => setIsAddBookingOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBooking} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Resident / Customer Name</label>
                <input
                  type="text"
                  required
                  value={manualCustomerName}
                  onChange={e => setManualCustomerName(e.target.value)}
                  placeholder="e.g., Rohit Malhotra"
                  className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={manualCustomerPhone}
                    onChange={e => setManualCustomerPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Type</label>
                  <select
                    value={manualServiceId}
                    onChange={e => setManualServiceId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.title} (₹{s.basePrice})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Society & Flat Address</label>
                <input
                  type="text"
                  required
                  value={manualAddress}
                  onChange={e => setManualAddress(e.target.value)}
                  placeholder="e.g., Flat 402, Prestige Shantiniketan, Whitefield"
                  className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddBookingOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
                >
                  Dispatch 15m Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
