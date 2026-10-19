import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Zap,
  Star,
  Search,
  Filter,
  Tag,
  IndianRupee,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServicesCatalogViewProps {
  services: ServiceItem[];
  isDarkMode: boolean;
  onAddServiceClick: () => void;
  onEditServiceClick: (service: ServiceItem) => void;
  onDeleteServiceClick: (id: string, title: string) => void;
}

export const ServicesCatalogView: React.FC<ServicesCatalogViewProps> = ({
  services,
  isDarkMode,
  onAddServiceClick,
  onEditServiceClick,
  onDeleteServiceClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [surgeActive, setSurgeActive] = useState(false);

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`rounded-2xl border transition-all ${
      isDarkMode ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>

      {/* Top Header & Surge Controls */}
      <div className={`p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#0E1626] border-slate-800' : 'bg-slate-50/70 border-slate-200'
      }`}>
        <div>
          <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Domestic Services Catalog & Rate Engine ({services.length})
          </h3>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Dynamic base pricing, task-level micro-addons, and 15-minute express dispatch badges
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Surge Pricing Toggle */}
          <button
            onClick={() => setSurgeActive(!surgeActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              surgeActive
                ? 'bg-amber-100 border border-amber-300 text-amber-900'
                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${surgeActive ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
            <span>Rain/Peak Surge: {surgeActive ? '+15% ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onAddServiceClick}
            className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search service title..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-700 font-medium"
          >
            <option value="all">All Service Segments</option>
            <option value="maid">House Maid & Cleaning</option>
            <option value="cook">Home Cook & Chef</option>
            <option value="nanny">Babysitter & Childcare</option>
            <option value="driver">Driver & Chauffeur</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
        {filteredServices.map(s => {
          const effectivePrice = surgeActive ? Math.round(s.basePrice * 1.15) : s.basePrice;

          return (
            <div
              key={s.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {s.category}
                  </span>
                  <div className="text-right">
                    <span className="font-mono text-base font-black text-teal-900">
                      ₹{effectivePrice}
                    </span>
                    {surgeActive && (
                      <span className="block text-[9px] text-amber-700 font-bold">Surge +15%</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={s.imageUrl}
                    alt={s.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {s.title}
                    </h4>
                    <p className={`text-[11px] line-clamp-2 mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {s.subtitle}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{s.rating} ({s.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-1 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Scope Tasks ({s.tasks.length})
                  </span>
                  {s.tasks.slice(0, 3).map(t => (
                    <div key={t.id} className="text-[11px] flex items-center justify-between text-slate-700">
                      <span className="truncate max-w-[180px]">• {t.name}</span>
                      {t.priceDelta > 0 && <span className="text-teal-800 font-bold">+₹{t.priceDelta}</span>}
                    </div>
                  ))}
                  {s.tasks.length > 3 && (
                    <span className="text-[10px] text-slate-400 italic">+{s.tasks.length - 3} more tasks</span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-500">
                  ETA: <strong className="text-teal-900">{s.eta}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditServiceClick(s)}
                    className="text-teal-800 hover:text-teal-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit Rate</span>
                  </button>
                  <button
                    onClick={() => onDeleteServiceClick(s.id, s.title)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded-lg cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
