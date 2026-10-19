import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Sparkles, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../../types';
import { SERVICE_PRESET_TEMPLATES } from '../../data/servicePresets';

interface EditServiceModalProps {
  service: ServiceItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedService: ServiceItem) => Promise<void> | void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  service,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState(service.title);
  const [subtitle, setSubtitle] = useState(service.subtitle);
  const [tagline, setTagline] = useState(service.tagline || '');
  const [category, setCategory] = useState<ServiceCategory>(service.category);
  const [basePrice, setBasePrice] = useState(service.basePrice.toString());
  const [unit, setUnit] = useState(service.unit);
  const [eta, setEta] = useState(service.eta);
  const [badge, setBadge] = useState(service.badge);
  const [imageUrl, setImageUrl] = useState(service.imageUrl || '');
  const [tasks, setTasks] = useState(service.tasks || []);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDelta, setNewTaskDelta] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (presetId: string) => {
    const preset = SERVICE_PRESET_TEMPLATES.find(p => p.id === presetId);
    if (!preset) return;

    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setTagline(preset.tagline);
    setCategory(preset.category);
    setBasePrice(preset.basePrice.toString());
    setUnit(preset.unit);
    setEta(preset.eta);
    setBadge(preset.badge);
    setImageUrl(preset.imageUrl);
    setTasks(preset.tasks.map(t => ({
      id: t.id,
      name: t.name,
      priceDelta: t.priceDelta,
      defaultChecked: t.defaultChecked ?? false
    })));

    setSuccessMsg(`Autofilled with preset: ${preset.categoryLabel}`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    setTasks(prev => [
      ...prev,
      {
        id: `task-${Date.now()}`,
        name: newTaskName.trim(),
        priceDelta: parseInt(newTaskDelta, 10) || 0,
        defaultChecked: false
      }
    ]);
    setNewTaskName('');
    setNewTaskDelta('0');
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    const updated: ServiceItem = {
      ...service,
      title: title.trim(),
      subtitle: subtitle.trim(),
      tagline: tagline.trim() || undefined,
      category,
      basePrice: parseInt(basePrice, 10) || service.basePrice,
      unit,
      eta,
      badge,
      imageUrl: imageUrl.trim() || service.imageUrl,
      tasks
    };

    try {
      await onSave(updated);
      setSuccessMsg('Service updated successfully via API!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to update service:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Edit Catalog Service</h3>
            <p className="text-xs text-slate-400">ID: {service.id} • Category: {service.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Smart Preset Autofill Toolbar */}
        <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>⚡ 1-Click Preset Autofill (Photo + Rate + Checklist):</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SERVICE_PRESET_TEMPLATES.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                  category === preset.category
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-teal-100'
                }`}
              >
                {preset.categoryLabel}
              </button>
            ))}
          </div>
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
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
              >
                <option value="maid">House Maid & Cleaning</option>
                <option value="cook">Cook & Chef</option>
                <option value="nanny">Babysitter & Childcare</option>
                <option value="driver">Private Chauffeur</option>
                <option value="eldercare">Eldercare Assistant</option>
                <option value="electrician">Certified Electrician</option>
                <option value="plumber">Certified Plumber</option>
                <option value="carpenter">Carpenter & Handyman</option>
                <option value="deep_clean">Deep House Scrubbing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subtitle / Summary</label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Marketing Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="e.g. Police-verified helper at your doorstep in 15 mins"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Base Price (₹)</label>
              <input
                type="number"
                value={basePrice}
                onChange={e => setBasePrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="per hr"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">ETA</label>
              <input
                type="text"
                value={eta}
                onChange={e => setEta(e.target.value)}
                placeholder="12-15 mins"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge</label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                placeholder="15 Min Arrival"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Service Image Preview & Input */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Display Image URL</label>
            <div className="flex gap-2 items-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-14 h-11 rounded-xl object-cover border border-slate-300 shrink-0 shadow-xs"
                />
              ) : (
                <div className="w-14 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Tasks Checklist */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Selectable Service Tasks & Add-ons ({tasks.length})
            </label>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{task.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">
                      {task.priceDelta > 0 ? `+₹${task.priceDelta}` : 'Included'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className="text-slate-400 hover:text-red-500 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add customized task item..."
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:bg-slate-800"
              />
              <input
                type="number"
                placeholder="+₹"
                value={newTaskDelta}
                onChange={e => setNewTaskDelta(e.target.value)}
                className="w-20 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Database...' : 'Save Service Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
