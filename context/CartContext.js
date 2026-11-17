'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'farmfresh_marketplace_cart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cartItems, isLoaded]);

  // Add product to cart
  const addToCart = (product, qty = 1) => {
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
          emoji: product.emoji,
          quantity: qty,
        },
      ];
    });
  };

  // Increase quantity by 1
  const increaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity by 1 (removes if reaches 0)
  const decreaseQuantity = (productId) => {
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
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Computed values
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 20 ? 0 : 2.5;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
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
