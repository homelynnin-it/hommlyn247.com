import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Sparkles,
  X,
  Save,
  RefreshCw,
  Clock,
  Layers,
  IndianRupee
} from 'lucide-react';
import { CarePlan, ServiceCategory } from '../../types';

interface CarePlansCMSProps {
  carePlans?: CarePlan[];
  onRefresh?: () => void;
}

export const CarePlansCMS: React.FC<CarePlansCMSProps> = ({
  carePlans: initialCarePlans = [],
  onRefresh
}) => {
  const [plans, setPlans] = useState<CarePlan[]>(initialCarePlans);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CarePlan | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [durationMonths, setDurationMonths] = useState('3');
  const [price, setPrice] = useState('1499');
  const [category, setCategory] = useState<ServiceCategory>('maid');
  const [badge, setBadge] = useState('Popular Society Choice');
  const [featureInputs, setFeatureInputs] = useState<string>('Unlimited Free Replacements in 24 Hrs\nPolice Verification Dossier Included\nDedicated Relationship Officer\nZero Hidden Commission');
  const [isPopular, setIsPopular] = useState(false);
  const [prioritySupport, setPrioritySupport] = useState(true);

  const fetchCarePlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/careplans');
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (e) {
      console.warn('Error fetching careplans:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCarePlans && initialCarePlans.length > 0) {
      setPlans(initialCarePlans);
    } else {
      fetchCarePlans();
    }
  }, [initialCarePlans]);

  const showToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = featureInputs
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const payload = {
      title: title.trim(),
      code: code.trim().toUpperCase() || `CP-${Date.now().toString().slice(-4)}`,
      durationMonths: parseInt(durationMonths, 10) || 3,
      price: parseInt(price, 10) || 1499,
      category,
      badge: badge.trim(),
      features: featuresList,
      isPopular,
      prioritySupport
    };

    try {
      if (editingPlan) {
        // PUT update
        const res = await fetch(`/api/careplans/${editingPlan.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
          showToast(`CarePlan "${updated.title}" updated via API!`);
        }
      } else {
        // POST create
        const res = await fetch('/api/careplans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setPlans(prev => [created, ...prev]);
          showToast(`CarePlan "${created.title}" created via API!`);
        }
      }

      setIsAddOpen(false);
      setEditingPlan(null);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error('CarePlan save error:', e);
      showToast('API Operation Failed. Please check server logs.');
    }
  };

  const handleDelete = async (id: string, planTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete CarePlan "${planTitle}"?`)) return;
    try {
      const res = await fetch(`/api/careplans/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlans(prev => prev.filter(p => p.id !== id));
        showToast(`CarePlan "${planTitle}" deleted from API!`);
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error('Delete CarePlan error:', e);
    }
  };

  const openEdit = (plan: CarePlan) => {
    setEditingPlan(plan);
    setTitle(plan.title);
    setCode(plan.code);
    setDurationMonths(plan.durationMonths.toString());
    setPrice(plan.price.toString());
    setCategory(plan.category);
    setBadge(plan.badge || '');
    setFeatureInputs(plan.features?.join('\n') || '');
    setIsPopular(!!plan.isPopular);
    setPrioritySupport(!!plan.prioritySupport);
    setIsAddOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setCode('');
    setDurationMonths('3');
    setPrice('1499');
    setCategory('maid');
    setBadge('Society Verified');
    setFeatureInputs('Unlimited Free Replacements in 24 Hrs\nPolice Verification Dossier Included\nDedicated Relationship Officer');
    setIsPopular(false);
    setPrioritySupport(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-700" />
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              CarePlans & Staff Replacement Warranty CMS ({plans.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage unlimited domestic staff replacement warranties, tenure packages, and priority society passes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCarePlans}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-all cursor-pointer"
            title="Refresh from API"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-600' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingPlan(null);
              resetForm();
              setIsAddOpen(true);
            }}
            className="px-3.5 py-2 bg-[#0C356A] hover:bg-[#082245] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create CarePlan</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Plans Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              plan.isPopular
                ? 'border-cyan-500/60 bg-gradient-to-b from-cyan-50/40 to-white shadow-xs ring-1 ring-cyan-400/30'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-100 text-cyan-900 border border-cyan-200">
                  {plan.code}
                </span>
                {plan.badge && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                    {plan.badge}
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-slate-900 text-base">{plan.title}</h4>
              <p className="text-xs text-slate-500 font-medium capitalize mb-3">
                Category: {plan.category} • {plan.durationMonths} Months Tenure
              </p>

              <div className="my-3 pb-3 border-b border-slate-100 flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#0C356A]">₹{plan.price}</span>
                <span className="text-xs text-slate-400 font-bold">/ {plan.durationMonths}m</span>
              </div>

              {/* Features bullets */}
              <div className="space-y-1.5 my-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Included Assurances
                </span>
                {plan.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">ID: {plan.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(plan)}
                  className="px-2.5 py-1 text-slate-700 hover:text-[#0C356A] hover:bg-slate-100 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(plan.id, plan.title)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                  title="Delete CarePlan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingPlan ? 'Edit CarePlan' : 'New Domestic CarePlan'}
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Plan Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Care 180° Half-Yearly Domestic Shield"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plan Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="e.g. CARE-180"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden"
                  >
                    <option value="maid">House Maid</option>
                    <option value="cook">Home Cook</option>
                    <option value="nanny">Babysitter</option>
                    <option value="driver">Driver</option>
                    <option value="eldercare">Eldercare</option>
                    <option value="gardener">Gardener</option>
                    <option value="all">Universal All</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ribbon / Badge</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Best Value 180 Days"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Features (One per line)
                </label>
                <textarea
                  rows={4}
                  value={featureInputs}
                  onChange={(e) => setFeatureInputs(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-medium"
                  placeholder="Unlimited Free Replacements in 24 Hrs&#10;Police Verification Dossier Included&#10;Dedicated Relationship Officer"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded text-cyan-600"
                  />
                  <span className="font-bold text-slate-700">Featured / Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prioritySupport}
                    onChange={(e) => setPrioritySupport(e.target.checked)}
                    className="rounded text-cyan-600"
                  />
                  <span className="font-bold text-slate-700">Priority Support</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0C356A] hover:bg-[#082245] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPlan ? 'Save Changes' : 'Publish CarePlan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
