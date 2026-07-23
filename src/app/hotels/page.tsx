'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hotel, Star, MapPin, Search, Filter, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import { useAuth } from '@/context/AuthContext';

interface HotelData {
  id: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  budgetCategory: string;
}

export default function HotelsPage() {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useTrip();
  const { user, token } = useAuth();
  const [search, setSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [city, setCity] = useState('Tokyo, Japan');
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(false);

  // Booking Modal State
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const handleBookClick = (hotel: HotelData) => {
    if (!user) {
      router.push('/login?redirect=/hotels');
    } else {
      setSelectedHotel(hotel);
      setIsBookingModalOpen(true);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedHotel || !checkIn || !checkOut || !token) return;
    setIsBooking(true);
    try {
      const priceStr = selectedHotel.price.replace(/[^0-9.]/g, '');
      const pricePerNight = parseFloat(priceStr) || 0;
      
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const nights = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24)) || 1;
      const totalPrice = pricePerNight * nights * guests;

      const res = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hotel_name: selectedHotel.name,
          location: selectedHotel.location,
          price_per_night: selectedHotel.price,
          check_in: checkIn,
          check_out: checkOut,
          guests: guests,
          total_price: totalPrice
        })
      });

      if (res.ok) {
        setIsBookingModalOpen(false);
        router.push('/bookings');
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while booking.');
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      try {
        const query = encodeURIComponent(`hotels in ${city}`);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=6`;
        const res = await fetch(url, { headers: { 'User-Agent': 'TravelMate/1.0' } });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        
        const mapped: HotelData[] = data.map((item: any, i: number) => {
          // Generate realistic mock data for fields Nominatim doesn't provide
          const isLuxury = i % 2 === 0;
          return {
            id: item.place_id.toString(),
            name: item.name || item.display_name.split(',')[0] || "Unknown Hotel",
            location: item.display_name.split(',').slice(1, 3).join(',').trim() || city,
            price: isLuxury ? `$${300 + Math.floor(Math.random() * 200)}/night` : `$${100 + Math.floor(Math.random() * 150)}/night`,
            rating: isLuxury ? 4.8 : 4.2,
            reviews: Math.floor(Math.random() * 1000) + 100,
            image: isLuxury 
              ? 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
              : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            amenities: isLuxury ? ['Michelin Dining', 'Luxury Spa', 'Concierge'] : ['Free Wi-Fi', 'Breakfast', 'Pool'],
            budgetCategory: isLuxury ? 'luxury' : 'moderate'
          };
        });
        
        if (mapped.length === 0) {
          // Fallback if no hotels found for the query
           mapped.push({
            id: 'fallback-1',
            name: `Grand Plaza ${city.split(',')[0]}`,
            location: city,
            price: '$250/night',
            rating: 4.5,
            reviews: 500,
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
            amenities: ['Free Wi-Fi', 'Swimming Pool', 'Spa'],
            budgetCategory: 'moderate'
          });
        }
        
        setHotels(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, [city]);

  const filteredHotels = hotels.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase());
    const matchesBudget = budgetFilter === 'all' || h.budgetCategory === budgetFilter;
    return matchesSearch && matchesBudget;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Hotel className="w-4 h-4 text-cyan-400" /> REAL-TIME ACCOMMODATION
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Live Hotel & Resort Finder</h1>
        </div>

        {/* City Slider */}
        <div className="w-full md:w-1/2">
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

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search within ${city.split(',')[0]}...`}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={budgetFilter}
          onChange={(e) => setBudgetFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Budgets</option>
          <option value="moderate">Moderate ($150-$300)</option>
          <option value="luxury">Luxury ($300+)</option>
        </select>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center p-12 text-cyan-400 animate-pulse">
          <Sparkles className="w-8 h-8 mr-2" /> <span className="font-bold">Fetching Live Hotels in {city}...</span>
        </div>
      )}

      {/* Hotel Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="glass-card glass-card-hover border border-cyan-500/15 overflow-hidden flex flex-col justify-between">
              <div className="relative h-48 w-full">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1515] via-transparent to-transparent" />
                <button
                  onClick={() => toggleFavorite({ id: hotel.id, type: 'hotel', name: hotel.name, location: hotel.location, rating: hotel.rating, image: hotel.image })}
                  className={`absolute top-3 right-3 p-2 rounded-full glass-panel border transition-all ${
                    isFavorite(hotel.id) ? 'bg-amber-400 text-slate-950 border-amber-400' : 'border-cyan-500/30 text-slate-200'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-100 truncate">{hotel.name}</h3>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400" /> {hotel.rating} ({hotel.reviews})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> {hotel.location}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.amenities.map((am, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] glass-panel border border-cyan-500/20 text-cyan-300 font-mono">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-100">{hotel.price}</span>
                    <span className="text-[10px] text-slate-500 block">Est. Nightly Rate</span>
                  </div>
                  <button
                    onClick={() => handleBookClick(hotel)}
                    className="px-4 py-1.5 rounded-full btn-primary text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5"
                  >
                    Book <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Booking Modal */}
      {isBookingModalOpen && selectedHotel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl relative glass-panel">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Book Your Stay</h2>
            <p className="text-sm text-cyan-300 mb-6">{selectedHotel.name}</p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#1e293b] border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#1e293b] border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Guests</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full bg-[#1e293b] border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-cyan-500/20 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Total Price</p>
                  <p className="text-xl font-bold text-amber-400">
                    {(() => {
                      const priceStr = selectedHotel.price.replace(/[^0-9.]/g, '');
                      const pricePerNight = parseFloat(priceStr) || 0;
                      if (!checkIn || !checkOut) return selectedHotel.price;
                      const inDate = new Date(checkIn);
                      const outDate = new Date(checkOut);
                      const nights = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24)) || 1;
                      if (nights <= 0) return '$0';
                      return `$${pricePerNight * nights * guests}`;
                    })()}
                  </p>
                </div>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isBooking || !checkIn || !checkOut}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-full font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isBooking ? 'Booking...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
