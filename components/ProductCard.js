'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const canShop = user?.accountType === 'customer';
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cartItem = cartItems?.find((item) => item.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (event) => {
    event.preventDefault();
    if (!canShop) return;
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1000);
  };

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[#155d38]/15 bg-[#fffef8] shadow-[0_18px_45px_rgba(9,65,38,0.07)] flex flex-col hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(9,65,38,0.13)]">
      <div className="relative h-52 overflow-hidden bg-[#e5f7e8]">
        {product.image && !imgError ? (
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" onError={() => setImgError(true)} className="object-cover group-hover:scale-105 duration-700" />
        ) : (
          <div className="w-full h-full grid place-items-center text-[#155d38]" aria-hidden="true"><Icon name="leaf" className="w-16 h-16" strokeWidth={1.25} /></div>
        )}
        <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between gap-2">
          <span className="rounded-full bg-[#fffef8]/95 px-3 py-1 text-xs font-black text-[#155d38] shadow-sm">{product.category}</span>
          {Number.isFinite(product.stock) && <span className="rounded-full bg-[#032515]/90 px-3 py-1 text-xs font-bold text-white">{product.stock} left</span>}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          {product.isOrganic && <p className="text-[0.7rem] font-black uppercase tracking-[0.14em] text-[#f4511e] mb-2">Naturally grown</p>}
          <h3 className="text-xl font-black tracking-[-0.035em] text-[#10251a]">{product.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#607068] line-clamp-2">{product.description}</p>
          {product.farmerName && (
            <div className="mt-4 text-xs font-semibold text-[#40564a]">
              {product.farmerId ? <Link href={`/farmers/${product.farmerId}`} className="hover:text-[#155d38] hover:underline">{product.farmerName} · {product.location}</Link> : <span>{product.farmerName}</span>}
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-[#155d38]/10 flex items-center justify-between gap-3">
          <div><span className="text-2xl font-black tracking-[-0.04em] text-[#155d38]">₹{Number(product.price).toFixed(2)}</span><span className="text-xs text-[#607068] ml-1">/ {product.unit}</span></div>
          {canShop ? (
            <button onClick={handleAddToCart} disabled={product.stock <= 0} className={`min-h-11 rounded-full px-4 text-xs font-black ${product.stock <= 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : addedAnimation ? 'bg-[#155d38] text-white' : 'bg-[#79e87e] text-[#032515] hover:bg-[#98f29c]'}`} aria-label={`Add ${product.name} to cart`}>
              {product.stock <= 0 ? 'Sold out' : addedAnimation ? 'Added' : currentQuantity > 0 ? `Add more (${currentQuantity})` : 'Add to cart'}
            </button>
          ) : !user ? (
            <Link href="/login" className="min-h-11 rounded-full border border-[#155d38]/20 px-4 grid place-items-center text-xs font-black text-[#155d38] hover:bg-[#e5f7e8]">Sign in to buy</Link>
          ) : (
            <span className="min-h-11 rounded-full bg-[#f4511e]/10 px-4 grid place-items-center text-xs font-black text-[#b63814]">Seller view</span>
          )}
        </div>
      </div>
    </article>
  );
}
