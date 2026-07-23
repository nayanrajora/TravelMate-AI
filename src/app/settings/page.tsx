'use client';

import React, { useState } from 'react';
import { Settings, Globe, Moon, Sun, DollarSign, Bell, Shield, Save } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useTrip } from '@/context/TripContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useTrip();

  const [language, setLanguage] = useState('English (US)');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <Settings className="w-4 h-4 text-cyan-400" /> SYSTEM CONFIGURATION
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Platform Settings</h1>
      </div>

      <div className="glass-card p-6 border border-cyan-500/20 space-y-6">
        
        {/* Appearance & Theme */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Moon className="w-4 h-4 text-purple-400" /> Appearance & Theme
          </h3>
          <div className="flex items-center justify-between p-4 rounded-xl glass-panel border border-cyan-500/10">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Theme Mode</span>
              <span className="text-[11px] text-slate-400">Toggle between Dark Obsidian and Light Aurora.</span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-full btn-primary text-xs font-bold flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
              {theme === 'dark' ? 'Dark Obsidian' : 'Light Aurora'}
            </button>
          </div>
        </div>

        {/* Currency & Language */}
        <div className="space-y-3 pt-4 border-t border-cyan-500/10">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" /> Currency & Localization
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Default Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/30 text-xs text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/30 text-xs text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
              >
                <option value="English (US)">English (US)</option>
                <option value="French">Français</option>
                <option value="Japanese">日本語</option>
                <option value="Spanish">Español</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-3 pt-4 border-t border-cyan-500/10">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" /> Notifications & Alerts
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3.5 rounded-xl glass-panel border border-cyan-500/10 cursor-pointer">
              <span className="text-xs text-slate-200">Email Itinerary Updates</span>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="rounded border-cyan-400 text-cyan-400 bg-slate-900 focus:ring-0 w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between p-3.5 rounded-xl glass-panel border border-cyan-500/10 cursor-pointer">
              <span className="text-xs text-slate-200">Real-time Weather & Flight Push Notifications</span>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="rounded border-cyan-400 text-cyan-400 bg-slate-900 focus:ring-0 w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          {saved && <span className="text-xs text-emerald-400 font-bold">Settings saved!</span>}
          <button
            onClick={handleSave}
            className="ml-auto px-6 py-2.5 rounded-full btn-primary text-xs font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>

      </div>

    </div>
  );
}
