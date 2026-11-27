'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Icon from '@/components/Icon';

export default function AdminLayout({ children }) {
  return <AdminAuthProvider><AdminProvider><AdminLayoutInner>{children}</AdminLayoutInner></AdminProvider></AdminAuthProvider>;
}

function AdminLayoutInner({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isAuthenticated, isLoaded } = useAdmin();
  const { refreshAdminSession } = useAdminAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (!response.ok) { setLoginError(data.message || 'Invalid administrator credentials.'); return; }
      await refreshAdminSession();
    } catch (error) {
      console.error('Administrator login failed:', error);
      setLoginError('Unable to connect to the administrator login service.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#032515] text-white grid place-items-center"><div className="text-center"><span className="inline-block w-11 h-11 rounded-full border-2 border-[#79e87e] border-t-transparent animate-spin" /><p className="mt-4 text-xs text-white/50 font-bold tracking-[0.16em] uppercase">Loading admin console</p></div></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#032515] p-4 sm:p-8 text-white grid place-items-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-[0.9fr_1.1fr] gap-5">
          <div className="auth-card p-7 sm:p-10 flex flex-col justify-center">
            <span className="eyebrow text-[#155d38] self-start">Super admin</span>
            <h2 className="text-4xl font-black tracking-[-0.055em] mt-6">Sign in to the console</h2>
            <p className="text-[#607068] mt-3 mb-8">Use the administrator credentials configured for this deployment.</p>
            {loginError && <div role="alert" className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl">{loginError}</div>}
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <label className="block text-sm font-black text-[#40564a] space-y-2"><span>Administrator email</span><input type="email" required autoComplete="username" value={loginForm.email} onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))} className="input" /></label>
              <label className="block text-sm font-black text-[#40564a] space-y-2"><span>Administrator password</span><input type="password" required autoComplete="current-password" value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} className="input" /></label>
              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? 'Authenticating...' : 'Enter admin console'}</button>
            </form>
            <Link href="/" className="mt-6 text-center text-sm font-black text-[#155d38] hover:underline">Return to marketplace</Link>
          </div>
          <aside className="relative hidden lg:block min-h-[42rem] overflow-hidden rounded-[2.5rem] border border-white/15">
            <Image src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=88" alt="Fresh produce arranged at a busy market" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#032515]/95 via-[#032515]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10">
              <span className="inline-grid size-12 place-items-center rounded-2xl bg-[#79e87e] text-[#032515]"><Icon name="shield" className="size-6" /></span>
              <p className="mt-5 text-3xl font-black tracking-[-0.04em]">Secure market operations.</p>
              <p className="mt-2 max-w-lg text-white/70">Review growers, listings, orders, customers, and platform activity from one protected console.</p>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell flex">
      <AdminSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col md:pl-72 min-w-0">
        <AdminHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
