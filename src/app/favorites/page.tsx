'use client';

import React, { useState } from 'react';
import { Bookmark, Star, MapPin, Trash2 } from 'lucide-react';
import { useTrip } from '@/context/TripContext';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useTrip();
  const [tab, setTab] = useState<'all' | 'place' | 'hotel' | 'restaurant'>('all');

  const filtered = favorites.filter(f => tab === 'all' || f.type === tab);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Bookmark className="w-4 h-4 text-amber-400" /> CURATED SAVED PINS
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Saved Favorites & Bookmarks</h1>
        </div>

        <div className="flex gap-2">
          {['all', 'place', 'hotel', 'restaurant'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all border ${
                tab === t
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                  : 'glass-panel border-cyan-500/20 text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 space-y-3 glass-card border border-cyan-500/15">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Saved Items Yet</h3>
          <p className="text-xs text-slate-500">Bookmark places, hotels, and dining options while exploring!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card border border-cyan-500/15 overflow-hidden space-y-3 p-4">
              <img src={item.image} alt={item.name} className="w-full h-36 rounded-xl object-cover" />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 uppercase">
                    {item.type}
                  </span>
                  {item.rating && (
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" /> {item.rating}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-100">{item.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> {item.location}
                </p>
              </div>

              <button
                onClick={() => toggleFavorite(item)}
                className="w-full py-2 rounded-xl glass-panel border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Bookmark
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
