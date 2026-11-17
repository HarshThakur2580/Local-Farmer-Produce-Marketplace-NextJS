'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import StatCard from '@/components/admin/StatCard';

export default function AdminReportsPage() {
  const { customers, farmers, products, orders, payments, totalRevenue, platformEarnings } = useAdmin();
  const [selectedReportPeriod, setSelectedReportPeriod] = useState('2026-Q4');

  // Top products by estimated revenue
  const topProducts = [
    { name: 'Alphonso Mangoes', farmer: 'Konkan Fresh', sales: 4890, orders: 213, growth: '+42%' },
    { name: 'Artisanal Wildflower Honey', farmer: "Nature's Nectar", sales: 3980, orders: 311, growth: '+31%' },
    { name: 'Fresh Tomatoes', farmer: 'Green Valley Farm', sales: 2450, orders: 124, growth: '+19%' },
    { name: 'Brown Rice', farmer: 'Heritage Grains Co.', sales: 1890, orders: 156, growth: '+15%' },
    { name: 'Sweet Corn', farmer: 'Sunrise Acres', sales: 1120, orders: 89, growth: '+8%' },
  ];

  // Top farmers by sales volume
  const topFarmers = [
    { name: 'Konkan Fresh (Suresh Patil)', location: 'Maharashtra', volume: '₹2,48,900', rating: 4.9, fulfillment: '99.4%' },
    { name: "Nature's Nectar (Mahesh Negi)", location: 'Uttarakhand', volume: '₹1,98,000', rating: 5.0, fulfillment: '100%' },
    { name: 'Green Valley Farm (Ravi Kumar)', location: 'Karnataka', volume: '₹1,42,500', rating: 4.8, fulfillment: '98.8%' },
    { name: 'Sunrise Acres (Gurpreet Singh)', location: 'Punjab', volume: '₹1,18,400', rating: 4.6, fulfillment: '97.2%' },
    { name: 'Heritage Grains Co. (Anand Reddy)', location: 'Andhra Pradesh', volume: '₹89,000', rating: 4.5, fulfillment: '98.0%' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Marketplace Analytics & Financial Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Aggregated revenue trends, agricultural sales distributions, producer rankings and growth telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedReportPeriod}
            onChange={(e) => setSelectedReportPeriod(e.target.value)}
            className="border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer focus:ring-2 focus:ring-green-500"
          >
            <option value="2026-Q4">Current Quarter (Q4 2026)</option>
            <option value="2026-Q3">Quarter 3 (Q3 2026)</option>
            <option value="2026-YTD">Year to Date (2026)</option>
          </select>

          <button
            onClick={() => alert('Audited Report package compiled & downloaded (PDF/CSV).')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <span>📥</span> Download Report
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Volume"
          value={`₹${totalRevenue.toFixed(2)}`}
          icon="📈"
          change="+34.8%"
          changeType="positive"
          subtitle="vs previous period"
        />
        <StatCard
          title="Platform Take (10%)"
          value={`₹${platformEarnings.toFixed(2)}`}
          icon="🏛️"
          change="+34.8%"
          changeType="positive"
          subtitle="net retained margin"
        />
        <StatCard
          title="Producer Payouts"
          value={`₹${(totalRevenue - platformEarnings).toFixed(2)}`}
          icon="🌾"
          change="+34.8%"
          changeType="positive"
          subtitle="direct to farmers"
        />
        <StatCard
          title="Active Consumers"
          value={customers.length * 125}
          icon="👥"
          change="+21.5%"
          changeType="positive"
          subtitle="projected buyer cohort"
        />
      </div>

      {/* Top Products and Top Farmers 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Produce */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Top Performing Products</h3>
              <p className="text-xs text-gray-400">Ranked by revenue contribution</p>
            </div>
            <span className="text-xs bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded-full">
              Quarterly Leaderboard
            </span>
          </div>

          <div className="space-y-3">
            {topProducts.map((p, index) => (
              <div
                key={p.name}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 hover:bg-gray-100/70 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-extrabold text-sm text-gray-400">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{p.name}</p>
                    <p className="text-[11px] text-gray-400">{p.farmer}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-extrabold text-green-700">₹{p.sales.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">{p.growth} growth</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Farmers */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Top Producer Incomes</h3>
              <p className="text-xs text-gray-400">Disbursed directly to farm families</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
              Fulfillment & Quality
            </span>
          </div>

          <div className="space-y-3">
            {topFarmers.map((f, index) => (
              <div
                key={f.name}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 hover:bg-gray-100/70 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center font-extrabold text-sm text-gray-400 flex-shrink-0">
                    #{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{f.name}</p>
                    <p className="text-[11px] text-gray-400">
                      📍 {f.location} · {f.fulfillment} fulfillment rate
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-extrabold text-green-700">{f.volume}</p>
                  <p className="text-[10px] text-yellow-600 font-bold">★ {f.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Growth & Quality Summary */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
        <h3 className="font-bold text-gray-900 text-base mb-1">Growth & Quality Telemetry Summary</h3>
        <p className="text-xs text-gray-400 mb-6">Key health indicators across Fresh Farm operations</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-green-50/60 border border-green-100">
            <p className="text-3xl font-extrabold text-green-700">98.6%</p>
            <p className="text-xs font-bold text-gray-800 mt-1">On-Time Farm Delivery Rate</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Average dispatch time: 4.2 hours</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <p className="text-3xl font-extrabold text-emerald-700">0.4%</p>
            <p className="text-xs font-bold text-gray-800 mt-1">Refund & Dispute Ratio</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Far below industry average (2.5%)</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <p className="text-3xl font-extrabold text-blue-700">84.2%</p>
            <p className="text-xs font-bold text-gray-800 mt-1">Repeat Purchase Retention</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Customers reorder weekly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
