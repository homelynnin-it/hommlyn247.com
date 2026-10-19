import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  X,
  Megaphone,
  Percent,
  Calendar,
  IndianRupee,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Coupon, AnnouncementBanner } from '../../types';

export const PromotionsCMS: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [announcement, setAnnouncement] = useState<AnnouncementBanner | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Coupon Form
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState('100');
  const [minOrderAmount, setMinOrderAmount] = useState('449');
  const [validTill, setValidTill] = useState('2026-12-31');
  const [maxDiscount, setMaxDiscount] = useState('300');

  // Announcement Form State
  const [bannerActive, setBannerActive] = useState(true);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerLinkText, setBannerLinkText] = useState('');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('');
  const [bannerType, setBannerType] = useState<'info' | 'warning' | 'promo' | 'emergency'>('promo');
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchPromotionsData = async () => {
    setLoading(true);
    try {
      const [cpRes, anRes] = await Promise.all([
        fetch('/api/coupons'),
        fetch('/api/cms/announcements')
      ]);

      if (cpRes.ok) {
        const cpData = await cpRes.json();
        setCoupons(cpData);
      }
      if (anRes.ok) {
        const anData: AnnouncementBanner = await anRes.json();
        setAnnouncement(anData);
        setBannerActive(anData.active);
        setBannerMessage(anData.message);
        setBannerLinkText(anData.linkText || '');
        setBannerLinkUrl(anData.linkUrl || '');
        setBannerType(anData.type || 'promo');
      }
    } catch (e) {
      console.warn('Error fetching promo data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotionsData();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const payload = {
      code: code.trim().toUpperCase(),
      description: description.trim(),
      discountType,
      discountValue: parseInt(discountValue, 10) || 100,
      minOrderAmount: parseInt(minOrderAmount, 10) || 0,
      validTill,
      maxDiscount: discountType === 'percentage' ? parseInt(maxDiscount, 10) || undefined : undefined,
      active: true
    };

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setCoupons(prev => [created, ...prev]);
        showToast(`Coupon ${created.code} published live via API!`);
        setIsAddCouponOpen(false);
        setCode('');
        setDescription('');
      }
    } catch (e) {
      console.error('Coupon create error:', e);
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !coupon.active })
      });
      if (res.ok) {
        const updated = await res.json();
        setCoupons(prev => prev.map(c => c.id === updated.id ? updated : c));
        showToast(`Coupon ${updated.code} is now ${updated.active ? 'ACTIVE' : 'INACTIVE'}`);
      }
    } catch (e) {
      console.error('Toggle coupon error:', e);
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (!window.confirm(`Delete coupon ${couponCode}?`)) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.id !== id));
        showToast(`Coupon ${couponCode} deleted from API.`);
      }
    } catch (e) {
      console.error('Delete coupon error:', e);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBanner(true);
    try {
      const res = await fetch('/api/cms/announcements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active: bannerActive,
          message: bannerMessage.trim(),
          linkText: bannerLinkText.trim(),
          linkUrl: bannerLinkUrl.trim(),
          type: bannerType
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setAnnouncement(updated);
        showToast('Platform Announcement Banner broadcast updated live!');
      }
    } catch (e) {
      console.error('Update banner error:', e);
    } finally {
      setIsSavingBanner(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SECTION 1: PLATFORM ANNOUNCEMENT / BROADCAST BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Emergency & Platform Broadcast Announcement Banner
              </h3>
              <p className="text-xs text-slate-500">
                Pushes a dynamic alert banner across all resident client views, service pages, and mobile views.
              </p>
            </div>
          </div>
          <button
            onClick={fetchPromotionsData}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-600' : ''}`} />
          </button>
        </div>

        <form onSubmit={handleSaveBanner} className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block">Banner Broadcast State</span>
              <span className="text-slate-500 text-[11px]">
                {bannerActive ? 'Visible to all customers & visitors' : 'Hidden from public app'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setBannerActive(!bannerActive)}
              className="cursor-pointer"
            >
              {bannerActive ? (
                <ToggleRight className="w-8 h-8 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Broadcast Message Text</label>
            <input
              type="text"
              value={bannerMessage}
              onChange={(e) => setBannerMessage(e.target.value)}
              required
              placeholder="e.g. ⚡ Monsoon Surge Special: Flat ₹150 OFF on all Deep Cleaning & Maid slots!"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Banner Type</label>
              <select
                value={bannerType}
                onChange={(e) => setBannerType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden"
              >
                <option value="promo">Promo / Discount</option>
                <option value="info">General Info</option>
                <option value="warning">Service Advisory</option>
                <option value="emergency">Emergency Weather Notice</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Call-to-Action Text</label>
              <input
                type="text"
                value={bannerLinkText}
                onChange={(e) => setBannerLinkText(e.target.value)}
                placeholder="e.g. Claim Offer"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Destination Target</label>
              <input
                type="text"
                value={bannerLinkUrl}
                onChange={(e) => setBannerLinkUrl(e.target.value)}
                placeholder="e.g. #services"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingBanner}
              className="px-5 py-2.5 bg-[#0C356A] hover:bg-[#082245] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingBanner ? 'Broadcasting...' : 'Update Announcement Banner'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: PROMO COUPOUNS CMS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Tag className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Coupons & Referral Promo Engine ({coupons.length})
              </h3>
              <p className="text-xs text-slate-500">
                Configure discount codes for cart checkout, resident first-booking perks, and society referral codes.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCouponOpen(true)}
            className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
                <th className="p-3 pl-5">COUPON CODE</th>
                <th className="p-3">DISCOUNT</th>
                <th className="p-3">MIN ORDER</th>
                <th className="p-3">VALID TILL</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right pr-5">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 pl-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-purple-950 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-xs">
                        {coupon.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{coupon.description}</span>
                  </td>

                  <td className="p-3">
                    <span className="font-black text-slate-900">
                      {coupon.discountType === 'fixed' ? `₹${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`}
                    </span>
                    {coupon.maxDiscount && (
                      <span className="text-[10px] text-slate-400 block">Cap: ₹{coupon.maxDiscount}</span>
                    )}
                  </td>

                  <td className="p-3 font-mono text-slate-600">
                    ₹{coupon.minOrderAmount}
                  </td>

                  <td className="p-3 text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{coupon.validTill}</span>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleToggleCoupon(coupon)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-all ${
                        coupon.active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {coupon.active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>

                  <td className="p-3 pr-5 text-right">
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE COUPON */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Create New Promo Coupon</h3>
              <button
                onClick={() => setIsAddCouponOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="e.g. WELCOME247"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-hidden font-mono uppercase font-black"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="e.g. ₹100 Flat OFF on First Domestic Booking"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-hidden"
                  >
                    <option value="fixed">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-hidden font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Valid Till Date</label>
                  <input
                    type="date"
                    value={validTill}
                    onChange={(e) => setValidTill(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
