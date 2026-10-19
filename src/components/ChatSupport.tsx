import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { ChatMessage, ServiceItem, CarePlan, Booking } from '../types';

interface ChatSupportProps {
  isOpen: boolean;
  onToggle: () => void;
  onQuickBookService: (serviceId: string) => void;
  onSelectCarePlan: (planCode: string) => void;
  services?: ServiceItem[];
  bookings?: Booking[];
  onOpenEmergencySos?: () => void;
  onViewBookings?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'assistant',
    text: "👋 Namaste! I am hommlyn247's Internal AI Domestic Help Helpline & Concierge. How can I assist your home today?",
    timestamp: 'Just now'
  },
  {
    id: 'welcome-2',
    sender: 'assistant',
    text: "I have direct access to our live dispatch network, active orders, and verified domestic staff. Ask me anything like: 'Check my OTP & order status', 'Need maid for 2 hours', 'Book a cook for dinner', or 'Trigger Emergency SOS'!",
    timestamp: 'Just now'
  }
];

const SUGGESTED_PILLS = [
  '📍 Track my booking & OTP',
  '🧹 Book 15-Min Maid',
  '🍳 Book Cook for Dinner',
  '🚨 Emergency SOS Dispatch',
  '🛡️ CarePlans Replacement Guarantee'
];

export const ChatSupport: React.FC<ChatSupportProps> = ({
  isOpen,
  onToggle,
  onQuickBookService,
  onSelectCarePlan,
  services = [],
  bookings = [],
  onOpenEmergencySos,
  onViewBookings
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      // Call backend /api/chat
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Local internal intelligent database reasoning engine (zero third-party dependency)
      setTimeout(() => {
        const lower = query.toLowerCase();
        let reply = "Namaste! I am checking our live domestic dispatch network for your query. How can I assist you?";
        let action: any = undefined;

        // 1. ORDER & OTP LOOKUP
        if (lower.includes('otp') || lower.includes('status') || lower.includes('track') || lower.includes('order') || lower.includes('booking')) {
          const activeBooking = bookings.find(b => b.status !== 'completed' && b.status !== 'cancelled') || bookings[0];
          if (activeBooking) {
            reply = `📍 Live Order #${activeBooking.id} (${activeBooking.serviceTitle}):\n` +
              `• Status: ${activeBooking.status.toUpperCase()} (Doorstep ETA: ${activeBooking.scheduledTimeSlot})\n` +
              `• Assigned Partner: ${activeBooking.helper?.name || 'Verified Pro'} (${activeBooking.helper?.phone || '+91 9800 247 247'})\n` +
              `• Doorstep Start OTP: ${activeBooking.otp}\n\n` +
              `Please share OTP ${activeBooking.otp} only once your verified partner arrives at your door.`;
            action = {
              type: 'view_booking',
              serviceTitle: `Order #${activeBooking.id} (OTP: ${activeBooking.otp})`
            };
          } else {
            reply = "You currently have no active orders in dispatch. Would you like to schedule an express 15-minute maid or cook?";
            action = {
              type: 'book_service',
              serviceId: services[0]?.id || 'srv-maid-hourly',
              serviceTitle: services[0]?.title || 'House Help & Maid',
              price: services[0]?.basePrice || 199
            };
          }
        }
        // 2. SOS EMERGENCY
        else if (lower.includes('sos') || lower.includes('emergency') || lower.includes('urgent') || lower.includes('burst') || lower.includes('leak') || lower.includes('blackout') || lower.includes('shock') || lower.includes('lockout')) {
          reply = "🚨 15-Minute Domestic Emergency SOS Activated!\n\n" +
            "• Immediate dispatch for water pipe bursts, short circuits, maid no-shows, and door lockouts.\n" +
            "• Technician arrives on bike in under 15 minutes with complete emergency toolkit.\n" +
            "• Toll-Free Hotline: 1800-247-HOMM • Pay only after doorstep resolution.";
          action = {
            type: 'sos_emergency',
            serviceTitle: 'Trigger 15-Min Domestic SOS Dispatch',
            price: 299,
            suggestedTime: '10-12 mins'
          };
        }
        // 3. ABSENT / REPLACEMENT
        else if (lower.includes('absent') || lower.includes('no show') || lower.includes('nahi aayi') || lower.includes('nahi aaya') || lower.includes('chutti') || lower.includes('leave') || lower.includes('replace')) {
          reply = "🛡️ Staff Absenteeism & Instant Backup Guarantee:\n\n" +
            "• Under our CarePlans policy, an immediate replacement helper is dispatched to your sector in < 45 minutes.\n" +
            "• 100% Police-verified backup staff with biometric KYC.\n" +
            "• Zero additional placement or broker charge.";
          action = {
            type: 'sos_emergency',
            serviceTitle: 'Dispatch Emergency Backup Maid / Cook',
            price: 199,
            suggestedTime: 'Immediate Dispatch'
          };
        }
        // 4. CAREPLANS
        else if (lower.includes('care') || lower.includes('plan') || lower.includes('guarantee') || lower.includes('warranty')) {
          reply = "🛡️ hommlyn247 CarePlans Assurance:\n\n" +
            "• 100% Free Staff Replacements if staff leaves or takes unplanned off.\n" +
            "• ₹50,000 household accidental protection.\n" +
            "• Zero broker fee, cancel or pause anytime.\n" +
            "• Dedicated relationship manager on WhatsApp.";
          action = {
            type: 'care_plan',
            serviceTitle: 'CARE 180° (6 Months Plan)',
            price: 4999
          };
        }
        // 5. COUPONS & DISCOUNTS
        else if (lower.includes('coupon') || lower.includes('discount') || lower.includes('code') || lower.includes('offer')) {
          reply = "🏷️ Verified Active hommlyn247 Promo Codes:\n\n" +
            "• HOMM100: Flat ₹100 OFF on your first 15-min domestic booking\n" +
            "• SOCIETY-POOL-15: 15% OFF for gated society group bookings\n" +
            "• MONTHLY20: ₹1,200 OFF on monthly recurring CarePlans";
          action = {
            type: 'book_service',
            serviceId: services[0]?.id || 'srv-maid-hourly',
            serviceTitle: 'Apply HOMM100 & Book Service',
            price: Math.max(99, (services[0]?.basePrice || 199) - 100)
          };
        }
        // 6. POLICE & SAFETY VERIFICATION
        else if (lower.includes('police') || lower.includes('verify') || lower.includes('safe') || lower.includes('aadhaar')) {
          reply = "👮 100% Verified Workforce Charter:\n\n" +
            "1. State Police Clearance Certificate (PCC) criminal record verified.\n" +
            "2. Government Aadhaar Biometric face authentication.\n" +
            "3. Medical pathological health screening clear.\n" +
            "4. hommlyn247 Academy trained for residential etiquette.";
          action = {
            type: 'book_service',
            serviceId: services[0]?.id || 'srv-maid-hourly',
            serviceTitle: 'Book Verified Domestic Pro',
            price: services[0]?.basePrice || 199
          };
        }
        // 7. SPECIFIC SERVICE MATCHING FROM INTERNAL CATALOG
        else {
          const matched = services.find(s =>
            lower.includes(s.category) ||
            s.title.toLowerCase().split(' ').some(w => w.length > 3 && lower.includes(w)) ||
            (lower.includes('maid') && s.category === 'maid') ||
            (lower.includes('clean') && s.category === 'maid') ||
            (lower.includes('cook') && s.category === 'cook') ||
            (lower.includes('khana') && s.category === 'cook') ||
            (lower.includes('electric') && s.category === 'electrician') ||
            (lower.includes('plumb') && s.category === 'plumber') ||
            (lower.includes('nanny') && s.category === 'nanny') ||
            (lower.includes('baby') && s.category === 'nanny') ||
            (lower.includes('driver') && s.category === 'driver')
          ) || services[0];

          if (matched) {
            reply = `✨ Internal Catalog Match: **${matched.title}**\n\n` +
              `• Rate: ₹${matched.basePrice} / ${matched.unit}\n` +
              `• Doorstep Arrival: ${matched.eta || '12-15 mins'}\n` +
              `• Tasks: ${matched.tasks ? matched.tasks.slice(0, 3).map(t => t.name).join(', ') : 'Standard residential service'}\n` +
              `• Verified partners ready for dispatch in your sector.`;
            action = {
              type: 'book_service',
              serviceId: matched.id,
              serviceTitle: matched.title,
              category: matched.category,
              price: matched.basePrice,
              suggestedTime: matched.eta
            };
          }
        }

        setMessages(prev => [
          ...prev,
          {
            id: `assist-${Date.now()}`,
            sender: 'assistant',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedAction: action
          }
        ]);
      }, 400);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <button
            onClick={onToggle}
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#0C356A] to-[#0E7490] hover:from-[#071952] hover:to-[#0891B2] text-white px-4 py-3 rounded-full shadow-xl shadow-cyan-950/20 hover:scale-105 transition-all group cursor-pointer border border-cyan-300/30"
            id="open-ai-chat-button"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-200">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                <span>AI Booking Brain</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[10px] text-cyan-200 font-medium">HomeeLynn 24/7 Concierge</p>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] h-[600px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-cyan-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          id="ai-chat-window"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0C356A] via-[#0E7490] to-[#009688] text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-cyan-200">
                <Bot className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">HomeeLynn AI Brain</h3>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded font-semibold border border-emerald-400/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-cyan-100">Smart instant booking & support</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onToggle}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-cyan-100 hover:text-white transition-colors cursor-pointer"
                id="close-ai-chat-button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Pills */}
          <div className="bg-cyan-50/70 border-b border-cyan-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_PILLS.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pill.replace(/^[^\w]+/, ''))}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-cyan-100/70 text-cyan-900 border border-cyan-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isAssistant ? 'bg-[#0E7490] text-white' : 'bg-[#0C356A] text-white'
                    }`}>
                      {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
                        : 'bg-[#0C356A] text-white rounded-br-none shadow-xs'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>

                  {/* Interactive Booking Brain Action Card */}
                  {msg.suggestedAction && (
                    <div className="mt-2.5 ml-9 max-w-[85%] rounded-xl bg-white border-2 border-cyan-400 p-3 shadow-md">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-sm">
                          AI Suggested Booking
                        </span>
                        {msg.suggestedAction.price && (
                          <span className="text-xs font-extrabold text-slate-900">
                            ₹{msg.suggestedAction.price}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900">
                        {msg.suggestedAction.serviceTitle}
                      </h4>

                      {msg.suggestedAction.suggestedTime && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                          <Clock className="w-3 h-3 text-cyan-600" />
                          <span>ETA / Timing: {msg.suggestedAction.suggestedTime}</span>
                        </div>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
                        {msg.suggestedAction.type === 'book_service' && msg.suggestedAction.serviceId ? (
                          <button
                            onClick={() => {
                              onQuickBookService(msg.suggestedAction!.serviceId!);
                              onToggle();
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-[#0E7490] hover:bg-[#0C356A] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Confirm & Book in 1-Click</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : msg.suggestedAction.type === 'sos_emergency' ? (
                          <button
                            onClick={() => {
                              onOpenEmergencySos?.();
                              onToggle();
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs animate-pulse"
                          >
                            <span>🚨 Trigger 15-Min SOS Dispatch</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : msg.suggestedAction.type === 'view_booking' ? (
                          <button
                            onClick={() => {
                              onViewBookings?.();
                              onToggle();
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <span>📍 Track Order & OTP Status</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectCarePlan('CARE 180°');
                              onToggle();
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-[#0C356A] hover:bg-[#071952] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Explore CarePlans</span>
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 ml-2">
                <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="E.g. Book a cook for dinner tonight..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] text-xs sm:text-sm bg-slate-50/50"
                id="ai-chat-input"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2.5 rounded-xl bg-[#0E7490] hover:bg-[#0C356A] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
                id="ai-chat-submit"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>HomeeLynn AI Brain • Direct dispatch</span>
              <span>🔒 100% Encrypted</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
