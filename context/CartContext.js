'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext(null);

const LEGACY_STORAGE_KEY = 'farmfresh_marketplace_cart';
const STORAGE_PREFIX = 'farmfresh_marketplace_cart';
const LOGGED_OUT_KEY = 'logged-out';

export function CartProvider({ children }) {
  const { user, isLoading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadedStorageKey, setLoadedStorageKey] = useState(null);
  const storageKey = user?.accountType === 'customer' && user?.id
    ? `${STORAGE_PREFIX}:${user.id}`
    : null;
  const expectedStorageKey = storageKey || LOGGED_OUT_KEY;
  const isLoaded = !authLoading && loadedStorageKey === expectedStorageKey;

  // Load only the signed-in customer's cart. Guests and farmers have no cart.
  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      try {
        // Remove the former shared cart so it can never appear for another user.
        localStorage.removeItem(LEGACY_STORAGE_KEY);

        if (!storageKey) {
          setCartItems([]);
        } else {
          const saved = localStorage.getItem(storageKey);
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          } else {
            setCartItems([]);
          }
        }
      } catch (err) {
        console.error('Failed to load cart from localStorage:', err);
        setCartItems([]);
      } finally {
        setLoadedStorageKey(expectedStorageKey);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [authLoading, expectedStorageKey, storageKey]);

  // Save only to the active customer's private browser key.
  useEffect(() => {
    if (!isLoaded || !storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cartItems, isLoaded, storageKey]);

  // Add product to cart
  const addToCart = (product, qty = 1) => {
    if (!isLoaded || !storageKey) return;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          category: product.category,
          farmerName: product.farmerName,
          location: product.location,
          isOrganic: product.isOrganic,
          image: product.image,
          quantity: qty,
        },
      ];
    });
  };

  // Increase quantity by 1
  const increaseQuantity = (productId) => {
    if (!isLoaded || !storageKey) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity by 1 (removes if reaches 0)
  const decreaseQuantity = (productId) => {
    if (!isLoaded || !storageKey) return;
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Set explicit quantity
  const updateQuantity = (productId, newQty) => {
    if (!isLoaded || !storageKey) return;
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Remove single product completely
  const removeFromCart = (productId) => {
    if (!isLoaded || !storageKey) return;
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    if (!isLoaded || !storageKey) return;
    setCartItems([]);
  };

  // Computed values
  const visibleCartItems = isLoaded && storageKey ? cartItems : [];
  const cartCount = visibleCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = visibleCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeDeliveryThreshold = 199;
  const standardDeliveryFee = 30;
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= freeDeliveryThreshold ? 0 : standardDeliveryFee;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems: visibleCartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        freeDeliveryThreshold,
        deliveryFee,
        total,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
