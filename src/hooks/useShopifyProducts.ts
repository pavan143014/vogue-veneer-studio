import { useQuery } from '@tanstack/react-query';
import { fetchShopifyProducts, fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';

export function useShopifyProducts(first: number = 20, searchQuery?: string) {
  return useQuery({
    queryKey: ['shopify-products', first, searchQuery],
    queryFn: () => fetchShopifyProducts(first, searchQuery),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useShopifyProduct(handle: string) {
  return useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });
}

export type { ShopifyProduct };
