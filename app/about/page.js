import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';

const teamMembers = [
  { name: 'Arjun Sharma', role: 'Co-Founder & CEO', emoji: '👨‍💼', bio: 'Former agricultural economist passionate about bridging the urban-rural divide.' },
  { name: 'Meena Patel', role: 'Co-Founder & CTO', emoji: '👩‍💻', bio: 'Full-stack engineer who grew up on a farm and saw firsthand the need for direct market access.' },
  { name: 'Deepak Nair', role: 'Head of Farmer Relations', emoji: '👨‍🌾', bio: 'Has on-boarded 300+ farmers and trained them in digital tools and market pricing.' },
  { name: 'Sana Khan', role: 'Head of Customer Experience', emoji: '👩‍💼', bio: 'Ensures every buyer gets the freshest produce with the smoothest delivery experience.' },
];

const milestones = [
  { year: '2022', event: 'Platform founded with 10 pilot farmers in Karnataka.' },
  { year: '2023', event: 'Expanded to 5 states, 500 farmers and 10,000 customers.' },
  { year: '2024', event: 'Launched mobile app and same-day delivery in Bengaluru.' },
  { year: '2025', event: 'Reached ₹10 crore in total farmer payouts. Pan-India operations.' },
  { year: '2026', event: 'Serving 50+ counties with 2,000+ listed products.' },
];

const values = [
  { icon: '🌱', title: 'Sustainability', desc: 'We promote eco-friendly farming practices and reduce food miles by prioritizing local sourcing.' },
  { icon: '🤝', title: 'Fair Trade', desc: 'Farmers receive up to 40% more than what they earn through traditional supply chains.' },
  { icon: '🔍', title: 'Transparency', desc: 'Know exactly where your food comes from. Every product is traceable to its farm.' },
  { icon: '🌍', title: 'Community', desc: 'We reinvest in farming communities through training, tools and infrastructure.' },
  { icon: '💚', title: 'Health First', desc: 'Fresh, minimally processed produce without harmful chemicals or artificial ripening.' },
  { icon: '📱', title: 'Technology', desc: 'Empowering smallholder farmers with digital tools to compete in modern markets.' },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🌿 Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            About{' '}
            <span className="text-green-600">Local Farmer</span>
            <br />
            Produce Marketplace
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We are a technology-driven platform connecting local farmers directly with consumers, 
            eliminating middlemen, ensuring fair prices and delivering fresh produce from farm to table.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To empower local farmers by giving them direct access to consumers, fair pricing, 
              and digital tools — while providing customers with the freshest, most affordable, 
              and transparently sourced agricultural produce possible.
            </p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
            <div className="text-4xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              A world where every meal starts with a story — where you know the name of the farmer, 
              the name of their farm, and the journey your food took to reach your plate. 
              We&apos;re building a fairer, fresher, and more sustainable food ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-600 py-14 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Local Farmers' },
            { value: '₹10Cr+', label: 'Farmer Payouts' },
            { value: '10,000+', label: 'Happy Customers' },
            { value: '50+', label: 'Counties Served' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold mb-1">{s.value}</p>
              <p className="text-green-100 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">What We Stand For</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our core values guide every decision we make — from product features to farmer partnerships.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Our Journey</h2>
            <p className="text-gray-500">From a small pilot to a nationwide platform.</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 z-10 shadow-md">
                    {m.year}
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 flex-1">
                    <p className="text-gray-700 text-sm leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Meet the Team</h2>
            <p className="text-gray-500">The people behind the platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((m) => (
              <div key={m.name} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="text-5xl mb-3">{m.emoji}</div>
                <h3 className="font-bold text-gray-900 text-base">{m.name}</h3>
                <p className="text-xs text-green-700 font-semibold mb-2">{m.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">Join Our Growing Community</h2>
          <p className="text-green-100 mb-8 text-lg">
            Whether you&apos;re a farmer looking to sell, or a customer looking for fresh produce — we&apos;ve got a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg"
            >
              Get Started Today
            </Link>
            <Link
              href="/products"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white hover:text-green-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
