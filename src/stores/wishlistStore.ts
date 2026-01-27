import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct } from '@/stores/cartStore';

interface WishlistStore {
  items: ShopifyProduct[];
  addItem: (product: ShopifyProduct) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: ShopifyProduct) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        if (!items.find(item => item.node.id === product.node.id)) {
          set({ items: [...items, product] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.node.id !== productId) });
      },

      toggleItem: (product) => {
        const { items, addItem, removeItem } = get();
        const isInList = items.some(item => item.node.id === product.node.id);
        if (isInList) {
          removeItem(product.node.id);
          return false;
        } else {
          addItem(product);
          return true;
        }
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.node.id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
