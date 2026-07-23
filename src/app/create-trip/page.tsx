'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Heart, 
  Hotel, 
  Plane, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Compass, 
  Camera, 
  Utensils, 
  Mountain, 
  Sun, 
  Building2, 
  ShoppingBag, 
  Music 
} from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import LocationSearch from '@/components/onboarding/LocationSearch';
import { fetchWeatherForecast, WeatherForecast } from '@/lib/weather';

function CreateTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createTrip } = useTrip();

  const preBookedHotel = searchParams?.get('hotel');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [destination, setDestination] = useState('Kyoto, Japan');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-07');
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [travelers, setTravelers] = useState(2);
  const [travelStyle, setTravelStyle] = useState('Couple');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Food', 'Museums', 'Historical', 'Photography']);
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>(['Hotel']);
  const [selectedTransport, setSelectedTransport] = useState<string[]>(['Flight', 'Train']);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);

  const popularDestinations = ['Tokyo, Japan', 'Paris, France', 'Bali, Indonesia', 'Rome, Italy', 'Kyoto, Japan', 'New York, USA'];

  const interestOptions = [
    { name: 'Adventure', icon: Mountain },
    { name: 'Beaches', icon: Sun },
    { name: 'Museums', icon: Building2 },
    { name: 'Food', icon: Utensils },
    { name: 'Shopping', icon: ShoppingBag },
    { name: 'Photography', icon: Camera },
    { name: 'Nightlife', icon: Music },
    { name: 'Historical', icon: Compass }
  ];

  const accommodationOptions = ['Hotel', 'Resort', 'Hostel', 'Airbnb', 'Boutique Villa'];
  const transportOptions = ['Flight', 'Train', 'Rental Car', 'Subway / Metro'];

  const toggleInterest = (name: string) => {
    setSelectedInterests(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(async () => {
      const newTrip = await createTrip({
        destination,
        startDate,
        endDate,
        budget: budgetTier,
        travelers,
        travelStyle,
        interests: selectedInterests,
        accommodations: preBookedHotel ? [...selectedAccommodations, preBookedHotel] : selectedAccommodations,
        transport: selectedTransport
      });
      setLoading(false);
      router.push(`/trip/${newTrip.id}`);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
          <Sparkles className="w-12 h-12 text-cyan-400 animate-pulse" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-extrabold text-slate-100">Generating AI Travel Route...</h2>
          <p className="text-xs text-cyan-300 font-mono">
            Optimizing schedule for <span className="text-slate-100 font-bold">{destination}</span> based on your interests in {selectedInterests.join(', ')}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> MULTI-STEP AI ITINERARY BUILDER
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Plan Your Custom Trip</h1>
        <p className="text-xs text-slate-400">Step {step} of 4: Define your travel parameters.</p>
        
        {preBookedHotel && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-xs text-cyan-300 font-bold">
            <Hotel className="w-3.5 h-3.5" />
            Booking linked: {preBookedHotel}
          </div>
        )}
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between glass-panel p-3 rounded-2xl border border-cyan-500/20">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                step === s
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30'
                  : step > s
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-400/40'
                  : 'bg-slate-900 text-slate-500 border border-cyan-500/10'
              }`}
            >
              {s}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-300">
              {s === 1 ? 'Destination' : s === 2 ? 'Dates & Budget' : s === 3 ? 'Interests' : 'Logistics'}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="glass-card p-8 border border-cyan-500/20 shadow-2xl space-y-6">
        
        {/* STEP 1: DESTINATION & TRAVELERS */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" /> Where do you want to go?
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Destination Search</label>
              <LocationSearch
                value={destination}
                onChange={(val) => setDestination(val)}
                onSelect={async (val, lat, lon) => {
                  setDestination(val);
                  // Store lat/lon if needed for weather
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('travelmate_lat', lat);
                    localStorage.setItem('travelmate_lon', lon);
                  }
                  try {
                    const forecast = await fetchWeatherForecast(parseFloat(lat), parseFloat(lon));
                    setWeather(forecast);
                  } catch (error) {
                    console.error("Could not fetch real-time weather:", error);
                  }
                }}
              />
              
              {weather && (
                <div className="mt-3 p-3 rounded-lg glass-panel border border-amber-500/30 flex items-center gap-3">
                  <Sun className="w-6 h-6 text-amber-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-100">Current Forecast: {weather.summary}</p>
                    <p className="text-xs text-slate-400">High: {weather.tempMax}°C | Low: {weather.tempMin}°C</p>
                  </div>
                </div>
              )}
            </div>

            {/* Popular Suggestion Chips */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 font-mono">POPULAR TRENDING DESTINATIONS</span>
              <div className="flex flex-wrap gap-2">
                {popularDestinations.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => setDestination(dest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      destination === dest
                        ? 'bg-cyan-400 text-slate-950 font-bold border-cyan-400'
                        : 'glass-panel border-cyan-500/20 text-slate-300 hover:border-cyan-400/50'
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            {/* Travelers & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-cyan-500/10">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Number of Travelers</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-9 h-9 rounded-xl glass-panel border border-cyan-500/20 text-cyan-400 font-bold hover:border-cyan-400"
                  >
                    -
                  </button>
                  <span className="text-base font-bold font-mono text-slate-100">{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
                  <button
                    type="button"
                    onClick={() => setTravelers(travelers + 1)}
                    className="w-9 h-9 rounded-xl glass-panel border border-cyan-500/20 text-cyan-400 font-bold hover:border-cyan-400"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Travel Style</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/30 text-xs text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
                >
                  <option value="Solo">Solo Traveler</option>
                  <option value="Couple">Couple / Romantic</option>
                  <option value="Family">Family with Kids</option>
                  <option value="Friends">Friends Group</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DATES & BUDGET */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" /> Dates & Budget Tier
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/30 text-xs text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/30 text-xs text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Budget Selector */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-slate-300 block">Select Budget Range</label>
              <div className="grid grid-cols-3 gap-3">
                {['Backpacker', 'Moderate', 'Luxury'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudgetTier(b)}
                    className={`p-4 rounded-xl border text-center space-y-1 transition-all ${
                      budgetTier === b
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                        : 'glass-panel border-cyan-500/15 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-sm font-bold">{b}</div>
                    <div className="text-[10px] font-mono text-cyan-400">
                      {b === 'Backpacker' ? '$50-$100/day' : b === 'Moderate' ? '$150-$300/day' : '$500+/day'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INTERESTS */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" /> What do you love doing?
            </h3>
            <p className="text-xs text-slate-400">Select all activities and vibes that appeal to you.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {interestOptions.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = selectedInterests.includes(opt.name);
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => toggleInterest(opt.name)}
                    className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-400/20'
                        : 'glass-panel border-cyan-500/15 text-slate-300 hover:border-cyan-400/50'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="text-xs">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: LOGISTICS */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-emerald-400" /> Accommodation & Transport
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Preferred Accommodations</label>
              <div className="flex flex-wrap gap-2">
                {accommodationOptions.map((acc) => (
                  <button
                    key={acc}
                    type="button"
                    onClick={() =>
                      setSelectedAccommodations(prev =>
                        prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      selectedAccommodations.includes(acc)
                        ? 'bg-cyan-400 text-slate-950 font-bold border-cyan-400'
                        : 'glass-panel border-cyan-500/20 text-slate-300'
                    }`}
                  >
                    {acc}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-300">Transport Modes</label>
              <div className="flex flex-wrap gap-2">
                {transportOptions.map((tr) => (
                  <button
                    key={tr}
                    type="button"
                    onClick={() =>
                      setSelectedTransport(prev =>
                        prev.includes(tr) ? prev.filter(t => t !== tr) : [...prev, tr]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      selectedTransport.includes(tr)
                        ? 'bg-purple-500 text-slate-950 font-bold border-purple-500'
                        : 'glass-panel border-cyan-500/20 text-slate-300'
                    }`}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-cyan-500/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-full glass-panel border border-cyan-500/20 text-xs font-semibold text-slate-300 hover:text-cyan-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold flex items-center gap-1.5"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Trip Itinerary
            </button>
          )}
        </div>

      </div>

    </div>
  );
}

export default function CreateTripPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateTripForm />
    </Suspense>
  );
}
