'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Globe, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      // 1. Register User
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: name })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
      
      // 2. Auto Login after Registration
      const loginRes = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        const meRes = await fetch('http://localhost:8000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${loginData.access_token}` }
        });
        if (meRes.ok) {
          const userData = await meRes.json();
          login(loginData.access_token, userData);
        }
      }
      
      // 3. Redirect logic
      const redirectPath = searchParams?.get('redirect');
      const hotel = searchParams?.get('hotel');
      
      if (redirectPath) {
        if (hotel) {
          router.push(`${redirectPath}?hotel=${encodeURIComponent(hotel)}`);
        } else {
          router.push(redirectPath);
        }
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md glass-card p-8 border border-cyan-500/20 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-lg mb-2">
            <Globe className="w-6 h-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Create Account</h1>
          <p className="text-xs text-slate-400">Join TravelMate AI and start planning your dream itineraries.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-xs border border-red-500/30 text-center">{error}</div>}
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Vance"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              required
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="rounded border-cyan-500/30 text-cyan-400 bg-slate-900 focus:ring-0"
            />
            <span className="text-[11px] text-slate-400 leading-snug">
              I agree to the <a href="#" className="text-cyan-400 underline">Terms of Service</a> and <a href="#" className="text-cyan-400 underline">Privacy Policy</a>.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full btn-primary text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
            ) : (
              <>
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-cyan-400 hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
