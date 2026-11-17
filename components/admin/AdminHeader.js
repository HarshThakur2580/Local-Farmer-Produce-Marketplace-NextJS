'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

export default function AdminHeader({ onOpenSidebar }) {
  const pathname = usePathname();
  const { adminUser, notifications, pendingApprovalsCount, flaggedReviewsCount } = useAdmin();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Generate clean breadcrumb
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPageTitle = pathSegments.length > 1
    ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1)
    : 'Overview Dashboard';

  const totalAlerts = pendingApprovalsCount + flaggedReviewsCount;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl text-gray-600 hover:text-green-700 hover:bg-green-50 transition"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/admin" className="hover:text-green-700 transition">
              Admin
            </Link>
            {pathSegments.length > 1 && (
              <>
                <span>/</span>
                <span className="text-gray-700 font-medium capitalize">
                  {pathSegments[1]}
                </span>
              </>
            )}
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight leading-none mt-0.5">
            {currentPageTitle}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick View Live Store Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:text-green-700 hover:border-green-300 hover:bg-green-50/50 transition"
        >
          <span>Storefront</span>
          <span className="text-[10px]">↗</span>
        </Link>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
            aria-label="Notifications"
          >
            <span className="text-lg">🔔</span>
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {totalAlerts}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifDropdownOpen && (
            <>
              <div
                onClick={() => setNotifDropdownOpen(false)}
                className="fixed inset-0 z-10"
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-20 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">System Alerts & Notifications</h3>
                  <Link
                    href="/admin/notifications"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-xs text-green-700 font-semibold hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {pendingApprovalsCount > 0 && (
                    <Link
                      href="/admin/approvals"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="block p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900 hover:bg-amber-100/70 transition"
                    >
                      <p className="font-bold">⚠️ {pendingApprovalsCount} Pending Approvals Waiting</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        New farmer registrations and produce items require verification.
                      </p>
                    </Link>
                  )}

                  {flaggedReviewsCount > 0 && (
                    <Link
                      href="/admin/reviews"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="block p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900 hover:bg-rose-100/70 transition"
                    >
                      <p className="font-bold">🚩 {flaggedReviewsCount} Reported Reviews</p>
                      <p className="text-[11px] text-rose-700 mt-0.5">
                        Customer reviews have been flagged for spam or inappropriate language.
                      </p>
                    </Link>
                  )}

                  {notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-gray-800">{n.title}</span>
                        <span className="text-[10px] text-gray-400 capitalize">{n.target}</span>
                      </div>
                      <p className="text-gray-500 text-[11px] line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-green-700 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
              SA
            </div>
            <div className="hidden sm:block text-left text-xs leading-none">
              <span className="font-bold text-gray-800 block truncate max-w-[120px]">
                {adminUser?.name || 'Super Admin'}
              </span>
              <span className="text-[10px] text-green-700 font-semibold block mt-0.5">
                Role: super_admin
              </span>
            </div>
          </button>

          {profileDropdownOpen && (
            <>
              <div
                onClick={() => setProfileDropdownOpen(false)}
                className="fixed inset-0 z-10"
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">{adminUser?.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{adminUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">
                    Super Administrator
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <span>⚙️</span> Platform Settings
                  </Link>
                  <Link
                    href="/admin/reports"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <span>📊</span> Sales Reports
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <span>🏪</span> Public Marketplace
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
