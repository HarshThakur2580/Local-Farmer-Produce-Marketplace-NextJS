import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <span>🌾</span>
          <span>Fresh from the Farm, Direct to You</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Local Farmer{' '}
          <span className="text-green-600">Produce Marketplace</span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          Connecting local farmers directly with customers to provide{' '}
          <span className="font-semibold text-green-700">fresh</span>,{' '}
          <span className="font-semibold text-green-700">affordable</span> and{' '}
          <span className="font-semibold text-green-700">locally grown</span>{' '}
          agricultural products.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#"
            className="w-full sm:w-auto bg-green-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-lg text-base"
          >
            🛒 Shop Fresh Produce
          </Link>
          <Link
            href="#"
            className="w-full sm:w-auto bg-white text-green-700 font-bold px-8 py-3.5 rounded-xl border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-colors text-base"
          >
            🌱 Join as a Farmer
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { value: '500+', label: 'Local Farmers' },
            { value: '2,000+', label: 'Products Listed' },
            { value: '10,000+', label: 'Happy Customers' },
            { value: '50+', label: 'Counties Served' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-green-600">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

