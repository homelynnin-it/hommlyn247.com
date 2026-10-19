import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  X,
  Zap,
  CalendarCheck,
  CreditCard,
  Star,
  ShieldCheck,
  ExternalLink,
  Volume2,
  VolumeX,
  Smartphone
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking?: (bookingId: string) => void;
}

// Audio chime using Web Audio API (failsafe, requires no external file)
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.2);

    // Second tone (higher chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.38);
  } catch (e) {
    // Audio context not allowed or supported
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  isOpen,
  onClose,
  onSelectBooking
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'payment' | 'review'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserPushAllowed, setBrowserPushAllowed] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  const requestPushPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      const perm = await Notification.requestPermission();
      setBrowserPushAllowed(perm === 'granted');
      if (perm === 'granted') {
        new Notification('HomeeLynn7 Notifications Enabled', {
          body: 'You will receive real-time 15-min arrival alerts, OTP codes & payment receipts!',
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      console.warn('Notification permission request:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredList = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'order') return n.type === 'order' || n.type === 'dispatch' || n.type === 'otp';
    if (filter === 'payment') return n.type === 'payment';
    if (filter === 'review') return n.type === 'review';
    return true;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
      case 'dispatch':
        return <Zap className="w-4 h-4 text-cyan-600" />;
      case 'otp':
        return <CalendarCheck className="w-4 h-4 text-amber-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-800">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm">Notifications & Alerts</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-600 text-white text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Real-time dispatch, OTPs & receipts</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-700" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Web Push Banner */}
        {!browserPushAllowed && (
          <div className="p-3 bg-cyan-50/70 border-b border-cyan-100 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-950">
              <Smartphone className="w-4 h-4 text-cyan-700 shrink-0" />
              <span>Enable native browser push for 15-min arrival alerts.</span>
            </div>
            <button
              onClick={requestPushPermission}
              className="px-2.5 py-1 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg text-[11px] shrink-0 cursor-pointer"
            >
              Enable
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-white text-xs gap-1 overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                filter === 'all' ? 'bg-cyan-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                filter === 'unread' ? 'bg-cyan-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('order')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                filter === 'order' ? 'bg-cyan-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Orders & OTP
            </button>
            <button
              onClick={() => setFilter('payment')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                filter === 'payment' ? 'bg-cyan-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setFilter('review')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                filter === 'review' ? 'bg-cyan-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Reviews
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-cyan-700 font-bold hover:underline shrink-0 px-2 cursor-pointer"
            >
              Read all
            </button>
          )}
        </div>

        {/* List of notifications */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {filteredList.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-semibold">No notifications right now</p>
              <p className="text-xs text-slate-400 mt-0.5">You're all caught up with live alerts.</p>
            </div>
          ) : (
            filteredList.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  if (notif.bookingId && onSelectBooking) {
                    onSelectBooking(notif.bookingId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                  notif.read ? 'bg-white hover:bg-slate-50' : 'bg-cyan-50/60 border border-cyan-100 hover:bg-cyan-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-2xs border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs ${notif.read ? 'font-semibold text-slate-800' : 'font-bold text-cyan-950'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">{notif.message}</p>

                  {notif.bookingId && (
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-cyan-700">
                      <span>View Order #{notif.bookingId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-cyan-600 shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">{notifications.length} alerts total</span>
            <button
              onClick={onClearAll}
              className="text-slate-500 hover:text-red-600 font-semibold cursor-pointer text-xs"
            >
              Clear all alerts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
