'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import Icon from '@/components/Icon';
import { useAuth } from '@/context/AuthContext';

export default function NewFarmerPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState({ farmName: '', location: '', bio: '', specialties: '', yearsActive: '0' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/farmers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, yearsActive: Number(form.yearsActive) }) });
      const data = await response.json();
      if (!response.ok && response.status !== 409) { setError(data.message || 'Unable to create farm profile.'); return; }
      if (data.farmer?.id) { router.push(`/farmers/${data.farmer.id}`); router.refresh(); } else { setError(data.message || 'Unable to open farm profile.'); }
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
            <Link href="/farmers" className="text-sm font-black text-[#155d38] hover:underline">Back to growers</Link>
            <div className="mt-7"><span className="eyebrow text-[#155d38]">Grower profile</span><h1 className="text-3xl sm:text-5xl font-black tracking-[-0.055em] mt-5">Tell the story of your farm</h1><p className="text-[#607068] mt-3 mb-8">Help customers understand your land, methods, and specialties.</p></div>

            {isLoading ? <Loading /> : !user ? <AccessNotice text="Please sign in before creating a farm profile." /> : user.accountType !== 'farmer' ? <AccessNotice text="Farm profiles are available only to farmer accounts." /> : (
              <form onSubmit={submit} className="space-y-5">
                {error && <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex gap-2"><Icon name="warning" className="w-5 h-5 shrink-0" />{error}</div>}
                <div className="grid sm:grid-cols-2 gap-4"><Field label="Farm name"><input name="farmName" value={form.farmName} onChange={update} required minLength={2} maxLength={120} className="input" /></Field><Field label="Location"><input name="location" value={form.location} onChange={update} required minLength={2} maxLength={160} className="input" /></Field></div>
                <Field label="About your farm"><textarea name="bio" value={form.bio} onChange={update} required minLength={20} maxLength={1500} rows={5} className="input" /></Field>
                <Field label="Specialties (comma separated)"><input name="specialties" value={form.specialties} onChange={update} placeholder="Vegetables, herbs, grains" className="input" /></Field>
                <Field label="Years farming"><input name="yearsActive" value={form.yearsActive} onChange={update} required type="number" min="0" max="100" step="1" className="input" /></Field>
                <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? 'Creating…' : 'Create farm profile'}</button>
              </form>
            )}
          </div>

          <aside className="relative min-h-[32rem] lg:min-h-0 overflow-hidden rounded-[2.25rem] border border-white/15 order-2">
            <Image src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=88" alt="Farmer standing in a sunlit field" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#032515] via-[#032515]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9 text-white"><span className="grid w-12 h-12 place-items-center rounded-full bg-[#79e87e] text-[#032515]"><Icon name="farmer" className="w-6 h-6" /></span><h2 className="text-3xl font-black tracking-[-0.045em] mt-5">Let customers meet the person behind the harvest.</h2><p className="text-white/65 mt-3">A complete farm profile builds recognition and trust.</p></div>
          </aside>
        </div>
      </section>
    </PageWrapper>
  );
}

function Field({ label, children }) { return <label className="block text-sm font-bold text-[#40564a] space-y-2"><span>{label}</span>{children}</label>; }
function Loading() { return <div className="py-12 text-center text-sm text-[#607068]">Checking your account…</div>; }
function AccessNotice({ text }) { return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">{text} <Link href="/login" className="font-black underline">Sign in</Link></div>; }
