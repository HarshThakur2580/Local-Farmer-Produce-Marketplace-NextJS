'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HomeBanners from '@/components/HomeBanners';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/Icon';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const { cartCount, total } = useCart();
  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadRoleHome() {
      try {
        if (user.accountType === 'farmer') {
          const response = await fetch('/api/account/overview', { cache: 'no-store' });
          const result = await response.json();
          if (!response.ok) throw new Error(result.message || 'Unable to load farmer workspace.');
          if (!cancelled) setData(result);
        } else {
          const [productsResponse, farmersResponse] = await Promise.all([
            fetch('/api/products', { cache: 'no-store' }),
            fetch('/api/farmers', { cache: 'no-store' }),
          ]);
          const productsResult = await productsResponse.json();
          const farmersResult = await farmersResponse.json();
          if (!productsResponse.ok || !farmersResponse.ok) throw new Error('Unable to load marketplace data.');
          if (!cancelled) setData({
            products: (productsResult.products || []).slice(0, 4),
            productCount: (productsResult.products || []).length,
            farmerCount: (farmersResult.farmers || []).length,
          });
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    loadRoleHome();
    return () => { cancelled = true; };
  }, [user]);

  if (authLoading) return <LoadingHome />;

  if (!user) {
    return <PageWrapper><Hero /><Features /><HomeBanners /></PageWrapper>;
  }

  if (dataLoading) return <LoadingHome text={`Preparing your ${user.accountType} home`} />;
  if (user.accountType === 'farmer') return <FarmerHome user={user} overview={data} error={error} />;
  return <CustomerHome user={user} marketplace={data} cartCount={cartCount} total={total} error={error} />;
}

function LoadingHome({ text = 'Loading your marketplace' }) {
  return (
    <PageWrapper>
      <div className="min-h-[65vh] bg-[#032515] text-white grid place-items-center px-4">
        <div className="text-center"><span className="inline-block w-10 h-10 rounded-full border-2 border-[#79e87e] border-t-transparent animate-spin" /><p className="mt-4 text-sm text-white/60">{text}…</p></div>
      </div>
    </PageWrapper>
  );
}

function CustomerHome({ user, marketplace, cartCount, total, error }) {
  const products = marketplace?.products || [];
  return (
    <PageWrapper>
      <section className="listing-hero px-4 py-16 sm:py-20">
        <div className="section-wrap grid lg:grid-cols-[1.25fr_0.75fr] gap-6">
          <div className="rounded-[2.25rem] border border-white/15 bg-white/[0.06] p-7 sm:p-10">
            <span className="eyebrow text-[#79e87e]">Customer home</span>
            <h1 className="section-title mt-6">Welcome back, <span className="text-[#79e87e]">{firstName(user.fullName)}</span>.</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/65">Discover what nearby farmers have just harvested and build your next fresh-food order.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/products" className="btn-primary">Shop product</Link><Link href="/farmers" className="btn-secondary">Meet growers</Link></div>
          </div>
          <Link href="/cart" className="rounded-[2.25rem] bg-[#f4511e] p-7 sm:p-9 flex flex-col justify-between min-h-72 hover:-translate-y-1">
            <div className="flex items-center justify-between"><span className="eyebrow">Your cart</span><Icon name="cart" className="w-8 h-8" /></div>
            <div><p className="text-5xl font-black tracking-[-0.06em]">{cartCount}</p><p className="text-lg font-bold mt-1">{cartCount === 1 ? 'item ready' : 'items ready'}</p><p className="mt-3 text-white/70">Current total: ₹{total.toFixed(2)}</p></div>
          </Link>
        </div>
      </section>

      <MarketplaceSection error={error} products={products} productCount={marketplace?.productCount || 0} farmerCount={marketplace?.farmerCount || 0} />
    </PageWrapper>
  );
}

function MarketplaceSection({ error, products, productCount, farmerCount }) {
  return (
    <section className="section-wrap py-16 sm:py-20">
      {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        <Stat value={productCount} label="Available harvests" tone="orange" />
        <Stat value={farmerCount} label="Grower profiles" tone="green" />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div><span className="eyebrow text-[#155d38]">Recently published</span><h2 className="text-3xl sm:text-5xl font-black tracking-[-0.055em] mt-4">Fresh from the field</h2></div>
        <Link href="/products" className="btn-secondary text-[#155d38] self-start">View full market</Link>
      </div>
      {products.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState text="No farmers have published products yet." />}
    </section>
  );
}

function FarmerHome({ user, overview, error }) {
  const products = overview?.products || [];
  const stats = overview?.stats || { products: 0, activeProducts: 0, totalStock: 0 };
  return (
    <PageWrapper>
      <section className="listing-hero px-4 py-16 sm:py-20">
        <div className="section-wrap">
          <span className="eyebrow text-[#79e87e]">Grower workspace</span>
          <div className="mt-6 grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div><h1 className="section-title max-w-4xl">Grow your market, <span className="text-[#f4511e]">{firstName(user.fullName)}</span>.</h1><p className="mt-5 text-lg text-white/65 max-w-2xl">Manage your farm story, publish available harvests, and keep every listing current.</p></div>
            <div className="flex flex-wrap gap-3"><Link href="/products/new" className="btn-primary">Add product</Link><Link href={overview?.farmer?.id ? `/farmers/${overview.farmer.id}` : '/farmers/new'} className="btn-secondary">{overview?.farmer ? 'View farm profile' : 'Create farm profile'}</Link></div>
          </div>
        </div>
      </section>

      <section className="section-wrap py-16 sm:py-20">
        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        <div className="grid sm:grid-cols-3 gap-4 mb-12"><Stat value={stats.products} label="Total listings" tone="green" /><Stat value={stats.activeProducts} label="Active harvests" tone="orange" /><Stat value={stats.totalStock} label="Units in stock" tone="green" /></div>
        {!overview?.farmer && <div className="mb-12 rounded-[2rem] border border-[#f4511e]/25 bg-[#f4511e] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-white/65">First step</p><h2 className="text-2xl font-black mt-2">Tell customers about your farm</h2><p className="text-white/70 mt-2">A complete profile builds trust before your first sale.</p></div><Link href="/farmers/new" className="btn-secondary shrink-0">Create profile</Link></div>}
        <div className="flex items-end justify-between gap-4 mb-7"><div><span className="eyebrow text-[#155d38]">Your catalogue</span><h2 className="text-3xl sm:text-5xl font-black tracking-[-0.055em] mt-4">Recent listings</h2></div><Link href="/products" className="btn-secondary text-[#155d38] hidden sm:inline-flex">Public market</Link></div>
        {products.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState text="You have not published any products yet." actionHref="/products/new" actionLabel="Add first product" />}
      </section>
    </PageWrapper>
  );
}

function Stat({ value, label, tone }) {
  const accent = tone === 'orange' ? 'bg-[#f4511e] text-white' : 'bg-[#e5f7e8] text-[#10251a]';
  return <div className={`${accent} rounded-[2rem] p-6 sm:p-8`}><p className="text-5xl font-black tracking-[-0.06em]">{value}</p><p className="mt-2 font-bold opacity-70">{label}</p></div>;
}

function EmptyState({ text, actionHref, actionLabel }) {
  return <div className="soft-panel text-center py-14 px-5"><span className="inline-grid place-items-center w-14 h-14 rounded-full bg-[#e5f7e8] text-[#155d38]"><Icon name="leaf" className="w-7 h-7" /></span><p className="mt-4 text-[#607068]">{text}</p>{actionHref && <Link href={actionHref} className="btn-primary mt-6">{actionLabel}</Link>}</div>;
}

function firstName(name = '') { return name.trim().split(' ')[0] || 'there'; }
