import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            <span className="font-bold text-green-700 text-lg leading-tight hidden sm:block">
              Local Farmer <br className="hidden" />
              <span className="text-green-500">Marketplace</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <Link href="#" className="hover:text-green-600 transition-colors">Products</Link>
            <Link href="#" className="hover:text-green-600 transition-colors">Farmers</Link>
            <Link href="#" className="hover:text-green-600 transition-colors">About</Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="text-sm font-medium text-green-700 hover:text-green-600 transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="#"
              className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

