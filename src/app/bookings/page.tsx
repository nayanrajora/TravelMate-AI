'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Hotel, MapPin, Calendar, Users, CreditCard, Sparkles } from 'lucide-react';

interface Booking {
  id: number;
  hotel_name: string;
  location: string;
  price_per_night: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    
    if (!user || !token) {
      router.push('/login?redirect=/bookings');
      return;
    }

    async function fetchBookings() {
      try {
        const res = await fetch('http://localhost:8000/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user, token, isAuthLoading, router]);

  if (isAuthLoading || loading) {
    return (
      <div className="flex items-center justify-center p-12 text-cyan-400 animate-pulse min-h-[60vh]">
        <Sparkles className="w-8 h-8 mr-2" /> <span className="font-bold">Loading Your Reservations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Hotel className="w-4 h-4 text-cyan-400" /> MY RESERVATIONS
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-2">Upcoming & Past Stays</h1>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-panel border border-cyan-500/20 p-12 text-center rounded-3xl">
          <Hotel className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-200 mb-2">No Bookings Yet</h2>
          <p className="text-sm text-slate-400 mb-6">You haven't booked any hotels yet. Start exploring now!</p>
          <button
            onClick={() => router.push('/hotels')}
            className="btn-primary px-6 py-2.5 rounded-full font-bold text-sm"
          >
            Find a Hotel
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass-card border border-cyan-500/20 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-cyan-400/50">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-100">{booking.hotel_name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    booking.status.toLowerCase() === 'confirmed' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" /> {booking.location}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{booking.check_in} — {booking.check_out}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                </div>
              </div>

              <div className="md:text-right border-t md:border-t-0 md:border-l border-cyan-500/20 pt-4 md:pt-0 md:pl-6">
                <p className="text-xs text-slate-400 mb-1">Total Paid</p>
                <p className="text-3xl font-extrabold text-amber-400 flex items-center md:justify-end gap-1.5">
                   ${booking.total_price.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">{booking.price_per_night} / night</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
