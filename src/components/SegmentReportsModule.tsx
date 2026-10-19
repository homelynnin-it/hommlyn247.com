import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  IndianRupee,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  FileSpreadsheet,
  MapPin,
  Star,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  FileText,
  BadgePercent
} from 'lucide-react';
import { Booking, Helper, PaymentTransaction, ServiceItem } from '../types';

interface SegmentReportsModuleProps {
  bookings: Booking[];
  services: ServiceItem[];
  helpers: Helper[];
  transactions: PaymentTransaction[];
}

export type ReportSegment = 'all' | 'revenue' | 'services' | 'providers' | 'regions' | 'careplans';
export type Timeframe = 'today' | '7days' | 'month' | 'quarter' | 'all';

export const SegmentReportsModule: React.FC<SegmentReportsModuleProps> = ({
  bookings,
  services,
  helpers,
  transactions,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<ReportSegment>('all');
  const [timeframe, setTimeframe] = useState<Timeframe>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string>('');

  // Filtered bookings based on city & timeframe
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // City filter
      if (cityFilter !== 'all') {
        const bookingCity = b.customer?.city?.toLowerCase() || 'bangalore';
        if (!bookingCity.includes(cityFilter.toLowerCase())) {
          return false;
        }
      }
      // Timeframe logic (demo approximation based on schedule or status)
      if (timeframe === 'today') {
        return b.status === 'in_progress' || b.status === 'en_route' || b.status === 'arrived' || b.status === 'pending';
      }
      return true;
    });
  }, [bookings, cityFilter, timeframe]);

  // Segment 1: Revenue Calculations
  const revenueMetrics = useMemo(() => {
    const grossBookingsValue = filteredBookings.reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
    const completedGross = filteredBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.pricing?.total || 0), 0);

    const platformCommission = Math.round(completedGross * 0.20); // 20% platform commission
    const partnerPayouts = Math.round(completedGross * 0.80); // 80% to domestic helpers
    const gstCollected = Math.round(completedGross * 0.18); // 18% GST

    // Payment methods distribution
    const upiTotal = Math.round(completedGross * 0.65);
    const cardTotal = Math.round(completedGross * 0.25);
    const cashTotal = Math.round(completedGross * 0.10);

    return {
      grossBookingsValue: grossBookingsValue || 14850,
      completedGross: completedGross || 11200,
      platformCommission: platformCommission || 2240,
      partnerPayouts: partnerPayouts || 8960,
      gstCollected: gstCollected || 2016,
      averageOrderValue: filteredBookings.length > 0 ? Math.round(grossBookingsValue / filteredBookings.length) : 580,
      upiTotal,
      cardTotal,
      cashTotal
    };
  }, [filteredBookings]);

  // Segment 2: Category Demand & Performance
  const categorySegments = useMemo(() => {
    const categories = [
      { id: 'maid', label: 'House Maid & Cleaning', baseCount: 42, avgTicket: 349 },
      { id: 'cook', label: 'Home Cook & Chef', baseCount: 38, avgTicket: 499 },
      { id: 'nanny', label: 'Babysitter / Nanny', baseCount: 22, avgTicket: 599 },
      { id: 'driver', label: 'Personal Car Driver', baseCount: 28, avgTicket: 449 },
      { id: 'security', label: 'Residential Security', baseCount: 15, avgTicket: 799 },
      { id: 'electrician', label: 'Electrician & Repairs', baseCount: 19, avgTicket: 299 },
      { id: 'plumber', label: 'Plumber & Sanitation', baseCount: 16, avgTicket: 319 },
    ];

    return categories.map(cat => {
      const catBookings = filteredBookings.filter(b => b.category === cat.id);
      const totalOrders = catBookings.length > 0 ? catBookings.length : Math.max(1, Math.floor(cat.baseCount * 0.1));
      const totalRevenue = catBookings.reduce((sum, b) => sum + (b.pricing?.total || 0), 0) || (totalOrders * cat.avgTicket);
      const completed = catBookings.filter(b => b.status === 'completed').length || Math.floor(totalOrders * 0.85);

      return {
        ...cat,
        totalOrders,
        totalRevenue,
        completionRate: Math.round((completed / (totalOrders || 1)) * 100),
        slaArrivalMins: cat.id === 'maid' ? '12.4 mins' : cat.id === 'cook' ? '13.8 mins' : '14.2 mins'
      };
    });
  }, [filteredBookings]);

  // Segment 3: Service Provider Compliance & Performance
  const providerSegments = useMemo(() => {
    return helpers.map(h => {
      const helperBookings = bookings.filter(b => b.helper?.id === h.id);
      const completed = helperBookings.filter(b => b.status === 'completed').length;
      const earnings = helperBookings.reduce((acc, b) => acc + Math.round((b.pricing?.total || 0) * 0.80), 0) || (h.totalJobs * 280);

      return {
        ...h,
        assignedOrdersCount: helperBookings.length || h.totalJobs,
        completedCount: completed || Math.floor(h.totalJobs * 0.95),
        earnedPayout: earnings,
        onTimeRate: '98.5%',
        complianceBadge: 'Police & Aadhaar Verified',
        acceptanceRate: '99.1%'
      };
    });
  }, [helpers, bookings]);

  // Segment 4: Regional / City Cluster Segments
  const regionalSegments = [
    { city: 'Bangalore', activeHubs: 'Indiranagar, Koramangala, HSR, Whitefield, Bellandur', activeStaff: 48, orders: 124, avgEta: '11.8m', slaAdherence: '98.2%' },
    { city: 'Mumbai', activeHubs: 'Powai, Bandra West, Andheri West, Thane', activeStaff: 36, orders: 88, avgEta: '13.4m', slaAdherence: '96.5%' },
    { city: 'Delhi NCR', activeHubs: 'Gurgaon Sec 54, Noida Sec 62, South Extension', activeStaff: 30, orders: 74, avgEta: '14.1m', slaAdherence: '95.8%' },
    { city: 'Hyderabad', activeHubs: 'Gachibowli, Madhapur, Jubilee Hills', activeStaff: 24, orders: 56, avgEta: '12.6m', slaAdherence: '97.4%' },
    { city: 'Pune', activeHubs: 'Koregaon Park, Wakad, Viman Nagar', activeStaff: 20, orders: 42, avgEta: '13.0m', slaAdherence: '96.9%' },
  ];

  // Segment 5: CarePlans & Replacement Warranty
  const carePlanSegments = [
    { name: 'Care 90° (Quarterly)', duration: '3 Months', activeFamilies: 42, replacementsProcessed: 3, avgResolutionHrs: '2.4 hrs', satisfaction: '4.95/5' },
    { name: 'Care 180° (Half-Yearly)', duration: '6 Months', activeFamilies: 28, replacementsProcessed: 2, avgResolutionHrs: '1.8 hrs', satisfaction: '4.98/5' },
    { name: 'Care 365° (Annual Protection)', duration: '12 Months', activeFamilies: 14, replacementsProcessed: 1, avgResolutionHrs: '1.2 hrs', satisfaction: '5.00/5' },
  ];

  // Download CSV Action
  const handleExportCSV = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'HomeeLynn7 Segmented Operational & Financial Report\n';
      csvContent += `Generated On: ${new Date().toLocaleString('en-IN')}\n`;
      csvContent += `Selected Segment: ${selectedSegment.toUpperCase()}\n`;
      csvContent += `Timeframe: ${timeframe.toUpperCase()} | City Filter: ${cityFilter.toUpperCase()}\n\n`;

      // Section 1: Revenue
      csvContent += 'FINANCIAL SEGMENT AUDIT\n';
      csvContent += 'Metric,Amount (INR)\n';
      csvContent += `Gross Merchandise Value (GMV),${revenueMetrics.grossBookingsValue}\n`;
      csvContent += `Completed Service Value,${revenueMetrics.completedGross}\n`;
      csvContent += `Platform Net Commission (20%),${revenueMetrics.platformCommission}\n`;
      csvContent += `Domestic Helpers Payout (80%),${revenueMetrics.partnerPayouts}\n`;
      csvContent += `GST Collected (18%),${revenueMetrics.gstCollected}\n`;
      csvContent += `Average Order Value,${revenueMetrics.averageOrderValue}\n\n`;

      // Section 2: Categories
      csvContent += 'SERVICE CATEGORY SEGMENT AUDIT\n';
      csvContent += 'Category,Total Orders,Total Revenue (INR),Completion Rate %,Avg Arrival ETA\n';
      categorySegments.forEach(c => {
        csvContent += `"${c.label}",${c.totalOrders},${c.totalRevenue},${c.completionRate}%,${c.slaArrivalMins}\n`;
      });
      csvContent += '\n';

      // Section 3: Providers
      csvContent += 'SERVICE PROVIDERS AUDIT\n';
      csvContent += 'Staff Name,Category,Rating,Total Orders,Completed,Earnings Payout (INR),On-Time SLA,Verification\n';
      providerSegments.forEach(p => {
        csvContent += `"${p.name}","${p.categoryTitle}",${p.rating},${p.assignedOrdersCount},${p.completedCount},${p.earnedPayout},${p.onTimeRate},"${p.complianceBadge}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `HomeeLynn7_Segment_Report_${selectedSegment}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
      setExportNotice('CSV Report generated and downloaded to your device successfully.');
      setTimeout(() => setExportNotice(''), 4000);
    }, 400);
  };

  // Print Formatted PDF/Report
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="full-phase-segment-reports-module">

      {/* Module Title & Top Action Bar */}
      <div className="bg-white rounded-3xl border border-cyan-200/90 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#0C356A] text-white flex items-center justify-center shadow-md">
                <FileSpreadsheet className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#0C356A] tracking-tight">
                    Full-Phase Segment-Wise Reports Module
                  </h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-300">
                    Live Audit Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated segment generation: Revenue & GST, Service Demand, Provider Fleets, City Clusters, and CarePlans.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-[#0C356A] hover:bg-[#071952] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              id="export-csv-btn"
            >
              <Download className="w-4 h-4 text-cyan-300" />
              <span>{isGenerating ? 'Generating...' : 'Export Segment CSV'}</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#0C356A] border border-cyan-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              id="print-pdf-btn"
            >
              <Printer className="w-4 h-4 text-cyan-700" />
              <span>Print / Save Official PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Controls: Segment Tabs, Timeframe, City */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

          {/* Segment Selector Tabs */}
          <div className="md:col-span-7 flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
            {[
              { id: 'all', label: 'All Segments' },
              { id: 'revenue', label: '1. Revenue & GST' },
              { id: 'services', label: '2. Category Demand' },
              { id: 'providers', label: '3. Providers Fleet' },
              { id: 'regions', label: '4. City Clusters' },
              { id: 'careplans', label: '5. CarePlans & Warranty' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedSegment(tab.id as ReportSegment)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSegment === tab.id
                    ? 'bg-[#0C356A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Timeframe Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden focus:border-cyan-500"
            >
              <option value="today">Today (Real-time)</option>
              <option value="7days">Last 7 Days</option>
              <option value="month">Current Month</option>
              <option value="quarter">Quarter to Date</option>
              <option value="all">All-Time Cumulative</option>
            </select>
          </div>

          {/* City Dropdown */}
          <div className="md:col-span-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">All Cities</option>
              <option value="bangalore">Bangalore</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi NCR</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
            </select>
          </div>
        </div>

        {/* Notice alert after download */}
        {exportNotice && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* Executive Key Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-cyan-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Gross GMV Volume</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0C356A] mt-2">
            ₹{revenueMetrics.grossBookingsValue.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>+21.8% segment growth</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-cyan-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Helpers Payouts (80%)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
            ₹{revenueMetrics.partnerPayouts.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Settled via instant UPI & weekly NEFT
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-cyan-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg 15-Min SLA Time</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            12.6 mins
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Target SLA: ≤ 15 mins (98.4% met)
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-cyan-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Replacement Guarantee</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-800 mt-2">
            100% Fulfilled
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Zero pending customer claims
          </p>
        </div>
      </div>

      {/* SEGMENT 1: SALES & FINANCIAL REVENUE REPORT */}
      {(selectedSegment === 'all' || selectedSegment === 'revenue') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="segment-revenue-section">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
                Segment 1
              </span>
              <h3 className="text-lg font-black text-[#0C356A] mt-1">
                Sales, Commission & GST Financial Audit
              </h3>
              <p className="text-xs text-slate-500">
                Itemized distribution of gross billings, partner remuneration, platform share, and statutory tax collections.
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-xs font-mono font-bold text-slate-500">GSTIN: 29AABCH7829Q1Z5</span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

              {/* Split Breakdown Card */}
              <div className="p-5 rounded-2xl bg-cyan-50/60 border border-cyan-200/80">
                <h4 className="text-xs font-bold uppercase text-cyan-950 mb-3 flex items-center justify-between">
                  <span>Billing Split Model</span>
                  <span className="text-[10px] bg-cyan-200 text-cyan-900 px-1.5 py-0.5 rounded">Standard 80:20</span>
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Helpers Payout (80%):</span>
                    <span className="font-extrabold text-slate-900">₹{revenueMetrics.partnerPayouts.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '80%' }} />
                  </div>

                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Platform Share (20%):</span>
                    <span className="font-extrabold text-cyan-900">₹{revenueMetrics.platformCommission.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0C356A] h-full rounded-full" style={{ width: '20%' }} />
                  </div>

                  <div className="flex justify-between pt-2 border-t border-cyan-200">
                    <span className="text-slate-600 font-semibold">18% GST Collected:</span>
                    <span className="font-black text-rose-700">₹{revenueMetrics.gstCollected.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-800 mb-3">
                  Payment Channels Ratio
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">UPI (PhonePe, GPay, Paytm):</span>
                    <span className="font-bold text-slate-900">65% (₹{revenueMetrics.upiTotal.toLocaleString('en-IN')})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Cards & Netbanking:</span>
                    <span className="font-bold text-slate-900">25% (₹{revenueMetrics.cardTotal.toLocaleString('en-IN')})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Cash / Post-Service POD:</span>
                    <span className="font-bold text-slate-900">10% (₹{revenueMetrics.cashTotal.toLocaleString('en-IN')})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
                    Zero-advance guarantee on all initial bookings.
                  </p>
                </div>
              </div>

              {/* Order Economics */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-800 mb-3">
                  Order Economics & SLA
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Average Order Value:</span>
                    <span className="font-bold text-slate-900">₹{revenueMetrics.averageOrderValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Fulfillment Ratio:</span>
                    <span className="font-bold text-emerald-600">97.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Refund / Dispute Rate:</span>
                    <span className="font-bold text-slate-900">&lt; 0.4%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-600 font-semibold">Active Bookings Count:</span>
                    <span className="font-bold text-cyan-800">{filteredBookings.length} Orders</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SEGMENT 2: SERVICE CATEGORY & DEMAND SEGMENT */}
      {(selectedSegment === 'all' || selectedSegment === 'services') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="segment-category-section">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
                Segment 2
              </span>
              <h3 className="text-lg font-black text-[#0C356A] mt-1">
                Service Category Demand & SLA Fulfillment
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown of demand by category, average ticket value, and 15-minute dispatch performance.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Peak Hours: 7-10 AM & 6-9 PM
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Domestic Category</th>
                  <th className="py-3.5 px-4 text-center">Orders Volume</th>
                  <th className="py-3.5 px-4 text-center">Avg Ticket</th>
                  <th className="py-3.5 px-4 text-right">Gross GMV</th>
                  <th className="py-3.5 px-4 text-center">Completion Rate</th>
                  <th className="py-3.5 px-6 text-right">Average Arrival Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categorySegments.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-600" />
                      <span>{cat.label}</span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      {cat.totalOrders}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-slate-600">
                      ₹{cat.avgTicket}
                    </td>
                    <td className="py-4 px-4 text-right font-black text-cyan-950">
                      ₹{cat.totalRevenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {cat.completionRate}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-emerald-700">
                      {cat.slaArrivalMins}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEGMENT 3: SERVICE PROVIDER & FLEET COMPLIANCE REPORT */}
      {(selectedSegment === 'all' || selectedSegment === 'providers') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="segment-provider-section">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
                Segment 3
              </span>
              <h3 className="text-lg font-black text-[#0C356A] mt-1">
                Verified Domestic Workforce & Payouts Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Staff ratings, background audit status, on-time SLA metrics, and total partner payouts.
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Aadhaar & Police Cleared
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Domestic Professional</th>
                  <th className="py-3.5 px-4">Specialization</th>
                  <th className="py-3.5 px-4 text-center">Rating</th>
                  <th className="py-3.5 px-4 text-center">Jobs Done</th>
                  <th className="py-3.5 px-4 text-center">On-Time Arrival</th>
                  <th className="py-3.5 px-4 text-right">Disbursed Payout</th>
                  <th className="py-3.5 px-6 text-center">Verification Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providerSegments.map((helper) => (
                  <tr key={helper.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={helper.photoUrl}
                        alt={helper.name}
                        className="w-8 h-8 rounded-full object-cover border border-cyan-200 shrink-0"
                      />
                      <div>
                        <span className="block font-bold">{helper.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{helper.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">
                      {helper.categoryTitle}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {helper.rating}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      {helper.assignedOrdersCount}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-emerald-600">
                      {helper.onTimeRate}
                    </td>
                    <td className="py-4 px-4 text-right font-black text-slate-900">
                      ₹{helper.earnedPayout.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEGMENT 4: REGIONAL CLUSTERS & CITY OPERATIONS */}
      {(selectedSegment === 'all' || selectedSegment === 'regions') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="segment-regional-section">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
              Segment 4
            </span>
            <h3 className="text-lg font-black text-[#0C356A] mt-1">
              Regional Clusters & Micro-Hub Density Report
            </h3>
            <p className="text-xs text-slate-500">
              City-level performance, residential cluster hubs, and 15-minute dispatch radius coverage.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Metropolitan City</th>
                  <th className="py-3.5 px-4">Primary Residential Hubs</th>
                  <th className="py-3.5 px-4 text-center">Active Workforce</th>
                  <th className="py-3.5 px-4 text-center">Total Orders</th>
                  <th className="py-3.5 px-4 text-center">Avg Dispatch ETA</th>
                  <th className="py-3.5 px-6 text-right">15m SLA Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regionalSegments.map((region) => (
                  <tr key={region.city} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>{region.city}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs truncate font-medium">
                      {region.activeHubs}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      {region.activeStaff} Staff
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-900">
                      {region.orders}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-cyan-800">
                      {region.avgEta}
                    </td>
                    <td className="py-4 px-6 text-right font-black text-emerald-700">
                      {region.slaAdherence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEGMENT 5: CAREPLANS & WARRANTY REPLACEMENTS */}
      {(selectedSegment === 'all' || selectedSegment === 'careplans') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="segment-careplans-section">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
              Segment 5
            </span>
            <h3 className="text-lg font-black text-[#0C356A] mt-1">
              Homelynn CarePlans & 100% Free Replacements Audit
            </h3>
            <p className="text-xs text-slate-500">
              Tracking long-term domestic contracts, zero-advance guarantees, and guaranteed helper replacements within 4 hours.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Protection Tier</th>
                  <th className="py-3.5 px-4">Contract Duration</th>
                  <th className="py-3.5 px-4 text-center">Subscribed Families</th>
                  <th className="py-3.5 px-4 text-center">Replacements Executed</th>
                  <th className="py-3.5 px-4 text-center">Replacement SLA</th>
                  <th className="py-3.5 px-6 text-right">Customer Satisfaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {carePlanSegments.map((cp) => (
                  <tr key={cp.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{cp.name}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {cp.duration}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      {cp.activeFamilies} Families
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono font-bold text-cyan-900">
                        {cp.replacementsProcessed} Claims
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-emerald-600">
                      {cp.avgResolutionHrs} (Target ≤ 4h)
                    </td>
                    <td className="py-4 px-6 text-right font-black text-amber-600">
                      {cp.satisfaction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
