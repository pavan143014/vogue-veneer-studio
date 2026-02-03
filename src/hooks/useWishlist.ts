import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_handle: string;
  product_title: string;
  product_image: string | null;
  product_price: number;
  currency_code: string;
  created_at: string;
}

export function useWishlist() {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [localWishlist, setLocalWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('guest-wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Fetch wishlist from database when authenticated
  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, fetchWishlist]);

  // Save local wishlist to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guest-wishlist', JSON.stringify(localWishlist));
    }
  }, [localWishlist, isAuthenticated]);

  const addToWishlist = async (product: ShopifyProduct) => {
    const productId = product.node.id;
    
    if (!isAuthenticated) {
      // Store locally for guests
      if (!localWishlist.includes(productId)) {
        setLocalWishlist(prev => [...prev, productId]);
        toast.success('Added to wishlist', {
          description: 'Sign in to save your wishlist permanently',
        });
      }
      return;
    }

    const { error } = await supabase.from('wishlist_items').insert({
      user_id: user!.id,
      product_id: productId,
      product_handle: product.node.handle,
      product_title: product.node.title,
      product_image: product.node.images?.edges?.[0]?.node?.url || null,
      product_price: parseFloat(product.node.priceRange.minVariantPrice.amount),
      currency_code: product.node.priceRange.minVariantPrice.currencyCode,
    });

    if (error) {
      if (error.code === '23505') {
        toast.info('Already in wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    } else {
      await fetchWishlist();
      toast.success('Added to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      setLocalWishlist(prev => prev.filter(id => id !== productId));
      toast.success('Removed from wishlist');
      return;
    }

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user!.id)
      .eq('product_id', productId);

    if (!error) {
      setItems(prev => prev.filter(item => item.product_id !== productId));
      toast.success('Removed from wishlist');
    } else {
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string): boolean => {
    if (isAuthenticated) {
      return items.some(item => item.product_id === productId);
    }
    return localWishlist.includes(productId);
  };

  const toggleWishlist = async (product: ShopifyProduct) => {
    const productId = product.node.id;
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(product);
    }
  };

  return {
    items,
    loading,
    isAuthenticated,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    count: isAuthenticated ? items.length : localWishlist.length,
  };
}
