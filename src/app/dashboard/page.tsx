'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Plus, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Compass, 
  Bookmark, 
  Hotel, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  CloudSun 
} from 'lucide-react';
import { useTrip } from '@/context/TripContext';

export default function DashboardPage() {
  const { user, trips, favorites } = useTrip();

  const dailyTips = [
    "Always keep digital scans of your passport saved offline in encrypted storage.",
    "When visiting Japan, download the Suica IC card to your digital wallet for instant metro access.",
    "Book high-demand museum entries like the Louvre or Vatican at least 3 weeks in advance.",
    "Pack a portable dual-voltage power bank and international plug adapter in your carry-on."
  ];

  const randomTip = dailyTips[0];

  const activeTripsCount = trips.filter(t => t.status === 'Active' || t.status === 'Upcoming').length;

  return (
    <div className="space-y-8">
      
      {/* WELCOME BANNER */}
      <section className="glass-panel rounded-3xl p-8 border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-purple-950/20 to-slate-900/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">ONLINE</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-100">
              Welcome back, <span className="text-gradient-aurora">{user?.name?.split(' ')[0] || 'Traveler'}</span>! 👋
            </h1>
            <p className="text-xs text-slate-300 max-w-lg">
              You have <span className="text-cyan-400 font-bold">{activeTripsCount} upcoming itineraries</span> ready in your workspace.
            </p>
          </div>

          <Link
            href="/create-trip"
            className="px-6 py-3 rounded-full btn-primary text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create New Trip
          </Link>
        </div>

        {/* AI Tip of the Day */}
        <div className="mt-6 pt-4 border-t border-cyan-500/10 flex items-center gap-3 text-xs text-cyan-300">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <p className="italic">
            <strong className="not-italic font-bold text-cyan-400">AI Travel Tip of the Day:</strong> "{randomTip}"
          </p>
        </div>
      </section>

      {/* ANALYTICS METRICS CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-cyan-500/15 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Trips</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">{trips.length}</div>
          <div className="text-[10px] text-cyan-400 font-mono">+2 planned this month</div>
        </div>

        <div className="glass-card p-5 border border-cyan-500/15 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Upcoming Journeys</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">{activeTripsCount}</div>
          <div className="text-[10px] text-purple-400 font-mono">Next: Tokyo in Sep</div>
        </div>

        <div className="glass-card p-5 border border-cyan-500/15 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Saved Places</span>
            <Bookmark className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">{favorites.length}</div>
          <div className="text-[10px] text-amber-400 font-mono">Bookmarked venues</div>
        </div>

        <div className="glass-card p-5 border border-cyan-500/15 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">AI Cost Savings</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">$480</div>
          <div className="text-[10px] text-emerald-400 font-mono">Optimized routes</div>
        </div>
      </section>

      {/* QUICK ACTIONS GRID */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/create-trip" className="glass-card glass-card-hover p-4 text-center space-y-2 border border-cyan-500/20 group">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 block">Create Trip</span>
          </Link>

          <Link href="/chat" className="glass-card glass-card-hover p-4 text-center space-y-2 border border-cyan-500/20 group">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 block">AI Concierge</span>
          </Link>

          <Link href="/budget" className="glass-card glass-card-hover p-4 text-center space-y-2 border border-cyan-500/20 group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 block">Budget Tracker</span>
          </Link>

          <Link href="/weather" className="glass-card glass-card-hover p-4 text-center space-y-2 border border-cyan-500/20 group">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <CloudSun className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 block">Weather Radar</span>
          </Link>
        </div>
      </section>

      {/* RECENT TRIPS GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-200">Your Recent Trip Itineraries</h2>
          <Link href="/history" className="text-xs font-semibold text-cyan-400 hover:underline">
            View All ({trips.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="glass-card glass-card-hover border border-cyan-500/15 overflow-hidden flex flex-col justify-between">
              
              {/* Image & Header */}
              <div className="relative h-44 w-full">
                <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1515] via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold font-mono bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 backdrop-blur-md">
                  {trip.status}
                </span>
                <div className="absolute bottom-3 left-4 space-y-0.5">
                  <h3 className="text-xl font-extrabold text-slate-100">{trip.destination}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {trip.startDate}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400" /> {trip.daysCount} Days</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {trip.interests.map((interest, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] glass-panel border border-cyan-500/20 text-cyan-300 font-mono">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    Est. Budget: <strong className="text-slate-200">${trip.totalBudgetEst}</strong> ({trip.budget} Tier) • {trip.travelers} Travelers
                  </p>
                </div>

                <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between">
                  <span className="text-[11px] text-cyan-400 font-mono">AI Generated Route</span>
                  <Link
                    href={`/trip/${trip.id}`}
                    className="px-4 py-2 rounded-full btn-primary text-xs font-bold flex items-center gap-1.5"
                  >
                    Continue Planning
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
