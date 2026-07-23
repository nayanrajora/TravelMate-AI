'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Globe, 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  Compass, 
  MapPin, 
  Calendar, 
  Wallet,
  Mic,
  Bell
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useTrip } from '@/context/TripContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useTrip();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Plan Trip', href: '/create-trip' },
    { name: 'AI Chat', href: '/chat' },
    { name: 'Weather', href: '/weather' },
    { name: 'Maps', href: '/maps' },
    { name: 'Hotels', href: '/hotels' },
    { name: 'Budget', href: '/budget' },
    ...(user ? [{ name: 'Bookings', href: '/bookings' }] : [])
  ];

  const toggleVoiceCommand = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setTimeout(() => {
        alert("🎤 Voice Command Activated: 'Plan a 5-day trip to Tokyo'");
        setIsListening(false);
      }, 2500);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyan-500/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20">
            <Globe className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-gradient-aurora">
              TravelMate <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] text-cyan-400/70 tracking-widest uppercase -mt-1 font-mono">
              Obsidian Aurora
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-cyan-950/20 p-1.5 rounded-full border border-cyan-500/15">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/30'
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Voice Command Button */}
          <button
            suppressHydrationWarning
            onClick={toggleVoiceCommand}
            title="Voice Command Assistant"
            className={`p-2.5 rounded-full glass-panel transition-all duration-300 border ${
              isListening
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                : 'border-cyan-500/20 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            suppressHydrationWarning
            onClick={toggleTheme}
            title="Toggle Light / Dark Mode"
            className="p-2.5 rounded-full glass-panel border border-cyan-500/20 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>

          {/* User Profile Link or Auth Buttons */}
          {user ? (
            <>
              {/* Notification Bell */}
              <Link
                href="/notifications"
                className="relative p-2.5 rounded-full glass-panel border border-cyan-500/20 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotifs}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full glass-panel border border-cyan-500/20 hover:border-cyan-400/40 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-cyan-400"
                />
                <span className="hidden md:inline text-xs font-semibold text-slate-200">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="ml-2 text-xs text-red-400 hover:text-red-300 font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors">
                Log In
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-full btn-primary text-xs font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl glass-panel text-slate-300 hover:text-cyan-400"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden glass-panel border-t border-cyan-500/20 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === link.href
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-cyan-500/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2 rounded-lg border border-cyan-500/30 text-xs font-semibold text-cyan-300"
            >
              Sign In
            </Link>
            <Link
              href="/create-trip"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2 rounded-lg btn-primary text-xs font-bold"
            >
              Start Planning
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
