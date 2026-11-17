'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { sampleFarmers } from '@/lib/sampleData';

export default function FarmersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Collect all unique specialties
  const allSpecialties = useMemo(() => {
    const set = new Set();
    sampleFarmers.forEach((f) => f.specialties?.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredFarmers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sampleFarmers.filter((f) => {
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.farmName.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.bio.toLowerCase().includes(q) ||
        f.specialties.some((s) => s.toLowerCase().includes(q));

      const matchesSpecialty =
        selectedSpecialty === 'All' ||
        f.specialties.some((s) => s.toLowerCase() === selectedSpecialty.toLowerCase());

      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty]);

  return (
    <PageWrapper>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            🤝 Direct Farm-to-Consumer
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            👨‍🌾 Meet Our Local Farmers
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
            Discover verified producers from across regions, learn about their sustainable practices, and support local farming families.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Specialty Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by farmer name, farm, region, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Specialty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline whitespace-nowrap">Specialty:</span>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="border border-gray-200 bg-gray-50 hover:bg-white rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 transition cursor-pointer"
              >
                {allSpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec === 'All' ? 'All Specialties' : spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { value: `${sampleFarmers.length}`, label: 'Featured Producers' },
            { value: '7', label: 'Agricultural States' },
            { value: '100%', label: 'Locally Sourced' },
            { value: '4.8 ★', label: 'Average Quality Rating' },
          ].map((s) => (
            <div key={s.label} className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
              <p className="text-2xl font-extrabold text-green-700">{s.value}</p>
              <p className="text-xs text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
          <p>
            Showing <span className="font-bold text-gray-800">{filteredFarmers.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{sampleFarmers.length}</span> farmers
            {selectedSpecialty !== 'All' && (
              <span className="ml-1 text-green-700 font-medium">specializing in {selectedSpecialty}</span>
            )}
            {searchQuery && (
              <span className="ml-1 text-gray-600">
                matching &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </p>

          {(searchQuery || selectedSpecialty !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
              }}
              className="text-xs text-green-700 hover:text-green-900 font-semibold underline underline-offset-2"
            >
              Reset Search
            </button>
          )}
        </div>

        {/* Farmers Grid */}
        {filteredFarmers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
            <p className="text-6xl mb-4">🌾</p>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No farmers found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              We couldn&apos;t find any producers matching &ldquo;{searchQuery}&rdquo;. Try another name or specialty.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
              }}
              className="bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition"
            >
              Show All Farmers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarmers.map((farmer) => (
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center border border-green-100 flex-shrink-0 select-none">
            {farmer.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-gray-900 text-base">{farmer.name}</h3>
              {farmer.isVerified && (
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 font-semibold" title="Identity & farm verified">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-sm text-green-700 font-medium truncate">{farmer.farmName}</p>
            <p className="text-xs text-gray-500 mt-0.5">📍 {farmer.location}</p>
          </div>
        </div>

        {/* Badge */}
        {farmer.badge && (
          <div className="mb-3">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 inline-flex items-center gap-1">
              <span>🏅</span> {farmer.badge}
            </span>
          </div>
        )}

        {/* Bio */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {farmer.bio}
        </p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {farmer.specialties.map((s) => (
            <span
              key={s}
              className="text-xs text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-gray-50 rounded-xl p-2">
            <p className="font-bold text-gray-800 text-sm">{farmer.totalProducts}</p>
            <p className="text-[11px] text-gray-400">Products</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2">
            <p className="font-bold text-gray-800 text-sm">{farmer.yearsActive}y</p>
            <p className="text-[11px] text-gray-400">Experience</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2">
            <p className="font-bold text-yellow-500 text-sm">★ {farmer.rating}</p>
            <p className="text-[11px] text-gray-400">Rating</p>
          </div>
        </div>
      </div>

      {/* Action Footer with working Link */}
      <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-2 mt-auto">
        <span className="text-xs text-gray-400 truncate" title={farmer.email}>
          📧 {farmer.email}
        </span>
        <Link
          href={`/farmers/${farmer.id}`}
          className="bg-green-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-green-700 transition shadow-xs whitespace-nowrap flex items-center gap-1"
        >
          <span>View Products</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
