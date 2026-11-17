import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import ProductCard from '@/components/ProductCard';
import { sampleFarmers, sampleProducts } from '@/lib/sampleData';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const farmer = sampleFarmers.find((f) => f.id === resolvedParams.id);
  if (!farmer) {
    return { title: 'Farmer Profile | Local Farmer Produce Marketplace' };
  }
  return {
    title: `${farmer.name} - ${farmer.farmName} | Local Farmer Marketplace`,
    description: farmer.bio,
  };
}

export default async function FarmerProfilePage({ params }) {
  const resolvedParams = await params;
  const farmerId = resolvedParams.id;
  const farmer = sampleFarmers.find((f) => f.id === farmerId);

  // If farmer not found
  if (!farmer) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border border-amber-100">
            🌾
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Farmer Profile Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">
            The producer you are looking for doesn&apos;t exist or might have been removed.
          </p>
          <Link
            href="/farmers"
            className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-green-700 transition"
          >
            ← Back to All Farmers
          </Link>
        </div>
      </PageWrapper>
    );
  }

  // Get products listed by this farmer
  const farmerProducts = sampleProducts.filter((p) => p.farmerId === farmer.id);

  return (
    <PageWrapper>
      {/* Farmer Profile Hero Banner */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-green-100">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-green-700 font-semibold mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/farmers" className="hover:underline">Farmers</Link>
            <span>/</span>
            <span className="text-gray-500 font-normal">{farmer.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/70 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/60 shadow-sm">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-green-100 text-5xl sm:text-6xl flex items-center justify-center shadow-inner flex-shrink-0 select-none">
                {farmer.emoji}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {farmer.name}
                  </h1>
                  {farmer.isVerified && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 font-semibold">
                      ✓ Verified Producer
                    </span>
                  )}
                  {farmer.badge && (
                    <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100 font-semibold">
                      🏅 {farmer.badge}
                    </span>
                  )}
                </div>

                <p className="text-base text-green-700 font-semibold mt-1">
                  {farmer.farmName}
                </p>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span>📍 {farmer.location}</span>
                  <span>•</span>
                  <span>🗓️ {farmer.yearsActive} years farming experience</span>
                  <span>•</span>
                  <span className="text-yellow-600 font-medium">★ {farmer.rating} rating</span>
                </p>
              </div>
            </div>

            {/* Quick Contact & Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Link
                href="/products"
                className="text-xs font-semibold text-center border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl transition"
              >
                All Marketplace Goods
              </Link>
              <a
                href={`mailto:${farmer.email}`}
                className="text-xs font-semibold text-center bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition shadow-sm"
              >
                Contact Farmer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Farmer Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-3">About the Farm</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {farmer.bio}
              </p>

              <h4 className="font-semibold text-gray-800 text-xs mb-2">Primary Crops & Specialties</h4>
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

              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                <p><strong>Email:</strong> {farmer.email}</p>
                <p><strong>Phone:</strong> {farmer.phone}</p>
                <p><strong>Status:</strong> Active Producer</p>
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 text-xs text-emerald-900 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5 text-emerald-950">
                <span>🛡️</span> Farmer Direct Guarantee
              </h4>
              <p>All items from {farmer.farmName} are harvested on demand and packaged directly at source.</p>
            </div>
          </div>

          {/* Right Main Column: Products from this Farmer */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Products by {farmer.name}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing {farmerProducts.length} harvested items currently available for order
                </p>
              </div>

              <Link
                href="/products"
                className="text-xs text-green-700 font-semibold hover:underline"
              >
                View all marketplace items →
              </Link>
            </div>

            {farmerProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
                <p className="text-5xl mb-3">🌱</p>
                <h3 className="font-bold text-gray-800 text-base mb-1">
                  No active products currently listed
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                  {farmer.name} is currently preparing the next harvest cycle. Check back soon or explore other local producers!
                </p>
                <Link
                  href="/products"
                  className="bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition"
                >
                  Explore Other Produce
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmerProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
