'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import Icon from '@/components/Icon';
import { useAuth } from '@/context/AuthContext';

const initialForm = { name: '', description: '', price: '', unit: 'kg', category: '', stock: '', isOrganic: false };

export default function NewProductPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.message || 'Unable to create product.'); return; }
      router.push('/products');
      router.refresh();
    } catch (requestError) {
      console.error(requestError);
      setError('Unable to connect to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <section className="auth-shell flex items-center justify-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-[1.05fr_0.95fr] gap-5 items-stretch">
          <div className="auth-card p-6 sm:p-10 order-1">
            <Link href="/products" className="text-sm font-black text-[#155d38] hover:underline">Back to market</Link>
            <div className="mt-7"><span className="eyebrow text-[#155d38]">New harvest</span><h1 className="text-3xl sm:text-5xl font-black tracking-[-0.055em] mt-5">Publish fresh produce</h1><p className="text-[#607068] mt-3 mb-8">Add a live listing customers can discover in the marketplace.</p></div>

            {isLoading ? <Loading /> : !user ? <AccessNotice text="Please sign in before adding a product." /> : user.accountType !== 'farmer' ? <AccessNotice text="Only farmer accounts can publish products." /> : (
              <form onSubmit={submit} className="space-y-5">
                {error && <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex gap-2"><Icon name="warning" className="w-5 h-5 shrink-0" />{error}</div>}
                <div className="grid sm:grid-cols-2 gap-4"><Field label="Product name"><input name="name" value={form.name} onChange={update} required minLength={2} maxLength={120} className="input" /></Field><Field label="Category"><input name="category" value={form.category} onChange={update} required maxLength={80} placeholder="Vegetables, fruits…" className="input" /></Field></div>
                <Field label="Description"><textarea name="description" value={form.description} onChange={update} required minLength={10} maxLength={1000} rows={4} className="input" /></Field>
                <div className="grid sm:grid-cols-3 gap-4"><Field label="Price (₹)"><input name="price" value={form.price} onChange={update} required type="number" min="0.01" step="0.01" className="input" /></Field><Field label="Selling unit"><input name="unit" value={form.unit} onChange={update} required maxLength={40} placeholder="kg, bunch, dozen" className="input" /></Field><Field label="Stock quantity"><input name="stock" value={form.stock} onChange={update} required type="number" min="0" step="1" className="input" /></Field></div>
                <label className="flex items-center gap-3 rounded-2xl bg-[#e5f7e8] p-4 text-sm font-bold text-[#40564a]"><input name="isOrganic" type="checkbox" checked={form.isOrganic} onChange={update} className="w-4 h-4 accent-[#155d38]" /><Icon name="organic" className="w-5 h-5 text-[#155d38]" />Organically grown</label>
                <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? 'Publishing…' : 'Publish product'}</button>
              </form>
            )}
          </div>

          <aside className="relative min-h-[32rem] lg:min-h-0 overflow-hidden rounded-[2.25rem] border border-white/15 order-2">
            <Image src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=88" alt="Fresh vegetables prepared for a local market" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#032515] via-[#032515]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9 text-white"><span className="grid w-12 h-12 place-items-center rounded-full bg-[#79e87e] text-[#032515]"><Icon name="package" className="w-6 h-6" /></span><h2 className="text-3xl font-black tracking-[-0.045em] mt-5">Turn today&apos;s harvest into today&apos;s listing.</h2><p className="text-white/65 mt-3">Clear details help customers understand exactly what is available.</p></div>
          </aside>
        </div>
      </section>
    </PageWrapper>
  );
}

function Field({ label, children }) { return <label className="block text-sm font-bold text-[#40564a] space-y-2"><span>{label}</span>{children}</label>; }
function Loading() { return <div className="py-12 text-center text-sm text-[#607068]">Checking your account…</div>; }
function AccessNotice({ text }) { return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">{text} <Link href="/login" className="font-black underline">Sign in</Link></div>; }
