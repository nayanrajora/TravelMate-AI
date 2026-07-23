'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('travelmate_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data.id.toString(),
          name: data.full_name,
          email: data.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
          bio: data.bio || 'Passionate traveler.'
        });
      } else {
        // Token invalid
        localStorage.removeItem('travelmate_token');
        setToken(null);
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string, userData: any) => {
    localStorage.setItem('travelmate_token', newToken);
    setToken(newToken);
    setUser({
      id: userData.id.toString(),
      name: userData.full_name,
      email: userData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      bio: userData.bio || 'Passionate traveler.'
    });
  };

  const logout = () => {
    localStorage.removeItem('travelmate_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    
    if (token) {
      try {
        const response = await fetch('http://localhost:8000/api/auth/me', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            full_name: data.name,
            bio: data.bio
          })
        });
        if (!response.ok) {
          console.warn('Failed to sync profile update to backend');
        }
      } catch (err) {
        console.warn('Error syncing profile:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
