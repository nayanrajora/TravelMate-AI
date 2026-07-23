'use client';

import React, { useState, useEffect } from 'react';
import { CloudSun, Sun, Wind, Droplets, Umbrella, Sparkles, Shirt, ShieldCheck, MapPin } from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import Link from 'next/link';

export default function WeatherPage() {
  const { activeTrip } = useTrip();

  const [city, setCity] = useState('Tokyo, Japan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync city with active trip if it exists
  useEffect(() => {
    if (activeTrip && activeTrip.destination) {
      setCity(activeTrip.destination);
    }
  }, [activeTrip]);

  const [weatherData, setWeatherData] = useState({
    temp: '22°C',
    condition: 'Partly Cloudy',
    high: '24°C',
    low: '16°C',
    humidity: '65%',
    wind: '14 km/h',
    uvIndex: '5 (Moderate)',
    rainChance: '20%',
    forecast: [
      { day: 'Mon', temp: '22°C', icon: 'CloudSun', condition: 'Partly Cloudy' },
      { day: 'Tue', temp: '25°C', icon: 'Sun', condition: 'Sunny' },
      { day: 'Wed', temp: '19°C', icon: 'Umbrella', condition: 'Light Rain' },
      { day: 'Thu', temp: '21°C', icon: 'CloudSun', condition: 'Cloudy' },
      { day: 'Fri', temp: '24°C', icon: 'Sun', condition: 'Clear Sky' }
    ],
    aiOutfitAdvice: [
      'Layer with a lightweight breathable trench coat for mild evening breezes.',
      'Pack a compact UV-shield umbrella for Wednesday afternoon rain spells.',
      'Wear comfortable mesh sneakers suitable for long walking tours.',
      'Carry sunglasses & SPF 50 sunscreen for sunny excursions.'
    ]
  });

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        if (!response.ok) throw new Error('Failed to fetch weather');
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to fetch real-time weather. Displaying mock data.');
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [city]);

  const IconMap: Record<string, any> = {
    Sun, CloudSun, Wind, Droplets, Umbrella
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {!activeTrip && (
        <div className="glass-card p-6 border border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-400">No Active Trip Selected</h3>
            <p className="text-xs text-slate-400">You are viewing default weather data. To get accurate, localized forecasts and dynamic outfit advice, create an itinerary.</p>
          </div>
          <Link href="/create-trip" className="px-5 py-2.5 rounded-full btn-primary text-xs font-bold flex items-center gap-2 whitespace-nowrap">
            <Sparkles className="w-4 h-4" /> Create AI Itinerary
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <CloudSun className="w-4 h-4 text-cyan-400" /> REAL-TIME WEATHER RADAR
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Weather & Smart Outfit Advisor</h1>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>

        {/* City Slider (Horizontal Scroll) */}
        <div className="w-full md:w-2/3">
          <div className="flex overflow-x-auto pb-2 gap-2 snap-x scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
            {['Tokyo, Japan', 'Paris, France', 'Bali, Indonesia', 'New York, USA', 'London, UK', 'Dubai, UAE', 'Singapore', 'Rome, Italy', 'Sydney, Australia', 'Istanbul, Turkey'].map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`flex-shrink-0 snap-start px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  city === c
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'glass-panel text-slate-300 border-cyan-500/20 hover:border-cyan-400/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN WEATHER HERO CARD */}
      <div className="glass-panel rounded-3xl p-8 border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-slate-900/50 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Temp & Condition */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{city} Forecast</span>
          <div className="flex items-center gap-4">
            {loading ? (
              <Sparkles className="w-16 h-16 text-cyan-400 animate-spin" />
            ) : (
              <CloudSun className="w-16 h-16 text-cyan-400 animate-pulse" />
            )}
            <div>
              <div className="text-5xl font-extrabold text-slate-100 font-mono">{loading ? '--' : weatherData.temp}</div>
              <div className="text-sm font-semibold text-slate-300">{loading ? 'Loading...' : weatherData.condition}</div>
            </div>
          </div>
          <p className="text-xs text-slate-400">High: {loading ? '--' : weatherData.high} • Low: {loading ? '--' : weatherData.low}</p>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3.5 border border-cyan-500/15 flex items-center gap-3">
            <Wind className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Wind Speed</div>
              <div className="text-xs font-bold text-slate-100">{weatherData.wind}</div>
            </div>
          </div>

          <div className="glass-card p-3.5 border border-cyan-500/15 flex items-center gap-3">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Humidity</div>
              <div className="text-xs font-bold text-slate-100">{weatherData.humidity}</div>
            </div>
          </div>

          <div className="glass-card p-3.5 border border-cyan-500/15 flex items-center gap-3">
            <Sun className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">UV Index</div>
              <div className="text-xs font-bold text-slate-100">{weatherData.uvIndex}</div>
            </div>
          </div>

          <div className="glass-card p-3.5 border border-cyan-500/15 flex items-center gap-3">
            <Umbrella className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Rain Probability</div>
              <div className="text-xs font-bold text-slate-100">{weatherData.rainChance}</div>
            </div>
          </div>
        </div>

      </div>

      {/* 5-DAY FORECAST ROW */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200">5-Day Outlook</h3>
        <div className="grid grid-cols-5 gap-3">
          {weatherData.forecast.map((fc, i) => {
            const IconC = IconMap[fc.icon as string] || CloudSun;
            return (
              <div key={i} className="glass-card p-4 text-center border border-cyan-500/15 space-y-2">
                <span className="text-xs font-bold font-mono text-cyan-400 block">{fc.day}</span>
                <IconC className="w-6 h-6 text-slate-200 mx-auto" />
                <div className="text-sm font-extrabold font-mono text-slate-100">{fc.temp}</div>
                <span className="text-[10px] text-slate-400 block truncate">{fc.condition}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SMART AI CLOTHING ADVISOR */}
      <div className="glass-card p-6 border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <Shirt className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-100">AI Packing & Outfit Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weatherData.aiOutfitAdvice.map((advice, idx) => (
            <div key={idx} className="p-3.5 rounded-xl glass-panel border border-cyan-500/15 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">{advice}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
