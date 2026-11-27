'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import StatCard from '@/components/admin/StatCard';
import Badge from '@/components/admin/Badge';
import Icon from '@/components/Icon';

export default function AdminDashboardPage() {
  const {
    customers,
    farmers,
    products,
    categories,
    orders,
    payments,
    pendingApprovalsCount,
    totalRevenue,
    approveFarmer,
    approveProduct,
  } = useAdmin();

  // Pending items
  const pendingFarmers = farmers.filter((f) => f.status === 'Pending');
  const pendingProducts = products.filter((p) => p.status === 'Pending');
  const recentOrders = orders.slice(0, 5);
  const recentFarmers = farmers.slice(0, 4);

  // Live marketplace footprint. No fabricated historical values are shown.
  const chartData = [
    { label: 'Customers', value: customers.length },
    { label: 'Farmers', value: farmers.length },
    { label: 'Products', value: products.length },
    { label: 'Orders', value: orders.length },
    { label: 'Payments', value: payments.length },
  ];
  const largestCount = Math.max(1, ...chartData.map((item) => item.value));
  const largestCategoryCount = Math.max(1, ...categories.map((item) => item.productsCount || 0));

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Super Admin Welcome Banner */}
      <div className="bg-[#032515] text-white rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-white/10">
        <div className="relative z-10 max-w-xl">
          <span className="eyebrow text-[#79e87e] mb-4">
            Super admin control center
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.05em]">
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
            <span>{pendingApprovalsCount} Pending Approvals</span>
          </Link>
          <Link
            href="/admin/reports"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition border border-white/20"
          >
            Financial reports
          </Link>
        </div>

        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none"><Icon name="leaf" className="w-40 h-40" strokeWidth={1} /></div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Customers"
          value={customers.length}
          icon="users"
          subtitle="live accounts"
        />
        <StatCard
          title="Total Farmers"
          value={farmers.length}
          icon="farmer"
          subtitle="farm profiles"
        />
        <StatCard
          title="Listed Products"
          value={products.length}
          icon="leaf"
          subtitle="catalog entries"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon="package"
          subtitle="persisted orders"
        />
        <StatCard
          title="Gross Revenue"
          value={`₹${totalRevenue.toFixed(0)}`}
          icon="money"
          subtitle="persisted revenue"
        />
        <StatCard
          title="Approvals"
          value={pendingApprovalsCount}
          icon="clock"
          badge={pendingApprovalsCount > 0 ? 'Urgent' : 'All Clear'}
          subtitle="pending review"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live marketplace footprint */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Live marketplace footprint
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Current MongoDB-backed records by entity
              </p>
            </div>

            <span className="eyebrow text-[#155d38]">Live data</span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-gray-100 pb-2">
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black text-[#10251a] bg-[#e5f7e8] px-2 py-1 rounded-full whitespace-nowrap mb-1">
                  {d.value}
                </div>
                <div className="w-full max-w-[48px] bg-green-100 rounded-t-xl group-hover:bg-green-200 transition-colors relative overflow-hidden flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-xl transition-all duration-500"
                    style={{ height: `${d.value === 0 ? 2 : Math.max(12, (d.value / largestCount) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 mt-1">{d.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-600" /><span>Current database count</span></span>
            <span className="font-semibold text-emerald-700">Updated on dashboard load</span>
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
              {categories.slice(0, 5).map((category) => {
                const width = `${Math.max(8, ((category.productsCount || 0) / largestCategoryCount) * 100)}%`;
                return (
                <div key={category.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700">{category.name}</span>
                    <span className="text-gray-500">{category.productsCount || 0}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#f4511e]" style={{ width }} />
                  </div>
                </div>
              );})}
              {categories.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No categories exist until farmers publish products.</p>}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50/70 p-3 rounded-2xl text-xs text-gray-600 flex items-center justify-between">
            <span>Live categories:</span>
            <span className="font-extrabold text-green-700">{categories.length}</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Quick Hub */}
      {pendingApprovalsCount > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon name="warning" className="w-5 h-5" />
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
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0"><Icon name="farmer" className="w-5 h-5" /></div>
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
                  <div className="relative w-10 h-10 rounded-xl bg-green-50 overflow-hidden border border-gray-100 flex items-center justify-center flex-shrink-0">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill sizes="40px" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="leaf" className="w-6 h-6 text-green-700" />
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
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-green-700 flex items-center justify-center flex-shrink-0"><Icon name="farmer" className="w-5 h-5" /></div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{f.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{f.farmName}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <Badge status={f.status} />
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1"><Icon name="star" className="w-3 h-3" />{f.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
