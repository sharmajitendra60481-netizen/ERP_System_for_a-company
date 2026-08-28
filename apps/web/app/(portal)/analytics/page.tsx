'use client'

import { useState } from 'react'
import { PieChart, TrendingUp, Cpu, Sparkles, Activity, ShieldCheck } from 'lucide-react'

export default function AnalyticsPage() {
  const [forecast] = useState({
    refineryEfficiency: '98.4%',
    predictedLossPercentage: '0.8%',
    marketPriceTrend: 'RISING (+3.2% next month)',
    recommendedCrushingRate: '450 Tons / Day',
  })

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit mb-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Edible Oil Yield Forecaster
          </span>
          <h1 className="text-2xl font-bold">Predictive Analytics & Refinery Intelligence</h1>
          <p className="text-teal-100 text-sm mt-1">
            Machine learning market price forecasting for Soyabean & Palm Oil, refining efficiency telemetry, and loss minimization.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><Activity className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Refinery Efficiency</p>
            <p className="text-2xl font-bold text-teal-700">{forecast.refineryEfficiency}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Market Price Trend</p>
            <p className="text-sm font-bold text-emerald-700">{forecast.marketPriceTrend}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Cpu className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rec. Crushing Rate</p>
            <p className="text-2xl font-bold text-slate-900">{forecast.recommendedCrushingRate}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Process Loss Rate</p>
            <p className="text-2xl font-bold text-purple-700">{forecast.predictedLossPercentage}</p>
          </div>
        </div>
      </div>

      {/* Machine Learning Insights Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" /> AI Market Price & Raw Material Procurement Advice
        </h2>
        <div className="p-5 bg-teal-50/50 rounded-xl border border-teal-100 text-sm text-slate-700 space-y-2">
          <p className="font-bold text-teal-900">💡 Predictive Insight:</p>
          <p>
            International Crude Palm Oil (CPO) futures indicate a 3.2% price surge over the next 30 days due to import duty adjustments.
            We recommend increasing Crude Soyabean Degummed Oil procurement orders by <strong>15%</strong> this week to lock in optimal profit margins.
          </p>
        </div>
      </div>
    </div>
  )
}
