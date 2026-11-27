'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

const navigationGroups = [
  { title: 'Overview', items: [{ label: 'Dashboard', href: '/admin', code: 'DB' }, { label: 'Approvals', href: '/admin/approvals', code: 'AP', count: 'pending' }] },
  { title: 'Marketplace', items: [{ label: 'Products', href: '/admin/products', code: 'PR' }, { label: 'Categories', href: '/admin/categories', code: 'CA' }, { label: 'Farmers', href: '/admin/farmers', code: 'FA' }, { label: 'Customers', href: '/admin/customers', code: 'CU' }] },
  { title: 'Operations', items: [{ label: 'Orders', href: '/admin/orders', code: 'OR' }, { label: 'Payments', href: '/admin/payments', code: 'PA' }, { label: 'Reviews', href: '/admin/reviews', code: 'RE', count: 'flagged' }] },
  { title: 'System', items: [{ label: 'Notifications', href: '/admin/notifications', code: 'NO' }, { label: 'Reports', href: '/admin/reports', code: 'RP' }, { label: 'Settings & audit', href: '/admin/settings', code: 'SE' }] },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const { adminUser, pendingApprovalsCount, flaggedReviewsCount, logoutAdmin } = useAdmin();
  const countFor = (type) => type === 'pending' ? pendingApprovalsCount : type === 'flagged' ? flaggedReviewsCount : 0;

  return (
    <>
      {mobileOpen && <button onClick={onClose} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" aria-label="Close navigation" />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#032515] text-white flex flex-col transition-transform duration-300 md:translate-x-0 border-r border-white/10 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="brand-mark"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 19C7 11 12 6 20 4c-1 8-6 13-14 15" /><path d="M7 16c3-1 6-3 9-7" /></svg></span>
            <span><strong className="block text-lg tracking-[-0.04em]">Farm Fresh</strong><small className="block text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#79e87e]">Admin console</small></span>
          </Link>
          <button onClick={onClose} className="md:hidden w-9 h-9 rounded-full border border-white/15" aria-label="Close sidebar">×</button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/35">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                  const count = countFor(item.count);
                  return (
                    <Link key={item.href} href={item.href} onClick={onClose} className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold ${active ? 'bg-[#79e87e] text-[#032515]' : 'text-white/62 hover:bg-white/[0.07] hover:text-white'}`}>
                      <span className="flex items-center gap-3"><span className={`grid h-8 w-8 place-items-center rounded-xl text-[0.65rem] font-black ${active ? 'bg-[#032515] text-[#79e87e]' : 'border border-white/12 text-white/45'}`}>{item.code}</span>{item.label}</span>
                      {count > 0 && <span className="min-w-6 h-6 px-1.5 rounded-full bg-[#f4511e] text-white grid place-items-center text-xs">{count}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="rounded-[1.5rem] bg-white/[0.06] border border-white/10 p-4">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#f4511e] grid place-items-center text-xs font-black">SA</div><div className="min-w-0"><p className="text-sm font-black truncate">{adminUser?.name || 'Super Administrator'}</p><p className="text-xs text-white/40 truncate">{adminUser?.email}</p></div></div>
            <div className="grid grid-cols-2 gap-2 mt-4"><Link href="/" className="rounded-xl border border-white/15 py-2 text-center text-xs font-bold text-white/65 hover:text-white">Marketplace</Link><button onClick={logoutAdmin} className="rounded-xl bg-white/10 py-2 text-xs font-bold text-white/65 hover:bg-[#f4511e] hover:text-white">Sign out</button></div>
          </div>
        </div>
      </aside>
    </>
  );
}
