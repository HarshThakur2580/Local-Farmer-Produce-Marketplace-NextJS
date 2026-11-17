'use client';

import { useState, useMemo } from 'react';
import PageWrapper from '@/components/PageWrapper';
import ProductCard from '@/components/ProductCard';
import { sampleProducts, categories } from '@/lib/sampleData';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [organicOnly, setOrganicOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return sampleProducts
      .filter((p) => {
        // Category filter
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;

        // Search query (name, farmer, category, location)
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);

        // Organic toggle
        const matchesOrganic = !organicOnly || p.isOrganic;

        return matchesCategory && matchesSearch && matchesOrganic;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0; // default order
      });
  }, [activeCategory, searchQuery, sortBy, organicOnly]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSortBy('default');
    setOrganicOnly(false);
  };

  return (
    <PageWrapper>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            🌾 Farm Fresh & Direct
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Local Produce Market
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
            Browse seasonal vegetables, fruits, grains and natural goods sourced directly from verified regional farmers.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Sort Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search products, vegetables, fruits or farmers..."
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

            {/* Sort & Organic Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Organic toggle */}
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2.5 rounded-xl border border-gray-200 select-none">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="w-4 h-4 accent-green-600 rounded"
                />
                <span>🌱 Organic Only</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 bg-gray-50 hover:bg-white rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 transition cursor-pointer"
                >
                  <option value="default">Featured / Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated ★</option>
                  <option value="name-asc">Alphabetical (A - Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-gray-100 pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  activeCategory === cat
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info & Active Filters count */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-gray-500">
          <p>
            Showing <span className="font-bold text-gray-800">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{sampleProducts.length}</span> items
            {activeCategory !== 'All' && (
              <span className="ml-1 text-green-700 font-medium">in {activeCategory}</span>
            )}
            {searchQuery && (
              <span className="ml-1 text-gray-600">
                matching &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </p>

          {(activeCategory !== 'All' || searchQuery || sortBy !== 'default' || organicOnly) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-green-700 hover:text-green-900 font-semibold underline underline-offset-2 hover:opacity-80"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
            <p className="text-6xl mb-4">🌾</p>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No products match your criteria</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Try adjusting your search terms, changing the category, or clearing the active filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
