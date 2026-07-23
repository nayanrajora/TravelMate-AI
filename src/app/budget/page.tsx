'use client';

import React, { useState } from 'react';
import { DollarSign, Plus, TrendingUp, Sparkles, PieChart as PieIcon, BarChart3, CheckCircle2, Activity, ArrowRight, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTrip } from '@/context/TripContext';
import Link from 'next/link';

export default function BudgetPlannerPage() {
  const [expenses, setExpenses] = useState([
    { id: 'exp-1', name: 'Narita Skyliner Express', category: 'Transport', amount: 30, date: '2026-09-10' },
    { id: 'exp-2', name: 'Shibuya Izakaya Dinner', category: 'Food', amount: 45, date: '2026-09-10' },
    { id: 'exp-3', name: 'Keio Plaza Hotel Deposit', category: 'Stay', amount: 360, date: '2026-09-09' },
    { id: 'exp-4', name: 'teamLab Planets Entry', category: 'Activities', amount: 38, date: '2026-09-11' }
  ]);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');

  const { trips, activeTripId } = useTrip();
  const activeTrip = trips.find(t => t.id === activeTripId);
  const budgetLimit = activeTrip?.totalBudgetEst || 5000;
  const daysCount = activeTrip?.daysCount || 7;

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetUtilization = Math.min((totalSpent / budgetLimit) * 100, 100);
  const dailyAverage = totalSpent / daysCount;

  const chartData = [
    { category: 'Transport', amount: expenses.filter(e => e.category === 'Transport').reduce((a, c) => a + c.amount, 0) },
    { category: 'Food', amount: expenses.filter(e => e.category === 'Food').reduce((a, c) => a + c.amount, 0) },
    { category: 'Stay', amount: expenses.filter(e => e.category === 'Stay').reduce((a, c) => a + c.amount, 0) },
    { category: 'Activities', amount: expenses.filter(e => e.category === 'Activities').reduce((a, c) => a + c.amount, 0) }
  ];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;
    setExpenses([
      { id: `exp-${Date.now()}`, name, category, amount: parseFloat(amount), date: new Date().toISOString().split('T')[0] },
      ...expenses
    ]);
    setName('');
    setAmount('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {!activeTrip && (
        <div className="glass-card p-6 border border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-400">No Active Trip Selected</h3>
            <p className="text-xs text-slate-400">You are viewing default analyst metrics. Create an itinerary to bind these analytics to a real trip budget.</p>
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
            <DollarSign className="w-4 h-4 text-cyan-400" /> FINANCIAL INTELLIGENCE DASHBOARD
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Smart Budget Analytics</h1>
        </div>

        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 rounded-2xl border border-cyan-500/20 text-right">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Daily Avg Spend</span>
            <span className="text-xl font-extrabold text-purple-400 font-mono">${dailyAverage.toFixed(0)}/day</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-2xl border border-cyan-500/20 text-right bg-cyan-500/5">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Logged Expense</span>
            <span className="text-2xl font-extrabold text-gradient-teal font-mono">${totalSpent.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Budget Utilization Bar */}
      <div className="glass-card p-6 border border-cyan-500/20 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-200 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400"/> Budget Utilization ({activeTrip?.destination || 'Global'})</span>
          <span className={`${budgetUtilization > 90 ? 'text-red-400' : 'text-cyan-400'} font-mono`}>
            ${totalSpent.toFixed(0)} of ${budgetLimit} ({budgetUtilization.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full h-4 rounded-full bg-slate-900 overflow-hidden border border-cyan-500/20">
          <div
            className={`h-full transition-all duration-1000 ${budgetUtilization > 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyan-400 to-purple-500'}`}
            style={{ width: `${budgetUtilization}%` }}
          />
        </div>
        {budgetUtilization > 85 && (
          <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" /> Warning: Approaching estimated budget limit.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Add Expense Form & Ledger */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Add Form */}
          <div className="glass-card p-6 border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" /> Log New Expense
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Metro Ticket"
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Stay">Stay</option>
                    <option value="Activities">Activities</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Amount ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full btn-primary text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Expense
              </button>
            </form>
          </div>

          {/* Recent Ledger */}
          <div className="glass-card p-5 border border-cyan-500/15 space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">Expense History Log</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {expenses.map((exp) => (
                <div key={exp.id} className="p-3 rounded-xl glass-panel border border-cyan-500/10 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-200">{exp.name}</h4>
                    <span className="text-[10px] text-cyan-400 font-mono">{exp.category} • {exp.date}</span>
                  </div>
                  <span className="font-extrabold text-slate-100 font-mono">${exp.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 7 Cols: Recharts Summary & AI Savings Tips */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Recharts Bar Chart */}
          <div className="glass-card p-6 border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Expense Allocation Chart
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="category" stroke="#849495" fontSize={11} />
                  <YAxis stroke="#849495" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#151d1d', borderColor: 'rgba(0,245,255,0.3)', color: '#dce4e4', borderRadius: '8px' }} />
                  <Bar dataKey="amount" fill="#00f5ff" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#00f5ff', '#9400e4', '#e3b5ff', '#ffdb3f'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Savings Advisor */}
          <div className="glass-card p-6 border border-cyan-500/20 space-y-3 bg-gradient-to-br from-cyan-950/30 to-purple-950/30">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-spin" />
              <h3 className="text-sm font-bold text-slate-100">AI Financial Savings Advice</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>You can save ~$40 on Tokyo transit by buying a 72-hour Tokyo Subway Ticket instead of single rides.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Dining at 7-Eleven or Lawson for breakfast can cut daily food costs by 35%.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
