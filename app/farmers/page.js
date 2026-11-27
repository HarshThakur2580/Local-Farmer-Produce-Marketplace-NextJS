'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/Icon';

export default function FarmersPage() {
  const { user } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/farmers', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to load farmers.');
        if (!cancelled) setFarmers(data.farmers || []);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Collect all unique specialties
  const allSpecialties = useMemo(() => {
    const set = new Set();
    farmers.forEach((f) => f.specialties?.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set)];
  }, [farmers]);

  const filteredFarmers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return farmers.filter((f) => {
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
  }, [farmers, searchQuery, selectedSpecialty]);

  const totalProducts = farmers.reduce((sum, farmer) => sum + (farmer.totalProducts || 0), 0);
  const averageRating = farmers.length
    ? (farmers.reduce((sum, farmer) => sum + (farmer.rating || 0), 0) / farmers.length).toFixed(1)
    : '0.0';

  return (
    <PageWrapper>
      {/* Page Header */}
      <section className="listing-hero py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
          <div className="eyebrow text-[#79e87e] mb-5">
            Direct farm-to-community
          </div>
          <h1 className="section-title text-white mb-4">
            Meet the growers
          </h1>
          <p className="text-white/65 text-base sm:text-lg max-w-2xl">
            Discover farm profiles created by marketplace members.
          </p>
          </div>
          {user?.accountType === 'farmer' ? (
            <Link href="/farmers/new" className="btn-primary self-start">Create farm profile</Link>
          ) : !user ? (
            <Link href="/login" className="btn-primary self-start">Farmer sign in</Link>
          ) : (
            <span className="eyebrow self-start text-white">Customer account</span>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Specialty Bar */}
        <div className="filter-panel p-4 sm:p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" className="w-4 h-4" /></span>
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
                  <Icon name="close" className="w-4 h-4" />
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
            { value: `${farmers.length}`, label: 'Farm Profiles' },
            { value: `${new Set(farmers.map((farmer) => farmer.location)).size}`, label: 'Locations' },
            { value: `${totalProducts}`, label: 'Listed Products' },
            { value: `${averageRating}`, label: 'Average rating' },
          ].map((s) => (
            <div key={s.label} className="rounded-[1.5rem] p-4 text-center border border-[#155d38]/10 bg-[#e5f7e8]">
              <p className="text-2xl font-extrabold text-green-700">{s.value}</p>
              <p className="text-xs text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
          <p>
            Showing <span className="font-bold text-gray-800">{filteredFarmers.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{farmers.length}</span> farmers
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
        {loading ? (
          <div className="text-center py-20 text-sm text-gray-500">Loading farmers...</div>
        ) : loadError ? (
          <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100 text-red-700">{loadError}</div>
        ) : filteredFarmers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
            <div className="mx-auto mb-4 grid w-16 h-16 place-items-center rounded-full bg-[#e5f7e8] text-[#155d38]"><Icon name="farmer" className="w-8 h-8" /></div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{farmers.length ? 'No farmers found' : 'No farm profiles have been created yet'}</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              {farmers.length ? 'Try another name or specialty.' : 'Create the first real farm profile for this marketplace.'}
            </p>
            {farmers.length ? (
              <button onClick={() => { setSearchQuery(''); setSelectedSpecialty('All'); }} className="bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition">Show All Farmers</button>
            ) : (
              user?.accountType === 'farmer' ? (
                <Link href="/farmers/new" className="inline-block bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition">Create First Profile</Link>
              ) : !user ? (
                <Link href="/login" className="inline-block bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition">Farmer Sign In</Link>
              ) : null
            )}
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
    <div className="bg-[#fffef8] rounded-[1.75rem] border border-[#155d38]/12 shadow-[0_18px_45px_rgba(9,65,38,.07)] hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(9,65,38,.13)] p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-[#e5f7e8] text-[#155d38] w-14 h-14 rounded-[1.25rem] flex items-center justify-center border border-[#155d38]/10 flex-shrink-0"><Icon name="farmer" className="w-7 h-7" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-gray-900 text-base">{farmer.name}</h3>
              {farmer.isVerified && (
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 font-semibold" title="Identity & farm verified">
                  <span className="inline-flex items-center gap-1"><Icon name="check" className="w-3 h-3" />Verified</span>
                </span>
              )}
            </div>
            <p className="text-sm text-green-700 font-medium truncate">{farmer.farmName}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Icon name="location" className="w-3.5 h-3.5" />{farmer.location}</p>
          </div>
        </div>

        {/* Badge */}
        {farmer.badge && (
          <div className="mb-3">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 inline-flex items-center gap-1">
              <Icon name="award" className="w-4 h-4" /> {farmer.badge}
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
            <p className="font-bold text-yellow-600 text-sm flex items-center justify-center gap-1"><Icon name="star" className="w-4 h-4" />{farmer.rating}</p>
            <p className="text-[11px] text-gray-400">Rating</p>
          </div>
        </div>
      </div>

      {/* Action Footer with working Link */}
      <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-2 mt-auto">
        <span className="text-xs text-gray-400 truncate flex items-center gap-1" title={farmer.email}><Icon name="mail" className="w-4 h-4 shrink-0" />{farmer.email}</span>
        <Link
          href={`/farmers/${farmer.id}`}
          className="bg-green-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-green-700 transition shadow-xs whitespace-nowrap flex items-center gap-1"
        >
          <span>View products</span>
        </Link>
      </div>
    </div>
  );
}
