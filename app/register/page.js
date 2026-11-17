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
  farmName: '',
  location: '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const e = {};

    // Full Name
    if (!formData.fullName.trim()) {
      e.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 3) {
      e.fullName = 'Name must be at least 3 characters.';
    }

    // Email
    if (!formData.email.trim()) {
      e.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      e.email = 'Please enter a valid email address (e.g., name@domain.com).';
    }

    // Phone
    if (!formData.phone.trim()) {
      e.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      e.phone = 'Enter a valid 10-digit mobile number (e.g. 9876543210).';
    }

    // Farmer-specific field validation
    if (formData.accountType === 'farmer' && !formData.farmName.trim()) {
      e.farmName = 'Farm or orchard name is required for producers.';
    }

    // Password
    if (!formData.password) {
      e.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      e.password = 'Password must be at least 8 characters long.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      e.password = 'Password must include at least one uppercase letter, one lowercase letter, and one number.';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      e.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      e.confirmPassword = 'Passwords do not match.';
    }

    // Terms
    if (!formData.agreeTerms) {
      e.agreeTerms = 'You must agree to the Terms of Service & Privacy Policy.';
    }

    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Simulation success
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageWrapper>
        <section className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center max-w-md w-full animate-in fade-in">
            <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-xs">
              ✓
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 text-sm mb-4">
              Welcome to Local Farmer Marketplace,{' '}
              <strong className="text-green-800">{formData.fullName}</strong>!
            </p>

            <div className="bg-green-50/80 rounded-2xl p-4 text-xs text-green-900 mb-6 text-left border border-green-100 space-y-1.5">
              <p><strong>Account Role:</strong> <span className="capitalize">{formData.accountType}</span></p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Mobile:</strong> +91 {formData.phone}</p>
              {formData.accountType === 'farmer' && formData.farmName && (
                <p><strong>Farm Name:</strong> {formData.farmName}</p>
              )}
              <p className="text-gray-500 text-[11px] pt-1 border-t border-green-200/60">
                🔒 Note: Frontend registration completed in simulation mode. When the MongoDB backend is connected, accounts will be persisted securely with hashed passwords.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-sm text-sm"
              >
                Proceed to Sign In
              </Link>
              <button
                onClick={() => {
                  setFormData(initialForm);
                  setSubmitted(false);
                }}
                className="border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition text-xs"
              >
                Register Another Account
              </button>
            </div>
          </div>
        </section>
      </PageWrapper>
    );
  }

  // Password strength helper
  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' };
    if (p.length < 8 || !/(?=.*[A-Z])(?=.*\d)/.test(p)) {
      return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' };
    }
    if (p.length < 12) return { label: 'Good', color: 'bg-blue-400', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = passwordStrength();

  return (
    <PageWrapper>
      <section className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-4xl sm:text-5xl select-none">🌱</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 mb-1">
                Create Your Account
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm">
                Join our regional produce network as a buyer or producer
              </p>
            </div>

            {/* Error banner if validation errors exist */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-6 flex items-start gap-2">
                <span className="text-sm">⚠️</span>
                <div>
                  <p className="font-bold">Please correct the highlighted errors:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {Object.values(errors).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Account Type Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-gray-100 rounded-2xl">
              {[
                { value: 'customer', label: '🛒 Customer', desc: 'Shop fresh local produce' },
                { value: 'farmer', label: '👨‍🌾 Farmer', desc: 'Sell your farm harvest' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, accountType: value }))}
                  className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                    formData.accountType === value
                      ? 'bg-white text-green-700 shadow-sm border border-green-100'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <div className="font-bold">{label}</div>
                  <div className="text-[11px] font-normal text-gray-400 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={formData.accountType === 'farmer' ? 'e.g. Ramesh Chandra' : 'e.g. Ananya Sharma'}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.fullName ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              {/* Farmer Extra Fields */}
              {formData.accountType === 'farmer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-green-50/50 rounded-2xl border border-green-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Farm Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleChange}
                      placeholder="e.g. Green Valley Farm"
                      className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${
                        errors.farmName ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.farmName && <p className="text-red-500 text-[11px] mt-1">{errors.farmName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      State / Region
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Punjab, India"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 font-semibold select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      errors.phone ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 chars, 1 uppercase, 1 number"
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
                {strength && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Strength: <span className="font-semibold text-gray-600">{strength.label}</span>
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      errors.confirmPassword ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm select-none"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <p className="text-green-600 text-xs mt-1 font-medium">✓ Passwords match</p>
                )}
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 accent-green-600 rounded"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link href="#" className="text-green-600 hover:underline font-semibold">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="#" className="text-green-600 hover:underline font-semibold">Privacy Policy</Link>.
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-md text-sm mt-4"
              >
                Create {formData.accountType === 'farmer' ? '👨‍🌾 Farmer' : '🛒 Customer'} Account
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">
              Already registered?{' '}
              <Link href="/login" className="text-green-600 font-bold hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
