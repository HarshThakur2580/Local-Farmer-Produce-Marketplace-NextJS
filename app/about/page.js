import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import AboutBanners from '@/components/AboutBanners';

const values = [
  { label: 'Freshness', title: 'Let the season lead', text: 'Live listings help customers see what nearby growers actually have available now.' },
  { label: 'Fairness', title: 'Put farmers in control', text: 'Growers create their own profiles, describe their harvests, and set their own marketplace prices.' },
  { label: 'Trust', title: 'Make the source visible', text: 'Every listing connects back to a real farm profile instead of an anonymous catalogue.' },
  { label: 'Community', title: 'Keep food relationships local', text: 'The platform is designed to shorten the distance between the field and the family table.' },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      <section className="listing-hero px-4 py-16 sm:py-24">
        <div className="section-wrap">
          <span className="eyebrow text-[#79e87e]">Our story</span>
          <h1 className="display-title mt-8 max-w-6xl"><span className="block text-[#f4511e]">A marketplace</span><span className="block text-[#79e87e]">with roots.</span></h1>
          <div className="mt-12 grid lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            <p className="text-2xl sm:text-3xl font-black leading-tight">Farm Fresh exists to make local food easier to discover, easier to sell, and easier to trust.</p>
            <p className="text-lg leading-relaxed text-white/65">Instead of filling the site with sample farms or fixed produce, the marketplace grows through the people who use it. Farmers publish the story; customers discover what is genuinely available.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#e5f7e8] px-4 py-20 sm:py-28">
        <div className="section-wrap grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <AboutBanners />
          <div>
            <span className="eyebrow text-[#155d38]">Why we built it</span>
            <h2 className="section-title mt-6">Local food deserves a better digital home.</h2>
            <p className="mt-6 text-lg leading-relaxed text-[#40564a]">Traditional supply chains can hide the people, place, and care behind a harvest. This platform gives those details a place to live—and gives each participant a workspace suited to their role.</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-[1.5rem] bg-[#fffef8] p-5 border border-[#155d38]/10"><p className="font-black text-[#f4511e]">Customers</p><p className="text-sm text-[#607068] mt-2">Browse growers, shop listings, and keep a private cart.</p></div>
              <div className="rounded-[1.5rem] bg-[#032515] text-white p-5"><p className="font-black text-[#79e87e]">Farmers</p><p className="text-sm text-white/60 mt-2">Build a farm profile and publish current produce.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f6ee] px-4 py-20 sm:py-28">
        <div className="section-wrap">
          <div className="max-w-3xl"><span className="eyebrow text-[#155d38]">What guides us</span><h2 className="section-title mt-6">Four ideas, one healthier market.</h2></div>
          <div className="grid md:grid-cols-2 gap-4 mt-12">
            {values.map((value, index) => (
              <article key={value.label} className={`rounded-[2rem] p-7 sm:p-9 min-h-64 flex flex-col justify-between ${index === 1 ? 'bg-[#f4511e] text-white' : index === 2 ? 'bg-[#032515] text-white' : 'bg-[#fffef8] border border-[#155d38]/15'}`}>
                <span className={`text-xs font-black uppercase tracking-[0.16em] ${index === 1 ? 'text-white/65' : index === 2 ? 'text-[#79e87e]' : 'text-[#155d38]'}`}>{value.label}</span>
                <div><h3 className="text-2xl sm:text-3xl font-black tracking-[-0.04em]">{value.title}</h3><p className={`mt-3 leading-relaxed ${index === 1 || index === 2 ? 'text-white/65' : 'text-[#607068]'}`}>{value.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#032515] text-white px-4 py-20 sm:py-24">
        <div className="section-wrap text-center"><span className="eyebrow text-[#79e87e]">Take part</span><h2 className="section-title max-w-4xl mx-auto mt-6">Bring your next harvest—or your next meal—closer to home.</h2><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/register" className="btn-primary">Join the marketplace</Link><Link href="/products" className="btn-secondary">Browse produce</Link></div></div>
      </section>
    </PageWrapper>
  );
}
