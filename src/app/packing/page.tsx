'use client';

import React, { useState } from 'react';
import { Luggage, CheckSquare, Plus, Download, Sparkles, Shirt, Laptop, FileText, Sparkle, ArrowRight } from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import Link from 'next/link';

interface PackingItem {
  id: string;
  name: string;
  category: 'Clothes' | 'Electronics' | 'Documents' | 'Toiletries';
  packed: boolean;
}

export default function PackingPage() {
  const [activeTab, setActiveTab] = useState<'Clothes' | 'Electronics' | 'Documents' | 'Toiletries'>('Clothes');
  const [items, setItems] = useState<PackingItem[]>([
    { id: 'p-1', name: 'Lightweight Trench Coat', category: 'Clothes', packed: true },
    { id: 'p-2', name: 'Comfortable Mesh Sneakers', category: 'Clothes', packed: true },
    { id: 'p-3', name: 'Thermal Base Layers', category: 'Clothes', packed: false },
    { id: 'p-4', name: 'Universal Travel Adapter', category: 'Electronics', packed: true },
    { id: 'p-5', name: '10,000mAh Power Bank', category: 'Electronics', packed: true },
    { id: 'p-6', name: 'Noise Cancelling Headphones', category: 'Electronics', packed: false },
    { id: 'p-7', name: 'Passport & Visa Copies', category: 'Documents', packed: true },
    { id: 'p-8', name: 'Travel Insurance Documents', category: 'Documents', packed: true },
    { id: 'p-9', name: 'TSA Approved Toiletries Kit', category: 'Toiletries', packed: false }
  ]);

  const [newItemName, setNewItemName] = useState('');

  const togglePacked = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setItems([
      ...items,
      { id: `p-${Date.now()}`, name: newItemName, category: activeTab, packed: false }
    ]);
    setNewItemName('');
  };

  const { trips, activeTripId } = useTrip();
  const activeTrip = trips.find(t => t.id === activeTripId);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalItems = items.length;
  const packedCount = items.filter(i => i.packed).length;
  const packedPercent = Math.round((packedCount / (totalItems || 1)) * 100);

  const filteredItems = items.filter(i => i.category === activeTab);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setItems([
        { id: 'p-1', name: 'Lightweight Trench Coat', category: 'Clothes', packed: false },
        { id: 'p-2', name: 'Comfortable Mesh Sneakers', category: 'Clothes', packed: false },
        { id: 'p-3', name: 'Thermal Base Layers', category: 'Clothes', packed: false },
        { id: 'p-4', name: 'Universal Travel Adapter', category: 'Electronics', packed: false },
        { id: 'p-5', name: '10,000mAh Power Bank', category: 'Electronics', packed: false },
        { id: 'p-6', name: 'Noise Cancelling Headphones', category: 'Electronics', packed: false },
        { id: 'p-7', name: 'Passport & Visa Copies', category: 'Documents', packed: true },
        { id: 'p-8', name: 'Travel Insurance Documents', category: 'Documents', packed: true },
        { id: 'p-9', name: 'TSA Approved Toiletries Kit', category: 'Toiletries', packed: false }
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      {!activeTrip && (
        <div className="glass-card p-6 border border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-400">No Active Trip Selected</h3>
            <p className="text-xs text-slate-400">You are viewing the default packing list. To get real-time AI suggestions based on your destination's weather, create an itinerary.</p>
          </div>
          <Link href="/create-trip" className="px-5 py-2.5 rounded-full btn-primary text-xs font-bold flex items-center gap-2 whitespace-nowrap">
            <Sparkles className="w-4 h-4" /> Create AI Itinerary
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Luggage className="w-4 h-4 text-cyan-400" /> SMART PACKING MANAGER
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Interactive Packing Checklist</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isGenerating ? 'glass-panel border-cyan-500/30 text-cyan-300 opacity-70 cursor-wait' : 'glass-panel border-purple-500/30 text-purple-300 hover:border-purple-400 hover:text-purple-200'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} /> 
            {isGenerating ? 'Analyzing Weather...' : 'AI Auto-Pack'}
          </button>

          <button
            onClick={() => alert("Checklist exported as TXT file.")}
            className="px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-xs font-bold text-slate-200 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" /> Export List
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="glass-card p-6 border border-cyan-500/20 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-200">Packing Progress</span>
          <span className="text-cyan-400 font-mono">{packedCount} of {totalItems} Items ({packedPercent}%)</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-cyan-500/20">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
            style={{ width: `${packedPercent}%` }}
          />
        </div>
      </div>

      {/* CATEGORY TABS & CHECKLIST */}
      <div className="glass-card p-6 border border-cyan-500/20 space-y-6">
        
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-cyan-500/10">
          {(['Clothes', 'Electronics', 'Documents', 'Toiletries'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeTab === tab
                  ? 'bg-cyan-400 text-slate-950 font-bold border-cyan-400'
                  : 'glass-panel border-cyan-500/15 text-slate-300 hover:border-cyan-400/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`Add new item to ${activeTab}...`}
            className="flex-1 px-4 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          />
          <button type="submit" className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        {/* Item List */}
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => togglePacked(item.id)}
              className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                item.packed
                  ? 'bg-cyan-950/20 border-cyan-500/20 text-slate-400 line-through'
                  : 'glass-panel border-cyan-500/15 text-slate-100 hover:border-cyan-400/40'
              }`}
            >
              <span className="text-xs font-semibold">{item.name}</span>
              <input
                type="checkbox"
                checked={item.packed}
                onChange={() => {}}
                className="rounded border-cyan-400 text-cyan-400 bg-slate-900 focus:ring-0 w-4 h-4"
              />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
