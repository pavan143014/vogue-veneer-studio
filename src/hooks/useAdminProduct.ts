import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminProduct, ProductVariantData } from './useAdminProducts';

export function useAdminProduct(id: string | undefined) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('No product ID provided');
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('admin_products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
        setProduct(null);
      } else if (!data) {
        setError('Product not found');
        setProduct(null);
      } else {
        const parsedProduct: AdminProduct = {
          ...data,
          images: Array.isArray(data.images) 
            ? data.images as string[]
            : typeof data.images === 'string' 
              ? JSON.parse(data.images) 
              : [],
          variants: Array.isArray(data.variants)
            ? (data.variants as unknown as ProductVariantData[])
            : [],
        };
        setProduct(parsedProduct);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
