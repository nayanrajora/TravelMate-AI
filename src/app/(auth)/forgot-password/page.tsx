'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md glass-card p-8 border border-cyan-500/20 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-lg mb-2">
            <Globe className="w-6 h-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Reset Password</h1>
          <p className="text-xs text-slate-400">Enter your email and we'll send a recovery link.</p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-xl glass-panel border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-100">Recovery Email Sent!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We have dispatched a password recovery link to <span className="font-mono text-cyan-300">{email}</span>.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full btn-primary text-xs font-bold mt-2"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Registered Email</label>
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

            <button
              type="submit"
              className="w-full py-3 rounded-full btn-primary text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              Send Recovery Link
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
