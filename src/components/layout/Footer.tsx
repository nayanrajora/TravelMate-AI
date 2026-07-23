'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Sparkles, Send, Shield, Heart, Share2, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-cyan-500/10 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cyan-500/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-md">
                <Globe className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gradient-aurora">
                TravelMate <span className="text-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The world-class AI concierge platform empowering modern globetrotters with intelligent 3D visualization, hyper-personalized itineraries, real-time weather advice, and budget analytics.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-cyan-400 mb-2 block">
                Subscribe to AI Travel Dispatch
              </label>
              <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to TravelMate AI Dispatch!"); }} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="px-3.5 py-2 rounded-full glass-panel border border-cyan-500/20 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 flex-1"
                />
                <button type="submit" className="p-2.5 rounded-full btn-primary text-slate-950 hover:scale-105 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-cyan-300 transition-colors">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Dashboard</Link></li>
              <li><Link href="/create-trip" className="hover:text-cyan-300 transition-colors">AI Trip Planner</Link></li>
              <li><Link href="/chat" className="hover:text-cyan-300 transition-colors">AI Assistant</Link></li>
              <li><Link href="/maps" className="hover:text-cyan-300 transition-colors">3D Navigation</Link></li>
            </ul>
          </div>

          {/* Travel Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Travel Tools</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/weather" className="hover:text-cyan-300 transition-colors">Weather Advisor</Link></li>
              <li><Link href="/hotels" className="hover:text-cyan-300 transition-colors">Hotel Directory</Link></li>
              <li><Link href="/restaurants" className="hover:text-cyan-300 transition-colors">Restaurant Directory</Link></li>
              <li><Link href="/budget" className="hover:text-cyan-300 transition-colors">Budget Analytics</Link></li>
              <li><Link href="/packing" className="hover:text-cyan-300 transition-colors">Packing Checklist</Link></li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Account</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/profile" className="hover:text-cyan-300 transition-colors">User Profile</Link></li>
              <li><Link href="/favorites" className="hover:text-cyan-300 transition-colors">Saved Favorites</Link></li>
              <li><Link href="/history" className="hover:text-cyan-300 transition-colors">Trip History</Link></li>
              <li><Link href="/settings" className="hover:text-cyan-300 transition-colors">Settings</Link></li>
              <li><Link href="/help" className="hover:text-cyan-300 transition-colors">Help Center</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-300 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            © 2026 TravelMate AI. Built with <Heart className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" /> for global travelers.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-cyan-400 font-mono text-[11px]">
              <Shield className="w-3.5 h-3.5" /> Obsidian Aurora Engine
            </span>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors"><Globe className="w-4 h-4" /></a>
              <a href="#" className="hover:text-cyan-400 transition-colors"><Share2 className="w-4 h-4" /></a>
              <a href="#" className="hover:text-cyan-400 transition-colors"><Compass className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
