import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useDynamicFavicon() {
  useEffect(() => {
    const fetchFavicon = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'general')
        .single();

      const faviconUrl = (data?.value as any)?.favicon_url;
      if (faviconUrl) {
        let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = faviconUrl;
      }
    };

    fetchFavicon();
  }, []);
}
