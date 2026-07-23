'use client';

import React, { useState } from 'react';
import { Utensils, Star, MapPin, Search, ExternalLink } from 'lucide-react';
import { useTrip } from '@/context/TripContext';

export default function RestaurantsPage() {
  const { toggleFavorite, isFavorite } = useTrip();
  const [search, setSearch] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  const restaurants = [
    {
      id: 'r-1',
      name: 'Ichiran Ramen Shinjuku',
      location: 'Shinjuku, Tokyo',
      cuisine: 'Japanese Tonkotsu',
      price: '$$ ($15-$25)',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      dietary: ['Non-Halal', 'Pork Broth'],
      dietaryCategory: 'regular'
    },
    {
      id: 'r-2',
      name: 'Locavore Ubud',
      location: 'Ubud, Bali',
      cuisine: 'Modern Indonesian',
      price: '$$$ ($45-$80)',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      dietary: ['Vegan Friendly', 'Farm to Table', 'Gluten Free'],
      dietaryCategory: 'vegan'
    },
    {
      id: 'r-3',
      name: 'Le Jules Verne',
      location: 'Eiffel Tower, Paris',
      price: '$$$$ ($180+)',
      cuisine: 'Contemporary French',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
      dietary: ['Michelin Star', 'Vegetarian Options'],
      dietaryCategory: 'vegetarian'
    }
  ];

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchesDietary = dietaryFilter === 'all' || r.dietaryCategory === dietaryFilter;
    return matchesSearch && matchesDietary;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Utensils className="w-4 h-4 text-cyan-400" /> CURATED DINING DIRECTORY
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Restaurant & Culinary Guide</h1>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cuisine or dish..."
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Dietary Preferences</option>
            <option value="vegan">Vegan Friendly</option>
            <option value="vegetarian">Vegetarian Options</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRestaurants.map((resto) => (
          <div key={resto.id} className="glass-card glass-card-hover border border-cyan-500/15 overflow-hidden flex flex-col justify-between">
            <div className="relative h-44 w-full">
              <img src={resto.image} alt={resto.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1515] via-transparent to-transparent" />
              <button
                onClick={() => toggleFavorite({ id: resto.id, type: 'restaurant', name: resto.name, location: resto.location, rating: resto.rating, image: resto.image })}
                className={`absolute top-3 right-3 p-2 rounded-full glass-panel border transition-all ${
                  isFavorite(resto.id) ? 'bg-amber-400 text-slate-950 border-amber-400' : 'border-cyan-500/30 text-slate-200'
                }`}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-100">{resto.name}</h3>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {resto.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {resto.location}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-mono">
                    {resto.cuisine}
                  </span>
                  {resto.dietary.map((d, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-[10px] glass-panel border border-cyan-500/20 text-cyan-300 font-mono">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">{resto.price}</span>
                <button
                  onClick={() => alert(`Table reservation for ${resto.name} launched.`)}
                  className="px-4 py-2 rounded-full btn-primary text-xs font-bold flex items-center gap-1"
                >
                  Reserve Table <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
