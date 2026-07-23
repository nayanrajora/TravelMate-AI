export interface TripItinerary {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  travelStyle: string;
  interests: string[];
  accommodations: string[];
  transport: string[];
  daysCount: number;
  totalBudgetEst: number;
  status: 'Active' | 'Upcoming' | 'Completed';
  image: string;
  itinerary: {
    day: number;
    title: string;
    morning: { time: string; activity: string; location: string; cost: number };
    afternoon: { time: string; activity: string; location: string; cost: number };
    evening: { time: string; activity: string; location: string; cost: number };
  }[];
  budgetBreakdown: { category: string; amount: number }[];
  hotels: { name: string; rating: number; price: string; location: string; image: string }[];
  restaurants: { name: string; cuisine: string; price: string; rating: number; image: string }[];
  localTips: string[];
}

export interface FavoriteItem {
  id: string;
  type: 'place' | 'hotel' | 'restaurant' | 'trip';
  name: string;
  location: string;
  rating?: number;
  image: string;
  details?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'weather' | 'reminder' | 'visa' | 'packing';
  read: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  country?: string;
  avatar: string;
  bio: string;
}

export interface TripContextType {
  trips: TripItinerary[];
  activeTrip: TripItinerary | null;
  setActiveTrip: (trip: TripItinerary | null) => void;
  createTrip: (data: Partial<TripItinerary>) => Promise<TripItinerary>;
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
  currency: string;
  setCurrency: (c: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  user: UserProfile | null;
  updateUser: (fields: Partial<UserProfile>) => void;
}

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
