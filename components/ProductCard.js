'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check if item is already in cart
  const cartItem = cartItems?.find((item) => item.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col justify-between">
      <div>
        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-50">
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl">
              {product.emoji || '🌿'}
            </div>
          )}

          {/* Stock badge */}
          {product.stock && (
            <span className="absolute top-3 right-3 text-[11px] font-semibold bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-0.5 rounded-full shadow-sm border border-gray-100">
              {product.stock} in stock
            </span>
          )}

          {/* Organic badge overlay on image */}
          {product.isOrganic && (
            <span className="absolute top-3 left-3 text-[11px] font-semibold bg-emerald-600/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full shadow-sm">
              100% Organic
            </span>
          )}
        </div>

        <div className="p-4">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
              {product.category}
            </span>
            {product.isOrganic && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                🌱 Farm Direct
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-800 text-base mb-1 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>

          {/* Farmer link */}
          {product.farmerName && (
            <div className="mb-2.5">
              <Link
                href={`/farmers/${product.farmerId}`}
                className="text-xs text-gray-500 hover:text-green-600 transition-colors inline-flex items-center gap-1 font-medium"
                title="View Farmer Profile"
              >
                <span>🏡</span>
                <span className="hover:underline">{product.farmerName}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400 font-normal">{product.location}</span>
              </Link>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Price + CTA Button */}
      <div className="p-4 pt-0 border-t border-gray-50 mt-auto">
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-lg font-extrabold text-green-700">₹{product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-200 shadow-xs flex items-center gap-1.5 ${
              addedAnimation
                ? 'bg-emerald-700 text-white scale-105'
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedAnimation ? (
              <>
                <span>✓</span>
                <span>Added!</span>
              </>
            ) : (
              <>
                <span>🛒</span>
                <span>Add to Cart</span>
                {currentQuantity > 0 && (
                  <span className="ml-1 bg-white/20 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                    ({currentQuantity})
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
