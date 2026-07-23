'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Volume2, 
  FileText, 
  CalendarPlus, 
  Star, 
  CheckCircle2, 
  Hotel as HotelIcon, 
  Utensils, 
  Sun, 
  ShieldAlert, 
  Share2, 
  Users,
  Compass
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import { useTrip } from '@/context/TripContext';
import { TripItinerary } from '@/types';

export default function TripResultPage() {
  const params = useParams();
  const router = useRouter();
  const { trips } = useTrip();

  const currentTrip = trips.find(t => t.id === params.id) || trips[0];

  const [activeDay, setActiveDay] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  const activeDayItinerary = currentTrip.itinerary.find(i => i.day === activeDay) || currentTrip.itinerary[0];

  // Colors for Recharts pie chart
  const CHART_COLORS = ['#00f5ff', '#9400e4', '#e3b5ff', '#ffdb3f'];

  // Text-To-Speech Narrator
  const readDailyPlanAloud = () => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }

      const text = `Day ${activeDayItinerary.day}: ${activeDayItinerary.title}. Morning: ${activeDayItinerary.morning.activity} at ${activeDayItinerary.morning.location}. Afternoon: ${activeDayItinerary.afternoon.activity}. Evening: ${activeDayItinerary.evening.activity}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported on this browser.");
    }
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`TravelMate AI - ${currentTrip.destination} Itinerary`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Dates: ${currentTrip.startDate} to ${currentTrip.endDate} | Budget: ${currentTrip.budget}`, 14, 30);
    
    let y = 42;
    currentTrip.itinerary.forEach(day => {
      doc.setFontSize(14);
      doc.text(`Day ${day.day}: ${day.title}`, 14, y);
      y += 8;
      doc.setFontSize(10);
      doc.text(`- Morning (${day.morning.time}): ${day.morning.activity}`, 16, y);
      y += 6;
      doc.text(`- Afternoon (${day.afternoon.time}): ${day.afternoon.activity}`, 16, y);
      y += 6;
      doc.text(`- Evening (${day.evening.time}): ${day.evening.activity}`, 16, y);
      y += 10;
    });

    doc.save(`TravelMate_${currentTrip.destination.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

  // Export to Google Calendar
  const exportGoogleCalendar = () => {
    const title = encodeURIComponent(`Trip to ${currentTrip.destination}`);
    const details = encodeURIComponent(`TravelMate AI Itinerary for ${currentTrip.destination}`);
    const location = encodeURIComponent(currentTrip.destination);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8">
      
      {/* DESTINATION OVERVIEW BANNER */}
      <section className="relative glass-panel rounded-3xl p-8 border border-cyan-500/20 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                AI GENERATED ITINERARY
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {currentTrip.daysCount} DAYS TRIP
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              {currentTrip.destination}
            </h1>

            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {currentTrip.startDate} – {currentTrip.endDate}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Est. Total: ${currentTrip.totalBudgetEst} ({currentTrip.budget})</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-cyan-400" /> {currentTrip.travelers} Travelers ({currentTrip.travelStyle})</span>
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            
            {/* Voice Narrator Button */}
            <button
              onClick={readDailyPlanAloud}
              className={`px-4 py-2 rounded-full glass-panel border text-xs font-bold flex items-center gap-1.5 transition-all ${
                speaking
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                  : 'border-cyan-500/30 text-cyan-300 hover:border-cyan-400'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {speaking ? 'Stop Voice' : 'AI Voice Narrator'}
            </button>

            {/* PDF Download */}
            <button
              onClick={exportPDF}
              className="px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-xs font-bold text-slate-200 hover:text-cyan-300 hover:border-cyan-400 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-cyan-400" /> Export PDF
            </button>

            {/* Calendar Export */}
            <button
              onClick={exportGoogleCalendar}
              className="px-4 py-2 rounded-full btn-primary text-xs font-bold flex items-center gap-1.5"
            >
              <CalendarPlus className="w-4 h-4" /> Google Calendar
            </button>
          </div>
        </div>
      </section>

      {/* DAILY ITINERARY & BUDGET GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Daily Itinerary Timeline */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Day Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-cyan-500/10">
            {currentTrip.itinerary.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  activeDay === day.day
                    ? 'bg-cyan-400 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-400/20'
                    : 'glass-panel border-cyan-500/15 text-slate-400 hover:text-slate-200'
                }`}
              >
                Day 0{day.day}
              </button>
            ))}
          </div>

          {/* Active Day Overview Card */}
          <div className="glass-card p-6 border border-cyan-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-100">
                Day {activeDayItinerary.day}: {activeDayItinerary.title}
              </h3>
              <span className="text-xs text-cyan-400 font-mono">3 Scheduled Activities</span>
            </div>

            {/* Timeline */}
            <div className="space-y-6 relative pl-6 border-l-2 border-cyan-500/20">
              
              {/* Morning */}
              <div className="relative space-y-1">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-cyan-400 border-4 border-[#0d1515]" />
                <div className="flex items-center justify-between text-xs text-cyan-400 font-mono font-bold">
                  <span>MORNING • {activeDayItinerary.morning.time}</span>
                  <span>Est. ${activeDayItinerary.morning.cost}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">{activeDayItinerary.morning.activity}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {activeDayItinerary.morning.location}
                </p>
              </div>

              {/* Afternoon */}
              <div className="relative space-y-1">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#0d1515]" />
                <div className="flex items-center justify-between text-xs text-purple-400 font-mono font-bold">
                  <span>AFTERNOON • {activeDayItinerary.afternoon.time}</span>
                  <span>Est. ${activeDayItinerary.afternoon.cost}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">{activeDayItinerary.afternoon.activity}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" /> {activeDayItinerary.afternoon.location}
                </p>
              </div>

              {/* Evening */}
              <div className="relative space-y-1">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-400 border-4 border-[#0d1515]" />
                <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold">
                  <span>EVENING • {activeDayItinerary.evening.time}</span>
                  <span>Est. ${activeDayItinerary.evening.cost}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">{activeDayItinerary.evening.activity}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {activeDayItinerary.evening.location}
                </p>
              </div>

            </div>
          </div>

          {/* HOTELS & RESTAURANTS RECOMMENDATIONS */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <HotelIcon className="w-4 h-4 text-cyan-400" /> AI Hotel & Dining Matches
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentTrip.hotels.map((hotel, hIdx) => (
                <div key={hIdx} className="glass-card p-4 border border-cyan-500/15 flex gap-4">
                  <img src={hotel.image} alt={hotel.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-bold text-slate-100">{hotel.name}</h4>
                    <p className="text-[11px] text-slate-400">{hotel.location}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-cyan-300">{hotel.price}</span>
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" /> {hotel.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Budget Recharts & Local Tips */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recharts Pie Chart */}
          <div className="glass-card p-6 border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-400" /> Estimated Expense Breakdown
            </h3>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentTrip.budgetBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {currentTrip.budgetBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#151d1d', borderColor: 'rgba(0,245,255,0.3)', borderRadius: '8px', color: '#dce4e4', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#b9caca' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Local Insights & Etiquette */}
          <div className="glass-card p-6 border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" /> Local Insights & Etiquette
            </h3>

            <ul className="space-y-2 text-xs text-slate-300">
              {currentTrip.localTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
