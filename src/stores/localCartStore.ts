import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/data/products';

export interface LocalCartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
}

interface LocalCartStore {
  items: LocalCartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  
  addItem: (item: Omit<LocalCartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  removeItem: (productId: string, selectedSize: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useLocalCartStore = create<LocalCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(
          i => i.product.id === item.product.id && i.selectedSize === item.selectedSize
        );
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.product.id === item.product.id && i.selectedSize === item.selectedSize
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
            isCartOpen: true,
          });
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }],
            isCartOpen: true,
          });
        }
      },

      updateQuantity: (productId, selectedSize, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedSize);
          return;
        }
        
        const { items } = get();
        set({
          items: items.map(i =>
            i.product.id === productId && i.selectedSize === selectedSize
              ? { ...i, quantity }
              : i
          ),
        });
      },

      removeItem: (productId, selectedSize) => {
        const { items } = get();
        const newItems = items.filter(
          i => !(i.product.id === productId && i.selectedSize === selectedSize)
        );
        set({ items: newItems });
      },

      clearCart: () => set({ items: [] }),
      
      setCartOpen: (open) => set({ isCartOpen: open }),
      
      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      totalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'local-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
