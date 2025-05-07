import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // unique key: productName-size
  name: string;
  size: string;
  price: number;
  qty: number;
  image: string;
  color: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>, qty: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const cartStoreCreator: StateCreator<CartState> = (set) => ({
  items: [],
  addToCart: (item: Omit<CartItem, 'qty'>, qty: number) => {
    set((state) => {
      const idx = state.items.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        // Update qty
        const updated = [...state.items];
        updated[idx].qty += qty;
        return { items: updated } as Partial<CartState>;
      }
      return { items: [...state.items, { ...item, qty }] } as Partial<CartState>;
    });
  },
  removeFromCart: (id: string) => set((state) => ({ items: state.items.filter((i) => i.id !== id) } as Partial<CartState>)),
  updateQty: (id: string, qty: number) => set((state) => ({ items: state.items.map((i) => i.id === id ? { ...i, qty } : i) } as Partial<CartState>)),
  clearCart: () => set({ items: [] }),
});

export const useCartStore = create<CartState>()(
  persist(cartStoreCreator, { name: 'gennessence-cart' })
); 