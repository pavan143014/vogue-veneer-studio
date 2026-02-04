import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HeroContent {
  badge: string;
  title_line1: string;
  title_line2: string;
  description: string;
  cta_primary: string;
  cta_secondary: string;
  starting_price: string;
  discount_text: string;
  stats: { value: string; label: string }[];
  image_url: string;
}

export interface BrandStoryContent {
  badge: string;
  title_line1: string;
  title_line2: string;
  paragraph1: string;
  paragraph2: string;
  years_of_excellence: string;
  stats: { value: string; label: string }[];
  image_url: string;
}

export interface PromoFlashContent {
  text: string;
  is_active: boolean;
}

export interface PromoSecondaryContent {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
}

export interface PromoPrimaryContent {
  badge: string;
  title_line1: string;
  title_line2: string;
  description: string;
  cta_primary: string;
  cta_secondary: string;
}

export interface StorefrontContent {
  hero?: HeroContent;
  brand_story?: BrandStoryContent;
  promo_flash?: PromoFlashContent;
  promo_secondary?: PromoSecondaryContent;
  promo_primary?: PromoPrimaryContent;
}

export function useStorefrontContent() {
  const [content, setContent] = useState<StorefrontContent>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('section_key, content')
      .eq('is_active', true);

    if (!error && data) {
      const contentMap: StorefrontContent = {};
      data.forEach((item: any) => {
        contentMap[item.section_key as keyof StorefrontContent] = item.content;
      });
      setContent(contentMap);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, refetch: fetchContent };
}

export function useAdminStorefrontContent() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section_key');

    if (!error && data) {
      setSections(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const updateSection = async (sectionKey: string, content: any) => {
    const { error } = await supabase
      .from('site_content')
      .update({ content })
      .eq('section_key', sectionKey);

    if (!error) {
      setSections(prev => 
        prev.map(s => s.section_key === sectionKey ? { ...s, content } : s)
      );
    }
    return { error };
  };

  const toggleSection = async (sectionKey: string, isActive: boolean) => {
    const { error } = await supabase
      .from('site_content')
      .update({ is_active: isActive })
      .eq('section_key', sectionKey);

    if (!error) {
      setSections(prev => 
        prev.map(s => s.section_key === sectionKey ? { ...s, is_active: isActive } : s)
      );
    }
    return { error };
  };

  return { sections, loading, fetchSections, updateSection, toggleSection };
}
