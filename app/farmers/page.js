'use client';

import { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { sampleFarmers } from '@/lib/sampleData';

export default function FarmersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = sampleFarmers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <PageWrapper>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-green-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            👨‍🌾 Meet Our Farmers
          </h1>
          <p className="text-gray-600 text-lg">
            Discover{' '}
            <span className="font-semibold text-green-700">{sampleFarmers.length} local farmers</span>{' '}
            and the stories behind your food.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative max-w-md mb-8">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, farm, location or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { value: '500+', label: 'Registered Farmers' },
            { value: '7', label: 'States Covered' },
            { value: '2000+', label: 'Products Listed' },
            { value: '98%', label: 'Satisfaction Rate' },
          ].map((s) => (
            <div key={s.label} className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <p className="text-2xl font-extrabold text-green-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> farmers
        </p>

        {/* Farmers Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🌾</p>
            <p className="text-gray-500 text-lg">No farmers found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}

function FarmerCard({ farmer }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-5xl bg-green-50 w-16 h-16 rounded-full flex items-center justify-center border border-green-100 flex-shrink-0">
          {farmer.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 text-base">{farmer.name}</h3>
            {farmer.isVerified && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-sm text-green-700 font-medium">{farmer.farmName}</p>
          <p className="text-xs text-gray-500 mt-0.5">📍 {farmer.location}</p>
        </div>
      </div>

      {/* Badge */}
      <div className="mb-3">
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
          🏅 {farmer.badge}
        </span>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
        {farmer.bio}
      </p>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {farmer.specialties.map((s) => (
          <span
            key={s}
            className="text-xs text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-bold text-gray-800 text-sm">{farmer.totalProducts}</p>
          <p className="text-xs text-gray-400">Products</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-bold text-gray-800 text-sm">{farmer.yearsActive}y</p>
          <p className="text-xs text-gray-400">Experience</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-bold text-yellow-500 text-sm">★ {farmer.rating}</p>
          <p className="text-xs text-gray-400">Rating</p>
        </div>
      </div>

      {/* Contact */}
      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">📧 {farmer.email}</p>
        <button className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
          View Products
        </button>
      </div>
    </div>
  );
}
