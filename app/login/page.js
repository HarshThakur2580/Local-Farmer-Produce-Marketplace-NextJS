'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';

export default function LoginPage() {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailVal = formData.email.trim();
    if (!emailVal) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Explicitly do NOT store passwords in localStorage.
    // Set in-memory session simulation state only.
    setLoggedInUser({
      email: formData.email.trim(),
      role,
      name: role === 'farmer' ? 'Ravi Kumar (Demo Farmer)' : 'Ananya (Demo Customer)',
    });
  };

  const handleDemoFill = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'farmer') {
      setFormData({
        email: 'ravi@greenvalley.farm',
        password: 'Password123!',
      });
    } else {
      setFormData({
        email: 'customer@farmfresh.market',
        password: 'Password123!',
      });
    }
    setErrors({});
  };

  return (
    <PageWrapper>
      <section className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
            {/* Logged in success view */}
            {loggedInUser ? (
              <div className="text-center py-4 animate-in fade-in">
                <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Welcome back, {loggedInUser.name}!
                </h2>
                <p className="text-sm text-green-700 font-semibold mb-4 capitalize">
                  Active Role: {loggedInUser.role === 'farmer' ? '👨‍🌾 Farmer / Producer' : '🛒 Customer / Buyer'}
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-600 text-left mb-6 space-y-1.5">
                  <p><strong>Signed in as:</strong> {loggedInUser.email}</p>
                  <p><strong>Session:</strong> Active (Simulation Mode)</p>
                  <p className="text-[11px] text-gray-400 pt-1 border-t border-gray-200">
                    ℹ️ Frontend validation complete. No real passwords are stored in localStorage. Full server session management will be wired when MongoDB auth backend is connected.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <Link
                    href="/products"
                    className="block w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition text-sm shadow-sm"
                  >
                    Browse Market Products
                  </Link>
                  <Link
                    href="/cart"
                    className="block w-full border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition text-xs"
                  >
                    View Shopping Cart
                  </Link>
                  <button
                    onClick={() => {
                      setLoggedInUser(null);
                      setFormData({ email: '', password: '' });
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold pt-2"
                  >
                    Sign Out Simulation
                  </button>
                </div>
              </div>
            ) : (
              /* Regular Login Form */
              <div>
                {/* Header */}
                <div className="text-center mb-6">
                  <span className="text-5xl select-none">🌿</span>
                  <h1 className="text-2xl font-extrabold text-gray-900 mt-2 mb-1">Welcome Back</h1>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Sign in to your Local Farmer Produce Marketplace account
                  </p>
                </div>

                {/* Role Selector Tabs */}
                <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
                  {[
                    { value: 'customer', label: '🛒 Customer', desc: 'Buy fresh produce' },
                    { value: 'farmer', label: '👨‍🌾 Farmer', desc: 'Manage farm produce' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setRole(value);
                        setErrors({});
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        role === value
                          ? 'bg-white text-green-700 shadow-sm border border-green-100'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Quick demo credentials filler */}
                <div className="flex items-center justify-between bg-green-50/70 border border-green-100 rounded-xl px-3 py-2 text-[11px] text-green-800 mb-5">
                  <span>Fast test:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoFill('customer')}
                      className="underline font-semibold hover:text-green-950"
                    >
                      Demo Customer
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleDemoFill('farmer')}
                      className="underline font-semibold hover:text-green-950"
                    >
                      Demo Farmer
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={role === 'farmer' ? 'farmer@myfarm.com' : 'you@example.com'}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                        errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset will be available once email integration is configured.')}
                        className="text-[11px] text-green-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                          errors.password ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm select-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-md text-sm mt-3"
                  >
                    Sign In as {role === 'farmer' ? '👨‍🌾 Farmer' : '🛒 Customer'}
                  </button>
                </form>

                {/* Register Link */}
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-green-600 font-bold hover:underline">
                    Create one for free
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
