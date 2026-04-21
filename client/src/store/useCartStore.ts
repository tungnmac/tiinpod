import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number; // Đổi từ string sang number để đồng nhất với Backend
  name: string;
  price: number;
  currency?: string;
  exchangeRate?: number;
  image: string;
  sku?: string;
  quantity: number;
  designData?: any;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItem) => {
        const currentItems = get().items;
        
        // Auto-generate numeric ID if not provided or 0
        let finalItem = { ...item };
        if (!finalItem.id || finalItem.id <= 0) {
          const maxId = currentItems.length > 0 
            ? Math.max(...currentItems.map(i => i.id)) 
            : 0;
          finalItem.id = maxId + 1;
        }

        const existingItem = currentItems.find((i: CartItem) => i.id === finalItem.id);
        if (existingItem) {
          set({
            items: currentItems.map((i: CartItem) =>
              i.id === finalItem.id ? { ...i, quantity: i.quantity + finalItem.quantity } : i
            ),
          });
        } else {
          set({ items: [...currentItems, finalItem] });
        }
      },
      removeItem: (id: number) =>
        set({ items: get().items.filter((i: CartItem) => i.id !== id) }),
      updateQuantity: (id: number, quantity: number) =>
        set({
          items: get().items.map((i: CartItem) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
