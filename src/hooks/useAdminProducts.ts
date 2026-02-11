import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductVariantData {
  id: string;
  size?: string;
  color?: string;
  price?: number | null;
  stock?: number;
  sku?: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string | null;
  sku: string | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  images: string[] | null;
  tags: string[] | null;
  variants: ProductVariantData[];
  created_at: string;
  updated_at: string;
}

export function useAdminProducts(limit?: number) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('admin_products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      const parsedProducts: AdminProduct[] = (data || []).map(product => ({
        ...product,
        images: Array.isArray(product.images) 
          ? product.images as string[]
          : typeof product.images === 'string' 
            ? JSON.parse(product.images) 
            : [],
        variants: Array.isArray(product.variants)
          ? (product.variants as unknown as ProductVariantData[])
          : [],
      }));
      setProducts(parsedProducts);
    }
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
