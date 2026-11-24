'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import StatCard from '@/components/admin/StatCard';
import Badge from '@/components/admin/Badge';

export default function AdminDashboardPage() {
  const {
    customers,
    farmers,
    products,
    orders,
    payments,
    pendingApprovalsCount,
    totalRevenue,
    approveFarmer,
    approveProduct,
  } = useAdmin();

  const [timeRange, setTimeRange] = useState('6M');

  // Pending items
  const pendingFarmers = farmers.filter((f) => f.status === 'Pending');
  const pendingProducts = products.filter((p) => p.status === 'Pending');
  const recentOrders = orders.slice(0, 5);
  const recentFarmers = farmers.slice(0, 4);

  // Analytics Chart Data (Monthly revenue & orders in ₹)
  const chartData = [
    { month: 'Jun', revenue: 14200, orders: 120, height: '40%' },
    { month: 'Jul', revenue: 21500, orders: 185, height: '55%' },
    { month: 'Aug', revenue: 28900, orders: 240, height: '70%' },
    { month: 'Sep', revenue: 34100, orders: 290, height: '82%' },
    { month: 'Oct', revenue: 41800, orders: 360, height: '95%' },
    { month: 'Nov', revenue: totalRevenue > 0 ? totalRevenue * 100 : 49200, orders: 420, height: '100%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Super Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-bold rounded-full mb-3">
            🛡️ Super Admin Control Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Fresh Farm Marketplace Operations
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            Full oversight of local producers, registered consumers, order lifecycles, payments, and quality compliance.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            href="/admin/approvals"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <span>⏳</span>
            <span>{pendingApprovalsCount} Pending Approvals</span>
          </Link>
          <Link
            href="/admin/reports"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition border border-white/20"
          >
            📊 Financial Reports
          </Link>
        </div>

        <div className="absolute -right-12 -bottom-12 text-9xl opacity-10 select-none pointer-events-none">
          🌿
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Customers"
          value={customers.length}
          icon="👥"
          change="+18%"
          changeType="positive"
          subtitle="this month"
        />
        <StatCard
          title="Total Farmers"
          value={farmers.length}
          icon="👨‍🌾"
          change="+8%"
          changeType="positive"
          subtitle="verified farms"
        />
        <StatCard
          title="Listed Products"
          value={products.length}
          icon="🥦"
          change="+24%"
          changeType="positive"
          subtitle="active catalog"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon="📦"
          change="+32%"
          changeType="positive"
          subtitle="processed"
        />
        <StatCard
          title="Gross Revenue"
          value={`₹${totalRevenue.toFixed(0)}`}
          icon="💰"
          change="+27%"
          changeType="positive"
          subtitle="gross volume"
        />
        <StatCard
          title="Approvals"
          value={pendingApprovalsCount}
          icon="⏳"
          badge={pendingApprovalsCount > 0 ? 'Urgent' : 'All Clear'}
          subtitle="pending review"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Marketplace Sales & Revenue Growth
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Monthly gross agricultural transaction volume
              </p>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              {['1M', '3M', '6M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg transition ${
                    timeRange === range
                      ? 'bg-white text-green-700 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-gray-100 pb-2">
            {chartData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap mb-1">
                  ₹{d.revenue.toLocaleString()}
                </div>
                <div className="w-full max-w-[48px] bg-green-100 rounded-t-xl group-hover:bg-green-200 transition-colors relative overflow-hidden flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-xl transition-all duration-500"
                    style={{ height: d.height }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 mt-1">{d.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-600" />
                <span>Gross Volume (INR)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-200" />
                <span>Capacity Threshold</span>
              </span>
            </div>
            <span className="font-semibold text-emerald-700">Avg. Basket: ₹24.50</span>
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">Top Categories</h3>
              <Link href="/admin/categories" className="text-xs font-semibold text-green-700 hover:underline">
                Manage
              </Link>
            </div>
            <p className="text-xs text-gray-400 mb-6">Distribution of produce listings</p>

            <div className="space-y-4">
              {[
                { name: 'Vegetables', share: '38%', count: '38 listings', color: 'bg-green-600' },
                { name: 'Fruits', share: '26%', count: '26 listings', color: 'bg-emerald-500' },
                { name: 'Grains & Pulses', share: '19%', count: '19 listings', color: 'bg-amber-500' },
                { name: 'Leafy Greens', share: '14%', count: '14 listings', color: 'bg-lime-500' },
                { name: 'Dairy & Honey', share: '12%', count: '12 listings', color: 'bg-yellow-500' },
              ].map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700">{c.name}</span>
                    <span className="text-gray-500">{c.share}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: c.share }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50/70 p-3 rounded-2xl text-xs text-gray-600 flex items-center justify-between">
            <span>Commission Rate:</span>
            <span className="font-extrabold text-green-700">10% Platform Fee</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Quick Hub */}
      {pendingApprovalsCount > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <h3 className="font-bold text-amber-950 text-base">
                Pending Verification & Approvals Action Queue
              </h3>
            </div>
            <Link
              href="/admin/approvals"
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline"
            >
              Go to Full Approvals Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pending Farmers */}
            {pendingFarmers.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-2xl p-4 border border-amber-100 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-xl flex items-center justify-center flex-shrink-0">
                    {f.emoji || '👨‍🌾'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {f.name} · {f.farmName}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{f.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => approveFarmer(f.id)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    Approve
                  </button>
                  <Link
                    href={`/admin/farmers`}
                    className="px-2.5 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}

            {/* Pending Products */}
            {pendingProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-amber-100 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-green-50 overflow-hidden border border-gray-100 flex items-center justify-center flex-shrink-0">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{p.emoji || '🥦'}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {p.farmerName} · ₹{p.price}/{p.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => approveProduct(p.id)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    Approve
                  </button>
                  <Link
                    href={`/admin/products`}
                    className="px-2.5 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Section: Recent Orders & Recent Farmer Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Recent Orders</h3>
              <p className="text-xs text-gray-400 mt-0.5">Live order statuses from consumers</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-semibold text-green-700 hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Farmer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 rounded-r-xl">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-3 font-bold text-gray-900">{ord.id}</td>
                    <td className="py-3 px-3">{ord.customerName}</td>
                    <td className="py-3 px-3 text-gray-500">{ord.farmerName}</td>
                    <td className="py-3 px-3 font-extrabold text-green-700">₹{ord.total.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <Badge status={ord.status} />
                    </td>
                    <td className="py-3 px-3">
                      <Badge status={ord.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Farmer Registrations (1 Column) */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Producer Roster</h3>
              <p className="text-xs text-gray-400 mt-0.5">Active regional farmers</p>
            </div>
            <Link href="/admin/farmers" className="text-xs font-semibold text-green-700 hover:underline">
              All Farmers →
            </Link>
          </div>

          <div className="space-y-3">
            {recentFarmers.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100/70 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-xl flex items-center justify-center flex-shrink-0">
                    {f.emoji || '👨‍🌾'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{f.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{f.farmName}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <Badge status={f.status} />
                  <p className="text-[10px] text-gray-400 mt-1">★ {f.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
