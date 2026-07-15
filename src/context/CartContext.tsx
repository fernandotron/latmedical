import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string; // e.g. "30G x 25mm"
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  getItemFreeQty: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('latmedical_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('latmedical_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id && item.selectedVariant === selectedVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity, selectedVariant }];
    });
  };

  const removeFromCart = (productId: string, selectedVariant?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.selectedVariant === selectedVariant)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedVariant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.selectedVariant === selectedVariant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemFreeQty = (item: CartItem): number => {
    if (!item || !item.product) return 0;
    const qty = item.quantity || 0;
    if (item.product.brand === 'Vlift Pro') {
      const tens = Math.floor(qty / 10);
      const remaining = qty % 10;
      const fives = Math.floor(remaining / 5);
      return (tens * 3) + (fives * 1);
    } else if (item.product.id === 'seffi-filler' || item.product.id === 'seffi-hair') {
      return Math.floor(qty / 5);
    }
    return 0;
  };

  const cartCount = cartItems.reduce((total, item) => total + (item?.quantity || 0), 0);
  const cartTotal = cartItems.reduce((total, item) => {
    if (!item || !item.product) return total;
    const price = typeof item.product.price === 'number' ? item.product.price : 0;
    const qty = typeof item.quantity === 'number' ? item.quantity : 0;
    const freeQty = getItemFreeQty(item);
    const paidQty = Math.max(0, qty - freeQty);
    return total + (price * paidQty);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        getItemFreeQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe utilizarse dentro de un CartProvider');
  }
  return context;
};
