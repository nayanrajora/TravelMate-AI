'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Star, Hotel, Utensils, Layers } from 'lucide-react';

export default function MapsPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'attractions' | 'hotels' | 'dining'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('Shibuya Crossing');

  const [selectedCity, setSelectedCity] = useState<string>('Tokyo, Japan');

  const cityData: Record<string, {name: string, type: string, coords: string, rating: number, desc: string, category: string}[]> = {
    'Tokyo, Japan': [
      { name: 'Shibuya Crossing', type: 'attractions', coords: '35.6595° N, 139.7004° E', rating: 4.9, desc: 'World famous pedestrian scramble intersection.', category: 'Attraction' },
      { name: 'Keio Plaza Hotel', type: 'hotels', coords: '35.6896° N, 139.6917° E', rating: 4.8, desc: 'Luxury skyscraper hotel in Shinjuku.', category: 'Hotel' },
      { name: 'Senso-ji Temple', type: 'attractions', coords: '35.7148° N, 139.7967° E', rating: 4.9, desc: 'Ancient Buddhist temple in Asakusa.', category: 'Attraction' },
      { name: 'Ichiran Ramen Shinjuku', type: 'dining', coords: '35.6915° N, 139.7020° E', rating: 4.9, desc: 'Popular solo-booth tonkotsu ramen.', category: 'Dining' }
    ],
    'Paris, France': [
      { name: 'Eiffel Tower', type: 'attractions', coords: '48.8584° N, 2.2945° E', rating: 4.8, desc: 'Iconic wrought-iron lattice tower.', category: 'Attraction' },
      { name: 'Louvre Museum', type: 'attractions', coords: '48.8606° N, 2.3376° E', rating: 4.9, desc: 'World\'s largest art museum.', category: 'Attraction' },
      { name: 'Le Meurice', type: 'hotels', coords: '48.8655° N, 2.3283° E', rating: 4.9, desc: 'Luxury palace hotel on Rue de Rivoli.', category: 'Hotel' },
      { name: 'L\'Avenue', type: 'dining', coords: '48.8665° N, 2.3050° E', rating: 4.6, desc: 'Upscale dining near Champs-Élysées.', category: 'Dining' }
    ],
    'New York, USA': [
      { name: 'Central Park', type: 'attractions', coords: '40.7826° N, 73.9656° W', rating: 4.9, desc: 'Vast urban park in Manhattan.', category: 'Attraction' },
      { name: 'The Plaza', type: 'hotels', coords: '40.7646° N, 73.9743° W', rating: 4.8, desc: 'Historic luxury hotel.', category: 'Hotel' },
      { name: 'Times Square', type: 'attractions', coords: '40.7580° N, 73.9855° W', rating: 4.7, desc: 'Bustling commercial intersection.', category: 'Attraction' },
      { name: 'Katz\'s Deli', type: 'dining', coords: '40.7222° N, 73.9874° W', rating: 4.8, desc: 'Famous pastrami sandwiches.', category: 'Dining' }
    ],
    'London, UK': [
      { name: 'British Museum', type: 'attractions', coords: '51.5194° N, 0.1270° W', rating: 4.8, desc: 'Huge collection of human history.', category: 'Attraction' },
      { name: 'The Ritz', type: 'hotels', coords: '51.5073° N, 0.1416° W', rating: 4.7, desc: 'World renowned luxury hotel.', category: 'Hotel' },
      { name: 'London Eye', type: 'attractions', coords: '51.5033° N, 0.1195° W', rating: 4.6, desc: 'Giant observation wheel.', category: 'Attraction' },
      { name: 'Dishoom', type: 'dining', coords: '51.5126° N, 0.1264° W', rating: 4.8, desc: 'Popular Bombay-style cafe.', category: 'Dining' }
    ]
  };

  const mapLocations = cityData[selectedCity] || cityData['Tokyo, Japan'];

  const filteredLocations = mapLocations.filter(loc => activeFilter === 'all' || loc.type === activeFilter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Compass className="w-4 h-4 text-cyan-400" /> INTERACTIVE ROUTE & VENUE MAPS
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">3D Navigation & Maps Explorer</h1>
        </div>

        {/* Filter Buttons & City Slider */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <div className="flex overflow-x-auto pb-1 max-w-[300px] md:max-w-md gap-2 snap-x scrollbar-thin scrollbar-thumb-cyan-500/30">
            {Object.keys(cityData).map((c) => (
              <button
                key={c}
                onClick={() => { setSelectedCity(c); setSelectedLocation(cityData[c][0].name); }}
                className={`flex-shrink-0 snap-start px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  selectedCity === c
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'glass-panel text-slate-300 border-cyan-500/20 hover:border-cyan-400/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {['all', 'attractions', 'hotels', 'dining'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all border ${
                  activeFilter === f
                    ? 'bg-cyan-400 text-slate-950 font-bold border-cyan-400'
                    : 'glass-panel border-cyan-500/20 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAP CANVAS CONTAINER & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
        
        {/* Map Interactive Canvas */}
        <div className="lg:col-span-8 rounded-3xl glass-panel border border-cyan-500/20 relative overflow-hidden flex items-center justify-center bg-[#081010]">
          
          {/* Simulated Dark Mode Map Texture */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00f5ff_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Simulated Interactive Route Path Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 150 200 Q 300 120 500 350 T 700 480"
              fill="none"
              stroke="#00f5ff"
              strokeWidth="3"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Location Markers */}
          {mapLocations.map((loc, idx) => {
            const positions = [
              { top: '30%', left: '25%' },
              { top: '45%', left: '55%' },
              { top: '20%', left: '75%' },
              { top: '65%', left: '40%' }
            ];
            const pos = positions[idx % positions.length];
            const isSelected = selectedLocation === loc.name;

            return (
              <div
                key={loc.name}
                onClick={() => setSelectedLocation(loc.name)}
                style={{ top: pos.top, left: pos.left }}
                className={`absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-125 z-20`}
              >
                <div className={`p-2.5 rounded-full border shadow-xl flex items-center justify-center ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 border-cyan-400 animate-bounce'
                    : 'glass-panel border-cyan-500/40 text-cyan-300'
                }`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono glass-panel border border-cyan-500/30 text-cyan-200 whitespace-nowrap">
                  {loc.name}
                </span>
              </div>
            );
          })}

          {/* Overlay Map Controls */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Mapbox Engine 3.0 • {selectedCity} Area</span>
          </div>

        </div>

        {/* Venue Information Drawer Column */}
        <div className="lg:col-span-4 glass-card p-5 border border-cyan-500/20 space-y-4 overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" /> Key Waypoints ({filteredLocations.length})
          </h3>

          <div className="space-y-3">
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation === loc.name;
              return (
                <div
                  key={loc.name}
                  onClick={() => setSelectedLocation(loc.name)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all space-y-2 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-md'
                      : 'glass-panel border-cyan-500/10 hover:border-cyan-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-400/30">
                      {loc.category}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" /> {loc.rating}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{loc.name}</h4>
                  <p className="text-xs text-slate-400">{loc.desc}</p>
                  <div className="text-[10px] font-mono text-cyan-400 pt-1">{loc.coords}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
