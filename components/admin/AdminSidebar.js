'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const { adminUser, pendingApprovalsCount, flaggedReviewsCount, logoutAdmin } = useAdmin();

  const navigationGroups = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin', icon: '📊' },
        {
          label: 'Approvals Hub',
          href: '/admin/approvals',
          icon: '⏳',
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
          badgeColor: 'bg-amber-500 text-white',
        },
      ],
    },
    {
      title: 'Marketplace',
      items: [
        { label: 'Products', href: '/admin/products', icon: '🥦' },
        { label: 'Categories', href: '/admin/categories', icon: '🏷️' },
        { label: 'Farmers', href: '/admin/farmers', icon: '👨‍🌾' },
        { label: 'Customers', href: '/admin/customers', icon: '👥' },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: '📦' },
        { label: 'Payments & Payouts', href: '/admin/payments', icon: '💳' },
        {
          label: 'Reviews & Feedback',
          href: '/admin/reviews',
          icon: '⭐',
          badge: flaggedReviewsCount > 0 ? flaggedReviewsCount : null,
          badgeColor: 'bg-rose-500 text-white',
        },
      ],
    },
    {
      title: 'System & Analytics',
      items: [
        { label: 'Notifications', href: '/admin/notifications', icon: '📢' },
        { label: 'Reports & Analytics', href: '/admin/reports', icon: '📈' },
        { label: 'Settings & Audit', href: '/admin/settings', icon: '⚙️' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gray-900 text-gray-300 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-800">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="text-2xl">🌿</span>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight leading-none block">
                  Fresh Farm
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 block mt-0.5">
                  Super Admin Console
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden text-gray-400 hover:text-white p-1"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-gray-800">
            {navigationGroups.map((group) => (
              <div key={group.title}>
                <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-green-600 text-white shadow-xs font-bold'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/70'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base select-none">{item.icon}</span>
                          <span>{item.label}</span>
                        </span>
                        {item.badge !== null && item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile & Live Link */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/60">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-green-700 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {adminUser?.name || 'Super Admin'}
                </p>
                <p className="text-[10px] text-green-400 truncate">
                  super_admin (Full Access)
                </p>
              </div>
            </div>

            <button
              onClick={logoutAdmin}
              className="text-gray-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-gray-800 transition"
              title="Sign Out"
              aria-label="Sign out"
            >
              🚪
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition border border-gray-700"
          >
            <span>🏪</span> View Live Marketplace
          </Link>
        </div>
      </aside>
    </>
  );
}
