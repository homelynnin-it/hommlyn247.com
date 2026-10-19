import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  Award,
  UserCheck,
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import { CarePlan } from '../types';

interface CarePlansSectionProps {
  onSelectPlan: (plan: CarePlan) => void;
  userActivePlan?: string | null;
}

export const CARE_PLANS_DATA: CarePlan[] = [
  {
    id: 'care-90',
    code: 'CARE 90°',
    title: 'CARE 90°',
    durationMonths: 4,
    badge: 'ESSENTIAL',
    price: 3999,
    isPopular: false,
    validityText: 'For 4 Months',
    features: [
      'Free replacement if staff leaves without prior information',
      'Free replacement if performance does not meet expectations',
      'Free replacement for any other genuine issues',
      'Dedicated support throughout the plan period'
    ]
  },
  {
    id: 'care-180',
    code: 'CARE 180°',
    title: 'CARE 180°',
    durationMonths: 6,
    badge: 'MOST POPULAR',
    price: 6999,
    isPopular: true,
    validityText: 'For 6 Months',
    features: [
      'Free replacement if staff leaves without prior information',
      'Free replacement if performance does not meet expectations',
      'Free replacement for any other genuine issues',
      'Dedicated support throughout the plan period',
      '2 times staff change - hassle free'
    ]
  },
  {
    id: 'care-360',
    code: 'CARE 360°',
    title: 'CARE 360°',
    durationMonths: 12,
    badge: 'PREMIUM CARE',
    price: 8999,
    isPopular: false,
    validityText: 'For 12 Months',
    features: [
      'Free replacement if staff leaves without prior information',
      'Free replacement if performance does not meet expectations',
      'Free replacement for any other genuine issues',
      'Dedicated support throughout the plan period',
      'Backup staff on request for special occasions (Subject to availability)',
      'Priority Customer Care'
    ]
  }
];

export const CarePlansSection: React.FC<CarePlansSectionProps> = ({
  onSelectPlan,
  userActivePlan
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('care-180');

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F0FDFA] to-white border-y border-cyan-100/60" id="homeelynn-careplans-section">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with HomeeLynn Logo Stamp */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100/80 border border-cyan-300 text-cyan-900 text-xs font-bold tracking-wide uppercase mb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-700" />
            HomeeLynn CarePlans
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C356A] tracking-tight">
            Reliable Manpower, Assured Replacement
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Never worry about maids or cooks taking unscheduled leave. Choose a HomeeLynn CarePlan for verified background-checked domestic staff with free immediate replacements.
          </p>
        </div>

        {/* 3 Care Plans Grid matching the Reference Flyer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {CARE_PLANS_DATA.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isSubscribed = userActivePlan === plan.id;

            return (
              <div
                key={plan.id}
                id={`careplan-card-${plan.id}`}
                className={`relative rounded-2xl flex flex-col transition-all duration-200 ${
                  plan.isPopular
                    ? 'bg-white border-2 border-[#0C356A] shadow-xl shadow-cyan-900/10 md:-translate-y-2'
                    : 'bg-white border border-cyan-200 shadow-md hover:shadow-lg'
                }`}
              >
                {/* Popular Ribbon */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0C356A] text-white text-[11px] font-extrabold tracking-wider uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-300" />
                    MOST POPULAR
                  </div>
                )}

                {/* Plan Header */}
                <div className={`p-6 border-b ${
                  plan.isPopular ? 'bg-gradient-to-r from-[#0C356A] to-[#0E7490] text-white rounded-t-2xl' : 'bg-cyan-50/70 border-cyan-100 rounded-t-2xl'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-2xl font-black tracking-tight ${plan.isPopular ? 'text-white' : 'text-[#0C356A]'}`}>
                        {plan.code}
                      </h3>
                      <p className={`text-xs font-semibold mt-0.5 ${plan.isPopular ? 'text-cyan-100' : 'text-cyan-800'}`}>
                        {plan.validityText}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase ${
                      plan.isPopular
                        ? 'bg-white/20 text-white'
                        : 'bg-cyan-200/80 text-cyan-900'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className={`text-3xl sm:text-4xl font-extrabold ${plan.isPopular ? 'text-white' : 'text-slate-900'}`}>
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-xs ${plan.isPopular ? 'text-cyan-100' : 'text-slate-500'}`}>
                      /- one-time
                    </span>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Included Protection
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        onSelectPlan(plan);
                      }}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        plan.isPopular
                          ? 'bg-[#0C356A] hover:bg-[#071952] text-white shadow-md shadow-cyan-900/20'
                          : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm'
                      }`}
                      id={`select-plan-${plan.id}-button`}
                    >
                      {isSubscribed ? (
                        <span>Current Active Plan</span>
                      ) : (
                        <>
                          <span>Choose {plan.code}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      Instant activation • 100% money back guarantee
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Highlights & Assurance Banner */}
        <div className="mt-10 rounded-2xl bg-white border border-cyan-200/80 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Police & Aadhaar Verified</h4>
                <p className="text-xs text-slate-500">Rigorous 4-tier background clearance</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Guaranteed Replacement</h4>
                <p className="text-xs text-slate-500">Quick replacement within 24 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Hygiene & Health Certified</h4>
                <p className="text-xs text-slate-500">Regular medical checkups passed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Dedicated Relationship Mgr</h4>
                <p className="text-xs text-slate-500">Priority helpline for subscribers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
