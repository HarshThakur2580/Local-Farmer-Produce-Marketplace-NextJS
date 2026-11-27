'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Market', href: '/products' },
  { label: 'Growers', href: '/farmers' },
  { label: 'Our story', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, isLoaded } = useCart();
  const { user, isLoading: authLoading, logout } = useAuth();
  const displayCount = isLoaded ? cartCount : 0;
  const canShop = !authLoading && user?.accountType === 'customer';

  return (
    <header className="site-header">
      <div className="site-nav flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 min-w-0" aria-label="Farm Fresh home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 19C7 11 12 6 20 4c-1 8-6 13-14 15" />
              <path d="M7 16c3-1 6-3 9-7" />
            </svg>
          </span>
          <span className="font-black tracking-[-0.04em] text-lg sm:text-xl whitespace-nowrap">
            Farm Fresh <span className="brand-suffix font-medium text-[#79e87e]">Market</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 rounded-full bg-white/10 p-1" aria-label="Primary navigation">
          {navLinks.map(({ label, href }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`nav-pill text-sm font-semibold ${active ? 'bg-white text-[#07351f]' : 'text-white/75 hover:text-white hover:bg-white/10'}`}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {canShop && (
            <Link href="/cart" className="nav-pill border border-white/20 text-sm font-bold hover:bg-white/10">
              Cart{displayCount > 0 && <span className="ml-2 min-w-6 h-6 px-1.5 rounded-full bg-[#f4511e] text-white grid place-items-center text-xs">{displayCount}</span>}
            </Link>
          )}

          {!authLoading && user ? (
            <>
              {user.accountType === 'farmer' && <Link href="/products/new" className="nav-pill text-sm font-bold text-[#79e87e] hover:bg-white/10">Add product</Link>}
              <span className="hidden xl:block max-w-28 truncate text-sm font-semibold text-white/75" title={user.email}>{user.fullName}</span>
              <button onClick={logout} className="nav-pill bg-[#79e87e] text-[#032515] text-sm font-black hover:bg-[#98f29c]">Sign out</button>
            </>
          ) : !authLoading ? (
            <>
              <Link href="/login" className="nav-pill text-sm font-bold text-white/80 hover:text-white">Sign in</Link>
              <Link href="/register" className="nav-pill bg-[#79e87e] text-[#032515] text-sm font-black hover:bg-[#98f29c]">Join market</Link>
            </>
          ) : null}
        </div>

        <button onClick={() => setMenuOpen((open) => !open)} className="md:hidden w-11 h-11 rounded-full border border-white/20 grid place-items-center" aria-label="Toggle navigation" aria-expanded={menuOpen}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-xl rounded-[1.5rem] border border-white/15 bg-[#0d472b] p-3 text-white shadow-2xl">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {navLinks.map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-bold ${pathname === href ? 'bg-[#79e87e] text-[#032515]' : 'hover:bg-white/10'}`}>{label}</Link>
            ))}
            {canShop && <Link href="/cart" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-white/10">Cart ({displayCount})</Link>}
          </nav>
          <div className="mt-2 border-t border-white/10 pt-3 grid gap-2">
            {!authLoading && user ? (
              <>
                <p className="px-4 text-xs text-white/55">Signed in as <strong className="text-white">{user.fullName}</strong></p>
                {user.accountType === 'farmer' && <Link href="/products/new" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-[#79e87e]">Add produce</Link>}
                <button onClick={() => { logout(); setMenuOpen(false); }} className="rounded-xl bg-[#79e87e] px-4 py-3 text-left text-sm font-black text-[#032515]">Sign out</button>
              </>
            ) : !authLoading ? (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-xl border border-white/20 px-4 py-3 text-center text-sm font-bold">Sign in</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="rounded-xl bg-[#79e87e] px-4 py-3 text-center text-sm font-black text-[#032515]">Join market</Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
