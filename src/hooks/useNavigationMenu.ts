import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  children?: NavMenuItem[];
}

export interface NavigationMenu {
  id: string;
  name: string;
  slug: string;
  items: NavMenuItem[];
  is_active: boolean;
}

export function useNavigationMenu(slug: 'header' | 'footer') {
  const [menu, setMenu] = useState<NavigationMenu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('navigation_menus')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        setMenu({
          id: data.id,
          name: data.name,
          slug: data.slug,
          items: (data.items as unknown) as NavMenuItem[],
          is_active: data.is_active ?? true,
        });
      }
      setLoading(false);
    };

    fetchMenu();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`nav-menu-${slug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'navigation_menus',
          filter: `slug=eq.${slug}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'items' in payload.new) {
            const newData = payload.new as any;
            setMenu({
              id: newData.id,
              name: newData.name,
              slug: newData.slug,
              items: (newData.items as unknown) as NavMenuItem[],
              is_active: newData.is_active ?? true,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug]);

  return { menu, loading };
}
