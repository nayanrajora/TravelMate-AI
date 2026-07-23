'use client';

import React, { useState } from 'react';
import { HelpCircle, Search, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFeedback('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> SUPPORT BASE & FEEDBACK
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Help Center & Support</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search support articles, travel guides, or FAQ..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl glass-card border border-cyan-500/30 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 border border-cyan-500/15 space-y-2">
          <h3 className="text-sm font-bold text-slate-100">How do I export to Google Calendar?</h3>
          <p className="text-xs text-slate-400">Click the 'Google Calendar' button on your itinerary result page to automatically sync all morning, afternoon, and evening events.</p>
        </div>
        <div className="glass-card p-5 border border-cyan-500/15 space-y-2">
          <h3 className="text-sm font-bold text-slate-100">Can I edit generated routes?</h3>
          <p className="text-xs text-slate-400">Yes! Open your AI Chat Assistant or use the trip builder to modify activities, change hotel preferences, or adjust budget tiers anytime.</p>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="glass-card p-6 border border-cyan-500/20 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" /> Report an Issue / Share Feedback
        </h3>

        {submitted ? (
          <div className="p-4 rounded-xl glass-panel border border-emerald-500/30 text-center text-xs text-emerald-400 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Thank you! Your feedback has been sent to our technical engineering team.
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-3">
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe your issue or suggestions for TravelMate AI..."
              className="w-full p-4 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
            />
            <button type="submit" className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold flex items-center gap-2">
              <Send className="w-4 h-4" /> Submit Feedback
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
