'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, Size } from '@/types/product';

interface CartState {
  items: CartItem[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (p: Product, size: Size, colorName: string) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (p, size, colorName) => {
        const key = `${p.id}-${size}-${colorName}`;
        set((s) => {
          const found = s.items.find((i) => i.key === key);
          const items = found
            ? s.items.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
            : [
                ...s.items,
                {
                  key,
                  productId: p.id,
                  name: p.name,
                  size,
                  colorName,
                  unitPrice: p.price,
                  qty: 1,
                  image: p.image_url,
                },
              ];
          return { items, open: true };
        });
      },
      setQty: (key, qty) =>
        set((s) => ({ items: qty <= 0 ? s.items.filter((i) => i.key !== key) : s.items.map((i) => (i.key === key ? { ...i, qty } : i)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      subtotal: () => get().items.reduce((t, i) => t + i.unitPrice * i.qty, 0),
    }),
    { name: 'caueira-cart', partialize: (s) => ({ items: s.items }) },
  ),
);