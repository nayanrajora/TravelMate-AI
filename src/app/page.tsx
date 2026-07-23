'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Sparkles, 
  ArrowRight, 
  Globe, 
  MapPin, 
  Compass, 
  DollarSign, 
  CloudSun, 
  Luggage, 
  Hotel, 
  Utensils, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  Star, 
  ChevronDown, 
  CheckCircle2, 
  Zap,
  Play
} from 'lucide-react';

// Dynamic import for WebGL Globe to prevent SSR hydrations
const Globe3D = dynamic(() => import('@/components/3d/Globe3D'), { ssr: false });

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    { label: 'Trips Planned', value: '154,200+' },
    { label: 'Countries Covered', value: '195' },
    { label: 'Happy Travelers', value: '98.9%' },
    { label: 'AI Gen Speed', value: '0.4s' }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI Itinerary Generator',
      desc: 'Instant hyper-personalized day-by-day travel routes crafted by neural engines tailored to your budget and travel style.',
      color: 'from-cyan-500 to-blue-600',
      badge: 'Core Engine',
      href: '/create-trip'
    },
    {
      icon: DollarSign,
      title: 'Smart Budget Analytics',
      desc: 'Interactive financial breakdown charts with real-time AI cost optimization tips and currency calculations.',
      color: 'from-purple-500 to-indigo-600',
      badge: 'Recharts',
      href: '/budget'
    },
    {
      icon: MessageSquare,
      title: '24/7 AI Concierge Chat',
      desc: 'Streaming conversational assistant ready to answer questions, revise plans, or suggest local hidden gems on demand.',
      color: 'from-pink-500 to-purple-600',
      badge: 'Live Chat',
      href: '/chat'
    },
    {
      icon: CloudSun,
      title: 'Weather & Smart Outfit Advisor',
      desc: 'Forecast analysis coupled with automated clothing and packing suggestions based on temperature & humidity.',
      color: 'from-amber-400 to-orange-500',
      badge: 'Real-time',
      href: '/weather'
    },
    {
      icon: Luggage,
      title: 'Reactive Packing Checklist',
      desc: 'Category-organized items (Clothes, Electronics, Documents) with progress tracking and exportable checklists.',
      color: 'from-emerald-400 to-teal-500',
      badge: 'Interactive',
      href: '/packing'
    },
    {
      icon: Hotel,
      title: 'Curated Hotel Directory',
      desc: 'Deep filtering by price range, star rating, and amenities paired with dynamic map locations and instant booking.',
      color: 'from-cyan-400 to-teal-600',
      badge: 'Verified',
      href: '/hotels'
    }
  ];

  const steps = [
    { title: 'Choose Destination', desc: 'Type any city, country, or region worldwide with auto-suggest capabilities.' },
    { title: 'Set Preferences', desc: 'Define your dates, budget tier, traveler count, and interests (Food, Adventure, Art).' },
    { title: 'Neural Generation', desc: 'TravelMate AI builds your customized morning, afternoon, and evening itinerary.' },
    { title: 'Customize & Fine-tune', desc: 'Drag, edit, swap venues, or consult the 24/7 AI Chat Assistant.' },
    { title: 'Export & Travel', desc: 'Download ready-to-use PDF itineraries or sync directly with Google Calendar.' }
  ];

  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'Digital Nomad',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      comment: 'TravelMate AI planned my 2-week Japan trip flawlessly! The 3D globe visualization and budget pie charts saved me hours of research.',
      rating: 5
    },
    {
      name: 'Marcus Vance',
      role: 'Solo Explorer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment: 'The AI Weather Smart-Packing feature was a lifesaver for my Swiss Alps trip. The UI is sleek, futuristic, and super fast.',
      rating: 5
    },
    {
      name: 'Sophia & Liam',
      role: 'Honeymooners',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      comment: 'We used the Voice Narrator feature while walking around Paris! It felt like having a private luxury tour guide in our pocket.',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'How does TravelMate AI generate my travel itinerary?',
      a: 'TravelMate AI leverages advanced machine learning models trained on global travel data, local weather forecasts, budget benchmarks, and venue reviews to generate optimized day-by-day schedules.'
    },
    {
      q: 'Can I export my generated itinerary?',
      a: 'Yes! You can export your full itinerary as a beautifully formatted PDF document or sync events directly with Google Calendar with a single click.'
    },
    {
      q: 'Is the 3D WebGL Globe compatible with mobile devices?',
      a: 'Absolutely. The 3D Globe uses lightweight procedural shaders and touch-friendly controls optimized for mobile GPUs and high frame-rate performance.'
    },
    {
      q: 'How does the AI Chat Assistant work during my trip?',
      a: 'The AI Assistant retains full context of your trip details. You can ask for nearby restaurant recommendations, translated phrases, or emergency local tips anytime.'
    }
  ];

  return (
    <div className="space-y-24">
      
      {/* HERO SECTION */}
      <section className="relative pt-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-gradient-teal">NEXT-GEN AI TRAVEL ENGINE 3.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Explore The World With <br />
            <span className="text-gradient-aurora">Crystalline Intelligence.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
            Architect your ultimate journey with state-of-the-art predictive routing. TravelMate AI synthesizes real-time metrics, hyper-personalized financial models, and environmental analytics into blazing-fast, actionable itineraries.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/create-trip"
              className="px-7 py-3.5 rounded-full btn-primary text-sm font-bold flex items-center gap-2 shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Plan Your Trip Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/trip/trip-tokyo-01"
              className="px-6 py-3.5 rounded-full glass-panel border border-cyan-500/30 text-sm font-semibold text-slate-200 hover:text-cyan-300 hover:border-cyan-400 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              Try Live Demo
            </Link>
          </div>

          {/* Key Badges */}
          <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Free Trial Included
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> PDF & Calendar Export
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 3D WebGL Visualization
            </span>
          </div>
        </div>

        {/* Right 3D Globe */}
        <div className="lg:col-span-5 w-full">
          <Globe3D />
        </div>
      </section>

      {/* STATISTICS COUNTER SECTION */}
      <section className="glass-card p-8 border border-cyan-500/20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((st, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-gradient-teal font-mono">
                {st.value}
              </div>
              <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gradient-aurora">
            Powered by Modern Concierge Intelligence
          </h2>
          <p className="text-sm text-slate-400">
            Everything you need for seamless end-to-end trip planning, budget management, and weather preparation in one unified obsidian platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <Link href={feat.href} key={idx} className="block group">
                <div
                  className="glass-card glass-card-hover p-6 flex flex-col justify-between space-y-4 border border-cyan-500/15 h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${feat.color} shadow-lg text-slate-950`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold glass-panel text-cyan-300 border border-cyan-500/30 uppercase">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>

                  <div className="pt-2 flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                    <span>Explore Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS STEPPER */}
      <section className="glass-card p-8 border border-cyan-500/20 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-100">How TravelMate AI Works</h2>
          <p className="text-xs text-slate-400">From idea to exportable itinerary in 5 simple steps.</p>
        </div>

        {/* Horizontal Steps Navigator */}
        <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-none border-b border-cyan-500/10">
          {steps.map((st, i) => (
            <button
              key={i}
              suppressHydrationWarning
              onClick={() => setActiveStep(i)}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl text-xs font-bold transition-all text-left border ${
                activeStep === i
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                  : 'glass-panel border-cyan-500/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-mono text-cyan-400 block mb-0.5">STEP 0{i + 1}</span>
              {st.title}
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="p-6 rounded-xl glass-panel border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              STEP 0{activeStep + 1} OF 05
            </span>
            <h3 className="text-xl font-bold text-slate-100">{steps[activeStep].title}</h3>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">{steps[activeStep].desc}</p>
          </div>
          <Link
            href="/create-trip"
            className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold shrink-0"
          >
            Try Step 0{activeStep + 1} Live
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Loved by Travelers Worldwide</h2>
          <p className="text-xs text-slate-400">See what real explorers say about TravelMate AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card p-6 border border-cyan-500/15 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => (
                  <Star key={r} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-cyan-500/10">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-cyan-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{t.name}</h4>
                  <span className="text-[10px] text-cyan-400 font-mono">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-100">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about TravelMate AI.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="glass-card border border-cyan-500/15 overflow-hidden transition-all"
              >
                <button
                  suppressHydrationWarning
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm font-bold text-slate-200">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-cyan-500/10">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="glass-panel rounded-3xl p-10 border border-cyan-500/30 text-center space-y-6 bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-cyan-950/40">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-100">Ready to Plan Your Next Journey?</h2>
          <p className="text-xs text-slate-300">Join over 150,000 travelers using TravelMate AI to create unforgettable memories.</p>
        </div>
        <Link
          href="/create-trip"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-primary text-sm font-bold shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Create Free AI Trip Now
        </Link>
      </section>

    </div>
  );
}
