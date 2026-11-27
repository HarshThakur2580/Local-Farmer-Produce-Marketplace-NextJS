'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

const pageNames = {
  approvals: 'Approvals hub', products: 'Product catalogue', categories: 'Categories', farmers: 'Farmer accounts', customers: 'Customer accounts', orders: 'Orders', payments: 'Payments & payouts', reviews: 'Reviews', notifications: 'Notifications', reports: 'Reports & analytics', settings: 'Settings & audit',
};

export default function AdminHeader({ onOpenSidebar }) {
  const pathname = usePathname();
  const { adminUser, notifications, pendingApprovalsCount, flaggedReviewsCount } = useAdmin();
  const [open, setOpen] = useState(false);
  const segment = pathname.split('/').filter(Boolean)[1];
  const title = pageNames[segment] || 'Overview dashboard';
  const totalAlerts = pendingApprovalsCount + flaggedReviewsCount;

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 py-3 bg-[#eef5ec]/90 backdrop-blur-xl border-b border-[#155d38]/10">
      <div className="min-h-14 flex items-center justify-between gap-4 rounded-[1.25rem] bg-[#fffef8] border border-[#155d38]/10 px-3 sm:px-5 shadow-[0_12px_35px_rgba(9,65,38,.06)]">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onOpenSidebar} className="md:hidden w-10 h-10 rounded-full bg-[#e5f7e8] grid place-items-center" aria-label="Open sidebar"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button>
          <div className="min-w-0"><p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#155d38]/55">Admin / {segment || 'dashboard'}</p><h1 className="text-base sm:text-xl font-black tracking-[-0.035em] truncate">{title}</h1></div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="hidden sm:inline-flex min-h-10 items-center rounded-full border border-[#155d38]/15 px-4 text-xs font-black text-[#155d38] hover:bg-[#e5f7e8]">View marketplace</Link>
          <div className="relative">
            <button onClick={() => setOpen((value) => !value)} className="relative w-10 h-10 rounded-full bg-[#032515] text-white grid place-items-center" aria-label="View alerts">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>
              {totalAlerts > 0 && <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-[#f4511e] text-white grid place-items-center text-[0.65rem] font-black">{totalAlerts}</span>}
            </button>
            {open && (
              <><button className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-label="Close alerts" /><div className="absolute right-0 mt-3 z-20 w-[min(22rem,calc(100vw-2rem))] rounded-[1.5rem] border border-[#155d38]/12 bg-[#fffef8] p-4 shadow-2xl"><div className="flex items-center justify-between border-b border-[#155d38]/10 pb-3"><h2 className="font-black">Platform alerts</h2><Link href="/admin/notifications" onClick={() => setOpen(false)} className="text-xs font-black text-[#155d38]">View all</Link></div><div className="mt-3 space-y-2 max-h-72 overflow-y-auto">{pendingApprovalsCount > 0 && <Alert href="/admin/approvals" title={`${pendingApprovalsCount} items awaiting approval`} text="Review new farmers and products." close={() => setOpen(false)} />}{flaggedReviewsCount > 0 && <Alert href="/admin/reviews" title={`${flaggedReviewsCount} flagged reviews`} text="Moderation attention is required." close={() => setOpen(false)} />}{notifications.slice(0, 3).map((item) => <div key={item.id} className="rounded-xl bg-[#e5f7e8] p-3"><p className="text-sm font-black">{item.title}</p><p className="text-xs text-[#607068] mt-1 line-clamp-2">{item.message}</p></div>)}{totalAlerts === 0 && notifications.length === 0 && <p className="py-6 text-center text-sm text-[#607068]">No new alerts.</p>}</div></div></>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2 pl-1"><div className="w-10 h-10 rounded-full bg-[#f4511e] text-white grid place-items-center text-xs font-black">SA</div><div><p className="text-xs font-black max-w-28 truncate">{adminUser?.name || 'Administrator'}</p><p className="text-[0.65rem] font-bold text-[#155d38]">Super admin</p></div></div>
        </div>
      </div>
    </header>
  );
}

function Alert({ href, title, text, close }) {
  return <Link href={href} onClick={close} className="block rounded-xl border border-[#f4511e]/20 bg-[#f4511e]/10 p-3"><p className="text-sm font-black text-[#9f3312]">{title}</p><p className="text-xs text-[#9f3312]/70 mt-1">{text}</p></Link>;
}
