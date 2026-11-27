import Link from 'next/link';

const links = [
  { label: 'Market', href: '/products' },
  { label: 'Growers', href: '/farmers' },
  { label: 'Our story', href: '/about' },
  { label: 'Sign in', href: '/login' },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#032515] px-4 py-16 text-white sm:py-20">
      <div className="section-wrap">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-end border-b border-white/15 pb-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="brand-mark"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 19C7 11 12 6 20 4c-1 8-6 13-14 15" /><path d="M7 16c3-1 6-3 9-7" /></svg></span>
              <p className="text-xl font-black tracking-[-0.04em]">Farm Fresh <span className="text-[#79e87e] font-medium">Market</span></p>
            </div>
            <h2 className="section-title mt-8 max-w-3xl">Closer to the farm. Better at the table.</h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-md text-white/60 leading-relaxed">A community marketplace where local farmers control what they publish and customers shop from real, current listings.</p>
            <Link href="/register" className="btn-primary mt-6">Create your account</Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer navigation">
            {links.map((link) => <Link key={link.href} href={link.href} className="text-sm font-bold text-white/65 hover:text-[#79e87e]">{link.label}</Link>)}
            <Link href="/admin" className="text-sm font-bold text-white/65 hover:text-[#79e87e]">Admin</Link>
          </nav>
          <p className="text-sm text-white/45">© 2026 Farm Fresh Market. Built for local food communities.</p>
        </div>
      </div>
    </footer>
  );
}
