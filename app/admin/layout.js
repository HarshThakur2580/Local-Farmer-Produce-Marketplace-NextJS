'use client';

import { useState } from 'react';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}

function AdminLayoutInner({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isAuthenticated, loginAdmin, isLoaded } = useAdmin();
  const [loginEmail, setLoginEmail] = useState('admin@freshfarm.market');
  const [loginPassword, setLoginPassword] = useState('Admin@FreshFarm2026!');
  const [loginError, setLoginError] = useState('');

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-spin">🌿</span>
          <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
            Loading Fresh Farm Super Admin Console...
          </p>
        </div>
      </div>
    );
  }

  // Security Gate: Unauthorized access is blocked if isAuthenticated is false
  if (!isAuthenticated) {
    const handleAdminLogin = (e) => {
      e.preventDefault();
      const res = loginAdmin(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.message || 'Access denied.');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-gray-100">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-5xl select-none">🛡️</span>
            <h1 className="text-2xl font-extrabold text-white mt-3">Super Admin Portal</h1>
            <p className="text-xs text-gray-400 mt-1">
              Restricted Area. Authorized administrative personnel only.
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl mb-4 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Security Passcode
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="p-3 bg-gray-800/60 rounded-xl text-[11px] text-gray-400 border border-gray-800">
              <span className="font-semibold text-green-400">Default Seed Account:</span>
              <p>Email: admin@freshfarm.market</p>
              <p>Key: Admin@FreshFarm2026!</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition shadow-lg mt-2"
            >
              Authenticate as Super Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-72 min-w-0">
        <AdminHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
