'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/Icon';

export default function FarmerProfilePage() {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/farmers/${id}`, { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Farmer not found.');
        if (!cancelled) {
          setFarmer(data.farmer);
          setProducts(data.products || []);
        }
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <PageWrapper><div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">Loading farm profile...</div></PageWrapper>;
  if (error || !farmer) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="mx-auto mb-4 grid w-16 h-16 place-items-center rounded-full bg-[#e5f7e8] text-[#155d38]"><Icon name="farmer" className="w-8 h-8" /></div>
          <h1 className="text-2xl font-bold text-gray-900">Farmer Profile Not Found</h1>
          <p className="text-gray-500 text-sm my-3">{error}</p>
          <Link href="/farmers" className="inline-block bg-green-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl">← Back to Farmers</Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="listing-hero py-14 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#79e87e] font-semibold mb-5">
            <Link href="/farmers" className="hover:underline">Growers</Link><span>/</span><span className="text-white/50">{farmer.name}</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.07] p-6 sm:p-8 rounded-[2rem] border border-white/15">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-[1.5rem] bg-[#79e87e] text-[#032515] flex items-center justify-center"><Icon name="farmer" className="w-10 h-10" /></div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl sm:text-5xl font-black tracking-[-0.05em] text-white">{farmer.name}</h1>
                  {farmer.isVerified && <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full inline-flex items-center gap-1"><Icon name="check" className="w-3 h-3" />Verified</span>}
                </div>
                <p className="text-[#79e87e] font-bold mt-2">{farmer.farmName}</p>
                <p className="text-sm text-white/55 mt-1">{farmer.location} · {farmer.yearsActive} years experience</p>
              </div>
            </div>
            <a href={`mailto:${farmer.email}`} className="btn-primary">Contact farmer</a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="soft-panel p-6 h-fit">
            <h2 className="font-bold text-gray-900 mb-3">About the Farm</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{farmer.bio}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {farmer.specialties?.map((specialty) => <span key={specialty} className="text-xs text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">{specialty}</span>)}
            </div>
            <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2">
              <p><strong>Email:</strong> {farmer.email}</p>
              <p><strong>Phone:</strong> {farmer.phone}</p>
              <p className="flex items-center gap-1"><strong>Rating:</strong> {farmer.rating ? <><Icon name="star" className="w-4 h-4 text-yellow-600" />{farmer.rating}</> : 'New profile'}</p>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div><h2 className="text-xl font-bold text-gray-900">Products by {farmer.farmName}</h2><p className="text-xs text-gray-500 mt-1">{products.length} active listings</p></div>
              <Link href="/products" className="text-xs text-green-700 font-semibold hover:underline">All products</Link>
            </div>
            {products.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200"><div className="mx-auto mb-3 grid w-14 h-14 place-items-center rounded-full bg-[#e5f7e8] text-[#155d38]"><Icon name="leaf" className="w-7 h-7" /></div><h3 className="font-bold text-gray-800">No products listed yet</h3></div>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
