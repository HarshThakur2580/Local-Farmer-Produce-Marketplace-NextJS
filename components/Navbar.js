'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Farmers', href: '/farmers' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, isLoaded } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCount = mounted && isLoaded ? cartCount : 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            <span className="font-bold text-green-700 text-lg leading-tight hidden sm:block">
              Local Farmer{' '}
              <span className="text-green-500">Marketplace</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  pathname === href
                    ? 'text-green-600 font-semibold border-b-2 border-green-500 pb-0.5'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Action & Cart Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                pathname === '/cart'
                  ? 'bg-green-50 border-green-500 text-green-700 font-semibold'
                  : 'border-gray-200 text-gray-700 hover:border-green-400 hover:bg-green-50'
              }`}
              title="Shopping Cart"
            >
              <span className="text-lg">🛒</span>
              <span className="text-sm font-medium">Cart</span>
              {displayCount > 0 ? (
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {displayCount}
                </span>
              ) : (
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  0
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className={`text-sm font-medium transition-colors ${
                pathname === '/login'
                  ? 'text-green-600 font-semibold'
                  : 'text-green-700 hover:text-green-600'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Right Controls: Cart Icon & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50"
              aria-label="View Cart"
            >
              <span className="text-xl">🛒</span>
              {displayCount > 0 && (
                <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {displayCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-green-50 text-green-600 font-semibold'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {label}
              </Link>
            ))}

            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/cart'
                  ? 'bg-green-50 text-green-600 font-semibold'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🛒</span> Shopping Cart
              </span>
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {displayCount}
              </span>
            </Link>

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2 px-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-green-700 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
