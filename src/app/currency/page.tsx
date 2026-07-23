'use client';

import React, { useState } from 'react';
import { DollarSign, ArrowRightLeft, RefreshCw, TrendingUp } from 'lucide-react';

export default function CurrencyPage() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('JPY');

  const exchangeRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    JPY: 155.4,
    GBP: 0.79,
    AUD: 1.51,
    CAD: 1.36,
    SGD: 1.35
  };

  const convertedAmount = ((amount * (exchangeRates[toCurr] || 1)) / (exchangeRates[fromCurr] || 1)).toFixed(2);

  const swapCurrencies = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto py-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <DollarSign className="w-4 h-4 text-cyan-400" /> REAL-TIME CURRENCY CALCULATOR
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Live Currency Converter</h1>
        <p className="text-xs text-slate-400">Calculate foreign exchange rates for your destination instantly.</p>
      </div>

      {/* CALCULATOR CARD */}
      <div className="glass-card p-8 border border-cyan-500/20 shadow-2xl space-y-6">
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl glass-panel border border-cyan-500/30 text-xl font-extrabold font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
          
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">From Currency</label>
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl glass-panel border border-cyan-500/30 text-xs font-bold text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
            >
              {Object.keys(exchangeRates).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="text-center">
            <button
              onClick={swapCurrencies}
              className="p-3 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:scale-110 transition-all mx-auto"
              title="Swap Currencies"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">To Currency</label>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl glass-panel border border-cyan-500/30 text-xs font-bold text-slate-100 bg-[#0d1515] focus:outline-none focus:border-cyan-400"
            >
              {Object.keys(exchangeRates).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

        </div>

        {/* RESULT BOX */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 text-center space-y-1 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-slate-900/40">
          <span className="text-xs text-slate-400 font-mono">CONVERTED EQUIVALENT</span>
          <div className="text-4xl font-extrabold text-gradient-aurora font-mono">
            {convertedAmount} {toCurr}
          </div>
          <p className="text-[11px] text-cyan-400 font-mono">1 {fromCurr} = {(exchangeRates[toCurr] / exchangeRates[fromCurr]).toFixed(4)} {toCurr}</p>
        </div>

      </div>

    </div>
  );
}
