'use client';

import React from 'react';
import { Bell, CloudSun, Calendar, ShieldCheck, CheckCircle2, Check } from 'lucide-react';
import { useTrip } from '@/context/TripContext';

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useTrip();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Bell className="w-4 h-4 text-cyan-400" /> SYSTEM ALERTS & REMINDERS
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Notifications</h1>
        </div>

        <button
          onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
          className="px-4 py-2 rounded-full glass-panel border border-cyan-500/20 text-xs font-semibold text-cyan-300 hover:border-cyan-400"
        >
          Mark All as Read
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.map((n) => {
          const getIcon = () => {
            if (n.type === 'weather') return <CloudSun className="w-5 h-5 text-amber-400" />;
            if (n.type === 'reminder') return <Calendar className="w-5 h-5 text-cyan-400" />;
            return <ShieldCheck className="w-5 h-5 text-purple-400" />;
          };

          return (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all cursor-pointer ${
                !n.read
                  ? 'bg-cyan-950/30 border-cyan-400/50 shadow-md shadow-cyan-500/10'
                  : 'glass-panel border-cyan-500/10 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl glass-panel border border-cyan-500/20 shrink-0">
                  {getIcon()}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">{n.title}</h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{n.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono block pt-1">{n.time}</span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(n.id);
                  }}
                  className="p-2 rounded-lg text-slate-500 hover:text-cyan-400"
                  title="Mark read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
