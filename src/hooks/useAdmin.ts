import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useAdmin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!error) {
      setIsAdmin(data === true);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    // Wait for auth to finish loading first
    if (authLoading) {
      return;
    }
    
    // Only check admin role when user is actually available
    if (user) {
      checkAdminRole();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [user, authLoading, checkAdminRole]);

  return { isAdmin, loading, checkAdminRole };
}

export function useAdminData() {
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [menus, setMenus] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [paymentGateways, setPaymentGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    const [settingsRes, menusRes, productsRes, bannersRes, gatewaysRes] = await Promise.all([
      supabase.from('site_settings').select('*'),
      supabase.from('navigation_menus').select('*'),
      supabase.from('admin_products').select('*').order('created_at', { ascending: false }),
      supabase.from('banners').select('*').order('position'),
      supabase.from('payment_gateways').select('*'),
    ]);

    // Fetch orders via edge function (bypasses RLS)
    const { data: ordersData } = await supabase.functions.invoke('admin-orders');

    if (settingsRes.data) {
      const settings: Record<string, any> = {};
      settingsRes.data.forEach((s: any) => {
        settings[s.key] = s.value;
      });
      setSiteSettings(settings);
    }
    
    if (menusRes.data) setMenus(menusRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    if (ordersData?.orders) setOrders(ordersData.orders);
    if (bannersRes.data) setBanners(bannersRes.data);
    if (gatewaysRes.data) setPaymentGateways(gatewaysRes.data);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateSetting = async (key: string, value: any) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key);
    
    if (!error) {
      setSiteSettings(prev => ({ ...prev, [key]: value }));
    }
    return { error };
  };

  const updateMenu = async (id: string, items: any[]) => {
    const { error } = await supabase
      .from('navigation_menus')
      .update({ items })
      .eq('id', id);
    
    if (!error) {
      setMenus(prev => prev.map(m => m.id === id ? { ...m, items } : m));
    }
    return { error };
  };

  const updatePaymentGateway = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('payment_gateways')
      .update(updates)
      .eq('id', id);
    
    if (!error) {
      setPaymentGateways(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    }
    return { error };
  };

  const createProduct = async (product: any) => {
    const { data, error } = await supabase
      .from('admin_products')
      .insert(product)
      .select()
      .single();
    
    if (!error && data) {
      setProducts(prev => [data, ...prev]);
    }
    return { data, error };
  };

  const updateProduct = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('admin_products')
      .update(updates)
      .eq('id', id);
    
    if (!error) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }
    return { error };
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('admin_products')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    return { error };
  };

  const createBanner = async (banner: any) => {
    const { data, error } = await supabase
      .from('banners')
      .insert(banner)
      .select()
      .single();
    
    if (!error && data) {
      setBanners(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateBanner = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', id);
    
    if (!error) {
      setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    }
    return { error };
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setBanners(prev => prev.filter(b => b.id !== id));
    }
    return { error };
  };

  return {
    siteSettings,
    menus,
    products,
    orders,
    banners,
    paymentGateways,
    loading,
    fetchData,
    updateSetting,
    updateMenu,
    updatePaymentGateway,
    createProduct,
    updateProduct,
    deleteProduct,
    createBanner,
    updateBanner,
    deleteBanner,
  };
}
