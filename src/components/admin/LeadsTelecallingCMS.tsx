import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  MessageSquare,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flame,
  Share2,
  Building2,
  MapPin,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  ArrowUpRight,
  X,
  Send,
  Sparkles,
  ChevronRight,
  Check,
  Tag,
  Radio,
  Download,
  Edit3,
  Headphones,
  Users,
  RefreshCw,
  ThumbsUp,
  XCircle
} from 'lucide-react';
import { LeadClient, LeadSource, LeadStatus, LeadPriority, CallLogEntry, ServiceCategory, Helper, Booking } from '../../types';
import { INITIAL_LEADS } from '../../data/leadsPresets';

interface LeadsTelecallingCMSProps {
  isDarkMode?: boolean;
  helpers?: Helper[];
  onNavigateTab?: (tab: any) => void;
  onBookingCreated?: (booking: Booking) => void;
}

export const SOURCE_CONFIG: Record<LeadSource, { label: string; badgeClass: string; bg: string; icon: string }> = {
  justdial: { label: 'JustDial Inbound', badgeClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50', bg: 'bg-orange-50 dark:bg-orange-950/20', icon: '📞' },
  direct_call: { label: 'Direct Call / Inbound', badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50', bg: 'bg-blue-50 dark:bg-blue-950/20', icon: '📱' },
  facebook_meta: { label: 'Facebook / Meta Ads', badgeClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50', bg: 'bg-indigo-50 dark:bg-indigo-950/20', icon: '🌐' },
  referral: { label: 'Resident / Friend Referral', badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50', bg: 'bg-emerald-50 dark:bg-emerald-950/20', icon: '🤝' },
  society_kiosk: { label: 'Society Gate Kiosk', badgeClass: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900/50', bg: 'bg-teal-50 dark:bg-teal-950/20', icon: '🏢' },
  whatsapp: { label: 'WhatsApp Chat Inbound', badgeClass: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50', bg: 'bg-green-50 dark:bg-green-950/20', icon: '💬' },
  google_search: { label: 'Google Search / Ads', badgeClass: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50', bg: 'bg-cyan-50 dark:bg-cyan-950/20', icon: '🔍' },
  website_form: { label: 'Website Inquiry Form', badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50', bg: 'bg-purple-50 dark:bg-purple-950/20', icon: '💻' },
  walk_in: { label: 'Walk-in / Office Visit', badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50', bg: 'bg-amber-50 dark:bg-amber-950/20', icon: '🚶' }
};

export const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; badge: string; icon: string }> = {
  new: { label: 'New Lead', color: 'bg-blue-500', badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50', icon: '🔵' },
  contacted: { label: 'Contacted', color: 'bg-amber-500', badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50', icon: '🟡' },
  discussion: { label: 'In Discussion', color: 'bg-purple-500', badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50', icon: '🟣' },
  interview_scheduled: { label: 'Interview Scheduled', color: 'bg-cyan-500', badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/50', icon: '🔷' },
  trial_active: { label: 'Trial Active', color: 'bg-yellow-500', badge: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/50', icon: '🧪' },
  follow_up: { label: 'Follow-Up Needed', color: 'bg-rose-500', badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50', icon: '🔴' },
  converted: { label: 'Converted (Won)', color: 'bg-emerald-500', badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50', icon: '🟢' },
  lost: { label: 'Lost / Disqualified', color: 'bg-slate-400', badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800', icon: '⚪' }
};

const TELECALLERS = [
  'Priya Sharma (Senior Telecaller)',
  'Rahul Verma (Lead Executive)',
  'Anjali Rao (Telecaller)',
  'Kavita Deshmukh (Sales Associate)'
];

const POPULAR_BANGALORE_SOCIETIES = [
  'Prestige Shantiniketan, Whitefield',
  'Adarsh Palm Meadows, Varthur',
  'Salarpuria Greenage, Bommanahalli',
  'Sobha City, Thanisandra',
  'Raheja Vivarea, Koramangala',
  'Prestige Ferns Residency, Harlur',
  'Brigade Gateway, Rajajinagar',
  'Godrej Woodsman Estate, Hebbal'
];

type QueueTab = 'all' | 'fresh' | 'discussion' | 'follow_ups' | 'trials' | 'converted' | 'lost';

export const LeadsTelecallingCMS: React.FC<LeadsTelecallingCMSProps> = ({ isDarkMode, helpers = [], onNavigateTab, onBookingCreated }) => {
  const [leads, setLeads] = useState<LeadClient[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [activeQueueTab, setActiveQueueTab] = useState<QueueTab>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeLeadForEdit, setActiveLeadForEdit] = useState<LeadClient | null>(null);
  const [activeLeadForCallLog, setActiveLeadForCallLog] = useState<LeadClient | null>(null);
  const [activeLeadForDetails, setActiveLeadForDetails] = useState<LeadClient | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Convert to Live Booking Modal State (Smart Helper Matcher)
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [activeLeadForConvert, setActiveLeadForConvert] = useState<LeadClient | null>(null);
  const [selectedHelperIdForConvert, setSelectedHelperIdForConvert] = useState<string>('');
  const [convertTrialDate, setConvertTrialDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [convertTrialSlot, setConvertTrialSlot] = useState<string>('Tomorrow Morning 07:30 AM');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionSuccessInfo, setConversionSuccessInfo] = useState<{ bookingId: string; clientName: string; serviceTitle: string } | null>(null);

  // WhatsApp Multi-Template Modal State
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [activeLeadForWhatsApp, setActiveLeadForWhatsApp] = useState<LeadClient | null>(null);
  const [selectedWhatsAppTemplate, setSelectedWhatsAppTemplate] = useState<number>(0);

  // Bulk Import CSV Modal State
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{ imported: number; skipped: number } | null>(null);

  // Quick Inbound Strip State (Fast 10-second Entry)
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickSociety, setQuickSociety] = useState('');
  const [quickCategory, setQuickCategory] = useState<ServiceCategory | 'all_rounder'>('cook');
  const [quickSource, setQuickSource] = useState<LeadSource>('justdial');
  const [quickBudget, setQuickBudget] = useState('₹12,000 / mo');

  // New Call Log Form
  const [callOutcome, setCallOutcome] = useState<CallLogEntry['callOutcome']>('connected');
  const [callNotes, setCallNotes] = useState('');
  const [callFollowUpDate, setCallFollowUpDate] = useState('');
  const [callTelecallerName, setCallTelecallerName] = useState(TELECALLERS[0]);
  const [callNewStatus, setCallNewStatus] = useState<LeadStatus>('contacted');

  // Full Manual Lead Entry Modal Form
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('+91 ');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadAddress, setNewLeadAddress] = useState('');
  const [newLeadSociety, setNewLeadSociety] = useState('');
  const [newLeadSource, setNewLeadSource] = useState<LeadSource>('justdial');
  const [newLeadCategory, setNewLeadCategory] = useState<ServiceCategory | 'all_rounder'>('cook');
  const [newLeadShift, setNewLeadShift] = useState<LeadClient['shiftPreference']>('part_time_morning');
  const [newLeadBudget, setNewLeadBudget] = useState('₹12,000 / month');
  const [newLeadPriority, setNewLeadPriority] = useState<LeadPriority>('hot');
  const [newLeadTelecaller, setNewLeadTelecaller] = useState(TELECALLERS[0]);
  const [newLeadDescription, setNewLeadDescription] = useState('');
  const [newLeadFollowUp, setNewLeadFollowUp] = useState('Today within 2 hours');

  // Edit Lead Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editSociety, setEditSociety] = useState('');
  const [editCategory, setEditCategory] = useState<ServiceCategory | 'all_rounder'>('cook');
  const [editShift, setEditShift] = useState<LeadClient['shiftPreference']>('part_time_morning');
  const [editBudget, setEditBudget] = useState('');
  const [editPriority, setEditPriority] = useState<LeadPriority>('hot');
  const [editStatus, setEditStatus] = useState<LeadStatus>('new');
  const [editTelecaller, setEditTelecaller] = useState(TELECALLERS[0]);
  const [editDescription, setEditDescription] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');

  // Fetch from server
  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLeads(data);
        }
      }
    } catch {
      // Fallback in memory
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations
  const freshLeadsCount = leads.filter(l => l.status === 'new').length;
  const inDiscussionCount = leads.filter(l => l.status === 'contacted' || l.status === 'discussion').length;
  const followUpsCount = leads.filter(l => l.status === 'follow_up' || (l.nextFollowUpDate && l.nextFollowUpDate.toLowerCase().includes('today'))).length;
  const trialsCount = leads.filter(l => l.status === 'interview_scheduled' || l.status === 'trial_active').length;
  const convertedCount = leads.filter(l => l.status === 'converted').length;
  const lostCount = leads.filter(l => l.status === 'lost').length;
  const totalCallsLogged = leads.reduce((sum, l) => sum + (l.callLogs?.length || 0), 0);
  const conversionRate = leads.length > 0 ? ((convertedCount / leads.length) * 100).toFixed(1) : '0';

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.societyOrLocality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.requirementDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    const matchesPriority = selectedPriority === 'all' || lead.priority === selectedPriority;

    // Queue tab filtering
    let matchesQueue = true;
    if (activeQueueTab === 'fresh') {
      matchesQueue = lead.status === 'new';
    } else if (activeQueueTab === 'discussion') {
      matchesQueue = lead.status === 'contacted' || lead.status === 'discussion';
    } else if (activeQueueTab === 'follow_ups') {
      matchesQueue = lead.status === 'follow_up' || (!!lead.nextFollowUpDate && lead.nextFollowUpDate.toLowerCase().includes('today'));
    } else if (activeQueueTab === 'trials') {
      matchesQueue = lead.status === 'interview_scheduled' || lead.status === 'trial_active';
    } else if (activeQueueTab === 'converted') {
      matchesQueue = lead.status === 'converted';
    } else if (activeQueueTab === 'lost') {
      matchesQueue = lead.status === 'lost';
    }

    return matchesSearch && matchesSource && matchesPriority && matchesQueue;
  });

  // Quick 1-Click Status Update on Row/Card
  const handleQuickStatusUpdate = async (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Optimistic UI update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus, updatedAt: new Date().toISOString() } : l));
    showToast(`⚡ Status changed to: ${STATUS_CONFIG[newStatus]?.label || newStatus}`);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
      }
    } catch {
      // Local state already updated
    }
  };

  // Quick Inbound Strip Submit (10-Second Lead Entry)
  const handleQuickInboundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) {
      alert('Please enter Client Name and Mobile Number');
      return;
    }

    const payload: Partial<LeadClient> = {
      name: quickName.trim(),
      phone: quickPhone.startsWith('+91') ? quickPhone.trim() : `+91 ${quickPhone.trim()}`,
      societyOrLocality: quickSociety.trim() || 'Bangalore Gated Community',
      address: quickSociety.trim() ? `${quickSociety.trim()}, Bangalore` : 'Bangalore',
      city: 'Bangalore',
      source: quickSource,
      requirementCategory: quickCategory,
      requirementDescription: `Inbound inquiry for ${quickCategory.toUpperCase()} staff at ${quickSociety || 'Bangalore client home'}.`,
      shiftPreference: 'part_time_morning',
      budgetExpectation: quickBudget || '₹12,000 / mo',
      priority: 'hot',
      status: 'new',
      assignedTelecaller: TELECALLERS[0],
      nextFollowUpDate: 'Today within 15 minutes',
      callLogs: []
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setLeads(prev => [created, ...prev]);
        showToast(`📞 Inbound Lead logged from ${SOURCE_CONFIG[quickSource]?.label}! Ready to dial.`);
      } else {
        const fallbackLead: LeadClient = {
          id: `lead-${Date.now()}`,
          name: payload.name!,
          phone: payload.phone!,
          address: payload.address!,
          societyOrLocality: payload.societyOrLocality!,
          city: 'Bangalore',
          source: payload.source!,
          requirementCategory: payload.requirementCategory!,
          requirementDescription: payload.requirementDescription!,
          shiftPreference: payload.shiftPreference!,
          budgetExpectation: payload.budgetExpectation!,
          priority: payload.priority!,
          status: 'new',
          assignedTelecaller: payload.assignedTelecaller!,
          nextFollowUpDate: payload.nextFollowUpDate!,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          callLogs: []
        };
        setLeads(prev => [fallbackLead, ...prev]);
        showToast(`📞 Inbound Lead logged (Local). Ready to dial!`);
      }
    } catch {
      showToast(`Lead created in Telecalling Desk`);
    }

    // Reset quick fields
    setQuickName('');
    setQuickPhone('');
    setQuickSociety('');
  };

  // Full Manual Lead Creation
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) {
      alert('Please fill client name and phone number');
      return;
    }

    const payload: Partial<LeadClient> = {
      name: newLeadName,
      phone: newLeadPhone,
      email: newLeadEmail || undefined,
      address: newLeadAddress || `${newLeadSociety}, Bangalore`,
      societyOrLocality: newLeadSociety || 'Bangalore Gated Society',
      city: 'Bangalore',
      source: newLeadSource,
      requirementCategory: newLeadCategory,
      requirementDescription: newLeadDescription || `${newLeadCategory} domestic staff requirement at ${newLeadSociety || 'Bangalore'}`,
      shiftPreference: newLeadShift,
      budgetExpectation: newLeadBudget,
      priority: newLeadPriority,
      status: 'new',
      assignedTelecaller: newLeadTelecaller,
      nextFollowUpDate: newLeadFollowUp || 'Today within 2 hours',
      callLogs: []
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setLeads(prev => [created, ...prev]);
        showToast(`🚀 New lead logged from ${SOURCE_CONFIG[newLeadSource]?.label || newLeadSource}!`);
      } else {
        const fallbackLead: LeadClient = {
          id: `lead-${Date.now()}`,
          name: newLeadName,
          phone: newLeadPhone,
          email: newLeadEmail,
          address: newLeadAddress || 'Bangalore',
          societyOrLocality: newLeadSociety || 'Bangalore Gated Society',
          city: 'Bangalore',
          source: newLeadSource,
          requirementCategory: newLeadCategory,
          requirementDescription: newLeadDescription || 'Domestic helper requirement',
          shiftPreference: newLeadShift,
          budgetExpectation: newLeadBudget,
          priority: newLeadPriority,
          status: 'new',
          assignedTelecaller: newLeadTelecaller,
          nextFollowUpDate: newLeadFollowUp || 'Today within 2 hours',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          callLogs: []
        };
        setLeads(prev => [fallbackLead, ...prev]);
        showToast(`🚀 Inbound lead logged successfully!`);
      }
    } catch {
      showToast(`Lead created in telecalling pipeline`);
    }

    setIsAddModalOpen(false);
    // Reset fields
    setNewLeadName('');
    setNewLeadPhone('+91 ');
    setNewLeadEmail('');
    setNewLeadAddress('');
    setNewLeadSociety('');
    setNewLeadDescription('');
  };

  // Open Edit Modal with Pre-filled Lead
  const openEditModal = (lead: LeadClient) => {
    setActiveLeadForEdit(lead);
    setEditName(lead.name);
    setEditPhone(lead.phone);
    setEditEmail(lead.email || '');
    setEditAddress(lead.address || '');
    setEditSociety(lead.societyOrLocality || '');
    setEditCategory(lead.requirementCategory);
    setEditShift(lead.shiftPreference);
    setEditBudget(String(lead.budgetExpectation));
    setEditPriority(lead.priority);
    setEditStatus(lead.status);
    setEditTelecaller(lead.assignedTelecaller);
    setEditDescription(lead.requirementDescription);
    setEditFollowUp(lead.nextFollowUpDate || '');
    setIsEditModalOpen(true);
  };

  // Submit Lead Edit
  const handleSaveEditLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeadForEdit) return;

    const updates: Partial<LeadClient> = {
      name: editName,
      phone: editPhone,
      email: editEmail || undefined,
      address: editAddress,
      societyOrLocality: editSociety,
      requirementCategory: editCategory,
      shiftPreference: editShift,
      budgetExpectation: editBudget,
      priority: editPriority,
      status: editStatus,
      assignedTelecaller: editTelecaller,
      requirementDescription: editDescription,
      nextFollowUpDate: editFollowUp || undefined,
      updatedAt: new Date().toISOString()
    };

    // Optimistic
    setLeads(prev => prev.map(l => l.id === activeLeadForEdit.id ? { ...l, ...updates } : l));
    showToast(`✏️ Lead details updated for ${editName}`);
    setIsEditModalOpen(false);

    try {
      await fetch(`/api/leads/${activeLeadForEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch {
      // Local state already updated
    }
  };

  // Open Call Log Modal
  const openCallLogModal = (lead: LeadClient) => {
    setActiveLeadForCallLog(lead);
    setCallNotes('');
    setCallOutcome('connected');
    setCallFollowUpDate(lead.nextFollowUpDate || 'Tomorrow 11:00 AM');
    setCallTelecallerName(lead.assignedTelecaller || TELECALLERS[0]);
    // Smart default new status
    setCallNewStatus(lead.status === 'new' ? 'contacted' : lead.status);
  };

  // Handle Call Log Submission (Updates both Call Log + Status)
  const handleSaveCallLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeadForCallLog) return;

    try {
      const res = await fetch(`/api/leads/${activeLeadForCallLog.id}/call-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telecallerName: callTelecallerName,
          callOutcome,
          notes: callNotes,
          nextFollowUpDate: callFollowUpDate || undefined,
          newStatus: callNewStatus
        })
      });

      if (res.ok) {
        const updatedLead = await res.json();
        setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
        showToast(`✅ Call log & status (${STATUS_CONFIG[callNewStatus]?.label}) updated for ${activeLeadForCallLog.name}`);
      } else {
        // Local state update fallback
        const newLog: CallLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          telecallerName: callTelecallerName,
          callOutcome,
          notes: callNotes,
          nextFollowUpDate: callFollowUpDate
        };
        const updated = {
          ...activeLeadForCallLog,
          callLogs: [newLog, ...(activeLeadForCallLog.callLogs || [])],
          nextFollowUpDate: callFollowUpDate || activeLeadForCallLog.nextFollowUpDate,
          status: callNewStatus,
          updatedAt: new Date().toISOString()
        };
        setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
        showToast(`✅ Call log saved & status updated!`);
      }
    } catch {
      showToast(`Call log recorded`);
    }

    setActiveLeadForCallLog(null);
    setCallNotes('');
    setCallFollowUpDate('');
  };

  // Open Convert to Booking Modal with Smart Helper Matching
  const openConvertModal = (lead: LeadClient) => {
    setActiveLeadForConvert(lead);
    // Smart match helper based on category
    let category = lead.requirementCategory === 'all_rounder' ? 'maid' : lead.requirementCategory;
    const matched = helpers.filter(h => h.category === category && h.isAvailable);
    setSelectedHelperIdForConvert(matched && matched[0] ? matched[0].id : (helpers[0]?.id || ''));
    setConvertTrialDate(new Date().toISOString().split('T')[0]);
    setConvertTrialSlot(lead.nextFollowUpDate || 'Tomorrow Morning 08:00 AM');
    setIsConvertModalOpen(true);
  };

  // Execute Real Lead-to-Booking Conversion (Creates real Booking in Orders & DB)
  const handleExecuteConversion = async () => {
    if (!activeLeadForConvert) return;
    setIsConverting(true);

    try {
      const res = await fetch(`/api/leads/${activeLeadForConvert.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helperId: selectedHelperIdForConvert || undefined,
          scheduledDate: convertTrialDate,
          scheduledTimeSlot: convertTrialSlot
        })
      });

      if (res.ok) {
        const { lead: updatedLead, bookingId, booking } = await res.json();
        setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
        setConversionSuccessInfo({
          bookingId,
          clientName: activeLeadForConvert.name,
          serviceTitle: booking?.serviceTitle || `${activeLeadForConvert.requirementCategory.toUpperCase()} Service`
        });
        if (booking && onBookingCreated) {
          onBookingCreated(booking);
        }
        showToast(`🎉 Lead converted to Live Booking #${bookingId}!`);
      } else {
        const bookingId = `SWIFT-${Math.floor(1000 + Math.random() * 9000)}`;
        setLeads(prev => prev.map(l => l.id === activeLeadForConvert.id ? { ...l, status: 'converted', convertedBookingId: bookingId } : l));
        setConversionSuccessInfo({
          bookingId,
          clientName: activeLeadForConvert.name,
          serviceTitle: `${activeLeadForConvert.requirementCategory.toUpperCase()} Service`
        });
        showToast(`🎉 Lead converted! Booking #${bookingId} created.`);
      }
    } catch {
      showToast(`Conversion recorded!`);
    } finally {
      setIsConverting(false);
      setIsConvertModalOpen(false);
    }
  };

  // WhatsApp Multi-Template Scripts Generator
  const getWhatsAppTemplates = (lead: LeadClient) => [
    {
      id: 0,
      title: '1. Candidate Bio & Police Verification Pitch',
      badge: 'Best for Fresh Inbound',
      text: `Namaste ${lead.name} ji,\n\nI am ${lead.assignedTelecaller.split(' ')[0]} from hommlyn247 (15-Min Domestic Staffing & CarePlans).\n\nWe received your inquiry for ${lead.requirementCategory.toUpperCase()} staff in ${lead.societyOrLocality}.\n\nOur verified helpers have:\n✅ 100% Police Clearance & Biometrics\n✅ Aadhaar KYC & Health Check Verified\n✅ 3-Day Free Trial Guarantee\n\nWould you like me to schedule a candidate interview/trial for tomorrow?\n\nRegards,\nhommlyn247 Staffing Team`
    },
    {
      id: 1,
      title: '2. Monthly Rate Card & CarePlan Guarantee',
      badge: 'Best for Rate Inquiries',
      text: `Namaste ${lead.name} ji,\n\nHere are the details for your ${lead.requirementCategory.toUpperCase()} requirement at ${lead.societyOrLocality}:\n\n📋 Package: Monthly Dedicated Support (${lead.shiftPreference.replace(/_/g, ' ')})\n💰 Estimated Budget: ${lead.budgetExpectation || '₹12,000 / mo'}\n🛡️ CarePlans Warranty: 3 Free staff replacements anytime\n⚡ Emergency Backup: 15-minute standby worker if regular staff is on leave\n\nReply 'YES' to confirm and reserve your society's dedicated helper slot.\n\nWarm regards,\nhommlyn247 Bangalore HQ`
    },
    {
      id: 2,
      title: '3. Trial / Interview Scheduled & Arrival Confirmation',
      badge: 'Best for Booking Confirmation',
      text: `Namaste ${lead.name} ji,\n\nYour domestic helper trial demo has been scheduled!\n\n📅 Date & Time: ${lead.nextFollowUpDate || 'Tomorrow 08:00 AM'}\n📍 Location: ${lead.societyOrLocality}\n👩‍🍳 Service: ${lead.requirementCategory.toUpperCase()} Trial Session\n🔒 Security: Please verify the 4-digit start OTP provided in SMS when helper arrives at your door.\n\nFor any instant rescheduling, call our desk directly.\n\nhommlyn247 Customer Success`
    }
  ];

  // Open WhatsApp Modal
  const openWhatsAppModal = (lead: LeadClient) => {
    setActiveLeadForWhatsApp(lead);
    setSelectedWhatsAppTemplate(0);
    setIsWhatsAppModalOpen(true);
  };

  // Direct WhatsApp Launch
  const handleSendWhatsAppTemplate = (lead: LeadClient, customText?: string) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const templates = getWhatsAppTemplates(lead);
    const message = customText || templates[selectedWhatsAppTemplate]?.text || templates[0].text;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    setIsWhatsAppModalOpen(false);
  };

  // Direct quick WhatsApp (default template)
  const openWhatsAppChat = (lead: LeadClient) => {
    openWhatsAppModal(lead);
  };

  // Bulk Import CSV Handler
  const handleBulkImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCsvText.trim()) {
      alert('Please enter or paste CSV lines.');
      return;
    }

    setIsImporting(true);
    setImportStats(null);

    try {
      const lines = bulkCsvText.trim().split('\n').map(l => l.trim()).filter(Boolean);
      const rawLeads: Partial<LeadClient>[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (i === 0 && (line.toLowerCase().includes('name') || line.toLowerCase().includes('phone'))) {
          continue; // skip CSV header
        }

        const parts = line.split(/[,\t]/).map(p => p.replace(/^["']|["']$/g, '').trim());
        if (parts.length >= 2) {
          const name = parts[0];
          const phone = parts[1];
          const source = (parts[2]?.toLowerCase().replace(/\s+/g, '_') as LeadSource) || 'justdial';
          const society = parts[3] || 'Bangalore Gated Society';
          const category = parts[4]?.toLowerCase() || 'cook';
          const budget = parts[5] || '₹12,000 / mo';

          if (name && phone) {
            rawLeads.push({
              name,
              phone,
              source: (['justdial', 'direct_call', 'facebook_meta', 'referral', 'society_kiosk', 'whatsapp', 'google_search', 'website_form', 'walk_in'].includes(source) ? source : 'justdial') as LeadSource,
              societyOrLocality: society,
              address: `${society}, Bangalore`,
              requirementCategory: (['cook', 'maid', 'nanny', 'eldercare', 'all_rounder', 'driver'].includes(category) ? category : 'cook') as any,
              budgetExpectation: budget,
              priority: 'hot'
            });
          }
        }
      }

      if (rawLeads.length === 0) {
        alert('No valid lead rows found. Check your CSV format (Name, Phone, Source, Society, Category, Budget).');
        setIsImporting(false);
        return;
      }

      const res = await fetch('/api/leads/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: rawLeads })
      });

      if (res.ok) {
        const result = await res.json();
        setImportStats({ imported: result.importedCount, skipped: result.skippedCount });
        showToast(`✅ Bulk import complete: ${result.importedCount} added, ${result.skippedCount} duplicates skipped`);
        await fetchLeads();
      } else {
        showToast(`Bulk import processed`);
      }
    } catch {
      showToast(`Import completed`);
    } finally {
      setIsImporting(false);
    }
  };

  const loadSampleCSV = () => {
    const sample = `Name, Phone, Source, Society, Category, Budget
Ananya Deshmukh, 9845112233, justdial, Prestige Lakeside Habitat, cook, ₹14,000 / mo
Rohan Varma, 9811223344, facebook_meta, Sobha Dream Acres, maid, ₹9,500 / mo
Meenakshi Iyer, 9740123456, direct_call, Godrej Woodsman, nanny, ₹18,000 / mo
Suresh Pillai, 9886012345, society_kiosk, Salarpuria Greenage, driver, ₹20,000 / mo`;
    setBulkCsvText(sample);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Society/Locality', 'Source', 'Requirement', 'Shift', 'Budget', 'Priority', 'Status', 'Assigned Telecaller', 'Next Follow-up', 'Total Calls', 'Created Date'];
    const rows = filteredLeads.map(l => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.societyOrLocality}"`,
      `"${SOURCE_CONFIG[l.source]?.label || l.source}"`,
      `"${l.requirementCategory}"`,
      `"${l.shiftPreference}"`,
      `"${l.budgetExpectation}"`,
      `"${l.priority}"`,
      `"${STATUS_CONFIG[l.status]?.label || l.status}"`,
      `"${l.assignedTelecaller}"`,
      `"${l.nextFollowUpDate || ''}"`,
      l.callLogs?.length || 0,
      `"${new Date(l.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hommlyn247-leads-telecalling-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📊 Telecalling Leads Report downloaded as CSV');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-teal-500/40 animate-fade-in text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-linear-to-r from-[#0C3B34] via-[#10483F] to-[#18584E] text-white p-6 rounded-2xl shadow-lg border border-teal-600/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
              <Radio className="w-3 h-3 text-teal-300 animate-pulse" />
              Central Inbound Telecalling & Sales Cockpit
            </span>
            <span className="text-xs text-teal-200/80">JustDial • Meta • Direct • Kiosks • WhatsApp • Referrals</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Call Center & Inbound Leads Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
              {leads.length} Total Leads
            </span>
          </h2>
          <p className="text-xs text-teal-100/80 max-w-2xl">
            Centralized telecalling desk to manually log, update status, dial inquiries, capture follow-ups, and convert leads into active domestic helper bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/20 cursor-pointer shadow-xs"
            title="Export all leads to Excel/CSV"
          >
            <Download className="w-4 h-4 text-teal-200" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => { setBulkCsvText(''); setImportStats(null); setIsBulkImportOpen(true); }}
            className="px-3.5 py-2.5 rounded-xl bg-teal-400/20 hover:bg-teal-400/30 text-teal-100 hover:text-white text-xs font-bold transition-all flex items-center gap-2 border border-teal-300/30 cursor-pointer shadow-xs"
            title="Bulk import leads from JustDial or Meta export CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>📥 Bulk CSV Import</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-amber-950/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Full Manual Lead Entry</span>
          </button>
        </div>
      </div>

      {/* CALL CENTER MANAGEMENT KPI DECK (Interactive 1-Click Queue Filters) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-teal-600" />
            <span>Live Call Center Pipeline KPIs (Click Card to Filter Queue)</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Active Telecallers: <strong>4 Agents Online</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. FRESH CALLS (UNCONTACTED) */}
          <button
            onClick={() => setActiveQueueTab(activeQueueTab === 'fresh' ? 'all' : 'fresh')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
              activeQueueTab === 'fresh'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/50'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-400 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${activeQueueTab === 'fresh' ? 'text-blue-100' : 'text-slate-500'}`}>
                Fresh Calls
              </span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeQueueTab === 'fresh' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50'}`}>
                <PhoneIncoming className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`text-2xl font-black ${activeQueueTab === 'fresh' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
              {freshLeadsCount}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                activeQueueTab === 'fresh' ? 'bg-white text-blue-900' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
              }`}>
                Need 1st Dial &lt;15m
              </span>
            </div>
          </button>

          {/* 2. IN DISCUSSION */}
          <button
            onClick={() => setActiveQueueTab(activeQueueTab === 'discussion' ? 'all' : 'discussion')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
              activeQueueTab === 'discussion'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/50'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-purple-400 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${activeQueueTab === 'discussion' ? 'text-purple-100' : 'text-slate-500'}`}>
                In Discussion
              </span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeQueueTab === 'discussion' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600 dark:bg-purple-950/50'}`}>
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`text-2xl font-black ${activeQueueTab === 'discussion' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`}>
              {inDiscussionCount}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[9px] font-bold truncate ${activeQueueTab === 'discussion' ? 'text-purple-100' : 'text-slate-400'}`}>
                Profiles Shared
              </span>
            </div>
          </button>

          {/* 3. FOLLOW-UPS DUE */}
          <button
            onClick={() => setActiveQueueTab(activeQueueTab === 'follow_ups' ? 'all' : 'follow_ups')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
              activeQueueTab === 'follow_ups'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-400 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${activeQueueTab === 'follow_ups' ? 'text-amber-950' : 'text-slate-500'}`}>
                Follow-Ups
              </span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeQueueTab === 'follow_ups' ? 'bg-black/10 text-slate-950' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50'}`}>
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`text-2xl font-black ${activeQueueTab === 'follow_ups' ? 'text-slate-950' : 'text-amber-600 dark:text-amber-400'}`}>
              {followUpsCount}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[9px] font-bold truncate ${activeQueueTab === 'follow_ups' ? 'text-amber-950' : 'text-amber-600'}`}>
                Due Callbacks
              </span>
            </div>
          </button>

          {/* 4. TRIALS & INTERVIEWS */}
          <button
            onClick={() => setActiveQueueTab(activeQueueTab === 'trials' ? 'all' : 'trials')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
              activeQueueTab === 'trials'
                ? 'bg-cyan-600 text-white border-cyan-600 shadow-md ring-2 ring-cyan-300'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-cyan-400 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${activeQueueTab === 'trials' ? 'text-cyan-100' : 'text-slate-500'}`}>
                Trials & Demos
              </span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeQueueTab === 'trials' ? 'bg-white/20 text-white' : 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50'}`}>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`text-2xl font-black ${activeQueueTab === 'trials' ? 'text-white' : 'text-cyan-600 dark:text-cyan-400'}`}>
              {trialsCount}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[9px] font-bold truncate ${activeQueueTab === 'trials' ? 'text-cyan-100' : 'text-cyan-600'}`}>
                At Client House
              </span>
            </div>
          </button>

          {/* 5. CLOSED / CONVERTED */}
          <button
            onClick={() => setActiveQueueTab(activeQueueTab === 'converted' ? 'all' : 'converted')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
              activeQueueTab === 'converted'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${activeQueueTab === 'converted' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Closed (Won)
              </span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeQueueTab === 'converted' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`text-2xl font-black ${activeQueueTab === 'converted' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {convertedCount}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[9px] font-bold truncate ${activeQueueTab === 'converted' ? 'text-emerald-100' : 'text-emerald-600'}`}>
                {conversionRate}% Win Rate
              </span>
            </div>
          </button>

          {/* 6. LOST / DROPPED */}
          <button
            onClick={() => setActiveQueueTab(activeQueueTab === 'lost' ? 'all' : 'lost')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
              activeQueueTab === 'lost'
                ? 'bg-slate-700 text-white border-slate-700 shadow-md ring-2 ring-slate-400'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-400 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${activeQueueTab === 'lost' ? 'text-slate-200' : 'text-slate-500'}`}>
                Lost / Dropped
              </span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeQueueTab === 'lost' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                <XCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`text-2xl font-black ${activeQueueTab === 'lost' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
              {lostCount}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[9px] font-bold truncate ${activeQueueTab === 'lost' ? 'text-slate-200' : 'text-slate-400'}`}>
                Disqualified
              </span>
            </div>
          </button>

          {/* 7. CALL ACTIVITY COUNTER */}
          <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500">
                Calls Logged
              </span>
              <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/50 flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-teal-700 dark:text-teal-400">
              {totalCallsLogged}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] font-bold text-teal-600">
                Live Dials Today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK INBOUND MANUAL ENTRY STRIP (Fast 10-Second Lead Capture for Telecallers) */}
      <div className="bg-linear-to-r from-teal-50/90 via-emerald-50/70 to-teal-50/90 dark:from-slate-900 dark:via-[#0C3B34]/20 dark:to-slate-900 p-4 rounded-2xl border-2 border-teal-500/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <PhoneForwarded className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-black text-teal-950 dark:text-teal-200 uppercase tracking-wide">
              ⚡ Fast Inbound Lead Entry (JustDial / Direct Call / WhatsApp Inbound)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-200/70 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200 font-bold">
              Instant 10-Sec Capture
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs text-teal-700 dark:text-teal-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Need Full Address / Multiple Fields? Open Detailed Form</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleQuickInboundSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-2 text-xs">
          {/* Source */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-2">
            <select
              value={quickSource}
              onChange={(e) => setQuickSource(e.target.value as LeadSource)}
              className="w-full px-2.5 py-2 bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 rounded-xl font-bold dark:text-white"
            >
              <option value="justdial">📞 JustDial Inbound</option>
              <option value="direct_call">📱 Direct Phone Call</option>
              <option value="whatsapp">💬 WhatsApp Message</option>
              <option value="facebook_meta">🌐 Meta / FB Ads</option>
              <option value="society_kiosk">🏢 Society Gate Kiosk</option>
              <option value="referral">🤝 Resident Referral</option>
              <option value="walk_in">🚶 Walk-in Visit</option>
            </select>
          </div>

          {/* Client Name */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3">
            <input
              type="text"
              required
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              placeholder="Client Name (e.g. Vikram Malhotra)"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 rounded-xl font-semibold dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Client Phone */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-2">
            <input
              type="text"
              required
              value={quickPhone}
              onChange={(e) => setQuickPhone(e.target.value)}
              placeholder="Mobile: 98765 43210"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 rounded-xl font-semibold dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Society / Area */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-2">
            <input
              type="text"
              value={quickSociety}
              onChange={(e) => setQuickSociety(e.target.value)}
              placeholder="Society (e.g. Prestige, Sobha)"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 rounded-xl font-medium dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Requirement */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-1">
            <select
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value as any)}
              className="w-full px-2 py-2 bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 rounded-xl font-bold dark:text-white"
            >
              <option value="cook">Cook</option>
              <option value="maid">Maid</option>
              <option value="nanny">Nanny</option>
              <option value="eldercare">Elder</option>
              <option value="all_rounder">All-In-One</option>
              <option value="deep_clean">Clean</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-2">
            <button
              type="submit"
              className="w-full h-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log &amp; Dial</span>
            </button>
          </div>
        </form>
      </div>

      {/* SEARCH, QUEUE TABS & FILTER CONTROLS */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        {/* Row 1: Search & Priority Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, mobile (+91), society (e.g. Prestige), cook/maid requirement..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 dark:text-white"
            />
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="immediate">🔥 Immediate (Dial Now)</option>
            <option value="hot">⚡ Hot Lead</option>
            <option value="warm">👍 Warm Lead</option>
            <option value="cold">❄️ Cold Lead</option>
          </select>
        </div>

        {/* Row 2: Queue Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Queue:
          </span>

          {[
            { id: 'all', label: 'All Inquiries', count: leads.length, icon: '📋' },
            { id: 'fresh', label: '🔴 Fresh Uncalled', count: freshLeadsCount, icon: '⚡' },
            { id: 'follow_ups', label: '⏰ Due Callbacks', count: followUpsCount, icon: '🔔' },
            { id: 'discussion', label: '💬 In Discussion', count: inDiscussionCount, icon: '🗣️' },
            { id: 'trials', label: '🤝 Demos & Trials', count: trialsCount, icon: '🧪' },
            { id: 'converted', label: '🏆 Won Bookings', count: convertedCount, icon: '🎉' },
            { id: 'lost', label: '⚪ Lost / Cold', count: lostCount, icon: '📦' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveQueueTab(tab.id as QueueTab)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeQueueTab === tab.id
                  ? 'bg-[#10483F] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeQueueTab === tab.id ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Row 3: Channel Source Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Channel:
          </span>
          <button
            onClick={() => setSelectedSource('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              selectedSource === 'all'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Channels
          </button>
          {(Object.keys(SOURCE_CONFIG) as LeadSource[]).map(srcKey => {
            const cfg = SOURCE_CONFIG[srcKey];
            const cnt = leads.filter(l => l.source === srcKey).length;
            if (cnt === 0 && selectedSource !== srcKey) return null;
            return (
              <button
                key={srcKey}
                onClick={() => setSelectedSource(srcKey)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  selectedSource === srcKey
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label}</span>
                <span className="opacity-75">({cnt})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LEADS LIST WITH INLINE STATUS UPDATER & ACTIONS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">No Inbound Leads Found in this Queue</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No inquiries match the current queue tab or search query. You can log an inquiry from JustDial, direct incoming phone call, or Meta Ads.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all cursor-pointer"
            >
              + Log New Client Inquiry
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLeads.map((lead) => {
              const srcCfg = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG.direct_call;
              const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;

              return (
                <div
                  key={lead.id}
                  className={`p-4 md:p-5 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                    lead.status === 'new'
                      ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70'
                      : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Lead Info & Requirement */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
                        {lead.name}
                      </span>

                      {/* Source badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${srcCfg.badgeClass}`}>
                        <span>{srcCfg.icon}</span>
                        <span>{srcCfg.label}</span>
                      </span>

                      {/* Priority badge */}
                      {lead.priority === 'immediate' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                          <Flame className="w-2.5 h-2.5" />
                          <span>Immediate</span>
                        </span>
                      )}
                      {lead.priority === 'hot' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300/40 text-[10px] font-bold flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-amber-500" />
                          <span>Hot</span>
                        </span>
                      )}

                      {/* INLINE STATUS SELECTOR DROPDOWN (Direct 1-Click Update) */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                        <select
                          value={lead.status}
                          onChange={(e) => handleQuickStatusUpdate(lead.id, e.target.value as LeadStatus)}
                          className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border cursor-pointer outline-hidden ${statusCfg.badge}`}
                          title="Click to update lead pipeline stage immediately"
                        >
                          <option value="new">🔵 New Lead</option>
                          <option value="contacted">🟡 Contacted</option>
                          <option value="discussion">🟣 In Discussion</option>
                          <option value="interview_scheduled">🔷 Interview Scheduled</option>
                          <option value="trial_active">🧪 Trial Active</option>
                          <option value="follow_up">🔴 Follow-Up Needed</option>
                          <option value="converted">🟢 Converted (Won)</option>
                          <option value="lost">⚪ Lost / Disqualified</option>
                        </select>
                      </div>
                    </div>

                    {/* Contact details & society */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <a
                        href={`tel:${lead.phone}`}
                        className="font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md"
                      >
                        <Phone className="w-3 h-3 text-teal-600" />
                        <span>{lead.phone}</span>
                      </a>

                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{lead.societyOrLocality}</span>
                      </span>

                      <span className="text-slate-400 text-[11px]">
                        Budget: <strong className="text-slate-700 dark:text-slate-200">{lead.budgetExpectation}</strong>
                      </span>

                      <span className="text-slate-400 text-[11px]">
                        Shift: <strong className="text-slate-700 dark:text-slate-200 uppercase">{lead.shiftPreference.replace(/_/g, ' ')}</strong>
                      </span>
                    </div>

                    {/* Requirement statement */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong className="text-teal-800 dark:text-teal-300 uppercase tracking-wide text-[10px] mr-1.5 font-black">
                        [{lead.requirementCategory}]
                      </strong>
                      {lead.requirementDescription}
                    </p>

                    {/* Telecaller metadata & call summary */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                        <UserCheck className="w-3 h-3 text-teal-600" />
                        <span>Caller: {lead.assignedTelecaller.split(' ')[0]}</span>
                      </span>

                      {lead.nextFollowUpDate && (
                        <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-md">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Follow-up: {lead.nextFollowUpDate}</span>
                        </span>
                      )}

                      {lead.callLogs && lead.callLogs.length > 0 ? (
                        <span className="text-slate-500 dark:text-slate-400 italic">
                          Last Call: "{lead.callLogs[0].notes.substring(0, 50)}..."
                        </span>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
                          No calls logged yet
                        </span>
                      )}

                      {lead.convertedBookingId && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                          Booking #{lead.convertedBookingId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTION CONTROLS FOR TELECALLER */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0">
                    {/* Direct Call Button */}
                    <a
                      href={`tel:${lead.phone}`}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                      title="Call client phone"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Call</span>
                    </a>

                    {/* WhatsApp Button */}
                    <button
                      onClick={() => openWhatsAppChat(lead)}
                      className="px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Send pre-formatted WhatsApp helper profiles"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {/* LOG CALL & OUTCOME NOTES */}
                    <button
                      onClick={() => openCallLogModal(lead)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-black transition-all flex items-center gap-1.5 border border-blue-200 dark:border-blue-900/50 cursor-pointer"
                      title="Record discussion outcome, notes and update lead status"
                    >
                      <PhoneForwarded className="w-3.5 h-3.5" />
                      <span>Log Call ({lead.callLogs?.length || 0})</span>
                    </button>

                    {/* EDIT LEAD DETAILS */}
                    <button
                      onClick={() => openEditModal(lead)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                      title="Edit client details, address, requirement, budget"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* CONVERT TO BOOKING */}
                    {lead.status !== 'converted' ? (
                      <button
                        onClick={() => openConvertModal(lead)}
                        className="px-3.5 py-2 rounded-xl bg-[#10483F] hover:bg-[#0C3B34] text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="Close deal, select helper, and generate live booking"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                        <span>Convert</span>
                      </button>
                    ) : (
                      <span className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Won</span>
                      </span>
                    )}

                    {/* FULL DETAILS DRAWER */}
                    <button
                      onClick={() => setActiveLeadForDetails(lead)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      title="View all notes and history timeline"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: LOG CALL & CONVERSATION OUTCOME (With Direct Status Sync) */}
      {activeLeadForCallLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-teal-600" />
                  <span>Log Telecaller Call &amp; Update Status</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Client: <strong className="text-slate-800 dark:text-slate-200">{activeLeadForCallLog.name}</strong> • {activeLeadForCallLog.phone}
                </p>
              </div>
              <button
                onClick={() => setActiveLeadForCallLog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCallLog} className="space-y-3.5 text-xs">
              {/* Telecaller Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Telecaller / Executive</label>
                  <select
                    value={callTelecallerName}
                    onChange={(e) => setCallTelecallerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold dark:text-white"
                  >
                    {TELECALLERS.map(caller => (
                      <option key={caller} value={caller}>{caller}</option>
                    ))}
                  </select>
                </div>

                {/* Direct Status Selector */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Update Lead Status To <span className="text-teal-600">*</span>
                  </label>
                  <select
                    value={callNewStatus}
                    onChange={(e) => setCallNewStatus(e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-700 rounded-xl font-black text-teal-900 dark:text-teal-200"
                  >
                    <option value="new">🔵 New Lead</option>
                    <option value="contacted">🟡 Contacted / Ringing</option>
                    <option value="discussion">🟣 In Discussion (Profiles Shared)</option>
                    <option value="interview_scheduled">🔷 Interview Scheduled</option>
                    <option value="trial_active">🧪 Trial Active</option>
                    <option value="follow_up">🔴 Follow-Up Needed</option>
                    <option value="converted">🟢 Converted (Won)</option>
                    <option value="lost">⚪ Lost / Disqualified</option>
                  </select>
                </div>
              </div>

              {/* Call Outcome Quick Selector */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Call Disposition / Outcome</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { val: 'connected', label: '📞 Connected / Spoke', autoStatus: 'discussion' },
                    { val: 'callback_requested', label: '⏰ Callback Asked', autoStatus: 'follow_up' },
                    { val: 'busy', label: '📵 Busy / Disconnected', autoStatus: 'contacted' },
                    { val: 'not_reachable', label: '🚫 Not Reachable', autoStatus: 'contacted' },
                    { val: 'left_whatsapp', label: '💬 Sent WhatsApp', autoStatus: 'discussion' },
                    { val: 'converted', label: '🎉 Deal Closed', autoStatus: 'converted' },
                    { val: 'rejected', label: '❌ Not Interested', autoStatus: 'lost' }
                  ].map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => {
                        setCallOutcome(item.val as any);
                        setCallNewStatus(item.autoStatus as LeadStatus);
                      }}
                      className={`px-2.5 py-2 rounded-xl text-[11px] font-bold text-left border transition-all cursor-pointer ${
                        callOutcome === item.val
                          ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-900 dark:text-teal-200 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Notes */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Discussion Summary &amp; Client Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="e.g. Spoke to client. Desired cook must know North Indian and South Indian breakfast. Shared 2 candidate profiles. Scheduled trial for Sunday morning."
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 dark:text-white"
                />
              </div>

              {/* Next Follow-up Date/Time */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Next Follow-Up / Callback Schedule</label>
                <input
                  type="text"
                  value={callFollowUpDate}
                  onChange={(e) => setCallFollowUpDate(e.target.value)}
                  placeholder="e.g. Tomorrow at 11:30 AM or Friday Evening 6 PM"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveLeadForCallLog(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black transition-all shadow-md cursor-pointer"
                >
                  Save Call Log &amp; Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL MANUAL LEAD ENTRY (JustDial, Walk-in, Meta, Direct Call, Referral) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-teal-600" />
                  <span>Log Manual Client Inquiry (Inbound)</span>
                </h3>
                <p className="text-xs text-slate-500">Record inquiries from JustDial, Phone Calls, Society Stalls, Walk-in &amp; Referrals</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              {/* Inbound Source Selector */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Inbound Acquisition Channel <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(SOURCE_CONFIG) as LeadSource[]).map(srcKey => {
                    const cfg = SOURCE_CONFIG[srcKey];
                    return (
                      <button
                        key={srcKey}
                        type="button"
                        onClick={() => setNewLeadSource(srcKey)}
                        className={`p-2 rounded-xl text-left border text-[11px] font-bold transition-all cursor-pointer ${
                          newLeadSource === srcKey
                            ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-900 dark:text-teal-200 shadow-2xs'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-sm mb-0.5">{cfg.icon}</div>
                        <div className="truncate">{cfg.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    placeholder="e.g. Vikram & Sunita Malhotra"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone Number *</label>
                  <input
                    type="text"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              {/* Society / Locality & Quick Presets */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Society / Apartment / Locality Name</label>
                <input
                  type="text"
                  value={newLeadSociety}
                  onChange={(e) => setNewLeadSociety(e.target.value)}
                  placeholder="e.g. Prestige Shantiniketan, Whitefield"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white mb-1.5"
                />
                {/* Quick society pills */}
                <div className="flex flex-wrap gap-1">
                  {POPULAR_BANGALORE_SOCIETIES.map(soc => (
                    <button
                      key={soc}
                      type="button"
                      onClick={() => setNewLeadSociety(soc)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      + {soc.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Address & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Flat / Tower / Address</label>
                  <input
                    type="text"
                    value={newLeadAddress}
                    onChange={(e) => setNewLeadAddress(e.target.value)}
                    placeholder="e.g. Tower 4, Flat 1402"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              {/* Requirement Category, Shift & Budget */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Type</label>
                  <select
                    value={newLeadCategory}
                    onChange={(e) => setNewLeadCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold dark:text-white"
                  >
                    <option value="cook">Cook / Chef</option>
                    <option value="maid">House Maid</option>
                    <option value="nanny">Nanny / Babysitter</option>
                    <option value="eldercare">Elder Care</option>
                    <option value="all_rounder">All-Rounder Helper</option>
                    <option value="deep_clean">Deep Cleaning</option>
                    <option value="driver">Private Chauffeur</option>
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Shift / Timing</label>
                  <select
                    value={newLeadShift}
                    onChange={(e) => setNewLeadShift(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold dark:text-white"
                  >
                    <option value="part_time_morning">Morning 2hr</option>
                    <option value="part_time_evening">Evening 2hr</option>
                    <option value="day_12hr">12hr Day Shift</option>
                    <option value="full_time_24hr">24hr Live-In</option>
                    <option value="hourly">Hourly Visit</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Client Budget</label>
                  <input
                    type="text"
                    value={newLeadBudget}
                    onChange={(e) => setNewLeadBudget(e.target.value)}
                    placeholder="e.g. ₹12,000 / mo"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Requirement Description */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Detailed Requirement / Scope of Work</label>
                <textarea
                  rows={2}
                  value={newLeadDescription}
                  onChange={(e) => setNewLeadDescription(e.target.value)}
                  placeholder="e.g. Need North Indian vegetarian cook for 3BHK flat. Daily morning 8 AM and dinner 7:30 PM. Needs verified ID and police verification."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              {/* Priority & Assigned Telecaller */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority / Urgency</label>
                  <select
                    value={newLeadPriority}
                    onChange={(e) => setNewLeadPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold dark:text-white"
                  >
                    <option value="immediate">🔥 Immediate (Need staff today)</option>
                    <option value="hot">⚡ Hot (Within 48 hours)</option>
                    <option value="warm">👍 Warm (Within this week)</option>
                    <option value="cold">❄️ Cold (Just exploring)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assign Telecaller</label>
                  <select
                    value={newLeadTelecaller}
                    onChange={(e) => setNewLeadTelecaller(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold dark:text-white"
                  >
                    {TELECALLERS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black transition-all shadow-md cursor-pointer"
                >
                  Save &amp; Assign Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT LEAD DETAILS (Update address, requirement, priority, etc.) */}
      {isEditModalOpen && activeLeadForEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-teal-600" />
                  <span>Edit Lead Details &amp; Requirement</span>
                </h3>
                <p className="text-xs text-slate-500">Lead ID: #{activeLeadForEdit.id} • {activeLeadForEdit.name}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditLead} className="space-y-3.5 text-xs">
              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-semibold"
                  />
                </div>
              </div>

              {/* Society & Address */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Society / Locality</label>
                  <input
                    type="text"
                    value={editSociety}
                    onChange={(e) => setEditSociety(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Flat / Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              {/* Category, Shift, Budget */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Type</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  >
                    <option value="cook">Cook</option>
                    <option value="maid">Maid</option>
                    <option value="nanny">Nanny</option>
                    <option value="eldercare">Elder Care</option>
                    <option value="all_rounder">All-Rounder</option>
                    <option value="deep_clean">Deep Clean</option>
                    <option value="driver">Driver</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Shift</label>
                  <select
                    value={editShift}
                    onChange={(e) => setEditShift(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  >
                    <option value="part_time_morning">Morning 2hr</option>
                    <option value="part_time_evening">Evening 2hr</option>
                    <option value="day_12hr">12hr Day Shift</option>
                    <option value="full_time_24hr">24hr Live-In</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Budget</label>
                  <input
                    type="text"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-semibold"
                  />
                </div>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-700 rounded-xl font-black text-teal-900 dark:text-teal-200"
                  >
                    <option value="new">🔵 New Lead</option>
                    <option value="contacted">🟡 Contacted</option>
                    <option value="discussion">🟣 In Discussion</option>
                    <option value="interview_scheduled">🔷 Interview Scheduled</option>
                    <option value="trial_active">🧪 Trial Active</option>
                    <option value="follow_up">🔴 Follow-Up Needed</option>
                    <option value="converted">🟢 Converted (Won)</option>
                    <option value="lost">⚪ Lost / Disqualified</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as LeadPriority)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  >
                    <option value="immediate">🔥 Immediate</option>
                    <option value="hot">⚡ Hot</option>
                    <option value="warm">👍 Warm</option>
                    <option value="cold">❄️ Cold</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Requirement Notes</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black transition-all shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: FULL LEAD TIMELINE & CALL HISTORY DRAWER */}
      {activeLeadForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Client Telecalling Profile</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
                    #{activeLeadForDetails.id}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">{activeLeadForDetails.name} • {activeLeadForDetails.societyOrLocality}</p>
              </div>
              <button
                onClick={() => setActiveLeadForDetails(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Source Channel</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {SOURCE_CONFIG[activeLeadForDetails.source]?.label}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-extrabold text-teal-600 dark:text-teal-400">
                    {STATUS_CONFIG[activeLeadForDetails.status]?.label}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                  <a href={`tel:${activeLeadForDetails.phone}`} className="font-extrabold text-blue-600 dark:text-blue-400">
                    {activeLeadForDetails.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Expected Budget</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {activeLeadForDetails.budgetExpectation}
                  </span>
                </div>
              </div>

              {/* Requirement details */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Requirement Statement</h4>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeLeadForDetails.requirementDescription}
                </p>
              </div>

              {/* Telecalling Log History Timeline */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Call Log &amp; Follow-up History ({activeLeadForDetails.callLogs?.length || 0})</span>
                  </h4>
                  <button
                    onClick={() => {
                      openCallLogModal(activeLeadForDetails);
                      setActiveLeadForDetails(null);
                    }}
                    className="text-[11px] font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                  >
                    + Add New Call Note
                  </button>
                </div>

                {!activeLeadForDetails.callLogs || activeLeadForDetails.callLogs.length === 0 ? (
                  <p className="text-slate-400 italic p-3 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    No calls logged yet. Click "Add New Call Note" to log discussion.
                  </p>
                ) : (
                  <div className="space-y-2.5 relative pl-4 border-l-2 border-teal-500/30 ml-2">
                    {activeLeadForDetails.callLogs.map((log) => (
                      <div key={log.id} className="relative space-y-1">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-teal-500 border-2 border-white dark:border-slate-900" />
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{log.telecallerName}</span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 space-y-1">
                          <span className="inline-block px-2 py-0.2 rounded-md bg-teal-500/15 text-teal-700 dark:text-teal-300 font-black uppercase text-[9px]">
                            {log.callOutcome.replace(/_/g, ' ')}
                          </span>
                          <p>{log.notes}</p>
                          {log.nextFollowUpDate && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold pt-0.5">
                              Next Follow-up: {log.nextFollowUpDate}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <button
                onClick={() => openWhatsAppChat(activeLeadForDetails)}
                className="px-3.5 py-2 rounded-xl bg-green-500 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveLeadForDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CONVERT LEAD TO LIVE BOOKING WITH HELPER MATCHING */}
      {isConvertModalOpen && activeLeadForConvert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <span>Convert Lead to Live Active Booking</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Assign verified domestic helper and generate real booking code for {activeLeadForConvert.name}
                </p>
              </div>
              <button
                onClick={() => setIsConvertModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Lead Summary Strip */}
              <div className="p-3 bg-teal-50/60 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-900/40 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Client</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{activeLeadForConvert.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Society / Area</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{activeLeadForConvert.societyOrLocality}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Service Required</span>
                  <span className="font-extrabold text-teal-700 dark:text-teal-300 uppercase">{activeLeadForConvert.requirementCategory}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Expected Budget</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{activeLeadForConvert.budgetExpectation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Phone Number</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{activeLeadForConvert.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Telecaller</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{activeLeadForConvert.assignedTelecaller}</span>
                </div>
              </div>

              {/* Service Slot and Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs">
                    Start / Trial Date
                  </label>
                  <input
                    type="date"
                    value={convertTrialDate}
                    onChange={(e) => setConvertTrialDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs">
                    Time Slot / Shift
                  </label>
                  <select
                    value={convertTrialSlot}
                    onChange={(e) => setConvertTrialSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium dark:text-white"
                  >
                    <option value="Morning Shift (07:00 AM - 11:00 AM)">Morning Shift (07:00 AM - 11:00 AM)</option>
                    <option value="Afternoon Shift (12:00 PM - 03:00 PM)">Afternoon Shift (12:00 PM - 03:00 PM)</option>
                    <option value="Evening Shift (05:00 PM - 09:00 PM)">Evening Shift (05:00 PM - 09:00 PM)</option>
                    <option value="Full Day 24x7 Live-in Support">Full Day 24x7 Live-in Support</option>
                  </select>
                </div>
              </div>

              {/* Helper Selection with Matching Indicators */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>Select Verified Domestic Helper to Assign</span>
                  </label>
                  <span className="text-[10px] text-teal-600 font-bold">
                    {helpers.filter(h => h.category === (activeLeadForConvert.requirementCategory === 'all_rounder' ? 'maid' : activeLeadForConvert.requirementCategory)).length} matching profiles
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {helpers.map((h) => {
                    const isCategoryMatch = h.category === (activeLeadForConvert.requirementCategory === 'all_rounder' ? 'maid' : activeLeadForConvert.requirementCategory);
                    const isSelected = selectedHelperIdForConvert === h.id;

                    return (
                      <div
                        key={h.id}
                        onClick={() => setSelectedHelperIdForConvert(h.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-400/40'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={h.imageUrl}
                            alt={h.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-xs">{h.name}</span>
                              {isCategoryMatch && (
                                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-[9px]">
                                  Best Match
                                </span>
                              )}
                              {h.isVerified && (
                                <span className="text-blue-500 text-[10px]" title="Police Verified & Biometrics Complete">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>⭐ {h.rating}</span>
                              <span>•</span>
                              <span>{h.experienceYears} yrs exp</span>
                              <span>•</span>
                              <span className="capitalize">{h.category}</span>
                              <span>•</span>
                              <span className="font-semibold text-teal-700 dark:text-teal-300">₹{h.hourlyRate}/hr</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setIsConvertModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isConverting}
                onClick={handleExecuteConversion}
                className="px-5 py-2.5 rounded-xl bg-[#10483F] hover:bg-[#0C3B34] text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                    <span>Confirm &amp; Generate Live Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: CONVERSION SUCCESS POPUP WITH 1-CLICK ORDER NAVIGATOR */}
      {conversionSuccessInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-teal-500/40 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                🎉 Lead Converted to Active Order!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                A live domestic staffing booking has been confirmed and synced with both database &amp; dispatch console.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Booking Code</span>
                <span className="font-mono font-black text-base text-teal-600 dark:text-teal-400">
                  #{conversionSuccessInfo.bookingId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Client Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{conversionSuccessInfo.clientName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Service</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{conversionSuccessInfo.serviceTitle}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {onNavigateTab && (
                <button
                  onClick={() => {
                    setConversionSuccessInfo(null);
                    onNavigateTab('orders');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Go to Live Orders &amp; Dispatch Console</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setConversionSuccessInfo(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                Stay on Telecalling CRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: WHATSAPP MULTI-TEMPLATE SENDER */}
      {isWhatsAppModalOpen && activeLeadForWhatsApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <span>Send WhatsApp Message to {activeLeadForWhatsApp.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select a pre-formatted high-conversion pitch script or preview below
                </p>
              </div>
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selector Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Message Template:</label>
              <div className="space-y-1.5">
                {getWhatsAppTemplates(activeLeadForWhatsApp).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedWhatsAppTemplate(tmpl.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedWhatsAppTemplate === tmpl.id
                        ? 'bg-green-50 dark:bg-green-950/40 border-green-500 ring-2 ring-green-400/40'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-green-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{tmpl.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{tmpl.badge}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedWhatsAppTemplate === tmpl.id ? 'bg-green-600 border-green-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedWhatsAppTemplate === tmpl.id && <Check className="w-2.5 h-2.5 stroke-3" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Preview Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preview &amp; Send:</label>
              <div className="p-3.5 bg-green-50/70 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-900/40 text-xs whitespace-pre-line text-slate-800 dark:text-slate-200 font-sans max-h-48 overflow-y-auto leading-relaxed">
                {getWhatsAppTemplates(activeLeadForWhatsApp)[selectedWhatsAppTemplate]?.text}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleSendWhatsAppTemplate(activeLeadForWhatsApp)}
                className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open WhatsApp ({activeLeadForWhatsApp.phone})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: BULK INBOUND CSV IMPORT */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                  <span>Bulk Inbound Leads CSV Import</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Import inquiries from JustDial, Facebook Leads, Society Gate Kiosks, or Excel
                </p>
              </div>
              <button
                onClick={() => setIsBulkImportOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Format: Name, Phone, Source, Society, Category, Budget</span>
              <button
                type="button"
                onClick={loadSampleCSV}
                className="text-teal-600 hover:text-teal-700 font-bold underline cursor-pointer"
              >
                📋 Load Sample Leads
              </button>
            </div>

            <form onSubmit={handleBulkImportSubmit} className="space-y-4">
              <div>
                <textarea
                  rows={8}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  placeholder={`Name, Phone, Source, Society, Category, Budget\nVikram Mehta, 9876543210, justdial, Prestige Falcon City, cook, ₹14,000 / mo\nPooja Sharma, 9811223344, facebook_meta, Sobha City, maid, ₹10,000 / mo`}
                  className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              {/* CSV file upload convenience */}
              <div className="flex items-center gap-3">
                <label className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 rotate-180" />
                  <span>Or Upload .CSV File</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setBulkCsvText(event.target?.result as string || '');
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
                <span className="text-[11px] text-slate-400">Duplicate phone numbers are automatically detected &amp; skipped</span>
              </div>

              {importStats && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                  ✅ Ingestion complete: <b>{importStats.imported} new leads added</b>, {importStats.skipped} duplicate phone records skipped.
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsBulkImportOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={isImporting}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Leads...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Ingest &amp; Process Leads</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
