import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-green-50/40 to-white py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-200/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Fresh from the Farm, Direct to You</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Local Farmer{' '}
              <span className="text-emerald-600 block sm:inline">Produce Marketplace</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Connecting local farmers directly with conscious consumers. Get fresh, naturally grown vegetables, fruits, and grains harvested at peak flavor without middlemen.
            </p>

            {/* Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-medium">100% Farm Direct</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-medium">Fair Farmer Prices</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-medium">Harvested Daily</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base"
              >
                <span>🛒</span>
                <span>Shop Fresh Produce</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-7 py-3.5 rounded-xl border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-200 text-base"
              >
                <span>🌱</span>
                <span>Join as a Farmer</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Banner Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer Decorative Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 to-lime-300/20 rounded-3xl blur-xl"></div>

              {/* Main Banner Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85"
                  alt="Fresh farm produce market harvest basket"
                  className="w-full h-80 sm:h-96 object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-16 pt-10 border-t border-gray-200/70 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Local Farmers' },
            { value: '2,000+', label: 'Products Listed' },
            { value: '10,000+', label: 'Happy Customers' },
            { value: '50+', label: 'Regions Served' },
          ].map((stat) => (
            <div key={stat.label} className="p-3">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{stat.value}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


