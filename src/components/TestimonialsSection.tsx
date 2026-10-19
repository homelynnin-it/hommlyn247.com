import React, { useState } from 'react';
import {
  Star,
  Quote,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Heart,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Testimonial, Review } from '../types';

interface TestimonialsSectionProps {
  userReviews?: Review[];
  onOpenReviewModal?: () => void;
  onExploreServices?: () => void;
}

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    customerName: 'Priya Sharma',
    society: 'Prestige Shantiniketan, Whitefield',
    city: 'Bangalore',
    serviceTitle: 'House Help & Deep Mopping',
    helperName: 'Sunita Devi',
    rating: 5,
    comment: 'My regular maid went on emergency leave. I used HomeeLynn7 instant dispatch at 8:15 AM, and Sunita was at our door by 8:28 AM with proper uniform & ID! Did spotless utensil cleaning and floor scrubbing. Truly life-saving service.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    tag: '⚡ 13-Min Instant Arrival',
    verifiedMember: true,
    date: 'Yesterday'
  },
  {
    id: 't-2',
    customerName: 'Ankit & Sneha Verma',
    society: 'Oberoi Splendor, JVLR',
    city: 'Mumbai',
    serviceTitle: 'Home Cook & Chef (Dinner Meal)',
    helperName: 'Ramesh Kumar',
    rating: 5,
    comment: 'Ramesh cooked piping hot phulkas, paneer lababdar and dal tadka for our family dinner. Low oil, fresh spices, and he cleaned the stove & kitchen counter completely before leaving. Subscribed to the Care 180° plan immediately!',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    tag: '🍲 Custom Family Taste',
    verifiedMember: true,
    date: '2 days ago'
  },
  {
    id: 't-3',
    customerName: 'Dr. Kavita Menon',
    society: 'The Magnolias, DLF Golf Links',
    city: 'Gurgaon, Delhi NCR',
    serviceTitle: 'Trained Babysitter & Nanny',
    helperName: 'Meena Kumari',
    rating: 5,
    comment: 'As a surgeon, having a verified, background-checked nanny is paramount. Meena handled my 3-year old daughter with immense patience, pediatric first-aid awareness, and healthy feeding habits. The police verification certificate gave us total peace of mind.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    tag: '🛡️ 100% Police Verified',
    verifiedMember: true,
    date: '3 days ago'
  },
  {
    id: 't-4',
    customerName: 'Vikramaditya Iyer',
    society: 'My Home Bhooja, Hitec City',
    city: 'Hyderabad',
    serviceTitle: 'Personal Chauffeur / Driver',
    helperName: 'Deepak Sharma',
    rating: 5,
    comment: 'Needed a sober, courteous driver for an airport drop and elderly parents hospital commute. Deepak was dressed in crisp formals, opened doors with courtesy, and drove smoothly through Hyderabad traffic. Zero advance hassle.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    tag: '🚗 Courteous Chauffeur',
    verifiedMember: true,
    date: '4 days ago'
  },
  {
    id: 't-5',
    customerName: 'Ayesha Merchant',
    society: 'Amanora Park Town, Hadapsar',
    city: 'Pune',
    serviceTitle: 'Care 180° Domestic CarePlan',
    helperName: 'Assigned Coordinator',
    rating: 5,
    comment: 'The replacement guarantee is completely authentic. When our cook had to travel to her hometown, HomeeLynn assigned an equally skilled replacement cook within 24 hours with zero extra recruitment fees. Unmatched customer care.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    tag: '🤝 Free Replacement Guaranteed',
    verifiedMember: true,
    date: '5 days ago'
  }
];

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  userReviews = [],
  onOpenReviewModal,
  onExploreServices
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'bangalore' | 'mumbai' | 'delhi'>('all');

  // Merge pre-seeded testimonials with real user-submitted reviews
  const allTestimonials: Testimonial[] = [
    ...userReviews.map(r => ({
      id: r.id,
      customerName: r.customerName,
      society: `${r.customerCity} Resident`,
      city: r.customerCity,
      serviceTitle: r.serviceTitle,
      helperName: r.helperName,
      rating: r.rating,
      comment: r.comment,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.customerName)}`,
      tag: r.tags[0] || 'Verified Service',
      verifiedMember: true,
      date: 'Just now'
    })),
    ...INITIAL_TESTIMONIALS
  ];

  const filteredTestimonials = allTestimonials.filter(t => {
    if (selectedFilter === 'bangalore') return t.city.toLowerCase().includes('bangalore');
    if (selectedFilter === 'mumbai') return t.city.toLowerCase().includes('mumbai');
    if (selectedFilter === 'delhi') return t.city.toLowerCase().includes('delhi') || t.city.toLowerCase().includes('gurgaon');
    return true;
  });

  return (
    <section className="py-16 bg-gradient-to-b from-white to-cyan-50/40 border-t border-cyan-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold uppercase tracking-wider mb-2 border border-cyan-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Real Customer Stories & Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0C356A] tracking-tight">
              Trusted by 45,000+ Families in India's Leading Gated Communities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              Read how verified 15-minute domestic dispatch and CarePlan replacement guarantees bring peace of mind to households every single day.
            </p>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'all' ? 'bg-[#0C356A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Cities ({allTestimonials.length})
            </button>
            <button
              onClick={() => setSelectedFilter('bangalore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'bangalore' ? 'bg-[#0C356A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bangalore
            </button>
            <button
              onClick={() => setSelectedFilter('mumbai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'mumbai' ? 'bg-[#0C356A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mumbai
            </button>
            <button
              onClick={() => setSelectedFilter('delhi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'delhi' ? 'bg-[#0C356A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NCR
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              {/* Highlight Tag & Rating */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-900 font-bold text-[11px] border border-cyan-200">
                    {testimonial.tag}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-cyan-100 absolute -top-2 -left-1 -z-0" />
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed relative z-10 italic">
                    "{testimonial.comment}"
                  </p>
                </div>
              </div>

              {/* Customer and Helper Credits */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.customerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-slate-900 text-xs">{testimonial.customerName}</h4>
                      {testimonial.verifiedMember && (
                        <CheckCircle2 className="w-3 h-3 text-cyan-700 fill-cyan-100" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-none mt-0.5">
                      {testimonial.society}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Helper
                  </span>
                  <span className="text-xs font-bold text-[#0C356A]">
                    {testimonial.helperName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 bg-[#0C356A] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-cyan-950/20 border border-cyan-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">
                Experience The HomeeLynn7 15-Minute Domestic Standard
              </h3>
              <p className="text-xs text-cyan-200">
                100% Police & Aadhaar verified staff • Zero advance payment • Free replacement guarantee.
              </p>
            </div>
          </div>

          {onExploreServices && (
            <button
              onClick={onExploreServices}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-cyan-50 text-[#0C356A] font-extrabold text-xs flex items-center gap-2 shadow-sm shrink-0 transition-colors cursor-pointer"
            >
              <span>Explore All Verified Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
