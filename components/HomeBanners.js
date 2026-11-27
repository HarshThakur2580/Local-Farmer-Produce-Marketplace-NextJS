import Image from 'next/image';
import Link from 'next/link';

export default function HomeBanners() {
  return (
    <section className="bg-[#f7f6ee] px-4 py-20 sm:py-28">
      <div className="section-wrap grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <div className="grid grid-cols-[1.35fr_0.65fr] gap-4 min-h-[34rem]">
          <div className="relative overflow-hidden rounded-[2.5rem]">
            <Image src="https://images.unsplash.com/photo-1498579397066-22750a3cb424?auto=format&fit=crop&w=1000&q=85" alt="Farmer carrying a fresh harvest" fill sizes="(min-width: 1024px) 38vw, 65vw" className="object-cover" />
          </div>
          <div className="grid gap-4 py-8">
            <div className="relative overflow-hidden rounded-full">
              <Image src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=700&q=85" alt="Green farm rows" fill sizes="20vw" className="object-cover" />
            </div>
            <div className="relative overflow-hidden rounded-full">
              <Image src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=85" alt="Fresh tomatoes" fill sizes="20vw" className="object-cover" />
            </div>
          </div>
        </div>

        <div className="lg:pl-6">
          <span className="eyebrow text-[#155d38]">Built for both sides</span>
          <h2 className="section-title mt-6">A simpler way to grow, sell, discover, and eat.</h2>
          <p className="mt-6 text-lg leading-relaxed text-[#607068] max-w-xl">
            Farmers publish their own profiles and harvests. Customers discover live listings, learn about each farm, and build a personal cart after signing in.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <Link href="/farmers" className="soft-panel p-6 group hover:-translate-y-1">
              <span className="text-xs font-black text-[#f4511e] uppercase tracking-[0.14em]">For customers</span>
              <h3 className="text-xl font-black mt-3">Meet local growers</h3>
              <p className="text-sm text-[#607068] mt-2">Browse real farm profiles and current produce.</p>
            </Link>
            <Link href="/register" className="dark-panel p-6 group hover:-translate-y-1">
              <span className="text-xs font-black text-[#79e87e] uppercase tracking-[0.14em]">For farmers</span>
              <h3 className="text-xl font-black mt-3">Open your storefront</h3>
              <p className="text-sm text-white/60 mt-2">Create a profile and publish the harvest yourself.</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
