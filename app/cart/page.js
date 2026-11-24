'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    isLoaded,
  } = useCart();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // If still hydrating from localStorage
  if (!isLoaded) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl animate-bounce">🛒</span>
            <p className="text-sm text-gray-500">Loading your cart...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const freeDeliveryThreshold = 199;
  const amountToFreeDelivery = freeDeliveryThreshold - subtotal;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  return (
    <PageWrapper>
      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-10 px-4 sm:px-6 lg:px-8 border-b border-green-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-green-700 font-semibold mb-2">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:underline">Products</Link>
              <span>/</span>
              <span className="text-gray-500 font-normal">Cart</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <span>🛒</span> Your Shopping Cart
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {cartCount > 0
                ? `You have ${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart.`
                : 'Review your selected fresh produce.'}
            </p>
          </div>

          {cartItems.length > 0 && (
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-green-700 hover:text-green-800 bg-white border border-green-200 px-4 py-2.5 rounded-xl transition hover:bg-green-50 self-start sm:self-auto"
            >
              ← Continue Shopping
            </Link>
          )}
        </div>
      </section>

      {/* Main Cart Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-lg mx-auto text-center py-16 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
              🧺
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Looks like you haven&apos;t added any farm fresh produce yet. Connect directly with local farmers today!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="bg-green-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-sm"
              >
                Browse Fresh Products
              </Link>
              <Link
                href="/farmers"
                className="border border-gray-200 text-gray-700 font-medium text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition"
              >
                Meet Our Farmers
              </Link>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Products List (2 Columns on Large Screens) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Goal Banner */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-xs sm:text-sm text-emerald-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚚</span>
                  {amountToFreeDelivery > 0 ? (
                    <span>
                      Add <strong>₹{amountToFreeDelivery.toFixed(2)}</strong> more to unlock <strong>FREE Delivery</strong>!
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-900">
                      🎉 Congratulations! You qualify for FREE Delivery!
                    </span>
                  )}
                </div>
                <div className="w-24 bg-emerald-200 rounded-full h-2 overflow-hidden hidden sm:block">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 text-base">
                    Order Items ({cartItems.length})
                  </h2>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your cart?')) {
                        clearCart();
                      }
                    }}
                    className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline transition"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => {
                    const itemTotal = item.price * item.quantity;
                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
                      >
                        {/* Product Info */}
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-3xl select-none">
                                {item.emoji || '🥬'}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                              <span>🏡 {item.farmerName}</span>
                              {item.isOrganic && (
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                  Organic
                                </span>
                              )}
                            </p>
                            <p className="text-xs font-semibold text-green-700 mt-1">
                              ₹{item.price.toFixed(2)}{' '}
                              <span className="text-gray-400 font-normal">/ {item.unit}</span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls & Line Total */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                          {/* Quantity Picker */}
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-8 h-8 rounded-md bg-white text-gray-600 font-bold hover:bg-gray-100 transition flex items-center justify-center shadow-xs"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-bold text-sm text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="w-8 h-8 rounded-md bg-white text-gray-600 font-bold hover:bg-gray-100 transition flex items-center justify-center shadow-xs"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-[70px]">
                            <p className="font-extrabold text-gray-900 text-sm sm:text-base">
                              ₹{itemTotal.toFixed(2)}
                            </p>
                            <p className="text-[11px] text-gray-400">Total</p>
                          </div>

                          {/* Delete Item */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                            title="Remove from cart"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary (1 Column) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-extrabold text-gray-900 text-lg mb-4 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span>Delivery Fee</span>
                    <span
                      className="text-[10px] text-gray-400 cursor-pointer"
                      title="Free delivery on orders ₹199 and above across Jalandhar, Phagwara, Law Gate & Green Valley"
                    >
                      ℹ️
                    </span>
                  </div>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-semibold uppercase text-xs">FREE</span>
                    ) : (
                      <span className="font-semibold text-gray-900">₹{deliveryFee.toFixed(2)}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Farm Handling & Packaging</span>
                  <span className="text-emerald-600 font-semibold text-xs uppercase">FREE</span>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-green-700">₹{total.toFixed(2)}</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Includes all taxes</p>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-md text-sm flex items-center justify-center gap-2"
              >
                <span>🔒</span> Proceed to Checkout
              </button>

              {/* Guarantees */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2.5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>100% Direct from verified local farmers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Same-day or next-day fresh morning dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Safe & secure mock checkout flow</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Mock Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => {
                setCheckoutModalOpen(false);
                setOrderPlaced(false);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-lg"
              aria-label="Close"
            >
              ✕
            </button>

            {orderPlaced ? (
              <div className="text-center py-4">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Thank you for supporting local farmers! Your fresh produce order has been placed successfully in simulation mode.
                </p>
                <div className="bg-green-50 p-4 rounded-xl text-xs text-green-800 mb-6 text-left space-y-1">
                  <p><strong>Order ID:</strong> #{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p><strong>Total Amount:</strong> ₹{total.toFixed(2)}</p>
                  <p><strong>Payment Status:</strong> Paid (Cash on Delivery / Simulation)</p>
                  <p className="text-gray-500 pt-1 text-[11px]">
                    * Note: Frontend preview. Database and payment gateways will be wired in upcoming stages.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCheckoutModalOpen(false);
                    setOrderPlaced(false);
                  }}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
                >
                  Back to Marketplace
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📦</span>
                  <h3 className="text-xl font-bold text-gray-900">Checkout Preview</h3>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  Confirm your delivery address for your fresh farm produce order.
                </p>

                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue="42 Green Meadow Lane, Bengaluru"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        required
                        defaultValue="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Delivery Slot
                      </label>
                      <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none bg-white">
                        <option>Tomorrow Morning (7AM - 10AM)</option>
                        <option>Tomorrow Evening (4PM - 7PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between font-semibold text-gray-800">
                      <span>Total to Pay:</span>
                      <span className="text-green-700 font-bold">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Payment Method:</span>
                      <span>Cash on Delivery (COD)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition text-sm shadow-md mt-2"
                  >
                    Confirm & Place Order (₹{total.toFixed(2)})
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
