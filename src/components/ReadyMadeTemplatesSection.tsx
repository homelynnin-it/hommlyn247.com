import React, { useState } from 'react';
import { Sparkles, Sun, Moon, ArrowRight, CheckCircle2, ShieldCheck, Zap, Clock, HeartHandshake, Layers } from 'lucide-react';
import { ReadyMadeTemplate, ServiceItem, ShiftMode } from '../types';
import { READY_MADE_TEMPLATES } from '../data/templates';

interface ReadyMadeTemplatesSectionProps {
  onSelectTemplate: (template: ReadyMadeTemplate) => void;
  onExploreAllServices: () => void;
  onOpenLeadModal?: () => void;
}

export const ReadyMadeTemplatesSection: React.FC<ReadyMadeTemplatesSectionProps> = ({
  onSelectTemplate,
  onExploreAllServices,
  onOpenLeadModal
}) => {
  const [filter, setFilter] = useState<'all' | 'dual' | 'single' | 'cook' | 'maid' | 'eldercare'>('all');

  const filteredTemplates = READY_MADE_TEMPLATES.filter(tmpl => {
    if (filter === 'all') return true;
    if (filter === 'dual') return tmpl.shiftMode === 'dual';
    if (filter === 'single') return tmpl.shiftMode === 'single';
    return tmpl.category === filter;
  });

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 via-cyan-50/30 to-white border-y border-slate-200/80" id="ready-made-combos-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ready-Made Household Combos & Multi-Shift Packages</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Pre-Configured Daily & Monthly Routines
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed">
              Designed for working couples, busy families, and senior citizens. Select verified morning and evening slots with zero management hassle, verified replacement guarantees, and up to 35% bundle savings.
            </p>
          </div>

          <button
            onClick={onExploreAllServices}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#0C356A] text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs"
            id="explore-all-combos-btn"
          >
            <span>Browse All Product Lines</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {[
            { id: 'all', label: '🔥 All Combos' },
            { id: 'dual', label: '🌅 + 🌙 Dual-Shift (Morning + Evening)' },
            { id: 'single', label: '⚡ 1-Day & Single Shifts' },
            { id: 'cook', label: '🍳 Kitchen & Cook Bundles' },
            { id: 'maid', label: '🧹 Housekeeping Passes' },
            { id: 'eldercare', label: '❤️ Senior Citizen Compassion' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#0C356A] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const isDual = template.shiftMode === 'dual';

            return (
              <div
                key={template.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-cyan-500/50 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Header Image & Tags */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={template.imageUrl}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Badge top-left */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-300/30 shadow-xs">
                      {template.badge}
                    </span>
                  </div>

                  {/* Savings pill top-right */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white shadow-xs">
                      Save {template.savingsPercentage}%
                    </span>
                  </div>

                  {/* Tagline overlay on bottom */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-bold line-clamp-1 text-slate-100">
                      {template.tagline}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                        {template.category.toUpperCase()} • {template.recommendedPackage.toUpperCase()}
                      </span>
                      {isDual ? (
                        <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>🌅 + 🌙</span> 2 Visits / Day
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          1 Shift / Day
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-900 group-hover:text-[#0C356A] transition-colors leading-snug">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Multi-Shift Schedule Preview Box */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      Standard Daily Time Slot Routing
                    </span>

                    {isDual ? (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                          <div className="flex items-center gap-1.5 font-bold text-amber-950">
                            <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>☀️ Morning Shift:</span>
                          </div>
                          <span className="text-[11px] text-amber-900 font-medium line-clamp-1 ml-1">
                            {template.defaultMorningSlot?.split('(')[0] || '07:30 AM'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between bg-indigo-50/70 p-2 rounded-xl border border-indigo-200/60">
                          <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                            <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>🌙 Evening Shift:</span>
                          </div>
                          <span className="text-[11px] text-indigo-900 font-medium line-clamp-1 ml-1">
                            {template.defaultEveningSlot?.split('(')[0] || '07:00 PM'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span>Dedicated Shift:</span>
                        </div>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {template.defaultMorningSlot || '09:00 AM - 05:00 PM'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Highlight Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {template.highlightPills.map((pill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        ✓ {pill}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Pricing & CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Special Bundle Price
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#0C356A]">
                          ₹{template.approxMonthlyPrice}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {template.recommendedPackage === 'monthly' ? '/month' : '/day'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectTemplate(template)}
                      className="px-4 py-2.5 rounded-xl bg-[#0C356A] hover:bg-[#082245] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
                      id={`book-combo-${template.id}`}
                    >
                      <span>Book Combo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Hours / Routine Lead Conversion Banner */}
        {onOpenLeadModal && (
          <div className="mt-12 bg-gradient-to-r from-[#0C356A] via-cyan-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-cyan-800">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Custom Household Shift Tailoring</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Need Custom Shift Hours, 3 Shifts, or Live-In Maid + Cook?
              </h3>
              <p className="text-xs sm:text-sm text-cyan-100 max-w-xl">
                Tell us your family routine, dietary requirements, or specific apartment rules. Our household concierge team will customize the shifts and quote within 15 minutes.
              </p>
            </div>

            <button
              onClick={onOpenLeadModal}
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98"
              id="templates-request-custom-quote-btn"
            >
              <span>Request Custom Routine &amp; Quote</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
