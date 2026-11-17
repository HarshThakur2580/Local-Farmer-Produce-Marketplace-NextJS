'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  accountType: 'customer',
  agreeTerms: false,
};

export default function RegisterPage() {
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required.';
    else if (formData.fullName.trim().length < 3) e.fullName = 'Name must be at least 3 characters.';

    if (!formData.email) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email address.';

    if (!formData.phone) e.phone = 'Phone number is required.';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) e.phone = 'Enter a valid 10-digit Indian phone number.';

    if (!formData.password) e.password = 'Password is required.';
    else if (formData.password.length < 8) e.password = 'Password must be at least 8 characters.';
    else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = 'Password must contain at least one uppercase letter and one number.';

    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (formData.confirmPassword !== formData.password) e.confirmPassword = 'Passwords do not match.';

    if (!formData.agreeTerms) e.agreeTerms = 'You must agree to the terms to continue.';

    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageWrapper>
        <section className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center max-w-md w-full">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Account Created!</h2>
            <p className="text-gray-500 mb-2">
              Welcome, <span className="font-semibold text-green-700">{formData.fullName}</span>!
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Your <span className="font-medium capitalize">{formData.accountType}</span> account has been registered.
              Authentication will be fully enabled soon.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors text-sm"
              >
                Sign In Now
              </Link>
              <Link
                href="/"
                className="border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </PageWrapper>
    );
  }

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' };
    if (p.length < 8 || !/(?=.*[A-Z])(?=.*\d)/.test(p)) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' };
    if (p.length < 12) return { label: 'Good', color: 'bg-blue-400', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = passwordStrength();

  return (
    <PageWrapper>
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-5xl">🌱</span>
              <h1 className="text-2xl font-extrabold text-gray-900 mt-3 mb-1">Create Your Account</h1>
              <p className="text-gray-500 text-sm">Join the Local Farmer Produce Marketplace today</p>
            </div>

            {/* Account Type Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-gray-100 rounded-xl">
              {[
                { value: 'customer', label: '🛒 Customer', desc: 'Buy fresh produce' },
                { value: 'farmer', label: '👨‍🌾 Farmer', desc: 'Sell your harvest' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, accountType: value }))}
                  className={`py-3 px-3 rounded-lg text-sm font-semibold transition-all text-left ${
                    formData.accountType === value
                      ? 'bg-white text-green-700 shadow-sm border border-green-100'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div>{label}</div>
                  <div className="text-xs font-normal text-gray-400 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ravi Kumar"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                    errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 font-medium">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    maxLength={10}
                    className={`flex-1 px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Password strength bar */}
                {strength && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Strength: <span className="font-medium">{strength.label}</span></p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <p className="text-green-500 text-xs mt-1">✓ Passwords match</p>
                )}
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="#" className="text-green-600 hover:underline font-medium">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="#" className="text-green-600 hover:underline font-medium">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-sm text-sm"
              >
                Create {formData.accountType === 'farmer' ? '👨‍🌾 Farmer' : '🛒 Customer'} Account
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
