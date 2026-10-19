import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServiceCatalog } from './components/ServiceCatalog';
import { CarePlansSection } from './components/CarePlansSection';
import { BookingModal } from './components/BookingModal';
import { LiveTracker } from './components/LiveTracker';
import { PaymentDashboard } from './components/PaymentDashboard';
import { PartnerPortal } from './components/PartnerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { MultiWindowSimulator } from './components/MultiWindowSimulator';
import { ChatSupport } from './components/ChatSupport';
import { InvoiceModal } from './components/InvoiceModal';
import { NotificationCenter, playNotificationChime } from './components/NotificationCenter';
import { ReviewModal } from './components/ReviewModal';
import { TestimonialsSection, INITIAL_TESTIMONIALS } from './components/TestimonialsSection';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { SegmentedServicesPage } from './components/SegmentedServicesPage';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LegalModals } from './components/LegalModals';
import { EmailViewerModal } from './components/EmailViewerModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { BrandPartnerBanner } from './components/BrandPartnerBanner';
import { ReadyMadeTemplatesSection } from './components/ReadyMadeTemplatesSection';
import { LeadInquiryModal } from './components/LeadInquiryModal';
import { HouseholdCostCalculator } from './components/HouseholdCostCalculator';
import { EmergencySosModal } from './components/EmergencySosModal';
import { HelperVerificationModal } from './components/HelperVerificationModal';
import { SocietyPoolingSection } from './components/SocietyPoolingSection';
import {
  ServiceItem,
  Helper,
  Booking,
  PaymentTransaction,
  ServiceCategory,
  BookingStatus,
  CarePlan,
  AppWindow,
  Review,
  AppNotification,
  UserProfile,
  SentEmail,
  LegalDocType,
  PackageDurationType,
  ShiftMode,
  ReadyMadeTemplate
} from './types';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
  Sparkles,
  Users,
  UserCheck,
  User,
  Building2,
  Star,
  Layers,
  Home,
  MessageSquare,
  ArrowRight,
  Bell
} from 'lucide-react';

export default function App() {
  // Master Window Switcher (defaults to 'home' or 'admin' per user choice)
  const [activeWindow, setActiveWindow] = useState<AppWindow>('home');
  const [clientSubTab, setClientSubTab] = useState<'services' | 'bookings' | 'payments' | 'reviews'>('services');

  // Check URL pathname or hash for /admin on initial load & history navigation
  useEffect(() => {
    const handleUrlRouting = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin') {
        setActiveWindow('admin');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  // Synchronize browser address bar with window navigation
  const handleNavigateWindow = (win: AppWindow) => {
    if (win === 'admin' && currentUser?.role !== 'admin') {
      addAppNotification('🛡️ Admin Sign In Required', 'Please sign in with your administrator credentials to access Admin OS.', 'system');
      setIsAuthModalOpen(true);
      return;
    }
    if (win === 'provider' && currentUser?.role !== 'provider' && currentUser?.role !== 'admin') {
      addAppNotification('👷 Partner Pro Sign In Required', 'Please sign in with your service partner account to access Partner Portal.', 'system');
      setIsAuthModalOpen(true);
      return;
    }
    if (win === 'client' && !currentUser) {
      addAppNotification('🔐 Resident Sign In Required', 'Please sign in or register to view active bookings, live radar, and invoices.', 'system');
      setIsAuthModalOpen(true);
      return;
    }

    setActiveWindow(win);
    if (typeof window !== 'undefined' && window.history) {
      if (win === 'admin') {
        window.history.pushState({ window: 'admin' }, '', '/admin');
      } else if (window.location.pathname === '/admin') {
        window.history.pushState({ window: win }, '', '/');
      }
    }
  };

  // Core Data Collections
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  // Customer Reviews Collection
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-101',
      bookingId: 'HL7-4821',
      helperId: 'hlp-101',
      helperName: 'Sunita Devi',
      customerName: 'Priya Sharma',
      customerCity: 'Bangalore',
      serviceTitle: 'House Maid & Deep Mopping',
      category: 'maid',
      rating: 5,
      comment: 'Sunita arrived in 11 minutes at Koramangala. Cleaned 3BHK floors spotless and sanitized kitchen counters!',
      tags: ['⚡ Super Punctual (15 Min Arrival)', '✨ Spotless & Deep Cleaning'],
      createdAt: '2026-03-05T09:30:00Z',
      verifiedBooking: true,
      isFeaturedHomepage: true
    },
    {
      id: 'rev-102',
      bookingId: 'HL7-2910',
      helperId: 'hlp-102',
      helperName: 'Ramesh Kumar',
      customerName: 'Ankit & Sneha Verma',
      customerCity: 'Mumbai',
      serviceTitle: 'Home Cook & Chef (Family Dinner)',
      category: 'cook',
      rating: 5,
      comment: 'Ramesh cooked piping hot phulkas and fresh dal tadka. Clean apron, low oil, and delicious homemade taste.',
      tags: ['🍲 Delicious Home Cooked Taste', '🧼 Hygienic (Clean Apron & Gloves)'],
      createdAt: '2026-03-04T19:45:00Z',
      verifiedBooking: true,
      isFeaturedHomepage: true
    },
    {
      id: 'rev-103',
      bookingId: 'HL7-8832',
      helperId: 'hlp-103',
      helperName: 'Meena Kumari',
      customerName: 'Dr. Kavita Menon',
      customerCity: 'Delhi NCR',
      serviceTitle: 'Infant Childcare & Babysitter',
      category: 'nanny',
      rating: 5,
      comment: 'Handled our 2-year old toddler with immense warmth and care. Background check certificate provided total peace of mind.',
      tags: ['🛡️ Verified & Trusted Behavior', '💯 Exceeded Expectations'],
      createdAt: '2026-03-03T14:15:00Z',
      verifiedBooking: true,
      isFeaturedHomepage: true
    }
  ]);

  // Push Notifications Queue
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      target: 'client',
      title: '⚡ 15-Minute Domestic Dispatch Active',
      message: 'Sunita Devi is approaching your location on bike (ETA: 7 mins). Start-Job OTP: 4821.',
      type: 'dispatch',
      timestamp: '2 mins ago',
      read: false,
      bookingId: 'HL7-4821'
    },
    {
      id: 'notif-2',
      target: 'client',
      title: '🔑 Start-Job Security OTP: 4821',
      message: 'Share OTP 4821 with your domestic partner only at your doorstep to begin timer.',
      type: 'otp',
      timestamp: '5 mins ago',
      read: false,
      bookingId: 'HL7-4821'
    },
    {
      id: 'notif-3',
      target: 'client',
      title: '💳 Payment Received & Settled',
      message: '₹470 settled via UPI Instant. Tax invoice receipt is ready for download.',
      type: 'payment',
      timestamp: '1 hour ago',
      read: true,
      bookingId: 'HL7-4821'
    }
  ]);

  // Modals & Panels
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [bookingMode, setBookingMode] = useState<'instant' | 'scheduled'>('instant');
  const [bookingPackageType, setBookingPackageType] = useState<PackageDurationType>('hourly');
  const [bookingShiftMode, setBookingShiftMode] = useState<ShiftMode | undefined>(undefined);
  const [bookingTemplateName, setBookingTemplateName] = useState<string | undefined>(undefined);
  const [bookingInitialTasks, setBookingInitialTasks] = useState<string[] | undefined>(undefined);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);
  const [showBookingLaunchingSoon, setShowBookingLaunchingSoon] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isLeadInquiryModalOpen, setIsLeadInquiryModalOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalDocType>(null);
  const [isEmergencySosOpen, setIsEmergencySosOpen] = useState(false);
  const [selectedHelperForDossier, setSelectedHelperForDossier] = useState<Helper | null>(null);

  // Authenticated Resident Profile - defaults to null until user signs in or restores session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Outgoing Transactional Notifications / Emails Simulator
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([
    {
      id: 'em-1',
      to: 'prasad.sharma@hommlyn247.com',
      recipientName: 'Prasad Sharma',
      subject: 'Order Confirmed: House Maid & Cleaning (HL7-4821)',
      previewText: 'Your domestic helper Sunita Devi is dispatched. Start OTP is 4821.',
      timestamp: '10 mins ago',
      type: 'order_confirmation',
      bookingId: 'HL7-4821',
      htmlContent: `<div style="font-family: sans-serif; padding: 16px;">
        <h2 style="color: #0C356A;">Order Confirmed - hommlyn247</h2>
        <p>Dear <strong>Prasad Sharma</strong>,</p>
        <p>Thank you for choosing <strong>hommlyn247</strong>. Your service professional <strong>Sunita Devi</strong> has been dispatched.</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; margin: 12px 0;">
          <p style="margin: 0; font-weight: bold; color: #166534;">Doorstep Start-Job Security OTP: <span style="font-size: 20px; letter-spacing: 2px;">4821</span></p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #15803d;">Share this OTP only when your verified domestic professional arrives at your doorstep.</p>
        </div>
        <p><strong>Service:</strong> House Maid & Deep Mopping</p>
        <p><strong>Location:</strong> Flat 402, Prestige Ferns, Koramangala</p>
        <p style="color: #64748b; font-size: 12px;">24/7 Helpline: 1800-247-HOMM • hommlyn247 Technologies Pvt Ltd</p>
      </div>`
    }
  ]);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCity, setCurrentCity] = useState('Bangalore');

  // Push notification helper with chime audio
  const addAppNotification = (
    title: string,
    message: string,
    type: AppNotification['type'],
    bookingId?: string,
    target: AppNotification['target'] = 'all'
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      target,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      bookingId
    };
    setNotifications(prev => [newNotif, ...prev]);
    playNotificationChime();

    // Trigger native browser notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
      } catch (e) {}
    }
  };

  // Initial Data Fetching managed quietly internally
  const fetchAllData = async () => {
    try {
      const [srvRes, hlpRes, bkgRes, txnRes, plansRes, revRes] = await Promise.all([
        fetch('/api/services').catch(() => null),
        fetch('/api/helpers').catch(() => null),
        fetch('/api/bookings').catch(() => null),
        fetch('/api/payments/transactions').catch(() => null),
        fetch('/api/careplans').catch(() => null),
        fetch('/api/reviews').catch(() => null)
      ]);

      if (srvRes && srvRes.ok) setServices(await srvRes.json());
      if (hlpRes && hlpRes.ok) setHelpers(await hlpRes.json());
      if (bkgRes && bkgRes.ok) setBookings(await bkgRes.json());
      if (txnRes && txnRes.ok) setTransactions(await txnRes.json());
      if (plansRes && plansRes.ok) setCarePlans(await plansRes.json());
      if (revRes && revRes.ok) {
        const fetchedReviews = await revRes.json();
        if (Array.isArray(fetchedReviews) && fetchedReviews.length > 0) {
          setReviews(fetchedReviews);
        }
      }

      // Restore authenticated session if valid
      try {
        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.authenticated && authData.user) {
            setCurrentUser(authData.user);
          }
        }
      } catch (authErr) {
        console.warn('Session verification notice:', authErr);
      }
    } catch (err) {
      console.warn('Initial data load notice:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API notice:', e);
    }
    setCurrentUser({
      id: 'usr-guest',
      name: 'Resident Customer',
      email: '',
      phone: '',
      address: '',
      city: currentCity,
      pincode: '',
      role: 'client',
      joinedDate: new Date().toISOString().split('T')[0]
    });
    handleNavigateWindow('home');
    addAppNotification('👋 Signed Out', 'You have been safely signed out of your account.', 'system');
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Open booking modal - restricted for public showcase launch
  const handleSelectService = (
    service: ServiceItem,
    mode: 'instant' | 'scheduled',
    initialPackage?: PackageDurationType,
    shiftMode?: ShiftMode,
    templateName?: string,
    initialTasks?: string[]
  ) => {
    // Public showcase: bookings not yet available to unauthenticated users
    if (!currentUser) {
      setShowBookingLaunchingSoon(true);
      setTimeout(() => setShowBookingLaunchingSoon(false), 4000);
      return;
    }
    // Authenticated users (admin, partner, client) can proceed
    setSelectedServiceForBooking(service);
    setBookingMode(mode);
    setBookingPackageType(initialPackage || (mode === 'instant' ? 'hourly' : 'daily'));
    setBookingShiftMode(shiftMode);
    setBookingTemplateName(templateName);
    setBookingInitialTasks(initialTasks);
  };

  // Open booking modal pre-configured with Ready-Made Template - gated for public showcase
  const handleSelectTemplate = (template: ReadyMadeTemplate) => {
    if (!currentUser) {
      setShowBookingLaunchingSoon(true);
      setTimeout(() => setShowBookingLaunchingSoon(false), 4000);
      return;
    }
    const matchedService = services.find(s => s.id === template.serviceId) ||
      services.find(s => s.category === template.category) ||
      services[0];

    if (matchedService) {
      handleSelectService(
        matchedService,
        template.recommendedPackage === 'hourly' ? 'instant' : 'scheduled',
        template.recommendedPackage,
        template.shiftMode,
        template.title,
        template.defaultTasks
      );
    }
  };

  // Quick book shortcuts - disabled for public showcase launch
  const handleQuickBookMaid = () => {
    setShowBookingLaunchingSoon(true);
    setTimeout(() => setShowBookingLaunchingSoon(false), 4000);
  };

  const handleQuickBookCook = () => {
    setShowBookingLaunchingSoon(true);
    setTimeout(() => setShowBookingLaunchingSoon(false), 4000);
  };

  // Handle CarePlan selection - gated for public showcase
  const handleSelectCarePlan = (plan: CarePlan) => {
    if (!currentUser) {
      setShowBookingLaunchingSoon(true);
      setTimeout(() => setShowBookingLaunchingSoon(false), 4000);
      return;
    }
    const matchingService = services.find(s => s.category === plan.category) || services[0];
    if (matchingService) {
      handleSelectService(matchingService, 'scheduled');
    }
  };

  // 1-Tap SOS Emergency Dispatch Handler - gated for public showcase (requires auth)
  const handleTriggerSosBooking = (sosBooking: Booking) => {
    if (!currentUser) {
      setShowBookingLaunchingSoon(true);
      setTimeout(() => setShowBookingLaunchingSoon(false), 4000);
      return;
    }
    setBookings(prev => [sosBooking, ...prev]);
    playNotificationChime();
    addAppNotification(
      '🚨 15-Minute Domestic Emergency Dispatched!',
      `Technician ${sosBooking.helper?.name || 'Pro'} is en-route on two-wheeler. Doorstep OTP: ${sosBooking.otp}.`,
      'order',
      sosBooking.id,
      'client'
    );
    // Persist to backend
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sosBooking)
    }).catch(err => console.warn('SOS booking backend sync:', err));
  };

  // Custom Household Staffing Bundle Booking Handler - gated for public showcase
  const handleBookCustomBundle = (config: {
    category: ServiceCategory;
    title: string;
    monthlyPrice: number;
    shiftMode: ShiftMode;
    tasks: string[];
    apartmentSize: string;
    servicesSelected: string[];
  }) => {
    if (!currentUser) {
      setShowBookingLaunchingSoon(true);
      setTimeout(() => setShowBookingLaunchingSoon(false), 4000);
      return;
    }
    const matchedService = services.find(s => s.category === config.category) || services[0];
    if (matchedService) {
      handleSelectService(
        matchedService,
        'scheduled',
        'monthly',
        config.shiftMode,
        config.title,
        config.tasks
      );
    }
  };

  // Gated Society Pool Join Handler - gated for public showcase
  const handleJoinSocietyPool = (pool: any) => {
    if (!currentUser) {
      setShowBookingLaunchingSoon(true);
      setTimeout(() => setShowBookingLaunchingSoon(false), 4000);
      return;
    }
    const matchedService = services.find(s => s.id === pool.serviceId || s.category === pool.category) || services[0];
    if (matchedService) {
      handleSelectService(
        matchedService,
        'scheduled',
        'monthly',
        'dual',
        `${pool.societyName} - ${pool.tower} (15% Society Pool Discount)`
      );
      addAppNotification(
        '🏢 Society Pool Applied',
        `Joined ${pool.societyName} pool. 15% community discount enabled!`,
        'order'
      );
    }
  };

  // On successful booking checkout
  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setSelectedServiceForBooking(null);
    handleNavigateWindow('client');
    setClientSubTab('bookings');

    // Create and dispatch transactional order confirmation email
    const recipientEmail = currentUser.email || 'prasad.sharma@hommlyn247.com';
    const recipientName = newBooking.customer?.name || currentUser.name;
    const confirmationEmail: SentEmail = {
      id: `em-${Date.now()}`,
      to: recipientEmail,
      recipientName,
      subject: `Order Confirmed: ${newBooking.serviceTitle} (#${newBooking.id})`,
      previewText: `Your domestic professional is dispatched. Doorstep Start OTP: ${newBooking.otp}.`,
      timestamp: 'Just now',
      type: 'order_confirmation',
      bookingId: newBooking.id,
      htmlContent: `<div style="font-family: sans-serif; padding: 16px; color: #1e293b;">
        <h2 style="color: #0C356A; margin-bottom: 8px;">hommlyn247 — Order Confirmed</h2>
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Thank you for choosing <strong>hommlyn247</strong>. Your service order <strong>#${newBooking.id}</strong> is active and assigned.</p>
        <div style="background: #ecfdf5; border: 1.5px solid #10b981; padding: 14px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 0; font-weight: bold; color: #065f46; font-size: 14px;">Doorstep Start-Job Security OTP: <span style="font-size: 24px; font-mono; letter-spacing: 3px; color: #047857;">${newBooking.otp}</span></p>
          <p style="margin: 6px 0 0 0; font-size: 11px; color: #065f46;">Verify this OTP with your helper only at your doorstep to initiate the timer.</p>
        </div>
        <p><strong>Service:</strong> ${newBooking.serviceTitle}</p>
        <p><strong>Helper Assigned:</strong> ${newBooking.helper?.name || 'Rapid Response Pro'}</p>
        <p><strong>Total Amount:</strong> ₹${newBooking.pricing?.total || 449} (GST Compliant)</p>
        <p><strong>Service Address:</strong> ${newBooking.customer?.address || currentUser.address}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="color: #64748b; font-size: 11px;">24/7 Helpline: 1800-247-HOMM • hommlyn247 Technologies Pvt Ltd</p>
      </div>`
    };

    setSentEmails(prev => [confirmationEmail, ...prev]);

    // Send to backend mailing API
    fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(confirmationEmail)
    }).catch(err => console.warn('Email API dispatch notice:', err));

    // Notify user & trigger chime
    addAppNotification(
      '🎉 Order Dispatched Successfully!',
      `Order #${newBooking.id} for ${newBooking.serviceTitle} confirmed. Confirmation mail sent to ${recipientEmail}. Start OTP: ${newBooking.otp}.`,
      'order',
      newBooking.id,
      'client'
    );
  };

  // Status update
  const handleUpdateStatus = async (bookingId: string, status: BookingStatus, otp?: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, otp })
      });

      let updatedBooking: Booking;
      if (res.ok) {
        updatedBooking = await res.json();
      } else {
        // Fallback update in state
        const existing = bookings.find(b => b.id === bookingId);
        if (!existing) return;
        updatedBooking = { ...existing, status };
      }

      setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));

      // Push contextual notification for status transitions
      if (status === 'assigned') {
        addAppNotification('👤 Partner Assigned', `${updatedBooking.helper?.name || 'Helper'} has accepted Order #${bookingId}. Getting ready for dispatch.`, 'dispatch', bookingId);
      } else if (status === 'en_route') {
        addAppNotification('🛵 Partner En Route', `${updatedBooking.helper?.name || 'Partner'} is approaching your location. Keep Start OTP ${updatedBooking.otp} ready.`, 'dispatch', bookingId);
      } else if (status === 'arrived') {
        addAppNotification('📍 Partner Arrived at Doorstep', `${updatedBooking.helper?.name || 'Partner'} is at your gate. Provide OTP ${updatedBooking.otp} to commence service.`, 'otp', bookingId);
      } else if (status === 'completed') {
        addAppNotification('✅ Service Finished', `Order #${bookingId} has been completed! Please rate and review your helper.`, 'review', bookingId);
      }

      // If completed, ensure transaction exists
      if (status === 'completed') {
        const existingTxn = transactions.find(t => t.bookingId === bookingId);
        if (!existingTxn) {
          const newTxn: PaymentTransaction = {
            id: `txn-${Date.now()}`,
            bookingId: updatedBooking.id,
            amount: updatedBooking.pricing?.total || 449,
            currency: 'INR',
            method: 'upi',
            referenceId: `UPI-REF-${Date.now()}`,
            status: 'success',
            timestamp: new Date().toISOString(),
            customerName: updatedBooking.customer?.name || 'Customer',
            serviceTitle: updatedBooking.serviceTitle
          };
          setTransactions(prev => [newTxn, ...prev]);
        }
      }
    } catch (e) {
      console.warn('Status update sync:', e);
    }
  };

  // Payment Success Handler
  const handlePaymentSuccess = (txn: PaymentTransaction) => {
    setTransactions(prev => [txn, ...prev]);
    setBookings(prev => prev.map(b => b.id === txn.bookingId ? { ...b, paymentStatus: 'paid' } : b));
    addAppNotification(
      '💳 Payment Settled Successfully',
      `₹${txn.amount} received via ${txn.method.toUpperCase()} (Ref: ${txn.referenceId}). GST invoice generated.`,
      'payment',
      txn.bookingId
    );
  };

  // Review Submission Handler
  const handleReviewSubmit = async (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
    // Also attach review to booking
    setBookings(prev => prev.map(b => b.id === newReview.bookingId ? {
      ...b,
      userRating: newReview.rating,
      userReview: newReview.comment
    } : b));

    addAppNotification(
      '⭐ Review Published',
      `Thank you for rating ${newReview.helperName} (${newReview.rating}★). Your review is now visible to society neighbors!`,
      'review',
      newReview.bookingId
    );

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify(newReview)
      });
    } catch (e) {
      console.warn('API review notice:', e);
    }
  };

  // Quick 1-Click Simulation Trigger
  const handleQuickSimulateBooking = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `HL7-${randomNum}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const helper = helpers[0] || {
      id: 'hlp-101',
      name: 'Sunita Devi',
      category: 'maid',
      categoryTitle: 'House Maid & Cleaning',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      rating: 4.9,
      completedJobs: 342,
      experienceYears: 5,
      languages: ['Hindi', 'Kannada', 'English'],
      hourlyRate: 350,
      isAvailable: true,
      policeVerified: true,
      aadharVerified: true,
      trainingCertified: true,
      healthCheckPassed: true,
      location: 'Koramangala, Bangalore',
      currentEtaMinutes: 12,
      bio: 'Expert housekeeper and deep cleaner.',
      phone: '+91 98765 43210'
    };

    const newBooking: Booking = {
      id: newId,
      serviceId: 'srv-maid-instant',
      category: 'maid',
      serviceTitle: 'On-Demand Domestic Maid (Deep Housekeeping)',
      bookingType: 'instant',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: '15 Mins Instant Arrival',
      durationHours: 2,
      frequency: 'one-time',
      selectedTasks: ['Dusting', 'Deep Mopping', 'Vessel Wash'],
      customer: {
        name: 'Rajesh Malhotra',
        phone: '+91 98765 11223',
        houseNumber: 'Flat 402',
        address: 'Prestige Ferns, Koramangala 4th Block',
        city: currentCity,
        pincode: '560034'
      },
      helper: helper,
      status: 'pending',
      otp: randomOtp,
      paymentStatus: 'pending',
      paymentMethod: 'upi',
      pricing: {
        baseAmount: 449,
        addOnsAmount: 0,
        platformFee: 49,
        taxAmount: 72,
        discount: 100,
        total: 470
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: 'Please arrive via Gate 2 security.'
    };

    setBookings(prev => [newBooking, ...prev]);

    addAppNotification(
      '⚡ Instant Test Dispatch Created',
      `Order #${newId} generated for Sunita Devi. Start OTP: ${randomOtp}.`,
      'order',
      newId
    );
  };

  // Admin CRUD helper handlers connected to live REST API
  const handleAddBooking = async (newB: Booking) => {
    setBookings(prev => [newB, ...prev]);
    addAppNotification('📦 Order Created', `New order #${newB.id} scheduled for ${newB.customer.name}`, 'order', newB.id);
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify(newB)
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': 'admin' }
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const handleAddHelper = async (newH: Helper) => {
    setHelpers(prev => [newH, ...prev]);
    addAppNotification('👷 Partner Fleet Onboarded', `${newH.name} onboarded into ${newH.categoryTitle} fleet.`, 'system');
    try {
      await fetch('/api/helpers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify(newH)
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const handleUpdateHelper = async (updatedH: Helper) => {
    setHelpers(prev => prev.map(h => h.id === updatedH.id ? updatedH : h));
    try {
      await fetch(`/api/helpers/${updatedH.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify(updatedH)
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const handleDeleteHelper = async (id: string) => {
    setHelpers(prev => prev.filter(h => h.id !== id));
    try {
      await fetch(`/api/helpers/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': 'admin' }
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const handleAddService = async (newS: ServiceItem) => {
    setServices(prev => [newS, ...prev]);
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify(newS)
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const handleUpdateService = async (updatedS: ServiceItem) => {
    setServices(prev => prev.map(s => s.id === updatedS.id ? updatedS : s));
    try {
      await fetch(`/api/services/${updatedS.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify(updatedS)
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    try {
      await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: { 'x-user-role': 'admin' }
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const handleToggleFeatureReview = async (revId: string) => {
    const rev = reviews.find(r => r.id === revId);
    if (!rev) return;
    const updated = { ...rev, isFeaturedHomepage: !rev.isFeaturedHomepage };
    setReviews(prev => prev.map(r => r.id === revId ? updated : r));
    try {
      await fetch(`/api/reviews/${revId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const handleDeleteReview = async (revId: string) => {
    setReviews(prev => prev.filter(r => r.id !== revId));
    try {
      await fetch(`/api/reviews/${revId}`, {
        method: 'DELETE',
        headers: { 'x-user-role': 'admin' }
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
  };

  const activeBookingsCount = bookings.filter(
    b => b.status !== 'completed' && b.status !== 'cancelled'
  ).length;

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Full-screen Corporate Admin Operating System Layout
  if (activeWindow === 'admin') {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B111E]">
        <AdminDashboard
          bookings={bookings}
          services={services}
          helpers={helpers}
          transactions={transactions}
          carePlans={carePlans}
          reviews={reviews}
          onExitAdmin={() => handleNavigateWindow('home')}
          onSelectBookingForTrack={() => {
            setActiveWindow('client');
            setClientSubTab('bookings');
          }}
          onOpenInvoice={setSelectedBookingForInvoice}
          onUpdateBookingStatus={handleUpdateStatus}
          onBookServiceClick={() => {
            setActiveWindow('services');
          }}
          onAddBooking={handleAddBooking}
          onDeleteBooking={handleDeleteBooking}
          onAddHelper={handleAddHelper}
          onUpdateHelper={handleUpdateHelper}
          onDeleteHelper={handleDeleteHelper}
          onAddService={handleAddService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          onToggleFeatureReview={handleToggleFeatureReview}
          onDeleteReview={handleDeleteReview}
          initialModule="admin"
        />

        {selectedBookingForInvoice && (
          <InvoiceModal
            booking={selectedBookingForInvoice}
            onClose={() => setSelectedBookingForInvoice(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      {/* Global Header with Master Switcher & Notification Bell */}
      <Header
        activeWindow={activeWindow}
        setActiveWindow={handleNavigateWindow}
        activeClientSubTab={clientSubTab}
        setActiveClientSubTab={setClientSubTab}
        activeBookingsCount={activeBookingsCount}
        currentCity={currentCity}
        onCityChange={setCurrentCity}
        onOpenChat={() => setIsChatOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenEmails={() => setIsEmailModalOpen(true)}
        sentEmailsCount={sentEmails.length}
        onOpenLegalModal={(type) => setActiveLegalModal(type)}
        onLogout={handleLogout}
        onOpenLeadModal={() => setIsLeadInquiryModalOpen(true)}
        onOpenEmergencySos={() => setIsEmergencySosOpen(true)}
        onOpenCalculator={() => {
          setActiveWindow('home');
          setTimeout(() => {
            document.getElementById('household-calculator-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 60);
        }}
        onOpenSocietyHub={() => {
          setActiveWindow('home');
          setTimeout(() => {
            document.getElementById('society-pooling-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 60);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0">

        {/* ========================================================= */}
        {/* VIEW 1: HOME PAGE (Consumer Landing + Testimonials)       */}
        {/* ========================================================= */}
        {activeWindow === 'home' && (
          <div>
            <HeroSection
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveWindow('services');
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onQuickBookMaid={handleQuickBookMaid}
              onQuickBookCook={handleQuickBookCook}
              onOpenLeadModal={() => setIsLeadInquiryModalOpen(true)}
              onOpenEmergencySos={() => setIsEmergencySosOpen(true)}
              onOpenCalculator={() => {
                const el = document.getElementById('household-calculator-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Popular 15-Minute Instant Services */}
            <div className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-cyan-800 text-xs font-black uppercase tracking-wider block">
                      Rapid On-Demand Dispatch
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0C356A]">
                      Popular 15-Minute Domestic Services
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveWindow('services')}
                    className="text-xs font-extrabold text-cyan-800 hover:text-cyan-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View All Segments</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.slice(0, 3).map(srv => (
                    <div
                      key={srv.id}
                      className="rounded-2xl border border-slate-200 p-5 bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={srv.imageUrl}
                          alt={srv.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-900 text-[10px] font-bold">
                            {srv.badge}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm mt-1">{srv.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{srv.rating} ({srv.reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block">Starting At</span>
                          <span className="text-lg font-black text-[#0C356A]">₹{srv.basePrice}</span>
                        </div>
                        <button
                          onClick={() => handleSelectService(srv, 'instant')}
                          className="px-4 py-2 rounded-xl bg-[#0C356A] hover:bg-[#082245] text-white font-black text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-cyan-300" />
                          <span>15m Book</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Household Budget & Staffing Cost Calculator */}
            <HouseholdCostCalculator
              currentCity={currentCity}
              onBookCustomBundle={handleBookCustomBundle}
              onRequestCallback={() => setIsLeadInquiryModalOpen(true)}
            />

            {/* Verified Brand Partner Sponsored Placement */}
            <BrandPartnerBanner onSelectCategory={() => setActiveWindow('services')} />

            {/* Ready-Made Household Combos & Multi-Shift Packages */}
            <ReadyMadeTemplatesSection
              onSelectTemplate={handleSelectTemplate}
              onExploreAllServices={() => setActiveWindow('services')}
              onOpenLeadModal={() => setIsLeadInquiryModalOpen(true)}
            />

            {/* Gated Society & Apartment Community Pooling Section */}
            <SocietyPoolingSection
              currentCity={currentCity}
              onJoinPool={handleJoinSocietyPool}
              onOpenRwaCallback={() => setIsLeadInquiryModalOpen(true)}
            />

            {/* CarePlans Replacement Section */}
            <CarePlansSection
              carePlans={carePlans}
              onSelectPlan={handleSelectCarePlan}
            />

            {/* Genuine Resident Testimonials Section */}
            <TestimonialsSection
              userReviews={reviews.filter(r => r.isFeaturedHomepage)}
              onExploreServices={() => setActiveWindow('services')}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: VAST SEGMENT-WISE SERVICES CATALOG                */}
        {/* ========================================================= */}
        {activeWindow === 'services' && (
          <SegmentedServicesPage
            services={services}
            helpers={helpers}
            onSelectService={handleSelectService}
            onSelectCarePlan={() => {
              setActiveWindow('home');
            }}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 3: CLIENT APP VIEW                                   */}
        {/* ========================================================= */}
        {activeWindow === 'client' && (
          !currentUser ? (
            <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 text-[#0C356A] flex items-center justify-center mx-auto shadow-sm">
                <User className="w-8 h-8 text-[#0C356A]" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Resident Sign In Required</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Sign in to view your live domestic helper dispatch radar, 4-digit doorstep arrival OTP, booking history, and tax invoices.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#0C356A] hover:bg-[#082245] text-white font-bold text-xs shadow-sm cursor-pointer"
                  id="client-gate-sign-in"
                >
                  Sign In / Register
                </button>
                <button
                  onClick={() => setActiveWindow('home')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Browse Home
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Sub-Navigation Ribbon */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline">
                    Client Portal
                  </span>
                  <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setClientSubTab('services')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        clientSubTab === 'services'
                          ? 'bg-[#0C356A] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                      id="client-subtab-services"
                    >
                      Bookings & Catalog
                    </button>
                    <button
                      onClick={() => setClientSubTab('bookings')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        clientSubTab === 'bookings'
                          ? 'bg-[#0C356A] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                      id="client-subtab-radar"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Live Radar & OTP</span>
                      {activeBookingsCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-white text-[10px] font-bold">
                          {activeBookingsCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setClientSubTab('payments')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        clientSubTab === 'payments'
                          ? 'bg-[#0C356A] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                      id="client-subtab-payments"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Invoices & Receipts</span>
                    </button>
                    <button
                      onClick={() => setClientSubTab('reviews')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        clientSubTab === 'reviews'
                          ? 'bg-[#0C356A] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                      id="client-subtab-reviews"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>My Reviews ({reviews.length})</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQuickSimulateBooking}
                    className="px-3 py-1.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    id="client-quick-book-test"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                    <span className="hidden sm:inline">1-Click Test Booking</span>
                    <span className="sm:hidden">Test Book</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-View Content */}
            {clientSubTab === 'services' && (
              <SegmentedServicesPage
                services={services}
                helpers={helpers}
                onSelectService={handleSelectService}
                onSelectCarePlan={() => setActiveWindow('home')}
              />
            )}

            {clientSubTab === 'bookings' && (
              <LiveTracker
                bookings={bookings}
                onUpdateStatus={handleUpdateStatus}
                onSelectBookingForInvoice={setSelectedBookingForInvoice}
                onExploreServices={() => setClientSubTab('services')}
                onOpenReviewModal={(b) => setSelectedBookingForReview(b)}
                onOpenPaymentModal={(b) => setSelectedBookingForPayment(b)}
                onOpenEmergencySos={() => setIsEmergencySosOpen(true)}
                onOpenHelperDossier={(h) => setSelectedHelperForDossier(h)}
              />
            )}

            {clientSubTab === 'payments' && (
              <PaymentDashboard
                transactions={transactions}
                bookings={bookings}
                onOpenInvoice={setSelectedBookingForInvoice}
              />
            )}

            {clientSubTab === 'reviews' && (
              <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Your Domestic Service Reviews</h2>
                    <p className="text-xs text-slate-500">Verified feedback submitted for household helpers & cleaners.</p>
                  </div>
                  {bookings.find(b => b.status === 'completed') && (
                    <button
                      onClick={() => {
                        const completed = bookings.find(b => b.status === 'completed');
                        if (completed) setSelectedBookingForReview(completed);
                      }}
                      className="px-4 py-2 bg-[#0C356A] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      + Rate Recent Helper
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {reviews.map(rev => (
                    <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{rev.serviceTitle}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                            Order #{rev.bookingId}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="font-bold text-[#0C356A]">Helper: {rev.helperName}</span>
                        <div className="flex gap-1.5">
                          {rev.tags.map(t => (
                            <span key={t} className="text-[10px] bg-cyan-50 text-cyan-900 px-2 py-0.5 rounded-md">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )
        )}

        {/* ========================================================= */}
        {/* VIEW 4: SERVICE PROVIDER VIEW                             */}
        {/* ========================================================= */}
        {activeWindow === 'provider' && (
          <div className="py-6">
            <PartnerPortal
              bookings={bookings}
              helpers={helpers}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 5: SOFTWARE COMPANY ADMIN DASHBOARD & CRUD           */}
        {/* ========================================================= */}
        {activeWindow === 'admin' && (
          <AdminDashboard
            bookings={bookings}
            services={services}
            helpers={helpers}
            transactions={transactions}
            reviews={reviews}
            onSelectBookingForTrack={() => {
              setActiveWindow('client');
              setClientSubTab('bookings');
            }}
            onOpenInvoice={setSelectedBookingForInvoice}
            onUpdateBookingStatus={handleUpdateStatus}
            onBookServiceClick={() => {
              setActiveWindow('services');
            }}
            onAddBooking={handleAddBooking}
            onDeleteBooking={handleDeleteBooking}
            onAddHelper={handleAddHelper}
            onUpdateHelper={handleUpdateHelper}
            onDeleteHelper={handleDeleteHelper}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onToggleFeatureReview={handleToggleFeatureReview}
            onDeleteReview={handleDeleteReview}
            initialModule="admin"
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 6: 3-IN-1 MULTI-WINDOW SYNCHRONIZED SIMULATOR        */}
        {/* ========================================================= */}
        {activeWindow === 'simulator' && (
          <MultiWindowSimulator
            bookings={bookings}
            services={services}
            helpers={helpers}
            transactions={transactions}
            onUpdateStatus={handleUpdateStatus}
            onQuickSimulateBooking={handleQuickSimulateBooking}
            onOpenInvoice={setSelectedBookingForInvoice}
            onNavigateWindow={(win) => setActiveWindow(win)}
          />
        )}

      </main>

      {/* Push Notification Center Drawer */}
      <NotificationCenter
        notifications={notifications}
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onMarkAsRead={(id) => {
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        }}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
        onSelectBooking={(bookingId) => {
          setActiveWindow('client');
          setClientSubTab('bookings');
        }}
      />

      {/* Customer Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onSubmitReview={handleReviewSubmit}
        />
      )}

      {/* Native Payment Gateway Modal */}
      {selectedBookingForPayment && (
        <PaymentGatewayModal
          booking={selectedBookingForPayment}
          isOpen={true}
          onClose={() => setSelectedBookingForPayment(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Mobile App Bottom Navigation Menu with Dynamic Role & System Perspectives */}
      <MobileBottomNav
        activeWindow={activeWindow}
        onNavigate={handleNavigateWindow}
        activeBookingsCount={activeBookingsCount}
        onOpenChat={() => setIsChatOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        currentRole={currentUser?.role || 'client'}
        onChangeRole={(role) => setCurrentUser(prev => prev ? ({ ...prev, role }) : null)}
        currentUser={currentUser}
        services={services}
        onSelectService={handleSelectService}
        onOpenLegalModal={(type) => setActiveLegalModal(type)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Floating AI Booking Concierge & Live Chat */}
      <ChatSupport
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onQuickBookService={(serviceId) => {
          const s = services.find(srv => srv.id === serviceId) || services[0];
          if (s) handleSelectService(s, 'instant');
        }}
        onSelectCarePlan={(_planCode) => {
          setActiveWindow('home');
          setTimeout(() => {
            const el = document.getElementById('homeelynn-careplans-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 60);
        }}
        services={services}
        bookings={bookings}
        onOpenEmergencySos={() => setIsEmergencySosOpen(true)}
        onViewBookings={() => {
          setActiveWindow('client');
          setClientSubTab('bookings');
        }}
      />

      {/* Booking Customization & Checkout Modal */}
      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          initialMode={bookingMode}
          initialPackageType={bookingPackageType}
          initialShiftMode={bookingShiftMode}
          initialTemplateName={bookingTemplateName}
          initialSelectedTasks={bookingInitialTasks}
          onClose={() => {
            setSelectedServiceForBooking(null);
            setBookingShiftMode(undefined);
            setBookingTemplateName(undefined);
            setBookingInitialTasks(undefined);
          }}
          onBookingSuccess={handleBookingSuccess}
          currentCity={currentCity}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* GST Tax Invoice Modal */}
      {selectedBookingForInvoice && (
        <InvoiceModal
          booking={selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
        />
      )}

      {/* Enterprise Footer */}
      <Footer
        setActiveWindow={handleNavigateWindow}
        onOpenLegalModal={(type) => setActiveLegalModal(type)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLeadModal={() => setIsLeadInquiryModalOpen(true)}
        onOpenEmergencySos={() => setIsEmergencySosOpen(true)}
        onOpenCalculator={() => {
          setActiveWindow('home');
          setTimeout(() => {
            document.getElementById('household-calculator-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 60);
        }}
      />

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);

          // Dispatch transactional Welcome / Login confirmation email
          const welcomeEmail: SentEmail = {
            id: `em-reg-${Date.now()}`,
            to: user.email || 'customer@hommlyn247.com',
            recipientName: user.name,
            subject: `Welcome to hommlyn247 — Your 24/7 Domestic Workforce Network`,
            previewText: `Welcome ${user.name}! Your account is active with ₹100 inaugural gift voucher.`,
            timestamp: 'Just now',
            type: 'registration_welcome',
            htmlContent: `<div style="font-family: sans-serif; padding: 16px; color: #1e293b;">
              <h2 style="color: #0C356A; margin-bottom: 8px;">Welcome to hommlyn247</h2>
              <p>Dear <strong>${user.name}</strong>,</p>
              <p>Welcome to India's premier verified domestic workforce and facility network.</p>
              <div style="background: #f0f9ff; border: 1.5px solid #0284c7; padding: 12px; border-radius: 10px; margin: 14px 0;">
                <p style="margin: 0; font-weight: bold; color: #0369a1;">₹100 Inaugural Welcome Credit</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #0284c7;">Apply coupon code <strong>HOMM100</strong> during your first 15-minute booking checkout.</p>
              </div>
              <p><strong>Registered Phone:</strong> ${user.phone}</p>
              <p><strong>Primary Address:</strong> ${user.address || 'Koramangala, Bangalore'}</p>
              <p style="color: #64748b; font-size: 11px;">24/7 Helpline: 1800-247-HOMM • hommlyn247 Technologies Pvt Ltd</p>
            </div>`
          };

          setSentEmails(prev => [welcomeEmail, ...prev]);

          fetch('/api/notifications/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(welcomeEmail)
          }).catch(err => console.warn('Email dispatch warning:', err));

          addAppNotification('👋 Welcome to hommlyn247', `Logged in as ${user.name} (${user.role.toUpperCase()}). Welcome email sent!`, 'system');
        }}
        onPartnerRegisterSuccess={(helperData) => {
          handleAddHelper(helperData);
          setIsAuthModalOpen(false);
        }}
        onAdminUnlock={() => {
          handleNavigateWindow('admin');
          setIsAuthModalOpen(false);
          addAppNotification('🛡️ Admin Console Unlocked', 'Authenticated into Master Operations Console (/admin)', 'system');
        }}
      />

      {/* Institutional Legal & Policy Modals */}
      <LegalModals
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      {/* Transactional Email Dispatch Viewer */}
      <EmailViewerModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emails={sentEmails}
        onSendTestEmail={(to, type) => {
          const newEm: SentEmail = {
            id: `em-${Date.now()}`,
            to,
            recipientName: currentUser.name,
            subject: type === 'otp_alert' ? 'Doorstep Security OTP Alert' : 'hommlyn247 Service Update',
            previewText: 'Instant domestic dispatch notification.',
            timestamp: 'Just now',
            type,
            htmlContent: `<p>Hello ${currentUser.name},</p><p>This is a test transactional alert from hommlyn247 15-minute domestic workforce network.</p>`
          };
          setSentEmails(prev => [newEm, ...prev]);
        }}
      />

      {/* Inbound Lead Inquiry & Custom Quote Concierge Modal */}
      <LeadInquiryModal
        isOpen={isLeadInquiryModalOpen}
        onClose={() => setIsLeadInquiryModalOpen(false)}
        currentCity={currentCity}
        onSuccess={(lead) => {
          addAppNotification(
            '📋 Custom Quote Inquiry Received',
            `Inquiry #${lead.id} created for ${lead.requirementCategory.toUpperCase()} (${lead.shiftPreference?.replace(/_/g, ' ') || 'shift'}). Our relationship manager will call shortly!`,
            'system'
          );
        }}
      />

      {/* 1-Tap Emergency SOS Rapid Dispatch Modal */}
      <EmergencySosModal
        isOpen={isEmergencySosOpen}
        onClose={() => setIsEmergencySosOpen(false)}
        onTriggerSosBooking={handleTriggerSosBooking}
        helpers={helpers}
        services={services}
        currentUser={currentUser}
        currentCity={currentCity}
      />

      {/* Helper Police Verification Dossier Modal */}
      {selectedHelperForDossier && (
        <HelperVerificationModal
          helper={selectedHelperForDossier}
          onClose={() => setSelectedHelperForDossier(null)}
        />
      )}

      {/* Bookings Launching Soon Toast - Public Showcase */}
      {showBookingLaunchingSoon && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-up-4 duration-200" role="status" aria-live="polite">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-cyan-500/50 flex items-center gap-4 max-w-md">
            <div className="p-2 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Bookings Launching Soon</p>
              <p className="text-xs text-slate-300 mt-0.5">We are finalizing our verified partner network. Public bookings will be available shortly.</p>
            </div>
            <button onClick={() => setShowBookingLaunchingSoon(false)} className="p-1 text-slate-400 hover:text-white transition-colors" aria-label="Dismiss">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
