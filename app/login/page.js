'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import Icon from '@/components/Icon';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading: sessionLoading, refreshSession, logout } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim(), password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.message || 'Invalid email or password.'); return; }
      await refreshSession();
      router.push('/');
      router.refresh();
    } catch (requestError) {
      console.error('Login error:', requestError);
      setError('Unable to connect to the authentication service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <section className="auth-shell grid place-items-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-[1.05fr_0.95fr] gap-5 items-stretch">

          <div className="auth-card p-6 sm:p-10 flex flex-col justify-center order-1">
            {sessionLoading ? (
              <div className="py-20 text-center"><span className="inline-block w-9 h-9 rounded-full border-2 border-[#155d38] border-t-transparent animate-spin" /><p className="mt-4 text-sm text-[#607068]">Checking your session…</p></div>
            ) : user ? (
              <SignedInCard user={user} logout={logout} />
            ) : (
              <>
                <div className="mb-8"><span className="eyebrow text-[#155d38]">Account access</span><h2 className="text-4xl font-black tracking-[-0.055em] mt-5">Sign in to Farm Fresh</h2><p className="text-[#607068] mt-3">Use the account you created as a customer or farmer.</p></div>
                {error && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <label className="block"><span className="block text-sm font-black mb-2">Email address</span><input type="email" required autoComplete="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} className="input" placeholder="you@example.com" /></label>
                  <label className="block"><span className="block text-sm font-black mb-2">Password</span><div className="relative"><input type={showPassword ? 'text' : 'password'} required minLength={8} autoComplete="current-password" value={formData.password} onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))} className="input pr-20" placeholder="Your password" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#155d38]">{showPassword ? 'Hide' : 'Show'}</button></div></label>
                  <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
                </form>
                <p className="text-center text-sm text-[#607068] mt-7 pt-6 border-t border-[#155d38]/10">New to the market? <Link href="/register" className="font-black text-[#155d38] hover:underline">Create an account</Link></p>
              </>
            )}
          </div>
          <aside className="relative min-h-[34rem] lg:min-h-0 overflow-hidden rounded-[2.25rem] border border-white/15 order-2">
            <Image src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=88" alt="Green crop rows on a local farm" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#032515] via-[#032515]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9 text-white"><span className="grid w-12 h-12 place-items-center rounded-full bg-[#79e87e] text-[#032515]"><Icon name="lock" className="w-6 h-6" /></span><h2 className="text-3xl font-black tracking-[-0.045em] mt-5">Your local market is ready when you are.</h2><p className="text-white/65 mt-3">Sign in to return to your private customer cart or farmer workspace.</p></div>
          </aside>
        </div>
      </section>
    </PageWrapper>
  );
}

function SignedInCard({ user, logout }) {
  return (
    <div className="text-center py-6">
      <div className="mx-auto w-16 h-16 rounded-full bg-[#79e87e] text-[#032515] grid place-items-center"><Icon name="check" className="w-8 h-8" strokeWidth={2.4} /></div>
      <span className="eyebrow text-[#155d38] mt-6">Session active</span>
      <h1 className="text-3xl font-black tracking-[-0.05em] mt-5">You are already signed in</h1>
      <p className="text-[#607068] mt-2">{user.fullName} · {user.email}</p>
      <div className="grid gap-3 mt-8">
        <Link href={user.accountType === 'farmer' ? '/' : '/products'} className="btn-primary w-full">Open your workspace</Link>
        <button onClick={logout} className="btn-secondary w-full text-[#155d38]">Sign out</button>
      </div>
    </div>
  );
}
