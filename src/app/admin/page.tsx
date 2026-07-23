'use client';

import React from 'react';
import { ShieldCheck, Users, Server, Activity, Database, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const metrics = [
    { label: 'Active Users Today', val: '14,280', icon: Users, color: 'text-cyan-400' },
    { label: 'AI Queries Processed', val: '892,100', icon: Server, color: 'text-purple-400' },
    { label: 'WebGL Scene FPS Avg', val: '59.8 FPS', icon: Activity, color: 'text-emerald-400' },
    { label: 'Database Status', val: 'Healthy 99.9%', icon: Database, color: 'text-amber-400' }
  ];

  const logs = [
    { id: '1', event: 'AI Itinerary Route Model v3.2 Deployed', time: '12m ago', type: 'system' },
    { id: '2', event: ' Narita Airport Weather Sync Completed', time: '45m ago', type: 'api' },
    { id: '3', event: 'User Alex Vance generated Tokyo 7-Day Plan', time: '1h ago', type: 'user' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> PLATFORM CONTROL CENTER
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Admin Operations Dashboard</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const IconC = m.icon;
          return (
            <div key={i} className="glass-card p-5 border border-cyan-500/15 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">{m.label}</span>
                <IconC className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-2xl font-extrabold font-mono text-slate-100">{m.val}</div>
            </div>
          );
        })}
      </div>

      {/* System Logs & Operations */}
      <div className="glass-card p-6 border border-cyan-500/20 space-y-4">
        <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider">Live System Logs</h3>
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-xl glass-panel border border-cyan-500/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-200">{log.event}</span>
              </div>
              <span className="font-mono text-cyan-400 text-[10px]">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
