import React, { useState } from 'react';
import { X, Save, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { Helper, ServiceCategory } from '../../types';

interface EditHelperModalProps {
  helper: Helper;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedHelper: Helper) => Promise<void> | void;
}

export const EditHelperModal: React.FC<EditHelperModalProps> = ({
  helper,
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(helper.name);
  const [phone, setPhone] = useState(helper.phone || '+91 98765 00000');
  const [category, setCategory] = useState<ServiceCategory>(helper.category);
  const [hourlyRate, setHourlyRate] = useState(helper.hourlyRate.toString());
  const [experienceYears, setExperienceYears] = useState(helper.experienceYears.toString());
  const [location, setLocation] = useState(helper.location);
  const [currentEtaMinutes, setCurrentEtaMinutes] = useState(helper.currentEtaMinutes.toString());
  const [bio, setBio] = useState(helper.bio);
  const [isAvailable, setIsAvailable] = useState(helper.isAvailable);
  const [policeVerified, setPoliceVerified] = useState(helper.policeVerified);
  const [aadharVerified, setAadharVerified] = useState(helper.aadharVerified);
  const [trainingCertified, setTrainingCertified] = useState(helper.trainingCertified);
  const [healthCheckPassed, setHealthCheckPassed] = useState(helper.healthCheckPassed);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    const updated: Helper = {
      ...helper,
      name: name.trim(),
      phone: phone.trim(),
      category,
      categoryTitle: category.toUpperCase(),
      hourlyRate: parseInt(hourlyRate, 10) || helper.hourlyRate,
      experienceYears: parseInt(experienceYears, 10) || helper.experienceYears,
      location: location.trim(),
      currentEtaMinutes: parseInt(currentEtaMinutes, 10) || helper.currentEtaMinutes,
      bio: bio.trim(),
      isAvailable,
      policeVerified,
      aadharVerified,
      trainingCertified,
      healthCheckPassed
    };

    try {
      await onSave(updated);
      setSuccessMsg('Partner details updated successfully via API!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to update helper:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Edit Partner Workforce Profile</h3>
            <p className="text-xs text-slate-500">ID: {helper.id} • {helper.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Partner Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-medium"
              >
                <option value="maid">House Maid</option>
                <option value="cook">Home Cook</option>
                <option value="nanny">Babysitter</option>
                <option value="driver">Driver</option>
                <option value="eldercare">Eldercare</option>
                <option value="gardener">Gardener</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="carpenter">Carpenter</option>
                <option value="pest_control">Pest Control</option>
                <option value="appliance_repair">Appliance Repair</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Hourly Base (₹)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Experience (Yrs)</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Base Location / Hub</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dispatch ETA (Mins)</label>
              <input
                type="number"
                value={currentEtaMinutes}
                onChange={(e) => setCurrentEtaMinutes(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Bio / Profile Summary</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-cyan-600 outline-hidden"
            />
          </div>

          {/* Verification & Status Badges */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <label className="font-bold text-slate-700 block">Trust & Verification Credentials</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policeVerified}
                  onChange={(e) => setPoliceVerified(e.target.checked)}
                  className="rounded text-cyan-700"
                />
                <span className="font-semibold text-slate-700 text-xs">Police Verified</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aadharVerified}
                  onChange={(e) => setAadharVerified(e.target.checked)}
                  className="rounded text-cyan-700"
                />
                <span className="font-semibold text-slate-700 text-xs">Aadhaar KYC Passed</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trainingCertified}
                  onChange={(e) => setTrainingCertified(e.target.checked)}
                  className="rounded text-cyan-700"
                />
                <span className="font-semibold text-slate-700 text-xs">Hommlyn Certified</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={healthCheckPassed}
                  onChange={(e) => setHealthCheckPassed(e.target.checked)}
                  className="rounded text-cyan-700"
                />
                <span className="font-semibold text-slate-700 text-xs">Health Check Clean</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded text-cyan-700"
                />
                <span className="font-bold text-slate-800 text-xs">Currently Available for Instant 15-min Dispatch</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0C356A] hover:bg-[#082245] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving API...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
