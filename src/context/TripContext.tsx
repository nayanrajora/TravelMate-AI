'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { TripItinerary, FavoriteItem, NotificationItem, TripContextType, UserProfile } from '@/types';

const defaultTrips: TripItinerary[] = [
  {
    id: 'trip-tokyo-01',
    destination: 'Tokyo, Japan',
    startDate: '2026-09-10',
    endDate: '2026-09-17',
    budget: 'Moderate',
    travelers: 2,
    travelStyle: 'Couple',
    interests: ['Food', 'Museums', 'Shopping', 'Photography'],
    accommodations: ['Hotel'],
    transport: ['Train', 'Flight'],
    daysCount: 7,
    totalBudgetEst: 3200,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Shibuya Exploration',
        morning: { time: '09:00 AM', activity: 'Land at Narita & Skyliner to Tokyo', location: 'Shibuya', cost: 30 },
        afternoon: { time: '01:00 PM', activity: 'Shibuya Crossing & Hachiko Statue', location: 'Shibuya', cost: 0 },
        evening: { time: '06:30 PM', activity: 'Ramen Tasting & Tokyo Tower Sky Deck', location: 'Minato', cost: 45 }
      },
      {
        day: 2,
        title: 'Historic Asakusa & Digital Art Museum',
        morning: { time: '08:30 AM', activity: 'Senso-ji Temple & Nakamise Street', location: 'Asakusa', cost: 15 },
        afternoon: { time: '01:30 PM', activity: 'teamLab Planets Immersive Exhibition', location: 'Toyosu', cost: 38 },
        evening: { time: '07:00 PM', activity: 'Yakitori Dinner at Omoide Yokocho', location: 'Shinjuku', cost: 40 }
      },
      {
        day: 3,
        title: 'Akihabara Tech & Ueno Park Culture',
        morning: { time: '09:30 AM', activity: 'Ueno Park Stroll & Tokyo National Museum', location: 'Ueno', cost: 20 },
        afternoon: { time: '02:00 PM', activity: 'Anime & Gaming Arcade Tour', location: 'Akihabara', cost: 35 },
        evening: { time: '06:00 PM', activity: 'Kobe Beef Teppanyaki Experience', location: 'Ginza', cost: 120 }
      }
    ],
    budgetBreakdown: [
      { category: 'Flights & Transit', amount: 1200 },
      { category: 'Hotels & Stay', amount: 1100 },
      { category: 'Food & Dining', amount: 550 },
      { category: 'Activities & Passes', amount: 350 }
    ],
    hotels: [
      { name: 'Keio Plaza Hotel Shinjuku', rating: 4.8, price: '$180/night', location: 'Shinjuku, Tokyo', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
      { name: 'Hotel Gracery Shinjuku', rating: 4.6, price: '$150/night', location: 'Kabukicho, Tokyo', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80' }
    ],
    restaurants: [
      { name: 'Ichiran Ramen Shinjuku', cuisine: 'Japanese Tonkotsu', price: '$$', rating: 4.9, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80' },
      { name: 'Sukiyabashi Jiro Ginza', cuisine: 'Omakase Sushi', price: '$$$$', rating: 4.9, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80' }
    ],
    localTips: [
      'Purchase a Suica/Pasmo IC card for easy train transfers.',
      'Tipping is not customary in Japan.',
      'Trash cans are rare in public spaces—carry a small plastic bag.'
    ]
  },
  {
    id: 'trip-paris-02',
    destination: 'Paris, France',
    startDate: '2026-10-15',
    endDate: '2026-10-20',
    budget: 'Luxury',
    travelers: 2,
    travelStyle: 'Couple',
    interests: ['Museums', 'Food', 'Historical', 'Shopping'],
    accommodations: ['Hotel'],
    transport: ['Flight'],
    daysCount: 5,
    totalBudgetEst: 4500,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    itinerary: [
      {
        day: 1,
        title: 'Eiffel Tower & Seine Sunset Cruise',
        morning: { time: '09:30 AM', activity: 'Eiffel Tower Summit Access', location: 'Champ de Mars', cost: 35 },
        afternoon: { time: '01:30 PM', activity: 'Louvre Museum Tour', location: '1st Arrondissement', cost: 25 },
        evening: { time: '07:00 PM', activity: 'Bateaux Parisiens Gourmet Seine Cruise', location: 'River Seine', cost: 110 }
      }
    ],
    budgetBreakdown: [
      { category: 'Flights', amount: 1500 },
      { category: 'Luxury Hotel', amount: 2000 },
      { category: 'Fine Dining', amount: 700 },
      { category: 'Tours', amount: 300 }
    ],
    hotels: [
      { name: 'Le Meurice Paris', rating: 4.9, price: '$650/night', location: 'Rue de Rivoli', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' }
    ],
    restaurants: [
      { name: 'Le Jules Verne', cuisine: 'Contemporary French', price: '$$$$', rating: 4.8, image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80' }
    ],
    localTips: [
      'Say "Bonjour" before starting any conversation in shops.',
      'Book Louvre tickets weeks in advance.'
    ]
  }
];

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<TripItinerary[]>(defaultTrips);
  const [activeTrip, setActiveTrip] = useState<TripItinerary | null>(defaultTrips[0]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 'fav-1',
      type: 'place',
      name: 'Senso-ji Temple',
      location: 'Asakusa, Tokyo',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'fav-2',
      type: 'hotel',
      name: 'Keio Plaza Hotel Shinjuku',
      location: 'Tokyo, Japan',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
    }
  ]);
  const [currency, setCurrency] = useState('USD');
  const [user, setUser] = useState<UserProfile | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Flight Reminder',
      message: 'Your Tokyo flight leaves in 48 hours. Check in online now.',
      time: '10m ago',
      type: 'reminder',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Weather Update',
      message: 'Rain expected in Tokyo on Day 3. Carry a light umbrella.',
      time: '1h ago',
      type: 'weather',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Visa Requirement Alert',
      message: 'Ensure Visit Japan Web QR code is generated before departure.',
      time: '3h ago',
      type: 'visa',
      read: true
    }
  ]);

  useEffect(() => {
    const fetchUserTrips = async () => {
      const token = localStorage.getItem('travelmate_token');
      if (!token) return;
      
      try {
        const res = await fetch('http://localhost:8000/api/trips', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const dbTrips = await res.json();
          // Transform dbTrips into frontend format (optional mapping depending on backend format)
          const mappedTrips = dbTrips.map((dbTrip: any) => ({
            id: dbTrip.id.toString(),
            destination: dbTrip.destination,
            startDate: dbTrip.start_date,
            endDate: dbTrip.end_date,
            budget: dbTrip.budget_level,
            travelers: 2, // Default or parse from traveler_type
            travelStyle: dbTrip.traveler_type,
            interests: dbTrip.interests,
            accommodations: ['Hotel'], // Default
            transport: ['Flight'],
            daysCount: 7,
            totalBudgetEst: 2000,
            status: 'Upcoming',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
            itinerary: dbTrip.generated_itinerary?.itinerary || defaultTrips[0].itinerary,
            budgetBreakdown: dbTrip.generated_itinerary?.estimated_budget_split || defaultTrips[0].budgetBreakdown,
            hotels: defaultTrips[0].hotels,
            restaurants: defaultTrips[0].restaurants,
            localTips: defaultTrips[0].localTips
          }));
          
          if (mappedTrips.length > 0) {
            setTrips(mappedTrips);
            setActiveTrip(mappedTrips[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch trips', err);
      }
    };
    
    fetchUserTrips();
  }, [user]); // Re-fetch when user logs in

  const createTrip = async (data: Partial<TripItinerary>): Promise<TripItinerary> => {
    const fallbackTrip: TripItinerary = {
      id: `trip-${Date.now()}`,
      destination: data.destination || 'Bali, Indonesia',
      startDate: data.startDate || '2026-11-01',
      endDate: data.endDate || '2026-11-08',
      budget: data.budget || 'Moderate',
      travelers: data.travelers || 2,
      travelStyle: data.travelStyle || 'Solo',
      interests: data.interests || ['Beaches', 'Culture'],
      accommodations: data.accommodations || ['Hotel'],
      transport: data.transport || ['Flight'],
      daysCount: 7,
      totalBudgetEst: 2400,
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      itinerary: defaultTrips[0].itinerary,
      budgetBreakdown: defaultTrips[0].budgetBreakdown,
      hotels: defaultTrips[0].hotels,
      restaurants: defaultTrips[0].restaurants,
      localTips: defaultTrips[0].localTips
    };

    const token = localStorage.getItem('travelmate_token');
    if (!token) {
      // If not logged in, just do frontend state
      setTrips(prev => [fallbackTrip, ...prev]);
      setActiveTrip(fallbackTrip);
      return fallbackTrip;
    }

    try {
      const res = await fetch('http://localhost:8000/api/trips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `Trip to ${data.destination}`,
          destination: data.destination,
          start_date: data.startDate,
          end_date: data.endDate,
          budget_level: data.budget,
          traveler_type: data.travelStyle,
          interests: data.interests,
          is_draft: false
        })
      });
      
      if (res.ok) {
        const dbTrip = await res.json();
        
        const newTrip: TripItinerary = {
          ...fallbackTrip,
          id: dbTrip.id.toString(),
          itinerary: dbTrip.generated_itinerary?.itinerary || fallbackTrip.itinerary,
          budgetBreakdown: dbTrip.generated_itinerary?.estimated_budget_split || fallbackTrip.budgetBreakdown,
        };
        
        setTrips(prev => [newTrip, ...prev]);
        setActiveTrip(newTrip);
        return newTrip;
      }
    } catch (err) {
      console.error('Failed to save trip to backend', err);
    }
    
    // Fallback if backend fails
    setTrips(prev => [fallbackTrip, ...prev]);
    setActiveTrip(fallbackTrip);
    return fallbackTrip;
  };

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id);
      if (exists) return prev.filter(f => f.id !== item.id);
      return [...prev, item];
    });
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateUser = async (fields: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null; // If not logged in, you can't update profile context
      return { ...prev, ...fields };
    });
    try {
      const response = await fetch('http://localhost:8000/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Un-comment when JWT is ready on client
        },
        body: JSON.stringify({
          full_name: fields.name,
          bio: fields.bio,
          // travel_preferences could be mapped here too
        })
      });
      if (!response.ok) {
        console.warn('Failed to sync profile update to backend');
      }
    } catch (err) {
      console.warn('Error syncing profile:', err);
    }
  };

  return (
    <TripContext.Provider value={{
      trips,
      activeTrip,
      setActiveTrip,
      createTrip,
      favorites,
      toggleFavorite,
      isFavorite,
      currency,
      setCurrency,
      notifications,
      markNotificationRead,
      user,
      updateUser
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
