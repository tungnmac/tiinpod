import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  templateId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  designData?: any;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i: CartItem) => i.id === item.id);
        if (existingItem) {
          set({
            items: currentItems.map((i: CartItem) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (id: string) =>
        set({ items: get().items.filter((i: CartItem) => i.id !== id) }),
      updateQuantity: (id: string, quantity: number) =>
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
