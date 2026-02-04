import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  position: number;
  is_active: boolean;
  image_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('position', { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCategories]);

  // Build tree structure from flat list
  const getCategoryTree = useCallback((): CategoryWithChildren[] => {
    const map = new Map<string, CategoryWithChildren>();
    const roots: CategoryWithChildren[] = [];

    // First pass: create all nodes
    categories.forEach(cat => {
      map.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build tree
    categories.forEach(cat => {
      const node = map.get(cat.id)!;
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    // Sort children by position
    const sortChildren = (nodes: CategoryWithChildren[]) => {
      nodes.sort((a, b) => a.position - b.position);
      nodes.forEach(node => sortChildren(node.children));
    };
    sortChildren(roots);

    return roots;
  }, [categories]);

  const createCategory = async (data: { name: string; slug: string; parent_id?: string | null }) => {
    const maxPosition = categories
      .filter(c => c.parent_id === (data.parent_id || null))
      .reduce((max, c) => Math.max(max, c.position), -1);

    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({
        name: data.name,
        slug: data.slug,
        parent_id: data.parent_id || null,
        position: maxPosition + 1,
      })
      .select()
      .single();

    if (!error && newCategory) {
      setCategories(prev => [...prev, newCategory]);
    }
    return { data: newCategory, error };
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }
    return { error };
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (!error) {
      // Remove category and all children
      setCategories(prev => prev.filter(c => c.id !== id && c.parent_id !== id));
    }
    return { error };
  };

  const reorderCategories = async (parentId: string | null, orderedIds: string[]) => {
    const updates = orderedIds.map((id, index) => 
      supabase.from('categories').update({ position: index }).eq('id', id)
    );
    
    await Promise.all(updates);
    
    setCategories(prev => {
      const updated = [...prev];
      orderedIds.forEach((id, index) => {
        const cat = updated.find(c => c.id === id);
        if (cat) cat.position = index;
      });
      return updated;
    });
  };

  return {
    categories,
    categoryTree: getCategoryTree(),
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  };
}
