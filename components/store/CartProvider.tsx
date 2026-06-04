"use client";

import * as React from "react";
import {
  cartStorageKey,
  getCartTotal,
  productToCartItem,
  type CartItem
} from "@/lib/cart";
import type { ProductWithCategory } from "@/types/database";

interface CartContextValue {
  items: CartItem[];
  total: number;
  count: number;
  addItem: (product: ProductWithCategory, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(cartStorageKey);
      if (stored) {
        setItems(JSON.parse(stored) as CartItem[]);
      }
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, []);

  React.useEffect(() => {
    if (ready) {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
    }
  }, [items, ready]);

  const addItem = React.useCallback(
    (product: ProductWithCategory, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);

        if (existing) {
          return current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [...current, productToCartItem(product, quantity)];
      });
    },
    []
  );

  const updateQuantity = React.useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, Math.round(quantity)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = React.useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  }, []);

  const clearCart = React.useCallback(() => setItems([]), []);

  const value = React.useMemo(
    () => ({
      items,
      total: getCartTotal(items),
      count: items.reduce((count, item) => count + item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart
    }),
    [addItem, clearCart, items, removeItem, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
