'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Search, Calendar, Clock, ArrowRight, Trash2, Copy } from 'lucide-react';
import { useTrip } from '@/context/TripContext';

export default function HistoryPage() {
  const { trips } = useTrip();
  const [search, setSearch] = useState('');

  const filteredTrips = trips.filter(t => t.destination.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Compass className="w-4 h-4 text-cyan-400" /> ITINERARY ARCHIVES
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Trip History & Archives</h1>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past trips..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="glass-card border border-cyan-500/15 overflow-hidden space-y-4 p-5 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <img src={trip.image} alt={trip.destination} className="w-24 h-24 rounded-2xl object-cover" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-400/30">
                    {trip.status}
                  </span>
                  <span className="text-xs font-bold text-slate-100 font-mono">${trip.totalBudgetEst}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{trip.destination}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {trip.startDate} – {trip.endDate}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Duplicated ${trip.destination} trip plan.`)}
                  className="p-2 rounded-lg glass-panel border border-cyan-500/20 text-slate-300 hover:text-cyan-300"
                  title="Duplicate Plan"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <Link
                href={`/trip/${trip.id}`}
                className="px-4 py-2 rounded-full btn-primary text-xs font-bold flex items-center gap-1.5"
              >
                View Itinerary <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
