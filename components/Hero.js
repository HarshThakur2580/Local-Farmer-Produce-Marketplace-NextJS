import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/Icon';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#032515] text-white px-4 pt-12 pb-20 sm:pt-16 lg:pt-20 lg:pb-28">
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#79e87e 0.7px, transparent 0.7px)', backgroundSize: '7px 7px' }} />
      <div className="section-wrap relative">
        <div className="max-w-5xl">
          <span className="eyebrow text-[#79e87e]">Grown nearby · shared locally</span>
          <h1 className="display-title mt-8">
            <span className="block text-[#f4511e]">Good food.</span>
            <span className="block text-[#f4511e]">Real growers.</span>
            <span className="block text-[#79e87e]">One market.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg sm:text-xl leading-relaxed text-white/72">
            Meet the people growing your food and buy seasonal produce directly from farms in your community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">Explore the market</Link>
            <Link href="/register" className="btn-secondary text-white">Join as a grower</Link>
          </div>
        </div>

        <div className="mt-14 grid lg:grid-cols-[0.8fr_1.2fr] gap-6 lg:gap-12 items-end">
          <div className="lg:pb-8">
            <p className="text-2xl sm:text-3xl font-black tracking-[-0.035em] leading-tight max-w-lg">
              Fresh harvests, honest prices, and a shorter journey from soil to table.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-lg">
              {[
                ['Direct', 'from farms'],
                ['Seasonal', 'by nature'],
                ['Local', 'by choice'],
              ].map(([value, label]) => (
                <div key={value} className="border-t border-white/20 pt-3">
                  <p className="font-black text-[#79e87e]">{value}</p>
                  <p className="text-xs text-white/55 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[22rem] sm:min-h-[30rem] overflow-hidden rounded-[2.75rem] border border-white/15">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1500&q=88"
              alt="A vibrant local produce market"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#032515]/65 via-transparent to-transparent" />
            <div className="absolute left-5 bottom-5 right-5 flex items-end justify-between gap-4">
              <p className="max-w-sm text-sm font-semibold text-white/90">A marketplace shaped by the seasons and the people who grow through them.</p>
              <span className="shrink-0 w-14 h-14 rounded-full bg-[#f4511e] grid place-items-center" aria-hidden="true"><Icon name="arrowUpRight" className="w-6 h-6" /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
