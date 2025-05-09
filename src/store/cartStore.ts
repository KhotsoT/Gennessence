import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCart, setCart, clearCart as clearBackendCart } from '../services/cartApi';

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
  version: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (item: Omit<CartItem, 'qty'>, qty: number, token?: string) => void;
  removeFromCart: (id: string, token?: string) => void;
  updateQty: (id: string, qty: number, token?: string) => void;
  clearCart: (token?: string) => void;
  hydrateFromBackend: (token: string, mergeLocal?: boolean) => Promise<void>;
  syncToBackend: (token: string) => Promise<void>;
}

const CART_VERSION = 1;

const cartStoreCreator: StateCreator<CartState> = (set, get) => ({
  items: [],
  version: CART_VERSION,
  isLoading: false,
  error: null,
  addToCart: (item, qty, token) => {
    set((state) => {
      const idx = state.items.findIndex((i) => i.id === item.id);
      let updated;
      if (idx !== -1) {
        updated = [...state.items];
        updated[idx].qty += qty;
      } else {
        updated = [...state.items, { ...item, qty }];
      }
      if (token) setCart(updated, token);
      return { items: updated };
    });
  },
  removeFromCart: (id, token) => set((state) => {
    const updated = state.items.filter((i) => i.id !== id);
    if (token) setCart(updated, token);
    return { items: updated };
  }),
  updateQty: (id, qty, token) => set((state) => {
    const updated = state.items.map((i) => i.id === id ? { ...i, qty } : i);
    if (token) setCart(updated, token);
    return { items: updated };
  }),
  clearCart: (token) => {
    set({ items: [] });
    if (token) clearBackendCart(token);
  },
  hydrateFromBackend: async (token, mergeLocal = true) => {
    set({ isLoading: true, error: null });
    try {
      const backendCart = await getCart(token);
      if (backendCart && backendCart.items) {
        if (mergeLocal && get().items.length > 0) {
          // Merge local and backend items (sum qty for same id)
          const merged = [...backendCart.items];
          get().items.forEach(localItem => {
            const idx = merged.findIndex(i => i.id === localItem.id);
            if (idx !== -1) {
              merged[idx].qty += localItem.qty;
            } else {
              merged.push(localItem);
            }
          });
          set({ items: merged });
          await setCart(merged, token);
        } else {
          // When not merging, directly set backend items
          set({ items: backendCart.items || [] });
        }
      } else {
        // If no backend cart, ensure we have an empty array
        set({ items: [] });
      }
      set({ isLoading: false });
    } catch (e: any) {
      console.error('Cart hydration error:', e);
      set({ isLoading: false, error: e.message || 'Failed to load cart' });
    }
  },
  syncToBackend: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const items = get().items;
      await setCart(items, token);
      set({ isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message || 'Failed to sync cart' });
    }
  },
});

export const useCartStore = create<CartState>()(
  persist(cartStoreCreator, {
    name: 'gennessence-cart',
    storage: createJSONStorage(() => localStorage),
    version: CART_VERSION,
    onRehydrateStorage: () => (state) => {
      if (state && state.version !== CART_VERSION) {
        state.version = CART_VERSION;
      }
    },
    partialize: (state) => ({ items: state.items, version: state.version }),
  })
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'gennessence-cart') {
      useCartStore.setState(JSON.parse(e.newValue || '{}'));
    }
  });
} 